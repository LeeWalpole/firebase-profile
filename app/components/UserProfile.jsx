import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuthContext } from "../src/context/AuthContext";

function UserProfile() {
  const { user, signOut } = useAuthContext();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const firestore = getFirestore();
        const userDocRef = doc(firestore, "users", user.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && userData.username) {
              setUsername(userData.username);
            }
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return null; // Render nothing if the user is not signed in
  }

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while fetching user data
  }

  return (
    <div style={{ background: "green" }}>
      {user.profileImage && <img src={user.profileImage} alt="Profile" />}
      <p>Username: {username}</p>
      <p>Email: {user.email}</p>
      <p>uid: {user.uid}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default UserProfile;
