import { DNDProvider } from '@cloudbeaver/core-ui';
import { useEffect } from 'react';
import { GraphQLService } from '@cloudbeaver/core-sdk';
import { useService } from '@cloudbeaver/core-di';

export const CoreApp = () => {
  const gql = useService(GraphQLService);

  useEffect(() => {
    // 服务初始化完成后的逻辑
    console.log('GraphQLService loaded:', gql);
  }, [gql]);

  return (
    <DNDProvider>
      <></>
    </DNDProvider>
  );
};

// 为了向后兼容，保留这个导出
export const CoreAppWithServices = CoreApp;
