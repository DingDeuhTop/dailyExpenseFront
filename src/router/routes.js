const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      { path: "", component: () => import("src/pages/BuyPage.vue") },
      { path: "/sell", component: () => import("src/pages/SellPage.vue") },
      {
        path: "/ba",
        name: "ba",
        component: () => import("src/pages/BaPage.vue"),
      },
      {
        path: "/customerba",
        component: () => import("src/pages/CustomerBaPage.vue"),
      },
      {
        path: "/register",
        component: () => import("src/pages/RegisterPage.vue"),
      },
      {
        path: "/login",
        component: () => import("src/pages/LoginPage.vue"),
      },
      {
        path: "/profile",
        component: () => import("src/pages/ProfilePage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
