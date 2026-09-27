<template>
  <div class="container">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-sm-6 col-md-4 col-lg-4">
        <div class="card mx-auto shadow">
          <div class="card-body">
            <div class="card-title"><span>Login</span></div>

            <div v-if="showMsg === 'loginError'" class="alert alert-danger" role="alert">
              Invalid username or password. Please Try again.
            </div>

            <div v-else-if="showMsg === 'axiosError'" class="alert alert-danger" role="alert">
              Access blocked by server. Check server.
            </div>

            <div class="card-text pt-2">
              <div class="col-md-10 mb-3">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">@</span>
                  </div>

                  <input v-model="credentials.username" maxlength="70" required type="text" class="form-control mb-3"
                    placeholder="Username" aria-describedby="inputGroupPrepend2" />

                  <div class="w-100"></div>

                  <div class="input-group-prepend">
                    <span class="input-group-text">***</span>
                  </div>

                  <input :type="showPassword ? 'text' : 'password'" v-model="credentials.password" maxlength="20"
                    required @keyup.enter="login" class="form-control" placeholder="Password"
                    aria-describedby="inputGroupPrepend2" />
                </div>
              </div>

              <button ref="form" @click.prevent="login" class="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { APIService } from '@/api/APIService'
import { useAuthStore } from '@/store/AuthStore'

const apiService = new APIService()

export default {
  name: 'Auth',

  data: () => ({
    credentials: {
      username: '',
      password: ''
    },
    valid: true,
    showMsg: '',
    loading: false,
    rules: {
      username: [
        (v) => !!v || 'Username is required',
        (v) =>
          (v && v.length > 3) ||
          'A username must be more than 3 characters long',
        (v) =>
          /^[a-z0-9_]+$/.test(v) ||
          'A username can only contain letters and digits',
      ],
      password: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length > 7) ||
          'The password must be longer than 7 characters',
      ],
    },
    showPassword: false,
  }),

  computed: {
    authStore() {
      return useAuthStore()
    },
  },

  methods: {
    async login() {
      this.showMsg = ''
      this.authStore.clearAuth()

      try {
        const loginResponse = await apiService.authenticateLogin(this.credentials)
        const access = loginResponse.data.access
        const refresh = loginResponse.data.refresh

        this.authStore.setAuth({
          user: this.credentials.username,
          access,
          refresh
        })

        router.push('/')
      } catch (error) {
        console.log('error during login:', error)

        this.authStore.clearAuth()

        if (error.message === 'Network Error') {
          this.showMsg = 'axiosError'
        } else if (error.response && error.response.status === 401) {
          this.showMsg = 'loginError'
          router.push('/auth')
        } else if (error.response && error.response.status === 400) {
          this.showMsg = 'loginError'
        } else {
          this.showMsg = 'axiosError'
          router.push('/auth')
        }
      }
    }
  }
}
</script>
