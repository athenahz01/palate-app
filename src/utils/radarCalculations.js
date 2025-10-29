// Generate initial radar data from quiz answers
export function generateInitialRadar(answers, attributes) {
    const radarData = {};
    
    // This is simplified - in production you'd map specific answers to specific attributes
    // For now, generate based on intensity and flavor answers
    const intensity = answers.intensity || 0.5;
    const flavor = answers.flavor || 0.5;
    
    attributes.forEach((attr, index) => {
      // Vary each attribute slightly based on answers
      const variation = (index * 0.1) - 0.2;
      const base = (intensity + flavor) / 2;
      radarData[attr] = Math.max(0.3, Math.min(0.95, base + variation));
    });
    
    return radarData;
  }
  
  // Calculate evolved radar from logged items
  export function calculateEvolvedRadar(items, attributes) {
    if (!items || items.length === 0) {
      // Return default values
      const radar = {};
      attributes.forEach(attr => {
        radar[attr] = 0.6;
      });
      return radar;
    }
  
    // Average the top 3 items' properties
    const topItems = items.slice(0, Math.min(3, items.length));
    const radarData = {};
  
    attributes.forEach(attr => {
      const sum = topItems.reduce((acc, item) => {
        return acc + (item.properties?.[attr] || 0.5);
      }, 0);
      radarData[attr] = sum / topItems.length;
    });
  
    return radarData;
  }
  
  // Generate mock properties for a new item based on category
  export function generateMockProperties(categoryId, attributes) {
    const properties = {};
    attributes.forEach(attr => {
      // Random value between 0.3 and 0.9
      properties[attr] = 0.3 + Math.random() * 0.6;
    });
    return properties;
  }