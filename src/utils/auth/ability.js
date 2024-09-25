import { createMongoAbility, AbilityBuilder } from '@casl/ability';

import { STATUSES } from '@/utils/state';

/**
 * @description Defines the user's ability to access the application.
 * @export
 * @param user
 * @return {AbilityBuilder}
 */
export async function defineAbilityFor({ user }) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user) {

    // Read-write access to everything
    // can(['manage'], 'all');

    can(['manage'], user.id);

    can(['read', 'access'], 'subscription');
    can(['read', 'access'], 'subscriptions');

    can(['read'], 'profiles');

    can(['read', 'access'], 'businesses');
    can(['read'], 'business');

    // TODO (teamco): Adapt to business permissions.
    can(['manage'], 'scheduler');

    can(['read', 'access'], 'logout');

  } else {
    cannot(['access'], 'logout');
  }

  can(['create'], 'error.logs');

  // TODO (teamco): Adapt to business permissions.
  can(['signup'], 'business');

  can(['read', 'create'], 'notifications');

  can(['access'], 'login');

  can(['read'], 'home');
  can(['read'], 'subscriptions');
  can(['read'], 'features');

  can(['read'], 'page404');
  can(['read'], 'page403');
  can(['read'], 'page500');
  can(['read'], 'pageWarning');

  return build();
}

/**
 * @description Updates the user's ability to access the business, profile, etc.
 * @export
 * @async
 * @param props
 */
export async function updateAbility(props = {}) {
  const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);
  const { ability, user, business } = props;

  /**
   * @description Handles the user's access to the entities.
   * @param entities
   * @param access
   * @private
   */
  function _handleAccess(entities = [], access) {
    for (let entity of entities) {
      can(access, entity.id);
    }
  }

  if (user?.subscription) {
    can(['unsubscribe'], user.id);

    can(['read', 'create'], 'business');

    if (business) {
      const {
        id,
        status,
        ownerByRef,
        addresses = [],
        products = []
      } = business;

      // Business owners can manage their businesses.
      if (ownerByRef === user.uid) {
        can(['manage'], id);
        can(['manage.employees'], id);
        can(['create'], 'address');
        can(['create'], 'service');

        _handleAccess(addresses, ['manage']);
        _handleAccess(products, ['manage']);

      } else if (status === STATUSES.active) {
        can(['read'], id);

        _handleAccess(addresses, ['read']);
        _handleAccess(products, ['read']);
      }
    }
  }

  ability.update([...ability.rules, ...rules]);
}
