// src/components/shadcn/Input.js

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={classNames(
        'block w-full border border-gray-300 rounded-lg py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  className: PropTypes.string,
};

export default Input;