import React, { useState } from 'react';

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return child.props.value === activeTab ? child : null;
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          isActive: child.props.value === activeTab,
          onClick: () => setActiveTab(child.props.value),
        });
      })}
    </div>
  );
}

export function TabsTrigger({ children, value, isActive, onClick }) {
  return (
    <button
      className={`p-2 ${isActive ? 'bg-gray-300' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value }) {
  return <div>{children}</div>;
}
