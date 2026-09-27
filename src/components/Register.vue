<template>
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-6 col-md-10 col-lg-6">
                <div class="card">
                    <div class="card-header">Register</div>
                    <div v-if="showMsg === 'error'" class="alert alert-danger" role="alert">
                        Invalid username or password or user already exists. Please Try again.
                    </div>
                    <div class="p-2"> </div>
                    <div class="card-body">
                        <!-- Input Field Section -->
                        <form ref="form">
                            <div class="container-fuild">
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Username</label>
                                    <div class="col col-8">
                                        <input name="username" v-model="credentials.username" type="text" required
                                            class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="form-group row justify-content-end py-2">
                                    <label class="col-4">Password</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.password" type="password"
                                            class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Re-enter password</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.password2" type="password"
                                            class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Email</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.email" type="email"
                                            class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">First Name</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.first_name" type="text"
                                            class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="form-group row justify-content-left py-2">
                                    <label class="col-4">Last Name</label>
                                    <div class="col col-8">
                                        <input v-model="credentials.last_name" type="text"
                                            class="form-control-sm form-control">
                                    </div>
                                </div>
                                <div class="row justify-content-around">
                                    <div type="button" class="btn btn-secondary col-6" @click="login">Back to Login
                                    </div>
                                    <div type="button" class="btn btn-primary col-4" @click="register">Register</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import router from '@/router';
import {APIService} from '@/api/APIService';
const apiService = new APIService();

export default {
    name: 'Register',
    data: () => ({
        credentials: {},
        password: "",
        repassword: "",
        valid: true,
        showMsg: '',
        showPassword: false,
    }),
    methods: {
  register() {    

       apiService.registerUser(this.credentials)
       .then(response => {
          if (response.status === 201) {
            this.showMsg = "";
            router.push('/auth/');
          }else{
            this.showMsg = "error";
          }
        }).catch(error => {
          this.showMsg = "error";
          router.push("/register");
        });
      },
        login() {
            router.push('/auth/');
        }
    }
}
</script>
