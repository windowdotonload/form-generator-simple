<template>
  <div :style="mainminheight" class="classific-service-apply-content">
    <div class="classic-service-content">
      <div class="classic-service-header left">
        <div class="left-title">
          润滑点类型
        </div>
        <div class="insert-title" style="cursor: pointer;" @click="handleLubriTypeAndCheck('新增润滑点类型')">新增</div>
      </div>
      <div class="classic-service-header">
        <div class="left-title">
          检查项目
        </div>
        <div class="insert-title" :style="!isAddCheckItem?'color:#999;border: 1px solid #ccc;background-color:rgba(245, 245, 245, 0.5);':'cursor: pointer;'" @click="isAddCheckItem?handleLubriTypeAndCheck('新增检查项目'):''">新增</div>
      </div>
    </div>
    <div class="classic-service-table-content">
      <!-- 润滑点类型 -->
      <div class="classic-service-table" :style="contentHeight">
        <div v-for="(item, index) in lubriList" :key="index" class="item-line" :style="item.id==clickLubriId?'background: rgba(221, 0, 0, 0.05);border-right: 4px solid #dd0000;':''" @click="itemClick(item.id, 'lubri')">
          <div>
            <span class="label-circle" :style="item.status==1?'background:#008888;':'background:#dd0000;'"></span>
            {{item.lubricationPointTypeName}}
          </div>
          <div v-show="item.id==clickLubriId">
            <span class="copy-btn" @click.stop="handleLubriTypeAndCheck('复制润滑点类型', item)">复制</span>
            <span class="edit-btn" @click.stop="handleLubriTypeAndCheck('编辑润滑点类型', item)">编辑</span>
          </div>
        </div>
        <div v-if="lubriList.length==0" class="no-data">暂无数据</div>
      </div>
      <!-- 检查项目 -->
      <div class="classic-service-table table-right" :style="contentHeight">
        <div v-for="(item, index) in checkItemList" :key="index" class="item-line" :style="item.id==clickCheckId?'background: rgba(221, 0, 0, 0.05);border-right: 4px solid #dd0000;':''" @click="itemClick(item.id, 'check')">
          <div>
            <span class="label-circle" :style="item.relStatus==1?'background:#008888;':'background:#dd0000;'"></span>
            {{item.itemName}}
          </div>
          <div v-show="item.id==clickCheckId">
            <el-link
              type="danger"
              :underline="false"
              @click="handleChangeMove('up', item, index)"
              :disabled="index==0? true : false"
              :style="index==0?'margin-right: 10px;color: #aaa;':'margin-right: 10px; color: #001450;'"
              >上移</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="handleChangeMove('down', item, index)"
              :disabled="index+1==checkItemList.length ? true : false"
              :style="index+1==checkItemList.length ?'margin-right: 10px;color: #aaa;':'margin-right: 10px; color: #001450;'"
              >下移</el-link
            >
            <span class="edit-btn" @click="handleLubriTypeAndCheck('编辑检查项目', item)">编辑</span>
          </div>
        </div>
        <div v-if="checkItemList.length==0" class="no-data">暂无数据</div>
      </div>
    </div>

    <el-dialog :title="lubriTypeHandle=='复制润滑点类型'?'新增润滑点类型':lubriTypeHandle" :visible.sync="lubriTypeDialog" width="30%" :close-on-click-modal="false" :before-close="handleCloseLubriType">
      <div style="display: flex; align-items: center" v-show="dialogType=='lubriType'">
        <el-form ref="lubriForm" :model="lubriTypeRuleForm" label-width="110px" label-position="left">
          <el-form-item label="润滑点类型：" prop="lubricationPointTypeCode" :rules="[{ required: true, message: '请选择润滑点类型', trigger: 'change' }]">
            <el-select ref="lubriSelect" v-model="lubriTypeRuleForm.lubricationPointTypeCode" clearable placeholder="请选择" size="small" :disabled="lubriTypeHandle=='编辑润滑点类型'">
              <el-option v-for="item in selectLubriOptions" :key="item.code" :label="item.name" :value="item.code" :disabled="item.disabled"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用/禁用：" prop="status" :rules="[{ required: true, message: '请选择启用/禁用', trigger: 'change' }]">
            <el-switch 
              v-model="lubriTypeRuleForm.status"
              active-color="#001450"
              :active-text="lubriTypeRuleForm.status?'启用':'禁用'">
            </el-switch>
          </el-form-item>
          <div v-show="lubriTypeHandle=='复制润滑点类型'" style="color:#dd0000;">您将复制{{lubriTypeRuleForm.lubricationPointTypeName}}的检查项目配置！</div>
        </el-form>
      </div>
      <div style="display: flex; align-items: center" v-show="dialogType=='checkItem'">
        <el-form ref="checkItemForm" :model="checkForm" label-width="110px" label-position="left">
          <el-form-item label="检查项目：" prop="itemId" :rules="[{ required: true, message: '请选择检查项目', trigger: 'change' }]">
            <el-select v-model="checkForm.itemId" clearable placeholder="请选择" size="small" :disabled="lubriTypeHandle=='编辑检查项目'">
              <el-option v-for="item in selectCheckOptions" :key="item.id" :label="item.itemName" :value="item.id" :disabled="item.disabled"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用/禁用：" prop="relStatus" :rules="[{ required: true, message: '请选择启用/禁用', trigger: 'change' }]">
            <el-switch 
              v-model="checkForm.relStatus"
              active-color="#001450"
              :active-text="checkForm.relStatus?'启用':'禁用'">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseLubriType" size="small">取 消</el-button>
        <el-button type="danger" @click="handleConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAddCheckItem: false,
      lubriTypeRuleForm: {
        id: '',
        lubricationPointTypeCode: '',
        status: true
      },
      checkForm: {
        itemId: '',
        relStatus: true
      },
      selectLubriOptions: [],
      selectCheckOptions: [],
      lubriTypeDialog: false,
      checkDialog: false,
      clickLubriId: '',
      clickCheckId: '',
      lubriTypeHandle: '',
      dialogType: '',
      lubriList: [],
      checkItemList: [],
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      contentHeight: `height:${document.documentElement.clientHeight - 250}px`,
    };
  },
  mounted() {
    this.getLubriList()
    this.getCheckItemList()
    this.getLibriOptions()
  },
  created() {},
  methods: {
    handleChangeMove(type, item, index){
      let param = {
        studyId: this.clickLubriId,
        studyItemId: item.id,
        sort: item.sort,
        sortType: type
      }
      this.requestMethodPost('lubePoint/study/updateSort', param).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getCheckItemList(this.clickLubriId)
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        });
    },
    getLibriOptions() {
      this.requestMethodGet("/web/customer/getIndustryTreeList", {parentCode: "lubrication_point_type"})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.selectLubriOptions = res.data
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 润滑调查配置列表
    getLubriList() {
      this.requestMethodGet('/lubePoint/study/getStudyList', {}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            this.lubriList = res.data
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    // 润滑检查项目列表
    getCheckItemList(id) {
      this.checkItemList = []
      let param = {}
      if(id) {
        param = {studyId: id}
      }else{
        param = {status: 1}
      }
      this.requestMethodGet('/lubePoint/study/getItemList', param).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            if(id) {
              this.checkItemList = res.data
            }else{
              this.selectCheckOptions = res.data
            }
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    itemClick(id, type){
      if(type=='lubri'){
        this.clickLubriId = id
        this.getCheckItemList(id)
        this.lubriTypeRuleForm.id=id
        this.isAddCheckItem = true
      }else{
        this.clickCheckId = id
      }
    },
    handleCloseLubriType() {
      this.lubriTypeDialog = false
    },
    handleConfirm() {
      if(this.dialogType=='lubriType'){
        this.$refs.lubriForm.validate(async valid => {
          if (valid) {
            let url='/lubePoint/study/addOrUpdateStudy', param={}
            param.lubricationPointTypeCode = this.lubriTypeRuleForm.lubricationPointTypeCode
            param.status = this.lubriTypeRuleForm.status?1:0
            param.lubricationPointTypeName = this.$refs.lubriSelect.selected.label;
            if(this.lubriTypeHandle=='编辑润滑点类型'){
              param.id=this.lubriTypeRuleForm.id
            }
            if(this.lubriTypeHandle=='复制润滑点类型'){
              url='/lubePoint/study/copyStudy'
              param.copyStudyId=this.lubriTypeRuleForm.id
            }
            this.requestMethodPost(url, param).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.lubriTypeDialog = false
                this.getLubriList()
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            });
          }
        });
      }else{
        this.$refs.checkItemForm.validate(async valid => {
          if (valid) {
            let param={}
            param.relStatus = this.checkForm.relStatus?1:0
            if(this.lubriTypeRuleForm.id){
              param.id=this.lubriTypeRuleForm.id
            }
            param.itemId=this.checkForm.itemId
            param.addFlag=1
            if(this.checkForm.sort){
              param.addFlag=0
              param.sort=this.checkForm.sort
            }
            this.requestMethodPost('/lubePoint/study/addOrUpdateStudyItemRel', param).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.getCheckItemList(this.lubriTypeRuleForm.id)
                this.lubriTypeDialog = false
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            });
          }
        });
      }
    },
    handleCloseCheck() {
      this.checkDialog = false
    },
    async handleLubriTypeAndCheck(type, row) {
      this.lubriTypeHandle = type
      if(type.substring(2,4)=='润滑'){
        if(this.lubriList.length>0){
          let lubriArr = this.lubriList.map(item=>{
            return item.lubricationPointTypeCode
          })
          this.selectLubriOptions.forEach(item=>{
            if(lubriArr.includes(item.code)){
              item.disabled = true
            }else{
              item.disabled = false
            }
          })
        }else{
          this.selectLubriOptions.forEach(item=>{
            item.disabled = false
          })
        }
        this.dialogType='lubriType'
        if(type.substring(0,2)=='新增'){
          if(this.lubriTypeRuleForm.id){
            this.isAddCheckItem = true
          }else{
            this.isAddCheckItem = false
          }
          this.lubriTypeRuleForm = {
            id: '',
            lubricationPointTypeCode: '',
            status: true
          }
        }else if(type.substring(0,2)=='复制'||type.substring(0,2)=='编辑'){
          const res = await this.requestMethodGet("/lubePoint/study/getStudyDetail", {id: row.id});
          if(res.data.code == 1000){
            Object.assign(this.lubriTypeRuleForm, res.data.data)
            this.lubriTypeRuleForm.status=this.lubriTypeRuleForm.status==1?true:false
          }
          if(type.substring(0,2)=='复制'){
            this.lubriTypeRuleForm.status=true
            this.lubriTypeRuleForm.lubricationPointTypeCode = ''
          }
        }
      }else{
        this.dialogType='checkItem'
        if(type.substring(0,2)=='新增'){
          if(this.checkItemList.length>0){
            let checkItemArr = this.checkItemList.map(item=>{
              return item.id
            })
            this.selectCheckOptions.forEach(item=>{
              if(checkItemArr.includes(item.id)){
                item.disabled = true
              }else{
                item.disabled = false
              }
            })
          }else{
            this.selectCheckOptions.forEach(item=>{
              item.disabled = false
            })
          }
          this.checkForm = {
            itemId: '',
            relStatus: true
          }
        }else if(type.substring(0,2)=='编辑'){
          this.checkForm.itemId = row.id
          this.checkForm.sort = row.sort
          this.checkForm.relStatus = row.relStatus==1?true:false
        }
      }
      this.lubriTypeDialog = true
    },
  }
};
</script>
<style scoped lang="less">
/deep/.el-table .success-row {
  background: #ecf5ff;
}
.classific-service-apply-content {
  margin: 20px 20px 0;
  border: 1px solid #e9e9e9;
  .classic-service-content {
    display: flex;
  }
  .classic-service-header {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
  }
  .left-title {
    height: 48px;
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: bolder;
  }
  .insert-title{
    height: 32px;
    border: 1px solid #dd0000;
    color: #dd0000;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px 20px 0;
    font-size: 14px;
    background-color:rgba(221, 0, 0, 0.05);
  }
  .left {
    border-right: 1px solid #e9e9e9;
  }
  .classic-service-table-content {
    display: flex;
    height: 100%;
    .item-line{
      padding: 0 20px;
      height: 48px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      cursor: pointer;
      .label-circle{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
      }
      .copy-btn{
        color: #001450;
        padding-right: 10px;
        font-size: 14px;
        cursor: pointer;
      }
      .edit-btn{
        color: #dd0000;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .classic-service-table {
    width: 50%;
    height: 722px;
    overflow: auto;
  }
  .service-line {
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0;
    vertical-align: middle;
    position: relative;
    background-color: #e9e9e9;
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
  .add-guide-btn{
    color: #dd0000;
    font-size: 14px;
    margin: 5px 20px;
    cursor: pointer;
  }
  .no-data{
    color: #666666;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
