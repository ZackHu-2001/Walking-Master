import React, { useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import Context from './context';

function AuthStateListener({ children }) {
  const { setUser } = useContext(Context);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  return children;
}

export default AuthStateListener;
