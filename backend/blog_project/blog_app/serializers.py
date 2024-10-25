from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Post, Comment
from django.contrib.auth.hashers import make_password, check_password

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login. Only admin users can log in.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data.get('username'), password=data.get('password'))
        if user and user.is_staff:
            data['user'] = user
            return data
        raise serializers.ValidationError("Invalid credentials or not an admin user.")

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post model.
    """
    author = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'content', 'author', 'created_at', 'updated_at']

class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model, including nested replies.
    """
    replies = serializers.SerializerMethodField(read_only=True)
    author = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'parent', 'content',
            'created_at', 'updated_at', 'is_anonymous',
            'anonymous_username', 'replies'
        ]
        read_only_fields = ['post', 'created_at', 'updated_at', 'replies']
    
    def get_replies(self, obj):
        """
        Recursively get replies for a comment.
        """
        if obj.is_reply:
            return []
        replies = obj.replies.all().order_by('created_at')
        return CommentSerializer(replies, many=True).data
    
    def get_author(self, obj):
        """
        Return the author's username or anonymous username.
        """
        if obj.is_anonymous:
            return obj.anonymous_username
        return obj.post.author.username

    def create(self, validated_data):
        """
        Override create to handle anonymous comments' password hashing.
        """
        is_anonymous = validated_data.get('is_anonymous', False)
        if is_anonymous:
            raw_password = self.context['request'].data.get('anonymous_password')
            if raw_password:
                validated_data['anonymous_password_hash'] = make_password(raw_password)
            else:
                raise serializers.ValidationError("Anonymous password is required.")
        return super().create(validated_data)
    
    def validate(self, data):
        """
        Ensure that anonymous_username and anonymous_password are provided if is_anonymous is True.
        """
        is_anonymous = data.get('is_anonymous', False)
        if is_anonymous:
            if not data.get('anonymous_username'):
                raise serializers.ValidationError("Anonymous username is required for anonymous comments.")
        return data
