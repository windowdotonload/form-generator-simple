import inputIcon from "../../../assets/icon/input.svg";
import selectIcon from "../../../assets/icon/select.svg";
import radioIcon from "../../../assets/icon/radio.svg";
import checkboxIcon from "../../../assets/icon/checkbox.svg";
import datepickerIcon from "../../../assets/icon/datepicker.svg";
import timepickerIcon from "../../../assets/icon/timepicker.svg";
import fileIcon from "../../../assets/icon/file.svg";
import imgIcon from "../../../assets/icon/picture.svg";
import oilIcon from "../../../assets/icon/oil.svg";
import tableIcon from "../../../assets/icon/table.svg";
import textIcon from "../../../assets/icon/text.svg";
import { generateUniqueUUID } from "../util";

export const menuData = [
  {
    componentType: "自定义组件",
    subMenuData: [
      {
        name: "输入框",
        fieldName: "输入框名称",
        componentName: "Input",
        componentType: 1,
        propertyPanelComponent: "InputFieldProperty",
        icon: inputIcon,
        configField: {
          componentType: 1,
          fieldName: "输入框名称",
          required: true,
          multiLine: false,
          length: 10,
          default: "",
          showInRecordList: true
        }
      },
      {
        name: "下拉列表",
        fieldName: "下拉选择名称",
        componentName: "SelectH",
        componentType: 2,
        icon: selectIcon,
        propertyPanelComponent: "SelectFieldProperty",
        configField: {
          componentType: 2,
          fieldName: "下拉选择名称",
          required: true,
          default: "",
          options: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }],
          showInRecordList: true
        }
      },
      {
        name: "单选项",
        fieldName: "单选框名称",
        componentName: "RadioH",
        componentType: 3,
        icon: radioIcon,
        propertyPanelComponent: "RadioFieldProperty",
        configField: {
          componentType: 3,
          fieldName: "单选框名称",
          required: true,
          default: "",
          options: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }],
          showInRecordList: true
        }
      },
      {
        name: "多选项",
        fieldName: "多选框名称",
        componentName: "CheckBoxH",
        componentType: 4,
        icon: checkboxIcon,
        propertyPanelComponent: "CheckBoxFieldProperty",
        configField: {
          componentType: 4,
          fieldName: "多选框名称",
          required: true,
          default: "",
          options: [{ value: "选项1", key: generateUniqueUUID() }, { value: "选项2", key: generateUniqueUUID() }],
          showInRecordList: true
        }
      },
      {
        name: "时间选择",
        fieldName: "时间选择器",
        componentName: "TimePickerH",
        componentType: 5,
        icon: timepickerIcon,
        propertyPanelComponent: "DatePickerFieldProperty",
        configField: {
          componentType: 5,
          fieldName: "时间选择器",
          required: true,
          lineStyle: 1,
          length: 10,
          default: "",
          showInRecordList: true
        }
      },
      {
        name: "日期选择",
        fieldName: "日期选择器名称",
        componentName: "DatePickerH",
        componentType: 6,
        icon: datepickerIcon,
        propertyPanelComponent: "DatePickerFieldProperty",
        configField: {
          componentType: 6,
          fieldName: "日期选择器名称",
          required: true,
          lineStyle: 1,
          length: 10,
          default: "",
          showInRecordList: true
        }
      },
      {
        name: "上传文件",
        fieldName: "上传文件",
        componentName: "UploadFile",
        componentType: 7,
        icon: fileIcon,
        propertyPanelComponent: "UplaodFileFieldProperty",
        configField: {
          limit: "1",
          componentType: 7,
          fieldName: "上传文件",
          required: true,
          multiLine: false,
          length: 10,
          default: "",
          showInRecordList: true
        }
      },
      {
        name: "图片",
        fieldName: "上传图片",
        componentName: "UploadImg",
        componentType: 8,
        icon: imgIcon,
        propertyPanelComponent: "UplaodImgFieldProperty",
        configField: {
          limit: "3",
          componentType: 8,
          fieldName: "上传图片",
          required: true,
          lineStyle: 1,
          length: 10,
          default: "",
          showInRecordList: true
        }
      },
      {
        name: "表格",
        fieldName: "表格名称",
        componentName: "TableH",
        componentType: 10,
        icon: tableIcon,
        propertyPanelComponent: "TableHFieldProperty",
        configField: {
          TABLE: {
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
          },
          componentType: 10,
          fieldName: "表格名称",
          required: true,
          default: "",
          options: undefined,
          showInRecordList: false
        }
      },
      {
        name: "文字",
        fieldName: "文字名称",
        componentName: "TextH",
        componentType: 11,
        icon: textIcon,
        propertyPanelComponent: "TextHProperty",
        configField: {
          componentType: 11,
          fieldName: "文字名称",
          required: true,
          default: "",
          options: undefined,
          textContent: "文字",
          textStyle: "1",
          showInRecordList: false
        }
      }
    ]
  },
  {
    componentType: "固定组件",
    subMenuData: [
      {
        name: "选择油品",
        componentType: 9,
        fieldName: "选择油品",
        componentName: "SelectOil",
        icon: oilIcon,
        propertyPanelComponent: "SelectOilFieldProperty",
        configField: {
          componentType: 9,
          fieldName: "选择油品",
          required: true,
          lineStyle: 1,
          length: 10,
          default: "",
          showInRecordList: true
        }
      }
    ]
  }
];

export const componentData = menuData
  .reduce((pre, cur) => {
    return pre.concat(cur.subMenuData);
  }, [])
  .sort((a, b) => a.componentType - b.componentType);

export const getComponentDataByType = componentType => {
  if (componentData[componentType - 1].componentType === componentType) return componentData[componentType - 1];
  return componentData.find(item => item.componentType === componentType);
};
