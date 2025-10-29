import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { getCategoryById } from '../../data/categories';

export function CollectionView({ 
  userProfile, 
  onBack, 
  onNavigate,
  getItemsForCategory 
}) {
  return (
    <div className="min-h-screen pb-28 bg-cream">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-stone px-6 py-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-2xl hover:text-wine transition-colors"
          >
            ←
          </button>
          <h2 className="font-serif text-2xl">Your Collections</h2>
        </div>
      </div>

      {/* Collections */}
      <div className="px-6 py-6 space-y-4">
        {userProfile.selectedCategories.map((catId, index) => {
          const cat = getCategoryById(catId);
          const items = getItemsForCategory(catId);
          
          return (
            <motion.div
              key={catId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => {/* Navigate to category detail */}}
                className="border-l-4"
                style={{ borderLeftColor: cat.color }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{cat.icon}</div>
                    <div>
                      <p className="font-bold text-lg" style={{ color: cat.color }}>
                        {cat.name}
                      </p>
                      <p className="text-sm text-slate">{items.length} logged</p>
                    </div>
                  </div>
                  <div className="text-xl text-slate">→</div>
                </div>

                {items.length > 0 && (
                  <div className="pl-14">
                    <p className="text-sm text-slate mb-1">Top ranked:</p>
                    <p className="font-serif">{items[0].name}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl px-2 py-2 flex gap-1 z-50">
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 rounded-full hover:bg-stone/50 text-sm font-medium transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('log')}
          className="px-6 py-3 rounded-full hover:bg-stone/50 text-sm font-medium transition-colors"
        >
          + Log
        </button>
        <button
          onClick={() => onNavigate('sommelier')}
          className="px-6 py-3 rounded-full hover:bg-stone/50 text-sm font-medium transition-colors"
        >
          AI
        </button>
      </div>
    </div>
  );
}