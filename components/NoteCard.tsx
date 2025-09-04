import { FiEdit, FiTrash, FiShare2 } from 'react-icons/fi'; 
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export const NoteCard = ({ note, onEdit, onDelete, onShare }: NoteCardProps) => (
  <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 flex flex-col justify-between h-48">
    <div>
      <h3 className="text-xl font-bold mb-2">{note.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{note.content}</p>
    </div>
    <div className="flex gap-4 items-center text-gray-400">
      <span className="text-xs">
        Updated: {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : ''}
      </span>
      <button onClick={onEdit} title="Edit" className="hover:text-blue-400">
        <FiEdit />
      </button>
      <button onClick={onShare} title="Share" className="hover:text-blue-400">
        <FiShare2 />
      </button>
      <button onClick={onDelete} title="Delete" className="hover:text-red-600">
        <FiTrash />
      </button>
    </div>
  </div>
);
