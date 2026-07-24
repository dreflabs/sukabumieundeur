import React from 'react';
import EventFormClient from '@/components/admin/EventFormClient';

export const metadata = {
  title: 'Buat Event Baru - Admin Sukabumi Eundeur',
  description: 'Tambah jadwal festival atau acara baru ke dalam sistem.',
};

export default function NewEventPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <EventFormClient />
    </div>
  );
}
