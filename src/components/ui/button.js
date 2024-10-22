import React from 'react';
import classNames from 'classnames';

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={classNames('bg-blue-500 text-white p-2 rounded hover:bg-blue-600', className)}
      {...props}
    >
      {children}
    </button>
  );
};
