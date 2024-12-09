import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL= "http://localhost:5001"

export const useAuthStore = create((set, get) => ({
  // State variables
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false, // Fixed typo
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket:null,


  // Method to check authentication
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup method
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

        // socket
        get().connectSocket();

    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login method
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      // socket
      get().connectSocket();

      // Ensure `connectSocket` is defined or imported
      if (get().connectSocket) {
        get().connectSocket();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout method
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSoket();

      // // Ensure `disconnectSocket` is defined or imported
      // if (get().disconnectSocket) {
      //   get().disconnectSocket();
      // }


    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true  });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updateed successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
      
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get()
    if(!authUser || get().socket?.connected ) return;
  

// IF WE ARE ALREADY CONNECTED DON'T TRY TO CREATE A CONNECTION
    const socket = io(BASE_URL)
    socket.connect();

    set({ socket:socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnected();
  },



}));
