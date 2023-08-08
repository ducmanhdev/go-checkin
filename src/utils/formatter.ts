export const usePhoneFormat = (value: any) => {
  try {
    return value
      .toString()
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d{3})(\d{4})/g, "($1) $2 $3")
      .replace(/^(\d{3})(\d{3})(\d*)/g, "($1) $2 $3")
      .replace(/^(\d{3})(\d{1,3})/g, "($1) $2")
      .replace(/^(\d{1,3})/g, "$1 ($2")
      .substring(0, 16)
      .trim();
  } catch (error) {
    return value;
  }
}

export const usePhoneParser = (value: number | string) => {
  const replacedValue = value.toString().replace(/\D/g, '');
  if (replacedValue === '') return '';
  return Number(replacedValue);
}

export const useNumberToPercentageFormat = (value: number, fixedValue = 2): string => {
  const firstNum = Number((value * 100).toFixed(fixedValue));
  const lastNum = parseFloat((100 - firstNum).toFixed(fixedValue));
  return `${firstNum} - ${lastNum}`
};

export const currencyFormat = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(value)
}
