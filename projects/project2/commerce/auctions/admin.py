from django.contrib import admin

from .models import *

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "sold", "starting_bid", "created_date", "category", "condition")

class ConditionAdmin(admin.ModelAdmin):
    list_display = ("id", "condition")

class WatchAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "item")

admin.site.register(User)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Condition, ConditionAdmin)
admin.site.register(Bid)
admin.site.register(Watch, WatchAdmin)
