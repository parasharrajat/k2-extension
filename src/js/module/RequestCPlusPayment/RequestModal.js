import React, {
    useState, useEffect, useRef, useCallback,
} from 'react';
import {useOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';

import moment from 'moment';
import ONYXKEYS from '../../ONYXKEYS';
import RequestPayment from '../../lib/actions/RequestPayment';
import * as API from '../../lib/api';

const propTypes = {
    issueID: PropTypes.string.isRequired,
};

const defaultProps = {};

function RequestModal({issueID}) {
    const [cPlusPaymentStatus] = useOnyx(`${ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS}${issueID}`);
    const [cPlusPaymentInfo] = useOnyx(ONYXKEYS.C_PLUS_PAYMENT_INFO);

    const dialogRef = useRef(null);

    const [requestModal, setRequestModal] = useState({
        chatReportID: '',
        appVersion: '',
        title: '',
        url: '',
        amount: 250,
        preventIssueComment: false,
    });

    // Effect for initial title load from DOM, runs once on mount
    useEffect(() => {
        const titleID = document.querySelector('[data-testid="issue-title-sticky"]'); // This assumes the element is always present when the component mounts.
        if (titleID) {
            setRequestModal(prevState => ({
                ...prevState,
                title: titleID.textContent,
            }));
        }
    }, []);

    // Effect for cPlusPaymentStatus and cPlusPaymentInfo changes
    useEffect(() => {
        if (cPlusPaymentInfo) { // Check if cPlusPaymentInfo is not null or undefined
            setRequestModal(prevState => ({
                ...prevState,
                appVersion: cPlusPaymentInfo.appVersion,
                chatReportID: cPlusPaymentInfo.chatReportID,
            }));
        }

        if (cPlusPaymentStatus) { // Check if cPlusPaymentStatus is not null or undefined
            if (typeof cPlusPaymentStatus === 'string') {
                setRequestModal(prevState => ({
                    ...prevState,
                    amount: '',
                }));
            } else if (typeof cPlusPaymentStatus === 'object' && cPlusPaymentStatus.amount !== undefined) {
                setRequestModal(prevState => ({
                    ...prevState,
                    amount: cPlusPaymentStatus.amount,
                }));
            }
        }
    }, [cPlusPaymentStatus, cPlusPaymentInfo]);

    const updateModalInput = useCallback((inputName, value) => {
        setRequestModal(prevState => ({
            ...prevState,
            [inputName]: value,
        }));
    }, []);

    const closeModal = useCallback(() => {
        // eslint-disable-next-line es/no-optional-chaining
        dialogRef.current?.close();
    }, []);

    const showModal = useCallback(() => {
        // eslint-disable-next-line es/no-optional-chaining
        dialogRef.current?.showModal();
    }, []);

    const submit = useCallback(() => {
        RequestPayment.saveCPlusPaymentSatus(issueID, 'Requested', requestModal.amount);
        RequestPayment.saveCPlusPaymentInfo({
            appVersion: requestModal.appVersion,
            chatReportID: requestModal.chatReportID,
        });

        let msg = 'Payment requested';
        if (requestModal.url) {
            msg = `Payment requested as per ${requestModal.url}`;
        }
        if (!requestModal.preventIssueComment) {
            API.addComment(msg);
        }
        closeModal();
    }, [issueID, requestModal, closeModal]);

    const makeExpensifyRequest = useCallback(() => {
        submit();
        RequestPayment.directRequestMoney({
            debtorEmail: '',
            debtorAccountID: '0',
            amount: parseFloat(requestModal.amount) * 100,
            currency: 'USD',
            comment: `C+ payment for ${requestModal.title} <a href="${requestModal.url}" target="_blank" rel="noreferrer noopener">${requestModal.url}</a>`,
            created: moment().format('YYYY-MM-DD'),
            merchant: 'Contractor',
            chatReportID: requestModal.chatReportID,
            // eslint-disable-next-line max-len
            description: `C+ payment for ${requestModal.title} <a href="${requestModal.url}" target="_blank" rel="noreferrer noopener">${requestModal.url}</a>`,
            shouldRetry: 'true',
            canCancel: 'true',
            email: 'test.rajatparashar+1@gmail.com',
        });
    }, [submit, requestModal]);

    return (
        <div>
            <button
                type="button"
                className="btn btn-primary"
                aria-label="request money"
                onClick={showModal}
            >
                Request $$$
            </button>
            <dialog id="confirm-request" className="site-dialog" ref={dialogRef}>
                <header className="dialog-header">
                    <h1>Request Money</h1>
                </header>
                <div className="dialog-content">
                    <div className="mb-3 d-flex">
                        <div className="col-6">
                            <label htmlFor="payment-chat-report">Workspace Chat Report ID</label>
                            <input
                                type="text"
                                id="payment-chat-report"
                                name="payment-chat-report"
                                value={requestModal.chatReportID}
                                onChange={e => updateModalInput('chatReportID', e.target.value)}
                                className="input-block form-control mb-2"
                                placeholder=""
                            />
                        </div>

                        <div className="col-4 ml-3">
                            <label htmlFor="appversion">App Version</label>
                            <input
                                type="text"
                                id="appversion"
                                name="appversion"
                                value={requestModal.appVersion}
                                onChange={e => updateModalInput('appVersion', e.target.value)}
                                className="input-block form-control mb-2"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <label htmlFor="payment-summary-title">Issue Title</label>
                    <input
                        type="text"
                        id="payment-summary-title"
                        name="payment-summary-title"
                        value={requestModal.title}
                        onChange={e => updateModalInput('title', e.target.value)}
                        className="input-block form-control mb-2"
                        placeholder="Enter issue title"
                    />
                    <label htmlFor="payment-summary-url">Reference URL</label>
                    <input
                        type="text"
                        id="payment-summary-url"
                        name="payment-summary-url"
                        value={requestModal.url}
                        onChange={e => updateModalInput('url', e.target.value)}
                        className="input-block form-control mb-2"
                        placeholder="Enter payment summary reference url"
                    />
                    <label htmlFor="issue-amount">Amount URL</label>
                    <input
                        type="text"
                        id="issue-amount"
                        name="issue-amount"
                        value={requestModal.amount}
                        onChange={e => updateModalInput('amount', e.target.value)}
                        className="input-block form-control mb-2"
                        placeholder="Enter payment amount"
                    />
                    <div className="form-check mb-2">
                        <input
                            type="checkbox"
                            id="prevent-issue-comment"
                            name="prevent-issue-comment"
                            checked={requestModal.preventIssueComment}
                            onChange={e => updateModalInput('preventIssueComment', e.target.checked)}
                            className="form-check-input"
                        />
                        <label className="form-check-label" htmlFor="prevent-issue-comment">
                            Don&apos;t add a comment to this issue
                        </label>
                    </div>
                    <div className="d-flex mt-5">
                        <button
                            type="submit"
                            className="btn flex-1 btn-large btn-primary"
                            aria-label="Requested"
                            onClick={submit}
                        >
                            Save Request
                        </button>
                        <button
                            type="submit"
                            className="btn flex-1 btn-large btn-primary ml-3"
                            aria-label="Requested"
                            onClick={makeExpensifyRequest}
                        >
                            Create Expensify Request
                        </button>
                        <button
                            type="submit"
                            className="btn flex-1 btn-large ml-3"
                            aria-label="Requested"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

RequestModal.propTypes = propTypes;
RequestModal.defaultProps = defaultProps;

export default RequestModal;
