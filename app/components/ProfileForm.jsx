"use client";
import { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import addData from "../src/firebase/firestore/addData";
import ImageUpload from "./ImageUpload";

export default function ProfileForm() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const storage = getStorage();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data object
    const data = {
      username,
      displayName,
      gender,
      instagramURL,
      profileImage: "", // Placeholder for the profile image URL
    };

    // Upload the profile image to Firebase Storage
    if (profileImage) {
      setIsLoading(true);

      const storageRef = ref(
        storage,
        `profileImages/${username}-${profileImage.name}`
      );
      const uploadTask = uploadBytes(storageRef, profileImage);

      uploadTask.on(
        "state_changed",
        () => {
          // Upload progress logic (if needed)
        },
        (error) => {
          console.log("Error uploading profile image:", error);
          setIsLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Update the data object with the profile image URL
            data.profileImage = downloadURL;

            // Call the addData function to update Firestore
            addData("users", "user-id", data)
              .then(() => {
                console.log("Data successfully added to Firestore.");
                setIsLoading(false);

                // Reset form fields
                setUsername("");
                setDisplayName("");
                setGender("");
                setInstagramURL("");
                setProfileImage(null);
              })
              .catch((error) => {
                console.log("Error adding data to Firestore:", error);
                setIsLoading(false);
              });
          });
        }
      );
    } else {
      // Call the addData function to update Firestore
      addData("users", "user-id", data)
        .then(() => {
          console.log("Data successfully added to Firestore.");

          // Reset form fields
          setUsername("");
          setDisplayName("");
          setGender("");
          setInstagramURL("");
          setProfileImage(null);
        })
        .catch((error) => {
          console.log("Error adding data to Firestore:", error);
        });
    }
  };

  const handleImageChange = (file) => {
    setProfileImage(file);
  };

  return (
    <div>
      <h1>Create Profile</h1>
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

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}
