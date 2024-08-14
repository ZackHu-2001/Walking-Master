// context/MyContext.js
import React, { createContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);

  return (
    <Context.Provider value={{
      user,
      setUser,
    }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
