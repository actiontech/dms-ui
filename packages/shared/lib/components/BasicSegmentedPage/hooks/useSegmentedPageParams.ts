import { useCallback, useState, useRef } from 'react';
import { BasicSegmentedPageOptions } from '../index.type';
import { SegmentedProps } from 'antd';

const useSegmentedPageParams = <T extends string>() => {
  const dataSource =
    useRef<
      Partial<
        Record<T, Pick<BasicSegmentedPageOptions<T>, 'content' | 'extraButton'>>
      >
    >();

  const [value, setValue] = useState<T>();

  const [options, setOptions] = useState<
    Array<Pick<BasicSegmentedPageOptions<T>, 'label' | 'value'>>
  >([]);

  const onChange: SegmentedProps['onChange'] = (v) => {
    setValue(v as T);
  };

  const updateSegmentedPageData = useCallback(
    (list: BasicSegmentedPageOptions<T>[]) => {
      const options = list.map((i) => {
        return {
          label: i.label,
          value: i.value
        };
      });
      setOptions(options);
      setValue(options[0]?.value);
      dataSource.current = list.reduce((prev, next) => {
        return {
          ...prev,
          [next.value]: {
            content: next.content,
            extraButton: next.extraButton
          }
        };
      }, {});
    },
    []
  );

  const renderExtraButton = useCallback(() => {
    return value && dataSource.current?.[value]?.extraButton;
  }, [value]);

  const renderContent = useCallback(() => {
    return value && dataSource.current?.[value]?.content;
  }, [value]);

  return {
    value,
    onChange,
    updateSegmentedPageData,
    options,
    renderExtraButton,
    renderContent
  };
};

export default useSegmentedPageParams;
