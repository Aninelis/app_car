// middleware/auth.js
export default defineNuxtRouteMiddleware((to) => {
    const user = useState('user');
    if (!user.value.isAuthenticated && to.path !== '/login.vue') {
        return navigateTo('/login.vue?message=Você precisa estar logado para acessar o sistema.');
    }
});
