import type { SVGProps } from 'react';
const DatabaseTableFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#4583FF'}
        d="M828.952 121.905a73.143 73.143 0 0 1 73.143 73.143v633.904a73.143 73.143 0 0 1-73.143 73.143H195.048a73.143 73.143 0 0 1-73.143-73.143V195.048a73.143 73.143 0 0 1 73.143-73.143zm-512 597.333H195.048v109.714h121.904zm512 0H390.095v109.714h438.857zm-512-182.857H195.048v109.714h121.904zm512 0H390.095v109.714h438.857zm-512-182.857H195.048v109.714h121.904zm512 0H390.095v109.714h438.857z"
      />
    </svg>
  );
};
export default DatabaseTableFilled;
