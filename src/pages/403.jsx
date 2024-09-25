import React from 'react';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';

import ErrorPage from '@/components/Page/Error';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 */
function page403(props = {}) {
  const intl = useIntl();

  const { ableFor = {} } = props;
  const { action = 'read', subject = 'page403' } = ableFor;

  const page = (
      <ErrorPage subTitle={t(intl, 'error.page403')}
                 subject={'page403'}
                 status={403}/>
  );

  const isRedirect = subject === 'page403';

  return isRedirect ? page : (
      <Can not I={action} a={subject}>{page}</Can>
  );
}

export default page403;
