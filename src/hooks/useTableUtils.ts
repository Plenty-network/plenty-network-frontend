export const useTableNumberUtils = () => {
  const valueFormat = (value: number, opt: { percentChange?: boolean } = {}) => {
    if (value >= 100) {
      return `${opt.percentChange ? "" : "$"}${value.toFixed(2)}`;
    }

    if (!opt.percentChange && value < 0.01 && value > 0) {
      return "< $0.01";
    }
    if (opt.percentChange && value < 0.01 && value > 0) {
      return "< 0.01";
    }
    return `${opt.percentChange ? "" : "$"}${value?.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  };
  return { valueFormat };
};
