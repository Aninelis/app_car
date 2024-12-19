<!-- Formulário de Registro -->
<template>
    <div class="auth-container">
        <h1>Cadastro</h1>

        <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
                <label for="email">E-mail:</label>
                <input type="email" id="email" v-model="email" placeholder="Digite seu e-mail" required />
            </div>

            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" v-model="password" placeholder="Digite sua senha" required />
            </div>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success">{{ successMessage }}</p>

            <button type="submit" class="auth-button">Registrar</button>
            <NuxtLink to="/login.vue" class="link">Já possui uma conta? Faça login</NuxtLink>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { register } = useAuth();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
    try {
        await register(email.value, password.value);
        successMessage.value = "Cadastro realizado com sucesso! Faça login.";
        errorMessage.value = '';
    } catch (error) {
        errorMessage.value = error.message;
        successMessage.value = '';
    }
};
</script>

<style scoped>
/* Container Principal - Mesmo estilo e tamanho para Login e Registro */
.auth-container {
    max-width: 400px; /* Alinhado com o formulário de login */
    width: 100%;
    background-color: #ffffff;
    color: #333;
    padding: 40px;
    border-radius: 12px;
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

/* Formulário */
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Label e Inputs */
.form-group label {
    color: #333;
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    outline: none;
}

/* Mensagens de Erro e Sucesso */
.error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

.success {
    color: green;
    font-size: 12px;
    margin-top: 5px;
}

/* Botão de Registro */
.auth-button {
    background-color: #4a90e2;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    width: 100%;
    text-align: center;
}

.auth-button:hover {
    background-color: #357ab8;
}

/* Link para Fazer Login */
.link {
    margin-top: 15px;
    color: #4a90e2;
    text-decoration: none;
    font-size: 14px;
    display: block;
    text-align: center;
}

.link:hover {
    text-decoration: underline;
}
</style>
