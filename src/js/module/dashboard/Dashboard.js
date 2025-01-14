import React from 'react';
import PropTypes from 'prop-types';

// import Filters from './Filters';
import ListIssuesAssigned from './ListIssuesAssigned';
import ListPRsAssigned from './ListPRsAssigned';
import ListPRsReviewing from './ListPRsReviewing';

// import ListIssuesEngineering from './ListIssuesEngineering';
import Legend from './Legend';
import ListIssuesWAQ from './ListIssuesWAQ';
import BudgetPlanner from './BudgetPlanner';
import MainFilters from './MainFilters';
import ListIssuesHotPicks from './ListIssuesHotPicks';

const propTypes = {
    /** The number of seconds to refresh the list of issues */
    pollInterval: PropTypes.number.isRequired,
};

function Dashboard(props) {
    return (
        <div className="issueList">
            <Legend />
            <MainFilters />
            <ListPRsReviewing pollInterval={props.pollInterval * 2.5} />
            <BudgetPlanner />

            <ListIssuesAssigned pollInterval={props.pollInterval} />

            <ListPRsAssigned pollInterval={props.pollInterval * 2.5} />

            <ListIssuesWAQ pollInterval={props.pollInterval * 2.5} />

            <ListIssuesHotPicks pollInterval={props.pollInterval * 2.5} />

            {/* Hide these for now while we focus on NewDot */}
            {/* <Filters />

            <ListIssuesEngineering pollInterval={props.pollInterval * 2.5} /> */}
        </div>
    );
}

Dashboard.propTypes = propTypes;

export default Dashboard;
