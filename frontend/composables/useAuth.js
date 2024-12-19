// composables/useAuth.js
import { useState } from '#app';

export const useAuth = () => {
    const user = useState('user', () => ({
        isAuthenticated: false,
        email: null,
    }));

    const registeredUsers = useState('registeredUsers', () => {
        if (process.client) {
            return JSON.parse(localStorage.getItem('registeredUsers')) || [];
        }
        return [];
    });

    const saveUsers = () => {
        if (process.client) {
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers.value));
        }
    };

    const login = async (email, password) => {
        const existingUser = registeredUsers.value.find(
            (user) => user.email === email && user.password === password
        );
        if (existingUser) {
            user.value.isAuthenticated = true;
            user.value.email = email;
            return true;
        } else {
            return false;
        }
    };

    const register = async (email, password) => {
        if (registeredUsers.value.find((user) => user.email === email)) {
            throw new Error("Usuário já cadastrado.");
        }
        registeredUsers.value.push({ email, password });
        saveUsers();
        return true;
    };

    const logout = () => {
        user.value.isAuthenticated = false;
        user.value.email = null;
        if (process.client) {
            navigateTo('/login.vue'); // Redireciona para a página de login
        }
    };

    const recoverPassword = (email) => {
        const userFound = registeredUsers.value.find(user => user.email === email);
        if (userFound) {
            return `A senha do usuário ${email} é: ${userFound.password}`;
        } else {
            throw new Error("E-mail não encontrado. Verifique e tente novamente.");
        }
    };

    return { user, login, register, logout, recoverPassword };
};
