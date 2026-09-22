import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#f7f3e8] px-5">
      <div className="w-full max-w-md rounded-[2rem] border border-[#173d32]/12 bg-[#e4eee9] p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-[#1d664d]" />
        <h1 className="mt-5 font-display text-3xl text-[#173d32]">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#173d32]/65">
          This page is not part of the Creation Care Foundation website.
        </p>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex items-center justify-center rounded-full bg-[#173d32] px-6 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#f7f3e8]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
