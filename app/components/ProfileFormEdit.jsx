"use client";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../src/context/AuthContext";
import ImageUpload from "./ImageUpload";

export default function ProfileForm() {
  const { user } = useAuthContext();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user data from Firestore when the component mounts
    const fetchUserData = async () => {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", user.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUsername(userData.username || "");
          setDisplayName(userData.displayName || "");
          setGender(userData.gender || "");
          setInstagramURL(userData.instagramURL || "");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated data object
    const updatedData = {
      username,
      displayName,
      gender,
      instagramURL,
    };

    setIsLoading(true);

    const firestore = getFirestore();
    const userDocRef = doc(firestore, "users", user.uid);

    try {
      // Update the user document in Firestore
      await updateDoc(userDocRef, updatedData);
      console.log("User data updated successfully.");
    } catch (error) {
      console.log("Error updating user data:", error);
    }

    setIsLoading(false);
  };

  const handleImageChange = (file) => {
    setProfileImage(file);
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="displayName">Display Name:</label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label htmlFor="instagramURL">Instagram URL:</label>
        <input
          type="text"
          id="instagramURL"
          value={instagramURL}
          onChange={(e) => setInstagramURL(e.target.value)}
        />

        <ImageUpload handleImageChange={handleImageChange} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
