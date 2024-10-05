from django.urls import path
from .views import (
    UserLoginView,
    UserLogoutView,
    RefreshTokenView,
    CheckAuthView,
    PostListCreateView,
    PostRetrieveUpdateDestroyView,
    CommentListCreateView,
    CommentRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('auth/refresh-token/', RefreshTokenView.as_view(), name='token_refresh'),
    path('auth/check-auth/', CheckAuthView.as_view(), name='check_auth'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostRetrieveUpdateDestroyView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-detail'),
]
