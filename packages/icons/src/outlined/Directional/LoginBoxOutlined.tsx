import type { SVGProps } from 'react';
const LoginBoxOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#292C33"
        d="M2.667 10H4v3.334h8V2.667H4V6H2.667V2a.667.667 0 0 1 .666-.667h9.334a.667.667 0 0 1 .666.667v12a.667.667 0 0 1-.666.667H3.333A.667.667 0 0 1 2.667 14zm4-2.666v-2L10 8l-3.333 2.667v-2H1.333V7.334z"
      />
    </svg>
  );
};
export default LoginBoxOutlined;
