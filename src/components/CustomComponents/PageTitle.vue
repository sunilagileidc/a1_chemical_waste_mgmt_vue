<template>
  <div class="d-flex page-title">
    <div class="d-flex">
      <div class="page-header ">
        <i style="font-size: 35px" :class="google_icon.icon"
          ><span :class="google_icon.color">{{
            google_icon.icon_name
          }}</span></i
        >
      </div>
      <div class="page-header ml-3 content-size " style="margin-top: 2px;">
        {{ heading }}
        <div class="page-title-subheading">{{ subheading }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    heading: String,
    subheading: String,
    google_icon: Object,
  },
};
</script>
<style scoped>
.content-size {
  font-size: 20px;
}
.page-title {
  padding: 15px;
  /* background: #f9f9f9; */
  /* border-radius: 6px; */
  margin: 1px;
  box-shadow: 0px 0px 0px black !important;
}
</style>
