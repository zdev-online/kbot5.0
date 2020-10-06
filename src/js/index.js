import Vue from 'vue';

// Polyfils
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Plugins
import vuetify from './plugins/vuetify';
// Components
import AppComponent from './components/App.vue';

const App = new Vue({
    el: "#kosmos",
    data: {
    },
    components: {
        "app": AppComponent
    },
    vuetify
});
