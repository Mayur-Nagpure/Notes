import { useAuth } from '../hooks/useAuth';
import { Note } from '../types';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';
import { useEffect, useState } from 'react';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorModal } from '../components/NoteEditorModal';
import { shareNote } from '../services/api';
import ShareModal from '@/components/ShareModal';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Handle create
  const handleCreate = async (title: string, content: string) => {
    try {
      const newNote = await createNote({ title, content });
      setNotes([newNote, ...notes]);
      setShowCreateModal(false); // Close create modal
    } catch (error) {
      alert('Failed to create note');
      console.error(error);
    }
  };

  const handleShare = async (note: Note) => {
  try {
    const shareToken = await shareNote(note.id);
    const url = `${window.location.origin}/share/${shareToken}`;
    setShareUrl(url);
    setShareModalOpen(true); // open the modal
    // No need to copy here (user will do so from the modal)
  } catch (e) {
    alert('Could not create or copy share link.');
  }
};


  // Handle update/edit
  const handleEditSave = async (note: Note) => {
    try {
      const updatedNote = await updateNote(note.id, note);
      setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
      setEditingNote(null); // Close edit modal
    } catch (error) {
      alert('Failed to update note');
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number | string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      alert('Failed to delete note');
      console.error(error);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-[#111827] text-white">

      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Welcome, {user?.username || 'User'}!</h1>
        <h1 className="text-xl font-bold">Ready to take notes? 📝</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold"
          >
            Create New Note
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-8">
        {isLoading ? (
          <p className="text-center">Loading notes...</p>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div key={note.id}>
                <NoteCard
                  note={note}
                  onEdit={() => setEditingNote(note)}
                  onDelete={() => handleDelete(note.id)}
                  onShare={() => handleShare(note)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            You don't have any notes yet. Click "Create New Note" to get started!
          </p>
        )}
      </main>

      {/* Create Note Modal */}
      {showCreateModal && (
        <NoteEditorModal
          note={{ title: '', content: '' }}
          onSave={(note) => handleCreate(note.title, note.content)}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <NoteEditorModal
          note={editingNote}
          onSave={handleEditSave}
          onClose={() => setEditingNote(null)}
        />
      )}

      <ShareModal
      isOpen={shareModalOpen}
      shareUrl={shareUrl}
      onClose={() => setShareModalOpen(false)}
    />
    </div>
  );
};

export default DashboardPage;

