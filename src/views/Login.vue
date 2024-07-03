<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div>
          <label for="role">Login sebagai:</label>
          <select id="role" v-model="role">
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
      <router-link to="/register">Register</router-link>
    </div>
  </template>
  
  <script>
  import { inject } from 'vue';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        role: 'mahasiswa' // default role
      };
    },
    setup() {
      const auth = inject('auth'); // Inject auth state
      return { auth };
    },
    methods: {
      login() {
        // Set authentication state and role
        this.auth.isAuthenticated = true;
        this.auth.role = this.role;
        // Redirect to appropriate home page based on role
        if (this.role === 'dosen') {
          this.$router.push('/dosen');
        } else {
          this.$router.push('/');
        }
      }
    }
  };
  </script>
  