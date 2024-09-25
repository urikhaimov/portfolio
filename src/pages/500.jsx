import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 */
function page500(props) {
  const intl = useIntl();

  const { subject = 'page500' } = props;

  return (
      <ErrorPage subTitle={t(intl, 'error.page500')}
                 subject={subject}
                 status={500}/>
  );
}

export default page500;
