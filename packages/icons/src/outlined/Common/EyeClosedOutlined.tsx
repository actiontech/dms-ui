import type { SVGProps } from 'react';
const EyeClosedOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        fillRule="evenodd"
        d="M14.765 6.076a.5.5 0 0 1 .159.689 9.5 9.5 0 0 1-1.554 1.898l1.201 1.201a.5.5 0 0 1-.707.707l-1.263-1.263a8.5 8.5 0 0 1-2.667 1.343l.449 1.677a.5.5 0 0 1-.966.258l-.458-1.709Q8.25 11 7.5 11q-.75 0-1.46-.123l-.457 1.71a.5.5 0 1 1-.966-.26l.45-1.676a8.5 8.5 0 0 1-2.668-1.343l-1.263 1.263a.5.5 0 1 1-.707-.707l1.2-1.201A9.5 9.5 0 0 1 .077 6.765a.5.5 0 0 1 .848-.53 8.4 8.4 0 0 0 1.77 2.034A7.46 7.46 0 0 0 7.5 9.999c2.808 0 5.156-1.493 6.576-3.764a.5.5 0 0 1 .689-.16"
        clipRule="evenodd"
      />
    </svg>
  );
};
export default EyeClosedOutlined;
