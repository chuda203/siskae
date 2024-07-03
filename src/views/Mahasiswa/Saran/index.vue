<template>
    <div class="evaluation-form">
      <h1>Lembar Evaluasi</h1>
      <div v-for="(item, index) in evaluationItems" :key="index" class="evaluation-item">
        <p>{{ item.text }}</p>
        <button @click="redirectToForm(item.formUrl)">Isi Formulir</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        evaluationItems: [
          { text: 'Evaluasi Dosen 1', formUrl: 'https://forms.gle/example1' },
          { text: 'Evaluasi Dosen 2', formUrl: 'https://forms.gle/example2' },
          { text: 'Evaluasi Fasilitas 1', formUrl: 'https://forms.gle/example3' },
          { text: 'Evaluasi Fasilitas 2', formUrl: 'https://forms.gle/example4' },
        ],
      };
    },
    methods: {
      redirectToForm(url) {
        window.open(url, '_blank');
      },
    },
  };
  </script>
  
  <style>
  .evaluation-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .evaluation-item {
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  