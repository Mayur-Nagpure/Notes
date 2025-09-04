
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';

const PublicNotePage = () => {
  const { shareToken } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicNote = async () => {
      if (!shareToken) {
        setError('No share token provided.');
        setIsLoading(false);
        return;
      }
      try {
        const fetchedNote = await api.getPublicNote(shareToken);
        setNote(fetchedNote);
      } catch (err) {
        setError(err.message || 'Could not load the shared note. It may have been deleted or the link is invalid.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicNote();
  }, [shareToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Error</h2>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 my-8">
      {note ? (
        <>
          <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated on {new Date(note.updatedAt).toLocaleString()}
          </p>
          <div 
            className="prose dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br />') }}
          />
        </>
      ) : (
        <p>Note not found.</p>
      )}
    </div>
  );
};

export default PublicNotePage;
