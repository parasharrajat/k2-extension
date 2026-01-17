/* eslint-disable rulesdir/prefer-early-return */
/* eslint-disable no-undef */

/* eslint-disable max-len */
/* eslint-disable es/no-optional-chaining */

/**

fetch("https://dev.new.expensify.com:8082/staging/api/RequestMoney?", {
  "headers": {
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "baggage": "sentry-environment=development,sentry-release=new.expensify%409.3.4-0,sentry-public_key=7b463fb4d4402d342d1166d929a62f4e,sentry-trace_id=bc39a6415483471792764c67fe7bea64,sentry-org_id=4510228013121536,sentry-transaction=Report,sentry-sampled=true,sentry-sample_rand=0.01609077212435417,sentry-sample_rate=1",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundarygFn4SUGJ0ukDTl1b",
    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sentry-trace": "bc39a6415483471792764c67fe7bea64-8c86eb7d723ef28f-1"
  },
  "referrer": "https://dev.new.expensify.com:8082/create/submit/confirmation/1/3588928622343884",
  "body": "------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"debtorEmail\"\r\n\r\n\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"debtorAccountID\"\r\n\r\n0\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"amount\"\r\n\r\n25000\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"currency\"\r\n\r\nUSD\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"comment\"\r\n\r\nSADASDASDAS\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"created\"\r\n\r\n2026-01-17\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"merchant\"\r\n\r\nC+ test\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"iouReportID\"\r\n\r\n3494332481013662\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"chatReportID\"\r\n\r\n3588928622343884\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"transactionID\"\r\n\r\n3780914056090089930\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"reportActionID\"\r\n\r\n752334376691537987\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"createdIOUReportActionID\"\r\n\r\n421387738516972277\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"reportPreviewReportActionID\"\r\n\r\n6139222589369482087\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"category\"\r\n\r\nAdvertising\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"tag\"\r\n\r\n\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"taxCode\"\r\n\r\n\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"taxAmount\"\r\n\r\n0\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"billable\"\r\n\r\nfalse\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"reimbursable\"\r\n\r\ntrue\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\nSADASDASDAS\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"attendees\"\r\n\r\n[{\"email\":\"test.rajatparashar+1@gmail.com\",\"login\":\"test.rajatparashar+1@gmail.com\",\"displayName\":\"Rajat Test +1 H\",\"avatarUrl\":\"https://d1wpcgnaa73g0y.cloudfront.net/f90ad0813bb12b27ee64390e3bc781b39c9ec2b1_128.jpeg\",\"accountID\":14636358,\"text\":\"test.rajatparashar+1@gmail.com\",\"selected\":true,\"reportID\":\"3257195137226444\"}]\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"apiRequestType\"\r\n\r\nwrite\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"pusherSocketID\"\r\n\r\n884432.8504851\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"shouldRetry\"\r\n\r\ntrue\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"canCancel\"\r\n\r\ntrue\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"authToken\"\r\n\r\nDBCC3032806FE9B4EBE4CBEB1BD32C06ED9EA30D8D3F7A7F471F620B1C5792A502B44BE11ADF3CF50233C3B29A402030797D7560C4F26778DDB2804D9982369C6B2F8E3675AF90B0D5F3C4DD2442062008C92EAB0CAD778BCC1D43639C6BC7B9292A2A3ECAB9D2771CD7DB9B01E26ED38F0CE6EE90A9E6ACC79121F3240EE2A6C6EE3DF4CA4864C5F83E77E70781E54CB7CE43F31FAE6DF5840944F8321E5A70ACA578765E277CE8A39194016ED978F40CB9399AC4171F9F6DDC993EA76DBB319D61655F622304E93CF0561DBF20E0B78EA23934DB0445420C9C049F17EE2EC88DEE6599711C7170EE1BAEB579E622CA31934A34CCC51D0C79FB415294378CE9A922A5A0F1C297978B55C820FAE63C0D84C7863713F61FA11DFD069A749BD0CF9BC7B4575FB16E370392BA882A6C208D6A7319B02A0E8DFF0FA53E2D1D2EF42E58903D59423CE365000EC895B6E64E19C3E77216374F8EE79A7D0C314672BE11\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"referer\"\r\n\r\necash\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"platform\"\r\n\r\nweb\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"api_setCookie\"\r\n\r\nfalse\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"email\"\r\n\r\ntest.rajatparashar+1@gmail.com\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"isFromDevEnv\"\r\n\r\ntrue\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"appversion\"\r\n\r\n9.3.4-0\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b\r\nContent-Disposition: form-data; name=\"clientUpdateID\"\r\n\r\n9907583784\r\n------WebKitFormBoundarygFn4SUGJ0ukDTl1b--\r\n",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

 */

// // Add JS logic to make this Exact request from browser console, including dynamic values where necessary and create payload programmatically. Give whole code at once
// (function() {
//     const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2, 15);
//     const formData = new FormData();
//     const payload = {
//       debtorEmail: '',
//       debtorAccountID: '0',
//       amount: '25000',
//       currency: 'USD',
//       comment: 'SADASDASDAS',
//       created: '2026-01-17',
//       merchant: 'C+ test',
//       iouReportID: '3494332481013662',
//       chatReportID: '3588928622343884',
//   transactionID: '3780914056090089930',
//   reportActionID: '752334376691537987',
//       createdIOUReportActionID: '421387738516972277',
//       reportPreviewReportActionID: '6139222589369482087',
//       category: 'Advertising',
//       tag: '',
//       taxCode: '',
//       taxAmount: '0',
//       billable: 'false',
//       reimbursable: 'true',
//       description: 'SADASDASDAS',
//       attendees: JSON.stringify([{
//         email: "asdsa"
//       }]),
//       apiRequestType: 'write',
//       pusherSocketID: '884432.8504851',
//       shouldRetry: 'true',
//       canCancel: 'true',
//       authToken: 'DBCC3032806FE9B4EBE4CBEB1BD32C06ED9EA30D8D3F7A7F471F620B1C5792A502B44BE11ADF3CF50233C3B29A402030797D7560C4F26778DDB2804D9982369C6B2F8E3675AF90B0D5F3C4DD2442062008C92EAB0CAD778BCC1D43639C6BC7B9292A2A3ECAB9D2771CD7DB9B01E26ED38F0CE6EE90A9E6ACC79121F3240EE2A6C6EE3DF4CA4864C5F83E77E70781E54CB7CE43F31FAE6DF5840944F8321E5A70ACA578765E277CE8A39194016ED978F40CB9399AC4171F9F6DDC993EA76DBB319D61655F622304E93CF0561DBF20E0B78EA23934DB0445420C9C049F17EE2EC88DEE6599711C7170EE1BAEB579E622CA31934A34CCC51D0C79FB415294378CE9A922A5A0F1C297978B55C820FAE63C0D84C7863713F61FA11DFD069A749BD0CF9BC7B4575FB16E370392BA882A6C208D6A7319B02A0E8DFF0FA53E2D1D2EF42E58903D59423CE365000EC895B6E64E19C3E77216374F8EE79A7D0C314672BE11',
//       referer: 'ecash',
//       platform: 'web',
//       api_setCookie: 'false',
//       email: '  ',
//       isFromDevEnv: 'true',
//       appversion: '9.3.4-0',
//       clientUpdateID: '9907583784'
//     };

//     for (const [key, value] of Object.entries(payload)) {
//       formData.append(key, value);
//     }

//     fetch("https://dev.new.expensify.com:8082/staging/api/RequestMoney?", {
//       headers: {
//         "accept": "*/*",
//         "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//         "baggage": "sentry-environment=development,sentry-release=new.expensify%409.3.4-0,sentry-public_key=7b463fb4d4402d342d1166d929a62f4e,sentry-trace_id=bc39a6415483471792764c67fe7bea64,sentry-org_id=4510228013121536,sentry-transaction=Report,sentry-sampled=true,sentry-sample_rand=0.01609077212435417,sentry-sample_rate=1",
//         "sentry-trace": "bc39a6415483471792764c67fe7bea64-8c86eb7d723ef28f-1"
//       },
//       referrer: "https://dev.new.expensify.com:8082/create/submit/confirmation/1/3588928622343884",
//       body: formData,
//       method: "POST"
//     });
// })();

const onyxData = {};

function enhanceParameters(parameters) {
    const finalParameters = {...parameters};
    const {authToken, currentUserEmail} = onyxData;

    finalParameters.authToken = authToken ?? null;

    finalParameters.referer = 'ecash';

    // In addition to the referer (ecash), we pass the platform to help differentiate what device type
    // is sending the request.
    finalParameters.platform = 'web';

    // This application does not save its authToken in cookies like the classic Expensify app.
    // Setting api_setCookie to false will ensure that the Expensify API doesn't set any cookies
    // and prevents interfering with the cookie authToken that Expensify classic uses.
    finalParameters.api_setCookie = false;

    // Include current user's email in every request and the server logs
    finalParameters.email = currentUserEmail;
    finalParameters.isFromDevEnv = false;
    finalParameters.clientUpdateID = onyxData.clientUpdateID ?? null;

    return finalParameters;
}

// direct function to make the request
function directRequestMoney(payload) {
    //     const payload = {
    //     debtorEmail: '',
    //     debtorAccountID: '0',
    //     amount: '25000',
    //     currency: 'USD',
    //     comment: 'SADASDASDAS',
    //     created: '2026-01-17',
    //     merchant: 'C+ test',
    //     chatReportID: '3588928622343884',
    //     category: 'Advertising',
    //     tag: '',
    //     taxCode: '',
    //     taxAmount: '0',
    //     billable: 'false',
    //     reimbursable: 'true',
    //     description: 'SADASDASDAS',
    //     pusherSocketID: '884432.8504851',
    //     shouldRetry: 'true',
    //     canCancel: 'true',
    //     email: 'test.rajatparashar+1@gmail.com',
    // };
    const updatedPayload = enhanceParameters(payload);
    delete updatedPayload.requestID;
    const formData = new FormData();

    formData.append('apiRequestType', 'write');

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(updatedPayload)) {
        formData.append(key, String(value));
    }

    return fetch('https://staging.expensify.com/api/RequestMoney?', {
        body: formData,
        method: 'POST',
        credentials: 'omit',
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
        .then((response) => {
            // Some retried requests will result in a "Unique Constraints Violation" error from the server, which just means the record already exists
            if (response.jsonCode !== 200) {
                throw new Error(`Error from server: ${response.message}`);
            }
        });
}

function init() {
    console.debug('Inject script initialized');
    window.addEventListener('message', (event) => {
        // Do we trust the sender of this message?
        if (event.origin !== 'https://staging.new.expensify.com' || event.data.action !== 'contentScriptLoaded') { return; }
        console.debug('Received message in inject script:', event.data);

        onyxData.authToken = event.data.authToken;
        onyxData.currentUserEmail = event.data.currentUserEmail;
        onyxData.clientUpdateID = event.data.clientUpdateID;

        chrome.runtime.sendMessage({
            action: 'contentScriptLoaded',
            url: window.location.href,
        });
    });

    const handler = (message) => {
        if (message.action === 'makeMoneyRequest' && message.payload) {
            directRequestMoney(message.payload)
                .then((data) => {
                    console.debug('Money request successful:', data);
                    chrome.runtime.sendMessage({
                        action: 'moneyRequestSuccessful',
                        payload: message.payload,
                    });
                })
                .catch((error) => {
                    chrome.runtime.sendMessage({
                        action: 'moneyRequestFailed',
                        error: error.message,
                        payload: message.payload,
                    });
                });
        }
    };
    if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
        // Firefox
        browser.runtime.onMessage.addListener(handler);
    } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        // Chrome
        chrome.runtime.onMessage.addListener(handler);
    }
}

init();
