import clsx from 'clsx';

interface ISearchBarProps {}
function SearchBar(props: ISearchBarProps) {
  return (
    <div
      className={clsx(
        'bg-primary-500/[0.1]    rounded font-body3 text-white w-full h-[50px] py-3.5 px-3'
      )}
      {...props}
    >
      <input
        className="bg-primary-500/[0.1]   font-body3 outline-none"
        placeholder="Select a token"
      />
    </div>
  );
}

export default SearchBar;
