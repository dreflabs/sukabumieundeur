import { query } from '@/lib/db';
import EventsClient from './EventsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Events - Sukabumi Eundeur',
  description: 'Jadwal festival metal, konser underground, dan gig lokal terbaru di ekosistem Sukabumi Eundeur.',
};

export default async function EventsPage() {
  try {
    const rows = await query<any>(`SELECT * FROM public.events WHERE is_active = true ORDER BY start_date ASC`);
    
    const now = new Date();
    
    // Format and partition data
    const upcomingEvents = rows.filter(r => new Date(r.start_date) >= now).map((row: any) => {
      const d = new Date(row.start_date);
      return {
        id: row.id,
        title: row.title,
        location: `${row.venue}, ${row.city}`,
        date: d.getDate().toString().padStart(2, '0'),
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        year: d.getFullYear().toString(),
        image: row.banner_url || 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=800&auto=format&fit=crop',
        description: row.description
      };
    });

    const pastEvents = rows.filter(r => new Date(r.start_date) < now).map((row: any) => {
      const d = new Date(row.start_date);
      return {
        id: row.id,
        title: row.title,
        location: `${row.venue}, ${row.city}`,
        date: d.getDate().toString().padStart(2, '0'),
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        year: d.getFullYear().toString(),
        image: row.banner_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
        description: row.description
      };
    });

    const jsonLd = rows.map((event: any) => ({
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: event.title,
      startDate: event.start_date,
      endDate: event.end_date,
      location: { '@type': 'Place', name: event.venue, address: event.city },
      url: 'https://eundeur.com/events'
    }));

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <EventsClient upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      </>
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return <EventsClient upcomingEvents={[]} pastEvents={[]} />;
  }
}
