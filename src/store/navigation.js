import {ref} from "vue";

export const navigation = ref({
    drawer:false,
    setDrawer(value){
        this.drawer = value;
    }
});