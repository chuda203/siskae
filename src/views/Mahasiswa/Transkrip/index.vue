<template>
  <h1 class="title">Kartu Hasil Studi (KHS)</h1>

  <div class="main-wrapper">
    <div class="content-wrapper">
      <div class="left-container">
        <div class="container-content">
          <div class="buttons-container">
            <button v-if="!tableView" class="filter-button" :class="{'active': selectedSemester === null}" @click="selectSemester(null)">Semua Semester</button>
            <button v-if="!tableView" class="filter-button" v-for="semester in semesters" :key="semester" :class="{'active': selectedSemester === semester}" @click="selectSemester(semester)">
              Semester {{ semester }}
            </button>
          </div>
          <div v-if="!tableView" class="cards-container">
            <!-- Card View -->
            <div v-for="(mataKuliah, index) in filteredMataKuliah" :key="`mataKuliah-${index}`" class="card" @click="openDetail(mataKuliah)">
              <div class="card-header">
                <h3>{{ mataKuliah.nama }}</h3>
              </div>
              <div class="card-body">
                <p>{{ convertToGrade(mataKuliah.nilai) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="table-container">
            <!-- Table View -->
            <table class="table">
              <thead>
                <tr>
                  <th @click="sortTable('nama')">Nama Mata Kuliah</th>
                  <th @click="sortTable('kode')">Kode</th>
                  <th @click="sortTable('sks')">SKS</th>
                  <th @click="sortTable('namaDosen')">Dosen</th>
                  <th @click="sortTable('semester')">Semester</th>
                  <th @click="sortTable('nilai')">Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mataKuliah in sortedMataKuliahTable" :key="mataKuliah.kode">
                  <td>{{ mataKuliah.nama }}</td>
                  <td>{{ mataKuliah.kode }}</td>
                  <td>{{ mataKuliah.sks }}</td>
                  <td>{{ mataKuliah.dosen }}</td>
                  <td>{{ mataKuliah.semester }}</td>
                  <td>{{ convertToGrade(mataKuliah.nilai) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div class="toggle-view-wrapper">
          <div class="view-toggle" @click="toggleView">
            <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
            <img v-else src="../../../assets/ic_table.png" alt="Table View" />
          </div>
        </div>
        <div class="ipk-ips-wrapper">
          <div class="ipk-card">
            <div class="ipk-header">
              <h3>IPK</h3>
            </div>
            <div class="ipk-body">
              <p>{{ ipk.toFixed(2) }}</p>
            </div>
          </div>
          <div class="ips-card">
            <div class="ips-header">
              <h3>IPS</h3>
            </div>
            <div class="ips-body">
              <p>{{ ips.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="ipsChart"></canvas>
        </div>
        <div class="print-card" @click="printKHS">
          <img src="../../../assets/ic_print.png" alt="Print Icon" />
          <p>{{ selectedSemester === null ? 'Cetak Transkrip' : 'Cetak KHS' }}</p>
        </div>
      </div>
    </div>
    <div id="print-area">
      <h2>{{ universityName }}</h2>
      <p>{{ universityAddress }}</p>
      <h3>Kartu Hasil Studi (KHS)</h3>
      <div v-if="selectedSemester === null">
        <h4>Semua Semester</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nama Mata Kuliah</th>
              <th>Kode</th>
              <th>SKS</th>
              <th>Dosen</th>
              <th>Semester</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mataKuliah in sortedMataKuliahTable" :key="mataKuliah.kode">
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.sks }}</td>
              <td>{{ mataKuliah.dosen }}</td>
              <td>{{ mataKuliah.semester }}</td>
              <td>{{ convertToGrade(mataKuliah.nilai) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <h4>Semester {{ selectedSemester }}</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nama Mata Kuliah</th>
              <th>Kode</th>
              <th>SKS</th>
              <th>Dosen</th>
              <th>Semester</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mataKuliah in filteredMataKuliah" :key="mataKuliah.kode">
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.sks }}</td>
              <td>{{ mataKuliah.dosen }}</td>
              <td>{{ mataKuliah.semester }}</td>
              <td>{{ convertToGrade(mataKuliah.nilai) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="signature-section">
        <div class="signature">
          <p>Dosen Pembimbing</p>
          <p>(___________________)</p>
        </div>
        <div class="signature">
          <p>Kaprogdi</p>
          <p>(___________________)</p>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detail Mata Kuliah</h3>
        <table class="detail-table">
          <tr><td><strong>Nama Mata Kuliah</strong></td><td>{{ selectedMataKuliah.nama }}</td></tr>
          <tr><td><strong>Kode Mata Kuliah</strong></td><td>{{ selectedMataKuliah.kode }}</td></tr>
          <tr><td><strong>SKS</strong></td><td>{{ selectedMataKuliah.sks }}</td></tr>
          <tr><td><strong>Nama Dosen</strong></td><td>{{ selectedMataKuliah.dosen }}</td></tr>
          <tr><td><strong>Semester</strong></td><td>{{ selectedMataKuliah.semester }}</td></tr>
          <tr><td><strong>Nilai</strong></td><td>{{ convertToGrade(selectedMataKuliah.nilai) }}</td></tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  components: {
    Bar
  },
  data() {
    return {
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],
      selectedSemester: null,
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      showModal: false,
      selectedMataKuliah: {},
      universityName: 'Nama Universitas',
      universityAddress: 'Alamat Universitas',
      mataKuliah: [
        { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, dosen: 'Dr. A', nilai: 3.8, semester: 1 },
        { kode: 'IF102', nama: 'Struktur Data', sks: 3, dosen: 'Dr. B', nilai: 2.9, semester: 1 },
        { kode: 'IF103', nama: 'Matematika Diskrit', sks: 3, dosen: 'Dr. E', nilai: 3.5, semester: 1 },
        { kode: 'IF104', nama: 'Logika Informatika', sks: 3, dosen: 'Dr. F', nilai: 3.2, semester: 1 },
        { kode: 'IF201', nama: 'Algoritma dan Pemrograman', sks: 4, dosen: 'Dr. C', nilai: 3.7, semester: 2 },
        { kode: 'IF202', nama: 'Basis Data', sks: 4, dosen: 'Dr. D', nilai: 2.8, semester: 2 },
        { kode: 'IF203', nama: 'Sistem Operasi', sks: 3, dosen: 'Dr. G', nilai: 3.6, semester: 2 },
        { kode: 'IF204', nama: 'Jaringan Komputer', sks: 3, dosen: 'Dr. H', nilai: 3.1, semester: 2 },
        { kode: 'IF301', nama: 'Pemrograman Web', sks: 4, dosen: 'Dr. I', nilai: 3.9, semester: 3 },
        { kode: 'IF302', nama: 'Kecerdasan Buatan', sks: 4, dosen: 'Dr. J', nilai: 2.7, semester: 3 },
        { kode: 'IF303', nama: 'Teori Bahasa dan Otomata', sks: 3, dosen: 'Dr. K', nilai: 3.4, semester: 3 },
        { kode: 'IF304', nama: 'Metode Numerik', sks: 3, dosen: 'Dr. L', nilai: 1.0, semester: 3 },
        { kode: 'IF401', nama: 'Manajemen Proyek', sks: 4, dosen: 'Dr. M', nilai: 3.8, semester: 4 },
        { kode: 'IF402', nama: 'Sistem Informasi', sks: 4, dosen: 'Dr. N', nilai: 1.9, semester: 4 },
        { kode: 'IF403', nama: 'Analisis Algoritma', sks: 3, dosen: 'Dr. O', nilai: 3.5, semester: 4 },
        { kode: 'IF404', nama: 'Pengolahan Citra Digital', sks: 3, dosen: 'Dr. P', nilai: 3.2, semester: 4 },
        { kode: 'IF501', nama: 'Data Mining', sks: 4, dosen: 'Dr. Q', nilai: 3.9, semester: 5 },
        { kode: 'IF502', nama: 'Pemrograman Mobile', sks: 4, dosen: 'Dr. R', nilai: 2.6, semester: 5 },
        { kode: 'IF503', nama: 'Sistem Pakar', sks: 3, dosen: 'Dr. S', nilai: 1.4, semester: 5 },
        { kode: 'IF504', nama: 'Sistem Informasi Geografis', sks: 3, dosen: 'Dr. T', nilai: 3.1, semester: 5 },
        { kode: 'IF601', nama: 'Cloud Computing', sks: 4, dosen: 'Dr. U', nilai: 3.8, semester: 6 },
        { kode: 'IF602', nama: 'Keamanan Jaringan', sks: 4, dosen: 'Dr. V', nilai: 2.7, semester: 6 },
        { kode: 'IF603', nama: 'Big Data', sks: 3, dosen: 'Dr. W', nilai: 3.5, semester: 6 },
        { kode: 'IF604', nama: 'Internet of Things', sks: 3, dosen: 'Dr. X', nilai: 3.2, semester: 6 },
        { kode: 'IF701', nama: 'Pemrograman Game', sks: 4, dosen: 'Dr. Y', nilai: 3.9, semester: 7 },
        { kode: 'IF702', nama: 'Machine Learning', sks: 4, dosen: 'Dr. Z', nilai: 2.8, semester: 7 },
        { kode: 'IF703', nama: 'Blockchain', sks: 3, dosen: 'Dr. AA', nilai: 3.5, semester: 7 },
        { kode: 'IF704', nama: 'Robotika', sks: 3, dosen: 'Dr. BB', nilai: 3.0, semester: 7 },
        { kode: 'IF801', nama: 'Manajemen TI', sks: 4, dosen: 'Dr. CC', nilai: 3.8, semester: 8 },
        { kode: 'IF802', nama: 'Skripsi', sks: 4, dosen: 'Dr. DD', nilai: 2.7, semester: 8 },
        { kode: 'IF803', nama: 'Technopreneurship', sks: 3, dosen: 'Dr. EE', nilai: 3.6, semester: 8 },
        { kode: 'IF804', nama: 'Kerja Praktik', sks: 3, dosen: 'Dr. FF', nilai: 3.1, semester: 8 },
        // More courses...
      ]
    };
  },
  computed: {
    filteredMataKuliah() {
      if (this.selectedSemester === null) {
        return this.mataKuliah;
      }
      return this.mataKuliah.filter(mk => mk.semester === this.selectedSemester);
    },
    sortedMataKuliah() {
      return this.filteredMataKuliah.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    },
    sortedMataKuliahTable() {
      return this.mataKuliah.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    },
    ipk() {
      let totalNilai = 0;
      let totalSKS = 0;
      this.mataKuliah.forEach(mk => {
        totalNilai += mk.nilai * mk.sks;
        totalSKS += mk.sks;
      });
      return totalNilai / totalSKS;
    },
    ips() {
      let totalNilai = 0;
      let totalSKS = 0;
      this.filteredMataKuliah.forEach(mk => {
        totalNilai += mk.nilai * mk.sks;
        totalSKS += mk.sks;
      });
      return totalNilai / totalSKS;
    }
  },
  methods: {
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.selectedSemester = null; // Reset filter when switching to table view
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
    selectSemester(semester) {
      this.selectedSemester = semester;
    },
    openDetail(mataKuliah) {
      this.selectedMataKuliah = mataKuliah;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    convertToGrade(nilai) {
      if (nilai >= 3.75) return 'A';
      if (nilai >= 3.25) return 'B+';
      if (nilai >= 2.75) return 'B';
      if (nilai >= 2.25) return 'C+';
      if (nilai >= 1.75) return 'C';
      if (nilai >= 1.25) return 'D+';
      if (nilai >= 0.75) return 'D';
      return 'E';
    },
    renderChart() {
      const ctx = document.getElementById('ipsChart').getContext('2d');
      new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
          datasets: [
            {
              label: 'IPS',
              data: this.getIpsData(),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    getIpsData() {
      const ipsData = [];
      for (let semester = 1; semester <= 8; semester++) {
        const semesterCourses = this.mataKuliah.filter(mk => mk.semester === semester);
        let totalNilai = 0;
        let totalSKS = 0;
        semesterCourses.forEach(mk => {
          totalNilai += mk.nilai * mk.sks;
          totalSKS += mk.sks;
        });
        const ips = totalNilai / totalSKS;
        ipsData.push(ips);
      }
      return ipsData;
    },
    printKHS() {
      const printContent = document.getElementById('print-area').innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      location.reload(); // Reload the page to restore original content
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    mataKuliah: {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.main-wrapper {
  display: flex;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
}

.content-wrapper {
  display: flex;
  width: 100%;
}

.left-container {
  width: 80%; /* Ubah sesuai kebutuhan */
  padding: 20px;
  height: 80vh;
}

.right-container {
  width: 20%; /* Ubah sesuai kebutuhan */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-toggle, .ipk-card, .ips-card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.view-toggle {
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.view-toggle img {
  width: 100%;
  height: auto; /* Adjust height automatically */
  display: block; /* Ensures the image is treated as a block-level element */
}

.ipk-ips-wrapper {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
}

.ipk-card, .ips-card {
  flex: 1;
}

.chart-container {
  margin-top: 20px;
  width: 100%;
}

.print-card {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px; /* Increased padding */
  text-align: center;
  cursor: pointer;
  width: 100px; /* Fixed width */
  height: 100px; /* Fixed height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.print-card img {
  margin-top: 10px;
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.print-card p {
  margin-top: 10px;
  font-size: 14px;
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
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.buttons-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.filter-button, .toggle-view-button {
  border: none;
  background-color: #cccccc;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.filter-button:last-child, .toggle-view-button:last-child {
  margin-right: 0;
}

.filter-button.active {
  background-color: #007BFF;
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
  width: 400px;
}

.modal-content h3 {
  margin-top: 0;
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

.table tbody tr:nth-child(even),
.detail-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(odd),
.detail-table tr:nth-child(odd) {
  background-color: #ffffff;
}

#print-area {
  display: none;
}

@media print {
  .main-wrapper, .modal-overlay, .print-wrapper, .view-toggle, .ipk-ips-wrapper {
    display: none;
  }
  #print-area {
    display: block;
  }
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.signature {
  text-align: center;
}
</style>
