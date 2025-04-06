"use client";

import { Button, Typography, Container } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  console.log(user?.photoURL);

  return (
    <Container maxWidth="sm" style={{ marginTop: 100, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Google Sign-In Demo
      </Typography>
      {user ? (
        <>
          <Typography variant="h6">Welcome, {user.displayName}</Typography>
          <img
            src={
              user.photoURL.startsWith("http")
                ? user.photoURL
                : `https:${user.photoURL}`
            }
            alt="Profile"
            width={100}
            style={{ borderRadius: 50, marginTop: 20 }}
          />
        </>
      ) : (
        <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      )}
    </Container>
  );
}
