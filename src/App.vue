<template>
  <div class="d-md-none">
    <!-- Mobile - Top Navigation Menu -->
    <div class="nav-menu float-right" @click="showMenu">
      <i class="bi bi-list"></i>

      <div
        class="nav-content"
        :class="showMobileMenu ? 'open-menu' : 'closed-menu'"
      >
        <ul class="nav-items">
          <li>
            <router-link to="/">Home</router-link>
          </li>

          <li v-if="authenticated">
            <router-link :to="{ name: 'MovieList' }">Movies</router-link>
          </li>

          <li v-else @click="login">
            <router-link :to="{ name: 'Auth' }">Log in</router-link>
          </li>

          <li v-if="!authenticated" @click="register">
            <router-link :to="{ name: 'Register' }">Register</router-link>
          </li>

          <li v-else @click="logout">
            <router-link :to="{ name: 'Auth' }">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Non-mobile navigation -->
  <div class="d-none d-xl-block d-lg-block d-md-block">
    <ul class="nav justify-content-center">
      <li class="nav-item active">
        <router-link to="/">Home</router-link>
      </li>

      <li class="nav-item" v-if="authenticated">
        |
        <router-link :to="{ name: 'MovieList' }">Movies</router-link>
      </li>

      <li class="nav-item" v-if="!authenticated" @click="login">
        |
        <router-link :to="{ name: 'Auth' }">Log in</router-link>
      </li>

      <li class="nav-item" v-if="!authenticated" @click="register">
        |
        <router-link :to="{ name: 'Register' }">Register</router-link>
      </li>

      <li class="nav-item justify-content-end" v-if="authenticated" @click="logout">
        |
        <router-link :to="{ name: 'Auth' }">Logout</router-link>
      </li>
    </ul>
  </div>

  <router-view />
</template>

<script>
import router from "./router"
import { useAuthStore } from "./store/AuthStore";

export default {
  name: "App",
  props: {
    msg: String,
  },
  data: () => ({
    dialog: false,
    menu: [],
    showMobileMenu: false,
    auth: useAuthStore(),
  }),
  computed: {
    authStore() {
      return useAuthStore()
    },
    authenticated() {
      return this.authStore.isAuthenticated
    },
    uName() {
      return this.authStore.authState.user || "Guest"
    },
  },
  mounted() {
  },
  methods: {
    logout() {
      this.authStore.clearAuth()
      this.showMobileMenu = false
      this.$router.push("/")
    },
    home() {
      this.$router.push("/")
    },
    register() {
      this.showMobileMenu = false
      router.push("/register")
    },
    login() {
      this.showMobileMenu = false
      router.push("/auth")
    },
    showMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 1em;
  background-color: cadetblue;
}

li {
  font-weight: bold;
  color: #2c3e50;
}

a {
  color: black;
  padding: 0.5em;

  &.router-link-exact-active {
    color: #08492c;
  }
}

/* Mobile version - hamburger menu */
@media screen and (max-width: 768px) {
  .nav-menu {
    padding-top: 10px;
    padding-right: 10px;
    width: 100%;
    background-color: cadetblue;
    text-align: end;
  }

  li {
    font-weight: bold;
    color: #2c3e50;
  }

  a {
    color: black;
    padding: 0.5em;

    &.router-link-exact-active {
      color: #08492c;
    }
  }

  .nav-items {
    justify-content: left;
    align-items: left;
    list-style: none;
  }

  .open-menu {
    opacity: 1;
    height: 60%;
  }

  .closed-menu {
    opacity: 0;
    height: 20px;
    padding: 0;
  }
}
</style>
