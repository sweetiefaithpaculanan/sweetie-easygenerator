export default function (context) {
  context.store.dispatch("initAuth", context.req);

  context.store.app.router.beforeEach((to, from, next) => {
    next()
  })
}