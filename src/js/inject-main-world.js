/* eslint-disable rulesdir/prefer-early-return */
/* eslint-disable no-undef */

/* eslint-disable max-len */
/* eslint-disable es/no-optional-chaining */

async function getOnyxData() {
    return new Promise((resolve) => {
        let authToken = null;
        let authTokenType = null;
        let currentUserEmail = null;
        window.Onyx.connectWithoutView({
            key: 'session',
            callback: (val) => {
                authToken = val?.authToken ?? null;
                authTokenType = val?.authTokenType ?? null;
                currentUserEmail = val?.email ?? null;
                resolve({authToken, authTokenType, currentUserEmail});
            },
        });
    });
}
async function getLastClientUpdateID() {
    // For all requests, we'll send the lastUpdateID that is applied to this client. This will
    // allow us to calculate previousUpdateID faster.
    let lastUpdateIDAppliedToClient = -1;

    // `lastUpdateIDAppliedToClient` is not dependent on any changes on the UI,
    // so it is okay to use `connectWithoutView` here.

    return new Promise((resolve) => {
        window.Onyx.connectWithoutView({
            key: 'OnyxUpdatesLastUpdateIDAppliedToClient',
            callback: (value) => {
                if (value) {
                    lastUpdateIDAppliedToClient = value;
                } else {
                    lastUpdateIDAppliedToClient = -1;
                }
                resolve(lastUpdateIDAppliedToClient);
            },
        });
    });
}

// wait for data-testid="report-screen-4994652246245875" to be present in DOM
function waitForElement(selector) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

function init() {
    console.debug('Inject script initialized');
    waitForElement('[data-testid^=report-screen-]').then(() => {
        console.debug('The target element is now present in the DOM.');
        const connection = window.Onyx.connectWithoutView({
            key: 'isLoadingReportData',
            callback: (val) => {
                if (!val) {
                    return;
                }
                window.Onyx.disconnect(connection);
                Promise.resolve().then(async () => {
                    const {authToken, currentUserEmail} = await getOnyxData();
                    const clientUpdateID = await getLastClientUpdateID();
                    window.postMessage({
                        action: 'contentScriptLoaded', authToken, currentUserEmail, clientUpdateID,
                    }, '/');
                });
            },
        });
    });
}

init();
