import { ReactNode } from 'react';
import { Space, Row } from 'antd';
import { BasicToolTips } from '@actiontech/shared';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

export type SystemBasicTitleProps = {
  title: ReactNode | string;
  titleTip?: ReactNode | string;
  titleExtra?: ReactNode | string;
  children: ReactNode | string;
};

const SystemBasicTitle = (props: SystemBasicTitleProps) => {
  const { title, children, titleTip, titleExtra } = props;
  const { baseTheme } = useThemeStyleData();

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
              <InfoCircleOutlined
                width={14}
                height={14}
                color={baseTheme.icon.system.basicTitleTips}
              />
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
