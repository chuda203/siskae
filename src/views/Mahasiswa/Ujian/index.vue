<template>
  <div class="ujian-container">
    <!-- Jadwal Ujian -->
    <div class="jadwal-ujian">
      <h1>Jadwal Ujian</h1>
      <p>Klik tombol di bawah untuk melihat jadwal ujian di Google Spreadsheet:</p>
      <div class="button-container">
        <a :href="sheet.url" target="_blank" class="button">{{ sheet.name }}</a>
      </div>
    </div>

    <!-- Kartu Ujian -->
    <div class="kartu-ujian">
      <h1>Kartu Ujian</h1>
      <div v-if="canPrintCard">
        <table>
          <thead>
            <tr>
              <th>Kode Mata Kuliah</th>
              <th>Nama Mata Kuliah</th>
              <th>Waktu Ujian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in jadwalUjian" :key="index">
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.waktu }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="printCard">Cetak Kartu Ujian</button>
      </div>
      <div v-else>
        <p>Anda belum dapat mencetak kartu ujian. Silakan cek kembali mendekati waktu ujian.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sheet: { name: 'Jadwal Ujian', url: 'https://docs.google.com/spreadsheets/d/your-spreadsheet-id' },
      canPrintCard: false, // Ini akan diatur oleh admin atau mendekati waktu ujian
      jadwalUjian: [
        { kode: 'IF101', nama: 'Pemrograman Dasar', waktu: '2024-07-15 08:00' },
        { kode: 'IF102', nama: 'Struktur Data', waktu: '2024-07-16 10:00' },
        // Tambahkan jadwal ujian lainnya sesuai kebutuhan
      ]
    };
  },
  methods: {
    printCard() {
      window.print();
    }
  },
  mounted() {
    // Logika untuk menentukan apakah kartu ujian dapat dicetak
    const currentDate = new Date();
    const examDate = new Date('2024-07-10'); // Contoh tanggal untuk mengaktifkan pencetakan
    this.canPrintCard = currentDate >= examDate;
  }
};
</script>

<style scoped>
.ujian-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.jadwal-ujian, .kartu-ujian {
  margin-bottom: 40px;
}

.button-container {
  margin-top: 20px;
}

.button, button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
}

.button:hover, button:hover {
  background-color: #2980b9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>
