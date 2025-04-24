"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Category color mapping
const categoryColors: Record<string, string> = {
  fitness: '#ef4444',
  health: '#10b981',
  productivity: '#3b82f6',
  mindfulness: '#f59e0b',
  learning: '#8b5cf6',
  finance: '#06b6d4',
  social: '#ec4899',
  other: '#6b7280'
};

export default function NewHabit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    frequency: 'DAILY',
    startTime: '',
    duration: '',
    durationUnit: 'minutes',
    reminderTime: '',
    isPublic: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        frequency: e.target.id.split('-')[1].toUpperCase()
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would save this to your backend
    // For now, let's save to localStorage for demonstration
    try {
      // Get existing habits from localStorage or initialize empty array
      const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]');
      
      // Create new habit with generated ID and default values
      const newHabit = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: { 
          name: formData.category.charAt(0).toUpperCase() + formData.category.slice(1), 
          color: categoryColors[formData.category] || '#6b7280' // Default to gray if category not found
        },
        frequency: formData.frequency,
        startTime: formData.startTime,
        duration: formData.duration ? `${formData.duration} ${formData.durationUnit}` : '',
        streak: 0,
        completed: false,
        isPublic: formData.isPublic,
        reminderTime: formData.reminderTime
      };
      
      // Add to existing habits
      const updatedHabits = [...existingHabits, newHabit];
      
      // Save back to localStorage
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      
      // Redirect to habits page
      router.push('/habits');
    } catch (error) {
      console.error('Error saving habit:', error);
      alert('There was an error saving your habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Habit</h1>
            <p className="mt-2 text-sm text-gray-700">
              Define a new habit to track and build consistency
            </p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Habit title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Habit Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="input"
                    placeholder="e.g., Morning Meditation"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="input"
                    placeholder="Add some details about your habit"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of your habit and why it matters to you
                </p>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    className="input"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="fitness">Fitness</option>
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="flex items-center">
                    <input
                      id="frequency-daily"
                      name="frequency"
                      type="radio"
                      className="h-4 w-4 text-primary-600 border-gray-300"
                      defaultChecked
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="frequency-daily" className="ml-3 block text-sm font-medium text-gray-700">
                      Daily
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="frequency-weekly"
                      name="frequency"
                      type="radio"
                      className="h-4 w-4 text-primary-600 border-gray-300"
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="frequency-weekly" className="ml-3 block text-sm font-medium text-gray-700">
                      Weekly
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="frequency-monthly"
                      name="frequency"
                      type="radio"
                      className="h-4 w-4 text-primary-600 border-gray-300"
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="frequency-monthly" className="ml-3 block text-sm font-medium text-gray-700">
                      Monthly
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Start Time */}
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    className="input"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  What time do you plan to start this habit?
                </p>
              </div>
              
              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    min="1"
                    className="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., 30"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                  <select
                    name="durationUnit"
                    className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    value={formData.durationUnit}
                    onChange={handleChange}
                  >
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  How long will you spend on this habit?
                </p>
              </div>
              
              {/* Reminder time */}
              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">
                  Reminder Time (Optional)
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    name="reminderTime"
                    id="reminderTime"
                    className="input"
                    value={formData.reminderTime}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Set a daily reminder to help you remember your habit
                </p>
              </div>
              
              {/* Privacy */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    checked={formData.isPublic}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPublic" className="font-medium text-gray-700">
                    Make habit public
                  </label>
                  <p className="text-gray-500">
                    Public habits can be seen by friends and appear in the community feed
                  </p>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <Link href="/habits" className="btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 