from django.shortcuts import render

import datetime

# Create your views here.

def index(request):
    now = datetime.datetime.now()
    end_of_year = datetime.date(datetime.date.today().year, 12, 31)
    days_to_newyears = end_of_year - now.date()
    return render(request, "newyear/index.html", {
        "newyear": now.month == 1 and now.day == 1,
        "exclamation": "!"*int(days_to_newyears.days)
    })