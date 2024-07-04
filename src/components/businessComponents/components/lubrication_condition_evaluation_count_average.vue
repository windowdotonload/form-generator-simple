<template>
  <div style="position:relative">
    <div slot="label" style="display:flex;align-items:center" v-if="child1.display">
      <span v-if="child1.required && child1.display" class="star">*</span>
      <span v-if="child1.display && child1.type != 'button'">{{ child1.name }}</span>
      <span v-if="child1.tip" class="tips">
        <el-tooltip effect="dark" :content="child1.tip.content" placement="top-start">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </span>
    </div>
    <reportIndex
      v-if="child1.display"
      :reportId="reportType"
      :formItem="child1"
      :parnmentItem="child"
      @handleAddBlock="handleAddBlock"
      @handleAddFile="handleAddFile"
      @radioCommonChange="radioCommonChange"
      @selectAverageChange="selectAverageChange"
    />
  </div>
</template>

<script>
import reportIndex from "@/components/businessComponents/components/report-index";
export default {
  components: { reportIndex },
  props:{
    child1:{
      type:Object,
      default:{}
    },
    reportType:{
      type:Number,
      default:null
    },
    child:{
      type:Object,
      default:{}
    },
  },
  data() {
    return {
      
    };
  },
  watch:{
    child:{
      handler:function(val,oldVal){
        
      },
      immediate:true,
      deep:true
    }
  },
  methods: {
    // 下拉改变
    selectAverageChange(item){
      this.child.children.forEach(it=>{
        if(it.id == item.id){
          it = item
        }
      })
      this.$emit('countAverageVal',this.child.id)
    },
  }
};
</script>
<style lang='less' scoped>
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
</style>

