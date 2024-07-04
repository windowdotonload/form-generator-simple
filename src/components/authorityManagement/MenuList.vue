<template>
  <div style="position:relative">
    <div class="menu-list" :style="mainminheight" id="menulistDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button type="danger" @click="handleAddMenu" size="small" v-has="menuAddBtn">新建菜单</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        ref="menuTable"
        :key="tableKey"
        row-key="menuId"
        :data="menuTableData"
        :height="tableHeight"
        tooltip-effect="dark"
        style="width: 100%;"
        default-expand-all
        :tree-props="{children: 'children'}"
        :header-cell-style="{background:'#f7f7f7'}"
        stripe
        header-row-class-name="table_header_class"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="menuName" label="菜单名称" min-width="10%" show-overflow-tooltip>
          <template slot="header">
              <column-header 
              title="菜单名称"
              filterType="input"
              paramValue="menuName"
              :changeValue="filterChangeVal.menuName"
              @chSubmit="tableTitleSearch"/>
            </template>
        </el-table-column>
        <el-table-column prop="level" label="菜单级别" min-width="10%">
          <template slot="header">
            <column-header 
            title="菜单级别"
            filterType="selection"
            paramValue="level"
            :changeValue="filterChangeVal.level"
            :selectOptions="levelOpt"
            @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.level==1?'一级菜单':scope.row.level==2?'二级菜单':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="parentName" label="上级菜单" min-width="10%">
          <template slot-scope="scope">
            <span>{{scope.row.parentName || '- -'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="menuSource" label="所属系统" min-width="10%">
          <template slot="header">
            <column-header 
            title="所属系统"
            filterType="selection"
            paramValue="menuSource"
            :changeValue="filterChangeVal.menuSource"
            :selectOptions="menuSourceOpt"
            @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.menuSource=='web'?'web端':'小程序'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="frontUrl" label="前端URL" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="backUrl" label="后端URL" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNum" label="Web端排序" min-width="8%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="12%" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="14%" align="center">
          <template slot-scope="scope">
            <el-link type="danger" @click="handleLook(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false">查看</el-link>
            <el-link type="danger" @click="handleEdit(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false" v-has="menuEditBtn">编辑</el-link>
            <el-link type="danger" @click="handleDelete(scope.row)" style="color:rgb(221,0,0)" :underline="false" v-has="menuDelBtn">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10,20,30,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
        <!--新建菜单管理 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        width="920px"
        class="edit-dialog"
        :close-on-click-modal="false"
      >
      <el-tabs tab-position="left" style="height:646px" class="edit-tab"  v-model="tabValue" @tab-click="ontabClick">
        <el-tab-pane label="菜单信息" name="first">
          <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          size="small"
          label-width="100px"
          label-position="right"
          class="add-menu-ruleForm"
        >
        <el-row>
            <el-col :span="24">
              <el-form-item label="所属系统" prop="menuSource">
                <span v-if="dialogTitle != '新建菜单'">{{ruleForm.menuSource=='web'?'web端':'小程序'}}</span>
                <el-radio-group v-model="ruleForm.menuSource" v-else @change="radioChange">
                    <el-radio label="web">Web端</el-radio>
                    <el-radio label="weChat">小程序</el-radio>
                  </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单名" prop="menuName">
                <span v-if="dialogTitle == '查看菜单'">{{ruleForm.menuName}}</span>
                <el-input
                  v-else
                  size="small"
                  v-model="ruleForm.menuName"
                  maxlength="15"
                  clearable
                  placeholder="请输入菜单名"
                  style="width:260px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单Code" prop="menuCode">
                <span v-if="dialogTitle == '查看菜单'">{{ruleForm.menuCode}}</span>
                <el-input
                  v-else
                  size="small"
                  v-model="ruleForm.menuCode"
                  maxlength="25"
                  clearable
                  placeholder="请输入菜单Code"
                  style="width:260px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单级别" prop="level">
                <span v-if="dialogTitle != '新建菜单'">{{ruleForm.level==1?'一级菜单':ruleForm.level==2?'二级菜单':''}}</span>
                <el-select
                  v-else
                  size="small"
                  v-model="ruleForm.level"
                  @change="handleChangeLevel"
                  clearable
                  placeholder="请选择"
                  style="width:260px"
                >
                  <el-option
                    v-for="item in levelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ruleForm.level =='2' || ruleForm.level =='3'">
            <el-col :span="24">
              <el-form-item label="父级菜单" prop="parentId">
                <span v-if="dialogTitle != '新建菜单'">{{ruleForm.parentName}}</span>
                <el-select
                  v-else
                  v-model="ruleForm.parentId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  placeholder="请输入"
                  :remote-method="handleGetValue"
                  :loading="loadingInput"
                  style="width:260px"
                >
                  <el-option
                    v-for="item in parentMenuNameList"
                    :key="item.menuId"
                    :label="item.menuName"
                    :value="item.menuId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="前端URL" prop="frontUrl">
                <span v-if="dialogTitle == '查看菜单'">{{ruleForm.frontUrl}}</span>

                <el-input
                  v-else
                  size="small"
                  placeholder="请输入"
                  v-model="ruleForm.frontUrl"
                  maxlength="100"
                  clearable
                  style="width:260px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="后端URL" prop="backUrl">
                <span v-if="dialogTitle == '查看菜单'">{{ruleForm.backUrl}}</span>
                <el-input
                  size="small"
                  v-else
                  placeholder="请输入"
                  clearable
                  v-model="ruleForm.backUrl"
                  maxlength="100"
                  style="width:260px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(ruleForm.level =='1' || ruleForm.level =='2') && ruleForm.menuSource=='web'">
            <el-col :span="24">
              <el-form-item label="菜单排序" prop="orderNum" 
              :rules="[
                  { pattern: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/, message: '请输入整数', trigger: 'blur' }
                ]">
                <span v-if="dialogTitle == '查看菜单'">{{ruleForm.orderNum}}</span>
                <el-input
                  size="small"
                  v-else
                  placeholder="请输入"
                  clearable
                  v-model="ruleForm.orderNum"
                  maxlength="3"
                  style="width:260px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="关联广告位" prop="advertiseFlag">
                <span v-if="dialogTitle == '查看菜单'">{{ruleForm.advertiseFlag?'是':'否'}}</span>
                    <el-radio-group v-model="ruleForm.advertiseFlag" v-else>
                      <el-radio :label="false" :disabled="!ruleForm.editAdFlag">否</el-radio>
                      <el-radio :label="true" :disabled="!ruleForm.editAdFlag">是</el-radio>
                    </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ruleForm.level==1 && ruleForm.menuSource=='web'">
            <el-col :span="24">
              <el-form-item label="上传图标" prop="icon">
                <el-image v-if="dialogTitle == '查看菜单'" :src="imageUrl" class="avatar" :preview-src-list="[imageUrl]"></el-image>
                <el-upload
                  class="avatar-uploader"
                  v-else
                  action="action"
                  :show-file-list="true"
                  :on-change="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置按钮" name="sencond">
          <div style="font-size:14px">
            <div style="font-weight:bold;margin-bottom:15px">菜单名称：<span style="color:#dd0000" v-if="this.ruleForm.parentName"> {{this.ruleForm.parentName}} /</span><span style="color:#dd0000"> {{this.ruleForm.menuName}}</span></div>
              <el-row>
                <el-col :span="24">
                  <div style="height:520px;border:1px solid rgb(233, 233, 233);overflow-y:auto;" v-if="dialogTitle == '查看菜单'" >
                    <div style="color:#000;padding:0px 20px;margin:10px 0" v-for="domain in dynamicValidateForm.domains" :key="domain.buttonId">{{domain.buttonName}}</div>
                  </div>
                  <div  v-else>
                    <div style="margin-bottom:10px">
                      <el-link icon="el-icon-circle-plus" @click="addBtn"  style="margin-right:20px;color:rgb(0,20,79)" :underline="false">新增按钮</el-link>
                    </div>
                    <div style="height:520px;border:1px solid rgb(233, 233, 233);overflow-y:auto">
                      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                        <el-row v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.buttonId">
                          <div  v-if="domain.delFlag != 1">
                            <el-col :span="20">
                              <div>
                                <el-col :span="10">
                                  <el-form-item
                                    style="padding:10px 10px 0"
                                    :prop="'domains.' + index + '.buttonName'"
                                    :rules="{required: true, message: '按钮名称不能为空', trigger: 'blur'}"
                                  >
                                  <span v-if="dialogTitle == '查看菜单'">{{domain.buttonName}}</span>
                                  <el-input
                                    v-else
                                    size="small"
                                    clearable
                                    placeholder="请输入按钮名称"
                                    v-model="domain.buttonName"
                                    maxlength="25"
                                    style="width:100%"
                                  ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="14">
                                  <el-form-item
                                    style="padding:10px 10px 0"
                                    :prop="'domains.' + index + '.menuCode'"
                                    :rules="{required: true, message: '按钮权限code不能为空', trigger: 'blur'}"
                                  >
                                  <span v-if="dialogTitle == '查看菜单'">{{domain.menuCode}}</span>
                                  <el-input
                                    v-else
                                    size="small"
                                    clearable
                                    placeholder="请输入按钮权限code"
                                    v-model="domain.menuCode"
                                    maxlength="35"
                                    style="width:100%"
                                  ></el-input>
                                  </el-form-item>
                                </el-col>
                              </div>

                              <div>
                                <el-col :span="10">
                                <el-form-item
                                  style="padding:10px 10px 0"
                                  label="关联广告位"
                                  :prop="'domains.' + index + '.advertiseFlag'"
                                  :rules="{required: true, message: '请选择关联广告位', trigger: 'change'}"
                                >
                                <span v-if="dialogTitle == '查看菜单'">{{domain.advertiseFlag?'是':'否'}}</span>
                                <el-radio-group v-model="domain.advertiseFlag" v-else>
                                  <el-radio :label="false" :disabled="!domain.editAdFlag">否</el-radio>
                                  <el-radio :label="true" :disabled="!domain.editAdFlag">是</el-radio>
                                </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="14" v-if="domain.advertiseFlag">
                                <el-form-item
                                  style="padding:10px 10px 0"
                                  :prop="'domains.' + index + '.frontUrl'"
                                  :rules="{required: true, message: '请输入url', trigger: 'blur'}"
                                >
                                <span v-if="dialogTitle == '查看菜单'">{{domain.frontUrl}}</span>
                                <el-input
                                  v-else
                                  size="small"
                                  clearable
                                  placeholder="请输入url"
                                  v-model="domain.frontUrl"
                                  style="width:100%"
                                ></el-input>
                                </el-form-item>
                              </el-col>
                              </div>
                            </el-col>
                            <el-col :span="4" v-if="domain.editAdFlag">
                                <el-form-item
                                style="padding:10px 20px 0"
                              >
                                <el-link icon="el-icon-delete" @click="deleteBtn(index,domain)" style="color:#dd0000;float:right" :underline="false">删除</el-link>
                              </el-form-item>
                            </el-col>
                          </div>
                        </el-row>
                      </el-form>

                    </div>
                  </div>
                </el-col>
              </el-row>
            <div v-if="dialogTitle != '查看菜单'"><span style="color:#dd0000">*按钮权限code是识别按钮权限的唯一标识，不允许修改</span></div>
          </div>
        </el-tab-pane>
      </el-tabs>
        <div slot="footer" style="text-align:right;height:50px;position:absolute;bottom:0;right:20px;">
          <el-button  @click="handleCancle('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small" v-if="dialogTitle != '查看菜单'">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import columnHeader from "../tableComponents/headerComponent";
export default {
  components: {
    "column-header":columnHeader
  },
  data () {
    var validateSort = (rule, value, callback) => {
      if (!this.imageUrl) {
        return callback(new Error('请上传图标'))
      } else {
        callback()
      }
    }
    return {
      tableKey: Date.now(),
      filterChangeVal:{
        menuName:"",
        menuSource: "",
        level: ""
      },
      dynamicValidateForm: {
        domains: []
      },
      tableHeight: null,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      loading: false,
      loadingInput: false,
      tabValue: 'first',
      // 查询条件
      queryParams: {
        menuId: '',
        menuName: '', // 菜单名
        level: '', // 级别
        menuSource: ''
      },
      // 分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      totalNumber: 0, // 总条数，默认0
      dialogTitle: '新建菜单',
      dialogFormVisible: false,
      // 表单验证
      ruleForm: {
        menuSource: 'web',
        menuName: '', // 菜单名称
        menuCode: '', // 菜单code
        level: '', // 菜单级别
        parentId: '',
        frontUrl: '',
        orderNum:null,
        backUrl: '',
        advertiseFlag: false,
        editAdFlag: true
      },
      levelList: [
        { label: '一级菜单', value: 1 },
        { label: '二级菜单', value: 2 }
      ], // 级别列表
      levelOpt: [
        { name: '一级菜单', code: 1 },
        { name: '二级菜单', code: 2 }
      ], // 级别列表
      menuSourceList: [
        { label: 'web端', value: 'web' },
        { label: '小程序', value: 'weChat' }
      ],
      menuSourceOpt: [
        { name: 'web端', code: 'web' },
        { name: '小程序', code: 'weChat' }
      ],
      // 表单验证规则
      rules: {
        menuSource: [{ required: true, message: '请选择所属系统', trigger: 'change' }],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menuCode: [
          { required: true, message: '请输入菜单Code', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择菜单级别', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请选择父级菜单', trigger: 'change' }
        ],
        frontUrl: [
          { required: true, message: '请输入前端URL', trigger: 'blur' }
        ],
        backUrl: [
          { required: true, message: '请输入后端URL', trigger: 'blur' }
        ],
        advertiseFlag: [
          { required: true, message: '请选择关联广告位', trigger: 'change' }
        ],
        icon: [
          { required: true, validator: validateSort, trigger: 'change' }
        ]
      },
      imageUrl: '',
      parentMenuNameList: [],
      menuTableData: [] // 菜单数据

    }
  },
  computed: {},
  beforeRouteLeave (to, from, next) {
    this.queryParams.current = this.pagenation.current
    this.queryParams.size = this.pagenation.size
    sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
    next()
  },
  beforeRouteEnter (to, from, next) {
    if (from.path == '/MenuList/MenuDetail' || from.path == '/MenuList/EditMenu') {
      to.params.isSaveQuery = true
    }
    next()
  },
  mounted () {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem('queryParams'))
      this.pagenation.current = this.queryParams.current
      this.pagenation.size = this.queryParams.size
      this.filterChangeVal = {
        menuName:this.queryParams.menuName,
        menuSource: this.queryParams.menuSource,
        level: this.queryParams.level
      }
    }
    this.$_getMenuData()
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  },
  methods: {
    handleClearSearch() {
      this.filterChangeVal ={
        menuName:"",
        menuSource: "",
        level: ""
      }
      this.queryParams = {
        menuId: '',
        menuName: '', // 菜单名
        level: '', // 级别
        menuSource: ''
      },
      this.handleSearchTableData();
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      let keys = Object.keys(this.filterChangeVal);
      keys.forEach(item=>{
        if(item==obj.paramValue){
          this.filterChangeVal[item] = searchVal
        }
      })
      this.queryParams[obj.paramValue] = searchVal
      this.handleSearchTableData();
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let menulistDiv= 0
        let searchFormHeight= 0
        if (document.getElementById("menulistDiv")) {
          menulistDiv = document.getElementById("menulistDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(menulistDiv) - Number(searchFormHeight) - 40;
      }, 200);
    },
    addBtn () {
      this.dynamicValidateForm.domains.unshift({buttonId: '', buttonName: '', menuCode: '', delFlag: 0, advertiseFlag: false, editAdFlag: true, frontUrl: ''})
    },
    deleteBtn (index, row) {
      if (row.buttonId) {
        this.$set(row, 'delFlag', 1)
      } else {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    radioChange () {
      this.handleGetValue('')
      this.ruleForm.parentId = ''
    },
    ontabClick (val) {
      let formName = 'ruleForm'
      if (val.name == 'first') {
        formName = 'dynamicValidateForm'
      }
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$nextTick(() => {
            if (val.name == 'sencond') {
              this.tabValue = 'first'
            } else {
              this.tabValue = 'sencond'
            }
          })
          this.$message.error(`请先填写必填项`)
        }
      })
    },
    // 查询
    handleSearchTableData () {
      this.pagenation.current = 1
      this.$_getMenuData()
    },
    // size change 事件
    handleSizeChange (size) {
      this.pagenation.size = size
      this.pagenation.current = 1
      this.$_getMenuData()
    },
    // page change 事件
    handleCurrentChange (current) {
      this.pagenation.current = current
      this.$_getMenuData()
    },
    handleCancle () {
      this.dialogFormVisible = false
    },
    // 新建菜单
    handleAddMenu () {
      this.dialogTitle = '新建菜单'
      this.tabValue = 'first'
      this.dialogFormVisible = true
      this.imageUrl = ''
      this.dynamicValidateForm.domains = []
      this.ruleForm = {
        menuSource: 'web',
        menuName: '', // 菜单名称
        menuCode: '',
        level: '', // 菜单级别
        parentId: '',
        frontUrl: '',
        orderNum:null,
        backUrl: '',
        advertiseFlag: false,
        editAdFlag: true
      }
      this.handleGetValue('')
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    }, 
    // 获取图片全路径
    getFullUrl(row) {
        const params = {
          url: row.icon
        };
        this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
          if (res.data.code == 1000) {
            this.ruleForm = {
              menuSource: row.menuSource,
              menuName: row.menuName, // 菜单名称
              menuCode: row.menuCode,
              level: row.level, // 菜单级别
              parentId: row.parentId,
              frontUrl: row.frontUrl,
              backUrl: row.backUrl,
              orderNum:row.orderNum,
              parentName: row.parentName,
              icon: row.icon,
              advertiseFlag: row.advertiseFlag,
              editAdFlag: row.editAdFlag,
              menuId:row.menuId
            }
            this.imageUrl = res.data.data
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      },
    // 查看
    handleLook (row) {
      this.dialogTitle = '查看菜单'
      this.tabValue = 'first'
      this.dialogFormVisible = true
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
      this.getFullUrl(row)
      this.dynamicValidateForm.domains = [...row.buttonList]
    },
    // 编辑
    handleEdit (row) {
      this.dialogTitle = '编辑菜单'
      this.tabValue = 'first'
      this.dialogFormVisible = true
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
      this.getFullUrl(row)
      this.handleGetValue('')
      this.dynamicValidateForm.domains = [...row.buttonList]
    },
    // 删除
    handleDelete (row) {
      if (row.children.length) {
        this.$confirm(`失败原因：请先删除子菜单`, '删除失败', {
          closeOnClickModal: false,
          confirmButtonText: '知道了',
          showCancelButton: false,
          customClass: 'deletBtn',
          type: 'warning'
        }).then(() => {}).catch(() => {})
        return
      }
      this.$confirm(`请确认是否删除菜单：${row.menuName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'deletBtn',
        type: 'warning'
      }).then(() => {
        let params = {
          menuId: row.menuId
        }
        const formData = new FormData()
        formData.append('menuId', row.menuId)
        this.requestMethodPost('/web/system/permission/menuManage/remove', formData)
          .then(res => {
            res = res.data
            if (res.code == 1000) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.$_getMenuData()
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
          .catch(res => {})
      })
        .catch(() => {})
    },
    // 获取菜单列表
    $_getMenuData () {
      this.loading = true
      let params = { ...this.queryParams, ...this.pagenation }
      this.requestMethodGet('/web/system/permission/menuManage/listByPage', params)
        .then(res => {
          this.loading = false
          res = res.data
          if (res.code == 1000) {
            this.menuTableData = res.data.list
            this.totalNumber = res.data.totalCount
            this.tableKey = Date.now();
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    handleChangeLevel () {
      this.ruleForm.parentId = ''
      this.handleGetValue('')
    },
    // 模糊查询上级菜单
    handleGetValue (value) {
      this.loadingInput = true
      let params = {
        menuName: value,
        level: this.ruleForm.level,
        menuSource: this.ruleForm.menuSource
      }
      this.requestMethodGet('/web/system/permission/menuManage/getParentMenu', params)
        .then(res => {
          res = res.data
          this.loadingInput = false
          if (res.code == 1000) {
            this.parentMenuNameList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    handleAvatarSuccess (file) {
      if (file.status !== 'ready') return;
      this.$refs['ruleForm'].clearValidate('icon')
      let params = new FormData()
      params.append('fileType', 'menu')
      params.append('multipartFiles', file.raw)
      this.requestMethodPost('/web/file/uploadFilesPublic', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            this.ruleForm.icon = res.data[0]
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type.startsWith('image')
      if (!isJPG) {
        this.ImageList = []
        this.$message.error('只能上传图片类型文件')
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.imageList = []
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    // 提交
    handleSubmitForm (formName) {
      if (this.tabValue == 'sencond') {
        formName = 'dynamicValidateForm'
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            buttonList: this.dynamicValidateForm.domains,
            menuType: 'C'
          }
          params = { ...this.ruleForm, ...params }
          params.orderNum=Number( this.ruleForm.orderNum )
          let url = '/web/system/permission/menuManage/add'
          if (this.dialogTitle == '编辑菜单') {
            url = '/web/system/permission/menuManage/edit'
            // params.menuId=
          }
          console.log(this.ruleForm)
          this.requestMethodPost(url, params)
            .then(res => {
              res = res.data
              if (res.code == 1000) {
                if (this.dialogTitle == '编辑菜单') {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                }
                this.$_getMenuData()
                this.dialogFormVisible = false
              } else {
                this.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
            .catch(res => {})
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang='less'>
@import "../../assets/css/customTable.less";
.menu-list {
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .edit-dialog .el-tabs__item.is-active {
    background: #fff !important;
    color: #dd0000 !important;

  }
  .edit-dialog .el-dialog {
    height: 700px;
  }
  .edit-dialog .el-tabs__item:hover {
    color: #dd0000 !important;
  }
  .edit-tab .el-tabs__active-bar {
    height :0 !important;
  }
  .el-tabs__nav-wrap::after {
    background-color:transparent !important;
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
    background-color:transparent !important;
  }
  .edit-dialog .el-form-item__label {
    color: #999 !important;
  }
  .edit-dialog .el-dialog__body {
    padding: 0 20px 0 0 !important;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #001450 !important;
    border-color: #001450 !important;
  }
  .el-radio__input.is-checked+.el-radio__label {
    color: #001450 !important;
  }
}
.demo-dynamic .el-radio {
  margin-right:20px !important;
}
.deletBtn .el-button--primary {
  background-color:#fe000c !important;
  border-color:#fe000c !important;
  }
.deletBtn .el-message-box__container {
      position: relative;
  }
.deletBtn .el-icon-warning {
  color: #fe000c !important;
}
.deletBtn .el-message-box__message {
  word-break:break-all !important;
}
</style>
