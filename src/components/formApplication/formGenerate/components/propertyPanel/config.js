import * as PropertyFields from "../material";
import { EVENTBUS } from "../../formOperation.js";

const configMixin = rawOptions => {
  return {
    methods: {
      changeFieldConfig(configProperty, value) {
        EVENTBUS.$emit(`${this.activeField.__uuid}`, { configProperty, value });
      }
    }
  };
};
Vue.extendWithMixin = rawOptions => {
  const extendOptions = {
    _COMPONENTTYPE: "PROPERTY",
    mixins: [configMixin(rawOptions)],
    props: {
      activeField: {
        type: Object,
        default: () => ({})
      }
    }
  };
  const options = Object.assign({}, extendOptions, rawOptions);
  return Vue.extend(options);
};

export const InputFieldProperty = Vue.extendWithMixin({
  methods: {
    changeMultiLine(e) {
      if (e) {
        this.$refs.intpuLenProto.resetInputValue(50);
      } else {
        this.$refs.intpuLenProto.resetInputValue(10);
      }
      this.changeFieldConfig("multiLine", e);
    },
    changeLen(e) {
      this.changeFieldConfig("length", e);
      if (e > 150) {
        this.$refs.intpuLenProto.resetInputValue(150);
      }
      this.$refs.inputProtoField.resetInputValue("");
    }
  },
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SwitchH fieldName="样式" pText="多行" nText="单行" onChangeValue={e => this.changeMultiLine(e)} reverPropertyPanelValueKey="multiLine" />
        <PropertyFields.Input ref="intpuLenProto" fieldName="输入字数上限" onChangeValue={e => this.changeLen(e)} reverPropertyPanelValueKey="length" />
        <PropertyFields.Input ref="inputProtoField" fieldName="默认值" onChangeValue={e => this.changeFieldConfig("default", e)} reverPropertyPanelValueKey="default" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const RadioFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SelectRelOptForDefault onChangeValue={e => this.changeFieldConfig("options_default", e)} reverPropertyPanelValueKey="options_default" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const CheckBoxFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SelectRelOptForDefault onChangeValue={e => this.changeFieldConfig("options_default", e)} multiDefault={true} reverPropertyPanelValueKey="options_default" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const SelectFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SelectRelOptForDefault onChangeValue={e => this.changeFieldConfig("options_default", e)} reverPropertyPanelValueKey="options_default" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const DatePickerFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const UplaodFileFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.RadioH
          fieldName="上传文件上限"
          defaultValue="1"
          radioOptions={[{ value: "1" }, { value: "3" }, { value: "5" }]}
          onChangeValue={e => this.changeFieldConfig("limit", e)}
          reverPropertyPanelValueKey="limit"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const UplaodImgFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.RadioH
          fieldName="上传图片上限"
          defaultValue="3"
          radioOptions={[{ value: "3" }, { value: "6" }, { value: "9" }]}
          onChangeValue={e => this.changeFieldConfig("limit", e)}
          reverPropertyPanelValueKey="limit"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const SelectOilFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.SwitchH
          fieldName="是否显示在表单记录列表中"
          pText="是"
          nText="否"
          onChangeValue={e => this.changeFieldConfig("showInRecordList", e)}
          reverPropertyPanelValueKey="showInRecordList"
        />
      </div>
    );
  }
});

export const TableHFieldProperty = Vue.extendWithMixin({
  render() {
    return (
      <div>
        <PropertyFields.Input
          fieldName="表格名称"
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("fieldName", e)}
          reverPropertyPanelValueKey="fieldName"
        />
        <PropertyFields.SwitchH fieldName="是否必填" pText="是" nText="否" onChangeValue={e => this.changeFieldConfig("required", e)} reverPropertyPanelValueKey="required" />
        <PropertyFields.TableColSet fieldName="列字段" onChangeValue={e => this.changeFieldConfig("TABLE", e)} reverPropertyPanelValueKey="TABLE" />
      </div>
    );
  }
});

export const TextHProperty = Vue.extendWithMixin({
  data() {
    return {
      multiLine: false
    };
  },
  methods: {
    changeTextStyle(e) {
      if (e == 1) this.multiLine = false;
      else if (e == 2) this.multiLine = true;
      this.$refs.textContent.resetInputValue("文字");
      this.changeFieldConfig("textStyle", e);
      this.changeFieldConfig("textContent", "文字");
    }
  },
  render() {
    return (
      <div>
        <PropertyFields.RadioH
          fieldName="样式"
          defaultValue="1"
          radioOptions={[{ value: "1", label: "标题" }, { value: "2", label: "正文" }]}
          onChangeValue={e => this.changeTextStyle(e)}
          reverPropertyPanelValueKey="textStyle"
        />
        <PropertyFields.Input
          ref="textContent"
          fieldName="文字内容"
          maxlength={this.multiLine ? 30 : 8}
          multiLine={this.multiLine}
          defaultValue="文字"
          fieldRules={[{ required: true, message: "请输入字段名称", trigger: "blur" }]}
          onChangeValue={e => this.changeFieldConfig("textContent", e)}
          reverPropertyPanelValueKey="textContent"
        />
      </div>
    );
  }
});
