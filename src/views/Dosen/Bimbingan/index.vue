<template>
  <h1 class="title">Bimbingan</h1>
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div v-if="!tableView" class="filter-buttons-container">
            <button class="filter-button" :class="{'active': filter === 'all'}" @click="filter = 'all'">Semua</button>
            <button class="filter-button" :class="{'active': filter === 'krs'}" @click="filter = 'krs'">KRS</button>
            <button class="filter-button" :class="{'active': filter === 'kp'}" @click="filter = 'kp'">Kerja Praktik</button>
            <button class="filter-button" :class="{'active': filter === 'skripsi'}" @click="filter = 'skripsi'">Skripsi</button>
          </div>
          <div class="view-toggle-wrapper">
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(item, index) in filteredBimbingan" :key="`bimbingan-${index}`" class="card">
            <div class="card-header">
              <h3>{{ item.topik }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ item.namaMahasiswa }}</p>
              <p>{{ item.nim }}</p>
              <p>{{ item.judul }}</p>
              <p>{{ item.status }}</p>
              <button @click="ajukanJadwal(item)" class="ajukan-jadwal-button">Ajukan Jadwal</button>
              <button @click="ubahStatus(item)" class="ubah-status-button">Ubah Status</button>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Topik</th>
                <th>Nama Mahasiswa</th>
                <th>NIM</th>
                <th>Judul</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredBimbingan" :key="`table-${index}`">
                <td>{{ item.topik }}</td>
                <td>{{ item.namaMahasiswa }}</td>
                <td>{{ item.nim }}</td>
                <td>{{ item.judul }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <button @click="ajukanJadwal(item)" class="ajukan-jadwal-button">Ajukan Jadwal</button>
                  <button @click="ubahStatus(item)" class="ubah-status-button">Ubah Status</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Ajukan Jadwal -->
    <div v-if="showModalJadwal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Ajukan Jadwal Bimbingan</h3>
        <div class="jadwal-cards-container">
          <div v-for="(jadwal, index) in selectedStudent.jadwal" :key="`jadwal-${index}`" class="jadwal-card">
            <p><strong>Tanggal:</strong> {{ jadwal.tanggal }}</p>
            <p><strong>Waktu:</strong> {{ jadwal.waktu }}</p>
            <p><strong>Ruang:</strong> {{ jadwal.ruang }}</p>
          </div>
        </div>
        <form @submit.prevent="submitJadwal">
          <div class="form-group">
            <label for="tanggal">Tanggal</label>
            <input type="date" id="tanggal" v-model="formJadwal.tanggal" required />
          </div>
          <div class="form-group">
            <label for="waktu">Waktu</label>
            <input type="time" id="waktu" v-model="formJadwal.waktu" required />
          </div>
          <div class="form-group">
            <label for="ruang">Ruang</label>
            <input type="text" id="ruang" v-model="formJadwal.ruang" required />
          </div>
          <button type="submit" class="submit-button">Ajukan</button>
        </form>
      </div>
    </div>

    <!-- Modal Ubah Status -->
    <div v-if="showModalStatus" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Ubah Status Bimbingan</h3>
        <div class="status-buttons">
          <button @click="setStatus('ACC')" :class="{'active': formStatus.status === 'ACC'}">ACC</button>
          <button @click="setStatus('Proses Bimbingan')" :class="{'active': formStatus.status === 'Proses Bimbingan'}">Proses Bimbingan</button>
          <button @click="setStatus('Belum Bimbingan')" :class="{'active': formStatus.status === 'Belum Bimbingan'}">Belum Bimbingan</button>
        </div>
        <button @click="submitStatus" class="submit-button">Ubah Status</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: 'all',
      tableView: false,
      showModalJadwal: false,
      showModalStatus: false,
      formJadwal: {
        tanggal: '',
        waktu: '',
        ruang: ''
      },
      formStatus: {
        status: ''
      },
      selectedStudent: null,
      bimbinganList: [
        { topik: 'KRS', namaMahasiswa: 'John Doe', nim: '123456789', status: 'Belum Bimbingan', judul: 'Semester 1', type: 'krs', jadwal: [] },
        { topik: 'Kerja Praktik', namaMahasiswa: 'Jane Smith', nim: '987654321', status: 'ACC', judul: 'Analisis Sistem Informasi', type: 'kp', jadwal: [] },
        { topik: 'Skripsi', namaMahasiswa: 'Alice Brown', nim: '456789123', status: 'Proses Bimbingan', judul: 'Pengembangan Aplikasi Mobile', type: 'skripsi', jadwal: [] },
        { topik: 'KRS', namaMahasiswa: 'Chris Black', nim: '654321987', status: 'Belum Bimbingan', judul: 'Semester 2', type: 'krs', jadwal: [] },
        { topik: 'Kerja Praktik', namaMahasiswa: 'Sarah White', nim: '321987654', status: 'ACC', judul: 'Pengembangan Sistem E-Commerce', type: 'kp', jadwal: [] },
        { topik: 'Skripsi', namaMahasiswa: 'Michael Green', nim: '789123456', status: 'Proses Bimbingan', judul: 'Analisis Data Big Data', type: 'skripsi', jadwal: [] },
        { topik: 'KRS', namaMahasiswa: 'Anna Red', nim: '987123456', status: 'ACC', judul: 'Semester 3', type: 'krs', jadwal: [] },
        { topik: 'Kerja Praktik', namaMahasiswa: 'Paul Yellow', nim: '123987456', status: 'ACC', judul: 'Desain User Interface', type: 'kp', jadwal: [] },
        { topik: 'Skripsi', namaMahasiswa: 'Robert Blue', nim: '654789123', status: 'Belum Bimbingan', judul: 'Keamanan Jaringan', type: 'skripsi', jadwal: [] },
        // Tambah data bimbingan lainnya
      ],
    };
  },
  computed: {
    filteredBimbingan() {
      return this.bimbinganList.filter(bimbingan => {
        return this.filter === 'all' || bimbingan.type === this.filter;
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
    ubahStatus(item) {
      this.selectedStudent = item;
      this.formStatus.status = item.status;
      this.showModalStatus = true;
    },
    setStatus(status) {
      this.formStatus.status = status;
    },
    submitStatus() {
      this.selectedStudent.status = this.formStatus.status;
      this.closeModal();
    },
    ajukanJadwal(item) {
      this.selectedStudent = item;
      this.showModalJadwal = true;
    },
    submitJadwal() {
      this.selectedStudent.jadwal.push({
        tanggal: this.formJadwal.tanggal,
        waktu: this.formJadwal.waktu,
        ruang: this.formJadwal.ruang
      });
      console.log(`Jadwal diajukan untuk ${this.selectedStudent.namaMahasiswa}: Tanggal: ${this.formJadwal.tanggal}, Waktu: ${this.formJadwal.waktu}, Ruang: ${this.formJadwal.ruang}`);
      this.formJadwal = {
        tanggal: '',
        waktu: '',
        ruang: ''
      };
    },
    closeModal() {
      this.showModalJadwal = false;
      this.showModalStatus = false;
      this.formJadwal = {
        tanggal: '',
        waktu: '',
        ruang: ''
      };
      this.formStatus = {
        status: ''
      };
    }
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

.ajukan-jadwal-button,
.ubah-status-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 5px;
  background-color: #3498db;
  color: white;
  border-radius: 20px; /* Rounded corners */
}

.ajukan-jadwal-button:hover,
.ubah-status-button:hover {
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

.jadwal-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.jadwal-card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 150px;
}

.jadwal-card p {
  margin: 5px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #007BFF;
  color: white;
  border-radius: 20px;
  border: none;
}

.submit-button:hover {
  background-color: #0056b3;
  border-radius: 20px;
  border: none;
}

.status-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.status-buttons button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #ddd;
  color: black;
  margin: 0 5px; /* Adjust the margin to control the spacing */
  border-radius: 20px;
  border: none;
}

.status-buttons button.active {
  background-color: #007BFF;
  border-radius: 20px;
  border: none;
  color: white;
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
