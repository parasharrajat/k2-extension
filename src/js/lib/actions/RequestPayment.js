/* eslint-disable no-undef */
import ReactNativeOnyx from 'react-native-onyx';
import ONYXKEYS from '../../ONYXKEYS';

function saveCPlusPaymentSatus(issueID, status, amount) {
    ReactNativeOnyx.set(`${ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS}${issueID}`, {status, amount});
}
function removeCPlusPaymentSatus(issueID) {
    ReactNativeOnyx.set(`${ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS}${issueID}`, null);
}
function saveCPlusPaymentInfo(info) {
    ReactNativeOnyx.set(ONYXKEYS.C_PLUS_PAYMENT_INFO, info);
}
function removeCPlusPaymentInfo() {
    ReactNativeOnyx.set(ONYXKEYS.C_PLUS_PAYMENT_INFO, null);
}

function directRequestMoney(payload) {
    // generate random requestID of 10 letter
    const requestID = Math.random().toString(36).substring(2, 12);
    // eslint-disable-next-line no-param-reassign
    payload.requestID = requestID;

    // Send background script request to create Expensify money request
    if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendMessage) {
        // Firefox
        browser.runtime.sendMessage({
            action: 'directMoneyRequest',
            payload,
            url: 'https://staging.new.expensify.com',
        });
    } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        // Chrome
        chrome.runtime.sendMessage({
            action: 'directMoneyRequest',
            payload,
            url: 'https://staging.new.expensify.com',
        });
    }
    // eslint-disable-next-line rulesdir/prefer-early-return
    const messageListener = (message) => {
        if (message.action === 'moneyRequestFailed' && message.payload.requestID === requestID) {
            alert(`Money request failed: ${message.error}`);
            chrome.runtime.onMessage.removeListener(messageListener);
        }
    };
    chrome.runtime.onMessage.addListener(messageListener);
}

export default {
    directRequestMoney,
    saveCPlusPaymentSatus,
    removeCPlusPaymentSatus,
    saveCPlusPaymentInfo,
    removeCPlusPaymentInfo,
};
