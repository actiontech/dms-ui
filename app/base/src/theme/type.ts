import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type SideMenuTheme = {
  suffixIconColor: string;
  projectSelector: {
    dropdown: {
      labelColor: string;
      iconColor: string;
      activeIconColor: string;
      groupLabelColor: string;
    };
  };
  availabilityZoneSelector: {
    dropdown: {
      boxShadowColor: string;
    };
  };
};

export type GuidanceTheme = {
  padding: number;
  gap: number;
  sceneSegmented: {
    backgroundColor: string;
    borderBottom: string;
  };
  steps: {
    icon: {
      width: number;
      height: number;
      backgroundColor: string;
    };
    connection: {
      width: number;
      gap: number;
      backgroundColor: string;
    };
    step: {
      border: string;
      title: {
        borderRight: string;
        index: {
          color: string;
        };
        text: {
          color: string;
        };
      };
      content: {
        desc: {
          color: string;
        };
      };
    };
  };
  guidanceButton: {
    default: {
      background: string;
      color: string;
    };
    hover: {
      background: string;
      color: string;
    };
  };
};

export type SystemTheme = {
  configButton: {
    backgroundColor: string;
    border: string;
  };
  logo: {
    boxShadow: string;
  };
};

export type DataExportTheme = {
  create: {
    form: {
      baseInfoTitleIconColor: string;
    };
  };
  statistics: {
    auditResultStatusColor: {
      [key in WorkflowRecordStatusEnum]: string;
    };
  };
};

export type IconTheme = {
  bindUser: {
    user: string;
    password: string;
  };
  dataExport: {
    infoCircle: string;
    clock: string;
  };
  home: {
    common: string;
  };
  system: {
    basicTitleTips: string;
    modify: string;
  };
};

export type ResourceOverviewTheme = {
  icon: {
    databaseFilled: string;
    schemaFilled: string;
  };
  chart: {
    pieStroke: string;
    markStroke: string;
    markShowdowColor: string;
    activeStroke: string;
  };
};
