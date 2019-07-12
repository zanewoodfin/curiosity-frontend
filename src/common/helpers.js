import {
  global_breakpoint_xs as globalBreakpointXs,
  global_breakpoint_sm as globalBreakpointSm,
  global_breakpoint_md as globalBreakpointMd,
  global_breakpoint_lg as globalBreakpointLg,
  global_breakpoint_xl as globalBreakpointXl,
  global_breakpoint_2xl as globalBreakpoint2xl
} from '@patternfly/react-tokens';

const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

const noop = Function.prototype;

const noopPromise = Promise.resolve({});

const noopTranslate = (key, value) => value || `t('${key}')`;

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

const PROD_MODE = process.env.REACT_APP_ENV === 'production';

const REVIEW_MODE = process.env.REACT_APP_ENV === 'review';

const TEST_MODE = process.env.REACT_APP_ENV === 'test';

const PUBLIC_URL = process.env.PUBLIC_URL || '/';

const UI_VERSION = process.env.REACT_APP_UI_VERSION;

const breakpoints = {
  xs: parseInt(globalBreakpointXs.value, 10),
  sm: parseInt(globalBreakpointSm.value, 10),
  md: parseInt(globalBreakpointMd.value, 10),
  lg: parseInt(globalBreakpointLg.value, 10),
  xl: parseInt(globalBreakpointXl.value, 10),
  xl2: parseInt(globalBreakpoint2xl.value, 10)
};

const helpers = {
  generateId,
  noop,
  noopPromise,
  noopTranslate,
  DEV_MODE,
  PROD_MODE,
  REVIEW_MODE,
  TEST_MODE,
  PUBLIC_URL,
  UI_VERSION,
  breakpoints
};

export { helpers as default, helpers };