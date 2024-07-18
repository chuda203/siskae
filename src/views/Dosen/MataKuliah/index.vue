<template>
  <div>
    <h1 class="title-container">
      <span class="title">Jadwal Kuliah</span>
    </h1>
    <div class="container">
      <div class="container-content">
        <div class="main-wrapper">
          <div class="header-wrapper">
            <div v-if="!tableView" class="filter-buttons-container">
              <button class="filter-button" :class="{'active': selectedHari === 'all'}" @click="setFilter('all')">Semua</button>
              <button class="filter-button" :class="{'active': selectedHari === 'Senin'}" @click="setFilter('Senin')">Senin</button>
              <button class="filter-button" :class="{'active': selectedHari === 'Selasa'}" @click="setFilter('Selasa')">Selasa</button>
              <button class="filter-button" :class="{'active': selectedHari === 'Rabu'}" @click="setFilter('Rabu')">Rabu</button>
              <button class="filter-button" :class="{'active': selectedHari === 'Kamis'}" @click="setFilter('Kamis')">Kamis</button>
              <button class="filter-button" :class="{'active': selectedHari === 'Jumat'}" @click="setFilter('Jumat')">Jumat</button>
              <button class="filter-button" :class="{'active': selectedHari === 'Sabtu'}" @click="setFilter('Sabtu')">Sabtu</button>
            </div>
            <div class="view-toggle-wrapper">
              <div class="view-toggle" @click="toggleView">
                <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
                <img v-else src="../../../assets/ic_table.png" alt="Table View" />
              </div>
            </div>
          </div>
          <div v-if="!tableView" class="cards-container">
            <div v-for="(jadwal, index) in filteredJadwalKuliah" :key="index" class="card" @click="inputNilai(jadwal)">
              <div class="card-header">
                <h3>{{ jadwal.namaMataKuliah }}</h3>
                <img src="../../../assets/ic_presensi.png" alt="Berita Acara" class="presensi-icon" @click.stop="openBeritaAcaraModal(jadwal)" />
              </div>
              <div class="divider"></div>
              <div class="card-body">
                <p>{{ jadwal.hari }}, {{ jadwal.waktu }} WIB</p>
                <p>{{ jadwal.sks }} SKS</p>
                <p>Ruang: {{ jadwal.ruangKelas }}</p>
              </div>
            </div>
          </div>
          <div v-else class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Kode Mata Kuliah</th>
                  <th>Nama Mata Kuliah</th>
                  <th>Semester</th>
                  <th>Jumlah SKS</th>
                  <th>Ruang Kelas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(jadwal, index) in jadwalKuliah" :key="index" @click="inputNilai(jadwal)">
                  <td>{{ jadwal.hari }}</td>
                  <td>{{ jadwal.waktu }}</td>
                  <td>{{ jadwal.kodeMataKuliah }}</td>
                  <td>{{ jadwal.namaMataKuliah }}</td>
                  <td>{{ jadwal.semester }}</td>
                  <td>{{ jadwal.sks }}</td>
                  <td>{{ jadwal.ruangKelas }}</td>
                  <td>
                    <img src="../../../assets/ic_presensi.png" alt="Berita Acara" class="presensi-icon" @click.stop="openBeritaAcaraModal(jadwal)" />
                  </td>
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
                <td>{{ berita.description }}</td>
                <td>{{ berita.date }}</td>
                <td>{{ berita.start_time }}</td>
                <td>{{ berita.end_time }}</td>
                <td><button @click="showHistoriMahasiswa(berita.report_id)" class="aksi-button rounded-button">Presensi</button></td>
              </tr>
            </tbody>
          </table>
          <button @click="toggleIsiBeritaAcaraForm" class="aksi-button plus-button rounded-button">Tambah Berita Acara</button>
        </div>
      </div>

      <!-- Modal Isi Berita Acara -->
      <div v-if="showIsiBeritaAcaraForm" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3 class="modal-title">Isi Berita Acara</h3>
          <form @submit.prevent="submitBeritaAcara">
            <div class="form-group">
              <label for="beritaAcara">Berita Acara</label>
              <textarea id="beritaAcara" v-model="formBeritaAcara" required></textarea>
            </div>
            <div class="form-group">
              <label for="customDate">Tanggal</label>
              <input type="date" id="customDate" v-model="formCustomDate" required />
            </div>
            <div class="form-group">
              <label for="customTimeStart">Waktu Mulai</label>
              <input type="time" id="customTimeStart" v-model="formCustomTimeStart" required />
            </div>
            <div class="form-group">
              <label for="customTimeEnd">Waktu Selesai</label>
              <input type="time" id="customTimeEnd" v-model="formCustomTimeEnd" required />
            </div>
            <button type="submit" class="submit-button rounded-button">Simpan</button>
          </form>
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
              </tr></thead>
            <tbody>
              <tr v-for="(presensi, index) in selectedHistoriMahasiswa" :key="index">
                <td>{{ presensi.nama_mahasiswa }}</td>
                <td>{{ presensi.nim }}</td>
                <td>
                  <div class="status-buttons">
                    <button
                      class="status-button rounded-button"
                      :class="{'active': presensi.status === 'Present'}"
                      @click="updateStatus(presensi, 'Present')"
                    >Hadir</button>
                    <button
                      class="status-button rounded-button"
                      :class="{'active': presensi.status === 'Late'}"
                      @click="updateStatus(presensi, 'Late')"
                    >Terlambat</button>
                    <button
                      class="status-button rounded-button"
                      :class="{'active': presensi.status === 'Absent'}"
                      @click="updateStatus(presensi, 'Absent')"
                    >Alpa</button>
                    <button
                      class="status-button rounded-button"
                      :class="{'active': presensi.status === 'Excused'}"
                      @click="updateStatus(presensi, 'Excused')"
                    >Izin</button>
                    <button
                      class="status-button rounded-button"
                      :class="{'active': presensi.status === 'Belum Presensi'}"
                      @click="updateStatus(presensi, 'Belum Presensi')"
                    >Belum Presensi</button>
                  </div>
                </td>
                <td>{{ presensi.date || 'N/A' }}</td>
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
              <tr v-for="(mahasiswa, index) in selectedNilaiMahasiswa" :key="index">
                <td>{{ mahasiswa.nama_mahasiswa }}</td>
                <td>{{ mahasiswa.nim }}</td>
                <td><input type="number" v-model="mahasiswa.uts_grade" :readonly="!mahasiswa.isEditing" class="nilai-input" /></td>
                <td><input type="number" v-model="mahasiswa.uas_grade" :readonly="!mahasiswa.isEditing" class="nilai-input" /></td>
                <td>
                  <button @click="toggleEditNilai(mahasiswa)" :class="[mahasiswa.isEditing ? 'save-button' : 'edit-button']">
                    {{ mahasiswa.isEditing ? 'Simpan' : 'Edit' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="submitNilai" class="submit-button rounded-button">Submit Nilai</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import moment from 'moment-timezone';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      jadwalKuliah: [],
      selectedHari: 'all',
      showModalBeritaAcara: false,
      selectedBeritaAcara: [],
      showIsiBeritaAcaraForm: false,
      formBeritaAcara: '',
      formCustomDate: '',
      formCustomTimeStart: '',
      formCustomTimeEnd: '',
      showModalHistoriMahasiswa: false,
      selectedHistoriMahasiswa: [],
      showModalInputNilai: false,
      selectedNilaiMahasiswa: [],
      editAll: false,
      tableView: false,
      selectedCourseId: null,
      attendanceData: {}, 
      allMahasiswa: [],
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
    setFilter(hari) {
      this.selectedHari = hari;
      if (this.tableView) {
        this.selectedHari = 'all';
      }
    },
    async fetchJadwalKuliah() {
      const userId = this.$cookies.get('user_id');
      try {
        const response = await axios.get(`http://localhost:3000/courses/dosen/${userId}`);
        this.jadwalKuliah = response.data.data.map(jadwal => ({
          ruangKelas: jadwal.ruang_kelas,
          hari: jadwal.hari,
          waktu: jadwal.waktu,
          kodeMataKuliah: jadwal.kode_mata_kuliah,
          namaMataKuliah: jadwal.nama_mata_kuliah,
          semester: jadwal.semester,
          sks: jadwal.jumlah_sks,
          courseId: jadwal.course_id
        }));
      } catch (error) {
        console.error('Error fetching jadwal kuliah:', error);
      }
    },
    async openBeritaAcaraModal(jadwal) {
      const toast = useToast();
      this.selectedCourseId = jadwal.courseId;
      try {
        const response = await axios.get(`http://localhost:3000/eventreports/${this.$cookies.get('user_id')}/${this.selectedCourseId}`);
        this.selectedBeritaAcara = response.data.data.map(berita => ({
          ...berita,
          date: moment(berita.date).tz('Asia/Jakarta').format('YYYY-MM-DD'),
          start_time: moment(berita.start_time, 'HH:mm:ss').tz('Asia/Jakarta').format('HH:mm:ss'),
          end_time: moment(berita.end_time, 'HH:mm:ss').tz('Asia/Jakarta').format('HH:mm:ss')
        }));
        this.showModalBeritaAcara = true;

        // Fetch all students for the course and active semester
        const mahasiswaResponse = await axios.get(`http://localhost:3000/courserequests/course/${this.selectedCourseId}`);
        this.allMahasiswa = mahasiswaResponse.data.data;

      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.info('Tidak ada berita acara untuk mata kuliah ini.');
        } else {
          console.error('Error fetching berita acara:', error);
        }
      }
    },
    async showHistoriMahasiswa(reportId) {
      const toast = useToast();
      try {
        const attendanceResponse = await axios.get(`http://localhost:3000/attendance/report/${reportId}/all`);
        const attendanceList = attendanceResponse.data.data;

        this.selectedHistoriMahasiswa = this.allMahasiswa.map(mahasiswa => {
          const attendance = attendanceList.find(att => att.user_id === mahasiswa.user_id) || { status: 'Belum Presensi', attendance_id: null, date: null };
          return {
            ...mahasiswa,
            status: attendance.status,
            attendance_id: attendance.attendance_id,
            date: attendance.date ? moment(attendance.date).tz('Asia/Jakarta').format('YYYY-MM-DD') : 'N/A',
            report_id: reportId 
          };
        });

        this.showModalHistoriMahasiswa = true;
      } catch (error) {
        console.error('Error fetching histori mahasiswa:', error);
      }
    },
    async inputNilai(jadwal) {
      const toast = useToast();
      this.selectedCourseId = jadwal.courseId;
      try {
        // Fetch all students for the course and active semester
        const mahasiswaResponse = await axios.get(`http://localhost:3000/courserequests/course/${this.selectedCourseId}`);
        const allMahasiswa = mahasiswaResponse.data.data;

        if (allMahasiswa.length === 0) {
          toast.info('Tidak ada mahasiswa yang mengambil mata kuliah ini.');
          return;
        }

        // Fetch existing grades for the course
        const gradesResponse = await axios.get(`http://localhost:3000/grades/${this.selectedCourseId}`);
        const existingGrades = gradesResponse.data.data;

        // Combine the data
        this.selectedNilaiMahasiswa = allMahasiswa.map(mahasiswa => {
          const grade = existingGrades.find(g => g.user_id === mahasiswa.user_id);
          return {
            ...mahasiswa,
            uts_grade: grade ? grade.uts_grade : '',
            uas_grade: grade ? grade.uas_grade : '',
            isEditing: false,
            exists: !!grade // Tambahkan properti untuk melacak apakah nilai sudah ada
          };
        });

        this.showModalInputNilai = true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.info('Tidak ada mahasiswa yang mengambil mata kuliah ini.');
        } else {
          console.error('Error fetching grades:', error);
        }
      }
    },
    toggleEditNilai(mahasiswa) {
      mahasiswa.isEditing = !mahasiswa.isEditing;
    },
    toggleEditAll() {
      this.editAll = !this.editAll;
      this.selectedNilaiMahasiswa.forEach(mahasiswa => {
        mahasiswa.isEditing = this.editAll;
      });
    },
    toggleIsiBeritaAcaraForm() {
      this.showIsiBeritaAcaraForm = !this.showIsiBeritaAcaraForm;
    },
    async submitBeritaAcara() {
      const toast = useToast();
      try {
        const formattedDate = moment.tz(this.formCustomDate, 'Asia/Jakarta').format('YYYY-MM-DD');
        const formattedStartTime = moment.tz(this.formCustomTimeStart, 'Asia/Jakarta').format('HH:mm:ss');
        const formattedEndTime = moment.tz(this.formCustomTimeEnd, 'Asia/Jakarta').format('HH:mm:ss');

        await axios.post('http://localhost:3000/eventreports', {
          course_id: this.selectedCourseId,
          date: formattedDate,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          description: this.formBeritaAcara
        });

        this.showModalBeritaAcara = false;
        this.showIsiBeritaAcaraForm = false;
        toast.success('Berita acara berhasil ditambahkan');
        await this.openBeritaAcaraModal({ courseId: this.selectedCourseId });
      } catch (error) {
        console.error('Error submitting event report:', error);
      }
    },
    async submitNilai() {
      const toast = useToast();
      try {
        for (let mahasiswa of this.selectedNilaiMahasiswa) {
          console.log('Mahasiswa:', mahasiswa); // Logging

          if (!mahasiswa.exists) {
            console.log('Sending POST request for new grades'); // Tambahkan logging di sini
            // Create new grades record
            const response = await axios.post('http://localhost:3000/grades', {
              user_id: mahasiswa.user_id,
              course_id: this.selectedCourseId,
              uts_grade: mahasiswa.uts_grade,
              uas_grade: mahasiswa.uas_grade
            });
            console.log('Response from server (POST):', response.data); // Logging untuk POST
          } else {
            console.log('Sending PUT request for existing grades'); // Tambahkan logging di sini
            // Update existing grades record
            const response = await axios.put('http://localhost:3000/grades', {
              user_id: mahasiswa.user_id,
              course_id: this.selectedCourseId,
              uts_grade: mahasiswa.uts_grade,
              uas_grade: mahasiswa.uas_grade
            });
            console.log('Response from server (PUT):', response.data); // Logging untuk PUT
          }
        }
        this.showModalInputNilai = false;
        toast.success('Nilai berhasil disimpan');
      } catch (error) {
        console.error('Error submitting grades:', error.response ? error.response.data : error.message);
      }
    },
    async updateStatus(presensi, status) {
      const toast = useToast();
      try {
        if (presensi.attendance_id) {
          // Update status for existing attendance record
          await axios.put(`http://localhost:3000/attendance/${presensi.attendance_id}/status`, { status });
          presensi.status = status;
        } else {
          // Create new attendance record
          const response = await axios.post('http://localhost:3000/attendance', {
            report_id: presensi.report_id,
            user_id: presensi.user_id,
            status: status
          });
          presensi.attendance_id = response.data.data.attendance_id;
          presensi.status = status;
        }
        toast.success('Status presensi berhasil diubah');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    closeModal() {
      this.showModalBeritaAcara = false;
      this.showModalHistoriMahasiswa = false;
      this.showModalInputNilai = false;
      this.showIsiBeritaAcaraForm = false;
      this.formBeritaAcara = '';
      this.formCustomDate = '';
      this.formCustomTimeStart = '';
      this.formCustomTimeEnd = '';
      this.selectedBeritaAcara = [];
      this.selectedHistoriMahasiswa = [];
      this.selectedNilaiMahasiswa = [];
      this.showIsiBeritaAcaraForm = false;
      this.editAll = false;
    },
    toggleView() {
      this.tableView = !this.tableView;
      this.setFilter('all');
    }
  },
  mounted() {
    this.fetchJadwalKuliah();
  }
};
</script>

<style scoped>
/* Tambahkan semua gaya (CSS) yang diperlukan di sini */
/* Tambahkan semua gaya (CSS) yang diperlukan di sini */
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

.main-wrapper {
  width: 100%;
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
  padding-left: 180px; /* Tambahkan padding kiri */
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

.presensi-icon {
  cursor: pointer;
  width: 35px;  /* Atur ukuran yang sesuai */
  height: 35px; /* Atur ukuran yang sesuai */
  object-fit: cover; /* Pastikan gambar menyesuaikan dengan kontainernya */
  background-color: #3498db;
  margin-bottom: 0px;
  border-radius: 10px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.card {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  padding: 10px;
  border-radius: 5px;
  margin: 5px; /* Tambahkan margin untuk memastikan jarak horizontal */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 2px 0;
  width: 100%;
}

.card-body {
  margin-top: 0px;
}

.aksi-button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.aksi-button + .aksi-button {
  margin-left: 10px;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #dddddd;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .table th, .table td {
    padding: 2px;
    font-size: 12px;
  }

  .table th:last-child,
  .table td:last-child {
    display: none; /* Sembunyikan kolom aksi di layar kecil */
  }
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
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto; /* Tambahkan properti ini */
}

.modal-title {
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 5px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.plus-button {
  background-color: green;
  color: white;
}

.berita-acara-table,
.presensi-table,
.nilai-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.berita-acara-table th,
.presensi-table th,
.nilai-table th,
.berita-acara-table td,
.presensi-table td,
.nilai-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #dddddd;
}

.presensi-table .status-buttons {
  display: flex;
  gap: 5px;
}

.status-button {
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.status-button.active {
  background-color: #007bff;
  color: white;
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

.rounded-button {
  border-radius: 20px;
}
</style>
