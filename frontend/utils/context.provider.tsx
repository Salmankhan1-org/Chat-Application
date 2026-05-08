'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";
import { ToastFunction } from "./toast-function";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  username: string;
  profileImage?: {
    url: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  friends: User[],
  onlineUsers: string[]
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}/users/me`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
      setError(err?.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async()=>{
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/friends`,{
            withCredentials: true
        });

        if(response.data.success){
            setFriends(response.data.data);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const refreshUser = async () => {
    await fetchUser();
  };

    const logout = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_HOST}/users/logout`,
            
                { withCredentials: true }
            );

            if(response.data.success){
                if (user?._id) {
                  socket.emit("user_offline", { userId: user._id });
                }
                socket.disconnect(); // ✅ IMPORTANT
                setUser(null);
                setOnlineUsers([]);
                ToastFunction('success',response.data.message);
                router.push('/accounts/auth/login')
            }
        } catch (err) {
            ToastFunction('error',error);
        }
    };

  useEffect(() => {
  fetchUser().then(() => fetchFriends()); // sequential, not parallel
}, []);


useEffect(() => {
  if (!user?._id) return;

  const onConnect = () => {
    socket.emit("join_chat", { userId: user._id });
  };

  const handleOnlineUsers = (users: string[]) => {
    setOnlineUsers(users.filter((id) => id !== user._id));
  };

  const handleUserOnline = ({ userId }: { userId: string }) => {
    if (userId !== user._id) {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    }
  };

  const handleUserOffline = ({ userId, lastSeen }: { userId: string; lastSeen: string }) => {
    setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    setFriends((prev: any) =>
      prev.map((f: any) => (f._id === userId ? { ...f, lastSeen } : f))
    );
  };

  socket.on("connect", onConnect);
  socket.on("online_users", handleOnlineUsers);
  socket.on("user_online", handleUserOnline);
  socket.on("user_offline", handleUserOffline);

  if (!socket.connected) {
    socket.connect();
  } else {
    onConnect();
  }

  return () => {
    socket.off("connect", onConnect);
    socket.off("online_users", handleOnlineUsers);
    socket.off("user_online", handleUserOnline);
    socket.off("user_offline", handleUserOffline);
  };
}, [user?._id]); // Fires immediately on login/refresh
  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser, logout , friends, onlineUsers}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};