export const UNIVERSAL_QUESTIONS = [
    {
      id: 'intensity',
      title: 'Intensity you crave?',
      type: 'slider',
      leftLabel: 'Delicate',
      rightLabel: 'Bold'
    },
    {
      id: 'flavor',
      title: 'Which direction calls to you?',
      type: 'slider',
      leftLabel: 'Bright & Clean',
      rightLabel: 'Rich & Complex'
    }
  ];
  
  export const CATEGORY_QUESTIONS = {
    wine: [
      {
        id: 'body',
        title: 'Your preferred body?',
        type: 'pills',
        options: ['Light', 'Medium', 'Full']
      },
      {
        id: 'tannin',
        title: 'How does structure feel to you?',
        type: 'slider',
        leftLabel: 'Soft & Smooth',
        rightLabel: 'Structured & Grippy'
      },
      {
        id: 'acidity',
        title: 'Acidity preference?',
        type: 'slider',
        leftLabel: 'Mellow',
        rightLabel: 'Bright & Lively'
      },
      {
        id: 'style',
        title: 'Wine style leaning?',
        type: 'pills',
        options: ['Old World', 'New World', 'Natural', 'Classic']
      }
    ],
    whiskey: [
      {
        id: 'peat',
        title: 'Peat & smoke affinity?',
        type: 'pills',
        options: ['Avoid Smoke', 'Light Touch', 'Love Peat', 'Maximum Smoke']
      },
      {
        id: 'proof',
        title: 'Proof preference?',
        type: 'slider',
        leftLabel: 'Easy (80-90)',
        rightLabel: 'Cask Strength'
      },
      {
        id: 'age',
        title: 'Age character?',
        type: 'pills',
        options: ['Young & Vibrant', '8-12 Years', '15+ Years', 'Ancient']
      },
      {
        id: 'origin',
        title: 'Origin preference?',
        type: 'pills',
        options: ['Bourbon', 'Scotch', 'Irish', 'Japanese']
      }
    ],
    cocktails: [
      {
        id: 'spirit_base',
        title: 'Preferred spirit base?',
        type: 'pills',
        options: ['Gin', 'Vodka', 'Whiskey', 'Rum']
      },
      {
        id: 'cocktail_style',
        title: 'Cocktail style?',
        type: 'pills',
        options: ['Spirit-Forward', 'Balanced', 'Refreshing', 'Sweet']
      },
      {
        id: 'complexity',
        title: 'Complexity level?',
        type: 'slider',
        leftLabel: 'Simple Classics',
        rightLabel: 'Complex Creations'
      },
      {
        id: 'sweetness_balance',
        title: 'Sweetness balance?',
        type: 'slider',
        leftLabel: 'Dry & Bitter',
        rightLabel: 'Sweet & Fruity'
      }
    ],
    spirits: [
      {
        id: 'primary_spirit',
        title: 'Primary spirit?',
        type: 'pills',
        options: ['Gin', 'Vodka', 'Rum', 'Tequila']
      },
      {
        id: 'serving',
        title: 'Serving style?',
        type: 'pills',
        options: ['Neat', 'On Rocks', 'Mixed', 'Shots']
      },
      {
        id: 'flavor_profile',
        title: 'Flavor profile?',
        type: 'slider',
        leftLabel: 'Clean & Neutral',
        rightLabel: 'Bold & Distinctive'
      },
      {
        id: 'notes',
        title: 'Flavor notes preference?',
        type: 'pills',
        options: ['Citrus', 'Herbal', 'Spicy', 'Vanilla']
      }
    ],
    champagne: [
      {
        id: 'sweetness_level',
        title: 'Sweetness level?',
        type: 'pills',
        options: ['Brut Nature', 'Extra Brut', 'Brut', 'Demi-Sec']
      },
      {
        id: 'style_pref',
        title: 'Style preference?',
        type: 'pills',
        options: ['Blanc de Blancs', 'Blanc de Noirs', 'Rosé', 'Vintage']
      },
      {
        id: 'bubble_size',
        title: 'Bubble character?',
        type: 'slider',
        leftLabel: 'Aggressive',
        rightLabel: 'Delicate & Fine'
      },
      {
        id: 'region',
        title: 'Region preference?',
        type: 'pills',
        options: ['Champagne', 'Prosecco', 'Cava', 'Other Sparkling']
      }
    ],
    beer: [
      {
        id: 'beer_style',
        title: 'Beer style?',
        type: 'pills',
        options: ['Lager', 'IPA', 'Stout', 'Sour']
      },
      {
        id: 'bitterness',
        title: 'Bitterness preference?',
        type: 'slider',
        leftLabel: 'Mild (10-20 IBU)',
        rightLabel: 'Hop Bomb (80+)'
      },
      {
        id: 'color_body',
        title: 'Color & body?',
        type: 'pills',
        options: ['Light & Crisp', 'Amber', 'Dark & Rich']
      },
      {
        id: 'abv',
        title: 'ABV preference?',
        type: 'slider',
        leftLabel: 'Session (3-5%)',
        rightLabel: 'Strong (8%+)'
      }
    ]
  };
  
  export const getQuestionsForCategory = (categoryId) => {
    return [...UNIVERSAL_QUESTIONS, ...(CATEGORY_QUESTIONS[categoryId] || [])];
  };