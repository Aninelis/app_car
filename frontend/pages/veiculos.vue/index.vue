<template>
    <div class="container">
        <div class="header">
            <h1>Veículos</h1>
            <button v-if="!mostrarFormulario" @click="abrirFormulario" class="btn-adicionar">
                Adicionar
            </button>
        </div>

        <!-- Exibir mensagem de sucesso ou erro -->
        <div v-if="mensagem" class="mensagem" :class="{ sucesso: mensagemTipo === 'sucesso', erro: mensagemTipo === 'erro' }">
            {{ mensagem }}
        </div>

        <!-- Formulário para adicionar ou editar veículo -->
        <form v-if="mostrarFormulario" @submit.prevent="salvarVeiculo" class="form">
            <label>Marca</label>
            <input type="text" v-model="novoVeiculo.marca" required placeholder="Digite a marca do veículo" />

            <label>Modelo</label>
            <input type="text" v-model="novoVeiculo.modelo" required placeholder="Digite o modelo" />

            <label>Ano</label>
            <input type="number" v-model="novoVeiculo.ano" required placeholder="Digite o ano" />

            <label>Fornecedor</label>
<select v-model="novoVeiculo.fornecedor_id" required class="select-fornecedor">
    <option value="" disabled selected hidden>Selecione o fornecedor</option>
    <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
        {{ fornecedor.nome }}
    </option>
</select>

            <label>Quantidade</label>
            <input type="number" v-model="novoVeiculo.quantidade" required min="0" placeholder="Digite a quantidade" />

            <div class="form-actions">
                <button type="submit" class="btn-salvar">Salvar</button>
                <button type="button" @click="mostrarFormulario = false" class="btn-voltar">Voltar</button>
            </div>
        </form>

        <!-- Lista de veículos cadastrados -->
        <div v-if="!mostrarFormulario && veiculos.length > 0" class="veiculos-lista">
            <div v-for="veiculo in veiculos" :key="veiculo.id" class="veiculo">
                <div class="veiculo-info">
                    <p><strong>Marca:</strong> {{ veiculo.marca }}</p>
                    <p><strong>Modelo:</strong> {{ veiculo.modelo }}</p>
                    <p><strong>Ano:</strong> {{ veiculo.ano }}</p>
                    <p><strong>Fornecedor:</strong> {{ veiculo.fornecedor_nome }}</p>
                    <p><strong>Quantidade em Estoque:</strong> {{ veiculo.quantidade }}</p>
                </div>
                <div class="veiculo-actions">
                    <button @click="aumentarQuantidade(veiculo)" class="btn-quantidade">+</button>
                    <button @click="diminuirQuantidade(veiculo)" class="btn-quantidade" :disabled="veiculo.quantidade <= 0">-</button>
                    <button @click="editarVeiculo(veiculo)" class="btn-editar">Editar</button>
                    <button @click="excluirVeiculo(veiculo.id)" class="btn-excluir">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const veiculos = ref([]);
const fornecedores = ref([]);
const mostrarFormulario = ref(false);
const novoVeiculo = ref({ marca: '', modelo: '', ano: '', fornecedor_id: '', quantidade: 1 });
const editandoVeiculo = ref(null);
const mensagem = ref('');
const mensagemTipo = ref('');

// Função para carregar fornecedores e veículos
const carregarFornecedores = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/fornecedores');
        if (!response.ok) throw new Error('Erro ao carregar fornecedores');
        fornecedores.value = await response.json();
    } catch (error) {
        exibirMensagem("Erro ao carregar fornecedores: " + error.message, "erro");
    }
};

const carregarVeiculos = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/carros');
        if (!response.ok) throw new Error('Erro ao carregar veículos');
        const veiculosData = await response.json();

        // Adiciona o nome do fornecedor a cada veículo
        veiculos.value = veiculosData.map(veiculo => {
            const fornecedor = fornecedores.value.find(f => f.id === veiculo.fornecedor_id);
            return {
                ...veiculo,
                fornecedor_nome: fornecedor ? fornecedor.nome : 'Fornecedor não encontrado',
            };
        });
    } catch (error) {
        exibirMensagem("Erro ao carregar veículos: " + error.message, "erro");
    }
};


// Função para abrir o formulário e resetar os campos
const abrirFormulario = () => {
    mostrarFormulario.value = true;
    novoVeiculo.value = { marca: '', modelo: '', ano: '', fornecedor_id: '', quantidade: 1 };
    editandoVeiculo.value = null;
};

// Função para exibir mensagens
const exibirMensagem = (texto, tipo) => {
    mensagem.value = texto;
    mensagemTipo.value = tipo;
    setTimeout(() => {
        mensagem.value = '';
    }, 3000);
};

// Função para salvar o veículo
const salvarVeiculo = async () => {
    try {
        const url = editandoVeiculo.value 
            ? `http://localhost:4000/api/carros/${editandoVeiculo.value.id}`
            : 'http://localhost:4000/api/carros';

        const method = editandoVeiculo.value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoVeiculo.value),
        });

        if (!response.ok) throw new Error(`Erro ao ${editandoVeiculo.value ? 'atualizar' : 'adicionar'} veículo`);

        await carregarVeiculos();
        exibirMensagem(editandoVeiculo.value ? "Veículo atualizado com sucesso!" : "Veículo adicionado com sucesso!", "sucesso");
        mostrarFormulario.value = false;
        novoVeiculo.value = { marca: '', modelo: '', ano: '', fornecedor_id: '', quantidade: 1 };
    } catch (error) {
        exibirMensagem("Erro ao salvar veículo: " + error.message, "erro");
    }
};

// Função para editar o veículo
const editarVeiculo = (veiculo) => {
    novoVeiculo.value = { ...veiculo };
    mostrarFormulario.value = true;
    editandoVeiculo.value = veiculo;
};

// Função para excluir o veículo
const excluirVeiculo = async (id) => {
    try {
        const response = await fetch(`http://localhost:4000/api/carros/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir veículo');
        await carregarVeiculos();
        exibirMensagem("Veículo excluído com sucesso!", "sucesso");
    } catch (error) {
        exibirMensagem("Erro ao excluir veículo: " + error.message, "erro");
    }
};

// Funções para ajustar a quantidade
const aumentarQuantidade = async (veiculo) => {
    veiculo.quantidade += 1;
    await salvarVeiculoAtualizado(veiculo);
};

const diminuirQuantidade = async (veiculo) => {
    if (veiculo.quantidade > 0) {
        veiculo.quantidade -= 1;
        await salvarVeiculoAtualizado(veiculo);
    }
};

// Função auxiliar para salvar alterações de quantidade
const salvarVeiculoAtualizado = async (veiculo) => {
    try {
        const response = await fetch(`http://localhost:4000/api/carros/${veiculo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veiculo),
        });
        if (!response.ok) throw new Error('Erro ao atualizar quantidade');
        await carregarVeiculos();
        exibirMensagem("Quantidade atualizada com sucesso!", "sucesso");
    } catch (error) {
        exibirMensagem("Erro ao atualizar quantidade: " + error.message, "erro");
    }
};

onMounted(() => {
    carregarFornecedores();
    carregarVeiculos();
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

/* Cabeçalho com título e botão alinhados */
.header {
    display: flex;
    justify-content: space-between; /* Alinha título à esquerda e botão à direita */
    align-items: center;
    margin-bottom: 20px;
}

/* Título */
h1 {
    margin: 0;
    font-size: 22px;
    font-weight: bold;
    color: #333;
    border-left: 4px solid #ff5a5a;
    padding-left: 8px;
}

/* Botão Adicionar Veículo */
.btn-adicionar {
    background-color: #4a90e2;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 8px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.btn-adicionar:hover {
    background-color: #357ab8;
}

/* Mensagens de sucesso e erro */
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

/* Formulário */
.form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Campos do formulário */
.form label {
    font-weight: normal;
    color: #333;
    font-size: 14px;
    margin-bottom: 5px;
}

.form input, .form select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
}

.form input:focus, .form select:focus {
    border-color: #4a90e2;
}

/* Botões no formulário */
.form-actions {
    display: flex;
    justify-content: center; /* Centraliza os botões */
    gap: 10px; /* Espaçamento entre os botões */
}

.btn-salvar {
    background-color: #4a90e2;
    color: #fff;
    padding: 12px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 8px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.btn-salvar:hover {
    background-color: #357ab8;
}

.btn-voltar {
    background-color: #f44336;
    color: #fff;
    padding: 12px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 8px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.btn-voltar:hover {
    background-color: #d32f2f;
}

/* Lista de veículos */
.veiculos-lista {
    margin-top: 20px;
}

/* Itens da lista de veículos */
.veiculo {
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

/* Informações do veículo */
.veiculo-info {
    text-align: left;
}

.veiculo-info p {
    font-size: 14px;
    color: #333;
    margin: 5px 0;
}

.veiculo-info p strong {
    color: #4a90e2;
}

/* Ações do veículo */
.veiculo-actions {
    display: flex;
    gap: 10px;
}

/* Botões de ações (quantidade, editar, excluir) */
.btn-quantidade {
    background-color: #ffc107;
    color: #fff;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.btn-quantidade:hover {
    background-color: #ffb300;
}

.btn-editar {
    background-color: #4caf50;
    color: #fff;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    transition: background-color 0.3s ease;
}

.btn-editar:hover {
    background-color: #388e3c;
}

.btn-excluir {
    background-color: #f44336;
    color: #fff;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    transition: background-color 0.3s ease;
}

.btn-excluir:hover {
    background-color: #d32f2f;
}

/* Campo de seleção (select) */
.select-fornecedor {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
    color: #333; /* Cor do texto */
}

.select-fornecedor:focus {
    border-color: #4a90e2;
    background-color: #fff;
}

.select-fornecedor option[disabled][hidden] {
    color: #999; /* Cor do texto do placeholder */
}


</style>
