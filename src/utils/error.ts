import {notification} from "ant-design-vue";

// export const getSdkErrorMessage = (error: Error) => {
//     if (error.message.match(/(?!^)".*?"/g)) {
//         return (error.message.match(/(?!^)".*?"/g) as any)[0]
//     }
//     return error.message
// }

interface HandleErrorParams {
  error: any;
  message?: string;
}

const handleError = ({error, message = 'Error'}: HandleErrorParams) => {
  console.error(error);
  if(!error) return;
  if('errorFields' in error) return;
  const description =
    (error?.data?.errors && Object.values(error.data.errors)) ||
    error?.messages ||
    error?.message ||
    'An unknown error';
  notification.error({
    message: message,
    description: description,
  });
}

export default handleError;
