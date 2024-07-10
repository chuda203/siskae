<template>
    <div class="pengumuman">

    </div>
  </template>
  
<script>
import calendarImage from '../../../assets/academic-calender.png';

export default {
  data() {
    return {
      announcements: [
        'Pengumuman 1: Libur nasional pada tanggal 17 Agustus',
        'Pengumuman 2: Ujian tengah semester dimulai tanggal 1 Oktober',
        'Pengumuman 3: Pendaftaran wisuda dibuka mulai tanggal 15 November'
      ],
      calendarImage: calendarImage // Menggunakan gambar yang diimpor
    };
  }
};
</script>  
  <style>
  .pengumuman {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .announcement-section,
  .calendar-section {
    margin-bottom: 20px;
  }
  
  h2 {
    color: #2c3e50;
  }
  
  ul {
    list-style-type: disc;
    padding-left: 20px;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #f9f9f9;
  }
  </style>