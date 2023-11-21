export type MonitorSourceConfigTheme = {
  headerWrapper: {
    borderBottom: string;
    title: {
      fontSize: string;
      fontWeight: number;
      color: string;
    };
    refreshIcon: {
      color: string;
    };
    tagWrapper: {
      fontSize: string;
      fontWeight: number;
      color: string;

      tagItem: {
        border: string;
        backgroundColor: string;
      };
      tagPrimary: {
        primaryColor: string;
        hoverColor: string;
      };
      icon: {
        backgroundColor: string;
      };
    };
  };
};

export type LoginTheme = {
  logo: {
    boxShadow: string;
  };
};

export type SideMenuTheme = {
  width: number;
  padding: number;
  backgroundColor: string;
  boxShadow: string;
  border: string;
  title: {
    color: string[];
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
