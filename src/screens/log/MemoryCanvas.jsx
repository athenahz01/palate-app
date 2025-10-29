import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { getCategoryById } from '../../data/categories';

export function MemoryCanvas({ 
  isOpen, 
  onClose, 
  category, 
  onComplete, 
  capturedPhoto = null,
  extractedData = null // NEW: AI-extracted data
}) {
  const [formData, setFormData] = useState({
    name: '',
    producer: '',
    vintage: '',
    type: '',
    where: '',
    when: '',
    with: '',
    notes: '',
    photo: capturedPhoto
  });

  const [showExtractedBanner, setShowExtractedBanner] = useState(false);

  const cat = getCategoryById(category);

  // Auto-fill from extracted data
  useEffect(() => {
    if (extractedData) {
      console.log('Auto-filling from extracted data:', extractedData);
      
      setFormData(prev => ({
        ...prev,
        name: extractedData.name || prev.name,
        producer: extractedData.producer || prev.producer,
        vintage: extractedData.vintage || prev.vintage,
        type: extractedData.type || prev.type,
      }));

      setShowExtractedBanner(true);
      
      // Hide banner after 3 seconds
      setTimeout(() => {
        setShowExtractedBanner(false);
      }, 3000);
    }
  }, [extractedData]);

  const handleSubmit = () => {
    onComplete(formData);
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: null });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onClose}
          className="text-slate hover:text-charcoal transition-colors"
        >
          ← Back
        </button>
        <h2 className="font-serif text-xl">Capture Memory</h2>
        <div className="w-16" />
      </div>

      {/* AI Success Banner */}
      {showExtractedBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <span className="text-2xl">✨</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">Label scanned!</p>
            <p className="text-xs text-green-700">Information auto-filled. Edit as needed.</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-2">{cat.icon}</div>
        <p className="font-serif font-bold text-lg" style={{ color: cat.color }}>
          Your {cat.name}
        </p>
      </motion.div>

      {/* Photo Preview */}
      {formData.photo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 relative"
        >
          <img
            src={formData.photo}
            alt="Bottle"
            className="w-full h-48 object-cover rounded-xl"
          />
          <button
            onClick={handleRemovePhoto}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}

      <div className="space-y-5 mb-8 max-h-96 overflow-y-auto">
        <div>
          <label className="text-sm text-slate mb-2 block">🏷️ Name *</label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
            placeholder="What is it called?"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-slate mb-2 block">🏢 Producer / Place</label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
            placeholder="Who made it or where from?"
            value={formData.producer}
            onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
          />
        </div>

        {/* Vintage & Type Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate mb-2 block">📅 Vintage</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
              placeholder="Year"
              value={formData.vintage}
              onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate mb-2 block">🍷 Type</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
              placeholder="Cabernet..."
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate mb-2 block">📍 Where</label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
            placeholder="Where were you?"
            value={formData.where}
            onChange={(e) => setFormData({ ...formData, where: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-slate mb-2 block">📅 When</label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
            placeholder="When was this?"
            value={formData.when}
            onChange={(e) => setFormData({ ...formData, when: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-slate mb-2 block">👥 With whom</label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
            placeholder="Who shared this moment?"
            value={formData.with}
            onChange={(e) => setFormData({ ...formData, with: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-slate mb-2 block">💭 How it made you feel</label>
          <textarea
            className="w-full px-4 py-3 border-2 border-stone rounded-xl font-serif focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all min-h-[120px] resize-y"
            placeholder="Transport yourself back..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        color={cat.color}
        className="w-full"
        disabled={!formData.name}
      >
        Save to Cellar
      </Button>
    </Modal>
  );
}