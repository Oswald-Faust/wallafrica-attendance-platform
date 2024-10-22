import React from 'react';

export const Card = ({ children }) => (
  <div className="p-6 bg-white rounded shadow-md">
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const CardContent = ({ children }) => (
  <div>{children}</div>
);
