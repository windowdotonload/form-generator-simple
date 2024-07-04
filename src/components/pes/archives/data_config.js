export const archivesData = {
  data () {
    return {
      leftList: [
        {
          default_icon: require('../../../assets/pes_default_overview.png'),
          active_icon: require('../../../assets/pes_active_overview.png'),
          title: '总览',
          _uid: 0,
          isActive: true,
          type: 'overview'
        }, {
          default_icon: require('../../../assets/pes_default_archives.png'),
          active_icon: require('../../../assets/pes_active_archives.png'),
          title: '档案文件',
          _uid: 1,
          isActive: false,
          type: 'archives'
        }, {
          default_icon: require('../../../assets/pes_default_service_pack.png'),
          active_icon: require('../../../assets/pes_active_service_pack.png'),
          title: '服务进度',
          _uid: 2,
          isActive: false,
          type: 'service'
        }
      ],
      stageList: [
        {
          label: '服务计划',
          value: '1'
        }, {
          label: '目标实现',
          value: '2'
        }, {
          label: '效益总结',
          value: '3'
        }, {
          label: '业务回顾',
          value: '4'
        }
      ]
    }
  }
}
