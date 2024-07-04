<template>
  <div v-if="componentType=='oilTile'">
    <el-select
      ref="oilTileRef"
      size="small"
      :style="isNotLimitWith ? 'width:100%' : 'width:220px'"
      clearable
      filterable
      :disabled="disabledEditFlag"
      :placeholder="placeholder"
      v-model="loopItem.valueCode"
      :options="tileOilData"
      @focus="handleBlurCascader"
      remote
      @change="handleChangeTile"
      :remote-method="getOilDataBlurTile">
      <el-option v-for="item in tileOilData" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
    </el-select>
  </div>
  <div v-else>
    <el-cascader
      ref="cascaderRef"
      size="small"
      :style="isNotLimitWith ? 'width:100%' : 'width:220px'"
      filterable
      :props="cascaderProps"
      :placeholder="placeholder"
      :disabled="disabledEditFlag"
      v-model="loopItem.valueCode"
      :options="cascaderData"
      @focus="handleBlurCascader"
      @change="handleChangeCascader">
    </el-cascader>
  </div>
</template>

<script>
export default {
  props:{
    loopItem:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    isNotLimitWith:{
      type:Boolean,
      default:false
    },
    disabledEditFlag:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      componentType:'',
      cascaderData:[],
      tileOilData:[],
      cascaderProps:{
        label:'name',
        value:'code',
      },
      placeholder:'请选择'
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.componentType = val.styleJsonDto.cascaderType
          this.getOptionsData(val)
          this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请输入':val.styleJsonDto.placeholder
        }
      },
      immediate:true
    },
  },
  methods: {
    // 获取级联下拉数据
    getOptionsData(val){
      /**
       * deviceType:设备类型
       * 
       * lupDeviceType:润滑点设备类型
       * 
       * oil:油品级联（新用油品名称，油样产品名称，原推荐产品或在用产品，推荐产品）
       * **/ 
      switch(val.styleJsonDto.cascaderType){
        case 'deviceType':
          this.getDeviceTypeData()
        break;
        case 'lupDeviceType':
          this.getLupData()
        break;
        case 'oil':
          this.getOilDataCascader(val)
        break;
        case 'oilTile':
          this.getOilDataBlurTile('', this.loopItem)
        break;
        default:
          break;
      }
    },
    getOilDataCascader(item){
      this.requestMethodGet("/web/config/oil/getOilCascadeMenu")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              if(item.state=='0') {
                if(item.disableOilList[0].status=='0') {
                  res.data.push(item.disableOilList[0])
                }
                if(item.disableOilList[0].status=='1') {
                  let index = res.data.findIndex(v => v.oilNumber === item.disableOilList[0].oilNumber)
                  if(item.disableOilList[0].children[0].status=='1') {
                    let index1 = res.data[index].children.findIndex(v => v.oilNumber === item.disableOilList[0].children[0].oilNumber)

                    console.log(item.disableOilList[0].children[0].children[0],'11111',index1)
                    if(item.disableOilList[0].children[0].children[0].status=='0') {
                      res.data[index].children[index1].children.push(item.disableOilList[0].children[0].children[0])
                    }
                  } else {
                    res.data[index].children.push(item.disableOilList[0].children)
                  }
                }
              }
              this.cascaderData = this.formatData(res.data)
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getOilDataBlurCascader(item) {
      this.requestMethodGet("/web/config/oil/getOilCascadeMenu")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.cascaderData = this.formatData(res.data)
              if(item.state==0) {
                item.value=''
                item.valueCode=''
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 设备类型下拉框数据
    getDeviceTypeData(){
      this.requestMethodGet("/weChat/device/queryDeviceTypeTree4ByStatus", {state:''}).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data && res.data.data.length > 0) {
            this.cascaderData = res.data.data;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
      
    },
    getDeviceTypeDataNew(item) {
      this.requestMethodGet("weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            this.cascaderData = res.data;
            if(item.state==0) {
              item.value=''
              item.valueCode=''
            }
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    getLupDataNew() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.cascaderData = res.data.list
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getLupData(){
      let params = {
        size:200
      }
      this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeParentChildrenList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.list.length > 0) {
              this.cascaderData = res.data.list
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getOilDataBlurTile(val, item) {
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:5000, current:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.tileOilData = res.data.list
            if(item.state==0) {
              item.value=''
              item.valueCode=''
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleBlurCascader() {
      switch(this.loopItem.styleJsonDto.cascaderType){
        case 'deviceType':
          this.getDeviceTypeDataNew(this.loopItem)
        break;
        case 'lupDeviceType':
          this.getLupDataNew()
        break;
        case 'oil':
          this.getOilDataBlurCascader(this.loopItem)
        break;
        case 'oilTile':
          this.getOilDataBlurTile('', this.loopItem)
        break;
        default:
          break;
      }
    },
    formatData(data) {
      return data.length ? data.map(item => {
        return {
          code: this.loopItem.styleJsonDto.cascaderType=='oil' ? item.oilNumber : item.code,
          name: this.loopItem.styleJsonDto.cascaderType=='oil' ? item.oilName : item.name,
          children: _.isEmpty(item.children) ? undefined : this.formatData(item.children)
        }
      }): []
    },
    // 选中的值
    handleChangeCascader(){
      this.$nextTick(()=>{
        const item = this.$refs.cascaderRef.getCheckedNodes()[0]
        console.log(item)
        if(!item){
          this.loopItem.value = ''
          this.loopItem.valueCode = ''
          this.loopItem.wechatReturnArrayValue = [[]]
          return
        }
        this.loopItem.value = item.label
        this.loopItem.valueCode = item.value
        let path = item.path
        let pathLabels = item.pathLabels
        let wechatReturnArrayValue = [[]]
        pathLabels.forEach(itA => {
          wechatReturnArrayValue[0].push({nameCn: itA,oilNumber:''}) // wechatReturnArrayValue是二维数组
        });
        path.forEach((itB,index)=>{
          wechatReturnArrayValue[0][index].oilNumber = itB
        })
        this.loopItem.wechatReturnArrayValue = wechatReturnArrayValue
        this.$emit('cascaderChange',this.loopItem)
      })
    },
    handleChangeTile() {
      this.$nextTick(()=>{
        this.loopItem.value = this.$refs.oilTileRef.selected.currentLabel
        this.$emit('cascaderChange',this.loopItem)
      })
    },
  }
};
</script>
<style lang='less' scoped>
</style>