import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, ChevronLeft } from 'lucide-react';
import { RadarChart } from '../../components/ui/RadarChart';
import { RankingList } from '../../components/ui/RankingList';
import { loadItems, getCategoryStats } from '../../utils/storage';
import { getCategoryById } from '../../data/categories';

export function CategoryDetailScreen({ categoryId, onBack, onAddNew }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [radarData, setRadarData] = useState(null);

  const category = getCategoryById(categoryId);

  // Load items on mount and when categoryId changes
  useEffect(() => {
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = () => {
    const loadedItems = loadItems(categoryId);
    setItems(loadedItems);
    
    const categoryStats = getCategoryStats(categoryId);
    setStats(categoryStats);
    
    // Calculate radar data from items
    const radar = calculateRadarFromItems(loadedItems, categoryId);
    setRadarData(radar);
  };

  // Calculate radar attributes from user's top items
  const calculateRadarFromItems = (items, categoryId) => {
    if (items.length === 0) {
      return getDefaultRadar(categoryId);
    }

    // Get top 10 items (they influence the profile most)
    const topItems = [...items]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10);

    // Different attributes per category
    const attributes = getCategoryAttributes(categoryId);
    
    // Calculate average values from top items
    // Return as object with attribute keys (matching your existing format)
    const radarObject = {};
    attributes.forEach(attr => {
      const avg = topItems.reduce((sum, item) => {
        return sum + (item.attributes?.[attr.key] || 5);
      }, 0) / topItems.length;
      
      radarObject[attr.key] = Math.round(avg * 10) / 10; // Round to 1 decimal
    });

    return radarObject;
  };

  // Get default radar for empty state
  const getDefaultRadar = (categoryId) => {
    const attributes = getCategoryAttributes(categoryId);
    const defaultRadar = {};
    attributes.forEach(attr => {
      defaultRadar[attr.key] = 5; // Neutral starting point
    });
    return defaultRadar;
  };

  // Category-specific attributes for radar chart
  const getCategoryAttributes = (categoryId) => {
    const attributeMap = {
      wine: [
        { key: 'body', label: 'Body' },
        { key: 'tannin', label: 'Tannin' },
        { key: 'acidity', label: 'Acidity' },
        { key: 'fruit', label: 'Fruit' },
        { key: 'earth', label: 'Earth' },
      ],
      whiskey: [
        { key: 'smoke', label: 'Smoke' },
        { key: 'proof', label: 'Proof' },
        { key: 'sweetness', label: 'Sweet' },
        { key: 'oak', label: 'Oak' },
        { key: 'spice', label: 'Spice' },
      ],
      cocktail: [
        { key: 'spiritForward', label: 'Spirit-Forward' },
        { key: 'sweet', label: 'Sweet' },
        { key: 'complex', label: 'Complex' },
        { key: 'refreshing', label: 'Refreshing' },
        { key: 'strong', label: 'Strong' },
      ],
      beer: [
        { key: 'bitter', label: 'Bitter' },
        { key: 'body', label: 'Body' },
        { key: 'abv', label: 'ABV' },
        { key: 'hoppy', label: 'Hoppy' },
        { key: 'malty', label: 'Malty' },
      ],
    };
    
    return attributeMap[categoryId] || attributeMap.wine;
  };

  const handleItemClick = (item) => {
    // Navigate to item detail screen (you can implement this later)
    console.log('View item:', item);
  };

  const handleAddNew = () => {
    // Trigger scan screen for this category
    if (onAddNew) {
      onAddNew(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-stone px-6 py-6 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="text-2xl hover:text-wine transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="font-serif text-3xl" style={{ color: category.color }}>
              {category.name}
            </h1>
          </div>
        </div>
        
        {stats && stats.totalItems > 0 && (
          <div className="flex items-center gap-4 text-slate text-sm pl-12">
            <span>{stats.totalItems} items</span>
            <span>·</span>
            <span>Avg: {stats.averageScore}</span>
            {stats.topItem && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  #{1}: {stats.topItem.name}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="px-6 py-20 text-center">
          <div className="text-6xl mb-6">{category.icon}</div>
          <h2 className="font-serif text-2xl mb-3">No {category.name} Yet</h2>
          <p className="text-slate mb-8">
            Start building your {category.name.toLowerCase()} collection
          </p>
          <button
            onClick={handleAddNew}
            className="px-8 py-3 rounded-full font-semibold text-white transition-colors"
            style={{ backgroundColor: category.color }}
          >
            + Log Your First {category.name}
          </button>
        </div>
      )}

      {/* Radar Chart Section */}
      {items.length > 0 && (
        <div className="px-6 py-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone">
            <h2 className="font-serif text-xl mb-6">
              Your Taste Profile
            </h2>
            
            {radarData && (
              <div className="flex justify-center">
                <RadarChart
                  radarData={radarData}
                  color={category.color}
                  size={280}
                />
              </div>
            )}
            
            <p className="text-slate text-xs text-center mt-6">
              Based on your top {Math.min(items.length, 10)} ranked items
            </p>
          </div>
        </div>
      )}

      {/* Ranking List Section */}
      {items.length > 0 && (
        <div className="px-6">
          <RankingList
            items={items}
            category={categoryId}
            onItemClick={handleItemClick}
            maxDisplay={20}
          />
        </div>
      )}

      {/* Floating Add Button */}
      {items.length > 0 && (
        <motion.button
          onClick={handleAddNew}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-white z-50"
          style={{ backgroundColor: category.color }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          <Plus size={24} />
        </motion.button>
      )}

      {/* Floating Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl px-2 py-2 flex gap-1 z-50">
        <button
          onClick={() => onBack()}
          className="px-6 py-3 rounded-full hover:bg-stone/50 text-sm font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 rounded-full hover:bg-stone/50 text-sm font-medium transition-colors"
        >
          + Log
        </button>
      </div>
    </div>
  );
}