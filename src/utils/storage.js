import { recalculateAllScores, shiftRanks, calculateScoreFromRank } from './rankingSystem';

const STORAGE_KEYS = {
  WINE_ITEMS: 'palate_wine_items',
  WHISKEY_ITEMS: 'palate_whiskey_items',
  COCKTAIL_ITEMS: 'palate_cocktail_items',
  BEER_ITEMS: 'palate_beer_items',
  USER_PROFILE: 'palate_user_profile',
};

/**
 * Get storage key for a category
 */
function getStorageKey(category) {
  const key = `${category.toUpperCase()}_ITEMS`;
  return STORAGE_KEYS[key] || STORAGE_KEYS.WINE_ITEMS;
}

/**
 * Load items for a specific category
 */
export function loadItems(category) {
  try {
    const key = getStorageKey(category);
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const items = JSON.parse(data);
    // Ensure all items have required properties
    return items.map(item => ({
      ...item,
      rank: item.rank || 1,
      score: item.score || 10.0,
      category: item.category || category,
    }));
  } catch (error) {
    console.error('Error loading items:', error);
    return [];
  }
}

/**
 * Save items for a specific category
 */
export function saveItems(category, items) {
  try {
    const key = getStorageKey(category);
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving items:', error);
    return false;
  }
}

/**
 * Add a new item with proper ranking
 */
export function addItem(category, newItem, rank) {
  const existingItems = loadItems(category);
  
  // Shift existing items' ranks to make room
  const shiftedItems = shiftRanks(existingItems, rank);
  
  // Create the new item with rank and score
  const itemWithRank = {
    ...newItem,
    id: newItem.id || Date.now().toString(),
    category,
    rank,
    score: calculateScoreFromRank(rank, shiftedItems.length + 1),
    createdAt: new Date().toISOString(),
  };
  
  // Add the new item
  const updatedItems = [...shiftedItems, itemWithRank];
  
  // Recalculate all scores
  const itemsWithScores = recalculateAllScores(updatedItems);
  
  // Save
  saveItems(category, itemsWithScores);
  
  return itemWithRank;
}

/**
 * Update an existing item
 */
export function updateItem(category, itemId, updates) {
  const items = loadItems(category);
  const updatedItems = items.map(item =>
    item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
  );
  
  saveItems(category, updatedItems);
  return updatedItems.find(item => item.id === itemId);
}

/**
 * Delete an item and recalculate rankings
 */
export function deleteItem(category, itemId) {
  const items = loadItems(category);
  const itemToDelete = items.find(item => item.id === itemId);
  
  if (!itemToDelete) return false;
  
  // Remove the item
  const filteredItems = items.filter(item => item.id !== itemId);
  
  // Shift ranks down for items that were below the deleted item
  const adjustedItems = filteredItems.map(item => ({
    ...item,
    rank: item.rank > itemToDelete.rank ? item.rank - 1 : item.rank
  }));
  
  // Recalculate scores
  const itemsWithScores = recalculateAllScores(adjustedItems);
  
  saveItems(category, itemsWithScores);
  return true;
}

/**
 * Re-rank an item (when user manually changes position)
 */
export function reRankItem(category, itemId, newRank) {
  const items = loadItems(category);
  const item = items.find(i => i.id === itemId);
  
  if (!item) return false;
  
  const oldRank = item.rank;
  
  // Remove item from old position
  const withoutItem = items.filter(i => i.id !== itemId);
  
  // Adjust ranks based on movement
  const adjustedItems = withoutItem.map(i => {
    if (oldRank < newRank) {
      // Moving down: shift items between old and new position up
      if (i.rank > oldRank && i.rank <= newRank) {
        return { ...i, rank: i.rank - 1 };
      }
    } else {
      // Moving up: shift items between new and old position down
      if (i.rank >= newRank && i.rank < oldRank) {
        return { ...i, rank: i.rank + 1 };
      }
    }
    return i;
  });
  
  // Insert item at new position
  const updatedItem = { ...item, rank: newRank };
  const allItems = [...adjustedItems, updatedItem];
  
  // Recalculate scores
  const itemsWithScores = recalculateAllScores(allItems);
  
  saveItems(category, itemsWithScores);
  return updatedItem;
}

/**
 * Get statistics for a category
 */
export function getCategoryStats(category) {
  const items = loadItems(category);
  
  if (items.length === 0) {
    return {
      totalItems: 0,
      averageScore: 0,
      topItem: null,
      recentItems: [],
    };
  }
  
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  const averageScore = items.reduce((sum, item) => sum + item.score, 0) / items.length;
  const recent = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  return {
    totalItems: items.length,
    averageScore: averageScore.toFixed(1),
    topItem: sorted[0],
    recentItems: recent,
  };
}

/**
 * Export all data (for backup)
 */
export function exportAllData() {
  const data = {
    wine: loadItems('wine'),
    whiskey: loadItems('whiskey'),
    cocktail: loadItems('cocktail'),
    beer: loadItems('beer'),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Import data (from backup)
 */
export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.wine) saveItems('wine', data.wine);
    if (data.whiskey) saveItems('whiskey', data.whiskey);
    if (data.cocktail) saveItems('cocktail', data.cocktail);
    if (data.beer) saveItems('beer', data.beer);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

/**
 * Clear all data for a category
 */
export function clearCategory(category) {
  const key = getStorageKey(category);
  localStorage.removeItem(key);
  return true;
}

/**
 * Get all items across all categories
 */
export function getAllItems() {
  return {
    wine: loadItems('wine'),
    whiskey: loadItems('whiskey'),
    cocktail: loadItems('cocktail'),
    beer: loadItems('beer'),
  };
}

export default {
  loadItems,
  saveItems,
  addItem,
  updateItem,
  deleteItem,
  reRankItem,
  getCategoryStats,
  exportAllData,
  importData,
  clearCategory,
  getAllItems,
};