'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Note } from '@/lib/types';

interface NotesViewProps {
  notes: Note[];
  onOpenAddNote: () => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesView({ notes, onOpenAddNote, onDeleteNote }: NotesViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Study & Lecture Notes</h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Save formulas, Drive links, reminders, or quick lecture points.
          </p>
        </div>
        <button
          onClick={onOpenAddNote}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/25"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="p-12 rounded-2xl card-surface text-center">
          <p className="text-sm font-medium text-stone-600 dark:text-zinc-300">No notes yet.</p>
          <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">
            Create a note to keep synced across your devices.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl card-surface hover:border-teal-500/40 dark:hover:border-teal-400/35 hover:shadow-[0_12px_36px_rgba(20,184,166,0.1)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-500/12 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300 border border-teal-500/25">
                    {note.course_code}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    title="Delete note"
                    className="btn-tactile text-stone-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/12 active:bg-rose-500/25 active:text-rose-500 p-2 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-base">{note.title}</h3>
                <p className="text-sm text-stone-600 dark:text-zinc-300 mt-2 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-4 pt-2.5 border-t border-stone-200/70 dark:border-white/[0.07]">
                Added {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}