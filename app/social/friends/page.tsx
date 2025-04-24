"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Friend type definition
interface Friend {
  id: string;
  name: string;
  avatar?: string;
  lastActive: string;
  status: 'online' | 'offline';
}

// Message type definition
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // State for chat functionality
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Load friends data from localStorage
  useEffect(() => {
    try {
      // Get friends from localStorage (added from discover tab)
      const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
      
      // Fallback to mock data if no friends in localStorage
      if (storedFriends.length === 0) {
        const mockFriends: Friend[] = [
          {
            id: 'user1',
            name: 'Alex Johnson',
            avatar: '/avatars/alex.jpg',
            lastActive: '5 min ago',
            status: 'online'
          },
          {
            id: 'user2',
            name: 'Sarah Williams',
            avatar: '/avatars/sarah.jpg',
            lastActive: '2 hours ago',
            status: 'offline'
          },
          {
            id: 'user3',
            name: 'Mike Chen',
            avatar: '/avatars/mike.jpg',
            lastActive: 'Just now',
            status: 'online'
          },
          {
            id: 'user4',
            name: 'Jessica Lee',
            avatar: '/avatars/jessica.jpg',
            lastActive: '1 day ago',
            status: 'offline'
          }
        ];
        
        setFriends(mockFriends);
      } else {
        setFriends(storedFriends);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      // Fallback to empty array if there's an error
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Load messages when active chat friend changes
  useEffect(() => {
    if (activeChatFriend) {
      // In a real app, you would fetch messages from an API
      // For now, let's create some mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'currentUser',
          receiverId: activeChatFriend.id,
          text: 'Hey, how are you doing?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          id: '2',
          senderId: activeChatFriend.id,
          receiverId: 'currentUser',
          text: 'I\'m doing great! Just finished my morning workout routine.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5) // 1.5 hours ago
        },
        {
          id: '3',
          senderId: 'currentUser',
          receiverId: activeChatFriend.id,
          text: 'That\'s awesome! Which habits did you complete today?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
        },
        {
          id: '4',
          senderId: activeChatFriend.id,
          receiverId: 'currentUser',
          text: 'Meditation, reading, and exercise! I\'m on a 7-day streak for meditation now!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        }
      ];

      setChatMessages(mockMessages);
    } else {
      setChatMessages([]);
    }
  }, [activeChatFriend]);

  const openChat = (friend: Friend) => {
    setActiveChatFriend(friend);
  };

  const closeChat = () => {
    setActiveChatFriend(null);
    setNewMessage('');
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeChatFriend) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      receiverId: activeChatFriend.id,
      text: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewMessage('');
    
    // Simulate a response after a short delay
    if (activeChatFriend.status === 'online') {
      setTimeout(() => {
        const responseMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: activeChatFriend.id,
          receiverId: 'currentUser',
          text: getRandomResponse(),
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, responseMsg]);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "That's great to hear!",
      "I'm working on that habit too.",
      "How's your progress with your habits going?",
      "Thanks for checking in!",
      "I just completed my daily meditation.",
      "Let's catch up soon about our habit progress."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const removeFriend = (friendId: string) => {
    // Remove friend from local state
    const updatedFriends = friends.filter(friend => friend.id !== friendId);
    setFriends(updatedFriends);
    
    // Update localStorage
    localStorage.setItem('friends', JSON.stringify(updatedFriends));
    
    // Close chat if the removed friend is the active chat
    if (activeChatFriend && activeChatFriend.id === friendId) {
      closeChat();
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
                <Link href="/social" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="truncate">Social Feed</span>
                </Link>
                <Link href="/social/friends" className="bg-gray-100 text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md" aria-current="page">
                  <svg className="text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="lg:col-span-9 xl:col-span-10">
            <div className="px-4 sm:px-0">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Friends</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Connect with friends and track habits together
                  </p>
                </div>
                
                {isLoading ? (
                  <div className="p-6 text-center">
                    <p>Loading friends...</p>
                  </div>
                ) : friends.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {friends.map((friend) => (
                      <li key={friend.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 relative">
                              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                              <span 
                                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                                  friend.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                                }`}
                              ></span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-900">{friend.name}</h3>
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-500">
                                  Last active: {friend.lastActive}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  ID: {friend.id}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => openChat(friend)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Chat
                            </button>
                            <button 
                              onClick={() => removeFriend(friend.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-12 text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No friends</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by adding some friends
                    </p>
                    <div className="mt-6">
                      <Link href="/social/discover" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
                        Find Friends
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat modal */}
      {activeChatFriend && (
        <div className="fixed inset-0 overflow-hidden z-20" aria-labelledby="chat-modal">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={closeChat}></div>
            
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  {/* Header */}
                  <div className="px-4 py-6 bg-primary-700 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                          <span 
                            className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-primary-700 ${
                              activeChatFriend.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                          ></span>
                        </div>
                        <div className="ml-3">
                          <h2 className="text-lg font-medium text-white" id="chat-title">
                            {activeChatFriend.name}
                          </h2>
                          <p className="text-sm text-primary-200">
                            {activeChatFriend.status === 'online' ? 'Online' : `Last active: ${activeChatFriend.lastActive}`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="rounded-md text-primary-200 hover:text-white focus:outline-none"
                        onClick={closeChat}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`inline-block max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === 'currentUser'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'currentUser' ? 'text-primary-200' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messageEndRef} />
                    </div>
                  </div>
                  
                  {/* Message input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={sendMessage} className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 