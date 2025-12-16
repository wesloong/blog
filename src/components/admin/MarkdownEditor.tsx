'use client'

import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'

// 动态导入 SimpleMDE，避免 SSR 问题
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={{
        spellChecker: false,
        placeholder: '开始编写 Markdown 内容...',
        toolbar: [
          'bold',
          'italic',
          'heading',
          '|',
          'quote',
          'unordered-list',
          'ordered-list',
          '|',
          'link',
          'image',
          '|',
          'preview',
          'side-by-side',
          'fullscreen',
          '|',
          'guide',
        ],
      }}
    />
  )
}

