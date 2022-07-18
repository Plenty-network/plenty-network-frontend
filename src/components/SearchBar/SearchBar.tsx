import clsx from 'clsx';

interface ISearchBarProps {
  inputRef?: any;
  value?: string | '';
  onChange?: any;
}
function SearchBar(props: ISearchBarProps) {
  return (
    <div
      className={clsx(
        'bg-outineBtn    rounded font-body3 text-white w-full h-[50px] py-3.5 px-3',
        props.value && 'border border-primary-500'
      )}
      {...props}
    >
      <input
        ref={props.inputRef}
        className="bg-transprent   font-body3 outline-none"
        placeholder="Select a token"
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}

export default SearchBar;
