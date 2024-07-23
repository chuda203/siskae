<template>
  <h1 class="title-container">
    <span class="title">Publikasi</span>
  </h1>  
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div v-if="!tableView" class="filter-buttons-container">
            <button class="filter-button" :class="{'active': filter === 'all'}" @click="filter = 'all'">Semua</button>
            <button class="filter-button" :class="{'active': filter === 'artikel'}" @click="filter = 'artikel'">Artikel</button>
            <button class="filter-button" :class="{'active': filter === 'jurnal'}" @click="filter = 'jurnal'">Jurnal</button>
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
          <div v-for="(pub, index) in filteredPublikasi" :key="`publikasi-${index}`" class="card" @click="lihatDetail(pub)">
            <div class="card-header">
              <img :src="pub.sampul" alt="Sampul" class="card-img">
              <h3>{{ pub.judul }}</h3>
            </div>
            <div class="card-body">
              <p>{{ pub.penulis }}</p>
              <p>{{ pub.tipe }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Tipe</th>
                <th>Penulis</th>
                <th>Judul</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pub, index) in filteredPublikasi" :key="`table-${index}`">
                <td>{{ pub.tipe }}</td>
                <td>{{ pub.penulis }}</td>
                <td>{{ pub.judul }}</td>
                <td>{{ pub.deskripsi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Detail Publikasi -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detail Publikasi</h3>
        <table class="detail-table">
          <tbody>
            <tr>
              <td>Tipe</td>
              <td>{{ selectedPublikasi.tipe }}</td>
            </tr>
            <tr>
              <td>Penulis</td>
              <td>{{ selectedPublikasi.penulis }}</td>
            </tr>
            <tr>
              <td>Judul</td>
              <td>{{ selectedPublikasi.judul }}</td>
            </tr>
            <tr>
              <td>Deskripsi</td>
              <td>{{ selectedPublikasi.deskripsi }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Publikasi',
  data() {
    return {
      filter: 'all',
      tableView: false,
      showModal: false,
      selectedPublikasi: {},
      publikasiData: [
        {
          id: 1,
          judul: 'Penelitian A',
          penulis: 'Dr. Budi',
          tipe: 'Artikel',
          deskripsi: 'Deskripsi Penelitian A',
          sampul: 'https://via.placeholder.com/150'
        },
        {
          id: 2,
          judul: 'Skripsi B',
          penulis: 'Ani',
          tipe: 'Skripsi',
          deskripsi: 'Deskripsi Skripsi B',
          sampul: 'https://via.placeholder.com/150'
        },
        {
          id: 3,
          judul: 'Jurnal C',
          penulis: 'Andi',
          tipe: 'Jurnal',
          deskripsi: 'Deskripsi Jurnal C',
          sampul: 'https://via.placeholder.com/150'
        }
        // Tambahkan data lainnya sesuai kebutuhan
      ],
    };
  },
  computed: {
    filteredPublikasi() {
      return this.publikasiData.filter(pub => {
        return this.filter === 'all' || pub.tipe.toLowerCase() === this.filter;
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
    lihatDetail(pub) {
      this.selectedPublikasi = pub;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>
<style scoped>
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
  position: relative; /* Necessary for absolute positioning of children */
}

.card-header {
  position: relative;
}

.card-header h3 {
  margin: 0;
}

.card-header .card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.card-body p {
  margin: 5px 0;
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
