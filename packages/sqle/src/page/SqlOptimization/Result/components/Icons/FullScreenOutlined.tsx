import type { SVGProps } from 'react';
const FullScreenOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      className="FullScreenOutlined_svg__icon"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M213.333 213.333h213.334V128h-256A42.667 42.667 0 0 0 128 170.667v256h85.333zM170.667 896h256v-85.333H213.333V597.333H128v256A42.667 42.667 0 0 0 170.667 896M896 853.333v-256h-85.333v213.334H597.333V896h256A42.667 42.667 0 0 0 896 853.333m-298.667-640h213.334v213.334H896v-256A42.667 42.667 0 0 0 853.333 128h-256z"
      />
    </svg>
  );
};
export default FullScreenOutlined;
