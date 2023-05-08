import React from "react";
import {
  onAuthStateChanged,
  getAuth,
  signOut as firebaseSignOut,
} from "firebase/auth";
import firebase_app from "../firebase/config";

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Extract the desired fields from the user object
        const { email, uid, username, photoURL, displayName } = user;

        // Set the user data with the extracted fields
        setUser({
          email,
          uid,
          username: username, // Use 'displayName' as the username field
          profileImage: photoURL,
          displayName: displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
