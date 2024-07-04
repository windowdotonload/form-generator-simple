<template>
  <div class="portable-tester">
    <div class="toolbox-con flexEnd">
      <el-button type="danger" size="small" v-if="userInfo.userType == '1' || userInfo.userType == '0'" v-has="bianxieAdddevice" @click="handleAdd('instrument')" style="margin-bottom:12px;"
        >新增仪器</el-button
      >
      <el-button
        type="danger"
        size="small"
        v-if="userInfo.userType == '1' || userInfo.userType == '0'"
        v-has="bianxieAdddevice_SP_Create"
        @click="handleAdd('dealerInstrument')"
        style="margin-bottom:12px;"
        >新增经销商仪器</el-button
      >
    </div>
    <custom-table :tableHeader="tableDataHeader" :tableData="instrumentTableData" :tableHeight="tableHeight + ''" :loading="loading">
      <template v-slot:remarks="slotProps">
        <el-table-column
          label="备注"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.remarks || "--" }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <span
            v-if="(userInfo.userType == '1' && userInfo.orgInfo.companyId == scope.row.companyId) || userInfo.userType == '0'"
            v-has="bianxieEdit"
            @click="handleEdit(scope.row)"
            style="margin-right: 10px; color: #001450; cursor: pointer"
            >编辑</span
          >
          <span @click="handleDetail(scope.row)" v-has="bianxieValues" style="margin-right: 10px; color: #001450; cursor: pointer">测量值查看</span>
          <span
            @click="handleDelete(scope.row)"
            v-if="(userInfo.userType == '1' && userInfo.orgInfo.companyId == scope.row.companyId) || userInfo.userType == '0'"
            v-has="bianxieDelete"
            style="margin-right: 10px; color: #001450; cursor: pointer"
            >删除</span
          >
        </template>
      </el-table-column>
    </custom-table>
    <!-- 已删除的设备 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[5, 10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      class="listOptimizePage"
    ></el-pagination>

    <!-- 编辑归属人 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :show-close="false" width="850px" :close-on-click-modal="false">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" label-position="right" class="demo-dynamic" inline>
        <el-row>
          <el-form-item label="仪器类型" prop="portableType" disabled :rules="rules.portableType">
            <el-input v-model="dynamicValidateForm.portableType" disabled size="small" style="width: 320px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="portableNumber" :rules="rules.portableNumber">
            <span slot="label">
              <span class="no-wrap"
                >仪器编号
                <el-tooltip class="item" effect="dark" content="仪器编号：便携式验油箱唯一标识，见设备铭牌" placement="top-start">
                  <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                    <i class="el-icon-warning-outline"></i>
                  </el-button>
                </el-tooltip>
              </span>
            </span>

            <el-input v-model="dynamicValidateForm.portableNumber" placeholder="请仔细核对后输入，编号错误将无法查询测量值" maxlength="32" size="small" style="width: 320px;"></el-input>
          </el-form-item>
        </el-row>

        <el-form-item label="所属单位" prop="companyId" :rules="rules.companyId">
          <el-select
            size="small"
            remote
            filterable
            :disabled="disabledCompany || addType == 'instrument'"
            v-model="dynamicValidateForm.companyId"
            reserve-keywords
            style="width: 320px;"
            @change="changeCompany"
            placeholder="请选择"
          >
            <el-option v-for="item in companyList" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="userInfo.userType == '0' && (selectCompanyType == '0' || !selectCompanyType)">
          <el-row v-for="(item, i) in dynamicValidateForm.list" :key="i">
            <el-form-item :label="`使用人${i + 1}`" :prop="'list.' + i + '.companyType'" :rules="{ required: true, message: '请选择身份', trigger: 'change' }">
              <el-select size="small" v-model="item.companyType" style="width: 150px" placeholder="请选择身份" @change="companyTypeChange(item.companyType, i)">
                <el-option label="美孚" value="0"></el-option>
                <el-option label="经销商" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :prop="'list.' + i + '.companyNumber'" :rules="rules.companyNumber">
              <el-select
                size="small"
                remote
                filterable
                v-model="item.companyNumber"
                reserve-keywords
                style="width: 320px;"
                placeholder="请输入公司名称"
                :loading="companyIsloading"
                @blur="handlerBlur(i, 'companyNumber', item)"
                @change="companyChange(item.companyNumber, i, item)"
              >
                <el-option v-for="row in item.customerList" :key="row.companyNumber" :label="row.companyName" :value="row.companyNumber"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :prop="'list.' + i + '.userId'" :rules="rules.userId">
              <el-select
                size="small"
                v-model="item.userId"
                remote
                filterable
                reserve-keywords
                style="width: 150px"
                placeholder="请选择使用人"
                :loading="isloading"
                @blur="handlerBlur(i, 'userId', item)"
              >
                <el-option v-for="row in item.roleList" :key="row.userId" :label="row.userName" :value="row.userId"></el-option>
              </el-select>
            </el-form-item>
            <el-popconfirm title="是否删除该使用人？" icon="el-icon-info" icon-color="red" @confirm="removeDomain(i)">
              <span slot="reference" v-show="dynamicValidateForm.list.length > 1" style="margin-left: 20px; color: red; border: 0; cursor: pointer;line-height: 32px;">删除</span>
            </el-popconfirm>
          </el-row>
          <el-row style="margin-bottom:20px;">
            <span @click="addDomain" v-if="dynamicValidateForm.list.length < 5" style="color: rgba(2, 167, 240, 1); cursor: pointer;">+添加使用人</span>
            <span style="font-size:13px;color: #f9ad5e;margin-left: 20px;">一台便携仪器至少有1名归属人，最多拥有5名</span>
          </el-row>
        </div>
        <div v-if="userInfo.userType == '1' || selectCompanyType != '0'">
          <el-form-item label="使用人" prop="userList" :rules="rules.userList">
            <el-select size="small" remote filterable multiple multiple-limit="5" collapse-tags v-model="dynamicValidateForm.userList" reserve-keywords style="width: 320px;" placeholder="请选择">
              <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-row>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="dynamicValidateForm.remarks" maxlength="50" show-word-limit resize="none" style="width: 320px;"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button plain @click="handleCancle" size="small">取消</el-button>
        <el-button type="danger" @click="submitForm" size="small">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
export default {
  components: {
    "custom-table": customTable
  },
  data() {
    const valiDuplicate = (rule, value, callback) => {
      this.requestMethodGet("/portable/device/checkPortableNumber", { portableNumber: value, id: this.portableId })
        .then(res => {
          res = res.data;
          this.companyIsloading = false;
          if (res.code == 1000) {
            if (!res.data) {
              if (value) {
                callback(new Error("该仪器编号已存在，请核对后输入"));
              }
            } else {
              callback();
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    };
    return {
      addType: "",
      editType: "",
      iotId: "",
      portableId: "",
      rules: {
        companyNumber: [{ required: true, message: "请选择公司", trigger: "change" }],
        portableType: [{ required: true, message: "请输入仪器类型", trigger: "blur" }],
        portableNumber: [
          { required: true, message: "请输入仪器编号", trigger: "blur" },
          { validator: valiDuplicate, trigger: "blur" },
          { pattern: /^[A-Za-z0-9]{1,32}$/, message: "请正确输入仪器编号", trigger: "change" }
        ],
        userId: [{ required: true, message: "请选择使用人", trigger: "change" }],
        userList: [{ required: true, message: "请选择使用人", trigger: "change" }],
        companyId: [{ required: true, message: "请选择所属单位", trigger: "change" }]
      },
      userData: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      dynamicValidateForm: {
        portableType: "Portable-testing-kit",
        portableNumber: "",
        remarks: "",
        companyId: "",
        userList: [],
        list: [
          {
            companyType: "",
            companyNumber: "",
            userId: "",
            roleList: [],
            customerList: []
          }
        ]
      },
      companyList: [], // 所属单位的数据
      disabledCompany: false, // 所属单位是否可以编辑
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      pagenation: {
        current: 1,
        size: 30
      },
      totalNumber: 0, //总条数
      userPortableuNumber: "",
      instrumentTableData: [], //列表数据
      dialogFormVisible: false, //新增框
      dialogTitle: "",
      loading: false, //是否加载

      isloading: false, //远程搜索loading
      companyIsloading: false,
      selectCompanyType: "",
      result: false,
      userListData: [],
      tableHeight: null,
      tableDataHeader: [
        { label: "仪器类型", prop: "portableType", width: "150", tooltip: true },
        { label: "仪器编号", prop: "portableNumber", width: "150", tooltip: true },
        { label: "所属单位", prop: "companyName", width: "200", tooltip: true },
        { label: "使用人", prop: "users", width: "150", tooltip: true },
        { label: "备注", slot: "remarks", width: "200" },
        { label: "操作", slot: "operation" }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getList();
    this.getTableHeight();
    window.addEventListener("resize", () => {
      this.getTableHeight();
    });
  },
  methods: {
    // 删除便携仪器
    handleDelete(row) {
      this.$confirm("是否删除该仪器？删除后仪器使用人员将无法查看测量数据。", "删除仪器", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          let params = {
            portableNumber: row.portableNumber,
            id: row.id
          };
          this.requestMethodPost("/portable/device/delete", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$gio.deletePortableTester({
                  operation: "弹窗中点击完成"
                });
                this.getList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(err => {});
    },
    // 查看测量值
    handleDetail(row) {
      this.$router.push({
        path: "/PortableTester/OilTestDataDetail",
        query: {
          portableNumber: row.portableNumber,
          companyName: row.companyName,
          portableType: row.portableType,
          users: row.users
        }
      });
      this.$gio.viewOilData();
      this.$gio.toOilDataPage();
    },
    // 所属公司下拉选值
    changeCompany(val) {
      console.log(val, this.companyList);
      let obj = {};
      obj = this.companyList.find(item => {
        //model就是上面的数据源
        return item.id === val; //筛选出匹配数据
      });

      this.selectCompanyType = obj.spType;
      if (this.selectCompanyType != "0") {
        this.$_queryRoleData(obj.id);
        this.$set(this.dynamicValidateForm, "userList", []);
      }
    },
    // 人员
    $_queryRoleData(val, idx) {
      this.companyIsloading = true;
      let params = {
        orgId: val,
        size: 500
      };
      this.requestMethodGet("/web/system/permission/orgSysUserManagae/userListOfOrg", params)
        .then(res => {
          res = res.data;
          this.companyIsloading = false;
          if (res.code == 1000) {
            if (this.userInfo.userType == "0" && this.selectCompanyType == "0") {
              this.$set(this.dynamicValidateForm.list[idx], "roleList", res.data.list);
            }
            if (this.userInfo.userType == "1" || (this.userInfo.userType == "0" && this.selectCompanyType != "0")) {
              this.userData = res.data.list;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.companyIsloading = false;
        });
    },
    // 公司
    companyChange(val, idx, item) {
      console.log(val, item);
      this.dynamicValidateForm.list[idx].userId = "";
      this.dynamicValidateForm.list[idx].roleList = [];
      let selectData = item.customerList.filter(it => it.companyNumber == val);
      console.log(selectData);
      this.$_queryRoleData(selectData[0].id, idx);
      this.$refs.dynamicValidateForm.validateField("list." + idx + `.userId`, valid => {});
    },
    // 改变身份
    companyTypeChange(val, idx) {
      this.dynamicValidateForm.list[idx].companyNumber = "";
      this.dynamicValidateForm.list[idx].userId = "";
      this.dynamicValidateForm.list[idx].roleList = [];
      this.dynamicValidateForm.list[idx].customerList = [];
      this.$refs.dynamicValidateForm.validateField("list." + idx + `.companyNumber`, valid => {});
      this.getCompanyDropdownList(val, idx);
    },
    //   所属单位数据查询
    getCompanyList(val) {
      if (JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType == 1) {
        return;
      }
      let params = {
        areaCode: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).areaCode,
        size: 300,
        spType: 1
      };
      params.menuCode = "DealerProfile";
      this.requestMethodPostTip("/web/company/filterSp", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.companyList = res.data.list;
            let res1 = this.companyList.find(v => v.id == this.dynamicValidateForm.companyId);
            this.selectCompanyType = res1.spType;
            this.result = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getCompanyDropdownList(val, idx, type) {
      let params = {
        areaCode: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).areaCode,
        size: 300,
        spType: val
      };
      this.requestMethodPostTip("/web/company/filterSp", params)
        .then(res => {
          res = res.data;
          console.log(res);
          if (res.code == 1000) {
            this.$set(this.dynamicValidateForm.list[idx], "customerList", res.data.list);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询便携仪器列表
    getList() {
      this.loading = true;
      this.requestMethodGet("/portable/device/selectPortableInstrumentList", { ...this.pagenation, menuCode: "PortableTester" })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.instrumentTableData = res.data.data.list;
            this.totalNumber = res.data.data.totalCount;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 校验
    handlerBlur(i, name, item) {
      if (name == "companyNumber" && !item.companyType) {
        this.rules.companyNumber[0].message = "请先选择身份";
      }
      if (name == "userId" && !item.companyNumber) {
        this.rules.userId[0].message = "请先选择公司";
      }
      this.$refs.dynamicValidateForm.validateField("list." + i + `.${name}`, valid => {});
      this.rules.companyNumber[0].message = "请选择公司";
      this.rules.userId[0].message = "请选择使用人";
    },
    //  提交
    submitForm() {
      console.log(this.dynamicValidateForm);
      this.$refs["dynamicValidateForm"].validate(valid => {
        if (valid) {
          console.log(this.dynamicValidateForm);
          let userList = [];
          this.dynamicValidateForm.list.map(item => {
            userList.push(item.userId);
          });
          let params = {
            companyId: this.dynamicValidateForm.companyId,
            portableNumber: this.dynamicValidateForm.portableNumber,
            portableType: this.dynamicValidateForm.portableType,
            remarks: this.dynamicValidateForm.remarks
          };
          if (this.userInfo.userType == "0" && this.selectCompanyType == "0") {
            params.userList = userList;
          }
          console.log(this.dynamicValidateForm.userList, "使用人");
          if (this.userInfo.userType == "1" || this.selectCompanyType != "0") {
            params.userList = this.dynamicValidateForm.userList;
          }
          if (this.editType != "add") {
            params.id = this.portableId;
            params.userPortableuNumber = this.userPortableuNumber;
          }
          console.log(params);
          this.requestMethodPost("/portable/device/savePortableInstrument", params)
            .then(res => {
              if (res.data.code == 1000) {
                if (this.editType == "add") {
                  this.$message({
                    message: "新增仪器成功",
                    type: "success"
                  });
                  this.$gio.addPortableTester({
                    operation: "弹框中点击确定"
                  });
                } else {
                  this.$message({
                    message: "修改仪器成功",
                    type: "success"
                  });
                  this.$gio.editPortableTester();
                }

                this.getList();
                this.dialogFormVisible = false;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      });
    },
    // 删除
    removeDomain(index) {
      this.dynamicValidateForm.list.splice(index, 1);
    },
    // 添加
    addDomain() {
      this.dynamicValidateForm.list.push({
        companyType: "",
        companyNumber: "",
        userId: "",
        roleList: [],
        customerList: []
      });
    },
    getUserDetail(val) {
      let params = {
        portableNumber: val
      };
      this.requestMethodGet("/portable/device/getPortableOwnerListByIotId", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.userListData = res.data.data;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 编辑
    handleEdit(row) {
      this.portableId = row.id;
      this.dialogTitle = "编辑仪器";
      this.editType = "edit";
      this.$gio.editPortableTester();
      // this.dynamicValidateForm=row
      this.getUserDetail(row.portableNumber);
      this.$set(this.dynamicValidateForm, "portableNumber", row.portableNumber);
      this.$set(this.dynamicValidateForm, "portableType", row.portableType);
      this.$set(this.dynamicValidateForm, "remarks", row.remarks);
      this.$set(this.dynamicValidateForm, "companyId", row.companyId);
      this.$set(this.dynamicValidateForm, "users", row.users);
      this.$set(this.dynamicValidateForm, "list", this.userListData);
      this.userPortableuNumber = row.portableNumber;
      if (this.userInfo.userType == "1") {
        this.disabledCompany = true; // 所属公司不可选择
        this.selectCompanyType = 1;
        this.companyList = [
          {
            id: this.userInfo.orgInfo.companyId,
            companyName: this.userInfo.orgInfo.companyName
          }
        ];
      }
      if (row.companyType == 0) {
        this.disabledCompany = true;
        this.companyList = [
          {
            id: row.companyId,
            companyNumber: row.companyNumber,
            companyName: row.companyName
          }
        ];
        this.dynamicValidateForm.companyId = row.companyId;
      } else {
        this.getCompanyList();
      }
      setTimeout(() => {
        if (this.selectCompanyType == "0") {
          this.dynamicValidateForm.list = this.userListData.map((item, index) => {
            console.log(item);
            this.getCompanyDropdownList(item.userType, index, "edit");
            this.$_queryRoleData(item.orgId, index);
            return {
              companyType: item.userType,
              companyNumber: item.companyNumber,
              userId: item.userId,
              roleList: [],
              customerList: []
            };
          });
        } else {
          let userData = [];
          this.$_queryRoleData(row.companyId);
          if (this.userListData.length > 0) {
            this.userListData.map((item1, index) => {
              console.log(item1);
              userData.push(item1.userId);
            });
            console.log(userData);
          }

          this.$set(this.dynamicValidateForm, "userList", userData);
        }
      }, 1000);

      this.dialogFormVisible = true;

      if (this.$refs["dynamicValidateForm"]) {
        this.$refs["dynamicValidateForm"].clearValidate();
      }
    },
    // 新建仪器
    handleAdd(type) {
      this.addType = type;
      this.$gio.addPortableTester({
        operation: "点击新增仪器按钮"
      });
      // this.iotId = row.iotId;
      this.dialogTitle = "新增仪器";
      if (this.addType == "dealerInstrument") {
        this.dialogTitle = "新增经销商仪器";
      }
      this.portableId = "";
      this.editType = "add";
      this.dialogFormVisible = true;
      this.dynamicValidateForm = {
        portableType: "Portable-testing-kit",
        portableNumber: "",
        remarks: "",
        companyId: "",
        userList: [],
        list: [
          {
            companyType: "",
            companyNumber: "",
            userId: "",
            roleList: [],
            customerList: []
          }
        ]
      };
      if (this.addType == "instrument") {
        this.companyList = [
          {
            id: this.userInfo.orgInfo.companyId,
            companyNumber: this.userInfo.orgInfo.companyNumber,
            companyName: this.userInfo.orgInfo.companyName
          }
        ];
        this.dynamicValidateForm.companyId = this.$userInfo.orgInfo.companyId;
      } else {
        this.getCompanyList();
      }
      if (this.$refs["dynamicValidateForm"]) {
        this.$refs["dynamicValidateForm"].clearValidate();
      }
      // 如果操作人是经销商，所属公司不可编辑，值默认为该经销商
      if (this.userInfo.userType == "1") {
        this.disabledCompany = true; // 所属公司不可选择
        this.dynamicValidateForm.companyId = this.userInfo.orgInfo.companyId;
        this.selectCompanyType = 1;
      }
      // 如果操作人是经销商，所属公司不可编辑，值默认为该经销商
      if (this.userInfo.userType == "0") {
        this.disabledCompany = false; // 所属公司不可选择
        this.selectCompanyType = 0;
      }
      // 如果是经销商登录，调取经销商公司的人员数据
      if (this.userInfo.userType == "1") {
        this.$_queryRoleData(this.userInfo.orgInfo.companyId);
        this.companyList = [
          {
            id: this.userInfo.orgInfo.companyId,
            companyName: this.userInfo.orgInfo.companyName
          }
        ];
      }
    },
    // 取消
    handleCancle() {
      this.dialogFormVisible = false;
    },
    //current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.getList();
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.getList();
    },
    getTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 230;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight();
    });
  }
};
</script>
<style lang="less">
@import "../../assets/css/customTable.less";
.portable-tester {
  padding: 0 20px 0 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 30px;
  }
  .demo-dynamic .el-form-item__label {
    float: left;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(254, 0, 12, 1) !important;
    border-color: rgba(254, 0, 12, 1) !important;
  }
  .el-radio-button__inner:hover {
    color: rgba(254, 0, 12, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
    color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  .el-form-item__content {
    display: flex;
  }
}
.portable-tester .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>
