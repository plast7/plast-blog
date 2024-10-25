import React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import DOMPurify from 'dompurify';

import Header from '../../components/Header'
import { getPostDetail } from '../../api/post';

export const Route = createFileRoute('/post/$postId')({
  component: PostPage,
})

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string; // TODO: 나중에 추가할 필드
}

const fetchPost = async (postId: string): Promise<Post | null> => {
  console.log('hi');
  try {
    const response = await getPostDetail({ postId });
    return {
      id: response.id,
      title: response.title,
      author: response.author,
      category: response.category,
      content: response.content,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      thumbnailUrl: response.thumbnailUrl || '', // TODO: 처리 필요
    };
  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생:', error);
    return null;
  }
}

function PostPage() {
  const { postId } = Route.useParams();
  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadPost = async () => {
      if (postId) {
        setLoading(true);
        setError(null);
        const fetchedPost = await fetchPost(postId);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('게시글을 불러오는 데 실패했습니다.');
        }
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plast-main">
        <p className="text-lg text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plast-main">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plast-main">
        <p className="text-lg text-gray-600">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plast-main">
      <Header />
      <main className="pt-40 px-4 max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          {/* {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded"
            />
          ) : (
            <img
              src="/default-thumbnail.jpg"
              alt="default thumbnail"
              className="w-full h-64 object-cover rounded"
            />
          )} */}
          <h1 className="text-4xl font-bold text-plast-red mt-6">{post.title}</h1>
          <p className="text-gray-700 mt-2">
            {post.author} | 작성날자 : {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-8 prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </div>
      </main>
    </div>
  );
}

export default PostPage;