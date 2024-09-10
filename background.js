chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "read") {  // Altere "readText" para "read"
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "read" });
        });
    }
});
