import React from "react";

const Icon = ({ path, size = 20, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {path}
  </svg>
);

export const Plus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14" fill="none">
    <path d="M12.5 5.83333H7.5V0.833333C7.5 0.61232 7.4122 0.400358 7.25592 0.244078C7.09964 0.0877975 6.88768 0 6.66667 0C6.44565 0 6.23369 0.0877975 6.07741 0.244078C5.92113 0.400358 5.83333 0.61232 5.83333 0.833333V5.83333H0.833333C0.61232 5.83333 0.400358 5.92113 0.244078 6.07741C0.0877975 6.23369 0 6.44565 0 6.66667C0 6.88768 0.0877975 7.09964 0.244078 7.25592C0.400358 7.4122 0.61232 7.5 0.833333 7.5H5.83333V12.5C5.83333 12.721 5.92113 12.933 6.07741 13.0893C6.23369 13.2455 6.44565 13.3333 6.66667 13.3333C6.88768 13.3333 7.09964 13.2455 7.25592 13.0893C7.4122 12.933 7.5 12.721 7.5 12.5V7.5H12.5C12.721 7.5 12.933 7.4122 13.0893 7.25592C13.2455 7.09964 13.3333 6.88768 13.3333 6.66667C13.3333 6.44565 13.2455 6.23369 13.0893 6.07741C12.933 5.92113 12.721 5.83333 12.5 5.83333Z" fill="white"/>
  </svg>
);

export const Minus = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="2" viewBox="0 0 16 2" fill="none">
    <path d="M1 1H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

export const X = (props) => (
  <Icon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />
);

export const Users = (props) => (
  <Icon
    {...props}
    path={
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    }
  />
);

export const HelpCircle = (props) => (
  <Icon
    {...props}
    path={
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    }
  />
);

export const Hash = (props) => (
  <Icon
    {...props}
    path={
      <>
        <line x1="5" y1="9" x2="19" y2="9" />
        <line x1="5" y1="15" x2="19" y2="15" />
        <line x1="7" y1="4" x2="7" y2="20" />
        <line x1="17" y1="4" x2="17" y2="20" />
      </>
    }
  />
);

export const Info = (props) => (
  <Icon
    {...props}
    path={
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    }
  />
);

