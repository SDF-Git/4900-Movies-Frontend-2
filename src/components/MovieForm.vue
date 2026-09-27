<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col align-items-center">
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
            <div v-if="errorMessage" class="alert alert-danger shadow" role="alert">
              {{ errorMessage }}
            </div>
          </div>
        </div>

        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6 align-items-center">
            <div class="card">
              <div class="card-header">{{ pageTitle }}</div>

              <div class="card-body">
                <form ref="form">
                  <div class="container-fluid">
                    <div v-for="field in fields" :key="field.key" class="form-group row justify-content-around py-2">
                      <label class="col-5">{{ field.label }}</label>
                      <div class="col col-7">
                        <input v-model="movie[field.key]" :type="field.type || 'text'"
                          class="form-control-sm form-control" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label>{{ isUpdate ? "Update Movie Image" : "Choose Movie Image" }}</label>
                      <input type="file" class="form-control" @change="handleFileUpload" />
                    </div>

                    <div v-if="isUpdate && !movieUpdated">
                      <div v-if="movie.movie_image" class="movie-image">
                        <img :src="movie.movie_image" alt="Movie Picture" class="img-thumbnail" />
                      </div>
                      <div v-else class="movie-image">No Image</div>
                    </div>

                    <div class="row justify-content-around">
                      <button type="button" class="btn btn-primary col-4" @click="submitMovie">
                        {{ isUpdate ? "Update" : "Save" }}
                      </button>

                      <button type="button" class="btn btn-secondary col-4" @click="cancelOperation">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { APIService } from "@/api/APIService";
import { useAuthStore } from "@/store/AuthStore";
const apiService = new APIService();

export default {
  data() {
    return {
      movie: {},
      movieUpdated: false,
      isUpdate: false,
      showMsg: "",
      movies: [],
      fields: [
        { key: "name", label: "Name" },
        { key: "director", label: "Director"},
        { key: "description", label: "Description" },
        { key: "year", label: "Year" },
        { key: "rating", label: "Rating" },
      ],
    };
  },

  computed: {
    authenticated() {
      return this.authStore.isAuthenticated;
    },
    authStore() {
      return useAuthStore();
    },
    pageTitle() {
      return this.isUpdate ? "Edit Movie" : "Add New Movie";
    },
    errorMessage() {
      switch (this.showMsg) {
        case "error":
          return "Please verify Movie Information";
        case "requestError":
          return "Please verify Movie Information - data formatted incorrectly";
        case "movieExistsError":
          return "Movie with this name already exists - please choose a different name";
        default:
          return "";
      }
    },
  },

  methods: {
    // handle the movie image upload to send to backend
    handleFileUpload(event) {
      this.movie.movie_image = event.target.files[0];
      this.movieUpdated = true;
    },
    // build the form data to send to the backend
    buildFormData() {
      const formData = new FormData();

      if (this.isUpdate) {
        formData.append("pk", this.movie.pk);
      }

      if (this.movie.movie_image && (!this.isUpdate || this.movieUpdated)) {
        formData.append("movie_image", this.movie.movie_image);
      }

      formData.append("name", this.movie.name || "");
      formData.append("director", this.movie.director || "");
      formData.append("description", this.movie.description || "");
      formData.append("year", this.movie.year || "");
      formData.append("rating", this.movie.rating || "");

      return formData;
    },
    // determine if this movie is a duplicate
    movieAlreadyExists() {
      const name = (this.movie.name || "").trim().toLowerCase();
      const year = String(this.movie.year || "").trim();
      // if an update, don't compare to itself
      if (this.isUpdate) {
        return this.movies.some(
          (m) =>
            (m.name || "").trim().toLowerCase() === name &&
            String(m.year || "").trim() === year &&
            String(m.pk) !== String(this.movie.pk)
        );
      }
      // new movie - check existing list of movies
      return this.movies.some(
        (m) =>
          (m.name || "").trim().toLowerCase() === name &&
          String(m.year || "").trim() === year
      );
    },
    // hand API error reorting
    handleApiError(error) {
      if (error.response?.status === 401) {
        this.authStore.clearAuth();
        router.push("/auth");
      } else if (error.response?.status === 400) {
        this.showMsg = "requestError";
      } else {
        this.showMsg = "error";
      }
    },
    // attempt to submit the movie to the backend
    async submitMovie() {
      if (this.movieAlreadyExists()) {
        this.showMsg = "movieExistsError";
        return;
      }
      // build the form data to send to the backend
      const formData = this.buildFormData();
      // call the appropriate apiService for either update or add
      try {
        const response = this.isUpdate
          ? await apiService.updateMovie(this.movie.pk, formData)
          : await apiService.addNewMovie(formData);
        // check response status
        if (response.status === (this.isUpdate ? 200 : 201)) {
          this.movie = response.data;
          this.showMsg = "";
          router.push(this.isUpdate ? "/movie-list/update" : "/movie-list/new");
        } else {
          this.showMsg = "error";
        }
      } catch (error) {
        this.handleApiError(error);
      }
    },
    // cancel
    cancelOperation() {
      router.push("/movie-list");
    },
    // get the movie data to edit
    async loadMovie() {
      try {
        const response = await apiService.getMovie(this.$route.params.pk);
        this.movie = response.data;
      } catch (error) {
        this.handleApiError(error);
      }
    },
  },
  // when mounted, get the movie list to ensure no duplicates
  mounted() {
    if (this.$route.params.pk) {
      this.isUpdate = true;
      this.loadMovie();
    }
    // get the current list of movies to avoid duplicates
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
};
</script>

<style>
.movie-image img {
  max-width: 200px;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
