// src/admin/theme/Card.jsx
const Card = ({ children, className = "" }) => (
  <div
    className={`
      bg-white dark:bg-gray-900
      text-gray-900 dark:text-white
      rounded-lg 
      border border-gray-200 dark:border-gray-800
      shadow-sm dark:shadow-none
      transition-colors duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

export default Card;