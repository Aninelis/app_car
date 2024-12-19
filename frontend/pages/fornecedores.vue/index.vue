<template>
    <div class="container">
        <div class="header">
            <h1>Fornecedores</h1>
            <button v-if="!mostrarFormulario" @click="abrirFormulario" class="btn-adicionar">
                Adicionar
            </button>
        </div>

        <!-- Exibir mensagem de sucesso ou erro -->
        <div v-if="mensagem" class="mensagem" :class="{ sucesso: mensagemTipo === 'sucesso', erro: mensagemTipo === 'erro' }">
            {{ mensagem }}
        </div>

        <!-- Formulário para adicionar ou editar fornecedor -->
        <form v-if="mostrarFormulario" @submit.prevent="salvarFornecedor" class="form">
            <label for="nome">Nome</label>
            <input id="nome" type="text" v-model="novoFornecedor.nome" required placeholder="Digite o nome do fornecedor" />

            <label for="email">Email</label>
            <input id="email" type="email" v-model="novoFornecedor.email" required placeholder="Digite o email" />

            <label for="telefone">Telefone</label>
            <input id="telefone" type="tel" v-model="novoFornecedor.telefone" required placeholder="Digite o telefone" />

            <div class="form-actions">
                <button type="submit" class="btn-salvar">Salvar</button>
                <button type="button" @click="mostrarFormulario = false" class="btn-voltar">Voltar</button>
            </div>
        </form>

        <!-- Lista de fornecedores cadastrados -->
        <div v-if="!mostrarFormulario && fornecedores.length > 0" class="fornecedores-lista">
            <div v-for="fornecedor in fornecedores" :key="fornecedor.id" class="fornecedor">
                <div class="fornecedor-info">
                    <p><strong>Nome:</strong> {{ fornecedor.nome }}</p>
                    <p><strong>Email:</strong> {{ fornecedor.email }}</p>
                    <p><strong>Telefone:</strong> {{ fornecedor.telefone }}</p>
                </div>
                <div class="fornecedor-actions">
                    <button @click="editarFornecedor(fornecedor)" class="btn-editar">Editar</button>
                    <button @click="excluirFornecedor(fornecedor.id)" class="btn-excluir">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const fornecedores = ref([]);
const mostrarFormulario = ref(false);
const novoFornecedor = ref({ nome: '', email: '', telefone: '' });
const editandoFornecedor = ref(null);
const mensagem = ref('');
const mensagemTipo = ref('');

// Função para carregar fornecedores do backend
const carregarFornecedores = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/fornecedores');
        if (!response.ok) throw new Error('Erro ao carregar fornecedores');
        fornecedores.value = await response.json();
    } catch (error) {
        exibirMensagem("Erro ao carregar fornecedores: " + error.message, "erro");
    }
};

// Função para abrir o formulário e limpar campos
const abrirFormulario = () => {
    mostrarFormulario.value = true;
    novoFornecedor.value = { nome: '', email: '', telefone: '' };
    editandoFornecedor.value = null;
};

// Função para exibir mensagens
const exibirMensagem = (texto, tipo) => {
    mensagem.value = texto;
    mensagemTipo.value = tipo;
    setTimeout(() => {
        mensagem.value = '';
    }, 3000); // Limpa a mensagem após 3 segundos
};

// Função para salvar fornecedor (criar ou atualizar)
const salvarFornecedor = async () => {
    try {
        // Verifica se o fornecedor já existe
        const fornecedorExistente = fornecedores.value.find(
            f => f.nome.toLowerCase() === novoFornecedor.value.nome.toLowerCase() || 
                 f.email.toLowerCase() === novoFornecedor.value.email.toLowerCase()
        );

        // Impede o cadastro duplicado, exceto se for o fornecedor em edição
        if (fornecedorExistente && (!editandoFornecedor.value || fornecedorExistente.id !== editandoFornecedor.value.id)) {
            exibirMensagem("Fornecedor já está cadastrado.", "erro");
            return;
        }

        const url = editandoFornecedor.value
            ? `http://localhost:4000/api/fornecedores/${editandoFornecedor.value.id}`
            : 'http://localhost:4000/api/fornecedores';

        const method = editandoFornecedor.value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFornecedor.value),
        });

        if (!response.ok) throw new Error(`Erro ao ${editandoFornecedor.value ? 'atualizar' : 'adicionar'} fornecedor`);

        await carregarFornecedores();
        exibirMensagem(editandoFornecedor.value ? "Fornecedor atualizado com sucesso!" : "Fornecedor adicionado com sucesso!", "sucesso");
        mostrarFormulario.value = false;
        novoFornecedor.value = { nome: '', email: '', telefone: '' };
        editandoFornecedor.value = null;
    } catch (error) {
        exibirMensagem("Erro ao salvar fornecedor: " + error.message, "erro");
    }
};


// Função para editar fornecedor
const editarFornecedor = (fornecedor) => {
    novoFornecedor.value = { ...fornecedor };
    mostrarFormulario.value = true;
    editandoFornecedor.value = fornecedor;
};

// Função para excluir fornecedor
const excluirFornecedor = async (id) => {
    try {
        const response = await fetch(`http://localhost:4000/api/fornecedores/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir fornecedor');
        await carregarFornecedores();
        exibirMensagem("Fornecedor excluído com sucesso!", "sucesso");
    } catch (error) {
        exibirMensagem( error.message, "erro");
    }
};

// Carregar fornecedores ao montar o componente
onMounted(() => {
    carregarFornecedores();
});

/*definePageMeta({
    middleware: 'auth'
});*/
</script>

<style scoped>
.container {
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    width: 100vw;
    max-width: 100%;
    box-sizing: border-box;
}

h1 {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    color: #333;
    border-left: 4px solid #ff5a5a;
    padding-left: 8px;
}

.mensagem {
    margin: 10px 0;
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
}

.sucesso {
    color: green;
}

.erro {
    color: red;
}

.btn-adicionar {
    background-color: #4a90e2;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    margin: 20px 0;
    font-size: 16px;
    border-radius: 8px;
    font-weight: bold;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form label {
    font-weight: normal;
    color: #333;
    font-size: 14px;
    margin-bottom: 5px;
}

.form input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
}

.form input:focus {
    border-color: #4a90e2;
}

.btn-salvar {
    background-color: #4a90e2;
    color: #fff;
    padding: 12px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 8px;
    font-weight: bold;
}

.btn-salvar:hover {
    background-color: #357ab8;
}

.fornecedores-lista {
    margin-top: 20px;
}

.fornecedor {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fornecedor-info {
    text-align: left;
}

.fornecedor-info p {
    font-size: 14px;
    color: #333;
    margin: 5px 0;
}

.fornecedor-info p strong {
    color: #4a90e2;
}

.fornecedor-actions {
    display: flex;
    gap: 10px;
}

.btn-editar, .btn-excluir {
    color: #fff;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 8px;
    border: none;
}

.btn-editar {
    background-color: #4caf50;
}

.btn-excluir {
    background-color: #f44336;
}

.header {
    display: flex;
    justify-content: space-between; /* Título à esquerda e botão à direita */
    align-items: center;
    margin-bottom: 20px;
}

.form-actions {
    display: flex;
    gap: 10px; /* Espaçamento entre os botões */
    justify-content: center; /* Alinhar os botões à esquerda */
}

.btn-voltar {
    background-color: #f44336; /* Cor de fundo do botão "Voltar" */
    color: #fff;
    padding: 8px 15px;
    font-size: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}

</style>
