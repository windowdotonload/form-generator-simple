<!--PES档案详情-->
<template>
  <div style="position: relative">
    <div class="return-btn" style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -65px">
      <el-button type="danger" size="small" @click="complate" v-if="detailData.pesServicePackageStatusDto.status == 0 && detailData.pesEditFlag && donePes">完成</el-button>
      <!-- <el-button size="small" @click="editService" v-if="detailData.pesServicePackageStatusDto.status == 0 && detailData.pesEditFlag && editPes">编辑</el-button> -->
      <el-button size="small" @click="editServiceBatch" v-if="detailData.pesServicePackageStatusDto.status == 0 && detailData.pesEditFlag && editPes">编辑</el-button>
      <el-button size="small" @click="cancelService" v-if="detailData.pesServicePackageStatusDto.status == 0 && !noServiceOrderList.length && detailData.pesEditFlag && cancelPes">
        取消服务包
      </el-button>
    </div>
    <el-divider></el-divider>
    <!-- 内容区域 -->
    <div class="add-customer-profile" :style="mainminheight">
      <!-- 服务包区域 -->
      <div class="service-name-form">
        <div class="name-content">
          <div class="title">{{ detailData.servicePackageName }}</div>
          <div class="status" :style="{ backgroundColor: detailData.pesServicePackageStatusDto.status == 0 ? '#008888' : '#ccc' }">{{ detailData.pesServicePackageStatusDto.statusDesc }}</div>
        </div>
        <div style="height: 20px"></div>
        <!-- 表单 -->
        <el-row :gutter="20">
          <el-form :model="serviceForm" label-width="80px" label-position="top" inline>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="服务包ID" class="label">
                <span>{{ detailData.servicePackageNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="所属客户" class="label">
                <div style="display: flex; align-items: center;">
                  <el-tooltip class="item" effect="dark" :content="detailData.customerCompanyName" placement="top-start">
                    <div class="no-wrap">{{ detailData.customerCompanyName || "暂无" }}</div>
                  </el-tooltip>
                  <img style="margin-left: 10px; width: 24px; height: 20px" src="../../../assets/pes_icon.png" alt="" v-if="detailData.pesFlag == 1 || detailData.pesFlag == 3" />
                  <img style="margin-left: 10px; width: 24px; height: 20px" src="../../../assets/DPES_icon.png" alt="" v-if="detailData.pesFlag == 2 || detailData.pesFlag == 3" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="所属车间" class="label">
                <el-tooltip class="item" effect="dark" :content="detailData.workshopNameArr" placement="top-start">
                  <div class="no-wrap">{{ detailData.workshopNameArr }}</div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="服务方" class="label">
                <el-tooltip class="item" effect="dark" :content="detailData.serviceCompanyName" placement="top-start">
                  <div class="no-wrap" style="display:flex;align-items:center">
                    <span>{{ detailData.serviceCompanyName || "暂无" }}</span>
                    <img v-if="detailData.assistSpFlag" src="../../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:5px;" />
                  </div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="所属档案" class="label">
                <div style="display: flex; align-items: center;">
                  <el-tooltip class="item" effect="dark" :content="detailData.serviceFileName" placement="top-start">
                    <div v-if="!isLink" class="no-wrap">{{ detailData.serviceFileName || "暂无" }}</div>
                    <div v-else>
                      <div class="no-wrap" :style="{ color: '#02a7f0', cursor: !(detailData.distributorCompanyType == 0 && companyType == 1) ? 'pointer' : 'not-allowed' }" @click="toArchivesDetail">
                        {{ detailData.serviceFileName || "暂无" }}
                      </div>
                    </div>
                  </el-tooltip>
                  <i v-if="isLink" class="el-icon-arrow-right" v-show="!(detailData.distributorCompanyType == 0 && companyType == 1)" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="创建人" class="label">
                <span>{{ detailData.createUserName || "暂无" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1600 ? '3' : '6'">
              <el-form-item label="创建时间" class="label">
                <span>{{ detailData.createTime || "暂无" }}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <!-- 服务进度 -->
      <div class="service-progress-content">
        <!-- 进行中 -->
        <div v-if="detailData.pesServicePackageStatusDto.status == 0">
          <div style="font-size: 14px; font-weight: bold">服务进行中</div>
          <div style="display: flex; align-items: center; margin-top: 18px">
            <div style="font-size: 20px; font-weight: bold">
              <span style="color: #dd0000">{{ detailData.pesServicePackageStatusDto.progressIngNum }}</span
              >/{{ detailData.pesServicePackageStatusDto.progressAllNum }}
            </div>
            <el-progress :percentage="detailData.pesServicePackageStatusDto.progressPercent" color="#008888" style="margin-left: 20px; width: 658px"></el-progress>
          </div>
        </div>
        <!-- 已完成-未评价 -->
        <div style="display: flex; align-items: center" v-if="detailData.pesServicePackageStatusDto.status == 1 && !detailData.pesServicePackageStatusDto.evaluateStars">
          <div>
            <i class="el-icon-success" style="font-size: 28px; color: #008888"></i>
          </div>
          <div style="margin-left: 16px">
            <div style="font-size: 14px; font-weight: bold; color: #000">感谢您使用美孚数智服务平台！</div>
            <div style="font-size: 13px; color: #999; margin-top: 5px">我们将根据您的评价持续做出改进</div>
          </div>
          <el-button type="danger" plain size="small" style="margin-left: 24px" @click="evaluateClick" v-if="companyType == 2">立即评价</el-button>
        </div>

        <!-- 已完成已评价 -->
        <div v-if="detailData.pesServicePackageStatusDto.status == 1 && detailData.pesServicePackageStatusDto.evaluateStars">
          <div style="display: flex; align-items: center">
            <div>
              <i class="el-icon-success" style="font-size: 28px; color: #008888"></i>
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #000; margin-left: 17px">感谢您使用美孚数智服务平台！</div>
            <div style="margin-left: 10px">
              <el-rate disabled v-model="detailData.pesServicePackageStatusDto.evaluateStars"></el-rate>
            </div>
          </div>
          <div style="display: flex; margin-top: 10px">
            <div style="font-size: 13px; color: #999; width: 69px">评价内容：</div>
            <div style="font-size: 13px; lin-height: 21px; color: #666; width: 1105px">{{ detailData.pesServicePackageStatusDto.evaluateDesc || "暂无" }}</div>
          </div>
        </div>
        <!-- 已取消 -->
        <div v-if="detailData.pesServicePackageStatusDto.status == -1">
          <div style="font-size: 14px; font-weight: bold; color: #000">服务包已取消</div>
          <div style="display: flex; margin-top: 10px">
            <img
              class="head-img"
              :style="{ border: detailData.pesServicePackageStatusDto.evaluateUserHeadFullUrl ? 'none' : '1px solid #ccc' }"
              :src="detailData.pesServicePackageStatusDto.evaluateUserHeadFullUrl"
              alt=""
            />
            <div style="margin-left: 20px">
              <div style="display: flex">
                <div style="font-size: 14px; color: #001450">{{ detailData.pesServicePackageStatusDto.cancelUserName || "暂无" }}</div>
                <div style="font-size: 12px; color: #999; margin-left: 10px">{{ detailData.pesServicePackageStatusDto.cancelTime || "暂无" }}</div>
              </div>
              <div style="display: flex; margin-top: 10px">
                <div style="font-size: 13px; color: #999; width: 69px">取消原因：</div>
                <div style="font-size: 13px; lin-height: 21px; color: #666; width: 1095px">{{ detailData.pesServicePackageStatusDto.cancelReason || "暂无" }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 服务项 -->
      <div class="serice-content">
        <div class="left-content">
          <div style="font-size: 14px; font-weight: bold; color: #000">服务项（{{ detailData.itemDtoList.length }}）</div>
          <!-- 表格 -->
          <div>
            <el-table :data="detailData.itemDtoList" style="width: 100%" highlight-current-row ref="itemTable" @row-click="rowClick">
              <el-table-column label="服务项" min-width="24%" :show-overflow-tooltip="true" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.status == 3 || scope.row.status == 4 ? '#999' : '#333' }">{{ scope.row.serviceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" min-width="18%" :show-overflow-tooltip="true" :render-header="renderHeader">
                <template slot-scope="scope">
                  <div style="display: flex; align-items: center">
                    <div class="point" :style="{ backgroundColor: scope.row.status == 0 ? '#dd0000' : scope.row.status == 1 ? '#008888' : '#ccc' }"></div>
                    <div :style="{ color: scope.row.status == 3 || scope.row.status == 4 ? '#999' : '#333' }">{{ scope.row.statusDesc }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="计划开始日期" min-width="18%" :show-overflow-tooltip="true" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.status == 3 || scope.row.status == 4 ? '#999' : '#333' }">{{ scope.row.planStartTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="服务负责人" min-width="18%" :show-overflow-tooltip="true" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.status == 3 || scope.row.status == 4 ? '#999' : '#001450' }">
                    {{ scope.row.chargeUserName }}<span style="color: #999">（{{ scope.row.chargeUserCompanyTypeDesc }}）</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="所属车间" min-width="16%" :show-overflow-tooltip="true" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.status == 3 || scope.row.status == 4 ? '#999' : '#333' }">{{ scope.row.workshopName || "暂无" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="16%" align="center" :show-overflow-tooltip="true" :render-header="renderHeader">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status == 0 && detailData.pesServicePackageStatusDto.status == 0 && scope.row.createWorkOrderFlag && createOrder"
                    size="small"
                    type="danger"
                    @click="
                      workOrder(scope.row)
                    "
                  >
                    开单
                  </el-button>
                  <el-button
                    size="small"
                    disabled
                    v-if="detailData.pesServicePackageStatusDto.status == -1 || (!scope.row.createWorkOrderFlag && detailData.pesServicePackageStatusDto.status == 0 && scope.row.status == 0)"
                  >
                    开单
                  </el-button>
                  <el-button
                    v-if="scope.row.status == 2 || scope.row.status == 1 || scope.row.status == 4"
                    size="small"
                    :disabled="!scope.row.queryWorkOrderFlag"
                    @click="
                      detail(scope.row)
                    "
                  >
                    详情
                  </el-button>
                  <span v-if="scope.row.status == 3" style="font-size: 14px; color: #999">无法开单</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 右侧工单详情 -->
        <div class="right-content">
          <!-- 头部 -->
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center">
              <img style="width: 28px; height: 28px" src="../../../assets/toGoing1.png" alt="" />
              <div style="font-size: 14px; color: #000; font-weight: bold; margin-left: 10px">{{ selectServiceItem.serviceName }}</div>
            </div>
            <div>
              <div style="display: flex; align-items: center">
                <div class="point" :style="{ backgroundColor: selectServiceItem.status == 0 ? '#dd0000' : selectServiceItem.status == 1 ? '#008888' : '#ccc' }"></div>
                <div style="font-size: 14px; color: #333">{{ selectServiceItem.statusDesc }}</div>
              </div>
            </div>
          </div>
          <!-- 工单信息 -->
          <div class="work-order-content" v-if="selectServiceItem.queryWorkOrderFlag && workOrderData">
            <div class="content-title">工单信息</div>
            <div class="content-item">
              <div class="item-title">工单编号</div>
              <div class="item-value">{{ workOrderData.workOrderNumber }}</div>
            </div>
            <div class="content-item">
              <div class="item-title">预约日期</div>
              <div class="item-value">{{ workOrderData.expectComingTime }}</div>
            </div>
            <div class="content-item">
              <div class="item-title">服务方</div>
              <div class="item-value">{{ workOrderData.distributorCompanyName }}</div>
            </div>
            <div class="content-item">
              <div class="item-title">执行人</div>
              <div class="item-value" style="display: flex; line-height: 17px">
                <div style="color: #333">{{ workOrderData.executePersonName }}</div>
                <div style="color: #999; margin-left: 10px">{{ workOrderData.executePersonPhone }}</div>
              </div>
            </div>
            <div class="content-item">
              <div class="item-title">报告</div>
              <div class="item-value" v-if="workOrderData && workOrderData.reportFileList && workOrderData.reportFileList.length > 0">
                <div class="report-file" v-for="(item, index) in workOrderData.reportFileList" :key="index">
                  <span class="file-name" :style="fileWidth" @click="preview(item)">《{{ item.fileName }}》</span>
                  <span style="color: #00145; cursor: pointer" @click="downloadReport(item)">下载</span>
                </div>
              </div>
              <div class="item-value" v-else>暂无</div>
            </div>
          </div>
          <!-- 计划信息 -->
          <div class="work-order-content">
            <div class="content-title">计划信息</div>
            <div class="content-item">
              <div class="plan-title">计划开始日期</div>
              <div class="item-value">{{ selectServiceItem.planStartTime }}</div>
            </div>
            <div class="content-item">
              <div class="plan-title">服务方</div>
              <div class="item-value">{{ selectServiceItem.chargeUserCompanyName }}</div>
            </div>
            <div class="content-item">
              <div class="plan-title">服务负责人</div>
              <div class="item-value" style="display: flex; line-height: 17px">
                <div style="color: #333">{{ selectServiceItem.chargeUserName }}</div>
                <div
                  style="color: #999; margin-left: 10px;white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;"
                >
                  {{ selectServiceItem.chargeUserPhone }}
                </div>
              </div>
            </div>
            <div class="content-item">
              <div class="plan-title">所属车间</div>
              <div class="item-value-break">{{ selectServiceItem.workshopName }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 完成弹框 -->
      <el-dialog title="完成服务包" :visible.sync="complateServiceFlag" width="30%" :close-on-click-modal="false" :before-close="handleClose">
        <span>完成后将邀请客户评价，并且无法编辑或重新打开。</span>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              complateServiceFlag = false
            "
            size="small"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="
              confirmComplate
            "
            size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 取消服务包 -->
      <el-dialog title="取消服务包" :visible.sync="cancelServiceFlag" width="30%" :close-on-click-modal="false" :before-close="handleClose">
        <span>取消后将无法编辑或重新打开，请谨慎操作</span>
        <div style="margin-top: 20px">
          <el-form ref="cancelForm" :model="cancelForm" :rules="cancelFormRules" label-width="80px" label-position="left">
            <el-form-item label="取消原因" prop="cancelServiceReason">
              <el-input :rows="6" v-model="cancelForm.cancelServiceReason" type="textarea" maxlength="200" show-word-limit placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="serviceCancel('cancelForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmCancel('cancelForm')" size="small">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 评价 -->
      <el-dialog title="评价" :visible.sync="evaluateFlag" width="30%" :close-on-click-modal="false" :before-close="handleClose">
        <el-form ref="evaluateFormRef" :rules="evaluateRules" :model="evaluateForm" label-width="100px">
          <el-form-item label="评分：" required>
            <el-rate style="font-size: 15px" v-model="evaluateForm.score" @change="evaluateChange"></el-rate>
          </el-form-item>
          <el-form-item v-if="evaluateDesc">
            <div style="margin-bottom: 10px">{{ evaluateDesc }}</div>
          </el-form-item>
          <el-form-item label="评价内容：">
            <el-input :rows="6" v-model="evaluateForm.reason" type="textarea" maxlength="200" show-word-limit placeholder="使用系统默认内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEvaluate" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmEvaluate" size="small">提 交</el-button>
        </span>
      </el-dialog>
      <!-- 新建换油咨询工单   选择换油情况 -->
      <el-dialog title="请选择换油情况" class="closeWorkOrder" :visible="dialogOilChangeVisible" :show-close="false" width="30%">
        <el-form :model="ruleForm" :rules="closerules" ref="ruleForm" label-width="100px" label-position="top">
          <div class="radioGroup" style="margin-top:20px;border:1px solid #e9e9e9;padding: 20px;">
            <!-- 多选 -->
            <el-checkbox-group v-model="valueCheckBoxList" @change="selectId => changebox(selectId)" style="display: inline-block;">
              <el-checkbox style="height:50px;line-height:30px;" v-for="btn in oilChangefieldOption" :label="btn.type" :key="btn.type">{{ btn.desc }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="notice-text" v-if="resultBox">
            <img src="../../../assets/notice-icon.png" alt="" style="margin-right:8px;" />
            请预先咨询美孚工程师
          </div>
        </el-form>
        <div slot="footer" style="margin-top: 20px">
          <el-button type="danger" plain @click="consoleOilChange('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="confirmContiun('ruleForm')" size="small">确认继续</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogOilChangeVisible:false,
      valueCheckBoxList:[],
      oilChangefieldOption:[],
      resultBox:false,
      mainminheight: `height:${document.documentElement.clientHeight - 210}px`,
      fileWidth: `width:${document.documentElement.clientWidth * 0.3 - 250}px`,
      screenWidth: null,
      complateServiceFlag: false,
      cancelServiceFlag: false,
      cancelForm: {
        cancelServiceReason: ""
      },
      cancelFormRules: {
        cancelServiceReason: [{ required: true, message: "请输入取消原因", trigger: "blur" }]
      },
      evaluateFlag: false,
      evaluateForm: {
        score: "",
        reason: ""
      },
      evaluateDesc: "",
      pesId: "",
      detailData: {
        pesServicePackageStatusDto: {},
        itemDtoList: []
      },
      selectServiceItem: {},
      noServiceOrderList: [],
      workOrderData: {},
      itemTable: [],
      evaluateList: [
        {
          message: "非常不满意，您们的服务需要全面改进",
          score: 1
        },
        {
          message: "不满意，你们的服务存在瑕疵",
          score: 2
        },
        {
          message: "一般，基本实现了我们的诉求",
          score: 3
        },
        {
          message: "满意，感谢您们的努力",
          score: 4
        },
        {
          message: "非常满意，期待下次合作",
          score: 5
        }
      ],
      companyType: "",
      menuList: [],
      isLink: false,
      cancelPes: false,
      donePes: false,
      editPes: false,
      createOrder: false,
      createdWorkOrderRow:{},
    };
  },
  created() {
    this.pesId = this.$route.query.pesId;
    this.companyType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType;
    this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "PESpackage_web_cancel") {
        // 取消服务包
        this.cancelPes = true;
      }
      if (buttonList[i].menuCode == "PESpackage_web_done") {
        // 完成服务包
        this.donePes = true;
      }
      if (buttonList[i].menuCode == "PESpackage_web_editor") {
        // 编辑服务包
        this.editPes = true;
      }
      if (buttonList[i].menuCode == "PESpackage_web_creatorder") {
        this.createOrder = true;
      }
    }
    if (this.menuList && this.menuList.length > 0) {
      this.menuList.forEach(item => {
        if (item.menuCode == "customer_web") {
          this.isLink = true;
        }
      });
    }
    this.getDetailData(this.$route.query.pesId);
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
      })();
    };
  },
  methods: {
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
    // 获取服务包详情
    getDetailData(val) {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let param = {
        pesId: val
      };
      this.requestMethodGet("/pes/package/queryServicePackageDetail", param).then(res => {
        if (res.data.code == 1000) {
          loading.close();
          const data = res.data.data;
          if (data.itemDtoList.length) {
            this.selectServiceItem = data.itemDtoList[0];
            data.itemDtoList.forEach(item => {
              if (item.workOrderNumber) {
                this.noServiceOrderList.push(item.workOrderNumber);
              }
            });
            this.$refs.itemTable.setCurrentRow(data.itemDtoList[0], true);
            this.selectServiceItem = data.itemDtoList[0];
            if (data.itemDtoList[0].workOrderNumber) {
              // 获取工单详情
              this.getWorkOrderDetail(data.itemDtoList[0].workOrderNumber);
            }
          }
          this.detailData = data;
        } else {
          loading.close();
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 工单详情
    getWorkOrderDetail(orderNumber) {
      this.requestMethodGet("/pes/package/queryWorkerOrderInfo", { workOrderNumber: orderNumber }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (data.reportFileList && data.reportFileList.length > 0) {
            data.reportFileList.forEach(item => {
              item.fileType = item.fileUrl.split(".")[1];
            });
          }
          this.workOrderData = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑
    editService() {
      this.$router.push({
        path: "/PESService/editService",
        query: {
          pesId: this.detailData.pesInfoId,
          servicePageType: "edit",
          pesFlag: this.detailData.pesFlag,
          pesFlagCustomer: this.$route.query.pesFlagCustomer,
          serviceCompanyType: this.detailData.serviceCompanyType,
          distributorCompanyType: this.detailData.distributorCompanyType,
          companyNumber: this.detailData.customerCompanyNumber,
          companyId: this.detailData.companyId,
          distributorCompanyId: this.detailData.distributorCompanyId,
          customerType: this.detailData.customerType,
          customerCompanyType: this.$route.query.customerCompanyType
        }
      });
    },
    editServiceBatch() {
      this.$router.push({
        path: "/PESService/editServiceBatch",
        query: {
          pesId: this.detailData.pesInfoId,
          servicePageType: "edit",
          pesFlag: this.detailData.pesFlag,
          pesFlagCustomer: this.$route.query.pesFlagCustomer,
          serviceCompanyType: this.detailData.serviceCompanyType,
          distributorCompanyType: this.detailData.distributorCompanyType,
          companyNumber: this.detailData.customerCompanyNumber,
          companyId: this.detailData.companyId,
          distributorCompanyId: this.detailData.distributorCompanyId,
          customerType: this.detailData.customerType,
          customerCompanyType: this.$route.query.customerCompanyType
        }
      });
    },
    // 完成
    complate() {
      this.complateServiceFlag = true;
    },
    // 确定完成服务包
    confirmComplate() {
      this.requestMethodGet("/pes/package/completeServicePackage", { pesId: this.detailData.pesInfoId }).then(res => {
        if (res.data.code == 1000) {
          this.getDetailData(this.$route.query.pesId);
          this.complateServiceFlag = false;
        } else if (res.data.code == 4212) {
          this.complateServiceFlag = false;
          this.$alert(res.data.msg, "无法完成", {
            confirmButtonText: "知道了",
            callback: action => {}
          });
        } else {
          this.complateServiceFlag = false;
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消服务包
    cancelService() {
      this.cancelServiceFlag = true;
    },
    serviceCancel(formName) {
      this.cancelServiceFlag = false;
      this.cancelForm.cancelServiceReason = "";
      this.$refs[formName].resetFields();
    },
    // 确定取消
    confirmCancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            cancelReason: this.cancelForm.cancelServiceReason,
            pesId: this.detailData.pesInfoId
          };
          this.requestMethodGet("/pes/package/cancelServicePackage", params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                message: "取消成功",
                type: "success"
              });
              this.getDetailData(this.$route.query.pesId);
              this.serviceCancel(formName);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 立即评价
    evaluateClick() {
      this.evaluateFlag = true;
    },
    // 取消评价
    cancelEvaluate() {
      this.evaluateFlag = false;
      for (let key in this.evaluateForm) {
        this.evaluateForm[key] = "";
      }
    },
    // 评分改变
    evaluateChange(val) {
      if (val) {
        this.evaluateDesc = this.evaluateList.filter(item => {
          return item.score == val;
        })[0].message;
      }
    },
    // 提交评价
    confirmEvaluate() {
      if (!this.evaluateForm.score) {
        this.$message({
          type: "warning",
          message: "请选择评分"
        });
        return;
      }
      const params = {
        evaluateDesc: this.evaluateForm.reason,
        evaluateStars: this.evaluateForm.score,
        pesId: this.detailData.pesInfoId
      };
      this.requestMethodPost("/pes/package/evaluatePesService", params).then(res => {
        if (res.data.code == 1000) {
          this.getDetailData(this.$route.query.pesId);
          this.cancelEvaluate();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 服务项某一行点击事件
    rowClick(row) {
      if (row.workOrderNumber) {
        this.getWorkOrderDetail(row.workOrderNumber);
      }
      this.selectServiceItem = row;
    },
    // 开单
    workOrder(row) {
      this.createdWorkOrderRow = row;
      if(row.reportType == 11){
        this.dialogOilChangeVisible = true;
        this.getOilChangeStatus();
      }else{
        this.createWorkOrder(row)
      }
    },
    createWorkOrder(row){
      this.requestMethodGet("/web/config/serviceConfiguration/validServiceConfStatus", { serviceNumber: row.serviceNumber }).then(res => {
        if (res.data.code == 1000) {
          if (!res.data.data) {
            this.$confirm("该服务项不存在，请修改后重新开单", "服务已失效", {
              confirmButtonText: "前往编辑",
              cancelButtonText: "知道了"
            })
              .then(() => {
                this.editService();
              })
              .catch(() => {});
          } else {
            row.companyNumber = this.detailData.customerCompanyNumber;
            row.companyName = this.detailData.customerCompanyName;
            row.companyId = this.detailData.companyId;
            if (row.serviceType == 1) {
              this.$router.push({
                path: "/NewWorkOrderList/AddWorkOrderOil",
                query: {
                  serviceNumber: row.serviceNumber,
                  typeName: row.serviceName,
                  applylistParams: JSON.stringify(row),
                  pesServiceItemId: row.id,
                  workshopId: row.workshopId,
                  servicePackFlag: "PES",
                  reportType: row.reportType,
                  spId:this.detailData.assistSpIds
                }
              });
            } else {
              const params = {
                serviceNumber: row.serviceNumber,
                addServiceType: row.serviceType,
                serviceId :row.serviceId,
                typeName: row.serviceName,
                applylistParams: JSON.stringify(row),
                pesServiceItemId: row.id,
                workshopId: row.workshopId,
                servicePackFlag: "PES",
                reportType: row.reportType,
                paramDataLubFlag: row.paramDataLubFlag,
                coreDataLubFlag: row.coreDataLubFlag,
                coreDataTemplateId: row.coreDataTemplateId,
                spId:this.detailData.assistSpIds
              }
              if(this.createdWorkOrderRow.reportType==11){
                params.changeOil = this.valueCheckBoxList.toString()
              }
              this.$router.push({
                path: "/NewWorkOrderList/AddWorkOrder",
                query: params
              });
            }
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    changebox(val) {
      if (val.length) {
        if (val[val.length - 1] == "0") {
          this.valueCheckBoxList = ["0"];
        }
        if (val[val.length - 1] != "0") {
          // 有正常得选项
          let index = val.findIndex(it => it == "0");
          if (index > -1) {
            val.splice(index, 1);
            this.valueCheckBoxList = val;
          }
        }
      }
      this.resultBox = this.valueCheckBoxList.find(item => {
        return item == 1 || item == 2 || item == 3 || item == 4;
      });
    },
    // 取消选择换油情况
    consoleOilChange() {
      this.dialogOilChangeVisible = false;
    },
    // 确认继续
    confirmContiun() {
      if (this.valueCheckBoxList.length > 0) {
        this.consoleOilChange()
        this.createWorkOrder(this.createdWorkOrderRow)
      } else {
        this.$message({
          message: "请选择换油情况",
          type: "warning"
        });
      }
    },
    // 获取换油情况
    getOilChangeStatus() {
      this.requestMethodGet("/serviceReport/queryOilChangeStates")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilChangefieldOption = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 详情
    detail(row) {
      if (row.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 9||row.serviceType == 10||row.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
    },
    // 预览pdf
    preview(item) {
      if (item.fileType != "pdf") {
        this.$message({
          message: "目前仅支持预览PDF文件",
          type: "warning"
        });
        return;
      }
      window.open(item.fileUrlFull);
    },
    // 下载文件
    downloadReport(item) {
      const params = {
        url: item.fileUrl
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 跳转档案详情
    toArchivesDetail() {
      if (this.detailData.distributorCompanyType == 0 && this.ompanyType == 1) return;
      this.$router.push({
        path: "/CustomerProfile/CustomerPesIndex",
        query: {
          companyNumber: this.detailData.customerCompanyNumber,
          companyId: this.detailData.companyId,
          pesFlagCustomer: this.detailData.customerPesFlag
        }
      });
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 210}px`;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-checkbox-group{
  display: flex !important;
  flex-direction: column;
}
.notice-text {
  font-size: 12px;
  line-height: 12px;
  margin: 20px 0 10px;
  color: #ff9900;
  display: flex;
  align-items: center;
}
.add-customer-profile {
  padding: 20px;
  overflow: auto;
}
.el-col-3 {
  width: 14%;
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.service-name-form {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 6px;
}
.name-content {
  display: flex;
  align-items: center;
}
.title {
  font-size: 20px;
  font-weight: bold;
  color: #000;
}
.status {
  width: 60px;
  border-radius: 14px;
  background-color: #008888;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-left: 10px;
}
.no-wrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.label {
  color: #666;
  width: 100%;
}
/deep/ .el-form-item__label {
  color: #999;
}
/deep/ .el-form-item {
  margin-bottom: 0px;
}
.service-progress-content {
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.serice-content {
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
}
.left-content {
  width: 70%;
  padding: 24px 20px;
  border-right: 1px solid #e9e9e9;
}
.point {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}
.right-content {
  width: 24%;
  padding: 24px 20px;
}
.work-order-content {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
}
.content-title {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
}
.content-item {
  display: flex;
  font-size: 13px;
  margin-bottom: 17px;
}
.item-title {
  color: #999;
  width: 52px;
}
.item-value {
  color: #333;
  margin-left: 15px;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item-value-break {
  color: #333;
  margin-left: 15px;
  flex: 1;
}
.report-file {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.report-file:last-child {
  margin-bottom: 0;
}
.plan-title {
  color: #999;
  width: 78px;
}
.el-button--danger.is-disabled,
.el-button--danger.is-disabled:active,
.el-button--danger.is-disabled:focus,
.el-button--danger.is-disabled:hover {
  color: #fff !important;
  background-color: #ee8080 !important;
  border-color: #ee8080 !important;
}
.head-img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.file-name {
  color: #333;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
