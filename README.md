# Wesloong Blog

基于 Next.js 和 Material-UI 的个人博客项目，部署在 Cloudflare Pages/Workers 上，使用 D2 数据库存储博客文章。

## 技术栈

- Next.js 14 (App Router)
- React 18
- Material-UI (MUI) 5
- TypeScript
- Cloudflare Pages/Workers
- Cloudflare D2 (SQLite)

## 开始使用

### 本地开发

1. 安装依赖：

```bash
npm install
```

2. 创建 D2 数据库（如果还没有）：

```bash
wrangler d1 create blog-db
```

3. 更新 `wrangler.toml` 文件，填入数据库 ID

4. 初始化数据库：

```bash
npm run db:migrate
npm run db:seed
```

5. 运行开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 部署到 Cloudflare Pages

1. 构建项目：

```bash
npm run build:cf
```

2. 部署：

```bash
npm run deploy
```

或者使用 Cloudflare Dashboard 进行部署。

## 数据库管理

### 创建数据库

```bash
wrangler d1 create blog-db
```

### 运行迁移

```bash
npm run db:migrate
```

### 填充示例数据

```bash
npm run db:seed
```

### 查看数据库

```bash
wrangler d1 execute blog-db --command="SELECT * FROM blog_posts"
```

## 项目结构

```
.
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数和数据库操作
│   └── types/            # TypeScript 类型定义
├── schema.sql            # 数据库表结构
├── seed.sql              # 示例数据
├── wrangler.toml         # Cloudflare Workers 配置
└── next.config.js        # Next.js 配置
```

## 环境变量

在 Cloudflare Dashboard 中配置以下环境变量：
- 数据库绑定通过 `wrangler.toml` 中的 `d1_databases` 配置

## 管理后台

项目包含完整的管理后台系统，访问 `/admin` 路径进入管理界面。

### 功能特性

- **管理员登录** - 安全的身份认证系统
- **仪表板** - 查看站点统计数据（文章数、栏目数、标签数等）
- **栏目管理** - 创建、编辑、删除栏目
- **标签管理** - 创建、编辑、删除标签
- **文章管理** - 完整的文章 CRUD 功能，支持 Markdown 编辑

### 初始化管理员账号

1. 生成管理员 SQL：

```bash
npm run db:init-admin [用户名] [密码]
```

2. 执行生成的 SQL 来创建管理员：

```bash
wrangler d1 execute blog-db --command="<生成的 SQL>"
```

**本地开发默认账号**：
- 用户名: `admin`
- 密码: `admin123`

> ⚠️ **安全提示**：在生产环境中，请立即修改默认密码！

### 管理后台页面

- `/admin/login` - 登录页面
- `/admin` - 仪表板
- `/admin/posts` - 文章管理
- `/admin/categories` - 栏目管理
- `/admin/tags` - 标签管理

## 注意事项

- 本地开发时，如果没有 D2 数据库，会使用内存中的示例数据
- 部署到 Cloudflare 前，确保已创建 D2 数据库并更新 `wrangler.toml`
- 使用 `npm run build:cf` 构建时，会生成适配 Cloudflare Pages 的输出
- 管理后台使用 session 存储，生产环境建议使用更安全的认证方式（如 JWT + KV）
