<template>
  <h1 class="title">Kartu Rencana Studi (KRS) - Dosen</h1>
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div class="filter-buttons-container">
            <button class="filter-button" :class="{'active': filter === 'all'}" @click="filter = 'all'">Semua</button>
            <button class="filter-button" :class="{'active': filter === 'accepted'}" @click="filter = 'accepted'">Diterima</button>
            <button class="filter-button" :class="{'active': filter === 'not_accepted'}" @click="filter = 'not_accepted'">Belum Diterima</button>
          </div>
          <div class="view-toggle-wrapper">
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(mahasiswa, index) in filteredMahasiswa" :key="`mahasiswa-${index}`" class="card" @click="openDetail(mahasiswa)">
            <div class="card-header">
              <h3>{{ mahasiswa.nama }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>NIM: {{ mahasiswa.nim }}</p>
              <p>Semester: {{ mahasiswa.semester }}</p>
              <button class="lihat-detail-button" @click.stop="openDetail(mahasiswa)">Lihat Detail</button>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('nama')">Nama</th>
                <th @click="sortTable('nim')">NIM</th>
                <th @click="sortTable('semester')">Semester</th>
                <th @click="sortTable('totalSKS')">Total SKS</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mahasiswa, index) in sortedMahasiswaTable" :key="`table-${index}`">
                <td>{{ mahasiswa.nama }}</td>
                <td>{{ mahasiswa.nim }}</td>
                <td>{{ mahasiswa.semester }}</td>
                <td>{{ mahasiswa.totalSKS }}</td>
                <td><button class="lihat-detail-button" @click="openDetail(mahasiswa)">Lihat Detail</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detail Mahasiswa</h3>
        <p><strong>Nama:</strong> {{ selectedMahasiswa.nama }}</p>
        <p><strong>NIM:</strong> {{ selectedMahasiswa.nim }}</p>
        <p><strong>Semester:</strong> {{ selectedMahasiswa.semester }}</p>
        <p><strong>Total SKS:</strong> {{ selectedMahasiswa.totalSKS }}</p>
        <table class="detail-table">
          <thead>
            <tr>
              <th>Nama Mata Kuliah</th>
              <th>Kode</th>
              <th>SKS</th>
              <th>Dosen</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in selectedMahasiswa.mataKuliah" :key="`mataKuliah-${index}`">
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.sks }}</td>
              <td>{{ mataKuliah.namaDosen }}</td>
              <td>{{ mataKuliah.semester }}</td>
            </tr>
          </tbody>
        </table>
        <button v-if="selectedMahasiswa.status !== 'Approved'" class="terima-button" @click="terimaMahasiswa(selectedMahasiswa)">Terima</button>
        <button v-else class="terima-button disabled" disabled>Diterima</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies';
import axios from 'axios';

export default {
  data() {
    return {
      filter: 'all',
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      showModal: false,
      selectedMahasiswa: {},
      mahasiswaList: []
    };
  },
  computed: {
    filteredMahasiswa() {
      return this.mahasiswaList.filter(mhs => {
        if (this.filter === 'all') return true;
        if (this.filter === 'accepted') return mhs.status === 'Approved';
        if (this.filter === 'not_accepted') return mhs.status !== 'Approved';
      });
    },
    sortedMahasiswaTable() {
      return this.filteredMahasiswa.sort((a, b) => {
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
    async fetchMahasiswaRequests() {
      const lecturerId = VueCookies.get('user_id');
      console.log('Lecturer ID:', lecturerId);

      if (!lecturerId) {
        console.error('Lecturer ID is not found in cookies.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/courserequests/lecturer/${lecturerId}`);
        console.log('Fetched course requests:', response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const mahasiswaRequests = response.data.data.reduce((acc, curr) => {
            console.log('Processing request:', curr);
            const existingMahasiswa = acc.find(mhs => mhs.nim === curr.user_id);
            if (existingMahasiswa) {
              existingMahasiswa.mataKuliah.push({
                nama: curr.nama_mata_kuliah,
                kode: curr.kode_mata_kuliah,
                sks: curr.jumlah_sks,
                namaDosen: '', // Assuming no lecturer info in this query
                semester: curr.current_semester
              });
              existingMahasiswa.totalSKS += curr.jumlah_sks;
            } else {
              acc.push({
                nama: curr.nama_mahasiswa,
                nim: curr.user_id, // Assuming NIM is the user_id
                semester: curr.current_semester,
                totalSKS: curr.jumlah_sks,
                status: curr.status,
                mataKuliah: [{
                  nama: curr.nama_mata_kuliah,
                  kode: curr.kode_mata_kuliah,
                  sks: curr.jumlah_sks,
                  namaDosen: '', // Assuming no lecturer info in this query
                  semester: curr.current_semester
                }]
              });
            }
            return acc;
          }, []);

          console.log('Mapped course requests:', mahasiswaRequests);
          this.mahasiswaList = mahasiswaRequests;
        }
      } catch (error) {
        console.error('Error fetching course requests:', error);
      }
    },
    openDetail(mahasiswa) {
      this.selectedMahasiswa = mahasiswa;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async terimaMahasiswa(mahasiswa) {
      const { nim, semester } = mahasiswa;

      try {
        const response = await axios.put('http://localhost:3000/courserequests/approve', {
          user_id: nim,
          current_semester: semester
        });

        if (response.data.success) {
          mahasiswa.status = 'Approved';
          this.showModal = false;
        }
      } catch (error) {
        console.error('Error approving course request:', error);
      }
    }
  },
  mounted() {
    this.fetchMahasiswaRequests();
  }
};
</script>

<style scoped>
.sks-quota {
  font-size: 1em;
  color: #333;
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for emphasis */
  background: white;
  padding: 10px;
  margin-bottom: 20px;
}

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
  padding: 20px;
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
  padding: 10px;
  width: 300px;
  cursor: pointer;
  position: relative; /* Necessary for absolute positioning of children */
  display: flex;
  flex-direction: column; /* Tambahkan ini untuk tata letak kolom */
  text-align: center; /* Pusatkan teks */
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
  margin: 10px 0;
  width: calc(100% - 20px);
  margin-left: 10px;
  margin-right: 10px;
}

.card-body p {
  margin: 5px 0;
}

.lihat-detail-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 0;
  background-color: #3498db;
  color: white;
  border-radius: 20px; /* Rounded corners */
}

.lihat-detail-button:hover {
  background-color: #2980b9;
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

.terima-button {
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  width: 100%;
}

.terima-button:hover {
  background-color: #27ae60;
}

.terima-button.disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
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
