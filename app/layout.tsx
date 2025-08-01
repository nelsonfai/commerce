// app/layout.tsx
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className="bg-white text-black font-sans dark:bg-neutral-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}



