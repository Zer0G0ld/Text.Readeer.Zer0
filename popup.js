// Verificar se a aba está carregada antes de enviar mensagem
document.getElementById('read').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].status === 'complete' && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "read" });
        } else {
            console.error("Aba não válida, carregando ou inexistente.");
        }
    });
});

document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].status === 'complete' && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stop" });
        }
    });
});

// Abrir página de configurações
document.getElementById('config-button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});