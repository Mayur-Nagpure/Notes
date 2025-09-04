import { useState, useEffect } from 'react';
import { Note } from '../types';

interface NoteEditorModalProps {
  note: Partial<Note>;
  onSave: (noteData: { title: string; content: string }) => void;
  onClose: () => void;
}

export const NoteEditorModal = ({ note, onSave, onClose }: NoteEditorModalProps) => {
  const [title, setTitle] = useState(note.title ?? '');
  const [content, setContent] = useState(note.content ?? '');

  useEffect(() => {
    setTitle(note.title ?? '');
    setContent(note.content ?? '');
  }, [note]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#23293a] text-white rounded-xl shadow-2xl p-6 w-full max-w-lg border border-[#374151]">
        <h2 className="text-2xl font-bold mb-4">
          {note && note.id ? 'Edit Note' : 'Create Note'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-[#262f41] border border-[#374151] text-white rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Note Title"
            required
            autoFocus
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 bg-[#262f41] border border-[#374151] text-white rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Note Content"
            required
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim() === '' || content.trim() === '') {
                alert('Title and content are required.');
                return;
              }
              onSave({ ...note, title, content });
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
