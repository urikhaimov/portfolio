import React from 'react';
import classnames from 'classnames';
import { Spin } from 'antd';

import styles from './Iframe.less';

class Iframe extends React.Component {
  render() {
    const {
      label,
      width = '100%',
      height = '100%',
      src,
      className,
      spinning = true,
      allowFullScreen = true,
      referrerPolicy = 'no-referrer-when-downgrade',
      allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      ...rest
    } = this.props;

    const iframe = (
        <iframe label={label}
                className={classnames(styles.iframe, className)}
                width={width}
                height={height}
                src={src}
                allow={allow}
                referrerPolicy={referrerPolicy}
                allowFullScreen={allowFullScreen}
                {...rest}/>
    );

    return spinning ? (
        <div className={styles.iframeLoader} style={{height, width}}>
          <Spin spinning={true} style={{height}}/>
          {iframe}
        </div>
    ) : iframe;
  }
}

export default Iframe;
