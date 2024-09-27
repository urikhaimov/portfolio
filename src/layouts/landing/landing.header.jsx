import React, { useState } from 'react';
import { Button, Layout } from 'antd';
import { BranchesOutlined, SunFilled, MoonFilled, MenuOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import { useIntl, history } from '@umijs/max';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { isSpinning } from '@/utils/state';

import LandingLogin from '@/pages/authentication/login';

import Loader from '@/components/Loader';

import { HeaderActions } from './header.actions';

import styles from './landing.layout.module.less';

const { Header } = Layout;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const LandingHeader = (props) => {
    const intl = useIntl();

    const {
        testId,
        user,
        slogan,
        ability,
        theme,
        loading,
        isOnline,
        notificationBadge,
        mode = 'horizontal',
        spinOn = ['authModel/signIn', 'authModel/signOut'],
        menus = [],
        drawer = false,
        onToggleTheme = stub,
        onSignOut = stub,
        onCloseMenu = stub,
        onOpenMenu = stub
    } = props;

    const [openLogin, setOpenLogin] = useState(false);

    const _menus = [...menus];

    const spinning = isSpinning(loading, spinOn);

    return (
        <Header
            className={classnames({
                [styles.drawerWrapper]: mode === 'vertical',
                [styles.headerWrapper]: mode === 'horizontal'
            })}
        >
            <div className={styles.layoutHeader}>
                <div className={styles.headerMenu}>
                    <div className={styles.logo} onClick={() => history.push('/')}>
                        <BranchesOutlined />
                    </div>
                    {_menus.map(({ key, locale, url, subject, icon }, idx) => {
                        const isActive = history.location.pathname === url;

                        return (
                            <Button
                                key={key}
                                type={'text'}
                                icon={icon}
                                className={classnames({ [styles.activeMenu]: isActive })}
                                disabled={ability?.cannot('read', subject)}
                                onClick={() => history.push(url)}
                            >
                                {t(intl, locale)}
                            </Button>
                        );
                    })}
                    <div className={styles.slogan}>{slogan}</div>
                </div>
                <div className={styles.headerActions}>
                    <a href={'https://www.linkedin.com/in/teamco/'} target={'_blank'}>
                        <LinkedinOutlined />
                    </a>
                    <a href={'https://github.com/teamco'} target={'_blank'}>
                        <GithubOutlined />
                    </a>
                </div>
            </div>
            <LandingLogin openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </Header>
    );
};
