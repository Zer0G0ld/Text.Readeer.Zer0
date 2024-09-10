// Leitura do texto
document.getElementById('read').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "read" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Erro ao enviar mensagem: ", chrome.runtime.lastError.message);
                } else {
                    console.log("Mensagem enviada com sucesso!");
                }
            });
        } else {
            console.error("Aba não válida ou inexistente.");
        }
    });
});

// Parar leitura do texto
document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stop" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Erro ao enviar mensagem: ", chrome.runtime.lastError.message);
                } else {
                    console.log("Mensagem de parada enviada com sucesso!");
                }
            });
        }
    });
});

// Abrir página de configurações
document.getElementById('config-button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
