router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    const value = to.query.src ? to.query.src : to.path;
    const label = to.query.name ? to.query.name : to.name;
    if (whiteList.indexOf(value) == -1) {
        store.commit('ADD_TAG', {
            label: label,
            value: value,
            query: to.query
        });
    }
    if (store.getters.access_token) { // determine if there has token
        /* has token*/
        if (store.getters.isLock && to.path != lockPage) {
            next({ path: lockPage })
            NProgress.done();
        } else if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done();
        } else {
            if (!store.getters.username) {
                store.dispatch('GetUserInfo').then(res => {
                    next({ ...to, replace: true })
                    let userInfo = res.data;
                    storejs.set('userInfo',userInfo);
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        next({ path: '/login' })
                        NProgress.done();
                    })
                })
            } else {
                next()
            }
        }
    } else {
        /* has no token*/
       
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done();
        }
    }
})