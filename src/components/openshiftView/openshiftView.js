import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { PageLayout, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, rhsmApiTypes } from '../../types/rhsmApiTypes';
import { connectTranslate, reduxSelectors } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import { Select } from '../select/select';
import Toolbar from '../toolbar/toolbar';
import { helpers } from '../../common';

class OpenshiftView extends React.Component {
  state = {
    option: null,
    filters: []
  };

  componentDidMount() {
    const { initialOption } = this.props;
    this.onSelect({ value: initialOption });
  }

  onSelect = (event = {}) => {
    const { option } = this.state;
    const { initialFilters } = this.props;
    const { value } = event;

    if (value !== option) {
      const filters = initialFilters.filter(val => new RegExp(value, 'i').test(val.id));
      this.setState({
        option,
        filters
      });
    }
  };

  renderSelect() {
    const { option } = this.state;
    const { initialOption } = this.props;
    const options = [
      { title: 'Cores', value: 'cores' },
      { title: 'Sockets', value: 'sockets' }
    ];

    return <Select onSelect={this.onSelect} options={options} selectedOptions={option || initialOption} />;
  }

  render() {
    const { filters } = this.state;
    const { graphQuery, routeDetail, t } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          {(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
        </PageHeader>
        <PageToolbar>
          <Toolbar viewId={routeDetail.pathId} />
        </PageToolbar>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={filters}
            graphQuery={graphQuery}
            productId={routeDetail.pathParameter}
            viewId={routeDetail.pathId}
            cardTitle={t('curiosity-graph.cardHeading')}
            productShortLabel="OpenShift"
          >
            {this.renderSelect()}
          </GraphCard>
        </PageSection>
      </PageLayout>
    );
  }
}

OpenshiftView.propTypes = {
  graphQuery: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialOption: PropTypes.oneOf(['cores', 'sockets']),
  initialFilters: PropTypes.array,
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    pathId: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  t: PropTypes.func
};

OpenshiftView.defaultProps = {
  graphQuery: {
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  initialOption: 'cores',
  initialFilters: [
    { id: 'cores', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'sockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'thresholdSockets' },
    { id: 'thresholdCores' }
  ],
  t: helpers.noopTranslate
};

const makeMapStateToProps = reduxSelectors.view.makeView(OpenshiftView.defaultProps);

const ConnectedOpenshiftView = connectTranslate(makeMapStateToProps)(OpenshiftView);

export { ConnectedOpenshiftView as default, ConnectedOpenshiftView, OpenshiftView };
