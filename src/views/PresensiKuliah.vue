<template>
    <div class="presensi-kuliah">
      <h1>Presensi Kuliah</h1>
      <div v-if="isClassTime" class="attendance-button">
        <button @click="markAttendance">Hadir</button>
        <p>Anda telah melakukan presensi untuk mata kuliah ini.</p>
      </div>
      <div v-else>
        <p>Saat ini bukan waktu untuk presensi.</p>
        <p>Jadwal presensi: {{ classTime }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isClassTime: false,
        classTime: 'Senin, 08:00 - 10:00', // Ganti dengan waktu sesuai jadwal kuliah
        attendanceRecorded: false
      };
    },
    methods: {
      markAttendance() {
        // Logika untuk menyimpan presensi ke server atau local storage
        this.attendanceRecorded = true;
      }
    },
    computed: {
      // Contoh computed property untuk menentukan apakah saat ini waktu untuk presensi
      // Anda dapat menyesuaikan logika ini berdasarkan waktu yang diberikan
      isClassTime() {
        const currentTime = new Date();
        const classStartTime = new Date(currentTime);
        classStartTime.setHours(8, 0, 0); // Misalnya, kelas dimulai pukul 08:00
        const classEndTime = new Date(currentTime);
        classEndTime.setHours(10, 0, 0); // Dan berakhir pukul 10:00
  
        return currentTime >= classStartTime && currentTime <= classEndTime;
      }
    }
  };
  </script>
  
  <style>
  .presensi-kuliah {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .attendance-button {
    margin-top: 20px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  p {
    margin-top: 10px;
  }
  </style>
  