import React from 'react';
import { Button, Card } from 'antd';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { isSpinning } from '@/utils/state';
import { Can } from '@/utils/auth/can';

import styles from './subscription.module.less';

const { Meta } = Card;

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const Subscription = props => {
  const intl = useIntl();

  const {
    icon,
    idx,
    loading,
    user,
    subscription = {},
    spinOn = [],
    hoverable = true,
    bordered = true,
    subscribed = false,
    onSubscribe = stub,
    onUnSubscribe = stub
  } = props;

  const {
    name,
    type,
    price,
    maxNumberOfBusinesses,
    features = []
  } = subscription;

  return (
      <Card hoverable={hoverable}
            bordered={bordered}
            title={name}
            cover={icon}
            className={classnames(styles.subscription, {
              [styles[`card-${idx}`]]: true,
              [styles.discounted]: price.isDiscounted,
              [styles.selected]: subscribed
            })}>
        <Meta title={(
            <div className={styles.price}>
              <span className={classnames({ [styles.discounted]: price.isDiscounted })}>
                <span>{price.originalPrice}</span>
                {price.isDiscounted ? <span>{price.discountedPrice}</span> : null}
                <span>{price.currency}</span>
              </span>
              <span>{t(intl, 'subscription.price', { type })}</span>
            </div>
        )}/>
        {price.isDiscounted ? (<div className={styles.discount}/>) : null}
        <ul>
          {maxNumberOfBusinesses && (
              <li className={styles.businesses}>
                <span>{t(intl, 'subscription.businesses')}</span>
                <span>{maxNumberOfBusinesses}</span>
              </li>
          )}
          {features.map((f, i) => (
              <li key={i}>{f}</li>
          ))}
        </ul>
        {subscribed ? (
            <Can I={'unsubscribe'} a={user.id}>
              <Button type={'primary'}
                      size={'large'}
                      loading={isSpinning(loading, [...spinOn])}
                      onClick={() => onUnSubscribe(subscription)}>
                {t(intl, 'subscription.unsubscribe')}
              </Button>
            </Can>
        ) : (
            <Can I={'subscribe'} a={user.id}>
              <Button type={'primary'}
                      size={'large'}
                      loading={isSpinning(loading, [...spinOn])}
                      onClick={() => onSubscribe(subscription)}>
                {t(intl, 'subscription.subscribe')}
              </Button>
            </Can>
        )}
      </Card>
  );
};