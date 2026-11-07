import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📅</span>
              <span className="text-xl font-bold">
                Event<span className="text-accent">Hub</span>
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Discover, connect, and engage with amazing events in your community.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/events" className="hover:text-white">Events</Link>
              <Link href="/categories" className="hover:text-white">Categories</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href="/events?category=Music" className="hover:text-white">Music</Link>
              <Link href="/events?category=Sports" className="hover:text-white">Sports</Link>
              <Link href="/events?category=Technology" className="hover:text-white">Technology</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <p>📧 info@eventhub.com</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/60">
          © 2026 EventHub. All rights reserved. | Group: S26PROJECT3522B | Student: Rimsha
        </div>
      </div>
    </footer>
  );
}