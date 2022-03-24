import React from 'react';

const SwapIcon = (props) => {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.25"
        y="0.25"
        width="39.5"
        height="39.5"
        rx="19.75"
        fill="white"
      />
      <path
        d="M18 16L15 13L12 16"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 27V13"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 24L25 27L28 24"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 13V27"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="0.25"
        y="0.25"
        width="39.5"
        height="39.5"
        rx="19.75"
        stroke="black"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default SwapIcon;
