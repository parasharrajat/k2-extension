// eslint-disable-next-line no-unused-vars
import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';

import ONYXKEYS from '../../ONYXKEYS';
import RequestPayment from '../../lib/actions/RequestPayment';
import * as API from '../../lib/api';

const defaultBtnClass = 'btn btn-sm tooltipped tooltipped-n typepicker';

const propTypes = {
    issueID: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    cPlusPaymentStatus: PropTypes.any,
};

const defaultProps = {
    cPlusPaymentStatus: '',
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
                url: '',
                amount: 250,
            },
        };
    }

    componentDidMount() {
        if (!this.props.cPlusPaymentStatus) {
            return;
        }
        if (typeof this.props.cPlusPaymentStatus === 'string') {
            this.setState({amount: ''});
            this.setActiveLabel(this.props.cPlusPaymentStatus, () => {}, () => {});
        } else {
            this.setState({amount: this.props.cPlusPaymentStatus.amount});
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
                        <label htmlFor="amount">Amount URL</label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
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
                                Request
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
})(RequestModal);
