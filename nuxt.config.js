module.exports = {
    srcDir: 'client/',
    buildDir: 'nuxt/',
    components: true,
    telemetry: false,
    buildModules: ['@nuxtjs/vuetify'],
    modules: [],
    head: {
        title: 'Kosmos',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'Панель бота KBot',
                name: 'Для участников клана Космос',
                content: ''
            }
        ]
    },
    css: ['~/assets/scss/index.scss'],
    plugins: []
}