import type { SVGProps } from 'react';
const CloseOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={16}
      height={16}
      {...props}
    >
      <path d="m7 6.175 2.887-2.887.825.825L7.825 7l2.887 2.888-.825.824L7 7.825l-2.888 2.887-.824-.824L6.175 7 3.288 4.113l.824-.825z" />
    </svg>
  );
};
export default CloseOutlined;
