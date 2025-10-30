import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUserProfile } from './hooks/useUserProfile';
import { generateInitialRadar, calculateEvolvedRadar, generateMockProperties } from './utils/radarCalculations';
import { getCategoryById } from './data/categories';
import { MOCK_ITEMS } from './data/mockData';
import { loadItems } from './utils/storage'; // NEW: Import storage

// Collection screens
import { CategoryDetailScreen } from './screens/collection/CategoryDetailScreen';
import { CollectionView } from './screens/collection/CollectionView';

// Onboarding
import { WelcomeScreen } from './screens/onboarding/WelcomeScreen';
import { PhilosophyScreen } from './screens/onboarding/PhilosophyScreen';
import { CategorySelectionScreen } from './screens/onboarding/CategorySelectionScreen';
import { QuizScreen } from './screens/onboarding/QuizScreen';
import { PalateRevealScreen } from './screens/onboarding/PalateRevealScreen';

// Main
import { HomeScreen } from './screens/home/HomeScreen';

// Log Flow
import { CategoryPicker } from './screens/log/CategoryPicker';
import MemoryCanvas from './screens/log/MemoryCanvas';
import { ComparisonScreen } from './screens/log/ComparisonScreen';
import { PlacementReveal } from './screens/log/PlacementReveal';
import ScanScreen from './screens/log/ScanScreen';

// Other
import { SommelierScreen } from './screens/sommelier/SommelierScreen';

function App() {
  const {
    profile,
    updateProfile,
    addCategory,
    addItem,
    updateRadarData,
    getItemsForCategory,
    getRadarForCategory
  } = useUserProfile();

  // NEW: State for viewing specific category detail
  const [viewingCategory, setViewingCategory] = useState(null);

  const [screen, setScreen] = useState(profile.onboarded ? 'home' : 'welcome');
  const [logState, setLogState] = useState({
    isOpen: false,
    step: 'picker', // picker, canvas, comparison, reveal
    category: null,
    formData: null,
    capturedPhoto: null,
    extractedData: null,
    rank: null
  });
  const [showSommelier, setShowSommelier] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('=== APP STATE UPDATE ===');
    console.log('Current screen:', screen);
    console.log('Profile:', profile);
    console.log('Profile.onboarded:', profile.onboarded);
    console.log('Profile.primaryCategory:', profile.primaryCategory);
    console.log('Viewing category:', viewingCategory);
    console.log('Should render HomeScreen:', screen === 'home' && profile.primaryCategory);
  }, [screen, profile, viewingCategory]);

  // Navigation
  const navigate = (destination) => {
    console.log('Navigating to:', destination);
    if (destination === 'log') {
      setLogState({ ...logState, isOpen: true, step: 'picker' });
    } else if (destination === 'scan-quick') {
      setLogState({
        isOpen: true,
        step: 'scan',
        category: profile.primaryCategory,
        formData: null,
        capturedPhoto: null,
        rank: null
      });
    } else if (destination === 'sommelier') {
      setShowSommelier(true);
    } else {
      setScreen(destination);
      setViewingCategory(null); // Clear category view when navigating away
    }
  };

  // NEW: Handle viewing a specific category
  const handleViewCategory = (categoryId) => {
    console.log('Viewing category:', categoryId);
    setViewingCategory(categoryId);
  };

  // NEW: Handle back from category detail
  const handleBackFromCategory = () => {
    console.log('Back from category detail');
    setViewingCategory(null);
  };

  // NEW: Handle add new from category detail screen
  const handleAddNewFromCategory = (categoryId) => {
    console.log('Add new item to category:', categoryId);
    setLogState({
      isOpen: true,
      step: 'scan',
      category: categoryId,
      formData: null,
      capturedPhoto: null,
      extractedData: null,
      rank: null
    });
  };

  // Onboarding flow
  const handleCategorySelection = (categories) => {
    console.log('Categories selected:', categories);
    updateProfile({
      selectedCategories: categories,
      primaryCategory: categories[0]
    });
    setScreen('quiz');
  };

  const handleQuizComplete = (quizData) => {
    console.log('Quiz completed:', quizData);
    const { category, answers, selectedCategories } = quizData;
    
    // Log to verify category exists
    console.log('Category from quizData:', category);
    
    const cat = getCategoryById(category);
    
    if (!cat) {
      console.error('Could not find category:', category);
      return;
    }
    
    // Generate initial radar
    const radarData = generateInitialRadar(answers, cat.radarAttributes);
    
    // DON'T add mock items - let user build their real collection!
    // const mockItems = MOCK_ITEMS[category] || [];
    
    // Update profile with ALL the data
    updateProfile({
      selectedCategories: selectedCategories,
      primaryCategory: category,
      category: category,
      answers: answers,
      onboarded: true,
      items: {
        // Start with empty collection
        [category]: []
      }
    });
    
    updateRadarData(category, radarData);
    
    setScreen('reveal');
  };

  const handleOnboardingComplete = () => {
    console.log('Onboarding complete, navigating to home');
    setScreen('home');
  };

  // Log flow
  const handleLogCategorySelect = (categoryId) => {
    console.log('Log category selected:', categoryId);
    setLogState({
      ...logState,
      category: categoryId,
      step: 'scan'
    });
  };

  const handleScanCapture = (scanResult) => {
    console.log('Scan result:', scanResult);
    
    // NEW: If scan result includes rank (from comparison flow), close log flow
    if (scanResult.rank) {
      console.log('Item ranked via comparison, closing log flow');
      setLogState({
        isOpen: false,
        step: 'picker',
        category: null,
        formData: null,
        capturedPhoto: null,
        extractedData: null,
        rank: null
      });
      
      // Navigate to category detail to see the new item
      if (logState.category) {
        setScreen('collection');
        setViewingCategory(logState.category);
      }
      return;
    }
    
    // Original flow continues
    setLogState({
      ...logState,
      capturedPhoto: scanResult.photo,
      extractedData: scanResult.extracted,
      step: 'canvas'
    });
  };

  const handleSkipScan = () => {
    console.log('Skipping scan, going directly to canvas');
    setLogState({
      ...logState,
      capturedPhoto: null,
      extractedData: null,
      step: 'canvas'
    });
  };

  const handleMemoryComplete = (formData) => {
    console.log('Memory complete:', formData);
    setLogState({
      ...logState,
      formData,
      step: 'comparison'
    });
  };

  const handleComparisonComplete = ({ rank }) => {
    console.log('Comparison complete, rank:', rank);
    const { category, formData } = logState;
    const cat = getCategoryById(category);
    
    // Create new item
    const newItem = {
      id: `${category}-${Date.now()}`,
      category,
      rank,
      name: formData.name,
      producer: formData.producer,
      properties: generateMockProperties(category, cat.radarAttributes),
      memory: {
        where: formData.where,
        when: formData.when,
        with: formData.with,
        notes: formData.notes
      }
    };

    // Add item
    addItem(category, newItem);

    // Update radar with evolved data
    const allItems = [...getItemsForCategory(category), newItem];
    const evolvedRadar = calculateEvolvedRadar(allItems, cat.radarAttributes);
    updateRadarData(category, evolvedRadar);

    // Add category if new
    if (!profile.selectedCategories.includes(category)) {
      addCategory(category);
    }

    setLogState({
      ...logState,
      rank,
      step: 'reveal'
    });
  };

  const handleLogClose = () => {
    console.log('Closing log flow');
    setLogState({
      isOpen: false,
      step: 'picker',
      category: null,
      formData: null,
      capturedPhoto: null,
      extractedData: null,
      rank: null
    });
    setScreen('home');
  };

  // UPDATED: Safe getters with fallbacks - now also checks localStorage
  const safeGetItemsForCategory = (categoryId) => {
    // First try to get from profile
    let items = getItemsForCategory(categoryId);
    
    // If no items in profile, check localStorage
    if (!items || items.length === 0) {
      items = loadItems(categoryId);
    }
    
    return items || [];
  };

  const safeGetRadarForCategory = (categoryId) => {
    const radar = getRadarForCategory(categoryId);
    if (!radar || Object.keys(radar).length === 0) {
      // Return default radar if none exists
      const cat = getCategoryById(categoryId);
      const defaultRadar = {};
      cat.radarAttributes.forEach(attr => {
        defaultRadar[attr] = 0.6;
      });
      return defaultRadar;
    }
    return radar;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-cream shadow-2xl">
      <AnimatePresence mode="wait">
        {/* Onboarding */}
        {screen === 'welcome' && (
          <WelcomeScreen key="welcome" onNext={() => setScreen('philosophy')} />
        )}
        {screen === 'philosophy' && (
          <PhilosophyScreen key="philosophy" onNext={() => setScreen('categories')} />
        )}
        {screen === 'categories' && (
          <CategorySelectionScreen key="categories" onNext={handleCategorySelection} />
        )}
        {screen === 'quiz' && profile.selectedCategories && profile.selectedCategories.length > 0 && (
          <QuizScreen
            key="quiz"
            selectedCategories={profile.selectedCategories}
            onComplete={handleQuizComplete}
          />
        )}
        {screen === 'reveal' && profile.primaryCategory && (
          <PalateRevealScreen
            key="reveal"
            quizData={{
              category: profile.primaryCategory,
              selectedCategories: profile.selectedCategories || [],
              answers: profile.answers || {}
            }}
            onNext={handleOnboardingComplete}
          />
        )}

        {/* Main App */}
        {screen === 'home' && profile.primaryCategory && (
          <HomeScreen
            key="home"
            userProfile={profile}
            onNavigate={navigate}
            getItemsForCategory={safeGetItemsForCategory}
            getRadarForCategory={safeGetRadarForCategory}
          />
        )}

        {/* UPDATED: Collection View with Category Detail */}
        {screen === 'collection' && profile.primaryCategory && (
          <>
            {!viewingCategory ? (
              // Collection overview
              <CollectionView
                key="collection"
                userProfile={profile}
                onBack={() => setScreen('home')}
                onNavigate={navigate}
                getItemsForCategory={safeGetItemsForCategory}
                onViewCategory={handleViewCategory}
              />
            ) : (
              // Category detail view (Radar + Rankings)
              <CategoryDetailScreen
                key={`category-${viewingCategory}`}
                categoryId={viewingCategory}
                onBack={handleBackFromCategory}
                onAddNew={handleAddNewFromCategory}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Log Flow Modals */}
      {logState.step === 'picker' && (
        <CategoryPicker
          isOpen={logState.isOpen}
          onClose={() => setLogState({ ...logState, isOpen: false })}
          userProfile={profile}
          onSelect={handleLogCategorySelect}
        />
      )}

      {logState.step === 'scan' && logState.category && (
        <ScanScreen
          isOpen={true}
          onClose={handleSkipScan}
          onCapture={handleScanCapture}
          category={logState.category}
        />
      )}

      {logState.step === 'canvas' && logState.category && (
        <MemoryCanvas
          isOpen={true}
          onClose={() => setLogState({ ...logState, step: 'picker' })}
          category={logState.category}
          capturedPhoto={logState.capturedPhoto}
          extractedData={logState.extractedData}
          onComplete={handleMemoryComplete}
        />
      )}

      {logState.step === 'comparison' && logState.category && (
        <ComparisonScreen
          category={logState.category}
          newItem={logState.formData}
          existingItems={safeGetItemsForCategory(logState.category)}
          onComplete={handleComparisonComplete}
        />
      )}

      {logState.step === 'reveal' && logState.category && (
        <PlacementReveal
          category={logState.category}
          rank={logState.rank}
          onClose={handleLogClose}
        />
      )}

      {/* Sommelier */}
      {profile.primaryCategory && (
        <SommelierScreen
          isOpen={showSommelier}
          onClose={() => setShowSommelier(false)}
          userProfile={profile}
        />
      )}
    </div>
  );
}

export default App;