from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils.safestring import mark_safe

from . import util

import markdown2

class NewEntry(forms.Form):
    title = forms.CharField(label="Page Title")
    content = forms.CharField(widget=forms.Textarea, label="Page Content")

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