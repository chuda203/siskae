<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        &copy; 2024 Your Company. All rights reserved.
      </p>
      <p>
        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
};
</script>

<style scoped>
.footer {
  background-color: #f8f8f8;
  padding: 0px 0;
  margin-top: 50px;
  border-top: 1px solid #e7e7e7;
  width: 100%;
  /* Hindari penggunaan position: fixed atau absolute */
}

.footer .content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.footer a {
  color: #3273dc;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

/* Media query untuk menyembunyikan footer di tampilan mobile */
@media (max-width: 768px) {
  .footer {
    display: none; /* Atau atur sesuai kebutuhan Anda */
  }
}
</style>
