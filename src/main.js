import { createApp } from 'vue';
import App from '@/App.vue';
import { registerPlugins } from '@/plugins';
import { validationSchema } from '@/validate/validate';
import JsonCSV from 'vue-json-csv';

const app = createApp(App)

app.config.globalProperties.validationSchema = validationSchema;
app.component('downloadCsv', JsonCSV)

registerPlugins(app)
app.mount('#app')
