
import React, {
    useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import {withOnyx, useOnyx} from 'react-native-onyx';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ONYXKEYS from '../../ONYXKEYS';
import IssuePropTypes from '../../component/list-item/IssuePropTypes';
import Title from '../../component/panel-title/Title';
import ListItemPull from '../../component/list-item/ListItemPull';
import * as PullRequests from '../../lib/actions/PullRequests';
import * as Issues from '../../lib/actions/Issues';
import filterPropTypes from '../../lib/filterPropTypes';

// Label used to store priorities in Onyx (like PanelIssues uses the panel title)
const PRIORITY_LABEL = 'PRsReviewing';

const propTypes = {
    /** The number of milliseconds to refresh the data */
    pollInterval: PropTypes.number.isRequired,

    /** All the PRs assigned to the current user */
    prs: PropTypes.objectOf(IssuePropTypes),

    /** The filters to apply to the GH issues */
    filters: filterPropTypes,
};

const defaultProps = {
    prs: null,
    filters: {},
};

function getOrderedFilteredPRs({
    prs, filters = {}, localOrder = [], priorities = {},
}) {
    if (!prs) { return []; }

    let prepared = _.chain(prs).sortBy('updatedAt').value().reverse();

    if (filters.hideHold) {
        prepared = _.filter(prepared, (pr) => {
            const regExp = /^\[.*Hold.*\]/ig;
            return !regExp.exec(pr.title);
        });
    }

    if (filters.hideCPlusReviewed) { prepared = _.filter(prepared, pr => !pr.isCPlusApproved); }

    if (localOrder.length && localOrder.length === _.size(prepared)) {
        const dataById = _.indexBy(prepared, 'id');
        return _.filter(_.map(localOrder, id => dataById[id]), Boolean);
    }

    // Iteratee for sorting by owner (secondary sort, for un-prioritized issues)
    const ownerSortIteratee = (item) => {
        const priorityValue = priorities[item.url ?? ''] && (priorities[item.url].priority !== undefined)
            ? priorities[item.url].priority
            : Number.MAX_SAFE_INTEGER;
        if (priorityValue === Number.MAX_SAFE_INTEGER) {
            // Sort un-prioritized issues by owner
            return item.currentUserIsOwner ? 0 : 1;
        }

        // Prioritized issues get the same value to maintain stability for the next sort
        return 0;
    };

    // Iteratee for sorting by priority (primary sort)
    const priorityIteratee = (item) => {
        // If an issue doesn't have a priority, return -1 so that is appears at the top of the list, which will prompt the user to set a priority
        const priorityValue = priorities[item.url ?? ''] && (priorities[item.url].priority !== undefined)
            ? priorities[item.url].priority
            : -1;

        return priorityValue;
    };

    // Sort by priority, then owner. Sorting has to be chained, since _.sortBy doesn't support multi-criteria sorting.
    // If an array is returned, it will be sorted lexicographically and won't sort properly according to priority when there are more than 10 issues.
    return _.chain(prepared)
        .sortBy(ownerSortIteratee)
        .sortBy(priorityIteratee)
        .sortBy(pr => (pr.isCPlusApproved ? 1 : 0))
        .value();
}

function SortablePull({pr}) {
    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({id: pr.id.toString()});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        background: isDragging ? '#f0f0f0' : undefined,
    };

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ListItemPull pr={pr} />
        </div>
    );
}

SortablePull.propTypes = {pr: IssuePropTypes.isRequired};

function ListPRsReviewing(props) {
    // Persisted priorities read from Onyx (mirrors PanelIssues implementation)
    const [priorities = {}] = useOnyx(`${ONYXKEYS.ISSUES.COLLECTION_PRIORITIES}${PRIORITY_LABEL}`);
    const [activeId, setActiveId] = useState(null);
    const [localOrder, setLocalOrder] = useState([]);
    const prevPrioritiesRef = useRef();

    // When persisted priorities update, clear localOrder (Onyx now reflects persisted order)
    useEffect(() => {
        if (!localOrder.length) { return; }
        if (!_.isEqual(prevPrioritiesRef.current, priorities)) {
            setLocalOrder([]);
        }
        prevPrioritiesRef.current = priorities;
    }, [priorities, localOrder]);

    // Polling logic
    const intervalRef = useRef(null);
    const fetch = useCallback(() => {
        PullRequests.getReviewing();
        if (props.pollInterval && !intervalRef.current) {
            intervalRef.current = setInterval(fetch, props.pollInterval);
        }
    }, [props.pollInterval]);

    useEffect(() => {
        fetch();
        return () => {
            if (!intervalRef.current) {
                return;
            }
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [fetch]);

    // Clear localOrder if underlying PRs change
    const prevPrsRef = useRef();
    useEffect(() => {
        if (!localOrder.length) {
            prevPrsRef.current = props.prs;
            return;
        }
        if (!_.isEqual(prevPrsRef.current, props.prs)) {
            setLocalOrder([]);
        }
        prevPrsRef.current = props.prs;
    }, [props.prs, localOrder]);

    const filteredPRs = useMemo(() => getOrderedFilteredPRs({
        prs: props.prs, filters: props.filters, localOrder, priorities,
    }), [props.prs, props.filters, localOrder, priorities]);

    const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

    const prIds = _.map(filteredPRs, pr => pr.id.toString());
    const activePR = activeId ? _.find(filteredPRs, pr => pr.id.toString() === activeId) : null;

    const onDragEnd = useCallback((event) => {
        const active = event.active;
        const over = event.over;
        setActiveId(null);
        if (!over || active.id === over.id) { return; }

        const oldIndex = prIds.indexOf(active.id);
        const newIndex = prIds.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) { return; }

        // Update local order immediately
        const newOrder = arrayMove(_.pluck(filteredPRs, 'id'), oldIndex, newIndex);
        setLocalOrder(newOrder);

        // Persist priorities to Onyx (same pattern as PanelIssues)
        const reorderedData = arrayMove(filteredPRs, oldIndex, newIndex);
        const newPriorities = {};
        for (let i = 0; i < reorderedData.length; i++) {
            const pr = reorderedData[i];
            if (pr.url) {
                newPriorities[pr.url] = {priority: i};
            }
        }

        Issues.setPriorities(newPriorities, PRIORITY_LABEL);
    }, [prIds, filteredPRs]);

    if (filteredPRs && !_.size(filteredPRs)) { return null; }

    return (
        <div className="panel mb-3 daily">
            <Title text="Review these PRs Daily" count={_.size(filteredPRs) || 0} />

            {!props.prs && <div className="blankslate capped clean-background">Loading</div>}

            {_.size(filteredPRs) ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e => setActiveId(e.active.id)} onDragEnd={onDragEnd}>
                    <SortableContext items={prIds} strategy={verticalListSortingStrategy}>
                        {_.map(filteredPRs, pr => <SortablePull key={pr.id} pr={pr} />)}
                    </SortableContext>
                    <DragOverlay>
                        {activePR ? (
                            <div style={{
                                lineHeight: 1.2, background: '#fff', opacity: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                            >
                                <ListItemPull pr={activePR} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            ) : null}
        </div>
    );
}

ListPRsReviewing.propTypes = propTypes;
ListPRsReviewing.defaultProps = defaultProps;

export default withOnyx({prs: {key: ONYXKEYS.PRS.REVIEWING}, filters: {key: ONYXKEYS.ISSUES.FILTER}})(ListPRsReviewing);
