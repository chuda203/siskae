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
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      role: 'mahasiswa' // default role
    };
  },
  setup() {
    const authState = inject('auth'); // Inject auth state
    return { authState };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password,
          role: this.role
        });

        console.log("Login response:", response.data); // Log respons login

        if (response.data.success) {
          // Set authentication state and role
          this.authState.isAuthenticated = true;
          this.authState.role = response.data.user.role;
          this.authState.name = response.data.user.name; // Ambil nama dari response.user
          this.authState.email = response.data.user.email;
          this.authState.user_id = response.data.user.user_id; // Ambil user_id dari response.user

          // Jika role adalah mahasiswa, simpan informasi tambahan
          if (response.data.user.role === 'mahasiswa') {
            this.authState.department = response.data.user.department;
            this.authState.lecturer_id = response.data.user.lecturer_id;
            this.authState.current_semester = response.data.user.current_semester;
            this.authState.credit_quota = response.data.user.credit_quota;

            // Set cookies untuk informasi tambahan
            this.$cookies.set('department', this.authState.department, '1h');
            this.$cookies.set('lecturer_id', this.authState.lecturer_id, '1h');
            this.$cookies.set('current_semester', this.authState.current_semester, '1h');
            this.$cookies.set('credit_quota', this.authState.credit_quota, '1h');
          }

          console.log("Auth state after login:", this.authState); // Log auth state

          // Set cookies
          this.$cookies.set('isAuthenticated', true, '1h');
          this.$cookies.set('role', this.authState.role, '1h');
          this.$cookies.set('name', this.authState.name, '1h');
          this.$cookies.set('email', this.authState.email, '1h');
          this.$cookies.set('user_id', this.authState.user_id, '1h'); // Simpan user_id di cookies

          // Redirect to home page
          this.$router.push('/bimbingan');
        } else {
          console.error('Login failed:', response.data.message);
        }
      } catch (error) {
        console.error('Login error:', error);
      }
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
