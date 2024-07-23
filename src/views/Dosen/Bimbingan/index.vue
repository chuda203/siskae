<template>
  <h1 class="title-container">
    <span class="title">Bimbingan</span>
  </h1>  
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
          <div v-for="(item, index) in filteredBimbingan" :key="`bimbingan-${index}`" class="card" @click="openStatusModal(item)">
            <div class="card-header">
              <p class="nama-mahasiswa">{{ item.nama_mahasiswa }}</p>
              <button @click.stop="ajukanJadwal(item)" class="ajukan-jadwal-button">
                <img src="../../../assets/ic_slot4.png" alt="Ajukan Jadwal" class="icon-slot" />
              </button>
            </div>
            <div class="divider"></div>
            <div class="card-body">
              <p class="nim">{{ item.NIM }}</p>
              <p class="topik">{{ item.topic }}</p>
              <p class="status">{{ item.status }}</p>
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
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredBimbingan" :key="`table-${index}`" @click="openStatusModal(item)">
                <td>{{ item.topic }}</td>
                <td>{{ item.nama_mahasiswa }}</td>
                <td>{{ item.NIM }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <button @click.stop="ajukanJadwal(item)" class="ajukan-jadwal-button">
                    <img src="../../../assets/ic_slot4.png" alt="Ajukan Jadwal" class="icon-slot" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Detail dan Ubah Status -->
    <div v-if="showModalStatus" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detail Bimbingan dan Ubah Status</h3>
        <div class="detail-info">
          <p><strong>Nama Mahasiswa:</strong> {{ selectedStudent?.nama_mahasiswa }}</p>
          <p><strong>NIM:</strong> {{ selectedStudent?.NIM }}</p>
          <p><strong>Topik:</strong> {{ selectedStudent?.topic }}</p>
          <p><strong>Status:</strong> {{ selectedStudent?.status }}</p>
        </div>
        <div class="status-buttons">
          <button @click="setStatus('ACC')" :class="{'active': formStatus.status === 'ACC'}">ACC</button>
          <button @click="setStatus('Proses Bimbingan')" :class="{'active': formStatus.status === 'Proses Bimbingan'}">Proses Bimbingan</button>
          <button @click="setStatus('Belum Bimbingan')" :class="{'active': formStatus.status === 'Belum Bimbingan'}">Belum Bimbingan</button>
        </div>
      </div>
    </div>

    <!-- Modal Ajukan Jadwal -->
    <div v-if="showModalJadwal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Ajukan Jadwal Bimbingan</h3>
        <div class="jadwal-cards-container">
          <div v-for="(jadwal, index) in slotBimbingan" :key="`slot-${index}`" class="jadwal-card">
            <p><strong></strong> {{ formatTanggal(jadwal.date) }}</p>
            <p> {{ formatWaktu(jadwal.start_time, jadwal.end_time) }}<strong> WIB</strong></p>
            <p><strong>Ruang:</strong> {{ jadwal.room }}</p>
            <button @click="hapusJadwal(jadwal.slot_id)" class="hapus-jadwal-button">Hapus Jadwal</button>
          </div>
        </div>
        <form @submit.prevent="submitJadwal">
          <div class="form-group">
            <label for="tanggal">Tanggal</label>
            <input type="date" id="tanggal" v-model="formJadwal.tanggal" required />
          </div>
          <div class="form-group">
            <label for="start_time">Waktu Mulai</label>
            <input type="time" id="start_time" v-model="formJadwal.start_time" required />
          </div>
          <div class="form-group">
            <label for="end_time">Waktu Selesai</label>
            <input type="time" id="end_time" v-model="formJadwal.end_time" required />
          </div>
          <div class="form-group">
            <label for="ruang">Ruang</label>
            <input type="text" id="ruang" v-model="formJadwal.ruang" required />
          </div>
          <button type="submit" class="submit-button">Ajukan</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { inject } from 'vue';
import moment from 'moment';
import 'moment/locale/id'; // Import locale Indonesia
import { useToast } from 'vue-toastification';

moment.locale('id'); // Set locale ke Indonesia

export default {
  data() {
    return {
      filter: 'all',
      tableView: false,
      showModalJadwal: false,
      showModalStatus: false,
      formJadwal: {
        tanggal: '',
        start_time: '',
        end_time: '',
        ruang: ''
      },
      formStatus: {
        status: ''
      },
      selectedStudent: null,
      bimbinganList: [], // Empty initially
      slotBimbingan: [] // Array to store slot bimbingan
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
    async fetchBimbinganList() {
      const dosenId = this.auth.user_id; // Assume the auth state contains the user ID of the logged-in dosen
      try {
        const response = await axios.get(`https://unified-atom-423009-a1.et.r.appspot.com/guidances/${dosenId}`);
        if (response.data.success) {
          this.bimbinganList = response.data.data.map(item => ({
            ...item,
            type: this.mapTopicToType(item.topic) // Map topic to type for filtering
          }));
        } else {
          console.error('Failed to fetch bimbingan list:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching bimbingan list:', error);
      }
    },
    async fetchSlotBimbingan(guidanceId) {
      const dosenId = this.auth.user_id;
      try {
        const response = await axios.get(`https://unified-atom-423009-a1.et.r.appspot.com/guidanceslots/${dosenId}/${guidanceId}`);
        if (response.data.success) {
          this.slotBimbingan = response.data.data;
        } else {
          console.error('Failed to fetch slot bimbingan:', response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(`Guidance slot not found for dosen_id ${dosenId} and guidance_id ${guidanceId}`);
        } else {
          console.error('Error fetching slot bimbingan:', error);
        }
      }
    },
    mapTopicToType(topic) {
      switch(topic.toLowerCase()) {
        case 'krs': return 'krs';
        case 'kerja praktik': return 'kp';
        case 'skripsi': return 'skripsi';
        default: return 'all';
      }
    },
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.filter = 'all'; // Reset filter when switching to table view
      }
    },
    async openStatusModal(item) {
      this.selectedStudent = item;
      this.formStatus.status = item.status;
      this.showModalStatus = true;
    },
    async setStatus(status) {
      this.formStatus.status = status;
      try {
        const response = await axios.put(`https://unified-atom-423009-a1.et.r.appspot.com/guidances/${this.selectedStudent.guidance_id}/status`, {
          status: this.formStatus.status
        });
        if (response.data.success) {
          this.selectedStudent.status = this.formStatus.status;
          this.showModalStatus = false; // Close modal after status update
        } else {
          console.error('Failed to update status:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    async ajukanJadwal(item) {
      this.selectedStudent = item;
      await this.fetchSlotBimbingan(item.guidance_id);
      this.showModalJadwal = true;
    },
    formatTanggal(date) {
      return moment(date).format('dddd, DD-MM-YYYY');
    },
    formatWaktu(startTime, endTime) {
      const start = moment(startTime, 'HH:mm:ss').format('HH:mm');
      const end = moment(endTime, 'HH:mm:ss').format('HH:mm');
      return `${start} - ${end}`;
    },
    async submitJadwal() {
      const toast = useToast();
      const { tanggal, start_time, end_time, ruang } = this.formJadwal;
      const { guidance_id } = this.selectedStudent;

      console.log('Submitting jadwal:', {
        guidance_id,
        date: tanggal,
        start_time,
        end_time,
        room: ruang
      });

      try {
        const response = await axios.post('https://unified-atom-423009-a1.et.r.appspot.com/guidanceslots', {
          guidance_id,
          date: tanggal,
          start_time,
          end_time,
          room: ruang
        });

        if (response.data.success) {
          console.log('Slot bimbingan berhasil ditambahkan:', response.data.message);
          toast.success(`Jadwal bimbingan berhasil diajukan untuk ${this.selectedStudent.nama_mahasiswa}`);
          // Refresh the slots for the selected guidance
          await this.fetchSlotBimbingan(guidance_id);
          this.closeModal();
        } else {
          console.error('Failed to add slot bimbingan:', response.data.message);
        }
      } catch (error) {
        console.error('Error adding slot bimbingan:', error);
      }
    },
    async hapusJadwal(slotId) {
      const toast = useToast();
      console.log('Attempting to delete slot with ID:', slotId);
      if (!slotId) {
        console.error('Invalid slot ID:', slotId);
        return;
      }
      try {
        const response = await axios.delete(`https://unified-atom-423009-a1.et.r.appspot.com/guidanceslots/${slotId}`);
        if (response.data.success) {
          console.log('Slot bimbingan berhasil dihapus:', response.data.message);
          toast.info(`Jadwal bimbingan berhasil dihapus`);
          // Refresh the slots for the selected guidance
          await this.fetchSlotBimbingan(this.selectedStudent.guidance_id);
        } else {
          console.error('Failed to delete slot bimbingan:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting slot bimbingan:', error);
      }
    },
    closeModal() {
      this.showModalJadwal = false;
      this.showModalStatus = false;
      this.formJadwal = {
        tanggal: '',
        start_time: '',
        end_time: '',
        ruang: ''
      };
      this.formStatus = {
        status: ''
      };
    }
  },
  async mounted() {
    this.auth = inject('auth'); // Inject auth state
    await this.fetchBimbinganList(); // Fetch the list of bimbingan on mount
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
  margin-bottom: 10px;
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  width: 90%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-left: 150px;
  padding-right: 10px;
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
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .nama-mahasiswa {
  font-weight: bold;
  margin: 0; /* Remove any default margin */
}

.ajukan-jadwal-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.icon-slot {
  cursor: pointer;
  width: 35px;  /* Atur ukuran yang sesuai */
  height: 35px; /* Atur ukuran yang sesuai */
  object-fit: cover; /* Pastikan gambar menyesuaikan dengan kontainernya */
  background-color: #3498db;
  border-radius: 10px;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 0px; /* Adjust margin to reduce space */
  width: 100%;
}

.card-body .nim {
  margin-top: 5px;
}

.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center; /* Atur modal di tengah vertikal */
  padding-top: 20px; /* Sesuaikan padding atas */
  padding-bottom: 20px; /* Sesuaikan padding bawah */
  background-color: rgba(0, 0, 0, 0.5); /* Tambahkan background semi-transparent */
  position: fixed; /* Tetap di tempat saat scroll */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* Pastikan modal berada di atas elemen lain */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px;
  max-height: 95vh;
  overflow-y: auto;
  margin: 20px auto; /* Tambahkan margin di atas dan bawah */
}

@media (max-width: 768px) {
  .modal-content {
    width: 90%; /* Sesuaikan lebar modal di perangkat mobile */
    padding: 10px;
    margin: 20px 5%; /* Tambahkan margin di atas dan bawah pada perangkat mobile */
  }

  .modal-title {
    font-size: 1.2em; /* Kurangi ukuran font judul modal di perangkat mobile */
  }

  .detail-info p, .status-buttons button, .form-group label, .form-group input, .submit-button {
    font-size: 0.9em; /* Kurangi ukuran font di perangkat mobile */
  }

  .status-buttons {
    flex-direction: column; /* Atur ulang tombol status menjadi vertikal di perangkat mobile */
    align-items: stretch;
  }

  .status-buttons button {
    margin-bottom: 10px; /* Tambahkan margin bawah pada tombol status di perangkat mobile */
  }
}

.modal-title {
  text-align: center;
}

.detail-info {
  margin-bottom: 20px;
}

.detail-info p {
  margin: 5px 0;
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
  margin: 0 5px;
  border-radius: 20px;
}

.status-buttons button.active {
  background-color: #007BFF;
  border-radius: 20px;
  border: none;
  color: white;
}

.jadwal-cards-container {
  display: flex;
  flex-wrap: nowrap; /* Ubah ke nowrap untuk scroll horizontal */
  gap: 10px;
  justify-content: flex-start; /* Atur ulang justify-content */
  overflow-x: auto; /* Tambahkan scroll horizontal */
}

.jadwal-cards-container::-webkit-scrollbar {
  display: none; /* Sembunyikan scrollbar pada Chrome, Safari, dan Opera */
}

.jadwal-cards-container {
  -ms-overflow-style: none; /* Sembunyikan scrollbar pada IE dan Edge */
  scrollbar-width: none; /* Sembunyikan scrollbar pada Firefox */
}

.jadwal-card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  min-width: 150px;
}

.jadwal-card p {
  margin: 5px 0;
}

.hapus-jadwal-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #e74c3c;
  color: white;
  border-radius: 20px;
  margin-top: 10px;
}

.hapus-jadwal-button:hover {
  background-color: #c0392b;
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
}

.submit-button:hover {
  background-color: #0056b3;
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
  overflow: hidden;
}

.container-content::-webkit-scrollbar {
  display: none;
}

.container-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
