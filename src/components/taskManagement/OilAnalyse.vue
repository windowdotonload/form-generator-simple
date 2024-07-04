<template>
  <div class="analyse-container" v-loading="downloadLoading" element-loading-text="导出数据中">
    <div class="split-line"></div>
    <div class="content-box">
      <div class="left-form">
        <div style="padding: 20px">
          <el-form label-position="top" ref="form" :model="form" :rules="rules">
            <el-form-item label="图标名称">
              <el-input size="small" v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="时间范围" prop="daterange">
              <el-date-picker
                unlink-panels
                clearable
                v-model="form.daterange"
                size="small"
                style="width: 100%"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="设备类型">
              <el-cascader
                collapse-tags
                placeholder="全部"
                filterable
                size="small"
                clearable=""
                style="width: 100%"
                v-model="form.deviceTypeCodes"
                :show-all-levels="false"
                :options="deviceTypeTreeData"
                :props="{ value: 'code', label: 'name', multiple: true, emitPath: false }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="润滑点设备类型">
              <el-select filterable clearable size="small" multiple v-model="form.lubricationPointTypeCodes" placeholder="全部" style="width: 100%">
                <el-option :label="item.name" :value="item.code" v-for="item in LubTypeList" :key="item.code"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="油品名称">
              <el-select style="width: 100%" size="small" v-model="form.oilCodes" placeholder="全部" clearable filterable multiple remote :loading="loadingRemote" :remote-method="getOilNameData">
                <el-option v-for="item in oilNameTreeData" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
              </el-select>
              <!-- <el-cascader
                collapse-tags
                placeholder="全部"
                :show-all-levels="false"
                filterable
                size="small"
                clearable=""
                style="width: 100%"
                v-model="form.oilCodes"
                :options="oilNameTreeData"
                :props="{ multiple: true, value: 'oilNumber', label: 'oilName', emitPath: false }"
              ></el-cascader> -->
            </el-form-item>
            <el-form-item label="所属客户" v-if="userInfo.userType != 2">
              <el-select
                :filter-method="filterCompany"
                filterable
                multiple
                @change="selectCustomer"
                collapse-tags
                clearable
                size="small"
                v-model="form.customerNumbers"
                placeholder="全部"
                style="width: 100%"
                :loading="loadingMore"
              >
                <el-option :label="item.companyName" :value="item.companyNumber" v-for="item in customerList" :key="item.companyNumber"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属车间">
              <el-select v-if="form.customerNumbers.length == 1" filterable multiple clearable size="small" v-model="form.workshopIds" placeholder="全部" style="width: 100%">
                <el-option :label="item.workshopName" :value="item.workshopId" :key="item.workshopId" v-for="item in workshopList"> </el-option>
              </el-select>
              <el-select v-else filterable multiple clearable size="small" v-model="form.workshopIds" placeholder="全部" style="width: 100%">
                <el-option :label="item.workshopName" :value="item.workshopId" :key="item.workshopId" v-for="item in []"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button size="small" type="default" @click="resetForm">重置</el-button>
          <el-button size="small" type="danger" @click="exportCharts">生成图表</el-button>
        </div>
      </div>
      <div class="right-content">
        <div class="top-instructions">
          <div class="data-box-item">
            <p class="box-item-title">总用油量 (L)</p>
            <p class="box-item-val">{{ topCardInfo.totalOilConsumption }}</p>
          </div>
          <div class="data-box-item">
            <p class="box-item-title">设备数 (台)</p>
            <p class="box-item-val">{{ topCardInfo.deviceQuantity }}</p>
          </div>
          <div class="data-box-item">
            <p class="box-item-title">润滑点数 (个)</p>
            <p class="box-item-val">{{ topCardInfo.lubricationPointQuantity }}</p>
          </div>
        </div>

        <div class="charts-box">
          <div class="charts-title-line">
            <div class="top-ins-title"></div>
            <p class="cate-title">用油量趋势图</p>
          </div>
          <div class="chart-show-box" id="trend-line-chart" @click="chartGio('用油量趋势图')"></div>
        </div>
        <div class="charts-box">
          <div class="charts-title-line">
            <div class="top-ins-title"></div>
            <p class="cate-title">各油品用量排名</p>
          </div>
          <div v-if="showPieNoData" class="nodata-class">暂无数据</div>
          <div v-if="!showPieNoData">
            <div class="chart-show-box" id="ranking-round-chart" @click="chartGio('各油品用量排名')"></div>
          </div>
        </div>
        <div class="charts-box">
          <div class="charts-title-line">
            <div class="top-ins-title"></div>
            <p class="cate-title">设备&润滑点用油量明细</p>
          </div>
          <div class="chart-show-box">
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }">
              <el-table-column prop="deviceName" label="设备名称"> </el-table-column>
              <el-table-column prop="deviceType" label="设备类型"> </el-table-column>
              <el-table-column prop="lubricationPointName" label="润滑点名称"> </el-table-column>
              <el-table-column prop="lubricationPointType" label="润滑点设备类型"> </el-table-column>
              <el-table-column prop="customerName" label="所属客户" v-if="userInfo.userType != 2" show-overflow-tooltip> </el-table-column>
              <el-table-column show-overflow-tooltip prop="workShopName" label="所属车间"> </el-table-column>
              <el-table-column prop="totalAmount" label="用油总量"> </el-table-column>
              <el-table-column prop="changeOilAmount" label="换油量"> </el-table-column>
              <el-table-column prop="addOilAmount" label="加油量"> </el-table-column>
              <el-table-column prop="addGreaseAmount" label="加脂量"> </el-table-column>
              <el-table-column label="操作">
                <template #default="slotScope">
                  <el-button size="small" @click="deviceDetail(slotScope.row)" type="text">查看</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              style="position: relative; bottom: -5px; right: 0x; display: flex; justify-content: flex-end"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.current"
              :page-sizes="[5, 10, 20, 30, 50]"
              :page-size="pageInfo.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            />
          </div>
        </div>
        <div class="charts-box">
          <div class="charts-title-line">
            <el-button type="danger" size="small" @click="exportData">导出</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import { initTrendLineChart, initPieChart } from "./initCharts.js";
const checkDate = (rule, value, callback) => {
  if (!value) return callback();
  const start = value[0];
  const endTime = value[1];

  const begin = new Date(start).getTime();
  const end = new Date(endTime).getTime();
  const day = (end - begin) / (24 * 60 * 60 * 1000);
  if (day > 365) {
    return callback(new Error("选择的时间范围在一年内"));
  } else {
    return callback();
  }
};
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      loadingRemote: false,
      downloadLoading: false,
      selectAll: false,
      showPieNoData: false,
      loadingMore: false,
      topCardInfo: {},
      trendData: {},
      PieData: {},
      tableData: [],
      total: 0,
      companyTotal: 0,
      customerList: [],
      workshopList: [],
      LubTypeList: [],
      deviceTypeTreeData: [],
      oilNameTreeData: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      pageInfo: {
        size: 10,
        current: 1
      },
      companyPageInfo: {
        size: 300,
        current: 1
      },
      form: {
        name: "用油数据统计",
        daterange: "",
        deviceTypeCodes: [],
        lubricationPointTypeCodes: [],
        oilCodes: [],
        customerNumbers: [],
        workshopIds: ""
      },
      rawForm: null,
      rules: {
        daterange: [{ validator: checkDate, trigger: "blur" }]
      }
    };
  },

  async mounted() {
    this.rawForm = Object.assign({}, this.form);
    await this.__init();

    if (this.userInfo.userType == 2) {
      this.form.customerNumbers = [this.userInfo.companyNumber];
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", {
        companyId: this.userInfo.companyId,
        size: 1000,
        current: 1
      }).then(res => {
        if (res.data.code == 1000) {
          this.workshopList = res.data.data.list;
        }
      });
    }
  },

  methods: {
    async __init() {
      await this.getChartsData();
      await this.getCompanyList();
      await this.getLubTypeList();
      await this.getDeviceTypeList();
      await this.getOilNameData('');
    },
    async resetForm() {
      this.form = Object.assign({}, this.rawForm);
      await this.getChartsData(this.form);

      if (this.userInfo.userType == 2) {
        this.form.customerNumbers = [this.userInfo.companyNumber];
        this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", {
          companyId: this.userInfo.companyId,
          size: 1000,
          current: 1
        }).then(res => {
          if (res.data.code == 1000) {
            this.workshopList = res.data.data.list;
          }
        });
      }
    },
    async getChartsData(form) {
      await this.getOilOverview(form);
      await this.getOilTrendData(form);
      await this.getPieData(form);
      await this.getTableData(form);
    },
    async exportData() {
      this.$gio.exportDetailsOfOilConsumption();
      this.downloadLoading = true;
      const params = Object.assign({}, this.form);
      let startDate = null;
      let endDate = null;
      if (this.form.daterange && this.form.daterange.length == 2) {
        startDate = this.moment(this.form.daterange[0]).format("YYYY-MM-DD");
        endDate = this.moment(this.form.daterange[1]).format("YYYY-MM-DD");
      }
      let url = '/oilTask/oilConsumption/detail/download';
      let paramObj = { 
        ...params,
        startDate,
        endDate,
        responseTypeBlob: true
      }
      this.requestMethodPost(url, paramObj).then(res => {
        let data = res.data;
        let fileReader = new FileReader();
        fileReader.onload = function() {
          // 解析成对象失败，说明是正常的文件流
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          const objectUrl = URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = objectUrl;
          link.setAttribute("download", "用油数据统计.xlsx");
          document.body.appendChild(link);
          link.click();
        };
        fileReader.readAsText(data);
        this.downloadLoading = false;
      })
      .catch(res => {
        this.downloadLoading = false;
      });
    },

    deviceDetail(row) {
      this.$router.push({
        name: "EquipmentProfileDetail",
        query: {
          deviceNumber: row.deviceNumber
        }
      });
    },
    // 列标题 Label 区域渲染使用的 Function
    renderHeader(h, { column, $index }) {
      const label = column.label;
      return [
        h(
          "el-tooltip",
          {
            props: {
              content: (function() {
                return label;
              })(),
              placement: "top"
            }
          },
          [h("span", {}, label)]
        )
      ];
    },
    exportCharts() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let startDate = null;
          let endDate = null;
          if (this.form.daterange && this.form.daterange.length == 2) {
            startDate = this.moment(this.form.daterange[0]).format("YYYY-MM-DD");
            endDate = this.moment(this.form.daterange[1]).format("YYYY-MM-DD");
          }

          const params = {
            ...this.form,
            startDate,
            endDate
          };

          this.pageInfo.current = 1;

          this.getChartsData(params);
          console.log('params',)
          const deviceType = params.deviceTypeCodes.map(device => this.$gio.findValueCodeCorresponding(this.deviceTypeTreeData, device, "code", "name", true)).join(",");
          const lubrPointType = params.lubricationPointTypeCodes.map(lub => this.$gio.findValueCodeCorresponding(this.LubTypeList, lub, "code", "name")).join(",");
          // const oilName = params.oilCodes.map(oil => this.$gio.findValueCodeCorresponding(this.oilNameTreeData, oil, "oilNumber", "oilName", true)).join(",");
          const customer = params.customerNumbers.map(customer => this.$gio.findValueCodeCorresponding(this.customerList, customer, "companyNumber", "companyName")).join(",");
          const workshop = params.workshopIds.map(workshopId => this.$gio.findValueCodeCorresponding(this.workshopList, workshopId, "workshopId", "workshopName", true)).join(",");
          this.$gio.filterOilConsumptionData({
            timeFrame: params.startDate + "-" + params.endDate,
            deviceType,
            lubrPointType,
            customer,
            workshop
          });
          this.$gio.viewDetailsOfOilConsumption();
        }
      });
    },
    getDeviceTypeList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4").then(res => {
        if (res.data.code == 1000) {
          this.deviceTypeTreeData = res.data.data;
        }
      });
    },
    getLubTypeList() {
      this.requestMethodGet("/web/customer/getIndustryTreeList", {
        parentCode: "lubrication_point_type"
      }).then(res => {
        this.LubTypeList = res.data.data;
      });
    },
    getOilNameData(val) {
      this.loadingRemote = true
      this.oilNameTreeData = []
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, fullQueryFlag:true, size:200, current:1}).then(res => {
        this.loadingRemote = false
        this.oilNameTreeData = res.data.data.list;
      });
    },

    selectCustomer(selection) {
      if (selection.length == 1) {
        let companyId = null;
        this.customerList.some(item => {
          if (item.companyNumber == selection[0]) {
            companyId = item.companyId;
            return true;
          }
        });
        this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", {
          companyId,
          size: 1000,
          current: 1
        }).then(res => {
          if (res.data.code == 1000) {
            this.workshopList = res.data.data.list;
          }
        });
      } else {
        this.workshopList = [];
      }
    },
    async getCompanyList() {
      this.loadingMore = true;
      const res = await this.requestMethodGet("/web/customer/queryCompanyListByPage", {
        ...this.companyPageInfo
      });
      if (res.data.code == 1000) {
        this.customerList = res.data.data.list;
        this.companyTotal = res.data.data.totalCount;
      }
      this.loadingMore = false;
    },
    async filterCompany(val) {
      this.loadingMore = true;
      const customerListData = await this.requestMethodGet("/web/customer/queryCompanyListByPage", { companyType: 2, ...this.companyPageInfo, companyName: val,menuCode:'CustomerProfileList' });
      if (customerListData.data.code == 1000) {
        this.customerList = customerListData.data.data.list;
      }
      this.loadingMore = false;
    },
    async load() {
      if (this.customerList.length < this.companyTotal) {
        this.loadingMore = true;
        this.companyPageInfo.current++;
        const customerListData = await this.requestMethodGet("/web/customer/queryCompanyListByPage", { companyType: 2, ...this.companyPageInfo });
        if (customerListData.data.code == 1000) {
          const arr = [...this.customerList];
          this.customerList = arr.concat(customerListData.data.data.list);
        }
        this.loadingMore = false;
      }
    },
    async getOilOverview(params) {
      const res = await this.requestMethodPost("/oilTask/oilConsumption/overview", params);
      if (res.data.code == 1000) {
        this.topCardInfo = res.data.data;
      }
    },
    async getOilTrendData(params) {
      const res = await this.requestMethodPost("/oilTask/oilConsumption/trend", params);
      if (res.data.code == 1000) {
        this.trendData = res.data.data;
        initTrendLineChart("trend-line-chart", res.data.data);
      }
    },
    async getPieData(params) {
      const res = await this.requestMethodPost("/oilTask/oilConsumption/top", params);
      if (res.data.code == 1000) {
        this.PieData = res.data.data;
        const filterData = res.data.data.filter(item => item).filter(item => item.totalAmount);
        if (filterData.length == 0) {
          this.showPieNoData = true;
          return;
        } else {
          this.showPieNoData = false;
        }

        this.$nextTick(() => {
          initPieChart("ranking-round-chart", res.data.data);
        });
      }
    },
    async getTableData(params) {
      const res = await this.requestMethodPost("/oilTask/oilConsumption/detail", { ...params, ...this.pageInfo });
      if (res.data.code == 1000) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.totalCount;
      }
    },
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.getTableData(this.form);
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
      this.getTableData(this.form);
    },
    chartGio(chartName) {
      this.$gio.clickLegendLabel({
        chartName
      });
    }
  }
};
</script>

<style lang="less" scoped>
.split-line {
  width: 100%;
  height: 24px;
  border-bottom: 1px solid #e9e9e9;
}
.content-box {
  display: flex;
  flex-wrap: nowrap;
  p {
    margin: 0;
  }
  .left-form {
    width: 20%;
    height: calc(100vh - 130px);
    overflow-y: auto;
    border-right: 1px solid #e9e9e9;
  }
  .right-content {
    width: 80%;
    height: calc(100vh - 170px);
    overflow-y: auto;
    padding: 32px 20px;
    padding-bottom: 50px;
  }
}
.top-instructions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.data-box-item {
  width: 23%;
  border: 1px solid #e9e9e9;
  padding: 24px 40px;
  border-radius: 6px;
  .box-item-title {
    margin: 0;
    font-size: 14px;
    margin-bottom: 24px;
  }
  .box-item-val {
    font-size: 36px;
    font-weight: 700;
    color: #0f40ed;
    line-height: 36px;
  }
}
.charts-box {
  margin-top: 32px;
  .charts-title-line {
    padding-left: 3px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .top-ins-title {
      margin-right: 8px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 3px solid #dd0000;
    }
    .cate-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
    }
  }
}
.chart-show-box {
  position: relative;
  width: 100%;
  min-height: 390px;
}
.nodata-class {
  position: relative;
  width: 100%;
  min-height: 390px;
  background: rgb(228, 231, 237, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
