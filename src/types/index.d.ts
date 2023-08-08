export type Option = {
  label: string;
  value: any;
  children?: Array<{
    label: string;
    value: any;
  }>;
}

export type Options = Array<Option>;

export type ConfirmPayload = {
  headerTitle?: string,
  bodyTitle?: string,
  bodyImage?: string,
  bodyMessage?: string,
}
