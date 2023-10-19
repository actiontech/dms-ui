import StepBox from './StepBox';
import useUserTypeHooks from './hooks/useUserTypeHooks';
import { UserTypeDictionary } from '.';
import { BasicSegmented } from '@actiontech/shared';
import { DefaultSceneSegmentedWrapper } from '../style';

const DefaultScene: React.FC = () => {
  const { userType, onUserTypeChange } = useUserTypeHooks();

  return (
    <section>
      <DefaultSceneSegmentedWrapper>
        <BasicSegmented
          value={userType}
          onChange={(e) => {
            onUserTypeChange(e as typeof userType);
          }}
          options={[
            {
              label: UserTypeDictionary.admin,
              value: 'admin'
            },
            {
              label: UserTypeDictionary.normal,
              value: 'normal'
            }
          ]}
        />
      </DefaultSceneSegmentedWrapper>

      <StepBox />
    </section>
  );
};

export default DefaultScene;
