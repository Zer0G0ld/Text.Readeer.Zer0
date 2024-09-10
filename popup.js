document.getElementById('read').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('Aba ativa encontrada no popup:', tabs);
        if (tabs.length > 0 && tabs[0].status === 'complete' && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "read" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(`Erro ao enviar mensagem: ${chrome.runtime.lastError}`);
                } else {
                    console.log('Resposta recebida:', response);
                }
            });
        } else {
            console.error("Aba não válida, carregando ou inexistente.");
        }
    });
});

document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('Aba ativa encontrada no popup para parar:', tabs);
        if (tabs.length > 0 && tabs[0].status === 'complete' && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stop" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(`Erro ao enviar mensagem: ${chrome.runtime.lastError}`);
                } else {
                    console.log('Resposta recebida:', response);
                }
            });
        }
    });
});

document.getElementById('config-button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
