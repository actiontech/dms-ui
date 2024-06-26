import type { SVGProps } from 'react';
const WorkflowFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M5.477 5.221a4 4 0 0 1-.46-1.458 7.3 7.3 0 0 0-3.304 5.711c.461-.2.956-.308 1.459-.32A5.84 5.84 0 0 1 5.477 5.22m9.315 3.932c.502.013.997.122 1.459.321a7.3 7.3 0 0 0-3.305-5.711 4 4 0 0 1-.46 1.458 5.84 5.84 0 0 1 2.306 3.918zm-3.516 6.091a5.84 5.84 0 0 1-4.552 0c-.263.438-.61.82-1.021 1.123a7.24 7.24 0 0 0 6.565 0 3.9 3.9 0 0 1-.992-1.123M9 5.856A2.553 2.553 0 1 0 9 .75a2.553 2.553 0 0 0 0 5.106m-5.697 4.749a2.553 2.553 0 1 0 2.553 2.553 2.553 2.553 0 0 0-2.553-2.56zm11.394 0a2.553 2.553 0 1 0 2.553 2.553 2.547 2.547 0 0 0-2.553-2.56z"
      />
      <path
        fill={props.color ? 'currentColor' : '#8A8F99'}
        d="M5.477 5.222a4 4 0 0 1-.46-1.46 7.3 7.3 0 0 0-3.304 5.712c.461-.2.956-.308 1.459-.32a5.84 5.84 0 0 1 2.305-3.932m9.315 3.931c.502.013.997.122 1.459.321a7.3 7.3 0 0 0-3.305-5.711 4 4 0 0 1-.46 1.459 5.84 5.84 0 0 1 2.306 3.917zm-3.516 6.091a5.84 5.84 0 0 1-4.552 0c-.263.438-.61.82-1.021 1.123a7.24 7.24 0 0 0 6.565 0 3.9 3.9 0 0 1-.992-1.123"
      />
    </svg>
  );
};
export default WorkflowFilled;
