<template>
  <h1 class="title-container">
    <span class="title">Transkrip</span>
  </h1>
  <div class="main-wrapper">
    <div class="content-wrapper">
      <div class="left-container">
        <div class="container-content">
          <div class="header-wrapper">
            <div class="buttons-container">
              <button v-if="!tableView" class="filter-button" :class="{'active': selectedSemester === null}" @click="selectSemester(null)">Semua Semester</button>
              <button v-if="!tableView" class="filter-button" v-for="semester in semesters" :key="semester" :class="{'active': selectedSemester === semester}" @click="selectSemester(semester)">
                Semester {{ semester }}
              </button>
            </div>
            <div class="view-toggle-wrapper">
              <div class="view-toggle" @click="toggleView">
                <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
                <img v-else src="../../../assets/ic_table.png" alt="Table View" />
              </div>
            </div>
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
        <div class="print-card" @click="printKHS">
          <img src="../../../assets/ic_print.png" alt="Print Icon" />
          <p>{{ selectedSemester === null ? 'Cetak Transkrip' : 'Cetak KHS' }}</p>
        </div>
      </div>
    </div>
    <div id="print-area">
      <h2>{{ universityName }}</h2>
      <p>{{ universityAddress }}</p>
      <h3>TRANSKRIP NILAI</h3>
      <p>Nama : CHOIRUL HUDA</p>
      <p>NIM : 21450410037</p>
      <p>Program Studi : Teknologi Informasi</p>
      <p>Tempat Lahir : Sukoharjo</p>
      <p>Tanggal Lahir : 2003-07-14</p>
      <table class="table">
        <thead>
          <tr>
            <th>NO</th>
            <th>Nama Mata Kuliah</th>
            <th>SKS</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mataKuliah, index) in mataKuliah" :key="mataKuliah.kode">
            <td>{{ index + 1 }}</td>
            <td>{{ mataKuliah.nama }}</td>
            <td>{{ mataKuliah.sks }}</td>
            <td>{{ convertToGrade(mataKuliah.nilai) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="signature-section">
        <div class="signature">
          <p>Yogyakarta, 9 Juli 2024</p>
          <p>Kepala Program Studi</p>
          <p>Teknologi Informasi</p>
          <br><br>
          <p>Sapriani Gustina, S.Kom., M.Kom,</p>
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
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
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
      mataKuliah: []
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
    scale100To4(grade) {
      if (grade >= 85) return 4.0;
      if (grade >= 80) return 3.7;
      if (grade >= 75) return 3.3;
      if (grade >= 70) return 3.0;
      if (grade >= 65) return 2.7;
      if (grade >= 60) return 2.3;
      if (grade >= 55) return 2.0;
      if (grade >= 50) return 1.7;
      if (grade >= 45) return 1.3;
      if (grade >= 40) return 1.0;
      return 0.0;
    },
    fetchData() {
      const userId = Cookies.get('user_id');
      axios.get(`https://unified-atom-423009-a1.et.r.appspot.com/grades/user/${userId}`) // Ganti dengan URL endpoint Anda
        .then(response => {
          const data = response.data.data;
          this.mataKuliah = data.map(course => ({
            kode: course.kode_mata_kuliah,
            nama: course.nama_mata_kuliah,
            sks: course.credits,
            dosen: course.nama_dosen,
            nilai: this.scale100To4((course.uts_grade + course.uas_grade) / 2),
            semester: course.semester
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
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
    this.fetchData();
  }
};
</script>

<style>
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
  padding: 10px;
  height: 80vh;
}

.right-container {
  width: 20%; /* Ubah sesuai kebutuhan */
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.buttons-container {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-right: 0px;
  padding-left: 0px;
  height: 40px;
}

.buttons-container::-webkit-scrollbar {
  display: none;
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  width: 90%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-left: 200px; /* Tambahkan padding kiri */
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

@media (max-width: 768px) {
  .title {
    margin-top: 10px;
    font-size: 1em; /* Kurangi ukuran font pada tampilan mobile */
    white-space: normal; /* Izinkan teks untuk membungkus */
  }
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
  width: 270px;
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

.right-container {
  width: 20%; /* Kembalikan lebar sesuai kebutuhan */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ipk-ips-wrapper {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
}

.ipk-card, .ips-card {
  flex: 1;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.chart-container {
  margin-top: 20px;
  width: 100%;
}

.print-card {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
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

@media (max-width: 768px) {
  .ipk-ips-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .right-container {
    padding: 10px;
  }

  .print-card {
    margin-top: 0px;
    width: auto;
  }
  .ipk-card, .ips-card {
  flex: 1;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}
.print-card p {
  margin-top: 10px;
  font-size: 10px;
}
}
</style>
