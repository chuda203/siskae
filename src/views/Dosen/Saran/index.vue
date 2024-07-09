<template>
  <h1 class="title">Menu Saran Dosen</h1>
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div class="filter-buttons-container">
            <button class="filter-button" :class="{'active': selectedType === 'saya'}" @click="selectedType = 'saya'">Saran untuk Saya</button>
            <button class="filter-button" :class="{'active': selectedType === 'karyawan'}" @click="selectedType = 'karyawan'">Saran untuk Karyawan</button>
            <button class="filter-button" :class="{'active': selectedType === 'universitas'}" @click="selectedType = 'universitas'">Saran untuk Universitas</button>
          </div>
          <div v-if="selectedType === 'saya'" class="view-toggle-wrapper">
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="selectedType === 'saya'">
          <div v-if="tableView" class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Isi Saran</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(saran, index) in filteredSaran" :key="index">
                  <td>{{ saran.kategori }}</td>
                  <td>{{ saran.isiSaran }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="cards-container">
            <div v-for="(saran, index) in filteredSaran" :key="index" class="card">
              <div class="card-header">
                <h3>{{ saran.kategori }}</h3>
                <div class="divider"></div>
              </div>
              <div class="card-body">
                <p>{{ saran.isiSaran }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="selectedType === 'karyawan'" class="saran-form">
          <h2>Saran untuk Karyawan</h2>
          <form @submit.prevent="submitSaran">
            <div class="form-group">
              <label for="namaKaryawan">Nama Karyawan:</label>
              <input type="text" id="namaKaryawan" v-model="karyawan.nama" required />
            </div>
            <div class="form-group">
              <label for="kategoriKaryawan">Kategori:</label>
              <select id="kategoriKaryawan" v-model="selectedKategori" @change="checkKategori('karyawan')">
                <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori.charAt(0).toUpperCase() + kategori.slice(1) }}</option>
              </select>
            </div>
            <div v-if="selectedKategori === 'lainnya'" class="form-group">
              <label for="customKategoriKaryawan">Kategori Lainnya:</label>
              <input type="text" id="customKategoriKaryawan" v-model="customKategori" />
            </div>
            <div class="form-group">
              <label for="isiSaranKaryawan">Isi Saran:</label>
              <textarea id="isiSaranKaryawan" v-model="isiSaran" required></textarea>
            </div>
            <button type="submit" class="submit-button">Kirim Saran</button>
          </form>
        </div>
        <div v-else-if="selectedType === 'universitas'" class="saran-form">
          <h2>Saran untuk Universitas</h2>
          <form @submit.prevent="submitSaran">
            <div class="form-group">
              <label for="kategoriUniversitas">Kategori:</label>
              <select id="kategoriUniversitas" v-model="selectedKategori" @change="checkKategori('universitas')">
                <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori.charAt(0).toUpperCase() + kategori.slice(1) }}</option>
              </select>
            </div>
            <div v-if="selectedKategori === 'lainnya'" class="form-group">
              <label for="customKategoriUniversitas">Kategori Lainnya:</label>
              <input type="text" id="customKategoriUniversitas" v-model="customKategori" />
            </div>
            <div class="form-group">
              <label for="isiSaranUniversitas">Isi Saran:</label>
              <textarea id="isiSaranUniversitas" v-model="isiSaran" required></textarea>
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
      selectedType: 'saya', // Set default to 'saya'
      selectedKategori: '',
      customKategori: '',
      isiSaran: '',
      tableView: false,
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
      },
      saranList: [
        { nama: 'Dosen A', kategori: 'materi', isiSaran: 'Tingkatkan kualitas materi.' },
        { nama: 'Dosen B', kategori: 'waktu', isiSaran: 'Waktu kuliah terlalu pagi.' },
        { nama: 'Dosen C', kategori: 'personal', isiSaran: 'Pendekatan personal yang lebih baik diperlukan.' },
        { nama: 'Dosen A', kategori: 'materi', isiSaran: 'Materi terlalu sulit dipahami.' },
        { nama: 'Dosen B', kategori: 'waktu', isiSaran: 'Jadwal kuliah terlalu padat.' }
      ]
    };
  },
  computed: {
    kategoriList() {
      if (this.selectedType === 'karyawan') {
        return ['pelayanan', 'waktu', 'personal', 'lainnya'];
      } else if (this.selectedType === 'universitas') {
        return ['fasilitas', 'lainnya'];
      }
      return ['materi', 'waktu', 'personal', 'lainnya'];
    },
    filteredSaran() {
      return this.saranList.filter(saran => saran.nama.toLowerCase().includes('dosen'));
    }
  },
  methods: {
    toggleView() {
      this.tableView = !this.tableView;
    },
    checkKategori(type) {
      if (this.selectedKategori !== 'lainnya') {
        this.customKategori = '';
      }
    },
    submitSaran() {
      let saran = {
        nama: this.selectedType === 'karyawan' ? this.karyawan.nama : 'Universitas',
        kategori: this.selectedKategori === 'lainnya' ? this.customKategori : this.selectedKategori,
        isiSaran: this.isiSaran
      };
      this.saranList.push(saran);
      this.resetForm();
      console.log('Saran submitted:', saran);
    },
    resetForm() {
      this.selectedKategori = '';
      this.customKategori = '';
      this.isiSaran = '';
      if (this.selectedType === 'karyawan') {
        this.karyawan.nama = '';
      }
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
  position: relative;
  height: 100%;
  overflow-y: auto;
}

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

textarea {
  resize: vertical;
}
</style>
