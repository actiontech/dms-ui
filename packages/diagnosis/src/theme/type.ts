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
  icon: {
    user: string;
    password: string;
  };
};

export type UserManagementTheme = {
  permissionType: {
    border: string;
    backgroundColor: string;
    color: string;
    activeBackgroundColor: string;
    activeColor: string;
  };
};
