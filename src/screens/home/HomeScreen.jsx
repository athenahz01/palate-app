import { useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart } from '../../components/RadarChart';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { Card } from '../../components/ui/Card';
import { getCategoryById } from '../../data/categories';

export function HomeScreen({ 
  userProfile, 
  onNavigate,
  getItemsForCategory,
  getRadarForCategory
}) {
  console.log('HomeScreen rendering with profile:', userProfile);
  
  // Safety checks
  if (!userProfile || !userProfile.primaryCategory) {
    console.error('HomeScreen: Invalid userProfile', userProfile);
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-slate">Loading your cellar...</p>
      </div>
    );
  }

  const [activeCategory, setActiveCategory] = useState(userProfile.primaryCategory);
  
  const cat = getCategoryById(activeCategory);
  
  if (!cat) {
    console.error('HomeScreen: Category not found:', activeCategory);
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-slate">Error loading category...</p>
      </div>
    );
  }

  const items = getItemsForCategory(activeCategory) || [];
  const radarData = getRadarForCategory(activeCategory) || {};
  
  console.log('HomeScreen - activeCategory:', activeCategory);
  console.log('HomeScreen - items:', items);
  console.log('HomeScreen - radarData:', radarData);

  // If no items, show welcome message
  const hasItems = items && items.length > 0;

  return (
    <div className="min-h-screen pb-28 bg-cream">
      {/* Radar Section */}
      <div className="bg-white pt-16 pb-8 mb-6">
        <p className="font-serif text-slate text-center mb-4">Your Signature</p>
        
        <div className="flex justify-center mb-6">
          <RadarChart
            data={radarData}
            attributes={cat.radarAttributes}
            color={cat.color}
            size={220}
          />
        </div>

        {/* Category Tabs */}
        <div className="px-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 justify-center">
            {userProfile.selectedCategories.map(catId => {
              const category = getCategoryById(catId);
              if (!category) return null;
              return (
                <CategoryBadge
                  key={catId}
                  icon={category.icon}
                  name={category.name}
                  color={category.color}
                  active={activeCategory === catId}
                  onClick={() => setActiveCategory(catId)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Treasured */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">Recently Treasured</h3>
          <button
            onClick={() => onNavigate('collection')}
            className="text-sm font-bold"
            style={{ color: cat.color }}
          >
            View All
          </button>
        </div>

        {hasItems ? (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
            {items.slice(0, 8).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-40"
              >
                <div className="w-40 h-56 bg-white border border-stone rounded-xl mb-2 flex items-start justify-start p-2">
                  <div
                    className="px-2 py-1 rounded-md text-xs font-bold"
                    style={{
                      background: '#FAF9F7',
                      color: cat.color
                    }}
                  >
                    #{item.rank}
                  </div>
                </div>
                <p className="font-serif text-sm mb-1 truncate">{item.name}</p>
                <p className="text-xs text-slate truncate">{item.producer}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-stone"
          >
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h3 className="font-serif text-xl mb-2">Start Your Collection</h3>
            <p className="text-sm text-slate mb-6">
              Log your first {cat.name.toLowerCase()} to see it here
            </p>
            <button
              onClick={() => onNavigate('log')}
              className="px-6 py-3 rounded-full font-medium text-white"
              style={{ backgroundColor: cat.color }}
            >
              + Log Your First
            </button>
          </motion.div>
        )}
      </div>

      {/* Sommelier Card */}
      <div className="px-6 mt-6">
        <Card
          onClick={() => onNavigate('sommelier')}
          className="flex items-center gap-4"
          style={{ backgroundColor: cat.color }}
        >
          <div className="flex-1">
            <p className="font-bold text-white mb-2">Ask Your Sommelier</p>
            <p className="text-sm text-white/80">Get personalized recommendations</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl flex-shrink-0">
            {cat.icon}
          </div>
        </Card>
      </div>

      {/* Quick Scan Button - Add before Floating Nav */}
      <button
        onClick={() => onNavigate('scan-quick')}
        className='fixed bottom-28 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl z-40 hover:scale-110 transition-transform'
        style={{ backgroundColor: cat.color }}
      >
        📸
      </button>

      {/* Floating Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl px-2 py-2 flex gap-1 z-50">
        <button className="px-6 py-3 rounded-full bg-wine text-white text-sm font-medium">
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