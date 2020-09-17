
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name="post"),
    path("post/page/<int:page_id>", views.post, name="post"),
    path("post/<int:post_id>", views.get_post, name="get_post"),
    path("post/<int:post_id>/likes", views.likes, name="likes"),
    path("user/<int:user_id>", views.user, name="user"),
    path("user/<int:user_id>/follow", views.follow, name="follow")
]
