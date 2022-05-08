import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";
import browse from "./modules/browse";
import profile from "./modules/profile";
import storage from "./modules/storage";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    profile,
    browse,
    storage,
  },
});
