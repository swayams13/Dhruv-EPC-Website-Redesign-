// Group holding page — steel-only, no accent (§5)
// data-company="group" scopes CSS variables to neutral steel values

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return <div data-company="group">{children}</div>
}
