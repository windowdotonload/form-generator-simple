import _ from "lodash"

export const table_head_config = {
  data (){
    return {
      abnormalTableHead:[
        {
          prop:'abnormalNo',
          label:'异常ID',
          width:'220',
          key:_.uniqueId('abnormalHead_')
        },{
          prop:'abnormalStatus',
          label:'状态',
          width:'120',
          key:_.uniqueId('abnormalHead_')
        },{
          prop:'abnormalSource',
          label:'来源',
          width:'120',
          key:_.uniqueId('abnormalHead_')
        },{
          prop:'priority',
          label:'优先级',
          width:'150',
          key:_.uniqueId('abnormalHead_')
        },{
          prop:'createTime',
          label:'生成时间',
          width:'160',
          key:_.uniqueId('abnormalHead_')
        },{
          prop:'operation',
          label:'操作',
          width:'100',
          key:_.uniqueId('abnormalHead_')
        }
      ],
      taskTableHead:[
        {
          prop:'taskName',
          label:'任务名称',
          width:'8%',
          key:_.uniqueId('taskHead_')
        },{
          prop:'taskPlanNo',
          label:'任务ID',
          width:'8%',
          key:_.uniqueId('taskHead_')
        },{
          prop:'taskType',
          label:'任务类型',
          width:'8%',
          key:_.uniqueId('taskHead_')
        },{
          prop:'taskStatus',
          label:'状态',
          width:'8%',
          key:_.uniqueId('taskHead_')
        },{
          prop:'taskUserName',
          label:'负责人',
          width:'8%',
          key:_.uniqueId('taskHead_')
        },{
          prop:'taskTime',
          label:'计划执行时间',
          width:'8%',
          key:_.uniqueId('taskHead_')
        },{
          prop:'operation',
          label:'操作',
          width:'4%',
          key:_.uniqueId('taskHead_')
        }
      ],
      workOrderTableHead:[
        {
          prop:'workOrderNumber',
          label:'工单编号',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'serviceName',
          label:'服务项',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'workshopName',
          label:'所属车间',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'distributorCompanyName',
          label:'服务商',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'contactName',
          label:'联系人',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'executePersonName',
          label:'执行人',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'expectComingTimeStr',
          label:'预约日期',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'createTimeStr',
          label:'创建日期',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'workOrderStatus',
          label:'工单状态',
          width:'8%',
          key:_.uniqueId('workOrderHead_')
        },{
          prop:'operation',
          label:'操作',
          width:'4%',
          key:_.uniqueId('workOrderHead_')
        }
      ],
      checkTableHead:[
        {
          prop:'content',
          label:'检查内容',
          width:'8%',
          key:_.uniqueId('checkHead_')
        },{
          prop:'taskNames',
          label:'适用任务',
          width:'8%',
          key:_.uniqueId('checkHead_')
        },{
          prop:'operation',
          label:'操作',
          width:'4%',
          key:_.uniqueId('checkHead_')
        }
      ],
    }
  }
}