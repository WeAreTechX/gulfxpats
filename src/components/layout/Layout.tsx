/**
 * @deprecated This component is deprecated. 
 * Use the layout in app/(app)/layout.tsx for public pages.
 * Admin pages use their own layout in app/admin/layout.tsx.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
