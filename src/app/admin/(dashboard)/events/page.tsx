export const dynamic = 'force-dynamic';
import { query } from "@/lib/db";
import EventsAdminClient from "./EventsAdminClient";

import { requireAdminRole } from '@/lib/requireAdmin';

export const revalidate = 0;

export default async function AdminEventsPage() {
  try {
    const auth = await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    if (!auth.success) return <div>Unauthorized</div>;

    // Fetch events sorted by start_date desc
    const rows = await query(`SELECT * FROM public.events ORDER BY start_date DESC`);
    
    const events = rows.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      venue: row.venue,
      city: row.city,
      startDate: new Date(row.start_date).toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
      endDate: new Date(row.end_date).toISOString().slice(0, 16),
      bannerUrl: row.banner_url,
      isActive: row.is_active,
    }));

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-outfit font-black text-white uppercase tracking-tighter">EVENT CALENDAR</h1>
            <p className="text-xs text-gray-500 font-inter mt-1 tracking-widest uppercase">Manage Festivals & Shows</p>
          </div>
        </div>

        <EventsAdminClient initialEvents={events} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching events for admin:", error);
    return <div className="text-red-500">Failed to load events data. Ensure database is running.</div>;
  }
}
