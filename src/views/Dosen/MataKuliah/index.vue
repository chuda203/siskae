<template>
  <div class="kelas-container">
    <!-- Jadwal Kuliah -->
    <div class="jadwal-kuliah">
      <h1>Jadwal Kuliah</h1>
      <table>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Waktu</th>
            <th>Kode Mata Kuliah</th>
            <th>Nama Mata Kuliah</th>
            <th>Semester</th>
            <th>Jumlah SKS</th>
            <th>Ruang Kelas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(jadwal, index) in filteredJadwalKuliah" :key="index">
            <td>{{ jadwal.hari }}</td>
            <td>{{ jadwal.waktu }}</td>
            <td>{{ jadwal.kodeMataKuliah }}</td>
            <td>{{ jadwal.namaMataKuliah }}</td>
            <td>{{ jadwal.semester }}</td>
            <td>{{ jadwal.sks }}</td>
            <td>{{ jadwal.ruangKelas }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jadwalKuliah: [
        {
          ruangKelas: 'A101',
          hari: 'Senin',
          waktu: '08:00 - 10:00',
          kodeMataKuliah: 'IF101',
          namaMataKuliah: 'Pemrograman Dasar',
          semester: 1,
          sks: 3,
          namaDosen: 'Dr. John Doe', // Dummy data for instructor
        },
        {
          ruangKelas: 'B202',
          hari: 'Rabu',
          waktu: '19:00 - 20:00',
          kodeMataKuliah: 'IF102',
          namaMataKuliah: 'Struktur Data',
          semester: 2,
          sks: 3,
          namaDosen: 'Dr. Jane Smith', // Dummy data for instructor
        },
        // Add more schedules as needed
      ],
      currentUser: 'Dr. John Doe', // Simulated current user (logged-in instructor)
    };
  },
  computed: {
    filteredJadwalKuliah() {
      return this.jadwalKuliah.filter(jadwal => jadwal.namaDosen === this.currentUser);
    },
  },
  methods: {
    isCurrentClass(waktu) {
      const [start, end] = waktu.split(' - ').map(time => this.parseTime(time));
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      return currentTime >= start && currentTime <= end;
    },
    parseTime(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    },
  },
};
</script>

<style scoped>
.kelas-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.jadwal-kuliah {
  text-align: center;
  margin-bottom: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>
