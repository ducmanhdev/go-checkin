import Report from "@/views/report/Report.vue";

export default [
  {
    path: '/',
    name: 'home',
    redirect: {
      name: 'report'
    }
  },
  {
    path: '/report',
    name: 'report',
    component: Report
  },
  {
    path: '/promotion',
    name: 'promotion',
    redirect: {
      name: 'promotion-index',
    },
    children: [
      {
        path: '',
        name: 'promotion-index',
        component: () => import('@/views/promo-reminder/promotion/list/List.vue'),
      },
      {
        path: ':id',
        name: 'promotion-detail',
        component: () => import('@/views/promo-reminder/promotion/detail/Detail.vue'),
      },
    ]
  },
  {
    path: '/reminder',
    name: 'reminder',
    redirect: {
      name: 'reminder-index',
    },
    children: [
      {
        path: '',
        name: 'reminder-index',
        component: () => import('@/views/promo-reminder/reminder/list/List.vue'),
      },
      {
        path: ':id',
        name: 'reminder-detail',
        component: () => import('@/views/promo-reminder/reminder/detail/Detail.vue'),
      },
    ]
  },
  {
    path: '/birthday',
    name: 'birthday',
    redirect: {
      name: 'birthday-index',
    },
    children: [
      {
        path: '',
        name: 'birthday-index',
        component: () => import('@/views/promo-reminder/birthday/list/List.vue'),
      },
      {
        path: ':id',
        name: 'birthday-detail',
        component: () => import('@/views/promo-reminder/birthday/detail/Detail.vue'),
      },
    ]
  },
  {
    path: '/new-client',
    name: 'new-client',
    component: () => import('@/views/promo-reminder/new-client/list/List.vue'),
  },
  {
    path: "/staff",
    name: "staff",
    component: () => import("@/views/staff-services/staff/Staff.vue"),
  },
  {
    path: "/service",
    name: "service",
    component: () => import("@/views/staff-services/service/Service.vue"),
  },
  {
    path: '/reward',
    name: 'reward',
    redirect: {
      name: 'reward-index',
    },
    children: [
      {
        path: '',
        name: 'reward-index',
        component: () => import("@/views/reward/Reward.vue"),
      },
      {
        path: 'history',
        name: 'reward-history',
        component: () => import("@/views/reward/RewardHistory.vue"),
      },
    ]
  },
  {
    path: "/customer",
    name: "customer",
    component: () => import("@/views/member-group/customer/Customer.vue"),
    children: [
      {
        path: ":id",
        name: "customer-detail",
        component: () => import("@/views/member-group/customer/CustomerDetail.vue"),
      },
    ]
  },
  {
    path: "/customer-detail/:id",
    name: "customer-detail-mobile",
    component: () => import("@/views/member-group/customer/CustomerDetail.vue"),
  },
  {
    path: "/group",
    name: "group",
    component: () => import("@/views/member-group/group/Group.vue"),
    children: [
      {
        path: ":id",
        name: "group-detail",
        component: () => import("@/views/member-group/group/GroupDetail.vue"),
      },
    ]
  },
  {
    path: "/group-detail/:id",
    name: "group-detail-mobile",
    component: () => import("@/views/member-group/group/GroupDetail.vue"),
  },
  {
    path: '/settings',
    name: 'settings',
    redirect: {
      name: 'settings-index',
    },
    children: [
      {
        path: '',
        name: 'settings-index',
        component: () => import("@/views/settings/Settings.vue"),
      },
      {
        path: "ticket",
        name: "ticket-setting",
        component: () => import("@/views/settings/ticket-setting/TicketSetting.vue"),
      },
      {
        path: "checkin",
        name: "checkin-setting",
        component: () => import("@/views/settings/CheckinSetting.vue"),
      },
      {
        path: "checkout",
        name: "checkout-setting",
        component: () => import("@/views/settings/CheckoutSetting.vue"),
      },
      {
        path: "store-rating",
        name: "store-rating-setting",
        component: () => import("@/views/settings/StoreRatingSetting.vue"),
      },
    ]
  },
  {
    path: '/review-setting',
    name: 'review-setting',
    component: () => import('@/views/review/review-setting/ReviewSetting.vue'),
  },
  {
    path: '/review-list',
    name: 'review-list',
    component: () => import('@/views/review/review-list/ReviewList.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]
