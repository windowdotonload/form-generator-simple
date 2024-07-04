<template>
  <div v-loading="loading" style="margin:0;padding:0;width:100%;height:100%">
    <iframe ref="iframe" :src="src" frameborder="0" style="width:100%;height:100%"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: "",
      location: window.location,
      loading: true
    };
  },
  mounted() {
    this.src = `${location.origin}/tool/#/toolkit/tcocv?configuration=${encodeURIComponent(sessionStorage.getItem("toolkit-TcoCV"))}`;
    this.$refs.iframe.onload = () => {
      this.loading = false;
    };
  }
};
</script>

<style></style>
