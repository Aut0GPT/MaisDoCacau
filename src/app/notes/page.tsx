'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Notes() {
  const [notes, setNotes] = useState<Array<{ id: string; title: string; content: string; user_id?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  
  useEffect(() => {  // eslint-disable-line react-hooks/exhaustive-deps
    async function fetchNotes() {
      try {
        setLoading(true);
        
        // Try to fetch notes
        const { data, error } = await supabase.from('notes').select('*');
        
        if (error) {
          setError(error.message);
          return;
        }
        
        setNotes(data || []);
      } catch (err: unknown) {
        console.error('Error fetching notes:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch notes'
        );
      } finally {
        setLoading(false);
      }
    }
    
    fetchNotes();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#6b4226] mb-6">Supabase Notes Demo</h1>
        
        {loading ? (
          <div className="p-4 bg-gray-100 rounded-lg">Loading notes...</div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <h2 className="font-bold">Error</h2>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Make sure to run the SQL setup script in the Supabase SQL Editor.
              You can find the script in the project root: <code>supabase-setup.sql</code>
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Notes from Supabase</h2>
            {notes.length === 0 ? (
              <p>No notes found. Please run the setup script.</p>
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(notes, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        <div className="mt-8 bg-[#f9f5eb] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-[#6b4226]">Supabase Integration</h2>
          <p className="mb-4">
            This page demonstrates the Supabase integration with Next.js. The notes are fetched from a Supabase database.
          </p>
          <p className="mb-4">
            To set up your own Supabase database, follow these steps:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Log in to your Supabase dashboard</li>
            <li>Open the SQL Editor</li>
            <li>Copy and paste the contents of <code>supabase-setup.sql</code> from the project root</li>
            <li>Run the SQL script to create the necessary tables and sample data</li>
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  );
}
