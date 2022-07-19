import clsx from 'clsx';

interface IButtonProps {
  loading?: boolean;
  startIcon?: string;
  onClick?: () => void;
  children?: string;
  color?: 'primary' | 'secondary' | 'disabled' | 'error';
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}
function Button(props: IButtonProps) {
  return (
    <button
      className={clsx(
        'bg-primary-500     font-title3-bold h-13 text-black w-full',
        props.color === 'disabled' && 'bg-primary-600 text-text-600',
        props.color === 'error' && 'bg-error-900 text-text-600',
        props.width ? props.width : 'w-full',
        props.height,
        props.borderRadius ? props.borderRadius : 'rounded-2xl'
      )}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </button>
  );
}

export default Button;
