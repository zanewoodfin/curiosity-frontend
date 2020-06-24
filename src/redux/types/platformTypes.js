import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications/cjs';

const PLATFORM_ADD_NOTIFICATION = ADD_NOTIFICATION;
const PLATFORM_REMOVE_NOTIFICATION = REMOVE_NOTIFICATION;
const PLATFORM_CLEAR_NOTIFICATIONS = CLEAR_NOTIFICATIONS;
const PLATFORM_INIT = 'PLATFORM_INIT';
const PLATFORM_APP_NAME = 'PLATFORM_APP_NAME';
const PLATFORM_ON_NAV = 'PLATFORM_ON_NAV';
const PLATFORM_SET_NAV = 'PLATFORM_SET_NAV';

/**
 * Platform action, reducer types.
 *
 * @type {{PLATFORM_APP_NAME: string, PLATFORM_INIT: string, PLATFORM_SET_NAV: string,
 *     PLATFORM_CLEAR_NOTIFICATIONS: string, PLATFORM_ADD_NOTIFICATION: string,
 *     PLATFORM_REMOVE_NOTIFICATION: string, PLATFORM_ON_NAV: string}}
 */
const platformTypes = {
  PLATFORM_ADD_NOTIFICATION,
  PLATFORM_REMOVE_NOTIFICATION,
  PLATFORM_CLEAR_NOTIFICATIONS,
  PLATFORM_INIT,
  PLATFORM_APP_NAME,
  PLATFORM_ON_NAV,
  PLATFORM_SET_NAV
};

export {
  platformTypes as default,
  platformTypes,
  PLATFORM_ADD_NOTIFICATION,
  PLATFORM_REMOVE_NOTIFICATION,
  PLATFORM_CLEAR_NOTIFICATIONS,
  PLATFORM_INIT,
  PLATFORM_APP_NAME,
  PLATFORM_ON_NAV,
  PLATFORM_SET_NAV
};
