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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Save formulas, Drive links, reminders, or quick lecture points.
          </p>
        </div>
        <button
          onClick={onOpenAddNote}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No notes yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Create a note to keep synced across your devices.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    {note.course_code}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-base">{note.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                Added {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}