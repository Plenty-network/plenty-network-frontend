export const generateRandomString = (length: number): string => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const dotNotationToObject = (obj: Object, element: string) => {
  return element.split(".").reduce((o: any, i) => o[i], obj);
};
export const tEZorCTEZTtoUpperCase = (a: string) =>
  a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;
export const compareNumericString = (inp: any, inp2: any, id: string, isNumber?: boolean) => {
  const rowA = inp;
  const rowB = inp2;
  if (isNumber) {
    return dotNotationToObject(rowA.original, id).localeCompare(
      dotNotationToObject(rowB.original, id),
      undefined,
      { numeric: true }
    );
  }
  const desc = false;
  let a = Number.parseFloat(dotNotationToObject(rowA.original, id));
  let b = Number.parseFloat(dotNotationToObject(rowB.original, id));
  if (Number.isNaN(a)) {
    // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};
