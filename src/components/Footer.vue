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
    padding: 20px 0;
    border-top: 1px solid #e7e7e7;
    width: 100%;
    bottom: 0;
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
  </style>
  