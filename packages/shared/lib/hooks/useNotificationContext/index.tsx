import { notification } from 'antd5';
import {
  ArgsProps,
  NotificationInstance
} from 'antd5/es/notification/interface';
import { useCallback, useEffect } from 'react';
import { eventEmitter } from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import {
  NotificationDescriptionStyleWrapper,
  NotificationMessageStyleWrapper
} from './style';

export type NotificationInstanceKeyType = keyof Omit<
  NotificationInstance,
  'destroy'
>;

const useNotificationContext = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(
    (
      type: NotificationInstanceKeyType,
      { message, description, ...config }: ArgsProps
    ) => {
      api[type]({
        ...config,
        message:
          typeof message === 'string' ? (
            <NotificationMessageStyleWrapper>
              {message}
            </NotificationMessageStyleWrapper>
          ) : (
            message
          ),
        description:
          typeof description === 'string' ? (
            <NotificationDescriptionStyleWrapper>
              {description}
            </NotificationDescriptionStyleWrapper>
          ) : (
            description
          )
      });
    },
    [api]
  );

  useEffect(() => {
    eventEmitter.subscribe(
      EmitterKey.OPEN_GLOBAL_NOTIFICATION,
      openNotification
    );

    return () => {
      api.destroy();
      eventEmitter.unsubscribe(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        openNotification
      );
    };
  }, [api, openNotification]);

  return { notificationContextHolder: contextHolder, openNotification };
};

export default useNotificationContext;
