export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-sm text-white/80 sm:px-10 lg:px-12">
      <span className="font-semibold text-white">Next.js AWS App</span>
      <nav className="flex gap-4">
        <a href="/" className="hover:text-white">
          Home
        </a>
        <a href="/dashboard" className="hover:text-white">
          Dashboard
        </a>
        <a href="/about" className="hover:text-white">
          About
        </a>
      </nav>
    </header>
  );
}
