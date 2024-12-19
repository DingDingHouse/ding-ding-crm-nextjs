import React from "react";

export default function loading() {
  return (
      <div className="fixed z-[9999] bg-black bg-opacity-20 top-0 left-0 w-full h-screen">
        <div className="w-full h-screen relative  flex items-center justify-center">
          <svg className="loader" viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      </div>
    )
};