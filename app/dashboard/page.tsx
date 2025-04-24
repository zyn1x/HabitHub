"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from localStorage on component mount
  useEffect(() => {
    try {
      const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]') as Habit[];
      setHabits(storedHabits);
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

  // Calculate stats
  const completedToday = habits.filter(habit => habit.completed).length;
  const activeHabits = habits.length;
  const currentStreak = Math.max(...habits.map(habit => habit.streak), 0);

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

  // Generate weekly data for chart visualization
  const generateWeeklyData = () => {
    // Get days of the week
    const daysOfWeek = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      daysOfWeek.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // Generate random completion data for each habit
    // In a real app, this would come from actual tracking data
    const datasets = habits.slice(0, 5).map((habit, index) => {
      // Generate random completion data (0 or 1) for each day
      const data = Array.from({ length: 7 }, () => {
        // For today and past days, generate some realistic data
        // Higher probability of completion for habits with higher streak
        const completionProbability = Math.min(0.5 + (habit.streak / 20), 0.9);
        return Math.random() < completionProbability ? 1 : 0;
      });

      // Define custom colors for the lines
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgb(59, 130, 246)' }, // blue
        { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgb(16, 185, 129)' }, // green
        { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgb(249, 115, 22)' }, // orange
        { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgb(139, 92, 246)' }, // purple
        { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgb(239, 68, 68)' }, // red
      ];

      // Use habit category color or fallback to predefined colors
      let color;
      if (habit.category && habit.category.color) {
        // Create a transparent version for background
        const bgColor = habit.category.color + '33'; // Add 33 for 20% opacity in hex
        color = { bg: bgColor, border: habit.category.color };
      } else {
        // Use predefined colors if no category color
        color = colors[index % colors.length];
      }

      return {
        label: habit.title,
        data: data,
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      };
    });

    return {
      labels: daysOfWeek,
      datasets,
    };
  };

  // Generate completion rate data for each category
  const generateCategoryData = () => {
    // Group habits by category
    const categories: Record<string, { count: number; completed: number; color: string }> = {};
    habits.forEach(habit => {
      const categoryName = habit.category.name;
      if (!categories[categoryName]) {
        categories[categoryName] = {
          count: 0,
          completed: 0,
          color: habit.category.color
        };
      }
      categories[categoryName].count++;
      if (habit.completed) {
        categories[categoryName].completed++;
      }
    });

    // Calculate completion rates
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColors: string[] = [];
    
    Object.entries(categories).forEach(([name, info]) => {
      const completionRate = info.count > 0 ? (info.completed / info.count) * 100 : 0;
      labels.push(name);
      data.push(completionRate);
      backgroundColors.push(info.color);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Completion Rate (%)',
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function(tickValue: number | string) {
            return tickValue === 1 ? 'Completed' : 'Missed';
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Daily Habit Completion',
      },
    },
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(tickValue: number | string) {
            return `${tickValue}%`;
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Habit Completion Rate by Category',
      },
    },
  };

  // Sort habits by start time
  const sortedHabits = [...habits].sort((a, b) => {
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p>Loading dashboard...</p>
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
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track your progress and stay on top of your habits
            </p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Current streak */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Streak
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {currentStreak} days
                  </dd>
                </dl>
              </div>
            </div>

            {/* Active habits */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Habits
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {activeHabits}
                  </dd>
                </dl>
              </div>
            </div>

            {/* Completed Today */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Today
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {completedToday} / {activeHabits}
                  </dd>
                </dl>
              </div>
            </div>

            {/* Achievement points */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Achievement Points
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    256
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Today's habits */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Today's Habits
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check off your habits as you complete them
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {sortedHabits.length > 0 ? (
                sortedHabits.map((habit) => (
                  <li key={habit.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                            checked={habit.completed}
                            onChange={() => toggleHabitCompletion(habit.id)}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="flex flex-col">
                            <p className={`text-sm font-medium text-gray-900 ${habit.completed ? 'line-through' : ''}`}>
                              {habit.title}
                            </p>
                            
                            {/* Time slot and duration */}
                            {(habit.startTime || habit.duration) && (
                              <div className="flex items-center mt-1 text-xs text-gray-600">
                                <svg className="flex-shrink-0 mr-1 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">
                                  {habit.startTime && formatTime(habit.startTime)}
                                  {habit.startTime && habit.duration && ' • '}
                                  {habit.duration && habit.duration}
                                </span>
                              </div>
                            )}
                            
                            {/* Show a snippet of description if available */}
                            {habit.description && (
                              <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                {habit.description}
                              </p>
                            )}
                            
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 w-fit`}
                              style={{ 
                                backgroundColor: `${habit.category.color}20`, 
                                color: habit.category.color 
                              }}
                            >
                              {habit.category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex flex-col items-end">
                        <div className="text-xs text-gray-500 mb-1">
                          {habit.streak} day streak
                        </div>
                        <Link 
                          href={`/habits/${habit.id}`} 
                          className="text-sm text-primary-600 hover:text-primary-900"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center">
                  <p className="text-gray-500">You don't have any habits yet.</p>
                  <div className="mt-4">
                    <Link href="/habits/new" className="text-primary-600 hover:text-primary-500 font-medium">
                      Create your first habit
                    </Link>
                  </div>
                </li>
              )}
            </ul>
            {habits.length > 0 && (
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
                <Link href="/habits/new" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  + Add new habit
                </Link>
              </div>
            )}
          </div>

          {/* Weekly insights */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Weekly Insights
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your habit completion over the past week
              </p>
            </div>
            <div className="p-6">
              {habits.length > 0 ? (
                <div className="space-y-8">
                  <div className="h-64">
                    <Line
                      options={lineOptions}
                      data={generateWeeklyData()}
                    />
                  </div>
                  <div className="h-64">
                    <Bar
                      options={barOptions}
                      data={generateCategoryData()}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-6">
                  <p className="text-gray-500 mb-4">No habits yet to show insights for</p>
                  <Link href="/habits/new" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    Create your first habit to start tracking
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 