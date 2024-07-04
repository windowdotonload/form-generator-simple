export const trainDataAnalysisOverviewConfig = [
  {
    title: "课程参与人数",
    mapKey: "participatePersonNum",
    tip: "累计到昨日，参与课程的总人数，点击数字可查看详情",
    total: "",
    targetCode: "train_target_1",
    needShowDetail: true
  },
  {
    title: "课程参与次数",
    mapKey: "participateNum",
    tip: "累计到昨日，所有课程的访问次数",
    targetCode: "train_target_2",
    total: ""
  },
  {
    title: "有效观看人数",
    mapKey: "watchPeopleNum",
    tip: "累计到昨日，观看课程进度大于等于80%的人数，点击数字可查看详情",
    total: "",
    targetCode: "train_target_3",
    needShowDetail: true
  },
  {
    title: "测试参与人数",
    mapKey: "testPeopleNum",
    tip: "累计到昨日，所有课程参与测试的总人数，点击数字可查看详情",
    total: "",
    targetCode: "train_target_5",
    needShowDetail: true
  },
  {
    title: "平均打分",
    mapKey: "averageScore",
    tip: "累计到昨日，所有课程的平均打分",
    targetCode: "",
    total: ""
  },
  {
    title: "平均观看时长",
    mapKey: "averageWatchTime",
    targetCode: "train_target_8",
    tip: "累计到昨日，所有课程的平均观看时长",
    total: ""
  },
  {
    title: "点赞数",
    mapKey: "likeNum",
    targetCode: "train_target_6",
    tip: "累计到昨日，所有课程的点赞数",
    total: ""
  },
  {
    title: "评论数",
    mapKey: "commentNum",
    tip: "累计到昨日，所有课程的评论总数",
    targetCode: "train_target_7",
    total: ""
  }
];
export const trainDataAnalysisOverviewMap = {
  participatePersonNum: "watchCount",
  participateNum: "participateCount",
  watchPeopleNum: "watchCompleteUserCount",
  testPeopleNum: "testCount",
  averageScore: "gradeCount",
  averageWatchTime: "watchTime",
  likeNum: "praiseCount",
  commentNum: "evaluateCount"
};
