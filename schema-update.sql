-- 添加点赞数字段（如果不存在）
ALTER TABLE blog_posts ADD COLUMN like_count INTEGER DEFAULT 0;

-- 添加作者字段（如果不存在，可以存储作者名称或管理员ID）
-- 如果需要关联管理员表，可以使用 author_id INTEGER REFERENCES admins(id)
-- 这里先使用简单的文本字段
ALTER TABLE blog_posts ADD COLUMN author TEXT;

