<template>
    <div>
        <v-navigation-drawer temporary absolute v-model="drawer">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">Меню</v-list-item-title>
                    <v-list-item-subtitle>Панель управления KOSMOS</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item
                    v-for="(item, i) in menu"
                    :key="i"
                    :to="item.link"
                >
                    <v-list-item-icon>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>{{item.text}}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app dense>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Kosmos</v-toolbar-title>
            <v-spacer></v-spacer>
            <p>{{ ping }} ms</p>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: "sidebar",
    data: () => ({
        drawer: false,
        ping: 0,
        menu: [
            { text: 'Главная', icon: 'mdi-home', link: '/' },
            { text: 'Профиль', icon: 'mdi-account', link: '/profile' },
            { text: 'Участники', icon: 'mdi-account-group-outline', link: '/members' },
            { text: 'Статистика', icon: 'mdi-chart-bar', link: '/stats' },
            { text: 'Управляющие', icon: 'mdi-police-badge', link: '/stuff' }
        ]
    }),
    created: function(){},
    mounted: function(){}
}
</script>