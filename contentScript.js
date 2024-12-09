console.log("Content Script está rodando.");

// Listener para mensagens vindas do background ou popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('Mensagem recebida no content script:', message);

    if (message.action === "read") {
        await handleReadAction(sendResponse);
    } else if (message.action === "stop") {
        handleStopAction(sendResponse);
    } else {
        console.warn('Ação desconhecida:', message.action);
        sendResponseWithStatus(sendResponse, "error", "Ação desconhecida.");
    }

    return true; // Indica que a resposta será assíncrona
});

// Função para lidar com o comando "read"
async function handleReadAction(sendResponse) {
    const selectedText = window.getSelection().toString().trim();
    console.log("Seleção detectada:", selectedText); // Log para depuração

    // Verifica se o texto selecionado é válido
    if (!selectedText) {
        console.warn("Nenhum texto selecionado para leitura.");
        return sendResponseWithStatus(sendResponse, "error", "Nenhum texto selecionado.");
    }

    console.log("Texto selecionado:", selectedText);

    try {
        // Recupera as configurações do armazenamento
        const config = await getStorageData(["lang", "rate", "volume", "voice"]);
        console.log("Configurações de leitura:", config); // Log das configurações para depuração

        // Cria o objeto de fala
        const utterance = await createSpeechUtterance(selectedText, config);

        // Inicia a leitura
        speechSynthesis.speak(utterance);
        console.log("Leitura iniciada.");
        sendResponseWithStatus(sendResponse, "success");
    } catch (error) {
        console.error("Erro ao iniciar leitura:", error);
        sendResponseWithStatus(sendResponse, "error", "Falha ao iniciar leitura.");
    }
}

// Função centralizada para enviar a resposta com status
function sendResponseWithStatus(sendResponse, status, message = "") {
    sendResponse({ status, message });
}

// Função para lidar com o comando "stop"
function handleStopAction(sendResponse) {
    speechSynthesis.cancel();
    console.log("Leitura interrompida.");
    sendResponseWithStatus(sendResponse, "stopped");
}

// Cria um objeto de fala configurado
async function createSpeechUtterance(text, config) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.lang || "pt-BR";
    utterance.rate = parseFloat(config.rate) || 1;
    utterance.volume = parseFloat(config.volume) || 1;

    // Garantir que as vozes estejam carregadas antes de selecionar uma
    const voices = await getAvailableVoices();
    const selectedVoice = voices.find(voice => voice.name === config.voice);
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn("Voz selecionada não encontrada. Usando voz padrão.");
    }

    return utterance;
}

// Função para aguardar as vozes estarem carregadas
function getAvailableVoices() {
    return new Promise((resolve) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = function () {
                voices = speechSynthesis.getVoices();
                resolve(voices);
            };
        }
    });
}

// Recupera dados do armazenamento
function getStorageData(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Erro ao acessar o armazenamento:", chrome.runtime.lastError.message);
                reject(new Error("Erro ao acessar o armazenamento: " + chrome.runtime.lastError.message));
            } else {
                resolve(result);
            }
        });
    });
}
