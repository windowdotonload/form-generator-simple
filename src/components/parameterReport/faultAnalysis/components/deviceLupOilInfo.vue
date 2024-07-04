<template>
  <div>
    <cardInfo :cardItem="deviceLupOilInfoItem" :deviceDetailObj="reportObj">
      <el-form ref="deviceLupOilInfoForm" :model="deviceLupOilInfoItem.nodeValue" label-position="left" style="padding:0 20px;">
        <el-row>
          <div v-for="(item,index) in deviceLupOilInfoItem.nodeValue" :key="index">
            <el-col :span="item.type == 'input1'?24:6">
              <el-form-item  v-if="item.type != 'img'">
                <div slot="label">
                  <span v-if="item.required" class="star">*</span>
                  <span v-if="item.display">{{ item.name }}</span>
                  <span v-if="item.unit">({{ item.unit }})</span>
                </div>
                <!-- string类型展示 -->
                <div  v-if="item.type == 'string'">
                  <div class="item-overflow" v-if="item.value" style="margin-left:10px;">
                    <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
                      <span>{{ item.value }}{{ item.unit }}</span>
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <span class="no-value" v-if="item.required" :style="{color:item.required?'#dd0000':'#666'}">{{item.required?'暂无，请补充':'暂无'}}</span>
                  </div>
                </div>
                <!-- input1类型 -->
                <div v-if="item.type == 'input1'">
                  <inputCommon :loop-item="item"/>
                </div>
              </el-form-item>
            </el-col>
            <!-- img类型 -->
            <el-col :span="24" v-if="item.type == 'img'">
              <el-form-item>
                <div slot="label">
                  <span v-if="item.required" class="star">*</span>
                  <span>{{ item.name }}</span>
                  <span>（最多上传{{ item.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                </div>
              </el-form-item>
              <imgUpload :loopItem="item"/>
            </el-col>

            <!-- img2类型 -->
            <el-col :span="24" v-if="item.type == 'img2'">
              <el-form-item>
                <div v-for="(img,imgIdx) in item.imgFullUrl" :key="imgIdx" v-if="item.imgFullUrl.length>0">
                  <img :src="img" style="width:148px;height:148px">
                </div>
                <div v-if="item.imgFullUrl.length==0" style="color:#606266">
                  <span class="no-value" v-if="item.required" :style="{color:item.required?'#dd0000':'#666'}">{{item.required?'暂无，请补充':'暂无'}}</span>
                </div>
              </el-form-item>
            </el-col>

          </div>
        </el-row>
      </el-form>
    </cardInfo>
  </div>
</template>

<script>
import cardInfo from '@/components/businessComponents/components/card-info'
import imgUpload from '@/components/businessComponents/components/img-upload'
import inputCommon from '@/components/businessComponents/components/input-common'
export default {
  components:{
    cardInfo,
    imgUpload,
    inputCommon},
  props:{
    deviceLupOilInfoItem:{
      type:Object,
      default:{}
    },
    reportObj:{
      type:Object,
      default:{}
    }
  },
  data(){
    return {

    }
  },
   watch:{
    reportObj:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.reportObj = val
          // console.log('deviceLupOilInfoItem',this.reportObj)
        }
      },
      immediate:true
    },
  },
  created(){
    
  },
  mounted(){

  },
  methods:{
    
  }
}
</script>

<style lang='less' scoped>
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
  .item-overflow{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .no-value{
    font-family:MicrosoftYaHei;
    margin-left:10px;
  }
</style>