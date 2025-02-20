import './globals.css';

export const metadata = {
  title: 'Interactive Quiz Platform',
  description: 'A modern quiz application built with Next.js 15',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-blue-600">Quiz Platform</h1>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="bg-white border-t mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Interactive Quiz Platform
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}