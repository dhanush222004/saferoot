import React from 'react';

const GovernmentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22V12" />
    <path d="M12 12H4L2 22h20l-2-10H12z" />
    <path d="M12 12L7 2h10l-5 10z" />
    <path d="M4 12H2" />
    <path d="M20 12h2" />
  </svg>
);

export default GovernmentIcon;