<template>
  <header class="header">
    <button @click="toggleSidebar" class="hamburger">&#9776;</button>
    <img :src="logo" alt="Campus Logo" class="logo">
    <h1 class="campus-name">Nama Kampus</h1>
  </header>
</template>

<script>
import logo from '../assets/logo.png';

export default {
  data() {
    return {
      logo
    };
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #333;
  color: white;
}
.hamburger {
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: white;
  margin-right: 10px;
}
.logo {
  height: 40px;
  margin-right: 10px;
}
.campus-name {
  flex-grow: 1;
  text-align: center;
}
</style>
