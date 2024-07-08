<template>
  <h1 class="title">Mata Kuliah</h1>
  <div class="main-wrapper">
    <div class="toggle-view-wrapper">
      <div class="view-toggle" @click="toggleView">
        <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
        <img v-else src="../../../assets/ic_table.png" alt="Table View" />
      </div>
    </div>
    <div class="container">
      <div class="container-content">
        <div class="buttons-container">
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'all'}" @click="selectedHari = 'all'">Semua</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Senin'}" @click="selectedHari = 'Senin'">Senin</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Selasa'}" @click="selectedHari = 'Selasa'">Selasa</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Rabu'}" @click="selectedHari = 'Rabu'">Rabu</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Kamis'}" @click="selectedHari = 'Kamis'">Kamis</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Jumat'}" @click="selectedHari = 'Jumat'">Jumat</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Sabtu'}" @click="selectedHari = 'Sabtu'">Sabtu</button>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(jadwal, index) in filteredJadwalKuliah" :key="index" class="card">
            <div class="card-header">
              <h3>{{ jadwal.namaMataKuliah }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ jadwal.hari }}, {{ jadwal.waktu }} WIB</p>
              <p>{{ jadwal.sks }} SKS</p>
              <p>Ruang: {{ jadwal.ruangKelas }}</p>
              <button @click="openBeritaAcaraModal(jadwal)" class="aksi-button">Berita Acara</button>
              <button @click="inputNilai(jadwal)" class="aksi-button">Input Nilai</button>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Aksi</th>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Kode Mata Kuliah</th>
                <th>Nama Mata Kuliah</th>
                <th>Semester</th>
                <th>Jumlah SKS</th>
                <th>Ruang Kelas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(jadwal, index) in filteredJadwalKuliah" :key="index">
                <td>
                  <button @click="openBeritaAcaraModal(jadwal)" class="aksi-button">Berita Acara</button>
                  <button @click="inputNilai(jadwal)" class="aksi-button">Input Nilai</button>
                </td>
                <td>{{ jadwal.hari }}</td>
                <td>{{ jadwal.waktu }}</td>
                <td>{{ jadwal.kodeMataKuliah }}</td>
                <td>{{ jadwal.namaMataKuliah }}</td>
                <td>{{ jadwal.semester }}</td>
                <td>{{ jadwal.sks }}</td>
                <td>{{ jadwal.ruangKelas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Berita Acara -->
    <div v-if="showModalBeritaAcara" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detail Berita Acara</h3>
        <table class="berita-acara-table">
          <thead>
            <tr>
              <th>Judul Materi</th>
              <th>Hari</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(berita, index) in selectedBeritaAcara" :key="index">
              <td>{{ berita.judulMateri }}</td>
              <td>{{ berita.hari }}</td>
              <td>{{ berita.tanggal }}</td>
              <td>{{ berita.waktu }}</td>
              <td><button @click="showHistoriMahasiswa(berita)" class="aksi-button">Lihat Histori Mahasiswa</button></td>
            </tr>
          </tbody>
        </table>
        <div v-if="!showIsiBeritaAcaraForm">
          <button @click="toggleIsiBeritaAcaraForm" class="aksi-button plus-button">Tambah Berita Acara</button>
        </div>
        <div v-if="showIsiBeritaAcaraForm" class="isi-berita-acara-form">
          <h3 class="modal-title">Isi Berita Acara</h3>
          <form @submit.prevent="submitBeritaAcara">
            <div class="form-group">
              <label for="beritaAcara">Berita Acara</label>
              <textarea id="beritaAcara" v-model="formBeritaAcara" required></textarea>
            </div>
            <div class="form-group">
              <label for="waktuOption">Waktu</label>
              <div>
                <button type="button" @click="setWaktuOption('saatIni')" :class="{'active': waktuOption === 'saatIni'}">Saat Ini</button>
                <button type="button" @click="setWaktuOption('custom')" :class="{'active': waktuOption === 'custom'}">Custom</button>
              </div>
            </div>
            <div v-if="waktuOption === 'custom'" class="form-group">
              <label for="customDate">Tanggal</label>
              <input type="date" id="customDate" v-model="formCustomDate" />
              <label for="customTime">Waktu</label>
              <input type="time" id="customTime" v-model="formCustomTime" />
            </div>
            <button type="submit" class="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Histori Mahasiswa -->
    <div v-if="showModalHistoriMahasiswa" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Histori Presensi Mahasiswa</h3>
        <table class="presensi-table">
          <thead>
            <tr>
              <th>Nama Mahasiswa</th>
              <th>NIM</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(presensi, index) in selectedHistoriMahasiswa" :key="index">
              <td>{{ presensi.namaMahasiswa }}</td>
              <td>{{ presensi.nim }}</td>
              <td>
                <div class="status-buttons">
                  <button
                    class="status-button"
                    :class="{'active': presensi.status === 'Hadir'}"
                    @click="updateStatus(presensi, 'Hadir')"
                  >Hadir</button>
                  <button
                    class="status-button"
                    :class="{'active': presensi.status === 'Alpa'}"
                    @click="updateStatus(presensi, 'Alpa')"
                  >Alpa</button>
                  <button
                    class="status-button"
                    :class="{'active': presensi.status === 'Izin'}"
                    @click="updateStatus(presensi, 'Izin')"
                  >Izin</button>
                  <button
                    class="status-button"
                    :class="{'active': presensi.status === 'Sakit'}"
                    @click="updateStatus(presensi, 'Sakit')"
                  >Sakit</button>
                </div>
              </td>
              <td>{{ presensi.tanggal }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Input Nilai -->
    <div v-if="showModalInputNilai" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Input Nilai Mahasiswa</h3>
          <button @click="toggleEditAll" :class="[editAll ? 'save-button' : 'edit-button']">
            {{ editAll ? 'Simpan Semua' : 'Edit Semua' }}
          </button>
        </div>
        <table class="nilai-table">
          <thead>
            <tr>
              <th>Nama Mahasiswa</th>
              <th>NIM</th>
              <th>Nilai UTS</th>
              <th>Nilai UAS</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(nilai, index) in selectedInputNilai" :key="index">
              <td>{{ nilai.namaMahasiswa }}</td>
              <td>{{ nilai.nim }}</td>
              <td><input type="text" v-model="nilai.uts" :readonly="!nilai.isEditing" class="nilai-input" /></td>
              <td><input type="text" v-model="nilai.uas" :readonly="!nilai.isEditing" class="nilai-input" /></td>
              <td>
                <button @click="toggleEditNilai(nilai)" :class="[nilai.isEditing ? 'save-button' : 'edit-button']">
                  {{ nilai.isEditing ? 'Simpan' : 'Edit' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="submitNilai" class="submit-button">Submit Nilai</button>
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
      showModalBeritaAcara: false,
      showModalHistoriMahasiswa: false,
      showModalInputNilai: false,
      showIsiBeritaAcaraForm: false,
      waktuOption: 'saatIni',
      formBeritaAcara: '',
      formCustomDate: '',
      formCustomTime: '',
      selectedBeritaAcara: [],
      selectedHistoriMahasiswa: [],
      selectedInputNilai: [],
      editAll: false,
      jadwalKuliah: [
        {
          ruangKelas: 'A101',
          hari: 'Senin',
          waktu: '08:00 - 10:00',
          kodeMataKuliah: 'IF101',
          namaMataKuliah: 'Pemrograman Dasar',
          semester: 1,
          sks: 3,
          namaDosen: 'Dr. John Doe',
          hadir: false,
          presensiHistory: ['2024-08-01 Hadir', '2024-08-08 Hadir'],
          beritaAcara: [
            {
              judulMateri: 'Introduction to Programming',
              hari: 'Senin',
              tanggal: '2024-08-01',
              waktu: '08:00 - 10:00',
              historiPresensi: [
                { namaMahasiswa: 'Budi', nim: '123456', status: 'Hadir', tanggal: '2024-08-01' },
                { namaMahasiswa: 'Ani', nim: '789012', status: 'Alpa', tanggal: '2024-08-01' }
              ]
            },
            {
              judulMateri: 'Programming Basics',
              hari: 'Senin',
              tanggal: '2024-08-08',
              waktu: '08:00 - 10:00',
              historiPresensi: [
                { namaMahasiswa: 'Budi', nim: '123456', status: 'Hadir', tanggal: '2024-08-08' },
                { namaMahasiswa: 'Ani', nim: '789012', status: 'Alpa', tanggal: '2024-08-08' }
              ]
            }
          ],
          inputNilai: [
            { namaMahasiswa: 'Budi', nim: '123456', uts: '', uas: '', isEditing: false },
            { namaMahasiswa: 'Ani', nim: '789012', uts: '', uas: '', isEditing: false }
          ]
        },
        {
          ruangKelas: 'B202',
          hari: 'Rabu',
          waktu: '19:00 - 20:00',
          kodeMataKuliah: 'IF102',
          namaMataKuliah: 'Struktur Data',
          semester: 2,
          sks: 3,
          namaDosen: 'Dr. Jane Smith',
          hadir: false,
          presensiHistory: ['2024-08-03 Masuk', '2024-08-10 Hadir'],
          beritaAcara: [
            {
              judulMateri: 'Data Structures Basics',
              hari: 'Rabu',
              tanggal: '2024-08-03',
              waktu: '19:00 - 20:00',
              historiPresensi: [
                { namaMahasiswa: 'Siti', nim: '345678', status: 'Hadir', tanggal: '2024-08-03' },
                { namaMahasiswa: 'Andi', nim: '901234', status: 'Alpa', tanggal: '2024-08-03' }
              ]
            }
          ],
          inputNilai: [
            { namaMahasiswa: 'Siti', nim: '345678', uts: '', uas: '', isEditing: false },
            { namaMahasiswa: 'Andi', nim: '901234', uts: '', uas: '', isEditing: false }
          ]
        },
        {
          ruangKelas: 'B202',
          hari: 'Selasa',
          waktu: '19:00 - 20:00',
          kodeMataKuliah: 'IF102',
          namaMataKuliah: 'Struktur Data',
          semester: 2,
          sks: 3,
          namaDosen: 'Dr. Jane Smith',
          hadir: false,
          presensiHistory: ['2024-08-03 Masuk', '2024-08-10 Hadir'],
          beritaAcara: [
            {
              judulMateri: 'Advanced Data Structures',
              hari: 'Selasa',
              tanggal: '2024-08-10',
              waktu: '19:00 - 20:00',
              historiPresensi: [
                { namaMahasiswa: 'Siti', nim: '345678', status: 'Hadir', tanggal: '2024-08-10' },
                { namaMahasiswa: 'Andi', nim: '901234', status: 'Alpa', tanggal: '2024-08-10' }
              ]
            }
          ],
          inputNilai: [
            { namaMahasiswa: 'Siti', nim: '345678', uts: '', uas: '', isEditing: false },
            { namaMahasiswa: 'Andi', nim: '901234', uts: '', uas: '', isEditing: false }
          ]
        },
        // Tambah data jadwal lainnya
      ]
    };
  },
  computed: {
    filteredJadwalKuliah() {
      if (this.selectedHari === 'all') {
        return this.jadwalKuliah;
      } else {
        return this.jadwalKuliah.filter(jadwal => jadwal.hari === this.selectedHari);
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
    openBeritaAcaraModal(jadwal) {
      this.selectedBeritaAcara = jadwal.beritaAcara;
      this.showModalBeritaAcara = true;
    },
    toggleIsiBeritaAcaraForm() {
      this.showIsiBeritaAcaraForm = !this.showIsiBeritaAcaraForm;
    },
    setWaktuOption(option) {
      this.waktuOption = option;
      if (option === 'saatIni') {
        const now = new Date();
        this.formCustomDate = now.toISOString().substr(0, 10);
        this.formCustomTime = now.toTimeString().substr(0, 5);
      }
    },
    showHistoriMahasiswa(berita) {
      this.selectedHistoriMahasiswa = berita.historiPresensi;
      this.showModalHistoriMahasiswa = true;
    },
    inputNilai(jadwal) {
      this.selectedInputNilai = jadwal.inputNilai;
      this.showModalInputNilai = true;
    },
    toggleEditNilai(nilai) {
      nilai.isEditing = !nilai.isEditing;
    },
    toggleEditAll() {
      this.editAll = !this.editAll;
      this.selectedInputNilai.forEach(nilai => {
        nilai.isEditing = this.editAll;
      });
    },
    submitBeritaAcara() {
      // Logika untuk submit berita acara
      this.closeModal();
    },
    submitNilai() {
      // Logika untuk submit nilai
      this.toggleEditAll(); // Reset all editing states
      this.closeModal();
    },
    updateStatus(presensi, status) {
      presensi.status = status;
    },
    closeModal() {
      this.showModalBeritaAcara = false;
      this.showModalHistoriMahasiswa = false;
      this.showModalInputNilai = false;
      this.formBeritaAcara = '';
      this.formCustomDate = '';
      this.formCustomTime = '';
      this.selectedBeritaAcara = [];
      this.selectedHistoriMahasiswa = [];
      this.selectedInputNilai = [];
      this.showIsiBeritaAcaraForm = false;
      this.waktuOption = 'saatIni';
      this.editAll = false;
    }
  }
};
</script>

<style scoped>
.main-wrapper {
  display: flex;
  align-items: flex-start;
  width: 100%;
  position: relative;
}

.toggle-view-wrapper {
  position: absolute;
  right: 120px;
  top: 25px;
}

.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  width: 100%;
  height: 85vh;
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
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.buttons-container {
  display: flex;
  justify-content: center; /* Center buttons horizontally */
  width: 100%; /* Ensure the button container spans full width */
  margin-bottom: 20px;
}

.filter-button {
  border: none;
  background-color: #cccccc; /* Default gray color */
  color: white;
  padding: 10px 20px;
  border-radius: 20px; /* Rounded corners */
  cursor: pointer;
  margin-right: 10px;
}

.filter-button:last-child {
  margin-right: 0; /* Remove margin for the last button */
}

.filter-button.active {
  background-color: #007BFF; /* Blue when active */
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* Center cards within container */
  width: 100%; /* Ensure it spans the full width of the container */
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 300px; /* Fixed width for each card */
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

.aksi-button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.aksi-button:hover {
  background-color: #0056b3;
}

.plus-button {
  display: block;
  margin: 20px auto;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group textarea,
.form-group input {
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
}

.submit-button:hover {
  background-color: #0056b3;
}

.berita-acara-table,
.presensi-table,
.nilai-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.berita-acara-table th,
.berita-acara-table td,
.presensi-table th,
.presensi-table td,
.nilai-table th,
.nilai-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.berita-acara-table tbody tr:nth-child(even),
.presensi-table tbody tr:nth-child(even),
.nilai-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.berita-acara-table tbody tr:nth-child(odd),
.presensi-table tbody tr:nth-child(odd),
.nilai-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.status-buttons {
  display: flex;
  justify-content: space-between;
}

.status-button {
  padding: 5px 10px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: #ccc;
  color: white;
}

.status-button.active {
  background-color: #007bff;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.save-button {
  background-color: #28a745;
  color: white;
}

.nilai-input {
  width: 50px;
  text-align: center;
}
</style>
