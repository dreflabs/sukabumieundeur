"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Power, Loader2 } from "lucide-react";
import { addArtist, deleteArtist, toggleArtistStatus } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

type Artist = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  isActive: boolean;
};

export default function ArtistsAdminClient({ initialArtists }: { initialArtists: Artist[] }) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', role: 'HEADLINER', imageUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const fallbackImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop';
    
    try {
      const res = await addArtist({
        name: formData.name,
        role: formData.role,
        imageUrl: formData.imageUrl || fallbackImage
      });

      if (res.success) {
        setIsAdding(false);
        setFormData({ name: '', role: 'HEADLINER', imageUrl: '' });
        toast.success("Artist added successfully!");
        window.location.reload(); 
      } else {
        toast.error("Failed: " + res.error);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (currentStatus && !confirm("Are you sure you want to deactivate this artist?")) return;
    setLoadingId(id);
    // Optimistic update
    setArtists(prev => prev.map(a => a.id === id ? { ...a, isActive: !currentStatus } : a));
    try {
      const res = await toggleArtistStatus(id, currentStatus);
      if (!res.success) {
        setArtists(prev => prev.map(a => a.id === id ? { ...a, isActive: currentStatus } : a));
        toast.error("Failed: " + res.error);
      } else {
        toast.success("Status updated!");
      }
    } catch (err) {
      setArtists(prev => prev.map(a => a.id === id ? { ...a, isActive: currentStatus } : a));
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;
    
    setLoadingId(id);
    setArtists(prev => prev.filter(a => a.id !== id));
    try {
      const res = await deleteArtist(id);
      if (!res.success) {
        toast.error("Failed to delete artist");
        window.location.reload(); // Revert on fail
      } else {
        toast.success("Artist deleted!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? "outline" : "default"}
        >
          {isAdding ? 'CANCEL' : <><Plus className="w-4 h-4 mr-2" /> ADD NEW ARTIST</>}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border border-brand/50 p-6 space-y-4 shadow-brutal">
          <h3 className="text-white font-outfit font-black text-xl uppercase">Register New Artist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="artist-name" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Artist / Band Name</label>
              <Input id="artist-name" required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label htmlFor="artist-role" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Genre / Role</label>
              <select id="artist-role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="flex h-11 w-full bg-card border border-border px-3 py-2 font-inter text-sm text-white focus-visible:outline-none focus-visible:border-brand transition-colors appearance-none uppercase">
                <option value="HEADLINER">HEADLINER</option>
                <option value="ROCK">ROCK</option>
                <option value="METAL">METAL</option>
                <option value="INDIE">INDIE</option>
                <option value="ALTERNATIVE">ALTERNATIVE</option>
                <option value="HARDCORE">HARDCORE</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="artist-image" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Image URL (Optional)</label>
              <Input id="artist-image" type="text" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-4">
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...</> : 'SAVE TO DATABASE'}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className={`bg-card border ${artist.isActive ? 'border-border hover:border-brand/50' : 'border-red-900/30 opacity-60'} overflow-hidden transition-all flex flex-col group`}>
            <div className="relative w-full aspect-[4/3] bg-black">
              {artist.imageUrl && (
                <Image src={artist.imageUrl} alt={artist.name} fill className={`object-cover ${artist.isActive ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale opacity-30'} transition-all`} />
              )}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 border border-border">
                <span className="text-[8px] font-inter font-bold text-brand tracking-widest uppercase">{artist.role}</span>
              </div>
              <div className="absolute top-2 right-2">
                <button disabled={loadingId === artist.id} onClick={() => handleToggle(artist.id, artist.isActive)} className={`w-8 h-8 flex items-center justify-center rounded-full ${artist.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border border-current hover:scale-110 transition-transform disabled:opacity-50`}>
                  {loadingId === artist.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-outfit font-black text-xl text-white uppercase leading-tight line-clamp-1">{artist.name}</h3>
                <p className="text-[10px] text-muted font-inter tracking-widest uppercase mt-1">
                  Status: {artist.isActive ? <span className="text-emerald-400">Active</span> : <span className="text-red-500">Hidden</span>}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button disabled={loadingId === artist.id} variant="ghost" size="icon" onClick={() => handleDelete(artist.id)} className="w-8 h-8 text-muted hover:text-red-500 hover:bg-red-500/10">
                  {loadingId === artist.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
