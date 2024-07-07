<template>
  <div class="evaluation-form">
    <div class="evaluation-item" v-for="(item, index) in evaluationItems" :key="index">
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.evaluation-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.evaluation-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  padding: 10px 20px;
  background-color: #ccccc0;
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
