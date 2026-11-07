'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getEventById, createRSVP, createBookmark, createReview } from '@/lib/api';

// Dynamically import the map to prevent "window is not defined" error
const EventMap = dynamic(() => import('@/components/EventMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">Loading map...</div>
});

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    async function loadEvent() {
      const data = await getEventById(params.id);
      setEvent(data);
      setLoading(false);
    }
    loadEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-primary mb-2">Event Not Found</h3>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Link
            href="/events"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const category = event.categories?.[0];
  const emoji = getCategoryEmoji(category?.slug);
  const price = event.isFree ? 'Free' : `$${event.price}`;

  const handleRSVP = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      alert('Please login to RSVP for this event.');
      window.location.href = '/login';
      return;
    }

    const success = await createRSVP(event.documentId, user.name);
    if (success) {
      alert('✅ You have successfully RSVP\'d for this event!');
    } else {
      alert('❌ Could not save RSVP. Check console for details.');
    }
  };

  const handleBookmark = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      alert('Please login to bookmark events.');
      window.location.href = '/login';
      return;
    }

    const success = await createBookmark(event.documentId, user.name);
    if (success) {
      alert('✅ Event bookmarked successfully!');
    } else {
      alert('❌ Could not save bookmark. Check console for details.');
    }
  };

  const handleReviewSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return alert('Please login to submit a review.');
    if (rating === 0) return alert('Please select a rating first.');
    if (!comment.trim()) return alert('Please write a comment.');

    const success = await createReview(event.documentId, user.name, rating, comment);
    if (success) {
      alert('✅ Review submitted successfully!');
      setRating(0);
      setComment('');
    } else {
      alert('❌ Could not submit review. Check console for details.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: 'Check out this amazing event!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('✅ Link copied to clipboard!');
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-light py-3 px-4">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          <Link href="/" className="text-primary hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/events" className="text-primary hover:underline">Events</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{event.title}</span>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left - Image/Emoji */}
          <div>
            <div
              className="rounded-2xl h-96 flex items-center justify-center text-9xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${category?.color || '#1E3A5F'}, ${category?.color || '#2196F3'}88)`,
              }}
            >
              <span className="opacity-80">{emoji}</span>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg flex items-center justify-center text-3xl cursor-pointer border-2 border-transparent hover:border-secondary transition"
                  style={{
                    background: `linear-gradient(135deg, ${category?.color || '#1E3A5F'}cc, ${category?.color || '#2196F3'}66)`,
                  }}
                >
                  <span className="opacity-70">{emoji}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Info */}
          <div>
            {category && (
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-white mb-3"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {event.title}
            </h1>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <InfoItem icon="📅" label="Date" value={event.date} />
              <InfoItem icon="⏰" label="Time" value={event.time || 'TBA'} />
              <InfoItem icon="📍" label="Venue" value={event.venue} />
              <InfoItem
                icon="🎫"
                label="Price"
                value={price}
                valueClass={event.isFree ? 'text-success' : 'text-primary'}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-2">About This Event</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleRSVP}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition flex items-center gap-2"
              >
                ✅ RSVP Now
              </button>
              <button
                onClick={handleBookmark}
                className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition flex items-center gap-2"
              >
                🔖 Bookmark
              </button>
              <button
                onClick={handleShare}
                className="border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition flex items-center gap-2"
              >
                🔗 Share
              </button>
            </div>

            {/* Organizer */}
            <div className="bg-light rounded-xl p-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-600">Organized by</p>
                  <p className="font-semibold text-primary">{event.organizer || 'EventHub'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-primary">{event.contact || 'info@eventhub.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-light py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-bold text-primary mb-4">📍 Event Location</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map - takes 2 columns */}
            <div className="lg:col-span-2 h-80 z-0 relative">
              <EventMap 
                latitude={event.latitude} 
                longitude={event.longitude} 
                title={event.title}
                venue={event.venue}
              />
            </div>

            {/* Map Info - takes 1 column */}
            <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-center">
              <h4 className="font-bold text-primary mb-2">Address</h4>
              <p className="text-gray-600 mb-4">{event.address || event.venue}, {event.city}</p>
              
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition text-center"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h3 className="text-xl font-bold text-primary">⭐ Reviews & Ratings</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">4.8</span>
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span className="text-sm text-gray-600">(24 reviews)</span>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-light rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-primary mb-3">Write a Review</h4>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-gray-600">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none mb-3"
            />
            <button
              onClick={handleReviewSubmit}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Submit Review
            </button>
          </div>

          {/* Reviews List (Static demo for now) */}
          <div className="space-y-4">
            <ReviewItem
              name="Sarah Johnson"
              rating={5}
              comment="Amazing event! The music was incredible and the atmosphere was electric."
              date="August 10, 2026"
            />
            <ReviewItem
              name="Michael Chen"
              rating={5}
              comment="Great organization and fantastic lineup. The food trucks were a nice addition!"
              date="August 9, 2026"
            />
            <ReviewItem
              name="Emily Davis"
              rating={4}
              comment="Had a wonderful time! The only downside was the long lines for food."
              date="August 8, 2026"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ icon, label, value, valueClass = 'text-primary' }) {
  return (
    <div className="flex items-start gap-3 bg-light p-3 rounded-lg">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-semibold ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function ReviewItem({ name, rating, comment, date }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">👤</div>
        <div>
          <p className="font-semibold text-primary">{name}</p>
          <div className="text-yellow-500 text-sm">
            {'★'.repeat(rating)}
            <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-2">{comment}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
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