let cachedSettings = {};

// Função para atualizar os valores exibidos
function updateDisplayValues() {
    const rateSlider = document.getElementById('rate-slider');
    const volumeSlider = document.getElementById('volume-slider');
    if (rateSlider) {
        document.getElementById('rate-value').textContent = rateSlider.value;
    }
    if (volumeSlider) {
        document.getElementById('volume-value').textContent = volumeSlider.value;
    }
}

// Função para carregar configurações
function loadSettings() {
    chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice', 'theme'], (items) => {
        cachedSettings = items;
        const langSelect = document.getElementById('lang-select');
        const rateSlider = document.getElementById('rate-slider');
        const volumeSlider = document.getElementById('volume-slider');
        const voiceSelect = document.getElementById('voice-select');
        const themeSelect = document.getElementById('theme-select');

        if (langSelect) langSelect.value = items.lang || 'pt-BR';
        if (rateSlider) rateSlider.value = items.rate || 1;
        if (volumeSlider) volumeSlider.value = items.volume || 1;
        if (voiceSelect) voiceSelect.value = items.voice || '';
        if (themeSelect) themeSelect.value = items.theme || 'light';

        updateDisplayValues();
        applyTheme(items.theme || 'light'); // Aplicar o tema carregado

        // Carregar vozes dinamicamente
        loadVoicesAsync().then((voices) => {
            if (voiceSelect) {
                voiceSelect.innerHTML = ''; // Limpar qualquer valor anterior

                voices.forEach((voice) => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });

                // Selecionar a voz salva
                if (items.voice) voiceSelect.value = items.voice;
            }
        }).catch((error) => {
            console.error('Erro ao carregar vozes:', error);
        });
    });
}

// Função para exibir notificação suave
function showNotification(messageKey) {
    const message = chrome.i18n.getMessage(messageKey);
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Função para salvar configurações
function saveSettings() {
    const lang = document.getElementById('lang-select')?.value;
    const rate = document.getElementById('rate-slider')?.value;
    const volume = document.getElementById('volume-slider')?.value;
    const voice = document.getElementById('voice-select')?.value;
    const theme = document.getElementById('theme-select')?.value;

    cachedSettings = { lang, rate, volume, voice, theme };
    chrome.storage.sync.set(cachedSettings, () => {
        console.log('Configurações aplicadas e salvas:', cachedSettings);
        if (theme) {
            applyTheme(theme); // Aplicar o tema imediatamente
        }
        showNotification('settingsSaved'); // Usar chave de mensagem para buscar tradução
    });
}

// Função para resetar as configurações
function resetSettings() {
    chrome.storage.sync.clear(() => {
        console.log('Configurações resetadas');
        location.reload();
    });
}

// Função para aplicar o tema selecionado
function applyTheme(theme) {
    const body = document.body;
    const container = document.querySelector('.container');
    const buttons = document.querySelectorAll('button');

    // Remover classes antigas
    body.classList.remove('light', 'dark');
    if (container) {
        container.classList.remove('light', 'dark');
    }
    buttons.forEach(button => button.classList.remove('light', 'dark'));

    // Adicionar a classe do tema selecionado
    body.classList.add(theme);
    if (container) {
        container.classList.add(theme);
    }
    buttons.forEach(button => button.classList.add(theme));
}

// Função para aplicar as traduções
function applyTranslations(lang) {
    const elementsToTranslate = {
        'title': document.querySelector('#title'),
        'subtitle': document.querySelector('#subtitle'),
        'saveButton': document.querySelector('#saveButton'),
        'cancelButton': document.querySelector('#cancelButton')
    };

    for (const key in elementsToTranslate) {
        const element = elementsToTranslate[key];
        if (element) {
            element.textContent = chrome.i18n.getMessage(key);
        }
    }
}

// Carregar configurações e aplicar traduções no início
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    chrome.storage.sync.get(['lang'], (items) => {
        const currentLang = items.lang || 'pt'; // Padrão para 'pt-BR' se nenhum idioma estiver selecionado
        applyTranslations(currentLang);
    });

    const langSelect = document.getElementById('lang-select');
    const rateSlider = document.getElementById('rate-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const applyButton = document.getElementById('apply-button');
    const resetButton = document.getElementById('reset-button');

    if (langSelect) {
        langSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            chrome.storage.sync.set({ lang: selectedLang }, function() {
                console.log('Idioma salvo:', selectedLang);
                applyTranslations(selectedLang);
            });
        });
    }

    if (rateSlider) {
        rateSlider.addEventListener('input', updateDisplayValues);
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', updateDisplayValues);
    }

    if (applyButton) {
        applyButton.addEventListener('click', saveSettings);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetSettings);
    }
});

// Carregar vozes de forma assíncrona
async function loadVoicesAsync() {
    return new Promise((resolve, reject) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                resolve(voices);
            };
        }
    });
}
