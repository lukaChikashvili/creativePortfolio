"use client"; 

import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isNight, setIsNight] = useState(false);

  const toggleNightMode = () => setIsNight(prev => !prev);

  return (
    <UserContext.Provider value={{ isNight, toggleNightMode }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);