from django.contrib import admin

from .models import *

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

admin.site.register(User)
admin.site.register(Listing)
admin.site.register(Category, CategoryAdmin)