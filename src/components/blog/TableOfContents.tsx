'use client'

import { Box, Typography, List, ListItem, ListItemButton } from '@mui/material'
import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 为页面中的标题添加 ID
    const contentElement = document.getElementById('blog-content')
    if (!contentElement) {
      return
    }

    const headingElements = contentElement.querySelectorAll('h2, h3, h4')
    
    const extractedHeadings: Heading[] = []
    headingElements.forEach((heading) => {
      const text = heading.textContent || ''
      const level = parseInt(heading.tagName.charAt(1))
      let id = heading.id
      
      // 如果没有ID，生成一个
      if (!id) {
        id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        // 确保ID唯一
        let counter = 1
        let uniqueId = id
        while (document.getElementById(uniqueId)) {
          uniqueId = `${id}-${counter}`
          counter++
        }
        id = uniqueId
        heading.id = id
      }
      
      extractedHeadings.push({ id, text, level })
    })

    setHeadings(extractedHeadings)

    // 监听滚动，高亮当前标题
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (let i = extractedHeadings.length - 1; i >= 0; i--) {
        const element = document.getElementById(extractedHeadings[i].id)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(extractedHeadings[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [content])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80 // 导航栏高度
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveId(id)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 100,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        pr: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        目录
      </Typography>
      <List dense>
        {headings.map((heading) => (
          <ListItem
            key={heading.id}
            disablePadding
            sx={{
              pl: (heading.level - 2) * 2,
              mb: 0.5,
            }}
          >
            <ListItemButton
              onClick={() => handleClick(heading.id)}
              selected={activeId === heading.id}
              sx={{
                py: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: heading.level === 2 ? '0.875rem' : '0.75rem',
                  fontWeight: heading.level === 2 ? 600 : 400,
                }}
              >
                {heading.text}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

