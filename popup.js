document.addEventListener('DOMContentLoaded', () => {
    // Carregar configurações salvas
    chrome.storage.sync.get(['speechRate', 'volume'], (items) => {
        const speechRate = items.speechRate || 1;
        const volume = items.volume || 1;

        // Aplicar configurações no popup
        document.getElementById('read').dataset.speechRate = speechRate;
        document.getElementById('read').dataset.volume = volume;
        
        // Exemplo de como aplicar essas configurações ao seu código de leitura
        // const reader = new SpeechSynthesisUtterance();
        // reader.rate = speechRate;
        // reader.volume = volume;
    });
});

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
        } else {
            console.error("Aba não válida, carregando ou inexistente.");
        }
    });
});

document.getElementById('config-button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
