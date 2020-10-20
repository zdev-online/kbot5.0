<template>
    
    <v-app>
        <sidebar :isDark="isDark"/>
        
        <v-main>
                <router-view>
                    <nuxt/>
                </router-view>
        </v-main>

        <foot :isDark="isDark"/>
    </v-app>
</template>

<script>
export default {
    data: function(){
        return {
            isDark: true
        }
    }
}
</script>