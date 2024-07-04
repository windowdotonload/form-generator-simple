export default {
  methods: {
    // 点击导航菜单，页面滚动到指定位置
    handleLeft (index) {
      this.stepListIndex = index
      this.$el.querySelector(`#id${index}`).scrollIntoView({
        behavior: 'smooth', // 平滑过渡
        block: 'start' // 上边框与视窗顶部平齐。默认值
      })
      let timeId
      clearTimeout(timeId)
      timeId = setTimeout(() => {}, 200)
    },
    // // 监听页面元素滚动，改变导航栏选中
    scrollToTop () {
      const ele = document.getElementById('rightCardId')
      // dom滚动位置
      const scrollTop = ele.scrollTop
      // 计算每一块的距离顶部高度
      let heightArr = []
      // console.log('高度....',el.clientHeight,el.offsetTop,el.clientTop,el.getBoundingClientRect().top,this.stepList.length)
      for(let i =0;i < this.stepList.length; i++){
        let hg = document.getElementById(`id${i}`).offsetTop
        heightArr.push(hg)
      }
      for(let j =0;j < heightArr.length; j++){
        if(scrollTop>=heightArr[j]){
          this.stepListIndex = j
        }else if(scrollTop<0){
          this.stepListIndex = 0
        }
      }
    },
  }
}