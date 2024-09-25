import React, { useState } from 'react';
import * as flags from 'country-flag-icons/string/3x2';

import { effectHook } from '@/utils/hooks';
import { logger } from '@/utils/console';

/**
 * @export
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
export const CountryFlag = props => {
  const { country, className } = props;

  const [flag, updateFlag] = useState(null);

  effectHook(() => {
    if (country?.length) {
      if (flags[country]) {
        try {
          const buff = new Buffer(flags[country]);
          const base64data = buff.toString('base64');
          updateFlag(base64data);
        } catch (e) {
          logger({ type: 'warn', e });
        }
      } else {
        logger({ type: 'warn', warning: 'Unknown country' });
      }
    }
  }, [country]);

  return flag ? (
      <div className={className}>
        <img src={`data:image/svg+xml;base64,${flag}`} alt={country}/>
      </div>
  ) : null;
};
