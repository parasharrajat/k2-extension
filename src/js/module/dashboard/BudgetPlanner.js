/* eslint-disable es/no-optional-chaining */
import React, {
    useState, useEffect, useCallback, useMemo,
} from 'react';
import _ from 'underscore';
import {useOnyx} from 'react-native-onyx';
import Panel from '../../component/Panel';
import ONYXKEYS from '../../ONYXKEYS';
import RequestPayment from '../../lib/actions/RequestPayment';

function getIDfromCollectionkey(collection, key) {
    return key.replace(collection, '');
}

function BudgetPlanner() {
    const [issues] = useOnyx(ONYXKEYS.ISSUES.ASSIGNED);
    const [issuesClosed] = useOnyx(ONYXKEYS.ISSUES.CLOSED_100);
    const [cPlusStatus] = useOnyx(ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS);

    console.debug('cPlusStatus', cPlusStatus);

    const [pendingAmount, setPendingAmount] = useState(0);
    const [futureAmount, setFutureAmount] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [predictions, setPredictions] = useState(0);

    const removeRequested = useCallback((e, issueID) => {
        e.preventDefault();
        RequestPayment.removeCPlusPaymentSatus(issueID);
    }, []);

    const issuesMap = useMemo(() => {
        const map = {};
        _.forEach(issues, (issue) => {
            map[issue.number] = issue;
        });
        _.forEach(issuesClosed, (issue) => {
            map[issue.number] = issue;
        });
        return map;
    }, [issues, issuesClosed]);

    const calculatePayments = useCallback(() => {
        if (!_.size(issues)) {
            setFutureAmount(0);
            setPendingAmount(0);
            return;
        }
        let currentFutureAmount = 0;
        let currentPendingAmount = 0;
        _.forEach(issues, (issue) => {
            const matchAmountRegex = /.*\$([\d,]*)/i; // Use 'i' for case-insensitive, remove 'g' for single match
            const matchStatusRegex = /(HOLD for payment)+/i; // Use 'i' for case-insensitive, remove 'g' for single match

            const matchedAmount = matchAmountRegex.exec(issue.title);
            const matchedStatus = matchStatusRegex.exec(issue.title);

            if (!matchedAmount) {
                return;
            }
            if (matchedStatus && matchedStatus[1]) {
                currentPendingAmount += matchedAmount[1] ? parseInt(matchedAmount[1].replace(/,/g, ''), 10) : 0;
            } else {
                currentFutureAmount += matchedAmount[1] ? parseInt(matchedAmount[1].replace(/,/g, ''), 10) : 0;
            }
        });
        setFutureAmount(currentFutureAmount);
        setPendingAmount(currentPendingAmount);
    }, [issues]);

    const checkStatus = useCallback((cplusstatus, matchWith) => {
        if (!cplusstatus) {
            return false;
        }
        if (typeof cplusstatus === 'string') {
            return cplusstatus === matchWith;
        }
        return cplusstatus.status === matchWith; // Assuming cplusstatus is an object with a 'status' property
    }, []);

    useEffect(() => {
        calculatePayments();
    }, [issues, calculatePayments]);

    if (!issues) {
        return (
            <div className="blankslate capped clean-background">
                Loading
            </div>
        );
    }

    const pendingRequests = _.chain(cPlusStatus)
        .keys()
        .filter(key => checkStatus(cPlusStatus[key], 'Pending Payment'))
        .value() || [];

    const pendingRequestsOpen = _.filter(pendingRequests, (key) => {
        const id = getIDfromCollectionkey(ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS, key);
        return !issuesMap?.[id]?.closed;
    });

    const pendingRequestsClosed = _.filter(pendingRequests, (key) => {
        const id = getIDfromCollectionkey(ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS, key);
        return issuesMap?.[id]?.closed;
    });

    const pendingRequestsOpenAmount = _.reduce(pendingRequestsOpen, (total, key) => parseInt(cPlusStatus[key].amount, 10) + total, 0);
    const pendingRequestsClosedAmount = _.reduce(pendingRequestsClosed, (total, key) => parseInt(cPlusStatus[key].amount, 10) + total, 0);

    const requestedRequests = _.chain(cPlusStatus)
        .keys()
        .filter(key => checkStatus(cPlusStatus[key], 'Requested')).value() || [];

    return (
        <div className="mb-3">
            <div className="d-flex flex-row budget-planner">
                <div className="col-12">
                    <Panel
                        panelID="budget"
                        title="Budget Planner"
                    >
                        <div className="p-4">
                            <div className="d-flex flex-row ">
                                <div className="col-3 pr-4">
                                    <div>
                                        <h5>Pending Jobs&apos;</h5>
                                        <p className="amount">
                                            $
                                            {pendingAmount}
                                        </p>
                                    </div>

                                </div>
                                <div className="col-3 pr-4">
                                    <div>
                                        <h5>Future Jobs&apos;</h5>
                                        <p className="amount">
                                            $
                                            {futureAmount}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-3 pr-4">
                                    <div>
                                        <h5>Pending Finished Jobs&apos;</h5>
                                        <p className="amount">
                                            $
                                            {_.reduce(pendingRequests, (total, key) => parseInt(cPlusStatus[key].amount, 10) + total, 0)}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-3 pr-4">
                                    <div>
                                        <h5>Requested Finished Jobs&apos;</h5>
                                        <p className="amount">
                                            $
                                            {_.reduce(requestedRequests, (total, key) => parseInt(cPlusStatus[key].amount, 10) + total, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="col-8 pr-4">
                                    <div className="border p-3 rounded">

                                        <div className="d-flex flex-row">
                                            <div className="col-6">
                                                <h5 className="h4 mb-2 text-light">
                                                    Pending Requests
                                                    {' '}
                                                    <span>
                                                        (Total $
                                                        {pendingRequestsOpenAmount}
                                                        )
                                                    </span>
                                                </h5>
                                                {_.map(pendingRequestsOpen, (key) => {
                                                    const id = getIDfromCollectionkey(ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS, key);
                                                    return (
                                                        <a className="IssueLabel color-fg-on-emphasis color-bg-severe-emphasis" href={`https://github.com/Expensify/App/issues/${id}`}>
                                                            #
                                                            {id}
                                                            <span className="IssueLabel IssueAmountLabel color-bg-subtle color-fg-severe">{cPlusStatus[key]?.amount}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                            <div className="col-6">

                                                <h5 className="h4 mb-2 text-light">
                                                    Pending Closed Requests
                                                    {' '}
                                                    <span>
                                                        (Total $
                                                        {pendingRequestsClosedAmount}
                                                        )
                                                    </span>
                                                </h5>
                                                {_.map(pendingRequestsClosed, (key) => {
                                                    const id = getIDfromCollectionkey(ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS, key);
                                                    return (
                                                        <a className="IssueLabel color-fg-on-emphasis color-bg-closed-emphasis" href={`https://github.com/Expensify/App/issues/${id}`}>
                                                            #
                                                            {id}
                                                            <span className="IssueLabel IssueAmountLabel color-bg-subtle color-fg-severe">{cPlusStatus[key]?.amount}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className="col-4 pr-4">
                                    <div className="border p-3 rounded">
                                        <h5 className="h4 mb-2 text-light">
                                            Requested
                                        </h5>
                                        {_.map(requestedRequests, (key) => {
                                            const id = getIDfromCollectionkey(ONYXKEYS.COLLECTION.C_PLUS_PAYMENT_STATUS, key);
                                            const className = issuesMap?.[id]?.closed ? 'color-bg-closed-emphasis' : 'color-bg-open-emphasis';
                                            return (
                                                <a className={`IssueLabel color-fg-on-emphasis ${className}`} href={`https://github.com/Expensify/App/issues/${id}`}>
                                                    #
                                                    {id}
                                                    <span className="IssueAmountLabel IssueLabel color-bg-subtle fgColor-open">{cPlusStatus[key]?.amount}</span>
                                                    <button
                                                        type="button"
                                                        className="IssueAmountLabel IssueLabel bgColor-transparent fgColor-onEmphasis fgColor-open text-small"
                                                        onClick={e => removeRequested(e, id)}
                                                    >
                                                        X
                                                    </button>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>

                </div>
            </div>
        </div>
    );
}

export default BudgetPlanner;
