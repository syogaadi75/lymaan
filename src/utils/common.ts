export const capitalizeFirstLetter = (str: string): string => {
  const [firstLetter, ...rest] = str;
  return firstLetter.toUpperCase() + rest.join("");
};

export const formatDate = (date: Date | string) => {
  return date
    .toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .replace(" at", "");
};

export const formatPrice = (price: number) => {
  const options = {
    style: "currency",
    currency: "IDR",
  };

  return new Intl.NumberFormat("id-ID", options).format(price);
};

export const generateYears = (startYear: number, endYear: number) => {
  const years: string[] = [];
  const currDate = new Date();
  const yearFormatter = new Intl.DateTimeFormat("id-ID", {year: "numeric"});

  for (let year = startYear; year <= endYear; year++) {
    currDate.setFullYear(year);
    const formattedYear: string = yearFormatter.format(currDate);
    years.push(formattedYear);
  }

  return years;
};

export const formatNumberWithCurrency = (
  numberInput: number,
  dataCurrency?: string,
) => {
  if (dataCurrency === "yen") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "JPY",
    }).format(numberInput);
  } else if (dataCurrency === "usd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numberInput);
  } else {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(numberInput);
  }
};
export function formatNumberPrefixZero(num: number, length?: number): string {
  return num.toString().padStart(length ?? 6, "0");
}
