chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensagem recebida no background:', message);
    if (message.action === "read") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('Aba ativa encontrada:', tabs);
            if (tabs.length > 0 && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "read" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Erro ao enviar mensagem: ${chrome.runtime.lastError}`);
                    } else {
                        console.log('Resposta recebida:', response);
                    }
                });
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensão instalada.');
    chrome.contextMenus.create({
        id: "readText",
        title: "Ler Texto Selecionado",
        contexts: ["selection"] // O menu aparece apenas quando o texto está selecionado
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log('Menu de contexto clicado:', info, tab);
    if (info.menuItemId === "readText") {
        chrome.tabs.sendMessage(tab.id, { action: "read" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(`Erro ao enviar mensagem: ${chrome.runtime.lastError}`);
            } else {
                console.log('Resposta recebida:', response);
            }
        });
    }
});
