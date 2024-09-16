import React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import Header from '../../components/header'

export const Route = createFileRoute('/post/$postId')({
  component: CategoryPage,
})

interface Post {
  id: string
  title: string
  subtitle: string
  thumbnailUrl: string
  categoryName: string
}

// 이 함수는 실제 데이터를 가져오는 로직으로 대체해야 합니다
const fetchPostsByCategory = async (categoryName: string): Promise<Post[]> => {
  // 실제 API 호출 또는 데이터 fetching 로직
  return []
}

function CategoryPage() {
  const { categoryName } = Route.useParams()
  const [posts, setPosts] = React.useState<Post[]>([])

  React.useEffect(() => {
    const loadPosts = async () => {
      if (categoryName) {
        const fetchedPosts = await fetchPostsByCategory(categoryName)
        setPosts(fetchedPosts)
      }
    }
    loadPosts()
  }, [categoryName])

  return (
    <div className="min-h-screen category-page bg-plast-main">
      <Header />
      <h1>{categoryName} 카테고리의 글 목록</h1>
      <div className="post-grid">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/category/${post.categoryName}/${post.id}`}
            className="post-card"
          >
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="post-thumbnail"
            />
            <h2>{post.title}</h2>
            <p>{post.subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
