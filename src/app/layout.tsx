import { Inter, Outfit } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Cath Lab Management System',
  description: 'Specialized clinical management system for Cath Lab teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
