import React from 'react';
import { Row, Col, Divider } from 'antd';

import Page from '@/components/Page';

import styles from './patents.module.less';

const Patents = (props) => {
    const { appModel } = props;

    return (
        <Page ableFor={{ subject: 'patents' }}>
            <div className={styles.patents}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <ul>
                            <li>
                                System, method, and co mputer program for a media service platform
                                <br />
                                US 12058424, Issued Jan 3, 2023
                            </li>
                            <li>
                                System, method, and computer program for blockchain-based entity group management
                                <br /> US 11606424,  Issued Mar 14, 2023.
                            </li>
                            <li>
                                System, method and computer program for orchestrating loosely coupled services
                                <br /> US 11456931,  Issued Sep 27, 2022
                            </li>
                            <li>
                                System, method, and computer program for electronic form customization
                                <br /> US 11416675,  Issued Aug 16, 2022
                            </li>
                            <li>
                                System, method, and computer program for making travel route recommendations based on a
                                network quality of service
                                <br /> US 11317244,  Issued Apr 26, 2022
                            </li>
                            <li>
                                SYSTEM, METHOD, AND COMPUTER PROGRAM FOR UNOBTRUSIVE PROPAGATION OF SOLUTIONS FOR
                                DETECTED INCIDENTS IN COMPUTER APPLICATIONS
                                <br /> 20230291669,  Issued Mar 8, 2022
                            </li>
                            <li>
                                System, method, and computer program for implementing trustable, unobtrusive webpage
                                monitoring and correcting based on validation rules
                                <br /> US 10831856,  Issued Nov 20, 2020
                            </li>
                            <li>
                                System, method, and computer program for utilizing an open and global/private blockchain
                                system for virtual network function (VNF) certification and consumption processes
                                <br /> US 10764160,  Issued Sep 1, 2020
                            </li>
                            <li>
                                SYSTEM, METHOD, AND COMPUTER PROGRAM FOR GENERATING VOLUMETRIC VIDEO
                                <br /> US 20210289194,  Issued Mar 12, 2020
                            </li>
                            <li>
                                System, method, and computer program for real-time cyber intrusion detection and
                                intruder identity analysis US 10419480,  Issued Sep 17, 2019
                            </li>
                            <li>
                                System, method, and computer program for performing distributed outsourced computing
                                <br /> US 11012501,  Issued Apr 3, 2019
                            </li>
                            <li>
                                Enhanced Object Organization in a ContainerEnhanced Object Organization in a Container
                                <br />
                                US 20160041698,  Issued Feb 11, 2016
                            </li>
                            <li>
                                DYNAMIC MANAGEMENT OF SITE COMPONENTSDYNAMIC MANAGEMENT OF SITE COMPONENTS
                                <br /> US 20160188546,  Issued Dec 31, 2014
                            </li>
                            <li>
                                METHOD AND SYSTEM FOR A CROWD SERVICE STOREMETHOD AND SYSTEM FOR A CROWD SERVICE STORE
                                <br />
                                US 20160100003,  Issued Oct 7, 2014
                            </li>
                            <li>
                                SYSTEMS AND METHODS FOR CODE INSTRUMENTATION FOR ANALYTICSSYSTEMS AND METHODS FOR CODE
                                INSTRUMENTATION FOR ANALYTICS
                                <br /> US 20160078388,  Issued Sep 15, 2014
                            </li>
                            <li>
                                SMART OPEN POPUP WINDOWSMART OPEN POPUP WINDOW
                                <br /> US 20150095840,  Issued Sep 30, 2013
                            </li>
                            <li>
                                INJECTING PATCH CODE AT RUNTIMEINJECTING PATCH CODE AT RUNTIME
                                <br /> US 20150007156,  Issued Jun 26, 2013
                            </li>
                            <li>
                                VIEWING PREVIOUS CONTEXTUAL WORKSPACESVIEWING PREVIOUS CONTEXTUAL WORKSPACES
                                <br /> US 20130139081,  Issued May 30, 2013
                            </li>
                            <li>
                                CONTENT-DRIVEN LAYOUTCONTENT-DRIVEN LAYOUT
                                <br /> US 20140281928,  Issued Mar 12, 2013
                            </li>
                            <li>
                                Smart and Flexible Layout Context ManagerSmart and Flexible Layout Context Manager
                                <br /> US 20130167072,  Issued Dec 22, 2011
                            </li>
                            <li>
                                METHOD AND AN APPARATUS FOR AUTOMATIC CAPTURINGMETHOD AND AN APPARATUS FOR AUTOMATIC
                                CAPTURING
                                <br /> US US20120162246,  Issued Dec 23, 2010
                            </li>
                            <li>
                                Managing a Contextual WorkspaceManaging a Contextual Workspace
                                <br /> US 13/252,549,  Filed Oct 4, 2011
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Patents;
