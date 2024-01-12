import {
  IUserTipResV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export interface IStepCardProps {
  stepCardKey?: string;
  key: string;
  disabled: boolean;
  title: React.ReactNode;
  desc: React.ReactNode;
  operatorTitle?: string;
  operator?: React.ReactNode;
  active?: boolean;
  indexNumber?: number;
  close?: () => void;
  click?: (index: number) => void;
}

export enum StepInfoEnum {
  detail = 'detail',
  update = 'update'
}

export enum StepInfoArrowEnum {
  double = 'double',
  single = 'single',
  none = 'none'
}

export interface IStepInfoProps {
  level?: React.ReactNode;
  currentStep?: number;
  mode: StepInfoEnum;
  reviewStepData: IWorkFlowStepTemplateResV1[];
  execStepData: IWorkFlowStepTemplateResV1;
  usernameList: IUserTipResV1[];
}

export interface IStepInfoDataProps extends IStepCardProps {
  icon: React.ReactNode;
  show: boolean;
  arrow: StepInfoArrowEnum;
  removeReviewNode?: () => void;
  clickReviewNode?: (index: number) => void;
}

export interface IUpdateWorkflowStepInfoProps {
  currentStep?: number;
  authLevel:
    | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
    | undefined;
  reviewStepData: IWorkFlowStepTemplateResV1[];
  execStepData: IWorkFlowStepTemplateResV1;
  addReviewNode: () => void;
  removeReviewNode: () => void;
  exchangeReviewNode: (from: number, to: number) => void;
  clickReviewNode: (index: number) => void;
  usernameList: IUserTipResV1[];
}
