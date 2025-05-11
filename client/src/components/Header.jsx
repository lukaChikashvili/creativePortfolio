"use client"
import { useUser } from '@/context/UserContext';
import React from 'react'

const Header = () => {
    const { toggleNightMode, isNight } = useUser();

  return (
    <div className='fixed z-10 top-8 right-12'>
      <button onClick={toggleNightMode} style={{ cursor: 'pointer' }}>
        
        {isNight ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color = "white">
            <path d="M12 3C8.13 3 5 6.13 5 10C5 13.87 8.13 17 12 17C13.82 17 15.54 16.18 16.79 14.95C18.1 13.68 19 11.23 19 8.5C19 4.42 15.57 1 12 1C9.5 1 7.22 2.04 6 4.39C5.08 5.88 5 7.58 5.52 9.21C7.73 13.23 12.53 14.95 15.99 12.42C17.45 11.07 18 8.8 18 7C18 4.2 14.73 2.11 12 3Z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color = 'yellow'>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1V3" />
            <path d="M12 21V23" />
            <path d="M4.22 4.22L5.64 5.64" />
            <path d="M18.36 18.36L19.78 19.78" />
            <path d="M1 12H3" />
            <path d="M21 12H23" />
            <path d="M4.22 19.78L5.64 18.36" />
            <path d="M18.36 5.64L19.78 4.22" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default Header
