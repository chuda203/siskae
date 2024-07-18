
<template>
  <h1 class="title-container">
    <span class="title">Jadwal Ujian</span>
  </h1>
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div v-if="!tableView" class="filter-buttons-container">
            <button class="filter-button" :class="{'active': selectedHari === 'all'}" @click="selectedHari = 'all'">Semua</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Senin'}" @click="selectedHari = 'Senin'">Senin</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Selasa'}" @click="selectedHari = 'Selasa'">Selasa</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Rabu'}" @click="selectedHari = 'Rabu'">Rabu</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Kamis'}" @click="selectedHari = 'Kamis'">Kamis</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Jumat'}" @click="selectedHari = 'Jumat'">Jumat</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Sabtu'}" @click="selectedHari = 'Sabtu'">Sabtu</button>
          </div>
          <div class="view-print-wrapper">
            <div class="print-button" @click="printJadwalUjian">
              <img src="../../../assets/ic_print.png" alt="Print Icon" />
              <p>Print</p>
            </div>
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(ujian, index) in filteredJadwalUjian" :key="`ujian-${index}`" class="card">
            <div class="card-header">
              <h3>{{ ujian.namaKuliah }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ ujian.hari }}, {{ ujian.waktu }} WIB</p>
              <p>{{ ujian.bobotSKS }} SKS</p>
              <p>Dosen: {{ ujian.namaDosen }}</p>
              <p>Ruang: {{ ujian.ruangKelas }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nama Kuliah</th>
                <th>Kode</th>
                <th>SKS</th>
                <th>Dosen</th>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Ruang</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ujian, index) in filteredJadwalUjian" :key="`table-${index}`">
                <td>{{ ujian.namaKuliah }}</td>
                <td>{{ ujian.kodeMataKuliah }}</td>
                <td>{{ ujian.bobotSKS }}</td>
                <td>{{ ujian.namaDosen }}</td>
                <td>{{ ujian.hari }}</td>
                <td>{{ ujian.waktu }}</td>
                <td>{{ ujian.ruangKelas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div id="print-area" style="display: none;">
      <h1>Jadwal Ujian</h1>
      <table class="table">
        <thead>
          <tr>
            <th>Nama Kuliah</th>
            <th>Kode</th>
            <th>SKS</th>
            <th>Dosen</th>
            <th>Hari</th>
            <th>Waktu</th>
            <th>Ruang</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ujian, index) in filteredJadwalUjian" :key="`print-${index}`">
            <td>{{ ujian.namaKuliah }}</td>
            <td>{{ ujian.kodeMataKuliah }}</td>
            <td>{{ ujian.bobotSKS }}</td>
            <td>{{ ujian.namaDosen }}</td>
            <td>{{ ujian.hari }}</td>
            <td>{{ ujian.waktu }}</td>
            <td>{{ ujian.ruangKelas }}</td>
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
      selectedHari: 'all',
      tableView: false,
      jadwalUjian: [
        { kodeMataKuliah: 'MK001', namaKuliah: 'Matematika', bobotSKS: 3, namaDosen: 'Dr. John Doe', hari: 'Senin', waktu: '08:00 - 10:00', ruangKelas: 'R101' },
        { kodeMataKuliah: 'MK002', namaKuliah: 'Fisika', bobotSKS: 3, namaDosen: 'Dr. Jane Doe', hari: 'Selasa', waktu: '10:00 - 12:00', ruangKelas: 'R102' }
        // Tambahkan jadwal ujian lainnya
      ]
    };
  },
  computed: {
    filteredJadwalUjian() {
      if (this.selectedHari === 'all') {
        return this.jadwalUjian;
      } else {
        return this.jadwalUjian.filter(ujian => ujian.hari === this.selectedHari);
      }
    }
  },
  methods: {
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.selectedHari = 'all'; // Reset filter when switching to table view
      }
    },
    printJadwalUjian() {
      const printContent = document.getElementById('print-area').innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      location.reload(); // Reload the page to restore original content
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 100px;
  padding-inline: 30px;
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

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  background-color: white; /* Background putih */
  border-radius: 10px; /* Sudut yang membulat */
  padding: 10px 20px; /* Padding di dalam judul */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bayangan halus */
  text-align: center; /* Teks di tengah */
  display: inline-block;
}

@media (max-width: 768px) {
  .title {
    margin-top: 10px;
    font-size: 1em; /* Kurangi ukuran font pada tampilan mobile */
    white-space: normal; /* Izinkan teks untuk membungkus */
  }
}

.main-wrapper {
  width: 100%;
  position: relative;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px; /* Tambahkan margin bawah */
  flex-wrap: wrap;
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  white-space: nowrap;
  padding-inline-start: 100px;
  flex-grow: 1;
}

.filter-buttons-container.hidden {
  display: none;
}

.filter-buttons-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.filter-button {
  border: none;
  background-color: #cccccc;
  color: black;
  padding: 10px 20px;
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

.view-print-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .view-print-wrapper {
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .filter-buttons-container {
    width: 100%;
    justify-content: center;
    order: -1;
    padding-inline-start: 300px;
  }
}

.view-toggle {
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-left: 10px;
}

.view-toggle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  padding: 10px;
  width: 300px;
  cursor: pointer;
  position: relative;
}

.card-header {
  position: relative;
}

.card-header h3 {
  margin: 0;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 5px 0;
  width: 100%;
}

.card-body p {
  margin: 5px 0;
}

.table-container {
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.table th {
  cursor: pointer;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}
</style>
