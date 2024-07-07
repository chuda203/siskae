<template>
  <div class="evaluation-form">
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
        { text: 'EVALUASI DOSEN', formUrl: 'https://forms.gle/example1' },
        { text: 'EVALUASI FASILITAS', formUrl: 'https://forms.gle/example3' }
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

<style scoped>
.evaluation-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  min-height: 100vh; /* Full viewport height */
  padding: 20px;
  background-color: #f9f9f9;
}

.evaluation-item {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
  text-align: center;
}

.evaluation-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  padding: 10px 20px;
  background-color: #cccccc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #007BFF;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

p {
  margin: 0 0 10px;
  color: #666;
}
</style>
