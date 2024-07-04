<template>
  <div style="overflow-y: auto;overflow-x: hidden;" :style="{height:contentHeight+'px'}">
    <!-- 用户-月活，用户-月深度活跃
      柱状折线图
      角色类型下拉刷新
    -->
    <div>
      <!-- 用户-月活 -->
      <div v-if="dimensionCode15">
        <el-row>
          <el-col :span="12">
            <span>用户-月活</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="某月登录过MSDP的总用户数和占比">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectUserType" placeholder="请选择" size="small" @change="changeUserRole" clearable >
              <el-option
                v-for="item in selectUserTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 堆叠折线图 -->
        <div v-if="isAll && selectUserType == ''" id="userCharts3" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
        <!-- 柱状折线图形 -->
        <div v-else id="userCharts" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 用户-月深度活跃 -->
      <div v-if="dimensionCode16">
        <el-row>
          <el-col :span="12">
            <span>用户-月深度活跃</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="某月在MSDP下工单的总用户数和占比">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectUserType1" placeholder="请选择" size="small" @change="changeUserRole1" clearable >
              <el-option
                v-for="item in selectUserTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 堆叠折线 -->
        <div v-if="isAll && selectUserType1 == ''" id="userCharts4" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
        <!-- 柱状折线图形 -->
        <div v-else id="userCharts1" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 用户-留存率 -->
      <div v-if="dimensionCode18">
        <el-row>
          <el-col :span="12">
            <span>用户-留存率</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="当月登录用户数除以数月后该批用户仍登录的用户数">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 柱状折线图形 -->
        <div id="userCharts2" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-区域分布		时间下拉刷新
          客户-行业分布		时间下拉刷新(选择全部时间后点击弹出折线图)
          设备-行业分布		时间下拉刷新(选择全部时间后点击弹出折线图)
          设备-区域分布		时间下拉刷新
          工单-工单服务类型		区域和时间下拉刷新
          饼状图
      -->
      <!-- 客户-区域分布 -->
      <div v-if="dimensionCode1">
        <el-row>
          <el-col :span="12">
            <span>客户-区域分布</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="每个区域客户数量及占比">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectMonth" @change="monthChange" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="历史总数取存量，除此之外取增量">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-行业分布 -->
      <div v-if="dimensionCode4">
        <el-row>
          <el-col :span="12">
            <span>客户-行业分布</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="行业一级分类各行业客户数占客户总数比例">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectMonth1" @change="monthChange1" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="selectIndustry1" @change="industryChange1" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in industryList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="历史总数取存量，除此之外取增量">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId1" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 工单-行业分布 -->
      <div v-if="dimensionCode17">
        <el-row>
          <el-col :span="12">
            <span>工单-行业分布</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="各行业工单数占工单总数比例">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectMonth5" @change="monthChange5" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="selectIndustry2" @change="industryChange2" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in industryList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId5" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 设备-行业分布 -->
      <div v-if="dimensionCode9">
        <el-row>
          <el-col :span="12">
            <span>设备-行业分布</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="行业一级分类各行业设备数占设备总数比例">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="haveLubr2" @change="monthChange2" size="small" placeholder="请选择">
              <el-option
                v-for="item in haveLubrList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="selectMonth2" @change="monthChange2" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="历史总数取存量，除此之外取增量">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId2" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!--用户-月活客户用户行业分布 -->
      <div v-if="dimensionCode20">
        <el-row>
          <el-col :span="12">
            <span>用户-月活客户用户行业分布</span>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectMonth20" @change="monthChange20" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectListMonth"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="全部时间为总量客户用户分布，某年某月为某年某月登陆的用户行业分布">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
              <el-select v-model="selectIndustry20" @change="industryChange20" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in industryList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId20" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!--用户-月活客户用户区域分布 -->
      <div v-if="dimensionCode21">
        <el-row>
          <el-col :span="12">
            <span>用户-月活客户用户区域分布</span>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectMonth21" @change="monthChange21" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectListMonth"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="全部时间为总量客户用户分布，某年某月为某年某月登陆的用户行业分布">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId21" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!--用户-月活经销商用户角色分布 -->
      <div v-if="dimensionCode22">
        <el-row>
          <el-col :span="12">
            <span>用户-月活经销商用户角色分布</span>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectMonth22" @change="monthChange22" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectListMonth"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="全部时间为总量客户用户分布，某年某月为某年某月登陆的用户行业分布">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId22" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 设备-区域分布 -->
      <div v-if="dimensionCode10">
        <el-row>
          <el-col :span="12">
            <span>设备-区域分布</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="每个区域设备数量及占比">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="haveLubr3" @change="monthChange3" size="small" placeholder="请选择">
              <el-option
                v-for="item in haveLubrList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="selectMonth3" @change="monthChange3" size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in dateSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="历史总数取存量，除此之外取增量">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId3" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 工单-工单服务类型 -->
      <div v-if="dimensionCode13">
        <el-row>
          <el-col :span="8">
            <span>工单-工单服务类型</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="工单各一级服务类型数占工单总数比例">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="14" align="center">
            <el-row :gutter="20">
              <el-col :span="7">
                <el-select v-model="selectAreaCode4" @change="areaChange4" size="small" clearable placeholder="请选择">
                  <el-option
                    v-for="item in areaList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="selectMonth4" @change="monthChange4" size="small" clearable placeholder="请选择">
                  <el-option
                    v-for="item in dateSelectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-cascader
                  v-model="serviceClassTypeCode"
                  size="small"
                  :options="serviceTypeList"
                  :props="{label:'serviceName',value:'id'}"
                  @change="serviceClassChange">
                </el-cascader>
              </el-col>
              <el-col :span="2" align="left">
                <el-popover
                  placement="top"
                  title=""
                  width="200"
                  trigger="click"
                  content="历史总数取存量，除此之外取增量">
                  <i slot="reference" class="el-icon-info" style="margin-top:7px"></i>
                </el-popover>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId4" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-重点客户数
          客户-服务覆盖率 饼状图 -->
      <!-- 客户-重点客户数 -->
      <div v-if="dimensionCode2">
        <el-row>
          <el-col :span="12">
            <span>客户-重点客户数</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="重点客户数占比">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectYear" @change="yearChange1" size="small"  placeholder="请选择">
              <el-option
                v-for="item in dateSelectYearList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 饼状图 -->
        <div id="pieChartId" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 用户-游客转化率 -->
      <div v-if="dimensionCode23">
        <el-row>
          <el-col :span="22">
            <span>用户-游客转化率</span>
          </el-col>
        </el-row>
        <!-- 饼状图 -->
        <div id="pieChartId23" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-服务覆盖率 -->
      <div v-if="dimensionCode3">
        <el-row>
          <el-col :span="22">
            <span>客户-服务覆盖率</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="过去90天下过单的客户占总客户的比例">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 饼状图 -->
        <div id="pieChartId1" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 设备-数量		（三个一组的柱状图） -->
      <div v-if="dimensionCode5">
        <el-row>
          <el-col :span="12">
            <span>设备-数量</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="每个月新增设备数量，另外不管是经销商/客户建立的属于PES客户的设备只在“隶属PES客户”项下呈现">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="right">
            <el-select v-model="haveLubr5" @change="haveLubrChange" size="small" placeholder="请选择">
              <el-option
                v-for="item in haveLubrList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <div style="margin-top:10px">
          <el-row>
            <el-col :span="5" align="right">历史总数：</el-col>
            <el-col :span="5" align="center" v-if="userType=='0'">经销商建立 <span>{{columnarChartTableData.historyDistributorDeviceCount}}</span></el-col>
            <el-col :span="5" align="center">客户建立 <span>{{columnarChartTableData.historyCustomerDeviceCount}}</span></el-col>
            <el-col :span="5" align="center" v-if="userType=='0'">隶属PES客户 <span>{{columnarChartTableData.historyPesDeviceCount}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="5" align="right">已选总数：</el-col>
            <el-col :span="5" align="center" v-if="userType=='0'">经销商建立 <span>{{columnarChartTableData.selectDistributorDeviceCount}}</span></el-col>
            <el-col :span="5" align="center">客户建立 <span>{{columnarChartTableData.selectCustomerDeviceCount}}</span></el-col>
            <el-col :span="5" align="center" v-if="userType=='0'">隶属PES客户 <span>{{columnarChartTableData.selectPesDeviceCount}}</span></el-col>
          </el-row>
        </div>
        <!-- 柱状图 -->
        <div id="columnarChartId" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 设备-新建VS复制
          工单-下单方式		（区域下拉刷新）
          工单-核心服务工单数		（区域下拉刷新）
          堆叠柱状图
      -->
      <!-- 设备-新建VS复制 -->
      <div v-if="dimensionCode6">
        <el-row>
          <el-col :span="12">
            <span>设备-自建VS复制比例</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="设备信息通过自建信息完成/复制信息完成的比例"
              >
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="right">
            <el-select v-model="haveLubr6" @change="haveLubrChange6" size="small" placeholder="请选择">
              <el-option
                v-for="item in haveLubrList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <div style="width:80%;margin:20px 0 0 100px">
            <!-- 动态表格数据 -->
            <el-table
              :data="stackedDimensionCode6TableData"
              style="width: 100%">
              <el-table-column
                width="120">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.name}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in tableDimensionCode6Head"
                :key="index"
                :label="item" >
                <template slot-scope="scope">
                  <div>
                      {{scope.row.tableOptionList[index].num}} ({{scope.row.tableOptionList[index].percent + '%'}})
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <!-- 堆叠柱状图 -->
        <div id="stackedChartId" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 工单-下单方式		（区域下拉刷新） -->
      <div v-if="dimensionCode11">
        <el-row>
          <el-col :span="12">
            <span>工单-下单方式</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="所有工单中经销商VS客户下单"
              >
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectAreaCode" @change="areaChange" size="small" clearable placeholder="请选择">
                <el-option
                  v-for="item in areaList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
          </el-col>
        </el-row>
        <div style="width:80%;margin:20px 0 0 100px">
            <!-- 动态表格数据 -->
            <el-table
              :data="stackedDimensionCode11TableData"
              style="width: 100%">
              <el-table-column
                width="120">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.name}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in tableDimensionCode11Head"
                :key="index"
                :label="item" >
                <template slot-scope="scope">
                  <div>
                      {{scope.row.tableOptionList[index].num}} ({{scope.row.tableOptionList[index].percent + '%'}})
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <!-- 堆叠柱状图 -->
        <div id="stackedChartId1" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 工单-核心服务工单数		（区域下拉刷新） -->
      <div v-if="dimensionCode12">
        <el-row>
          <el-col :span="12">
            <span>工单-核心服务工单数</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="服务类型为已配置的核心服务"
              >
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-select v-model="selectAreaCode1" @change="areaChange1" size="small" clearable placeholder="请选择">
                <el-option
                  v-for="item in areaList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
          </el-col>
        </el-row>
        <div style="width:80%;margin:20px 0 0 100px">
            <!-- 动态表格数据 -->
            <el-table
              :data="stackedDimensionCode12TableData"
              style="width: 100%">
              <el-table-column
                width="120">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.name}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in tableDimensionCode12Head"
                :key="index"
                :label="item" >
                <template slot-scope="scope">
                  <div>
                      {{scope.row.tableOptionList[index].num}} ({{scope.row.tableOptionList[index].percent + '%'}})
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <!-- 堆叠柱状图 -->
        <div id="stackedChartId2" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 工单-工单服务时长			（服务类型下拉刷新多条折现图）
          设备-信息完善率变化		（一条折线图）
          设备-核心服务设备数		（两条折线图）
      -->
      <!-- 工单-工单服务平均时长 -->
      <div v-if="dimensionCode14">
        <el-row>
          <el-col :span="12">
            <span>工单-工单服务平均时长</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="每个月所有工单一级服务类型的服务平均时长变化趋势">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="10" align="center">
            <el-cascader
              v-model="serviceTypeCode"
              :options="serviceNumberTree"
              :props="{label:'serviceName',value:'serviceNumber'}"
              @change="serviceTypeChange"
              placeholder="请选择"
              size="small"
              clearable>
            </el-cascader>
          </el-col>
        </el-row>
        <!-- 折线图形 -->
        <div id="brokenLineChart" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 设备-信息完善率变化 -->
      <div v-if="dimensionCode7">
        <el-row>
          <el-col :span="12">
            <span>设备-有润滑点设备信息完善率变化</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="设备必填信息的累计完善率">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 折线图形 -->
        <div id="brokenLineChart1" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 设备-核心服务设备数 -->
      <div v-if="dimensionCode8">
        <el-row>
          <el-col :span="12">
            <span>设备-核心服务设备数</span>
              <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="做过核心服务的设备">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 折线图形 -->
        <div id="brokenLineChart2" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 用户-游客平均转化时长 -->
      <div v-if="dimensionCode24">
        <el-row>
          <el-col :span="12">
            <span>用户-游客平均转化时长</span>
          </el-col>
        </el-row>
        <!-- 折线图形 -->
        <div id="brokenLineChart24" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-重点客户交付完成率 -->
      <div v-if="dimensionCode19" style="margin-top:30px;">
        <el-row>
          <el-col :span="12">
            <span>客户-重点客户交付完成率</span>
          </el-col>
        </el-row>
        <!-- 柱状折线图形 -->
        <div  id="userCharts6" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-月活 -->
      <div v-if="dimensionCode25" style="margin-top:30px;">
        <el-row>
          <el-col :span="12">
            <span>客户-月活</span>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="某月登录过MSDP的客户数和占比">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 饼状图加上折线图 -->
        <div id="pieChartId25" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-服务广度 -->
      <div v-if="dimensionCode26" style="margin-top:30px;">
        <el-row>
          <el-col :span="12">
            <span>客户-服务广度</span>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="过去90天平均服务工单数（下工单的总数与客户数的比值），只统计top5">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 环形图 -->
        <div id="ringChartId26" style="height:800px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 工单-服务级别 -->
      <div v-if="dimensionCode27" style="margin-top:30px;">
        <el-row>
          <el-col :span="10">
            <span>工单-服务级别</span>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="工单各服务级别占工单总数比例">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
          <el-col :span="14" align="center">
            <el-row :gutter="20">
              <el-col :span="7">
                <el-select v-model="dc27.selectAreaCode" @change="areaChangeDc27" size="small" clearable placeholder="请选择">
                  <el-option
                    v-for="item in areaList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="dc27.selectMonth" @change="monthChangeDc27" size="small" clearable placeholder="请选择">
                  <el-option
                    v-for="item in dateSelectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="dc27.serviceGrade" @change="serviceGradeChangeDc27" size="small" clearable placeholder="请选择">
                  <el-option label="已选全部服务级别" :value="''" />
                  <el-option label="基础型服务" :value="1" />
                  <el-option label="增强型服务" :value="2" />
                  <el-option label="高阶型服务" :value="3" />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 环状图 -->
        <div id="ringChartId27" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
      <!-- 客户-注册率 -->
      <div v-if="dimensionCode28">
        <el-row>
          <el-col :span="24">
            <span>客户-注册率</span>
            <el-popover
                placement="top"
                title=""
                width="200"
                trigger="click"
                content="截止每月的客户注册率">
                <i slot="reference" class="el-icon-info" style="margin-left:15px"></i>
              </el-popover>
          </el-col>
        </el-row>
        <!-- 饼状图 -->
        <div id="pieChartId28" style="height:400px" :style="{width:chartsWidth+'px'}"></div>
      </div>
    </div>
    <!-- 饼状图点击后折线图弹框 -->
    <el-dialog
      id="dialogChartContent"
      :title="dialogTitle"
      :visible.sync="ringChartVisible"
      width="30%"
      @open="open()"
      :close-on-click-modal="false">
      <div :style="{width:dialogWidth+'px',height:400+'px'}" id="dialogChart"></div>
    </el-dialog>
  </div>
</template>
<script>
import chart from './chart'
import chart_config from './chart_config'
export default {
  mixins: [chart,chart_config],
  props:{
    contentHeight:{
      type:Number,
      default:()=>{
        return null
      }
    },
    chartsTitle:{
      type:String,
      default:()=>{
        return ''
      }
    },
    selectUserTypeList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    chartsWidth:{
      type:Number,
      default:()=>{
        return null
      }
    },
    areaList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    dateSelectList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    dateSelectListMonth:{
      type:Array,
      default:()=>{
        return []
      }
    },
    dimensionCodeList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    chartParams:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    chartKey:{
      type:Number,
      default:()=>{
        return 1
      }
    },
    userType:{
      type:String,
      default:()=>{
        return ''
      }
    },
    industryList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    serviceTypeList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    isAll:{
      type:Boolean,
      default:()=>{
        return false
      }
    }
  },
  data(){
    return {
      haveLubr2:1,//设备-行业分布
      haveLubr3:1,//设备-区域分布
      haveLubr5:1,//设备-数量
      haveLubr6:1,//设备-自建VS复制比例
      selectUserType:'',//选中角色
      selectUserType1:'',
      selectMonth:'',//选择的月份
      selectMonth1:'',
      selectYear:'',  // 选中的年份
      selectMonth2:'',
      selectMonth20:'0',
      dateSelectYearList:[],
      selectMonth3:'',
      selectMonth4:'',
      selectMonth21:'0',
      selectMonth22:'0',
      selectAreaCode4:'',
      selectMonth5:'',//工单-行业分布选中时间
      selectIndustry2:'',//工单-行业分布行业选中
      selectIndustry20:'',  // 用户-月活客户用户行业
      ringChartVisible:false,
      ringParams:'',
      dialogWidth:null,
      dialogHeight:null,
      selectIndustry1:'',//选中的行业code
      selectAreaCode:'',//选中的区域code
      selectAreaCode1:'',
      serviceClassTypeCode:['',''],//选中的服务类型code
      serviceTypeCode:["Select-classA", "Select-classB"],//选中的服务类型
      stackedDimensionCode6TableData:[],//新建复制表格数据
      tableDimensionCode6Head:[],//新建复制表头
      tableDimensionCode11Head:[],//工单下单方式表头
      stackedDimensionCode11TableData:[],//工单下单方式表格数据
      tableDimensionCode12Head:[],//工单核心服务工单数表头
      stackedDimensionCode12TableData:[],//工单核心服务工单数表格数据
      dialogTitle:'',
      columnarChartTableData:{},
      serviceNumberTree:[],
      dc27: {
        selectMonth: '',
        selectAreaCode: '',
        serviceGrade: '',
      },
    }
  },
  watch:{
    dimensionCodeList:{
      handler:function(val,oldVal){
        this.dimensionCode1 = val.includes('dimension_code1')
        this.dimensionCode2 = val.includes('dimension_code2')
        this.dimensionCode3 = val.includes('dimension_code3')
        this.dimensionCode4 = val.includes('dimension_code4')
        this.dimensionCode5 = val.includes('dimension_code5')
        this.dimensionCode6 = val.includes('dimension_code6')
        this.dimensionCode7 = val.includes('dimension_code7')
        this.dimensionCode8 = val.includes('dimension_code8')
        this.dimensionCode9 = val.includes('dimension_code9')
        this.dimensionCode10 = val.includes('dimension_code10')
        this.dimensionCode11 = val.includes('dimension_code11')
        this.dimensionCode12 = val.includes('dimension_code12')
        this.dimensionCode13 = val.includes('dimension_code13')
        this.dimensionCode14 = val.includes('dimension_code14')
        this.dimensionCode15 = val.includes('dimension_code15')
        this.dimensionCode16 = val.includes('dimension_code16')
        this.dimensionCode17 = val.includes('dimension_code17')
        this.dimensionCode18 = val.includes('dimension_code18')
        this.dimensionCode19 = val.includes('dimension_code19')
        this.dimensionCode20 = val.includes('dimension_code20')
        this.dimensionCode21 = val.includes('dimension_code21')
        this.dimensionCode22 = val.includes('dimension_code22')
        this.dimensionCode23 = val.includes('dimension_code23')
        this.dimensionCode24 = val.includes('dimension_code24')
        this.dimensionCode25 = val.includes('dimension_code25')
        this.dimensionCode26 = val.includes('dimension_code26')
        this.dimensionCode27 = val.includes('dimension_code27')
        this.dimensionCode28 = val.includes('dimension_code28')
      },
      deep: true,
      immediate:true
    },
    chartKey:{
      handler:function(val,oldVal){
        if(val){
          // 根据指标code按图分类调用不同类型的接口传入指标code
          // 用户-月活柱状折线图
          if(this.dimensionCode15 || this.dimensionCode16 ||  this.dimensionCode19){
            this.drawUserCharts()
          }
          // 用户-留存率
          if(this.dimensionCode18){
            this.drawUserBrokenLineCharts()
          }
          // 客户-区域分布环状图
          if(this.dimensionCode1 || this.dimensionCode4 || this.dimensionCode9 || this.dimensionCode10 || this.dimensionCode13 || this.dimensionCode17 || this.dimensionCode20 || this.dimensionCode21 || this.dimensionCode22 || this.dimensionCode27){
            this.drawRingChart()
          }
          // 饼状图
          if(this.dimensionCode2 || this.dimensionCode3 || this.dimensionCode23 || this.dimensionCode25 || this.dimensionCode28){
            this.drawPieChart()
          }
          // 柱状组图
          if(this.dimensionCode5){
            this.drawColumnarChart('dimension_code5')
          }
          // 堆叠柱状图
          if(this.dimensionCode6 || this.dimensionCode11 || this.dimensionCode12){
            this.drawStackedChart()
          }
          // 折线图
          if(this.dimensionCode14 || this.dimensionCode7 || this.dimensionCode8 || this.dimensionCode24){
            this.drawBrokenLineChart()
          }
          // 两个环形图
          if(this.dimensionCode26){
            this.drawRingChartDouble('dimension_code26')
          }
        }
      },
      deep:true
    }
  },
  mounted(){
    this.getYear()
  },
  methods:{
    getYear() {
      var date = new Date();
      let curYear = date.getFullYear(); //获取完整的年份(4位)
      this.selectYear = curYear
      let preYear = curYear-1
      let prePreYear = curYear-2
      this.dateSelectYearList.push({value:curYear,label:curYear+'年'},{value:preYear,label:preYear+'年'},{value:prePreYear,label:prePreYear+'年'})
    },
    indexMethod(index){
      return index==0?'历史总数':'已选总数'
    },
    // 柱状折线图
    drawUserCharts(){
        if(this.dimensionCode15){
          let idEle = ''
          if(this.isAll && this.selectUserType == ''){
            idEle = this.$echarts.init(document.getElementById('userCharts3'))
          }else{
            idEle = this.$echarts.init(document.getElementById('userCharts'))
          }
          this.dimensionCode15Ele = idEle
          this.getUserChartData(this.dimensionCode15Ele,'dimension_code15',this.selectUserType)
        }
        if(this.dimensionCode16){
          let idEle = ''
          if(this.isAll && this.selectUserType1 == ''){
            idEle = this.$echarts.init(document.getElementById('userCharts4'))
          }else{
            idEle = this.$echarts.init(document.getElementById('userCharts1'))
          }
          this.dimensionCode16Ele = idEle
          this.getUserChartData(this.dimensionCode16Ele,'dimension_code16',this.selectUserType1)
        }
        if(this.dimensionCode19){
          let idEle = ''
          idEle = this.$echarts.init(document.getElementById('userCharts6'))
          this.dimensionCode19Ele = idEle
          this.getUserChartData(this.dimensionCode19Ele,'dimension_code19',this.selectUserType1)
        }
    },
    getUserChartData(ele,code,val){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      if(code === 'dimension_code15'){
        params.chartCompanyType = this.selectUserType
      }

      if(code === 'dimension_code16'){
        params.chartCompanyType = this.selectUserType1
      }
      params.chartDimensionCode = code
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          data.yAxisUserNum = data.yaxis[0].data
          data.yAxisUserPercent = data.yaxis[1].data
          chartData = data
          ele.clear()
          if(this.isAll && val == ''){
            if(code !='dimension_code19') {
                chartData.yaxis.forEach(it=>{
                if(it.name.includes('：')){
                  it.type = 'line'
                  it.yAxisIndex = 1
                }else{
                  it.type = 'bar'
                  it.stack = 'Ad'
                }
              })
            }else {
              chartData.yaxis.forEach((it,index)=>{
                if(it.name.includes('：')){
                  it.type = 'line'
                  it.yAxisIndex = 1
                }else{
                  it.type = 'bar'
                  it.stack = 'Ad'+index
                }
              })
            }
            this.handlerUserStackChart(ele,chartData,code)
          }else{
            this.handlerUserCharts(ele,chartData,code)
          }
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 用户留存率-折线图
    drawUserBrokenLineCharts(){
      this.dimensionCode18Ele = this.$echarts.init(document.getElementById('userCharts2'))
      this.getUserRetainedChartData(this.dimensionCode18Ele,'dimension_code18')
    },
    getUserRetainedChartData(ele,code){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          if(!_.isEmpty(data)){
            data.forEach(it=>{
              it.type = 'line'
            })
          }
          chartData = data
          this.handlerUserRetainedCharts(ele,chartData,code)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 环状图
    drawRingChart(){
      if(this.dimensionCode1){//客户-区域分布
        this.dimensionCode1Ele = this.$echarts.init(document.getElementById('ringChartId'))
        this.getRingChartData(this.dimensionCode1Ele,'dimension_code1')
      }
      if(this.dimensionCode4){//客户-行业分布
        this.dimensionCode4Ele = this.$echarts.init(document.getElementById('ringChartId1'))
        this.getRingChartData(this.dimensionCode4Ele,'dimension_code4')
      }
      if(this.dimensionCode27){//客户-行业分布
        this.dimensionCode27Ele = this.$echarts.init(document.getElementById('ringChartId27'))
        this.getRingChartData(this.dimensionCode27Ele,'dimension_code27')
      }
      if(this.dimensionCode17){//工单-行业分布
        this.dimensionCode17Ele = this.$echarts.init(document.getElementById('ringChartId5'))
        this.getRingChartData(this.dimensionCode17Ele,'dimension_code17')
      }
      if(this.dimensionCode9){//设备-行业分布
        this.dimensionCode9Ele = this.$echarts.init(document.getElementById('ringChartId2'))
        this.getRingChartData(this.dimensionCode9Ele,'dimension_code9')
      }
      if(this.dimensionCode10){//设备-区域分布
        this.dimensionCode10Ele = this.$echarts.init(document.getElementById('ringChartId3'))
        this.getRingChartData(this.dimensionCode10Ele,'dimension_code10')
      }
      if(this.dimensionCode13){//工单-工单服务类型
        this.dimensionCode13Ele = this.$echarts.init(document.getElementById('ringChartId4'))
        this.getRingChartData(this.dimensionCode13Ele,'dimension_code13')
      }
      if(this.dimensionCode20){//用户-月活客户用户行业分布
        this.dimensionCode20Ele = this.$echarts.init(document.getElementById('ringChartId20'))
        this.getRingChartData(this.dimensionCode20Ele,'dimension_code20')
      }
      if(this.dimensionCode21){//用户-月活客户用户区域分布
        this.dimensionCode21Ele = this.$echarts.init(document.getElementById('ringChartId21'))
        this.getRingChartData(this.dimensionCode21Ele,'dimension_code21')
      }
      if(this.dimensionCode22){//用户-月活经销商用户角色分布
        this.dimensionCode22Ele = this.$echarts.init(document.getElementById('ringChartId22'))
        this.getRingChartData(this.dimensionCode22Ele,'dimension_code22')
      }
    },
    // 获取环装图数据
    getRingChartData(ele,code){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      if(code === 'dimension_code1'){
        params.chartYearMonthStr = this.selectMonth
      }
      if(code === 'dimension_code4'){
        params.chartYearMonthStr = this.selectMonth1
        params.primaryIndustryCode = this.selectIndustry1//行业code
      }
      if(code === 'dimension_code27'){
        params.chartYearMonthStr = this.dc27.selectMonth
        params.chartAreaCode = this.dc27.selectAreaCode
        params.serviceGrade = this.dc27.serviceGrade
      }
      if(code === 'dimension_code17'){//工单-行业分布
        params.chartYearMonthStr = this.selectMonth5
        params.primaryIndustryCode = this.selectIndustry2//行业code
      }
      if(code === 'dimension_code9'){
        params.chartYearMonthStr = this.selectMonth2
        params.primaryIndustryCode = this.selectIndustry20//行业code
        params.haveLubr = this.haveLubr2
      }
      if(code === 'dimension_code20'){
        params.chartYearMonthStr = this.selectMonth20
        params.primaryIndustryCode = this.selectIndustry20//行业code
      }
      if(code === 'dimension_code10'){
        params.chartYearMonthStr = this.selectMonth3
        params.haveLubr = this.haveLubr3
      }
      if(code === 'dimension_code21'){
        params.chartYearMonthStr = this.selectMonth21
      }
      if(code === 'dimension_code22'){
        params.chartYearMonthStr = this.selectMonth22
      }
      if(code === 'dimension_code21'){
        params.chartYearMonthStr = this.selectMonth21
      }
      if(code === 'dimension_code22'){
        params.chartYearMonthStr = this.selectMonth22
      }
      if(code === 'dimension_code13'){
        params.chartYearMonthStr = this.selectMonth4
        params.chartAreaCode = this.selectAreaCode4
        let emptyServiceIdList = this.serviceClassTypeCode.filter(it=>{
          return it!=''
        })
        let serviceId = emptyServiceIdList.length>0?this.serviceClassTypeCode[emptyServiceIdList.length-1]:''
        let serviceLevel = emptyServiceIdList.length>0?emptyServiceIdList.length:''
        params.serviceCode = serviceId
        params.levelCode = serviceLevel
      }
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          chartData = res.data.data
          if(chartData && chartData.length){
            chartData.forEach(item=>{
              if(code === 'dimension_code4'){
                item.type  = 'dimension_code4'
              }
              if(code === 'dimension_code9'){
                item.type  = 'dimension_code9'
              }
            })
          }
          this.handleRingChart(ele,chartData)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    open() {
      this.$nextTick(() => {
        // 需要判断pieParams中是否显示折线图
        this.dialogWidth = document.getElementById('dialogChartContent').getElementsByClassName("el-dialog__body")[0].clientWidth
        this.dialogHeight = document.getElementById('dialogChartContent').getElementsByClassName("el-dialog__body")[0].clientHeight
        let chartData = {}
        const params = this.ringParams
        this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          data.yAxisNumber = data.yaxis[0].data
          chartData = data
          this.drawDialogChart(chartData)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })

      })
    },
    drawDialogChart(chartData){
      const that = this
      const dialogChart = that.$echarts.init(document.getElementById('dialogChart'))
      dialogChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {a}{c} %'
          },
          legend: {
            data: ['客户比例']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.xaxis,
            name:'月',
            nameTextStyle: {
              align: 'right',
              padding: [10, 0, 10, 100]
            },
          },
          yAxis: {
            type: 'value',
            name:'客户比例',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          },
          series: [
            {
              name: '客户比例',
              type: 'line',
              stack: 'Total',
              data: chartData.yAxisNumber
            }
          ]
        })
    },
    // 饼状图
    drawPieChart(){
      if(this.dimensionCode2){//客户-重点客户数
        this.dimensionCode2Ele = this.$echarts.init(document.getElementById('pieChartId'))
        this.getKeyCustomerData(this.dimensionCode2Ele,'dimension_code2')
      }
      if(this.dimensionCode28){//客户-重点客户数
        this.dimensionCode28Ele = this.$echarts.init(document.getElementById('pieChartId28'))
        this.getKeyCustomerData(this.dimensionCode28Ele,'dimension_code28')
      }
      if(this.dimensionCode3){//客户-服务覆盖率
        this.dimensionCode3Ele = this.$echarts.init(document.getElementById('pieChartId1'))
        this.getPieChartData(this.dimensionCode3Ele,'dimension_code3')
      }
      if(this.dimensionCode23){//用户-游客转化率
        this.dimensionCode23Ele = this.$echarts.init(document.getElementById('pieChartId23'))
        this.getKeyCustomerData(this.dimensionCode23Ele,'dimension_code23')
      }
      if(this.dimensionCode25){//客户-月活
        this.dimensionCode25Ele = this.$echarts.init(document.getElementById('pieChartId25'))
        this.getKeyCustomerData(this.dimensionCode25Ele,'dimension_code25')
      }
    },
    // 获取饼状图数据
    getPieChartData(ele,code){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          chartData = res.data.data
          this.handlePieChart(ele,chartData,code)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 重点客户数据
    getKeyCustomerData(ele,code){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      if(code=='dimension_code2') {
        params.chartYearStr = this.selectYear
      }
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          let yCustomerData = []
          let yCustomerPercentData = []
          data.yaxis.forEach(it=>{
            if(code == 'dimension_code23') {
              if(it.name=='游客：数量'){
                yCustomerData = it.data
              }
              if(it.name=='游客：转化率'){
                yCustomerPercentData = it.data
              }
            } else if(code == 'dimension_code25') {
              if(it.name=='客户活跃数'){
                yCustomerData = it.data
              }
              if(it.name=='客户活跃数占比'){
                yCustomerPercentData = it.data
              }
            }else if(code == 'dimension_code27') {
              if(it.name=='客户活跃数'){
                yCustomerData = it.data
              }
              if(it.name=='客户活跃数占比'){
                yCustomerPercentData = it.data
              }
            }else if (code == 'dimension_code28') {
              if(it.name=='每月新建数'){
                yCustomerData = it.data
              }
              if(it.name=='截止每月注册率'){
                yCustomerPercentData = it.data
              }
            } else {
              if(it.name=='客户数'){
                yCustomerData = it.data
              }
              if(it.name=='客户数占比'){
                yCustomerPercentData = it.data
              }
            }
          })
          chartData = data
          this.handleKeyCustomerChart(ele,chartData,yCustomerData,yCustomerPercentData,code)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 柱状组图
    drawColumnarChart(code){
      const columnarChart = this.$echarts.init(document.getElementById('columnarChartId'))
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      params.haveLubr = this.haveLubr5
      let chartData = {}
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          this.columnarChartTableData = res.data.data
          const data = res.data.data
          let yDistributorNum = []
          let yCustomerNum = []
          let yPesNum = []
          data.yaxis.forEach(item=>{
            if(item.name == '经销商建立'){
              yDistributorNum = item.data
            }
            if(item.name == '客户建立'){
              yCustomerNum = item.data
            }
            if(item.name == '隶属pes客户'){
              yPesNum = item.data
            }
          })
          data.yDistributorNum = yDistributorNum
          data.yCustomerNum = yCustomerNum
          data.yPesNum = yPesNum
          chartData = data
          this.handlerColumnarChart(columnarChart,chartData,this.userType)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 工单-核心服务工单数区域改变
    areaChange1(){
      this.getStackedChartData(this.dimensionCode12Ele,'dimension_code12')
    },
    // 堆叠图
    drawStackedChart(){
      if(this.dimensionCode6){//设备-新建VS复制比例
        this.dimensionCode6Ele = this.$echarts.init(document.getElementById('stackedChartId'))
        this.getStackedChartData(this.dimensionCode6Ele,'dimension_code6')
      }
      if(this.dimensionCode11){//工单-下单方式
        this.dimensionCode11Ele = this.$echarts.init(document.getElementById('stackedChartId1'))
        this.getStackedChartData(this.dimensionCode11Ele,'dimension_code11')
      }
      if(this.dimensionCode12){//工单-核心服务工单数
        this.dimensionCode12Ele = this.$echarts.init(document.getElementById('stackedChartId2'))
        this.getStackedChartData(this.dimensionCode12Ele,'dimension_code12')
      }
    },
    // 获取堆叠图数据
    getStackedChartData(ele,code){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      if(code == 'dimension_code11'){
        params.chartAreaCode = this.selectAreaCode
      }
      if(code == 'dimension_code12'){
        params.chartAreaCode = this.selectAreaCode1
      }
      if(code == 'dimension_code6'){
        params.haveLubr = this.haveLubr6
      }
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          if(code == 'dimension_code6'){
            this.stackedDimensionCode6TableData=data.tableData//新建复制表格数据
            this.tableDimensionCode6Head=data.tableHead//新建复制表头
          }
          if(code == 'dimension_code11'){//工单-下单方式
            this.stackedDimensionCode11TableData=data.tableData
            this.tableDimensionCode11Head=data.tableHead
          }
          if(code == 'dimension_code12'){//工单-核心服务工单数
            this.stackedDimensionCode12TableData=data.tableData
            this.tableDimensionCode12Head=data.tableHead
          }
          data.chartData.yaxis.forEach(it=>{
            it.type = 'bar'
            it.stack = 'Ad'
          })
          chartData = data.chartData
          ele.clear()
          this.handleStackedChart(ele,chartData)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 折线图
    drawBrokenLineChart(){
      if(this.dimensionCode14){//工单-工单服务时长
        this.dimensionCode14Ele = this.$echarts.init(document.getElementById('brokenLineChart'))
        this.getBrokenLineChartData(this.dimensionCode14Ele,'dimension_code14')
      }
      if(this.dimensionCode7){//设备-信息完善率变化
        this.dimensionCode7Ele = this.$echarts.init(document.getElementById('brokenLineChart1'))
        this.getBrokenLineChartData(this.dimensionCode7Ele,'dimension_code7')
      }
      if(this.dimensionCode8){//设备-核心服务设备数
        this.dimensionCode8Ele = this.$echarts.init(document.getElementById('brokenLineChart2'))
        this.getBrokenLineChartData(this.dimensionCode8Ele,'dimension_code8')
      }
      if(this.dimensionCode24){//用户-游客平均转化时长
        this.dimensionCode24Ele = this.$echarts.init(document.getElementById('brokenLineChart24'))
        this.getBrokenLineChartData(this.dimensionCode24Ele,'dimension_code24')
      }
    },
    // 获取折线图数据
    getBrokenLineChartData(ele,code){
      let chartData = {}
      // 走接口获取数据
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      if(code=='dimension_code14'){
        if(this.serviceTypeCode.includes('Select-classA')){
          params.chartServiceNumber = ''
        }else{
          params.chartServiceNumber = this.serviceTypeCode[1]
        }
      }
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          let legendArr = []
          if(code=='dimension_code14'){
            const serviceTree = this.serviceNumberTree
            const headArr = [{
              serviceName: "全部一级服务类型",
              serviceNumber: "Select-classA",
              children:[
                {
                  children: null,
                  serviceName: "全部",
                  serviceNumber: "Select-classB",
                }
              ]
            }]
            this.serviceNumberTree = data.serviceNumberTree?headArr.concat(data.serviceNumberTree):serviceTree
          }
          data.yaxis.forEach(item=>{
            legendArr.push(item.name)
            item.type = 'line'
            if(code=='dimension_code14'){
              item.data = this.handleYData(item.data)
            }
          })
          data.legendArr = legendArr
          chartData = data
          ele.clear()

          if(code=='dimension_code24') {
            this.handleBrokenLineChart1(ele,chartData,code)
          } else {
            this.handleBrokenLineChart(ele,chartData,code)
          }
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
     // 两个环状图
    drawRingChartDouble(code){
      this.dimensionCode26Ele = this.$echarts.init(document.getElementById('ringChartId26'))
      const params = JSON.parse(JSON.stringify(this.chartParams))
      params.chartDimensionCode = code
      this.requestMethodPost('/report/getReportCharts',params).then(res=>{
        if(res.data.code == 1000){
          let list1 = res.data.data.list1
          let list2 = res.data.data.list2
          this.handleRingChartDouble(this.dimensionCode26Ele,list1,list2)
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
  }
}
</script>
