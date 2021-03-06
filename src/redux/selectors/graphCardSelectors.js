import { createSelector } from 'reselect';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Selector cache.
 *
 * @private
 * @type {{dataId: {string}, data: {object}}}
 */
const graphCardCache = { dataId: null, data: {} };

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const graphResponse = (state, props = {}) => ({
  ..._get(state, ['graph', 'reportCapacity', props.productId]),
  ...{
    viewId: props.viewId,
    productId: props.productId,
    graphQuery: props.graphQuery
  }
});

/**
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const graphCardSelector = createSelector([graphResponse], response => {
  const { viewId = null, productId = null, graphQuery = {}, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    graphData: {},
    status: responseData.status
  };

  const responseMetaQuery = { ...metaQuery };
  delete responseMetaQuery[rhsmApiTypes.RHSM_API_QUERY_START_DATE];
  delete responseMetaQuery[rhsmApiTypes.RHSM_API_QUERY_END_DATE];

  const cachedGranularity =
    (viewId && productId && graphCardCache.data[`${viewId}_${productId}_${JSON.stringify(graphQuery)}`]) || undefined;

  Object.assign(updatedResponseData, { ...cachedGranularity });

  if (viewId && graphCardCache.dataId !== viewId) {
    graphCardCache.dataId = viewId;
    graphCardCache.data = {};
  }

  if (responseData.fulfilled && productId === metaId && _isEqual(graphQuery, responseMetaQuery)) {
    const [report, capacity] = responseData.data;
    const reportData = _get(report, [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
    const capacityData = _get(capacity, [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);

    /**
     * ToDo: Reevaluate this reset on graphData when working with Reselect's memoize.
     * Creating a new object i.e. updatedResponseData.graphData = {}; causes an update,
     * which in turn causes the graph to reload and flash.
     */
    Object.keys(updatedResponseData.graphData).forEach(graphDataKey => {
      updatedResponseData.graphData[graphDataKey] = [];
    });

    // Populate expected API response values with undefined
    const [tallySchema = {}, capacitySchema = {}] = reduxHelpers.setResponseSchemas([
      rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
      rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES
    ]);

    // Apply "display logic" then return a custom value for Reporting graph entries
    const customReportValue = (data, key, presetData) => ({
      ...presetData,
      hasData: data[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]
    });

    // Apply "display logic" then return a custom value for Capacity graph entries
    const customCapacityValue = (data, key, { date, x, y }) => ({
      date,
      x,
      y: data[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE] === true ? null : y,
      hasInfinite: data[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]
    });

    // Generate reflected graph data for number, undefined, and null
    reportData.forEach((value, index) => {
      const date = moment.utc(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]).startOf('day').toDate();

      const generateGraphData = ({ graphDataObj, keyPrefix = '', customValue = null }) => {
        Object.keys(graphDataObj).forEach(graphDataObjKey => {
          if (
            typeof graphDataObj[graphDataObjKey] === 'number' ||
            graphDataObj[graphDataObjKey] === undefined ||
            graphDataObj[graphDataObjKey] === null
          ) {
            const casedGraphDataObjKey = _camelCase(`${keyPrefix} ${graphDataObjKey}`).trim();

            if (!updatedResponseData.graphData[casedGraphDataObjKey]) {
              updatedResponseData.graphData[casedGraphDataObjKey] = [];
            }

            let generatedY;

            if (typeof graphDataObj[graphDataObjKey] === 'number') {
              generatedY = Number.parseInt(graphDataObj[graphDataObjKey], 10);
            } else if (graphDataObj[graphDataObjKey] === undefined) {
              generatedY = 0;
            } else if (graphDataObj[graphDataObjKey] === null) {
              generatedY = graphDataObj[graphDataObjKey];
            }

            const updatedItem =
              (typeof customValue === 'function' &&
                customValue(graphDataObj, graphDataObjKey, { date, x: index, y: generatedY })) ||
              {};

            updatedResponseData.graphData[casedGraphDataObjKey][index] = {
              date,
              x: index,
              y: generatedY,
              ...updatedItem
            };
          }
        });
      };

      generateGraphData({ graphDataObj: { ...tallySchema, ...value }, customValue: customReportValue });
      generateGraphData({
        graphDataObj: { ...capacitySchema, ...capacityData[index] },
        keyPrefix: 'threshold',
        customValue: customCapacityValue
      });
    });

    // Update response and cache
    updatedResponseData.fulfilled = true;
    graphCardCache.data[`${viewId}_${productId}_${JSON.stringify(graphQuery)}`] = {
      ...updatedResponseData
    };
  }

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const makeGraphCardSelector = defaultProps => (state, props) => ({
  ...graphCardSelector(state, props, defaultProps)
});

const graphCardSelectors = {
  graphCard: graphCardSelector,
  makeGraphCard: makeGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, graphCardSelector, makeGraphCardSelector };
