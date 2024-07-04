<template>
  <div style="display: flex;flex-direction: column;">
    <div v-for="(nodeItem,nodeIndex) in nodeList" :key="nodeIndex">
      <div class="node-title">{{nodeItem.nodeName}}</div>
      <el-form ref="serviceReportViewForm" :model="nodeItem.nodeValue" v-if="nodeItem.nodeName != '效益' && nodeItem.isLup" :inline="true" label-position="left" style="margin-top: 10px;">
        <div v-for="(item,nodeValueIndex) in nodeItem.nodeValue" :key="nodeValueIndex">
          <div v-for="(child1,index1) in item.children" :key="index1">
            <el-col :span="child1.nameKey=='lup_name' ? 24 : 12">
              <el-form-item>
                <div slot="label" v-if="child1.nameKey!='lup_name'">
                  <span :style="{width:`${(child1.name.length)*14}px`},'fontSize:13px'">{{child1.name}}</span>
                </div>
                <div style="color:#333;" :style="child1.nameKey=='lup_name'?'':'margin-left: 16px;'">
                  <span>{{child1.value?child1.value:'暂无'}}</span>
                  <span v-if="child1.unit">{{child1.unit?child1.unit:''}}</span>
                </div>
                
              </el-form-item>
            </el-col>
          </div>
        </div>
      </el-form>
      <el-form ref="serviceReportViewForm" :model="nodeItem.nodeValue" v-if="nodeItem.nodeName != '效益' && !nodeItem.isLup">
        <div v-for="(item,index) in nodeItem.nodeValue" :key="index" v-if="!nodeItem.isLup">
          <el-col span="24">
            <el-form-item>
              <div slot="label" class="label-content">
                <span :style="{width:`${(item.name.length*14)+10}px`}">{{item.name}}</span>
                <span style="color: #333; flex: 1;">{{item.value?item.value:'暂无'}}</span>
              </div>
            </el-form-item>
          </el-col>
        </div>
      </el-form>


      <div v-else style="margin-top: 16px;" v-if="nodeItem.nodeName == '效益'">
        <el-row :gutter="16">

          <el-col span="8">
            <div class="benefit-content">
              <div class="benefit-title-content">
                <img src="../../../assets/save.png" alt="">
                <div class="benefit-title">安全</div>
              </div>
              <el-divider style="margin:0 16px"/>

              <div style="display: flex;align-items: center;">
                <div class="title">安全：</div>
                <div class="value">{{saveVal?saveVal:'暂无'}}{{saveVal?'小时':''}}</div>
              </div>

            </div>
          </el-col>
          <el-col span="8">
            <div class="benefit-content">
              <div class="benefit-title-content">
                <img src="../../../assets/env.png" alt="">
                <div class="benefit-title">环保</div>
              </div>
              <el-divider />

              <div style="padding-left: 16px;">
                <div class="env-content">
                  <div class="title">减少废润滑油的产生和处置：</div>
                  <div class="value">{{envWasteOilVal?envWasteOilVal:'暂无'}}{{envWasteOilVal?'升':''}}</div>
                </div>

                <div class="env-content">
                  <div class="title">减少CO₂排放情况：</div>
                  <div class="value">{{envReduceCo2Flag?envReduceCo2Flag=='1'?'有':'无':'暂无'}}</div>
                </div>

                <div class="env-content" v-if="envReduceCo2Flag=='1'">
                  <div class="title">减少CO₂排放：</div>
                  <div class="value">{{envReduceCo2Val?envReduceCo2Val:'暂无'}}{{envReduceCo2Val?'吨':''}}</div>
                </div>
              </div>

            </div>
          </el-col>

          <el-col span="8">
            <div class="benefit-content">
              <div class="benefit-title-content">
                <img src="../../../assets/efficient.png" alt="">
                <div class="benefit-title">高效</div>
              </div>
              <el-divider />

              <div style="display: flex;align-items: center;padding-left: 16px;">
                <div class="title">高效：</div>
                <div class="value">{{effectVal?effectVal:'暂无'}}{{effectVal?'万':''}}</div>
              </div>

            </div>
          </el-col>
          
        </el-row>
        
      </div>

    </div>
  </div>
  </template>
  
  <script>
  export default {
    props:{
      workOrderNumber:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        nodeList:[],
        sysAttachmentList:[],
        reportType:'',
        saveVal:'',
        envWasteOilVal:'',
        envReduceCo2Flag:'',
        envReduceCo2Val:'',
        effectVal:''
      };
    },
    watch:{
      workOrderNumber:{
        handler:function(val,oldVal){
          if(val){
            this.getData()
          }
        },
        immediate: true
      }
    },
    methods: {
      getData(){
        this.requestMethodGet('/web/workOrder/getCoreDataOfWorkOrder',{workOrderNumber:this.workOrderNumber}).then(res=>{
          if(res.data.code == 1000){
            const data = res.data.data.draftDetailJsonDtoList
            const { reportType, sysAttachmentList} = res.data.data
            data.forEach(it=>{
              if(it.nodeName=='效益'){
                it.nodeValue.forEach(b=>{
                  switch(b.nameKey){
                    case 'safety':
                      this.saveVal = b.value
                    break;
                    case 'reduce_waste_oil':
                      this.envWasteOilVal = b.value
                    break;
                    case 'reduce_co2_situation':
                      this.envReduceCo2Flag = b.valueCode
                    break;
                    case 'reduce_co2':
                      this.envReduceCo2Val = b.value
                    break;
                    case 'high_efficiency':
                      this.effectVal = b.value
                    break;
                  }
                })
              }
              it.nodeValue.forEach(item=>{
                if(item.name.includes('润滑点信息')){
                  it.isLup = true
                  item.children.forEach(lup=>{
                    lup.isGroup = (lup.nameKey == 'lup_name' || lup.nameKey == 'lup_current_oil' || lup.nameKey == 'lup_oil_change_period' || lup.nameKey=='lup_oil_add_period')
                  })
                }else{
                  it.isLup = false
                }
              })
            })
            this.nodeList = data
            this.sysAttachmentList = sysAttachmentList
            this.reportType = reportType
          }else{
            this.$message({
                message: res.data.msg,
                type: "error"
            });
          }
        })
      },
    }
  };
  </script>
  <style lang='less' scoped>
 .node-title{
  font-size: 13px;
  line-height: 13px;
  font-weight: 400;
  color: #dd0000;
  margin-top: 24px;
 }
 .label-content{
  display: flex;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  margin-top: 20px;
 }
 .benefit-content{
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  height: 152px;
  font-size: 13px;
  line-height: 13px;
  font-weight: 400;
  padding: 0 16px;
 }
 .benefit-title-content{
  display: flex;
  align-items: center;
  padding-top: 16px;
 }
 .benefit-title{
  font-size: 14px;
  color: #000;
  margin-left: 10px;
 }
 /deep/.el-divider--horizontal{
  margin: 12px 0;
 }
 .title{
  color:#999
 }
 .value{
  color: #333;
  margin-left: 12px;
 }
 .env-content{
  display: flex;
  align-items: center;
  margin-bottom: 12px;
 }
 /deep/ .over-item-label .el-form-item__label{
  width: 150px !important;
 }
</style>
  
  