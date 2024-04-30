import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type OrderTheme = {
  orderList: {
    orderDesc: {
      copyIconColor: string;
      hoverCopyIconBackgroundColor: string;
    };
  };
  createOrder: {
    auditResult: {
      auditResultDrawer: {
        numberColor: string;
      };
      toggleButton: {
        borderColor: string;
        color: string;
        activeColor: string;
        bgColor: string;
        activeBgColor: string;
      };
      download: {
        borderColor: string;
        bgColor: string;
        boxShadow: string;
        itemColor: string;
        itemHoverColor: string;
        itemIconColor: string;
      };
    };
    form: {
      baseInfoTitleIconColor: string;
    };
    editForm: {
      titleColor: string;
      projectFlagIconColor: string;
    };
  };
  orderSteps: {
    boxShadow: string;
  };
  common: {
    basicInfo: {
      borderColor: string;
      bgColor: string;
      titleColor: string;
      descColor: string;
    };
    auditResultFilter: {
      borderColor: string;
      bgColor: string;
      auditResultInfo: {
        itemBgColor: string;
        textColor: string;
        schemaValueColor: string;
      };
      options: {
        bgColor: string;
        activeBgColor: string;

        textColor: string;
        textActiveColor: string;
        numColor: string;
        numActiveColor: string;
      };
    };
  };
};

export type ReportStatisticsTheme = {
  bgColor: string;
  loadingColor: string;
  cardShow: {
    titleColor: string;
    iconColor: string;
    numberContColor: string;
    noteColor: string;
    contentFontSize: number;
    contentFontWeight: number;
  };
  CardWrapper: {
    titleColor: string;
    titleBorderColor: string;
  };
  TableTopList: {
    titleColor: string;
    noteTipColor: string;
    colorFillQuaternary: string;
    bgColor: {
      toColor: string;
      line1: string;
      line2: string;
      line3: string;
    };
  };
  ChartContTitle: {
    mainColor: string;
    mainSubColor: string;
    subContColor: string;
  };
  DatabaseTypeOrder: {
    default: {
      fontSize: number;
    };
    tooltip: {
      background: string;
      border: string;
      boxShadow: string;
    };
  };
  DatabaseSourceOrder: {
    default: {
      colorText: string;
      colorTextTertiary: string;
    };
  };
  LicenseStatistics: {
    ChartContTitle: {
      lineColor: string;
    };
    LicenseColumn: {
      defaultColor: string;
      fillColor: {
        column: string;
        columnBackground: string;
        xAxis: string;
        yAxis: string;
        state: {
          active: string;
        };
      };
    };
  };
  WorkOrderState: {
    ChartContTitle: {
      color: string;
      noteSubColor: string;
    };
  };
};

export type StatisticsTheme = {
  rectColor: string[];
  rectColorName: { [key: string]: string };
  auditRateStatus: {
    success: {
      color: string;
      bg: string;
    };
    warning: {
      color: string;
      bg: string;
    };
    error: {
      color: string;
      bg: string;
    };
    tip: {
      color: string;
      bg: string;
    };
  };
  auditResultStatusColor: {
    [key in WorkflowRecordResV2StatusEnum]: string;
  };
};

export type ProjectOverviewTheme = {
  SqlCount: {
    baseColor: string;
    grayColor: string;
  };
  DataSourceCount: {
    health: string;
    risk: string;
  };
  ProjectScore: {
    level: {
      dangerous: string;
      warning: string;
      good: string;
      excellent: string;
    };
    indicator: {
      pointer: string;
      pin: {
        fill: string;
        stroke: string;
      };
    };
  };
  ScanTask: {
    bar: {
      fill: string;
      bg: string;
      activeColor: string;
      label: {
        fill: string;
      };
      toolTip: {
        dotColor: string;
      };
    };
    detail: {
      stroke: string;
    };
  };
  DataSourcePerformance: {
    bar: {
      fill: string;
      bg: string;
    };
    toolTip: {
      dotColor: string;
    };
  };
};

export type AuditPlanTheme = {
  detail: {
    tag: {
      default: {
        background: string;
      };
      primary: {
        background: string;
      };
      icon: {
        color: string;
      };
    };
  };
};

export type WorkflowTemplateTheme = {
  progress: {
    normal: string;
    notice: string;
    warning: string;
    error: string;
    remainColor: string;
  };
  step: {
    honour: string;
    addFile: string;
    audit: string;
    sendPlane: string;
  };
  stepCard: {
    userAvatarBorder: string;
    boxShadow: string;
    hoverBoxShadow: string;
    backgroundColor: string;
    disableBorder: string;
    disabledBackgroundColor: string;
    disableHoverBackgroundColor: string;
    cardDesc: string;
    cardOperator: {
      borderTop: string;
      titleColor: string;
    };
    stepLineColor: string;
    stepReviewIndexTextColor: string;
    closeButtonBoxShadow: string;
    closeButtonFontSize: string;
    cardTitleFontWeight: number;
    descFontSize: string;
    operatorTitleFontWeight: number;
    stepReviewIndexTextFontWeight: number;
    authTextColor: string;
  };
  updateWorkflowTemplateStepInfo: {
    titleFontSize: string;
    titleFontWeight: number;
    infoFontSize: string;
    title: {
      titleWrapperBorderBottom: string;
      titleColor: string;
      titleInfoColor: string;
    };
    info: {
      titleColor: string;
    };
    stepInfoWrapper: {
      border: string;
      backgroundColor: string;
      textColor: string;
    };
    stepNodeAlert: {
      backgroundColor: string;
      alertTitleColor: string;
      alertContentColor: string;
    };
  };
  workflowTemplateAuthInfo: {
    topLevelFontWeight: number;
    authLevelFontWeight: number;
    authLevelFontSize: string;
    authInfoFontSize: string;
    borderBottom: string;
    authInfoColor: string;
  };
};
