import { query } from '@/lib/db';
import ArtistsClient from './ArtistsClient';

export const revalidate = 0;

export default async function ArtistsPage() {
  try {
    const rows = await query(`SELECT * FROM public.artists WHERE is_active = true ORDER BY created_at ASC`);
    
    // Format data for frontend
    const artists = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      image: row.image_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'
    }));

    return <ArtistsClient artists={artists} />;
  } catch (error) {
    console.error("Error fetching artists:", error);
    return <ArtistsClient artists={[]} />;
  }
}
