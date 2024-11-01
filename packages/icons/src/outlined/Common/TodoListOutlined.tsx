import type { SVGProps } from 'react';
const TodoListOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      className="TodoListOutlined_svg__icon"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M924 540c-19.9 0-36 16.1-36 36v312H136V136h568c19.9 0 36-16.1 36-36s-16.1-36-36-36H136c-39.8 0-72 32.2-72 72v752c0 39.8 32.2 72 72 72h752c39.8 0 72-32.2 72-72V576c0-19.9-16.1-36-36-36"
      />
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M316.5 478.5c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l178.2 178.2c5.7 5.7 12.8 9.1 20.1 10.2 11.2 1.9 23.1-1.4 31.7-10l454.2-454.2c14.1-14.1 14.1-36.9 0-50.9-14.1-14.1-36.9-14.1-50.9 0l-429.2 429z"
      />
    </svg>
  );
};
export default TodoListOutlined;
