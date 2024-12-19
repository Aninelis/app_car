<template>
    <div class="container">
        <header>
            <nav>
                <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/fornecedores.vue">Fornecedores</NuxtLink></li>
                    <li><NuxtLink to="/veiculos.vue">Veículos</NuxtLink></li>
                    <li><NuxtLink to="/consulta.vue">Consulta</NuxtLink></li>
                    <li>
                        <NuxtLink v-if="!isLoggedIn" to="/login.vue">Entrar</NuxtLink>
                        <button v-else @click="logout" class="logout-link">Sair</button>
                    </li>
                </ul>
            </nav>
        </header>
        <section class="hero">
            <slot />
        </section>
        <footer>
            <p>&copy; 2024. Todos os direitos reservados.</p>
        </footer>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { user, logout } = useAuth();
const isLoggedIn = computed(() => user.value.isAuthenticated);
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body, .container {
    height: 100%;
    width: 100%;
    background-color: #f4f4f9; /* Fundo suave e neutro */
}

.container {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    background-color: #000000; /* Cor escura para o cabeçalho */
    padding: 15px 0;
    color: #fff;
}

header nav ul {
    display: flex;
    justify-content: center;
    list-style-type: none;
}

header nav ul li {
    margin: 0 20px;
}

header nav ul li a, .logout-link {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.3s;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: normal;
}

header nav ul li a:hover, .logout-link:hover {
    color: #ffcc00; /* Destaque dourado ao passar o mouse */
}

.hero {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #ffffff; /* Fundo da seção principal */
    color: #333; /* Texto escuro para contraste */
}

footer {
    background-color: #000000; /* Cabeçalho e rodapé com a mesma cor */
    color: #fff;
    text-align: center;
    padding: 20px;
    font-size: 14px;
}
</style>
