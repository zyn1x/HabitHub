import Header from '@/components/Header';
import Link from 'next/link';

export default function SocialFeed() {
  // Placeholder data for social feed
  const feedItems = [
    {
      id: '1',
      type: 'streak',
      user: {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: '/avatars/alex.jpg',
      },
      habit: {
        id: 'habit1',
        title: 'Morning Run',
        category: 'Fitness',
      },
      streakCount: 30,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '2',
      type: 'achievement',
      user: {
        id: 'user2',
        name: 'Sarah Williams',
        avatar: '/avatars/sarah.jpg',
      },
      achievement: {
        title: 'Consistency Master',
        description: 'Completed all habits for 7 days straight',
        badge: '🏆',
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: '3',
      type: 'new_habit',
      user: {
        id: 'user3',
        name: 'Mike Chen',
        avatar: '/avatars/mike.jpg',
      },
      habit: {
        id: 'habit3',
        title: 'Read 30 minutes',
        category: 'Learning',
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
    {
      id: '4',
      type: 'comment',
      user: {
        id: 'user2',
        name: 'Sarah Williams',
        avatar: '/avatars/sarah.jpg',
      },
      targetUser: {
        id: 'user1',
        name: 'Alex Johnson',
      },
      habit: {
        id: 'habit1',
        title: 'Morning Run',
      },
      comment: "You're doing great! Keep it up!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    {
      id: '5',
      type: 'streak',
      user: {
        id: 'user4',
        name: 'Jessica Lee',
        avatar: '/avatars/jessica.jpg',
      },
      habit: {
        id: 'habit4',
        title: 'Meditation',
        category: 'Mindfulness',
      },
      streakCount: 15,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ];

  // Format timestamp
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  // Render different feed item types
  const renderFeedItem = (item: any) => {
    switch (item.type) {
      case 'streak':
        return (
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">
                <Link href={`/profile/${item.user.id}`} className="font-medium text-gray-900 hover:underline">
                  {item.user.name}
                </Link>{' '}
                has a {item.streakCount} day streak for{' '}
                <Link href={`/habits/${item.habit.id}`} className="font-medium text-primary-600 hover:underline">
                  {item.habit.title}
                </Link>
              </p>
              <div className="mt-2 flex">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Cheer
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
            </div>
          </div>
        );
      case 'achievement':
        return (
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">
                <Link href={`/profile/${item.user.id}`} className="font-medium text-gray-900 hover:underline">
                  {item.user.name}
                </Link>{' '}
                earned the achievement{' '}
                <span className="font-medium text-secondary-600">
                  {item.achievement.badge} {item.achievement.title}
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-600">{item.achievement.description}</p>
              <div className="mt-2 flex">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Congrats
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
            </div>
          </div>
        );
      case 'new_habit':
        return (
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">
                <Link href={`/profile/${item.user.id}`} className="font-medium text-gray-900 hover:underline">
                  {item.user.name}
                </Link>{' '}
                started a new habit:{' '}
                <Link href={`/habits/${item.habit.id}`} className="font-medium text-primary-600 hover:underline">
                  {item.habit.title}
                </Link>
              </p>
              <div className="mt-2 flex space-x-4">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Like
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Comment
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
            </div>
          </div>
        );
      case 'comment':
        return (
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-800">
                <Link href={`/profile/${item.user.id}`} className="font-medium text-gray-900 hover:underline">
                  {item.user.name}
                </Link>{' '}
                commented on{' '}
                <Link href={`/profile/${item.targetUser.id}`} className="font-medium text-gray-900 hover:underline">
                  {item.targetUser.name}
                </Link>
                's habit{' '}
                <Link href={`/habits/${item.habit.id}`} className="font-medium text-primary-600 hover:underline">
                  {item.habit.title}
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-600">"{item.comment}"</p>
              <p className="mt-1 text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left sidebar */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav className="sticky top-4 divide-y divide-gray-200 space-y-6">
              <div className="space-y-1">
                <Link href="/social" className="bg-gray-100 text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md" aria-current="page">
                  <svg className="text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="truncate">Social Feed</span>
                </Link>
                <Link href="/social/friends" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="truncate">Friends</span>
                </Link>
                <Link href="/social/discover" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="truncate">Discover</span>
                </Link>
              </div>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-9 xl:col-span-7">
            <div className="px-4 sm:px-0">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Social Feed</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Stay updated with your friends' habit progress and achievements
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {feedItems.map((item) => (
                    <li key={item.id} className="p-6">
                      {renderFeedItem(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="sticky top-4 space-y-6">
              {/* Friend suggestions */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-base font-medium text-gray-900">Friend Suggestions</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {[
                    { id: 'user5', name: 'John Smith', mutualFriends: 3 },
                    { id: 'user6', name: 'Emma Wilson', mutualFriends: 2 },
                    { id: 'user7', name: 'David Kim', mutualFriends: 1 },
                  ].map((user) => (
                    <li key={user.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.mutualFriends} mutual friends
                          </p>
                        </div>
                        <button className="text-xs font-medium text-primary-600 hover:text-primary-500">
                          Add Friend
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4">
                  <Link href="/social/discover" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    View more suggestions
                  </Link>
                </div>
              </div>
              
              {/* Trending habits */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-base font-medium text-gray-900">Trending Habits</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {[
                    { id: 'trend1', title: 'Morning Yoga', category: 'Fitness', count: 126 },
                    { id: 'trend2', title: 'Digital Detox 1hr', category: 'Wellness', count: 89 },
                    { id: 'trend3', title: 'Gratitude Journal', category: 'Mindfulness', count: 67 },
                  ].map((trend) => (
                    <li key={trend.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{trend.title}</p>
                          <p className="text-xs text-gray-500">{trend.category}</p>
                        </div>
                        <p className="text-xs text-gray-500">{trend.count} people</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 