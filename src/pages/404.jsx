import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 */
function page404(props) {
  const intl = useIntl();

  const { subject = 'page404' } = props;

  return (
      <ErrorPage subTitle={t(intl, 'error.page404')}
                 subject={subject}
                 status={404}/>
  );
}

export default page404;
