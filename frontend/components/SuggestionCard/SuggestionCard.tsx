"use client";

import { useEffect, useState } from "react";
import "./SuggestionCard.css";

import { Box, Typography, Avatar, Button, Paper } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  followUser,
  unfollowUser,
  fetchFollowStatus,
  fetchFollowersCount,
} from "@/redux/follow/followSlice";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function SuggestionCard({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const [isFollowingLocal, setIsFollowingLocal] = useState(false);
  const [followersLocal, setFollowersLocal] = useState(0);
  const { isFollowing, followersCount } = useAppSelector(
    (state) => state.followers,
  );

  useEffect(() => {
    const loadData = async () => {
      const status = await dispatch(fetchFollowStatus(user.id)).unwrap();
      const count = await dispatch(fetchFollowersCount(user.id)).unwrap();

      setIsFollowingLocal(status.isFollowing);
      setFollowersLocal(count.count);
    };

    loadData();
  }, [dispatch, user.id]);

  const handleFollow = async () => {
    if (isFollowingLocal) {
      await dispatch(unfollowUser(user.id));
      setIsFollowingLocal(false);
      setFollowersLocal((prev) => prev - 1);
    } else {
      await dispatch(followUser(user.id));
      setIsFollowingLocal(true);
      setFollowersLocal((prev) => prev + 1);
    }
  };
  return (
    <Paper className="suggestion-card">
      <Box className="cover-wrapper" />

      <Box className="avatar-wrapper">
        <Avatar className="avatar">{user.name?.charAt(0)}</Avatar>
      </Box>

      <Box className="card-body">
        <Typography className="name">{user.name}</Typography>

        <Typography className="headline">{user.email}</Typography>

        <Typography className="followers">
          {followersCount} followers
        </Typography>

        <Button fullWidth onClick={handleFollow}>
          {isFollowingLocal ? "Following" : "Follow"}
        </Button>
      </Box>
    </Paper>
  );
}
