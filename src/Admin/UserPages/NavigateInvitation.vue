<template>
  <content-loader></content-loader>
</template>

<script>
export default {
  data: () => ({
    loader: true,
    user: "",
  }),
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchUserDetail();
        }
      },
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  methods: {
    fetchUserDetail() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      this.$axios
        .get("userexist", {
          params: {
            slug: this.$route.query.slug,
          },
        })
        .then((response) => {
          if (response.data.user_exists) {
            if (this.user && this.user.email == this.$route.query.slug) {
              this.$router.push({
                name: "dashboard",
              });
            } else {
              this.$router.push({
                name: "login",
              });
            }
          } else {
            this.$router.push({
              name: "register_user",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>