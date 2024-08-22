import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { useCallback, useMemo } from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { ModalName } from '~/data/enum';

const useModalStatus = (state: RecoilState<ModalStatus>, name?: ModalName) => {
  const [modalStatus, updateModalStatus] = useRecoilState(state);

  const toggleModal = (modalName: ModalName, status: boolean) => {
    if (!Reflect.has(modalStatus, modalName)) {
      return;
    }
    updateModalStatus({
      ...modalStatus,
      [modalName]: status
    });
  };

  const initModalStatus = useCallback(
    (status: ModalStatus) => {
      updateModalStatus(status);
    },
    [updateModalStatus]
  );

  const getModalStatus = (modalName: ModalName) => {
    return modalStatus[modalName];
  };

  const visible = useMemo(() => {
    if (!name) {
      return false;
    }
    return modalStatus[name] ?? false;
  }, [modalStatus, name]);

  return {
    visible,
    toggleModal,
    initModalStatus,
    getModalStatus
  };
};

export default useModalStatus;
