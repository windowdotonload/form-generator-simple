import { generateUniqueUUID, createDialog } from "./util";
import OSSUploadCombine from "../../../../generalComponents/OSSUpload/index.vue";
import { getOilCascadeMenu } from "../../api/index.js";
import { cloneDeep, set } from "lodash";
const { ref } = VueCompositionAPI;
const AddOil = () => {
  return new Promise(res => {
    import("../../../equipment/components/addOilInner.vue").then(module => {
      res(module.default);
    });
  });
};

const checkFieldItemInPropertyPanel = vm => {
  if (vm.$parent.$options._COMPONENTTYPE && vm.$parent.$options._COMPONENTTYPE === "PROPERTY" && vm.$parent.activeField) return true;
  return false;
};

const revertFieldItemEditValue = (vm, revertFieldKey, reverValueKey, directAssign = false) => {
  if (checkFieldItemInPropertyPanel(vm) && vm.$parent.activeField._configField[reverValueKey] != undefined) {
    if (directAssign) return (vm[revertFieldKey] = vm.$parent.activeField._configField[reverValueKey]);
    vm.formModel[revertFieldKey] = vm.$parent.activeField._configField[reverValueKey];
  }
};

Vue._$extend = function(extendOptions, mergeOptions = {}) {
  const options = Object.assign({}, extendOptions, mergeOptions);
  return Vue.extend(options);
};
const useState = (val = "") => {
  return {
    data() {
      return {
        formModel: {
          value: val
        }
      };
    },
    methods: {
      setInputValue(e) {
        this.formModel.value = e;
        this.$emit("setVal", this.formModel.value);
        this.$emit("changeValue", this.formModel.value);
      }
    }
  };
};

const useCommonMixin = () => {
  return {
    created() {
      this.$emit("initFieldInfo", this);
    },
    methods: {
      validate() {
        return new Promise(res => {
          if (!this.$refs["formRef"]) return res(true);
          this.$refs["formRef"].validate(valid => {
            res(valid);
          });
        });
      },
      getAssignValue() {
        return this.formModel.value;
      }
    }
  };
};

const useExtendConfig = (config = {}) => {
  return {
    props: {
      hideFieldName: {
        type: Boolean,
        default: false
      },
      fieldName: {
        type: String,
        default: "字段名称"
      },
      fieldRules: {
        type: Array,
        default: []
      },
      placeholder: {
        type: String,
        default: "请输入"
      },
      maxlength: {
        type: Number,
        default: 8
      },
      reverPropertyPanelValueKey: {
        type: String,
        default: ""
      },
      disabled: {
        type: Boolean,
        default: false
      },
      marginBottom: {
        type: String,
        default: ""
      },
      ...config
    }
  };
};

export const Input = Vue._$extend(
  {
    name: "Input",
    mixins: [useState(this.defaultValue), useCommonMixin()],
    created() {
      this.initDefaultValue();
    },
    methods: {
      initDefaultValue() {
        this.formModel.value = this.defaultValue;
        revertFieldItemEditValue(this, "value", this.reverPropertyPanelValueKey);
      },
      resetInputValue(val = "") {
        this.formModel.value = val;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" ref="formRef">
          <el-form-item label={this.hideFieldName ? "" : this.fieldName} rules={this.fieldRules} prop="value" style={{ marginBottom: this.marginBottom }}>
            <el-input
              disabled={this.disabled}
              type={this.multiLine ? "textarea" : "text"}
              maxlength={this.maxlength}
              value={this.formModel.value}
              placeholder={this.placeholder}
              size="mini"
              onInput={this.setInputValue}
            />
          </el-form-item>
        </el-form>
      );
    }
  },
  { ...useExtendConfig({ defaultValue: { type: String, default: "" }, multiLine: { type: Boolean, default: false } }) }
);

export const SwitchH = Vue._$extend(
  {
    mixins: [useState(false), useCommonMixin()],
    created() {
      this.initDefaultValue();
    },
    methods: {
      initDefaultValue() {
        this.formModel.value = this.defaultValue;
        revertFieldItemEditValue(this, "value", this.reverPropertyPanelValueKey);
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" ref="formRef">
          <el-form-item label={this.fieldName} rules={this.fieldRules}>
            <el-switch disabled={this.disabled} value={this.formModel.value} onChange={this.setInputValue} />
            <span style={{ marginLeft: "10px" }}>{this.formModel.value ? this.pText : this.nText}</span>
          </el-form-item>
        </el-form>
      );
    }
  },
  { ...useExtendConfig({ defaultValue: { type: String, default: "" }, pText: { type: String, default: "" }, nText: { type: String, default: "" } }) }
);

export const SelectOptions = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          selectOptions: [{ value: "选项1", label: "选项1", key: generateUniqueUUID() }, { value: "选项2", label: "选项2", key: generateUniqueUUID() }]
        },
        moveBtnStyle: {
          fontSize: "12px",
          marginLeft: "5px",
          cursor: "pointer"
        }
      };
    },
    created() {
      this.initOptions();
      this.$emit("getOptions", this.formModel.selectOptions);
    },
    methods: {
      initOptions() {
        if (this.options && this.options.length) {
          this.formModel.selectOptions = this.options;
          this.formModel.selectOptions.forEach(item => {
            if (!item.label) item.label = item.value;
            if (!item.key) item.key = generateUniqueUUID();
          });
        }
      },
      setVal(e, item) {
        if (this.formModel.selectOptions.map(item => item.value).includes(e)) {
          return ELEMENT.Message({ message: "选项值不能重复", type: "warning" });
        }
        item.label = e;
        item.value = e;
        this.$emit("getOptions", this.formModel.selectOptions);
      },
      addOption() {
        if (this.formModel.selectOptions.length >= 10) {
          return ELEMENT.Message({
            message: "最多添加10条选项",
            type: "warning"
          });
        }
        this.formModel.selectOptions.push({ value: `选项${this.formModel.selectOptions.length + 1}`, label: `选项${this.formModel.selectOptions.length + 1}`, key: generateUniqueUUID() });
        this.$emit("getOptions", this.formModel.selectOptions);
      },
      removeOpt(removeTarget) {
        if (this.formModel.selectOptions.length <= 2) {
          return ELEMENT.Message({
            message: "最少保留两条选项",
            type: "warning"
          });
        }
        const index = this.formModel.selectOptions.findIndex(item => item.key === removeTarget.key);
        if (index > -1) {
          this.formModel.selectOptions.splice(index, 1);
        }
        this.$emit("getOptions", this.formModel.selectOptions);
      },
      sort(moveType, item) {
        //moveType 1 上移 2 下移
        const key = item.key;
        const index = this.formModel.selectOptions.findIndex(item => item.key === key);
        if (index < 0) return;
        const targetIndex = moveType === 1 ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > this.formModel.selectOptions.length - 1) return;
        const targetKey = this.formModel.selectOptions[targetIndex].key;
        const targetItem = this.formModel.selectOptions.find(item => item.key === targetKey);
        this.formModel.selectOptions.splice(index, 1, targetItem);
        this.formModel.selectOptions.splice(targetIndex, 1, item);
        this.$emit("getOptions", this.formModel.selectOptions);
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item rules={this.fieldRules} style={{ marginBottom: "8px" }}>
            <label v-slot="label">{this.fieldName}</label>
            <span style={{ color: "#999", fontSize: "13px" }}>（上限：10项）</span>
          </el-form-item>
          <transition-group name="animation-list">
            {this.formModel.selectOptions.map((item, index) => {
              return (
                <div key={item.key}>
                  <div style={{ width: "100%", display: "flex", flexWrap: "nowrap" }}>
                    <Input defaultValue={item.value} maxlength="30" hideFieldName placeholder={`选项${index + 1}`} onSetVal={e => this.setVal(e, item)} style={{ width: "66%" }} marginBottom="2%" />
                    <span style={{ ...this.moveBtnStyle, cursor: index == 0 ? "not-allowed" : "pointer", color: index == 0 ? "#B3B3B3" : "" }} onClick={() => this.sort(1, item)}>
                      上移
                    </span>
                    <span
                      style={{
                        ...this.moveBtnStyle,
                        cursor: index == this.formModel.selectOptions.length - 1 ? "not-allowed" : "pointer",
                        color: index == this.formModel.selectOptions.length - 1 ? "#B3B3B3" : ""
                      }}
                      onClick={() => this.sort(2, item)}
                    >
                      下移
                    </span>
                    <span style={{ ...this.moveBtnStyle, color: "#d10000" }} onClick={() => this.removeOpt(item)}>
                      删除
                    </span>
                  </div>
                </div>
              );
            })}
          </transition-group>
          <el-button type="text" style={{ color: "#808aa8", marginLeft: "5px" }} size="mini" onClick={this.addOption}>
            <i class="el-icon-plus" /> 添加
          </el-button>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      options: { type: Array, default: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }] }
    })
  }
);

export const SelectH = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    created() {
      this.initDefaultValue();
    },
    data() {
      return {
        formModel: { value: null }
      };
    },
    methods: {
      initDefaultValue() {
        if (Array.isArray(this.defaultValue)) {
          this.defaultValue = this.defaultValue.filter(_ => _);
        }
        this.formModel.value = this.defaultValue || null;
        if (this.multiDefault && typeof this.defaultValue == "string" && this.defaultValue) this.formModel.value = this.defaultValue.split(",").filter(_ => _);
      },
      changeValue(e) {
        this.formModel.value = e;
        this.$emit("changeValue", this.formModel.value);
      },
      setSelectHValue(val) {
        this.formModel.value = val;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" ref="formRef">
          <el-form-item rules={this.fieldRules} label={this.hideFieldName ? "" : this.fieldName} prop="value">
            <el-select
              disabled={this.disabled}
              value={this.formModel.value}
              placeholder="请选择"
              size="mini"
              style={{ width: "100%" }}
              onChange={this.changeValue}
              multiple={this.multiDefault}
              class="select-h"
            >
              {this.options
                .filter(item => item.value)
                .map(item => {
                  return <el-option key={item.value} label={item.label || item.value} value={item.value} />;
                })}
            </el-select>
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      options: { type: Array, default: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }] },
      multiDefault: { type: Boolean, default: false },
      defaultValue: { type: String, default: "" }
    })
  }
);

export const SelectRelOptForDefault = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    created() {
      this.initDefaultValue();
    },

    data() {
      return {
        defaultValue: "",
        options: []
      };
    },
    methods: {
      initDefaultValue() {
        if (this.defaultOptions) this.options = this.defaultOptions;
        this.defaultValue = this.defaultSelValue;
        revertFieldItemEditValue(this, "options", "options", true);
        revertFieldItemEditValue(this, "defaultValue", "default", true);
        if (this.multiDefault && typeof this.defaultValue == "string") this.defaultValue = this.defaultValue.split(",");
      },
      getOptions(options) {
        this.options = options.slice();
        this.handleDefaultValue(options);
        this.$emit("changeValue", { value: this.defaultValue, options: this.options.slice() });
      },
      handleDefaultValue(options) {
        if (!this.$refs.select_h) return;
        const optionsValue = options.map(item => item.value);
        const defaultValue = this.$refs.select_h.getAssignValue();
        if (Array.isArray(defaultValue)) {
          defaultValue.some(val => {
            if (!optionsValue.includes(val)) {
              defaultValue.splice(defaultValue.indexOf(val), 1);
              this.$refs.select_h.changeValue([...defaultValue]);
              return true;
            }
          });
          return;
        }
        if (defaultValue && !optionsValue.includes(defaultValue)) this.$refs.select_h.changeValue("");
      },
      changeValue(e) {
        this.defaultValue = e;
        this.$emit("changeValue", { value: e, options: this.options.slice() });
      }
    },
    render() {
      return (
        <div>
          <SelectOptions fieldName="选项" onGetOptions={this.getOptions} options={this.options} />
          <SelectH
            ref="select_h"
            fieldName="默认值"
            defaultValue={this.defaultValue}
            options={this.options}
            placeholder="不选择为无默认值"
            onChangeValue={this.changeValue}
            multiDefault={this.multiDefault}
          />
        </div>
      );
    }
  },
  {
    ...useExtendConfig({
      defaultOptions: { type: Array, default: null },
      defaultSelValue: { type: String, default: "" },
      multiDefault: {
        type: Boolean,
        default: false
      }
    })
  }
);

export const RadioH = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    created() {
      this.initDefaultValue();
    },
    data() {
      return {
        formModel: {
          radioValue: ""
        }
      };
    },
    methods: {
      initDefaultValue() {
        if (this.defaultValue) this.formModel.radioValue = this.defaultValue;
        revertFieldItemEditValue(this, "radioValue", this.reverPropertyPanelValueKey);
      },
      radioInput(e) {
        this.formModel.radioValue = e;
        this.$emit("changeValue", this.formModel.radioValue);
      },
      setRadioHValue(val) {
        this.formModel.radioValue = val;
      },
      getAssignValue() {
        return this.formModel.radioValue;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" ref="formRef">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <el-radio-group disabled={this.disabled} size="mini" value={this.formModel.radioValue} onInput={this.radioInput}>
              {this.radioOptions.map((item, index) => {
                return (
                  <el-radio label={item.value} key={item.value}>
                    {(item.label ? item.label : item.value) || `选项${index + 1}`}
                  </el-radio>
                );
              })}
            </el-radio-group>
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      radioOptions: { type: Array, default: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }] },
      defaultValue: { type: String, default: "" }
    })
  }
);

export const CheckBoxH = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    created() {
      if (this.defaultValue) this.formModel.checkBoxValue = Array.isArray(this.defaultValue) ? this.defaultValue : [...this.defaultValue.split(",")].length ? [...this.defaultValue.split(",")] : [];
    },
    data() {
      return {
        formModel: {
          checkBoxValue: []
        }
      };
    },
    methods: {
      checkBoxChange(e) {
        this.formModel.checkBoxValue = e;
        this.$emit("changeValue", this.formModel.checkBoxValue);
      },
      setCheckBoxHValue(val) {
        this.formModel.checkBoxValue = val;
      },
      getAssignValue() {
        return this.formModel.checkBoxValue;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" ref="formRef">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <el-checkbox-group disabled={this.disabled} size="mini" value={this.formModel.checkBoxValue} onInput={this.checkBoxChange}>
              {this.checkBoxOptions.map((item, index) => {
                return (
                  <el-checkbox label={item.value} key={item.value}>
                    {(item.label ? item.label : item.value) || `选项${index + 1}`}
                  </el-checkbox>
                );
              })}
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      checkBoxOptions: { type: Array, default: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }] },
      defaultValue: [{ type: [Array, String], default: [] }]
    })
  }
);

export const DatePickerH = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          date: ""
        }
      };
    },
    created() {
      this.initDefaultVale();
    },
    methods: {
      initDefaultVale() {
        if (this.defaultValue) {
          this.formModel.date = new Date(this.defaultValue);
        }
      },
      setDate(e) {
        this.formModel.date = e;
        this.$emit("changeValue", this.formModel.date);
      },
      getAssignValue() {
        return this.formModel.date;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" ref="formRef">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <el-date-picker disabled={this.disabled} size="mini" value={this.formModel.date} type="date" placeholder="选择日期" onInput={this.setDate} />
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      defaultValue: { type: String, default: "" }
    })
  }
);

export const TimePickerH = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          time: ""
        }
      };
    },
    created() {
      this.initDefaultVale();
    },
    methods: {
      initDefaultVale() {
        if (this.defaultValue) {
          this.formModel.time = new Date(this.defaultValue);
        }
      },
      setTime(e) {
        this.formModel.time = e;
        this.$emit("changeValue", this.formModel.time);
      },
      getAssignValue() {
        return this.formModel.time;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <el-time-picker disabled={this.disabled} size="mini" value={this.formModel.time} placeholder="选择时间" onInput={this.setTime} />
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      defaultValue: { type: String, default: "" }
    })
  }
);

export const UploadFile = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          propFileList: []
        }
      };
    },
    created() {
      this.initDefaultVale();
    },
    methods: {
      initDefaultVale() {
        this.formModel.propFileList = this.defaultValue;
      },
      setFile(e) {
        this.formModel.propFileList = e;
        this.$emit("changeValue", this.formModel.propFileList);
      },
      clearFile() {
        this.formModel.propFileList = [];
        this.$emit("changeValue", this.formModel.propFileList);
      },
      getAssignValue() {
        return this.formModel.propFileList;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <OSSUploadCombine
              accept=".pdf,.ppt,.pptx,.xls,.xlsx,.txt,.doc,.docx"
              disabled={this.disabled}
              limit={this.limit}
              fileType="knowledge_library"
              uploadType="file"
              uploadBtnText="选择文件"
              propFileList={this.formModel.propFileList}
              onChangeFileList={this.setFile}
            />
          </el-form-item>
        </el-form>
      );
    }
  },
  { ...useExtendConfig({ limit: { type: Number, default: 1 }, defaultValue: { type: Array, default: [] } }) }
);

export const UploadImg = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          propFileList: []
        }
      };
    },
    created() {
      this.initDefaultVale();
    },
    methods: {
      initDefaultVale() {
        this.formModel.propFileList = this.defaultValue;
      },
      setFile(e) {
        this.formModel.propFileList = e;
        this.$emit("changeValue", this.formModel.propFileList);
      },
      clearFile() {
        this.formModel.propFileList = [];
        this.$emit("changeValue", this.formModel.propFileList);
      },
      getAssignValue() {
        return this.formModel.propFileList;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <OSSUploadCombine
              disabled={this.disabled}
              limit={this.limit}
              fileType="knowledge_library"
              uploadType="image"
              v-model="field"
              propFileList={this.formModel.propFileList}
              onChangeFileList={this.setFile}
            />
          </el-form-item>
        </el-form>
      );
    }
  },
  { ...useExtendConfig({ limit: { type: Number, default: 3 }, defaultValue: { type: Array, default: [] } }) }
);

export const SelectOil = Vue._$extend(
  {
    created() {
      this.initDefaultVale();
    },
    data() {
      return {
        oilList: [],
        formModel: {
          recommendOilCode: []
        }
      };
    },
    methods: {
      async initDefaultVale() {
        let selectOilName = ''
        if (this.defaultValue) {
          this.formModel.recommendOilCode = Array.isArray(this.defaultValue)
            ? this.defaultValue
            : this.defaultValue.split(",").length == 1
            ? this.defaultValue.split(",")[0]
            : [...this.defaultValue.split(",")];
          selectOilName = await this.getOilNameByOilCode(this.formModel.recommendOilCode)  
        }
        this.getSelectOilSelectOptions({name:selectOilName, code:this.formModel.recommendOilCode });
      },
      async getSelectOilSelectOptions(oilObj) {
        const res = await getOilCascadeMenu();
        this.oilList = res;
        this.oilList.value.push(oilObj)
        this.oilList.value = _.uniqBy(this.oilList.value, "code")
      },
      setOil(e) {
        this.formModel.recommendOilCode = e;
        this.$emit("changeValue", this.formModel.recommendOilCode);
      },
      getAssignValue() {
        return this.formModel.recommendOilCode;
      },
      async createOilDialog() {
        const AddOilComponent = await AddOil();
        createDialog({ title: "手动添加油品", ContentComponent: AddOilComponent });
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item label={this.fieldName} rules={this.fieldRules}>
            <el-select
              size="small"
              placeholder="试试搜索：油品名称"
              clearable
              filterable
              remote
              onRemote={this.getOilCascadeMenu}
              options={this.oilList.value}
              value={this.formModel.recommendOilCode}
              onInput={this.setOil}
              disabled={this.disabled}
              onChange={this.changeValue}
              style={{ width: "100%" }}
            >
              {this.oilList.value &&
                this.oilList.value.map(item => {
                  return <el-option key={item.code} label={item.oilAlias || item.name} value={item.code} />;
                })}
              <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px" slot="empty">
                暂无匹配数据
                <el-link style="margin-left: 10px; color: #409eff" onClick={() => this.createOilDialog()}>
                  去添加
                </el-link>
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      defaultValue: { type: [Array, String], default: [] }
    })
  }
);

export const TableHFillForm = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    inject: ["tableLineOptions", "editRowData", "scopeData"],
    data() {
      return {
        formModel: {}
      };
    },
    created() {
      this.handleFillDefaultValue();
      this.revertEditData();
    },
    methods: {
      handleFillDefaultValue() {
        if (this.editRowData) return;
        this.tableLineOptions.options.forEach(item => {
          if (item.colInfo.default) this.formModel[item.key] = item.colInfo.default;
        });
      },
      revertEditData() {
        if (this.editRowData) {
          this.formModel = cloneDeep(this.editRowData);
        }
      },
      changeValue(fillFormItem, e) {
        this.formModel[fillFormItem.key] = e;
      },
      closeDialg() {
        this.$parent.$parent.closeDialog();
      },
      cancelCreate() {
        this.formModel = {};
        this.closeDialg();
      },
      deleteLine() {
        let parent = this.$parent;
        while (parent.$options.name != "TableH") {
          parent = parent.$parent;
        }
        parent.fillFormLineChangeValue && parent.deleteTableLine(this.formModel, this.scopeData);
        this.closeDialg();
      },
      async confirmCreate() {
        let parent = this.$parent;
        while (parent.$options.name != "TableH") {
          parent = parent.$parent;
        }
        const validateRes = await Promise.all(this.tableLineOptions.options.filter(field => this.$refs[field.key].validate).map(field => this.$refs[field.key].validate()));
        if (!validateRes.every(Boolean)) return;
        parent.fillFormLineChangeValue && parent.fillFormLineChangeValue(this.formModel, this.scopeData);
        this.closeDialg();
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" class="form-generator-content-table-container">
          {this.tableLineOptions.options.map(item => {
            let fieldRules = [];
            const Component = item.colType == 1 ? Input : SelectH;
            if (item.colInfo.required) fieldRules = [{ required: true, message: `请输入`, trigger: "blur" }];
            return (
              <Component
                ref={item.key}
                fieldName={item.colInfo.fieldName}
                fieldRules={fieldRules}
                maxlength={item.colInfo.length}
                defaultValue={this.formModel[item.key] || item.colInfo.default}
                options={item.colInfo.options}
                onChangeValue={e => this.changeValue(item, e)}
              />
            );
          })}
          <div class="form-generator-table-fill-form-bottom">
            {this.scopeData && (
              <el-button size="mini" onClick={this.deleteLine}>
                删除该行
              </el-button>
            )}
            <el-button size="mini" onClick={this.cancelCreate}>
              取消
            </el-button>
            <el-button size="mini" type="danger" onClick={this.confirmCreate}>
              确定
            </el-button>
          </div>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig()
  }
);

export const TableH = Vue._$extend(
  {
    name: "TableH",
    mixins: [useCommonMixin()],
    data() {
      return {
        tableColData: [
          {
            key: generateUniqueUUID(),
            label: "输入框名称",
            colType: 1,
            colInfo: {
              default: "",
              fieldName: "",
              length: 10,
              options: undefined,
              required: false
            }
          }
        ],
        formModel: {
          tableData: []
        }
      };
    },
    created() {
      this.initDefaultValue();
      this.revertTableColData();
    },
    methods: {
      initDefaultValue() {
        if (this.defaultValue) this.formModel.tableData = this.defaultValue;
      },
      getAssignValue() {
        return this.formModel.tableData;
      },
      resetTable(e) {
        this.tableColData = e.options.map(item => {
          return {
            label: item.colInfo.fieldName,
            ...item
          };
        });
      },
      revertTableColData() {
        this.tableColData = this.options.options.map(item => {
          return {
            label: item.colInfo.fieldName,
            ...item
          };
        });
      },
      deleteTableLine(e, scopeData) {
        if (scopeData && "$index" in scopeData) return this.formModel.tableData.splice(scopeData.$index, 1);
      },
      fillFormLineChangeValue(e, scopeData) {
        if (scopeData && "$index" in scopeData) return this.formModel.tableData.splice(scopeData.$index, 1, e);
        this.formModel.tableData.push(e);
      },
      createLineData(rowData, scopeData) {
        const componentProps = {
          tableLineOptions: this.options
        };
        if (rowData) {
          componentProps.editRowData = rowData;
          componentProps.scopeData = scopeData;
        }
        const FillINS = createDialog({
          title: this.fieldName,
          componentProps,
          ContentComponent: TableHFillForm
        });
        FillINS.$parent = this;
      }
    },
    render() {
      const editColSlot = {
        default: scope => {
          return (
            <el-button type="text" size="mini" color="#001450" onClick={() => this.createLineData(scope.row, scope)}>
              编辑
            </el-button>
          );
        }
      };
      return (
        <el-form model={this.formModel} label-position="top" class="form-generator-content-table-container">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <el-table data={this.formModel.tableData} style="width: 100%" class="form-generator-table" header-cell-style={{ background: "#f5f7fa", fontWeight: "normal" }}>
              <template>
                <el-table-column label="操作" disabled={this.disabled} align="center" scopedSlots={editColSlot} />
                {this.tableColData.map((item, index) => {
                  return <el-table-column label={item.label} prop={item.key} />;
                })}
              </template>
            </el-table>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", marginTop: "10px" }}>
              <el-button size="mini" type="danger" style={{ color: "#fff", fontWeight: "bloder" }} disabled={this.disabled} onClick={() => this.createLineData()}>
                添加
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      options: {
        type: Object,
        default: {
          value: undefined,
          options: [
            {
              colType: 1,
              key: generateUniqueUUID(),
              colInfo: {
                fieldName: "输入框名称",
                required: true,
                length: 10,
                options: [],
                default: ""
              }
            }
          ]
        }
      },
      defaultValue: {
        type: Array,
        default: []
      }
    })
  }
);

export const SelectTableCols = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          selectOptions: [
            {
              colType: 1,
              key: generateUniqueUUID(),
              colInfo: {
                fieldName: "输入框名称",
                required: false,
                length: "1",
                options: [],
                default: ""
              }
            }
          ]
        },
        moveBtnStyle: {
          fontSize: "12px",
          marginLeft: "5px",
          cursor: "pointer"
        }
      };
    },
    created() {
      this.initOptions();
      this.$emit("getOptions", this.formModel.selectOptions);
    },
    methods: {
      initOptions() {
        if (this.options && this.options.length) this.formModel.selectOptions = this.options;
      },
      setVal(e, item) {
        item.label = e;
        this.$emit("getOptions", this.formModel.selectOptions);
      },
      saveTableCol(colType, formData, editItem) {
        if (editItem && editItem.key) {
          const index = this.formModel.selectOptions.findIndex(item => item.key === editItem.key);
          this.formModel.selectOptions.splice(index, 1, {
            colType: colType,
            key: editItem.key,
            colInfo: { ...formData }
          });
          this.$emit("getOptions", this.formModel.selectOptions);
          return;
        }
        this.formModel.selectOptions.push({
          colType: colType,
          key: generateUniqueUUID(),
          colInfo: { ...formData }
        });
        this.$emit("getOptions", this.formModel.selectOptions);
      },
      addOption(addType) {
        if (this.formModel.selectOptions.length >= 10) {
          return ELEMENT.Message({
            message: "最多添加10条选项",
            type: "warning"
          });
        }

        createDialog({ title: "列字段", ContentComponent: TableColSetForm, componentProps: { createType: addType, saveTableCol: this.saveTableCol } });
      },
      editOption(editItem) {
        createDialog({ title: "列字段", ContentComponent: TableColSetForm, componentProps: { createType: editItem.colType, editItem, saveTableCol: this.saveTableCol } });
      },
      removeOpt(removeTarget) {
        if (this.formModel.selectOptions.length <= 1) {
          return ELEMENT.Message({
            message: "最少保留一条选项",
            type: "warning"
          });
        }
        const index = this.formModel.selectOptions.findIndex(item => item.key === removeTarget.key);
        if (index > -1) {
          this.formModel.selectOptions.splice(index, 1);
        }
        this.$emit("getOptions", this.formModel.selectOptions);
      },
      sort(moveType, item) {
        //moveType 1 上移 2 下移
        const key = item.key;
        const index = this.formModel.selectOptions.findIndex(item => item.key === key);
        if (index < 0) return;
        const targetIndex = moveType === 1 ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > this.formModel.selectOptions.length - 1) return;
        const targetKey = this.formModel.selectOptions[targetIndex].key;
        const targetItem = this.formModel.selectOptions.find(item => item.key === targetKey);
        this.formModel.selectOptions.splice(index, 1, targetItem);
        this.formModel.selectOptions.splice(targetIndex, 1, item);
        this.$emit("getOptions", this.formModel.selectOptions);
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item rules={this.fieldRules} style={{ marginBottom: 0 }}>
            <label v-slot="label">{this.fieldName}</label>
            <span style={{ color: "#999", fontSize: "13px" }}>（上限：10项）</span>
          </el-form-item>
          <transition-group name="animation-list">
            {this.formModel.selectOptions.map((item, index) => {
              return (
                <div key={item.key}>
                  <div style={{ width: "100%", display: "flex", flexWrap: "nowrap" }}>
                    <div style={{ width: "55%", color: "#666" }} class="form-generator-table-col-set-line">
                      {" "}
                      {item.colInfo.fieldName}
                    </div>
                    <span style={{ ...this.moveBtnStyle, cursor: index == 0 ? "not-allowed" : "pointer", color: index == 0 ? "#B3B3B3" : "" }} onClick={() => this.sort(1, item)}>
                      上移
                    </span>
                    <span
                      style={{
                        ...this.moveBtnStyle,
                        cursor: index == this.formModel.selectOptions.length - 1 ? "not-allowed" : "pointer",
                        color: index == this.formModel.selectOptions.length - 1 ? "#B3B3B3" : ""
                      }}
                      onClick={() => this.sort(2, item)}
                    >
                      下移
                    </span>
                    <span
                      style={{
                        ...this.moveBtnStyle
                      }}
                      onClick={() => this.editOption(item)}
                    >
                      编辑
                    </span>
                    <span style={{ ...this.moveBtnStyle, color: "#d10000" }} onClick={() => this.removeOpt(item)}>
                      删除
                    </span>
                  </div>
                </div>
              );
            })}
          </transition-group>
          <el-popover placement="bottom-start" trigger="click">
            <div>
              <div style={{ marginBottom: "18px" }} class="select-table-cole-sel-type" onClick={() => this.addOption(1)}>
                类型：输入
              </div>
              <div class="select-table-cole-sel-type" onClick={() => this.addOption(2)}>
                类型：下拉选择
              </div>
            </div>
            <el-button type="text" style={{ color: "#808aa8", marginLeft: "5px" }} width="fit-content" size="mini" slot="reference">
              添加 <i class="el-icon-arrow-down" />
            </el-button>
          </el-popover>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      options: {
        type: Array,
        default: [
          {
            colType: 1,
            key: generateUniqueUUID(),
            colInfo: {
              fieldName: "输入框名称",
              required: false,
              length: "1",
              options: [],
              default: ""
            }
          }
        ]
      }
    })
  }
);

/** TABLE FOR PROPERTY */
export const TableColSet = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          tableData: []
        },
        options: []
      };
    },
    created() {
      this.revertTableData();
    },

    methods: {
      getOptions(options) {
        options = cloneDeep(options);
        this.options = cloneDeep(options);
        this.$emit("changeValue", cloneDeep({ value: this.defaultValue, options: this.options }));
      },
      revertTableData() {
        if (checkFieldItemInPropertyPanel(this)) {
          this.options = this.$parent.activeField._configField.TABLE.options;
          if (this.options.options) this.options = this.options.options;
        }
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top">
          <el-form-item rules={this.fieldRules} label={this.fieldName}>
            <SelectTableCols fieldName="选项" onGetOptions={this.getOptions} options={this.options} />
          </el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig()
  }
);

export const TableColSetForm = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    inject: ["createType", "saveTableCol", "editItem"],
    created() {
      this.revertEditInfo();
    },
    data() {
      return {
        formModel: {
          fieldName: "",
          required: true,
          length: 10,
          options: [],
          default: ""
        }
      };
    },
    methods: {
      revertEditInfo() {
        if (!this.editItem) return;
        this.formModel = { ...this.editItem.colInfo };
      },
      getFormValue(key, value) {
        this.formModel[key] = value;
        if (this.createType == 2) {
          if (typeof value == "object" && "options" in value && "value" in value) {
            this.formModel.options = value.options;
            this.formModel.default = value.value;
          }
        }
      },
      async saveTableColLine() {
        const validateRes = await Promise.all(this.$children.filter(vm => vm.validate).map(vm => vm.validate()));
        if (!validateRes.every(Boolean)) return;
        this.saveTableCol(this.createType, this.formModel, this.editItem);
        this.$parent.$parent.closeDialog();
      },
      changeInputLen(e) {
        if (e > 150) {
          this.getFormValue("length", 150);
          this.$refs.tableColSetLen.resetInputValue(150);
          this.$refs.tableColSetDefaultInput.resetInputValue();
          return ELEMENT.Message({ message: "最大长度为150", type: "warning" });
        }
        this.getFormValue("length", e);
        this.$refs.tableColSetDefaultInput.resetInputValue();
      }
    },
    render() {
      return (
        <div>
          <Input
            defaultValue={this.formModel.fieldName}
            fieldName="字段名称"
            fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
            onChangeValue={e => this.getFormValue("fieldName", e)}
          />
          <SwitchH defaultValue={this.formModel.required} fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.getFormValue("required", e)} />
          {this.createType == "1" && (
            <Input
              ref="tableColSetLen"
              defaultValue={this.formModel.length}
              fieldName="输入字数上限"
              fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
              onChangeValue={e => this.changeInputLen(e)}
            />
          )}
          {this.createType == "1" && <Input ref="tableColSetDefaultInput" defaultValue={this.formModel.default} fieldName="默认值" onChangeValue={e => this.getFormValue("default", e)} />}
          {this.createType == "2" && <SelectRelOptForDefault defaultOptions={this.formModel.options} defaultSelValue={this.formModel.default} onChangeValue={e => this.getFormValue("default", e)} />}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <el-button size="mini" onClick={() => this.$parent.$parent.closeDialog()}>
              取消
            </el-button>
            <el-button size="mini" type="danger" onClick={this.saveTableColLine}>
              保存
            </el-button>
          </div>
        </div>
      );
    }
  },
  {
    ...useExtendConfig({
      createType: {
        type: String,
        default: "1"
      }
    })
  }
);

export const TextH = Vue._$extend(
  {
    mixins: [useCommonMixin()],
    data() {
      return {
        formModel: {
          text: "文字"
        }
      };
    },
    watch: {
      textContent(val) {
        this.formModel.text = val;
      }
    },
    created() {
      this.formModel.text = this.textContent;
    },
    methods: {
      getAssignValue() {
        return `${this.textStyle}-${this.formModel.text}`;
      }
    },
    render() {
      return (
        <el-form model={this.formModel} label-position="top" class="form-generator-content-table-container">
          <el-form-item>{this.textStyle == 1 ? <div class="form-generator-text-bloder">{this.formModel.text}</div> : <div class="form-generator-text-normal">{this.formModel.text}</div>}</el-form-item>
        </el-form>
      );
    }
  },
  {
    ...useExtendConfig({
      textStyle: {
        type: String,
        default: "1"
      },
      textContent: {
        type: String,
        default: "文字"
      }
    })
  }
);
