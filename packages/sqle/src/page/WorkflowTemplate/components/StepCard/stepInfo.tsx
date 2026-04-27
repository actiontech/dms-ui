import {
  IUserTipResV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';
import {
  IStepInfoDataProps,
  IStepInfoProps,
  StepInfoArrowEnum,
  StepInfoEnum
} from './index.type';
import { TemplateLevelStyleWrapper } from './style';
import UserAvatar from '../UserAvatar';
import {
  PaperPlaneFilled,
  HonourFilled,
  StampFilled,
  PlusFileFilled,
  UserCircleFilled
} from '@actiontech/icons';

const renderReviewUser = (
  type: 'review' | 'exec',
  stepItem: IWorkFlowStepTemplateResV1,
  userList: IUserTipResV1[],
  theme: IStepInfoProps['theme']
) => {
  if (stepItem.assignee_user_id_list?.length === 0) {
    if (stepItem.approved_by_authorized && type === 'review') {
      return (
        <>
          <UserCircleFilled
            color={theme?.workflowTemplate.userCircleFilled}
            width={18}
            height={18}
          />
          <span className="review-exec-auth-text">
            {t(
              'workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
            )}
          </span>
        </>
      );
    } else if (stepItem.execute_by_authorized && type === 'exec') {
      return (
        <>
          <UserCircleFilled
            color={theme?.workflowTemplate.userCircleFilled}
            width={18}
            height={18}
          />
          <span className="review-exec-auth-text">
            {t(
              'workflowTemplate.progressConfig.exec.executeUserType.matchExecute'
            )}
          </span>
        </>
      );
    }
    return '-';
  }

  return (
    stepItem.assignee_user_id_list?.map((nameItem, index) => {
      const currentUser = userList.find(
        (userItem: IUserTipResV1) => userItem?.user_id === nameItem
      );
      return (
        <UserAvatar
          data={currentUser?.user_name ?? nameItem}
          key={`${nameItem}-${index}`}
        />
      );
    }) ?? '-'
  );
};

export const stepInfo = (props: IStepInfoProps): IStepInfoDataProps[] => {
  const isUpdateMode = props.mode === StepInfoEnum.update;
  return [
    {
      key: 'honour-step',
      show: isUpdateMode,
      disabled: !(props?.currentStep === 0),
      icon: (
        <span className="honour-icon">
          <HonourFilled
            fill="currentColor"
            color={props.theme?.workflowTemplate.common}
            width={14}
            height={14}
          />
        </span>
      ),
      arrow: StepInfoArrowEnum.none,
      title: t('workflowTemplate.form.label.allowSubmitWhenLessAuditLevel'),
      desc: (
        <TemplateLevelStyleWrapper>
          <span className="level-step-desc">
            {t('workflowTemplate.progressConfig.levelStep.desc')}
          </span>
          {props.level}
        </TemplateLevelStyleWrapper>
      )
    },
    {
      key: 'add-file-step',
      show: true,
      disabled:
        isUpdateMode && (!!props?.currentStep || props?.currentStep === 0),
      icon: (
        <span className="add-file-icon">
          <PlusFileFilled
            fill="currentColor"
            color={props.theme?.workflowTemplate.common}
            width={14}
            height={14}
          />
        </span>
      ),
      arrow: StepInfoArrowEnum.double,
      title: t('workflowTemplate.progressConfig.createStep.title'),
      desc: t('workflowTemplate.progressConfig.createStep.desc')
    },
    ...props.reviewStepData.map((stepItem, index) => ({
      key: `review-step-${index}`,
      show: true,
      disabled: isUpdateMode && !(props?.currentStep === index + 1),
      active: isUpdateMode && props?.currentStep === index + 1,
      icon: (
        <span className="audit-icon">
          <StampFilled
            fill="currentColor"
            color={props.theme?.workflowTemplate.common}
            width={14}
            height={14}
          />
        </span>
      ),
      arrow:
        props.reviewStepData.length - 1 === index
          ? StepInfoArrowEnum.double
          : StepInfoArrowEnum.single,
      title: (
        <>
          {t('workflowTemplate.progressConfig.review.title')}
          <span className="review-index-text">{`#${index + 1}`}</span>
        </>
      ),
      desc: stepItem.desc ?? '-',
      operatorTitle: t('workflowTemplate.form.label.reviewUser'),
      operator: renderReviewUser(
        'review',
        stepItem,
        props.usernameList,
        props.theme
      )
    })),
    {
      key: 'send-plane-step',
      show: true,
      disabled:
        isUpdateMode &&
        !(props.currentStep === props.reviewStepData.length + 1),
      icon: (
        <span className="send-plane-icon">
          <PaperPlaneFilled
            fill="currentColor"
            color={props.theme?.workflowTemplate.common}
            width={14}
            height={14}
          />
        </span>
      ),
      arrow: StepInfoArrowEnum.none,
      title: t('workflowTemplate.progressConfig.exec.title'),
      desc: props.execStepData?.desc ?? '-',
      operatorTitle: t('workflowTemplate.form.label.execUser'),
      operator: renderReviewUser(
        'exec',
        props?.execStepData,
        props.usernameList,
        props.theme
      )
    }
  ];
};
