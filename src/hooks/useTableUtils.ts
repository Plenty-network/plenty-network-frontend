const SI_SYMBOL = ["", "k", "m", "b", "t", "p", "e"];
export const numberToMillionOrBillionFormate=(number :any )=>{
  if(!number || number==undefined || number==""){
      return 0;
  }
  // what tier? (determines SI symbol)
  var tier = Math.log10(Math.abs(number)) / 3 | 0;

  // if zero, we don't need a suffix
  if(tier == 0) return number.toFixed(2);

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier]??'';
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(2) + suffix;
}
export const useTableNumberUtils = () => {
  const valueFormat = (value: number, opt: { percentChange?: boolean } = {}) => {
    if (value >= 100) {
      return `${opt.percentChange ? "" : "$"}${numberToMillionOrBillionFormate(value)}`;
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
