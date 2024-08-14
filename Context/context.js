// context/MyContext.js
import React, { createContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);
  
  return (
    <Context.Provider value={{
      userId,
      setUserId
    }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
