"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Power, Calendar, MapPin, Loader2 } from "lucide-react";
import { addEvent, deleteEvent, toggleEventStatus } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import toast from "react-hot-toast";

type EventType = {
  id: string;
  slug: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  bannerUrl: string;
  isActive: boolean;
};

export default function EventsAdminClient({ initialEvents }: { initialEvents: EventType[] }) {
  const [events, setEvents] = useState<EventType[]>(initialEvents);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    venue: '',
    city: 'Sukabumi',
    startDate: '',
    endDate: '',
    bannerUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const fallbackImage = 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=2940&auto=format&fit=crop';
    
    try {
      const res = await addEvent({
        ...formData,
        bannerUrl: formData.bannerUrl || fallbackImage
      });

      if (res.success) {
        setIsAdding(false);
        toast.success("Event created successfully!");
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
    if (currentStatus && !confirm("Are you sure you want to deactivate this event?")) return;
    setLoadingId(id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isActive: !currentStatus } : e));
    try {
      const res = await toggleEventStatus(id, currentStatus);
      if (!res.success) {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, isActive: currentStatus } : e));
        toast.error("Failed: " + res.error);
      } else {
        toast.success("Event status updated");
      }
    } catch (err) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, isActive: currentStatus } : e));
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This may break existing tickets.")) return;
    
    setLoadingId(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    try {
      const res = await deleteEvent(id);
      if (!res.success) {
        toast.error("Failed to delete event");
        window.location.reload();
      } else {
        toast.success("Event deleted");
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
          {isAdding ? 'CANCEL' : <><Plus className="w-4 h-4 mr-2" /> CREATE EVENT</>}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border border-brand/50 p-6 space-y-4 shadow-brutal">
          <h3 className="text-white font-outfit font-black text-xl uppercase mb-4">Register New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-title" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Event Title</label>
              <Input id="event-title" required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label htmlFor="event-slug" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">URL Slug</label>
              <Input id="event-slug" required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="eundeur-fest-2025" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="event-desc" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Description</label>
              <Textarea id="event-desc" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
            </div>
            <div>
              <label htmlFor="event-venue" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Venue Name</label>
              <Input id="event-venue" required type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
            </div>
            <div>
              <label htmlFor="event-city" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">City</label>
              <Input id="event-city" required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label htmlFor="event-start" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Start Date & Time</label>
              <Input id="event-start" required type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
              <label htmlFor="event-end" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">End Date & Time</label>
              <Input id="event-end" required type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="event-banner" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Banner Image URL (Optional)</label>
              <Input id="event-banner" type="text" placeholder="https://..." value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} />
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-4">
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...</> : 'PUBLISH EVENT'}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className={`bg-card border ${event.isActive ? 'border-border hover:border-brand/50' : 'border-red-900/30 opacity-60'} overflow-hidden transition-all flex flex-col group`}>
            <div className="relative w-full aspect-[21/9] bg-black">
              {event.bannerUrl && (
                <Image src={event.bannerUrl} alt={event.title} fill className={`object-cover ${event.isActive ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale opacity-30'} transition-all`} />
              )}
              <div className="absolute top-3 left-3 bg-brand px-3 py-1">
                <span className="text-[10px] font-inter font-bold text-black tracking-widest uppercase">/{event.slug}</span>
              </div>
              <div className="absolute top-2 right-2">
                <button disabled={loadingId === event.id} onClick={() => handleToggle(event.id, event.isActive)} className={`w-8 h-8 flex items-center justify-center rounded-full ${event.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border border-current hover:scale-110 transition-transform disabled:opacity-50`}>
                  {loadingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-outfit font-black text-2xl text-white uppercase leading-tight line-clamp-2 mb-2">{event.title}</h3>
                
                <div className="flex flex-wrap gap-4 text-xs font-inter text-muted mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand" /> {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand" /> {event.venue}, {event.city}
                  </div>
                </div>
                
                <p className="text-[10px] text-muted font-inter tracking-widest uppercase mt-4 border-t border-white/5 pt-4">
                  Status: {event.isActive ? <span className="text-emerald-400">Public & Ticketing Open</span> : <span className="text-red-500">Hidden / Draft</span>}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button disabled={loadingId === event.id} variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="w-8 h-8 text-muted hover:text-red-500 hover:bg-red-500/10">
                  {loadingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
