# Cloudflare Pages 部署指南

## 前置准备

1. 安装 Wrangler CLI（如果还没有）：
```bash
npm install -g wrangler
```

2. 登录 Cloudflare：
```bash
wrangler login
```

## 创建 D2 数据库

1. 创建数据库：
```bash
wrangler d1 create blog-db
```

2. 复制输出的 `database_id`，更新 `wrangler.toml` 文件中的 `database_id` 字段

3. 初始化数据库表结构：
```bash
npm run db:migrate
```

4. 填充示例数据（可选）：
```bash
npm run db:seed
```

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动本地开发服务器（使用 Next.js）：
```bash
npm run dev
```

3. 或者使用 Cloudflare Pages 本地开发（需要先构建）：
```bash
npm run build:cf
npm run dev:cf
```

## 构建和部署

### 方法 1: 使用 Wrangler CLI 部署

1. 构建项目：
```bash
npm run build:cf
```

2. 部署到 Cloudflare Pages：
```bash
npm run deploy
```

### 方法 2: 使用 Cloudflare Dashboard

1. 在 Cloudflare Dashboard 中创建新的 Pages 项目
2. 连接到你的 Git 仓库
3. 设置构建命令：`npm run build:cf`
4. 设置构建输出目录：`.vercel/output/static`
5. 在项目设置中添加 D2 数据库绑定：
   - 绑定名称：`DB`
   - 数据库：选择你创建的 `blog-db` 数据库

## 环境变量配置

在 Cloudflare Dashboard 的 Pages 项目设置中，不需要额外配置环境变量，D2 数据库通过绑定自动注入。

## 数据库管理

### 查看数据库内容
```bash
wrangler d1 execute blog-db --command="SELECT * FROM blog_posts"
```

### 添加新文章（通过 SQL）
```bash
wrangler d1 execute blog-db --command="INSERT INTO blog_posts (slug, title, date, excerpt, content) VALUES ('new-post', '新文章', '2024-01-04', '摘要', '<p>内容</p>')"
```

### 备份数据库
```bash
wrangler d1 export blog-db --output=backup.sql
```

## 注意事项

- 确保 `wrangler.toml` 中的 `database_id` 已正确配置
- 本地开发时，如果没有 D2 数据库，会使用内存中的示例数据
- 生产环境必须配置 D2 数据库才能正常工作
- 首次部署后，记得运行数据库迁移和种子数据

