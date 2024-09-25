import React from 'react';

import request from '@/utils/request';
import { t } from '@/utils/i18n';

/**
 * @export
 * @async
 * @param [props]
 */
export const successSaveMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.success.create', { type: instance.toLocaleUpperCase() });

  messageApi.success(msg);
};

/**
 * @export
 * @async
 * @param [props]
 */
export const successUpdateMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.success.update', { type: instance.toLocaleUpperCase() });

  messageApi.success(msg);
};

/**
 * @export
 * @param [props]
 */
export const errorSaveMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request?.xhr?.message;

  const msg = t(intl, 'message.error.create', { type: instance.toLocaleUpperCase() });

  messageApi?.error(msg);
};

/**
 * @export
 * @param [props]
 */
export const errorUpdateMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request?.xhr?.message;

  const msg = t(intl, 'message.error.update', { type: instance.toLocaleUpperCase() });

  messageApi?.error(msg);
};

/**
 * @export
 * @param [props]
 */
export const errorGetMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.error.get', { type: instance.toLocaleUpperCase() });

  messageApi.error(msg);
};

/**
 * @export
 * @param [props]
 */
export const errorDownloadMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.error.download', { type: instance.toLocaleUpperCase() });

  messageApi.error(msg);
};

/**
 * @export
 * @param [props]
 */
export const successDeleteMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.success.delete', { type: instance.toLocaleUpperCase() });

  messageApi.success(msg);
};

/**
 * @export
 * @param [props]
 */
export const errorDeleteMsg = async (props = {}) => {
  const { instance = 'Entity' } = props;
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.error.delete', { type: instance.toLocaleUpperCase() });

  messageApi.error(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const networkError = async () => {
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.error.connection');

  messageApi.error(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const successSentVerificationEmail = async () => {
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.success.sentVerificationEmail');

  messageApi.success(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const pendingEmailVerification = async () => {
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.pending.emailVerification');

  messageApi.warning(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const errorSentVerificationEmail = async () => {
  const { messageApi, intl } = request.xhr.message;

  const msg = t(intl, 'message.error.sentVerificationEmail');

  messageApi.error(msg);
};

/**
 * @export
 * @return {Promise<void>}
 */
export const apiError = async ({ error }) => {
  const { notificationApi } = request.xhr.notification;

  notificationApi.error({
    message: error?.name,
    description: error?.message,
    placement: 'topRight',
    duration: null
  });
};
