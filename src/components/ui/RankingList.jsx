import React from 'react';
import { motion } from 'framer-motion';
import { formatScore, getScoreColor } from '../../utils/rankingSystem';

/**
 * RankingList - Display ranked items with Beli-style scores
 * Shows below the radar chart for each category
 */
export function RankingList({ items, category, onItemClick, maxDisplay = 10 }) {
  // Sort by rank (lowest rank number = best)
  const sortedItems = [...items]
    .filter(item => item.category === category)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, maxDisplay);

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-8 text-sand">
        <p className="text-sm">No items ranked yet</p>
        <p className="text-xs mt-2">Start by logging your first {category}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-serif text-lg">Your Rankings</h3>
        <span className="text-sand text-xs">{items.length} items</span>
      </div>

      {sortedItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onItemClick?.(item)}
          className="bg-stone rounded-xl p-4 hover:bg-opacity-90 transition-all cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {/* Rank Number */}
            <div className="flex-shrink-0 w-10 h-10 bg-charcoal rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">#{item.rank}</span>
            </div>

            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-serif font-semibold text-base truncate">
                {item.name}
              </h4>
              
              {item.producer && (
                <p className="text-sand text-sm truncate mt-0.5">{item.producer}</p>
              )}
              
              {item.vintage && (
                <p className="text-sand text-xs mt-1">{item.vintage}</p>
              )}

              {/* Quick details */}
              <div className="flex items-center gap-3 mt-2">
                {item.price && (
                  <span className="text-xs text-sand">
                    ${item.price}
                  </span>
                )}
                {item.location && (
                  <span className="text-xs text-sand">
                    📍 {item.location}
                  </span>
                )}
                {item.date && (
                  <span className="text-xs text-sand">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Score Badge */}
            <div className="flex-shrink-0">
              <div className={`px-3 py-1.5 rounded-full ${getScoreColor(item.score)}`}>
                <span className="font-bold text-sm">{formatScore(item.score)}</span>
              </div>
            </div>
          </div>

          {/* Memory snippet if exists */}
          {item.notes && (
            <p className="text-sand text-xs mt-3 line-clamp-2 italic pl-13">
              "{item.notes}"
            </p>
          )}
        </motion.div>
      ))}

      {/* View All if there are more items */}
      {items.length > maxDisplay && (
        <button className="w-full text-center text-sand text-sm py-3 hover:text-white transition-colors">
          View all {items.length} →
        </button>
      )}
    </div>
  );
}

/**
 * CompactRankingList - Minimal version for dashboard
 */
export function CompactRankingList({ items, category, maxDisplay = 3 }) {
  const sortedItems = [...items]
    .filter(item => item.category === category)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, maxDisplay);

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-4 text-sand text-xs">
        No items yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 py-2 px-3 bg-stone rounded-lg"
        >
          <span className="text-xs font-bold text-sand w-6">#{item.rank}</span>
          <span className="text-sm text-white flex-1 truncate font-serif">
            {item.name}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreColor(item.score)}`}>
            {formatScore(item.score)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RankingList;