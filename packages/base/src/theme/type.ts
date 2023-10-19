export type SideMenuTheme = {
  width: number;
  padding: number;
  backgroundColor: string;
  boxShadow: string;
  border: string;
  suffixIconColor: string;
  title: {
    color: string[];
  };
  projectSelector: {
    dropdown: {
      labelColor: string;
      iconColor: string;
      activeIconColor: string;
      groupLabelColor: string;
    };
  };
  menu: {
    hoverBackgroundColor: string;
    labelColor: string;
    hoverLabelColor: string;
    dividerColor: string;
    groupLabelColor: string;
  };
  globalSystem: {
    backgroundColor: string;
  };
  userNavigate: {
    border: string;
    boxShadow: string;
    backgroundColor: string;
    title: {
      border: string;
      color: string;
    };
    content: {
      hoverBackgroundColor: string;
      color: string;
    };
    footer: {
      text: {
        color: string;
      };

      iconWrapper: {
        border: string;
        backgroundColor: string;
        activeBackgroundColor: string;
        color: string;
        activeColor: string;
      };
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
