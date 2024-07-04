<!-- <template>
  <div class="tool-isonas-cotainer" :style="{ padding: hideBackBtn ? '0 3px' : '' }">
    <header class="table-header-name">清洁度:NAS1638/ISO4406</header>
    <el-table :data="tableData" style="margin-top: 15px" :cell-class-name="cellColor" header-cell-style="background:rgba(255, 255, 0, 0.6);">
      <el-table-column prop="col1" align="center" data-header="col1">
        <template #header>
          <span :style="{ fontSize: hideBackBtn ? '12px' : '' }"> ISO 4406 </span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template #header>
          <span :style="{ fontSize: hideBackBtn ? '12px' : '' }">每毫升颗粒数（ISO11171）</span>
        </template>
        <el-table-column prop="col2" :width="hideBackBtn ? 69 : 120" align="center" data-header="col2">
          <template #header>
            <span :style="{ fontSize: hideBackBtn ? '12px' : '' }">>4μm</span>
          </template>
        </el-table-column>
        <el-table-column prop="col3" :width="hideBackBtn ? 69 : 120" align="center" data-header="col3">
          <template #header>
            <span :style="{ fontSize: hideBackBtn ? '12px' : '' }">>6μm</span>
          </template>
        </el-table-column>
        <el-table-column prop="col4" :width="hideBackBtn ? 69 : 120" align="center" data-header="col4">
          <template #header>
            <span :style="{ fontSize: hideBackBtn ? '12px' : '' }">>14μm</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="col5" align="center" data-header="col5">
        <template #header>
          <span :style="{ fontSize: hideBackBtn ? '12px' : '' }">NAS 1638</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="font-size: 13px; color: #999; margin: 15px 0">
      NAS 1638污染等级是由美国航天协会提出的，按5μm-15μm，15μm-25μm，25μm-50μm，50μm-100μm和>100μm的污染物颗粒个数划分为14级。ISO
      4406油液清洁度等级采用3段数码代表油液的清洁度，3段数码分别代表1mL油液中尺寸大于4μm，6μm，14μm的颗粒数，数码之间用斜线分隔。根据颗粒个数的多少共分为30个等级，颗粒数越多，代表等级的数码越大。
    </div>
    <BackFooter v-if="!hideBackBtn" />
  </div>
</template>

<script>
import BackFooter from "../components/toolkitBack.vue";
export default {
  components: {
    BackFooter,
  },
  props: {
    hideBackBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableData: [
        {
          col1: "23/21/18",
          col2: "80000",
          col3: "20000",
          col4: "2500",
          col5: "12",
        },
        {
          col1: "22/20/17",
          col2: "40000",
          col3: "10000",
          col4: "1300",
          col5: "11",
        },
        {
          col1: "21/19/16",
          col2: "20000",
          col3: "5000",
          col4: "640",
          col5: "10",
        },
        {
          col1: "20/18/15",
          col2: "10000",
          col3: "2500",
          col4: "320",
          col5: "9",
        },
        {
          col1: "19/17/14",
          col2: "5000",
          col3: "1300",
          col4: "160",
          col5: "8",
        },
        {
          col1: "18/16/13",
          col2: "2500",
          col3: "640",
          col4: "80",
          col5: "7",
        },
        {
          col1: "17/15/12",
          col2: "1300",
          col3: "320",
          col4: "40",
          col5: "6",
        },
        {
          col1: "16/14/11",
          col2: "640",
          col3: "160",
          col4: "20",
          col5: "5",
        },
        {
          col1: "15/13/10",
          col2: "320",
          col3: "80",
          col4: "10",
          col5: "4",
        },
        {
          col1: "14/12/09",
          col2: "160",
          col3: "40",
          col4: "5",
          col5: "3",
        },
        {
          col1: "13/11/08",
          col2: "80",
          col3: "20",
          col4: "3",
          col5: "2",
        },
        {
          col1: "12/10/07",
          col2: "40",
          col3: "10",
          col4: "1",
          col5: "1",
        },
        {
          col1: "11/09/06",
          col2: "20",
          col3: "5",
          col4: "1",
          col5: "0",
        },
        {
          col1: "10/08/05",
          col2: "10",
          col3: "3",
          col4: "0",
          col5: "00",
        },
      ],
    };
  },
  methods: {
    cellColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 4) {
        return "col-1";
      } else if (columnIndex == 1 || columnIndex == 2 || columnIndex == 3) {
        return "col-2";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tool-isonas-cotainer {
  padding: 0 20px;
  padding-bottom: 50px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  background: #f5f5f5;
  overflow-x: hidden;

  /deep/ .is-scrolling-none {
    overflow: hidden;
    overflow-y: auto;
    overflow-x: scroll;
  }
  /deep/ .is-scrolling-none::-webkit-scrollbar {
    display: none;
  }
  /deep/ .el-table--scrollable-y ::-webkit-scrollbar {
    display: none;
  }
  /deep/ .el-table--scrollable-x ::-webkit-scrollbar {
    display: none;
  }
}
.table-header-name {
  box-sizing: border-box;
  padding-top: 10px;
  color: #4d74c5;
  font-size: 20px;
}
</style>
<style>
.col-1 {
  background: #dbdbdb;
}
.col-2 {
  background: #ddebf7;
}
</style> -->

<template>
  <div v-loading="loading" style="margin:0;padding:0;width:100%;height:100%">
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/IsoForNasTable`" frameborder="0" style="width:100%;height:100%"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: window.location,
      loading: true
    };
  },
  mounted() {
    this.$refs.iframe.onload = () => {
      this.loading = false;
    };
  }
};
</script>

<style></style>
