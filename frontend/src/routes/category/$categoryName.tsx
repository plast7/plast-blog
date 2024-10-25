import React from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';

import Header from '../../components/Header';
import AnimatedWaveDriver from '../../components/AnimatedWaveDivider';
import { english2korean } from '../../utils/translator';
import { getPostList } from '../../api/post';

export const Route = createFileRoute('/category/$categoryName')({
  component: CategoryPage,
});

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


const fetchPostsByCategory = async (categoryName: string): Promise<Post[]> => {
  try {
    const response = await getPostList({ category: categoryName });
    
    if (Array.isArray(response)) {
      return response.map(post => ({
        id: post.id,
        title: post.title,
        author: post.author,
        category: post.category,
        content: post.content,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        thumbnailUrl: post.thumbnailUrl || '', // TODO: 처리 필요
      }));
    }
  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생:', error);
    return [];
  }
};

function CategoryPage() {
  const { categoryName } = Route.useParams();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadPosts = async () => {
      if (categoryName) {
        setLoading(true);
        setError(null);
        const fetchedPosts = await fetchPostsByCategory(categoryName);
        if (fetchedPosts.length > 0) {
          const sortedPosts = fetchedPosts.sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt)
          );
          setPosts(sortedPosts);
        } else {
          setPosts([]);
        }
        setLoading(false);
      }
    };
    loadPosts();
  }, [categoryName]);

  const translatedCategoryName = english2korean(categoryName);

  return (
    <div className="min-h-screen category-page bg-plast-main">
      <AnimatedWaveDriver />
      <Header />
      <main className="pt-40 px-4 max-w-4xl mx-auto">
        <h1 className="text-[36px] font-bold text-center text-plast-red mb-4">
          {translatedCategoryName} 카테고리의 글 목록
        </h1>
        <div className="flex pt-8 justify-center mb-8">
          <img src="/line.svg" alt="line" />
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-600">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-600">
            게시글을 불러오는 중 오류가 발생했습니다.
          </p>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded shadow">
                <Link to={`/post/${post.id}`} className="block">
                  {
                    /* <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded"
                    /> TODO! */
                  }
                  <h2 className="mt-4 text-2xl font-semibold text-plast-red">
                    {post.title}
                  </h2>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">
            현재 작성된 글이 없습니다.
          </p>
        )}
      </main>
    </div>
  );
}

export default CategoryPage;
