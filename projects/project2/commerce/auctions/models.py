from django.contrib.auth.models import AbstractUser
from django.db import models

## Upload path
def user_directory_path(instance, filename):
    """
    Unused
    """
    pass


class User(AbstractUser):
    """
    Builtin User model
    """
    def __str__(self):
        return f"{self.username}"


class Condition(models.Model):
    """
    A listing's condition
    """
    condition = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.condition}"


class Category(models.Model):
    """
    A listing's category
    """
    name = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.name}"


class Listing(models.Model):
    """
    An item listing for sale
    """
    title = models.CharField(max_length=64)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    sold = models.BooleanField(default=False)
    starting_bid = models.FloatField()
    created_date = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, 
                                 related_name="listings", null=True, default=5)
    condition = models.ForeignKey(Condition, on_delete=models.PROTECT, 
                                  related_name="listings", null=True)
    image = models.URLField(max_length=250, blank=True,
                            default="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png")

    def __str__(self):
        return f"{self.title} (Item {self.id})"


class Bid(models.Model):
    """
    A bid placed on an item
    """
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    item = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")
    created_date = models.DateTimeField(auto_now=True)
    bid = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f"{self.bid} for {self.item} by {self.bidder}"


class Comment(models.Model):
    """
    A comment placed on an item
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    item = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    created_date = models.DateTimeField(auto_now=True)
    comment = models.TextField()

    def __str__(self):
        return f"Comment on {self.item} by {self.user}"


class Watch(models.Model):
    """
    TODO: A watchlist placed on an item by a user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist")
    item = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="watchers")

    def __str__(self):
        return f"{self.user} watching {self.item} ({self.id})"