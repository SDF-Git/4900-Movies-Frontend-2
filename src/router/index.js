import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import MovieList from "@/components/MovieList.vue";
import MovieForm from "@/components/MovieForm.vue";
import Auth from "@/components/Auth.vue";
import Register from "@/components/Register.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/movie-list",
    name: "MovieList",
    component: MovieList,
  },
  {
    path: "/movie-list/:msg",
    name: "MovieUpdatedList",
    component: MovieList,
  },
  {
    path: "/movie-create",
    name: "MovieForm",
    component: MovieForm,
  },
  {
    path: "/movie-create/:pk",
    name: "MovieUpdate",
    component: MovieForm,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
];

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes
 })

export default router
