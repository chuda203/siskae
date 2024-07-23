<template>
  <div class="main-container">
    <div class="container">
      <div class="row">
        <div class="col data-mahasiswa">
          <div class="data-item">{{ mahasiswa.nama }}</div>
          <div class="data-item">{{ mahasiswa.role }}</div>
          <div class="data-item">{{ mahasiswa.semester }}</div>
        </div>
        <div class="col ipk">
          <h5>IPK</h5>
          <div class="ipk-content">{{ ipk }}</div>
        </div>
        <div class="col notifikasi">
          <h5>Notifikasi</h5>
          <div v-for="(notif, index) in notifikasi" :key="index" class="notif-item">
            {{ notif }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col kalender-akademik">
          <div class="image-container">
            <img src="../../../assets/academic-calender.png" alt="Kalender Akademik" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Beranda",
  data() {
    return {
      mahasiswa: {
        nama: this.getCookie("name") || "Nama Mahasiswa",
        role: this.getCookie("role") || "Role Mahasiswa",
        semester: "Semester " + (this.getCookie("current_semester") || "N/A")
      },
      ipk: 3.75,
      notifikasi: [
        "Pendaftaran ulang dibuka hingga 31 Juli",
        "Jadwal ujian akhir telah dirilis",
        "Segera laporkan nilai kurang dari 60"
      ]
    };
  },
  methods: {
    getCookie(name) {
      let value = "; " + document.cookie;
      let parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }
  }
};
</script>

<style scoped>
.main-container {
  margin: 5vh 15vw; /* Menambahkan margin yang lebih lebar dan simetris */
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  padding: 2vh;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 2vw;
}

.col {
  flex: 1;
  min-width: 250px;
  height: 30vh; /* Menggunakan unit viewport height untuk tinggi yang konsisten */
  padding: 2vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.data-mahasiswa {
  justify-content: center;
}

.data-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Rata kiri */
}

.ipk {
  flex: 0.5; /* Menjadikan kolom IPK lebih sempit */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; /* Menambahkan text-align center untuk judul IPK */
}

.ipk-content {
  font-size: 2em;
}

.notifikasi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.notif-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kalender-akademik {
  width: 100%;
  height: auto; /* Menyesuaikan tinggi secara otomatis berdasarkan konten */
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
