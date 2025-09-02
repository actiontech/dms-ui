import { useState, useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { UserService } from '@actiontech/shared/lib/api';

export interface PrivacyAuthorizationState {
  isAuthorized: boolean;
  isAuthorizationModalOpen: boolean;
  isRevocationModalOpen: boolean;
}

export interface PrivacyAuthorizationActions {
  onAuthorize: () => void;
  onRevoke: () => void;
  showAuthorizationModal: () => void;
  hideAuthorizationModal: () => void;
  showRevocationModal: () => void;
  hideRevocationModal: () => void;
  updateAuthorizationStatus: (status: boolean) => void;
}

export const usePrivacyAuthorization = (): PrivacyAuthorizationState &
  PrivacyAuthorizationActions => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [
    isAuthorizationModalOpen,
    { setTrue: showAuthorizationModal, setFalse: hideAuthorizationModal }
  ] = useBoolean(false);

  const [
    isRevocationModalOpen,
    { setTrue: showRevocationModal, setFalse: hideRevocationModal }
  ] = useBoolean(false);

  const onAuthorize = useCallback(() => {
    setIsAuthorized(true);
    hideAuthorizationModal();
  }, [hideAuthorizationModal]);

  const onRevoke = useCallback(() => {
    setIsAuthorized(false);
    UserService.UpdateCurrentUser({
      current_user: {
        email: '',
        phone: '',
        wxid: ''
      }
    });
    hideRevocationModal();
  }, [hideRevocationModal]);

  return {
    isAuthorized,
    isAuthorizationModalOpen,
    isRevocationModalOpen,
    onAuthorize,
    onRevoke,
    showAuthorizationModal,
    hideAuthorizationModal,
    showRevocationModal,
    hideRevocationModal,
    updateAuthorizationStatus: setIsAuthorized
  };
};

export default usePrivacyAuthorization;
