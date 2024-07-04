<template>
  <el-card class="lubricationWrap" style="margin-top: 20px; border: 1px solid #ededed; border-radius: 4px">
    <div slot="header" class="title">
      <el-divider direction="vertical"></el-divider>
      <span>{{ LubricationSystemInspectionName }}</span> <span style="color: #dd0000">（请填写每个标签页）</span>
    </div>
    <div v-if="deviceDetail.reportType == '5'" v-for="(pic, index) in imgObj.imgFullUrl" :key="index">
      <div>{{ imgObj.name }}</div>
      <img style="width: 60%" :src="pic" />
    </div>
    <div v-if="deviceDetail.reportType == '7'" v-for="(child, index) in bearingDataPart" :key="index" style="margin: 0 20px">
      <div style="color: #606266; font-size: 14px; margin: 0px 0px 20px">
        <span v-if="child.required" class="star">*</span>{{ child.name }}<span v-if="child.type == 'img'">（最多上传{{ child.length }}张图片）</span>
      </div>
      <!-- 上传图片 -->
      <el-upload
        v-if="child.type == 'img' && type == 'edit'"
        :class="{ noUploadBtn: child.imgFullDtoUrl.length >= child.length || notShowUploadBtn }"
        :action="uploadUrl"
        accept="image/*"
        list-type="picture-card"
        :limit="child.length"
        :auto-upload="false"
        :disabled="true"
        :file-list="child.imgFullDtoUrl"
        :before-upload="beforeAvatarUpload"
      >
        <div style="width:148px;height:148px;" @click="handlePictureUpload(child)">
          <i class="el-icon-plus"></i>
        </div>
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="key_ye_ya_yxjc_yyxtgzhj_pic" />
          <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
            <span class="el-upload-list__item-preview">
              <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '111')"></i>
            </span>
            <span class="el-upload-list__item-preview">
              <i class="el-icon-crop" @click.self="handlePicturePrune(file, child, 'imgCutterTab-bearing')"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click.self="handleRemove(file, child)"></i>
            </span>
          </span>
        </div>
      </el-upload>
      <!-- 上传图片 -->
      <!-- 文本域 -->
      <el-input
        v-if="type == 'edit' && child.type == 'textarea'"
        type="textarea"
        placeholder="请输入"
        style="margin-bottom: 30px"
        v-model="child.value"
        :maxlength="child.length"
        show-word-limit
        :autosize="autosize"
        clearable
      />
    </div>
    <div v-if="deviceDetail.reportType == '8'" style="margin: 20px" v-for="(child, index) in openGearDataPart" :key="index">
      <div style="color: #606266; font-size: 14px; margin: 0px 0px 20px">
        <span v-if="child.required" class="star">*</span> {{ child.name }}
        <span v-if="child.unit">({{ child.unit }})</span>
      </div>
      <el-select
        v-if="type == 'edit' && child.type == 'dropdown2'"
        size="small"
        clearable
        @change="
          val => {
            selectCLStatus(val, child);
          }
        "
        style="width: 220px"
        v-model="child.value"
        placeholder="--请选择--"
      >
        <el-option v-for="item in child.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
      </el-select>
    </div>
    <el-tabs ref="tabs" v-model="activeName" type="card" @tab-click="handleClick" style="margin: 20px">
      <el-tab-pane v-for="(item, index) in lubricationSystemInspectionObj" :key="index" :name="item.nameKey" :label="`${item.name} `" :lazy="true">
        <el-form :model="lubricationSystemInspectionForm" ref="oilChangeRef" label-position="top" label-width="200px" style="padding: 0 0px">
          <el-row :gutter="24" v-for="(child, index1) in lubricationSystemInspectionForm" :key="index1">
            <el-col :span="24">
              <el-form-item>
                <span
                  slot="label"
                  v-if="
                    ((child.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc' && 
                    child.nameKey != 'key_rhqkjc_hxflx' && 
                    child.nameKey != 'key_rhqkjc_zcxywgd' && 
                    child.nameKey != 'key_rhqkjc_zcxywgd') ||
                    (deviceDetail.oilType == '2' && child.nameKey == 'key_rhqkjc_rhjsfnzcjrhpc') ||
                    (deviceDetail.oilType == '1' && child.nameKey == 'key_rhqkjc_hxflx') ||
                    (deviceDetail.oilType == '1' && child.nameKey == 'key_rhqkjc_zcxywgd')) &&
                    (valueCodeLevel != '1' || valueCodeLevel != '2') &&
                    child.nameKey != 'key_kscl_cljc_chilun' &&
                    !(child.nameKey == 'key_glqqhyyc_level_2' || 
                      child.nameKey == 'key_glq_period_level_2' || 
                      child.nameKey == 'key_glqqhyyc_level_1' || 
                      child.nameKey == 'key_glq_period_level_1') && child.nameKey != 'key_1407'
                  "
                >
                  <span v-if="child.required && ((child.nameKey != 'key_bscl_xtjc_clxwd' && CLStatus == '0') || CLStatus == '1' || !CLStatus)" class="star">*</span>
                  <span v-if="(child.nameKey != 'key_bscl_xtjc_clxwd' && CLStatus == '0') || CLStatus == '1' || !CLStatus">{{ child.name }}</span>
                  <span v-if="child.nameKey == 'key_wcxzctzjc_wcx' || child.nameKey == 'key_wcxzctzjc_ycx'" style="color: #f56c6c">（选择“检查”时，可以选择以下一项或几项进行检查）</span>
                  <span v-if="child.unit">({{ child.unit }})</span>
                  <span v-if="child.nameKey == 'key_ye_ya_ybjc_yyb_item'">{{ index1 - 1 }}</span>
                  <span v-if="child.nameKey == 'key_1415'">{{ index1 + 1 }}</span>
                  <el-link v-if="child.nameKey == 'key_1415' && lubricationSystemInspectionForm.length>1" style="color:#dd0000;margin-left:6px;" @click="deleteLupCheck(child)">删除</el-link>
                  <span v-if="child.type == 'img'">（最多上传{{ child.length }}张图片）</span>
                </span>
                <span
                  slot="label"
                  v-if="
                    (valueCodeLevel == '1' && (child.nameKey == 'key_glqqhyyc_level_1' || child.nameKey == 'key_glq_period_level_1')) ||
                      (valueCodeLevel == '2' &&
                        (child.nameKey == 'key_glqqhyyc_level_2' || 
                        child.nameKey == 'key_glq_period_level_2' || 
                        child.nameKey == 'key_glqqhyyc_level_1' || 
                        child.nameKey == 'key_glq_period_level_1'))
                  "
                >
                  <span><span v-if="child.required" class="star">*</span>{{ child.name }} </span>
                  <span v-if="child.unit">({{ child.unit }})</span>
                </span>

                <el-row v-if="child.imgFullUrl.length && child.type == 'img2'">
                  <div v-for="(pic, index) in child.imgFullUrl" :key="index">
                    <img style="width: 520px" :src="pic" />
                  </div>
                </el-row>
                <el-input
                  v-hasdisplay="child"
                  v-if="child.type == 'input1' && type == 'edit'"
                  :placeholder="child.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                  :disabled="child.disabled"
                  v-model="child.value"
                  :maxlength="child.length"
                  style="width: 220px"
                  size="small"
                  clearable
                >
                </el-input>
                <el-checkbox-group v-if="child.type == 'checkbox'" v-model="child.valueCheckBoxList" @change="selectId => changebox(selectId, index1, child)" style="display: inline-block">
                  <el-checkbox v-for="btn in child.fieldOption" :label="btn.value" :key="btn.value" style="margin-bottom: 10px">{{ btn.value }}</el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-if="child.type == 'radio2'" v-model="child.value" @change="selectId => changeRadio(selectId, index1)" style="display: inline-block">
                  <el-radio v-for="btn in child.fieldOption" :label="btn.value" :key="btn.option" style="margin-bottom: 10px">{{ btn.option }}</el-radio>
                </el-radio-group>
                <!-- string 类型下边的 children  开式齿轮下边的齿轮检查 -->
                <div
                  style="border-bottom: 1px solid #ebeef5; padding-bottom: 30px"
                  v-if="child.nameKey == 'key_kscl_cljc_chilun' && child.children.length"
                  v-for="(cylinder, index2) in child.children"
                  :key="index2"
                >
                  <div v-if="cylinder.valueCodeNotDisplay == '' || cylinder.valueCodeNotDisplay == null || (cylinder.valueCodeNotDisplay && !cylinder.valueCodeNotDisplay.includes(child.valueCode))">
                    <el-form-item :label="cylinder.name + '：'" style="margin-top: 20px">
                      <span slot="label">
                        <span v-if="cylinder.required" class="star">*</span>
                        <span> {{ cylinder.name }} 设备检查-其他选项</span>
                        <span v-if="cylinder.unit">({{ cylinder.unit }})</span>
                        <span v-if="cylinder.type == 'img'">（最多上传{{ cylinder.length }}张图片）</span>
                      </span>
                      <span v-if="type == 'view'">{{ cylinder.value }}</span>
                      <el-select
                        size="small"
                        v-if="type == 'edit' && cylinder.type == 'dropdown4'"
                        v-model="cylinder.valueCode"
                        style="width: 220px"
                        @change="selectDropdown4(cylinder)"
                        placeholder="--请选择--"
                      >
                        <el-option v-for="filed in cylinder.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                      </el-select>
                      <el-input
                        v-if="cylinder.type == 'input1' && type == 'edit'"
                        :placeholder="cylinder.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                        :disabled="cylinder.disabled"
                        v-model="cylinder.value"
                        :maxlength="cylinder.length"
                        style="width: 220px"
                        size="small"
                        clearable
                      >
                      </el-input>
                      <div v-if="cylinder.children.length || (cylinder.type == 'input1' && cylinder.nameKey == 'key_kscl_cljc_chilun_small')">
                        <div v-for="(cylinder2, index3) in cylinder.children" :key="index3">
                          <div
                            v-if="
                              cylinder2.valueCodeNotDisplay == '' ||
                                cylinder2.valueCodeNotDisplay == null ||
                                (cylinder2.valueCodeNotDisplay && !cylinder2.valueCodeNotDisplay.includes(cylinder.valueCode))
                            "
                          >
                            <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                              <span slot="label">
                                {{ cylinder2.name }}
                                <span v-if="cylinder2.unit">({{ cylinder2.unit }})</span>
                                <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                              </span>
                              <span v-if="type == 'view'">{{ cylinder2.value }}</span>
                              <el-select
                                size="small"
                                clearable
                                v-if="type == 'edit' && cylinder2.type == 'dropdown2'"
                                v-model="cylinder2.valueCode"
                                style="width: 220px"
                                @change="
                                  val => {
                                    dropdown2Change(val, cylinder2);
                                  }
                                "
                                placeholder="--请选择--"
                              >
                                <el-option v-for="filed in cylinder2.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                              </el-select>
                              <el-select
                                size="small"
                                v-if="type == 'edit' && cylinder2.type == 'dropdown4'"
                                v-model="cylinder2.valueCode"
                                style="width: 220px"
                                @change="selectDropdown4(cylinder2)"
                                placeholder="--请选择--"
                              >
                                <el-option v-for="filed in cylinder2.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                              </el-select>
                              <!-- 多选 -->
                              <el-checkbox-group
                                v-if="cylinder2.type == 'checkbox'"
                                v-model="cylinder2.valueCheckBoxList"
                                @change="selectId => changebox(selectId, index3, cylinder2, 'huxiqi')"
                                style="display: inline-block"
                              >
                                <el-checkbox v-for="btn in cylinder2.fieldOption" :label="btn.value" :key="btn.value" style="margin-bottom: 10px">{{ btn.value }}</el-checkbox>
                              </el-checkbox-group>
                              <div v-if="cylinder2.type == 'dropdown4'" v-for="(cylinder3, index4) in cylinder2.children" :key="index4">
                                <!-- {{cylinder3.name}}  -->
                                <div
                                  v-if="
                                    cylinder2.type == 'input1' ||
                                      (cylinder2.type == 'dropdown4' &&
                                        (cylinder3.valueCodeNotDisplay == '' ||
                                          cylinder3.valueCodeNotDisplay == null ||
                                          (cylinder3.valueCodeNotDisplay && !cylinder3.valueCodeNotDisplay.includes(cylinder2.valueCode))))
                                  "
                                >
                                  <div
                                    v-if="
                                      cylinder2.type == 'dropdown4' &&
                                        cylinder3.nameKey != 'key_kscl_cljc_chilun_cmwd_line_small' &&
                                        (kaishiCLStatus == '1' ||
                                          kaishiCLStatus == '' ||
                                          kaishiCLStatus == null ||
                                          (kaishiCLStatus == '2' && cylinder3.nameKey != 'key_kscl_cljc_chilun_cmwd_small' && cylinder3.nameKey != 'key_kscl_cljc_chilun_cmwd_big'))
                                    "
                                  >
                                    <el-form-item :label="cylinder3.name + '：'" :required="cylinder3.required" style="margin-top: 20px">
                                      <span slot="label">
                                        {{ cylinder3.name }}
                                        <span v-if="cylinder3.unit">({{ cylinder3.unit }})</span>
                                        <span v-if="cylinder3.type == 'img'">（最多上传{{ cylinder3.length }}张图片）</span>
                                      </span>
                                      <span v-if="type == 'view'">{{ cylinder3.value }}</span>
                                      <!-- 多选 -->
                                      <el-checkbox-group
                                        v-if="cylinder3.type == 'checkbox'"
                                        v-model="cylinder3.valueCheckBoxList"
                                        @change="selectId => changebox(selectId, index3, cylinder3, 'huxiqi')"
                                        style="display: inline-block"
                                      >
                                        <el-checkbox v-for="btn in cylinder3.fieldOption" :label="btn.value" :key="btn.value" style="margin-bottom: 10px">{{ btn.value }}</el-checkbox>
                                      </el-checkbox-group>
                                      <el-select
                                        size="small"
                                        v-if="type == 'edit' && cylinder3.type == 'dropdown4'"
                                        v-model="cylinder3.valueCode"
                                        style="width: 220px"
                                        @change="selectDropdown4(cylinder3)"
                                        placeholder="--请选择--"
                                      >
                                        <el-option v-for="filed in cylinder3.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                      </el-select>
                                      <!-- 位置 字段-->
                                      <div v-if="cylinder3.type == 'dropdown4'" v-for="(cylinder4, index5) in cylinder3.children" :key="index5">
                                        <div
                                          v-if="
                                            cylinder4.valueCodeNotDisplay == '' ||
                                              cylinder4.valueCodeNotDisplay == null ||
                                              (cylinder4.valueCodeNotDisplay && !cylinder4.valueCodeNotDisplay.includes(cylinder3.valueCode))
                                          "
                                        >
                                          <el-form-item :label="cylinder4.name + '：'" :required="cylinder4.required" style="margin-top: 20px">
                                            <span slot="label">
                                              {{ cylinder4.name }}{{ index5 + 1 }}
                                              <span v-if="cylinder4.unit">({{ cylinder4.unit }})</span>
                                            </span>
                                            <span v-if="type == 'view'">{{ cylinder4.value }}</span>
                                            <el-input
                                              v-if="cylinder4.type == 'input2' && type == 'edit'"
                                              style="width: 220px"
                                              size="small"
                                              @keyup.native="proving1(cylinder4)"
                                              :maxlength="cylinder4.length"
                                              @blur="onInputBlur(cylinder4, index, index1, index2, index3, index4)"
                                              v-model="cylinder4.value"
                                              placeholder="请输入"
                                            ></el-input>
                                          </el-form-item>
                                        </div>
                                        <!-- 添加位置-->
                                        <div style="display: flex" v-if="!cylinder4.valueCodeNotDisplay.includes(cylinder3.valueCode)">
                                          <div v-if="index5 == cylinder3.children.length - 1" style="margin-right: 20px">
                                            <el-button @click="addPosition(index, index1, index2, index3, index4)" size="small" style="margin-top: 20px">添加位置</el-button>
                                          </div>
                                          <div v-if="index5 > 4">
                                            <el-button @click="deletePosition(index, index1, index2, index3, index4, index5)" size="small" style="margin-top: 20px">删除该位置</el-button>
                                          </div>
                                        </div>
                                        <!-- 位置结束 -->
                                        <!-- 位置温度图 -->
                                        <div style="margin-top: 30px" v-if="!cylinder4.valueCodeNotDisplay.includes(cylinder3.valueCode)">
                                          <div v-if="index5 == cylinder3.children.length - 1" style="margin-right: 20px">
                                            <div>位置温度图</div>
                                          </div>
                                        </div>
                                        <div v-if="index5 == cylinder3.children.length - 1 && !cylinder4.valueCodeNotDisplay.includes(cylinder3.valueCode)">
                                          <div v-if="activeName == 'key_kscl_cljc'">
                                            <div :id="`lineChat_${index}_${index1}_${index2}_${cylinder2.nameKey}`"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <el-input
                                        v-if="type == 'edit' && cylinder3.type == 'textarea'"
                                        type="textarea"
                                        placeholder="请输入"
                                        v-model="cylinder3.value"
                                        :maxlength="cylinder3.length"
                                        show-word-limit
                                        :autosize="autosize"
                                        clearable
                                      />
                                      <el-input
                                        v-if="cylinder3.type == 'input1' && type == 'edit'"
                                        :placeholder="cylinder3.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                        :disabled="cylinder3.disabled"
                                        v-model="cylinder3.value"
                                        :maxlength="cylinder3.length"
                                        style="width: 220px"
                                        size="small"
                                        clearable
                                      >
                                      </el-input>
                                      <el-input
                                        v-if="cylinder3.type == 'input2' && type == 'edit'"
                                        style="width: 220px"
                                        size="small"
                                        @keyup.native="proving1(cylinder3)"
                                        :maxlength="cylinder3.length"
                                        v-model="cylinder3.value"
                                        placeholder="请输入"
                                      ></el-input>
                                      <el-upload
                                        v-if="cylinder3.type == 'img' && type == 'edit'"
                                        :class="{ noUploadBtn: cylinder3.imgFullDtoUrl.length >= cylinder3.length || notShowUploadBtn }"
                                        :action="uploadUrl"
                                        accept="image/*"
                                        list-type="picture-card"
                                        :limit="cylinder3.length"
                                        :auto-upload="false"
                                        :disabled="true"
                                        :file-list="cylinder3.imgFullDtoUrl"
                                        :before-upload="beforeAvatarUpload"
                                      >
                                        <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder3)">
                                          <i class="el-icon-plus"></i>
                                        </div>
                                        <div slot="file" slot-scope="{ file }">
                                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                          <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                            <span class="el-upload-list__item-preview">
                                              <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '222')"></i>
                                            </span>
                                            <span class="el-upload-list__item-preview">
                                              <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder3, 'imgCutterTab-gear3')"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete">
                                              <i class="el-icon-delete" @click.self="handleRemove(file, cylinder3)"></i>
                                            </span>
                                          </span>
                                        </div>
                                      </el-upload>
                                      <!-- 上传图片 -->
                                    </el-form-item>
                                  </div>
                                </div>
                              </div>
                              <el-input
                                v-if="type == 'edit' && cylinder2.type == 'textarea'"
                                type="textarea"
                                placeholder="请输入"
                                v-model="cylinder2.value"
                                :maxlength="cylinder2.length"
                                show-word-limit
                                :autosize="autosize"
                                clearable
                              />
                              <el-input
                                v-if="cylinder2.type == 'input1' && type == 'edit'"
                                :placeholder="cylinder2.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                :disabled="cylinder2.disabled"
                                v-model="cylinder2.value"
                                :maxlength="cylinder2.length"
                                style="width: 220px"
                                size="small"
                                clearable
                              >
                              </el-input>
                              <el-input
                                v-if="cylinder2.type == 'input2' && type == 'edit'"
                                style="width: 220px"
                                size="small"
                                @keyup.native="proving1(cylinder2)"
                                :maxlength="cylinder2.length"
                                v-model="cylinder2.value"
                                placeholder="请输入"
                              ></el-input>
                              <el-upload
                                v-if="cylinder2.type == 'img' && type == 'edit'"
                                :class="{ noUploadBtn: cylinder2.imgFullDtoUrl.length >= cylinder2.length || notShowUploadBtn }"
                                :action="uploadUrl"
                                accept="image/*"
                                list-type="picture-card"
                                :limit="cylinder2.length"
                                :auto-upload="false"
                                :disabled="true"
                                :file-list="cylinder2.imgFullDtoUrl"
                                :before-upload="beforeAvatarUpload"
                              >
                                <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder2)">
                                  <i class="el-icon-plus"></i>
                                </div>
                                <div slot="file" slot-scope="{ file }">
                                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                  <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                    <span class="el-upload-list__item-preview">
                                      <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '333')"></i>
                                    </span>
                                    <span class="el-upload-list__item-preview">
                                      <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder2, 'imgCutterTab-gear3')"></i>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete">
                                      <i class="el-icon-delete" @click.self="handleRemove(file, cylinder2)"></i>
                                    </span>
                                  </span>
                                </div>
                              </el-upload>
                              <!-- 上传图片 -->
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                    <!-- 添加小齿轮  删除小齿轮-->
                    <div style="display: flex">
                      <div v-if="index2 == child.children.length - 1" style="margin-right: 20px">
                        <el-button @click="addSmallGear" size="small" style="margin-top: 20px">添加小齿轮</el-button>
                      </div>
                      <div v-if="index2 != 0 && index2 != 1">
                        <el-button @click="deleteSmallGear(index2)" size="small" style="margin-top: 20px">删除该齿轮</el-button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="
                      child.valueCode && child.type == 'dropdown4' && child.nameKey == 'key_aqts_item' && index == child.children.length - 1 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)
                    "
                  >
                    <el-button @click="addNotice" size="small" style="margin-top: 20px">添加提示</el-button>
                  </div>
                </div>
                <!-- radio2 children 特殊情况处理 -->
                <div v-if="child.type == 'radio2'" v-for="(cylinder, index) in child.children" :key="index">
                  <div v-if="child.value == cylinder.valueCodeNotDisplay">
                    <el-form-item :label="cylinder.name + '：'" :required="cylinder.required" style="margin-top: 20px">
                      <span slot="label">
                        {{ cylinder.name }}
                        <span v-if="cylinder.unit">({{ cylinder.unit }})</span>
                        <span v-if="cylinder.type == 'img'">（最多上传{{ cylinder.length }}张图片）</span>
                      </span>
                      <span v-if="type == 'view'">{{ cylinder.value }}</span>
                      <el-input
                        v-if="type == 'edit' && cylinder.type == 'textarea'"
                        type="textarea"
                        placeholder="请输入"
                        v-model="cylinder.value"
                        :maxlength="cylinder.length"
                        show-word-limit
                        :autosize="autosize"
                        clearable
                      />
                    </el-form-item>
                  </div>
                  <div
                    v-if="
                      child.valueCode && child.type == 'dropdown4' && child.nameKey == 'key_aqts_item' && index == child.children.length - 1 && !valueCodeNotDisplay.valueCode.includes(child.valueCode)
                    "
                  >
                    <el-button @click="addNotice" size="small" style="margin-top: 20px">添加提示</el-button>
                  </div>
                </div>
                <el-input
                  v-if="
                    child.type == 'input2' &&
                      type == 'edit' &&
                      !(child.nameKey == 'key_glqqhyyc_level_1' || child.nameKey == 'key_glqqhyyc_level_2' || child.nameKey == 'key_glq_period_level_2' || child.nameKey == 'key_glq_period_level_1')
                  "
                  style="width: 220px"
                  size="small"
                  @keyup.native="proving1(child)"
                  :maxlength="child.length"
                  v-model="child.value"
                  placeholder="请输入"
                ></el-input>

                <el-input
                  v-if="valueCodeLevel == '1' && child.type == 'input2' && type == 'edit' && (child.nameKey == 'key_glqqhyyc_level_1' || child.nameKey == 'key_glq_period_level_1')"
                  style="width: 220px"
                  size="small"
                  @keyup.native="proving1(child)"
                  :maxlength="child.length"
                  v-model="child.value"
                  placeholder="请输入"
                ></el-input>

                <el-input
                  v-if="
                    valueCodeLevel == '2' &&
                      child.type == 'input2' &&
                      type == 'edit' &&
                      (child.nameKey == 'key_glqqhyyc_level_1' || child.nameKey == 'key_glqqhyyc_level_2' || child.nameKey == 'key_glq_period_level_2' || child.nameKey == 'key_glq_period_level_1')
                  "
                  style="width: 220px"
                  size="small"
                  @keyup.native="proving1(child)"
                  :maxlength="child.length"
                  v-model="child.value"
                  placeholder="请输入"
                ></el-input>
                <!-- 循环系统-特殊字段处理 -->
                <div v-if="child.type == 'dropdown5'">
                  <el-select size="small" clearable v-model="child.valueCode" @change="changeVal(child)" style="width: 40%" placeholder="--请选择--">
                    <el-option v-for="filed in child.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                  </el-select>
                  <el-input clearable placeholder="--请输入--" size="small" style="width: 40%" :maxlength="child.children[0].length" v-model="child.children[0].value"></el-input>
                </div>
                <!-- 上传图片 -->
                <el-upload
                  v-if="child.type == 'img' && type == 'edit'"
                  :class="{ noUploadBtn: child.imgFullDtoUrl.length >= child.length || notShowUploadBtn }"
                  :action="uploadUrl"
                  accept="image/*"
                  list-type="picture-card"
                  :limit="child.length"
                  :auto-upload="false"
                  :disabled="true"
                  :file-list="child.imgFullDtoUrl"
                  :before-upload="beforeAvatarUpload"
                >
                  <div style="width:148px;height:148px;" @click="handlePictureUpload(child)">
                    <i class="el-icon-plus"></i>
                  </div>
                  <div slot="file" slot-scope="{ file }">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                      <span class="el-upload-list__item-preview">
                        <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '444')"></i>
                      </span>
                      <span class="el-upload-list__item-preview">
                        <i class="el-icon-crop" @click.self="handlePicturePrune(file, child, 'imgCutterTab3-444')"></i>
                      </span>
                      <span v-if="!disabled" class="el-upload-list__item-delete">
                        <i class="el-icon-delete" @click.self="handleRemove(file, child)"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <!-- 上传图片 -->
                <!-- 文本域 -->
                <el-input
                  v-if="type == 'edit' && child.type == 'textarea'"
                  type="textarea"
                  placeholder="请输入"
                  v-model="child.value"
                  :maxlength="child.length"
                  show-word-limit
                  :autosize="autosize"
                  clearable
                />
                <!-- 普通下拉框 -->
                <el-select
                  v-if="type == 'edit' && child.type == 'dropdown2' && child.nameKey != 'key_ye_ya_byjc_num'"
                  size="small"
                  clearable
                  :disabled="child.disabled"
                  style="width: 220px"
                  @change="
                    val => {
                      dropdown2Change(val, child);
                    }
                  "
                  v-model="child.valueCode"
                  placeholder="--请选择--"
                >
                  <el-option v-for="item in child.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
                </el-select>
                <el-select
                  v-if="type == 'edit' && child.type == 'dropdown2' && child.nameKey == 'key_ye_ya_byjc_num'"
                  size="small"
                  clearable
                  :disabled="child.disabled"
                  style="width: 220px"
                  v-model="child.value"
                  placeholder="--请选择--"
                  @change="selectId => LumMethods(selectId, index)"
                >
                  <el-option v-for="item in child.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
                </el-select>
                <el-select
                  size="small"
                  v-if="
                    type == 'edit' &&
                      ((child.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc' && child.nameKey != 'key_rhqkjc_hxflx' && child.nameKey != 'key_rhqkjc_zcxywgd') ||
                        (deviceDetail.oilType == '2' && child.nameKey == 'key_rhqkjc_rhjsfnzcjrhpc') ||
                        (deviceDetail.oilType == '1' && child.nameKey == 'key_rhqkjc_hxflx') ||
                        (deviceDetail.oilType == '1' && child.nameKey == 'key_rhqkjc_zcxywgd')) &&
                      (child.type == 'dropdown4' || child.type == 'dropdown4_empty') &&
                      ((child.nameKey != 'key_bscl_xtjc_clxwd' && CLStatus == '0') || CLStatus == '1' || !CLStatus) && 
                     
                      child.nameKey != 'key_1407'
                  "
                  v-model="child.valueCode"
                  @change="selectDropdown4(child)"
                  style="width: 220px"
                  placeholder="--请选择--"
                >
                  <el-option v-for="filed in child.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                </el-select>
                <!-- string children 特殊情况处理  液压泵-->
                <div v-if="child.type == 'string' && child.nameKey == 'key_ye_ya_ybjc_yyb_item'" v-for="(cylinder, index) in child.children" :key="index">
                  <div>
                    <!-- <el-col :span="24"> -->
                    <el-form-item :label="cylinder.name + '：'" :required="cylinder.required" style="margin-top: 20px">
                      <span slot="label">
                        {{ cylinder.name }}
                        <span v-if="cylinder.unit">({{ cylinder.unit }})</span>
                        <span v-if="cylinder.type == 'img'">（最多上传{{ cylinder.length }}张图片）</span>
                      </span>
                      <span v-if="type == 'view'">{{ cylinder.value }}</span>
                      <el-input
                        v-if="cylinder.type == 'input2' && type == 'edit'"
                        style="width: 220px"
                        size="small"
                        @keyup.native="proving1(cylinder)"
                        :maxlength="cylinder.length"
                        v-model="cylinder.value"
                        placeholder="请输入"
                      ></el-input>
                      <el-select
                        size="small"
                        v-if="type == 'edit' && cylinder.type == 'dropdown4'"
                        v-model="cylinder.valueCode"
                        style="width: 220px"
                        @change="selectDropdown4(cylinder)"
                        placeholder="--请选择--"
                      >
                        <el-option v-for="filed in cylinder.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                      </el-select>
                      <el-input
                        v-if="cylinder.type == 'input1' && type == 'edit'"
                        placeholder="--请输入--"
                        :disabled="cylinder.disabled"
                        v-model="cylinder.value"
                        :maxlength="cylinder.length"
                        style="width: 220px"
                        size="small"
                        clearable
                      >
                      </el-input>
                      <div style="border-bottom: 1px solid #ebeef5; padding-bottom: 30px" v-if="cylinder.type == 'dropdown4'" v-for="(cylinder2, index1) in cylinder.children" :key="index1">
                        <div v-if="!cylinder2.valueCodeNotDisplay.includes(cylinder.valueCode)">
                          <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                            <span slot="label">
                              {{ cylinder2.name }}
                              <span v-if="cylinder2.unit">({{ cylinder2.unit }})</span>
                              <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                            </span>
                            <span v-if="type == 'view'">{{ cylinder2.value }}</span>
                            <el-input
                              v-if="type == 'edit' && cylinder2.type == 'textarea'"
                              type="textarea"
                              placeholder="请输入"
                              v-model="cylinder2.value"
                              :maxlength="cylinder2.length"
                              show-word-limit
                              style="width: 100%"
                              :autosize="autosize"
                              clearable
                            />
                            <el-upload
                              v-if="cylinder2.type == 'img' && type == 'edit'"
                              :class="{ noUploadBtn: cylinder2.imgFullDtoUrl.length >= cylinder2.length || notShowUploadBtn }"
                              :action="uploadUrl"
                              accept="image/*"
                              list-type="picture-card"
                              :limit="cylinder2.length"
                              :auto-upload="false"
                              :disabled="true"
                              :file-list="cylinder2.imgFullDtoUrl"
                              :before-upload="beforeAvatarUpload"
                            >
                              <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder2)">
                                <i class="el-icon-plus"></i>
                              </div>
                              <div slot="file" slot-scope="{ file }">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                  <span class="el-upload-list__item-preview">
                                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '555')"></i>
                                  </span>
                                  <span class="el-upload-list__item-preview">
                                    <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder2, 'imgCutterTab3')"></i>
                                  </span>
                                  <span v-if="!disabled" class="el-upload-list__item-delete">
                                    <i class="el-icon-delete" @click.self="handleRemove(file, cylinder2)"></i>
                                  </span>
                                </span>
                              </div>
                            </el-upload>
                            <!-- 上传图片 -->
                          </el-form-item>
                        </div>
                      </div>
                      <!-- 上传图片 -->
                    </el-form-item>
                    <!-- </el-col> -->
                  </div>
                  <div
                    v-if="
                      child.valueCode && child.type == 'dropdown4' && child.nameKey == 'key_aqts_item' && index == child.children.length - 1 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)
                    "
                  >
                    <el-button @click="addNotice" size="small" style="margin-top: 20px">添加提示</el-button>
                  </div>
                </div>
                <!-- dropdown2 children 特殊情况处理 -->
                <div v-if="child.type == 'dropdown2' && child.nameKey == 'key_ye_ya_byjc_num'" v-for="(cylinder, index) in child.children" :key="index">
                  <div>
                    <el-col :span="24">
                      <el-form-item :label="cylinder.name + '：'" :required="cylinder.required">
                        <span slot="label">
                          {{ cylinder.name }}
                          <span v-if="cylinder.unit">({{ cylinder.unit }})</span>
                          <span v-if="cylinder.type == 'img'">（最多上传{{ cylinder.length }}张图片）</span>
                        </span>
                        <span v-if="type == 'view'">{{ cylinder.value }}</span>
                        <el-input
                          v-if="cylinder.type == 'input2' && type == 'edit'"
                          style="width: 220px"
                          size="small"
                          @keyup.native="proving1(cylinder)"
                          :maxlength="cylinder.length"
                          v-model="cylinder.value"
                          placeholder="请输入"
                        ></el-input>
                        <!-- 上传图片 -->
                      </el-form-item>
                    </el-col>
                  </div>
                  <div v-if="child.type == 'dropdown4' && child.nameKey == 'key_aqts_item' && index == child.children.length - 1 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)">
                    <el-button @click="addNotice" size="small" style="margin-top: 20px">添加提示</el-button>
                  </div>
                </div>
                <!-- dropdown4  children  dropdown4-->
                <div
                  style="padding-bottom: 30px"
                  v-if="
                    ((child.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc' && child.nameKey != 'key_rhqkjc_hxflx' && child.nameKey != 'key_rhqkjc_zcxywgd' && child.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc') ||
                      (deviceDetail.oilType == '2' && child.nameKey == 'key_rhqkjc_rhjsfnzcjrhpc') ||
                      (deviceDetail.oilType == '1' && (child.nameKey == 'key_rhqkjc_hxflx' || child.nameKey == 'key_rhqkjc_zcxywgd'))
                      ) && (child.type == 'dropdown4' || ((child.type == 'input2' || child.type == 'input1') && child.children.length)) &&
                      child.nameKey != 'key_aqts' &&
                      ((child.nameKey != 'key_bscl_xtjc_clxwd' && CLStatus == '0') || CLStatus == '1' || !CLStatus) && 
                      child.nameKey != 'key_1407' && 
                      child.nameKey != 'key_1440' && 
                      child.nameKey != 'key_1423'">
                  <div v-for="(cylinder, index6) in child.children" :key="index6">
                    <div
                      v-if="((kaishiCLStatus == '2' && cylinder.nameKey != 'key_kscl_xtjc_yxwdqk') || kaishiCLStatus != '2') &&
                        (cylinder.valueCodeNotDisplay == '' || 
                        cylinder.valueCodeNotDisplay == null || 
                        (cylinder.valueCodeNotDisplay && 
                        !cylinder.valueCodeNotDisplay.includes(child.valueCode)
                        ))">
                      <el-form-item :label="cylinder.name + '：'" style="margin-top: 20px">
                        <span slot="label">
                          <span v-if="(cylinder.required && cylinder.nameKey != 'key_ye_ya_yxjc_hxflx_pic') || 
                          (!picFlag && cylinder.nameKey == 'key_ye_ya_yxjc_hxflx_pic')" class="star">*</span>
                          <span
                            v-if="
                              (cylinder.nameKey != 'key_ye_ya_hrqjc_hrqcs' && 
                              cylinder.nameKey != 'key_hrqjc_lqfs_shuileng_fields' && 
                              cylinder.nameKey != 'key_ye_ya_yxjc_hxflx_pic' &&  
                              cylinder.nameKey != 'key_1438' && 
                              cylinder.nameKey != 'key_1440') ||
                              (!picFlag && cylinder.nameKey == 'key_ye_ya_yxjc_hxflx_pic')">
                            {{ cylinder.name }}
                          </span>
                          <span v-if="cylinder.unit && (cylinder.nameKey != 'key_ye_ya_yxjc_hxflx_pic' || (!picFlag && cylinder.nameKey == 'key_ye_ya_yxjc_hxflx_pic'))">({{ cylinder.unit }})</span>
                          <span v-if="(cylinder.type == 'img' && cylinder.nameKey != 'key_ye_ya_yxjc_hxflx_pic') || (!picFlag && cylinder.nameKey == 'key_ye_ya_yxjc_hxflx_pic')"
                            >（最多上传{{ cylinder.length }}张图片）</span
                          >
                          <span class="no-wrap" v-if="cylinder.tip && cylinder.tip.type == 'text'">
                            <el-tooltip class="item" effect="dark" :content="cylinder.tip.content" placement="top-start">
                              <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                                <i class="el-icon-warning-outline"></i>
                              </el-button>
                            </el-tooltip>
                          </span>
                          <span v-if="cylinder.tip && cylinder.tip.type == 'img'" @click.stop="() => operatebtn(cylinder)">
                            <el-popover :ref="`popover-${cylinder.id}`" placement="right" width="auto" trigger="click">
                              <img style="width: 600px" :src="imgFullUrl" alt="" />
                              <el-button slot="reference" type="text" style="color: rgba(33, 150, 243); font-size: 15px; padding: 0px; font-size: 12px"> 查看参考 </el-button>
                            </el-popover>
                          </span>
                        </span>
                        <span v-if="type == 'view'">{{ cylinder.value }}</span>
                        <el-input
                          v-hasdisplay="cylinder"
                          v-if="type == 'edit' && cylinder.type == 'textarea'"
                          type="textarea"
                          placeholder="请输入"
                          v-model="cylinder.value"
                          :maxlength="cylinder.length"
                          show-word-limit
                          :autosize="autosize"
                          clearable
                        />
                        <!-- 下拉多选 -->
                        <el-select
                          v-if="cylinder.type == 'dropdown_multi'"
                          size="small"
                          @change="selectId => dropdownMulti(selectId, index1, cylinder)"
                          v-model="cylinder.valueCheckBoxList"
                          multiple
                          placeholder="请选择"
                        >
                          <el-option v-for="item in cylinder.fieldOption" :key="item.option" :label="item.option" :value="item.option"> </el-option>
                        </el-select>
                        <!-- 多选 -->
                        <el-checkbox-group
                          v-if="cylinder.type == 'checkbox'"
                          v-model="cylinder.valueCheckBoxList"
                          @change="selectId => changebox(selectId, index1, cylinder, 'huxiqi')"
                          style="display: inline-block"
                        >
                          <el-checkbox v-for="btn in cylinder.fieldOption" :label="btn.value" :key="btn.value" style="margin-bottom: 10px">{{ btn.value }}</el-checkbox>
                        </el-checkbox-group>
                        <!-- 普通下拉框 -->
                        <el-select
                          v-if="type == 'edit' && cylinder.type == 'dropdown2'"
                          size="small"
                          clearable
                          :disabled="cylinder.disabled"
                          style="width: 220px"
                          @change="
                            val => {
                              dropdown2Change(val, cylinder);
                            }
                          "
                          v-model="cylinder.valueCode"
                          placeholder="--请选择--"
                        >
                          <el-option v-for="item in cylinder.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
                        </el-select>
                        <div v-if="cylinder.type == 'dropdown5'">
                          <el-select size="small" clearable @change="changeVal(cylinder)" v-model="cylinder.valueCode" style="width: 220px" placeholder="--请选择--">
                            <el-option v-for="filed in cylinder.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                          </el-select>
                          <el-input clearable placeholder="--请输入--" size="small" style="width: 300px" :maxlength="cylinder.children[0].length" v-model="cylinder.children[0].value"></el-input>
                        </div>
                        <el-select
                          size="small"
                          v-if="type == 'edit' && (cylinder.type == 'dropdown4' || cylinder.type == 'dropdown4_empty')"
                          v-model="cylinder.valueCode"
                          style="width: 220px"
                          @change="selectDropdown4(cylinder)"
                          placeholder="--请选择--"
                        >
                          <el-option v-for="filed in cylinder.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                        </el-select>
                        <div style="border-bottom: 1px solid #ebeef5; padding-bottom: 30px" v-if="cylinder.type == 'dropdown4_empty' ||cylinder.nameKey == 'key_1440'">
                          <div v-for="(cylinder2, index8) in cylinder.children" :key="index8">
                            <div
                              v-if="
                                cylinder.value != null &&
                                  cylinder.value != '' &&
                                  (cylinder2.valueCodeNotDisplay == '' ||
                                    cylinder2.valueCodeNotDisplay == null ||
                                    (cylinder2.valueCodeNotDisplay && 
                                    !cylinder2.valueCodeNotDisplay.includes(cylinder.valueCode))
                                  ) || cylinder.nameKey == 'key_1440'
                              "
                            >
                              <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                                <span slot="label">
                                  {{ cylinder2.name }}
                                  <span v-if="cylinder2.unit">({{ cylinder2.unit }})</span>
                                  <span v-if="cylinder2.nameKey == 'key_1381'">{{index6+1}}</span>
                                  <span v-if="cylinder2.nameKey == 'key_1381' && 
                                  index6!=0" style="color:#dd0000;margin-left:6px;"
                                  @click="deleteItem(cylinder)">删除</span>
                                  <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                                </span>
                                <span v-if="type == 'view'">{{ cylinder2.value }}</span>
                                <el-select
                                  size="small"
                                  clearable
                                  v-if="type == 'edit' && cylinder2.type == 'dropdown2'"
                                  v-model="cylinder2.valueCode"
                                  style="width: 220px"
                                  @change="
                                    val => {
                                      dropdown2Change(val, cylinder2);
                                    }
                                  "
                                  placeholder="--请选择--"
                                >
                                  <el-option v-for="filed in cylinder2.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                </el-select>
                                <el-select
                                  size="small"
                                  v-if="type == 'edit' && cylinder2.type == 'dropdown4'"
                                  v-model="cylinder2.valueCode"
                                  style="width: 220px"
                                  @change="selectDropdown4(cylinder2)"
                                  placeholder="--请选择--"
                                >
                                  <el-option v-for="filed in cylinder2.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                </el-select>
                                <div
                                  style="border-bottom: 1px solid #ebeef5; padding-bottom: 30px"
                                  v-if="cylinder2.type == 'dropdown4'"
                                  v-for="(cylinder3, index9) in cylinder2.children"
                                  :key="index9"
                                >
                                  <div
                                    v-if="
                                      cylinder3.valueCodeNotDisplay == '' ||
                                        cylinder3.valueCodeNotDisplay == null ||
                                        (cylinder3.valueCodeNotDisplay && !cylinder3.valueCodeNotDisplay.includes(cylinder2.valueCode))
                                    "
                                  >
                                    <el-form-item :label="cylinder3.name + '：'" :required="cylinder3.required" style="margin-top: 20px">
                                      <span slot="label">
                                        {{ cylinder3.name }}
                                        <span v-if="cylinder3.unit">({{ cylinder3.unit }})</span>
                                        <span v-if="cylinder3.type == 'img'">（最多上传{{ cylinder3.length }}张图片）</span>
                                      </span>
                                      <span v-if="type == 'view'">{{ cylinder3.value }}</span>
                                      <el-select
                                        size="small"
                                        v-if="type == 'edit' && cylinder3.type == 'dropdown4'"
                                        v-model="cylinder3.valueCode"
                                        style="width: 220px"
                                        @change="selectDropdown4(cylinder3)"
                                        placeholder="--请选择--"
                                      >
                                        <el-option v-for="filed in cylinder3.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                      </el-select>
                                      <el-input
                                        v-if="type == 'edit' && cylinder3.type == 'textarea'"
                                        type="textarea"
                                        placeholder="请输入"
                                        v-model="cylinder3.value"
                                        :maxlength="cylinder3.length"
                                        show-word-limit
                                        :autosize="autosize"
                                        clearable
                                      />
                                      <el-input
                                        v-if="cylinder3.type == 'input1' && type == 'edit'"
                                        :placeholder="cylinder3.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                        :disabled="cylinder3.disabled"
                                        v-model="cylinder3.value"
                                        :maxlength="cylinder3.length"
                                        style="width: 220px"
                                        size="small"
                                        clearable
                                      >
                                      </el-input>
                                      <el-input
                                        v-if="cylinder3.type == 'input2' && type == 'edit'"
                                        style="width: 220px"
                                        size="small"
                                        @keyup.native="proving1(cylinder3)"
                                        :maxlength="cylinder3.length"
                                        v-model="cylinder3.value"
                                        placeholder="请输入"
                                      ></el-input>
                                      <el-upload
                                        v-if="cylinder3.type == 'img' && type == 'edit'"
                                        :class="{ noUploadBtn: cylinder3.imgFullDtoUrl.length >= cylinder3.length || notShowUploadBtn }"
                                        :action="uploadUrl"
                                        accept="image/*"
                                        list-type="picture-card"
                                        :limit="cylinder3.length"
                                        :auto-upload="false"
                                        :disabled="true"
                                        :file-list="cylinder3.imgFullDtoUrl"
                                        :before-upload="beforeAvatarUpload"
                                      >
                                        <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder3)">
                                          <i class="el-icon-plus"></i>
                                        </div>
                                        <div slot="file" slot-scope="{ file }">
                                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                          <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                            <span class="el-upload-list__item-preview">
                                              <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '666')"></i>
                                            </span>
                                            <span class="el-upload-list__item-preview">
                                              <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder3, 'imgCutterTab3')"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete">
                                              <i class="el-icon-delete" @click.self="handleRemove(file, cylinder3)"></i>
                                            </span>
                                          </span>
                                        </div>
                                      </el-upload>
                                      <!-- 上传图片 -->
                                    </el-form-item>
                                  </div>
                                </div>
                                <el-input
                                  v-if="type == 'edit' && cylinder2.type == 'textarea'"
                                  type="textarea"
                                  placeholder="请输入"
                                  v-model="cylinder2.value"
                                  :maxlength="cylinder2.length"
                                  show-word-limit
                                  :autosize="autosize"
                                  clearable
                                />
                                <el-input
                                  v-if="cylinder2.type == 'input1' && type == 'edit'"
                                  :placeholder="cylinder2.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                  :disabled="cylinder2.disabled"
                                  v-model="cylinder2.value"
                                  :maxlength="cylinder2.length"
                                  style="width: 220px"
                                  size="small"
                                  clearable
                                >
                                </el-input>
                                <el-input
                                  v-if="cylinder2.type == 'input2' && type == 'edit'"
                                  style="width: 220px"
                                  size="small"
                                  @keyup.native="proving1(cylinder2)"
                                  :maxlength="cylinder2.length"
                                  v-model="cylinder2.value"
                                  placeholder="请输入"
                                ></el-input>
                                <el-upload
                                  v-if="cylinder2.type == 'img' && type == 'edit'"
                                  :class="{ noUploadBtn: cylinder2.imgFullDtoUrl.length >= cylinder2.length || notShowUploadBtn }"
                                  :action="uploadUrl"
                                  accept="image/*"
                                  list-type="picture-card"
                                  :limit="cylinder2.length"
                                  :auto-upload="false"
                                  :disabled="true"
                                  :file-list="cylinder2.imgFullDtoUrl"
                                  :before-upload="beforeAvatarUpload"
                                >
                                  <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder2)">
                                    <i class="el-icon-plus"></i>
                                  </div>
                                  <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                      <span class="el-upload-list__item-preview">
                                        <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '777')"></i>
                                      </span>
                                      <span class="el-upload-list__item-preview">
                                        <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder2, 'imgCutterTab-bearing3')"></i>
                                      </span>
                                      <span v-if="!disabled" class="el-upload-list__item-delete">
                                        <i class="el-icon-delete" @click.self="handleRemove(file, cylinder2)"></i>
                                      </span>
                                    </span>
                                  </div>
                                </el-upload>
                                <!-- 上传图片 -->
                              </el-form-item>
                            </div>
                          </div>
                        </div>
                        <div
                          :style="[
                            {
                              borderBottom:
                                cylinder.type == 'dropdown4' &&
                                cylinder.nameKey != 'key_kscl_rhjjc_other' &&
                                cylinder.nameKey != 'key_kscl_psxt_psxt_other' &&
                                cylinder.nameKey != 'key_kscl_xtjc__other'
                                  ? '1px solid #EBEEF5'
                                  : 'none'
                            },
                            { paddingBottom: '30px' }
                          ]"
                          v-if="cylinder.type == 'dropdown4'"
                        >
                        
                          <div v-for="(cylinder2, index7) in cylinder.children" :key="index7">
                            <div
                              v-if="
                                cylinder2.valueCodeNotDisplay == '' ||
                                  cylinder2.valueCodeNotDisplay == null ||
                                  (cylinder2.valueCodeNotDisplay && !cylinder2.valueCodeNotDisplay.includes(cylinder.valueCode))
                              "
                            >
                              <el-form-item :required="cylinder2.required" style="margin-top: 20px">
                                <span slot="label">
                                  <span v-if="cylinder2.display">{{ cylinder2.name }} </span>
                                  <span v-if="cylinder2.unit && cylinder2.display && cylinder2.nameKey != 'key_every_month_add_num'">（{{ cylinder2.unit }}）</span>
                                  <span style="margin-left: 20px" v-if="cylinder2.type == 'string' && cylinder2.display"
                                    >{{ cylinder2.value || "暂无" }}<span v-if="cylinder2.unit && cylinder2.display" style="margin-left: 4px">{{ cylinder2.unit }}</span>
                                  </span>
                                  <span v-if="cylinder2.type == 'img' && cylinder2.display">（最多上传{{ cylinder2.length }}张图片）</span>
                                  <span class="no-wrap" v-if="cylinder2.tip && cylinder2.tip.type == 'text'">
                                    <el-tooltip class="item" effect="dark" :content="cylinder2.tip.content" placement="top-start">
                                      <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                                        <i class="el-icon-warning-outline"></i>
                                      </el-button>
                                    </el-tooltip>
                                  </span>
                                  <span v-if="cylinder2.tip && cylinder2.tip.type == 'img'" @click.stop="() => operatebtn(cylinder2)">
                                    <el-popover :ref="`popover-${cylinder2.id}`" placement="right" width="auto" trigger="click">
                                      <img style="width: 600px" :src="imgFullUrl" alt="" />
                                      <el-button slot="reference" type="text" style="color: rgba(33, 150, 243); font-size: 15px; padding: 0px; font-size: 12px"> 查看参考 </el-button>
                                    </el-popover>
                                  </span>
                                </span>
                                <span v-if="type == 'view'">{{ cylinder2.value }}</span>
                                <el-select
                                  size="small"
                                  clearable
                                  v-if="type == 'edit' && cylinder2.type == 'dropdown2'"
                                  v-model="cylinder2.valueCode"
                                  style="width: 220px"
                                  @change="
                                    val => {
                                      dropdown2Change(val, cylinder2);
                                    }
                                  "
                                  placeholder="--请选择--"
                                >
                                  <el-option v-for="filed in cylinder2.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                </el-select>
                                <!-- 下拉多选 -->
                                <el-select
                                  v-if="cylinder2.type == 'dropdown_multi'"
                                  size="small"
                                  @change="selectId => dropdownMulti(selectId, index1, cylinder2)"
                                  v-model="cylinder2.valueCheckBoxList"
                                  multiple
                                  placeholder="请选择"
                                >
                                  <el-option v-for="item in cylinder2.fieldOption" :key="item.option" :label="item.option" :value="item.option"> </el-option>
                                </el-select>
                                <el-select
                                  size="small"
                                  v-if="type == 'edit' && cylinder2.type == 'dropdown4'"
                                  v-model="cylinder2.valueCode"
                                  style="width: 220px"
                                  @change="selectDropdown4(cylinder2)"
                                  placeholder="--请选择--"
                                >
                                  <el-option v-for="filed in cylinder2.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                </el-select>
                                <div v-if="cylinder2.type == 'dropdown4'">
                                  <div v-for="(cylinder3, index1) in cylinder2.children" :key="index1">
                                    <div
                                      v-if="
                                        cylinder3.valueCodeNotDisplay == '' ||
                                          cylinder3.valueCodeNotDisplay == null ||
                                          (cylinder3.valueCodeNotDisplay && !cylinder3.valueCodeNotDisplay.includes(cylinder2.valueCode))
                                      "
                                    >
                                      <el-form-item :label="cylinder3.name + '：'" :required="cylinder3.required" style="margin-top: 20px">
                                        <span slot="label">
                                          {{ cylinder3.name }}
                                          <span v-if="cylinder3.unit">({{ cylinder3.unit }})</span>
                                          <span v-if="cylinder3.type == 'img'">（最多上传{{ cylinder3.length }}张图片）</span>
                                        </span>
                                        <span v-if="type == 'view'">{{ cylinder3.value }}</span>
                                        <el-select
                                          size="small"
                                          v-if="type == 'edit' && cylinder3.type == 'dropdown4'"
                                          v-model="cylinder3.valueCode"
                                          style="width: 220px"
                                          @change="selectDropdown4(cylinder3)"
                                          placeholder="--请选择--"
                                        >
                                          <el-option v-for="filed in cylinder3.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                        </el-select>
                                        <el-input
                                          v-if="type == 'edit' && cylinder3.type == 'textarea'"
                                          type="textarea"
                                          placeholder="请输入"
                                          v-model="cylinder3.value"
                                          :maxlength="cylinder3.length"
                                          show-word-limit
                                          :autosize="autosize"
                                          clearable
                                        />
                                        <el-input
                                          v-if="cylinder3.type == 'input1' && type == 'edit'"
                                          :placeholder="cylinder3.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                          :disabled="cylinder3.disabled"
                                          v-model="cylinder3.value"
                                          :maxlength="cylinder3.length"
                                          style="width: 220px"
                                          size="small"
                                          clearable
                                        >
                                        </el-input>
                                        <el-input
                                          v-if="cylinder3.type == 'input2' && type == 'edit'"
                                          style="width: 220px"
                                          size="small"
                                          @keyup.native="proving1(cylinder3)"
                                          :maxlength="cylinder3.length"
                                          v-model="cylinder3.value"
                                          placeholder="请输入"
                                        ></el-input>
                                        <el-upload
                                          v-if="cylinder3.type == 'img' && type == 'edit'"
                                          :class="{ noUploadBtn: cylinder3.imgFullDtoUrl.length >= cylinder3.length || notShowUploadBtn }"
                                          :action="uploadUrl"
                                          accept="image/*"
                                          list-type="picture-card"
                                          :limit="cylinder3.length"
                                          :auto-upload="false"
                                          :disabled="true"
                                          :file-list="cylinder3.imgFullDtoUrl"
                                          :before-upload="beforeAvatarUpload"
                                        >
                                          <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder3)">
                                            <i class="el-icon-plus"></i>
                                          </div>
                                          <div slot="file" slot-scope="{ file }">
                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                            <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                              <span class="el-upload-list__item-preview">
                                                <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '888')"></i>
                                              </span>
                                              <span class="el-upload-list__item-preview">
                                                <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder3, 'imgCutterTab6-1')"></i>
                                              </span>
                                              <span v-if="!disabled" class="el-upload-list__item-delete">
                                                <i class="el-icon-delete" @click.self="handleRemove(file, cylinder3)"></i>
                                              </span>
                                            </span>
                                          </div>
                                        </el-upload>
                                        <!-- 上传图片 -->
                                      </el-form-item>
                                    </div>
                                  </div>
                                </div>
                                <!-- 其他   添加情况  和 图片 -->
                                <div
                                  style="margin-top: -30px"
                                  v-if="cylinder2.nameKey == 'key_kscl_rhjjc_other_item' || cylinder2.nameKey == 'key_kscl_xtjc_other_item' || cylinder2.nameKey == 'key_kscl_psxt_psxt_other_item'"
                                >
                                  <div v-for="(cylinder3, index3) in cylinder2.children" :key="index3">
                                    <div
                                      v-if="
                                        cylinder3.valueCodeNotDisplay == '' ||
                                          cylinder3.valueCodeNotDisplay == null ||
                                          (cylinder3.valueCodeNotDisplay && !cylinder3.valueCodeNotDisplay.includes(cylinder2.valueCode))
                                      "
                                    >
                                      <el-form-item :label="cylinder3.name + '：'" :required="cylinder3.required" >
                                        <span slot="label">
                                          {{ cylinder3.name }} <span v-if="cylinder3.nameKey == 'key_kscl_other_item_qk'">{{ index7 + 1 }}</span>
                                          <span v-if="cylinder3.unit">({{ cylinder3.unit }})</span>
                                          <span v-if="cylinder3.type == 'img'">（最多上传{{ cylinder3.length }}张图片）</span>
                                        </span>
                                        <span v-if="type == 'view'">{{ cylinder3.value }}</span>
                                        <el-select
                                          size="small"
                                          v-if="type == 'edit' && cylinder3.type == 'dropdown4'"
                                          v-model="cylinder3.valueCode"
                                          style="width: 220px"
                                          @change="selectDropdown4(cylinder3)"
                                          placeholder="--请选择--"
                                        >
                                          <el-option v-for="filed in cylinder3.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                                        </el-select>
                                        <el-input
                                          v-if="type == 'edit' && cylinder3.type == 'textarea'"
                                          type="textarea"
                                          placeholder="请输入"
                                          v-model="cylinder3.value"
                                          :maxlength="cylinder3.length"
                                          show-word-limit
                                          :autosize="autosize"
                                          clearable
                                        />
                                        <el-input
                                          v-if="cylinder3.type == 'input1' && type == 'edit'"
                                          :placeholder="cylinder3.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                          :disabled="cylinder3.disabled"
                                          v-model="cylinder3.value"
                                          :maxlength="cylinder3.length"
                                          style="width: 220px"
                                          size="small"
                                          clearable
                                        >
                                        </el-input>
                                        <el-input
                                          v-if="cylinder3.type == 'input2' && type == 'edit'"
                                          style="width: 220px"
                                          size="small"
                                          @keyup.native="proving1(cylinder3)"
                                          :maxlength="cylinder3.length"
                                          v-model="cylinder3.value"
                                          placeholder="请输入"
                                        ></el-input>
                                        <el-upload
                                          v-if="cylinder3.type == 'img' && type == 'edit'"
                                          :class="{ noUploadBtn: cylinder3.imgFullDtoUrl.length >= cylinder3.length || notShowUploadBtn }"
                                          :action="uploadUrl"
                                          accept="image/*"
                                          list-type="picture-card"
                                          :limit="cylinder3.length"
                                          :auto-upload="false"
                                          :disabled="true"
                                          :file-list="cylinder3.imgFullDtoUrl"
                                          :before-upload="beforeAvatarUpload"
                                        >
                                          <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder3)">
                                            <i class="el-icon-plus"></i>
                                          </div>
                                          <div slot="file" slot-scope="{ file }">
                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                            <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                              <span class="el-upload-list__item-preview">
                                                <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '999')"></i>
                                              </span>
                                              <span class="el-upload-list__item-preview">
                                                <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder3, 'imgCutterTab-gear')"></i>
                                              </span>
                                              <span v-if="!disabled" class="el-upload-list__item-delete">
                                                <i class="el-icon-delete" @click.self="handleRemove(file, cylinder3)"></i>
                                              </span>
                                            </span>
                                          </div>
                                        </el-upload>
                                        <!-- 上传图片 -->
                                      </el-form-item>
                                    </div>
                                  </div>
                                  <div style="display: flex">
                                    <div
                                      v-if="
                                        (cylinder2.nameKey == 'key_kscl_rhjjc_other_item' || cylinder2.nameKey == 'key_kscl_xtjc_other_item' || cylinder2.nameKey == 'key_kscl_psxt_psxt_other_item') &&
                                          index7 == cylinder.children.length - 1 &&
                                          !cylinder2.valueCodeNotDisplay.includes(cylinder.valueCode)
                                      "
                                      style="margin-right: 20px"
                                    >
                                      <el-button @click="addSituation" size="small" style="margin-top: 20px">添加</el-button>
                                    </div>
                                    <div v-if="index7 != 0 && !cylinder2.valueCodeNotDisplay.includes(cylinder.valueCode)">
                                      <el-button @click="deleteSituation(index7)" size="small" style="margin-top: 20px;margin-left:6px;">删除</el-button>
                                    </div>
                                  </div>
                                </div>
                                <el-input
                                  v-if="type == 'edit' && cylinder2.type == 'textarea'"
                                  type="textarea"
                                  placeholder="请输入"
                                  v-model="cylinder2.value"
                                  :maxlength="cylinder2.length"
                                  show-word-limit
                                  :autosize="autosize"
                                  clearable
                                />
                                <el-input
                                  v-if="cylinder2.type == 'input1' && type == 'edit'"
                                  :placeholder="cylinder2.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                                  :disabled="cylinder2.disabled"
                                  v-model="cylinder2.value"
                                  :maxlength="cylinder2.length"
                                  style="width: 220px"
                                  size="small"
                                  clearable
                                >
                                </el-input>
                                <el-input
                                  v-if="cylinder2.type == 'input2' && type == 'edit'"
                                  style="width: 220px"
                                  size="small"
                                  :disabled="cylinder2.nameKey == 'key_kscl_psxt_psxt_sjmfzpsl'"
                                  @keyup.native="proving1(cylinder2)"
                                  :maxlength="cylinder2.length"
                                  v-model="cylinder2.value"
                                  placeholder="请输入"
                                ></el-input>
                                <el-upload
                                  v-if="cylinder2.type == 'img' && type == 'edit'"
                                  :class="{ noUploadBtn: cylinder2.imgFullDtoUrl.length >= cylinder2.length || notShowUploadBtn }"
                                  :action="uploadUrl"
                                  accept="image/*"
                                  list-type="picture-card"
                                  :limit="cylinder2.length"
                                  :auto-upload="false"
                                  :disabled="true"
                                  :file-list="cylinder2.imgFullDtoUrl"
                                  :before-upload="beforeAvatarUpload"
                                >
                                  <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder2)">
                                    <i class="el-icon-plus"></i>
                                  </div>
                                  <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                      <span class="el-upload-list__item-preview">
                                        <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '10')"></i>
                                      </span>
                                      <span class="el-upload-list__item-preview">
                                        <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder2, 'imgCutterTab6')"></i>
                                      </span>
                                      <span v-if="!disabled" class="el-upload-list__item-delete">
                                        <i class="el-icon-delete" @click.self="handleRemove(file, cylinder2)"></i>
                                      </span>
                                    </span>
                                  </div>
                                </el-upload>
                                <!-- 上传图片 -->
                              </el-form-item>
                            </div>
                          </div>
                        </div>
                        <!--   循环系统 冷却方式为水冷 展示-->
                        <div v-if="deviceDetail.reportType == '4' && cylinder.nameKey == 'key_hrqjc_lqfs_shuileng_fields' && shuileng">
                          <div v-for="(cylinder2, index1) in cylinder.children" :key="index1">
                            <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                              <span slot="label">
                                {{ cylinder2.name }}
                                <span v-if="cylinder2.unit">({{ cylinder2.unit }})</span>
                                <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                              </span>
                              <el-input
                                v-if="cylinder2.type == 'input2' && type == 'edit'"
                                style="width: 220px"
                                size="small"
                                @keyup.native="proving1(cylinder2)"
                                :maxlength="cylinder2.length"
                                v-model="cylinder2.value"
                                placeholder="请输入"
                              ></el-input>
                              <el-select
                                v-if="type == 'edit' && cylinder2.type == 'dropdown2'"
                                size="small"
                                clearable
                                :disabled="cylinder2.disabled"
                                style="width: 220px"
                                @change="changeVal(cylinder2)"
                                v-model="cylinder2.valueCode"
                                placeholder="--请选择--"
                              >
                                <el-option v-for="item in cylinder2.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                        </div>
                        <!--   液压系统 冷却方式为水冷 展示-->
                        <div v-if="deviceDetail.reportType == '5' && cylinder.nameKey == 'key_ye_ya_hrqjc_hrqcs' && shuileng">
                          <!-- key_ye_ya_hrqjc_hrqcs -->
                          <div>{{ cylinder.name }}</div>
                          <div v-for="(cylinder2, index1) in cylinder.children" :key="index1">
                            <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                              <span slot="label">
                                {{ cylinder2.name }}
                                <span v-if="cylinder2.unit">({{ cylinder2.unit }})</span>
                                <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                              </span>
                              <el-input
                                v-if="cylinder2.type == 'input2' && type == 'edit'"
                                style="width: 220px"
                                size="small"
                                @keyup.native="proving1(cylinder2)"
                                :maxlength="cylinder2.length"
                                v-model="cylinder2.value"
                                placeholder="请输入"
                              ></el-input>
                              <el-select
                                v-if="type == 'edit' && cylinder2.type == 'dropdown2'"
                                size="small"
                                clearable
                                :disabled="cylinder2.disabled"
                                style="width: 220px"
                                @change="changeVal(cylinder2)"
                                v-model="cylinder2.valueCode"
                                placeholder="--请选择--"
                              >
                                <el-option v-for="item in cylinder2.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                        </div>
                        <el-input
                          v-if="cylinder.type == 'input1' && type == 'edit'"
                          :placeholder="cylinder.nameKey == 'key_hrqjc_hrqzl' ? '--请输入EB和型号--' : '--请输入--'"
                          :disabled="cylinder.disabled"
                          v-model="cylinder.value"
                          :maxlength="cylinder.length"
                          style="width: 220px"
                          size="small"
                          clearable
                        >
                        </el-input>
                        <el-input
                          v-if="cylinder.type == 'input2' && type == 'edit' && !cylinder.nameKey.includes('key_yxjc_yx_size')"
                          style="width: 220px"
                          size="small"
                          @keyup.native="proving1(cylinder)"
                          :maxlength="cylinder.length"
                          v-model="cylinder.value"
                          placeholder="请输入"
                        ></el-input>
                        <el-upload
                          v-if="(cylinder.type == 'img' && type == 'edit' && cylinder.nameKey != 'key_ye_ya_yxjc_hxflx_pic') || (!picFlag && cylinder.nameKey == 'key_ye_ya_yxjc_hxflx_pic')"
                          :class="{ noUploadBtn: cylinder.imgFullDtoUrl.length >= cylinder.length || notShowUploadBtn }"
                          :action="uploadUrl"
                          accept="image/*"
                          list-type="picture-card"
                          :limit="cylinder.length"
                          :auto-upload="false"
                          :disabled="true"
                          :file-list="cylinder.imgFullDtoUrl"
                          :before-upload="beforeAvatarUpload"
                        >
                          <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder)">
                            <i class="el-icon-plus"></i>
                          </div>
                          <div slot="file" slot-scope="{ file }">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                              <span class="el-upload-list__item-preview">
                                <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '11')"></i>
                              </span>
                              <span class="el-upload-list__item-preview">
                                <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder, 'imgCutterTab1')"></i>
                              </span>
                              <span v-if="!disabled" class="el-upload-list__item-delete">
                                <i class="el-icon-delete" @click.self="handleRemove(file, cylinder)"></i>
                              </span>
                            </span>
                          </div>
                        </el-upload>
                        <!-- 上传图片 -->
                      </el-form-item>
                    </div>
                    
                    <div
                      v-if="child.valueCode &&
                          child.type == 'dropdown4' &&
                          (child.nameKey == 'key_aqts_item' || child.nameKey == 'key_aqts') &&
                          index == child.children.length - 1 &&
                          !cylinder.valueCodeNotDisplay.includes(child.valueCode)">
                      <el-button @click="addNotice" size="small" style="margin-top: 20px">添加提示</el-button>
                    </div>
                  </div>
                </div>
                <!-- 设备检查-油品检查-其他-添加情况按钮 -->
                <el-button size="small" v-if="child.nameKey == 'key_1380' && 
                  !(child.valueCodeNotDisplay==child.valueCode)" 
                  @click="addDeveiceSituation">添加情况
                </el-button>
              </div>
                <div style="display: flex">
                  <div v-if="activeName == 'key_bscl_cljc' && index1 == lubricationSystemInspectionForm.length - 1" style="margin-right: 20px">
                    <el-button @click="addGear" :disabled="disabledAddGear" size="small" style="margin-top: 20px">添加齿轮组</el-button>
                  </div>
                  <div v-if="activeName == 'key_bscl_cljc' && index1 != 0 && index1 != 1">
                    <el-button @click="deleteGear(index1)" size="small" style="margin-top: 20px">删除齿轮组</el-button>
                  </div>
                </div>
                <!-- 设备检查-润滑系统检查-其他-添加情况 -->
                <div  v-if="child.nameKey == 'key_1407'">
                  <el-form-item>
                    <span slot="label">
                      <span class="star">*</span>
                      <span>{{ child.name }} </span>
                    </span>
                    <!-- 下拉 -->
                    <el-select size="small"
                      v-model="child.valueCode"
                      @change="selectDropdown4(child)"
                      style="width: 220px"
                      placeholder="--请选择--">
                      <el-option 
                        v-for="filed in child.fieldOption" 
                        :key="filed.value" 
                        :label="filed.option" 
                        :value="filed.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <!-- 设备检查-润滑系统检查-添加情况 -->
                <div v-if="child.type == 'dropdown4' && (child.nameKey == 'key_1407')">
                  <div v-for="(cylinder, index1) in child.children" :key="index1">
                    <div v-if="!cylinder.valueCodeNotDisplay.includes(child.valueCode)">
                      <div v-for="(cylinder2, index2) in cylinder.children" :key="index2">
                        <div>
                          <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                            <span slot="label">
                              {{ cylinder2.name }} <span v-if='cylinder2.name=="情况"'>{{ index1 + 1 }} </span>
                              <span v-if="cylinder2.name == '情况' && 
                              index1!=0 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)" 
                              style="color:#dd0000;margin-left:6px;" @click="deleteLupSituation(cylinder)">删除</span>
                              <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                            </span>
                            <span v-if="type == 'view'">{{ cylinder2.value }}</span>
                            <el-input
                              v-if="type == 'edit' && cylinder2.type == 'textarea'"
                              type="textarea"
                              placeholder="请输入"
                              style="width: 100%"
                              v-model="cylinder2.value"
                              :maxlength="cylinder2.length"
                              show-word-limit
                              :autosize="autosize"
                              clearable
                            />
                            <el-upload
                              v-if="cylinder2.type == 'img' && type == 'edit'"
                              :class="{ noUploadBtn: cylinder2.imgFullDtoUrl.length >= cylinder2.length || notShowUploadBtn }"
                              :action="uploadUrl"
                              accept="image/*"
                              list-type="picture-card"
                              :limit="cylinder2.length"
                              :auto-upload="false"
                              :disabled="true"
                              :file-list="cylinder2.imgFullDtoUrl"
                              :before-upload="beforeAvatarUpload"
                            >
                              <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder2)">
                                <i class="el-icon-plus"></i>
                              </div>
                              <div slot="file" slot-scope="{ file }">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                  <span class="el-upload-list__item-preview">
                                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '12')"></i>
                                  </span>
                                  <span class="el-upload-list__item-preview">
                                    <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder2, 'imgCutterTab13')"></i>
                                  </span>
                                  <span v-if="!disabled" class="el-upload-list__item-delete">
                                    <i class="el-icon-delete" @click.self="handleRemove(file, cylinder2)"></i>
                                  </span>
                                </span>
                              </div>
                            </el-upload>
                            <!-- 上传图片 -->
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div v-if="index1 == child.children.length - 1 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)" style="margin-right: 20px">
                        <el-button @click="addLupSituation" size="small" style="margin-top: 20px">添加情况</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 设备检查-润滑部件检查-添加检查 -->
                <div v-if="child.nameKey == 'key_1415' && index1 == lubricationSystemInspectionForm.length-1">
                  <el-button size="small" @click="addLupCheck">添加检查</el-button>
                </div>
                <!-- 安全提示 -->
                <div v-if="child.type == 'dropdown4' && (child.nameKey == 'key_aqts' || child.nameKey == 'key_1423')">
                  <div v-for="(cylinder, index1) in child.children" :key="index1">
                    <div v-if="!cylinder.valueCodeNotDisplay.includes(child.valueCode)">
                      <div v-for="(cylinder2, index2) in cylinder.children" :key="index2">
                        <div>
                          <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required" style="margin-top: 20px">
                            <span slot="label">
                              {{ cylinder2.name }} 
                              <span v-if="cylinder2.nameKey == 'key_aqts_item_name' || cylinder2.nameKey == 'key_1425'">{{ index1 + 1 }}</span>
                              <span v-if="cylinder2.unit">({{ cylinder2.unit }})</span>
                              <span v-if="cylinder2.type == 'img'">（最多上传{{ cylinder2.length }}张图片）</span>
                            </span>
                            <span v-if="type == 'view'">{{ cylinder2.value }}</span>
                            <el-input
                              v-if="type == 'edit' && cylinder2.type == 'textarea'"
                              type="textarea"
                              placeholder="请输入"
                              style="width: 100%"
                              v-model="cylinder2.value"
                              :maxlength="cylinder2.length"
                              show-word-limit
                              :autosize="autosize"
                              clearable
                            />
                            <el-upload
                              v-if="cylinder2.type == 'img' && type == 'edit'"
                              :class="{ noUploadBtn: cylinder2.imgFullDtoUrl.length >= cylinder2.length || notShowUploadBtn }"
                              :action="uploadUrl"
                              accept="image/*"
                              list-type="picture-card"
                              :limit="cylinder2.length"
                              :auto-upload="false"
                              :disabled="true"
                              :file-list="cylinder2.imgFullDtoUrl"
                              :before-upload="beforeAvatarUpload"
                            >
                              <div style="width:148px;height:148px;" @click="handlePictureUpload(cylinder2)">
                                <i class="el-icon-plus"></i>
                              </div>
                              <div slot="file" slot-scope="{ file }">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                  <span class="el-upload-list__item-preview">
                                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, '12')"></i>
                                  </span>
                                  <span class="el-upload-list__item-preview">
                                    <i class="el-icon-crop" @click.self="handlePicturePrune(file, cylinder2, 'imgCutterTab13')"></i>
                                  </span>
                                  <span v-if="!disabled" class="el-upload-list__item-delete">
                                    <i class="el-icon-delete" @click.self="handleRemove(file, cylinder2)"></i>
                                  </span>
                                </span>
                              </div>
                            </el-upload>
                            <!-- 上传图片 -->
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div v-if="index1 == child.children.length - 1 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)" style="margin-right: 20px">
                        <el-button @click="addNotice" size="small" style="margin-top: 20px">添加提示</el-button>
                      </div>
                      <div v-if="index1 != 0 && !cylinder.valueCodeNotDisplay.includes(child.valueCode)">
                        <el-button @click="deleteNotice(index1)" size="small" style="margin-top: 20px">删除提示</el-button>
                      </div>
                    </div>
                  </div>
                </div>

                
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <img-cutter
      :ref="imgCutterModal"
      label="选择本地图片"
      :crossOrigin="true"
      :isModal="true"
      :crossOriginHeader="anonymous"
      :sizeChange="false"
      toolBgc="none"
      :lockScroll="true"
      :boxWidth="800"
      :boxHeight="450"
      :toolBoxOverflow="false"
      @cutDown="val => cutDown(val, cylinder)"
    >
      <div slot="open"></div>
      <div slot="choose"></div>
    </img-cutter>
    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-card>
</template>

<script>
import imgCutter from '@/components/imgCutter.vue'
export default {
  components: { imgCutter },
  props: {
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    defaultNoticeDto: {
      type: Object,
      default: () => {
        return []
      }
    },
    dynamicItemDto: {
      type: Object,
      default: () => {
        return []
      }
    },
    hydraulicPumpObj: {
      type: Object,
      default: () => {
        return []
      }
    },
    chiLunItemDto: {
      type: Object,
      default: () => {
        return []
      }
    },
    deviceDetail: {
      type: Object,
      default: () => {
        return ''
      }
    },
    LubricationSystemInspectionName: {
      type: String,
      default: () => {
        return ''
      }
    },
    operationParametersObj: {
      type: Array,
      default: () => {
        return []
      }
    },
    deviceObj: {
      type: Array,
      default: () => {
        return []
      }
    },
    lubricationSystemInspectionObj: {
      type: Array,
      default: () => {
        return []
      }
    },
    addDeveiceSituationObj:{
      type: Object,
      default: () => {
        return {}
      }
    },
    addLupSituationObj:{
      type: Object,
      default: () => {
        return {}
      }
    },
    addLupPartsObj:{
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
      pruneIndex: null,
      activeName: '',
      indexCheck: -1,
      oilNameKey: 0,
      valueCodeLevel: '',
      valueCLLevel: '', // 齿轮箱级数
      disabledAddGear: false, // 闭式齿轮是否还可以添加齿轮组
      oilNameList: [],
      cutFileList: {},
      uploadUrl: '',
      imgDialogVisible: false,
      notShowUploadBtn: false,
      cutFlag: false,
      dialogImageUrl: '',
      tempImagePath: '',
      imgObj: [],
      imgObj1: {},
      bearingDataPart: [], // 轴承 前两个字段
      openGearDataPart: [], // 开式齿轮第一个字段
      picFlag: false, // 呼吸器状态 的上传图片
      editOil: false,
      handleEditData: [],
      kaishiCLStatus: '', // 开式齿轮运行状态
      lubricationSystemInspectionForm: [],
      lubricationSystemInspectionObj1: [],
      shuileng: false,
      noticeValue: null, // 安全提示的 valueCode
      imgFullUrl: '',
      lubricationMethod: '', // 润滑方式
      imgCutterModal: ''
    }
  },
  mounted () {},
  created () {
    this.operationParametersObj.forEach(it => {
      if (it.nameKey == 'key_filter_level' && it.valueCode) {
        this.valueCodeLevel = it.valueCode
      }
      if (it.nameKey == 'key_clxyxzt' && it.valueCode) {
        this.CLStatus = it.valueCode
      }
    })
    if (this.deviceDetail.reportType == '5') {
      this.imgObj = this.lubricationSystemInspectionObj[0]
    }
    this.lubricationSystemInspectionObj.forEach((child, index) => {
      if (child.nameKey == 'key_bscl_cljc') {
        this.lubricationSystemInspectionObj1 = child
        this.indexCheck = index
      }
    })
    this.activeName = this.lubricationSystemInspectionObj[0].nameKey
    this.$nextTick(() => {
      if (this.deviceDetail.reportType == '5') {
        this.$refs.tabs.$children[0].$refs.tabs[0].style.display = 'none'
        this.activeName = this.lubricationSystemInspectionObj[1].nameKey
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[1].children
      } else {
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[0].children
      }
    })
    // 查找换热器检查
    if (this.deviceDetail.reportType == '5') {
      let hrqjc = this.lubricationSystemInspectionObj.filter(it => it.nameKey == 'key_ye_ya_hrqjc')
      let hrq = hrqjc[0].children.filter(it2 => it2.nameKey == 'key_ye_ya_hrqjc_drop_down')
      let hrqValue = hrq[0].children.filter(it3 => it3.nameKey == 'key_ye_ya_hrqjc_lqfs')
      if (hrqValue[0].value == '水冷') {
        this.shuileng = true
      } else {
        this.shuileng = false
      }
    }
    // 呼吸器状态 图片的默认值
    if (this.deviceDetail.reportType == '5') {
      let hrqjc1 = this.lubricationSystemInspectionObj.filter(it => it.nameKey == 'key_ye_ya_yxjc')
      let hrq1 = hrqjc1[0].children.filter(it2 => it2.nameKey == 'key_ye_ya_yxjc_hxflx')
      let hrqValue1 = hrq1[0].children.filter(it3 => it3.nameKey == 'key_ye_ya_yxjc_hxflx_status')
      if (hrqValue1[0].valueCode == '0') {
        this.picFlag = true
      } else {
        this.picFlag = false
      }
    }
    if (this.deviceDetail.reportType == '4') {
      let hrqjc = this.lubricationSystemInspectionObj.filter(it => it.nameKey == 'key_hrqjc')
      let hrq = hrqjc[0].children.filter(it2 => it2.nameKey == 'key_hrqjc_drop_down')
      let hrqValue = hrq[0].children.filter(it3 => it3.nameKey == 'key_hrqjc_lqfs')
      if (hrqValue[0].valueCode == '1') {
        this.shuileng = true
      } else {
        this.shuileng = false
      }
    }
    this.$nextTick(() => {
      if (this.deviceDetail.reportType == '6') {
        let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_bscl_cljc')
        if (sessionStorage.getItem('CLStatus') != null) {
          this.CLStatus = sessionStorage.getItem('CLStatus')
        }
        if (this.CLStatus == '1') {
          this.$refs.tabs.$children[0].$refs.tabs[index2].style.display = 'none'
          // }
        } else {
          this.$refs.tabs.$children[0].$refs.tabs[index2].style.display = 'inline-block'
        }
        this.activeName = this.lubricationSystemInspectionObj[0].nameKey
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[0].children
      }
    })
    // 轴承
    if (this.deviceDetail.reportType == '7') {
      this.bearingDataPart = this.lubricationSystemInspectionObj.slice(0, 2)
    }
    this.$nextTick(() => {
      if (this.deviceDetail.reportType == '7') {
        this.$refs.tabs.$children[0].$refs.tabs[0].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[1].style.display = 'none'
        this.activeName = this.lubricationSystemInspectionObj[2].nameKey
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[2].children
      }
    })
    // 开式齿轮
    if (this.deviceDetail.reportType == '8') {
      this.openGearDataPart = this.lubricationSystemInspectionObj.slice(0, 1)
      let lumData = this.deviceObj.filter(it => it.nameKey == 'lup_method')
      this.lubricationMethod = lumData[0].valueCode
      // 喷射系统tab：当【润滑方式】选择“喷射”时，显示该tab
      this.activeName = this.lubricationSystemInspectionObj[0].nameKey
      this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[0].children
    }
    this.$nextTick(() => {
      if (this.deviceDetail.reportType == '8') {
        this.$refs.tabs.$children[0].$refs.tabs[0].style.display = 'none'
        this.activeName = this.lubricationSystemInspectionObj[1].nameKey
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[1].children
        let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_kscl_psxt')
        if (this.lubricationMethod == 'lubrication_method_0003') {
          this.$refs.tabs.$children[0].$refs.tabs[index2].style.display = 'inline-block'
        } else {
          this.$refs.tabs.$children[0].$refs.tabs[index2].style.display = 'none'
        }
        // 给开式齿轮运行状态赋值
        let indexKishi = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_kscl_yxzt')
        this.kaishiCLStatus = this.lubricationSystemInspectionObj[indexKishi].valueCode
      }
    })
  },
  methods: {
    // 油品检查-添加情况
    addDeveiceSituation(){
      const addObj = _.cloneDeep(this.addDeveiceSituationObj)
      addObj.uid = _.uniqueId('deveiceSituation_')
      this.lubricationSystemInspectionForm.forEach(it=>{
        if(it.nameKey == "key_1380"){
          if(_.isEmpty(it.children[0].uid)){
            it.children[0].uid = _.uniqueId('deveiceSituation_')
          }
          it.children.push(addObj)
        }
      })
    },
    // 油品检查-删除情况
    deleteItem(val){
      this.lubricationSystemInspectionForm.forEach(it=>{
        if(it.nameKey == 'key_1380'){
          it.children.forEach((item,index)=>{
            if(item.uid == val.uid){
              it.children.splice(index,1)
            }
          })
        }
      })
    },
    // 润滑系统检查-添加情况
    addLupSituation(){
      const data = this.lubricationSystemInspectionForm.filter(it=>{
        return it.nameKey == "key_1407"
      })[0].children[0]
      if(_.isEmpty(data.uid)){
        data.uid = _.uniqueId('addLupSituation_')
      }
      const addObj = _.cloneDeep(this.addLupSituationObj)
      addObj.uid = _.uniqueId('addLupSituation_')
      this.lubricationSystemInspectionForm[this.lubricationSystemInspectionForm.length-1].children.push(addObj)
    },
    // 润滑系统检查-删除情况
    deleteLupSituation(val){
      this.lubricationSystemInspectionForm.forEach(it=>{
        if(it.nameKey == "key_1407"){
          it.children.forEach((item,index)=>{
            if(item.uid == val.uid){
              it.children.splice(index,1)
            }
          })
        }
      })
    },
    // 润滑部件检查-添加检查
    addLupCheck(){
      // addLupPartsObj
      const data = this.lubricationSystemInspectionForm[0]
      if(_.isEmpty(data.uid)){
        data.uid = _.uniqueId('addLupCheck_')
      }
      const addObj = _.cloneDeep(this.addLupPartsObj)
      addObj.uid = _.uniqueId('addLupCheck_')
      this.lubricationSystemInspectionForm.push(addObj)
    },
    // 润滑部件检查-删除检查
    deleteLupCheck(val){
      this.lubricationSystemInspectionForm.forEach((item,idx)=>{
        if(item.uid == val.uid){
          this.lubricationSystemInspectionForm.splice(idx,1)
        }
      })
    },
    operatebtn (val) {
      this.imgFullUrl = ''
      const params = {
        url: val.tip.content
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
        if (res.data.code == 1000) {
          this.imgFullUrl = res.data.data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    proving1 (item) {
      if (item.rangeMin >= 0) {
        item.value = item.value.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        item.value = item.value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        item.value = item.value
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.') // 只允许输入一个小数点
        item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入3个小数
        item.value = item.value.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.value = item.value.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
        item.value = item.value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      } else {
        item.value = item.value.replace(/[^\-\d.]/g, '') // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        item.value = item.value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        item.value = item.value
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.') // 只允许输入一个小数点
        item.value = item.value
          .replace('-', '$#$')
          .replace(/\-/g, '')
          .replace('$#$', '-') // 只允许输入一个负号
        item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入3个小数
        item.value = item.value.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.value = item.value.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
        item.value = item.value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (!item.decimalPrecision && item.nameKey == 'key') {
        item.value = item.value.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '') // 清除"数字"和"."以外的字符
      }
      if (!item.decimalPrecision && item.nameKey == 'key') {
        item.value = item.value.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '') // 清除"数字"和"."以外的字符
      }
      if (!item.decimalPrecision && item.nameKey == 'key') {
        item.value = item.value.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '') // 清除"数字"和"."以外的字符
      }
      // 月工作时间   编辑月工作时间，实时计算  实际每分钟喷射量
      if (item.nameKey == 'key_kscl_psxt_psxt_ygzsj') {
        let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_kscl_psxt')
        let index3 = this.lubricationSystemInspectionObj[index2].children[0].children.findIndex(item => item.nameKey == 'key_1060')
        let index4 = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children.findIndex(item => item.nameKey == 'key_every_month_add_num')
        let indexPre = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index4].value
        let index5 = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children.findIndex(item => item.nameKey == 'key_kscl_psxt_psxt_sjmfzpsl')
        let indexPre2 = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index5]
        let dataUnit
        if (this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index4].unit == 'L') {
          if (indexPre) {
            let num = parseFloat(((indexPre * 1000) / (item.value * 60)).toFixed(3))
            indexPre2.value = num
          }
        } else {
          if (indexPre) {
            dataUnit = ((indexPre * 138) / 159) * 1000
            let num = parseFloat((dataUnit / (item.value * 60)).toFixed(3))
            indexPre2.value = num
          }
        }
      }
    },
    changeVal (item) {
      let obj = item.fieldOption.filter(it => it.value == item.valueCode)
      item.value = obj[0].option
    },
    dropdown2Change (val, item) {
      let obj = item.fieldOption.filter(it => it.value == item.valueCode)
      item.value = obj[0].option
      if (item.nameKey == 'key_hrqjc_lqfs' && item.valueCode == '1') {
        this.shuileng = true
      } else {
        this.shuileng = false
      }
    },
    // 开式齿轮齿轮箱运行状态
    selectCLStatus (val, child) {
      let optionsData = this.openGearDataPart[0].fieldOption
      let index1 = optionsData.find(item => item.value == val)
      child.value = index1.option
      child.valueCode = index1.value
      this.openGearDataPart.value = index1.option
      this.openGearDataPart.valueCode = index1.value
      this.kaishiCLStatus = index1.value
      this.activeName = this.lubricationSystemInspectionObj[1].nameKey
      this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[1].children
    },
    changeRadio (val, index) {
      // let optionsData = this.lubricationSystemInspectionForm[0].fieldOption
      // let index1 = optionsData.find(item=>item.option == val)
      // this.lubricationSystemInspectionForm[0].value = index1.option
      // this.lubricationSystemInspectionForm[0].valueCode = index1.value
    },
    dropdownMulti (val, index, child, it) {
      child.value = child.valueCheckBoxList.toString()
    },
    changebox (val, index, child, it) {
      if (it == 'huxiqi') {
        if (val.length) {
          if (val[val.length - 1] == '其他') {
            child.valueCheckBoxList = ['其他']
          }
          if (val[val.length - 1] != '其他') {
            // 有正常得选项
            let index = val.findIndex(it => it == '其他')
            if (index > -1) {
              val.splice(index, 1)
              child.valueCheckBoxList = val
            }
          }
        }
      } else {
        if (val.length) {
          if (val[val.length - 1] == '无上述情况') {
            child.valueCheckBoxList = ['无上述情况']
          }
          if (val[val.length - 1] != '无上述情况') {
            // 有正常得选项
            let index = val.findIndex(it => it == '无上述情况')
            if (index > -1) {
              val.splice(index, 1)
              child.valueCheckBoxList = val
            }
          }
        }
      }
    },
    // 液压泵 个数 下拉事件
    LumMethods (a, b) {
      if (this.lubricationSystemInspectionForm.length > 2) {
        this.lubricationSystemInspectionForm.splice(2, this.lubricationSystemInspectionForm.length - 2)
      }
      for (let i = 0; i < a; i++) {
        const data = JSON.parse(JSON.stringify(this.hydraulicPumpObj))
        data._uid = Date.now() + a
        this.lubricationSystemInspectionForm.push(data)
      }
    },
    // 添加情况
    addSituation () {
      let index
      let addSistuation = this.dynamicItemDto.ksclOtherDto
      // 润滑剂检查
      if (this.lubricationSystemInspectionForm[0].nameKey == 'key_kscl_rhjjc_rhjjc') {
        index = this.lubricationSystemInspectionForm[0].children.findIndex(it => it.nameKey == 'key_kscl_rhjjc_other')
        if (this.lubricationSystemInspectionForm[0].children[index].children.length <= 9) {
          const data = JSON.parse(JSON.stringify(addSistuation))
          data._uid = Date.now()
          this.lubricationSystemInspectionForm[0].children[index].children.push(data)
        } else {
          this.$message.error('最多可添加10条')
        }
      }
      // 箱体检查
      if (this.lubricationSystemInspectionForm[0].nameKey == 'key_kscl_xtjc_drop') {
        index = this.lubricationSystemInspectionForm[0].children.findIndex(it => it.nameKey == 'key_kscl_xtjc__other')
        if (this.lubricationSystemInspectionForm[0].children[index].children.length <= 9) {
          const data = JSON.parse(JSON.stringify(addSistuation))
          data._uid = Date.now()
          this.lubricationSystemInspectionForm[0].children[index].children.push(data)
        } else {
          this.$message.error('最多可添加10条')
        }
      }
      // 喷射系统
      if (this.lubricationSystemInspectionForm[0].nameKey == 'key_1047') {
        index = this.lubricationSystemInspectionForm[0].children.findIndex(it => it.nameKey == 'key_kscl_psxt_psxt_other')
        if (this.lubricationSystemInspectionForm[0].children[index].children.length <= 9) {
          const data = JSON.parse(JSON.stringify(addSistuation))
          data._uid = Date.now()
          this.lubricationSystemInspectionForm[0].children[index].children.push(data)
        } else {
          this.$message.error('最多可添加10条')
        }
      }
    },
    // 删除情况
    deleteSituation (index1) {
      let index
      // 润滑剂检查
      if (this.lubricationSystemInspectionForm[0].nameKey == 'key_kscl_rhjjc_rhjjc') {
        index = this.lubricationSystemInspectionForm[0].children.findIndex(it => it.nameKey == 'key_kscl_rhjjc_other')
        this.lubricationSystemInspectionForm[0].children[index].children.splice(index1, 1)
      }
      // 箱体检查
      if (this.lubricationSystemInspectionForm[0].nameKey == 'key_kscl_xtjc_drop') {
        index = this.lubricationSystemInspectionForm[0].children.findIndex(it => it.nameKey == 'key_kscl_xtjc__other')
        this.lubricationSystemInspectionForm[0].children[index].children.splice(index1, 1)
      }
      // 喷射系统
      if (this.lubricationSystemInspectionForm[0].nameKey == 'key_1047') {
        index = this.lubricationSystemInspectionForm[0].children.findIndex(it => it.nameKey == 'key_kscl_psxt_psxt_other')
        this.lubricationSystemInspectionForm[0].children[index].children.splice(index1, 1)
      }
    },
    // 添加提示
    addNotice () {
      if (this.lubricationSystemInspectionForm[0].children.length <= 9) {
        const data = JSON.parse(JSON.stringify(this.defaultNoticeDto)).children[0]
        data._uid = Date.now()
        this.lubricationSystemInspectionForm[0].children.push(data)
      } else {
        this.$message.error('最多可添加10条')
      }
    },
    // 删除提示
    deleteNotice (index) {
      this.lubricationSystemInspectionForm[0].children.splice(index, 1)
    },
    // 添加小齿轮
    addSmallGear () {
      let index
      let addSmallGearDear = this.dynamicItemDto.ksclSmallChiLunDto
      index = this.lubricationSystemInspectionForm.findIndex(it => it.nameKey == 'key_kscl_cljc_chilun')
      if (this.lubricationSystemInspectionForm[index].children.length <= 5) {
        const data = JSON.parse(JSON.stringify(addSmallGearDear))
        data._uid = Date.now()
        this.lubricationSystemInspectionForm[index].children.push(data)
      } else {
        this.$message.error('最多可添加4条')
      }
    },
    // 删除小齿轮
    deleteSmallGear (index1) {
      let index = this.lubricationSystemInspectionForm.findIndex(it => it.nameKey == 'key_kscl_cljc_chilun')
      this.lubricationSystemInspectionForm[index].children.splice(index1, 1)
    },
    // 添加位置
    addPosition (index, index1, index2, index3, index4) {
      let addPositionData = this.dynamicItemDto.ksclSmallChiLunPositionDto
      if (this.lubricationSystemInspectionForm[index1].children[index2].children[index3].children[index4].children.length <= 7) {
        const data = JSON.parse(JSON.stringify(addPositionData))
        data._uid = Date.now()
        this.lubricationSystemInspectionForm[index1].children[index2].children[index3].children[index4].children.push(data)
      } else {
        this.$message.error('最多可添加3条')
      }
      this.createdlineChart(index, index1, index2, index3, index4)
    },
    // 删除位置
    deletePosition (index, index1, index2, index3, index4, index5) {
      this.lubricationSystemInspectionForm[index1].children[index2].children[index3].children[index4].children.splice(index5, 1)
      this.createdlineChart(index, index1, index2, index3, index4)
    },
    onInputBlur (item, index, index1, index2, index3, index4) {
      this.createdlineChart(index, index1, index2, index3, index4)
    },
    // 生成折线图
    createdlineChart (index, index1, index2, index3, index4) {
      let data = this.lubricationSystemInspectionForm[index1].children[index2].children[index3].children[index4].children
      let positionData = []
      let aAxis = []
      data.forEach((it, index) => {
        positionData.push(it.value)
        aAxis.push(index + 1)
      })
      this.$nextTick(() => {
        this.handleLineChart(index, index1, index2, index3, index4, positionData, aAxis)
      })
    },
    // 生成折线图的方法
    handleLineChart (index, index1, index2, index3, index4, positionData, aAxis) {
      let dataKey = this.lubricationSystemInspectionForm[index1].children[index2].children[index3].nameKey
      this.$nextTick(() => {
        const chart = `lineChat_${index}_${index1}_${index2}_${dataKey}`
        document.getElementById(chart).style.width = '920px'
        document.getElementById(chart).style.height = '350px'
        var myEchart = this.$echarts.init(document.getElementById(chart))
        let option = {
          xAxis: {
            name: '位置',
            type: 'category',
            data: aAxis
          },
          yAxis: {
            name: '温度',
            type: 'value'
          },
          series: [
            {
              data: positionData,
              type: 'line',
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: 16,
                  color: '#000'
                }
              }
            }
          ]
        }
        myEchart.clear()
        myEchart.setOption(option)
        this.$nextTick(() => {
          window.addEventListener('resize', () => {
            myEchart.resize()
          })
        })
        setTimeout(() => {
          var img = new Image()
          img.src = myEchart.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
          })
          this.getHarfUrl(img.src, index, index1, index2, index3, index4)
        }, 1000)
      })
    },
    // 上传base64图片获取半路径
    getHarfUrl (val, index, index1, index2, index3, index4) {
      let data = this.lubricationSystemInspectionForm[index1].children[index2].children[index3].children
      let indexLine = data.findIndex(it => it.nameKey == 'key_kscl_cljc_chilun_cmwd_line_small')
      const params = {
        fileType: 'oil_err_img',
        base64StringList: [val]
      }
      this.requestMethodPost('/weChat/common/uploadFilesByBase64', params).then(res => {
        if (res.data.code == 1000) {
          data[indexLine].value = res.data.data[0]
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    selectDropdown4 (val) {
      let optionsData = val.fieldOption
      let index1 = optionsData.find(item => item.value == val.valueCode)
      val.value = index1.option
      val.valueCode = index1.value
      if (val.nameKey == 'key_ye_ya_yxjc_hxflx_status') {
        if (val.valueCode == '0') {
          this.picFlag = true
        } else {
          this.picFlag = false
        }
      }
      if ((val.nameKey == 'key_ye_ya_hrqjc_lqfs' || val.nameKey == 'key_hrqjc_lqfs') && val.valueCode == '2') {
        this.shuileng = true
      } else if ((val.nameKey == 'key_ye_ya_hrqjc_lqfs' || val.nameKey == 'key_hrqjc_lqfs') && val.valueCode == '1') {
        this.shuileng = false
      }
    },
    // 添加齿轮组
    addGear () {
      let numLevel = sessionStorage.getItem('valueCLLevel')
      if (this.lubricationSystemInspectionForm.length <= numLevel) {
        const data = JSON.parse(JSON.stringify(this.chiLunItemDto))
        data._uid = Date.now()
        this.lubricationSystemInspectionForm.push(data)
      } else {
        this.$message.warning('添加齿轮组个数不能超过齿轮箱级数')
      }
    },
    // 删除齿轮组
    deleteGear (index) {
      this.lubricationSystemInspectionForm.splice(index, 1)
    },
    handleGet (val) {
      if (val == 'change') {
        this.valueCLLevel = sessionStorage.getItem('valueCLLevel')
        let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_bscl_cljc')
        this.lubricationSystemInspectionObj[index2].children = this.lubricationSystemInspectionObj[index2].children.splice(0, 1)
        const data = JSON.parse(JSON.stringify(this.chiLunItemDto))
        data._uid = Date.now()
        this.lubricationSystemInspectionObj[index2].children.push(data)
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[0].children
      } else if (val == 'change1') {
        this.valueCodeLevel = sessionStorage.getItem('valueCodeLevel')
      } else if (val == 'change2') {
        this.CLStatus = sessionStorage.getItem('CLStatus')
        let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_bscl_cljc')
        this.CLStatus = sessionStorage.getItem('CLStatus')
        if (this.CLStatus == '1') {
          this.$refs.tabs.$children[0].$refs.tabs[index2].style.display = 'none'
        } else {
          this.$refs.tabs.$children[0].$refs.tabs[index2].style.display = 'inline-block'
        }
        this.activeName = this.lubricationSystemInspectionObj[0].nameKey
        this.lubricationSystemInspectionObj[index2].children = this.lubricationSystemInspectionObj[index2].children.splice(0, 1)
        const data = JSON.parse(JSON.stringify(this.chiLunItemDto))
        data._uid = Date.now()
        this.lubricationSystemInspectionObj[index2].children.push(data)
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[0].children
      } else if (val == 'change7') {
        this.valueCLLevel = sessionStorage.getItem('valueCLLevel')
        this.activeName = this.lubricationSystemInspectionObj[0].nameKey
        let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_bscl_cljc')
        this.lubricationSystemInspectionObj[index2].children = this.lubricationSystemInspectionObj[index2].children.splice(0, 1)
        const data = JSON.parse(JSON.stringify(this.chiLunItemDto))
        data._uid = Date.now()
        this.lubricationSystemInspectionObj[index2].children.push(data)
        this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[0].children
      } else {
        this.$_getLubricationPointDetail()
      }
    },
    // 查看润滑点详情
    $_getLubricationPointDetail () {
      let params = {
        lubricationPointNumber: this.deviceDetail.lubricationPointNumber
      }
      this.requestMethodGet('/web/device/queryLubricationPointDetail', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            this.lubricationMethod = res.data.lubricationMethod
            // 喷射系统tab：当【润滑方式】选择“喷射”时，显示该tab
            let index6 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_kscl_psxt')
            if (this.lubricationMethod == 'lubrication_method_0003') {
              this.$refs.tabs.$children[0].$refs.tabs[index6].style.display = 'inline-block'
            } else {
              this.$refs.tabs.$children[0].$refs.tabs[index6].style.display = 'none'
            }
            this.deviceDetail.oilType = res.data.oilType
            let index2 = this.lubricationSystemInspectionObj.findIndex(item => item.nameKey == 'key_kscl_psxt')
            let index3 = this.lubricationSystemInspectionObj[index2].children[0].children.findIndex(item => item.nameKey == 'key_1060')
            let index4 = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children.findIndex(item => item.nameKey == 'key_every_month_add_num')
            let index5 = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children.findIndex(item => item.nameKey == 'key_kscl_psxt_psxt_ygzsj')
            let index7 = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children.findIndex(item => item.nameKey == 'key_kscl_psxt_psxt_sjmfzpsl')
            let indexPre = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index4]
            let time = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index5].value
            // let sjmfzpsl = this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index7].value
            indexPre.value = res.data.preMonthOilAddQuantity
            indexPre.unit = res.data.preMonthOilAddQuantityUnit
            if (time != '' && time != null) {
              if (indexPre.unit == 'L') {
                let num = parseFloat(((indexPre.value * 1000) / (time * 60)).toFixed(3))
                this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index7].value = num
              } else {
                let dataUnit = ((indexPre.value * 138) / 159) * 1000
                let num1 = parseFloat((dataUnit / (time * 60)).toFixed(3))
                this.lubricationSystemInspectionObj[index2].children[0].children[index3].children[index7].value = num1
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    // 顶部 tab 页签切换
    handleClick (tab, event) {
      let indexTab = tab.index
      this.lubricationSystemInspectionForm = this.lubricationSystemInspectionObj[indexTab].children
      if (this.lubricationSystemInspectionObj[indexTab].nameKey == 'key_kscl_cljc') {
        let index1 = this.lubricationSystemInspectionForm.findIndex(item1 => item1.nameKey == 'key_kscl_cljc_chilun')
        this.lubricationSystemInspectionForm[index1].children.forEach((it, index2) => {
          it.children.forEach((it2, index3) => {
            if (it2.nameKey == 'key_1112' || it2.nameKey == 'key_1125') {
              it2.children.forEach((it3, index4) => {
                if (it3.nameKey == 'key_kscl_cljc_chilun_cmwd_small' || it3.nameKey == 'key_kscl_cljc_chilun_cmwd_big') {
                  this.createdlineChart(indexTab, index1, index2, index3, index4)
                }
              })
            }
          })
        })
      }
    },
    // 上传
    handlePictureUpload (item) {
      this.cutFileList = item
      this.cutFlag = false
      this.$refs[this.imgCutterModal].handleOpen()
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath (item, path, flag) {
      const params = {
        url: path
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then(res => { 
        if (res.data.code == 1000) {
          let pathUrl = []
          if (flag) {
            item.imgFullDtoUrl[this.pruneIndex].url = res.data.data
            item.imgFullDtoUrl[this.pruneIndex].urlHalf = path
            item.value = path
          } else {
            item.imgFullDtoUrl.push({
              urlHalf: path,
              name: item.nameKey,
              url: res.data.data
            })
            item.imgFullDtoUrl.map(el => {
              pathUrl.push(el.urlHalf)
            })
            item.value = pathUrl.toString()
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 删除
    removeFileChange (file, fileList, item) {
      // item.value = ''
      let pathUrl = []
      let imgFullDtoUrl = []
      fileList.forEach(it => {
        imgFullDtoUrl.push({
          url: it.url,
          urlHalf: it.urlHalf
        })
        pathUrl.push(it.urlHalf)
      })
      item.imgFullDtoUrl = imgFullDtoUrl
      item.value = pathUrl.toString()
    },
    // 预览
    handlePictureCardPreview (file, index) {
      this.dialogImageUrl = file.url
      this.imgDialogVisible = true
    },
    // 验证
    validatelubricationSystemInspectionObj () {
      const data = this.lubricationSystemInspectionObj
      let emptyList = []
      let emptyChildList = []
      let dropdown4List = []
      let dropdown4ListChild = []
      let dropdown4ListChildNotValue = []
      let otherChildren = []
      let dropdown4ListDropdown4ChildNotValue = []
      let dropdown4ListDropdown4Child = [] // dropdown4 里面的 dropdown4 判断
      let dropdown4ListDropdown4Childdropdown4 = []
      // let dropdown4ListDropdown4MentyChild = [] // dropdown4 里面的 dropdown4_empty 判断
      let dropdown4ListDropdown5Child = [] // dropdown4 里面的 dropdown5 判断
      let dropdown5List = []
      let weichaixie = [] // 未拆卸轴承状态检查
      let yichaixie = [] // 已拆卸轴承状态检查
      let dropdown5ListChild = []
      let input2List = []
      let hyqjc = [] // 换热器检查
      let hrqcs = [] // 换热器参数
      let yyb = [] // 液压泵的校验
      let isNotNum = []
      let wendu = []
      let wendu1 = []
      let noticeData = [] // 安全提示
      let it1
      let it2
      let chilunJIshu = [] // 第几级齿轮数
      let chilunBox = [] // 开式齿轮  -- 齿轮检查  -- 小齿轮 -- 大齿轮数据校验
      let sisutionValueCode;  // 设备调查的 其它信息选择结果
      let sisutionData=[] //设备调查的 其它信息
      data.forEach(it => {
        if (it.nameKey == 'key_kscl_yxzt' && it.required && !it.value) {
          emptyList.push(it)
        }
        if (
          it.nameKey != 'key_ye_ya_xtyl_pic' &&
          (this.deviceDetail.reportType == '4' ||
            this.deviceDetail.reportType == '5' ||
            this.deviceDetail.reportType == '7' ||
            this.deviceDetail.reportType == '8' ||
            this.deviceDetail.reportType == '12' ||
            (this.deviceDetail.reportType == '6' && 
            ((this.CLStatus == '1' && it.nameKey != 'key_bscl_cljc') || this.CLStatus != '1')))
        ) {
          it.children.forEach(element => {
            if (element.nameKey == 'key') {
              chilunJIshu.push(element)
            }
            if (element.nameKey == 'key_kscl_cljc_chilun') {
              chilunBox.push(element)
            }
            if (this.valueCodeLevel == 1) {
              if (
                ((!element.value && element.type != 'checkbox' && element.type != 'dropdown_multi') ||
                  ((element.type == 'checkbox' || element.type == 'dropdown_multi') && element.valueCheckBoxList.length == 0)) &&
                element.required &&
                element.type != 'string' &&
                element.nameKey != 'key_glqqhyyc_level_2' &&
                element.nameKey != 'key_glq_period_level_2'
              ) {
                emptyList.push(element)
              }
            } else if (this.valueCodeLevel == 2) {
              if (
                ((!element.value && element.type != 'checkbox' && element.type != 'dropdown_multi') ||
                  ((element.type == 'checkbox' || element.type == 'dropdown_multi') && element.valueCheckBoxList.length == 0)) &&
                element.required &&
                element.type != 'string'
              ) {
                emptyList.push(element)
              }
            } else {
              
              if ((element.nameKey == 'key_1047' && this.lubricationMethod == 'lubrication_method_0003') || element.nameKey != 'key_1047') {
                // 筛出喷射系统
                
                if (
                  ((element.nameKey != 'key_bscl_xtjc_clxwd' && this.CLStatus == '0') || this.CLStatus == '1' || !this.CLStatus) &&
                  ((!element.value && element.type != 'checkbox') || (element.type == 'checkbox' && element.valueCheckBoxList.length == 0)) &&
                  element.required &&
                  element.type != 'string' &&
                  element.nameKey != 'key_glqqhyyc_level_2' &&
                  element.nameKey != 'key_glq_period_level_2' &&
                  element.nameKey != 'key_glqqhyyc_level_1' &&
                  element.nameKey != 'key_glq_period_level_1'
                ) {
                  // 判断是油类，不校验【润滑剂是否能正常加入和排出？】
                  if (this.deviceDetail.oilType == '1' && element.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc') {
                    emptyList.push(element)
                  }
                  // 判断是脂类，不校验【轴承箱油位高度】 和 【轴承箱有无呼吸器】
                  if (this.deviceDetail.oilType == '2' && element.nameKey != 'key_rhqkjc_zcxywgd' && element.nameKey != 'key_rhqkjc_hxflx') {
                    emptyList.push(element)
                  }
                }
              }
            }
            if (element.type == 'radio2') {
              for (let child2 of element.children) {
                if ((child2.value == '' || child2.value == null || child2.value.toString().trim() == '') && element.value == 0) {
                  emptyList.push(child2)
                }
              }
            }
            if ((element.type == 'dropdown4' && element.nameKey != 'key_bscl_xtjc_clxwd' && this.CLStatus == '0') || this.CLStatus == '1' || !this.CLStatus) {
              // 判断是油类，不校验【润滑剂是否能正常加入和排出？】
              if (this.deviceDetail.oilType == '1' && element.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc') {
                // console.log(element.nameKey,element.name,8888)
                if ((element.nameKey == 'key_1047' && this.lubricationMethod == 'lubrication_method_0003') || element.nameKey != 'key_1047') {
                  
                  dropdown4List.push(element)
                }
              }
              
              // 判断是脂类，不校验【轴承箱油位高度】 和 【轴承箱有无呼吸器】
              if (this.deviceDetail.oilType == '2' && element.nameKey != 'key_rhqkjc_zcxywgd' && element.nameKey != 'key_rhqkjc_hxflx') {
                if ((element.nameKey == 'key_1047' && this.lubricationMethod == 'lubrication_method_0003') || element.nameKey != 'key_1047') {
                  // console.log(element.nameKey,element.name,8888)
                  dropdown4List.push(element)
                }
              }
            }
            if (((this.deviceDetail.oilType == '1' && element.nameKey != 'key_rhqkjc_rhjsfnzcjrhpc' )|| (this.deviceDetail.oilType == '2' && element.nameKey != 'key_rhqkjc_zcxywgd' && element.nameKey != 'key_rhqkjc_hxflx')) && ((element.type == 'input2' && element.children.length && element.nameKey != 'key_bscl_xtjc_clxwd' && this.CLStatus == '0') || this.CLStatus == '1' || !this.CLStatus)) {
              if ((element.nameKey == 'key_1047' && this.lubricationMethod == 'lubrication_method_0003') || element.nameKey != 'key_1047') {
                // console.log(element.name,'element')
                dropdown4List.push(element)
              }
            }
            if (element.type == 'dropdown5') {
              dropdown5List.push(element)
            }
            if (element.type == 'input2') {
              input2List.push(element)
            }
            if (element.nameKey == 'key_ye_ya_ybjc_yyb_item') {
              // 液压泵
              yyb.push(element)
            }
            if (element.nameKey == 'key_ye_ya_hrqjc') {
              hyqjc.push(element)
            }
          })
        }
      })
      dropdown5List.forEach(it5 => {
        if (it5.children[0].type == 'input2') {
          input2List.push(it5.children[0])
        }
        if (!it5.children[0].value && it5.required) {
          emptyList.push(it5)
        }
      })
      dropdown5ListChild = dropdown5List.filter(it5 => {
        return it5.required && !it5.value
      })
      if (yyb.length) {
        yyb.forEach(it6 => {
          it6.children.forEach(input2T => {
            if (input2T.required && !input2T.value) {
              emptyList.push(input2T)
            }
            if (input2T.type == 'input2') {
              input2List.push(input2T)
            }
            if (input2T.type == 'dropdown4') {
              dropdown4ListDropdown4Child.push(input2T)
            }
            if (input2T.type == 'dropdown5') {
              dropdown4ListDropdown5Child.push(input2T)
            }
          })
        })
      }
      let numLevelData = []
      dropdown4List.forEach(ele => {
        // console.log(ele.name)
        if (ele.nameKey == 'key_wcxzctzjc_wcx') {
          weichaixie = ele
        }
        if (ele.nameKey == 'key_wcxzctzjc_ycx') {
          yichaixie = ele
        }

        // 如果齿轮箱运行状态为 运行，齿轮检查节点的必填校验须去掉
        if (
          (((this.CLStatus == '1' && ele.nameKey != 'key') || this.CLStatus == '0') && this.deviceDetail.reportType == '6') ||
          this.deviceDetail.reportType == '7' ||
          this.deviceDetail.reportType == '8' ||
          this.deviceDetail.reportType == '4' ||
          this.deviceDetail.reportType == '5' || 
          this.deviceDetail.reportType == '12'
        ) {
          ele.children.forEach(eleChild => { 
            if (eleChild.nameKey == 'key_aqts_item' || (eleChild.nameKey=='key_1438' && (!eleChild.valueCodeNotDisplay || (eleChild.valueCodeNotDisplay && !eleChild.valueCodeNotDisplay.includes(ele.valueCode)) ))) {  
             
               // 获取安全提示
              this.noticeValue = ele.valueCode
              noticeData.push(eleChild)
            }
            // 
            // 获取设备调查参数化报告的 其他信息
            if (eleChild.nameKey == 'key_1437' && (!eleChild.valueCodeNotDisplay || (eleChild.valueCodeNotDisplay && !eleChild.valueCodeNotDisplay.includes(ele.valueCode))) ) {  
              sisutionValueCode = ele.valueCode
              sisutionData.push(eleChild)
            }
            if (eleChild.nameKey == 'key_hrqjc_lqfs_shuileng_fields') {
              hrqcs.push(eleChild)
            }
            if (
              (eleChild.nameKey != 'key_kscl_cljc_chilun_big' && eleChild.nameKey != 'key_kscl_cljc_chilun_small' && (eleChild.valueCodeNotDisplay == '' || eleChild.valueCodeNotDisplay == null)) ||
              (eleChild.valueCodeNotDisplay && !eleChild.valueCodeNotDisplay.includes(ele.valueCode))
            ) {
              if (
                (((this.kaishiCLStatus == '2' && eleChild.nameKey != 'key_kscl_xtjc_yxwdqk') || this.kaishiCLStatus == '1') && this.deviceDetail.reportType == '8') ||
                this.deviceDetail.reportType != '8'
              ) {
                // console.log(eleChild.name)
                dropdown4ListChild.push(eleChild)
              }
            }
            if (this.deviceDetail.reportType == '4' && (eleChild.nameKey == 'key_yxjc_yxwdzcfw_1' || eleChild.nameKey == 'key_yxjc_yxwdzcfw_2')) {
              wendu.push(eleChild)
            }
            if (this.deviceDetail.reportType == '12' && (eleChild.nameKey == 'key_1387' || eleChild.nameKey == 'key_1585')) {
              wendu.push(eleChild)
            }
            if (this.deviceDetail.reportType == '6' && (eleChild.nameKey == 'key_bscl_xtjc_clxwd_fw1' || eleChild.nameKey == 'key_bscl_xtjc_clxwd_fw2')) {
              wendu.push(eleChild)
            }
          })
        }
      })
      chilunJIshu.forEach(it => {
        // 第几级齿轮的值 用数组存起来
        if (it.nameKey == 'key' && it.value) {
          numLevelData.push(it.value)
        }
      })
      /**
       * 判断闭式齿轮的第几级齿轮是否重复或者是否超过齿轮箱级数   -- start
       *  */
      let numLevel = sessionStorage.getItem('valueCLLevel')
      let len1 = numLevelData.length
      let newArr1 = [...new Set(numLevelData)]
      let len2 = newArr1.length
      let flagBig = false
      if (len1 != len2) {
        this.$message({
          message: '第几级齿轮的级数重复！',
          type: 'warning'
        })
        return
      }
      numLevelData.forEach(it => {
        if (it * 1 > numLevel * 1) {
          flagBig = true
        }
      })
      if (flagBig) {
        this.$message({
          message: '第几级齿轮的级数不能大于齿轮箱级数！',
          type: 'warning'
        })
        return
      }
      /**
       * 判断闭式齿轮的第几级齿轮是否重复或者是否超过齿轮箱级数  --- end
       *  */
      if (this.deviceDetail.reportType == '7') {
        if (weichaixie.children.length && weichaixie.valueCode == '1') {
          if (weichaixie.children.findIndex(eleChild => eleChild.value != null) == -1) {
            this.$message({
              message: '请在【未拆卸轴承状态检查】中选择其中一项或者几项进行检查',
              type: 'warning'
            })
            return
          } else {
            weichaixie.children.forEach(it => {
              if (it.value != '' && it.value != null) {
                // 判断下边必填项是否已填
                it.children.forEach(noticeChild2 => {
                  if (noticeChild2.required && !noticeChild2.value && !noticeChild2.valueCodeNotDisplay.includes(it.valueCode)) {
                    emptyList.push(noticeChild2)
                  }
                })
              }
            })
          }
        }
        if (yichaixie.children.length && yichaixie.valueCode == '1') {
          if (yichaixie.children.findIndex(eleChild => eleChild.value != null) == -1) {
            this.$message({
              message: '请在【已拆卸轴承状态检查】中选择其中一项或者几项进行检查',
              type: 'warning'
            })
            return
          } else {
            yichaixie.children.forEach(it => {
              if (it.value != '' && it.value != null) {
                // 判断下边必填项是否已填
                it.children.forEach(noticeChild2 => {
                  if (noticeChild2.required && !noticeChild2.value && !noticeChild2.valueCodeNotDisplay.includes(it.valueCode)) {
                    emptyList.push(noticeChild2)
                  }
                })
              }
            })
          }
        }
      }
      // 判断 换热器检查 的水冷参数 必填
      let hrq = []
      if (hyqjc.length && this.shuileng && this.deviceDetail.reportType == '5') {
        hrq = hyqjc[0].children.filter(it => it.nameKey == 'key_ye_ya_hrqjc_hrqcs')
        hrqcs = hrq[0].children
        hrqcs.forEach(input2h => {
          if (input2h.type == 'input2') {
            input2List.push(input2h)
          }
          if (input2h.required && !input2h.value) {
            emptyList.push(input2h)
          }
        })
      }
      if (this.deviceDetail.reportType == '4' && this.shuileng && hrqcs.length) {
        hrqcs[0].children.forEach(input2h => {
          if (input2h.type == 'input2') {
            input2List.push(input2h)
          }
          if (input2h.required && !input2h.value) {
            emptyList.push(input2h)
          }
        })
      }
      // 校验安全提示
      noticeData.forEach(childNotice => {
        childNotice.children.forEach(noticeChild2 => {
          if (noticeChild2.required && !noticeChild2.value &&(!noticeChild2.valueCodeNotDisplay ||  (noticeChild2.valueCodeNotDisplay && !noticeChild2.valueCodeNotDisplay.includes(this.noticeValue))) ) {
            
            emptyList.push(noticeChild2)
          }
        })
      })
      // 校验设备调查的其他信息
      sisutionData.forEach(childOther => {
        childOther.children.forEach(childOther2 => {
          if (childOther2.required && !childOther2.value &&(!childOther2.valueCodeNotDisplay ||  (childOther2.valueCodeNotDisplay && !childOther2.valueCodeNotDisplay.includes(sisutionValueCode))) ) {
            // console.log(childOther2)
            emptyList.push(childOther2)
          }
        })
      })
      let chilunChild = []
      chilunBox.forEach(it => {
        if (it.children.length) {
          it.children.forEach(itChild => {
            chilunChild.push(itChild)
          })
        }
      })
      chilunChild.forEach(itChild2 => {
        if (itChild2.children.length) {
          itChild2.children.forEach(itChild3 => {
            if (itChild3.required && !itChild3.value) {
              emptyList.push(itChild3)
            }
            if (itChild3.type == 'dropdown4') {
              dropdown4ListChild.push(itChild3)
            }
          })
        }
      })
      dropdown4ListChild.forEach(input2Type => {
        if (input2Type.type == 'input2') {
          input2List.push(input2Type)
        }
        if (input2Type.type == 'dropdown4') {
          dropdown4ListDropdown4Child.push(input2Type)
        }
        if (input2Type.type == 'dropdown5') {
          dropdown4ListDropdown5Child.push(input2Type)
        }
        if (
          (input2Type.nameKey != 'key_ye_ya_yxjc_hxflx_pic' || (!this.picFlag && input2Type.nameKey == 'key_ye_ya_yxjc_hxflx_pic')) &&
          input2Type.type != 'checkbox' &&
          input2Type.type != 'dropdown_multi' &&
          input2Type.required &&
          !input2Type.value &&
          input2Type.nameKey != 'key_yxjc_yxwdzcfw_1' &&
          input2Type.nameKey != 'key_yxjc_yxwdzcfw_2' &&
          input2Type.nameKey != 'key_yxjc_yxgzwd'
        ) {
          dropdown4ListChildNotValue.push(input2Type)
          // console.log(input2Type)
        }
        if ((input2Type.type == 'checkbox' || input2Type.type == 'dropdown_multi') && input2Type.required && input2Type.valueCheckBoxList.length == 0) {
          dropdown4ListChildNotValue.push(input2Type)
        }
        if (
          input2Type.nameKey == 'key_kscl_rhjjc_other' ||
          input2Type.nameKey == 'key_kscl_xtjc__other' ||
          (input2Type.nameKey == 'key_kscl_psxt_psxt_other' && this.lubricationMethod == 'lubrication_method_0003')
        ) {
          otherChildren.push(input2Type)
        }
      })
      dropdown4ListDropdown4Child.forEach(ele1 => {
        ele1.children.forEach(eleChild1 => {
          if (eleChild1.nameKey == 'key_1090' || eleChild1.nameKey == 'key_1091') {
            wendu.push(eleChild1)
          }
          if (
            ((eleChild1.nameKey != 'key_kscl_cljc_chilun_cmwd_small' && eleChild1.nameKey != 'key_kscl_cljc_chilun_cmwd_big' && this.kaishiCLStatus == 2) || this.kaishiCLStatus != 2) &&
            (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele1.valueCode))) &&
            eleChild1.required &&
            !eleChild1.value &&
            eleChild1.type != 'checkbox' &&
            eleChild1.type != 'dropdown_multi'
          ) {
            dropdown4ListDropdown4ChildNotValue.push(eleChild1)
          }
          if (
            (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele1.valueCode))) &&
            eleChild1.required &&
            eleChild1.valueCheckBoxList.length == 0 &&
            (eleChild1.type == 'checkbox' || eleChild1.type == 'dropdown_multi')
          ) {
            dropdown4ListDropdown4ChildNotValue.push(eleChild1)
          }
          if (
            ((eleChild1.nameKey != 'key_kscl_cljc_chilun_cmwd_small' && eleChild1.nameKey != 'key_kscl_cljc_chilun_cmwd_big' && this.kaishiCLStatus == 2) || this.kaishiCLStatus != 2) &&
            (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele1.valueCode))) &&
            eleChild1.type == 'dropdown4'
          ) {
            dropdown4ListDropdown4Childdropdown4.push(eleChild1)
          }
          if (
            (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele1.valueCode))) &&
            eleChild1.type == 'input2'
          ) {
            input2List.push(eleChild1)
          }
        })
      })
      let dropdown4ListDropdown4Childdropdown41 = []
      dropdown4ListDropdown4Childdropdown4.forEach(ele12 => {
        ele12.children.forEach(eleChild1 => {
          if ((eleChild1.nameKey != 'key_kscl_cljc_chilun_cmwd_small' && eleChild1.nameKey != 'key_kscl_cljc_chilun_cmwd_big' && this.kaishiCLStatus == 2) || this.kaishiCLStatus != 2) {
            if (
              (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele12.valueCode))) &&
              eleChild1.required &&
              !eleChild1.value
            ) {
              if ((eleChild1.type == 'checkbox' || eleChild1.type == 'dropdown_multi') && eleChild1.required && eleChild1.valueCheckBoxList.length == 0) {
                dropdown4ListDropdown4ChildNotValue.push(eleChild1)
              }
              if (eleChild1.type != 'checkbox' && eleChild1.type != 'dropdown_multi') {
                dropdown4ListDropdown4ChildNotValue.push(eleChild1)
              }
            }
            if (
              (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele12.valueCode))) &&
              eleChild1.type == 'dropdown4'
            ) {
              dropdown4ListDropdown4Childdropdown41.push(eleChild1)
            }
            if (
              (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele12.valueCode))) &&
              eleChild1.type == 'input2'
            ) {
              input2List.push(eleChild1)
            }
          }
          if (eleChild1.nameKey == 'key_1096' || eleChild1.nameKey == 'key_1097') {
            wendu1.push(eleChild1)
          }
        })
      })
      // 齿面温度里的位置
      dropdown4ListDropdown4Childdropdown41.forEach(ele12 => {
        ele12.children.forEach(eleChild1 => {
          if (
            (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele12.valueCode))) &&
            eleChild1.required &&
            !eleChild1.value
          ) {
            if ((eleChild1.type == 'checkbox' || eleChild1.type == 'dropdown_multi') && eleChild1.required && eleChild1.valueCheckBoxList.length == 0) {
              dropdown4ListDropdown4ChildNotValue.push(eleChild1)
            }
            if (eleChild1.type != 'checkbox' && eleChild1.type != 'dropdown_multi') {
              dropdown4ListDropdown4ChildNotValue.push(eleChild1)
            }
          }
          if (
            (eleChild1.valueCodeNotDisplay == '' || eleChild1.valueCodeNotDisplay == null || (eleChild1.valueCodeNotDisplay && !eleChild1.valueCodeNotDisplay.includes(ele12.valueCode))) &&
            eleChild1.type == 'input2'
          ) {
            input2List.push(eleChild1)
          }
        })
      })
      input2List.forEach(itInput2 => {
        if (itInput2.value) {
          let obj = {}
          if (parseFloat(itInput2.value).toString() == 'NaN') {
            obj.name = itInput2.name
            obj.value = itInput2.value
            obj.node3TabName = itInput2.node3TabName
            isNotNum.push(obj)
          }
        }
      })
      if (isNotNum.length > 0) {
        this.$message({
          message: isNotNum[0].node3TabName + '-' + isNotNum[0].name + '值应为数字',
          type: 'warning'
        })
        return
      }
      if (this.deviceDetail.reportType == '6' && this.CLStatus == '1') {
        wendu.forEach(it => {
          if (it.nameKey == 'key_bscl_xtjc_clxwd_fw1') {
            it1 = it
          }
          if (it.nameKey == 'key_bscl_xtjc_clxwd_fw2') {
            it2 = it
          }
        })
        if (it1.value * 1 > it2.value * 1) {
          this.$message({
            message: it1.nodeName + '-' + it1.node3TabName + '-' + it1.name + '不能大于' + it2.name,
            type: 'warning'
          })
          return
        }
      }
      if (this.deviceDetail.reportType == '4') {
        wendu.forEach(it => {
          if (it.nameKey == 'key_yxjc_yxwdzcfw_1') {
            it1 = it
          }
          if (it.nameKey == 'key_yxjc_yxwdzcfw_2') {
            it2 = it
          }
        })
        if (it1.value * 1 > it2.value * 1) {
          this.$message({
            message: it1.nodeName + '-' + it1.node3TabName + '-' + it1.name + '不能大于' + it2.name,
            type: 'warning'
          })
          return
        }
      }
      if (this.deviceDetail.reportType == '8' && wendu.length) {
        wendu.forEach(it => {
          if (it.nameKey == 'key_1090') {
            it1 = it
          }
          if (it.nameKey == 'key_1091') {
            it2 = it
          }
        })
        if (it1.value && it2.value) {
          if (it1.value * 1 > it2.value * 1) {
            this.$message({
              message: it1.nodeName + '-' + it1.node3TabName + '-' + it1.name + '不能大于' + it2.name,
              type: 'warning'
            })
            return
          }
        }
      }
      if (this.deviceDetail.reportType == '12' && wendu.length) {
        wendu.forEach(it => {
          if (it.nameKey == 'key_1387') {
            it1 = it
          }
          if (it.nameKey == 'key_1585') {
            it2 = it
          }
        })
        if (it1.value && it2.value) {
          if (it1.value * 1 > it2.value * 1) {
            this.$message({
              message: it1.nodeName + '-' + it1.node3TabName + '-' + it1.name + '不能大于' + it2.name,
              type: 'warning'
            })
            return
          }
        }
      }
      if (this.deviceDetail.reportType == '8' && wendu1.length) {
        wendu1.forEach(it => {
          if (it.nameKey == 'key_1096') {
            it1 = it
          }
          if (it.nameKey == 'key_1097') {
            it2 = it
          }
        })
        if (it1.value && it2.value) {
          if (it1.value * 1 > it2.value * 1) {
            this.$message({
              message: it1.nodeName + '-' + it1.node3TabName + '-' + it1.name + '不能大于' + it2.name,
              type: 'warning'
            })
            return
          }
        }
      }

      if ((this.kaishiCLStatus == '' || this.kaishiCLStatus == null) && this.deviceDetail.reportType == '8') {
        this.$message({
          message: '开式齿轮检查开式齿轮运行状态必填',
          type: 'warning'
        })
        return
      }
      otherChildren.forEach(it6 => {
        if (
          (it6.children.length && it6.nameKey == 'key_kscl_rhjjc_other') ||
          (it6.children.length && it6.nameKey == 'key_kscl_xtjc__other') ||
          (it6.children.length && it6.nameKey == 'key_kscl_psxt_psxt_other' && this.lubricationMethod == 'lubrication_method_0003')
        ) {
          if (it6.valueCode != 0) {
            it6.children.forEach(it7 => {
              if (it7.children.length) {
                it7.children.forEach(itNot => {
                  if (!itNot.value && itNot.required) {
                    emptyChildList.push(itNot)
                  }
                })
              }
            })
          }
        }
      })
      // console.log(emptyChildList,emptyList,dropdown4ListDropdown4ChildNotValue,dropdown5ListChild,dropdown4ListChildNotValue)
      emptyChildList = emptyChildList
        .concat(emptyList)
        .concat(dropdown4ListDropdown4ChildNotValue)
        .concat(dropdown5ListChild)
        .concat(dropdown4ListChildNotValue)
      if (emptyChildList.length > 0) {
        if (emptyChildList[0].node3TabName) {
          this.$message({
            message: emptyChildList[0].nodeName + '-' + emptyChildList[0].node3TabName + ' - ' + emptyChildList[0].name + '必填',
            type: 'warning'
          })
        } else {
          this.$message({
            message: emptyChildList[0].nodeName + '-' + emptyChildList[0].name + '必填',
            type: 'warning'
          })
          this.$emit('passModulValidate', '111')
        }
      } else {
        this.$emit('passModulValidate', 'lubricationSystemInspectionObj')
      }
    },
    /**
     * @Description: 图片删除
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} item
     */
    handleRemove (file, item) {
      item.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
          this.pruneIndex = i
        }
      })
      item.imgFullDtoUrl.splice(this.pruneIndex, 1)
    },
    /**
     * @Description: 图片返显
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} pruneIndex
     * @param {*} callback
     */
    imgBackShow (file, pruneIndex, callback) {
      callback(file[pruneIndex].url)
    },
    /**
     * @Description: 图片裁剪
     * @Author: LiQiuPing
     * @param {*} fileList
     */
    handlePicturePrune (file, fileList, imgCutterTabName) {
      this.cutFlag = true
      this.cutFileList = fileList
      fileList.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
          this.pruneIndex = i
        }
      })
      let url = fileList.imgFullDtoUrl[this.pruneIndex].url
      this.$nextTick(() => {
        this.imgCutterModal = imgCutterTabName
      })
      this.$refs[this.imgCutterModal].handleOpen({
        name: 'img',
        src: url,
        width: 400,
        height: 400
      })
    },
    /**
     * @Description: 裁剪
     * @Author: LiQiuPing
     * @param {*} fileName
     */
    cutDown (fileName) {
      let cutDownData = this.cutFileList
      var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
      var file = this.dataURLtoBlob(fileName.dataURL, '裁剪图片.' + imgGs)
      var formData = new FormData()
      formData.append('fileType', 'work_order_picture')
      formData.append('multipartFiles', file)
      this.requestMethodPost('/web/file/uploadFiles', formData)
        .then(async res => {
          res = res.data
          if (res.code === 1000) {
            cutDownData.tempImagePath = res.data[0]
            if(res.data[0]){
              this.getFullImgPath(cutDownData, res.data[0], this.cutFlag)
            }
            cutDownData.value = res.data[0]
          } else {
            cutDownData.imgFullDtoUrl = []
            cutDownData.notShowUploadBtn = false
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    /**
     * @Description: base64转换为file
     * @Author: LiQiuPing
     * @param {*} dataurl
     * @param {*} name
     */
    dataURLtoBlob (dataurl, name) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], name, { type: mime })
    }
  }
}
</script>

<style lang='less' scoped>
.lubricationWrap {
  .noUploadBtn .el-upload--picture-card {
    display: none;
  }
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
  .el-divider--vertical {
    width: 3px;
  }
  /deep/.el-dialog {
    box-shadow: 0 0px 0px #ccc;
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
  .no-wrap {
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  /deep/.el-popover {
    width: auto !important;
  }
  .el-upload-list__item-thumbnail {
    width: 148px;
    height: 148px;
    object-fit: cover;
  }
}
.el-upload-list--picture-card .el-upload-list__item-actions {
  opacity: 1 !important;
  background-color: rgba(0, 0, 0, 0.2);
}
.uploadMask {
  opacity: 0;
}
.uploadMask:hover {
  opacity: 1;
}
</style>
