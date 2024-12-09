let cachedSettings = {};

// Função para atualizar os valores exibidos dos sliders
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

// Função para carregar configurações do armazenamento
async function loadSettings() {
    try {
        const items = await getSettingsFromStorage();
        cachedSettings = items;
        const { lang, rate, volume, voice, theme } = items;

        setElementValue('lang-select', lang || 'pt-BR');
        setElementValue('rate-slider', rate || 1);
        setElementValue('volume-slider', volume || 1);
        setElementValue('voice-select', voice || '');
        setElementValue('theme-select', theme || 'light');

        updateDisplayValues();
        applyTheme(theme || 'light');
        
        await loadVoices();
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Função para obter configurações do armazenamento
function getSettingsFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice', 'theme'], (items) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(items);
            }
        });
    });
}

// Função para definir o valor de um elemento
function setElementValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
}

// Função para carregar as vozes de forma assíncrona
async function loadVoices() {
    try {
        const voices = await loadVoicesAsync();
        const voiceSelect = document.getElementById('voice-select');
        if (voiceSelect) {
            voiceSelect.innerHTML = ''; // Limpar opções anteriores
            voices.forEach((voice) => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
            });

            // Selecionar a voz salva
            if (cachedSettings.voice) {
                voiceSelect.value = cachedSettings.voice;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar vozes:', error);
    }
}

// Função para exibir notificação suave
function showNotification(messageKey) {
    const message = chrome.i18n.getMessage(messageKey);
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Função para salvar as configurações no armazenamento
async function saveSettings() {
    const settings = {
        lang: document.getElementById('lang-select')?.value,
        rate: document.getElementById('rate-slider')?.value,
        volume: document.getElementById('volume-slider')?.value,
        voice: document.getElementById('voice-select')?.value,
        theme: document.getElementById('theme-select')?.value
    };

    try {
        await chrome.storage.sync.set(settings);
        cachedSettings = settings; // Atualizar o cache
        console.log('Configurações aplicadas e salvas:', settings);
        if (settings.theme) applyTheme(settings.theme); // Aplicar tema imediatamente
        showNotification('settingsSaved');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
    }
}

// Função para resetar as configurações
async function resetSettings() {
    try {
        await chrome.storage.sync.clear();
        console.log('Configurações resetadas');
        location.reload();
    } catch (error) {
        console.error('Erro ao resetar configurações:', error);
    }
}

// Função para aplicar o tema selecionado
function applyTheme(theme) {
    const body = document.body;
    const container = document.querySelector('.container');
    const buttons = document.querySelectorAll('button');

    // Remover classes antigas
    body.classList.remove('light', 'dark');
    container?.classList.remove('light', 'dark');
    buttons.forEach(button => button.classList.remove('light', 'dark'));

    // Adicionar a classe do tema selecionado
    body.classList.add(theme);
    container?.classList.add(theme);
    buttons.forEach(button => button.classList.add(theme));
}

// Função para aplicar traduções
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

// Função para carregar as vozes de forma assíncrona
function loadVoicesAsync() {
    return new Promise((resolve, reject) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                const voices = speechSynthesis.getVoices();
                resolve(voices);
            };
        }
    });
}

// Carregar configurações e aplicar traduções no início
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    chrome.storage.sync.get(['lang'], (items) => {
        const currentLang = items.lang || 'pt';
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
