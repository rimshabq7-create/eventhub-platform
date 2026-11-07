import Link from 'next/link';
import { getFeaturedEvents, getEvents, getCategories } from '@/lib/api';

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();
  const allEvents = await getEvents();
  const categories = await getCategories();

  const upcomingEvents = allEvents.slice(0, 4);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Find and connect with local events, workshops, concerts, and community gatherings near you.
          </p>

          <div className="flex max-w-xl mx-auto bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 px-6 py-4 text-gray-800 outline-none"
            />
            <button className="bg-accent text-white px-8 py-4 font-semibold hover:bg-orange-600 transition">
              🔍 Search
            </button>
          </div>

          <div className="flex justify-center gap-12 mt-12">
            <div>
              <div className="text-3xl font-bold">{allEvents.length}+</div>
              <div className="text-sm text-white/80">Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{categories.length}+</div>
              <div className="text-sm text-white/80">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-white/80">Attendees</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">🌟 Featured Events</h2>
            <p className="text-gray-600">Handpicked events you don't want to miss</p>
            <Link href="/events" className="inline-block mt-3 text-accent font-semibold hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {featuredEvents.length === 0 && (
            <p className="text-center text-gray-500">No featured events yet.</p>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">🎯 Browse by Category</h2>
            <p className="text-gray-600">Find events that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/events?category=${cat.slug}`}
                className="bg-white rounded-xl p-6 text-center shadow hover:shadow-lg hover:-translate-y-1 transition border-2 border-transparent hover:border-secondary"
              >
                <div className="text-4xl mb-2" style={{ color: cat.color }}>
                  {getCategoryEmoji(cat.slug)}
                </div>
                <h3 className="font-semibold text-primary">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">📅 Upcoming Events</h2>
            <p className="text-gray-600">Don't miss out on these exciting events</p>
            <Link href="/events" className="inline-block mt-3 text-accent font-semibold hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">✨ Why Choose EventHub</h2>
            <p className="text-gray-600">Your trusted platform for discovering events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon="🗺️" title="Interactive Map" desc="Discover events near you with our interactive map view" />
            <FeatureCard icon="🔍" title="Smart Filters" desc="Filter events by category, date, and location easily" />
            <FeatureCard icon="🎫" title="Easy RSVP" desc="Register for events with just one click" />
            <FeatureCard icon="⭐" title="Reviews & Ratings" desc="Read reviews and share your experience" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Event Card Component
function EventCard({ event }) {
  const category = event.categories?.[0];
  const price = event.isFree ? 'Free' : `$${event.price}`;

  return (
    <Link
      href={`/events/${event.documentId}`}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition group"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
          🎉
        </div>
        {category && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-primary text-lg mb-2 group-hover:text-secondary transition">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">📅 {event.date}</p>
        <p className="text-sm text-gray-600 mb-3">📍 {event.venue}</p>

        <div className="flex justify-between items-center pt-3 border-t">
          <span className={`font-semibold ${event.isFree ? 'text-success' : 'text-primary'}`}>
            {price}
          </span>
          <span className="text-accent text-sm font-semibold">View Details →</span>
        </div>
      </div>
    </Link>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-primary mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

// Category emoji helper
function getCategoryEmoji(slug) {
  const map = {
    music: '🎵',
    sports: '⚽',
    technology: '💻',
    'art-culture': '🎨',
    'food-drink': '🍔',
    community: '🤝',
    'health-wellness': '💪',
    business: '💼',
  };
  return map[slug] || '📌';
}