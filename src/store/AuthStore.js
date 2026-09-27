import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    access: null,
    refresh: null,
  }),

  actions: {
    setAuth({ user, access, refresh }) {
      this.isAuthenticated = true;
      this.user = user;
      this.access = access;
    },
 
    clearAuth() {
      this.isAuthenticated = false;
      this.user = null;
      this.access = null;
      this.refresh = null;      
    },
  },
   // ensure the local storage is persistent during the session
  persist: {
    storage: localStorage,
    pick: ["isAuthenticated", "user", "access", "refresh"],
  },
});
