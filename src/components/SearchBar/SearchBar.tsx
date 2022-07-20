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
        '    rounded font-body3 text-white w-full h-[50px] py-3.5 px-3 hover:border-text-700',
        props.value
          ? 'border border-primary-500 bg-outineBtn hover:border-primary-500'
          : 'border border-text-800/[0.5]'
      )}
      {...props}
    >
      <input
        ref={props.inputRef}
        className="bg-transprent relative top-[1px] w-full font-body3 outline-none"
        placeholder="Search name or paste address"
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}

export default SearchBar;
