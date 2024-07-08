<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
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

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.register-container {
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
