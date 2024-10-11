import React from 'react';
import { Row, Col } from 'antd';

import Page from '@/components/Page';

import avatar from '@/assets/images/avatar.png';

import styles from './home.module.less';

export const Home = (props) => {
    const { appModel } = props;

    return (
        <Page ableFor={{ subject: 'home' }}>
            <div className={styles.homeWrapper}>
                <Row gutter={[24, 24]}>                    
                    <Col span={6}>
                        <img src={avatar} alt={'Uri Khaimov'} />
                    </Col>
                    <Col span={18}>
                        <ul>
                            <li>
                                I am a passionate and experienced front-end developer with a strong track record of
                                successfully developing user-friendly and visually appealing web applications. I am
                                proficient in HTML, CSS, and JavaScript, and I am also experienced with a variety of
                                front-end frameworks and libraries, such as React (UmiJs + AntD), Angular,
                                test libraries such as Jest, etc.
                            </li>
                            <li>
                                I am a highly motivated and results-oriented individual with a strong attention to
                                detail. I am also a team player and always willing to learn new things. I have the
                                skills and experience to be a valuable asset to your team.
                            </li>
                            <li>
                                I am also a strong believer in continuous learning, and I am always looking for new ways
                                to improve my skills. I am currently enrolled in a course on React Native and I am also
                                learning about new front-end frameworks and libraries.
                            </li>
                            <li>
                                I am confident that I can use my skills and experience to help your company achieve its
                                goals. I am a hard worker, and I am always willing to go the extra mile. I am also a
                                team player and always willing to help others.
                            </li>
                            <li>
                                I am eager to learn more about your company and the position you are hiring for. I am
                                confident that I would be a valuable asset to your team.
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};
