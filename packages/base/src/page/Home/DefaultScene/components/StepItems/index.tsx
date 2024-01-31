import { Row, Col, Space } from 'antd';
import { UserDevopsStepsFactory } from '../../index.type';
import GuidanceButton from '../GuidanceButton';

const StepItems: React.FC<{ steps: UserDevopsStepsFactory }> = ({ steps }) => {
  return (
    <>
      {steps.map((step, stepIndex) => (
        <Row
          key={step.key}
          className="step-container"
          align={'middle'}
          wrap={false}
        >
          <Col flex="40px" className="icon-wrapper">
            {step.icon}
          </Col>
          <Col flex="auto" className="step-box">
            <div className="title-wrapper">
              <div className="inner-title-wrapper">
                <div className="step-index">{`STEP${stepIndex + 1}`}</div>
                <div className="step-title">{step.title}</div>
              </div>
            </div>
            <Row wrap={false}>
              {step.children.map((stepChild) => (
                <Col className="content-wrapper" key={stepChild.key} span={8}>
                  <div className="sub-title">{stepChild.title}</div>
                  <div className="desc">{stepChild.content}</div>
                  <Space className="actions" size={[8, 8]} wrap>
                    {(stepChild?.buttons ?? []).map((button) => (
                      <GuidanceButton
                        key={button.label}
                        onClick={button.action}
                      >
                        {button.label}
                      </GuidanceButton>
                    ))}
                  </Space>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default StepItems;
