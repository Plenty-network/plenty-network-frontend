import clsx from 'clsx';

interface IButtonProps {
  loading?: boolean;
  startIcon?: string;
  onClick?: () => void | Promise<void>;
  children?: string;
  color?: 'primary' | 'secondary' | 'disabled';
  className?: string;
  width?: string;
  height?: string;
}
function Button(props: IButtonProps) {
  return (
    <button
      className={clsx(
        'bg-primary-500    rounded-2xl font-title3-bold h-13 text-black w-full',
        props.color === 'disabled' && 'bg-primary-600 text-text-600',
        props.width ? props.width : 'w-full',
        props.height
      )}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </button>
  );
}

export default Button;
