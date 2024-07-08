<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
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

        this.$router.push('/');

    }
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.router-link {
  display: block;
  margin-top: 10px;
  color: #3498db;
  text-decoration: none;
}

.router-link:hover {
  text-decoration: underline;
}
</style>
