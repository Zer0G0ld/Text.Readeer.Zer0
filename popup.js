document.addEventListener('DOMContentLoaded', () => {
    // Inicializar configurações ao carregar o popup
    loadSettings();

    // Configurar eventos dos botões
    setupButtonListeners();
});

// Função para carregar configurações salvas
function loadSettings() {
    chrome.storage.sync.get(['speechRate', 'volume'], (items) => {
        const speechRate = items.speechRate || 1; // Taxa de fala padrão
        const volume = items.volume || 1;       // Volume padrão

        // Atualizar dataset do botão "read"
        const readButton = document.getElementById('read');
        readButton.dataset.speechRate = speechRate;
        readButton.dataset.volume = volume;

        console.log(`Configurações carregadas: Taxa - ${speechRate}, Volume - ${volume}`);
    });
}

// Configurar listeners para os botões do popup
function setupButtonListeners() {
    document.getElementById('read').addEventListener('click', () => {
        sendMessageToActiveTab({ action: "read" }, "Leitura iniciada.");
    });

    document.getElementById('stop').addEventListener('click', () => {
        sendMessageToActiveTab({ action: "stop" }, "Leitura interrompida.");
    });

    document.getElementById('config-button').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
}

// Função genérica para enviar mensagens para a aba ativa
function sendMessageToActiveTab(message, successMessage) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(`Erro ao enviar mensagem: ${chrome.runtime.lastError.message}`);
                } else if (response) {
                    console.log(`Resposta recebida:`, response);
                } else {
                    console.warn("Nenhuma resposta recebida do content script.");
                }
            });
            console.log(successMessage);
        } else {
            console.error("Nenhuma aba ativa válida encontrada.");
        }
    });
}
