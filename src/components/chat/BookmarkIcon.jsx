import React from "react";

export default function BookmarkIcon({ filled = false, className = "" }) {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" >
    <path d="M0.75 15.75V2.41667C0.75 1.97464 0.925595 1.55072 1.23816 1.23816C1.55072 0.925595 1.97464 0.75 2.41667 0.75H10.75C11.192 0.75 11.616 0.925595 11.9285 1.23816C12.2411 1.55072 12.4167 1.97464 12.4167 2.41667V15.75L7.485 12.5792C7.21608 12.4062 6.90308 12.3142 6.58333 12.3142C6.26358 12.3142 5.95058 12.4062 5.68167 12.5792L0.75 15.75Z" fill={filled ? "#FA502E" : "none"} stroke={filled ? "#FA502E" : "#DEE2E6"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  );
}
