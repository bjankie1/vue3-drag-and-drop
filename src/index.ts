import Drag from "./Drag.vue";
import Drop from "./Drop.vue";
import type { Plugin } from "vue";

export const EventBusPlugin: Plugin = {
  install: (app, options: {}) => {
    app.component("drag", Drag);
    app.component("drop", Drop);
  },
};
