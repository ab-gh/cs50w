import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator

from .models import User, Post, Like, Follow


def index(request):
    return render(request, "network/index.html")


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
def new_post(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if data.get("content") == "":
                return JsonResponse({
                    "error": "Post must contain at least one character."
                }, status=400)
            post = Post(
                user=request.user,
                content=data.get("content")
            )
            post.save()
            return JsonResponse({"message": "Post sent successfully."}, status=201)
        else:
            return JsonResponse({
                    "error": "You must be logged in to send a Post."
                }, status=400)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

@csrf_exempt
def post(request, page_id):
    if request.method == "GET":
        print("get ", page_id)
        posts = Post.objects.all()
        posts_dict = [post.serialize() for post in posts]
        if request.user.is_authenticated:
            for post in posts_dict:
                post['liked'] = True if request.user.likes.filter(post=Post.objects.get(id=post['id'])).exists() else False
        posts_page = Paginator(posts_dict, 10)
        print(posts_page.page(page_id).object_list)
        return JsonResponse({
            "posts": posts_page.page(page_id).object_list,
            "has_next": posts_page.page(page_id).has_next(),
            "has_prev": posts_page.page(page_id).has_previous()
        }, safe=False)
    else:
        return JsonResponse({"error": "GET request required."}, status=400)

@csrf_exempt
def feed(request, page_id):
    if request.method == "GET" and request.user.is_authenticated:
        try:
            follow_objects = request.user.following.all()
        except:
            print("failed")
        follow_id = [i.following.id for i in follow_objects]
        print(follow_id)
        posts = Post.objects.filter(user_id__in=follow_id)
        posts_dict = [post.serialize() for post in posts]
        if request.user.is_authenticated:
            for post in posts_dict:
                post['liked'] = True if request.user.likes.filter(post=Post.objects.get(id=post['id'])).exists() else False
        posts_page = Paginator(posts_dict, 10)
        print(posts_page.page(page_id).object_list)
        return JsonResponse({
            "posts": posts_page.page(page_id).object_list,
            "has_next": posts_page.page(page_id).has_next(),
            "has_prev": posts_page.page(page_id).has_previous()
        }, safe=False)
    else:
        return JsonResponse({"error": "You must be signed in to view your feed"}, status=401)    


@csrf_exempt
def get_post(request, post_id):
    if request.method == "GET":
        try:
            post = Post.objects.get(user=request.user, pk=post_id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        post_dict = post.serialize()
        post_dict['liked'] = True if request.user.likes.filter(post=post).exists() else False
        return JsonResponse(post_dict)
    elif request.method == "PATCH":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            try:
                post = Post.objects.get(user=request.user, pk=post_id)
            except Post.DoesNotExist:
                return JsonResponse({"error": "Post not found."}, status=404)
            else:
                post.content=data.get("content")
                post.save()
                return JsonResponse({"message": "Post edited successfully."}, status=201)
        else:
            return JsonResponse({"error": "You must be signed in to edit a post."}, status=401)         

@csrf_exempt
def user(request, user_id, page_id):
    if request.method == "GET":
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist."}, status=404)
        else:
            posts_dict = [post.serialize() for post in user.posts.all()]
            if request.user.is_authenticated:
                for post in posts_dict:
                    post['liked'] = True if request.user.likes.filter(post=Post.objects.get(id=post['id'])).exists() else False
            posts_page = Paginator(posts_dict, 10)
            print(posts_page.page(page_id).object_list)
            return JsonResponse({
                "username": user.username,
                "user_id": user.id,
                "followers_count": user.followers.count(),
                "following_count": user.following.count(),
                "following": user.followers.filter(user=request.user).exists(),
                "posts": posts_page.page(page_id).object_list,
                "has_next": posts_page.page(page_id).has_next(),
                "has_prev": posts_page.page(page_id).has_previous()
            }, safe=False)

@csrf_exempt
def follow(request, user_id):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            follow = Follow.objects.get(user=request.user, following=User.objects.get(id=user_id))
        except ObjectDoesNotExist:
            if data.get("follow"):
                follow = Follow(
                    user=request.user,
                    following=User.objects.get(id=user_id)
                )
                follow.save()
                return JsonResponse({'message': 'User followed successfully'}, status=201)
            else:
                return JsonResponse({'message': 'User unfollowed successfully'}, status=201)
        else:
            if data.get('follow'):
                return JsonResponse({'message': 'User followed successfully'}, status=201)
            else:
                follow.delete()
                return JsonResponse({'message': 'User unfollowed successfully'}, status=201)

@csrf_exempt
def likes(request, post_id):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            like = Like.objects.get(user=request.user, post=Post.objects.get(id=post_id))
        except ObjectDoesNotExist:
            if data.get("like"):
                like = Like(
                    user=request.user,
                    post=Post.objects.get(pk=post_id)
                )
                like.save()
                return JsonResponse({'message': 'Post liked successfully.'}, status=201)
            else:
                return JsonResponse({'message': 'Post unliked successfully.'}, status=201)
        else:
            if data.get("like"):
                return JsonResponse({'message': 'Post liked successfully.'}, status=201)
            else:
                like.delete()
                return JsonResponse({'message': 'Post unliked successfully.'}, status=201)
