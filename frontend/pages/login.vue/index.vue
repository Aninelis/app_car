<template>
    <div class="auth-container">
        <h1>Faça o seu login</h1>

        <p v-if="alertMessage" class="alert">{{ alertMessage }}</p>

        <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
                <label for="email">Seu e-mail*</label>
                <input type="email" id="email" v-model="email" required />
            </div>

            <div class="form-group">
                <label for="password">Sua senha*</label>
                <input type="password" id="password" v-model="password" required />
            </div>

            <div class="form-group-checkbox">
                <input type="checkbox" id="remember" v-model="rememberMe" />
                <label for="remember">Lembrar-me</label>
            </div>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

            <button type="submit" class="auth-button">ENTRAR</button>
            <p class="forgot-password">
                <button type="button" @click="redirectToRegister" class="toggle-auth-mode">
                    Não tem uma conta? Cadastre-se!
                </button>
            </p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const { login } = useAuth();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const alertMessage = ref(route.query.message || '');

const handleLogin = async () => {
    const success = await login(email.value, password.value);
    if (success) {
        router.push('/'); // Redireciona após login bem-sucedido
    } else {
        errorMessage.value = 'Credenciais inválidas ou usuário não cadastrado';
    }
};

// Redireciona para a página de registro
const redirectToRegister = () => {
    router.push('/register.vue'); // Altere '/register' para a rota correta da sua página de registro
};
</script>

<style scoped>
/* Container Principal */
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

/* Formulário */
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Label e Inputs */
.form-group label {
    color: #333;
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

/* Estilo do Checkbox */
.form-group-checkbox {
    display: flex;
    align-items: center;
    gap: 5px;
}

.form-group-checkbox label {
    font-size: 14px;
    color: #333;
}

/* Mensagem de Erro */
.error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

/* Botão de Ação */
.auth-button {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 20px; /* Cantos arredondados */
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    width: 100%;
    margin-top: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.auth-button:hover {
    background-color: #0056b3;
}

/* Link para Trocar de Modo (Login/Cadastro) */
.forgot-password {
    font-size: 12px;
    color: #666;
    margin-top: 10px;
    text-align: center;
}

.toggle-auth-mode {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    font-size: 12px;
    padding: 0;
}

.toggle-auth-mode:hover {
    color: #0056b3;
}

/* Alertas */
.alert {
    color: red;
    margin-bottom: 10px;
}
</style>
