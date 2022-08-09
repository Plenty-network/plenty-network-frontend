import clsx from 'clsx';
import { useState } from 'react';

interface ISearchBarProps {
  inputRef?: any;
  value?: string | '';
  onChange?: any;
}
function SearchBar(props: ISearchBarProps) {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div
      className={clsx(
        '    rounded font-body3 text-white w-full h-[50px] py-3.5 px-3 hover:border-text-700',
        props.value
          ? 'border border-primary-500 bg-outineBtn hover:border-primary-500'
          : 'border border-text-800/[0.5]',
        !isFocus && props.value && 'border-0 bg-outineBtn'
      )}
      {...props}
    >
      <input
        ref={props.inputRef}
        autoFocus
        className="bg-transprent relative top-[1px] w-full font-body3 outline-none placeholder:text-text-700"
        placeholder="Search name or paste address"
        onChange={props.onChange}
        value={props.value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </div>
  );
}

export default SearchBar;
