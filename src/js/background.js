/* eslint-disable rulesdir/prefer-early-return */
/* eslint-disable no-undef */
const requestMap = new Map();

async function openBrowserTab(sender, url, payload) {
    const actionTab = await chrome.storage.session.get('actionTab').then(result => result.actionTab);
    const requestID = payload.requestID;
    if (actionTab) {
        const tabData = actionTab;
        const tabId = tabData.id || tabData.tabId;

        // check if tab is still open
        let tabStillOpen = false;
        if (typeof browser !== 'undefined' && browser.tabs) {
            // Firefox
            try {
                const tab = await browser.tabs.get(tabId);
                if (tab) {
                    tabStillOpen = true;
                }
            } catch (e) {
                tabStillOpen = false;
            }
        } else if (typeof chrome !== 'undefined' && chrome.tabs) {
            // Chrome
            try {
                const tab = await chrome.tabs.get(tabId);
                if (tab) {
                    tabStillOpen = true;
                }
            } catch (e) {
                tabStillOpen = false;
            }
        }

        if (tabStillOpen) {
            const senderID = sender.tab.id || sender.tab.tabId;

            requestMap.set(requestID, {
                payload,
                openedTabId: tabId,
                senderID,
            });
            return;
        }
    }

    let tab = null;
    if (typeof browser !== 'undefined' && browser.tabs) {
        // Firefox
        tab = await browser.tabs.create({url});
    } else if (typeof chrome !== 'undefined' && chrome.tabs) {
        // Chrome
        tab = await chrome.tabs.create({url});
    }
    if (tab) {
        const tabId = tab.id || tab.tabId;
        const senderID = sender.tab.id || sender.tab.tabId;
        requestMap.set(requestID, {
            payload,
            openedTabId: tabId,
            senderID,
        });
        await chrome.storage.session.set({actionTab: {id: tabId, hasContentLoaded: false}});
    }
}

function setup() {
    // Listen for contentscript to send a message with action directMoneyrequest
    const handler = (message, sender) => {
        chrome.storage.session.get('actionTab').then(async (result) => {
            const actionTab = result.actionTab;

            if (message.action === 'directMoneyRequest' && message.url) {
            // in directMoneyRequest, we will open a new browser tab with the provided URL and then wait for the contentscript to be injected.
            // then we will send a message to the contentscript called 'makeMoneyrequest' with payload data.

                await openBrowserTab(sender, message.url, message.payload);
                const hasContentLoaded = actionTab ? actionTab.hasContentLoaded : false;
                if (hasContentLoaded) {
                // send message to content script to make money request
                    const tabId = actionTab.id || actionTab.tabId;
                    chrome.tabs.sendMessage(
                        tabId,
                        {
                            action: 'makeMoneyRequest',
                            payload: message.payload,
                        },
                    );
                }
            }
            if (message.action === 'contentScriptLoaded' && actionTab) {
                const senderID = sender.tab.id || sender.tab.tabId;

                // pick last request from Map
                let requestData = null;
                // eslint-disable-next-line no-restricted-syntax, no-unused-vars
                for (const [_, value] of requestMap.entries()) {
                    if (value.openedTabId === senderID) {
                        requestData = value;
                    }
                }
                chrome.storage.session.set({actionTab: {...actionTab, hasContentLoaded: true}});

                // send message to content script to make money request
                chrome.tabs.sendMessage(
                    requestData.openedTabId,
                    {
                        action: 'makeMoneyRequest',
                        payload: requestData.payload,
                    },
                );
            }

            // requestCompleted
            if (message.action === 'moneyRequestSuccessful') {
                const requestID = message.payload.requestID;
                if (requestMap.has(requestID)) {
                    requestMap.delete(requestID);
                }
            }
            if (message.action === 'moneyRequestFailed') {
                const requestID = message.payload.requestID;
                const requestData = requestMap.get(requestID);
                if (requestData) {
                // send message back to sender tab that request failed
                    chrome.tabs.sendMessage(
                        requestData.senderID,
                        {
                            action: 'moneyRequestFailed',
                            error: message.error,
                            payload: requestData.payload,
                        },
                    );
                    requestMap.delete(requestID);
                }
            }
        });
    };
    if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
        // Firefox
        browser.runtime.onMessage.addListener(handler);
    } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        // Chrome
        chrome.runtime.onMessage.addListener(handler);
    }
}

setup();
