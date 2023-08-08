import {AU_DATE_FORMAT, US_DATE_FORMAT, DATE_FORMAT, TIME_12_FORMAT, TIME_24_FORMAT} from "@/constant";
import dayjs from "dayjs";

export const useDateFormat = (date: Date = new Date(), timeFormat?: 12 | 24) => {
  try {
    const countryCode = localStorage.getItem('country_code');
    let format: string;
    switch (countryCode) {
      case 'AU': {
        format = AU_DATE_FORMAT;
        break;
      }
      case 'US': {
        format = US_DATE_FORMAT;
        break;
      }
      default: {
        format = DATE_FORMAT;
      }
    }
    switch (timeFormat) {
      case 12: {
        format += ` ${TIME_12_FORMAT}`;
        break;
      }
      case 24: {
        format += ` ${TIME_24_FORMAT}`;
        break;
      }
    }
    return dayjs(date).format(format);
  } catch (error) {
    return date;
  }
}
