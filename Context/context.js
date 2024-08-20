import React, { createContext, useEffect, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
