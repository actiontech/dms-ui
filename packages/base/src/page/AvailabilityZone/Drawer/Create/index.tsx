import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseCode } from '@actiontech/dms-kit';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import { updateAvailabilityZoneModalStatus } from '../../../../store/availabilityZone';
import EventEmitter from '../../../../utils/EventEmitter';
import { AvailabilityZoneFormType } from '../Form/type';
import AvailabilityZoneForm from '../Form';
import { BasicButton, BasicDrawer } from '@actiontech/dms-kit';
import { DmsApi } from '@actiontech/shared/lib/api';
import dayjs from 'dayjs';
const CreateAvailabilityZoneDrawer: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm<AvailabilityZoneFormType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const visible = useSelector(
    (state: IReduxState) =>
      state.availabilityZone.modalStatus[ModalName.DMS_Create_Availability_zone]
  );
  const submit = async () => {
    const values = await form.validateFields();
    startSubmit();
    DmsApi.GatewayService.AddGateway({
      add_gateway: {
        gateway_name: values.name,
        gateway_address: values.address,
        gateway_id: dayjs().format('YYYYMMDDHHmmssSSS')
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('availabilityZone.form.createSuccessTips'));
          onClose();
          EventEmitter.emit(EmitterKey.Refresh_Availability_Zone_Page);
          EventEmitter.emit(EmitterKey.Refresh_Availability_Zone_Selector);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  const onClose = () => {
    form.resetFields();
    dispatch(
      updateAvailabilityZoneModalStatus({
        modalName: ModalName.DMS_Create_Availability_zone,
        status: false
      })
    );
  };
  return (
    <BasicDrawer
      open={visible}
      title={t('availabilityZone.list.createAvailabilityZone')}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
      onClose={onClose}
    >
      {contextHolder}
      <AvailabilityZoneForm form={form} />
    </BasicDrawer>
  );
};
export default CreateAvailabilityZoneDrawer;
