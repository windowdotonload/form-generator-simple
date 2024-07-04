<template>
  <div>
    <commonCard :cardItem="addFatCycleItem" :labelPosition="labelPosition">
      <div v-for="(item, index) in addFatCycleItem.nodeValue" :key="index">
        <el-col :span="6">
          <el-form-item>
            <div slot="label" v-if="item.display">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display && item.type != 'button'">{{ item.name }}</span>
              <span v-if="item.unit">({{ item.unit }})</span>
              <!-- button类型 -->
              <div v-if="item.type == 'button' && item.display">
                <addButton :loop-item="item" @handlerAdd="handlerBtn()" />
              </div>
            </div>
            <!-- string类型 -->
            <div v-if="item.type == 'string' && item.display">
              {{ item.value }}
            </div>
            <!-- dropdown2类型 -->
            <div v-if="item.type == 'dropdown2' && item.display">
              <selectCommon :loop-item="item" v-on:commonSelectChange="commonSelectChange" />
            </div>
            <!-- input1类型 -->
            <div v-if="item.type == 'input1' && item.display">
              <inputCommon :loop-item="item" />
            </div>
            <!-- input2类型 -->
            <div v-if="item.type == 'input2' && item.display">
              <inputNumber :loop-item="item" />
            </div>
          </el-form-item>
        </el-col>
      </div>
    </commonCard>
  </div>
</template>

<script>
import commonCard from "@/components/businessComponents/components/common-card";
import inputCommon from "@/components/businessComponents/components/input-common";
import selectCommon from "@/components/businessComponents/components/select-common";
import inputNumber from "@/components/businessComponents/components/input-number";
import addButton from "@/components/businessComponents/components/add-button";
import handleReport from "@/components/businessComponents/components/handleReport";

export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputCommon,
    selectCommon,
    inputNumber,
    addButton
  },
  props: {
    addFatCycleItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      labelPosition: "top",
      paramReportNode:[]
    };
  },
  watch: {
    // reportObj:{
    //   handler:function(val,oldVal){
    //     if(!_.isEmpty(val)){
    //       this.reportObj = val
    //     }
    //   },
    //   immediate:true
    // },
  },
  created() {},
  mounted() {},
  methods: {
    commonSelectChange(val) {
      this.paramReportNode = [this.addFatCycleItem]
      // 常数K与轴承类型有关，与轴承安装方式系数无关
      this.handleRegItem(this.addFatCycleItem);
      this.handleHiddenOrShow(val, this.addFatCycleItem);
      if (val.nameKey == "key_1750") {
        const valueCode = val.valueCode;
        if (valueCode) {
          this.addFatCycleItem.nodeValue.forEach(it => {
            if (it.nameKey == "key_1762") {
              it.value = valueCode == 1 ? 1 : valueCode == 2 ? 5 : valueCode == 3 ? 10 : "";
            }
          });
        }
      }
    },
    // 计算事件
    handlerBtn() {
      // 找出计算需要的字段，并校验必填
      let workTempItem = {};
      this.addFatCycleItem.nodeValue.forEach(item => {
        if (item.nameKey == "key_1760") {
          workTempItem = item;
        }
      });
      if (!workTempItem.value) {
        this.$message({
          type: "warning",
          message: workTempItem.nodeName + workTempItem.name + "必填"
        });
        return;
      }
      let requireItemList = [];
      this.addFatCycleItem.nodeValue.forEach(it => {
        if ((it.nameKey == "key_1750" || it.nameKey == "key_1766") && _.isEmpty(it.valueCode)) {
          requireItemList.push(it);
        }
        if ((it.nameKey == "key_1755" || it.nameKey == "key_1759" || it.nameKey == "key_1768") && (it.value == "" || it.value == null)) {
          requireItemList.push(it);
        }
      });
      console.log("requireItemList", requireItemList);
      if (requireItemList.length) {
        this.$message({
          type: "warning",
          message: requireItemList[0].nodeName + requireItemList[0].name + "必填"
        });
        return;
      }
      // 找出计算需要的字段
      let K = ""; //常数K
      let bearInner = ""; //轴承内径
      let speed = ""; //转速
      let bearCoefficient = ""; //轴承安装方式系数
      let bearWorkingEn = ""; //轴承工作环境系数
      let result = "";
      this.addFatCycleItem.nodeValue.forEach(it => {
        if (it.nameKey == "key_1762") {
          K = it.value;
        }
        if (it.nameKey == "key_1755") {
          bearInner = it.value;
        }
        if (it.nameKey == "key_1759") {
          speed = it.value;
        }
        if (it.nameKey == "key_1766") {
          bearCoefficient = it.valueCode == 1 ? 0.5 : 1;
        }
        if (it.nameKey == "key_1768") {
          bearWorkingEn = it.value;
        }
      });
      if (workTempItem.value > 70) {
        result = ((K * 14000000 - 4 * bearInner) / (speed * Math.sqrt(bearInner))) * Math.pow(0.5, (workTempItem.value - 70) / 15) * bearCoefficient * (bearWorkingEn / 2400);
      } else {
        result = ((K * 14000000 - 4 * bearInner) / (speed * Math.sqrt(bearInner))) * bearCoefficient * (bearWorkingEn / 2400);
      }
      console.log("result...", result.toFixed(2));
      this.addFatCycleItem.nodeValue.forEach(it => {
        if (it.nameKey == "key_jzzq_result") {
          it.value = result.toFixed(2);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.star {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 2px;
}
.item-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.no-value {
  font-family: MicrosoftYaHei;
  margin-left: 10px;
}
</style>
