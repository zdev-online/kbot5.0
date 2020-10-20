module.exports = {
    ssr: true,
    components: true,
    srcDir: 'client/',
    modules: [
        '@nuxtjs/axios',
        "@nuxtjs/style-resources"
    ],
    buildModules: [
        "@nuxtjs/vuetify"
    ],
    vuetify: {
        theme: {
            themes: {
                light: {
                    primary: '#3f51b5',
                    secondary: '#b0bec5',
                    accent: '#8c9eff',
                    error: '#b71c1c'
                }
            }
        },
        icons: {
            iconfont: 'mdi'
        }
    },
    styleResources: {
        sass: [],
        scss: [],
        less: [],
        stylus: []
    },
    head: {
        title: 'Космос',
        meta: [
            { charset: 'utf-8' }
        ]
    },
    css: [
        { src: '~/assets/css/index.scss', lang: 'sass' },
    ]
}