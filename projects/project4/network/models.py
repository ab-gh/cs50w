from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    User model inherits AbstractUser
    """
    def __str__(self):
        return f"{self.username}"

class Post(models.Model):
    """
    A tweet
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=280)

    def serialize(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
            "content": self.content,
            "user": self.user.username
        }


    def __str__(self):
        return f"post by {self.user} on {self.timestamp}"

class Like(models.Model):
    """
    A user liking a tweet, two-way forigen link
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_by")

    def __str__(self):
        return f"{self.user} likes {self.post}"