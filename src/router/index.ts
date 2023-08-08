import {createRouter, createWebHistory} from 'vue-router';
import routes from './routes';
import {guardAuth, guardCustomerRedirect, guardGroupRedirect} from './guards';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({left: 0, top: 0}),
  routes: routes,
});

router.beforeResolve(guardAuth);
router.beforeEach(guardCustomerRedirect);
router.beforeEach(guardGroupRedirect);
export default router;
