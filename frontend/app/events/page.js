'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, getCategories } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const eventsData = await getEvents();
      const categoriesData = await getCategories();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => {
        const cat = event.categories?.[0];
        return cat?.slug === selectedCategory;
      });
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((event) => {
        const cat = event.categories?.[0];
        return (
          event.title.toLowerCase().includes(term) ||
          event.venue?.toLowerCase().includes(term) ||
          event.organizer?.toLowerCase().includes(term) ||
          cat?.name.toLowerCase().includes(term)
        );
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">All Events</h1>
          <p className="text-white/90">Discover and explore amazing events happening near you</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-sm sticky top-16 z-40 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by name, category, or venue..."
              className="w-full pl-12 pr-4 py-3 bg-light border-2 border-transparent rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-52 px-4 py-3 bg-light border-2 border-transparent rounded-lg focus:border-secondary focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear Button */}
          <button
            onClick={clearFilters}
            className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition whitespace-nowrap"
          >
            ✕ Clear
          </button>

          {/* View Toggle */}
          <div className="flex gap-1 bg-light p-1 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2 rounded-md transition ${view === 'grid' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
            >
              ▦
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 rounded-md transition ${view === 'list' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 px-4 bg-light min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-primary">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-primary mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} view={view} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({ event, view }) {
  const category = event.categories?.[0];
  const price = event.isFree ? 'Free' : `$${event.price}`;
  const emoji = getCategoryEmoji(category?.slug);

  if (view === 'list') {
    return (
      <Link
        href={`/events/${event.documentId}`}
        className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex"
      >
        <div
          className="w-40 flex items-center justify-center text-5xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${category?.color || '#1E3A5F'}, ${category?.color || '#2196F3'}88)`,
          }}
        >
          {emoji}
        </div>
        <div className="p-5 flex-1">
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>
          <h3 className="font-bold text-primary text-lg mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-1">📅 {event.date}</p>
          <p className="text-sm text-gray-600 mb-2">📍 {event.venue}</p>
          <div className="flex justify-between items-center">
            <span className={`font-semibold ${event.isFree ? 'text-success' : 'text-primary'}`}>
              {price}
            </span>
            <span className="text-accent text-sm font-semibold">View Details →</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.documentId}`}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition group"
    >
      <div
        className="relative h-48 flex items-center justify-center text-6xl"
        style={{
          background: `linear-gradient(135deg, ${category?.color || '#1E3A5F'}, ${category?.color || '#2196F3'}88)`,
        }}
      >
        <span className="opacity-80">{emoji}</span>
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