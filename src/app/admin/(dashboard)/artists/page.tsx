export const dynamic = 'force-dynamic';
import { query } from "@/lib/db";
import ArtistsAdminClient from "./ArtistsAdminClient";
import { requireAdminRole } from "@/lib/requireAdmin";

export const revalidate = 0;

export default async function AdminArtistsPage() {
  const auth = await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
  if (!auth.success) return <div>Unauthorized</div>;

  try {
    // Fetch artists sorted by created_at desc
    const rows = await query(`SELECT * FROM public.artists ORDER BY created_at DESC`);
    
    const artists = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      imageUrl: row.image_url,
      isActive: row.is_active,
    }));

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-outfit font-black text-white uppercase tracking-tighter">LINEUP ROSTER</h1>
            <p className="text-xs text-gray-500 font-inter mt-1 tracking-widest uppercase">Manage Festival Performers</p>
          </div>
        </div>

        <ArtistsAdminClient initialArtists={artists} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching artists for admin:", error);
    return <div className="text-red-500">Failed to load artists data. Ensure database is running.</div>;
  }
}
