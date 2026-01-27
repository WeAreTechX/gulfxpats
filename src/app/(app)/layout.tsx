import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import {AuthProvider} from "@/contexts/AuthContext";
interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <TopNav />
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
