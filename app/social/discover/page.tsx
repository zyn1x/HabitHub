"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// User type definition
interface User {
  id: string;
  name: string;
  avatar?: string;
  mutualFriends: number;
  isFollowing: boolean;
}

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  // Load suggested users (mock data for now)
  useEffect(() => {
    // In a real app, you would fetch from an API
    const mockSuggestedUsers: User[] = [
      {
        id: 'user5',
        name: 'John Smith',
        mutualFriends: 3,
        isFollowing: false
      },
      {
        id: 'user6',
        name: 'Emma Wilson',
        mutualFriends: 2,
        isFollowing: false
      },
      {
        id: 'user7',
        name: 'David Kim',
        mutualFriends: 1,
        isFollowing: false
      },
      {
        id: 'user8',
        name: 'Lisa Brown',
        mutualFriends: 4,
        isFollowing: false
      },
      {
        id: 'user9',
        name: 'Thomas Wilson',
        mutualFriends: 2,
        isFollowing: false
      }
    ];
    
    setSuggestedUsers(mockSuggestedUsers);
  }, []);

  // Search for users
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Mock search results - in a real app, this would be an API call
    setTimeout(() => {
      // Filter suggested users based on search query
      const results = [
        // Add exact match for the search query if it's not in suggested users
        ...(suggestedUsers.some(user => user.name.toLowerCase() === searchQuery.toLowerCase()) 
          ? [] 
          : [{
              id: `search-${Date.now()}`,
              name: searchQuery,
              mutualFriends: 0,
              isFollowing: false
            }]
        ),
        // Filter suggested users that contain the search query
        ...suggestedUsers.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ];
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500); // Simulate network delay
  };

  const toggleFollowUser = (userId: string) => {
    const isAddingFriend = !searchResults.find(user => user.id === userId)?.isFollowing;
    
    // Update search results
    setSearchResults(searchResults.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing } 
        : user
    ));
    
    // Update suggested users
    setSuggestedUsers(suggestedUsers.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing } 
        : user
    ));
    
    // Add or remove the friend from localStorage
    if (isAddingFriend) {
      // Get the user being added
      const userToAdd = [...searchResults, ...suggestedUsers].find(user => user.id === userId);
      
      if (userToAdd) {
        // Create a friend object with the necessary information
        const newFriend = {
          id: userToAdd.id,
          name: userToAdd.name,
          avatar: userToAdd.avatar || undefined,
          lastActive: 'Just now',
          status: 'online' as const
        };
        
        // Get existing friends from localStorage
        const existingFriends = JSON.parse(localStorage.getItem('friends') || '[]');
        
        // Add the new friend if not already added
        if (!existingFriends.some((friend: any) => friend.id === newFriend.id)) {
          const updatedFriends = [...existingFriends, newFriend];
          localStorage.setItem('friends', JSON.stringify(updatedFriends));
        }
      }
    } else {
      // Remove the friend from localStorage
      const existingFriends = JSON.parse(localStorage.getItem('friends') || '[]');
      const updatedFriends = existingFriends.filter((friend: any) => friend.id !== userId);
      localStorage.setItem('friends', JSON.stringify(updatedFriends));
    }
    
    // In a real app, you would also update the backend
  };

  // Render user item
  const renderUserItem = (user: User) => (
    <li key={user.id} className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          {user.mutualFriends > 0 && (
            <p className="text-sm text-gray-500 truncate">
              {user.mutualFriends} mutual {user.mutualFriends === 1 ? 'friend' : 'friends'}
            </p>
          )}
        </div>
        <div>
          <button
            onClick={() => toggleFollowUser(user.id)}
            className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none ${
              user.isFollowing 
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' 
                : 'border-transparent text-white bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {user.isFollowing ? 'Added' : 'Add Friend'}
          </button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left sidebar */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav className="sticky top-4 divide-y divide-gray-200 space-y-6">
              <div className="space-y-1">
                <Link href="/social" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <Link href="/social/discover" className="bg-gray-100 text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md" aria-current="page">
                  <svg className="text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="truncate">Discover</span>
                </Link>
              </div>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-9 xl:col-span-10">
            <div className="px-4 sm:px-0">
              {/* Search section */}
              <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900">Find Friends</h2>
                  <p className="mt-1 text-sm text-gray-500 mb-4">
                    Search for friends by username
                  </p>
                  
                  <form onSubmit={handleSearch} className="mt-6">
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex-grow focus-within:z-10">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="block w-full rounded-none rounded-l-md border-gray-300 pl-4 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="Enter username"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="ml-2">Search</span>
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Search results */}
                {searchQuery && (
                  <div className="border-t border-gray-200">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500">Search Results</h3>
                    </div>
                    
                    {isSearching ? (
                      <div className="p-6 text-center">
                        <p className="text-sm text-gray-500">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="divide-y divide-gray-200 px-6">
                        {searchResults.map(renderUserItem)}
                      </ul>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-sm text-gray-500">No users found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Suggested friends */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500">Suggested Friends</h3>
                </div>
                
                <ul className="divide-y divide-gray-200 px-6">
                  {suggestedUsers.map(renderUserItem)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 