// Mock items for demo/testing purposes
export const MOCK_ITEMS = {
    wine: [
      { 
        id: 'wine-1', 
        name: '2019 Chambertin', 
        producer: 'Domaine Leroy', 
        category: 'wine', 
        rank: 1,
        properties: { Body: 0.9, Tannin: 0.8, Acidity: 0.7, Fruit: 0.6, Earth: 0.9 },
        memory: {
          where: 'Burgundy, France',
          when: 'October 2024',
          with: 'Sarah & Marc',
          notes: 'Ethereal and profound. A wine that stops time.'
        }
      },
      { 
        id: 'wine-2', 
        name: '2020 Barolo Riserva', 
        producer: 'Giacomo Conterno', 
        category: 'wine', 
        rank: 2,
        properties: { Body: 0.95, Tannin: 0.9, Acidity: 0.8, Fruit: 0.5, Earth: 0.85 },
        memory: {
          where: 'Turin Restaurant, NYC',
          when: 'September 2024',
          with: 'Birthday celebration',
          notes: 'Powerful yet elegant. Tar and roses.'
        }
      },
      { 
        id: 'wine-3', 
        name: '2018 Napa Cab', 
        producer: 'Screaming Eagle', 
        category: 'wine', 
        rank: 3,
        properties: { Body: 1.0, Tannin: 0.85, Acidity: 0.6, Fruit: 0.9, Earth: 0.4 },
        memory: {
          where: 'Napa Valley',
          when: 'August 2024',
          with: 'Wine club trip',
          notes: 'Opulent and lush. California sunshine in a glass.'
        }
      },
    ],
    whiskey: [
      { 
        id: 'whiskey-1', 
        name: 'Yamazaki 18', 
        producer: 'Suntory', 
        category: 'whiskey', 
        rank: 1,
        properties: { Smoke: 0.2, Proof: 0.6, Sweet: 0.8, Oak: 0.9, Age: 0.9 },
        memory: {
          where: 'Tokyo, Japan',
          when: 'November 2024',
          with: 'Solo trip',
          notes: 'Silky smooth. Mizunara oak magic.'
        }
      },
      { 
        id: 'whiskey-2', 
        name: 'Lagavulin 16', 
        producer: 'Diageo', 
        category: 'whiskey', 
        rank: 2,
        properties: { Smoke: 1.0, Proof: 0.6, Sweet: 0.3, Oak: 0.8, Age: 0.8 },
        memory: {
          where: 'Edinburgh',
          when: 'October 2024',
          with: 'James',
          notes: 'Campfire dreams. Pure Islay soul.'
        }
      },
      { 
        id: 'whiskey-3', 
        name: 'Four Roses Single Barrel', 
        producer: 'Four Roses', 
        category: 'whiskey', 
        rank: 3,
        properties: { Smoke: 0.1, Proof: 0.7, Sweet: 0.7, Oak: 0.6, Age: 0.5 },
        memory: {
          where: 'Bourbon Bar, Louisville',
          when: 'September 2024',
          with: 'Bourbon trail group',
          notes: 'Spicy and approachable. Beautiful balance.'
        }
      },
    ],
    cocktails: [
      { 
        id: 'cocktail-1', 
        name: 'Negroni', 
        producer: 'Trick Dog, SF', 
        category: 'cocktails', 
        rank: 1,
        properties: { Spirit: 0.9, Sweet: 0.4, Complex: 0.8, Fresh: 0.5, Strong: 0.7 },
        memory: {
          where: 'Trick Dog, San Francisco',
          when: 'December 2024',
          with: 'Emma',
          notes: 'Perfect bitter balance. Best Negroni ever.'
        }
      },
      { 
        id: 'cocktail-2', 
        name: 'Old Fashioned', 
        producer: 'Your recipe', 
        category: 'cocktails', 
        rank: 2,
        properties: { Spirit: 1.0, Sweet: 0.6, Complex: 0.6, Fresh: 0.3, Strong: 0.8 },
        memory: {
          where: 'Home',
          when: 'January 2025',
          with: 'Friday night ritual',
          notes: 'My signature recipe with orange bitters.'
        }
      },
      { 
        id: 'cocktail-3', 
        name: 'Martini', 
        producer: 'Death & Co, NYC', 
        category: 'cocktails', 
        rank: 3,
        properties: { Spirit: 1.0, Sweet: 0.1, Complex: 0.4, Fresh: 0.7, Strong: 0.9 },
        memory: {
          where: 'Death & Co, NYC',
          when: 'November 2024',
          with: 'Date night',
          notes: 'Ice cold perfection. Stirred, not shaken.'
        }
      },
    ]
  };