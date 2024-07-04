<template>
  <div class="login-configure">
    <div style="margin-top:20px;">
      <h3>登录页信息配置</h3>
      <el-table
        ref="multipleTable"
        :key="key"
        stripe
        :data="loginBgTableData"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#f7f7f7'}"
      >
        <el-table-column prop="name" label="背景图" min-width="82%" >
          <template slot-scope="scope">
            <div style="max-width: 240px;max-height: 240px;border-radius:5px;overflow:hidden">
              <el-image :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" fit="contain" style="border-radius: 5px;margin-top: -50%;"></el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="18%" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link
              type="danger"
              v-has="loginEditBtn"
              style="margin-right:0"
              @click="editServiesConfiger('loginBg',scope.row)"
            >编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display:flex;justify-content:space-between;">
      <h3>Banner区信息配置</h3>
      <div style="text-align:right;margin:10px 0;">
        <el-button size="small" type="danger" @click="editServiesConfiger('add','')" v-has="loginSaveBtn">新建</el-button>
      </div>
    </div>
    <div style="overflow:auto;margin-bottom:80px">
      <el-table
      ref="multipleTable"
      :key="key"
      row-key="id"
      stripe
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      :max-height="450"
      style="width: 100%;margin-bottom:50px;"
      :header-cell-style="{background:'#f7f7f7'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="imgPath" label="图片" min-width="8%" >
        <template slot-scope="scope">
          <img :src="scope.row.imgPath" style="width:150px;max-height:200px;border-radius:5px;" />
          <!-- <div class="mask" v-if="scope.row.status==0">
            <i class="el-icon-remove-outline" style="color:#F56C6C"></i>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="14%" show-overflow-tooltip>
        <template slot-scope="scope">
          <div :class="scope.row.status==0?'colccc':''">{{scope.row.title}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="seq" label="位置" min-width="8%" show-overflow-tooltip>
        <template slot="header">
          <div>位置
            <el-tooltip class="item" effect="dark" content="位置1~5，顺序分别对应小程序banner区从左到右的5个位置" placement="top-start">
              <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                <i class="el-icon-warning-outline"></i>
              </el-button>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <div :class="scope.row.status==0?'colccc':''">{{scope.row.status==0?'-':'位置'+scope.row.seq}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="12%"  show-overflow-tooltip>
        <template slot-scope="scope">
          <div :class="scope.row.status==0?'colccc':''">{{scope.row.createTime}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="8%" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="updateBanner(scope.row)"
            v-model="scope.row.status"
            v-has="loginSwichBtn"
            active-color="#ff4949"
            inactive-color="#ccc"
            :active-value="1"
            :inactive-value="0"
            active-text="开"
            inactive-text="关"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="12%" align="center">
        <template slot-scope="scope">
          <el-link
            type="danger"
            v-has="loginEditBtn"
            @click="editServiesConfiger('edit',scope.row)"
          >编辑</el-link><em v-has="loginEditBtn">|</em>
          <el-link
            :type="scope.row.status==0||scope.row.sort==totalNumber?'info':'danger'"
            v-has="loginMoveBtn"
            @click="moveBanner(scope.row.id,1)"
          >&nbsp;上移</el-link><em>|</em>
          <el-link
            :type="scope.row.status==0||scope.row.sort==1?'info':'danger'"
            v-has="loginMoveBtn"
            @click="moveBanner(scope.row.id,2)"
          >&nbsp;下移</el-link>
        </template>
      </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, prev, pager, next, jumper"
        :total="totalNumber"
        style="float: right; display: flex; margin-top: 10px;position:relative;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      //  分页参数
      pagenation: {
        current: 1,
        size: 5
      },
      totalNumber: 0, // 总条数
      mainminheight: `height:${document.documentElement.clientHeight - 100}px`,
      hidden: true,
      loading: false,
      saveStatus: false,
      videoTableData: [],
      loginBgTableData: [],
      tableData: []
    }
  },
  computed: {},
  methods: {
    handleCurrentChange (current) {
      this.pagenation.current = current
      this.getSearchTableData()
    },
    handleSizeChange (size) {
      this.pagenation.size = size
      this.pagenation.current = 1
      this.getSearchTableData()
    },
    editServiesConfiger (val, row) {
      if (val == 'add') {
        this.$router.push({
          path: '/LoginConfigure/AddLoginConfigure', // 跳转的路径
        })
      } else if (val == 'edit') {
        this.$router.push({
          path: '/LoginConfigure/AddLoginConfigure', // 跳转的路径
          query: {
            bannerId:row.id,
            rowData: row
          }
        })
      } else if (val == 'loginBg') {
        this.$router.push({
          // 核心语句
          path: '/LoginConfigure/EditLoginBackground', // 跳转的路径
          query: {
            newsNumber: row.newsNumber
          }
        })
      }
    },
    getLoginBgData (val) {
      let param = {
        newsType: val
      }
      this.loading = true
      this.requestMethodGet('/web/composite/newsList', param)
        .then(res => {
          this.loading = false
          if (res.data.code == 1000) {
            if (val == 4) {
              this.loginBgTableData = res.data.data
            }
          }
        })
        .catch(res => {
          this.loading = false
        })
    },
    getSearchTableData () {
      let position = 0
      let param = {
        size: this.pagenation.size,
        current: this.pagenation.current
      }
      this.loading = true
      this.requestMethodGet('/conf/loginPage/getBannerConfList', param)
        .then(res => {
          if (res.data.code == 1000) {
            this.totalNumber = res.data.data.totalCount
            position = res.data.data.position
            this.tableData = res.data.data.list
            if(this.tableData.length==0){
              this.loading = false
              return
            }
            this.tableData.forEach((item,index)=>{
              if(item.status==1){
                item.seq=position+1
                position = position+1
              }
            this.getFullUrl(item,index)
            })
          }else{
            this.loading = false
          }
        })
        .catch(res => {
            this.loading = false
        })
    },
    // 获取图片全路径
    getFullUrl(item,index) {
      this.requestMethodGet("/web/file/getFullUrl", {url: item.imgPath}).then((res) => {
        if (res.data.code == 1000) {
          this.tableData[index].imgPath = res.data.data;
          if(index==4||index==(this.totalNumber%5)-1){
            this.loading = false
          }
        } else {
          this.loading = false
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    gethidden () {
      this.tableHeadColumn = this.tableHeadColumnAll
      this.key = this.key + 1 // 为了保证table 每次都会重渲,表格不跳动
    },
    updateBanner (row) {
      this.requestMethodPost('/conf/loginPage/editBanner', {id:row.id,status:row.status}).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getSearchTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
            row.status = row.status==0?1:0
          }
      }).catch(() => {})
    },
    moveBanner (id,action) {
      this.requestMethodPost('/conf/loginPage/moveBanner', {id:id, action: action}).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getSearchTableData()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    // 移动后保存数据
    saveData (val) {
      let newParamList = []
      let newSort = 1
      if (val == 'video') {
        newParamList.push({
          newsNumber: this.videoTableData[0].newsNumber,
          status: this.videoTableData[0].status,
          seq: newSort
        })
      } else {
        this.tableData.forEach((item, index) => {
          newParamList.push({
            newsNumber: item.newsNumber,
            status: item.status,
            seq: newSort + index
          })
        })
      }

      this.requestMethodPost(
        '/web/composite/newsUpdateStatus',
        newParamList
      ).then(res => {
        if (res.data.code == 1000) {
          if (val == 'video') {
            this.$message({
              type: 'success',
              message: '视频状态修改成功'
            })
          } else {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.saveStatus = false
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        100}px`
    }
  },
  mounted () {
    this.getLoginBgData(4)
    setTimeout(()=>{
      this.getSearchTableData()
    },1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.login-configure {
  height: 100%;
  overflow: auto;
  padding: 0px 10px;
  .el-link {
    margin-right: 10px;
  }
  .el-switch__label.is-active {
    color: red;
  }
  .colccc {
    color: #999;
    font-size: 14px;
    font-weight: 400;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 40px;
    line-height: 70px;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
