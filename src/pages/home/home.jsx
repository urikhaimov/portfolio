import React from 'react';

import Page from '@/components/Page';

import styles from './home.module.less';

export const Home = props => {
  const {
    appModel
  } = props;

  return (
      <Page ableFor={{ subject: 'home' }}>
        <div className={styles.homeWrapper}>
          <h1>Home</h1>
        </div>
      </Page>
  );
};

