"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Define the habit type
interface Habit {
  id: string;
  title: string;
  description: string;
  category: {
    name: string;
    color: string;
  };
  frequency: string;
  startTime?: string;
  duration?: string;
  streak: number;
  completed: boolean;
  isPublic: boolean;
}

export default function MyHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from localStorage on component mount
  useEffect(() => {
    try {
      const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]') as Habit[];
      
      // If no stored habits, use the sample data
      if (storedHabits.length === 0) {
        // Sample data for initial state
        const sampleHabits: Habit[] = [
          {
            id: '1',
            title: 'Morning Meditation',
            description: 'Meditate for 10 minutes each morning to start the day mindfully',
            category: { name: 'Wellness', color: '#0ea5e9' },
            frequency: 'DAILY',
            startTime: '07:00',
            duration: '10 minutes',
            streak: 7,
            completed: false,
            isPublic: true
          },
          {
            id: '2',
            title: 'Drink 8 glasses of water',
            description: 'Stay hydrated throughout the day',
            category: { name: 'Health', color: '#10b981' },
            frequency: 'DAILY',
            startTime: '08:00',
            duration: '5 minutes',
            streak: 5,
            completed: false,
            isPublic: false
          },
          {
            id: '3',
            title: 'Read for 30 minutes',
            description: 'Read a book to expand knowledge and relax',
            category: { name: 'Personal Growth', color: '#8b5cf6' },
            frequency: 'DAILY',
            startTime: '19:30',
            duration: '30 minutes',
            streak: 12,
            completed: false,
            isPublic: true
          },
          {
            id: '4',
            title: 'Exercise',
            description: 'Do 30 minutes of physical activity',
            category: { name: 'Fitness', color: '#ef4444' },
            frequency: 'DAILY',
            startTime: '17:00',
            duration: '30 minutes',
            streak: 3,
            completed: false,
            isPublic: true
          },
          {
            id: '5',
            title: 'Journal',
            description: 'Write about your day and reflections',
            category: { name: 'Mindfulness', color: '#f59e0b' },
            frequency: 'DAILY',
            startTime: '21:00',
            duration: '15 minutes',
            streak: 9,
            completed: false,
            isPublic: false
          }
        ];
        setHabits(sampleHabits);
        
        // Save sample habits to localStorage for future use
        localStorage.setItem('habits', JSON.stringify(sampleHabits));
      } else {
        setHabits(storedHabits);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleHabitCompletion = (habitId: string) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed } 
        : habit
    );
    
    setHabits(updatedHabits);
    
    // Also update localStorage
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  // Filter options
  const [filter, setFilter] = useState('all'); // all, active, completed

  const filteredHabits = habits.filter(habit => {
    if (filter === 'active') return !habit.completed;
    if (filter === 'completed') return habit.completed;
    return true; // 'all'
  });

  // Format time to display in 12-hour format
  const formatTime = (time?: string) => {
    if (!time) return '';
    
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p>Loading habits...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage and track all your habits
              </p>
            </div>
            <Link href="/habits/new" className="btn-primary">
              Create New Habit
            </Link>
          </div>

          {/* Filter buttons */}
          <div className="flex space-x-2 mb-6">
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Habits list */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredHabits.map(habit => (
              <div key={habit.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div 
                        className="flex-shrink-0 h-6 w-6 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
                        onClick={() => toggleHabitCompletion(habit.id)}
                        style={{ backgroundColor: habit.completed ? habit.category.color : 'transparent' }}
                      >
                        {habit.completed && (
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-lg font-medium text-gray-900 ${habit.completed ? 'line-through' : ''}`}>
                          {habit.title}
                        </h3>
                        {habit.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                        style={{ 
                          backgroundColor: `${habit.category.color}20`, 
                          color: habit.category.color 
                        }}
                      >
                        {habit.category.name}
                      </span>
                    </div>
                  </div>
                  
                  {/* Time and duration information */}
                  {(habit.startTime || habit.duration) && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {habit.startTime && formatTime(habit.startTime)}
                        {habit.startTime && habit.duration && ' • '}
                        {habit.duration && habit.duration}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0115 2h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-.707-.293L14 5.414l-.707.707A1 1 0 0112 7h-2a1 1 0 01-1-1V4a1 1 0 011-1h2zm0 10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0115 12h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-.707-.293L14 15.414l-.707.707A1 1 0 0112 17h-2a1 1 0 01-1-1v-2a1 1 0 011-1h2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{habit.streak} day streak</span>
                    </div>
                    <div>
                      {habit.isPublic ? (
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path
                              d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                            />
                          </svg>
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Link 
                      href={`/habits/${habit.id}`} 
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredHabits.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No habits found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {filter === 'active' 
                  ? "You've completed all your habits! Great job!" 
                  : filter === 'completed' 
                    ? "You haven't completed any habits yet. Keep going!" 
                    : "You don't have any habits yet. Create your first habit to get started!"}
              </p>
              {habits.length === 0 && (
                <div className="mt-6">
                  <Link href="/habits/new" className="btn-primary">
                    Create Your First Habit
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 