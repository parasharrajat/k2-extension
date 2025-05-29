import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Request from './Request';
// eslint-disable-next-line rulesdir/prefer-import-module-contents
import {getCurrentIssueDetails} from '../../lib/actions/Issues';
import RequestModal from './RequestModal';

export default function () {
    const issueDetails = getCurrentIssueDetails();
    return {
        draw() {
            $('[data-testid="issue-metadata-sticky"]').append('<div id="request-modal-header-button"></div>');
            // eslint-disable-next-line react/no-deprecated
            ReactDOM.render(
                <RequestModal issueID={issueDetails.issue_number} />,
                $('#request-modal-header-button')[0],
            );
            // eslint-disable-next-line react/no-deprecated
            ReactDOM.render(
                <Request issueID={issueDetails.issue_number} />,
                document.getElementsByClassName('k2request-wrapper')[0],
            );
        },
    };
}
