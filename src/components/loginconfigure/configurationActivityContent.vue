<template>
   <div class="component-activity">
      <!-- 表格操作 -->
      <el-row :gutter="20">
        <el-col :span="24" align="right">
          <!--  v-has="noticeAddbtn" -->
          <el-button type="danger" @click="addActivity" size="small">新建</el-button>
        </el-col>
      </el-row>
      <custom-table
        :tableHeader="tableDataHeader"
        :tableData="tableData"
        :tableHeight="tableHeight + ''"
        :loading="loadingTable"
        class="moreSelectMar"
        @changeSearch="tableTitleSearch"  
        @changeSortTable="changeSortTable"
      >
      <!-- 活动类型 -->
      <template v-slot:activityType="slotProps">
          <el-table-column
            label="活动类型"
            show-overflow-tooltip>
            <template slot="header">
              <column-header 
                title="活动类型"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span>优秀案例提报</span>
            </template>
          </el-table-column>
      </template>

      <template v-slot:status="slotProps">
        <el-table-column
          label="状态"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template slot="header">
            <column-header 
              title="状态"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectMultiple="slotProps.slotData.selectMultiple"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span v-show="scope.row.status == '1'" style="color:#67C23A;">已上线</span>
            <span v-show="scope.row.status == '0'" style="color:#dd0000;">已下线</span>
          </template>
        </el-table-column>
      </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="280" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link
              type="danger"
              @click="editRow(scope.row)"
              v-if="scope.row.status==0"
              style="color: #001450"
              :underline="false"
              >编辑</el-link
            >
            <el-link
              type="success"
              :underline="false"
              @click="onLine(scope.row)"
              style="margin-left: 10px;"
              v-if="scope.row.status==0"
              >上线</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="outLine(scope.row)"
              v-if="scope.row.status==1"
              style="margin-left: 10px;"
             >下线</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="deleteRow(scope.row)"
              style="margin-left: 10px;"
              v-if="scope.row.status==0"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!-- 新建 -->
      <el-drawer
        title="活动内容配置 > 新建"
        :visible.sync="drawerVisible"
        :direction="rtl"
        :show-close="false"
        :wrapperClosable="false">
        <div class="draw-contnet">
          <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
            <el-form-item label="活动标题" prop="activityName">
              <el-input size="small" v-model="addForm.activityName" clearable maxlength="30" show-word-limit placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="活动类型" prop="activityType">
              <el-select v-model="addForm.activityType" placeholder="请选择" size="small">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动简介" prop="activityDesc">
              <el-input size="small" type="textarea" v-model="addForm.activityDesc" clearable maxlength="500" show-word-limit placeholder="请输入描述内容" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="addForm.status" size="small">
                <el-radio :label="1">上线</el-radio>
                <el-radio :label="0">下线</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-footer" style="padding-right:20px;text-align:right;padding-bottom:20px">
          <el-button size="small" @click="resetForm('addFormRef')">取消</el-button>
          <el-button size="small" type="danger" @click="saveForm('addFormRef')">保存</el-button>
        </div>
      </el-drawer>
    </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
export default {
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
  },
  data () {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      loadingTable: false,
      tableHeight:null,
      tableDataHeader: [
        {filterType: "input", paramValue: "activityName", changeValue:"",  label: "活动标题", prop: "activityName", width: "300", tooltip: true},
        { filterType: "selection", paramValue: "activityType", selectMultiple: false, selectOptions:  [{ code: '1', name: "优秀案例提报" }], changeValue:"", label: "活动类型", width: "250",slot:'activityType' },
        { filterType: "dateRange", paramValue: "createTime", changeValue:"", sortTypeVal: "sortDefault", label: "创建时间", prop: "createTime", width: "250", tooltip: true },
        { filterType: "selection", paramValue: "status", selectMultiple: false, selectOptions:  [{ code: '0', name: "已下线" },{ code: '1', name: "已上线" }], changeValue:"", label: "状态", slot: "status", width: "200" },
        { label: "操作", slot: "operation" },
      ],
      createTime:'',
      queryParams:{
        activityName:'',
        activityType:'1',
        status:'',
        startTime:'',
        endTime:'',
        sort:1
      },
      totalNumber:0,
      current:1,
      size:10,
      tableData:[],
      drawerVisible:false,
      typeList:[
        {
          value:1,
          label:'优秀案例提报'
        }
      ],
      addForm:{
        activityName:'',
        activityType:1,
        activityDesc:'',
        status:1
      },
      addRules:{
        activityName:[
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        activityType:[
          {required: true, message: '请选择活动类型', trigger: 'change'}
        ],
        activityDesc:[
          {required: true, message: '请输入活动简介', trigger: 'blur'}
        ],
        status:[
          {required: true, message: '请选择状态', trigger: 'change'}
        ]
      },
    }
  },
  mounted () {
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  created () {
    this.getTableData()
  },
  methods:{
    getTableData(){
      const params = this.queryParams
      delete params.createTime
      params.current = this.current
      params.size = this.size
      this.requestMethodGet('/emEcActivity/page',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data.list || []
          this.tableData = data
          this.totalNumber = res.data.data.totalCount
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 226
    },
    // 搜索值改变
    tableTitleSearch(obj){
      console.log('obj',obj)
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue == 'status'){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'createTime'){
        if(searchVal){
          this.queryParams.startTime = searchVal[0]
          this.queryParams.endTime = searchVal[1]
        }else{
          this.queryParams.startTime = ""
          this.queryParams.endTime = ""
        }
      }
      this.current = 1
      this.getTableData()
    },
    // 排序
    changeSortTable(obj){
      console.log('sort',obj)
      let sortVal = obj.sortTypeVal
      let key = obj.paramValue
      if(sortVal=='sortUp'){
        this.queryParams.sort = 1
      }else if(sortVal=='sortDown'){
        this.queryParams.sort = 2
      }
      this.current = 1
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal&&(item.paramValue == key)){
          item.sortTypeVal = sortVal
        }else if(item.sortTypeVal&&(item.paramValue != key)){
          item.sortTypeVal = 'sortDefault'
        }
      })
      this.getTableData()
    },
    handleSizeChange(val){
      this.size = val
      this.getTableData()
    },
    pagenationCurrent(val){
      this.current = val
      this.getTableData()
    },
    // 新建
    addActivity(){
      this.addForm.activityName = ''
      this.addForm.activityType = 1
      this.addForm.activityDesc = ''
      this.addForm.status = 1
      if(this.addForm.id){
        delete this.addForm.id
      }
      this.drawerVisible = true
    },
    // 关闭弹框
    handleCloseDraw(formName){
      this.resetForm(formName)
      this.drawerVisible = false
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
      this.drawerVisible = false;
    },
    saveForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addForm.activityDesc = this.addForm.activityDesc.trim()
          let url = this.addForm.id ? '/emEcActivity/update' : '/emEcActivity/add'
          this.requestMethodPost(url,this.addForm).then(res=>{
            if(res.data.code == 1000){
              this.$message.success('保存成功')
              this.resetForm(formName)
              this.getTableData()
            }else{
              this.$message({
                  message: res.data.msg,
                  type: "error"
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    // 编辑
    editRow(row){
      this.addForm.activityName = row.activityName
      this.addForm.activityType = row.activityType
      this.addForm.activityDesc = row.activityDesc
      this.addForm.status = row.status
      this.addForm.id = row.id
      this.drawerVisible = true
    },
    // 上线
    onLine(row){
      const params = {
        id:row.id,
        status:1
      }
      this.requestMethodPost('/emEcActivity/update',params).then(res=>{
        if(res.data.code == 1000){
          this.$message.success('上线成功')
          this.getTableData()
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 下线
    outLine(row){
      const params = {
        id:row.id,
        status:0
      }
      this.requestMethodPost('/emEcActivity/update',params).then(res=>{
        if(res.data.code == 1000){
          this.$message.success('下线成功')
          this.getTableData()
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 删除
    deleteRow(row){
      this.$confirm('确认删除该案例？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.requestMethodGet('/emEcActivity/deleteById',{id:row.id}).then(res=>{
          if(res.data.code == 1000){
            this.$message.success('删除成功')
            this.getTableData()
          }else{
            this.$message({
                message: res.data.msg,
                type: "error"
            });
          }
        })
      }).catch(() => {
                  
      });
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  
}
</script>
<style lang='less' scoped>
@import "../../assets/css/customTable.less";
.component-activity {
  width: calc(100% - 40px);
  margin: 0 auto;
  height: 100%;
  overflow: auto;
}
.draw-contnet{
  padding: 0 20px;
}
</style>
