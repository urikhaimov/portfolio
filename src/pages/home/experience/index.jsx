import React from 'react';
import { Row, Col, Divider } from 'antd';

import Page from '@/components/Page';

import amdocs from '@/assets/images/amdocs.png';
import tests from '@/assets/images/tests.png';
import trends from '@/assets/images/trends.png';
import sap from '@/assets/images/sap.png';

import styles from './experience.module.less';

const Experience = (props) => {
    const { appModel } = props;

    return (
        <Page ableFor={{ subject: 'experience' }}>
            <div className={styles.experience}>
                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>Software Technical Expert</div>
                        Amdocs, 2017 - Present
                        <img src={amdocs} alt={'Amdocs'}/>
                        <img src={tests} alt={'Tests'}/>
                    </Col>
                    <Col span={18}>
                        <ul>
                            <li>
                                <b>Requirement Analysis:</b> Collaborated with stakeholders to gather and analyze
                                requirements for front-end development projects, ensuring alignment with business goals
                                and user needs.
                            </li>
                            <li>
                                <b>Architecture and Design:</b> Designed and architected scalable and maintainable
                                front-end solutions using React, UmiJs, and AntD, focusing on performance and user
                                experience.
                            </li>
                            <li>
                                <b>Implementation:</b> Developed and maintained complex front-end applications,
                                implementing features and functionalities using React, @testing-library, Jest, UmiJs,
                                Saga, and AntD.
                            </li>
                            <li>
                                <b>Testing:</b> Conducted thorough testing using @testing-library and jest to ensure
                                high-quality, bug-free code. Implemented automated testing strategies to streamline the
                                development process.
                            </li>
                            <li>
                                <b>Collaboration and Agile Practices:</b> Worked closely with cross-functional teams,
                                including back-end developers, designers, and product managers, following Agile
                                methodologies to deliver projects on time and within scope.
                            </li>
                            <li>
                                <b>Code Reviews and Mentorship:</b> : Participated in code reviews to maintain code
                                quality and consistency. Mentored junior developers, providing guidance and support to
                                enhance their skills and knowledge.
                            </li>
                            <li>
                                <b>Technologies Used:</b> React, @testing-library, Jest, UmiJs, Saga, AntD
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>TechLead</div>
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
                                <b>Code Reviews and Mentorship:</b> Conducted code reviews to maintain code quality and
                                consistency. Provided mentorship and guidance to junior developers, fostering a
                                collaborative and learning-oriented environment.
                            </li>
                            <li>
                                <b>People Management:</b> Managed a team of developers, assigning tasks, setting goals,
                                and monitoring progress to ensure timely and successful project completion. Facilitated
                                team meetings and encouraged open communication to address challenges and share
                                knowledge.
                            </li>
                            <li>
                                <b>Collaboration and Agile Practices:</b> Worked closely with cross-functional teams,
                                including back-end developers, designers, and product managers, following Agile
                                methodologies to deliver projects on time and within scope.
                            </li>
                            <li>
                                <b>Technologies Used:</b> Python, Angular, Java
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Divider/>
                <Row gutter={[24, 24]}>
                    <Col span={6} className={styles.info}>
                        <div>Expert Developer</div>
                        SAP Labs, 2010 - 2016
                        <img src={sap} alt={'Sap'}/>
                    </Col>
                    <Col span={18}>
                        <ul>
                            <li>
                                <b>Requirement Analysis:</b> Collaborated with stakeholders to gather and analyze
                                requirements for various on-cloud Enterprise Portal solutions, ensuring alignment with
                                business objectives and user needs.
                            </li>
                            <li>
                                <b>Architecture and Design:</b> Designed and architected scalable and maintainable
                                solutions using Ruby on Rails for the backend and jQuery for the frontend, as well as
                                HTML5, JavaScript, and jQuery/UI framework for cross-device compatibility (desktop,
                                tablets, smartphones).
                            </li>
                            <li>
                                <b>Implementation:</b> Developed and maintained the front-end for the Enterprise Portal
                                solution, implementing features and functionalities using a custom MVC framework built
                                on top of jQuery/UI. Additionally, developed and maintained the Netweaver on-cloud
                                Enterprise Portal solution using Ruby on Rails and jQuery.
                            </li>
                            <li>
                                <b>Testing:</b> Conducted thorough testing to ensure high-quality, bug-free code.
                                Implemented automated testing strategies to streamline the development process.
                            </li>
                            <li>
                                <b>Collaboration and Agile Practices:</b> Worked closely with cross-functional teams,
                                including back-end developers, designers, and product managers, following Agile
                                methodologies to deliver projects on time and within scope.
                            </li>
                            <li>
                                <b>Technologies Used:</b> Ruby on Rails, jQuery, HTML5, JavaScript, jQuery/UI, custom
                                MVC framework.
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Experience;
