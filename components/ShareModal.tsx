import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all p-6">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Share Note</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
        </div>
        <div className="mt-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Anyone with this link can view this note. The link does not expire.</p>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-grow bg-transparent outline-none text-gray-800 dark:text-gray-200"
            />
            <button onClick={handleCopy} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {copied ? <FiCheck color="#22c55e" /> : <FiCopy color="#6b7280" />}
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
