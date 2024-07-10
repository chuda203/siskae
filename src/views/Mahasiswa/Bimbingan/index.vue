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
              <h3>{{ item.topic }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ item.nama_dosen }}</p>
              <p>{{ item.title }}</p>
              <p>{{ item.status }}</p>
              <button @click="lihatSlotWaktu(item)" class="lihat-slot-button">Lihat Slot Waktu</button>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Topik</th>
                <th>Dosen Pembimbing</th>
                <th>Judul</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredBimbingan" :key="`table-${index}`">
                <td>{{ item.topic }}</td>
                <td>{{ item.nama_dosen }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <button @click="lihatSlotWaktu(item)" class="lihat-slot-button">Lihat Slot Waktu</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Slot Waktu -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Slot Waktu Bimbingan</h3>
        <table class="slot-table">
          <thead>
            <tr>
              <th>Pilih</th>
              <th>Hari</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Ruang</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(slot, index) in selectedSlots" :key="`slot-${index}`" :class="{ 'gray-row': index % 2 === 1 }">
              <td><button @click="pilihSlot(slot)" class="pilih-slot-button">Pilih Slot</button></td>
              <td>{{ slot.hari }}</td>
              <td>{{ slot.tanggal }}</td>
              <td>{{ slot.waktu }}</td>
              <td>{{ slot.ruang }}</td>
            </tr>
          </tbody>
        </table>
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
      showModal: false,
      selectedSlots: [],
      bimbinganList: []
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
  lihatSlotWaktu(item) {
    console.log(`Fetching slots for guidance ID: ${item.guidance_id}`); // Log request initiation
    fetch(`http://localhost:3000/guidanceslots/student/${item.guidance_id}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Slots fetched successfully:', data.data); // Log successful response
          this.selectedSlots = data.data.map(slot => ({
            slot_id: slot.slot_id,
            hari: this.getDayOfWeek(slot.date),
            tanggal: slot.date,
            waktu: `${slot.start_time} - ${slot.end_time}`,
            ruang: slot.room
          }));
          console.log('Mapped slots:', this.selectedSlots); // Log mapped slots
          this.showModal = true;
        } else {
          console.error('Error fetching slots:', data.message); // Log error response
        }
      })
      .catch(error => {
        console.error('Error fetching slots:', error); // Log fetch error
      });
  },
  pilihSlot(slot) {
    console.log(`Slot ${slot.hari}, ${slot.tanggal}, ${slot.waktu}, ${slot.ruang} dipilih`);
    this.closeModal();
  },
  closeModal() {
    this.showModal = false;
  },
  fetchBimbingan() {
    const userId = 4; // Sesuaikan dengan user_id yang sesuai
    fetch(`http://localhost:3000/guidances/student/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.bimbinganList = data.data.map(item => ({
            guidance_id: item.guidance_id,
            topic: item.topic,
            nama_dosen: item.nama_dosen,
            title: item.title,
            status: item.status,
            type: this.getTypeFromTopic(item.topic) // Tambahkan fungsi untuk menentukan tipe dari topik
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
  getTypeFromTopic(topic) {
    switch (topic.toLowerCase()) {
      case 'krs':
        return 'krs';
      case 'kerja praktik':
        return 'kp';
      case 'skripsi':
        return 'skripsi';
      default:
        return 'all';
    }
  },
  getDayOfWeek(dateString) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }
},
mounted() {
  this.fetchBimbingan();
  console.log('Component mounted, fetching bimbingan'); // Log component mount
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

.lihat-slot-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 0;
  background-color: #3498db;
  color: white;
  border-radius: 20px; /* Rounded corners */
}

.lihat-slot-button:hover {
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

.slot-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.slot-table th, .slot-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.slot-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.slot-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.pilih-slot-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 20px; /* Rounded corners */
}

.pilih-slot-button:hover {
  background-color: #2980b9;
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
