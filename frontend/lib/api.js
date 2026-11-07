const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Fetch all events
export async function getEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events?populate=*&sort=date:asc`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Fetch featured events
export async function getFeaturedEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events?populate=*&filters[featured][$eq]=true`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch featured events');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

// Fetch single event by documentId
export async function getEventById(id) {
  try {
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch event');
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Fetch all categories
export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories?sort=name:asc`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Helper to get image URL from Strapi
export function getImageUrl(image) {
  if (!image) return '/placeholder.jpg';
  if (image.url.startsWith('http')) return image.url;
  return `${API_URL}${image.url}`;
}

// --- RSVP, BOOKMARK & REVIEW APIs ---

export async function createRSVP(eventId, userName) {
  try {
    const res = await fetch(`${API_URL}/api/rsvps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          rsvpStatus: 'Confirmed',
          userName: userName,
          events: {
            connect: [eventId],
          },
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('RSVP error:', err);
    }
    return res.ok;
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return false;
  }
}

export async function createBookmark(eventId, userName) {
  try {
    const res = await fetch(`${API_URL}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          userName: userName,
          events: {
            connect: [eventId],
          },
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Bookmark error:', err);
    }
    return res.ok;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return false;
  }
}

export async function createReview(eventId, userName, rating, comment) {
  try {
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          userName: userName,
          rating: rating,
          comment: comment,
          events: {
            connect: [eventId],
          },
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Review error:', err);
    }
    return res.ok;
  } catch (error) {
    console.error('Error creating review:', error);
    return false;
  }
}

// --- FETCH USER DATA FOR DASHBOARD ---

export async function getUserRSVPs(userName) {
  try {
    const res = await fetch(`${API_URL}/api/rsvps?filters[userName][$eq]=${userName}&populate=*`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch RSVPs');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }
}

export async function getUserFavorites(userName) {
  try {
    const res = await fetch(`${API_URL}/api/favorites?filters[userName][$eq]=${userName}&populate=*`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch favorites');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export async function getUserReviews(userName) {
  try {
    const res = await fetch(`${API_URL}/api/reviews?filters[userName][$eq]=${userName}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}