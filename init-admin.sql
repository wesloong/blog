-- 初始化管理员账号
-- 默认用户名: admin
-- 默认密码: admin123
-- 注意：在生产环境中，请立即修改默认密码！

-- 使用 bcrypt 生成的密码哈希（对应密码: admin123）
-- 可以通过 Node.js 运行: const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(console.log)
INSERT OR REPLACE INTO admins (username, password_hash) VALUES (
  'admin',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
);

-- 注意：上面的哈希值是示例，实际使用时需要生成真实的 bcrypt 哈希
-- 在生产环境中，请使用以下命令生成：
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(console.log)"

