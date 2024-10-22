import React from 'react';

export const Avatar = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-10 h-10 rounded-full border"
  />
);

export const AvatarFallback = ({ children }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
    {children}
  </div>
);
