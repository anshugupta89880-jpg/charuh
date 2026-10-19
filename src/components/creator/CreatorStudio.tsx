import React, { useState } from 'react';
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Eye, 
  FileEdit, 
  RotateCcw,
  Check,
  Music,
  Image as ImageIcon,
  MessageSquare,
  Lock,
  UserCheck,
  Sliders
} from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { Step1Details } from './Step1Details';
import { Step2Messages } from './Step2Messages';
import { Step3Photos } from './Step3Photos';
import { Step4Audio } from './Step4Audio';
import { Step5SecurityShare } from './Step5SecurityShare';
import { LiveCardPreview } from './LiveCardPreview';
import { DEMO_CARD, APOLOGY_PRESET_CARD, BIRTHDAY_PRESET_CARD, saveCardToStorage } from '../../utils/storage';
import { TemplateShowcaseModal } from '../animated/TemplateShowcaseModal';
import { FreeForeverBadge } from '../common/FreeForeverBadge';
import { MasterContentEditorModal } from './MasterContentEditorModal';

interface CreatorStudioProps {
  card: HeartCraftCard;
  onChange: (updated: HeartCraftCard) => void;
  onLaunchRecipientView: () => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  card,
  onChange,
  onLaunchRecipientView
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMasterEditor, setShowMasterEditor] = useState(false);

  const steps = [
    { number: 1, label: 'Recipient', icon: UserCheck, desc: 'Name & Occasion' },
    { number: 2, label: 'Message', icon: MessageSquare, desc: 'Notes & Typography' },
    { number: 3, label: 'Photos', icon: ImageIcon, desc: 'Polaroid Memories' },
    { number: 4, label: 'Audio', icon: Music, desc: 'YouTube Music' },
    { number: 5, label: 'Security', icon: Lock, desc: 'Password & Share' }
  ];

  const handleCardUpdate = (updates: Partial<HeartCraftCard>) => {
    const updated = { ...card, ...updates };
    onChange(updated);
    saveCardToStorage(updated);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onLaunchRecipientView();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadPreset = (preset: HeartCraftCard) => {
    const newCard: HeartCraftCard = {
      ...preset,
      id: `card-${Date.now()}`
    };
    onChange(newCard);
    saveCardToStorage(newCard);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* 100% Free Forever Guarantee Top Banner */}
      <FreeForeverBadge variant="banner" />

      {/* Top Studio Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & 100% Free Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                HeartCraft <span className="text-xs font-normal text-rose-500 font-script text-base">Studio</span>
              </span>
            </div>
            <FreeForeverBadge variant="pill" className="hidden lg:inline-flex" />
          </div>

          {/* Preset templates selector & Video Template Showcase button */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Select Template (As in Video)</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleLoadPreset(APOLOGY_PRESET_CARD)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors font-medium"
            >
              🥺 Apology
            </button>
            <button
              onClick={() => handleLoadPreset(DEMO_CARD)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors font-medium"
            >
              💖 Romantic
            </button>
            <button
              onClick={() => handleLoadPreset(BIRTHDAY_PRESET_CARD)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors font-medium"
            >
              🎂 Birthday
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Master Editor Button */}
            <button
              onClick={() => setShowMasterEditor(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
              title="Edit all texts, photos, videos, and fonts in one master view"
            >
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Edit Everything</span>
              <span className="sm:hidden">Edit All</span>
            </button>

            {/* Mobile View Switcher */}
            <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-xl text-xs font-medium">
              <button
                onClick={() => setMobileTab('editor')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  mobileTab === 'editor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  mobileTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Launch Recipient View CTA */}
            <button
              onClick={onLaunchRecipientView}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Recipient Screen</span>
              <span className="sm:hidden">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step Navigator Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
            {steps.map((st) => {
              const isCurrent = currentStep === st.number;
              const isDone = currentStep > st.number;
              const Icon = st.icon;

              return (
                <button
                  key={st.number}
                  type="button"
                  onClick={() => setCurrentStep(st.number)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-300'
                      : isDone
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : st.number}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold leading-tight">{st.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{st.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace: Form on Left, Live Mockup on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Editor (Visible when not previewing on mobile, always visible on desktop) */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              {currentStep === 1 && (
                <Step1Details card={card} onChange={handleCardUpdate} />
              )}
              {currentStep === 2 && (
                <Step2Messages card={card} onChange={handleCardUpdate} />
              )}
              {currentStep === 3 && (
                <Step3Photos card={card} onChange={handleCardUpdate} />
              )}
              {currentStep === 4 && (
                <Step4Audio card={card} onChange={handleCardUpdate} />
              )}
              {currentStep === 5 && (
                <Step5SecurityShare
                  card={card}
                  onChange={handleCardUpdate}
                  onOpenRecipientPreview={onLaunchRecipientView}
                />
              )}

              {/* Step Navigation Footer Controls */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400 font-medium">
                  Step {currentStep} of 5
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>{currentStep === 5 ? 'Launch Experience' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Phone Mockup Preview (Visible when previewing on mobile, always on desktop) */}
          <div
            className={`lg:col-span-5 flex justify-center ${
              mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <LiveCardPreview card={card} onTestFullView={onLaunchRecipientView} />
          </div>

        </div>
      </div>

      {/* Video Template Showcase Modal */}
      <TemplateShowcaseModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleLoadPreset}
      />

      {/* Master Content Editor Modal (Edit Everything) */}
      <MasterContentEditorModal
        isOpen={showMasterEditor}
        onClose={() => setShowMasterEditor(false)}
        card={card}
        onChange={handleCardUpdate}
      />
    </div>
  );
};
