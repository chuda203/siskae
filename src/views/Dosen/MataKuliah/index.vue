<template>
  <div class="container">
    <div class="matakuliah-card">
      <h2>Mata Kuliah</h2>
      <table class="matakuliah-table">
        <thead>
          <tr>
            <th>Presensi</th>
            <th>Input Nilai</th>
            <th>Kode Mata Kuliah</th>
            <th>Nama Mata Kuliah</th>
            <th>Jumlah SKS</th>
            <th>Informasi Ruang Kelas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="matkul in mataKuliahData" :key="matkul.kode">
            <td><button @click="showPresensi(matkul.kode)">Presensi</button></td>
            <td><button @click="inputNilai(matkul.kode)">Input Nilai</button></td>
            <td>{{ matkul.kode }}</td>
            <td>{{ matkul.nama }}</td>
            <td>{{ matkul.sks }}</td>
            <td>{{ matkul.ruang }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MataKuliah',
  data() {
    return {
      mataKuliahData: [
        { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, ruang: 'A101' },
        { kode: 'IF102', nama: 'Struktur Data', sks: 3, ruang: 'A102' },
        { kode: 'IF103', nama: 'Basis Data', sks: 3, ruang: 'A103' },
        // Tambahkan data lainnya sesuai kebutuhan
      ],
    };
  },
  methods: {
    showPresensi(kode) {
      alert(`Menampilkan presensi untuk mata kuliah ${kode}`);
      // Logika untuk menampilkan presensi
    },
    inputNilai(kode) {
      alert(`Menampilkan input nilai untuk mata kuliah ${kode}`);
      // Logika untuk menampilkan input nilai
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.matakuliah-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%; /* Atur lebar mengikuti container */
}

.card h2 {
  margin-bottom: 15px;
}

.matakuliah-table {
  width: 100%;
  border-collapse: collapse;
}

.matakuliah-table th,
.matakuliah-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.matakuliah-table th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
