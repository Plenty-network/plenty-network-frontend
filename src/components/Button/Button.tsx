import clsx from 'clsx';

interface IButtonProps {
  loading?: boolean;
  startIcon?: string;
  onClick?: () => void | Promise<void>;
  children?: string;
  color?: 'primary' | 'secondary' | 'disabled';
  className?: string;
}
function Button(props: IButtonProps) {
  return (
    <button
      className={clsx(
        'bg-primary-500 hover:bg-primary-400  py-2 px-8 rounded-2xl font-title3-bold h-13 text-black',
        props.color === 'disabled' && 'bg-primary-600 text-text-600'
      )}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </button>
  );
}

export default Button;
