import { useState, useEffect } from 'react';
import { activityService, initializeData } from '../services/activityService';
import { moodService } from '../services/moodService';

export function useAppInitialization() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeData();
        await moodService.initializeDefaultMoods([
          'morning', 'exercise', 'quiet', 'evening', 'social', 'learning'
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { isLoading };
}