// 初始化管理员账号脚本
// 使用方法: node scripts/init-admin.js <username> <password>

const bcrypt = require('bcryptjs')

const username = process.argv[2] || 'admin'
const password = process.argv[3] || 'admin123'

bcrypt.hash(password, 10).then((hash) => {
  console.log('-- 管理员初始化 SQL')
  console.log(`-- 用户名: ${username}`)
  console.log(`-- 密码: ${password}`)
  console.log('')
  console.log(`INSERT OR REPLACE INTO admins (username, password_hash) VALUES (`)
  console.log(`  '${username}',`)
  console.log(`  '${hash}'`)
  console.log(`);`)
  console.log('')
  console.log('-- 执行此 SQL 来创建管理员账号')
  console.log('-- 命令: wrangler d1 execute blog-db --command="<上面的 SQL>"')
})

