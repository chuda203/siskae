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
            <th>Nama Dosen Pengampu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(jadwal, index) in jadwalKuliah" :key="index">
            <td>{{ jadwal.hari }}</td>
            <td>{{ jadwal.waktu }}</td>
            <td>{{ jadwal.kodeMataKuliah }}</td>
            <td>{{ jadwal.namaMataKuliah }}</td>
            <td>{{ jadwal.semester }}</td>
            <td>{{ jadwal.sks }}</td>
            <td>{{ jadwal.namaDosen }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Presensi -->
    <div class="presensi">
      <h1>Presensi</h1>
      <table>
        <thead>
          <tr>
            <th>Nama Mata Kuliah</th>
            <th>Waktu</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sesi, index) in presensi" :key="`presensi-${index}`">
            <td>{{ sesi.namaMataKuliah }}</td>
            <td>{{ sesi.waktu }}</td>
            <td>{{ sesi.status }}</td>
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
          hari: 'Senin',
          waktu: '08:00 - 10:00',
          kodeMataKuliah: 'IF101',
          namaMataKuliah: 'Pemrograman Dasar',
          semester: 1,
          sks: 3,
          namaDosen: 'Dr. John Doe'
        },
        {
          hari: 'Rabu',
          waktu: '10:00 - 12:00',
          kodeMataKuliah: 'IF102',
          namaMataKuliah: 'Struktur Data',
          semester: 2,
          sks: 3,
          namaDosen: 'Dr. Jane Smith'
        },
        // Tambahkan jadwal lainnya sesuai kebutuhan
      ],
      presensi: [
        {
          namaMataKuliah: 'Pemrograman Dasar',
          waktu: '08:00 - 10:00',
          status: 'Tidak Hadir'
        },
        {
          namaMataKuliah: 'Struktur Data',
          waktu: '10:00 - 12:00',
          status: 'Tidak Hadir'
        },
        // Tambahkan data presensi sesuai kebutuhan
      ]
    };
  }
};
</script>

<style>
.kelas-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.jadwal-kuliah, .presensi {
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
