import React from 'react';
import { useIntl } from '@umijs/max';

import ErrorPage from '@/components/Page/Error';

import { t } from '@/utils/i18n';

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 */
const pageWarning = (props = {}) => {
  const intl = useIntl();

  const {
    subject = 'pageWarning',
    title = t(intl, 'error.warning'),
    subTitle = t(intl, 'error.warningMsg')
  } = props;

  return (
      <ErrorPage title={title}
                 subTitle={subTitle}
                 subject={subject}
                 status={'warning'}/>
  );
};

export default pageWarning;