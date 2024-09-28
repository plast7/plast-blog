from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserLoginSerializer, PostSerializer, CommentSerializer
from .models import Post, Comment
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

# 사용자 로그인 뷰
class UserLoginView(APIView):
    """
    POST /api/users/login
    관리자 계정만 로그인할 수 있습니다.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 게시글 목록 조회 및 생성 뷰
class PostListCreateView(generics.ListCreateAPIView):
    """
    GET /api/posts
    POST /api/posts
    """
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# 특정 게시글 조회, 수정, 삭제 뷰
class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/posts/{id}
    PUT /api/posts/{id}
    DELETE /api/posts/{id}
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# 댓글 목록 조회 및 생성 뷰
class CommentListCreateView(generics.ListCreateAPIView):
    """
    GET /api/posts/{id}/comments
    POST /api/posts/{id}/comments
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

# 특정 댓글 수정 및 삭제 뷰
class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    PUT /api/comments/{id}
    DELETE /api/comments/{id}
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
