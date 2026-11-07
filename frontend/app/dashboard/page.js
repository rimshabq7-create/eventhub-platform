'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getEvents, getUserRSVPs, getUserFavorites, getUserReviews } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      router.push('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);

    async function loadData() {
      const allEvents = await getEvents();
      setEvents(allEvents);

      // Fetch user specific data
      const userRsvps = await getUserRSVPs(u.name);
      const userFavs = await getUserFavorites(u.name);
      const userRevs = await getUserReviews(u.name);

      setRsvps(userRsvps);
      setFavorites(userFavs);
      setReviews(userRevs);
      setLoading(false);
    }
    loadData();
  }, [router]);

  if (!user || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    );
  }

  // Extract actual event data from relationships
  const myRsvpEvents = rsvps.map(r => r.events?.[0]).filter(Boolean);
  const myFavoriteEvents = favorites.map(f => f.events?.[0]).filter(Boolean);
  
  // Combine RSVPs and Favorites for the "Upcoming Events" section
  const uniqueEvents = [...new Map([...myRsvpEvents, ...myFavoriteEvents].map(e => [e.id, e])).values()];
  const displayEvents = uniqueEvents.length > 0 ? uniqueEvents.slice(0, 3) : events.slice(0, 3); // Fallback to general events if none

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-light min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Welcome back, <span className="text-accent">{user.name}</span>!
              </h1>
              <p className="text-white/80">Here's what's happening with your events</p>
            </div>
            <div className="text-sm text-white/80">📅 {today}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon="📅" value={myRsvpEvents.length} label="Events Attending" color="purple" />
          <StatCard icon="🔖" value={myFavoriteEvents.length} label="Saved Events" color="blue" />
          <StatCard icon="⭐" value={reviews.length} label="Reviews Written" color="green" />
          <StatCard icon="✨" value="0" label="Events Created" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events (RSVPs + Bookmarks) */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary text-lg">📅 My Schedule</h3>
              <Link href="/events" className="text-secondary text-sm font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {displayEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.documentId}`}
                  className="block p-3 rounded-lg hover:bg-light transition border-b last:border-0"
                >
                  <p className="font-semibold text-primary">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    📅 {event.date} • 📍 {event.venue}
                  </p>
                </Link>
              ))}
              {displayEvents.length === 0 && (
                <p className="text-gray-500 text-sm py-4">No upcoming events. Go RSVP to something!</p>
              )}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary text-lg">🔖 My Bookmarks</h3>
            </div>
            <div className="space-y-3">
              {myFavoriteEvents.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.documentId}`}
                  className="block p-3 rounded-lg hover:bg-light transition border-b last:border-0"
                >
                  <p className="font-semibold text-primary">🔖 {event.title}</p>
                  <p className="text-sm text-gray-600">📍 {event.venue}</p>
                </Link>
              ))}
              {myFavoriteEvents.length === 0 && (
                <p className="text-gray-500 text-sm py-4">No bookmarks yet.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-primary text-lg mb-4">📊 Recent Activity</h3>
            <div className="space-y-3">
              {myRsvpEvents.slice(0,1).map(e => (
                <ActivityItem key={`rsvp-${e.id}`} icon="✅" text={`You RSVP'd for ${e.title}`} time="Recently" color="green" />
              ))}
              {reviews.slice(0,1).map(r => (
                <ActivityItem key={`rev-${r.id}`} icon="⭐" text={`You reviewed ${r.events?.[0]?.title || 'an event'}`} time="Recently" color="blue" />
              ))}
              {myFavoriteEvents.slice(0,1).map(e => (
                <ActivityItem key={`fav-${e.id}`} icon="🔖" text={`You bookmarked ${e.title}`} time="Recently" color="orange" />
              ))}
              {myRsvpEvents.length === 0 && reviews.length === 0 && myFavoriteEvents.length === 0 && (
                <p className="text-gray-500 text-sm py-4">No recent activity.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-primary text-lg mb-4">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction href="/events" icon="🔍" label="Find Events" />
              <QuickAction href="/events" icon="✨" label="Create Event" />
              <QuickAction href="/profile" icon="👤" label="Edit Profile" />
              <QuickAction href="/categories" icon="🎯" label="Browse Categories" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  const colors = {
    purple: 'bg-primary',
    blue: 'bg-secondary',
    green: 'bg-success',
    orange: 'bg-accent',
  };
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
      <div className={`w-14 h-14 ${colors[color]} rounded-xl flex items-center justify-center text-2xl text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time, color }) {
  const colors = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    orange: 'bg-orange-100',
  };
  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-0">
      <div className={`w-9 h-9 ${colors[color]} rounded-full flex items-center justify-center text-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-light rounded-xl hover:bg-blue-50 transition text-center"
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-primary">{label}</span>
    </Link>
  );
}