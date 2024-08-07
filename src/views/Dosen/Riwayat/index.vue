<template>
  <h1 class="title-container">
    <span class="title">Riwayat Mengajar</span>
  </h1>  
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div v-if="!tableView" class="filter-buttons-container">
            <button class="filter-button" :class="{'active': filter === 'all'}" @click="filter = 'all'">Semua</button>
            <button v-for="(matkul, index) in uniqueMataKuliah" :key="index" class="filter-button" :class="{'active': filter === matkul}" @click="filter = matkul">{{ matkul }}</button>
          </div>
          <div class="view-toggle-wrapper">
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(mengajar, index) in filteredMengajar" :key="`mengajar-${index}`" class="card">
            <div class="card-header">
              <h3>{{ mengajar.mataKuliah }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ mengajar.hari }}<strong>, </strong> {{ mengajar.tanggal }}</p>
              <p> {{ mengajar.waktuMulai }} - {{ mengajar.waktuSelesai }}<strong> WIB</strong></p>
              <p><strong>Topik:</strong> {{ mengajar.topik }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('mataKuliah')">Mata Kuliah</th>
                <th @click="sortTable('hari')">Hari</th>
                <th @click="sortTable('tanggal')">Tanggal</th>
                <th @click="sortTable('waktuMulai')">Waktu Mulai</th>
                <th @click="sortTable('waktuSelesai')">Waktu Selesai</th>
                <th @click="sortTable('topik')">Topik</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mengajar, index) in sortedMengajarTable" :key="`table-${index}`">
                <td>{{ mengajar.mataKuliah }}</td>
                <td>{{ mengajar.hari }}</td>
                <td>{{ mengajar.tanggal }}</td>
                <td>{{ mengajar.waktuMulai }}</td>
                <td>{{ mengajar.waktuSelesai }}</td>
                <td>{{ mengajar.topik }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment-timezone';

export default {
  data() {
    return {
      filter: 'all',
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      mengajarList: [] // Menghapus data statis
    };
  },
  computed: {
    uniqueMataKuliah() {
      const mataKuliahSet = new Set(this.mengajarList.map(mengajar => mengajar.mataKuliah));
      return Array.from(mataKuliahSet);
    },
    filteredMengajar() {
      return this.mengajarList.filter(mengajar => {
        return this.filter === 'all' || mengajar.mataKuliah === this.filter;
      });
    },
    sortedMengajarTable() {
      return this.filteredMengajar.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    }
  },
  methods: {
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.filter = 'all'; // Reset filter when switching to table view
      }
    },
    sortTable(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },
    async fetchMengajarList() {
      const userId = this.$cookies.get('user_id');
      try {
        const response = await axios.get(`http://localhost:3000/eventreports/dosen/${userId}`);
        this.mengajarList = response.data.data.map(mengajar => {
          const eventDate = moment(mengajar.tanggal).tz('Asia/Jakarta');
          return {
            mataKuliah: mengajar.mataKuliah,
            hari: eventDate.format('dddd'), // Mendapatkan hari dari tanggal
            tanggal: eventDate.format('YYYY-MM-DD'),
            waktuMulai: moment(mengajar.waktuMulai, 'HH:mm:ss').tz('Asia/Jakarta').format('HH:mm:ss'),
            waktuSelesai: moment(mengajar.waktuSelesai, 'HH:mm:ss').tz('Asia/Jakarta').format('HH:mm:ss'),
            topik: mengajar.topik
          };
        });
      } catch (error) {
        console.error('Error fetching mengajar list:', error);
      }
    }
  },
  mounted() {
    this.fetchMengajarList();
  }
};
</script>

<style scoped>
.enrollment-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.85em;
  color: #666;
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
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  width: 90%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-left: 150px; /* Tambahkan padding kiri */
  padding-right: 10px; /* Tambahkan padding kanan */
  height: 40px; /* Tambahkan tinggi tetap */
}

.filter-buttons-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
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
  padding-right: 10px; /* Tambahkan padding kanan untuk konsistensi */
}


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
  position: relative; /* Necessary for absolute positioning of children */
  display: flex;
  flex-direction: column; /* Tambahkan ini untuk tata letak kolom */
  text-align: start; /* Pusatkan teks */
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.modal-title {
  text-align: center;
}

.table-container {
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th, .table td {
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

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.detail-table tr:nth-child(odd) {
  background-color: #ffffff;
}

.detail-table td {
  padding: 8px;
}

/* Hide scrollbar but still allow scrolling */
body {
  overflow: hidden; /* Hide the scrollbar */
}

.container-content::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.container-content {
  -ms-overflow-style: none;  /* For Internet Explorer and Edge */
  scrollbar-width: none;  /* For Firefox */
}
</style>
