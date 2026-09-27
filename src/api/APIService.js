import axios from "axios";
import { useAuthStore } from "@/store/AuthStore";

// Change the API_URL to the correct location of the backend API before deploying the app
export const API_URL = 'https://sabredufoil.pythonanywhere.com/';
/* 'http://localhost:8000' http://127.0.0.1:8000/ or 'https://yourPythonAnywhereName.pythonanywhere.com/' */

export class APIService {
  constructor() { }

  getAuthHeaders() {
    const authStore = useAuthStore();
    if (!authStore.access) {
      return {};
    }
    return {
      Authorization: `JWT ${authStore.access}`,
    };
  }

  getMovieList() {
    return axios.get(`${API_URL}/api/movies/`, {
      headers: this.getAuthHeaders(),
    });
  }

  getMovie(param_pk) {
    return axios.get(`${API_URL}/api/movies/${param_pk}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addNewMovie(movie) {
    return axios.post(`${API_URL}/api/movies/`, movie, {
      headers: this.getAuthHeaders(),
    });
  }

  updateMovie(pk, movie) {
    return axios.put(`${API_URL}/api/movies/${pk}`, movie, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteMovie(movie_Pk) {
    return axios.delete(`${API_URL}/api/movies/${movie_Pk}`, {
      headers: this.getAuthHeaders(),
    });
  }

  authenticateLogin(credentials) {
    return axios.post(`${API_URL}/api/`, credentials);
  }

  registerUser(credentials) {
    return axios.post(`${API_URL}/register/`, {
      ...credentials,
      customusername: credentials.username,
    });
  }

}
