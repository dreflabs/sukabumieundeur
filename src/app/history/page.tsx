import React from 'react';
import { Calendar, MapPin, Video, Users, Flame, BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

// Fetch data on the server
async function getHistory() {
  // Using an absolute URL or bypassing fetch to talk directly to DB is preferred in SC.
  // Here we use absolute URL since it's an API route in the same Next.js app.
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/history`, { 
    cache: 'no-store' // ensures data is always fresh, or you can use next: { revalidate: 60 }
  });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.success ? data.data : [];
}

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="w-full flex flex-col font-sans">

      {/* Cinematic Hero Header */}
      <section className="relative py-28 px-6 border-b border-zinc-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

        {/* Giant background year label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[20vw] font-black text-zinc-950 tracking-tighter font-outfit leading-none">HISTORY</span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-6 text-center fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md text-red-400 text-xs font-mono tracking-widest uppercase shadow-lg">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Festival Archive &amp; Legacy
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter font-outfit leading-none drop-shadow-xl">
            HISTORI<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700">SUKABUMI EUNDEUR</span>
          </h1>

          <p className="text-zinc-400 text-sm max-w-2xl mx-auto font-mono leading-relaxed">
            Perjalanan epik dari tahun ke tahun. Setiap festival adalah babak baru dalam kronik Metal Sukabumi yang tak pernah padam.
          </p>
        </div>
      </section>

      {/* Timeline Content */}
      <main className="py-20 px-6 max-w-5xl mx-auto w-full flex-grow">
        
        {/* Timeline Vertical Line */}
        <div className="relative">
          {/* Vertical center line */}
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-red-600 via-zinc-800 to-transparent"></div>

          {history.length === 0 ? (
            <div className="pl-8 md:pl-16">
              <EmptyState
                icon={BookOpen}
                title="Arsip Belum Tersedia"
                description="Catatan sejarah festival belum dipublikasikan. Perjalanan epik Sukabumi Eundeur akan segera didokumentasikan di sini."
              />
            </div>
          ) : (
            <div className="space-y-24">
              {history.map((item: any, index: number) => (
                <div
                  key={item.year}
                  className={`relative pl-8 md:pl-16 fade-in-up stagger-${(index % 4) + 1}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-5px] md:left-[11px] top-6 w-[11px] h-[11px] rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] border-2 border-black ring-1 ring-red-500/50"></div>

                  {/* Giant year in background */}
                  <div className="absolute -left-4 md:-left-8 top-0 text-[8rem] md:text-[10rem] font-black text-zinc-950 tracking-tighter font-outfit leading-none pointer-events-none select-none -z-10">
                    {item.year}
                  </div>

                  {/* Card */}
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-500 shadow-2xl group">
                    
                    {/* Card Header */}
                    <div className="p-6 md:p-8 border-b border-zinc-800/60 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl md:text-6xl font-black text-red-500 font-mono tracking-tighter leading-none">
                          {item.year}
                        </span>
                        <div className="w-px h-12 bg-zinc-700"></div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-white uppercase font-outfit tracking-tight">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-red-500" /> {item.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> {item.venue}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono">
                        <Users className="w-3.5 h-3.5 text-red-500" />
                        <span className="font-bold">{item.attendees}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8 items-start">
                      
                      {/* Left: Headliners */}
                      <div className="md:col-span-2 space-y-4">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.25em] font-bold block">
                          ⚡ Headliners
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.headliners.map((h: string) => (
                            <span
                              key={h}
                              className="text-[10px] font-mono bg-red-950/60 border border-red-800/60 text-red-300 px-3 py-1.5 rounded font-bold uppercase tracking-widest hover:bg-red-900/60 transition-colors cursor-default"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Aftermovie */}
                      <div className="md:col-span-3">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.25em] font-bold block mb-3">
                          🎬 Official Aftermovie
                        </span>
                        <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/60 relative group/video cursor-pointer">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover grayscale group-hover/video:grayscale-0 transition-all duration-700 group-hover/video:scale-105"
                          />
                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-black/50 group-hover/video:bg-black/30 transition-colors duration-300"></div>
                          {/* Play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover/video:scale-110 transition-all duration-300">
                              <Video className="w-6 h-6 text-white ml-0.5" />
                            </div>
                          </div>
                          {/* Year label */}
                          <div className="absolute bottom-3 left-3 text-[9px] font-mono text-zinc-400 bg-black/60 backdrop-blur px-2 py-1 rounded">
                            AFTERMOVIE {item.year}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
