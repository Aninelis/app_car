<template>
    <div class="container">
        <h1>Consulta de Veículos</h1>

        <div class="consulta-container">
            <!-- Formulário de filtros de consulta -->
            <form @submit.prevent="filtrarVeiculos" class="form">
                <h2>Busca</h2>
                <div class="form-group">
                    <label for="marca">Marca</label>
                    <input id="marca" type="text" v-model="filtros.marca" placeholder="Digite a marca" />
                </div>

                <div class="form-group">
                    <label for="ano">Ano</label>
                    <input id="ano" type="number" v-model="filtros.ano" placeholder="Digite o ano" />
                </div>

                <div class="form-group">
                    <label for="fornecedor">Fornecedor</label>
                    <select v-model="filtros.fornecedor_id">
                        <option value="">Selecione o fornecedor</option>
                        <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
                            {{ fornecedor.nome }}
                        </option>
                    </select>
                </div>

                <button type="submit" class="auth-button">Consultar</button>
                <button type="button" @click="limparFiltros" class="auth-button secondary">Limpar Seleção</button>
            </form>

            <!-- Lista de veículos filtrados -->
            <div class="resultados" v-if="consultaRealizada && veiculosFiltrados.length > 0">
                <h2>Resultados</h2>
                <div v-for="veiculo in veiculosFiltrados" :key="veiculo.id" class="veiculo">
                    <div class="veiculo-info">
                        <p><strong>Marca:</strong> {{ veiculo.marca }}</p>
                        <p><strong>Modelo:</strong> {{ veiculo.modelo }}</p>
                        <p><strong>Ano:</strong> {{ veiculo.ano }}</p>
                        <p><strong>Fornecedor:</strong> {{ veiculo.fornecedor_nome }}</p>
                        <p><strong>Quantidade em Estoque:</strong> {{ veiculo.quantidade }}</p>
                    </div>
                </div>
            </div>

            <div v-else-if="consultaRealizada && veiculosFiltrados.length === 0" class="sem-resultados">
                <p>Nenhum veículo encontrado com os critérios selecionados.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const veiculos = ref([]);
const fornecedores = ref([]);
const filtros = ref({ marca: '', ano: '', fornecedor_id: '' });
const consultaRealizada = ref(false);

const veiculosFiltrados = computed(() => {
    return veiculos.value.filter(veiculo => {
        return (
            (!filtros.value.marca || veiculo.marca.toLowerCase().includes(filtros.value.marca.toLowerCase())) &&
            (!filtros.value.ano || veiculo.ano === parseInt(filtros.value.ano)) &&
            (!filtros.value.fornecedor_id || veiculo.fornecedor_id === parseInt(filtros.value.fornecedor_id))
        );
    });
});

const carregarFornecedores = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/fornecedores');
        if (!response.ok) throw new Error('Erro ao carregar fornecedores');
        fornecedores.value = await response.json();
    } catch (error) {
        console.error("Erro ao carregar fornecedores: " + error.message);
    }
};

const carregarVeiculos = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/carros');
        if (!response.ok) throw new Error('Erro ao carregar veículos');
        const veiculosData = await response.json();

        // Consolida veículos duplicados somando as quantidades
        const veiculosConsolidados = [];
        veiculosData.forEach(veiculo => {
            const existente = veiculosConsolidados.find(v =>
                v.marca === veiculo.marca &&
                v.modelo === veiculo.modelo &&
                v.ano === veiculo.ano &&
                v.fornecedor_id === veiculo.fornecedor_id
            );

            if (existente) {
                existente.quantidade += veiculo.quantidade;
            } else {
                veiculosConsolidados.push({ ...veiculo });
            }
        });

        // Adiciona o nome do fornecedor aos veículos
        veiculos.value = veiculosConsolidados.map(veiculo => {
            const fornecedor = fornecedores.value.find(f => f.id === veiculo.fornecedor_id);
            return {
                ...veiculo,
                fornecedor_nome: fornecedor ? fornecedor.nome : 'Fornecedor não encontrado',
            };
        });
    } catch (error) {
        console.error("Erro ao carregar veículos: " + error.message);
    }
};

const filtrarVeiculos = () => {
    consultaRealizada.value = true;
};

const limparFiltros = () => {
    filtros.value = { marca: '', ano: '', fornecedor_id: '' };
    consultaRealizada.value = false;
};

onMounted(async () => {
    await carregarFornecedores();
    await carregarVeiculos();
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
}

.consulta-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
}

/* Formulário */
.form {
    width: 300px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: left;
}

.form h2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-left: 4px solid #ff5a5a;
    padding-left: 8px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    color: #333;
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
}

.form-group input, 
.form-group select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #ffffff;
    outline: none;
}

/* Botões */
.auth-button {
    background-color: #4a90e2;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    width: 100%;
    text-align: center;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.auth-button:hover {
    background-color: #357ab8;
}

.auth-button.secondary {
    background-color: #ff9800;
}

.auth-button.secondary:hover {
    background-color: #e68900;
}

/* Resultados */
.resultados {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.resultados h2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-left: 4px solid #ff5a5a;
    padding-left: 8px;
}

.veiculo {
    width: 100%;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
    background-color: #f9f9f9;
}

.veiculo-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    text-align: left;
}

.veiculo-info p {
    font-size: 14px;
    color: #333;
    margin: 5px 0;
}

.veiculo-info p strong {
    font-weight: bold;
    color: #4a90e2;
}

/* Mensagem de Nenhum Resultado */
.sem-resultados {
    margin-top: 20px;
    font-size: 16px;
    color: #777;
    text-align: center;
}
</style>
