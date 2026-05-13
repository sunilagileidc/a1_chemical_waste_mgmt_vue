import {ref} from "vue";

export const navigation = ref({
    drawer:null,
    setDrawer(value){
        this.drawer = value;
    }
});