import React from 'react';

export const Tabs = ({ children }) => <div>{children}</div>;

export const TabsList = ({ children }) => (
  <div className="flex justify-around">{children}</div>
);

export const TabsTrigger = ({ value, onClick, activeTab }) => (
  <button
    className={`p-2 ${activeTab === value ? 'bg-gray-300' : ''}`}
    onClick={() => onClick(value)}
  >
    {value}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => {
  if (value !== activeTab) return null;
  return <div className="p-4">{children}</div>;
};
