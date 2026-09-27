<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <blockquote class="fs-5">
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>&mdash; Every great film should seem new every time you see it.
                - Roger Ebert</em>
            </small>
          </footer>
        </blockquote>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-sm-10 col-md-8">
        <div class="card">
          <div class="row">
            <div class="col-md-6 d-none d-xl-block d-lg-block d-md-block">
              <img :src="movieImg" class="card-img-top" style="height: 15rem" />
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <h5 class="card-title">Movies</h5>
                <p class="card-text">
                  View descriptions and ratings of movies you are intersting in
                  watching.
                </p>
                <a v-if="authenticated" @click="viewMovies" class="btn btn-primary">View Details</a>
                <a v-else @click="login" class="btn btn-primary">Login to View Details</a>
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
import movieImg from "@/assets/movie_logo.jpg";
import { useAuthStore } from "@/store/AuthStore";
export default {
  name: "Home",
  components: {},
  data: () => ({
    movieImg: movieImg,
  }),
  computed: {
    authenticated() {
      return this.authStore.isAuthenticated;
    },
    authStore() {
      return useAuthStore();
    },
    validUserName() {
      return this.authStore.user || "Guest";
    },
  },

  methods: {
    viewMovies() {
      router.push("/movie-list");
    },
    login() {
      router.push("/auth");
    },
  },
};
</script>
<style scoped>
h3 {
  font-style: italic;
}
</style>
