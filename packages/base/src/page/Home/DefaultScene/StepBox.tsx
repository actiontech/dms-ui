import { Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AdminUserDevopsSteps, NormalUserDevopsSteps } from '.';
import { DefaultSceneStepContainerWrapper } from '../style';
import GuidanceButton from '../components/GuidanceButton';
import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { useCurrentUser } from '@actiontech/shared/lib/global';

// #if [ee]
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundProject from './NotFoundProject';
import { useState } from 'react';
// #endif

const StepBox: React.FC = () => {
  const { isAdmin, bindProjects } = useCurrentUser();
  const navigate = useNavigate();
  let currentProjectID = '';

  // #if [ee]
  const [
    openRulePageProjectSelectorModal,
    setOpenRulePageProjectSelectorModal
  ] = useState(false);
  const { currentProjectID: id = '', updateRecentlyProject } =
    useRecentlyOpenedProjects();
  currentProjectID = id;

  // #else
  currentProjectID = DEFAULT_PROJECT_ID;
  // #endif

  const steps = isAdmin
    ? AdminUserDevopsSteps({
        navigate,
        projectID: currentProjectID,

        // #if [ee]
        setOpenRulePageProjectSelectorModal
        // #endif
      })
    : NormalUserDevopsSteps({
        navigate,
        projectID: currentProjectID,

        // #if [ee]
        setOpenRulePageProjectSelectorModal
        // #endif
      });

  return (
    <>
      <DefaultSceneStepContainerWrapper>
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
      </DefaultSceneStepContainerWrapper>

      {/* #if [ee] */}
      <NotFoundProject
        open={openRulePageProjectSelectorModal}
        setOpen={setOpenRulePageProjectSelectorModal}
        bindProjects={bindProjects}
        updateRecentlyProject={updateRecentlyProject}
      />
      {/* #endif */}
    </>
  );
};

export default StepBox;
