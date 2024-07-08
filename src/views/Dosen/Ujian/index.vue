<template>
  <div class="ujian-container">
    <h1>Menu Ujian</h1>

    <div class="daftar-ujian">
      <h2>Daftar Ujian Mata Kuliah</h2>
      <table>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Waktu</th>
            <th>Kode Mata Kuliah</th>
            <th>Nama Mata Kuliah</th>
            <th>Semester</th>
            <th>Bobot SKS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ujian, index) in daftarUjian" :key="index">
            <td>{{ ujian.hari }}</td>
            <td>{{ ujian.waktu }}</td>
            <td>{{ ujian.kodeMataKuliah }}</td>
            <td>{{ ujian.namaMataKuliah }}</td>
            <td>{{ ujian.semester }}</td>
            <td>{{ ujian.bobotSKS }}</td>
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
      daftarUjian: [
        { hari: 'Senin', waktu: '08:00 - 10:00', kodeMataKuliah: 'MK001', namaMataKuliah: 'Matematika', semester: 1, bobotSKS: 3 },
        { hari: 'Selasa', waktu: '10:00 - 12:00', kodeMataKuliah: 'MK002', namaMataKuliah: 'Fisika', semester: 1, bobotSKS: 3 }
        // Add more exam schedules as needed
      ]
    };
  }
};
</script>

<style scoped>
.ujian-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.daftar-ujian table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.daftar-ujian th, .daftar-ujian td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>
 