import type { SVGProps } from 'react';
const ExportFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M123.029 955.658c-31.485 0-57.1-25.614-57.1-57.1V268.756c0-31.486 25.615-57.1 57.1-57.1h133.239c21.52 0 39.59 12.514 47.16 32.657 7.571 20.144 2.215 41.463-13.979 55.636l-17.79 15.573h-101.89v534.544h564.956V725.165l13.544-9.68c9.813-7.014 21.243-10.722 33.055-10.722 31.568 0 57.249 25.648 57.249 57.174v136.621c0 31.486-25.615 57.1-57.1 57.1zm500.691-473.45c-32.409.269-61.09 1.4-85.313 3.368-7.186.593-12.466.883-17.126 1.14-13.028.719-18.975 1.046-45.112 7.686-34.745 8.832-67.818 23.13-98.3 42.493-6.053 3.85-13.11 8.163-20.582 12.729-31.807 19.435-75.334 46.03-94.562 69.499-5.64 7.36-13.463 11.413-22.038 11.413-2.153 0-4.354-.256-6.545-.762-12.154-2.653-19.742-12.39-19.742-25.4v-1.547l.31-1.516c12.921-63.498 29.397-117.625 48.967-160.875 19.82-43.838 46.006-82.8 77.827-115.801 32.407-33.632 73.855-58.428 123.192-73.696 44.649-13.76 98.132-21.271 159.038-22.342V61.96L958.47 355.34 623.72 648.706z"
      />
    </svg>
  );
};
export default ExportFilled;
