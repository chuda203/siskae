<template>
  <div class="ujian-container">
    <h1>Menu Ujian</h1>
    <div class="ujian-types">
      <button @click="selectedType = 'jadwalUjian'">Jadwal Ujian</button>
      <button @click="selectedType = 'cetakKartuUjian'">Cetak Kartu Ujian</button>
    </div>

    <div v-if="selectedType === 'jadwalUjian'" class="jadwal-ujian">
      <h2>Jadwal Ujian</h2>
      <table>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Waktu</th>
            <th>Kode Mata Kuliah</th>
            <th>Nama Kuliah</th>
            <th>Semester</th>
            <th>Bobot SKS</th>
            <th>Nama Dosen</th>
            <th>Ruang Kelas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ujian, index) in jadwalUjian" :key="index">
            <td>{{ ujian.hari }}</td>
            <td>{{ ujian.waktu }}</td>
            <td>{{ ujian.kodeMataKuliah }}</td>
            <td>{{ ujian.namaKuliah }}</td>
            <td>{{ ujian.semester }}</td>
            <td>{{ ujian.bobotSKS }}</td>
            <td>{{ ujian.namaDosen }}</td>
            <td>{{ ujian.ruangKelas }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedType === 'cetakKartuUjian'" class="cetak-kartu-ujian">
      <h2>Cetak Kartu Ujian</h2>
      <div class="kartu-ujian">
        <p><strong>Nama Mahasiswa:</strong> {{ mahasiswa.nama }}</p>
        <p><strong>Semester:</strong> {{ mahasiswa.semester }}</p>
        <p><strong>Program Studi:</strong> {{ mahasiswa.programStudi }}</p>
        <table>
          <thead>
            <tr>
              <th>Kode Mata Kuliah</th>
              <th>Nama Mata Kuliah</th>
              <th>Jumlah SKS</th>
              <th>Nama Dosen</th>
              <th>Paraf Pengawas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in mahasiswa.mataKuliah" :key="index">
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.sks }}</td>
              <td>{{ mataKuliah.dosen }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="ttd-section">
          <div class="ttd-container">
            <div class="ttd"></div>
            <div class="foto-container">
              <div class="foto-placeholder"></div>
              <p>Foto 3x4</p>
            </div>
          </div>
          <p class="ttd-label">Tanda Tangan Mahasiswa:</p>
          <p class="tanggal-cetak">Tanggal Cetak: {{ currentDate }}</p>
        </div>
        <button @click="printKartuUjian">Print Kartu Ujian</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedHari: 'all',
      tableView: false,
      jadwalUjian: [
        { hari: 'Senin', waktu: '08:00 - 10:00', kodeMataKuliah: 'MK001', namaKuliah: 'Matematika', semester: 1, bobotSKS: 3, namaDosen: 'Dr. John Doe', ruangKelas: 'R101' },
        { hari: 'Selasa', waktu: '10:00 - 12:00', kodeMataKuliah: 'MK002', namaKuliah: 'Fisika', semester: 1, bobotSKS: 3, namaDosen: 'Dr. Jane Doe', ruangKelas: 'R102' }
        // Add more exam schedules as needed
      ],
      mahasiswa: {
        nama: 'John Smith',
        semester: '1',
        programStudi: 'Teknik Informatika',
        mataKuliah: [
          { kode: 'MK001', nama: 'Matematika', sks: 3, dosen: 'Dr. John Doe' },
          { kode: 'MK002', nama: 'Fisika', sks: 3, dosen: 'Dr. Jane Doe' }
          // Add more courses as needed
        ]
      },
      currentDate: new Date().toLocaleDateString()
    };
  },
  methods: {
    printKartuUjian() {
      window.print();
    }
  }
};
</script>

<style scoped>
.main-wrapper {
  width: 100%;
  position: relative;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  width: 80%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-left: 300px;
  height: 40px;
}

.filter-buttons-container::-webkit-scrollbar {
  display: none;
}

.filter-button {
  border: none;
  background-color: #cccccc;
  color: black;
  padding: 0px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  flex-shrink: 0;
}

.filter-button.active {
  background-color: #007BFF;
  color: white;
}

.filter-button:last-child {
  margin-right: 0;
}

.view-toggle-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-bottom: 20px;
  padding-right: 10px;
}

.view-toggle {
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.view-toggle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.print-button-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 20px;
}

.print-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.print-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.print-button p {
  margin-top: 5px;
  font-size: 12px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.container-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ujian-types button {
  padding: 10px 20px;
  margin: 5px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.card-header {
  position: relative;
}

.ujian-types button:hover {
  background-color: #2980b9;
}

.jadwal-ujian table, .cetak-kartu-ujian table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.jadwal-ujian th, .jadwal-ujian td, .cetak-kartu-ujian th, .cetak-kartu-ujian td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.cetak-kartu-ujian {
  margin-top: 20px;
  text-align: left;
}

.cetak-kartu-ujian .kartu-ujian-footer {
  margin-top: 20px;
}

.cetak-kartu-ujian .ttd-section {
  margin-top: 20px;
}

.cetak-kartu-ujian .ttd-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cetak-kartu-ujian .ttd {
  width: 200px;
  height: 50px;
  border-bottom: 1px solid #000;
}

.cetak-kartu-ujian .foto-container {
  display: flex;
  align-items: center;
}

.cetak-kartu-ujian .foto-placeholder {
  width: 75px;
  height: 100px;
  border: 1px solid #000;
  margin-right: 20px;
}

.cetak-kartu-ujian .ttd-label {
  margin-top: 10px;
}

.cetak-kartu-ujian .tanggal-cetak {
  margin-top: 10px;
}
</style>
