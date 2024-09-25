import { findUser } from '@/services/user.service';
import { fbFindById } from '@/services/firebase.service';

import { dateTimeFormat } from '@/utils/timestamp';

/**
 * @constant
 * @param byRef
 * @return {Promise<*>}
 * @private
 */
const _getUserRef = async (byRef) => {
  let _byRef = byRef;
  if (typeof byRef === 'string') {
    // Handle server stored Id.
    _byRef = await fbFindById({ collectionPath: 'users', docName: byRef });
  }

  return _byRef;
};

/**
 * @export
 * @async
 * @param props
 * @return {Promise<*>}
 */
export async function detailsInfo(props = {}) {
  const { entity = {} } = props;

  const { metadata, ownerByRef } = entity;
  const { updatedByRef, createdByRef, createdAt, updatedAt } = metadata;

  const belongsTo = ownerByRef ?
      await findUser({ id: ownerByRef, field: 'uid' }) : { data: null };

  const updatedBy = ownerByRef === updatedByRef ?
      belongsTo : await findUser({ id: updatedByRef, field: 'uid' });

  // Reduce round trip to firebase.
  const createdBy = createdByRef === updatedByRef ?
      updatedBy : await findUser({ id: createdByRef, field: 'uid' });

  return {
    belongsTo: belongsTo?.data?.displayName,
    updatedBy: updatedBy?.data?.displayName,
    createdBy: createdBy?.data?.displayName,
    createdAt: dateTimeFormat(createdAt),
    updatedAt: dateTimeFormat(updatedAt)
  };
}

