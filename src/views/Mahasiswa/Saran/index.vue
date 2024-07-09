<template>
  <h1 class="title">Menu Saran</h1>
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div class="filter-buttons-container">
            <button class="filter-button" :class="{'active': selectedType === 'dosen'}" @click="selectedType = 'dosen'">Saran untuk Dosen</button>
            <button class="filter-button" :class="{'active': selectedType === 'karyawan'}" @click="selectedType = 'karyawan'">Saran untuk Karyawan</button>
            <button class="filter-button" :class="{'active': selectedType === 'universitas'}" @click="selectedType = 'universitas'">Saran untuk Universitas</button>
          </div>
        </div>
        <div v-if="selectedType" class="saran-form">
          <h2 v-if="selectedType === 'dosen'">Saran untuk Dosen</h2>
          <h2 v-if="selectedType === 'karyawan'">Saran untuk Karyawan</h2>
          <h2 v-if="selectedType === 'universitas'">Saran untuk Universitas</h2>
          <form @submit.prevent="submitSaran" class="form-content">
            <div v-if="selectedType === 'dosen'" class="form-group">
              <label for="namaDosen">Nama Dosen:</label>
              <input type="text" id="namaDosen" v-model="dosen.nama" required />
            </div>
            <div v-if="selectedType === 'karyawan'" class="form-group">
              <label for="namaKaryawan">Nama Karyawan:</label>
              <input type="text" id="namaKaryawan" v-model="karyawan.nama" required />
            </div>
            <div class="form-group">
              <label :for="'kategori' + selectedType.charAt(0).toUpperCase() + selectedType.slice(1)">Kategori:</label>
              <select :id="'kategori' + selectedType.charAt(0).toUpperCase() + selectedType.slice(1)" v-model="selectedKategori" @change="checkKategori(selectedType)">
                <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori.charAt(0).toUpperCase() + kategori.slice(1) }}</option>
              </select>
            </div>
            <div v-if="selectedKategori === 'lainnya'" class="form-group">
              <label for="customKategori">Kategori Lainnya:</label>
              <input type="text" id="customKategori" v-model="customKategori" />
            </div>
            <div class="form-group">
              <label for="isiSaran">Isi Saran:</label>
              <textarea id="isiSaran" v-model="isiSaran" required></textarea>
            </div>
            <button type="submit" class="submit-button">Kirim Saran</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedType: 'dosen', // Set default to 'dosen'
      selectedKategori: '',
      customKategori: '',
      isiSaran: '',
      dosen: {
        nama: '',
        kategori: '',
        customKategori: '',
        isiSaran: ''
      },
      karyawan: {
        nama: '',
        kategori: '',
        customKategori: '',
        isiSaran: ''
      },
      universitas: {
        kategori: '',
        customKategori: '',
        isiSaran: ''
      }
    };
  },
  computed: {
    kategoriList() {
      if (this.selectedType === 'dosen') {
        return ['materi', 'waktu', 'personal', 'lainnya'];
      } else if (this.selectedType === 'karyawan') {
        return ['pelayanan', 'waktu', 'personal', 'lainnya'];
      } else if (this.selectedType === 'universitas') {
        return ['fasilitas', 'lainnya'];
      }
      return [];
    }
  },
  methods: {
    checkKategori(type) {
      if (this.selectedKategori !== 'lainnya') {
        this.customKategori = '';
      }
    },
    submitSaran() {
      let saran = {
        type: this.selectedType,
        kategori: this.selectedKategori === 'lainnya' ? this.customKategori : this.selectedKategori,
        isiSaran: this.isiSaran
      };
      if (this.selectedType === 'dosen') {
        saran.nama = this.dosen.nama;
      } else if (this.selectedType === 'karyawan') {
        saran.nama = this.karyawan.nama;
      }
      console.log('Saran submitted:', saran);
      // Anda bisa mengganti console.log dengan logika pengiriman formulir Anda
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  padding: 20px;
  /* Tambahkan properti berikut jika diperlukan */
  overflow: hidden;
}

.container-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Ensure absolute positioning works */
  /* Tambahkan properti berikut jika diperlukan */
  height: 100%;
  overflow-y: auto;
}

/* Jika ada perbedaan pada elemen lain, pastikan mereka konsisten */

.title {
  text-align: center;
  margin-bottom: 20px;
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
  padding-right: 0px;
  padding-left: 140px;
  height: 40px;
}

.filter-buttons-container::-webkit-scrollbar {
  display: none;
}

.filter-button {
  border: none;
  background-color: #cccccc;
  color: black;
  padding: 0px 10px;
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
  margin: 10px 0;
  width: calc(100% - 20px);
  margin-left: 10px;
  margin-right: 10px;
}

.card-body p {
  margin: 5px 0;
}

.ambil-button,
.batal-button,
.ambil-button.disabled {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 0;
  border-radius: 20px;
}

.ambil-button {
  background-color: #3498db;
  color: white;
}

.batal-button {
  background-color: #e74c3c;
  color: white;
}

.ambil-button:hover {
  background-color: #2980b9;
}

.batal-button:hover {
  background-color: #c0392b;
}

.ambil-button.disabled,
.ambil-button.disabled:hover {
  background-color: #95a5a6;
  cursor: not-allowed;
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
  overflow: hidden;
}

.container-content::-webkit-scrollbar {
  display: none;
}

.container-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.saran-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-content {
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

textarea {
  resize: vertical;
}
</style>
