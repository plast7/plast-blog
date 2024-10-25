import '../styles/style.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

import Toolbar from '../components/Toolbar'
import useAuth from '../hooks/useAuth';
import { post } from '../api/post';

export const Route = createFileRoute('/write')({
  component: WritePage,
})

function WritePage() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Highlight,
      Typography,
    ],
    content: '<p>여기에 내용을 작성하세요...</p>',
  })

  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { label: '카테고리를 선택하세요', value: '', },
    { label: '프론트엔드', value: 'frontend', },
    { label: '백엔드', value: 'backend', },
    { label: "자료구조", value: "data-structures" },
    { label: "알고리즘", value: "algorithms" },
    { label: "운영체제", value: "operating-systems" },
    { label: "아키텍처", value: "architecture" },
    { label: "네트워크", value: "network" },
    { label: "데이터베이스", value: "database" },
    { label: "머신러닝", value: "machine-learning" },
    { label: "수리통계", value: "statistics" },
    { label: "회고", value: "review" },
    { label: "커리어", value: "career" },
    { label: "헬스", value: "fitness" },
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login', replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!editor) return

    const handleDrop = async (event) => {
      event.preventDefault()

      const hasFiles = event.dataTransfer.files && event.dataTransfer.files.length > 0
      if (hasFiles) {
        const file = event.dataTransfer.files[0]
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

          const imageUrl = response.data.url

          editor.chain().focus().setImage({ src: imageUrl }).run()
        } catch (error) {
          console.error('이미지 업로드 실패:', error)
        }
      }
    }

    const handlePaste = async (event) => {
      const items = event.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          const formData = new FormData()
          formData.append('file', file)

          try {
            const response = await axios.post('/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })

            const imageUrl = response.data.url

            editor.chain().focus().setImage({ src: imageUrl }).run()
          } catch (error) {
            console.error('이미지 업로드 실패:', error)
          }
        }
      }
    }

    editor.view.dom.addEventListener('drop', handleDrop)
    editor.view.dom.addEventListener('paste', handlePaste)

    return () => {
      editor.view.dom.removeEventListener('drop', handleDrop)
      editor.view.dom.removeEventListener('paste', handlePaste)
    }
  }, [editor])

  const handleSave = async () => {
    if (!editor) return;

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    const html = editor.getHTML();

    try {
      const response = await post({
        title,
        category,
        content: html
      });
      alert('글이 저장되었습니다!');
      navigate({ to: `/`, replace: true });
    } catch (error) {
      console.error('글 저장 실패:', error);
      alert('글 저장에 실패했습니다.');
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <div className="mx-auto p-6 bg-plast-main shadow-md rounded-md">
      <h1 className="text-3xl font-semibold mb-6">글쓰기</h1>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border bg-plast-main rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="글의 제목을 입력하세요"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-gray-700 font-medium mb-2">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border bg-plast-main rounded-md focus:outline-none focus:ring focus:border-blue-300"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <Toolbar editor={editor} />
      <div className="prose prose-lg mb-6">
        <EditorContent editor={editor} />
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          저장
        </button>
      </div>
    </div>
  )
}

export default WritePage
