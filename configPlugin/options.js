// Carregar configurações ao abrir a página de opções
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['lang', 'rate', 'volume', 'voice', 'theme'], (items) => {
        if (items.lang) document.getElementById('lang-select').value = items.lang;
        if (items.rate) document.getElementById('rate-slider').value = items.rate;
        if (items.volume) document.getElementById('volume-slider').value = items.volume;
        if (items.voice) document.getElementById('voice-select').value = items.voice;
        if (items.theme) document.getElementById('theme-select').value = items.theme;
    });
});

// Salvar configurações quando o usuário fizer uma alteração
document.getElementById('lang-select').addEventListener('change', (e) => {
    chrome.storage.sync.set({ lang: e.target.value });
});

document.getElementById('rate-slider').addEventListener('input', (e) => {
    document.getElementById('rate-value').textContent = e.target.value;
    chrome.storage.sync.set({ rate: e.target.value });
});

document.getElementById('volume-slider').addEventListener('input', (e) => {
    document.getElementById('volume-value').textContent = e.target.value;
    chrome.storage.sync.set({ volume: e.target.value });
});

document.getElementById('voice-select').addEventListener('change', (e) => {
    chrome.storage.sync.set({ voice: e.target.value });
});

document.getElementById('theme-select').addEventListener('change', (e) => {
    chrome.storage.sync.set({ theme: e.target.value });
});

document.getElementById('reset-button').addEventListener('click', () => {
    chrome.storage.sync.clear();
    location.reload();
});
