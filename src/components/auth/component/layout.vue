<template>
  <div class="auth-layout__container">
    <div class="auth-layout__btn-group">
      <slot name="buttonGroup" />
    </div>
    <div class="auth-layout">
      <div class="auth-layout__left-menu" v-if="$slots.leftMenu">
        <slot name="leftMenu" />
      </div>
      <div class="auth-layout__content" v-if="$slots.content">
        <slot name="content" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.auth-layout__container {
  min-height: 500px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-top: 1px solid #e9e9e9;
}
.auth-layout {
  min-height: 500px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: auto;
  height: calc(100vh - 128px);
}
.auth-layout__btn-group {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 50px;
  position: absolute;
  right: 30px;
  top: -50px;
  z-index: 999;
}
.auth-layout__left-menu {
  box-sizing: border-box;
  position: relative;
  border-right: 1px solid #e9e9e9;
  width: 13%;
  margin-top: 10px;
  padding-left: 10px;
  padding-bottom: 0;
  height: 98%;
  overflow: auto;
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 3px !important;
  }
}
.auth-layout__content {
  box-sizing: border-box;
  position: relative;
  border: 1px solid #e9e9e9;
  width: 86%;
  margin-top: 10px;
  margin-left: 10px;
  padding-bottom: 0;
  height: 98%;
  overflow: auto;
}
</style>
