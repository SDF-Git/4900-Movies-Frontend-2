<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 align-items-center justify-content-center">
        <blockquote>
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>&mdash; Every great film should seem new every time you see
                it.- Roger Ebert</em>
            </small>
          </footer>
        </blockquote>
      </div>
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
        <div class="alert alert-success" v-if="showMsg === 'new'" :value="true">
          New movie has been added.
        </div>
        <div class="alert alert-success" v-if="showMsg === 'update'" :value="true">
          Movie information has been updated.
        </div>
        <div class="alert alert-success" v-if="showMsg === 'deleted'" :value="true">
          Selected Movie has been deleted.
        </div>
      </div>
    </div>
    <!--Mobile device view-->
    <div class="d-md-none" id="collapsable-card" style="width: 80%">
      <button v-if="authenticated" type="button" class="btn btn-primary" @click="addNewMovie">
        <i class="bi bi-plus"></i>
      </button>
      <div class="card" v-for="movie in pagedMovies" :key="movie.pk">
        <div class="card-header" :id="'heading' + movie.name">
          <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + movie.pk"
            aria-expanded="true" :aria-controls="'collapse' + movie.pk">
            <h6 style="color: #0275d8; float: left">{{ movie.name }}</h6>
          </button>
        </div>
        <div :id="'collapse' + movie.pk" class="collapse" :aria-labelledby="'heading' + movie.pk"
          data-bs-parent="#collapsable-card">
          <div class="card-body">
            <p><b>Name:</b> {{ movie.name }}</p>
            <p><b>Director:</b> {{ movie.director }}</p>
            <p><b>Description:</b>{{ movie.description }}</p>
            <div v-if="movie.movie_image" class="movie-image">
              <!-- Debug: Print the actual image path -->
              <img :src="`${movie.movie_image}`" alt="Movie Picture" class="img-thumbnail" />
            </div>
            <div v-else class="movie-image">No Image</div>
            <p><b>Year:</b> {{ movie.year }}</p>
            <p><b>Rating:</b> {{ movie.rating }}</p>
            <div v-if="authenticated" class="btn-group">
              <button @click="updateMovie(movie)" style="background-color: transparent; padding: 5">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="deleteMovie(movie)" style="background-color: transparent; padding: 5">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--non-Mobile device view-->
    <!-- Data table - only allow update/delete when authenticated user -->
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
        <table class="table table-hover" style="overflow-y: auto" :headers="headers">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Director</th>
              <th scope="col">Description</th>
              <th scope="col">Image</th>
              <th scope="col">Year</th>
              <th scope="col">Rating</th>
              <th v-if="authenticated" scope="col">Update</th>
              <th v-if="authenticated" scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movie in pagedMovies" :key="movie.pk">
              <th scope="row">{{ movie.name }}</th>
              <td>{{ movie.director }}</td>
              <td>{{ movie.description }}</td>
              <td>
                <div v-if="movie.movie_image" class="movie-image">
                  <!-- Debug: Print the actual image path -->
                  <img :src="`${movie.movie_image}`" alt="Movie Picture" class="img-thumbnail" />
                </div>
                <div v-else class="movie-image">No Image</div>
              </td>

              <td>{{ movie.year }}</td>
              <td>{{ movie.rating }}</td>

              <td v-if="authenticated" @click="updateMovie(movie)">
                <button style="background-color: transparent; padding: 0">
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
              <td v-if="authenticated" @click="deleteMovie(movie)">
                <button style="background-color: transparent; padding: 0">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Only allow add of movie when authenticated user -->
        <div v-if="authenticated">
          <button type="button" class="btn btn-primary" @click="addNewMovie">
            Add New Movie
          </button>
        </div>
      </div>
    </div>
    <nav class="d-flex justify-content-center my-3" aria-label="Movie pagination">
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
            Prev
          </button>
        </li>

        <li class="page-item disabled">
          <span class="page-link">
            Page {{ currentPage }} / {{ totalPages }}
          </span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { APIService } from "@/api/APIService";
const apiService = new APIService();
import { useAuthStore } from "@/store/AuthStore";
import router from "@/router";
import { API_URL } from "@/api/APIService";
export default {
  data() {
    return {
      movies: [],
      currentPage: 1,
      pageSize: 5,
      movieSize: 0,
      showMsg: "",
      isMobile: false,
      API_URL,
      headers: [
        { text: "Name", sortable: false, align: "left" },
        { text: "Description", sortable: false, align: "left" },
        { text: "Image", sortable: false, align: "left" },
        { text: "Year", sortable: false, align: "left" },
        { text: "Rating", sortable: false, align: "left" },
        { text: "Update", sortable: false, align: "center" },
        { text: "Delete", sortable: false, align: "center" },
      ],
    };
  },
  mounted() {
    this.getMovies();
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    authenticated() {
      return this.authStore.isAuthenticated;
    },
    validUserName() {
      return this.authStore.user || "Guest";
    },
    // handle pages of movies
    totalPages() {
      return Math.max(1, Math.ceil(this.movies.length / this.pageSize));
    },
    pagedMovies() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.movies.slice(start, start + this.pageSize);
    },
  },
  methods: {
    // determine window size
    onResize() {
      if (window.innerWidth > 600) this.isMobile = true;
      else this.isMobile = false;
    },
    // show messages
    showMessages() {
      if (this.$route.params.msg) {
        this.showMsg = this.$route.params.msg;
      }
    },
    // get the movies from the backend
    getMovies() {
      apiService.getMovieList().then((response) => {
        this.movies = response.data.data || [];
        this.movieSize = this.movies.length;
      })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.authStore.clearAuth();
            router.push("/auth");
          } else {
            console.error("getMovies failed:", error);
          }
        });
    },
    // handle the add new movie button click
    addNewMovie() {
      if (this.authenticated) {
        router.push("/movie-create");
      } else {
        router.push("/auth");
      }
    },
    // handle the update movie button click
    updateMovie(movie) {
      if (this.authenticated) {
        if (movie.pk) {
          router.push("/movie-create/" + movie.pk);
        } else {
          router.push("/movie-create");
        }
      } else {
        router.push("/auth")
      }
    },
    // delete the movie from the backend
    deleteMovie(movie) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteMovie(movie.pk)
          .then((response) => {
            if (response.status === 204) {
              router.push("/movie-list/deleted/");
              this.getMovies();
            }
          })
          .catch((error) => {
            if (error.response.status === 401) { // "not authorized"
              this.authStore.clearAuth();
              router.push("/auth");
            } else if (error.response.status === 400) {  //"bad request"
              this.showMsg = "error";
            } else {
              this.showMsg = "error";
            }
          });
      }
    },
    // handle next or prev page
    goToPage(page) {
      const safe = Math.min(Math.max(page, 1), this.totalPages);
      this.currentPage = safe;
    },
  },
};
</script>
<style>
button {
  padding: 1rem;
  border: 0;
  cursor: pointer;
}

.movie-image img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 5px;
  margin-bottom: 10px;
  object-fit: cover;
}
</style>


