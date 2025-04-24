"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  reminderTime?: string;
}

export default function HabitDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const loadHabit = () => {
      try {
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]') as Habit[];
        const foundHabit = storedHabits.find(h => h.id === params.id);
        
        if (foundHabit) {
          setHabit(foundHabit);
          setEditedHabit(foundHabit);
        } else {
          // Handle case where habit is not found
          console.error('Habit not found');
        }
      } catch (error) {
        console.error('Error loading habit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabit();
  }, [params.id]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedHabit(habit);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editedHabit) return;
    
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEditedHabit(prev => {
      if (!prev) return null;
      
      if (name === 'categoryName') {
        return {
          ...prev,
          category: {
            ...prev.category,
            name: value
          }
        };
      }
      
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleSave = () => {
    if (!editedHabit) return;
    
    try {
      const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]') as Habit[];
      const updatedHabits = storedHabits.map(h => 
        h.id === params.id ? editedHabit : h
      );
      
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      setHabit(editedHabit);
      setIsEditing(false);
      
      // Show success message
      alert('Habit updated successfully!');
    } catch (error) {
      console.error('Error saving habit:', error);
      alert('There was an error updating the habit. Please try again.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]') as Habit[];
        const updatedHabits = storedHabits.filter(h => h.id !== params.id);
        
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        
        // Redirect to habits page
        router.push('/habits');
      } catch (error) {
        console.error('Error deleting habit:', error);
        alert('There was an error deleting the habit. Please try again.');
      }
    }
  };

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
              <p>Loading habit details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Habit not found</h3>
              <p className="mt-2 text-sm text-gray-500">
                The habit you're looking for doesn't exist or has been deleted.
              </p>
              <div className="mt-6">
                <Link href="/habits" className="btn-primary">
                  Back to My Habits
                </Link>
              </div>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/habits" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              ← Back to My Habits
            </Link>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Habit Details</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and information about this habit.</p>
              </div>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={handleToggleEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15.9a2 2 0 01-.707.587l-4 1a2 2 0 01-2.413-2.569l1-4a2 2 0 01.542-.674L15.586 3.414z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleSave}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    <button 
                      onClick={handleToggleEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200">
              <dl>
                {/* Title */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Habit Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="title"
                        className="input"
                        value={editedHabit?.title || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      habit.title
                    )}
                  </dd>
                </div>
                
                {/* Description */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <textarea
                        name="description"
                        rows={3}
                        className="input"
                        value={editedHabit?.description || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      habit.description || 'No description provided.'
                    )}
                  </dd>
                </div>
                
                {/* Category */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="categoryName"
                        className="input"
                        value={editedHabit?.category.name || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${habit.category.color}20`, 
                          color: habit.category.color 
                        }}
                      >
                        {habit.category.name}
                      </span>
                    )}
                  </dd>
                </div>
                
                {/* Frequency */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <select
                        name="frequency"
                        className="input"
                        value={editedHabit?.frequency || 'DAILY'}
                        onChange={handleInputChange}
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    ) : (
                      habit.frequency.charAt(0) + habit.frequency.slice(1).toLowerCase()
                    )}
                  </dd>
                </div>
                
                {/* Start Time */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="time"
                        name="startTime"
                        className="input"
                        value={editedHabit?.startTime || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      habit.startTime ? formatTime(habit.startTime) : 'No start time set'
                    )}
                  </dd>
                </div>
                
                {/* Duration */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="duration"
                        className="input"
                        value={editedHabit?.duration || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. 30 minutes"
                      />
                    ) : (
                      habit.duration || 'No duration set'
                    )}
                  </dd>
                </div>
                
                {/* Streak */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Current Streak</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
                  </dd>
                </div>
                
                {/* Privacy */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Privacy</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPublic"
                          name="isPublic"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={editedHabit?.isPublic || false}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                          Make this habit public
                        </label>
                      </div>
                    ) : (
                      habit.isPublic ? 'Public' : 'Private'
                    )}
                  </dd>
                </div>
                
                {/* Reminder Time */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Reminder</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <input
                        type="time"
                        name="reminderTime"
                        className="input"
                        value={editedHabit?.reminderTime || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      habit.reminderTime ? formatTime(habit.reminderTime) : 'No reminder set'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* Progress section could be added here */}
          </div>
        </div>
      </main>
    </div>
  );
} 