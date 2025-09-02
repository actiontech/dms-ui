import { useCallback, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { LocalStorageWrapper, useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../store';
import { updateIsFirstLogin, updatePasswordSecurity } from '../store/user';

/**
 * 密码安全相关hooks
 * 处理首次登录强制修改密码、密码过期提醒等功能
 */
export const usePasswordSecurity = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [modal, modalContextHolder] = Modal.useModal();
  const dispatch = useDispatch();
  const modalWarningRef = useRef<any>(null);
  const modalConfirmRef = useRef<any>(null);

  const { isFirstLogin, passwordExpired, passwordExpiryDays } = useSelector(
    (state: IReduxState) => ({
      isFirstLogin: state.user.isFirstLogin,
      passwordExpired: state.user.passwordExpired,
      passwordExpiryDays: state.user.passwordExpiryDays
    })
  );
  /**
   * 处理强制修改密码弹窗
   */
  const handleForcePasswordChange = useCallback(() => {
    if (modalWarningRef.current) {
      modalWarningRef.current.destroy();
    }
    navigate(ROUTE_PATHS.BASE.ACCOUNT.index, {
      queries: { action: 'change-password' }
    });
  }, [navigate]);

  /**
   * 检查并显示强制修改密码弹窗
   */
  const checkForcePasswordChange = useCallback(() => {
    if (modalWarningRef.current) {
      return true;
    }
    if (isFirstLogin || passwordExpired) {
      let title = '';
      let content = '';

      if (isFirstLogin) {
        title = t('dmsAccount.modifyPassword.forceChangeTitle');
        content = t('dmsAccount.modifyPassword.forceChangeDesc');
      } else if (passwordExpired) {
        title = t('dmsAccount.modifyPassword.passwordExpiryTitle');
        content = t('dmsAccount.modifyPassword.passwordExpiryDesc');
      }

      modalWarningRef.current = modal.warning({
        title,
        content,
        okText: t('dmsAccount.modifyPassword.button'),
        onOk: handleForcePasswordChange,
        closable: false,
        maskClosable: false,
        centered: true
      });

      return true;
    }
    return false;
  }, [isFirstLogin, passwordExpired, modal, t, handleForcePasswordChange]);

  /**
   * 处理密码过期提醒弹窗
   */
  const handlePasswordExpiryWarning = useCallback(() => {
    navigate(ROUTE_PATHS.BASE.ACCOUNT.index, {
      queries: { action: 'change-password' }
    });
  }, [navigate]);

  /**
   * 跳过密码过期提醒（稍后提醒）
   */
  const skipPasswordExpiryWarning = useCallback(() => {
    if (modalConfirmRef.current) {
      modalConfirmRef.current.destroy();
    }
  }, []);

  /**
   * 检查并显示密码过期提醒弹窗
   */
  const checkPasswordExpiryNotice = useCallback(() => {
    if (modalConfirmRef.current) {
      return;
    }
    if (
      !isFirstLogin &&
      !passwordExpired &&
      passwordExpiryDays <= 7 &&
      passwordExpiryDays > 0
    ) {
      modalConfirmRef.current = modal.confirm({
        title: t('dmsAccount.modifyPassword.passwordExpiryWarning', {
          days: passwordExpiryDays
        }),
        content: t('dmsAccount.modifyPassword.passwordExpiryWarningDesc'),
        okText: t('dmsAccount.modifyPassword.button'),
        cancelText: t('dmsAccount.modifyPassword.passwordExpiryWarningCancel'),
        onOk: handlePasswordExpiryWarning,
        onCancel: skipPasswordExpiryWarning,
        centered: true
      });
    }
  }, [
    isFirstLogin,
    passwordExpired,
    passwordExpiryDays,
    modal,
    t,
    handlePasswordExpiryWarning,
    skipPasswordExpiryWarning
  ]);

  const updateIsFirstLoginState = useCallback(
    (state: boolean) => {
      dispatch(updateIsFirstLogin(state));
      LocalStorageWrapper.set(StorageKey.IS_FIRST_LOGIN, String(state));
    },
    [dispatch]
  );

  /**
   * 完成首次登录密码修改
   */
  const completeFirstLoginPasswordChange = useCallback(async () => {
    dispatch(
      updatePasswordSecurity({
        passwordSecurity: {
          passwordExpired: false,
          passwordExpiryDays: 0
        }
      })
    );
    updateIsFirstLoginState(false);
  }, [dispatch, updateIsFirstLoginState]);

  /**
   * 初始化密码安全检查
   */
  const initPasswordSecurityCheck = useCallback(async () => {
    const needForceChange = checkForcePasswordChange();

    if (!needForceChange && !modalWarningRef.current) {
      checkPasswordExpiryNotice();
    }
  }, [checkForcePasswordChange, checkPasswordExpiryNotice]);

  useEffect(() => {
    initPasswordSecurityCheck();
  }, [initPasswordSecurityCheck]);

  useEffect(() => {
    return () => {
      if (modalWarningRef.current) {
        modalWarningRef.current.destroy();
      }

      if (modalConfirmRef.current) {
        modalConfirmRef.current.destroy();
      }
    };
  }, []);

  return {
    completeFirstLoginPasswordChange,
    // 用于外部组件判断状态
    isFirstLogin,
    updateIsFirstLoginState,
    passwordExpired,
    passwordExpiryDays,
    modalContextHolder
  };
};
