<template>
    <div class="jadwal-ujian">
      <h1>Jadwal Ujian</h1>
      <p>Klik tombol di bawah untuk melihat jadwal ujian di Google Spreadsheet:</p>
      <div class="button-container">
        <a :href="sheet.url" target="_blank" class="button">{{ sheet.name }}</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sheet: { name: 'Jadwal Ujian', url: 'https://docs.google.com/spreadsheets/d/your-spreadsheet-id' }
      };
    }
  };
  </script>
  
  <style>
  .jadwal-ujian {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .button-container {
    margin-top: 20px;
  }
  
  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .button:hover {
    background-color: #2980b9;
  }
  </style>
  