from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.forms import ModelForm

from .models import *

## Model Forms
class NewListing(ModelForm):
    class Meta:
        model = Listing
        exclude = ('owner', 'sold', 'created_date')

class NewBid(ModelForm):
    class Meta:
        model = Bid
        fields = ('bid',)

## Routes
def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.filter(sold=False)
    })

def listing(request, listing_id):
    listing = Listing.objects.get(id=listing_id)
    return render(request, "auctions/listing.html", {
        "listing": listing,
        "bid_form": NewBid()
    })

def new_listing(request):
    if request.method == "GET":
        return render(request, "auctions/new_listing.html", {
            "form": NewListing()
        })
    if request.method == "POST":
        form = NewListing(request.POST)
        f = form.save(commit=False)
        f.owner = User.objects.get(id=request.user.id)
        f.save()
        return HttpResponseRedirect(reverse("index"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
