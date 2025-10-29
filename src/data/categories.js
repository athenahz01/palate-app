export const CATEGORIES = [
    { 
      id: 'wine', 
      name: 'Wine', 
      icon: '🍷', 
      color: '#8B2E2E',
      radarAttributes: ['Body', 'Tannin', 'Acidity', 'Fruit', 'Earth']
    },
    { 
      id: 'whiskey', 
      name: 'Whiskey', 
      icon: '🥃', 
      color: '#B8860B',
      radarAttributes: ['Smoke', 'Proof', 'Sweet', 'Oak', 'Age']
    },
    { 
      id: 'cocktails', 
      name: 'Cocktails', 
      icon: '🍸', 
      color: '#2C5F3F',
      radarAttributes: ['Spirit', 'Sweet', 'Complex', 'Fresh', 'Strong']
    },
    { 
      id: 'spirits', 
      name: 'Spirits', 
      icon: '🍹', 
      color: '#4A90A4',
      radarAttributes: ['Bold', 'Herbal', 'Smooth', 'Mixed', 'Exotic']
    },
    { 
      id: 'champagne', 
      name: 'Champagne', 
      icon: '🥂', 
      color: '#D4AF37',
      radarAttributes: ['Dry', 'Body', 'Bubbles', 'Age', 'Prestige']
    },
    { 
      id: 'beer', 
      name: 'Beer', 
      icon: '🍺', 
      color: '#C17C28',
      radarAttributes: ['Bitter', 'Body', 'ABV', 'Dark', 'Hop']
    },
  ];
  
  export const getCategoryById = (id) => {
    return CATEGORIES.find(cat => cat.id === id);
  };
  
  export const getCategoryColor = (id) => {
    const category = getCategoryById(id);
    return category ? category.color : '#8B2E2E';
  };