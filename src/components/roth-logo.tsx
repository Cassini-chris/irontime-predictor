'use client';

export const ChallengeRothLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 60" // Adjusted viewBox for a shorter logo
    className="h-12 w-auto"
  >
    <rect width="200" height="60" fill="hsl(var(--background))" />
    <g transform="translate(10, 10)">
      <text
        x="95"
        y="30"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="18"
        fill="hsl(var(--primary))"
        textAnchor="middle"
      >
        CHALLENGE
      </text>
      <text
        x="95"
        y="50"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="18"
        fill="hsl(var(--primary))"
        textAnchor="middle"
      >
        ROTH
      </text>
      <circle cx="150" cy="30" r="20" fill="hsl(var(--primary))" />
      <path
        d="M142 26 C 146 22, 154 22, 158 26 C 162 30, 158 38, 150 38 C 142 38, 138 30, 142 26 Z"
        fill="hsl(var(--background))"
      />
    </g>
  </svg>
);
