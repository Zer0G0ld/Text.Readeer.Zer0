// Função para enviar mensagem para a aba ativa com tratamento centralizado de erros
const sendMessageToTab = (tabId, message) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
            logError(`Erro ao enviar mensagem para a aba ${tabId}: ${chrome.runtime.lastError}`);
        } else {
            console.log(`Resposta recebida da aba ${tabId}:`, response);
        }
    });
};

// Função para logar erros de forma centralizada
const logError = (message) => {
    console.error(message);
};

// Ouvinte para mensagens recebidas
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensagem recebida no background:', JSON.stringify(message));

    if (message.action === "read") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.id) {
                console.log('Aba ativa encontrada:', activeTab.id);
                sendMessageToTab(activeTab.id, { action: "read" });
            } else {
                logError("Aba ativa não encontrada.");
            }
        });
    } else {
        logError(`Ação desconhecida recebida: ${message.action}`);
    }
});

// Ouvinte para cliques no menu de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "readText" && tab?.id) {
        console.log('Menu de contexto clicado:', info, tab);
        sendMessageToTab(tab.id, { action: "read" });
    } else {
        logError("Erro: Tab ou item de contexto inválido.");
    }
});

// Ouvinte para instalação da extensão
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensão instalada.');

    // Criar o item de menu de contexto
    chrome.contextMenus.create({
        id: "readText",
        title: "Ler Texto Selecionado",
        contexts: ["selection"]
    }, () => {
        if (chrome.runtime.lastError) {
            logError("Erro ao criar menu de contexto:", chrome.runtime.lastError);
        } else {
            console.log("Menu de contexto criado com sucesso.");
        }
    });
});
