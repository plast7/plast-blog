import React from 'react'
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  StrikethroughIcon, 
  CodeBracketIcon,
  ListBulletIcon,
  LinkIcon, 
  PhotoIcon 
} from '@heroicons/react/24/outline'

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const isActive = (name, options) => editor.isActive(name, options)

  return (
    <div className="flex space-x-2 mb-4">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="Bold"
      >
        <BoldIcon className="h-5 w-5" />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="Italic"
      >
        <ItalicIcon className="h-5 w-5" />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${isActive('underline') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="Underline"
      >
        <UnderlineIcon className="h-5 w-5" />
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${isActive('strike') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="Strikethrough"
      >
        <StrikethroughIcon className="h-5 w-5" />
      </button>

      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded ${isActive('code') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="CodeBracket"
      >
        <CodeBracketIcon className="h-5 w-5" />
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="Bullet List"
      >
        <ListBulletIcon className="h-5 w-5" />
      </button>

      {/* Link */}
      <button
        onClick={() => {
          const url = prompt('Enter the URL')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        className={`p-2 rounded ${isActive('link') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-label="Link"
      >
        <LinkIcon className="h-5 w-5" />
      </button>

      {/* Image */}
      <button
        onClick={() => {
          const url = prompt('Enter the image URL')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        className={`p-2 rounded bg-gray-200`}
        aria-label="Photo"
      >
        <PhotoIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Toolbar
