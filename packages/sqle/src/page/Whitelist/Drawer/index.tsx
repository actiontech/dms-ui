import { useEffect } from 'react';
import { ModalName } from '../../../data/ModalName';
import { initWhitelistModalStatus } from '../../../store/whitelist';
import { useDispatch } from 'react-redux';
import AddWhitelist from './AddWhitelist';
import UpdateWhitelist from './UpdateWhitelist';

const WhitelistDrawer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const modalStatus = {
      [ModalName.Add_Whitelist]: false,
      [ModalName.Update_Whitelist]: false
    };
    dispatch(initWhitelistModalStatus({ modalStatus }));
  }, [dispatch]);

  return (
    <>
      <AddWhitelist />
      <UpdateWhitelist />
    </>
  );
};

export default WhitelistDrawer;
