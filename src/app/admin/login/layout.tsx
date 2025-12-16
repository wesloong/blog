// 登录页面不需要认证
// 这个 layout 会覆盖父级的 layout，所以不会执行认证检查
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
