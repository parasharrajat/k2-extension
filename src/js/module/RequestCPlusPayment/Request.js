import React, {useState, useEffect, useCallback} from 'react';
import {useOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import BtnGroup from '../../component/BtnGroup';

import ONYXKEYS from '../../ONYXKEYS';
import RequestPayment from '../../lib/actions/RequestPayment';

const defaultBtnClass = 'btn btn-sm tooltipped tooltipped-n typepicker';

const defaultLabels = {
    'Pending Payment': `${defaultBtnClass} k2-improvement`,
    Requested: `${defaultBtnClass} k2-task`,
};

const propTypes = {
    issueID: PropTypes.string.isRequired,
};

const defaultProps = {};

function Request({issueID}) {
    const [cPlusPaymentStatus] = useOnyx(`${ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS}${issueID}`);
    console.debug('cPlusPaymentStatus', cPlusPaymentStatus);

    const [buttonClasses, setButtonClasses] = useState(defaultLabels);
    const [amount, setAmount] = useState(250);

    const setButtonState = useCallback((status) => {
        setButtonClasses((prevButtonClasses) => {
            const newState = {};
            // eslint-disable-next-line rulesdir/prefer-underscore-method
            Object.keys(prevButtonClasses).forEach((key) => {
                newState[key] = key === status
                    ? `${defaultBtnClass} k2-${key.toLowerCase().replace(' ', '-')} active`
                    : `${defaultBtnClass} k2-${key.toLowerCase().replace(' ', '-')} inactive`;
            });
            return newState;
        });
    }, []);

    /**
     * Effect to handle initial state based on cPlusPaymentStatus
     */
    useEffect(() => {
        if (!cPlusPaymentStatus) {
            return;
        }
        if (typeof cPlusPaymentStatus !== 'string') {
            setAmount(cPlusPaymentStatus.amount);
            setButtonState(cPlusPaymentStatus.status);
        }
    }, [cPlusPaymentStatus, setButtonState]);

    const clickNSave = useCallback((label) => {
        // If that label is already active, then set everything back
        // to the default (which removes all labels)
        if (buttonClasses[label].includes(' active')) {
            RequestPayment.removeCPlusPaymentSatus(issueID);
            setButtonClasses(defaultLabels);
            return;
        }

        setButtonState(label);
        RequestPayment.saveCPlusPaymentSatus(issueID, label, amount);
    }, [buttonClasses, setButtonState, issueID, amount]);

    return (
        <div>
            <div className="position-relative mt-3 flex-btns">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="sidebar-floated-label">Track C+ Payment</label>
                <input
                    type="text"
                    id="cplus-amount"
                    name="cplus-amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="input-block form-control mb-2"
                    placeholder="Enter payment amount"
                />
                <BtnGroup className="d-flex">
                    <button
                        type="button"
                        className={buttonClasses.Requested}
                        aria-label="Requested"
                        onClick={() => clickNSave('Requested')}
                    >
                        Requested
                    </button>
                    <button
                        type="button"
                        className={buttonClasses['Pending Payment']}
                        aria-label="Pending Payment"
                        onClick={() => clickNSave('Pending Payment')}
                    >
                        Pending Payment
                    </button>
                </BtnGroup>
            </div>
        </div>
    );
}

Request.propTypes = propTypes;
Request.defaultProps = defaultProps;

export default Request;
