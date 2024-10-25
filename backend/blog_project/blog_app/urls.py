from django.urls import path
from .views import (
    UserLoginView,
    UserLogoutView,
    RefreshTokenView,
    CheckAuthView,
    PostListView,
    PostDetailView,
    CommentListView,
    CommentDetailView,
)

urlpatterns = [
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('auth/refresh-token/', RefreshTokenView.as_view(), name='token_refresh'),
    path('auth/check-auth/', CheckAuthView.as_view(), name='check_auth'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comments/', CommentListView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
