import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/DailyChallengeVuew.vue"),
  },
  {
    path: "/accounting",
    name: "accounting",
    component: () => import("@/views/AccountingView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
