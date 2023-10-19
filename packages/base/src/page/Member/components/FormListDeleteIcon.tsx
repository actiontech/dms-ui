import { IconFormListDelete } from '../../../icon/member';
import { FormListDeleteIconWrap } from '../style';

const FormListDeleteIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <FormListDeleteIconWrap onClick={onClick}>
      <IconFormListDelete />
    </FormListDeleteIconWrap>
  );
};

export default FormListDeleteIcon;
