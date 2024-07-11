
import Toast, { type PluginOptions, POSITION as position } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
    position: position.TOP_RIGHT,
    timeout: 2984,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

export default defineNuxtPlugin((app) => {
    app.vueApp.use(Toast, options);
});