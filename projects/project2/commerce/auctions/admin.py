from django.contrib import admin

from .models import *

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username")

class ConditionAdmin(admin.ModelAdmin):
    list_display = ("id", "condition")

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "sold", "starting_bid", "created_date", "category", "condition")

class BidAdmin(admin.ModelAdmin):
    list_display = ("id", "bid", "bidder", "item", "created_date")

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "item", "created_date")

class WatchAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "item")

admin.site.register(User, UserAdmin)
admin.site.register(Condition, ConditionAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Bid, BidAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Watch, WatchAdmin)

