<template>
  <div style="position:relative">
    <div class="report-component">
      <div style="height: 100%;width: 200px;">
        <!-- 跳转到指定模块 -->
        <div class="btn-box">
          <ul class="navgator">
            <li class="navgatorLi" 
            :class="{ isActive: index === stepListIndex }" 
            @click="handleLeft(index)" v-for="(item, index) in stepList" :key="item">
            <span v-if="item.tabRequired" 
            style="color: #f56c6c;font-size: 14px;margin-right: 2px;">*</span>{{ item.nodeName }}</li>
          </ul>
        </div>
      </div>
      <div style="height: 100%;margin:0 0 30px 50px" >
        <div>
          <span class="base-publish unPublish" v-if="reportObj.publishStatus == 0">未发布</span>
          <span class="base-publish published" v-if="reportObj.publishStatus == 1">已发布</span>
          <span class="report-name">{{ reportObj.draftName }}</span>
        </div>
      </div>
    </div>
     <!-- 组件插槽 -->
    <div style="margin-left:250px">
      <slot></slot>
    </div>
    
  </div>
</template>

<script>
import scroll from '@/components/businessComponents/components/scroll'
export default {
  mixins:[scroll],
  props:{
    reportObj:{
      type:Object,
      default:{}
    },
    stepList:{
      type:Array,
      default:[]
    },
    stepListIndex:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      
    };
  },
  created(){
  },
  mounted(){    
  },
  methods: {
     
  }
};
</script>
<style lang='less' scoped>
.report-component {
  display: flex;
  height: 100%;
}
ul,li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.navgator {
  width: 200px;
  position: fixed;
  top: 148px;
  height: 500px;
  border-right: 2px solid #ededed;
  .navgatorLi {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }
  .isActive {
    color: #dd0000;
    border-right: 2px solid #dd0000;
  }
}
.base-publish {
    margin-right: 12px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }
  .unPublish {
    background: rgba(211, 0, 0, 0.08);
    color: #dd0000;
  }
  .published {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
  }
  .report-name{
    font-family: MicrosoftYaHei-Bold; 
    color: #000; 
    font-size: 16px; 
    line-height: 16px; 
    font-weight: bold
  }
</style>

