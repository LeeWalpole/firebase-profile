// UserProfile.js
import { useAuthContext } from "../src/context/AuthContext";

function UserProfile() {
  const { user } = useAuthContext();

  if (!user) {
    return null; // Render nothing if the user is not signed in
  }

  return (
    <div style={{ background: "green" }}>
      {user.profileImage && <img src={user.profileImage} alt="Profile" />}
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default UserProfile;
