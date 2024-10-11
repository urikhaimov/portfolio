import React from 'react';
import { Row, Col, Divider } from 'antd';

import Page from '@/components/Page';


import foresight from '@/assets/images/foresight_works_logo.png';
import varonis  from '@/assets/images/varonis_logo.png';
import sysaid from '@/assets/images/sysaid.png'
import applovin from '@/assets/images/applovin.png'
import trends from '@/assets/images/trends.png';


import styles from './experience.module.less';

const Experience = (props) => {
    const { appModel } = props;

    return (
        <Page ableFor={{ subject: 'experience' }}>
            <div className={styles.experience}>
                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                    <div>Software Engineer</div>
                        Foresight, 2023 - Present
                        <img src={foresight} alt={'Foresight'}/>
                       
                    </Col>
                    <Col span={18}>
                        <ul>
                            <li><b>About Company: </b> Foresight Energy is a leading producer of thermal coal
                            with reserves in the Illinois Basin.</li>
                            
                            <li>
                                <b>Implementation:</b> Developed a custom dashboard utilizing existing components, focusing on major refactoring to enhance component reusability and functionality using React.js + Typescript+ Zustand.js
                            </li>
                            <li>
                                <b>Testing:</b> Conducted thorough testing using @testing-library and jest to ensure
                                high-quality, bug-free code. Implemented automated testing strategies to streamline the
                                development process.
                            </li>
                          
                            <li>
                                <b>Technologies Used:</b> React, @testing-library, Jest, Zustand
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Divider />
                
               
                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>Software Engineer</div>
                       Varonis, 2021 - 2022
                        <img src={varonis} alt={'Varonis'}/>
                    </Col>
                    <Col span={18}>
                        <ul>
                            <li><b>About Company:</b> All-in-one platform designed to automatically detect critical data, eliminate exposures, 
                                                        and mitigate threats, signifcantly reducing the risk of data breaches</li>
                           
                            <li>
                                <b>Implementation:</b>Contributed to Varonis' all-in-one platform designed to
                                        automatically detect critical data, eliminate exposures,
                                        and mitigate threats, signifcantly reducing the risk of data
                                        breaches. Led the refactoring and development of
                                        custom system flters to enhance performance and
                                        precision.</li>
                            <li>
                                <b>Testing:</b> Conducted thorough testing to ensure high-quality, bug-free code.
                                Implemented automated testing strategies to streamline the development process.
                            </li>
                          
                            <li>
                                <b>Technologies Used:</b> React, Appolo, third libraries
                            </li>
                        </ul>
                    </Col>
                </Row>


                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>Senior Front End Developer</div>
                       Appovin, 2020 - 2021
                        <img src={applovin} alt={'Appovin'}/>
                    </Col>
                    <Col span={18}>
                        <ul>
                          
                            <li>
                                <b>About Company:</b> AppLovin creates meaningful connections by empowering your
                                    business to bring ideas, products, and content to your ideal  customers.</li>
                            <li>
                                <b>Integration:</b> At AppLovin, which empowers businesses to connect with their ideal customers by delivering innovative ideas, products, and content, I facilitated the integration of a
                                                    new API to streamline operations and enhance platform
                                                    functionality</li>
                            <li>
                                <b>Testing:</b> Conducted thorough testing to ensure high-quality, bug-free code.
                                Implemented automated testing strategies to streamline the development process.
                            </li>
                          
                            <li>
                                <b>Technologies Used:</b> React, Redux, Swagger
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>Senior Front End Developer</div>
                       SysAid, 2017 - 2020
                        <img src={sysaid} alt={'SysAid'}/>
                    </Col>
                    <Col span={18}>
                        <ul>
                          
                            <li>
                                <b>About Company:</b> Sysaid - Next-Gen IT Service Managment
                            </li>

                            <li>
                              <b>Design: </b> Designed and architected scalable and maintainable front-end solutions using React, Redux, focusing on
                                performance and user experience.
                            </li>
                            <li>
                                <b>Implementation:</b> Developed and maintained complex front-end application (Task Management System),
                                        implementing features and functionalities,.
                            </li>
                            <li>
                                <b>Testing:</b> Conducted thorough testing to ensure high-quality, bug-free code.
                                Implemented automated testing strategies to streamline the development process.
                            </li>
                          
                            <li>
                                <b>Technologies Used:</b> React, Redux, Swagger
                            </li>
                        </ul>
                    </Col>
                </Row>



                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>Senior Front End Developer</div>
                        Google (Vendor), 2016 - 2017
                        <img src={trends} alt={'Google Trends'}/>
                    </Col>
                    <Col span={18}>
                        <ul>
                            <li>
                                <b>API Development:</b> Developed and maintained APIs to support seamless integration
                                between front-end and back-end systems, ensuring robust and secure data exchange.
                            </li>
                            <li>
                                <b>Testing:</b> Implemented comprehensive testing strategies to ensure high-quality,
                                bug-free code. Conducted unit and integration tests to validate functionality and
                                performance.
                            </li>
                          
                            <li>
                                <b>Technologies Used:</b>  Angular 
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Divider/>
            </div>
        </Page>
    );
};

export default Experience;
