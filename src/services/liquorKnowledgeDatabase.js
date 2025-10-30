/**
 * Liquor Knowledge Database
 * 
 * Reference database for liquor information to:
 * 1. Auto-fill accurate data when users scan labels
 * 2. Provide radar chart attributes automatically
 * 3. Give context about regions, producers, styles
 * 4. Enhance user experience with rich information
 */

// ============= WINE DATABASE =============

export const wineDatabase = {
    // BORDEAUX WINES
    "chateau margaux": {
      name: "Château Margaux",
      producer: "Château Margaux",
      region: "Margaux, Bordeaux",
      country: "France",
      grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"],
      classification: "First Growth (Premier Cru Classé)",
      type: "Red",
      attributes: {
        body: 9,
        tannin: 8,
        acidity: 7,
        fruit: 9,
        earth: 7
      },
      typicalPrice: 450,
      agingPotential: "30+ years",
      description: "One of Bordeaux's five First Growths, known for elegance and perfume"
    },
    
    "chateau latour": {
      name: "Château Latour",
      producer: "Château Latour",
      region: "Pauillac, Bordeaux",
      country: "France",
      grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"],
      classification: "First Growth (Premier Cru Classé)",
      type: "Red",
      attributes: {
        body: 10,
        tannin: 10,
        acidity: 8,
        fruit: 8,
        earth: 6
      },
      typicalPrice: 600,
      agingPotential: "50+ years",
      description: "Powerful and structured, the most age-worthy of the First Growths"
    },
  
    "opus one": {
      name: "Opus One",
      producer: "Opus One Winery",
      region: "Napa Valley",
      country: "USA",
      grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot", "Malbec"],
      type: "Red",
      attributes: {
        body: 9,
        tannin: 8,
        acidity: 7,
        fruit: 9,
        oak: 8
      },
      typicalPrice: 350,
      agingPotential: "20+ years",
      description: "Iconic Napa collaboration between Mondavi and Rothschild"
    },
  
    // BURGUNDY WINES
    "romanee conti": {
      name: "Romanée-Conti",
      producer: "Domaine de la Romanée-Conti",
      region: "Vosne-Romanée, Burgundy",
      country: "France",
      grapes: ["Pinot Noir"],
      classification: "Grand Cru",
      type: "Red",
      attributes: {
        body: 7,
        tannin: 6,
        acidity: 8,
        fruit: 9,
        earth: 10
      },
      typicalPrice: 15000,
      agingPotential: "30+ years",
      description: "The most expensive wine in the world, epitome of Burgundy Pinot Noir"
    },
  
    "montrachet": {
      name: "Montrachet",
      producer: "Various",
      region: "Côte de Beaune, Burgundy",
      country: "France",
      grapes: ["Chardonnay"],
      classification: "Grand Cru",
      type: "White",
      attributes: {
        body: 9,
        acidity: 8,
        fruit: 8,
        oak: 7,
        mineral: 9
      },
      typicalPrice: 500,
      agingPotential: "15+ years",
      description: "King of white Burgundy, opulent yet elegant Chardonnay"
    },
  
    // ITALIAN WINES
    "barolo": {
      name: "Barolo",
      producer: "Various",
      region: "Piedmont",
      country: "Italy",
      grapes: ["Nebbiolo"],
      classification: "DOCG",
      type: "Red",
      attributes: {
        body: 9,
        tannin: 10,
        acidity: 9,
        fruit: 7,
        earth: 8
      },
      typicalPrice: 60,
      agingPotential: "20+ years",
      description: "King of wines from Piedmont, powerful Nebbiolo"
    },
  
    "brunello di montalcino": {
      name: "Brunello di Montalcino",
      producer: "Various",
      region: "Tuscany",
      country: "Italy",
      grapes: ["Sangiovese"],
      classification: "DOCG",
      type: "Red",
      attributes: {
        body: 9,
        tannin: 9,
        acidity: 8,
        fruit: 8,
        earth: 7
      },
      typicalPrice: 70,
      agingPotential: "25+ years",
      description: "Tuscany's most age-worthy wine, 100% Sangiovese"
    },
  
    "amarone": {
      name: "Amarone della Valpolicella",
      producer: "Various",
      region: "Veneto",
      country: "Italy",
      grapes: ["Corvina", "Rondinella", "Molinara"],
      classification: "DOCG",
      type: "Red",
      attributes: {
        body: 10,
        tannin: 7,
        acidity: 6,
        fruit: 10,
        sweetness: 4
      },
      typicalPrice: 60,
      agingPotential: "15+ years",
      description: "Rich, concentrated wine made from dried grapes"
    },
  
    // GERMAN WINES
    "riesling": {
      name: "Riesling",
      producer: "Various",
      region: "Mosel",
      country: "Germany",
      grapes: ["Riesling"],
      type: "White",
      attributes: {
        body: 5,
        acidity: 9,
        fruit: 9,
        sweetness: 6,
        mineral: 10
      },
      typicalPrice: 30,
      agingPotential: "20+ years",
      description: "Elegant, aromatic white with electric acidity"
    },
  
    // SPANISH WINES
    "rioja": {
      name: "Rioja",
      producer: "Various",
      region: "Rioja",
      country: "Spain",
      grapes: ["Tempranillo", "Garnacha", "Graciano"],
      classification: "DOCa",
      type: "Red",
      attributes: {
        body: 7,
        tannin: 6,
        acidity: 7,
        fruit: 7,
        oak: 8
      },
      typicalPrice: 25,
      agingPotential: "15+ years",
      description: "Classic Spanish red with American oak aging"
    },
  
    // CHAMPAGNE
    "dom perignon": {
      name: "Dom Pérignon",
      producer: "Moët & Chandon",
      region: "Champagne",
      country: "France",
      grapes: ["Chardonnay", "Pinot Noir"],
      classification: "Prestige Cuvée",
      type: "Sparkling",
      attributes: {
        body: 7,
        acidity: 8,
        fruit: 8,
        complexity: 10,
        finesse: 10
      },
      typicalPrice: 200,
      agingPotential: "20+ years",
      description: "Iconic prestige Champagne, only vintage"
    },
  
    "krug": {
      name: "Krug Grande Cuvée",
      producer: "Krug",
      region: "Champagne",
      country: "France",
      grapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier"],
      classification: "Prestige Cuvée",
      type: "Sparkling",
      attributes: {
        body: 9,
        acidity: 8,
        fruit: 9,
        complexity: 10,
        richness: 10
      },
      typicalPrice: 250,
      agingPotential: "30+ years",
      description: "The richest, most complex Champagne"
    }
  };
  
  // ============= WHISKEY DATABASE =============
  
  export const whiskeyDatabase = {
    // SCOTCH - ISLAY (PEATED)
    "lagavulin 16": {
      name: "Lagavulin 16 Year Old",
      distillery: "Lagavulin",
      region: "Islay",
      country: "Scotland",
      type: "Single Malt Scotch",
      age: 16,
      attributes: {
        smoke: 10,
        proof: 7,
        sweetness: 6,
        oak: 8,
        spice: 7
      },
      abv: 43,
      caskType: "Ex-bourbon",
      typicalPrice: 80,
      description: "Iconic peated Islay whisky with maritime character"
    },
  
    "ardbeg 10": {
      name: "Ardbeg 10 Year Old",
      distillery: "Ardbeg",
      region: "Islay",
      country: "Scotland",
      type: "Single Malt Scotch",
      age: 10,
      attributes: {
        smoke: 10,
        proof: 9,
        sweetness: 5,
        oak: 6,
        spice: 8
      },
      abv: 46,
      caskType: "Ex-bourbon",
      typicalPrice: 55,
      description: "Powerfully peated with citrus and pepper notes"
    },
  
    "laphroaig 10": {
      name: "Laphroaig 10 Year Old",
      distillery: "Laphroaig",
      region: "Islay",
      country: "Scotland",
      type: "Single Malt Scotch",
      age: 10,
      attributes: {
        smoke: 10,
        proof: 7,
        sweetness: 5,
        medicinal: 10,
        spice: 6
      },
      abv: 43,
      caskType: "Ex-bourbon",
      typicalPrice: 50,
      description: "Medicinal, peaty Islay with iodine character"
    },
  
    // SCOTCH - SPEYSIDE (ELEGANT)
    "macallan 18": {
      name: "The Macallan 18 Year Old Sherry Oak",
      distillery: "Macallan",
      region: "Speyside",
      country: "Scotland",
      type: "Single Malt Scotch",
      age: 18,
      attributes: {
        smoke: 0,
        proof: 7,
        sweetness: 9,
        oak: 9,
        fruit: 9
      },
      abv: 43,
      caskType: "Oloroso Sherry",
      typicalPrice: 350,
      description: "Luxurious sherry-matured Speyside, dried fruits and spice"
    },
  
    "glenfiddich 12": {
      name: "Glenfiddich 12 Year Old",
      distillery: "Glenfiddich",
      region: "Speyside",
      country: "Scotland",
      type: "Single Malt Scotch",
      age: 12,
      attributes: {
        smoke: 0,
        proof: 6,
        sweetness: 7,
        oak: 6,
        fruit: 8
      },
      abv: 40,
      caskType: "Ex-bourbon",
      typicalPrice: 50,
      description: "Classic Speyside, approachable with pear and vanilla"
    },
  
    // JAPANESE WHISKY
    "yamazaki 18": {
      name: "Yamazaki 18 Year Old",
      distillery: "Suntory",
      region: "Japan",
      country: "Japan",
      type: "Single Malt",
      age: 18,
      attributes: {
        smoke: 0,
        proof: 7,
        sweetness: 8,
        oak: 9,
        fruit: 9
      },
      abv: 43,
      caskType: "Mizunara Oak",
      typicalPrice: 800,
      description: "Refined Japanese whisky with unique Mizunara oak influence"
    },
  
    "hibiki 21": {
      name: "Hibiki 21 Year Old",
      distillery: "Suntory",
      region: "Japan",
      country: "Japan",
      type: "Blended Whisky",
      age: 21,
      attributes: {
        smoke: 1,
        proof: 7,
        sweetness: 8,
        oak: 9,
        complexity: 10
      },
      abv: 43,
      caskType: "Multiple",
      typicalPrice: 1200,
      description: "Harmonious blend, pinnacle of Japanese whisky craftsmanship"
    },
  
    // BOURBON
    "pappy van winkle 23": {
      name: "Pappy Van Winkle's Family Reserve 23 Year",
      distillery: "Buffalo Trace",
      region: "Kentucky",
      country: "USA",
      type: "Bourbon",
      age: 23,
      attributes: {
        smoke: 0,
        proof: 9,
        sweetness: 9,
        oak: 10,
        spice: 6
      },
      abv: 47.8,
      caskType: "New American Oak",
      typicalPrice: 3000,
      description: "Legendary allocated bourbon, incredibly smooth and complex"
    },
  
    "buffalo trace": {
      name: "Buffalo Trace",
      distillery: "Buffalo Trace",
      region: "Kentucky",
      country: "USA",
      type: "Bourbon",
      age: 8,
      attributes: {
        smoke: 0,
        proof: 7,
        sweetness: 7,
        oak: 6,
        spice: 7
      },
      abv: 45,
      caskType: "New American Oak",
      typicalPrice: 25,
      description: "Classic Kentucky bourbon, excellent value"
    },
  
    "blantons": {
      name: "Blanton's Single Barrel",
      distillery: "Buffalo Trace",
      region: "Kentucky",
      country: "USA",
      type: "Bourbon",
      attributes: {
        smoke: 0,
        proof: 9,
        sweetness: 8,
        oak: 7,
        spice: 8
      },
      abv: 46.5,
      caskType: "New American Oak",
      typicalPrice: 60,
      description: "First single barrel bourbon, iconic bottle with horse topper"
    },
  
    // RYE WHISKEY
    "whistlepig 10": {
      name: "WhistlePig 10 Year Straight Rye",
      distillery: "WhistlePig",
      region: "Vermont",
      country: "USA",
      type: "Rye Whiskey",
      age: 10,
      attributes: {
        smoke: 0,
        proof: 10,
        sweetness: 5,
        oak: 7,
        spice: 10
      },
      abv: 50,
      caskType: "New American Oak",
      typicalPrice: 80,
      description: "Bold, spicy rye whiskey with incredible depth"
    }
  };
  
  // ============= COCKTAIL DATABASE =============
  
  export const cocktailDatabase = {
    "negroni": {
      name: "Negroni",
      type: "Classic Cocktail",
      baseSpirit: "Gin",
      ingredients: ["Gin", "Campari", "Sweet Vermouth"],
      glassware: "Rocks glass",
      garnish: "Orange peel",
      attributes: {
        spiritForward: 9,
        sweet: 5,
        complex: 8,
        refreshing: 4,
        strong: 8
      },
      origin: "Italy",
      era: "1920s",
      description: "Classic Italian aperitivo, equal parts gin, Campari, sweet vermouth"
    },
  
    "old fashioned": {
      name: "Old Fashioned",
      type: "Classic Cocktail",
      baseSpirit: "Bourbon",
      ingredients: ["Bourbon", "Sugar", "Angostura Bitters", "Orange Peel"],
      glassware: "Rocks glass",
      garnish: "Orange peel, cherry",
      attributes: {
        spiritForward: 10,
        sweet: 3,
        complex: 7,
        refreshing: 2,
        strong: 9
      },
      origin: "USA",
      era: "1880s",
      description: "The original cocktail, spirit-forward whiskey drink"
    },
  
    "manhattan": {
      name: "Manhattan",
      type: "Classic Cocktail",
      baseSpirit: "Rye Whiskey",
      ingredients: ["Rye Whiskey", "Sweet Vermouth", "Angostura Bitters"],
      glassware: "Coupe",
      garnish: "Cherry",
      attributes: {
        spiritForward: 9,
        sweet: 6,
        complex: 8,
        refreshing: 3,
        strong: 8
      },
      origin: "USA",
      era: "1880s",
      description: "Classic whiskey cocktail, stirred and sophisticated"
    },
  
    "margarita": {
      name: "Margarita",
      type: "Classic Cocktail",
      baseSpirit: "Tequila",
      ingredients: ["Tequila", "Lime Juice", "Cointreau"],
      glassware: "Coupe or rocks",
      garnish: "Salt rim, lime wheel",
      attributes: {
        spiritForward: 6,
        sweet: 6,
        complex: 6,
        refreshing: 9,
        strong: 7
      },
      origin: "Mexico",
      era: "1930s",
      description: "Perfect balance of tequila, lime, and orange liqueur"
    },
  
    "martini": {
      name: "Martini",
      type: "Classic Cocktail",
      baseSpirit: "Gin",
      ingredients: ["Gin", "Dry Vermouth"],
      glassware: "Martini glass",
      garnish: "Lemon twist or olive",
      attributes: {
        spiritForward: 10,
        sweet: 1,
        complex: 7,
        refreshing: 5,
        strong: 10
      },
      origin: "USA",
      era: "1880s",
      description: "The king of cocktails, iconic gin and vermouth"
    },
  
    "daiquiri": {
      name: "Daiquiri",
      type: "Classic Cocktail",
      baseSpirit: "Rum",
      ingredients: ["White Rum", "Lime Juice", "Simple Syrup"],
      glassware: "Coupe",
      garnish: "Lime wheel",
      attributes: {
        spiritForward: 7,
        sweet: 5,
        complex: 5,
        refreshing: 10,
        strong: 7
      },
      origin: "Cuba",
      era: "1900s",
      description: "Perfect rum sour, balance of sweet and tart"
    }
  };
  
  // ============= SEARCH & ENRICHMENT FUNCTIONS =============
  
  /**
   * Search for a wine in the database
   * Uses fuzzy matching to find closest match
   */
  export function searchWine(wineName) {
    if (!wineName) return null;
    
    const searchTerm = wineName.toLowerCase().trim();
    
    // Direct match
    if (wineDatabase[searchTerm]) {
      return { ...wineDatabase[searchTerm], confidence: 100 };
    }
    
    // Fuzzy match - check if search term is contained in any key
    for (const [key, value] of Object.entries(wineDatabase)) {
      if (key.includes(searchTerm) || searchTerm.includes(key)) {
        return { ...value, confidence: 80 };
      }
      
      // Check if wine name matches
      if (value.name.toLowerCase().includes(searchTerm)) {
        return { ...value, confidence: 85 };
      }
      
      // Check producer
      if (value.producer.toLowerCase().includes(searchTerm)) {
        return { ...value, confidence: 75 };
      }
    }
    
    return null;
  }
  
  /**
   * Search for whiskey in the database
   */
  export function searchWhiskey(whiskeyName) {
    if (!whiskeyName) return null;
    
    const searchTerm = whiskeyName.toLowerCase().trim();
    
    // Direct match
    if (whiskeyDatabase[searchTerm]) {
      return { ...whiskeyDatabase[searchTerm], confidence: 100 };
    }
    
    // Fuzzy match
    for (const [key, value] of Object.entries(whiskeyDatabase)) {
      if (key.includes(searchTerm) || searchTerm.includes(key)) {
        return { ...value, confidence: 80 };
      }
      
      if (value.name.toLowerCase().includes(searchTerm)) {
        return { ...value, confidence: 85 };
      }
      
      if (value.distillery.toLowerCase().includes(searchTerm)) {
        return { ...value, confidence: 75 };
      }
    }
    
    return null;
  }
  
  /**
   * Search for cocktail in the database
   */
  export function searchCocktail(cocktailName) {
    if (!cocktailName) return null;
    
    const searchTerm = cocktailName.toLowerCase().trim();
    
    // Direct match
    if (cocktailDatabase[searchTerm]) {
      return { ...cocktailDatabase[searchTerm], confidence: 100 };
    }
    
    // Fuzzy match
    for (const [key, value] of Object.entries(cocktailDatabase)) {
      if (key.includes(searchTerm) || searchTerm.includes(key)) {
        return { ...value, confidence: 80 };
      }
      
      if (value.name.toLowerCase().includes(searchTerm)) {
        return { ...value, confidence: 85 };
      }
    }
    
    return null;
  }
  
  /**
   * Enrich user-scanned data with knowledge database
   * This is called after vision API extracts text from label
   */
  export function enrichLiquorData(scannedData, category) {
    const { name, producer, region } = scannedData;
    
    let enrichedData = { ...scannedData };
    let databaseMatch = null;
    
    // Search appropriate database based on category
    switch(category) {
      case 'wine':
        databaseMatch = searchWine(name) || searchWine(producer);
        break;
      case 'whiskey':
        databaseMatch = searchWhiskey(name) || searchWhiskey(producer);
        break;
      case 'cocktail':
        databaseMatch = searchCocktail(name);
        break;
    }
    
    // If we found a match, enrich the data
    if (databaseMatch) {
      enrichedData = {
        ...scannedData,
        ...databaseMatch,
        // Keep user-scanned name if it exists
        name: scannedData.name || databaseMatch.name,
        // Add flag to show data was enriched
        enriched: true,
        enrichmentConfidence: databaseMatch.confidence
      };
    }
    
    return enrichedData;
  }
  
  /**
   * Get radar attributes for a liquor item
   * Uses knowledge database if available, otherwise returns null
   */
  export function getRadarAttributes(name, category) {
    let item = null;
    
    switch(category) {
      case 'wine':
        item = searchWine(name);
        break;
      case 'whiskey':
        item = searchWhiskey(name);
        break;
      case 'cocktail':
        item = searchCocktail(name);
        break;
    }
    
    return item?.attributes || null;
  }
  
  // ============= EXPORT ALL =============
  
  export default {
    wineDatabase,
    whiskeyDatabase,
    cocktailDatabase,
    searchWine,
    searchWhiskey,
    searchCocktail,
    enrichLiquorData,
    getRadarAttributes
  };