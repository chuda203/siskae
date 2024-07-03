<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div>
          <label for="role">Role:</label>
          <select id="role" v-model="role">
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <router-link to="/login">Login</router-link>
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
      register() {
        // Logika register
        // Validasi email, password, dan role
        // Panggil API register dan autentikasi
        this.auth.isAuthenticated = true; // Set authentication state
        this.$router.push('/');
      }
    }
  };
  </script>
  