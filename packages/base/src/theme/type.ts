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
