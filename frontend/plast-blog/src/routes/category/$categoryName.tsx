import React from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import Header from '../../components/header';
import AnimatedWaveDriver from '../../components/animatedWaveDivider';
import { english2korean } from '../../utils/translator';

export const Route = createFileRoute('/category/$categoryName')({
  component: CategoryPage,
})

interface Post {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  categoryName: string;
}

// 이 함수는 실제 데이터를 가져오는 로직으로 대체해야 합니다
const fetchPostsByCategory = async (categoryName: string): Promise<Post[]> => {
  // 실제 API 호출 또는 데이터 fetching 로직
  return [];
};

function CategoryPage() {
  const { categoryName } = Route.useParams();
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    const loadPosts = async () => {
      if (categoryName) {
        const fetchedPosts = await fetchPostsByCategory(categoryName);
        setPosts(fetchedPosts);
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
          <img src="/static/line.svg" alt="line" />
        </div>
        <p className="text-center text-lg text-gray-600">
          현재 작성된 글이 없습니다.
        </p>
      </main>
    </div>
  );
};
