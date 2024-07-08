<template>
    <div class="container">
      <div class="grid">
        <div v-for="pub in publikasiData" :key="pub.id" class="card">
          <img :src="pub.sampul" alt="Sampul" class="card-img">
          <h3 class="card-title">{{ pub.judul }}</h3>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Publikasi',
    data() {
      return {
        publikasiData: [
          {
            id: 1,
            judul: 'Penelitian A',
            penulis: 'Dr. Budi',
            tipe: 'Artikel',
            status: 'Draft',
            sampul: 'https://via.placeholder.com/150'
          },
          {
            id: 2,
            judul: 'Skripsi B',
            penulis: 'Ani',
            tipe: 'Skripsi',
            status: 'Disetujui',
            sampul: 'https://via.placeholder.com/150'
          },
          {
            id: 3,
            judul: 'Tesis C',
            penulis: 'Andi',
            tipe: 'Tesis',
            status: 'Dipublikasikan',
            sampul: 'https://via.placeholder.com/150'
          }
          // Tambahkan data lainnya sesuai kebutuhan
        ],
      };
    },
  };
  </script>
  
  <style>
  .container {
    padding: 20px;
  }
  
  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: center;
    width: 350px;
  }
  
  .card-img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .card-title {
    padding: 10px;
    font-size: 14px;
  }
  </style>
  