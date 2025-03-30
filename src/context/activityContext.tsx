// src/context/ActivityContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { activityService, activityEvents } from '../services/activityService';
import { Activity } from '../types/activity';

type ActivityContextType = {
  activities: Activity[];
  loading: boolean;
  lastUpdated: number;
  refreshActivities: () => Promise<void>;
  addActivity: (activity: Activity) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getActivitiesByMood: (mood: string) => Activity[];
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

type ActivityProviderProps = {
  children: ReactNode;
};

export function ActivityProvider({ children }: ActivityProviderProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const refreshActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAllActivities();
      setActivities(data);
      setLastUpdated(Date.now());
    } catch (error) {
      console.error('Error refreshing activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Wrapper methods that update the context state after service operations
  const addActivity = async (activity: Activity) => {
    await activityService.addActivity(activity);
    refreshActivities();
  };

  const updateActivity = async (activity: Activity) => {
    await activityService.updateActivity(activity);
    refreshActivities();
  };

  const deleteActivity = async (id: string) => {
    await activityService.deleteActivity(id);
    refreshActivities();
  };

  // Derived data - no need to call the service again
  const getActivitiesByMood = (mood: string) => {
    return activities.filter(activity => activity.moods.includes(mood));
  };

  // Initial load
  useEffect(() => {
    refreshActivities();
  }, []);

  // Listen for changes from the service
  useEffect(() => {
    const handleChange = () => {
      refreshActivities();
    };
    
    activityEvents.on('activities-changed', handleChange);
    
    return () => {
      activityEvents.off('activities-changed', handleChange);
    };
  }, []);

  return (
    <ActivityContext.Provider 
      value={{ 
        activities, 
        loading,
        lastUpdated, 
        refreshActivities, 
        addActivity,
        updateActivity,
        deleteActivity,
        getActivitiesByMood
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

// Custom hook for easy usage
export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}