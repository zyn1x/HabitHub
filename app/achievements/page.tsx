"use client";

import Header from '@/components/Header';
import { useState } from 'react';

export default function Achievements() {
  const [achievements] = useState([
    {
      id: '1',
      title: 'First Timer',
      description: 'Complete your first habit',
      badge: '🔰',
      date: '2023-12-01',
      progress: 100
    },
    {
      id: '2',
      title: 'Consistency Master',
      description: 'Complete all habits for 7 days straight',
      badge: '🏆',
      date: '2023-12-15',
      progress: 100
    },
    {
      id: '3',
      title: 'Fitness Enthusiast',
      description: 'Complete 20 fitness habits',
      badge: '💪',
      date: '2024-01-10',
      progress: 100
    },
    {
      id: '4',
      title: 'Mindfulness Guru',
      description: 'Complete 30 mindfulness habits',
      badge: '🧘',
      date: null,
      progress: 67
    },
    {
      id: '5',
      title: 'Early Bird',
      description: 'Complete morning habits for 14 days straight',
      badge: '🐦',
      date: null,
      progress: 85
    },
    {
      id: '6',
      title: 'Social Butterfly',
      description: 'Connect with 5 friends',
      badge: '🦋',
      date: null,
      progress: 40
    },
    {
      id: '7',
      title: 'Habit Master',
      description: 'Create and actively maintain 10 habits',
      badge: '👑',
      date: null,
      progress: 50
    },
    {
      id: '8',
      title: 'Iron Will',
      description: 'Reach a 30-day streak with any habit',
      badge: '⚔️',
      date: null,
      progress: 23
    }
  ]);

  // Filter tabs
  const [activeTab, setActiveTab] = useState('all'); // all, completed, inProgress

  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'completed') return achievement.progress === 100;
    if (activeTab === 'inProgress') return achievement.progress < 100;
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track your progress and earn rewards for building great habits
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Achievements
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {achievements.length}
                  </dd>
                </dl>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {achievements.filter(a => a.progress === 100).length}
                  </dd>
                </dl>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {achievements.filter(a => a.progress < 100).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`${
                  activeTab === 'completed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('inProgress')}
                className={`${
                  activeTab === 'inProgress'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                In Progress
              </button>
            </nav>
          </div>

          {/* Achievements grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-2xl">
                      {achievement.badge}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {achievement.progress === 100 ? (
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="bg-green-100 h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-green-600">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${achievement.progress}%` }}></div>
                          </div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{achievement.progress}%</span>
                      </div>
                    )}
                  </div>
                  
                  {achievement.date && (
                    <div className="mt-4 text-sm text-gray-500">
                      Achieved on {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No achievements found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {activeTab === 'completed' 
                  ? "You haven't completed any achievements yet. Keep working on your habits!" 
                  : activeTab === 'inProgress' 
                    ? "You don't have any achievements in progress. Start building habits to unlock achievements!"
                    : "No achievements available. Complete habits to unlock achievements!"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 