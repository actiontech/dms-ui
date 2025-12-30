import type { SVGProps } from 'react';
const RightOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M7.684 7 4.796 4.112l.825-.824L9.334 7 5.62 10.712l-.825-.825z"
      />
    </svg>
  );
};
export default RightOutlined;
