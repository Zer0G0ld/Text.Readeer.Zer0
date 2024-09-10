console.log("Content Script está rodando.");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "read") {
        let selectedText = window.getSelection().toString();
        if (selectedText) {
            const utterance = new SpeechSynthesisUtterance(selectedText);
            utterance.lang = 'pt-BR';
            speechSynthesis.speak(utterance);
            console.log("Começando a falar.");
        } else {
            console.log("Nenhum texto selecionado.");
        }
    } else if (message.action === "stop") {
        speechSynthesis.cancel();
        console.log("Fala interrompida.");
    }
});
