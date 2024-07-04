<template>
  <div :style="mainminheight" class="classific-service-content">
    <!-- 分类与服务 -->
    <div class="classic-service-content">
      <!-- 分类 -->
      <div class="classic-service-header left">
        <div class="left-title">
          <div class="line"></div>
          分类
        </div>
        <div class="right-btn" v-if="classicTableData.length<30">
          <el-button type="danger" size="small" @click="addClassific" v-has="Service-TJFL">添加分类</el-button
          >
        </div>
      </div>
      <!-- 服务 -->
      <div class="classic-service-header">
        <div class="left-title">
          <div class="line"></div>
          服务
        </div>
        <!--  -->
        <div class="right-btn" v-if="serviceTableData.length<30 || classicTableData.length == 0">
          <el-button type="danger" size="small" @click="addService" v-has="Service-TJFU">添加服务</el-button
          >
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="classic-service-table-content" >
      <!-- 分类表格 -->
      <div class="classic-service-table" :style="contentHeight">
        <el-table
          :data="classicTableData"
          :show-header="showHeader"
           @row-click="classficRowClick"
           @current-change="handleCurrentChange"
           highlight-current-row
           :row-class-name="classicTableRowClassName"
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot-scope="scope">
              <div
                style="display: flex; align-items: center; margin-left: 10px"
              >
                <div
                  class="level-point"
                  :style="{
                    backgroundColor:
                      scope.row.status == 0 ? '#dd0000' : '#008888',
                  }"
                ></div>
                <div style="margin-left: 10px">{{ scope.row.serviceName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <div style="margin-right: 10px">
                <el-button
                  style="color: #001450"
                  type="text"
                  @click="editClassific(scope.row, scope.$index)"
                  v-has="Service-BJ"
                  >编辑</el-button
                >
                <el-button
                  :style="{ color: scope.$index == 0 ? '#999999' : '#001450' }"
                  type="text"
                  @click="sortUpClassific(scope.row)"
                  :disabled="scope.$index == 0"
                  v-has="Service-SY/XY"
                  >上移</el-button
                >
                <el-button
                  :style="{
                    color:
                      scope.$index == classicTableData.length - 1
                        ? '#999999'
                        : '#001450',
                  }"
                  type="text"
                  @click="sortDownClassific(scope.row)"
                  :disabled="scope.$index == classicTableData.length - 1"
                  v-has="Service-SY/XY"
                  >下移</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 服务表格 -->
      <div class="classic-service-table table-right" :style="contentHeight">
        <el-table
          :data="serviceTableData"
          :show-header="showHeader"
          highlight-current-row
          @row-click="serviceRowClick"
          @current-change="handleCurrentChange"
          :row-class-name="serviceTableRowClassName"
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot-scope="scope">
              <div
                style="display: flex; align-items: center; margin-left: 10px"
              >
                <div
                  class="level-point"
                  :style="{
                    backgroundColor:
                      scope.row.status == 0 ? '#dd0000' : '#008888',
                  }"
                ></div>
                <div style="margin-left: 10px">{{ scope.row.serviceName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <div style="margin-right: 10px">
                <el-button
                  style="color: #001450"
                  type="text"
                  @click="editServiceRow(scope.row, scope.$index)"
                  v-has="Service-BJ"
                  >编辑</el-button
                >
                <el-button
                  :style="{ color: scope.$index == 0 ? '#999999' : '#001450' }"
                  type="text"
                  @click="sortUpService(scope.row)"
                  :disabled="scope.$index == 0"
                  v-has="Service-SY/XY"
                  >上移</el-button
                >
                <el-button
                  :style="{
                    color:
                      scope.$index == serviceTableData.length - 1
                        ? '#999999'
                        : '#001450',
                  }"
                  type="text"
                  @click="sortDownService(scope.row)"
                  :disabled="scope.$index == serviceTableData.length - 1"
                  v-has="Service-SY/XY"
                  >下移</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
     <!-- 添加/编辑分类 -->
    <el-drawer
      v-if="classificaDrawerFlag"
      :title="classificaTitle"
      :visible.sync="classificaDrawerFlag"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :wrapperClosable="wrapperClosable"
    >
      <div style="margin-left: 30px">
        <el-form
          ref="classificaForm"
          :model="classificaDrawerForm"
          :rules="classificaDrawerRules"
          label-width="80px"
        >
          <el-form-item label="名称" prop="serviceName">
            <el-input
              clearable
              placeholder="请输入"
              v-model="classificaDrawerForm.serviceName"
              size="small"
              style="width: 456px"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="classificaDrawerForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-drawer" style="position: fixed;bottom: 20px;right: 10px;">
        <el-button style="margin-left: auto;" size="small"  @click="cancelClassificaDraw('classificaForm')">取消</el-button>
        <el-button size="small" type="danger" plain @click="deleteClassific" v-if="classificTypeFlag == 'editClassific'">删除</el-button>
        <el-button size="small" type="danger" @click="submitClassificDraw('classificaForm')">保存</el-button>
      </div>
    </el-drawer>
    <!-- 添加/编辑服务 -->
    <el-drawer
      v-if="serviceDrawerFlag"
      :title="serviceDrawerTitle"
      :visible.sync="serviceDrawerFlag"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :wrapperClosable="wrapperClosable"
    >
      <div style="margin-left: 30px;margin-bottom:40px">
        <el-form
          ref="serviceForm"
          :model="drawerForm"
          :rules="drawerRules"
          label-width="80px"
        >
          <el-form-item label="名称" prop="serviceName">
            <el-input
              clearable
              placeholder="请输入"
              v-model="drawerForm.serviceName"
              size="small"
              style="width: 456px"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item label="列表简介" prop="shortDesc">
            <el-input
              clearable
              v-model="drawerForm.shortDesc"
              :autosize="shortDescAutosize"
              style="width: 456px"
              type="textarea"
              placeholder="请输入"
              maxlength="150"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="drawerForm.status" :disabled="resetDrawerStatus==0">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-drawer" style="position: fixed;bottom: 20px;right: 10px;">
        <el-button style="margin-left: auto;" size="small" @click="cancelServiceDraw('serviceForm')">取消</el-button>
        <el-button type="danger" plain size="small" @click="deleteService" v-if="serviceDrawType == 'editService'">删除</el-button>
        <el-button type="danger" size="small" @click="submitServiceDraw('serviceForm')">保存</el-button>
      </div>
    </el-drawer>
    <!-- 删除分类，服务弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteClassificaFlag"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose">
        <div style="display: flex;align-items: center;">
          <i class="delete-icon" :class="isCanDeleteFlag?'el-icon-warning':'el-icon-error'" :style="{color: isCanDeleteFlag?'#e6a23c':'#dd0000'}"></i><span>{{deleteTips}}</span>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteClassificaFlag = false" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmDelete" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分类取消 -->
    <el-dialog
      title="提示"
      :visible.sync="classificaFlag"
      width="30%"
      :before-close="handleClose">
        <div style="display: flex;align-items: center;">
          <i class="delete-icon el-icon-warning" style="color: #e6a23c"></i><span>当前结果尚未保存，是否取消？</span>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="classificaFlag = false" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmCancelClass('classificaForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 服务取消提示 -->
    <el-dialog
      title="提示"
      :visible.sync="cancelServiceFlag"
      width="30%"
      :before-close="handleClose">
        <div style="display: flex;align-items: center;">
          <i class="delete-icon el-icon-warning" style="color: #e6a23c"></i><span>当前结果尚未保存，是否取消？</span>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelServiceFlag = false" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmCancel('serviceForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 无法变更权限弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="notChangeLimitFlag"
      width="40%"
      :before-close="handleClose">
        <div style="display: flex;align-items: center;">
          <i class="delete-icon el-icon-error" style="color: #dd0000"></i><span>无法变更操作权限，经销商已被下级资源使用，如下：</span>
        </div>
        <!-- 表格 -->
        <div style="margin-top:20px">
          <el-table
            :data="limitTableData"
            highlight-current-row
            style="width: 100%"
            border
          >
            <el-table-column
              header-align="center"
              align="center"
              prop="serviceLevelDesc"
              label="类型" >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="serviceName"
              label="名称" >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="authorityTypeDesc"
              label="操作权限类型" >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="companyNames"
              label="经销商"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="notChangeLimitConfirm" size="small">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      filterMethod (query, item) {
        return item.companyName.indexOf(query) > -1
      },
      myHeaders: {},
      notChangeLimitFlag: false,
      limitTableData: [],
      deleteClassificaFlag: false,
      isCanDeleteFlag: false,
      deleteTips: '',
      cancelServiceFlag: false,
      classificaFlag: false,
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      contentHeight: `height:${document.documentElement.clientHeight - 200}px`,
      serviceParentId: '',
      wrapperClosable: false,
      serviceDrawerTitle: '',
      serviceDrawerFlag: false,
      classificaTitle: '',
      classificaDrawerFlag: false,
      showHeader: false,
      direction: 'rtl',
      shortDescAutosize: { minRows: 4, maxRows: 8 },
      classicTableData: [],
      serviceTableData: [],
      drawerForm: {
        serviceName: '',
        status: '',
        shortDesc: ''
      },
      isModal: false,
      serviceDrawType: '',
      serviceTransferData: [],
      classificaTransferData: [],
      classificaDrawerForm: {
        serviceName: '',
        status: 1
      },
      classificaDrawerRules: {
        serviceName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      drawerRules: {
        serviceName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        shortDesc: [{ required: true, message: '请输入列表简介', trigger: 'blur' }]
      },
      classificTypeFlag: '',
      editServiceId: '',
      deleteId: '', // 删除单条分类，服务ID
      currentRow: null,
      resetDrawerStatus: '',
      tempLoadingNum: 0,
      tempClassificLineId: '',
      tempServiceLineId: '',
      tempSortServiceFlag: ''
    }
  },
  mounted () {
    this.myHeaders = {MSDPAuthorization: this.getCookie(), Source: 'web'}
  },
  created () {
    // 查询分类列表
    this.getClassificList()
  },
  methods: {
    onResize () {
      this.contentHeight = `height:${document.documentElement.clientHeight -
        200}px`
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    // 返回
    back () {
      this.$router.go(-1)
    },
    // 分类表格点击
    classficRowClick (row, column, event) {
      this.tempClassificLineId = row.id
      this.tempSortServiceFlag = ''
      this.getServiceList(row.id)
      this.serviceParentId = row.id
      this.drawerForm.status = row.status
      this.resetDrawerStatus = row.status
    },
    // 分类列表
    getClassificList () {
      const params = {
        serviceLevel: 1,
        current: 1,
        size: 30
      }
      this.requestMethodGet(
        '/web/config/serviceConfiguration/queryServiceConfListByPage',
        params
      ).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data.list
          // 取出第一项分类查询该下的服务
          if (data && data.length > 0) {
            if (!this.tempLoadingNum > 0) {
              ++this.tempLoadingNum
              this.tempClassificLineId = data[0].id
            }
            if (this.sortType == 'deleteClassific') {
              this.tempClassificLineId = data[0].id
              this.serviceParentId = data[0].id
              this.drawerForm.status = data[0].status
              this.resetDrawerStatus = data[0].status
            }
            if (!this.sortType) {
              this.getServiceList(data[0].id)
              this.serviceParentId = data[0].id
              this.drawerForm.status = data[0].status
              this.resetDrawerStatus = data[0].status
            }
            data.forEach(item => {
              if (item.id == this.serviceParentId) {
                this.resetDrawerStatus = item.status
              }
            })
            this.classicTableData = data
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 分类处理高亮
    classicTableRowClassName ({row, rowIndex}) {
      if (row.id == this.tempClassificLineId) {
        return 'success-row'
      }
      return ''
    },
    // 服务处理高亮
    serviceTableRowClassName ({row, rowIndex}) {
      if (row.id == this.tempServiceLineId) {
        return 'success-row'
      }
      return ''
    },
    // 服务列表点击
    serviceRowClick (row, column, event) {
      this.tempServiceLineId = row.id
    },
    // 获取服务列表
    getServiceList (val) {
      const params = {
        serviceLevel: 2,
        parentId: val,
        current: 1,
        size: 30
      }
      this.requestMethodGet(
        '/web/config/serviceConfiguration/queryServiceConfListByPage',
        params
      ).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data.list
          if (data && data.length > 0) {
            if (!this.tempSortServiceFlag) {
              this.tempServiceLineId = data[0].id
            }
          }
          this.serviceTableData = data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 添加分类
    addClassific () {
      this.classificaTitle = '添加分类'
      this.classificTypeFlag = 'addClassific'
      this.classificaDrawerFlag = true
    },
    // 分类编辑
    editClassific (row, index) {
      this.deleteId = row.id
      const params = {
        id: row.id
      }
      this.requestMethodGet(
        '/web/config/serviceConfiguration/queryServiceConfInfoById',
        params
      ).then((res) => {
        if (res.data.code == 1000) {
          this.classificaTitle = '编辑分类'
          this.classificTypeFlag = 'editClassific'
          this.classificaDrawerFlag = true
          this.classificaDrawerForm = res.data.data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 分类上移
    sortUpClassific (row) {
      this.sortType = 'sort'
      const params = {
        id: row.id,
        upOrDown: '1'
      }
      this.upOrDownRow(params, 'classifica')
    },
    // 分类下移
    sortDownClassific (row) {
      this.sortType = 'sort'
      const params = {
        id: row.id,
        upOrDown: '2'
      }
      this.upOrDownRow(params, 'classifica')
    },
    // 上移或者下移
    upOrDownRow (params, type) {
      this.requestMethodPost('/web/config/serviceConfiguration/updateServiceConfUpOrDown', params).then(res => {
        if (res.data.code == 1000) {
          const title = params.upOrDown == '1' ? '上移成功' : '下移成功'
          this.$message({
            type: 'success',
            message: title
          })
          if (type == 'classifica') { // 分类
            this.getClassificList()
          } else { // 服务
            this.getServiceList(this.serviceParentId)
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 分类穿梭框选择事件
    handleClassificaChange () {
    },
    // 分类抽屉取消
    cancelClassificaDraw (formName) {
      if (this.classificTypeFlag == 'editClassific') { // 编辑取消
        this.classificaFlag = true
      } else {
        this.$refs[formName].resetFields()
        this.classificaDrawerFlag = false
        this.clearClassificFrom()
      }
    },
    // 确定分类取消
    confirmCancelClass (formName) {
      this.classificaFlag = false
      this.$refs[formName].resetFields()
      this.classificaDrawerFlag = false
      this.clearClassificFrom()
    },
    // 删除分类
    deleteClassific () {
      this.deleteType = 'classifica'
      this.judgeDelete()
    },
    // 判断是否可删除
    judgeDelete () {
      const params = {
        id: this.deleteId
      }
      this.requestMethodGet('/web/config/serviceConfiguration/deleteCheckById', params).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data) { // 可以删除
            this.isCanDeleteFlag = true
          } else { // 不可以删除
            this.isCanDeleteFlag = false
          }
          if (this.deleteType == 'classifica') {
            if (this.isCanDeleteFlag) { // 可以删除
              this.deleteTips = '是否删除当前分类？分类删除后将无法找回'
            } else {
              this.deleteTips = '无法删除该分类，当前分类已被使用，无法删除。'
            }
          }
          if (this.deleteType == 'service') {
            if (this.isCanDeleteFlag) { // 可以删除
              this.deleteTips = '是否删除当前服务？服务删除后将无法找回'
            } else {
              this.deleteTips = '无法删除该服务，当前服务已被使用，无法删除。'
            }
          }
          this.deleteClassificaFlag = true
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 分类抽屉确定
    submitClassificDraw (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = ''
          if (this.classificTypeFlag == 'addClassific') {
            // 新增分类
            url = '/web/config/serviceConfiguration/addServiceConf'
          } else {
            // 编辑分类
            url = '/web/config/serviceConfiguration/updateServiceConfInfoById'
          }
          const obj = {
            parentId: '',
            serviceLevel: 1
          }
          const params = { ...obj, ...this.classificaDrawerForm }
          this.requestMethodPost(url, params).then((res) => {
            if (res.data.code == 1000) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.sortType = 'saveClassific'
              this.classificaDrawerFlag = false
              this.clearClassificFrom()
              this.getClassificList()
              if (params.id) {
                this.getServiceList(params.id)
              }
            } else if (res.data.code == 4210) {
              this.limitTableData = res.data.data
              this.classificaDrawerFlag = false
              this.notChangeLimitFlag = true
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearClassificFrom () {
      this.classificaDrawerForm = {
        serviceName: '',
        status: 1,
        authorityType: 1
      }
    },
    // 添加服务
    addService () {
      this.clearServiceForm()
      this.serviceDrawerTitle = '添加服务'
      this.serviceDrawType = 'addService'
      this.serviceDrawerFlag = true
      this.drawerForm.status == 1
    },
    // 服务编辑
    editServiceRow (row) {
      this.serviceDrawerTitle = '编辑服务'
      this.serviceDrawType = 'editService'
      this.editServiceId = row.id
      this.serviceParentId = row.parentId
      this.deleteId = row.id
      this.drawerForm.status == 1
      this.getServiceDetail(row.id)
    },
    // 服务编辑
    getServiceDetail (val) {
      const params = {
        id: val
      }
      this.requestMethodGet('/web/config/serviceConfiguration/queryServiceConfInfoById', params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data
          this.drawerForm = data
          this.serviceDrawerFlag = true
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 服务上移
    sortUpService (row) {
      this.tempServiceLineId = row.id
      this.tempSortServiceFlag = 'sort'
      const params = {
        id: row.id,
        upOrDown: '1'
      }
      this.upOrDownRow(params, 'service')
    },
    // 服务下移
    sortDownService (row) {
      this.tempServiceLineId = row.id
      this.tempSortServiceFlag = 'sort'
      const params = {
        id: row.id,
        upOrDown: '2'
      }
      this.upOrDownRow(params, 'service')
    },
    // 服务抽屉取消
    cancelServiceDraw (formName) {
      if (this.serviceDrawType == 'editService') { // 编辑服务
        this.cancelServiceFlag = true
      } else {
        this.$refs[formName].resetFields()
        this.serviceDrawerFlag = false
        this.clearServiceForm()
      }
    },
    // 服务确认取消
    confirmCancel (formName) {
      this.cancelServiceFlag = false
      this.$refs[formName].resetFields()
      this.serviceDrawerFlag = false
      this.clearServiceForm()
    },
    // 删除服务
    deleteService () {
      this.deleteType = 'service'
      this.judgeDelete()
    },
    // 服务抽屉确定
    submitServiceDraw (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = ''
          let params = {
            parentId: this.serviceParentId,
            serviceLevel: 2,
            serviceName: this.drawerForm.serviceName,
            status: this.drawerForm.status,
            shortDesc: this.drawerForm.shortDesc
          }
          if (this.serviceDrawType == 'editService') {
            params.id = this.editServiceId
            url = '/web/config/serviceConfiguration/updateServiceConfInfoById'
          } else {
            url = '/web/config/serviceConfiguration/addServiceConf'
          }
          this.requestMethodPost(url, params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.tempSortServiceFlag = 'saveService'
              this.clearServiceForm()
              this.serviceDrawerFlag = false
              this.getServiceList(this.serviceParentId)
            } else if (res.data.code == 4210) {
              this.limitTableData = res.data.data
              this.serviceDrawerFlag = false
              this.notChangeLimitFlag = true
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    notChangeLimitConfirm () {
      this.notChangeLimitFlag = false
    },
    // 确定删除
    confirmDelete () {
      const params = {
        id: this.deleteId
      }
      this.requestMethodPost('/web/config/serviceConfiguration/deleteServiceConfInfoById', params).then(res => {
        if (res.data.code == 1000) {
          this.deleteClassificaFlag = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          if (this.deleteType == 'classifica') { // 删除分类
            this.classificaDrawerFlag = false
            this.clearClassificFrom()
            this.sortType = 'deleteClassific'
            this.getClassificList()
          } else { // 删除服务
            this.serviceDrawerFlag = false
            this.tempSortServiceFlag = ''
            this.getServiceList(this.serviceParentId)
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    clearServiceForm () {
      this.drawerForm = {
        serviceName: '',
        status: this.resetDrawerStatus,
        shortDesc: ''
      }
    }
  }
}
</script>
<style scoped lang="less">
 /deep/.el-table .success-row {
    background: #ecf5ff;
  }
.classific-service-content {
  margin-top: 20px;
  .classic-service-content {
    display: flex;
  }
  .classic-service-header {
    width: 50%;
    height: 48px;
    // width: 100%;
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    padding-left: 20px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .line {
      width: 4px;
      height: 14px;
      background: #dd0000;
      margin-right: 10px;
    }
  }
  .left-title {
    display: flex;
    align-items: center;
  }
  .right-btn {
    margin-left: auto;
    margin-right: 20px;
  }
  .left {
    border-right: 1px solid #e9e9e9;
  }
  .classic-service-table-content {
    display: flex;
    height: 100%;
  }
  .classic-service-table {
    width: 50%;
    height: 722px;
    overflow: auto;
  }
  .service-line{
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0;
    vertical-align: middle;
    position: relative;
    background-color:#e9e9e9
  }
  .table-right {
    border-left: 1px solid #e9e9e9;
  }
  .level-point {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .draw-class {
    width: 50%;
  }
  .footer-drawer {
    display: flex;
    align-items: center;
    height: 52px;
    margin-right: 40px;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 263px;
    height: 32px;
    border-radius: 3px;
    font-size: 12px;
    border: 1px solid;

    cursor: pointer;
  }
  .cancel {
    margin: 0 10px 0 20px;
    border: 1px solid #e9e9e9;
    color: #666666;
  }
  .submit {
    color: #fff;
    background-color: #dd0000;
  }
  /deep/ .el-drawer .rtl {
    overflow-y: auto;
    margin-bottom: 52px;
  }
  /deep/ .el-drawer__body {
    overflow: auto;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #001450 !important;
    background: #001450 !important;
  }
  /deep/ .el-upload-list__item {
    transition: none !important;
  }
  .mask {
    position: absolute;
    background: rgba(245, 108, 108, 1);
    color: #ffffff;
    opacity: 0;
    top: 0;
    width: 751px;
    height: 20px;
    top: 403px;
    }
    .mask h3 {
        position: absolute;
        top: -20px;
        left: 50%;
        cursor: pointer;
    }
    .parent-video:hover .mask {
        opacity: 1;
    }
    .el-upload-list__item {
        transition: none !important;
    }
  .delete-icon {
    margin-right:10px;
    font-size:24px
  }
  /deep/ .el-transfer-panel {
    width:200px;
  }
}
</style>
