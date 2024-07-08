<template>
  <div class="ujian-container">
    <h1 class="title">UJIAN</h1>
    <div class="ujian-types">
      <button @click="selectedType = 'jadwalUjian'" :class="{ 'active': selectedType === 'jadwalUjian' }">Jadwal Ujian</button>
      <button @click="selectedType = 'cetakKartuUjian'" :class="{ 'active': selectedType === 'cetakKartuUjian' }">Cetak Kartu Ujian</button>
    </div>

    <!-- Jadwal Ujian Section -->
    <div v-if="selectedType === 'jadwalUjian'" class="section">
      <h2>Jadwal Ujian</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Hari</th>
              <th>Waktu</th>
              <th>Kode Mata Kuliah</th>
              <th>Nama Kuliah</th>
              <th>Semester</th>
              <th>Bobot SKS</th>
              <th>Nama Dosen</th>
              <th>Ruang Kelas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ujian, index) in jadwalUjian" :key="index">
              <td>{{ ujian.hari }}</td>
              <td>{{ ujian.waktu }}</td>
              <td>{{ ujian.kodeMataKuliah }}</td>
              <td>{{ ujian.namaMataKuliah }}</td>
              <td>{{ ujian.semester }}</td>
              <td>{{ ujian.bobotSKS }}</td>
              <td>{{ ujian.namaDosen }}</td>
              <td>{{ ujian.ruangKelas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cetak Kartu Ujian Section -->
    <div v-if="selectedType === 'cetakKartuUjian'" class="section">
      <h2>Cetak Kartu Ujian</h2>
      <div class="kartu-ujian">
        <div class="profile-info">
          <p><strong>Nama Mahasiswa:</strong> {{ mahasiswa.nama }}</p>
          <p><strong>Semester:</strong> {{ mahasiswa.semester }}</p>
          <p><strong>Program Studi:</strong> {{ mahasiswa.programStudi }}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Kode Mata Kuliah</th>
              <th>Nama Mata Kuliah</th>
              <th>Jumlah SKS</th>
              <th>Nama Dosen</th>
              <th>Paraf Pengawas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in mahasiswa.mataKuliah" :key="index">
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.sks }}</td>
              <td>{{ mataKuliah.dosen }}</td>
              <td><input type="text" class="form-control" v-model="mataKuliah.parafPengawas"></td>
            </tr>
          </tbody>
        </table>
        <div class="signature-section">
          <div class="signature"></div> <!-- Placeholder for Tanda Tangan Mahasiswa -->
          <div class="photo-container">
            <div class="photo-placeholder"></div> <!-- Placeholder for Foto 3x4 -->
            <p>Foto 3x4</p>
          </div>
        </div>
        <p class="signature-label">Tanda Tangan Mahasiswa:</p>
        <p class="print-date">Tanggal Cetak: {{ currentDate }}</p>
        <button @click="printKartuUjianDirect">Print Kartu Ujian</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedType: 'jadwalUjian',
      jadwalUjian: [
        { hari: 'Senin', waktu: '08:00 - 10:00', kodeMataKuliah: 'MK001', namaMataKuliah: 'Matematika', semester: 1, bobotSKS: 3, namaDosen: 'Dr. John Doe', ruangKelas: 'R101' },
        { hari: 'Selasa', waktu: '10:00 - 12:00', kodeMataKuliah: 'MK002', namaMataKuliah: 'Fisika', semester: 1, bobotSKS: 3, namaDosen: 'Dr. Jane Doe', ruangKelas: 'R102' }
        // Add more exam schedules as needed
      ],
      mahasiswa: {
        nama: 'John Smith',
        semester: '1',
        programStudi: 'Teknik Informatika',
        mataKuliah: [
          { kode: 'MK001', nama: 'Matematika', sks: 3, dosen: 'Dr. John Doe', parafPengawas: '' },
          { kode: 'MK002', nama: 'Fisika', sks: 3, dosen: 'Dr. Jane Doe', parafPengawas: '' }
          // Add more courses as needed
        ]
      },
      currentDate: new Date().toLocaleDateString()
    };
  },
  methods: {
    printKartuUjianDirect() {
      // Prepare the content for printing
      const contentToPrint = this.$el.querySelector('.kartu-ujian').innerHTML;
      // Create a new window and print the content
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Kartu Ujian</title>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                }
                .signature {
                  width: 200px;
                  height: 50px;
                  border-bottom: 1px solid #000;
                }
                .photo-placeholder {
                  width: 75px;
                  height: 100px;
                  border: 1px solid #000;
                  margin-right: 20px;
                }
                .signature-label {
                  margin-top: 10px;
                }
                .print-date {
                  margin-top: 10px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
              }
            </style>
          </head>
          <body>
            ${contentToPrint}
          </body>
        </html>
      `);
      printWindow.document.close();
      // Focus the print window and print
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }
};
</script>

<style scoped>
.ujian-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  margin-bottom: 20px;
}

.ujian-types {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.ujian-types button {
  padding: 10px 20px;
  margin: 5px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ujian-types button:hover,
.ujian-types button.active {
  background-color: #2980b9;
}

.section {
  margin-top: 20px;
}

.table-container {
  margin-top: 20px;
}

.kartu-ujian {
  margin-top: 20px;
}

.kartu-ujian table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.kartu-ujian th,
.kartu-ujian td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.profile-info {
  margin-bottom: 20px;
}

.signature-section {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.signature {
  width: 200px;
  height: 50px;
  border-bottom: 1px solid #000;
}

.photo-container {
  display: flex;
  align-items: center;
}

.photo-placeholder {
  width: 75px;
  height: 100px;
  border: 1px solid #000;
  margin-right: 20px;
}

.signature-label {
  margin-top: 10px;
}

.print-date {
  margin-top: 10px;
}
</style>
