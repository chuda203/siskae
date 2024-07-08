<template>
  <div class="saran-container">
    <h1>Menu Saran</h1>
    <div class="saran-types">
      <button @click="selectedType = 'dosen'">Saran untuk Dosen</button>
      <button @click="selectedType = 'karyawan'">Saran untuk Karyawan</button>
      <button @click="selectedType = 'universitas'">Saran untuk Universitas</button>
    </div>

    <div v-if="selectedType === 'dosen'" class="saran-form">
      <h2>Saran untuk Dosen</h2>
      <form @submit.prevent="submitSaran">
        <div class="form-group">
          <label for="namaDosen">Nama Dosen:</label>
          <input type="text" id="namaDosen" v-model="dosen.nama" required />
        </div>
        <div class="form-group">
          <label for="kategoriDosen">Kategori:</label>
          <select id="kategoriDosen" v-model="dosen.kategori" @change="checkKategori('dosen')">
            <option value="materi">Materi</option>
            <option value="waktu">Waktu</option>
            <option value="personal">Personal</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div v-if="dosen.kategori === 'lainnya'" class="form-group">
          <label for="customKategoriDosen">Kategori Lainnya:</label>
          <input type="text" id="customKategoriDosen" v-model="dosen.customKategori" />
        </div>
        <div class="form-group">
          <label for="isiSaranDosen">Isi Saran:</label>
          <textarea id="isiSaranDosen" v-model="dosen.isiSaran" required></textarea>
        </div>
        <button type="submit">Kirim Saran</button>
      </form>
    </div>

    <div v-if="selectedType === 'karyawan'" class="saran-form">
      <h2>Saran untuk Karyawan</h2>
      <form @submit.prevent="submitSaran">
        <div class="form-group">
          <label for="namaKaryawan">Nama Karyawan:</label>
          <input type="text" id="namaKaryawan" v-model="karyawan.nama" required />
        </div>
        <div class="form-group">
          <label for="kategoriKaryawan">Kategori:</label>
          <select id="kategoriKaryawan" v-model="karyawan.kategori" @change="checkKategori('karyawan')">
            <option value="pelayanan">Pelayanan</option>
            <option value="waktu">Waktu</option>
            <option value="personal">Personal</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div v-if="karyawan.kategori === 'lainnya'" class="form-group">
          <label for="customKategoriKaryawan">Kategori Lainnya:</label>
          <input type="text" id="customKategoriKaryawan" v-model="karyawan.customKategori" />
        </div>
        <div class="form-group">
          <label for="isiSaranKaryawan">Isi Saran:</label>
          <textarea id="isiSaranKaryawan" v-model="karyawan.isiSaran" required></textarea>
        </div>
        <button type="submit">Kirim Saran</button>
      </form>
    </div>

    <div v-if="selectedType === 'universitas'" class="saran-form">
      <h2>Saran untuk Universitas</h2>
      <form @submit.prevent="submitSaran">
        <div class="form-group">
          <label for="kategoriUniversitas">Kategori:</label>
          <select id="kategoriUniversitas" v-model="universitas.kategori" @change="checkKategori('universitas')">
            <option value="fasilitas">Fasilitas</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div v-if="universitas.kategori === 'lainnya'" class="form-group">
          <label for="customKategoriUniversitas">Kategori Lainnya:</label>
          <input type="text" id="customKategoriUniversitas" v-model="universitas.customKategori" />
        </div>
        <div class="form-group">
          <label for="isiSaranUniversitas">Isi Saran:</label>
          <textarea id="isiSaranUniversitas" v-model="universitas.isiSaran" required></textarea>
        </div>
        <button type="submit">Kirim Saran</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedType: null,
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
  methods: {
    checkKategori(type) {
      if (this[type].kategori !== 'lainnya') {
        this[type].customKategori = '';
      }
    },
    submitSaran() {
      let saran = {};
      if (this.selectedType === 'dosen') {
        saran = {
          type: 'dosen',
          nama: this.dosen.nama,
          kategori: this.dosen.kategori === 'lainnya' ? this.dosen.customKategori : this.dosen.kategori,
          isiSaran: this.dosen.isiSaran
        };
      } else if (this.selectedType === 'karyawan') {
        saran = {
          type: 'karyawan',
          nama: this.karyawan.nama,
          kategori: this.karyawan.kategori === 'lainnya' ? this.karyawan.customKategori : this.karyawan.kategori,
          isiSaran: this.karyawan.isiSaran
        };
      } else if (this.selectedType === 'universitas') {
        saran = {
          type: 'universitas',
          kategori: this.universitas.kategori === 'lainnya' ? this.universitas.customKategori : this.universitas.kategori,
          isiSaran: this.universitas.isiSaran
        };
      }
      console.log('Saran submitted:', saran);
      // You can replace the console log with your form submission logic
    }
  }
};
</script>

<style scoped>
.saran-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.saran-types {
  margin-bottom: 20px;
}

.saran-types button {
  padding: 10px 20px;
  margin: 5px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.saran-types button:hover {
  background-color: #2980b9;
}

.saran-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
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

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

textarea {
  resize: vertical;
}
</style>
