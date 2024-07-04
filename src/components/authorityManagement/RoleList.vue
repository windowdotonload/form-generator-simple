<template>
  <div style="position: relative">
    <div class="role-management" :style="mainminheight" id="roleListDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button type="danger" size="small" @click="handleAdd" v-has="roleAddBtn">创建角色</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="roleTableData" :tableHeight="tableHeight + ''" :loading="loading" @changeSearch="tableTitleSearch">
        <template v-slot:roleType="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="角色归属"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="角色归属"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.roleType == 0 ? "美孚" : scope.row.roleType == 1 ? "经销商" : "客户" }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="180" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link @click="handleLook(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false">查看</el-link>
            <el-link @click="handleEdit(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false" v-has="roleEditBtn">编辑</el-link>
            <el-link type="danger" @click="handleDelete(scope.row)" :underline="false" v-has="roleDelBtn">删除</el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        background
        v-if="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!-- 新增角色管理 -->
    <el-dialog title="新建角色" :visible.sync="dialogFormVisible" width="800px" :close-on-click-modal="false">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
        <div>
          <span class="step-style" style="color: #008888; border-color: #008888"><i class="el-icon-check" style="font-weight: bold" v-if="step > 1"></i><span v-else>1</span></span
          >基本信息
        </div>
        <div style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px" :class="step > 1 ? 'green-bg' : ''"></div>
        <div>
          <span class="step-style" :style="step > 1 ? 'color:#008888;border-color:#008888' : ''"><i class="el-icon-check" style="font-weight: bold" v-if="step > 2"></i><span v-else>2</span></span
          >数据权限
        </div>
        <div style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px" :class="step == 3 ? 'green-bg' : ''"></div>
        <div><span class="step-style" :style="step == 3 ? 'color:#008888;border-color:#008888' : ''">3</span>功能权限</div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
        <div v-if="step == 1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色归属" prop="roleType">
                <el-radio-group v-model="ruleForm.roleType">
                  <el-radio :label="0">美孚公司</el-radio>
                  <el-radio :label="1">经销商</el-radio>
                  <el-radio :label="2">客户</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ruleForm.roleType == 0 || ruleForm.roleType == 1">
              <el-form-item label="角色属性" prop="roleAttribute">
                <el-radio-group v-model="ruleForm.roleAttribute">
                  <el-radio label="M">管理类角色</el-radio>
                  <el-radio label="C">普通类角色</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName">
                <el-input size="small" v-model="ruleForm.roleName" placeholder="请输入" maxlength="15" style="width: 260px" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="描述" prop="remark">
                <el-input size="small" v-model="ruleForm.remark" placeholder="请输入" maxlength="20" style="width: 260px" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="font-size: 14px" v-if="step == 2">
          <div style="font-weight: bold; margin-bottom: 15px">
            角色名称：<span style="color: #dd0000">{{ ruleForm.roleName }}</span>
          </div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="数据权限控制该角色用户的可见数据范围" prop="dataScope">
                <el-radio-group v-model="ruleForm.dataScope">
                  <el-radio :label="1" style="display: block; height: 32px; line-height: 32px" v-if="(ruleForm.roleType == 0 && ruleForm.roleAttribute == 'C') || ruleForm.roleType != 0">{{
                    ruleForm.roleType == 0 ? "所属业务区域内，与我相关数据可见" : "与我相关数据可见"
                  }}</el-radio>
                  <el-radio :label="2" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 2">公司数据可见</el-radio>
                  <el-radio :label="3" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 1">公司数据可见</el-radio>
                  <el-radio :label="4" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 0">所属业务区域内，所有数据可见</el-radio>
                  <el-radio :label="5" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 0">全部业务区域，所有数据可见</el-radio>
                  <el-radio :label="6" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 0&& ruleForm.roleAttribute == 'M'">所有直供客户数据可见；所属业务区域内，所有经销商、经销商客户数据可见</el-radio>
                </el-radio-group>
                <div style="margin-top: 10px; color: #dd0000; font-size: 16px; font-weight: bold" v-if="ruleForm.roleType == 0">备注：邀请用户时，进行管辖区域配置</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="font-size: 14px" v-if="step == 3">
          <div style="font-weight: bold; margin-bottom: 15px">
            角色名称：<span style="color: #dd0000">{{ ruleForm.roleName }}</span>
          </div>
          <el-row>
            <el-tabs v-model="activeName" class="add-tab">
              <el-tab-pane label="小程序" name="wechat" style="max-height: 500px; overflow-y: auto; padding-right: 10px">
                <div style="border-bottom: 1px solid #e9e9e9" v-for="(item, index) in wechartMenuData" :key="index">
                  <div v-if="!item.buttonList.length && item.children.length">
                    <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center" :class="item.children ? 'no-children switch-color' : 'switch-color'">
                      {{ item.menuName }}
                      <el-switch v-model="item.swichValue" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                    </div>
                    <div v-show="item.swichValue">
                      <div v-for="res in item.children" :key="res.menuId">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 16px 20px" class="switch-color">
                          <span>{{ res.menuName }}</span>
                          <el-switch v-model="res.swichValue" active-color="#001450" :inactive-text="res.swichValue ? '可见' : '不可见'"> </el-switch>
                        </div>
                        <div style="margin: 0 0 10px 20px; display: flex" v-show="res.swichValue">
                          <el-checkbox
                            v-if="res.children.length && !res.checkAllStatus"
                            v-model="res.checkAll"
                            @change="handleCheckAllChange(res)"
                            style="color: #001450 !important; margin-right: 30px"
                            >全选</el-checkbox
                          >
                          <el-checkbox-group v-model="res.checkedBtns" @change="handleCheckedCitiesChange($event, res)" style="display: inline-block">
                            <el-checkbox v-for="btn in res.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected" style="margin-bottom: 10px">{{ btn.menuName }}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0" class="switch-color">
                      <span>{{ item.menuName }}</span>
                      <el-switch v-model="item.swichValue" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                    </div>
                    <div style="padding-bottom: 10px; display: flex" v-show="item.swichValue">
                      <el-checkbox
                        v-if="item.children.length && !item.checkAllStatus"
                        v-model="item.checkAll"
                        @change="handleCheckAllChange(item)"
                        style="color: #001450 !important; margin-right: 30px"
                        >全选</el-checkbox
                      >
                      <el-checkbox-group v-model="item.checkedBtns" @change="handleCheckedCitiesChange($event, item)" style="display: inline-block">
                        <el-checkbox v-for="btn in item.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected" style="margin-bottom: 10px">{{ btn.menuName }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Web" name="web" style="max-height: 500px; overflow-y: auto; padding-right: 10px">
                <div style="border-bottom: 1px solid #e9e9e9" v-for="(item, index) in webMenuData" :key="index">
                  <div v-if="!item.buttonList.length && item.children.length">
                    <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center" :class="item.children ? 'no-children switch-color' : 'switch-color'">
                      {{ item.menuName }}
                      <el-switch v-model="item.swichValue" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                    </div>
                    <div v-show="item.swichValue">
                      <div v-for="res in item.children" :key="res.menuId">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 16px 20px" class="switch-color">
                          <span>{{ res.menuName }}</span>
                          <el-switch v-model="res.swichValue" active-color="#001450" :inactive-text="res.swichValue ? '可见' : '不可见'"> </el-switch>
                        </div>
                        <div style="margin: 0 0 10px 20px; display: flex" v-show="res.swichValue">
                          <el-checkbox
                            v-if="res.children.length && !res.checkAllStatus"
                            v-model="res.checkAll"
                            @change="handleCheckAllChange(res)"
                            style="color: #001450 !important; margin-right: 30px"
                            >全选</el-checkbox
                          >
                          <el-checkbox-group v-model="res.checkedBtns" @change="handleCheckedCitiesChange($event, res)" style="display: inline-block">
                            <el-checkbox v-for="btn in res.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected" style="margin-bottom: 10px">{{ btn.menuName }}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0" class="switch-color">
                      <span>{{ item.menuName }}</span>
                      <el-switch v-model="item.swichValue" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                    </div>
                    <div style="padding-bottom: 10px; display: flex" v-show="item.swichValue">
                      <el-checkbox
                        v-if="item.children.length && !item.checkAllStatus"
                        v-model="item.checkAll"
                        @change="handleCheckAllChange(item)"
                        style="color: #001450 !important; margin-right: 30px"
                        >全选</el-checkbox
                      >
                      <el-checkbox-group v-model="item.checkedBtns" @change="handleCheckedCitiesChange($event, item)" style="display: inline-block">
                        <el-checkbox v-for="btn in item.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected" style="margin-bottom: 10px">{{ btn.menuName }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </div>
      </el-form>
      <div></div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="handleCancle('ruleForm')" size="small" v-if="step == 1">取消</el-button>
        <el-button @click="preStep" size="small" v-else>上一步</el-button>
        <el-button type="danger" @click="handleSubmit('ruleForm')" size="small" v-if="step == 3">保存</el-button>
        <el-button type="danger" @click="nextStep('ruleForm')" size="small" v-else>下一步</el-button>
      </div>
    </el-dialog>
    <!-- 编辑/查看角色管理 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogEditFormVisible" width="926px" class="edit-dialog" :close-on-click-modal="false">
      <el-tabs tab-position="left" style="height: 666px" class="edit-tab" v-model="tabValue" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="ruleForm" v-if="tabValue == 'first'" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
            <div>
              <el-row>
                <el-col :span="24">
                  <div style="margin-bottom: 30px">
                    <div style="margin-bottom: 10px">角色归属</div>
                    <span style="color: #000">{{ ruleForm.roleType == 0 ? "美孚公司" : ruleForm.roleType == 1 ? "经销商" : "客户" }}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" v-if="ruleForm.roleType == 0 || ruleForm.roleType == 1">
                  <div style="margin-bottom: 30px">
                    <div style="margin-bottom: 10px">角色属性</div>
                    <span style="color: #000">{{ ruleForm.roleAttribute == "M" ? "管理类角色" : "普通类角色" }}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div v-if="dialogTitle == '角色详情'" style="margin-bottom: 30px">
                    <div style="margin-bottom: 10px">角色名称</div>
                    <span style="color: #000">{{ ruleForm.roleName }}</span>
                  </div>
                  <el-form-item label="角色名称" prop="roleName" v-else>
                    <el-input size="small" clearable v-model="ruleForm.roleName" placeholder="请输入" maxlength="15" style="width: 260px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <div v-if="dialogTitle == '角色详情'">
                    <div style="margin-bottom: 10px">描述</div>
                    <span style="color: #000">{{ ruleForm.remark }}</span>
                  </div>
                  <el-form-item label="描述" prop="remark" v-else>
                    <el-input size="small" v-model="ruleForm.remark" clearable placeholder="请输入" maxlength="20" style="width: 260px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="数据权限" name="sencond">
          <el-form :model="ruleForm" :rules="rules" v-if="tabValue == 'sencond'" ref="ruleForm" label-width="100px" label-position="top">
            <div style="font-size: 14px">
              <div style="font-weight: bold; margin-bottom: 15px">
                角色名称：<span style="color: #dd0000">{{ ruleForm.roleName }}</span>
              </div>
              <el-row>
                <el-col :span="24">
                  <div v-if="dialogTitle == '角色详情'">
                    <div style="margin-bottom: 20px">数据权限控制该角色用户的可见数据范围</div>
                    <span v-if="ruleForm.dataScope == 6" style="color: #000">所有直供客户数据可见；所属业务区域内，所有经销商、经销商客户数据可见</span>
                    <span v-if="ruleForm.dataScope == 5" style="color: #000">全部业务区域，所有数据可见</span>
                    <span v-if="ruleForm.dataScope == 4" style="color: #000">所属业务区域内，所有数据可见</span>
                    <span v-if="ruleForm.dataScope == 3" style="color: #000">公司数据可见</span>
                    <span v-if="ruleForm.dataScope == 2" style="color: #000">公司数据可见</span>
                    <span v-if="ruleForm.dataScope == 1" style="color: #000">{{ ruleForm.roleType == 0 ? "所属业务区域内，与我相关数据可见" : "与我相关数据可见" }}</span>
                    <div style="margin-top: 10px; color: #dd0000; font-size: 16px; font-weight: bold" v-if="ruleForm.roleType == 0">备注：邀请用户时，进行管辖区域配置</div>
                  </div>
                  <el-form-item label="数据权限控制该角色用户的可见数据范围" prop="dataScope" v-else>
                    <el-radio-group v-model="ruleForm.dataScope">
                      <el-radio label="1" style="display: block; height: 32px; line-height: 32px" v-if="(ruleForm.roleType == 0 && ruleForm.roleAttribute == 'C') || ruleForm.roleType != 0">{{
                        ruleForm.roleType == 0 ? "所属业务区域内，与我相关数据可见" : "与我相关数据可见"
                      }}</el-radio>
                      <el-radio label="2" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 2">公司数据可见</el-radio>
                      <el-radio label="3" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 1">公司数据可见</el-radio>
                      <el-radio label="4" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 0">所属业务区域内，所有数据可见</el-radio>
                      <el-radio label="5" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 0">全部业务区域，所有数据可见</el-radio>
                      <el-radio label="6" style="display: block; height: 32px; line-height: 32px" v-if="ruleForm.roleType == 0 && ruleForm.roleAttribute == 'M'">所有直供客户数据可见；所属业务区域内，所有经销商、经销商客户数据可见</el-radio>
                    </el-radio-group>
                    <div style="margin-top: 10px; color: #dd0000; font-size: 16px; font-weight: bold" v-if="ruleForm.roleType == 0">备注：邀请用户时，进行管辖区域配置</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="功能权限" name="third">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-if="tabValue == 'third'" label-width="100px" label-position="top">
            <div style="font-size: 14px">
              <div style="font-weight: bold; margin-bottom: 15px">
                角色名称：<span style="color: #dd0000">{{ ruleForm.roleName }}</span>
              </div>
              <el-row>
                <el-tabs v-model="activeName" class="add-tab">
                  <el-tab-pane label="小程序" name="wechat" style="max-height: 500px; overflow-y: auto; padding-right: 10px">
                    <div style="border-bottom: 1px solid #e9e9e9" v-for="(item, index) in wechartMenuData" :key="index">
                      <div v-if="!item.buttonList.length && item.children.length">
                        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center" :class="item.children ? 'no-children switch-color' : 'switch-color'">
                          {{ item.menuName }}
                          <el-switch v-model="item.swichValue" :disabled="dialogTitle == '角色详情'" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                        </div>
                        <div v-show="item.swichValue">
                          <div v-for="res in item.children" :key="res.menuId">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 16px 20px" class="switch-color">
                              <span>{{ res.menuName }}</span>
                              <el-switch v-model="res.swichValue" :disabled="dialogTitle == '角色详情'" active-color="#001450" :inactive-text="res.swichValue ? '可见' : '不可见'"> </el-switch>
                            </div>
                            <div style="margin: 0 0 16px 20px; display: flex" v-show="res.swichValue">
                              <el-checkbox
                                v-if="res.children.length && !res.checkAllStatus"
                                v-model="res.checkAll"
                                :disabled="dialogTitle == '角色详情'"
                                @change="handleCheckAllChange(res)"
                                style="color: #001450 !important; margin-right: 30px"
                                >全选</el-checkbox
                              >
                              <el-checkbox-group v-model="res.checkedBtns" @change="handleCheckedCitiesChange($event, res)" style="display: inline-block">
                                <el-checkbox v-for="btn in res.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected || dialogTitle == '角色详情'">{{ btn.menuName }}</el-checkbox>
                              </el-checkbox-group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0" class="switch-color">
                          <span>{{ item.menuName }}</span>
                          <el-switch v-model="item.swichValue" active-color="#001450" :disabled="dialogTitle == '角色详情'" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                        </div>
                        <div style="padding-bottom: 16px; display: flex" v-show="item.swichValue">
                          <el-checkbox
                            v-if="item.children.length && !item.checkAllStatus"
                            v-model="item.checkAll"
                            :disabled="dialogTitle == '角色详情'"
                            @change="handleCheckAllChange(item)"
                            style="color: #001450 !important; margin-right: 30px"
                            >全选</el-checkbox
                          >
                          <el-checkbox-group v-model="item.checkedBtns" @change="handleCheckedCitiesChange($event, item)" style="display: inline-block">
                            <el-checkbox v-for="btn in item.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected || dialogTitle == '角色详情'">{{ btn.menuName }}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="Web" name="web" style="max-height: 500px; overflow-y: auto; padding-right: 10px">
                    <div style="border-bottom: 1px solid #e9e9e9" v-for="(item, index) in webMenuData" :key="index">
                      <div v-if="!item.buttonList.length && item.children.length">
                        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center" :class="item.children ? 'no-children switch-color' : 'switch-color'">
                          {{ item.menuName }}
                          <el-switch v-model="item.swichValue" :disabled="dialogTitle == '角色详情'" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                        </div>
                        <div v-show="item.swichValue">
                          <div v-for="res in item.children" :key="res.menuId">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 16px 20px" class="switch-color">
                              <span>{{ res.menuName }}</span>
                              <el-switch v-model="res.swichValue" :disabled="dialogTitle == '角色详情'" active-color="#001450" :inactive-text="res.swichValue ? '可见' : '不可见'"> </el-switch>
                            </div>
                            <div style="margin: 0 0 16px 20px; display: flex" v-show="res.swichValue">
                              <el-checkbox
                                v-if="res.children.length && !res.checkAllStatus"
                                v-model="res.checkAll"
                                :disabled="dialogTitle == '角色详情'"
                                @change="handleCheckAllChange(res)"
                                style="color: #001450 !important; margin-right: 30px"
                                >全选</el-checkbox
                              >
                              <el-checkbox-group v-model="res.checkedBtns" @change="handleCheckedCitiesChange($event, res)" style="display: inline-block">
                                <el-checkbox v-for="btn in res.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected || dialogTitle == '角色详情'">{{ btn.menuName }}</el-checkbox>
                              </el-checkbox-group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0" class="switch-color">
                          <span>{{ item.menuName }}</span>
                          <el-switch v-model="item.swichValue" :disabled="dialogTitle == '角色详情'" active-color="#001450" :inactive-text="item.swichValue ? '可见' : '不可见'"> </el-switch>
                        </div>
                        <div style="padding-bottom: 16px; display: flex" v-show="item.swichValue">
                          <el-checkbox
                            v-if="item.children.length && !item.checkAllStatus"
                            v-model="item.checkAll"
                            :disabled="dialogTitle == '角色详情'"
                            @change="handleCheckAllChange(item)"
                            style="color: #001450 !important; margin-right: 30px"
                            >全选</el-checkbox
                          >
                          <el-checkbox-group v-model="item.checkedBtns" @change="handleCheckedCitiesChange($event, item)" style="display: inline-block">
                            <el-checkbox v-for="btn in item.children" :label="btn.menuId" :key="btn.menuId" :disabled="btn.selected || dialogTitle == '角色详情'">{{ btn.menuName }}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" style="text-align: right; height: 50px; position: absolute; bottom: 0; right: 20px">
        <el-button @click="handleCancle('ruleForm')" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmit('ruleForm')" size="small" v-if="dialogTitle == '编辑角色'">保存</el-button>
      </div>
    </el-dialog>
    <!-- 删除角色 -->
    <el-dialog title="删除角色" :visible.sync="dialogDeleteFormVisible" class="delete-dialog" width="636px" :close-on-click-modal="false">
      <div style="font-size: 13px; height: 36px; line-height: 36px; background: rgba(204, 221, 255, 0.4); padding: 0 20px; border-radius: 4px; margin-bottom: 20px">
        <span style="color: #999; margin-right: 12px">温馨提示</span>
        <span style="color: #000" v-if="step == 1"
          >角色<span style="color: #dd0000">{{ deleteRow.roleName }}</span
          >正在被使用，删除前请先给以下人员补充角色，每人至少<span style="color: #dd0000">1个角色</span></span
        >
        <span style="color: #000" v-if="step == 2">点击<span style="color: #dd0000">确认删除</span>后，角色【{{ deleteRow.roleName }}】将被删除</span>
        <span style="color: #000" v-if="step == 3">角色【{{ deleteRow.roleName }}】<span style="color: #dd0000">删除成功</span>！以下为更新后的人员&角色</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
        <div>
          <span class="step-style" style="color: #008888; border-color: #008888"><i class="el-icon-check" style="font-weight: bold" v-if="step > 1"></i><span v-else>1</span></span
          >人员补充角色
        </div>
        <div style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px" :class="step > 1 ? 'green-bg' : ''"></div>
        <div>
          <span class="step-style" :style="step > 1 ? 'color:#008888;border-color:#008888' : ''"><i class="el-icon-check" style="font-weight: bold" v-if="step > 2"></i><span v-else>2</span></span
          >预览删除信息
        </div>
        <div style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px" :class="step == 3 ? 'green-bg' : ''"></div>
        <div><span class="step-style" :style="step == 3 ? 'color:#008888;border-color:#008888' : ''">3</span>删除成功</div>
      </div>
      <div v-if="step == 1">
        <div style="display: flex; align-items: center; border-bottom: 1px solid rgb(233, 233, 233); padding: 17px 0; color: #000">
          <div style="width: 20%">人员</div>
          <div style="width: 40%">现有角色</div>
          <div style="flex: 1">补充角色<span style="color: #dd0000">*</span></div>
        </div>
        <div style="display: flex; align-items: center; border-bottom: 1px solid rgb(233, 233, 233); padding: 17px 0" v-for="item in deleteData" :key="item.userId">
          <div style="width: 20%">
            <el-tooltip class="item" effect="dark" :content="item.userName" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box" class="nowrap">{{ item.userName }}</div>
            </el-tooltip>
          </div>
          <div style="width: 40%">
            <el-tooltip class="item" effect="dark" :content="item.roleName" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box; color: #001450" class="nowrap">{{ item.roleName }}</div>
            </el-tooltip>
          </div>
          <div style="flex: 1">
            <el-select size="small" v-model="item.roleNumbers" :multiple="item.roleType == 0 ? false : true" placeholder="请选择">
              <el-option v-for="item in roleUseData" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div style="font-size: 14px" v-if="step == 2">
        <div style="display: flex; align-items: center; border-bottom: 1px solid rgb(233, 233, 233); padding: 17px 0; color: #000">
          <div style="width: 20%">人员</div>
          <div style="width: 50%">现有角色</div>
          <div style="flex: 1">本次删除角色</div>
        </div>
        <div style="display: flex; align-items: center; border-bottom: 1px solid rgb(233, 233, 233); padding: 17px 0" v-for="(item, index) in previewDeleteData" :key="index">
          <div style="width: 20%">
            <el-tooltip class="item" effect="dark" :content="item.userName" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box" class="nowrap">{{ item.userName }}</div>
            </el-tooltip>
          </div>
          <div style="width: 50%">
            <el-tooltip class="item" effect="dark" :content="item.roleNow" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box" class="nowrap">{{ item.roleNow }}</div>
            </el-tooltip>
          </div>
          <div style="flex: 1">
            <el-tooltip class="item" effect="dark" :content="item.roleName" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box; color: #001450" class="nowrap">{{ item.roleName }}</div>
            </el-tooltip>
          </div>
        </div>
        <div style="color: #dd0000; margin-top: 5px">* 点击确认删除，角色【{{ deleteRow.roleName }}】将被删除</div>
      </div>
      <div style="font-size: 14px" v-if="step == 3">
        <div style="display: flex; align-items: center; border-bottom: 1px solid rgb(233, 233, 233); padding: 17px 0; color: #000">
          <div style="width: 50%">人员</div>
          <div style="width: 50%">更新后的角色</div>
        </div>
        <div style="display: flex; align-items: center; border-bottom: 1px solid rgb(233, 233, 233); padding: 17px 0" v-for="(item, index) in previewDeleteData" :key="index">
          <div style="width: 50%">
            <el-tooltip class="item" effect="dark" :content="item.userName" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box" class="nowrap">{{ item.userName }}</div>
            </el-tooltip>
          </div>
          <div style="width: 50%">
            <el-tooltip class="item" effect="dark" :content="item.roleAfter" placement="top" style="display: inline-block">
              <div style="max-width: 100%; padding-right: 20px; box-sizing: border-box; color: #001450" class="nowrap">{{ item.roleAfter }}</div>
            </el-tooltip>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="handleCancle" size="small" v-if="step == 1">取消</el-button>
        <el-button @click="preStep" size="small" v-if="step == 2 && !noAddRole">上一步</el-button>
        <el-button type="danger" @click="nextStep" size="small" v-if="step == 1">下一步</el-button>
        <el-button type="danger" @click="sureDelete(deleteRow, 'step')" size="small" v-if="step == 2">确认删除</el-button>
        <el-button type="danger" @click="handleCancle" size="small" v-if="step == 3">返回列表</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>
<script>
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
export default {
  data () {
    return {
      tableHeight: null,
      tableDataHeader: [
        { filterType: "input", paramValue: "roleName", changeValue:"", prop: "roleName", label: "角色名称", width: "200", tooltip: true },
        { filterType: "selection", paramValue: "roleType", selectOptions: [{ name: '美孚', code: '0' },{ name: '经销商', code: '1' },{ name: '客户', code: '2' }], changeValue:"", slot: "roleType", label: "角色归属", width: "150", tooltip: true },
        { prop: "remark", label: "描述", width: "180", tooltip: true },
        { prop: "inUseCount", label: "使用人数", width: "130", tooltip: true },
        { filterType: "dateSingle", paramValue: "createTime", changeValue:"", prop: "createTime", label: "创建日期", width: "180", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
      queryParams: {
        roleName: '', // 姓名
        createTime: '',
        roleSource: ''
      },
      pagenation: {
        current: 1,
        size: 30
      },
      ruleForm: {
        roleName: '',
        roleAttribute: '',
        roleType: 0,
        remark: '',
        dataScope: ''
      },
      // 表单验证规则
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
        roleType: [{ required: true, message: '请选择角色归属', trigger: 'change' }],
        roleAttribute: [{ required: true, message: '请选择角色属性', trigger: 'change' }],
        dataScope: [{ required: true, message: '请选择角色权限', trigger: 'change' }]
      },
      roleTypeList: [
        { label: '美孚', value: '0' },
        { label: '经销商', value: '1' },
        { label: '客户', value: '2' }
      ],
      step: 1,
      activeName: 'wechat',
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      dialogDeleteFormVisible: false,
      tabValue: 'first',
      preTabValue: 'first',
      totalNumber: 0, // 总条数
      roleTableData: [], // 账号数据
      selectList: [],
      wechartMenuData: [],
      webMenuData: [],
      dialogTitle: '编辑角色',
      loading: false, // 是否展示加载动画，默认隐藏
      deleteRow: {},
      deleteData: [],
      roleUseData: [],
      previewDeleteData: [],
      noAddRole: false,
      loadingMask: null,
      loadingWeChatFlag: false,
      loadingWebFlag: false
    }
  },
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
  },
  computed: {},
  beforeRouteLeave (to, from, next) {
    this.queryParams.current = this.pagenation.current
    this.queryParams.size = this.pagenation.size
    sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
    next()
  },
  beforeRouteEnter (to, from, next) {
    if (from.path == '/RoleList/RoleDetail' || from.path == '/RoleList/EditRole') {
      to.params.isSaveQuery = true
    }
    next()
  },
  mounted () {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem('queryParams'))
      this.pagenation.current = this.queryParams.current
      this.pagenation.size = this.queryParams.size
    }
    this.$_getMenuData('weChat') // 获取菜单列表
    this.$_getMenuData('web') // 获取菜单列表
    this.$_queryRoleList() // 获取角色列表
    this.loadingMask = this.$loading({
      lock: true,
      text: '数据加载，请稍后',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    handleClearSearch() {
      this.queryParams = {
        roleName: '',
        createTime: '',
        roleSource: '',
        roleType: ''
      },
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.handleSearchTableData()
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      this.queryParams[obj.paramValue] = searchVal
      this.handleSearchTableData()
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let roleListDiv=0
        let searchFormHeight=0
        if (document.getElementById("roleListDiv")) {
          roleListDiv = document.getElementById("roleListDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(roleListDiv) - Number(searchFormHeight) - 40;
      }, 200);
    },
    handleClick (val) {
      if (this.preTabValue == val.name) {
        return
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          this.$nextTick(() => {
            this.$message.error(`请先填写必填项`)
            this.tabValue = this.preTabValue
          })
        } else {
          this.preTabValue = val.name
        }
      })
    },
    // 获取菜单列表
    $_getMenuData (type) {
      this.loading = true
      let params = { menuSource: type }
      this.requestMethodGet('/web/system/permission/menuManage/list', params)
        .then((res) => {
          this.loading = false
          res = res.data
          if (res.code == 1000) {
            res.data.forEach((item) => {
              if (item.menuType == 'C') {
                item.checkedBtns = []
                item.swichValue = true
                if (item.children.length) {
                  item.children.forEach((res) => {
                    if (res.menuType == 'C') {
                      res.checkedBtns = []
                      res.swichValue = true
                      if (res.children.length) {
                        res.children.forEach((val) => {
                          if (val.selected) {
                            res.checkedBtns = [val.menuId]
                          }
                        })
                      }
                    } else {
                      if (res.selected) {
                        item.checkedBtns = [res.menuId]
                      }
                    }
                  })
                }
              }
            })
            if (type == 'weChat') {
              this.wechartMenuData = res.data
              this.loadingWeChatFlag = true
            } else {
              this.webMenuData = res.data
              this.loadingWebFlag = true
            }
            // if (this.loadingWeChatFlag && this.loadingWebFlag) {
            //   this.loadingMask.close()
            // }
          } else {
            // this.loadingMask.close()
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          // this.loadingMask.close()
        })
    },
    // 获取补充角色列表
    getRoleUseData (row) {
      let params = { roleType: row.roleType, roleSource: row.roleSource, roleId: row.roleId }
      this.requestMethodGet('/web/system/permission/roleManage/allocatedRoleList', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.roleUseData = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    // 获取删除角色预览列表
    getPreviewDeleteRole () {
      let params = { roleId: this.deleteRow.roleId }
      this.requestMethodGet('/web/system/permission/roleManage/deleteUserRolePreview', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.previewDeleteData = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    // 获取角色列表
    $_queryRoleList () {
      this.loading = true
      let params = { ...this.queryParams, ...this.pagenation }
      this.requestMethodGet('/web/system/permission/roleManage/listByPage', params)
        .then((res) => {
          this.loading = false
          res = res.data
          this.loadingMask.close()
          if (res.code == 1000) {
            this.roleTableData = res.data.list
            this.totalNumber = res.data.totalCount
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loadingMask.close()
          this.loading = false
        })
    },
    // 查询
    handleSearchTableData () {
      this.pagenation.current = 1
      this.$_queryRoleList()
    },
    // 新建
    handleAdd () {
      this.$_getMenuData('weChat') // 获取菜单列表
      this.$_getMenuData('web'); // 获取菜单列表
      (this.ruleForm = {
        roleName: '',
        roleType: 0,
        roleAttribute: '',
        remark: '',
        dataScope: ''
      }),
      (this.step = 1)
      this.dialogTitle = '新建角色'
      this.activeName = 'wechat'
      this.dialogFormVisible = true
    },
    nextStep (formName) {
      if (formName == 'ruleForm') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.step++
          }
        })
        return
      }
      let flag = false
      for (let item of this.deleteData) {
        if ((item.roleType == 0 && !item.roleNumbers) || (item.roleType != 0 && !item.roleNumbers.length)) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$message.error('请请先补全必填项')
        return
      }
      this.saveRoleUseInfo()
    },
    saveRoleUseInfo () {
      let list = this.deleteData.map((item) => {
        if (item.roleType == 0) {
          return { roleIds: [item.roleNumbers], userId: item.userId }
        } else {
          return { roleIds: item.roleNumbers, userId: item.userId }
        }
      })
      let params = {
        userRoleList: list
      }
      this.requestMethodPost('/web/system/permission/roleManage/allocateUserRole', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.getPreviewDeleteRole()
            this.step++
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    preStep () {
      this.step--
    },
    // page change  事件
    handleCurrentChange (page) {
      this.pagenation.current = page
      this.$_queryRoleList()
    },
    // size change 事件
    handleSizeChange (size) {
      this.pagenation.size = size
      this.pagenation.current = 1
      this.$_queryRoleList()
    },
    setListSelectId (list, wechartIds) {
      list.forEach((item) => {
        if (item.menuType == 'C' && wechartIds.has(item.menuId)) {
          item.swichValue = true
          item.checkedBtns = []
          item.checkAll = false
          if (item.buttonList.length) {
            item.buttonList.forEach((result) => {
              if (wechartIds.has(result.buttonId)) {
                item.checkedBtns.push(result.buttonId)
              }
            })
            if (item.checkedBtns.length == item.buttonList.length) {
              item.checkAll = true
            }
          } else {
            if (item.children.length) {
              item.children.forEach((val) => {
                if (val.menuType == 'C' && wechartIds.has(val.menuId)) {
                  val.swichValue = true
                  val.checkedBtns = []
                  val.checkAll = false
                  if (val.buttonList.length) {
                    val.buttonList.forEach((id) => {
                      if (wechartIds.has(id.buttonId)) {
                        val.checkedBtns.push(id.buttonId)
                      }
                    })
                    if (val.checkedBtns.length == val.buttonList.length) {
                      val.checkAll = true
                    }
                  }
                } else {
                  val.swichValue = false
                  val.checkAll = false
                  val.children.forEach((result) => {
                    if (result.selected) {
                      val.checkedBtns = [result.menuId]
                    }
                  })
                }
              })
            }
          }
        } else {
          item.swichValue = false
          item.checkAll = false
          item.children.forEach((result) => {
            if (result.selected) {
              item.checkedBtns = [result.menuId]
            }
          })
        }
      })
    },
    // 获取角色详情
    $_queryRoleDetail (row) {
      let params = { roleId: row.roleId }
      this.requestMethodGet('/web/system/permission/roleManage/getRoleInfo', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            let wechartIds = new Set(res.data.weChatMenuIds)
            let webIds = new Set(res.data.webMenuIds)
            this.setListSelectId(this.webMenuData, webIds)
            this.setListSelectId(this.wechartMenuData, wechartIds)
            this.dialogEditFormVisible = true
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loading = false
        })
    },
    // 查看
    handleLook (row) {
      this.tabValue = 'first'
      this.dialogTitle = '角色详情'
      this.activeName = 'wechat'
      this.ruleForm = {
        roleName: row.roleName,
        roleAttribute: row.roleAttribute,
        roleType: row.roleType,
        remark: row.remark,
        dataScope: row.dataScope
      }

      this.$_queryRoleDetail(row)
    },
    // 编辑
    handleEdit (row) {
      this.tabValue = 'first'
      this.dialogTitle = '编辑角色'
      this.activeName = 'wechat'
      this.preTabValue = 'first'
      this.ruleForm = {
        roleName: row.roleName,
        roleAttribute: row.roleAttribute,
        roleType: row.roleType,
        remark: row.remark,
        dataScope: row.dataScope,
        roleId: row.roleId
      }
      this.$_queryRoleDetail(row)
    },
    handleCancle () {
      this.dialogEditFormVisible = false
      this.dialogFormVisible = false
      this.dialogDeleteFormVisible = false
    },
    handleCheckAllChange (row) {
      let lookBtn = []
      let btnList = row.children.map((item) => {
        if (item.selected) {
          lookBtn = [item.menuId]
        }
        return item.menuId
      })
      row.checkedBtns = row.checkAll ? btnList : lookBtn
    },
    handleCheckedCitiesChange (val, row) {
      this.$set(row, 'checkAllStatus', true)
      this.$nextTick(() => {
        this.$set(row, 'checkAllStatus', false)
        this.$set(row, 'checkAll', val.length == row.children.length)
      })
    },
    // 删除
    handleDelete (row) {
      if (row.inUseCount == 0) {
        this.$confirm(`请确认是否删除角色：${row.roleName}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'deletBtn',
          type: 'warning'
        })
          .then(() => {
            this.sureDelete(row)
          })
          .catch(() => {})
        return
      }
      this.getRoleUseData(row)
      let params = { roleId: row.roleId }
      this.requestMethodGet('/web/system/permission/roleManage/getInUseRoleInfo', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.dialogDeleteFormVisible = true
            this.deleteRow = row
            this.deleteData = res.data
            if (res.msg == 'true') {
              this.step = 1
              this.noAddRole = false
            } else {
              this.getPreviewDeleteRole()
              this.step = 2
              this.noAddRole = true
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loading = false
        })
    },
    sureDelete (row, val) {
      let params = {
        ids: row.roleId
      }
      this.requestMethodPost('/web/system/permission/roleManage/remove', params, true)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$_queryRoleList()
            if (val) {
              this.step++
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    returnMenuIdList (list) {
      let menuIds = []
      list.forEach((item) => {
        if (item.swichValue) {
          menuIds.push(item.menuId)
          if (item.checkedBtns && item.checkedBtns.length) {
            menuIds = [...menuIds, ...item.checkedBtns]
          }
          if (item.children.length) {
            item.children.forEach((res) => {
              if (res.swichValue) {
                menuIds.push(res.menuId)
                if (res.checkedBtns && res.checkedBtns.length) {
                  menuIds = [...menuIds, ...res.checkedBtns]
                }
              }
            })
          }
        }
      })
      return [...new Set(menuIds)]
    },
    handleSubmit () {
      let params = this.ruleForm
      if (this.ruleForm.roleType == 2) {
        params.roleAttribute = ''
      }
      // web菜单树
      let webMenuIds = this.returnMenuIdList(this.webMenuData)
      let weChatMenuIds = this.returnMenuIdList(this.wechartMenuData)
      params.webMenuIds = webMenuIds
      params.weChatMenuIds = weChatMenuIds
      let url = '/web/system/permission/roleManage/add'
      if (this.dialogTitle == '编辑角色') {
        url = '/web/system/permission/roleManage/edit'
      }
      this.requestMethodPost(url, params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            if (this.dialogTitle == '编辑角色') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '新建成功',
                type: 'success'
              })
            }
            this.dialogFormVisible = false
            this.dialogEditFormVisible = false
            this.handleSearchTableData()
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  },
}
</script>
<style lang='less' >
@import "../../assets/css/customTable.less";
.role-management {
  padding: 0 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
  .step-style {
    border: 2px solid #e9e9e9;
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    border-radius: 50%;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #999;
    margin-top: 5rpx;
    margin-right: 8px;
  }
  .green-bg {
    background: #008888 !important;
    color: #008888;
  }
}
.role-management {
  .el-tabs__header {
    margin-bottom: 0 !important;
  }
  .no-children {
    margin-bottom: 16px;
  }
  .switch-color .is-active {
    color: #999 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inne {
    background-color: #001450 !important;
    border-color: #001450 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #001450 !important;
    border-color: #001450 !important;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #f2f6fc !important;
    border-color: #dcdfe6 !important;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #001450 !important;
  }
  .el-checkbox-group .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333 !important;
  }
  .edit-dialog .el-tabs__item.is-active {
    background: #fff !important;
    color: #dd0000 !important;
  }
  .edit-dialog .el-dialog {
    height: 720px;
  }
  .edit-dialog .el-tabs__item:hover {
    color: #dd0000 !important;
  }
  .add-tab .el-tabs__item.is-active {
    color: #001450 !important;
  }
  .add-tab .el-tabs__active-bar {
    background-color: #001450 !important;
  }
  .add-tab .el-tabs__item:hover {
    color: #001450 !important;
  }
  .edit-tab .el-tabs__active-bar {
    height: 0 !important;
  }
  .add-tab .el-tabs__active-bar {
    height: 2px !important;
  }

  .edit-dialog .el-tabs--left .el-tabs__header.is-left {
    margin-right: 20px;
    background: #f9f9f9;
    width: 160px !important;
  }
  .edit-dialog .el-tabs--left .el-tabs__item.is-left {
    text-align: center;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent !important;
  }
  .edit-dialog .el-form-item__label {
    color: #999 !important;
  }
  .edit-dialog .el-dialog__body {
    padding: 0 20px 0 0 !important;
  }
  .delete-dialog .el-dialog__body {
    padding-top: 0px;
  }
  .nowrap {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #001450 !important;
    border-color: #001450 !important;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #001450 !important;
  }
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
}
.deletBtn .el-message-box__message {
  word-break: break-all !important;
}
</style>
