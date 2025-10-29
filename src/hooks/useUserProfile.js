import { useLocalStorage } from './useLocalStorage';

const INITIAL_PROFILE = {
  selectedCategories: [],
  primaryCategory: null,
  answers: {},
  radarData: {},
  items: {},
  onboarded: false
};

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage('palate_user_profile', INITIAL_PROFILE);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addCategory = (categoryId) => {
    if (!profile.selectedCategories.includes(categoryId)) {
      setProfile(prev => ({
        ...prev,
        selectedCategories: [...prev.selectedCategories, categoryId]
      }));
    }
  };

  const addItem = (categoryId, item) => {
    setProfile(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [categoryId]: [...(prev.items[categoryId] || []), item]
      }
    }));
  };

  const updateRadarData = (categoryId, data) => {
    setProfile(prev => ({
      ...prev,
      radarData: {
        ...prev.radarData,
        [categoryId]: data
      }
    }));
  };

  const getItemsForCategory = (categoryId) => {
    return profile.items[categoryId] || [];
  };

  const getRadarForCategory = (categoryId) => {
    return profile.radarData[categoryId] || {};
  };

  const resetProfile = () => {
    setProfile(INITIAL_PROFILE);
  };

  return {
    profile,
    updateProfile,
    addCategory,
    addItem,
    updateRadarData,
    getItemsForCategory,
    getRadarForCategory,
    resetProfile
  };
}