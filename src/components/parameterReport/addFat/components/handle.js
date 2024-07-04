import _ from "lodash"

export default{
  data(){
    return{
      stepList:[],
      reportObj:{},
      addFieldPoolDtoList:[],
      deviceLupOilInfoItem:{},
      equipmentApplicationItem:{},
      lupCheckItem:{},
      addFatCycleItem:{},
      summarySuggestItem:{},
      appendixItem:{}
    }
  },
  created() {
    this.getDetail()
  },
  methods:{
    getDetail(){
      const loading = this.$loading({
        lock: true,
        text: '请稍后，Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.requestMethodGet('/serviceReport/queryServiceDraftDetail', { draftId: this.$route.query.draftId }).then(res => {
        if(res.data.code == 1000){
          ++this.reportKey
          const data = res.data.data
          this.stepList = data.draftDetailJsonDtoList
          this.deviceLupOilInfoItem = this.stepList[0]
          this.equipmentApplicationItem = this.stepList[1]
          this.lupCheckItem = this.stepList[2]
          this.addFatCycleItem = this.stepList[3]
          this.summarySuggestItem = this.stepList[4]
          this.appendixItem = this.stepList[5]
          this.addFieldPoolDtoList = data.addFieldPoolDtoList
          this.reportObj = _.omit(data,['safeTipDto','dynamicItemDto','draftDetailJsonDtoList'])
          loading.close()
        }else{
          loading.close()
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
  }
}