import { Message } from "element-ui";
import * as Fields from "./components/material";
import { generateUniqueUUID } from "./components/util.js";
import { cloneDeep } from "lodash";

const { ref, reactive, onMounted, toRaw } = VueCompositionAPI;

const wrapComponentStyle = {
  fieldItemContainer: {
    position: "relative",
    padding: "0 20px",
    paddingBottom: "8px",
    transition: "all ease 0.5s"
  },
  fieldItemContainerHover: {
    position: "relative",
    padding: "0 20px",
    paddingBottom: "8px",
    background: "rgba(245,245,245,0.5)",
    cursor: "pointer",
    borderRadius: "6px"
  },
  fieldItemContainerActive: {
    position: "absolute",
    top: "0",
    left: "-50px",
    height: "100%",
    width: "3px",
    background: "#d10000"
  }
};

const activeFieldProperty = reactive({ value: null });
const setActiveFieldProperty = fieldInfo => {
  activeFieldProperty.value = fieldInfo;
};
export const formOperationState = reactive({
  formContentList: [],
  activeField: null,
  activeFieldProperty
});

const createFormField = fieldInfo => {
  const __fieldInfo = Object.create(cloneDeep(fieldInfo));
  if (fieldInfo._BACKEND_H) {
    __fieldInfo._BACKEND_H = true;
    __fieldInfo.id = fieldInfo.id;
    __fieldInfo.formId = fieldInfo.formId;
  }
  const curUUUID = generateUniqueUUID();
  __fieldInfo.__uuid = curUUUID;
  const appendField = createHocComponent(__fieldInfo);
  appendField.__uuid = curUUUID;
  __fieldInfo.__componentInstance = appendField;
  formOperationState.formContentList.push(appendField);
};
export const EVENTBUS = new Vue();
export const useFormCreate = () => {
  return { formContentList: formOperationState.formContentList, createFormField };
};

export const useActiveFieldProperty = () => {
  return { activeField: activeFieldProperty, setActiveFieldProperty };
};

export const clearFormGenerateData = () => {
  activeFieldProperty.value = null;
  formOperationState.formContentList = [];
  formOperationState.activeField = null;
};

export const OperationGroup = Vue.extend({
  props: {
    fieldInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    moveUp(e) {
      e.stopPropagation();
      const index = formOperationState.formContentList.findIndex(item => item.__uuid === this.fieldInfo.__uuid);
      if (index > 0) {
        const temp = formOperationState.formContentList[index - 1];
        formOperationState.formContentList.splice(index - 1, 1, formOperationState.formContentList[index]);
        formOperationState.formContentList.splice(index, 1, temp);
      }
    },
    moveDown(e) {
      e.stopPropagation();
      const index = formOperationState.formContentList.findIndex(item => item.__uuid === this.fieldInfo.__uuid);
      if (index < formOperationState.formContentList.length - 1) {
        const temp = formOperationState.formContentList[index + 1];
        formOperationState.formContentList.splice(index + 1, 1, formOperationState.formContentList[index]);
        formOperationState.formContentList.splice(index, 1, temp);
      }
    },
    Topping(e) {
      e.stopPropagation();
      const index = formOperationState.formContentList.findIndex(item => item.__uuid === this.fieldInfo.__uuid);
      if (index > 0) {
        const temp = formOperationState.formContentList[index];
        formOperationState.formContentList.splice(index, 1);
        formOperationState.formContentList.unshift(temp);
      }
    },
    Bottoming(e) {
      e.stopPropagation();
      const index = formOperationState.formContentList.findIndex(item => item.__uuid === this.fieldInfo.__uuid);
      if (index < formOperationState.formContentList.length - 1) {
        const temp = formOperationState.formContentList[index];
        formOperationState.formContentList.splice(index, 1);
        formOperationState.formContentList.push(temp);
      }
    },
    delete(e) {
      e.stopPropagation();
      const index = formOperationState.formContentList.findIndex(item => item.__uuid === this.fieldInfo.__uuid);
      formOperationState.formContentList.splice(index, 1);
      formOperationState.activeField = null;
      setActiveFieldProperty(null);
    }
  },
  render() {
    return (
      <div style={{ position: "absolute", right: "20px", top: "1px", zIndex: 99 }}>
        <el-button type="text" size="mini" style={{ color: "#666" }} onClick={this.moveUp}>
          上移
        </el-button>
        <el-button type="text" size="mini" style={{ color: "#666" }} onClick={this.moveDown}>
          下移
        </el-button>
        <el-button type="text" size="mini" style={{ color: "#666" }} onClick={this.Topping}>
          置顶
        </el-button>
        <el-button type="text" size="mini" style={{ color: "#666" }} onClick={this.Bottoming}>
          置底
        </el-button>
        <el-button type="text" size="mini" style={{ color: "#d10000" }} onClick={this.delete}>
          删除
        </el-button>
      </div>
    );
  }
});

export const createHocComponent = fieldInfo => {
  const _uFieldInfo = Object.create(fieldInfo);
  if (fieldInfo._BACKEND_H) {
    _uFieldInfo._BACKEND_H = true;
    _uFieldInfo.id = fieldInfo.id;
    _uFieldInfo.formId = fieldInfo.formId;
  }
  _uFieldInfo.__uuid = fieldInfo.__uuid;
  _uFieldInfo._configField = { ...fieldInfo.configField };

  const Component = Fields[_uFieldInfo.componentName];
  const Cotr = Vue.extend({
    props: {
      disabledEditForm: {
        type: Boolean,
        default: false
      },
      disabledField: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        info: null,
        fieldInfo: _uFieldInfo,
        fieldRules: [],
        fieldItemContainerStyle: wrapComponentStyle.fieldItemContainer
      };
    },
    created() {
      this.registerEvent();
      this.handleRequiredRule();
    },
    methods: {
      getComponentValue() {
        return {
          fieldInfo: this.fieldInfo,
          formModel: this.$refs[this.fieldInfo.__uuid].formModel,
          getAssignValue: this.$refs[this.fieldInfo.__uuid].getAssignValue
        };
      },
      handleRequiredRule() {
        if (this.fieldInfo._configField.required) {
          this.fieldRules = [{ required: true, message: `请输入`, trigger: "blur" }];
        }
      },
      validate() {
        return new Promise((resolve, reject) => {
          this.$refs[this.fieldInfo.__uuid].validate &&
            this.$refs[this.fieldInfo.__uuid].validate(valid => {
              if (valid) {
                resolve(true);
              } else {
                reject(false);
              }
            });
        });
      },
      registerEvent() {
        EVENTBUS.$on(`${this.fieldInfo.__uuid}`, configFieldInfo => this.configField(configFieldInfo));
      },
      mouseEnter(e) {
        this.fieldItemContainerStyle = wrapComponentStyle.fieldItemContainerHover;
      },
      mouseLeave(e) {
        this.fieldItemContainerStyle = wrapComponentStyle.fieldItemContainer;
      },
      focusField(e) {
        if (formOperationState.activeField && !formOperationState.activeField._configField.fieldName)
          return ELEMENT.Message({
            type: "warning",
            message: "请配置字段名称"
          });
        formOperationState.activeField = this.fieldInfo;
        setActiveFieldProperty(this.fieldInfo);
      },
      initFieldInfo(info) {
        // nop
      },
      configField(configFieldInfo) {
        const { configProperty, value } = cloneDeep(configFieldInfo);
        this.fieldInfo._configField[configProperty] = value;
        this.configFieldDispatch(configFieldInfo);
      },
      configFieldDispatch(configFieldInfo) {
        const { configProperty, value } = configFieldInfo;
        if (configProperty === "required") {
          this.fieldRules = value ? [{ required: true, message: `请输入${this.fieldInfo._configField.fieldName}`, trigger: "blur" }] : [];
        } else if (configProperty === "multiLine") {
          this.clearFieldValue();
          this.fieldInfo._configField.length = value ? 50 : 10;
        } else if (configProperty === "length") {
          this.clearFieldValue();
        } else if (configProperty === "default") {
          this.setFieldValue(value);
        } else if (configProperty === "limit") {
          this.$refs[this.fieldInfo.__uuid].clearFile();
        } else if (configProperty === "options_default") {
          const { options, value: defaultValue } = value;
          this.fieldInfo._configField.options = options;
          this.fieldInfo._configField.default = defaultValue || [];
          const func = this.$refs[this.fieldInfo.__uuid] && this.$refs[this.fieldInfo.__uuid][`set${this.fieldInfo.componentName}Value`];
          if (func) func(defaultValue || []);
        } else if (configProperty === "TABLE") {
          const { value } = configFieldInfo;
          this.fieldInfo._configField.options = cloneDeep(value);
          this.$refs[this.fieldInfo.__uuid] && this.$refs[this.fieldInfo.__uuid].resetTable(value);
        }
      },
      setFieldValue(value) {
        Object.keys(this.$refs[this.fieldInfo.__uuid].formModel).forEach(key => {
          this.$refs[this.fieldInfo.__uuid].formModel[key] = value;
        });
      },
      clearFieldValue() {
        Object.keys(this.$refs[this.fieldInfo.__uuid].formModel).forEach(key => {
          this.$refs[this.fieldInfo.__uuid].formModel[key] = "";
          this.$refs[this.fieldInfo.__uuid].$emit("changeValue", this.$refs[this.fieldInfo.__uuid].formModel.value);
        });
      }
    },
    render() {
      return (
        <div style={this.disabledEditForm ? null : this.fieldItemContainerStyle} onMouseenter={this.mouseEnter} onMouseleave={this.mouseLeave} onClick={this.focusField}>
          {formOperationState.activeField && this.fieldInfo.__uuid === formOperationState.activeField.__uuid && !this.disabledEditForm ? <OperationGroup fieldInfo={this.fieldInfo} /> : null}
          {formOperationState.activeField && this.fieldInfo.__uuid === formOperationState.activeField.__uuid && !this.disabledEditForm ? (
            <div style={wrapComponentStyle.fieldItemContainerActive} />
          ) : null}
          {!this.disabledEditForm ? <div onClick={this.focusField} style={{ position: "absolute", width: "100%", height: "100%", zIndex: "88" }} /> : null}
          <Component
            ref={this.fieldInfo.__uuid}
            disabled={!this.disabledEditForm || this.disabledField}
            maxlength={this.fieldInfo._configField.length}
            fieldName={this.fieldInfo._configField.fieldName}
            fieldRules={this.fieldRules}
            defaultValue={this.fieldInfo._configField.default}
            multiLine={this.fieldInfo._configField.multiLine}
            onInitFieldInfo={this.initFieldInfo}
            options={this.fieldInfo._configField.options}
            radioOptions={this.fieldInfo._configField.options}
            checkBoxOptions={this.fieldInfo._configField.options}
            limit={this.fieldInfo._configField.limit}
            textStyle={this.fieldInfo._configField.textStyle}
            textContent={this.fieldInfo._configField.textContent}
          />
        </div>
      );
    }
  });
  Cotr._uFieldInfo = _uFieldInfo;
  return Cotr;
};

export const PreviewComponent = Vue.extend({
  data() {
    return {
      previewType: "1"
    };
  },
  methods: {
    changePreviewType(value) {
      this.previewType = value;
    }
  },
  render() {
    return (
      <div class="form-preview" style={{ height: "70vh", position: "relative", overflow: "auto", boxSizing: "border-box", paddingRight: "15px" }}>
        <div style={{ width: "100%", height: "39px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <el-radio-group value={this.previewType} fill="#d10000" size="mini" onInput={this.changePreviewType}>
            <el-radio-button label="1">PC端</el-radio-button>
            <el-radio-button label="2">小程序</el-radio-button>
          </el-radio-group>
        </div>
        {this.previewType === "1" ? (
          <div class="form-preview-pc-view-container">
            <div class="form-preview-pc-view-header">表单名称</div>
            <div class="form-preview-pc-view-content">
              {formOperationState.formContentList.map(Field => (
                <Field key={Field.__uuid} disabledEditForm={true} disabledField={true} ref={Field.__uuid} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", height: "calc(100% - 40px)", overflow: "hidden", borderRadius: "12px" }}>
            <iframe
              src={
                "https://dev-mobilserv.mobil.com.cn/tool/#/toolkit/wechatformpreview?formContentList=" +
                encodeURIComponent(JSON.stringify(formOperationState.formContentList.map(Field => toRaw(Field._uFieldInfo))))
              }
              frameborder="0"
              style="width:100%;height:100%"
            ></iframe>
          </div>
        )}
      </div>
    );
  }
});
