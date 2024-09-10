console.log("Content Script está rodando.");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "read") {
        let selectedText = window.getSelection().toString();
        if (selectedText) {
            chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice'], (items) => {
                const utterance = new SpeechSynthesisUtterance(selectedText);
                utterance.lang = items.lang || 'pt-BR'; // Usar o idioma salvo nas configurações
                utterance.rate = parseFloat(items.rate) || 1; // Usar a velocidade salva
                utterance.volume = parseFloat(items.volume) || 1; // Usar o volume salvo
                
                if (items.voice) {
                    const voices = speechSynthesis.getVoices();
                    const selectedVoice = voices.find(voice => voice.name === items.voice);
                    if (selectedVoice) {
                        utterance.voice = selectedVoice; // Usar a voz selecionada nas configurações
                    }
                }

                speechSynthesis.speak(utterance);
                console.log("Começando a falar com as configurações selecionadas.");
            });
        } else {
            console.log("Nenhum texto selecionado.");
        }
    } else if (message.action === "stop") {
        speechSynthesis.cancel();
        console.log("Fala interrompida.");
    }
});

function loadVoicesAsync() {
    return new Promise((resolve, reject) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length !== 0) {
            resolve(voices);
        } else {
            // O evento de "voiceschanged" garante que as vozes sejam carregadas mesmo que estejam atrasadas
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                if (voices.length !== 0) {
                    resolve(voices);
                } else {
                    reject('Nenhuma voz disponível.');
                }
            };
        }
    });
}
