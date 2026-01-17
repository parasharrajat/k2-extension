// eslint-disable-next-line no-unused-vars
import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';

import moment from 'moment';
import ONYXKEYS from '../../ONYXKEYS';
import RequestPayment from '../../lib/actions/RequestPayment';
import * as API from '../../lib/api';

const defaultBtnClass = 'btn btn-sm tooltipped tooltipped-n typepicker';

const propTypes = {
    issueID: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cPlusPaymentStatus: PropTypes.any,
    // eslint-disable-next-line react/forbid-prop-types
    cPlusPaymentInfo: PropTypes.object,
};

const defaultProps = {
    cPlusPaymentStatus: '',
    cPlusPaymentInfo: {},
};

class RequestModal extends React.Component {
    constructor(props) {
        super(props);

        this.labels = {
            'Pending Payment': `${defaultBtnClass} k2-improvement`,
            Requested: `${defaultBtnClass} k2-task`,
        };

        this.state = {
            isOpen: false,
            isButtonSelected: false,
            shouldShowConfirmationMessage: false,
            participationComment: '',
            selectedButton: {},
            ...this.labels,
            requestModal: {
                chatReportID: '',
                appVersion: '',
                title: '',
                url: '',
                amount: 250,
            },
        };
    }

    componentDidMount() {
        const titleID = document.querySelector('[data-testid="issue-title-sticky"]');
        if (titleID) {
            this.setState(prevState => ({
                requestModal: {
                    ...prevState.requestModal,
                    title: titleID.textContent,
                },
            }));
        }

        if (!this.props.cPlusPaymentStatus || !this.props.cPlusPaymentInfo) {
            return;
        }
        this.setState(prevState => ({
            requestModal: {
                ...prevState.requestModal,
                appVersion: this.props.cPlusPaymentInfo.appVersion,
                chatReportID: this.props.cPlusPaymentInfo.chatReportID,
            },
        }));

        if (!this.props.cPlusPaymentStatus) {
            return;
        }

        if (typeof this.props.cPlusPaymentStatus === 'string') {
            this.setState(prevState => ({
                requestModal: {
                    ...prevState.requestModal,
                    amount: '',
                },
            }));
            this.setActiveLabel(this.props.cPlusPaymentStatus, () => {}, () => {});
        } else {
            this.setState(prevState => ({
                requestModal: {
                    ...prevState.requestModal,
                    amount: this.props.cPlusPaymentStatus.amount,
                },
            }));
            this.setActiveLabel(this.props.cPlusPaymentStatus.status, () => {}, () => {});
        }
    }

    setActiveLabel(label, onActive, onInactive) {
        let newState = {};

        // If that label is already active, then set everything back
        // to the default (which removes all labels)
        if (this.state[label].indexOf(' active') > -1) {
            this.setState(this.labels);
            onInactive();
            return;
        }

        // Set all the proper active/inactive classes
        newState = _.mapObject(this.labels, (val, key) => (key === label
            ? `${defaultBtnClass} k2-${key.toLowerCase().replace(' ', '-')} active`
            : `${defaultBtnClass} k2-${key.toLowerCase().replace(' ', '-')} inactive`));
        this.setState(newState);
        onActive();
    }

    updateModalInput(inputName, value) {
        this.setState(prevState => ({
            ...prevState,
            requestModal: {
                ...prevState.requestModal,
                [inputName]: value,
            },
        }));
    }

    submit() {
        RequestPayment.saveCPlusPaymentSatus(this.props.issueID, 'Requested', this.state.requestModal.amount);
        RequestPayment.saveCPlusPaymentInfo({
            appVersion: this.state.requestModal.appVersion,
            chatReportID: this.state.requestModal.chatReportID,
        });

        let msg = 'Payment requested';
        if (this.state.requestModal.url) {
            msg = `Payment requested as per ${this.state.requestModal.url}`;
        }
        API.addComment(msg);
        $('#confirm-request')[0].close();
    }

    closeModal() {
        $('#confirm-request')[0].close();
    }

    showModal() {
        $('#confirm-request')[0].showModal();
    }

    makeExpensifyRequest() {
        this.submit();
        RequestPayment.directRequestMoney({
            debtorEmail: '',
            debtorAccountID: '0',
            amount: parseFloat(this.state.requestModal.amount) * 100,
            currency: 'USD',
            comment: `C+ payment for ${this.state.requestModal.title} <a href="${this.state.requestModal.url}" target="_blank" rel="noreferrer noopener">${this.state.requestModal.url}</a>`,
            created: moment().format('YYYY-MM-DD'),
            merchant: 'Contractor',
            chatReportID: this.state.requestModal.chatReportID,
            // eslint-disable-next-line max-len
            description: `C+ payment for ${this.state.requestModal.title} <a href="${this.state.requestModal.url}" target="_blank" rel="noreferrer noopener">${this.state.requestModal.url}</a>`,
            shouldRetry: 'true',
            canCancel: 'true',
            email: 'test.rajatparashar+1@gmail.com',
        });
    }

    render() {
        return (
            <div>
                <button
                    type="button"
                    className="btn btn-primary"
                    aria-label="request money"
                    onClick={() => this.showModal()}
                >
                    Request $$$
                </button>
                <dialog id="confirm-request" className="site-dialog">
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
                                    value={this.state.requestModal.chatReportID}
                                    onChange={e => this.updateModalInput('chatReportID', e.target.value)}
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
                                    value={this.state.requestModal.appVersion}
                                    onChange={e => this.updateModalInput('appVersion', e.target.value)}
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
                            value={this.state.requestModal.title}
                            onChange={e => this.updateModalInput('title', e.target.value)}
                            className="input-block form-control mb-2"
                            placeholder="Enter issue title"
                        />
                        <label htmlFor="payment-summary-url">Reference URL</label>
                        <input
                            type="text"
                            id="payment-summary-url"
                            name="payment-summary-url"
                            value={this.state.requestModal.url}
                            onChange={e => this.updateModalInput('url', e.target.value)}
                            className="input-block form-control mb-2"
                            placeholder="Enter payment summary reference url"
                        />
                        <label htmlFor="issue-amount">Amount URL</label>
                        <input
                            type="text"
                            id="issue-amount"
                            name="issue-amount"
                            value={this.state.requestModal.amount}
                            onChange={e => this.updateModalInput('amount', e.target.value)}
                            className="input-block form-control mb-2"
                            placeholder="Enter payment amount"
                        />
                        <div className="d-flex mt-5">
                            <button
                                type="submit"
                                className="btn flex-1 btn-large btn-primary"
                                aria-label="Requested"
                                onClick={() => this.submit()}
                            >
                                Save Request
                            </button>
                            <button
                                type="submit"
                                className="btn flex-1 btn-large btn-primary ml-3"
                                aria-label="Requested"
                                onClick={() => this.makeExpensifyRequest()}
                            >
                                Create Expensify Request
                            </button>
                            <button
                                type="submit"
                                className="btn flex-1 btn-large ml-3"
                                aria-label="Requested"
                                onClick={() => this.closeModal()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        );
    }
}

RequestModal.propTypes = propTypes;
RequestModal.defaultProps = defaultProps;

export default withOnyx({
    cPlusPaymentStatus: {
        key: ({issueID}) => `${ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS}${issueID}`,
    },
    cPlusPaymentInfo: {
        key: `${ONYXKEYS.C_PLUS_PAYMENT_INFO}`,
    },
})(RequestModal);
