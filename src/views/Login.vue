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
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
            <span @click="togglePasswordVisibility" class="toggle-password">
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </span>
          </div>
        </div>
        <div class="form-group role-buttons">
          <button
            type="button"
            :class="{ active: role === 'mahasiswa' }"
            @click="setRole('mahasiswa')"
          >
            Mahasiswa
          </button>
          <button
            type="button"
            :class="{ active: role === 'dosen' }"
            @click="setRole('dosen')"
          >
            Dosen
          </button>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      email: '',
      password: '',
      role: 'mahasiswa', // default role
      showPassword: false // untuk toggle visibility password
    };
  },
  setup() {
    const authState = inject('auth'); // Inject auth state
    return { authState };
  },
  methods: {
    setRole(role) {
      this.role = role;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      const toast = useToast();

      try {
        const response = await axios.post('https://unified-atom-423009-a1.et.r.appspot.com/login', {
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
          if (response.data.message === 'Invalid email or password') {
            toast.error('Periksa email atau password Anda');
          } else if (response.data.message === 'Incorrect role') {
            toast.error('Periksa role yang Anda pilih');
          } else {
            toast.error('Login gagal, coba lagi');
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login error: Periksa role Anda dan coba lagi.');
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
  padding: 20px;
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  text-align: center;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

button:hover {
  background-color: #2980b9;
}

.role-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.role-buttons button {
  width: 48%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.role-buttons button.active {
  background-color: #3498db;
  color: white;
  border-color: #2980b9;
}

.role-buttons button:not(.active) {
  background-color: #f0f0f0;
  color: #555;
}

.role-buttons button.active:hover {
  background-color: #2980b9;
}

.role-buttons button:not(.active):hover {
  background-color: #e0e0e0;
}

.password-wrapper {
  position: relative;
  display: flex;
}

.password-wrapper input {
  flex: 1;
}

.password-wrapper .toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #3498db;
}

.password-wrapper .toggle-password:hover {
  color: #2980b9;
}
</style>
