import type { SVGProps } from 'react';
const PartialHexagonFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M6.875 1.516a2.25 2.25 0 0 1 2.25 0l3.928 2.267a2.25 2.25 0 0 1 1.125 1.95v4.535a2.25 2.25 0 0 1-1.125 1.948l-3.928 2.269a2.25 2.25 0 0 1-2.25 0l-3.928-2.268a2.25 2.25 0 0 1-1.125-1.95V5.733a2.25 2.25 0 0 1 1.125-1.949z" />
      <path
        fill="#fff"
        d="M8 3.155V8l4.207 2.404a1 1 0 0 0 .123-.481V6.077a1 1 0 0 0-.5-.866L8.5 3.29a1 1 0 0 0-.5-.134"
      />
    </svg>
  );
};
export default PartialHexagonFilled;
