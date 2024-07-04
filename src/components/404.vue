<template>
  <div class="notfound-contaier">
    <img src="@/assets/notFound.png" />
    <p class="notfound-tip">很抱歉，您要访问的页面地址有误或该页面不存在。</p>
  </div>
</template>

<style scoped>
.notfound-contaier {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  align-content: center;
}
.notfound-tip {
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 13px;
}
</style>
