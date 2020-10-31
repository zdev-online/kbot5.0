<template>
    <v-app>
        <sidebar/>
        <v-main>
                <router-view>
                    <nuxt/>
                </router-view>
        </v-main>
    </v-app>
</template>

<script>
export default {
    data: function(){
        return {}
    }
}
</script>