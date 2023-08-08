import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

export const guardAuth = (to: any) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken && to.name !== 'login') return {name: "login"};
  if (accessToken && to.name === 'login') return {name: "home"};
}
export const guardCustomerRedirect = (to: any) => {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const largerThanMd = breakpoints.greater('md');
  if (to.name === 'customer-detail' && !largerThanMd.value) {
    return {
      name: 'customer-detail-mobile',
      params: to.params
    }
  }
  if (to.name === 'customer-detail-mobile' && largerThanMd.value) {
    return {
      name: 'customer-detail',
      params: to.params
    }
  }
}
export const guardGroupRedirect = (to: any) => {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const largerThanMd = breakpoints.greater('md');
  if (to.name === 'group-detail' && !largerThanMd.value) {
    return {
      name: 'group-detail-mobile',
      params: to.params
    }
  }
  if (to.name === 'group-detail-mobile' && largerThanMd.value) {
    return {
      name: 'group-detail',
      params: to.params
    }
  }
}
