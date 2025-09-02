import { useEffect, useRef } from 'react';
import { DefaultValue, RecoilState, useRecoilState } from 'recoil';

// eslint-disable-next-line @typescript-eslint/ban-types
const RecoilObservable = <T,>(props: {
  state: RecoilState<T>;
  onChange?: (val: T | DefaultValue) => void;
}) => {
  const { state, onChange } = props;

  const [value, setValue] = useRecoilState<any>(state);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
    } else {
      onChange?.(value);
    }
  }, [onChange, setValue, value]);

  return null;
};

export default RecoilObservable;
