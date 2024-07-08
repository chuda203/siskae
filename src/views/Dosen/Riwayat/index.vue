<template>
  <div class="riwayat-container">
    <h1>Riwayat Mengajar Dosen</h1>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Kode Mata Kuliah</th>
          <th>Nama Mata Kuliah</th>
          <th>Semester</th>
          <th>Jumlah SKS</th>
          <th>Tahun Ajaran</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mataKuliah, index) in riwayatMengajar" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ mataKuliah.kode }}</td>
          <td>{{ mataKuliah.nama }}</td>
          <td>{{ mataKuliah.semester }}</td>
          <td>{{ mataKuliah.sks }}</td>
          <td>{{ mataKuliah.tahunAjaran }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="riwayatMengajar.length === 0" class="empty-state">
      <p>Dosen ini belum memiliki riwayat mengajar.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      riwayatMengajar: [
        {
          kode: 'IF101',
          nama: 'Pemrograman Dasar',
          semester: 1,
          sks: 3,
          tahunAjaran: '2023/2024',
        },
        {
          kode: 'IF102',
          nama: 'Struktur Data',
          semester: 2,
          sks: 3,
          tahunAjaran: '2024/2025',
        },
        // Add more teaching history as needed
      ],
    };
  },
};
</script>

<style scoped>
.riwayat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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

.empty-state {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
}
</style>
