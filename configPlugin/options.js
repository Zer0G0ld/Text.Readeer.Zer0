let cachedSettings = {};

// Função para atualizar os valores exibidos
function updateDisplayValues() {
    document.getElementById('rate-value').textContent = document.getElementById('rate-slider').value;
    document.getElementById('volume-value').textContent = document.getElementById('volume-slider').value;
}

// Função para carregar configurações
function loadSettings() {
    chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice', 'theme'], (items) => {
        cachedSettings = items;
        document.getElementById('lang-select').value = items.lang || 'pt-BR';
        document.getElementById('rate-slider').value = items.rate || 1;
        document.getElementById('volume-slider').value = items.volume || 1;
        document.getElementById('voice-select').value = items.voice || '';
        document.getElementById('theme-select').value = items.theme || 'light';

        updateDisplayValues();
        applyTheme(items.theme || 'light'); // Aplicar o tema carregado

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
            if (items.voice) voiceSelect.value = items.voice;
        }).catch((error) => {
            console.error('Erro ao carregar vozes:', error);
        });
    });
}

// Função para aplicar o tema selecionado
function applyTheme(theme) {
    const body = document.body;
    const container = document.querySelector('.container');
    const buttons = document.querySelectorAll('button');

    // Remover classes antigas
    body.classList.remove('light', 'dark');
    container.classList.remove('light', 'dark');
    buttons.forEach(button => button.classList.remove('light', 'dark'));

    // Adicionar a classe do tema selecionado
    body.classList.add(theme);
    container.classList.add(theme);
    buttons.forEach(button => button.classList.add(theme));
}

// Salvar configurações quando houver alterações
function saveSettings() {
    const lang = document.getElementById('lang-select').value;
    const rate = document.getElementById('rate-slider').value;
    const volume = document.getElementById('volume-slider').value;
    const voice = document.getElementById('voice-select').value;
    const theme = document.getElementById('theme-select').value;

    cachedSettings = { lang, rate, volume, voice, theme };
    chrome.storage.sync.set(cachedSettings, () => {
        console.log('Configurações aplicadas e salvas:', cachedSettings);
        if (theme) {
            applyTheme(theme); // Aplicar o tema imediatamente
        }
        alert('Configurações aplicadas com sucesso!');
    });
}

// Função para resetar as configurações
function resetSettings() {
    chrome.storage.sync.clear(() => {
        console.log('Configurações resetadas');
        location.reload();
    });
}

// Carregar configurações no início
document.addEventListener('DOMContentLoaded', loadSettings);

// Adicionar eventos de mudança e clique
document.querySelectorAll('input, select').forEach((element) => {
    element.addEventListener('change', (e) => {
        const key = e.target.id.split('-')[0];
        const value = e.target.value;
        cachedSettings[key] = value;
        chrome.storage.sync.set(cachedSettings, () => {
            console.log('Configurações salvas:', cachedSettings);
            if (key === 'theme') {
                applyTheme(value); // Aplicar o tema imediatamente
            }
        });
    });
});

document.getElementById('rate-slider').addEventListener('input', updateDisplayValues);
document.getElementById('volume-slider').addEventListener('input', updateDisplayValues);
document.getElementById('apply-button').addEventListener('click', saveSettings);
document.getElementById('reset-button').addEventListener('click', resetSettings);

// Carregar vozes de forma assíncrona
function loadVoicesAsync() {
    return new Promise((resolve, reject) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length !== 0) {
            resolve(voices);
        } else {
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
