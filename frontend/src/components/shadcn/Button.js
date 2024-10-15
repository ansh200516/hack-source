// src/components/shadcn/Button.js
import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ children, className, disabled, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
        disabled ? 'opacity-50 cursor-not-allowed' : className
      }`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export const ButtonPrimary = ({ children, className, disabled, ...props }) => {
  return (
    <Button
      className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 ${
        disabled ? '' : 'hover:scale-105 transition-transform'
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

ButtonPrimary.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};