import {
  IUserTipResV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';
import {
  IStepInfoDataProps,
  StepInfoArrowEnum,
  StepInfoEnum
} from '../../components/StepCard/index.type';
import UserAvatar from '../../components/UserAvatar';
import {
  PaperPlaneFilled,
  StampFilled,
  PlusFileFilled,
  UserCircleFilled
} from '@actiontech/icons';
import { IconTheme } from '../../../../theme/type';

const renderAssigneeUser = (
  type: 'review' | 'exec',
  stepItem: IWorkFlowStepTemplateResV1,
  userList: IUserTipResV1[],
  theme?: IconTheme
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
              'workflowTemplate.dataExport.reviewUserType.matchExportApproval'
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
              'workflowTemplate.dataExport.execUserType.matchExportExecute'
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

interface IDataExportStepInfoArgs {
  currentStep?: number;
  mode: StepInfoEnum;
  reviewStepData: IWorkFlowStepTemplateResV1[];
  execStepData?: IWorkFlowStepTemplateResV1;
  hasExecStep: boolean;
  usernameList: IUserTipResV1[];
  theme?: IconTheme;
}

export const dataExportStepInfo = (
  props: IDataExportStepInfoArgs
): IStepInfoDataProps[] => {
  const isUpdateMode = props.mode === StepInfoEnum.update;

  const steps: IStepInfoDataProps[] = [
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
      title: t('workflowTemplate.dataExport.createStep.title'),
      desc: t('workflowTemplate.dataExport.createStep.desc')
    },
    ...props.reviewStepData.map((stepItem, index) => ({
      key: `review-step-${index}`,
      show: true,
      disabled: isUpdateMode && !(props?.currentStep === index),
      active: isUpdateMode && props?.currentStep === index,
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
          {t('workflowTemplate.dataExport.reviewTitle')}
          <span className="review-index-text">{`#${index + 1}`}</span>
        </>
      ),
      desc: stepItem.desc ?? '-',
      operatorTitle: t('workflowTemplate.dataExport.reviewUser'),
      operator: renderAssigneeUser(
        'review',
        stepItem,
        props.usernameList,
        props.theme
      )
    }))
  ];

  if (props.hasExecStep && props.execStepData) {
    steps.push({
      key: 'send-plane-step',
      show: true,
      disabled:
        isUpdateMode &&
        !(props.currentStep === props.reviewStepData.length),
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
      title: t('workflowTemplate.dataExport.execTitle'),
      desc: props.execStepData?.desc ?? '-',
      operatorTitle: t('workflowTemplate.dataExport.execUser'),
      operator: renderAssigneeUser(
        'exec',
        props.execStepData,
        props.usernameList,
        props.theme
      )
    });
  }

  return steps;
};
