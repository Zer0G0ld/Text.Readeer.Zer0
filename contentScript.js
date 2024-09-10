console.log("Content Script está rodando.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensagem recebida no content script:', message);
    if (message.action === "read") {
        let selectedText = window.getSelection().toString();
        console.log('Texto selecionado:', selectedText);
        if (selectedText) {
            chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice'], (items) => {
                console.log('Configurações recuperadas:', items);
                const utterance = new SpeechSynthesisUtterance(selectedText);
                utterance.lang = items.lang || 'pt-BR';
                utterance.rate = parseFloat(items.rate) || 1;
                utterance.volume = parseFloat(items.volume) || 1;

                if (items.voice) {
                    loadVoicesAsync().then((voices) => {
                        const selectedVoice = voices.find(voice => voice.name === items.voice);
                        if (selectedVoice) {
                            utterance.voice = selectedVoice;
                        } else {
                            console.warn('Voz selecionada não encontrada, usando voz padrão.');
                        }
                        speechSynthesis.speak(utterance);
                        console.log("Começando a falar com as configurações selecionadas.");
                        sendResponse({ status: "success" });
                    }).catch((error) => {
                        console.error('Erro ao carregar vozes:', error);
                        speechSynthesis.speak(utterance);
                        sendResponse({ status: "success" });
                    });
                } else {
                    speechSynthesis.speak(utterance);
                    sendResponse({ status: "success" });
                }
            });
        } else {
            console.log("Nenhum texto selecionado.");
            sendResponse({ status: "error", message: 'Nenhum texto selecionado' });
        }

        // Retorne `true` para indicar que a resposta será enviada assíncronamente
        return true;
    } else if (message.action === "stop") {
        speechSynthesis.cancel();
        console.log("Fala interrompida.");
        sendResponse({ status: 'stopped' });
        // Retorne `true` para indicar que a resposta será enviada assíncronamente
        return true;
    }
});

function loadVoicesAsync() {
    return new Promise((resolve, reject) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                    resolve(voices);
                } else {
                    reject('Nenhuma voz disponível.');
                }
            };
        }
    });
}
