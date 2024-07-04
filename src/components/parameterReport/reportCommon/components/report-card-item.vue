<template>
  <el-card style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title" :style="(cardItem.isImportFile || cardItem.tabFlag)?'display:flex;align-items:center;':'display:flex;align-items:center;justify-content: space-between;'">
      <div style="display:flex;align-items:center;">
        <div class="line-vertical"></div>
        <div style="margin:0px 8px">{{ cardItem.nodeName }}</div>
        <el-tooltip v-if="cardItem.isShowEdit" class="item" effect="dark" content="设备及润滑点信息请点击【前往补充】按钮，前往设备编辑页" placement="top-start">
          <el-button type="text" style="color:#333;font-size:15px;padding:0px;">
            <i class="el-icon-warning-outline"></i>
          </el-button>
        </el-tooltip>
      </div>
      <div style="display:flex;align-items:center;justify-content: space-between;" v-if="cardItem.isShowEdit">
        <div @click="handleFillInfo" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;"><i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充</div>
      </div>
      <div v-if="cardItem.isImportFile">
        <span :style="paramReportType == 1 ?'color:#666':'color:#dd0000'">{{paramReportType == 1 ? '（选填）' :'（必填）'}}</span>
      </div>
      <div v-if="cardItem.tabFlag">
        <span style="color:#dd0000">（请填写每个标签页）</span>
      </div>
    </div>
    <!-- 风机主齿箱换油, 风机现场验油报告导入验油数据-->
    <div v-if="cardItem.isImportFile" style="height:100%">
      <oilInspectionReport
        ref="oilInspectionReportRef"
        :defaultNodeDto="deviceDetailObj.defaultNodeDto"
        :checkOilForm="cardItem.nodeValue">
      </oilInspectionReport>
    </div>
    <!-- tab页签上面控件 -->
    <div v-if="cardItem.tabFlag" v-for="(item,keyIndex) in cardItem.nodeValue" :key="keyIndex">
      <el-form :model="item" label-position="top" style="padding:0 20px;" v-if="item.type != 'tab'">
          <el-row>
            <el-col :span="item.type == 'string' ? 8 : 24">
              <el-form-item v-if="item.display || item.type == 'string1' || item.type.includes('button')">
                <div slot="label" style="display:flex;align-items:center">
                  <span v-if="item.required && item.display" class="star">*</span>
                  <span v-if="item.display && item.type != 'button'">{{ item.name }}</span>
                  <span v-if="item.unit">({{ item.unit }})</span>
                  <span v-if="item.type == 'img'">（最多上传{{ item.length }}张图片）</span>
                  <span v-if="item.tip && item.display">
                    <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </span>
                </div>
                <reportIndex
                  :formItem="item"
                  :reportId="paramReportType"
                  @handleAddBlock="handleAddBlock"
                  @reportAddDeviceAndLup="reportAddDeviceAndLup"
                  @handleAddFile="handleAddFile"
                  @dateTimeChange="dateTimeChange"
                  @timeRangeFun="timeRangeFun"
                  @inputDropChange="inputDropChange"
                  @radioCommonChange="radioCommonChange"
                  @dynamicSelectChange="dynamicSelectChange"
                  @selectCommonChange="selectCommonChange"
                  @selectCommonVisibleChange="selectCommonVisibleChange"
                  @commonCheckBoxChange="commonCheckBoxChange"
                  @selectCommonApiChange="selectCommonApiChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </div>
    <div v-if="cardItem.tabFlag && paramReportType==5">
      <div style="font-size:14px">请选择检查项目</div>
      <el-button type="danger" size="small" plain style="margin: 20px 0;" @click="chooseTabs">选择</el-button>
    </div>
    <!-- 含有tab页签参数化 -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabsClick" v-if="cardItem.tabFlag">
      <el-tab-pane v-for="(tab,tabIndex) in cardItem.nodeValue" :label="tab.name" :name="tab.nameKey" :key="tabIndex" v-if="tab.type=='tab' && tab.display">
        <el-form :model="tab.children" label-position="top" style="padding:0 20px;">
          <el-row>
            <div v-for="(item, index) in tab.children" :key="refreshKey">
              <el-col :span="item.type == 'string' ? 8 : 24">
                <el-form-item v-if="item.display || item.type == 'string1' || item.type.includes('button')">
                  <div slot="label" style="display:flex;align-items:center">
                    <span v-if="item.required && item.display" class="star">*</span>
                    <span v-if="item.display && item.type != 'button' && item.type != 'string1'">{{ item.name }}</span>
                    <span v-if="item.unit">（{{ item.unit }}）</span>
                    <span v-if="item.type == 'img'">（最多上传{{ item.length }}张图片）</span>
                    <span v-if="item.tip && item.display">
                      <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <reportIndex
                    :formItem="item"
                    :optId="optId"
                    :reportId="paramReportType"
                    :activeTab="activeTab"
                    :paramReportNodeList="paramReportNode"
                    @handleAddBlock="handleAddBlock"
                    @reportAddDeviceAndLup="reportAddDeviceAndLup"
                    @handleAddFile="handleAddFile"
                    @dateTimeChange="dateTimeChange"
                    @timeRangeFun="timeRangeFun"
                    @inputDropChange="inputDropChange"
                    @radioCommonChange="radioCommonChange"
                    @dynamicSelectChange="dynamicSelectChange"
                    @selectCommonChange="selectCommonChange"
                    @selectCommonVisibleChange="selectCommonVisibleChange"
                    @commonCheckBoxChange="commonCheckBoxChange"
                    @inputNumberBlurFunc="inputNumberBlurFunc"
                    @selectCommonApiChange="selectCommonApiChange"
                  />
                  <!-- children里有子项 -->
                    <!-- 第一层 -->
                    <div v-for="(child1, child1Index) in item.children" :key="refreshKey">
                      <el-form-item :class="{'hideItem':!child1.display}">
                        <div slot="label" style="display:flex;align-items:center">
                          <span v-if="child1.required && child1.display" class="star">*</span>
                          <span v-if="child1.display && child1.type != 'button' && child1.type != 'string1'">{{ child1.name }}</span>
                          <span v-if="child1.unit && child1.display">（{{ child1.unit }}）</span>
                          <span v-if="(child1.nameKey=='key_ye_ya_ybjc_yyb_item' && child1.display)">{{ child1Index + 1}}</span>
                          <span v-if="child1.type == 'img' && child1.display">（最多上传{{ child1.length }}张图片）</span>
                          <span v-if="child1.tip && child1.display && child1.tip.type=='text'" class="tips">
                            <el-tooltip effect="dark" :content="child1.tip.content" placement="top-start" >
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </span>
                          <span v-if="child1.tip && child1.display && child1.tip.type=='img'" class="tips">
                            <el-popover placement="right" width="auto" trigger="click">
                              <img style="width: 600px" :src="tipImgSrc" alt="" v-if="tipImgSrc"/>
                              <el-button slot="reference" type="text"  @click="viewRefer(child1.tip)"
                                style="color: rgba(33, 150, 243); font-size: 15px; padding: 0px; font-size: 12px"> 查看参考 
                              </el-button>
                            </el-popover>
                          </span>
                          <el-link class="delete-link" v-if="child1.styleJsonDto && child1.styleJsonDto.deleteIcon && child1Index + 1 > child1.rangeMin && child1.display" @click="deleteItem(child1)">删除</el-link>
                        </div>
                        <reportIndex
                          v-if="child1.display"
                          :formItem="child1"
                          :optId="optId"
                          :reportId="paramReportType"
                          :activeTab="activeTab"
                          :paramReportNodeList="paramReportNode"
                          @handleAddBlock="handleAddBlock"
                          @handleAddFile="handleAddFile"
                          @dateTimeChange="dateTimeChange"
                          @inputDropChange="inputDropChange"
                          @radioCommonChange="radioCommonChange"
                          @timeRangeFun="timeRangeFun"
                          @dynamicSelectChange="dynamicSelectChange"
                          @selectCommonChange="selectCommonChange"
                          @selectCommonVisibleChange="selectCommonVisibleChange"
                          @commonCheckBoxChange="commonCheckBoxChange"
                          @inputNumberBlurFunc="inputNumberBlurFunc"
                          @selectCommonApiChange="selectCommonApiChange"
                        />
                        <!-- 第二层 -->
                        <div v-for="(child2, child2Index) in child1.children" :key="refreshKey" v-if="child1.name.includes('不展示') ? child1.children.length : child1.children.length && child1.display">
                          <el-form-item>
                            <div slot="label" style="display:flex;align-items:center" v-if="child2.display">
                              <span v-if="child2.required && child2.display" class="star">*</span>
                              <span v-if="child2.display && child2.type != 'button' && child2.type != 'tco'">{{ child2.name }}</span>
                              <span v-if="child2.unit">（{{ child2.unit }}）</span>
                              <span v-if="((paramReportType==4 || paramReportType==5 || paramReportType==6 || paramReportType==7 || paramReportType==8) && (child2.nameKey=='key_aqts_item_name' || child2.nameKey=='key_ye_ya_ybjc_yyb_item')) || 
                              ((paramReportType==12) && (child2.nameKey=='key_1381' || child2.nameKey=='key_1408' || child2.nameKey=='key_1425' || child2.nameKey=='key_1415'))">{{ child1Index + 1 }}</span>
                              <span v-if="child2.type == 'img' && child2.display">（最多上传{{ child2.length }}张图片）</span>
                              <span v-if="child2.tip && child2.display && child2.tip.type=='text'" class="tips">
                                <el-tooltip effect="dark" :content="child2.tip.content" placement="top-start" >
                                  <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                              </span>
                              <span v-if="child2.tip && child2.display && child2.tip.type=='img'" class="tips">
                                <el-popover placement="right" width="auto" trigger="click">
                                  <img style="width: 600px" :src="tipImgSrc" alt="" v-if="tipImgSrc"/>
                                  <el-button slot="reference" type="text"  @click="viewRefer(child2.tip)"
                                    style="color: rgba(33, 150, 243); font-size: 15px; padding: 0px; font-size: 12px"> 查看参考 
                                  </el-button>
                                </el-popover>
                              </span>
                              <el-link class="delete-link" v-if="(paramReportType==5 && child2.nameKey=='key_ye_ya_ybjc_yyb_item')?child1Index>0:child2.styleJsonDto && child2.styleJsonDto.deleteIcon && child1Index + 1 > child1.rangeMin" @click="deleteItem(child1)">删除</el-link>
                            </div>
                            <reportIndex
                              v-if="child2.display"
                              :formItem="child2"
                              :reportId="paramReportType"
                              :activeTab="activeTab"
                              :paramReportNodeList="paramReportNode"
                              @handleAddBlock="handleAddBlock"
                              @handleAddFile="handleAddFile"
                              @dateTimeChange="dateTimeChange"
                              @inputDropChange="inputDropChange"
                              @timeRangeFun="timeRangeFun"
                              @dynamicSelectChange="dynamicSelectChange"
                              @radioCommonChange="radioCommonChange"
                              @selectCommonChange="selectCommonChange"
                              @selectCommonVisibleChange="selectCommonVisibleChange"
                              @commonCheckBoxChange="commonCheckBoxChange"
                              @inputNumberBlurFunc="inputNumberBlurFunc"
                              @selectCommonApiChange="selectCommonApiChange"
                            />
                            <!-- 第三层 -->
                            <div v-for="(child3, child3Index) in child2.children" :key="refreshKey" v-if="child2.children.length">
                              <el-form-item>
                                <div slot="label" style="display:flex;align-items:center" v-if="child3.display">
                                  <span v-if="child3.required && child3.display" class="star">*</span>
                                  <span v-if="child3.display && child2.type != 'button' && child3.type != 'button'">{{ child3.name }}</span>
                                  <span v-if="child3.unit">（{{ child3.unit }}）</span>
                                  <span v-if="child3.display && child3.type != 'button' && 
                                  (child3.nameKey=='key_kscl_other_item_qk' || child3.nameKey=='key_chilun_small')">{{ child2Index + 1 }}</span>
                                  <span v-if="child3.display && child3.type != 'button' && 
                                  (child3.nameKey=='position_key')">{{ child3Index + 1 }}</span>
                                  <span v-if="child3.type == 'img' && child3.display">（最多上传{{ child3.length }}张图片）</span>
                                  <span v-if="child3.tip" class="tips">
                                    <el-tooltip effect="dark" :content="child3.tip.content" placement="top-start">
                                      <i class="el-icon-warning-outline"></i>
                                    </el-tooltip>
                                  </span>
                                  <!-- 删除位置 -->
                                  <span v-if="child3.nameKey=='position_key' && child3Index+1>5">
                                    <el-link class="delete-link"  @click="deletePosition(child2,child3)">删除</el-link>
                                  </span>
                                  <span v-else>
                                    <el-link class="delete-link" v-if="child3.styleJsonDto && child3.styleJsonDto.deleteIcon && child2Index + 1 > child2.rangeMin" @click="deleteItem(child2)">删除</el-link>
                                  </span>
                                </div>
                                <reportIndex
                                  v-if="child3.display"
                                  :formItem="child3"
                                  :reportId="paramReportType"
                                  :activeTab="activeTab"
                                  :paramReportNodeList="paramReportNode"
                                  @handleAddBlock="handleAddBlock"
                                  @handleAddFile="handleAddFile"
                                  @dateTimeChange="dateTimeChange"
                                  @inputDropChange="inputDropChange"
                                  @timeRangeFun="timeRangeFun"
                                  @dynamicSelectChange="dynamicSelectChange"
                                  @radioCommonChange="radioCommonChange"
                                  @selectCommonChange="selectCommonChange"
                                  @selectCommonVisibleChange="selectCommonVisibleChange"
                                  @commonCheckBoxChange="commonCheckBoxChange"
                                  @inputNumberBlurFunc="inputNumberBlurFunc"
                                  @selectCommonApiChange="selectCommonApiChange"
                                />
                                <!-- 第四层 -->
                                <div v-for="(child4, child4Index) in child3.children" :key="refreshKeyPosition" v-if="child3.children.length">
                                  <el-form-item>
                                    <div slot="label" style="display:flex;align-items:center" v-if="child4.display">
                                      <span v-if="child4.required && child4.display" class="star">*</span>
                                      <span v-if="child4.display && child4.type != 'button'">{{ child4.name }}</span>
                                      <span v-if="child4.display && child4.type != 'button' && child4.nameKey!='position_key' && 
                                      child4.nameKey!='key_kscl_cljc_chilun_cmwd_line_small' && 
                                      child4.nameKey!='key_kscl_cljc_chilun_cmwd_big' &&
                                      child4.nameKey != 'key_kscl_cljc_chilun_cmwd_small'">{{ child3Index + 1 }}</span>
                                      <span v-if="child4.display && child4.nameKey=='position_key'">{{child4Index+1}}</span>
                                      <span v-if="child4.unit">（{{ child4.unit }}）</span>
                                      <span v-if="child4.type == 'img' && child4.display">（最多上传{{ child4.length }}张图片）</span>
                                      <span v-if="child4.tip" class="tips">
                                        <el-tooltip effect="dark" :content="child4.tip.content" placement="top-start">
                                          <i class="el-icon-warning-outline"></i>
                                        </el-tooltip>
                                      </span>
                                      <span v-if="child4.nameKey=='position_key' && child4Index+1>5">
                                        <el-link class="delete-link"  @click="deletePosition(child3,child4)">删除</el-link>
                                      </span>
                                      <span v-else>
                                        <el-link class="delete-link" v-if="child4.styleJsonDto && child4.styleJsonDto.deleteIcon && child3Index + 1 > child3.rangeMin" 
                                          @click="deleteItem(child3)">删除</el-link>
                                      </span>
                                    </div>
                                    <reportIndex
                                      v-if="child4.display"
                                      :formItem="child4"
                                      :reportId="paramReportType"
                                      :activeTab="activeTab"
                                      :paramReportNodeList="paramReportNode"
                                      @handleAddBlock="handleAddBlock"
                                      @handleAddFile="handleAddFile"
                                      @dateTimeChange="dateTimeChange"
                                      @inputDropChange="inputDropChange"
                                      @timeRangeFun="timeRangeFun"
                                      @dynamicSelectChange="dynamicSelectChange"
                                      @radioCommonChange="radioCommonChange"
                                      @selectCommonChange="selectCommonChange"
                                      @selectCommonVisibleChange="selectCommonVisibleChange"
                                      @commonCheckBoxChange="commonCheckBoxChange"
                                      @inputNumberBlurFunc="inputNumberBlurFunc"
                                      @selectCommonApiChange="selectCommonApiChange"
                                    />
                                    <!-- 第五层 -->
                                    <div v-for="(child5, child5Index) in child4.children" :key="refreshKey" v-if="child4.children.length">
                                      <el-form-item>
                                        <div slot="label" style="display:flex;align-items:center" v-if="child5.display">
                                          <span v-if="child5.required && child5.display" class="star">*</span>
                                          <span v-if="child5.display && child3.type != 'button' && child5.type != 'button'">{{ child5.name }}</span>
                                          <span v-if="child5.display && child3.type != 'button' && child4.type != 'button' && child5.nameKey=='position_key'">{{ child5Index + 1 }}</span>
                                          <span v-if="child5.unit">（{{ child5.unit }}）</span>
                                          <span v-if="child5.type == 'img' && child5.display">（最多上传{{ child5.length }}张图片）</span>
                                          <span v-if="child5.tip" class="tips">
                                            <el-tooltip effect="dark" :content="child5.tip.content" placement="top-start">
                                              <i class="el-icon-warning-outline"></i>
                                            </el-tooltip>
                                          </span>
                                          <el-link class="delete-link" v-if="child5.styleJsonDto && child5.styleJsonDto.deleteIcon && child4Index + 1 > child4.rangeMin" @click="deleteItem(child4)"
                                            >删除</el-link
                                          >
                                        </div>
                                        <reportIndex
                                          v-if="child5.display"
                                          :formItem="child5"
                                          :reportId="paramReportType"
                                          :activeTab="activeTab"
                                          :paramReportNodeList="paramReportNode"
                                          @handleAddBlock="handleAddBlock"
                                          @handleAddFile="handleAddFile"
                                          @dateTimeChange="dateTimeChange"
                                          @inputDropChange="inputDropChange"
                                          @timeRangeFun="timeRangeFun"
                                          @dynamicSelectChange="dynamicSelectChange"
                                          @radioCommonChange="radioCommonChange"
                                          @selectCommonChange="selectCommonChange"
                                          @selectCommonVisibleChange="selectCommonVisibleChange"
                                          @commonCheckBoxChange="commonCheckBoxChange"
                                          @inputNumberBlurFunc="inputNumberBlurFunc"
                                          @selectCommonApiChange="selectCommonApiChange"
                                        />
                                        <!-- 第六层 -->
                                        <div v-for="(child6, child6Index) in child5.children" :key="refreshKey" v-if="child5.children.length">
                                          <el-form-item>
                                            <div slot="label" style="display:flex;align-items:center" v-if="child6.display">
                                              <span v-if="child6.required && child6.display" class="star">*</span>
                                              <span v-if="child6.display && child6.type != 'button' && child6.type != 'button'">{{ child6.name }}</span>
                                              <span v-if="child6.display && child6.type != 'button' && child6.type != 'button' && child6.nameKey=='position_key'">{{ child6Index + 1 }}</span>
                                              <span v-if="child6.unit">（{{ child6.unit }}）</span>
                                              <span v-if="child6.type == 'img' && child6.display">（最多上传{{ child6.length }}张图片）</span>
                                              <span v-if="child6.tip" class="tips">
                                                <el-tooltip effect="dark" :content="child6.tip.content" placement="top-start">
                                                  <i class="el-icon-warning-outline"></i>
                                                </el-tooltip>
                                              </span>
                                              <el-link class="delete-link" v-if="child6.styleJsonDto && child6.styleJsonDto.deleteIcon && child5Index + 1 > child5.rangeMin" @click="deleteItem(child5)"
                                                >删除</el-link
                                              >
                                            </div>
                                            <reportIndex
                                              v-if="child6.display"
                                              :formItem="child6"
                                              :reportId="paramReportType"
                                              :activeTab="activeTab"
                                              :paramReportNodeList="paramReportNode"
                                              @handleAddBlock="handleAddBlock"
                                              @handleAddFile="handleAddFile"
                                              @dateTimeChange="dateTimeChange"
                                              @inputDropChange="inputDropChange"
                                              @timeRangeFun="timeRangeFun"
                                              @dynamicSelectChange="dynamicSelectChange"
                                              @radioCommonChange="radioCommonChange"
                                              @selectCommonChange="selectCommonChange"
                                              @selectCommonVisibleChange="selectCommonVisibleChange"
                                              @commonCheckBoxChange="commonCheckBoxChange"
                                              @inputNumberBlurFunc="inputNumberBlurFunc"
                                              @selectCommonApiChange="selectCommonApiChange"
                                            />
                                          </el-form-item>
                                        </div>

                                      </el-form-item>
                                    </div>
                                  </el-form-item>
                                </div>
                              </el-form-item>
                            </div>
                          </el-form-item>
                        </div>
                      </el-form-item>
                    </div>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 表单循环字段展示 -->
    <el-form v-if="!cardItem.tabFlag && !cardItem.isImportFile && !cardItem.isCountAddFatFlag" :ref="formRef" :model="cardItem.nodeValue" label-position="top" style="padding:0 20px;">
      <el-row>
        <div v-for="(item, index) in cardItem.nodeValue" :key="refreshKey">
          <el-col :span="item.type == 'string' ? 8 : 24">
            <el-form-item v-if="item.display || item.type == 'string1' || item.type.includes('button')">
              <div slot="label" style="display:flex;align-items:center">
                <span v-if="item.required && item.display" class="star">*</span>
                <span v-if="item.display && item.type != 'button' && item.type != 'tree'" 
                :style="{ color: item.styleJsonDto && item.styleJsonDto.fontColor ? item.styleJsonDto.fontColor : '', fontWeight:item.styleJson && JSON.parse(item.styleJson).fontWeight ? JSON.parse(item.styleJson).fontWeight : '' }"
                >{{ item.name }}</span>
                <span v-if="item.unit">({{ item.unit }})</span>
                <span v-if="item.type == 'img'">（最多上传{{ item.length }}张图片）</span>
                <span v-if="item.tip && item.display">
                  <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </span>
              </div>
              <reportIndex
                :formItem="item"
                :optId="optId"
                :reportId="paramReportType"
                :paramReportNodeList="paramReportNode"
                @handleAddBlock="handleAddBlock"
                @reportAddDeviceAndLup="reportAddDeviceAndLup"
                @handleAddFile="handleAddFile"
                @dateTimeChange="dateTimeChange"
                @timeRangeFun="timeRangeFun"
                @inputDropChange="inputDropChange"
                @radioCommonChange="radioCommonChange"
                @dynamicSelectChange="dynamicSelectChange"
                @selectCommonChange="selectCommonChange"
                @selectCommonVisibleChange="selectCommonVisibleChange"
                @commonCheckBoxChange="commonCheckBoxChange"
                @selectMultipleChange="selectMultipleChange"
                @selectCommonApiChange="selectCommonApiChange"
                @selectCascaderChange="selectCascaderChange"
              />
              <!-- children里有子项 -->
              <div v-if="item.children.length && item.type != 'tree'">
                <!-- 第一层 -->
                <div v-for="(child1, child1Index) in item.children" :key="refreshKey">
                  <h3 style="margin:0;padding:0;padding-top:10px;" v-if="item.nameKey == 'key_device_lub_group' && judegeShowing(child1) && paramReportType == 17">
                    <hr v-if="item.nameKey == 'key_device_lub_group' && child1Index > 0" />
                    设备
                    <span style="color:#d10000">{{ calcIndex(child1) }} </span>： {{ showLubGroupName(child1) }}
                  </h3>
                  <el-form-item>
                    <div v-if="item.type != 'average'">
                      <div slot="label" style="display:flex;align-items:center" v-if="child1.display">
                        <span v-if="child1.required && child1.display" class="star">*</span>
                        <span v-if="child1.display && child1.type != 'button'">{{ child1.name }}</span>
                        <span v-if="child1.unit">（{{ child1.unit }}）</span>
                        <span
                          v-if="child1.display && child1.type != 'button' && !child1.name.includes('TCO')"
                          :style="{ color: (item.nameKey == 'key_device_lub_group' || child1.nameKey == 'key_device_lub_group') ? '#d10000' : '', 'font-weight': (item.nameKey == 'key_device_lub_group' || child1.nameKey == 'key_device_lub_group') ? '700' : '' }">
                          {{ (item.nameKey == "key_device_lub_group") ? 
                          handleLubIndex(child1) : paramReportType == 22 ? "" : 
                          (paramReportType == 14 && (child1.nameKey=='key_img_with_desc')) ? '' :
                           (paramReportType == 13 && 
                           (child1.nameKey=='key_1498' || child1.nameKey=='key_1499' || child1.nameKey=='key_1500' || child1.nameKey=='key_1501' || child1.nameKey=='key_1502' || child1.nameKey=='key_1503' || child1.nameKey=='key_1504' || child1.nameKey=='key_1448'  || child1.nameKey=='key_1454')
                           ) ? '' : (paramReportType == 11 && (child1.nameKey=='key_1500')) ? '' : (paramReportType == 11 && (child1.name == '附录')) ? handleAppendixIndex(item,child1) : child1Index + 1 }}
                        </span>
                        <div style="display:flex;align-items:center;justify-content: space-between;margin-left:10px" v-if="cardItem.isShowLupBlock || child1.isSystemLup">
                          <div @click="handleEditItem(child1)" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;">
                            <i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充
                          </div>
                        </div>
                        <span v-if="child1.type == 'img' && child1.display">（最多上传{{ child1.length }}张图片）</span>
                        <span v-if="child1.tip" class="tips">
                          <el-tooltip effect="dark" :content="child1.tip.content" placement="top-start">
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </span>
                        <span v-if="paramReportType==17 && child1.nameKey=='key_device_lub_parent' && item.children.length>1">
                          <el-link class="delete-link" @click="deleteItem(child1)">删除</el-link>
                        </span>
                        <span v-else>
                          <el-link class="delete-link" v-if="child1.styleJsonDto && child1.styleJsonDto.deleteIcon && child1Index + 1 > child1.rangeMin" @click="deleteItem(child1)">删除</el-link>
                        </span>
                      </div>
                      <reportIndex
                        v-if="child1.display"
                        :formItem="child1"
                        :optId="optId"
                        :reportId="paramReportType"
                        :paramReportNodeList="paramReportNode"
                        @handleAddBlock="handleAddBlock"
                        @handleAddFile="handleAddFile"
                        @dateTimeChange="dateTimeChange"
                        @inputDropChange="inputDropChange"
                        @radioCommonChange="radioCommonChange"
                        @timeRangeFun="timeRangeFun"
                        @dynamicSelectChange="dynamicSelectChange"
                        @selectCommonChange="selectCommonChange"
                        @selectCommonVisibleChange="selectCommonVisibleChange"
                        @commonCheckBoxChange="commonCheckBoxChange"
                        @selectMultipleChange="selectMultipleChange"
                        @selectCommonApiChange="selectCommonApiChange"
                        @selectCascaderChange="selectCascaderChange"
                      />
                    </div>
                    <div v-else>
                      <lubricationConditionEvaluationCountAverage :child="item" :child1="child1" :reportType="paramReportType" @countAverageVal="countAverageVal" />
                    </div>
                    <!-- 第二层 -->
                    <div v-for="(child2, child2Index) in child1.children" :key="refreshKey" v-if="child1.name.includes('不展示') ? child1.children.length : child1.children.length && child1.display">
                      <el-form-item>
                        <div slot="label" style="display:flex;align-items:center" v-if="child2.display">
                          <span v-if="child2.required && child2.display" class="star">*</span>
                          <span v-if="child2.display && child2.type != 'button' && child2.type != 'tco'">
                            <span v-if="child2.name.indexOf('#') > 0">
                              {{ child2.name.replace("#", child1Index + 1) }}
                            </span>
                            <span v-else>{{ child2.name }}</span>
                            <el-button
                              type="text"
                              v-if="child2.nameKey == 'key_tjrhcp' && paramReportType == 3"
                              style="margin-left:14px;"
                              @click.prevent="()=>{handlerViewProductDrawerShow(getViewProductData(child1))}"
                              :disabled="getViewProductDis(child1)"
                              :loading="viewProductLoading"
                            >查看推荐油品</el-button>
                          </span>
                          <!-- <span v-if="child2.display && child2.type != 'button' && child2.type != 'tco'">{{ child2.name }}</span> -->
                          <span v-if="child2.unit && (paramReportType!=3)">（{{ child2.unit }}）</span>
                          <span
                            v-if="
                              child2.display &&
                                child2.type != 'button' &&
                                ((paramReportType == 19 && (child2.nameKey == 'key_2208' || child2.nameKey == 'key_2209')) ||
                                  (paramReportType == 22 && !child2.name.includes('TCO')) ||
                                  (paramReportType == 20 && (child2.nameKey == 'key_img' || child2.nameKey == 'key_desc')) ||
                                  (paramReportType == 21 && (child2.nameKey == 'key_img' || child2.nameKey == 'key_desc' || child2.nameKey == 'key_title')) ||
                                  (paramReportType == 10 && (child2.nameKey == 'pxzj_kc_item' || child2.nameKey == 'pxzj_nr_item' || child2.nameKey == 'pxzj_xdjh_item'))||
                                  (paramReportType == 16 && (child2.nameKey == 'key_1718' || child2.nameKey == 'key_1719' || child2.nameKey=='key_1725' || child2.nameKey=='key_1726')) ||
                                  (paramReportType == 14 && (child2.nameKey=='key_gzxx' || child2.nameKey == 'key_img_only' || child2.nameKey =='key_fx_xcdc' || child2.nameKey=='key_fx_zyyfx' || child2.nameKey=='key_fx_ssjc' || child2.nameKey=='key_fx_qt')) ||
                                  (paramReportType == 13 && (child2.nameKey=='key_img_with_desc' || child2.nameKey=='key_desc_by_img' || child2.nameKey=='key_1494' || child2.nameKey=='key_1516'))) 
                                  && child2.name.indexOf('#') == -1
                            "
                            >{{ child1Index + 1 }}</span
                          >
                          <span v-if="child2.type == 'img' && child2.display">（最多上传{{ child2.length }}张图片）</span>
                          <span v-if="child2.tip" class="tips">
                            <el-tooltip effect="dark" :content="child2.tip.content" placement="top-start">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </span>
                          <el-link
                            class="delete-link"
                            v-if="
                              ((paramReportType == 19 && child2.nameKey == 'cylinder_no') ||
                                (paramReportType == 23 && (child2.nameKey == 'bearing_no' || child2.nameKey == 'gear_no' || child2.nameKey == 'component_no'))) &&
                                child1Index + 1 > child1.rangeMin
                            "
                            @click="deleteItem(child1)"
                            >删除</el-link
                          >
                          <el-link class="delete-link" v-if="child2.styleJsonDto && child2.styleJsonDto.deleteIcon && child1Index + 1 > child1.rangeMin" @click="deleteItem(child1)">删除</el-link>
                        </div>
                        <reportIndex
                          v-if="child2.display"
                          :formItem="child2"
                          :reportId="paramReportType"
                          :paramReportNodeList="paramReportNode"
                          @handleAddBlock="handleAddBlock"
                          @handleAddFile="handleAddFile"
                          @dateTimeChange="dateTimeChange"
                          @inputDropChange="inputDropChange"
                          @timeRangeFun="timeRangeFun"
                          @dynamicSelectChange="dynamicSelectChange"
                          @radioCommonChange="radioCommonChange"
                          @selectCommonChange="selectCommonChange"
                          @selectCommonVisibleChange="selectCommonVisibleChange"
                          @commonCheckBoxChange="commonCheckBoxChange"
                          @selectMultipleChange="selectMultipleChange"
                          @selectCommonApiChange="selectCommonApiChange"
                          @selectCascaderChange="selectCascaderChange"
                          @customerNamechange="customerNamechange"
                        />
                        <!-- 第三层 -->
                        <div v-for="(child3, child3Index) in child2.children" :key="child3Index" v-if="child2.children.length">
                          <el-form-item>
                            <div slot="label" style="display:flex;align-items:center" v-if="child3.display">
                              <span v-if="child3.required && child3.display" class="star">*</span>
                              <span v-if="child3.display && child3.type != 'button'">{{ child3.name }}</span>
                              <span v-if="child3.unit">（{{ child3.unit }}）</span>
                              <span v-if="child3.display && child3.type != 'button' &&  child3.nameKey != 'key_1506'" >{{ child3Index + 1 }}</span>
                              <span v-if="child3.display && child3.type != 'button' && child3.nameKey == 'key_1506'" >{{ child2Index + 1 }}</span>
                              <span v-if="child3.type == 'img' && child3.display">（最多上传{{ child3.length }}张图片）</span>
                              <span v-if="child3.tip" class="tips">
                                <el-tooltip effect="dark" :content="child3.tip.content" placement="top-start">
                                  <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                              </span>
                              <el-link class="delete-link" v-if="child3.styleJsonDto && child3.styleJsonDto.deleteIcon && child2Index + 1 > child2.rangeMin" @click="deleteItem(child2)">删除</el-link>
                            </div>
                            <reportIndex
                              v-if="child3.display"
                              :formItem="child3"
                              :reportId="paramReportType"
                              :paramReportNodeList="paramReportNode"
                              @handleAddBlock="handleAddBlock"
                              @handleAddFile="handleAddFile"
                              @dateTimeChange="dateTimeChange"
                              @inputDropChange="inputDropChange"
                              @timeRangeFun="timeRangeFun"
                              @dynamicSelectChange="dynamicSelectChange"
                              @radioCommonChange="radioCommonChange"
                              @selectCommonChange="selectCommonChange"
                              @selectCommonVisibleChange="selectCommonVisibleChange"
                              @commonCheckBoxChange="commonCheckBoxChange"
                              @selectMultipleChange="selectMultipleChange"
                              @selectCommonApiChange="selectCommonApiChange"
                              @selectCascaderChange="selectCascaderChange"
                            />
                            <!-- 第四层 -->
                            <div v-for="(child4, child4Index) in child3.children" :key="refreshKey" v-if="child3.children.length">
                              <el-form-item>
                                <div slot="label" style="display:flex;align-items:center" v-if="child4.display">
                                  <span v-if="child4.required && child4.display" class="star">*</span>
                                  <span v-if="child4.display && child2.type != 'button' && child4.type != 'button'">
                                    <span v-if="child4.name.indexOf('#') > 0">
                                      {{ child4.name.replace("#", child3Index + 1) }}
                                    </span>
                                    <span v-else>{{ child4.name }}</span>
                                  </span>
                                  <!-- <span v-if="child4.display && child2.type != 'button' && child4.type != 'button'">{{ child4.name }}</span> -->
                                  <span v-if="child4.unit">（{{ child4.unit }}）</span>
                                  <span
                                    v-if="
                                      child4.display &&
                                        child2.type != 'button' &&
                                        child4.type != 'button' &&
                                        !((child4.name == '火花塞' || child4.name == '火花塞检查结果' || child4.name == '喷油嘴' || child4.name == '喷油嘴检查结果') && paramReportType == 19) &&
                                        child4.name.indexOf('#') == -1
                                    "
                                    >{{ child3Index + 1 }}</span
                                  >
                                  <span v-if="child4.type == 'img' && child4.display">（最多上传{{ child4.length }}张图片）</span>
                                  <span v-if="child4.tip" class="tips">
                                    <el-tooltip effect="dark" :content="child4.tip.content" placement="top-start">
                                      <i class="el-icon-warning-outline"></i>
                                    </el-tooltip>
                                  </span>
                                  <!-- reportType==19,删除火花塞或者喷油嘴检查 -->
                                  <el-link
                                    class="delete-link"
                                    @click="hiddenFireOrFuel(child3)"
                                    v-if="(child4.name == '火花塞' || child4.name == '喷油嘴') && child4.type != 'button' && paramReportType == 19"
                                    >删除</el-link
                                  >
                                  <el-link class="delete-link" v-if="child4.styleJsonDto && child4.styleJsonDto.deleteIcon && child3Index + 1 > child3.rangeMin" @click="deleteItem(child3)"
                                    >删除</el-link
                                  >
                                </div>
                                <reportIndex
                                  v-if="child4.display"
                                  :formItem="child4"
                                  :reportId="paramReportType"
                                  :paramReportNodeList="paramReportNode"
                                  @handleAddBlock="handleAddBlock"
                                  @handleAddFile="handleAddFile"
                                  @dateTimeChange="dateTimeChange"
                                  @inputDropChange="inputDropChange"
                                  @timeRangeFun="timeRangeFun"
                                  @dynamicSelectChange="dynamicSelectChange"
                                  @radioCommonChange="radioCommonChange"
                                  @selectCommonChange="selectCommonChange"
                                  @selectCommonVisibleChange="selectCommonVisibleChange"
                                  @commonCheckBoxChange="commonCheckBoxChange"
                                  @selectMultipleChange="selectMultipleChange"
                                  @selectCommonApiChange="selectCommonApiChange"
                                  @selectCascaderChange="selectCascaderChange"
                                />
                                <!-- 第五层 -->
                                <div v-for="(child5, child5Index) in child4.children" :key="refreshKey" v-if="child4.children.length">
                                  <el-form-item>
                                    <div slot="label" style="display:flex;align-items:center" v-if="child5.display">
                                      <span v-if="child5.required && child5.display" class="star">*</span>
                                      <span v-if="child5.display && child3.type != 'button' && child5.type != 'button'">
                                        <span v-if="child5.name.indexOf('#') > 0">
                                          {{ child5.name.replace("#", child4Index + 1) }}
                                        </span>
                                        <span v-else>{{ child5.name }}</span>
                                      </span>
                                      <span v-if="child5.unit">（{{ child5.unit }}）</span>
                                      <span v-if="child5.display && child3.type != 'button' && child4.type != 'button' && child5.name.indexOf('#')==-1">{{ child4Index + 1 }}</span>
                                      <span v-if="child5.type == 'img' && child5.display">（最多上传{{ child5.length }}张图片）</span>
                                      <span v-if="child5.tip" class="tips">
                                        <el-tooltip effect="dark" :content="child5.tip.content" placement="top-start">
                                          <i class="el-icon-warning-outline"></i>
                                        </el-tooltip>
                                      </span>
                                      <el-link class="delete-link" v-if="child5.styleJsonDto && child5.styleJsonDto.deleteIcon && child4Index + 1 > child4.rangeMin" @click="deleteItem(child4)"
                                        >删除</el-link
                                      >
                                    </div>
                                    <reportIndex
                                      v-if="child5.display"
                                      :formItem="child5"
                                      :reportId="paramReportType"
                                      :paramReportNodeList="paramReportNode"
                                      @handleAddBlock="handleAddBlock"
                                      @handleAddFile="handleAddFile"
                                      @dateTimeChange="dateTimeChange"
                                      @inputDropChange="inputDropChange"
                                      @timeRangeFun="timeRangeFun"
                                      @dynamicSelectChange="dynamicSelectChange"
                                      @radioCommonChange="radioCommonChange"
                                      @selectCommonChange="selectCommonChange"
                                      @selectCommonVisibleChange="selectCommonVisibleChange"
                                      @commonCheckBoxChange="commonCheckBoxChange"
                                      @selectMultipleChange="selectMultipleChange"
                                      @selectCommonApiChange="selectCommonApiChange"
                                      @selectCascaderChange="selectCascaderChange"
                                    />
                                    <!-- 第六层 -->
                                    <div v-for="(child6, child6Index) in child5.children" :key="refreshKey" v-if="child5.children.length">
                                      <el-form-item>
                                        <div slot="label" style="display:flex;align-items:center" v-if="child6.display">
                                          <span v-if="child6.required && child6.display" class="star">*</span>
                                          <span v-if="child6.display && child4.type != 'button' && child6.type != 'button'">
                                            <span v-if="child6.name.indexOf('#') > 0">
                                              {{ child6.name.replace("#", child5Index + 1) }}
                                            </span>
                                            <span v-else>{{ child6.name }}</span>
                                          </span>
                                          <!-- <span v-if="child6.display && child4.type != 'button' && child6.type != 'button'">{{ child6.name }}</span> -->
                                          <span v-if="child6.unit">（{{ child6.unit }}）</span>
                                          <span v-if="child6.display && child4.type != 'button' && child5.type != 'button' && child6.name.indexOf('#') == -1">{{ child5Index + 1 }}</span>
                                          <span v-if="child6.type == 'img' && child6.display">（最多上传{{ child6.length }}张图片）</span>
                                          <span v-if="child6.tip" class="tips">
                                            <el-tooltip effect="dark" :content="child6.tip.content" placement="top-start">
                                              <i class="el-icon-warning-outline"></i>
                                            </el-tooltip>
                                          </span>
                                          <!--  &&
                                          !(child3.name.includes('火花塞') || child3.name.includes('喷油嘴')) &&
                                          paramReportType == 19 -->
                                          <el-link class="delete-link" v-if="child6.styleJsonDto && child6.styleJsonDto.deleteIcon && child5Index + 1 > child5.rangeMin" @click="deleteItem(child5)"
                                            >删除</el-link
                                          >
                                        </div>
                                        <reportIndex
                                          v-if="child6.display"
                                          :formItem="child6"
                                          :reportId="paramReportType"
                                          :paramReportNodeList="paramReportNode"
                                          @handleAddBlock="handleAddBlock"
                                          @handleAddFile="handleAddFile"
                                          @dateTimeChange="dateTimeChange"
                                          @inputDropChange="inputDropChange"
                                          @timeRangeFun="timeRangeFun"
                                          @dynamicSelectChange="dynamicSelectChange"
                                          @radioCommonChange="radioCommonChange"
                                          @selectCommonChange="selectCommonChange"
                                          @selectCommonVisibleChange="selectCommonVisibleChange"
                                          @commonCheckBoxChange="commonCheckBoxChange"
                                          @selectMultipleChange="selectMultipleChange"
                                          @selectCommonApiChange="selectCommonApiChange"
                                          @selectCascaderChange="selectCascaderChange"
                                        />
                                      </el-form-item>
                                    </div>
                                  </el-form-item>
                                </div>
                                <div>
                                  <el-button size="small" @click.stop.prevent="addFireOrFuel(child3)" v-if="child4.name == '火花塞' && !child4.display && paramReportType == 19" style="margin-top:20px"
                                    >添加火花塞检查</el-button
                                  >
                                  <el-button size="small" @click.stop.prevent="addFireOrFuel(child3)" v-if="child4.name == '喷油嘴' && !child4.display && paramReportType == 19" style="margin:20px 0"
                                    >添加喷油嘴检查</el-button
                                  >
                                </div>
                              </el-form-item>
                            </div>
                          </el-form-item>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
    <!-- 润滑脂加脂周期优化报告 -润滑脂润滑轴承参数和加脂周期计算-->
    <div v-if="cardItem.isCountAddFatFlag">
      <addFatCycleCommon :addFatCycleItem="cardItem" @countAddFatResult="countAddFatResult" @isShowFatliquoringCycleResult="isShowFatliquoringCycleResult"/>
    </div>
    <!-- 选择tabs -->
    <el-dialog
      title="请选择检查项目"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%">
      <div style="width:100%">
        <el-table
          ref="multipleTable"
          stripe
          border
          :show-header="false"
          :data="chooseTabsList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectEnable">
          </el-table-column>
          <el-table-column
            prop="name">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="danger" @click="saveChooseTab" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑设备弹框 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addDeviceDialog="addDeviceDialog"
      :epInfo='epInfo'
      :resource="resource"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
    <ViewProductDrawer
      :visible="ViewProductDrawerVisible"
      :data="ViewProductData"
    ></ViewProductDrawer>
  </el-card>
</template>

<script>
import CreateDevice from '../../../equipment/components/CreateDevice.vue'
import oilInspectionReport from './oilInspectionReport.vue'
import reportIndex from "@/components/businessComponents/components/report-index";
import handleReport from "@/components/businessComponents/components/handleReport";
import fillAndRefreshInfo from "@/components/parameterReport/reportCommon/components/fillAndRefreshInfo";
import addFatCycleCommon from './addFatCycleCommon'
import lubricationConditionEvaluationCountAverage from "@/components/businessComponents/components/lubrication_condition_evaluation_count_average";
import ViewProductDrawer from './ViewProductDrawer.vue'
export default {
  mixins: [handleReport, fillAndRefreshInfo],
  components: {
    CreateDevice,
    reportIndex,
    lubricationConditionEvaluationCountAverage,
    oilInspectionReport,
    addFatCycleCommon,
    ViewProductDrawer
  },
  props: {
    refreshFlag:{
      type: Boolean,
      default: false,
    },
    stepList: {
      type: Array,
      default: []
    },
    cardItem: {
      type: Object,
      default: {}
    },
    addFieldPoolDtoList: {
      type: Array,
      default: []
    },
    deviceDetailObj: {
      type: Object,
      default: {}
    },
    paramReportType: {
      type: Number,
      default: null
    },
    paramReportNode: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      refreshItem: {},
      editDeviceType:'',
      resource: '',
      epInfo: {},
      addDeviceDialog: false,
      deviceTypeDialog: 'editDeviceAndLumPoint',
      selectLubricationPointNumber: "",
      optId: {},
      fileDtoItem: [],
      refreshKey: 1,
      renderList: [],
      handleDataRecord: {},
      existLubNumbers: [],
      deviceToIndex: {},
      activeTab:'',
      dialogVisible:false,
      chooseTabsList:[],
      defaultCheckedTabsList:['key_ye_ya_xtyxqkdc','key_ye_ya_ypjc','key_ye_ya_yxjc','key_ye_ya_ybjc','key_ye_ya_glqjc','key_ye_ya_hrqjc','key_ye_ya_jysbjc'],
      checkedTabsList:[],
      tipImgSrc:'',
      reportId:'',
      refreshKeyPosition:1,
      openGearOperationStatus:'',
      bigGearList:[],
      smallGearList:[],
      bigGearEchartsBlock:[],
      smallGearEchartsBlock:[],
      oilChangeNum:null, // 换油周期数值
      oilChangeUnit :'', // 换油周期单位
      oilChangeHour : null,   // 换油周期转换为小时
      OilChangeLastTime :'' , // 上次换油日期
      nowTimeStamp : Date.parse(new Date()),  // 当前时间的时间戳
      intervalTime: null ,  // 实际时间间隔 单位为小时
      oilChangeTimeStamp : null, // 上次换油日期转换为时间戳
      everyMonthAddNum: '', // 每月润滑剂添加量
      // --------------------
      ViewProductDrawerVisible: false,
      ViewProductData: {},
      ViewProductItem: [],
      viewProductLoading: false,
      flushOverview:[
        '1 排放旧油,清洁系统. 2 添加冲洗油/工作油,按建议时长冲洗系统. 3 排放冲洗用油,清洁系统,更换滤芯等部件. 4 添加工作油,进行开机前冲洗. 5 达到系统清洁度再开机运行.',
        '1 添加专用清洁剂,随旧油运行时清洗. 2 排放旧油,清洁系统. 3 添加冲洗油/工作油,按建议时长冲洗系统. 4 排放冲洗用油,清洁系统,更换滤芯等部件.5 添加工作油,进行开机前冲洗. 6 达到系统清洁度再开机运行.',
      ]
    };
  },
  watch: {
    cardItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.handleRegItem();
          this.handleLubGroup(JSON.parse(JSON.stringify(val)));
          this.handleSelectCommonDisabled();
          // if (this.paramReportType == 23 && val.nodeName == "设备系统信息") {
          //   //闭式齿轮内窥镜检查-设备系统信息，写死判断
          //   this.handleDeviceInfoShow();
          // }
          if(val.tabFlag && !this.activeTab){
            this.activeTab = val.nodeValue.filter(it=>{
              return it.type == 'tab' && it.nameKey && it.display
            })[0].nameKey
          }
          if(this.paramReportType==8 && this.activeTab == 'key_kscl_psxt'){
            this.paramReportNode.filter(it=>{
              return it.tabFlag
            })[0].nodeValue.forEach(item=>{
              if(item.nameKey == 'key_kscl_psxt' && !item.display){
                this.activeTab = 'key_kscl_rhjjc'
              }
            })
          }
          if(!this.chooseTabsList.length && val.tabFlag && this.paramReportType==5){
            const list = val.nodeValue.filter(it=>{
              return it.type == 'tab' && it.nameKey
            })
            this.chooseTabsList = _.cloneDeep(list)
          }
          this.viewProductLoading = true
          this.overviewOil()
          this.$forceUpdate();
        }
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    getViewProductDis () {
      return function (val) {
        let dis = this.ViewProductItem.filter(h => val.id === h.id)[0] ? this.ViewProductItem.filter(h => val.id === h.id)[0].viewProductDis : true
        return dis
      }
    },
    getViewProductData () {
      return function (val) {
        return this.ViewProductItem.filter(h => val.id === h.id)[0].ViewProductData
      }
    }
  },
  created(){
    this.cardItem.nodeValue.forEach(field => {
      this.FULLSCREENLOADING()
      this.handleHiddenOrShow(field)
      this.FULLSCREENENDLOADING()
    });
    if(this.cardItem.isShowEdit){
      this.cardItem.nodeValue.forEach(item=>{
        this.handleHiddenOrShow(item)
      })
    }
    if(this.paramReportType == 21 && this.cardItem.nodeName == "设备系统清洗信息"){
      this.handleRadioEleHideOrShow()
    }
    if(this.paramReportType == 8){
      let everyMonthAddItemObj
      let everyMonthAddVal
      let monthWorkNum
      this.stepList[0].nodeValue.forEach(it=>{
        if(it.nameKey == 'key_every_month_add_num'){
          everyMonthAddItemObj = it
        }
      })
      const injectionSystemitem =  this.stepList.filter(it=>{
        return it.tabFlag
      })[0].nodeValue.filter(item=>{
        return item.nameKey == 'key_kscl_psxt'
      })[0].children[0].children.filter(ps=>{
        return ps.nameKey == 'key_1060'
      })[0].children
      injectionSystemitem.forEach(it=>{
        // 每月润滑剂添加量
        if(it.nameKey == 'key_every_month_add_num'){
          if(everyMonthAddItemObj.unit=='KG'){
            it.value = (everyMonthAddItemObj.value/0.87).toFixed(2)
          }else {
            it.value = everyMonthAddItemObj.value
          }
          it.unit = 'L'
          everyMonthAddVal = it.value
        }
      })
      injectionSystemitem.forEach(it=>{
        // 月工作时间
        if(it.nameKey == 'key_kscl_psxt_psxt_ygzsj'){
          monthWorkNum = it.value
        }
      })
      // 实际每分钟喷射量
      injectionSystemitem.forEach(it=>{
        if(it.nameKey == 'key_kscl_psxt_psxt_sjmfzpsl'){
          if(everyMonthAddVal && monthWorkNum){
            it.value = ((Number(everyMonthAddVal)*1000)/(Number(monthWorkNum)*60)).toFixed(3)
          }else{
            it.value = ''
          }
        }
      })
      // 处理设备&润滑&用油信息字段显隐
      if(this.cardItem.nodeNo==1){
        this.handleOpenGearDeviceAndOilInfo(this.cardItem.nodeValue)
      }
    }
    if(this.paramReportType==11 && (this.cardItem.nodeName=='换油基本信息' || this.cardItem.nodeName=='换油冲洗建议')){
      this.handleChangeOilSuggestNode()
    }
    if(this.paramReportType==24 && this.cardItem.nodeNo==1){
      // 找出润滑点设备类型，开式齿轮
      const lupDeviceType = this.cardItem.nodeValue.filter(it=>{
        return it.nameKey=='lup_type'
      })[0].value
      // 找出润滑方式,喷射：lubrication_method_0003
      const lupMethod = this.cardItem.nodeValue.filter(it=>{
        return it.nameKey=='lup_method'
      })[0].valueCode
      // 定期或按质换油、换油周期、上次换油日期不是开式齿轮且喷射展示
      const nameKeyList = ['key_dq_az','key_149_oil_change','lup_last_oil_change_date']
      if(lupDeviceType == '开式齿轮' && lupMethod == 'lubrication_method_0003'){
        this.cardItem.nodeValue.forEach(it=>{
          if(nameKeyList.includes(it.nameKey)){
            it.display = false
          }
        })
      }
    }
    if(this.paramReportType==7 && this.cardItem.nodeNo==1){
      this.handleBearingDeviceAndOilInfo(this.cardItem.nodeValue)
    }
    if(this.paramReportType==33 && this.cardItem.nodeNo==2){
      this.handlePlanStudyLupInfo(this.cardItem.nodeValue)
    }
  },
  methods: {
    father() {
      this.$emit('fMethod');
    },
    // 查看油品推荐按钮
    overviewOil () {
      if(this.cardItem.reportType !=3) return
      this.$nextTick(() => {
        this.cardItem.nodeValue.map((item,i) => {
          if (item.nodeNo === 2) {
            item.children.map(j => {
              this.ViewProductItem.push({
                id: j.id,
                viewProductDis: true,
                ViewProductData: {}
              })
              console.log(JSON.parse(JSON.stringify(j)),this.cardItem.nodeValue, j.deviceTypeCode)
              let deviceSecond = j.deviceTypeCode
              if(!deviceSecond && j.children){
                deviceSecond = j.children.find(child => child.nameKey == "device_type" ) ? j.children.find(child => child.nameKey == "device_type" ).valueCode : ""
              } 
              let params = {
                industryFirst: '',
                industrySecond: '',
                deviceFirst: '',
                deviceSecond: deviceSecond || '',
                lubPoint: j && j.children.filter(item => item.nameKey === 'lup_name')[0].value
              }
              console.log(params)
              this.getRecommendedOil(params, j)
            })
          }
        })
      })
      this.$forceUpdate()
    },
    // 获取油品数据
    getRecommendedOil (params, j) {
      this.requestMethodGet('/core/device/oil/getRecommendedOil', params).then(res => {
        let r = res.data
        if (r.code === 1000) {
          if (r.data.grease.length > 0 || r.data.mineralOil.length > 0 || r.data.syntheticOil.length > 0) {
            changeItemData(false, r.data, this)
          } else {
            changeItemData(true, {}, this)
          }
        } else {
          changeItemData(true, {}, this)
        }
        function changeItemData (sta, data, tha) {
          tha.ViewProductItem.map(item => {
            if (item.id === j.id) {
              item.viewProductDis = sta
              item.ViewProductData = data
            }
          })
        }
        this.viewProductLoading = false
        this.$forceUpdate()
      }).catch((err) => { console.log(err) })
    },
    // 查看推荐油品弹窗
    handlerViewProductDrawerShow (val) {
      if (!val.viewProductDis) {
        this.ViewProductData = val
        this.ViewProductDrawerVisible = true
      }
    },
    // 查看推荐油品弹窗关闭
    handlerViewProductDrawerClose () {
      this.ViewProductDrawerVisible = false
    },
    countAddFatResult(val){
      this.paramReportNode[this.paramReportNode.length-2].nodeValue.forEach(it=>{
        if(it.nameKey == 'key_4784'){
          it.value = val
        }
      })
    },
    handleChangeOilSuggestNode(){
      const secondNodeList = this.paramReportNode.filter(it=>{
        return it.nodeName == "换油基本信息"
      })[0].nodeValue
      const thirdNodeList = this.paramReportNode.filter(it=>{
        return it.nodeName == "换油冲洗建议"
      })[0].nodeValue
      this.handleChangeOilSuggestNodeTwo(secondNodeList)
      this.handleChangeOilSuggestNodeThree(thirdNodeList)
    },
    // 换油建议书-换油基本信息
    handleChangeOilSuggestNodeTwo(list){
      list.forEach(it=>{
        // 设备冲洗类型,新机冲洗:1,设备常规换油:2,设备用油品牌或型号更换:3
        if(it.nameKey=='key_1285') {
          sessionStorage.removeItem("typeFlushing")
          sessionStorage.setItem("typeFlushing", it.valueCode)
        }
        // 目前系统是否有如下情况
        if(it.nameKey=='key_1291') {
          sessionStorage.removeItem("situation");
          sessionStorage.setItem("situation", it.valueCheckBoxList)
        }
        // 相容性结论,相容:1,不相容:2,边界：3，未知：4
        if(it.nameKey=='key_1288') {
          sessionStorage.removeItem("compatibilityConclusion");
          sessionStorage.setItem("compatibilityConclusion", it.valueCode)
        }
      })
    },
    // 换油建议书-换油冲洗建议
    handleChangeOilSuggestNodeThree(list){
      const oilChangeState = this.deviceDetailObj.oilChangeState.split(',')
      // 冲洗油
     list.forEach(it=>{
        if(it.nameKey=='key_1295') {
            sessionStorage.setItem("valueCodeOilFushing", it.valueCode);
        }
      })
      // 获取设备冲洗类型
      this.typeFlushing = sessionStorage.getItem('typeFlushing')
      // 获取目前系统是否有如下情况
      this.situation = sessionStorage.getItem('situation')
      // 获取相容性结论
      this.compatibilityConclusion = sessionStorage.getItem('compatibilityConclusion')
      // 判断定制（1,3,4），基础，增强
      const result = oilChangeState.find(item =>{
          return item==1 || item==3 ||item==4
      });
      let level = ''
      if(result) {  // 如果是定制
        this.result = true
        level = '定制'
          list.forEach(it=>{
              if(it.nameKey=='key_1292') {
                  it.value='定制'
              }
              if(it.nameKey=='key_1293') {
                  it.value='建议咨询美孚专家，定制冲洗方案'
              }
              if(it.nameKey=='key_1294') {
                  it.type='textarea'
                  it.length=500
                  if(it.value == this.flushOverview[0] || it.value == this.flushOverview[1]){
                    it.value=''
                  }
              }
              // 清洁剂冲洗时长不展示
              if(it.nameKey=='key_1298') {
                  it.display=false
              }
          })
        } else {  
          // 如果不是定制 要根据换油周期 和 换油间隔判断
          // 获取换油周期和上次换油日期
          const deviceChild = this.paramReportNode.filter(it=>{
            return it.nodeName == '设备&润滑&用油信息'
          })[0].nodeValue
          deviceChild.forEach(it=>{
              if(it.nameKey=='key_149_oil_change') {
                  this.oilChangeNum = it.value
                  this.oilChangeUnit = it.unit
              }
              if(it.nameKey=='lup_last_oil_change_date') {
                  this.OilChangeLastTime = it.value
              }
          })
          this.getOilChangeMsg()
        }
        if(level){
          this.handleAppendix(level)
        }
    },
    getOilChangeMsg() {
        this.oilChangeTimeStamp = new Date(this.OilChangeLastTime).getTime()
        this.intervalTime = (this.nowTimeStamp-this.oilChangeTimeStamp)/1000/60/60   // 实际时间间隔 单位为小时
        // 换油周期转换为 小时
        if(this.oilChangeUnit=='小时') {
            this.oilChangeHour = this.oilChangeNum
        } else if(this.oilChangeUnit=='天') {
            this.oilChangeHour = this.oilChangeNum*24
        }else if(this.oilChangeUnit=='月') {
            this.oilChangeHour = this.oilChangeNum*24*30
        }else if(this.oilChangeUnit=='年') {
            this.oilChangeHour = this.oilChangeNum*24*30*12
        }
        this.calculateFlushingLevel(this.intervalTime,this.oilChangeHour)
    },
    // 计算冲洗等级
    calculateFlushingLevel(intervalTime,oilChangeHour) {
        let level;
        const threeNode = this.paramReportNode.filter(it=>{
          return it.nodeName=='换油冲洗建议'
        })[0].nodeValue
        if(this.typeFlushing=='1') {
            level='基础'
            threeNode.forEach(it=>{
              if(it.nameKey=='key_1292') {
                  it.value='基础'
              }
              if(it.nameKey=='key_1293') {
                  it.value='建议两段式冲洗'
              }
              if(it.nameKey=='key_1294') {
                  it.type='string'
                  it.value= this.flushOverview[0]
              }
              // 清洁剂冲洗时长不展示
              if(it.nameKey=='key_1298') {
                  it.display=false
              }
            })
        } else if(this.typeFlushing=='2'){
            // 实际换油间隔≥2倍换油周期”或者“实际换油间隔超过3年”时，冲洗等级判断为“增强”；
            if(intervalTime>=(2*oilChangeHour) || (intervalTime/24/30/12)>=3) {
                level='增强'
                threeNode.forEach(it=>{
                  if(it.nameKey=='key_1292') {
                      it.value='增强'
                  }
                  if(it.nameKey=='key_1293') {
                      it.value='建议添加系统清洁剂的三段式冲洗'
                  }
                  if(it.nameKey=='key_1294') {
                      it.type='string'
                      it.value=this.flushOverview[1]
                  }
                  // 清洁剂冲洗时长展示
                  if(it.nameKey=='key_1298') {
                      it.display=true
                  }
                })
            }
            // 实际换油间隔≤2倍换油周期
            if(intervalTime<2*oilChangeHour) {
              threeNode.forEach(it=>{
                if(it.nameKey=='key_1292') {
                    it.value='基础'
                }
                if(it.nameKey=='key_1293') {
                    it.value='建议两段式冲洗'
                }
                if(it.nameKey=='key_1294') {
                    it.type='string'
                    it.value=this.flushOverview[0]
                }
                // 清洁剂冲洗时长不展示
                if(it.nameKey=='key_1298') {
                    it.display=false
                }
              })
            }
        } else if(this.typeFlushing=='3') {
            // 如果字段-目前系统是否有如下情况，勾选了任意项”，冲洗等级判断为“基础”；
            if(this.situation.length>0) {
                level='增强'
                threeNode.forEach(it=>{
                  if(it.nameKey=='key_1292') {
                      it.value='增强'
                  }
                  if(it.nameKey=='key_1293') {
                      it.value='建议添加系统清洁剂的三段式冲洗'
                  }
                  if(it.nameKey=='key_1294') {
                      it.type='string'
                      it.value=this.flushOverview[1]
                  }
                  if(it.nameKey=='key_1298') {
                      it.display=true
                  }
                })
            } else {
                if(this.compatibilityConclusion=='1' || this.compatibilityConclusion=='3') {
                    level='基础'
                    threeNode.forEach(it=>{
                      if(it.nameKey=='key_1292') {
                          it.value='基础'
                      }
                      if(it.nameKey=='key_1293') {
                          it.value='建议两段式冲洗'
                      }
                      if(it.nameKey=='key_1294') {
                          it.value=this.flushOverview[0]
                      }
                      // 清洁剂冲洗时长不展示
                      if(it.nameKey=='key_1298') {
                          it.display=false
                      }
                    })
                }
                if(this.compatibilityConclusion=='2' || this.compatibilityConclusion=='4') {
                    level='增强'
                    threeNode.forEach(it=>{
                      if(it.nameKey=='key_1292') {
                          it.value='增强'
                      }
                      if(it.nameKey=='key_1293') {
                          it.value='建议添加系统清洁剂的三段式冲洗'
                      }
                      if(it.nameKey=='key_1294') {
                          it.type='string'
                          it.value=this.flushOverview[1]
                      }
                      // 清洁剂冲洗时长展示
                      if(it.nameKey=='key_1298') {
                          it.display=true
                      }
                    })
                }
                
            }
        }
      sessionStorage.removeItem("valueCodeOilLevel");
      sessionStorage.setItem("valueCodeOilLevel", level);
      this.handleAppendix(level)
    },
    handleAppendix(level){
      this.paramReportNode[this.paramReportNode.length-1].nodeValue[0].children.forEach(it=>{
        if(it.nameKey=='key_4775' || it.nameKey=='key_4774'){
          it.display = level=='增强'
        }
      })
    },
    handleAppendixIndex(item,child){
      let idx
      let list = item.children.filter(it=>{
        return it.display
      })
      list.forEach((it,index)=>{
        if(it.id == child.id){
          idx = index+1
        }
      })
      return idx
    },
    inputNumberBlurFunc(item){
      this.reportId = this.paramReportType
      this.paramReportNodeList = this.paramReportNode
      this.handleInputNumberBlur(item)
      // 开式齿轮检查-由每月润滑剂添加量：key_every_month_add_num，月工作时间：key_kscl_psxt_psxt_ygzsj，
      // 计算实际每分钟喷射量:key_kscl_psxt_psxt_sjmfzpsl
      if(this.paramReportType == 8 && item.nameKey=='key_kscl_psxt_psxt_ygzsj'){
        const ygzsjVal = item.value
        // 找出每月润滑剂添加量的值
        this.everyMonthAddNum = ''
        this.handleEveryMonthAddNum(this.cardItem.nodeValue,'key_every_month_add_num')
        this.handleInjectionQuantity(this.cardItem.nodeValue,'key_kscl_psxt_psxt_sjmfzpsl',ygzsjVal)
      }
    },
    handleEveryMonthAddNum(arr,targetNameKey){
      arr.forEach(it => {
        if (it.nameKey == targetNameKey) {
          this.everyMonthAddNum = it.value
          if (it.children.length) {
            this.handleEveryMonthAddNum(it.children, targetNameKey)
          }
          return;
        } else {
          if (it.children.length) {
            this.handleEveryMonthAddNum(it.children, targetNameKey)
          }
        }
      })
    },
    handleInjectionQuantity(arr,targetNameKey,val){
      arr.forEach(it => {
        if (it.nameKey == targetNameKey) {
          if(this.everyMonthAddNum && val){
            it.value = ((Number(this.everyMonthAddNum)*1000)/(Number(val)*60)).toFixed(3)
          }else{
            it.value = ''
          }
          if (it.children.length) {
            this.handleInjectionQuantity(it.children, targetNameKey,val)
          }
          return;
        } else {
          if (it.children.length) {
            this.handleInjectionQuantity(it.children, targetNameKey,val)
          }
        }
      })
    },
    deletePosition(item,child){
      item.children.forEach((it,index)=>{
        if(it.id == child.id){
          item.children.splice(index,1)
        }
      })
      this.reportId = this.paramReportType
      this.paramReportNodeList = this.paramReportNode
      this.handleInputNumberBlur(child)
    },
    viewRefer(item){
      this.requestMethodGet('/web/file/getFullUrl', {url: item.content}).then(res => {
        if (res.data.code == 1000) {
          this.tipImgSrc = res.data.data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    chooseTabs(){
      this.dialogVisible = true
      let list = []
      this.cardItem.nodeValue.forEach(it=>{
        if(it.type=='tab' && it.display){
          list.push(it.nameKey)
        }
      })
      this.$nextTick(()=>{
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.chooseTabsList.length; j++) {
            if (list[i] == this.chooseTabsList[j].nameKey) {
              this.$refs.multipleTable.toggleRowSelection(this.chooseTabsList[j], true);
            }
          }
        }
      })
    },
    saveChooseTab(){
      const list = [...new Set(this.checkedTabsList.concat(this.defaultCheckedTabsList))]
      this.cardItem.nodeValue.forEach(it=>{
        if(it.type=='tab'){
          it.display = list.includes(it.nameKey)
        }
      })
      this.activeTab = this.cardItem.nodeValue.filter(it=>{
        return it.type == 'tab' && it.nameKey && it.display
      })[0].nameKey
      this.dialogVisible = false
    },
    handleSelectionChange(val){
      this.checkedTabsList = val.map(it=>{
        return it.nameKey
      })
    },
    selectEnable(row, rowIndex){
      return !(this.defaultCheckedTabsList.includes(row.nameKey))
    },
    // handleDeviceInfoShow() {
    //   let lubricationMethod = this.cardItem.nodeValue.filter(it => {
    //     return it.nameKey == "lup_method";
    //   })[0].value;
    //   this.cardItem.nodeValue.forEach(item => {
    //     if (
    //       item.nameKey == "key_dq_az" ||
    //       item.nameKey == "key_149_oil_change" ||
    //       item.nameKey == "lup_last_oil_change_date" ||
    //       item.nameKey == "lup_oil_add_date" ||
    //       item.nameKey == "lup_per_refueling" ||
    //       item.nameKey == "lup_last_oil_add_date"
    //     ) {
    //       // 展示定期或按质换油、换油周期、上次换油日期、加油周期、每次加油量、上次加油日期
    //       item.display = lubricationMethod == "飞溅/油浴" || lubricationMethod == "循环" || lubricationMethod == "油雾";
    //     } else if (item.nameKey == "lup_grease_add_date" || item.nameKey == "lup_per_grease" || item.nameKey == "lup_last_grease_change_date") {
    //       // 展示加脂周期、每次加脂量、上次加脂日期
    //       item.display = lubricationMethod == "其它脂润滑";
    //     }
    //   });
    // },
    // 计算平均值
    countAverageVal(childId) {
      /***
       * 1.找出此次计算的父级
       * 2.找出计算的所有子集，长度减1
       * 3.把子集中的类型为dropdown2且valueCode有值的放进数组中
       * 4.数组长度和子集长度减1比较，相等说明所有下拉值都选择了
       * 5.如果长度相等，对数组内容处理，含有“不合适”的剔除后计算平均值后赋值
       * 6.若剔除后数组长度为0则说明所选择的全部为“不合适”则平均值为=不合适
       * 7.平均值为有效值相加除以数组长度
       * ***/
      let childLg = 0;
      let valueCodeList = [];
      let averageVal = "";
      this.cardItem.nodeValue.forEach(item => {
        if (childId == item.id && item.type == "average") {
          childLg = item.children.length - 1;
          item.children.forEach(it => {
            if (it.type == "dropdown2" && it.valueCode) {
              valueCodeList.push(it.valueCode);
            }
          });
        }
      });
      if (valueCodeList.length) {
        let newArr = [];
        if (valueCodeList.length == childLg) {
          newArr = valueCodeList.filter(it => {
            return it != "未评估";
          });
          if (newArr.length) {
            let lg = newArr.length;
            let total = newArr.reduce(function(total, value) {
              return total + Number(value);
            }, 0);
            averageVal = (total / lg).toFixed(2);
          } else {
            averageVal = "未评估";
          }
        } else {
          averageVal = "暂无";
        }
      } else {
        averageVal = "暂无";
      }
      this.cardItem.nodeValue.forEach(item => {
        if (childId == item.id && item.type == "average") {
          item.children.forEach(it => {
            if (it.type == "string") {
              it.value = averageVal;
            }
          });
        }
      });
    },
    // 年月日时分选择值
    dateTimeChange(item) {
      if (this.deviceDetailObj.reportType == 21) {
        this.handleTimeDiff(item);
      }
    },
    handleTimeDiff(item) {
      // 计算实际停机冲洗总时长
      if (item.nameKey == "actual_downtime" && item.value) {
        // actual_downtime,实际停机时间
        let actualFinshtime = "";
        this.cardItem.nodeValue.forEach(itemA => {
          if (itemA.nameKey == "actual_finish_time") {
            actualFinshtime = itemA.value;
          }
        });
        if (!actualFinshtime) {
          return;
        }
        this.cardItem.nodeValue.forEach(itemB => {
          if (itemB.nameKey == "actual_finish_duration") {
            // 计算实际停机清洁总时长
            if (this.calculateTime(item.value, actualFinshtime) < 0) {
              this.$message({
                type: "warning",
                message: "实际停机时间需小于实际交付时间。"
              });
              itemB.value = "";
              item.value = "";
              return;
            }
            itemB.value = this.calculateTime(item.value, actualFinshtime);
          }
        });
      }
      // actual_finish_time,实际交付时间
      if (item.nameKey == "actual_finish_time" && item.value) {
        let actualDowntime = "";
        this.cardItem.nodeValue.forEach(itemA => {
          if (itemA.nameKey == "actual_downtime") {
            actualDowntime = itemA.value;
          }
        });
        if (!actualDowntime) {
          this.$message({
            type: "warning",
            message: "请先选择实际停机时间。"
          });
          return;
        }
        this.cardItem.nodeValue.forEach(itemB => {
          if (itemB.nameKey == "actual_finish_duration") {
            // 计算实际停机清洁总时长
            if (this.calculateTime(actualDowntime, item.value) < 0) {
              this.$message({
                type: "warning",
                message: "实际交付时间需大于实际停机时间。"
              });
              itemB.value = "";
              item.value = "";
              return;
            }
            itemB.value = this.calculateTime(actualDowntime, item.value);
          }
        });
      }
      // 达到清洁度时长（小时）
      if (item.nameKey == "circle_start_time" && item.value) {
        // 循环开启时间
        let endCleantime = "";
        this.cardItem.nodeValue.forEach(itemA => {
          if (itemA.nameKey == "end_clean_time") {
            // 达到目标清洁度时间
            endCleantime = itemA.value;
          }
        });
        if (!endCleantime) {
          return;
        }
        this.cardItem.nodeValue.forEach(itemB => {
          if (itemB.nameKey == "end_clean_duration") {
            // 计算实际停机清洁总时长
            if (this.calculateTime(item.value, endCleantime) < 0) {
              this.$message({
                type: "warning",
                message: "循环开启时间需小于达到目标清洁度时间。"
              });
              itemB.value = "";
              item.value = "";
              return;
            }
            itemB.value = this.calculateTime(item.value, endCleantime);
          }
        });
      }
      // 达到清洁度时长（小时）
      if (item.nameKey == "end_clean_time" && item.value) {
        // 达到目标清洁度时间
        let circleStarttime = "";
        this.cardItem.nodeValue.forEach(itemA => {
          if (itemA.nameKey == "circle_start_time") {
            // 循环开启时间
            circleStarttime = itemA.value;
          }
        });
        if (!circleStarttime) {
          this.$message({
            type: "warning",
            message: "请先选择循环开启时间。"
          });
          return;
        }
        this.cardItem.nodeValue.forEach(itemB => {
          if (itemB.nameKey == "end_clean_duration") {
            // 计算实际停机清洁总时长
            if (this.calculateTime(circleStarttime, item.value) < 0) {
              this.$message({
                type: "warning",
                message: "达到目标清洁度时间需大于循环开启时间。"
              });
              itemB.value = "";
              item.value = "";
              return;
            }
            itemB.value = this.calculateTime(circleStarttime, item.value);
          }
        });
      }
      if(item.nameKey == "plan_time_start" || item.nameKey == "plan_time_end"){
        this.countCleanPlan(item)
      }
    },
    countCleanPlan(item){
      // 计算清洗计划（小时）：clean_plan
      // 计划开始时间：plan_time_start，预估交付时间：plan_time_end
      let clean_plan_time = ''
      const nodeValList = this.paramReportNode.filter(it=>{
        return it.nodeNo ==2
      })[0].nodeValue
      let plan_time_start = nodeValList.filter(it=>{
        return it.nameKey == 'plan_time_start'
      })[0].value
      let plan_time_end = nodeValList.filter(it=>{
        return it.nameKey == 'plan_time_end'
      })[0].value
      if(plan_time_start && plan_time_end){
        plan_time_start = plan_time_start + ':00'
        plan_time_end = plan_time_end + ':00'
        let planHours = this.calculateTime(plan_time_start,plan_time_end)
        if(planHours<0){
          this.$message({
            type:'warning',
            message:'请注意，计划开始时间要早于预估交付时间'
          })
          item.value = ''
          clean_plan_time = ''
        }else{
          clean_plan_time = planHours
        }
      }else{
        clean_plan_time = ''
      }
      nodeValList.forEach(it=>{
        if(it.nameKey == 'clean_plan'){
          it.value = clean_plan_time
        }
      })
    },
    // 计算时间差
    timeRangeFun(item) {
       // 计算结束时间与开始时间的小时
      // if (this.deviceDetailObj.reportType == 21) {
      //   let val = item.valueCheckBoxList;
      //   this.cardItem.nodeValue.forEach(itemA => {
      //     if (itemA.nameKey == "clean_plan") {
      //       if (!val) {
      //         itemA.value = "";
      //       } else {
      //         let time1 = val[0] + ":00";
      //         let time2 = val[1] + ":00";
      //         itemA.value = this.calculateTime(time1, time2);
      //       }
      //     }
      //   });
      //   if (item.valueCheckBoxList) {
      //     item.value = item.valueCheckBoxList.toString();
      //   }
      // }
    },
    calculateTime(time1, time2) {
      let time3 = new Date(time2).getTime() - new Date(time1).getTime(); // 时间差的毫秒数
      let mins = time3 / (60 * 1000);
      let planHours = Math.round((mins * 100) / 60) / 100; // 保留两位小数
      return planHours;
    },
    // 添加火花塞,喷油嘴
    addFireOrFuel(item) {
      item.children.forEach(it => {
        if (it.name.includes("图片和描述父级")) {
          it.children.forEach(pt => {
            pt.children.forEach(cd => {
              cd.display = true;
            });
          });
        } else {
          it.display = true;
        }
      });
      item.styleJsonDto.cylinderCheckFieldShow = true;
    },
    // 删除火花塞，喷油嘴
    hiddenFireOrFuel(item) {
      item.children.forEach(it => {
        if (it.name.includes("图片和描述父级")) {
          it.children.forEach(pt => {
            pt.children.forEach(cd => {
              cd.display = false;
            });
          });
        } else {
          it.display = false;
        }
      });
      item.styleJsonDto.cylinderCheckFieldShow = false;
    },
    findFieldAccordingNameKey(dataItemChildren, nameKey) {
      return dataItemChildren.find(item => item.nameKey == nameKey);
    },

    calcIndex(child) {
      const field_key_device_number = this.findFieldAccordingNameKey(child.children, "key_device_number");
      return this.renderList.findIndex(item => item.field_key_device_number.value == field_key_device_number.value) + 1;
    },
    judegeShowing(child) {
      const field_key_device_number = this.findFieldAccordingNameKey(child.children, "key_device_number");
      const renderTarget = this.renderList.find(item => item.field_key_device_number.value == field_key_device_number.value);
      if (!renderTarget || renderTarget.showing == true) return false;
      return true;
    },
    showLubGroupName(child) {
      const field_key_device_number = this.findFieldAccordingNameKey(child.children, "key_device_number");
      const renderTarget = this.renderList.find(item => item.field_key_device_number.value == field_key_device_number.value);
      if (!renderTarget || renderTarget.showing == true) return "";
      renderTarget.showing = true;
      return renderTarget.field_device_name_value;
    },
    resetData() {
      this.renderList = [];
      this.handleDataRecord = {};
      this.existLubNumbers = [];
      this.deviceToIndex = {};
    },
    handleLubIndex(child) {
      const field_key_device_number = this.findFieldAccordingNameKey(child.children, "key_device_number");
      if (!this.deviceToIndex[field_key_device_number.value]) {
        this.deviceToIndex[field_key_device_number.value] = 1;
        child._lubIdx = 1;
      } else {
        this.deviceToIndex[field_key_device_number.value]++;
        child._lubIdx = this.deviceToIndex[field_key_device_number.value];
      }
      return child._lubIdx;
    },
    handleLubGroup(cardItemVal) {
      const lubGroup = cardItemVal.nodeValue.find(item => item.nameKey == "key_device_lub_group");
      if (!lubGroup) return;
      this.resetData();
      lubGroup.children.forEach(dataItem => {
        this.handleDataItem(JSON.parse(JSON.stringify(dataItem)));
      });
    },
    judgeExist(key) {
      return this.handleDataRecord && this.handleDataRecord.hasOwnProperty(key);
    },

    handleDataItem(dataItem) {
      const field_key_device_number = this.findFieldAccordingNameKey(dataItem.children, "key_device_number");
      const field_device_name = this.findFieldAccordingNameKey(dataItem.children, "device_name");
      const key_lup_number = this.findFieldAccordingNameKey(dataItem.children, "key_lup_number");
      if (this.existLubNumbers.includes(key_lup_number)) return;
      this.existLubNumbers.push(key_lup_number);
      if (this.judgeExist(field_key_device_number.value)) {
        const setIndex = this.handleDataRecord[field_key_device_number.value].renderListIndex;
        this.renderList[setIndex].children.push(dataItem);
      } else {
        this.handleDataRecord[field_key_device_number.value] = {
          field_key_device_number,
          field_device_name,
          renderListIndex: this.renderList.length
        };
        const renderObj = {
          field_key_device_number,
          field_device_name,
          field_device_name_value: field_device_name.value,
          value: field_device_name.value,
          children: [dataItem]
        };
        this.renderList.push(renderObj);
      }
    },
    // 添加润滑点
    reportAddDeviceAndLup(item) {
      this.$emit("reportAddLubricationPoints", item);
    },
    // 添加块
    handleAddBlock(blockItem) {
      if (blockItem.nodeName.includes("附录")) {
        this.selectValueCodeList = [];
        this.handleSelectDisabled(this.cardItem.nodeValue);
        this.handleAddReportItem(blockItem, this.cardItem, true, this.selectValueCodeList);
      } else {
        this.$nextTick(()=>{
          this.handleAddReportItem(blockItem, this.cardItem);
        })
      }
      this.$forceUpdate()
    },
    // 处理下拉项中不可选择
    handleSelectDisabled(arr) {
      // 先找出"dropdown2"类型的且有valueCode值的字段
      // 找到当前字段的fieldOption数组
      // 根据已有的valueCode值对当前字段的fieldOption处理不可选
      arr.forEach(it => {
        if (it.nodeName.includes("附录") && it.name.includes("附录名称")) {
          if (it.type == "dropdown2" && it.valueCode && it.valueCode != "0") {
            this.selectValueCodeList.push(it.valueCode);
            return;
          } else {
            if (it.children.length) {
              this.handleSelectDisabled(it.children);
            }
          }
        }
        if (it.children.length) {
          this.handleSelectDisabled(it.children);
        }
      });
    },
    handleSelectCommonDisabled() {
      let list = [];
      this.stepList.forEach(it => {
        if (it.nodeName == "附录") {
          list = it.nodeValue.filter(item => {
            return item.type != "button";
          });
        }
      });
      if(list.length>0){
        list.forEach(item => {
          if(item.children.length>0){
            item.children.forEach(c => {
              if(c.children.length>0){
                c.children.forEach(d => {
                  if (d.name == "附录名称") {
                    this.selectValueCodeList = [];
                    this.handleSelectDisabled(list);
                    if (this.selectValueCodeList.length) {
                      d.fieldOption.forEach(it => {
                        it.disabled = this.selectValueCodeList.includes(it.value);
                      });
                    } else {
                      if (d.fieldOption) {
                        d.fieldOption.forEach(it => {
                          it.disabled = false;
                        });
                      }
                    }
                  }
                });
              }
            });
          }
      });
      }
    },
    // 删除块
    deleteItem(item) {
      // 需要后端配置-删除时需要二次确认的标识
      if (item.nameKey == "key_device_lub_parent") {
        this.$confirm("是否删除该润滑点?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteBlockItem(this.cardItem.nodeValue, item);
            ++this.refreshKey;
          })
          .catch(() => {});
      } else {
        this.deleteBlockItem(this.cardItem.nodeValue, item);
        ++this.refreshKey;
      }
    },
    deleteBlockItem(arr, item) {
      arr.forEach(it => {
        if (it.id == item.parentId) {
          it.children.forEach((cl, idx) => {
            if (cl.id == item.id) {
              it.children.splice(idx, 1);
            }
          });
          return;
        } else {
          if (it.children.length) {
            this.deleteBlockItem(it.children, item);
          }
        }
      });
    },
    // 上传文件
    handleAddFile(fileItem) {
      this.fileDtoItem = [];
      this.findFileDtoItem(this.cardItem.nodeValue, fileItem.bindingId);
      if (this.fileDtoItem.length > 9) {
        this.$message({
          type: "warning",
          message: "最多上传十个附件"
        });
        return;
      } else {
        this.addFileToItem(this.cardItem.nodeValue, fileItem, fileItem.bindingId);
      }
    },
    addFileToItem(arr, fileItem, bindingId) {
      arr.forEach(it => {
        if (it.id == bindingId) {
          it.serviceReportFileDtoList.push(fileItem);
          return;
        } else {
          if (it.children.length) {
            this.addFileToItem(it.children, fileItem, bindingId);
          }
        }
      });
    },
    // radio显隐控制
    radioCommonChange(radioItem) {
      this.handleHiddenOrShow(radioItem);
    },
    handleRadioEleHideOrShow(){
      let radioList = []
      this.cardItem.nodeValue.forEach(it=>{
        if(it.type == 'radio1'){
          radioList.push(it)
        }
      })
      radioList.forEach(it=>{
        this.handleHiddenOrShow(it);
      })
    },
    // checkbox事件
    commonCheckBoxChange(item) {
      this.handleHiddenOrShow(item);
    },
    // 输入+单位，输入值改变事件
    inputDropChange(item) {
      if (this.deviceDetailObj.reportType == 21) {
        this.handlePotency(item);
      }
    },
    handlePotency(item) {
      let potency = "";
      let cleanOil = ""; // 清洗剂油量
      let mailboxCapacity = ""; // 邮箱容量
      let oneCleanOil = ""; // 一次冲洗油量
      let addTo = this.stepList[2].nodeValue.find(it => {
        return it.nameKey == "key_add";
      });
      if (!addTo.valueCode) {
        return;
      }
      this.stepList[0].nodeValue.forEach(itemA => {
        if (itemA.nameKey == "lup_oil_box_capacity") {
          mailboxCapacity = itemA.value;
        }
      });
      if (item.nameKey == "oil_quantity") {
        // 清洗剂油量
        if (!item.value) {
          // 如果输入值为空，清空浓度
          this.resetPotency();
          return;
        }
        if (addTo.valueCode == 1) {
          // 选择的是在用油
          if (mailboxCapacity) {
            potency = Number(item.value) / Number(mailboxCapacity);
          }
        } else if (addTo.valueCode == 2) {
          // 选择的是一次冲洗用油
          this.stepList[1].nodeValue.forEach(itemA => {
            if (itemA.nameKey == "one_clean_oil_quantity") {
              oneCleanOil = itemA.value;
            }
          });
          if (oneCleanOil) {
            potency = Number(item.value) / Number(oneCleanOil);
          }
        }
      }

      if (item.nameKey == "one_clean_oil_quantity") {
        // 一次清洗用油量
        if (!item.value) {
          // 如果输入值为空，清空浓度
          this.resetPotency();
          return;
        }
        if (addTo.valueCode == 2) {
          // 选择的是一次冲洗用油
          this.stepList[1].nodeValue.forEach(itemA => {
            // 清洗剂油量
            if (itemA.nameKey == "oil_quantity") {
              cleanOil = itemA.value;
            }
          });
          if (cleanOil) {
            potency = Number(cleanOil) / Number(item.value);
          }
        }
      }
      if (potency) {
        potency = (potency * 100).toFixed(2) + "%";
      }
      this.stepList[2].nodeValue.forEach(nodeItem => {
        if (nodeItem.nameKey == "key_potency") {
          nodeItem.value = potency;
        }
      });
    },
    dynamicSelectChange(item) {
      let selectOption = item.fieldOption.find(itA => {
        return itA.value == item.defaultValue;
      });
      let selectOptionArr = JSON.parse(selectOption.option);
      let selectField = selectOptionArr.find(it => {
        return it.value == item.valueCode;
      });
      item.value = selectField.option;
    },
    // 多选事件
    selectMultipleChange(item){
      // 油品储运调研-油品储存场所,多选室内:2，室外:1
      this.handleHiddenOrShow(item)
    },
    //下拉改变
    selectCommonChange(item) {
      // 将选中的option赋值给value
      if (item.valueCode) {
        let result = item.fieldOption.find(it => {
          return it.value == item.valueCode;
        });
        item.value = result ? result.option : item.value;
        if(!result){
          item.type = 'string'
        }
      }
      this.handleHiddenOrShow(item);
      if(this.paramReportType==6 && item.nameKey=='key_clxcs_js'){
        const num = item.valueCode
        // 找到-齿轮检查的添加按钮
        const addItem = this.paramReportNode.filter(it=>{
          return it.tabFlag
        })[0].nodeValue.filter(it=>{
          return it.nameKey=="key_bscl_cljc"
        })[0].children.filter(item=>{
          return item.type=='button'
        })[0]
        addItem.rangeMax=Number(num)
      }
      // 对reportType==21特殊处理
      if (this.deviceDetailObj.reportType == 21) {
        this.handleLubriCleanReport(item);
        this.handleSelectDynamic(item);
      }
      if(this.paramReportType==11 && item.nameKey=='key_1288' && item.valueCode=='4'){
        this.$confirm('建议测试油品相容性，请咨询美孚经销商。', '提示', {
        confirmButtonText: '知道了',
        showCancelButton:false,
        }).then(() => {
        }).catch(() => {    
        });
      }
      // 换油建议书-换油基本信息-设备冲洗类型改变
      if(this.paramReportType==11 && (item.nodeName=="换油基本信息" || item.nodeName=="换油冲洗建议")){
        this.handleChangeOilSuggestNode()
      }
    },
    selectCascaderChange(item){
      // 润滑推荐报告-临时添加-改变设备类型
      if(this.paramReportType==3 && item.nameKey=='device_type'){
        const params = {
          deviceCode:item.valueCode,
          lubPointName:'',
          status:1,
          current:1,
          size:100
        }
      this.requestMethodGet('/device/coreDeviceLubPoint/pageList',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data.list || []
          if(data.length){
            data.forEach(it=>{
              it.isCustomFlag = false
            })
          }
          let obj = {
            lubPointName:'自定义',
            isCustomFlag:true
          }
          data.push(obj)
          // 找出润滑点名称并清空数据
          this.cardItem.nodeValue[0].children.forEach((it,index)=>{
            if(it.id == item.parentId){
              it.children.forEach(item=>{
                if(item.nameKey == "lup_name"){
                  item.customerNameValue = ''
                  item.isLupNameFlag = data.length>1
                  item.nameListData = data
                  item.customerSelectNameValue = ''
                }
              })
            }
          })
          this.cardItem = JSON.parse(JSON.stringify(this.cardItem))
          this.stepList[this.stepList.length-1] = this.cardItem
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
      }
    },
    customerNamechange(nodeItem){
      this.cardItem.nodeValue[0].children.forEach((it,index)=>{
        if(it.id == nodeItem.parentId){
          it.children.forEach(item=>{
            if(item.nameKey == "lup_name"){
              item = nodeItem
            }
          })
        }
      })
      this.cardItem = JSON.parse(JSON.stringify(this.cardItem))
      this.stepList[this.stepList.length-1] = this.cardItem
    },
    // 润滑脂加脂周期优化报告-润滑脂润滑轴承参数和加脂周期计算-是否适用-理论加脂周期计算结果是否展示
    isShowFatliquoringCycleResult(val){
      const code = val.valueCode
      this.paramReportNode.filter(it=>{
        return it.nodeNo==5
      })[0].nodeValue.forEach(item=>{
        if(item.nameKey=='key_4784'){
          item.display = code=='1'
        }
      })
    },
    selectCommonApiChange(item){
      this.handleHiddenOrShow(item);
    },
    handleSelectDynamic(item) {
      // 处理两个下拉选择框的问题
      // 清洗目标清洁度等级
      // 二级选择
      if ((item.nameKey == "clean_pur_level" || item.nameKey == "pur_actual_level") && item.styleJson !== "") {
        this.optId = JSON.parse(item.styleJson);
        this.$set(this.optId, "valueSelect", item.valueCode);
      }
      if (item.nameKey == "clean_pur_level") {
        this.cardItem.nodeValue.forEach(it => {
          if (it.nameKey == "clean_value") {
            it.defaultValue = item.valueCode;
          }
        });
      }
      // 达标的实际清洁度等级
      if (item.nameKey == "pur_actual_level") {
        this.cardItem.nodeValue.forEach(it => {
          if (it.nameKey == "pur_actual_value") {
            it.defaultValue = item.valueCode;
          }
        });
      }
    },
    handleLubriCleanReport(item) {
      if (item.nameKey == "key_add") {
        let potency = "";
        let cleanOil = ""; // 清洗剂油量
        let mailboxCapacity = ""; // 邮箱容量
        let oneCleanOil = ""; // 一次冲洗油量
        this.stepList[0].nodeValue.forEach(itemA => {
          if (itemA.nameKey == "lup_oil_box_capacity") {
            mailboxCapacity = itemA.value;
          }
        });
        this.stepList[1].nodeValue.forEach(itemA => {
          if (itemA.nameKey == "oil_quantity") {
            cleanOil = itemA.value;
          } else if (itemA.nameKey == "one_clean_oil_quantity") {
            oneCleanOil = itemA.value;
          }
        });

        if (item.valueCode == "1") {
          // 清洗剂油量/邮箱容量*100%
          if (!mailboxCapacity) {
            this.$message({
              message: "请先补充邮箱容量。",
              type: "warning"
            });
            this.resetPotency();
            item.valueCode = "";
            potency = "";
            return;
          }
          if (!cleanOil) {
            this.$message({
              message: "请先填写清洗剂油量。",
              type: "warning"
            });
            this.resetPotency();
            item.valueCode = "";
            potency = "";
            return;
          }
          potency = Number(cleanOil) / Number(mailboxCapacity);
        } else if (item.valueCode == "2") {
          // 清洗剂油量/一次冲洗油量*100%
          if (!cleanOil) {
            this.$message({
              message: "请先填写清洗剂油量。",
              type: "warning"
            });
            this.resetPotency();
            item.valueCode = "";
            potency = "";
            return;
          }
          if (!oneCleanOil) {
            this.$message({
              message: "请先填写一次冲洗油量。",
              type: "warning"
            });
            this.resetPotency();
            item.valueCode = "";
            potency = "";
            return;
          }
          potency = Number(cleanOil) / Number(oneCleanOil);
        }
        potency = (potency * 100).toFixed(2) + "%";
        this.cardItem.nodeValue.forEach(nodeItem => {
          if (nodeItem.nameKey == "key_potency") {
            nodeItem.value = potency;
          }
        });
      }
    },
    resetPotency() {
      this.stepList[2].nodeValue.forEach(nodeItem => {
        if (nodeItem.nameKey == "key_potency") {
          nodeItem.value = "";
        }
      });
    },
    // 下拉框出现
    selectCommonVisibleChange(item) {
      if (item.nodeName.includes("附录") && item.name.includes("附录名称")) {
        this.selectValueCodeList = [];
        this.handleSelectDisabled(this.cardItem.nodeValue);
        let str = this.selectValueCodeList;
        if (str.length) {
          item.fieldOption.forEach(it => {
            it.disabled = str.includes(it.value);
          });
        } else {
          item.fieldOption.forEach(it => {
            it.disabled = false;
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e9e9e9;
    background: #dd0000;
    color: #fff;
  }
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  /deep/ .el-tabs__item {
    color: #666;
  }
  /deep/ .el-tabs__item:hover {
    color: #dd0000;
    cursor: pointer;
  }
  /deep/ .el-table {
    tr th,
    tr td {
      border-right: none;
    }
  }
  /deep/.el-popover {
    width: auto !important;
  }
.tips {
  margin-left: 5px;
}
.title {
  font-family: MicrosoftYaHei-Bold;
  font-size: 14px;
  color: #000;
  line-height: 14px;
  font-weight: bold;
  display: flex;
}
.line-vertical {
  width: 3px;
  height: 1em;
  background-color: #dd0000;
}
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
.delete-link {
  margin-left: 10px;
  color: #dd0000;
}
/deep/ .hideItem {
    line-height: 0px !important;
}
</style>
