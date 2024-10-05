from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class User(AbstractUser):
    # AbstractUser already includes fields like username, email, password
    bio = models.TextField(blank=True)
    birthdate = models.DateField(null=True, blank=True)

class Post(BaseModel):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    
    def __str__(self):
        return self.title
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_anonymous = models.BooleanField(default=False)
    anonymous_username = models.CharField(max_length=50, null=True, blank=True)
    anonymous_password_hash = models.CharField(max_length=128, null=True, blank=True)
    
    def set_password(self, raw_password):
        self.anonymous_password_hash = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.anonymous_password_hash)
    
    def __str__(self):
        return f'{"Anonymous " if self.is_anonymous else ""}{"Reply" if self.parent else "Comment"} on {self.post.title}'

    @property
    def is_reply(self):
        return self.parent is not None


    