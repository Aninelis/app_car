<template>
    <div class="auth-container">
        <h1>Sistema Gerencial para Controle de Estoque de Veículos</h1>
        <p>Bem-vindo ao sistema.</p>
    </div>
</template>

<script setup>
</script>

<style scoped>
/* Mesma estilização usada no login.vue */
.auth-container {
    max-width: 400px;
    width: 100%;
    background-color: #ffffff; /* Fundo branco */
    color: #333; /* Cor do texto */
    padding: 40px;
    border-radius: 12px; /* Cantos arredondados */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    font-family: Arial, sans-serif;
    margin: 0 auto;
    margin-top: 5vh;
}

/* Título */
h1 {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-left: 4px solid #ff5a5a;
    padding-left: 8px;
}

/* Texto descritivo */
p {
    font-size: 14px;
    color: #555;
    margin-top: 10px;
    line-height: 1.6;
}
</style>
