import type { SVGProps } from 'react';
const CheckHexagonOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        stroke={props.color ? 'currentColor' : '#41BF9A'}
        strokeWidth={1.5}
        d="M6.875 1.516a2.25 2.25 0 0 1 2.25 0l3.928 2.267a2.25 2.25 0 0 1 1.125 1.95v4.535a2.25 2.25 0 0 1-1.125 1.948l-3.928 2.269a2.25 2.25 0 0 1-2.25 0l-3.928-2.268a2.25 2.25 0 0 1-1.125-1.95V5.733a2.25 2.25 0 0 1 1.125-1.949z"
      />
      <path
        stroke={props.color ? 'currentColor' : '#41BF9A'}
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m5.083 8 2.084 2.083 4.166-4.166"
      />
    </svg>
  );
};
export default CheckHexagonOutlined;
