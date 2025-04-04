import { BasicInput } from '@actiontech/shared';
import { useState } from 'react';

export const PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE =
  'PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE';

/**
 * 一个奇葩的 密码输入框 组件
 *
 * 使用场景：
 * 类似密码、secret id 之内的敏感数据，后端不会返回，前端会填充一些默认值，表示这里有值。
 * 但是这个默认值不会干涉到 Form 组件，也就是在没修改的情况下，提交时通过 form 获取的依旧是空值。当用户修改后， 内外状态会同步，Form 就能正确获取到值了。
 *
 * 当处于 Form 下时，在某些情况下内部 value 与 Form 管理的 value 会有差异。
 *
 * 当 enabled 为 true 时， 拥有以下特性：
 * 1. Form 没有向组件传递 value 时， 内部 value 会存在一个默认值，作为占位符
 * 2. 当聚焦输入框后，内部 value 清空
 * 3. 当失去焦点并且内部 value 的值为空时，重新赋予其默认值，作为占位符
 * 4. 在以上这些情况下（用户没有手动修改 值时）， Form 管理的 value 依旧为空
 * 5. 当用户进行输入后， 内外部 value 为统一状态，并且被 Form 正常接管
 *
 * 暂时先放在 BackendForm 中，如果后续有必要可以调整至 shared
 */

type Props = {
  id?: string;
  enabled: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const FormPasswordWithPlaceholder: React.FC<Props> = ({
  enabled,
  id,
  value,
  onChange,
  disabled
}) => {
  const [innerValue, setInnerValue] = useState(() => {
    if (!!value) {
      return value;
    }

    if (enabled) {
      return PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE;
    }

    return undefined;
  });

  return (
    <BasicInput.Password
      id={id}
      onFocus={() => {
        if (innerValue === PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE && enabled) {
          setInnerValue('');
        }
      }}
      onBlur={() => {
        if (!innerValue && enabled) {
          setInnerValue(PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE);
        }
      }}
      onChange={(e) => {
        setInnerValue(e.target.value);
        onChange?.(e.target.value);
      }}
      value={innerValue}
      disabled={disabled}
      visibilityToggle={!enabled}
    />
  );
};

export default FormPasswordWithPlaceholder;
