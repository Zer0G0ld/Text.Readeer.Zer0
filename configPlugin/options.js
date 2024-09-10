let cachedSettings = {};

// Carregar configurações no início e armazenar em cache
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice', 'theme'], (items) => {
        cachedSettings = items;
        document.getElementById('lang-select').value = items.lang || 'pt-BR';
        document.getElementById('rate-slider').value = items.rate || 1;
        document.getElementById('volume-slider').value = items.volume || 1;
        document.getElementById('voice-select').value = items.voice || '';
        document.getElementById('theme-select').value = items.theme || 'light';

        document.getElementById('rate-value').textContent = items.rate || 1;
        document.getElementById('volume-value').textContent = items.volume || 1;
    });

    // Carregar vozes dinamicamente
    loadVoicesAsync().then((voices) => {
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect.innerHTML = ''; // Limpar qualquer valor anterior

        voices.forEach((voice) => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });

        // Selecionar a voz salva
        chrome.storage.sync.get(['voice'], (items) => {
            if (items.voice) voiceSelect.value = items.voice;
        });
    }).catch((error) => {
        console.error('Erro ao carregar vozes:', error);
    });
});

// Salvar configurações quando houver alterações
document.querySelectorAll('input, select').forEach((element) => {
    element.addEventListener('change', (e) => {
        cachedSettings[e.target.id.split('-')[0]] = e.target.value;
        chrome.storage.sync.set(cachedSettings);
    });
});

// Carregar vozes de forma assíncrona
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

// Resetar as configurações para os padrões
document.getElementById('reset-button').addEventListener('click', () => {
    chrome.storage.sync.clear(() => {
        location.reload();
    });
});
