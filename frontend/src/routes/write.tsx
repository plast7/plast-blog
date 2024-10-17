import '../styles/style.scss'
import { useEffect } from 'react'
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

    const html = editor.getHTML();

    try {
      const response = await axios.post('/api/posts', { content: html });
      alert('글이 저장되었습니다!');
    } catch (error) {
      console.error('글 저장 실패:', error);
      alert('글 저장에 실패했습니다.');
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-semibold mb-6">글 작성</h1>
      <Toolbar editor={editor} />
      <div className="prose prose-lg">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default WritePage
