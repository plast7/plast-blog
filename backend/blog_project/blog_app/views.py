from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics, permissions, status, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication


from .serializers import UserLoginSerializer, PostSerializer, CommentSerializer
from .models import Post, Comment


@method_decorator(csrf_exempt, name='dispatch')
class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            response = Response({"message": "로그인 성공"}, status=status.HTTP_200_OK)
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=str(refresh.access_token),
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=str(refresh),
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            )
            return response
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    

class UserLogoutView(APIView):
    def post(self, request):
        response = Response({"message": "로그아웃 성공"}, status=status.HTTP_200_OK)
        response.delete_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        response.delete_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        return response


class RefreshTokenView(APIView):
    """
    POST /api/v1/auth/refresh-token
    """
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                new_access_token = refresh.access_token
                response = Response({"message": "토큰 리프레시 성공"}, status=status.HTTP_200_OK)
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value=str(new_access_token),
                    httponly=True,
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
                )
                return response
            except Exception as e:
                return Response({"error": "리프레시 토큰이 유효하지 않습니다."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"error": "리프레시 토큰이 없습니다."}, status=status.HTTP_400_BAD_REQUEST)


class CheckAuthView(APIView):
    """
    GET /api/v1/auth/check-auth
    """
    def get(self, request):
        user = request.user
        if user.username:
            return Response({"isAuthenticated": True, "username": user.username}, status=status.HTTP_200_OK)
        return Response({"error": "로그인 정보가 없습니다."}, status=status.HTTP_401_UNAUTHORIZED)


class PostListView(generics.ListCreateAPIView):
    """
    GET /api/v1/posts
    POST /api/v1/posts
    """
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    
    filterset_fields = ['category']

    search_fields = ['title', 'content']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/v1/posts/{id}
    PUT /api/v1/posts/{id}
    DELETE /api/v1/posts/{id}
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class CommentListView(generics.ListCreateAPIView):
    """
    GET /api/v1/posts/{id}/comments
    POST /api/v1/posts/{id}/comments
    """
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id, parent=None).order_by('-created_at')
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        parent_id = self.request.data.get('parent')
        parent = None
        if parent_id:
            parent = get_object_or_404(Comment, id=parent_id)
        serializer.save(post=post, parent=parent)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    PUT /api/v1/comments/{id}
    DELETE /api/v1/comments/{id}
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
