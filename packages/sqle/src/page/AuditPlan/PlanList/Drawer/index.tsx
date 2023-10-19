import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { updateAuditPlanModalStatus } from '../../../../store/auditPlan';
import SubscribeNotice from './SubscribeNotice';

const PlanListDrawer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateAuditPlanModalStatus({
        modalName: ModalName.Subscribe_Notice,
        status: false
      })
    );
  }, [dispatch]);

  return (
    <>
      <SubscribeNotice />
    </>
  );
};

export default PlanListDrawer;
