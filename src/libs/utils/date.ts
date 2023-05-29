import dayjs from 'dayjs';

export const getFormattedDate = (date: Date, format = 'YYYY-MM'): string => {
  const formattedDate = dayjs(date).format(format);

  return formattedDate;
};
