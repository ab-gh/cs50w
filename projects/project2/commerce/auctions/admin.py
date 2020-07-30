from django.contrib import admin

from .models import *

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "sold", "starting_bid", "created_date", "category")

admin.site.register(User)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Category, CategoryAdmin)