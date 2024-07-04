<!--PES档案-->
<template>
  <div style="position:relative;" :style="{ height: tableHeight + 'px' }">
    <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-58px;">
      <el-button
        size="small"
        @click="addArchives"
        v-if="jurisdictionBtn && ($userInfo.userType == 0 || ($userInfo.userType == 1 && !isDaFlag)) "
        >
        新建档案
      </el-button>
    </div>
    <!-- 内容区域 -->
    <div class="add-customer-profile">
      <div v-if="yearList.length > 0">
        <!-- 名称和年度区域 -->
        <div class="name-year-content">
          <div class="company-name-content">
            <div class="company-name">{{ overViewData.customerCompanyName }}</div>
            <img src="../../../assets/pes_icon.png" style="width:20px;height:16px" v-if="overViewData.pesFlag == 1 || overViewData.pesFlag == 3" />
            <img src="../../../assets/DPES_icon.png" style="width:20px;height:16px" v-if="overViewData.pesFlag == 2 || overViewData.pesFlag == 3" />
          </div>
          <div class="year">
            <div style="display: flex;align-items: center;">
              <el-button size="small" type="danger">
                {{ selectedYear }}年{{ selectedYearItem.serviceFileNum != "0" ? "-" : "" }}{{ selectedYearItem.serviceFileNum != "0" ? selectedYearItem.serviceFileNum : "" }}
              </el-button>
              <div v-has="PC_PES_readAnnualArchive">
                <span style="font-size: 14px;margin:0 10px 0 20px;">档案年度</span>
                <el-select v-model="yearValue" clearable @change="yearClick" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in yearList"
                    :key="item.id"
                    :label="`${item.year}年${item.serviceFileNum != '0' ? '-' : ''}${item.serviceFileNum != '0' ? item.serviceFileNum : ''}`"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <!-- 档案项 -->
        <div class="item-content" :style="{ height: tableHeight - 80 + 'px' }">
          <el-container>
            <el-aside width="208px">
              <!-- 左侧项 -->
              <div class="item-left">
                <div class="pes-item" v-for="(item, index) in leftList" :key="index" @click="itemClick(item)" :style="{ backgroundColor: item.isActive ? '#f9f9f9' : '#fff' }">
                  <img class="pes-icon" :src="item.isActive ? item.active_icon : item.default_icon" alt="" />
                  <span style="color:#999;font-size:14px">{{ item.title }}</span>
                </div>
              </div>
            </el-aside>
            <el-main>
              <!-- 右侧总览内容 -->
              <div class="item-right" style="overflow: auto;" v-if="activeType == 'overview'" :style="{ height: tableHeight - 60 + 'px' }">
                <div style="width:60px;height:60px;position: absolute;right: 20px;top:135px;" v-if="overViewData.fileStatus">
                  <img src="../../../assets/pes_archived.png" alt="" />
                </div>
                <el-row :gutter="24" style="margin-top:17px;">
                  <el-col :span="12">
                    <div style="font-size:16px;color:#999;">
                      {{ selectedYear }}年度{{ overViewData.distributorCompanyType == 1 ? "DPES" : "PES" }}档案{{ selectedYearItem.serviceFileNum != "0" ? "-" : ""
                      }}{{ selectedYearItem.serviceFileNum != "0" ? selectedYearItem.serviceFileNum : "" }}
                    </div>
                  </el-col>
                  <el-col :span="12" align="right">
                    <!-- <el-button size="small" plain :disabled="overViewData.fileStatus == '1'" @click="editArchives" v-has="PES_archive_editor" v-if="overViewData.pesEditFlag">
                      编辑档案
                    </el-button> -->
                    <!-- 删除档案    无服务项或者全部为已取消服务项 有此按钮-->
                    <el-button
                      type="danger"
                      size="small"
                      plain
                      :disabled="overViewData.fileStatus == '1'"
                      @click="deleteArchives"
                      v-if="deleteCode && overViewData.pesDeleteFlag && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                    >
                      删除档案
                    </el-button>
                    <!--  完结计划工程服务  无进行中服务项，计划书已确认、年度总结已发布  有此按钮--->
                    <el-button
                      type="danger"
                      plain
                      size="small"
                      v-has="PES_archive_complete"
                      v-if="overViewData.fileStatus != '1' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                      @click="completePes"
                    >
                      完结计划工程服务
                    </el-button>
                    <!-- 重新编辑档案  overViewData.fileStatus=='1'   归档状态下才有此按钮-->
                    <el-button
                      type="danger"
                      plain
                      style="margin-right:40px;"
                      v-if="overViewData.pesReEditFlag && archiveRestartBtn && overViewData.fileStatus == '1'"
                      @click="editArchivesAgain"
                      size="small"
                    >
                      重新编辑档案
                    </el-button>
                  </el-col>
                </el-row>
                <!-- 服务商 -->
                <div class="right-content" style="margin-top: 0px;">
                  <div class="line"></div>
                  <div class="right-title">服务商</div>
                </div>
                <div style="display:flex;align-items:center;margin-top:10px;font-size: 15px;">
                  <!-- <div style="color:rgb(153,153,153)">{{ overViewData.serviceCompanyType == "0" ? "服务商" : "授权服务方" }}</div> -->
                  <div style="color:rgb(153,153,153)">授权服务方</div>
                  <div style="margin-left:10px">{{ overViewData.serviceCompanyName }}</div>
                </div>
                <div style="display:flex;align-items:center;margin-top:10px;font-size: 15px;" v-show="overViewData.assistSpIds != overViewData.distributorCompanyId">
                  <div style="color:rgb(153,153,153)">协助经销商</div>
                  <div style="margin-left:10px">{{ overViewData.assistSpNames }}</div>
                </div>
                <!-- PES阶段 -->
                <div class="right-content">
                  <div class="line"></div>
                  <div class="right-title">服务阶段</div>
                </div>
                <!-- 卡片区域 -->
                <el-row style="min-width:800px;margin-top:10px;">
                  <!-- 计划书 -->
                  <el-col :span="6">
                    <div :class="screenWidth > 1600 ? 'card-item' : 'card-item-small'" @click="overviewCardClick('计划书')">
                      <div
                        class="card-content"
                        :style="{
                          background:
                            overViewData.stage1FileNum || overViewData.pesServicePackageStatusDto
                              ? 'linear-gradient(to right,rgba(204,221,255,0.5),rgba(255,255,255,0.5))'
                              : 'linear-gradient(to right,rgba(153,153,153,0.1),rgba(255,255,255,0.1))'
                        }"
                      >
                        <div style="margin:24px 20px">
                          <div class="right-content-title">
                            <div>计划书</div>
                            <i class="el-icon-arrow-right"></i>
                          </div>
                          <div class="right-content-placeholder" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">制定全年计划工程服务计划</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <!-- 目标实现 -->
                    <div :class="screenWidth > 1600 ? 'card-item' : 'card-item-small'" @click="overviewCardClick('目标实现')">
                      <div
                        class="card-content"
                        :style="{
                          background:
                            overViewData.stage2FileNum || overViewData.pesServicePackageStatusDto
                              ? 'linear-gradient(to right,rgba(204,221,255,0.5),rgba(255,255,255,0.5))'
                              : 'linear-gradient(to right,rgba(153,153,153,0.1),rgba(255,255,255,0.1))'
                        }"
                      >
                        <div style="margin:24px 20px">
                          <div class="right-content-title">
                            <div>目标实现</div>
                            <i class="el-icon-arrow-right"></i>
                          </div>
                          <div class="right-content-placeholder">履行计划，执行工单</div>
                        </div>
                      </div>
                      <div class="right-file" :style="{ fontWeight: overViewData.stage2FileNum || overViewData.pesServicePackageStatusDto ? 'bold' : '' }">
                        附件：<span :style="{ color: overViewData.stage2FileNum && overViewData.pesServicePackageStatusDto ? '#dd0000' : '#999' }">{{ overViewData.stage2FileNum }}</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <!-- 效益总结 -->
                    <div :class="screenWidth > 1600 ? 'card-item' : 'card-item-small'" @click="overviewCardClick('效益总结')">
                      <div
                        class="card-content"
                        :style="{
                          background: overViewData.stage3FileNum
                            ? 'linear-gradient(to right,rgba(204,221,255,0.5),rgba(255,255,255,0.5))'
                            : 'linear-gradient(to right,rgba(153,153,153,0.1),rgba(255,255,255,0.1))'
                        }"
                      >
                        <div style="margin:24px 20px">
                          <div class="right-content-title">
                            <div>效益总结</div>
                            <i class="el-icon-arrow-right"></i>
                          </div>
                          <div class="right-content-placeholder">基于目标输出报告</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <!-- 年度总结 -->
                    <div :class="screenWidth > 1600 ? 'card-item' : 'card-item-small'" @click="overviewCardClick('年度总结')">
                      <div
                        class="card-content"
                        :style="{
                          background: overViewData.stage4FileNum
                            ? 'linear-gradient(to right,rgba(204,221,255,0.5),rgba(255,255,255,0.5))'
                            : 'linear-gradient(to right,rgba(153,153,153,0.1),rgba(255,255,255,0.1))'
                        }"
                      >
                        <div style="margin:24px 20px">
                          <div class="right-content-title">
                            <div>年度总结</div>
                            <i class="el-icon-arrow-right"></i>
                          </div>
                          <div class="right-content-placeholder" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">回顾全年计划工程服务</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <!-- 工单执行进度 -->
                <div class="right-content">
                  <div class="line"></div>
                  <div class="right-title">服务进度</div>
                </div>
                <!-- 有进度 -->
                <div class="workorder-progress" style="margin-top: 10px;" v-if="overViewData.pesServicePackageStatusDto">
                  <el-link style="font-size:13px;color:#02a7f0;" @click="itemClick({ _uid: 2 }, true)"
                    >{{ selectedYear }}年度{{ selectedYearItem.serviceFileNum != "0" ? "-" : ""
                    }}{{ selectedYearItem.serviceFileNum != "0" ? selectedYearItem.serviceFileNum : "" }}计划工程服务档案服务项（{{ overViewData.pesServicePackageStatusDto.progressIngNum }}/{{
                      overViewData.pesServicePackageStatusDto.progressAllNum
                    }}）<i class="el-icon-arrow-right"></i
                  ></el-link>
                  <el-progress :percentage="overViewData.pesServicePackageStatusDto.progressPercent" color="#008888" style="width:658px"></el-progress>
                </div>
                <!-- 动态 -->
                <div class="right-content">
                  <div class="line"></div>
                  <div class="right-title">动态</div>
                </div>
                <!-- 动态 -->
                <div style="margin-top:10px">
                  <el-timeline :reverse="reverse">
                    <el-timeline-item v-for="(item, index) in overViewData.trendsList" :key="index" :timestamp="item.createTime" color="#ccddff" size="large" placement="top">
                      <div style="font-size:13px" v-if="item.type == 1">
                        <span style="color:#000">{{ item.createUserName }}</span>
                        <span style="color:#666;margin:0 5px">{{ item.trendOperate }}</span>
                        <span style="color:#000">{{ item.trendMgs }}</span>
                      </div>
                      <div style="font-size:13px" v-if="item.type == 2">
                        <span style="color:#000;margin:0 5px">{{ item.trendMgs }}</span>
                        <span style="color:#666">{{ item.trendOperate }}</span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
              <!-- 右侧PES档案文件 -->
              <div class="item-right" v-if="activeType == 'archives'">
                <!-- 计划书 -->
                <el-row type="flex" justify="space-between">
                  <el-col :span="20">
                    <div class="right-content">
                      <div class="line"></div>
                      <div class="right-title">计划书</div>
                    </div>
                  </el-col>
                  <el-col :span="4" v-if="companyType != '2' && hideOperation() && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId" v-has="PES_prospectus_editor">
                    <div style="margin-top: 15px;">
                      <el-button type="danger" :disabled="overViewData.fileStatus == '1'" size="small" @click="editPlan()" style="color:#fff;float: right;">制作计划书</el-button>
                    </div>
                  </el-col>
                </el-row>
                <div class="file-list-content">
                  <div class="service-report" v-if="planReportInfoDto.length && ((companyType == '2' && planReportInfoDto[0].status != '1') || companyType != '2')">
                    <el-row v-for="(item, index) in planReportInfoDto" :key="index">
                      <div v-if="item.flag == 1" class="file-list">
                        <el-col :span="16">
                          <div class="file-content">
                            <div @click="previewFileOpen(item, '计划书')">
                              <span class="file-status" v-if="item.status == '1'" style="margin:0">未发布</span>
                              <span class="file-status" v-if="item.status == '2'" style="background:rgba(255,153,0,0.1);color:#ff9900;margin:0">待确认</span>
                              <span class="file-status" v-if="item.status == '3'" style="background:rgba(0,136,136,0.1);color:#008888;margin:0">已确认</span>
                              <span class="file-name">{{ item.reportName }}</span>
                            </div>
                            <div class="file-detail">
                              <div>创建人：{{ item.createUserName }}</div>
                              <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                              <div>创建时间：{{ item.createTime }}</div>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="8" align="right">
                          <!-- 未发布  -->
                          <div v-if="item.status == '1'">
                            <span v-if="item.pdfCreateFlag == 2" class="report-creating">报告生成中</span>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              v-has="PES_prospectus_editor"
                              @click="editPlan()"
                              style="color:#001450"
                              >编辑</el-button
                            >
                            <el-button type="text" v-if="item.pdfCreateFlag == 1" @click="previewFileOpen(item)" style="color:#001450">预览</el-button>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              v-has="PES_prospectus_release"
                              @click="publishPlan()"
                              style="color:#001450"
                              >发布</el-button
                            >
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              v-has="PES_prospectus_delete"
                              @click="deletePlan()"
                              style="color:#dd0000;"
                              >删除</el-button
                            >
                          </div>
                          <!-- 待确认 -->
                          <div v-if="item.status == '2'">
                            <span v-if="item.pdfCreateFlag == 2" class="report-creating">报告生成中</span>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              @click="surePlan()"
                              v-has="PES_prospectus_confirm"
                              v-if="companyType != '2' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              style="color:#001450"
                              >确认</el-button
                            >
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              @click="surePlan()"
                              v-has="PES_prospectus_confirm"
                              v-if="companyType == '2' && overViewData.customerCompanyId == $userInfo.orgInfo.companyId"
                              style="color:#001450"
                              >确认</el-button
                            >
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-has="PES_prospectus_editor"
                              v-if="companyType != '2' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              @click="editPlan()"
                              style="color:#001450"
                              >编辑</el-button
                            >
                            <el-button type="text" v-if="item.pdfCreateFlag != 2" @click="previewFileOpen(item, '计划书')" style="color:#001450">预览</el-button>
                            <el-button type="text" @click="downloadArchives(item, '计划书')" style="color:#001450">下载</el-button>
                          </div>
                          <!-- 已确认 -->
                          <div v-if="item.status == '3'">
                            <el-button type="text" :disabled="overViewData.fileStatus == '1'" v-has="PES_prospectus_restart" @click="againPublishPlan()" style="color:#001450">再次发布</el-button>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-has="PES_prospectus_editor"
                              v-if="companyType != '2' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              @click="editPlan()"
                              style="color:#001450"
                              >编辑</el-button
                            >
                            <el-button type="text" @click="previewFileOpen(item, '计划书')" style="color:#001450">预览</el-button>
                            <el-button type="text" @click="downloadArchives(item, '计划书')" style="color:#001450">下载</el-button>
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </div>
                  <div class="service-report1" v-if="planReportInfoDtoUpload.length" style="display:flex;justify-content: space-between;flex-wrap:wrap;">
                    <div style="width:49%" v-for="(item, index) in planReportInfoDtoUpload" :key="index">
                      <div class="file-list" v-if="item.flag == 0">
                        <img v-if="item.fileType == 'pdf'" class="file_type_icon" src="../../../assets/pdf.png" alt="" />
                        <img v-else-if="item.fileType == 'doc' || item.fileType == 'docx'" class="file_type_icon" src="../../../assets/file_doc_docx.png" alt="" />
                        <img v-else-if="item.fileType == 'xls' || item.fileType == 'xlsx'" class="file_type_icon" src="../../../assets/file_xls_xlsx.png" alt="" />
                        <img v-else class="file_type_icon" src="../../../assets/file_other.png" alt="" />
                        <div class="file-content">
                          <div class="file-name" @click="previewFile(item, '计划书')">{{ item.reportName }}</div>
                          <div class="file-detail">
                            <div>创建人：{{ item.createUserName }}</div>
                            <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                            <div>创建时间：{{ item.createTime }}</div>
                          </div>
                        </div>
                        <img @click="downloadArchives(item)" style="width:32px;height:32px;display:block;cursor: pointer;" src="../../../assets/download-icon.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div v-if="planReportInfoDto.length == 0">
                    <div class="no-file">暂无文件</div>
                  </div>
                </div>
                <!-- 目标实现 -->
                <el-row type="flex" justify="space-between">
                  <el-col :span="20">
                    <div class="right-content">
                      <div class="line"></div>
                      <div class="right-title">目标实现</div>
                    </div>
                  </el-col>
                  <el-col :span="4" v-if="goalAchieveList.length">
                    <div style="height:25px;margin-top: 8px;">
                      <el-button type="text" style="color:#001450;float: right;" @click="downloadArchivesPage('2')">全部下载</el-button>
                    </div>
                  </el-col>
                </el-row>

                <div class="file-list-content">
                  <el-row class="service-report" v-if="goalAchieveList.length">
                    <el-col :span="12" v-for="(item, index) in goalAchieveList" :key="index">
                      <div class="file-list">
                        <img v-if="item.fileType == 'pdf'" class="file_type_icon" src="../../../assets/pdf.png" alt="" />
                        <img v-else-if="item.fileType == 'doc' || item.fileType == 'docx'" class="file_type_icon" src="../../../assets/file_doc_docx.png" alt="" />
                        <img v-else-if="item.fileType == 'xls' || item.fileType == 'xlsx'" class="file_type_icon" src="../../../assets/file_xls_xlsx.png" alt="" />
                        <img v-else class="file_type_icon" src="../../../assets/file_other.png" alt="" />
                        <div class="file-content">
                          <div class="file-name" @click="previewFile(item, '目标实现')">{{ item.fileName }}</div>
                          <div class="file-detail">
                            <div>创建人：{{ item.createUserName }}</div>
                            <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                            <div>创建时间：{{ item.createTime }}</div>
                          </div>
                        </div>
                        <img @click="downloadArchives(item)" style="width:32px;height:32px;display:block;cursor: pointer;" src="../../../assets/download-icon.png" alt="" />
                      </div>
                    </el-col>
                  </el-row>
                  <div v-else>
                    <div class="no-file">暂无文件</div>
                  </div>
                </div>
                <!-- 效益总结 -->
                <el-row type="flex" justify="space-between">
                  <el-col :span="20">
                    <div class="right-content">
                      <div class="line"></div>
                      <div class="right-title">效益总结</div>
                    </div>
                  </el-col>
                  <el-col :span="4" v-if="companyType != '2' && hideOperation()" v-has="PES_xyzj_editor">
                    <div>
                      <!-- 计划书已确认状态才会有制作年度总结 :http-request="handleUploadForm"-->
                      <el-button
                        type="danger"
                        size="small"
                        style="color:#fff;margin-top: 18px;float: right;"
                        @click="editBenefitSummary('add')"
                        :disabled="overViewData.fileStatus == '1'"
                        v-has="PES_xyzj_editor"
                        v-if="(overViewData.distributorCompanyId == $userInfo.orgInfo.companyId) && (benefitSummaryDto.length == 0 || (benefitSummaryDto.length && benefitSummaryDto[0].status != '4') || (benefitSummaryDto.length && benefitSummaryDto[0].flag == 0))"
                        >制作效益总结报告</el-button
                      >
                    </div>
                  </el-col>
                </el-row>
                <div class="file-list-content">
                  <div class="service-report" v-if="benefitSummaryDto.length && ((companyType == '2' && benefitSummaryDto[0].status != '1') || companyType != '2')">
                    <el-row v-for="(item, index) in benefitSummaryDto" :key="index">
                      <div v-if="item.flag == 1" class="file-list">
                        <el-col :span="16">
                          <div class="file-content">
                            <div @click="previewFileOpen(item, '效益总结')">
                              <span class="file-status" v-if="item.status == '1'" style="margin:0">未发布</span>
                              <span class="report-creating" v-if="item.status == '2'">报告生成中</span>
                              <span class="file-status" v-if="item.status == '4'" style="background:rgba(0,136,136,0.1);color:#008888;margin:0">已发布</span>
                              <span class="file-name">{{ item.reportName }}</span>
                            </div>
                            <div class="file-detail">
                              <div>创建人：{{ item.createUserName }}</div>
                              <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                              <div>创建时间：{{ item.createTime }}</div>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="8" align="right">
                          <!-- 未发布  -->
                          <div v-if="item.status == '1' || item.status == '2'">
                            <span style="color: #dd0000;font-size: 14px;margin-right: 10px;" v-if="item.status == '2'">报告生成中 ···</span>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              v-has="PES_xyzj_editor"
                              @click="editBenefitSummary('edit')"
                              style="color:#001450"
                              >编辑</el-button
                            >
                            <el-button type="text" v-if="item.status == '1'" @click="previewFileOpen(item)" style="color:#001450">预览</el-button>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-has="PES_xyzj_release"
                              v-if="item.status == '1' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              @click="publishBenefitSummary()"
                              style="color:#001450"
                              >发布</el-button
                            >
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-has="PES_xyzj_delete"
                              v-if="item.status == '1' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              @click="deleteBenefitSummary()"
                              style="color:#dd0000;"
                              >删除</el-button
                            >
                          </div>
                          <!-- 已发布 -->
                          <div v-if="item.status == '4'">
                            <el-button type="text" @click="previewFileOpen(item, '效益总结')" style="color:#001450">预览</el-button>
                            <el-button type="text" @click="getDownloadFullUrl(item.fileUrl)" style="color:#001450">下载</el-button>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-has="PES_xyzj_restart"
                              v-if="companyType != '2' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              @click="rePublishBenefitSummary()"
                              style="color:#001450"
                              >再次发布</el-button
                            >
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </div>
                  <div class="service-report1" v-if="benefitSummaryDtoUpload.length" style="display:flex;justify-content: space-between;flex-wrap:wrap;">
                    <div style="width:49%" v-for="(item, index) in benefitSummaryDtoUpload" :key="index">
                      <div class="file-list" v-if="item.flag == 0">
                        <img v-if="item.fileType == 'pdf'" class="file_type_icon" src="../../../assets/pdf.png" alt="" />
                        <img v-else-if="item.fileType == 'doc' || item.fileType == 'docx'" class="file_type_icon" src="../../../assets/file_doc_docx.png" alt="" />
                        <img v-else-if="item.fileType == 'xls' || item.fileType == 'xlsx'" class="file_type_icon" src="../../../assets/file_xls_xlsx.png" alt="" />
                        <img v-else class="file_type_icon" src="../../../assets/file_other.png" alt="" />
                        <div class="file-content">
                          <div class="file-name" @click="previewFile(item, '效益总结')">{{ item.reportName }}</div>
                          <div class="file-detail">
                            <div>创建人：{{ item.createUserName }}</div>
                            <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                            <div>创建时间：{{ item.createTime }}</div>
                          </div>
                        </div>
                        <img @click="downloadArchives(item)" style="width:32px;height:32px;display:block;cursor: pointer;" src="../../../assets/download-icon.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div v-if="benefitSummaryDto.length == 0">
                    <div class="no-file">暂无文件</div>
                  </div>
                </div>

                <!-- 年度总结 -->
                <el-row type="flex" justify="space-between">
                  <el-col :span="20">
                    <div class="right-content">
                      <div class="line"></div>
                      <div class="right-title">年度总结</div>
                    </div>
                  </el-col>
                  <el-col :span="4" v-if="companyType != '2' && hideOperation()" v-has="PES_year_editor">
                    <div>
                      <!-- 计划书已确认状态才会有制作年度总结 -->
                      <el-button
                        size="small"
                        type="danger"
                        style="color:#fff;margin-top: 18px;float: right;"
                        @click="editSummary()"
                        :disabled="overViewData.fileStatus == '1'"
                        v-if="planReportInfoDto.length && planReportInfoDto[0].status == '3' && ((yearReportInfoDto.length > 0 && yearReportInfoDto[0].status != '4') || yearReportInfoDto.length == 0)"
                        >制作年度总结</el-button
                      >
                    </div>
                  </el-col>
                </el-row>
                <div class="file-list-content">
                  <div class="service-report" v-if="yearReportInfoDto.length && ((yearReportInfoDto[0].status == '4' && companyType == '2') || companyType != '2')">
                    <el-row v-for="(item, index) in yearReportInfoDto" :key="index">
                      <div v-if="item.flag == 1" class="file-list">
                        <el-col :span="16">
                          <div class="file-content">
                            <div @click="previewFileOpen(item, '年度总结')">
                              <span class="file-status" v-if="item.status == '1'" style="margin:0">未发布</span>
                              <span class="file-status" v-if="item.status == '4'" style="background:rgba(0,136,136,0.1);color:#008888;margin:0">已发布</span>
                              <span class="file-name">{{ item.reportName }}</span>
                            </div>
                            <div class="file-detail">
                              <div>创建人：{{ item.createUserName }}</div>
                              <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                              <div>创建时间：{{ item.createTime }}</div>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="8" align="right">
                          <!-- 未发布  -->
                          <div v-if="item.status == '1'">
                            <el-button type="text" v-has="PES_year_editor" v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId" @click="editSummary()" style="color:#001450"
                              >编辑</el-button
                            >
                            <span style="color: #dd0000;font-size: 14px;margin-right: 10px;" v-if="item.pdfCreateFlag == '2'">报告生成中 ···</span>
                            <el-button type="text" v-if="item.pdfCreateFlag != '2'" @click="previewFileOpen(item)" style="color:#001450">预览</el-button>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              v-has="PES_year_release"
                              @click="publishSummary()"
                              style="color:#001450"
                              >发布</el-button
                            >
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              v-has="PES_year_delete"
                              @click="deleteSummary()"
                              style="color:#dd0000;"
                              >删除</el-button
                            >
                          </div>
                          <!-- 已发布 -->
                          <div v-if="item.status == '4'">
                            <span style="color: #dd0000;font-size: 14px;margin-right: 10px;" v-if="item.pdfCreateFlag == '2'">报告生成中 ···</span>
                            <el-button type="text" v-if="item.pdfCreateFlag != '2'" @click="previewFileOpen(item, '年度总结')" style="color:#001450">预览</el-button>
                            <el-button type="text" @click="downloadArchives(item, '年度总结')" style="color:#001450">下载</el-button>
                            <el-button
                              type="text"
                              :disabled="overViewData.fileStatus == '1'"
                              v-has="PES_year_restart"
                              v-if="companyType != '2' && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                              @click="rePublishSummary()"
                              style="color:#001450"
                              >再次发布</el-button
                            >
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </div>
                  <div class="service-report1" v-if="yearReportInfoDtoUpload.length" style="display:flex;justify-content: space-between;flex-wrap:wrap;">
                    <div style="width:49%;" v-for="(item, index) in yearReportInfoDtoUpload" :key="index">
                      <div class="file-list" v-if="item.flag == 0">
                        <img v-if="item.fileType == 'pdf'" class="file_type_icon" src="../../../assets/pdf.png" alt="" />
                        <img v-else-if="item.fileType == 'doc' || item.fileType == 'docx'" class="file_type_icon" src="../../../assets/file_doc_docx.png" alt="" />
                        <img v-else-if="item.fileType == 'xls' || item.fileType == 'xlsx'" class="file_type_icon" src="../../../assets/file_xls_xlsx.png" alt="" />
                        <img v-else class="file_type_icon" src="../../../assets/file_other.png" alt="" />
                        <div class="file-content">
                          <div class="file-name" @click="previewFile(item, '年度总结')">{{ item.reportName }}</div>
                          <div class="file-detail">
                            <div>创建人：{{ item.createUserName }}</div>
                            <div style="width:1px;height:12px;background-color:#e9e9e9;margin:0 10px"></div>
                            <div>创建时间：{{ item.createTime }}</div>
                          </div>
                        </div>
                        <img @click="downloadArchives(item)" style="width:32px;height:32px;display:block;cursor: pointer;" src="../../../assets/download-icon.png" alt="" />
                      </div>
                    </div>
                  </div>

                  <div v-if="yearReportInfoDto.length == 0">
                    <div class="no-file">暂无文件</div>
                  </div>
                </div>
              </div>
              <!-- 右侧服务包 -->
              <div class="item-right" v-if="activeType == 'service'" :style="{ height: tableHeight - 80 + 'px' }">
                <!-- 有服务包 -->
                <div v-loading="cardLoading" element-loading-text="加载中...">
                  <div style="display: flex;justify-content: space-between;margin-top:17px;">
                    <div>
                      <span style="font-size:14px;margin-right:6px;">选择计划</span>
                      <el-select v-model="planIndex" clearable @change="planClick" placeholder="请选择" size="small">
                        <el-option v-for="(item, index) in planList" :key="item.id" :label="`计划目标${index + 1}`" :value="item.id"> </el-option>
                      </el-select>
                    </div>
                    <!-- 服务包名称 -->
                    <div>
                      <el-button
                        size="mini"
                        type="danger"
                        v-has="PES_service_batchcreate"
                        v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                        :disabled="overViewData.fileStatus == '1'"
                        @click="
                          opService(1);
                          $gio.clickAddServiceItemsTrack($route.query.pesId);
                        "
                      >
                        添加服务项
                      </el-button>
                      <el-button
                        type="danger"
                        plain
                        @click="relateWorkorder()"
                        size="mini"
                        v-has="PC_PES_WorkOrderAssociation"
                        v-if="overViewData.fileStatus == 0 && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                        >关联工单</el-button
                      >
                      <el-button
                        type="danger"
                        :disabled="overViewData.fileStatus == '1'"
                        v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                        v-has="PES_service_prospectus"
                        @click="editPlan()"
                        size="mini"
                      >
                        {{ makeOrEditPlanReportFlag == 1 || !makeOrEditPlanReportFlag ? "制作计划书" : "编辑计划书" }}
                      </el-button>
                      <el-button
                        size="mini"
                        plain
                        type="danger"
                        :disabled="overViewData.fileStatus == '1'"
                        v-has="PES_service_batcheditor"
                        v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                        @click="opService(2)"
                      >
                        批量编辑
                      </el-button>
                      <el-button
                        size="mini"
                        plain
                        :disabled="overViewData.fileStatus == '1'"
                        v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                        v-has="PES_service_batchcancel"
                        @click="opService(0)"
                      >
                        批量取消
                      </el-button>
                    </div>
                  </div>
                  <div ref="returnTop">
                    <div id="ul" :style="{ height: tableHeight - 100 + 'px' }">
                      <div v-for="(item, index) in planList" :key="index" :id="'li' + index" style="margin-top:16px;">
                        <div style="background-color: #f9f9f9;padding:14px 20px 6px;font-size:14px;border-radius: 6px;">
                          <div>
                            <div style="color:#000;line-height: 14px;margin-bottom:12px;cursor: pointer;display: flex;justify-content: space-between;align-items: center;">
                              <div>计划目标{{ index + 1 }}</div>
                              <div>
                                <span class="status-point" v-if="item.status == '0'" style="background: #DA0000;"></span>
                                <span class="status-point" v-if="item.status == '1' || item.status == '2'" style="background: #008888;"></span>
                                <span class="status-point" v-if="item.status == '3'" style="background: #C0C4CC"></span>

                                <span>{{ item.statusDesc }}</span>
                              </div>
                            </div>
                            <div style="color:#999;line-height: 22px;">{{ item.content }}</div>
                          </div>
                          <div style="width:100px;">
                            <span class="status-point" v-if="item.status == '0'" style="background: #DA0000;"></span>
                            <span class="status-point" v-if="item.status == '1' || item.status == '2'" style="background: #008888;"></span>
                            <span class="status-point" v-if="item.status == '3'" style="background: #C0C4CC"></span>

                            <span>{{ item.statusDesc }}</span>
                          </div>
                        </div>
                        <el-table
                          @select="selectTableData"
                          @select-all="selectTableData"
                          style="width: 100%;margin-top:10px;"
                          max-height="280px"
                          :ref="`serviceTable${index}`"
                          :data="item.itemDtoList"
                          :header-cell-style="{ background: '#f7f7f7' }"
                          stripe
                        >
                          <!--  -->
                          <el-table-column show-overflow-tooltip type="selection" width="55" :selectable="row => serviceTableEditable(row)" />
                          <el-table-column show-overflow-tooltip prop="serviceName" label="服务类型" />
                          <el-table-column show-overflow-tooltip prop="statusDesc" label="状态">
                            <template slot-scope="scope">
                              <span style="margin-right:10px;color:#001450">{{ scope.row.statusDesc }} </span>
                              <el-popover placement="top" title="取消原因" width="200" trigger="click" :content="scope.row.cancelReason">
                                <i slot="reference" class="el-icon-warning" v-show="scope.row.status == '3'" style="color:#FF9900;margin-left:5px"></i>
                              </el-popover>
                            </template>
                          </el-table-column>
                          <el-table-column show-overflow-tooltip prop="planStartTime" label="计划开始时间" />
                          <el-table-column show-overflow-tooltip prop="completeTime" label="完成时间" />
                          <el-table-column show-overflow-tooltip prop="chargeUserName" label="服务负责人">
                            <template slot-scope="scope">
                              <div style="display: flex;align-items: center;">
                                <span style="margin-right:10px;word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.chargeUserName }} </span>
                                <el-tooltip
                                  :content="
                                    scope.row.chargeUserHonoraryMedal == '3'
                                      ? '服务大师'
                                      : scope.row.chargeUserHonoraryMedal == '2'
                                      ? '服务达人'
                                      : scope.row.chargeUserHonoraryMedal == '1'
                                      ? '服务先锋'
                                      : ''
                                  "
                                  placement="top"
                                >
                                  <img v-if="scope.row.chargeUserHonoraryMedal == '3'" src="../../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                                  <img v-if="scope.row.chargeUserHonoraryMedal == '2'" src="../../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                                  <img v-if="scope.row.chargeUserHonoraryMedal == '1'" src="../../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                                </el-tooltip>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column
                            show-overflow-tooltip
                            prop="mobilProjectUserNames"
                            label="美孚项目成员"
                            :formatter="(a, b, c) => (c ? c : '暂无')"
                            v-if="overViewData.serviceCompanyType == '0'"
                          />
                          <el-table-column
                            show-overflow-tooltip
                            prop="distributorProjectUserNames"
                            label="经销商项目成员"
                            :formatter="(a, b, c) => (c ? c : '暂无')"
                            v-if="(overViewData.distributorCompanyType == '1' && overViewData.serviceCompanyType == '0') || overViewData.serviceCompanyType == '1'"
                          />
                          <el-table-column show-overflow-tooltip prop="customerProjectUserNames" label="客户项目成员" :formatter="(a, b, c) => (c ? c : '暂无')" />

                          <el-table-column label="操作">
                            <template v-slot="{ row }">
                              <el-button
                                v-if="row.status == 0 && row.serviceFileStatus == 0 && row.createWorkOrderFlag"
                                type="text"
                                v-has="PES_service_billing"
                                size="mini"
                                :disabled="overViewData.fileStatus == '1'"
                                style="color:#001450;margin-left:0"
                                @click="workOrder(row)"
                              >
                                开单
                              </el-button>
                              <el-button
                                type="text"
                                size="mini"
                                style="color:#001450;margin-left:0"
                                disabled
                                v-if="row.serviceFileStatus == -1 || (!row.createWorkOrderFlag && row.serviceFileStatus == 0 && row.status == 0)"
                              >
                                开单
                              </el-button>
                              <el-button
                                type="text"
                                :disabled="overViewData.fileStatus == '1'"
                                size="mini"
                                style="color:#001450"
                                v-has="PES_service_editor"
                                v-show="serviceTableEditable(row)"
                                v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                                @click="editRow(row, index)"
                              >
                                编辑
                              </el-button>
                              <el-button v-if="row.status == 2 || row.status == 1 || row.status == 4" size="small" :disabled="!row.queryWorkOrderFlag" @click="detail(row)">
                                详情
                              </el-button>
                              <el-button
                                type="text"
                                size="mini"
                                :disabled="overViewData.fileStatus == '1'"
                                style="color:#909399"
                                v-has="PES_service_cancel"
                                v-show="servcieTableBtnPermission(0, row)"
                                v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                                @click="cancelSingleRow(row)"
                              >
                                取消
                              </el-button>
                              <el-button
                                type="text"
                                size="mini"
                                :disabled="overViewData.fileStatus == '1'"
                                style="color:#001450;margin-left:0"
                                v-has="PES_service_cancel"
                                v-show="servcieTableBtnPermission(1, row)"
                                v-if="overViewData.distributorCompanyId == $userInfo.orgInfo.companyId"
                                @click="
                                  operationSingleRow(row, 0);
                                  $gio.PES_service_cancel();
                                "
                              >
                                恢复
                              </el-button>
                              <el-button type="text" size="mini" style="color:#B3B3B3;margin-left:0" disabled v-show="servcieTableBtnPermission(2, row) && !row.workOrderNumber">无法编辑</el-button>
                              <el-button type="text" size="mini" style="color:#B3B3B3;margin-left:0" disabled v-show="servcieTableBtnPermission(3, row)">由美孚修改，无法编辑</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-pagination
                          layout="total, sizes, prev, pager, next, jumper"
                          :page-sizes="[10, 20]"
                          :current-page="item.current"
                          :page-size="item.size"
                          :total="item.serviceItemCount"
                          @size-change="val => handleSizeChangeService(item, index, val)"
                          @current-change="val => handleCurrentChangeService(item, index, val)"
                          style="position:static;background:#fff;z-index:5;margin:10px 0;text-align:right;"
                        >
                        </el-pagination>
                      </div>
                    </div>
                  </div>
                </div>
                <OperationDrawer
                  :serviceDrawerVisible.sync="serviceDrawerVisible"
                  :planList="planList"
                  :overViewData="overViewData"
                  v-bind="serviceDrawerOpTypeParams"
                  :pesInfo="pesInfo"
                  v-if="serviceDrawerVisible && pesInfo"
                />
              </div>
            </el-main>
          </el-container>
        </div>
      </div>
      <div v-else>
        <div class="empty-pes" :style="mainminheight">
          <img style="width:160px;height:160px" src="../../../assets/pes_empty.png" alt="" />
          <span style="font-size:13px;color:#999">
            暂无服务档案
            <!-- PES_archive_create -->
            <!-- v-if="jurisdictionBtn && !(overViewData.daFlag == '1' && $userInfo.userType == 1) && overViewData.distributorCompanyId == $userInfo.orgInfo.companyId" -->
            <template>
              <span
                style="font-size:13px;color:#d10000;cursor:pointer"
                @click="addArchives"
                v-if="jurisdictionBtn && ($userInfo.userType == 0 || ($userInfo.userType == 1 && !isDaFlag))"
                >点击新建</span
              >
            </template>
          </span>
        </div>
      </div>
      <!-- 新建弹框 -->
      <el-dialog
        :title="archivesDialogType == 'add' ? '新建档案' : '编辑档案'"
        :visible="addDialogFlag"
        width="30%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="cancelAdd"
        top="5vh"
        :append-to-body="true"
      >
        <div style="margin-bottom:10px" v-if="archivesDialogType == 'add'">请填写年度档案信息：</div>
        <el-form ref="setPesForm" :model="setPesForm" label-width="80px" label-position="top" :rules="rules">
          <el-form-item prop="year" label="年度">
            <el-select v-model="setPesForm.year" size="small" :disabled="archivesDialogType == 'edit'" clearable placeholder="请选择" style="width:60%">
              <el-option v-for="item in dateList" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="assistSpList" label="协助经销商">
            <el-select
              v-model="setPesForm.assistSpList"
              size="small"
              :disabled="
                archivesDialogType == 'edit' || ((SPList.length > 1 || SPList.length == 1) && $userInfo.userType == 1) || isDaFlag || (SPList.length == 1 && $userInfo.userType == 0)
              "
              clearable
              placeholder="请选择"
              style="width:60%"
            >
              <el-option v-for="item in SPList" :key="item.spId" :label="item.spName" :value="item.spId"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmAdd('setPesForm')" size="small">{{ archivesDialogType == "add" ? "生 成" : "保 存" }}</el-button>
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
      <!-- 删除档案 -->
      <el-dialog title="删除档案" :visible.sync="deleteArchivesFlag" width="30%" :close-on-click-modal="false" :before-close="cancelDelete">
        <div>是否删除该年度档案？删除档案中上传的文件也将被删除，且档案将无法恢复。</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDelete" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmDelete" size="small">删 除</el-button>
        </span>
      </el-dialog>
      <!-- 删除文件 -->
      <el-dialog title="删除文件" :visible.sync="deleteFileFlag" width="30%" :close-on-click-modal="false" :before-close="cancelDeleteFile">
        <div>是否删除该文件？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDeleteFile" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmDeleteFile" size="small">删 除</el-button>
        </span>
      </el-dialog>
      <!-- 取消服务项 弹框 -->
      <el-dialog title="取消服务项" :visible.sync="cancelServiceDialog" width="30%" :close-on-click-modal="false" :before-close="cancelServiceReason">
        <el-form :model="addPlanForm" :rules="addPlanRules" ref="addOilRef" class="demo-ruleForm" label-width="100px" label-position="top">
          <el-form-item prop="reason" label="原因">
            <el-input type="textarea" :rows="15" resize="none" show-word-limit v-model="addPlanForm.reason" style="width: 100%" size="small" placeholder="请输入" clearable maxlength="200"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelServiceReason" size="small">取 消</el-button>
          <el-button type="danger" @click="completeReason('addOilRef')" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 关联工单 -->
    <ContactWorkorder
      v-if="contactWorkorderDialogFlag"
      :contactWorkorderDialogFlag="contactWorkorderDialogFlag"
      :dialogType="contactDailogType"
      :pesId="selectPesId"
      :planList="planList"
      :companyIds="overViewData.customerCompanyId"
      :serviceCompanyId="overViewData.serviceCompanyId"
      :relatedWorkOrdersYear="selectedYear"
      :spId="overViewData.assistSpIds"
      @handleSubmitBack="handleSubmitBack"
    />
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import ContactWorkorder from "../component/contactWorkorder.vue";
import { clearState, getServiceTableData, getEditServiceChargetUserList, getEditServiceTypeTree, editServcieSingle } from "../api/serviceBatchOperationApi";
import { archivesData } from "./data_config";
export default {
  mixins: [archivesData],
  components: {
    ContactWorkorder,
    OperationDrawer: () => import("../component/serviceBatchOperationDrawer.vue")
  },
  provide() {
    return {
      SERVICEVM: this
    };
  },
  data() {
    return {
      contactDailogType: "plan",
      contactWorkorderDialogFlag: false,
      filterForm: {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: ""
      },
      valueCheckBoxList: [], // 换油情况选择内容
      mainminheight: `height:${document.documentElement.clientHeight - 210}px`,
      // uploadUrl: `${process.env.api}/weChat/workOrder/service/report/upload`,
      uploadUrl: "",
      yearValue: "",
      planIndex: "",
      dialogOilChangeVisible: false,
      planType: "add", // 计划目标类型
      cancelServiceDialog: false, // 计划目标弹框 显隐
      addPlanForm: {
        // 计划目标 表单
        reason: ""
      },
      selectRow: {}, // 选中的某个取消数据
      pagenation: {
        size: 10,
        current: 1
      },
      addPlanRules: {
        reason: [{ required: true, message: "请输入取消原因", trigger: "blur" }]
      },
      serviceTableData: [],
      serviceTableLoading: false,
      serviceTableDataPageInfo: {
        size: 30,
        current: 1
      },
      serviceTableTotal: 0,
      serviceTableSelectedData: null,
      serviceDrawerVisible: false,
      serviceDrawerOpTypeParamsMap: {
        0: {
          serviceDrawerType: 0,
          serviceDrawerTitle: "批量取消服务项",
          selectedData: null
        },
        1: {
          serviceDrawerType: 1,
          serviceDrawerTitle: "添加服务项"
        },
        2: {
          serviceDrawerType: 2,
          serviceDrawerTitle: "批量编辑服务项",
          selectedData: null
        }
      },
      serviceDrawerOpTypeParams: null,
      makeOrEditPlanReportFlag: "", // 服务进度页面，已发布计划书的展示 编辑计划书   其他状态展示 制作计划书
      tableHeight: "",
      yearList: [],
      selectedYear: "",
      leftDisabled: false,
      rightDisabled: false,
      reverse: false,
      loadingWorkshop: false,
      loadMoreWorkshopFlag: false,
      overViewData: {},
      activeType: "overview",
      // PES档案文件
      // 弹框
      addDialogFlag: false,
      setPesForm: {
        year: "",
        assistSpList: ""
      },
      setPesForm_promote: {
        year: "",
        workshopSelect: [],
        workshopId: []
      },
      workshopList: [],
      workshopCurrent: 1,
      workshopTotal: 0,
      workshopSelectList: [],
      archivesDialogType: "",
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        assistSpList: [{ required: true, message: "请选择协助经销商", trigger: "change" }]
      },
      // 表单验证
      ruleForm: {
        name: "",
        number: "",
        scale: "",
        industry: "",
        dealer: "",
        shortName: "",
        province: "",
        city: "",
        address: "",
        phone: "",
        status: "",
        nowDate: "",
        spFlag: 0
      },
      dateList: [],
      uploadList: [],
      selectPesId: "",
      yearCurrent: 1,
      queryCompanyNumber: "",
      jurisdictionBtn: false,
      selectedYearItem: "",
      defaultServiceFileYear: "", // 默认打开当年最新一份档案，若无当年档案，则默认打开最大一年最新一份档案：
      companyType: "",
      companyId: "",
      deleteCode: false,
      deleteArchivesFlag: false,
      planReportInfoDto: [], // 计划书
      goalAchieveList: [], //  目标实现
      benefitSummaryDto: [], // 效益总结
      benefitSummaryDtoUpload: [],
      yearReportInfoDtoUpload: [],
      planReportInfoDtoUpload: [],
      yearReportInfoDto: [], // 年度总结
      deleteFileFlag: false,
      deleteItemId: "",
      checkWorkshopList: [],
      rawSelList: [],
      screenWidth: null,
      sopFileRow: "",
      firstSetPesVisiable: false,
      setPesVisiable: false,
      yearListData: [],
      yearListData: [],
      completeable: false,
      planList: [], // 计划目标的数据
      createdWorkOrderRow: {},
      filterChargeUserList: [],
      filterServiceTypeTree: [],
      cardLoading: false,
      archiveRestartBtn: false, // 重新编辑档案 按钮权限
      saveResource: "",
      queryParams: {},
      reportTypeSelect: "", // 选择的服务项所属 reportType
      oilChangefieldOption: [],
      SPList: [],
      pesInfo: null,
      isDaFlag:false
    };
  },
  watch: {
    overViewData(val) {
      // this.checkCompleteable();
    }
  },
  beforeRouteLeave(to, from, next) {
    sessionStorage.setItem("queryParams", JSON.stringify(this.selectedYearItem));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/NewWorkOrderList/newWorkOrderDetail" || from.path == "/NewWorkOrderList/newWorkorderTaskDetail" || from.path == "/NewWorkOrderList/newWorkOrderOilDetail") {
      // this.activeType= "service"
      to.params.activeType = "service";
    }
    if (from.path == "/CustomerProfile/servicePlan" || from.path == "/CustomerProfile/serviceSummary" || from.path == "/CustomerProfile/serviceBenefitSummary") {
      //
      to.params.activeType = "archives";
      to.params.isSaveQuery = true;
    }
    next();
  },

  created() {
    this.tableHeight = document.documentElement.clientHeight - 200;
    this.companyType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType;
    this.queryCompanyNumber = this.$route.query.companyNumber ? this.$route.query.companyNumber : JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).orgInfo.companyNumber;
    this.companyId = this.$route.query.companyId ? this.$route.query.companyId : JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).orgInfo.companyId;
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "PES_archive_create") {
        this.jurisdictionBtn = true;
      }
      if (buttonList[i].menuCode == "PES_archive_restart") {
        this.archiveRestartBtn = true;
      }
      if (buttonList[i].menuCode == "PES_archive_delete") {
        this.deleteCode = true;
      }
    }
    if (this.$route.params.isSaveQuery) {
      this.queryParams = sessionStorage.getItem("queryParams") ? JSON.parse(sessionStorage.getItem("queryParams")) : {};
      if (this.queryParams.pesInfoId || this.queryParams.id) {
        this.saveResource = "report";
        this.$route.query.resurce = "";
      }
    }
    if(this.$route.query.isDaFlag){
      this.isDaFlag = this.$route.query.isDaFlag=='true'
    }
    if (this.$route.params && this.$route.params.activeType) {
      this.leftList.forEach((item, idx) => {
        if (item.type == this.$route.params.activeType) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      this.activeType = this.$route.params.activeType;
    }
    this.getYearList(); // 获取年份list
    this.selectPesId = this.$route.query.pesInfoId;
    this.getYearSelectData(); // 获取新建年份下拉数据源
    this.getSpList(this.$route.query.companyId);
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  methods: {
    async getSpList(val) {
      if (!val) return (this.SPList = []);
      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: val
      });
      this.SPList = res.data.data;
      if (!this.SPList.length) return (this.setPesForm.assistSpList = "");
      if (this.SPList.length == 1) {
        this.setPesForm.assistSpList = this.SPList[0].spId;
      }
      if (this.SPList.length > 1 && this.$userInfo.userType == 1) {
        //经销商为客户创建计划工程服务档案是dpes
        this.setPesForm.assistSpList = this.$userInfo.orgInfo.companyId;
      }
    },
    handleSubmitBack() {
      this.queryPlanReport();
    },
    relateWorkorder() {
      this.contactWorkorderDialogFlag = true;
    },
    // 选择计划目标，页面滚动到对应计划目标位置
    planClick(val) {
      // 查找选中的计划目标的下标
      let index = this.planList.findIndex(item => item.id == val);
      let str = ("li" + index).toString();
      let target = document.getElementById(str);
      let parent = document.querySelector("ul");
      window.scrollTo(top, target.offsetTop, parent.offsetTop);
      this.$nextTick(() => {
        this.$refs.returnTop.scrollTop = target.offsetTop - parent.offsetTop - 200;
      });
    },
    // 编辑单个服务项
    editRow(row, index) {
      let str = "serviceTable" + index;
      this.$nextTick(() => {
        this.$refs[str][0].toggleRowSelection(row, true);
      });

      this.opService(2, cloneDeep(row));
    },
    hideOperation() {
      return this.companyType == 1 && this.overViewData.serviceCompanyType == 0 ? false : true;
    },
    async completePes() {
      this.$gio.clickCompleteArchiveButton({ customer: this.overViewData.customerCompanyName });
      this.FULLSCREENLOADING("加载中...");
      const comoeleteFlag = await this.checkCompleteable();
      this.FULLSCREENENDLOADING();
      if (!comoeleteFlag) {
        return this.$alert("无法完结，请完结所有服务项，确认计划书，发布年度总结后尝试", "完结提示", {
          confirmButtonText: "知道了"
        });
      } else {
        return this.$alert("完结后，系统将归档当前的年度档案，您无法编辑", "完结提示", {
          confirmButtonText: "知道了",
          callback: action => {
            this.finishPes();
          }
        });
      }
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
      if (val[val.length - 1] != "0") {
        // 有正常得选项
        let index = val.findIndex(it => it == "0");
        if (index > -1) {
          val.splice(index, 1);
          this.valueCheckBoxList = val;
        }
      }
      this.resultBox = this.valueCheckBoxList.find(item => {
        return item == 1 || item == 2 || item == 3 || item == 4;
      });
    },
    async finishPes() {
      this.FULLSCREENLOADING("请稍后...");
      const res = await this.requestMethodGetTip("/pes/completePesFile", {
        year: this.selectedYearItem.year,
        pesId: this.selectPesId,
        customerId: this.$route.query.companyId,
        serviceCompanyType: this.overViewData.serviceCompanyType
      });
      if (res.data.code == 1000) {
        await this.getTotalView();
      }
      this.FULLSCREENENDLOADING();
    },
    async checkCompleteable() {
      const res = await this.requestMethodGet("/pes/completePesFileFlag", {
        pesId: this.selectPesId
      });
      this.completeable = res.data.data;
      return res.data.data;
    },
    //   上传文件
    handleReportChange(file, fileList) {
      if (!file.raw.type.startsWith("application")) {
        fileList.pop();
        this.$message.error("只能上传pdf / word / excel / ppt 类型文件");
        return;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "请选择100M以内的文件"
        });
        return;
      }
      this.sopFileRow = file.raw;
    },
    previewFileOpen(row, reportType) {
      this.$gio.previewArchiveReport({ reportType: reportType, customer: this.overViewData.customerCompanyName });
      if (!row.fileUrlForOpen) {
        return;
      }
      window.open(row.fileUrlForOpen, "_blank ");
    },
    rowKey(row) {
      return row.workshopId;
    },
    // 选择车间
    handleSelectWorkshop(rows, row) {
      let list = [];
      if (rows.length) {
        rows.forEach(item => {
          list.push(item.workshopId);
        });
      } else {
        list = [];
      }
      this.setPesForm.workshopId = list;
    },
    // 取消单个服务项
    cancelSingleRow(row) {
      this.cancelServiceDialog = true;
      this.selectRow = row;
    },
    // 取消单个服务项 填 取消原因的弹框取消按钮事件
    cancelServiceReason() {
      this.$nextTick(() => {
        this.$refs["addOilRef"].resetFields();
      });

      this.cancelServiceDialog = false;
    },
    // 取消原因点击确定
    completeReason(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            id: this.selectRow.id,
            status: 3,
            reason: this.addPlanForm.reason
          };
          const res = await editServcieSingle(params);
          if (res.data.data) {
            this.cancelServiceDialog = false;
            this.$refs[formName].resetFields();
            this.queryPlanReport(); // 获取服务进度
          }
          this.$gio.PES_service_cancel({ customer: this.overViewData.customerCompanyName });
        }
      });
    },
    // 全选车间
    selectAllWorkshop(val) {
      let list = [];
      if (val.length) {
        val.forEach(item => {
          if (!item.disabled) {
            list.push(item.workshopId);
          }
        });
      } else {
        list = [];
      }
      this.setPesForm.workshopId = list;
    },

    // 编辑回显不可编辑
    selectTableList(row, index) {
      if (row.disabled) {
        return false;
      } else {
        return true;
      }
    },
    // 删除档案
    deleteArchives() {
      this.deleteArchivesFlag = true;
      this.$gio.clickDeleteArchiveButton({ customer: this.overViewData.customerCompanyName });
    },
    cancelDelete() {
      this.deleteArchivesFlag = false;
    },
    // 确定删除
    confirmDelete() {
      this.requestMethodGet("/pes/deletePesInfo", {
        pesId: this.selectPesId,
        serviceCompanyType: this.overViewData.serviceCompanyType,
        customerId: this.$route.query.companyId,
        year: this.selectedYearItem.year
      }).then(res => {
        if (res.data.code == 1000) {
          this.cancelDelete();
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getYearList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
      this.$gio.submitDeleteArchive({ customer: this.overViewData.customerCompanyName });
      this.$gio.deleteArchiveReport({ customer: this.overViewData.customerCompanyName });
    },
    // 所属车间改变
    workshopChange(val) {
      if (this.archivesDialogType == "edit" && val > 0) {
        this.editForView();
      } else {
        this.setPesForm.workshopId = [];
      }
    },
    // 编辑回显
    editForView() {
      this.requestMethodGet("/pes/getPesWorkshopForEdit", { pesId: this.selectPesId }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          const checkList = data.workshopDtoList;
          const list = this.workshopList;
          let idArr = [];
          if (checkList && checkList.length) {
            checkList.forEach(it => {
              idArr.push(it.workshopId);
              list.forEach(item => {
                if (it.workshopId == item.workshopId) {
                  this.$refs.workshopRef.toggleRowSelection(item);
                }
                if (!it.cancelFlag && it.workshopId == item.workshopId) {
                  // 不可编辑
                  item.disabled = true;
                }
              });
            });
          }
          this.workshopList = list;
          this.checkWorkshopList = checkList;
          this.setPesForm.workshopId = idArr;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 重新编辑档案
    editArchivesAgain() {
      this.$confirm("您将重新编辑档案，档案将变成“进行中状态”", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestMethodGet("/pes/reEditPesFile", {
            pesId: this.selectPesId
          }).then(res => {
            if (res.data.code == 1000) {
              this.getTotalView();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    resetFilterForm() {
      this.filterForm = {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: ""
      };
    },
    drawerCallRefreshTable() {
      this.queryPlanReport(); // 获取服务进度
      this.resetFilterForm();
      this.getFilterSourceData();
      this.serviceTableSelectedData = null;
    },
    refreshServiceTableData(params, retainCurrentPage = false) {
      this.serviceTableDataPageInfo = {
        size: 30,
        current: 1
      };
      this.serviceTableSelectedData = null;
      this.getServiceTableData(params);
    },

    handleSizeChange(size) {
      this.serviceTableSelectedData = null;
      this.serviceTableDataPageInfo.size = size;
      this.getServiceTableData(this.filterForm);
    },
    handleCurrentChange(current) {
      this.serviceTableSelectedData = null;
      this.serviceTableDataPageInfo.current = current;
      this.getServiceTableData(this.filterForm);
    },
    switchServiceTableLoading(show) {
      this.serviceTableLoading = show;
    },
    // 开单
    workOrder(row) {
      this.createdWorkOrderRow = row;
      if (row.reportType == 11) {
        this.dialogOilChangeVisible = true;
        this.getOilChangeStatus();
      } else {
        this.createWorkOrder(row);
      }
      this.$gio.PES_service_billing({ customer: this.overViewData.customerCompanyName });
    },
    // 取消选择换油情况
    consoleOilChange() {
      this.dialogOilChangeVisible = false;
    },
    // 确认继续
    confirmContiun() {
      if (this.valueCheckBoxList.length > 0) {
        this.consoleOilChange();
        this.createWorkOrder(this.createdWorkOrderRow);
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
    createWorkOrder(row) {
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
            row.companyNumber = this.overViewData.customerCompanyNumber;
            row.companyName = this.overViewData.customerCompanyName;
            row.companyId = this.overViewData.customerCompanyId;
            if (row.serviceType == 1) {
              this.$router.push({
                path: "/NewWorkOrderList/AddWorkOrderOil",
                query: {
                  openOrderType: "pesPlan",
                  serviceType: row.serviceType,
                  serviceLevel: row.serviceLevel,
                  mslaServiceType: row.mslaServiceType,
                  serviceNumber: row.serviceNumber,
                  typeName: row.serviceName,
                  applylistParams: JSON.stringify(row),
                  pesServiceItemId: row.id,
                  workshopId: row.workshopId,
                  servicePackFlag: "PES",
                  spId: this.overViewData.assistSpIds,
                  reportType: row.reportType
                }
              });
            } else {
              const params = {
                openOrderType: "pesPlan",
                serviceNumber: row.serviceNumber,
                addServiceType: row.serviceType,
                serviceId: row.serviceId,
                typeName: row.serviceName,
                applylistParams: JSON.stringify(row),
                pesServiceItemId: row.id,
                workshopId: row.workshopId,
                servicePackFlag: "PES",
                reportType: row.reportType,
                paramDataLubFlag: row.paramDataLubFlag,
                coreDataLubFlag: row.coreDataLubFlag,
                spId: this.overViewData.assistSpIds,
                coreDataTemplateId: row.coreDataTemplateId
              };
              if (this.createdWorkOrderRow.reportType == 11) {
                params.changeOil = this.valueCheckBoxList.toString();
              }
              console.log("params12345", params);
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
    async operationSingleRow(row, opType) {
      const params = {
        id: row.id,
        status: opType
      };
      const res = await editServcieSingle(params);
      this.queryPlanReport();
      this.resetFilterForm();
    },
    opService(type, selectedDataSingleRow) {
      // type ： 0 - 批量取消 1 - 添加服务项 2 - 批量编辑
      const params = cloneDeep(this.serviceDrawerOpTypeParamsMap[type]);
      if (type != 1) {
        params.selectedData = this.handleMergeSelectedTableData(selectedDataSingleRow);
      }
      this.serviceDrawerOpTypeParams = params;

      this.serviceDrawerVisible = true;
    },
    handleMergeSelectedTableData(selectedDataSingleRow) {
      if (!selectedDataSingleRow && !this.serviceTableSelectedData) return null;
      if (this.serviceTableSelectedData && this.serviceTableSelectedData.length == 0) {
        this.serviceTableSelectedData = null;
      }
      if (this.serviceTableSelectedData == null || this.serviceTableSelectedData.length == 0) {
        return [selectedDataSingleRow];
      }
      const curSelTableData = cloneDeep(this.serviceTableSelectedData);
      if (!selectedDataSingleRow) return curSelTableData;

      const exist = curSelTableData.some(row => row.id == selectedDataSingleRow.id);
      if (!exist) {
        curSelTableData.push(selectedDataSingleRow);
        this.serviceTableSelectedData.push(selectedDataSingleRow);
      }
      return curSelTableData;
    },
    servcieTableBtnPermission(judgeType, item) {
      // judgeType 0 取消 1 恢复 2 无法编辑 3 - 由美孚修改无法编辑
      if (judgeType == 0) {
        return item.status == 0 && item.editFlag;
      } else if (judgeType == 1) {
        return item.status == 3 && item.editFlag;
      } else if (judgeType == 2) {
        return (item.status == 1 || item.status == 2 || item.status == 4) && item.editFlag;
      } else if (judgeType == 3) {
        return !item.editFlag && this.companyType == "1";
      }
    },
    serviceTableEditable(row) {
      return !this.servcieTableBtnPermission(2, row) && !this.servcieTableBtnPermission(3, row) && !this.servcieTableBtnPermission(1, row);
    },
    async getFilterSourceData() {
      const params = {
        pesId: this.overViewData.pesInfoId
      };
      const chargeUserList = await getEditServiceChargetUserList(params);
      const configTree = await getEditServiceTypeTree(params);
      this.filterChargeUserList = chargeUserList.data.data.filter(item => item);
      this.filterServiceTypeTree = configTree;
    },
    async getServiceTableData(receiveFilterParams, retainCurrentPage = false) {
      this.switchServiceTableLoading(true);
      if (!receiveFilterParams && !retainCurrentPage) {
        await this.getFilterSourceData();
      }
      const params = {
        pesId: this.overViewData.pesInfoId,
        ...this.serviceTableDataPageInfo
      };
      if (receiveFilterParams) {
        Object.entries(receiveFilterParams).forEach(([key, val]) => {
          if (!val) return;
          if (key == "planStartTime") {
            params[key] = this.moment(val).format("YYYY-MM-DD");
          } else {
            params[key] = val;
          }
        });
      }
      try {
        const res = await getServiceTableData(params);
        const { list, total } = res;
        this.serviceTableData = list || [];
        this.serviceTableTotal = total || 0;
      } finally {
        this.switchServiceTableLoading(false);
      }
    },
    selectTableData(selection) {
      this.serviceTableSelectedData = [];
      this.planList.forEach((it, index) => {
        this.$nextTick(() => {
          if (this.$refs["serviceTable" + index][0].selection && this.$refs["serviceTable" + index][0].selection.length > 0) {
            this.serviceTableSelectedData = this.serviceTableSelectedData.concat(this.$refs["serviceTable" + index][0].selection);
          }
          // if(this.serviceTableSelectedData && this.serviceTableSelectedData.length == 0) {
          //   this.serviceTableSelectedData = null
          // }
        });
      });
    },

    // 编辑档案
    editArchives() {
      // 获取弹框数据，打开弹框
      this.requestMethodGet("/pes/getPesWorkshopForEdit", { pesId: this.selectPesId }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.setPesForm.year = data.year;
          const checkList = data.workshopDtoList;
          const list = this.workshopList;
          let idArr = [];
          if (checkList && checkList.length) {
            checkList.forEach(it => {
              idArr.push(it.workshopId);
              list.forEach(item => {
                if (!it.cancelFlag && it.workshopId == item.workshopId) {
                  // 不可编辑
                  item.disabled = true;
                }
              });
            });
          }
          this.workshopSelectList = data.selectWorkshopList;
          this.rawSelList = JSON.parse(JSON.stringify(data.workshopDtoList.map(item => item.workshopId)));
          this.checkWorkshopList = checkList;
          this.addDialogFlag = true;
          if (list && list.length) {
            if (checkList && checkList.length) {
              checkList.forEach(it => {
                list.forEach(item => {
                  if (it.workshopId == item.workshopId) {
                    setTimeout(() => {
                      this.$refs.workshopRef.toggleRowSelection(item);
                    }, 800);
                  }
                });
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
      this.$gio.clickEditArchiveButton({ customer: this.overViewData.customerCompanyName });
    },
    clearWorkshop() {
      this.workshopSelectList.forEach(it => {
        it.disabled = false;
      });
    },
    getYearSelectData() {
      const params = {
        companyNumber: this.queryCompanyNumber
      };
      this.requestMethodGet("/pes/queryYearsForAddPes", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data || [];
          if (list.length > 0) {
            list.forEach(item => {
              item.label = item.year;
              item.value = item.year;
              item.disabled = !item.addFlag;
            });
          }
          this.dateList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getYearList(val) {
      const params = {
        companyNumber: this.queryCompanyNumber,
        size: 300,
        current: this.yearCurrent
      };
      this.requestMethodGet("/pes/queryYears", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.yearList = list;
          this.yearTotal = res.data.data.totalCount;
   
          if (list.length > 0) {
       
            if (this.saveResource == "report") {

              this.selectedYear = this.queryParams.year;
              this.selectPesId = this.queryParams.pesInfoId || this.queryParams.id;
              this.selectedYearItem = this.queryParams;
              this.yearValue = this.queryParams.pesInfoId || this.queryParams.id; // 给档案年度重新赋值
              this.getTotalView();

              const param = {
                pesInfoId: this.selectPesId
              };
              this.refreshServiceTableData(param);

              if (!(this.$route.query.resource && this.$route.query.resource == "plan")) {
                this.resetLeft();
              }
              return;
            }
            if ((this.$route.query.resurce != "list" && this.$route.query.resurce != "workOrder") || val == "addPes") {

              let obj = null
              if(this.$route.query.pageFrom == 'msgCenter' && this.$route.query.pesInfoId){
                obj = list.filter(item => item.id == this.$route.query.pesInfoId);
              }else{
                obj= list.filter(item => item.defaultFlag);
              }
    
              this.yearValue = obj[0].id; // 给档案年度重新赋值
              this.selectedYear = obj[0].year;
              this.selectPesId = obj[0].id;
              this.selectedYearItem = obj[0];
            } else if (this.saveResource != "report") {
              let obj = list.filter(item => item.id == this.$route.query.pesInfoId);
              if (obj && obj.length == 0) {
                obj = list.filter(item => item.defaultFlag);
              }

              this.yearValue = obj[0].id; // 给档案年度重新赋值
              this.selectedYear = obj[0].year;
              this.selectPesId = obj[0].id;
              this.selectedYearItem = obj[0];
            }

            this.getTotalView();

            const param = {
              pesInfoId: this.selectPesId
            };
            this.refreshServiceTableData(param);

            if (!(this.$route.query.resource && this.$route.query.resource == "plan")) {
              this.resetLeft();
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
    handleSizeChangeService(item, index, size) {
      item.size = size;
      const params = {
        pesItems: item.pesItems,
        size: item.size,
        current: item.current
      };
      this.requestMethodGet("/pes/report/queryServiceItemOfPlan", params).then(res => {
        if (res.data.code == 1000) {
          item.itemDtoList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleCurrentChangeService(item, index, current) {
      item.current = current;
      const params = {
        pesItems: item.pesItems,
        size: item.size,
        current: item.current
      };
      this.requestMethodGet("/pes/report/queryServiceItemOfPlan", params).then(res => {
        if (res.data.code == 1000) {
          item.itemDtoList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 获取服务进度
    queryPlanReport() {
      this.cardLoading = true;
      const params = {
        pesInfoId: this.selectPesId,
        pageFlag: true
      };
      this.requestMethodGet("/pes/report/queryPlanAndServiceItem", params).then(res => {
        if (res.data.code == 1000) {
          this.makeOrEditPlanReportFlag = res.data.data.makeOrEditPlanReportFlag;
          this.pesInfo = res.data.data;
          let list = res.data.data.list;
          if (list && list.length > 0) {
            list.forEach(item => {
              item.size = 10;
              item.current = 1;
            });
            this.planList = list;
          } else {
            this.planList = [];
          }
          this.cardLoading = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
          this.cardLoading = false;
        }
      });
    },
    // 取消创建
    cancelAdd() {
      this.addDialogFlag = false;
      this.setPesForm.year = "";
      this.setPesForm.assistSpList = "";
      this.getSpList(this.$route.query.companyId);
    },
    // 确定创建
    confirmAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.archivesDialogType == "add") {
            const params = {
              companyNumber: this.queryCompanyNumber,
              year: this.setPesForm.year,
              assistSpList: [this.setPesForm.assistSpList]
            };
            if (this.SPList.length == 1) {
              params.assistSpList = [this.SPList[0].spId];
            }
            this.requestMethodPost("/pes/addPesInfo", params).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  message: "生成成功",
                  type: "success"
                });
                this.cancelAdd();
                this.getYearSelectData();
                this.getYearList("addPes");
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
          } else {
            this.saveEdit();
          }
        } else {
          return false;
        }
      });
      if (this.archivesDialogType == "add") {
        this.$gio.generatePESArchive({ customer: this.overViewData.customerCompanyName });
      } else {
        this.$gio.submitEditArchive({ customer: this.overViewData.customerCompanyName });
      }
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
      } else if (row.serviceType == 9 || row.serviceType == 10 || row.serviceType == 11) {
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
      this.$gio.toWorkorderDetails({
        workorderNumber: row.workOrderNumber,
        entrance: "计划工程服务服务项"
      });
    },
    // 编辑档案保存
    saveEdit() {
      const params = {
        pesId: this.selectPesId
      };
      this.requestMethodPost("/pes/editPesWorkshop", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.cancelAdd();
          this.getYearSelectData();
          this.getTotalView();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.$gio.RestartArchive({ customer: this.overViewData.customerCompanyName });
      });
    },
    // 年份点击
    async yearClick(item) {
      this.FULLSCREENLOADING("加载中...");
      if (item) {
        this.planIndex = ""; // 切换年度档案，清空原先选择的计划目标
      }
      this.yearList.forEach(it => {
        if (it.id == item) {
          this.selectedYearItem = it;
          this.selectedYear = it.year;
          this.selectPesId = it.id;
        }
      });
      this.resetLeft();
      await this.getTotalView();
      this.FULLSCREENENDLOADING();
      this.$gio.changeArchiveYear({ operation: "提交切换", customer: this.overViewData.customerCompanyName });
    },
    resetLeft() {
      this.leftList.forEach((item, idx) => {
        if (item.type == "overview") {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      this.activeType = "overview";
    },
    // 删除计划书
    deletePlan() {
      this.$confirm("删除后您将无法恢复数据，是否继续？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changePlan("delete", "plan");
        })
        .catch(() => {});
    },
    // 删除效益总结
    deleteBenefitSummary() {
      this.$confirm("删除后您将无法恢复数据，是否继续？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeBenefitSummary("delete");
        })
        .catch(() => {});
    },
    // 再次发布效益总结
    rePublishBenefitSummary() {
      this.$confirm("您将更新效益总结报告，否则客户无法继续查看，是否继续？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeBenefitSummary("re_publish");
        })
        .catch(() => {});
    },
    // 更改状态
    changeBenefitSummary(val) {
      let params = {
        operateCode: val,
        id: this.benefitSummaryDto[0].reportId
      };
      this.requestMethodPost("/pes/report/xyzj/updateStatus", params).then(res => {
        if (res.data.code == 1000) {
          this.itemClick({ _uid: 1 });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 删除年度总结
    deleteSummary() {
      this.$confirm("删除后您将无法恢复数据，是否继续？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changePlan("delete", "Summary");
        })
        .catch(() => {});
    },
    // 确认计划书
    surePlan() {
      this.$confirm("确认后您将无法修改计划书，是否继续？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changePlan("confirm", "plan");
          this.$gio.confiemProspectus({ operation: "弹窗中点击确认", customer: this.overViewData.customerCompanyName });
        })
        .catch(() => {
          this.$gio.confiemProspectus({ operation: "弹窗中点击取消", customer: this.overViewData.customerCompanyName });
        });
      this.$gio.confiemProspectus({ operation: "点击确认按钮", customer: this.overViewData.customerCompanyName });
    },
    // 编辑计划书 / 制作计划书
    editPlan() {
      let status = "";
      let reportId = "";
      if (this.planReportInfoDto.length) {
        status = this.planReportInfoDto[0].status;
        reportId = this.planReportInfoDto[0].reportId;
      }
      this.$router.push({
        path: "/CustomerProfile/servicePlan",
        query: {
          pesId: this.overViewData.pesInfoId,
          companyNumber: this.queryCompanyNumber,
          companyId: this.companyId,
          statusPlan: status,
          resource: "plan",
          reportId: reportId,
          serviceCompanyType: this.overViewData.serviceCompanyType,
          pesFlag: this.overViewData.pesFlag
        }
      });
      this.pushPlan();
      this.$gio.clickCreateArchiveReportButton({ reportType: "计划书", customer: this.overViewData.customerCompanyName });
    },
    pushPlan() {
      let status = "";
      let reportId = "";
      if (this.planReportInfoDto.length) {
        status = this.planReportInfoDto[0].status;
        reportId = this.planReportInfoDto[0].reportId;
      }
      this.$router.push({
        path: "/CustomerProfile/servicePlan",
        query: {
          pesId: this.overViewData.pesInfoId,
          companyNumber: this.queryCompanyNumber,
          companyId: this.companyId,
          statusPlan: status,
          resource: "plan",
          reportId: reportId,
          serviceCompanyType: this.overViewData.serviceCompanyType,
          pesFlag: this.overViewData.pesFlag
        }
      });
    },
    // 制作效益总结报告
    editBenefitSummary(type) {
      let status = "";
      let reportId = "";
      if (this.benefitSummaryDto.length && type == "edit") {
        status = this.benefitSummaryDto[0].status;
        reportId = this.benefitSummaryDto[0].reportId;
      }
      this.$router.push({
        path: "/CustomerProfile/serviceBenefitSummary",
        query: {
          reportId: reportId,
          summaryStatus: status,
          companyNumber: this.queryCompanyNumber,
          companyName: this.overViewData.customerCompanyName,
          companyId: this.companyId,
          pesId: this.overViewData.pesInfoId,
          companyId: this.companyId,
          pesFlag: this.overViewData.pesFlag,
          customerId: this.$route.query.companyId,
          servicePackageName: this.overViewData.servicePackageName
        }
      });
      this.$gio.clickCreateArchiveReportButton({ reportType: "效益总结", customer: this.overViewData.customerCompanyName });
    },
    // 编辑年度总结
    editSummary() {
      let status = "";
      let reportId = "";
      if (this.yearReportInfoDto.length) {
        status = this.yearReportInfoDto[0].status;
        reportId = this.yearReportInfoDto[0].reportId;
      }
      this.$router.push({
        path: "/CustomerProfile/serviceSummary",
        query: {
          reportId: reportId,
          summaryStatus: status,
          companyNumber: this.queryCompanyNumber,
          companyId: this.companyId,
          pesId: this.overViewData.pesInfoId,
          serviceCompanyType: this.overViewData.serviceCompanyType,
          servicePackageName: this.overViewData.servicePackageName
        }
      });
      this.editSum();
      this.$gio.clickCreateArchiveReportButton({ reportType: "年度总结", customer: this.overViewData.customerCompanyName });
    },
    editSum() {
      let status = "";
      let reportId = "";
      if (this.yearReportInfoDto.length) {
        status = this.yearReportInfoDto[0].status;
        reportId = this.yearReportInfoDto[0].reportId;
      }
      this.$router.push({
        path: "/CustomerProfile/serviceSummary",
        query: {
          reportId: reportId,
          summaryStatus: status,
          companyNumber: this.queryCompanyNumber,
          companyId: this.companyId,
          pesId: this.overViewData.pesInfoId,
          serviceCompanyType: this.overViewData.serviceCompanyType,
          servicePackageName: this.overViewData.servicePackageName
        }
      });
    },
    // 发布效益总结
    publishBenefitSummary() {
      this.changeBenefitSummary("publish");
    },
    // 再次发布计划书
    againPublishPlan() {
      this.$confirm("您将需要更新计划书，否则客户无法继续查看，另外此操作同时将删除年度总结，是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 后续操作
          this.changePlan("re_publish", "plan");
        })
        .catch(() => {});
    },
    // 发布计划书
    publishPlan() {
      this.changePlan("publish", "plan");
    },
    // 发布年度总结
    publishSummary() {
      this.changePlan("publish", "Summary");
    },
    // 再次发布年度总结
    rePublishSummary() {
      this.$confirm("您将更新年度总结报告，否则客户无法继续查看，是否继续？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changePlan("re_publish", "Summary");
        })
        .catch(() => {});
    },
    // 更改状态
    changePlan(val, type) {
      let params = {
        operateCode: val,
        reportId: type == "plan" ? this.planReportInfoDto[0].reportId : this.yearReportInfoDto[0].reportId,
        pesInfoId: this.selectPesId,
        planReportFlag: type == "plan",
        yearReportFlag: type == "Summary"
      };
      this.requestMethodPost("/pes/report/updatePesReportStatus", params).then(res => {
        if (res.data.code == 1000) {
          this.itemClick({ _uid: 1 });
        } else if (res.data.code == 9103) {
          this.$confirm("您确认的计划书未发布成功，请重新发布！", "", {
            confirmButtonText: "取消",
            showCancelButton: false,
            type: "error"
          })
            .then(() => {})
            .catch(() => {});
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 总览
    async getTotalView() {
      await this.requestMethodGet("/pes/queryYearOverview", { pesId: this.selectPesId }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.isDaFlag = data.daFlag
          this.overViewData = data;
          this.overViewData.pesServicePackageStatusDto = data.pesServicePackageStatusDto;
          this.overViewData.trendsList = data.trendsList;
          this.getServiceTableData();
          this.queryPlanReport(); // 获取服务进度
          this.getPESFileList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 总览卡片点击
    overviewCardClick(name) {
      this.leftList.forEach(it => {
        if (it.type == "archives") {
          it.isActive = true;
        } else {
          it.isActive = false;
        }
      });
      this.activeType = "archives";
      this.getPESFileList();
      this.$gio.clickCardOfServicePhase({ cardType: name, customer: this.overViewData.customerCompanyName });
    },
    // 创建服务
    createService() {
      this.$router.push({
        path: "/PESService/editServiceBatch",
        query: {
          pesId: this.selectPesId,
          servicePageType: "add",
          pesFlag: this.overViewData.pesFlag,
          pesFlagCustomer: this.$route.query.pesFlagCustomer,
          serviceCompanyType: this.overViewData.serviceCompanyType,
          distributorCompanyType: this.overViewData.distributorCompanyType,
          companyNumber: this.queryCompanyNumber,
          distributorCompanyId: this.overViewData.distributorCompanyId,
          companyId: this.companyId,
          customerCompanyType: this.$route.query.customerCompanyType
        }
      });
      this.$gio.createPESPackage({ customer: this.overViewData.customerCompanyName });
    },
    // 新建档案
    async addArchives() {
      console.log();
      this.archivesDialogType = "add";
      this.setPesForm.year = "";
      this.FULLSCREENLOADING("请稍后...");
      await this.getYearSelectData();
      this.FULLSCREENENDLOADING();
      this.addDialogFlag = true;
      this.$gio.clickCreateArchiveButton({ customer: this.overViewData.customerCompanyName });
    },
    itemClick(item, router = false) {
      this.leftList.forEach(it => {
        if (it._uid == item._uid) {
          it.isActive = true;
          this.activeType = it.type;
        } else {
          it.isActive = false;
        }
      });
      // if (item._uid == 2 && router) this.toServiceDetailPage();
      this.judgeType(this.activeType);
    },
    judgeType(type) {
      switch (type) {
        case "overview": // 总览
          this.getTotalView();
          break;
        case "archives": // PES档案文件
          this.getPESFileList();
          break;
        case "service": // 服务包
          this.queryPlanReport(); // 获取服务进度
          break;
        default:
          break;
      }
    },
    // 跳转服务包详情
    toServiceDetailPage() {
      const menuList = JSON.parse(sessionStorage.getItem("menuList"));
      let isCustomer = "";
      let servicePack = "";
      menuList.forEach(item => {
        if (item.menuCode == "customer_web") {
          isCustomer = item.menuCode;
        }
        if (item.menuCode == "PESpackage_web") {
          servicePack = item.menuCode;
        }
      });
      if (isCustomer && servicePack) {
        this.$router.push({
          path: "/CustomerProfile/CustomerPesService",
          query: {
            pesId: this.selectPesId,
            companyId: this.companyId,
            customerCompanyType: this.$route.query.customerCompanyType
          }
        });
      } else {
        this.$router.push({
          path: "/PESIndex/serviceDetail",
          query: {
            pesId: this.selectPesId,
            companyId: this.companyId,
            customerCompanyType: this.$route.query.customerCompanyType
          }
        });
      }
    },
    // 查看服务包详情
    toServiceDetail(row) {
      if (!row.queryWorkOrderFlag) {
        return;
      }
      if (row.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 9 || row.serviceType == 10 || row.serviceType == 11) {
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
      this.$gio.viewWorkorder({ customer: this.overViewData.customerCompanyName });
    },
    // PES档案文件
    getPESFileList() {
      this.planReportInfoDto = [];
      this.planReportInfoDtoUpload = [];
      this.yearReportInfoDto = [];
      this.yearReportInfoDtoUpload = [];
      this.benefitSummaryDto = [];
      this.benefitSummaryDtoUpload = [];
      const params = {
        pesId: this.selectPesId
      };
      this.requestMethodGet("/pes/queryStageFileList", params)
        .then(res => {
          if (res.data.code == 1000) {
            // planReportInfoDto  计划书
            // goalAchieveList  目标实现
            // benefitSummaryList 效益总结
            // yearReportInfoDto 年度总结
            const { goalAchieveList, benefitSummaryDto, yearReportInfoDto, planReportInfoDto } = res.data.data;
            this.benefitSummaryDto = this.handleFileData(benefitSummaryDto);
            this.yearReportInfoDto = this.handleFileData(yearReportInfoDto);
            this.planReportInfoDto = this.handleFileData(planReportInfoDto);
            if (this.benefitSummaryDto.length > 0) {
              this.benefitSummaryDto.forEach(item => {
                if (item.flag == 0) {
                  this.benefitSummaryDtoUpload.push(item);
                }
              });
            }
            if (this.yearReportInfoDto.length > 0) {
              this.yearReportInfoDto.forEach(item => {
                if (item.flag == 0) {
                  this.yearReportInfoDtoUpload.push(item);
                }
              });
            }
            if (this.planReportInfoDto.length > 0) {
              this.planReportInfoDto.forEach(item => {
                if (item.flag == 0) {
                  this.planReportInfoDtoUpload.push(item);
                }
              });
            }

            // if (res.data.data.yearReportInfoDto != null) {
            //   this.yearReportInfoDto.push(res.data.data.yearReportInfoDto)
            // }
            // if (res.data.data.benefitSummaryDto != null) {
            //   this.benefitSummaryDto.push(res.data.data.benefitSummaryDto)
            // }
            this.goalAchieveList = this.handleFileData(goalAchieveList);
            // if (res.data.data.planReportInfoDto != null) {
            //   this.planReportInfoDto.push(res.data.data.planReportInfoDto)
            // }
            // loading.close()
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    handleFileData(data) {
      if (!data.length) {
        return [];
      }
      data.forEach(item => {
        if (item.fileUrl) {
          item.fileType = item.fileUrl.split(".")[item.fileUrl.split(".").length - 1].toLowerCase();
        }
      });
      return data;
    },
    // 档案文件打包下载
    downloadArchivesPage(itemFlag) {
      let fileList = itemFlag == "1" ? this.planReportInfoDto : itemFlag == "2" ? this.goalAchieveList : itemFlag == "3" ? this.benefitSummaryList : this.yearReportInfoDto;
      let list = [];
      fileList.forEach(it => {
        let obj = {};
        obj.fileName = it.fileName;
        obj.fileUrl = it.fileUrl;
        list.push(obj);
      });
      let paramObj = {
        fileDtos: list,
        responseTypeBlob: true
      };
      this.requestMethodPost("/pes/downLoadPesZipFile", paramObj)
        .then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          const stageName = itemFlag == "1" ? "计划书" : itemFlag == "2" ? "目标实现" : itemFlag == "3" ? "效益总结" : "年度总结";
          let serviceFileNum = "";
          if (that.selectedYearItem.serviceFileNum != "0") {
            serviceFileNum = "_" + that.selectedYearItem.serviceFileNum;
          }
          const str = that.selectedYear + serviceFileNum + "_" + stageName + "文件";
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: "error"
                });
                return;
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
                type: "application/zip"
              });
              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", str);
              document.body.appendChild(link);
              link.click();
              that.$message({
                message: "下载成功",
                type: "success"
              });
            }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {});
    },
    // 上传改变事件
    upChange(file, uploadType) {
      if (file.status !== "ready") return;
      let reportList = [];
      if (uploadType == "3" && this.benefitSummaryDto.length > 0) {
        this.benefitSummaryDto.forEach(item => {
          if (item.flag == 0) {
            reportList.push(item);
          }
        });
      }
      if (uploadType == "4" && this.yearReportInfoDto.length > 0) {
        this.yearReportInfoDto.map(item => {
          if (item.flag == 0) {
            reportList.push(item);
          }
        });
      }
      // let list = uploadType == '1' ? this.planReportInfoDto : uploadType == '2' ? this.goalAchieveList : uploadType == '3' ? this.benefitSummaryList : this.yearReportInfoDto
      if (reportList.length >= 10) {
        this.$message({
          type: "warning",
          message: "每个阶段最多上传10份文件"
        });
        return;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message({
          type: "warning",
          message: "请选择100M以内文件"
        });
        return;
      }
      const params = new FormData();
      params.append("pesId", this.selectPesId);
      params.append("stage", uploadType);
      params.append("file", file.raw);
      this.requestMethodPost("/pes/uploadPesFileByStage", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "上传成功"
            });
            setTimeout(() => {
              this.getPESFileList();
            }, 1000);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    // 下载档案文件
    downloadArchives(row) {
      this.getDownloadFullUrl(row.fileUrl);
    },
    // 预览档案文件
    previewFile(row, reportType) {
      this.$gio.downloadArchiveReport({ reportType: reportType, customer: this.overViewData.customerCompanyName });
      if (row.fileType != "pdf") {
        this.getDownloadFullUrl(row.fileUrl);
      } else {
        this.getPdfPreviewFulUrl(row.fileUrl);
      }
    },
    // 下载获取全路径
    getDownloadFullUrl(fileUrl) {
      const params = {
        url: fileUrl
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
    // pdf预览获取全路径
    getPdfPreviewFulUrl(fileUrl) {
      const params = {
        url: encodeURI(fileUrl)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
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
    // 删除档案文件
    deleteArchivesFile(row) {
      this.deleteFileFlag = true;
      this.deleteItemId = row.id;
    },
    cancelDeleteFile() {
      this.deleteFileFlag = false;
      this.deleteItemId = "";
    },
    confirmDeleteFile() {
      this.requestMethodPost("/pes/deletePesFileByFileId", { stageFileId: this.deleteItemId }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.deleteFileFlag = false;
          this.getPESFileList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
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
// .add-customer-profile .el-upload {
//   border: none !important;
// }
// .add-customer-profile .el-upload:hover {
//     border-color: #409EFF;
//   }
.report-creating {
  font-weight: 400;
  font-family: Microsoft-Ya-Hei;
  font-size: 12px;
  color: #dd0000;
  background-color: #fef0f0;
  padding: 0 6px;
  height: 24px;
  display: inline-block;
  line-height: 24px;
  border-radius: 4px;
}
.add-customer-profile {
  padding: 0px 20px;
  overflow: auto;
}
.name-year-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 6px;
}
.company-name-content {
  display: flex;
  align-items: center;
}
.company-name {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  line-height: 25px;
  margin-right: 10px;
}
.year {
  display: flex;
  margin-top: 20px;
}
.item-content {
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  margin-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.item-left {
  width: 208px;
  display: flex;
  flex-direction: column;
}
.pes-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding-left: 20px;
  cursor: pointer;
}
.pes-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
.item-right {
  padding: 0 12px 12px;
  border-left: 1px solid #e9e9e9;
  flex: 1;
}
.right-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 20px;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.status-point {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
.right-title {
  line-height: 28px;
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
.card-item,
.card-item-small {
  width: 240px;
  height: 134px;
  border: 1px solid #e9e9e9;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}
.card-item-small {
  width: 180px;
}
.no-service {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #999;
}
.card-content {
  display: flex;
  flex-direction: column;
}
.right-content-title {
  font-size: 16px;
  color: #001450;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.right-content-placeholder {
  font-size: 14px;
  margin-top: 16px;
  color: #999;
}
.right-file {
  margin-left: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex: 1;
}
.workorder-progress-content {
  height: 96px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.workorder-progress {
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  padding: 24px 20px;
}
.service-package {
  background-color: rgba(204, 221, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  height: 98px;
}
.right-number {
  margin: 41px 20px 0 0;
  background: #fff;
  width: 150px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}
.service-content {
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.item-title {
  font-size: 14px;
  color: #999;
}
.item-value {
  font-size: 14px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  color: #333;
  line-height: 19px;
}
.point {
  width: 10px;
  height: 10px;
  background-color: #ccc;
  border-radius: 5px;
  margin-right: 5px;
}
.empty-pes {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.file-list-content {
  margin: 10px 0 0px;
}
.file-list {
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
}
.file-name {
  font-size: 14px;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
  cursor: pointer;
}
.file-content {
  overflow: hidden;
  flex: 1;
  margin: 0 40px 0 0px;
}
.file_type_icon {
  margin-right: 10px;
  width: 32px;
  height: 32px;
  display: block;
}
.file-status {
  font-weight: 400;
  font-family: Microsoft-Ya-Hei;
  font-size: 12px;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
  padding: 0 6px;
  height: 24px;
  display: inline-block;
  line-height: 24px;
  margin-left: 10px;
  border-radius: 4px;
}
.file-detail {
  font-size: 13px;
  color: #9999;
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-weight: 400;
}
.no-file {
  width: 100%;
  height: 100px;
  border: 1px solid #f9f9f9;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #999;
}
/deep/ .service-report {
  .el-col-12:nth-child(odd) {
    padding-right: 10px;
  }
  .el-col-12:nth-child(even) {
    padding-left: 10px;
  }
}
/deep/ .service-report1 {
  .el-col-12:nth-child(odd) {
    padding-left: 10px;
  }
}
/deep/ .el-main {
  padding: 0;
}
/deep/ .el-upload {
  border: none;
}
/deep/ .el-select .el-tag__close.el-icon-close::before {
  display: none !important;
}
/deep/ .el-tag.el-tag--info .el-tag__close {
  display: none !important;
}
</style>
<style>
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
</style>
