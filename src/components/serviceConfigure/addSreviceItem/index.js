import { getServiceIndustry, getAssociatedServiceItems } from '@/api/serviceConfigure/index'

export default {
  data () {
    return {
      serviceIndustry: [],
      serviceIndustryDialog: false,
      configServiceIndustryDialog: false,
      value1: '',
      serviceIndustryTree: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      serviceIndustryTreeLoading: false
    }
  },
  created () {
    this.getServiceIndustryMet()
  },
  methods: {
    getServiceIndustryMet () {
      this.serviceIndustry = []
      getServiceIndustry().then((res) => {
        if (res.data.code === 1000) {
          this.serviceIndustry = res.data.data
          let arr = []
          this.basicForm.serviceIndustrys.map(key => {
            if (res.data.data.filter(item => key === item.id).length > 0) {
              arr.push(key)
            }
          })
          this.basicForm.serviceIndustrys = arr
        }
      }).catch((err) => { console.log(err) })
    },
    // 关联服务项点击查看
    handlerLookServiceIndustry () {
      this.serviceIndustryTree = []
      this.serviceIndustryTreeLoading = true
      getAssociatedServiceItems({serviceNumber: 1}).then((res) => {
        if (res.data.code === 1000) {
          let data = res.data.data
          let arr = []
          data.map(item => {
            let obj = {
              name: item.name,
              id: item.id,
              children: item.serviceItems.map(j => {
                return {
                  name: j.serviceName,
                  id: j.serviceNumber
                }
              })
            }
            arr.push(obj)
          })
          this.serviceIndustryTree = arr
          this.serviceIndustryTreeLoading = false
        }
      }).catch((err) => { console.log(err) })
      this.serviceIndustryDialog = !this.serviceIndustryDialog
    },
    // 配置服务行业按钮，弹窗打开
    handlerConfigServiceIndustry () {
      this.configServiceIndustryDialog = true
    },
    // 配置服务行业弹窗关闭
    csiDialogbeforeClose () {
      this.configServiceIndustryDialog = false
    }
  }
}
