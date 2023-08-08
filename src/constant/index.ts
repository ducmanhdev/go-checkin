export const SEND_DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_FORMAT = 'MM/DD/YYYY';
export const TIME_12_FORMAT = 'hh:mm A';
export const TIME_24_FORMAT = 'HH:mm:ss';
export const AU_DATE_FORMAT = 'DD/MM/YYYY';
export const US_DATE_FORMAT = 'MM/DD/YYYY';
export const FULL_DATE_FORMAT = `${DATE_FORMAT} ${TIME_12_FORMAT}`;
export const PHONE_MASK = '+1 ### ###-##-##';
export const DEFAULT_MESSAGE_MAX_LENGTH = 139;

export const PER_PAGE_OPTIONS = [
  {
    label: 10,
    value: 10,
  },
  {
    label: 20,
    value: 20,
  },
  {
    label: 30,
    value: 30,
  },
  {
    label: 40,
    value: 40,
  }
] as const;

export const FULL_FILTER_OPTIONS = [
  {
    label: 'STATUS',
    value: 'status',
    children: [
      {
        label: 'All',
        value: undefined,
      },
      {
        label: 'New',
        value: 'new',
      },
      {
        label: 'At risk',
        value: 'atrisk',
      },
      {
        label: 'Vip',
        value: 'vip',
      },
      {
        label: 'Regular',
        value: 'regular',
      },
      {
        label: 'Normal',
        value: 'normal',
      },
      {
        label: 'Import',
        value: 'import',
      },
      {
        label: 'Booking',
        value: 'booking',
      },
    ],
  },
  {
    label: 'SOURCE',
    value: 'source',
    children: [
      {
        label: 'All',
        value: undefined,
      },
      {
        label: 'Facebook',
        value: 'facebook',
      },
      {
        label: 'Instagram',
        value: 'instagram',
      },
      {
        label: 'Google',
        value: 'google',
      },
      {
        label: 'Website',
        value: 'website',
      },
    ],
  },
  {
    label: 'GROUP',
    value: 'group',
    children: [
      {
        label: 'All',
        value: 'all',
      },
      {
        label: 'Group 1',
        value: '1',
      },
      {
        label: 'Group 2',
        value: '2',
      },
      {
        label: 'Group 3',
        value: '3',
      }
    ],
  }
] as const;

export const BOOKING_TYPE_OPTIONS = [
  {
    label: 'All',
    value: undefined,
    color: '#558BE3'
  },
  {
    label: 'New',
    value: 'new',
    color: '#04BFDA',
  },
  {
    label: 'At risk',
    value: 'atrisk',
    color: '#558BE3',
  },
  {
    label: 'Vip',
    value: 'vip',
    color: '#FB67CA',
  },
  {
    label: 'Regular',
    value: 'regular',
    color: '#FFA84A',
  },
  {
    label: 'Normal',
    value: 'normal',
    color: '#34C672',
  },
  {
    label: 'Import',
    value: 'import',
    color: '#E85659',
  },
  {
    label: 'Booking',
    value: 'booking',
    color: '#558BE3',
  },
] as const;

type TypeBookingTypeColors = {
  [K in NonNullable<typeof BOOKING_TYPE_OPTIONS[number]['value']>]: string;
}

export const BOOKING_TYPE_COLORS = BOOKING_TYPE_OPTIONS.reduce((colors, current) => {
  if (current.value) colors[current.value] = current.color;
  return colors;
}, {} as TypeBookingTypeColors);

export const RATING_REPORT_SKELETON = {
  five_star: {
    label: 'Very happy',
    backgroundColor: '#83D811',
    img: 'icon-very-happy.png',
    rate: 5,
  },
  four_star: {
    label: 'Happy',
    backgroundColor: '#C7EF29',
    img: 'icon-happy.png',
    rate: 4,
  },
  three_star: {
    label: 'Normal',
    backgroundColor: '#FFDF36',
    img: 'icon-normal.png',
    rate: 3,
  },
  two_star: {
    label: 'Unhappy',
    backgroundColor: '#FF7A30',
    img: 'icon-unhappy.png',
    rate: 2,
  },
  one_star: {
    label: 'Very unhappy',
    backgroundColor: '#FF3737',
    img: 'icon-very-unhappy.png',
    rate: 1,
  },
} as const;

export const LIST_REVIEW_TYPE = {
  GOOGLE_GMB: 'google_gmb',
  GOOGLE: 'google',
  GOCHECKIN: 'gocheckin',
} as const
