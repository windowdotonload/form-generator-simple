<template>
<el-card class="overallSituationAdvice" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title">
    <el-divider direction="vertical"></el-divider>
    <span>{{ overallSituationName }}</span>
    </div>
    <el-form :model="overallSituationObj" ref="oilChangeRef" label-position="top" label-width="300px" style="padding:0 20px;">
    <el-row>
        <div v-for="(item, index) in overallSituationObj" :key="index">
        <el-col :span="24" v-if="item.children.length>0" v-for="(item2, index1) in item.children" :key="index1">
            <el-form-item  :required="item2.required">
              <span slot="label" >
                  {{ item2.name }}  {{(index1+1)}}
                  <span v-if="(index1!=0 && index1!=1)" @click="deleteItem(index,index1)" class="delete">删除</span>
              </span>
            <!-- 文本域 -->
            <el-input
                v-if="type == 'edit' && item2.type == 'textarea'"
                type="textarea"
                placeholder="请输入"
                v-model="item2.value"
                :maxlength="item2.length"
                show-word-limit
                :autosize="autosize"
                clearable
            />
            </el-form-item>
            <div v-if="index1==item.children.length-1 && item.nameKey=='key_1515'">
                <el-button @click="addConclusion(index,index1)" size="small" type="text" style="color:#001450;font-size:14px;margin-bottom:10px;">+ 添加调研结论和改进建议</el-button>
            </div>
        </el-col>
        </div>
    </el-row>
    </el-form>
</el-card>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => {
        return "";
      }
    },
    overallSituationName: {
      type: String,
      default: () => {
        return "";
      }
    },
    overallSituationObj: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dynamicItemDto: {
        type: Object,
        default: () => {
            return []
        }
    },
  },
  data() {
    return {
      
    };
  },
  mounted() {},
  created() {},
  methods: {
    // 添加调研结论
    addConclusion(index,index1) {
      const data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic3))
      data._uid = Date.now()
      this.overallSituationObj[index].children.push(data)
    },
    // 添加改进建议
    addImprovementSuggestions(index,index1) {
      const data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic4))
      data._uid = Date.now()
      this.overallSituationObj[index].children.push(data)
    },
    // 删除调研结论 和 改进建议
    deleteItem(index,index1) {
      this.overallSituationObj[index].children.splice(index1,1)
    },
    // 验证
    validateOverallAdvice() {
      let isPass = false
      const data = this.overallSituationObj;
      let childrenNotValue=[]
      let childData=[]
      let totalCheckList=[]
      console.log(data)
      const emptyList = data.filter(item => {
        return item.required && !item.value;
      });
      data.forEach(it=>{
        if(it.children.length>0) {
          it.children.forEach(itChild=>{
            childData.push(itChild)
          })
        }
      })
      childrenNotValue= childData.filter(item => {
        return item.required && !item.value;
      });
      totalCheckList = childrenNotValue.concat(emptyList)
      if (totalCheckList.length > 0) {
        this.$message({
          message: totalCheckList[0].name + "必填",
          type: "warning"
        });
        return;
      } else {
        isPass = true
      }
      return isPass
    }
  }
};
</script>

<style lang='less'>
.overallSituationAdvice {
  .noUploadBtn .el-upload--picture-card {
    display: none;
  }
  .delete {
    color:#dd0000;
    margin-left: 10px;
    cursor: pointer;
  }
  .el-divider--vertical {
    width: 3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
  }
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
  .title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
  }
  .el-upload-list__item {
    transition: none !important;
  }
}
</style>
