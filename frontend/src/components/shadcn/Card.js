// src/components/shadcn/Card.js
import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({ children, className }) => {
  return <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardHeader = ({ children }) => {
  return <div className="px-4 py-2 border-b w-full">{children}</div>;
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CardBody = ({ children }) => {
  return <div className="px-4 py-2 w-full">{children}</div>;
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CardFooter = ({ children, className }) => {
  return <div className={`px-4 py-2 border-t flex justify-between items-center w-full ${className}`}>{children}</div>;
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};