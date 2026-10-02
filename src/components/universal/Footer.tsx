import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-20 backdrop-blur-lg bg-white/5 border-t border-white py-8 px-4 footer-alive">
      <div className="max-w-6xl mx-auto text-center text-slate-300">
        <p className="font-dosis font-bold text-lg mb-2 footer-heartbeat">Made with ❤️</p>
        <p className="font-dosis font-bold mb-4">LCS Engineering Team</p>
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/hack-to-the-future" className="hover:text-white transition-colors">Hack to the Future</Link>
        </nav>
        <p className="text-sm">Copyright © 2026 | Laurier Computing Society. All rights reserved.</p>
      </div>
    </footer>
  );
}
