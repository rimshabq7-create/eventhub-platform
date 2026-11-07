'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, getEvents } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function loadData() {
      const cats = await getCategories();
      const evts = await getEvents();
      setCategories(cats);
      setEvents(evts);
      setLoading(false);
    }
    loadData();
  }, []);

  const getEventCount = (slug) => {
    return events.filter((e) => e.categories?.[0]?.slug === slug).length;
  };

  const getCategoryEvents = (slug) => {
    return events.filter((e) => e.categories?.[0]?.slug === slug);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Event Categories</h1>
          <p className="text-white/90">Browse events by category and find what interests you</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`bg-white rounded-2xl p-8 text-center shadow hover:shadow-xl hover:-translate-y-1 transition border-2 ${
                  selectedCategory?.slug === cat.slug
                    ? 'border-secondary'
                    : 'border-transparent'
                }`}
              >
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4"
                  style={{ backgroundColor: `${cat.color}22` }}
                >
                  {getCategoryEmoji(cat.slug)}
                </div>
                <h3 className="font-bold text-primary text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600">
                  {getEventCount(cat.slug)} Events
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Events Preview */}
      {selectedCategory && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-3xl font-bold text-primary">
                  {getCategoryEmoji(selectedCategory.slug)} {selectedCategory.name} Events
                </h2>
                <p className="text-gray-600 mt-1">
                  {getEventCount(selectedCategory.slug)} events in this category
                </p>
              </div>
              <Link
                href={`/events?category=${selectedCategory.slug}`}
                className="bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-secondary transition"
              >
                View All →
              </Link>
            </div>

            {getCategoryEvents(selectedCategory.slug).length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600">No events in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCategoryEvents(selectedCategory.slug).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function EventCard({ event }) {
  const category = event.categories?.[0];
  const price = event.isFree ? 'Free' : `$${event.price}`;
  const emoji = getCategoryEmoji(category?.slug);

  return (
    <Link
      href={`/events/${event.documentId}`}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition group border"
    >
      <div
        className="relative h-48 flex items-center justify-center text-6xl"
        style={{
          background: `linear-gradient(135deg, ${category?.color || '#1E3A5F'}, ${category?.color || '#2196F3'}88)`,
        }}
      >
        <span className="opacity-80">{emoji}</span>
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: category?.color }}
        >
          {category?.name}
        </span>
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