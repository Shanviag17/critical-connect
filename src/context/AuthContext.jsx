import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          setLoading(true);

          if (firebaseUser) {
            setUser(firebaseUser);

            console.log("USER UID:", firebaseUser.uid);
            console.log("USER EMAIL:", firebaseUser.email);

            const userRef = doc(
              db,
              "users",
              firebaseUser.uid
            );

            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const fetchedRole =
                userSnap.data().role
                  ?.trim()
                  .toLowerCase();

              console.log(
                "ROLE FROM FIRESTORE:",
                fetchedRole
              );

              setRole(fetchedRole);
            } else {
              console.log(
                "NO USER DOCUMENT FOUND"
              );

              // TEMP FIX
              setRole("admin");
            }
          } else {
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error(
            "AUTH CONTEXT ERROR:",
            err
          );

          setUser(null);
          setRole(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};