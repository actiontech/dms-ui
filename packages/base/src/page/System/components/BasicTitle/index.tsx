import { ReactNode } from 'react';
import { Space, Row } from 'antd';
import { BasicToolTips } from '@actiontech/shared';
import { IconTipGray } from '@actiontech/shared/lib/Icon';

export type SystemBasicTitleProps = {
  title: ReactNode | string;
  titleTip?: ReactNode | string;
  titleExtra?: ReactNode | string;
  children: ReactNode | string;
};

const SystemBasicTitle = (props: SystemBasicTitleProps) => {
  const { title, children, titleTip, titleExtra } = props;

  return (
    <section className="system-form-wrapper">
      <Row
        className="config-title-wrapper has-border"
        justify={'space-between'}
        align={'middle'}
      >
        <Space>
          {title}
          {titleTip && (
            <BasicToolTips title={titleTip}>
              <IconTipGray />
            </BasicToolTips>
          )}
        </Space>
        {titleExtra}
      </Row>
      {children}
    </section>
  );
};

export default SystemBasicTitle;
