"use client";
import React from "react";
import { useAuthContext } from "../src/context/AuthContext";
import { useRouter } from "next/navigation";
import ProfileFormEdit from "../components/ProfileFormEdit";
import UserProfile from "../components/UserProfile";

function Dashboard() {
  const { user } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/");
  }, [user]);

  return (
    <div>
      <h1>Only logged-in users can view this page</h1>

      <UserProfile />

      <ProfileFormEdit />
    </div>
  );
}

export default Dashboard;
