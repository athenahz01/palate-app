/**
 * Beli-style Ranking System for Palate App
 * Uses comparative ranking to generate scores from 0-10
 * 
 * How it works:
 * 1. User compares new item against existing items
 * 2. Based on comparisons, we calculate relative position
 * 3. Convert position to score (0-10 scale)
 * 4. Top item always gets 10.0
 */

/**
 * Calculate score based on rank position (Beli algorithm)
 * @param {number} rank - Position in ranking (1 = best)
 * @param {number} totalItems - Total number of items
 * @returns {number} Score from 0.0 to 10.0
 */
export function calculateScoreFromRank(rank, totalItems) {
    if (rank === 1) return 10.0;
    
    // Beli uses a decay curve where scores drop off gradually
    // Top 5 items stay in high range (8.0-10.0)
    // Items 6-20 are in mid range (6.0-8.0)
    // Items 21+ are in lower range (3.0-6.0)
    
    if (rank === 2) return 9.5;
    if (rank === 3) return 9.0;
    if (rank === 4) return 8.5;
    if (rank === 5) return 8.0;
    
    // For ranks 6-10: gradual decline
    if (rank <= 10) {
      return 8.0 - ((rank - 5) * 0.3); // 8.0 → 6.5
    }
    
    // For ranks 11-20: slower decline
    if (rank <= 20) {
      return 6.5 - ((rank - 10) * 0.15); // 6.5 → 5.0
    }
    
    // For ranks 21+: minimal decline
    const maxRank = Math.max(totalItems, 50);
    const remaining = maxRank - 20;
    const declinePerRank = 2.0 / remaining; // From 5.0 to 3.0
    
    return Math.max(3.0, 5.0 - ((rank - 20) * declinePerRank));
  }
  
  /**
   * Process comparison results to determine new item's rank
   * @param {Object} comparisonResults - Results from comparison screen
   * @param {Array} existingItems - Current ranked items
   * @returns {number} New rank position
   */
  export function calculateRankFromComparisons(comparisonResults, existingItems) {
    const { wins, losses, itemsCompared } = comparisonResults;
    
    if (existingItems.length === 0) {
      return 1; // First item
    }
    
    // Simple case: second item
    if (existingItems.length === 1) {
      return wins > losses ? 1 : 2;
    }
    
    // For multiple items, use win rate to determine position
    const winRate = wins / (wins + losses);
    
    // Map win rate to position
    // 100% wins → rank 1
    // 0% wins → rank last
    const estimatedRank = Math.ceil((1 - winRate) * (existingItems.length + 1));
    
    return Math.max(1, Math.min(estimatedRank, existingItems.length + 1));
  }
  
  /**
   * Recalculate all scores when rankings change
   * @param {Array} items - Array of items with rank property
   * @returns {Array} Items with updated scores
   */
  export function recalculateAllScores(items) {
    const sorted = [...items].sort((a, b) => a.rank - b.rank);
    
    return sorted.map(item => ({
      ...item,
      score: calculateScoreFromRank(item.rank, sorted.length)
    }));
  }
  
  /**
   * Shift ranks when inserting new item
   * @param {Array} items - Existing items
   * @param {number} insertAtRank - Where to insert new item
   * @returns {Array} Items with adjusted ranks
   */
  export function shiftRanks(items, insertAtRank) {
    return items.map(item => ({
      ...item,
      rank: item.rank >= insertAtRank ? item.rank + 1 : item.rank
    }));
  }
  
  /**
   * Format score for display (one decimal place)
   * @param {number} score 
   * @returns {string}
   */
  export function formatScore(score) {
    return score.toFixed(1);
  }
  
  /**
   * Get color class based on score
   * @param {number} score 
   * @returns {string} Tailwind classes
   */
  export function getScoreColor(score) {
    if (score >= 9.0) return 'text-green-600 bg-green-50';
    if (score >= 8.0) return 'text-emerald-600 bg-emerald-50';
    if (score >= 7.0) return 'text-blue-600 bg-blue-50';
    if (score >= 6.0) return 'text-indigo-600 bg-indigo-50';
    if (score >= 5.0) return 'text-purple-600 bg-purple-50';
    return 'text-gray-600 bg-gray-50';
  }
  
  /**
   * Initialize comparison pairs for new item
   * Uses smart selection to minimize comparisons needed
   * @param {Array} existingItems - Sorted by rank
   * @returns {Array} Items to compare against
   */
  export function selectComparisonItems(existingItems) {
    if (existingItems.length === 0) return [];
    if (existingItems.length === 1) return [existingItems[0]];
    
    // For 2-5 items: compare against all
    if (existingItems.length <= 5) {
      return existingItems;
    }
    
    // For 6-10 items: compare against top 3, middle, bottom 2
    if (existingItems.length <= 10) {
      return [
        existingItems[0], // #1
        existingItems[1], // #2
        existingItems[2], // #3
        existingItems[Math.floor(existingItems.length / 2)], // middle
        existingItems[existingItems.length - 2], // second to last
        existingItems[existingItems.length - 1], // last
      ];
    }
    
    // For 11+ items: use binary search approach
    // Compare against strategic positions
    return [
      existingItems[0], // #1
      existingItems[Math.floor(existingItems.length * 0.25)], // 25th percentile
      existingItems[Math.floor(existingItems.length * 0.5)], // median
      existingItems[Math.floor(existingItems.length * 0.75)], // 75th percentile
      existingItems[existingItems.length - 1], // last
    ];
  }
  
  /**
   * Helper to determine if more comparisons are needed
   * @param {Object} comparisonState 
   * @returns {boolean}
   */
  export function needsMoreComparisons(comparisonState) {
    const { completedComparisons, totalComparisons, confidence } = comparisonState;
    
    // Need at least 3 comparisons
    if (completedComparisons < 3) return true;
    
    // If we have high confidence (70%+), we can stop
    if (confidence >= 0.7) return false;
    
    // Otherwise keep going until we complete all planned comparisons
    return completedComparisons < totalComparisons;
  }