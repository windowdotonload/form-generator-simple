# reportType和报告名称
	# 1,风机主齿箱换油报告

	# 2,风机现场验油报告
	
	# 3,润滑推荐报告

	# 4,循环系统检查报告

	# 5,液压系统检查报告

	# 6,闭式齿轮检查报告

	# 7,轴承检查报告

	# 8,开式齿轮检查报告

	# 9,现场油品分析报告

	# 10,培训总结报告

	# 11,换油建议书

	# 12,设备检查报告

	# 13,油品储运调研报告
	
	# 14,故障分析及处理建议书

	# 15,润滑油换油周期优化建议书

	# 16,润滑脂加脂周期优化报告

	# 17,润滑油品种优化报告

	# 18,现场换油报告

	# 19,发动机内窥镜检查报告

	# 20,油品泄露检查

	# 21,设备系统清洗

	# 22,润滑状况评估

	# 23,闭式齿轮内窥镜检查

	# 24,润滑节能方案及实施效益建议书

	# -1,设备润滑调查老报告

	# 33，设备润滑调查新报告

# 字段类型对应前端类型：
	字符串类型：
	string、纯文本展示

	string1:展示其children(可不封，需要两次循环展示其name或者循环一次展示其name)

	input1 所有文本输入框类型、

	input2:只能输入数字输入框类型、

	input3：它的children中有两个input1类型的数据、暂无

  input4：输入框+单位下拉框

  textarea：文本域类型、

	stepper：加减字段类型、暂无

	dropdown：级联下拉、

	dropdown1：这种类型的下拉框调用字典接口获取下拉信息、用油信息，reportType:11,更换后工作用油品牌和更换后工作用油名称

	dropdown2：下拉框类型，下拉框的值取field_option字段、

	dropdown3：下拉框，选择后，根据值找到children中，valueCode=下拉框值的children字段展示、

	dropdown4：下拉框类型，children的valueCode的值contains选中的值，则该children不展示、

	dropdown4_empty：下拉框类型，值为空的时候，它的children都不展示、

	dropdown5：这个下拉框的children与其并列展示、

	dropdown_multi：下拉框，多选值放到实体类的valueCheckBoxList字段中、

	datepicker2：日期下拉年月、

	datepicker3：日期格式年月日、

	datepicker4：日期格式（时分）、

  datepicker5：年月日时分秒，选择范围、

  datepicker6：年月日时分秒、

	img：图片类型，可编辑，图片数量根据length字段确定、

	img2：图片类型，不可编辑，图片在前端页面仅展示不可编辑		页面中直接使用<img />标签回显

	radio1：单选框，样式为：选择之后没有任何效果，只是简单的选中单选框、

	radio2：单选框，样式为：选择之后，下面出来一个同级的单选框、

	radio3：单选框，样式为：选择之后，下面出来一个红色的字符串单选框、

	radio4：单选框，样式为：选择之后，下面出来多行的字符串文本域、

	radio5：单选框，样式为：选择之后下面出现多个输入框、验油报告-验油数据-是否做过油品实验室检测-datepicker3

	checkbox：多选框类型

  tab，表示当前字段样式为tab；

  button，表示当前为加号可以添加空白模板，会在动态字段池中根据当前ID找到对应的动态字段；当type=button的时候，再加一个字段addParentId，表示：添加到parentId的children中

	button类型需要根据对象中的rangMax和rangMin来判断最多可以加几个，删除最少剩几个