"use client";

import React from 'react';

const CommunityTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All Posts', icon: '📝' },
    { id: 'study groups', label: 'Study Groups', icon: '👥' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'questions', label: 'Questions', icon: '❓' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityTabs;