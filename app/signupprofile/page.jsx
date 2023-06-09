"use client";
import React from "react";
import signUp from "../src/firebase/auth/signup";
import addData from "../src/firebase/firestore/addData";
import { useRouter } from "next/navigation";

function Page() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    const { result, error } = await signUp(email, password);

    if (error) {
      return console.log(error);
    }

    // Add the user data to Firestore
    const userData = {
      email: result.user.email,
      // Add any other desired user data here
    };

    const { result: addDataResult, error: addDataError } = await addData(
      "users",
      result.user.uid, // Use the UID as the document ID
      userData
    );

    if (addDataError) {
      console.log("Error adding user data to Firestore:", addDataError);
    } else {
      console.log("User data added to Firestore successfully.");
    }

    return router.push("/dashboard");
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Sign up</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="email">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default Page;
