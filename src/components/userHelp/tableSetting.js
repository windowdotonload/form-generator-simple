/**
 * op_type: UPDATE | DELETE | CREATE | READ | ORDER
 */

export const tableSettings = [
  {
    label: '权重',
    prop: 'orderNum'
  },
  {
    label: '分类标题',
    prop: 'title'
  },
  {
    label: '状态',
    prop: 'status',
    coloumMap: {
      1: '已启用',
      0: '已禁用'
    }
  },
  {
    label: '操作',
    type: 'operation',
    operateBtns: [
      {
        op_type: 'UPDATE',
        btn_text: '编辑',
        color: '#00144f'
      },
      {
        op_type: 'DELETE',
        btn_text: '删除',
        color: '#f56c6c'
      }
    ]
  }
]

export const contentTableSettings = [
  {
    label: '权重',
    prop: 'orderNum'
  },
  {
    label: '标题',
    prop: 'title',
    need_status_icon: true
  },
  {
    label: '可见范围',
    prop: 'target',
    empty_fill: '-'
  },
  {
    label: '操作',
    type: 'operation',
    operateBtns: [
      {
        op_type: 'ORDER',
        btn_text: '排序',
        color: '#697599'
      },
      {
        need_auth: true,
        op_type: 'READ',
        btn_text: '查看',
        color: '#697599'
      }
    ]
  }
]
