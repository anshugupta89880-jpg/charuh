/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeartCraftCard } from './types/card';
import { DEMO_CARD, decodeCardFromHash, getCardFromStorage, saveCardToStorage } from './utils/storage';
import { CreatorStudio } from './components/creator/CreatorStudio';
import { RecipientExperience } from './components/recipient/RecipientExperience';
import { Eye, Edit3, ArrowLeft } from 'lucide-react';

export default function App() {
  const [card, setCard] = useState<HeartCraftCard>(() => {
    // Check initial hash
    if (window.location.hash) {
      const decoded = decodeCardFromHash(window.location.hash);
      if (decoded) return decoded;
    }
    // Check local storage or demo card
    return DEMO_CARD;
  });

  const [activeView, setActiveView] = useState<'editor' | 'recipient'>(() => {
    // If hash contains recipient or view=recipient, start in recipient mode
    if (window.location.hash.includes('recipient') || window.location.search.includes('recipient')) {
      return 'recipient';
    }
    return 'editor';
  });

  // Listen to hash changes (for shared links or browser navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('recipient') || hash.includes('card=')) {
        const decoded = decodeCardFromHash(hash);
        if (decoded) {
          setCard(decoded);
          setActiveView('recipient');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLaunchRecipientView = () => {
    saveCardToStorage(card);
    setActiveView('recipient');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEditor = () => {
    setActiveView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans-modern text-slate-800 antialiased selection:bg-rose-200 selection:text-rose-900">
      
      {/* Floating Mode Switcher Badge (Top Left) */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-1.5 p-1 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg border border-slate-200/80 text-xs">
        {activeView === 'recipient' ? (
          <button
            onClick={handleBackToEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all font-semibold active:scale-95"
            title="Return to HeartCraft Studio Editor"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
            <span>Studio Editor</span>
          </button>
        ) : (
          <button
            onClick={handleLaunchRecipientView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition-all font-semibold active:scale-95"
            title="Preview What Recipient Sees"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Test Recipient View</span>
          </button>
        )}
      </div>

      {/* Render Active View */}
      {activeView === 'editor' ? (
        <CreatorStudio
          card={card}
          onChange={setCard}
          onLaunchRecipientView={handleLaunchRecipientView}
        />
      ) : (
        <RecipientExperience
          card={card}
          onExitToEditor={handleBackToEditor}
        />
      )}
    </div>
  );
}
