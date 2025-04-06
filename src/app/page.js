"use client";

import { useEffect, useState } from "react";
import {
  getRedirectResult,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state to prevent white screen
  const isMobileWebView =
    typeof window !== "undefined" &&
    /android|iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !navigator.standalone &&
    !window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (err) {
        console.error("Redirect error:", err);
      } finally {
        setLoading(false); // once done, stop loading
      }
    };

    fetchUser();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      if (isMobileWebView) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      }
    } catch (err) {
      console.error("Google Sign-in error:", err);
    }
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Google Sign-In
        </Typography>

        {user ? (
          <Box>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              sx={{ width: 100, height: 100, mx: "auto", mt: 2, mb: 2 }}
            />
            <Typography variant="h6">Welcome, {user.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGoogleLogin}
            sx={{ mt: 4 }}
          >
            Sign in with Google
          </Button>
        )}
      </Paper>
    </Container>
  );
}
