from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils.safestring import mark_safe
from django.urls import reverse

import random

from . import util

import markdown2

class NewEntry(forms.Form):
    title = forms.CharField(label="Page Title")
    content = forms.CharField(widget=forms.Textarea, label="Page Content")

class EditEntry(forms.Form):
    content = forms.CharField(widget=forms.Textarea, label="Page Content")

def random_page(request):
    entry = random.choice(util.list_entries())
    return HttpResponseRedirect(f"wiki/{entry}")

def index(request):
    if request.method == "GET":
        return render(request, "encyclopedia/index.html", {
            "entries": util.list_entries()
        })
    elif request.method == "POST":
        search_string = request.POST['q']
        if util.get_entry(search_string):
            return HttpResponseRedirect(f"/wiki/{search_string}")
        else:
            results = []
            for entry in util.list_entries():
                if search_string.lower() in entry.lower():
                    results.append(entry)
            return render(request, "encyclopedia/results.html", {
                "results": results,
                "search": search_string
            })

def entry(request, entry):
    if util.get_entry(entry):
        return render(request, "encyclopedia/entry.html", {
            "content": markdown2.markdown(util.get_entry(entry)),
            "title": entry.capitalize()
        })
    else:
        return render(request, "encyclopedia/error.html", {
            "title": entry.capitalize()
        }, status=404)

def new(request):
    if request.method == "GET":
        return render(request, "encyclopedia/new.html", {
            "form": NewEntry()
        })
    else:
        form = NewEntry(request.POST)
        page_title = request.POST['title']
        md_content = request.POST['content']
        if page_title.lower() in (existing.lower() for existing in util.list_entries()):
            return render(request, "encyclopedia/new.html", {
                "error": "There is already an entry for " + page_title + ".", 
                "form": form
            })
        else:
            f = open(f"entries/{page_title}.md", "a")
            f.write(md_content)
            f.close()
            return HttpResponseRedirect(f"/wiki/{page_title}")
        return HttpResponse(request.POST['title'])

def edit(request, entry):
    if request.method == "GET":
        if entry.lower() in (existing.lower() for existing in util.list_entries()):
            form = EditEntry({"content": util.get_entry(entry)})
            return render(request, "encyclopedia/edit.html", {
                "title": entry,
                "form": form
            })
        else:
            return HttpResponseRedirect(reverse("wiki:new"))
    else:
        if entry.lower() not in (existing.lower() for existing in util.list_entries()):
            return HttpResponseRedirect(reverse("wiki:new"))
        else:
            f = open(f"entries/{entry}.md", "w")
            f.write(request.POST['content'])
            f.close
            return HttpResponseRedirect(f"/wiki/{entry}")
