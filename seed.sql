-- 插入示例博客文章
INSERT OR REPLACE INTO blog_posts (slug, title, date, excerpt, content) VALUES
(
  'welcome-to-my-blog',
  '欢迎来到我的博客',
  '2024-01-01',
  '这是我的第一篇博客文章，介绍这个博客的创建初衷和未来计划。',
  '<h2>欢迎</h2><p>欢迎来到我的个人博客！这个博客是我用来分享技术、生活和思考的地方。</p><h2>关于我</h2><p>我是一名开发者，热爱编程和技术探索。在这里，我会分享：</p><ul><li>技术文章和教程</li><li>项目经验分享</li><li>生活感悟</li><li>读书笔记</li></ul><h2>未来计划</h2><p>我会定期更新博客内容，希望能与大家分享更多有价值的内容。如果你有任何建议或想法，欢迎与我联系！</p>'
),
(
  'nextjs-mui-setup',
  '使用 Next.js 和 MUI 搭建博客',
  '2024-01-02',
  '介绍如何使用 Next.js 14 和 Material-UI 5 搭建一个现代化的博客系统。',
  '<h2>技术选型</h2><p>这个博客使用了以下技术栈：</p><ul><li><strong>Next.js 14</strong> - React 框架，支持 App Router</li><li><strong>Material-UI 5</strong> - 现代化的 UI 组件库</li><li><strong>TypeScript</strong> - 类型安全的 JavaScript</li></ul><h2>项目结构</h2><p>项目采用了 Next.js 的 App Router 结构，主要目录包括：</p><ul><li><code>src/app</code> - 页面和路由</li><li><code>src/components</code> - 可复用组件</li><li><code>src/lib</code> - 工具函数和数据</li></ul><h2>主题配置</h2><p>使用 MUI 的 ThemeProvider 来统一管理主题样式，可以轻松切换明暗主题。</p>'
),
(
  'typescript-tips',
  'TypeScript 实用技巧',
  '2024-01-03',
  '分享一些在日常开发中非常有用的 TypeScript 技巧和最佳实践。',
  '<h2>类型推断</h2><p>TypeScript 的类型推断非常强大，可以自动推断变量类型，减少不必要的类型注解。</p><h2>泛型的使用</h2><p>泛型让我们可以创建可重用的组件和函数，同时保持类型安全。</p><h2>工具类型</h2><p>TypeScript 提供了许多内置的工具类型，如 <code>Partial</code>、<code>Pick</code>、<code>Omit</code> 等，可以大大简化类型定义。</p>'
);

