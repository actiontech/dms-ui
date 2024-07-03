import type { SVGProps } from 'react';
const PlusOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 10"
      width={16}
      height={16}
      {...props}
    >
      <path
        stroke={props.color ? 'currentColor' : '#1CB889'}
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m5.02.5-.012 9M.5 5h9"
      />
    </svg>
  );
};
export default PlusOutlined;
