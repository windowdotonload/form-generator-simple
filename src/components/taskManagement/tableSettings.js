/**
 * op_type: UPDATE | DELETE | CREATE | READ | ORDER
 */

export const taskListTableSettings = [
  {
    label:'任务名称',
    prop:'taskName'
  },{
    label: "任务ID",
    prop: "taskPlanNo"
  },{
    label: "任务主题",
    prop: "planTitle"
  },{
    // 任务类型：1-加油；2-换油；3-加脂；4-检查；5-保养；6-维修
    label: "任务类型",
    prop: "taskType",
    coloumMap: {
      1: "换油",
      2: "加油",
      3: "加脂",
      4: "检查",
      5: "保养",
      6: "维修",
      7:"其他"
    },
  },{
    // 任务状态：0-未生效；1-已生效
    label: "状态",
    prop: "taskStatus",
    coloumMap: {
      1: "待领取",
      2: "待执行",
      3: "已执行",
      4: "已取消"
    },
    styleColorMap: {
      0: "#dd0000",
      1: "#008888",
      3: "#999999",
      4: "#999999"
    }
  },{
    label: "所属客户",
    prop: "companyName"
  },{
    label:'负责人',
    prop:'taskUserName'
  },{
    label: "计划执行时间",
    prop: "taskTime"
  },{
    label: "操作",
    type: "operation",
    operateBtns: [
      {
        op_type: "READ",
        btn_text: "查看",
        color: "#00144f"
      }
    ]
  }
];
