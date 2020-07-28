from django.urls import path

import random

from . import views, util

app_name = 'wiki'

urlpatterns = [
    path("", views.index, name="index"),
    path("new", views.new, name="new"),
    path("wiki/<str:entry>", views.entry, name="entry"),
    path("wiki/<str:entry>/edit", views.edit, name="edit"),
    path("random", views.random_page, name="random")
]
