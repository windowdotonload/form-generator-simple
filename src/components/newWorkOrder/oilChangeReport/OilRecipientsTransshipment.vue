<template>
<el-card class="oilRecipientsTransshipmentInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title" style="display:flex;align-items:center;justify-content: space-between;">
    <div>
        <el-divider direction="vertical"></el-divider>
        <span>{{ oilRecipientsTransshipmentName  }}</span>
    </div>
    </div>
    <el-form :model="oilRecipientsTransshipmentObj" ref="deviceRef" label-position="top" label-width="200px" style="padding:0 20px;">
    <el-row>
        <div v-for="(item, index) in oilRecipientsTransshipmentObj" :key="index">
            <!-- 下拉多选 dropdown_multi-->
            <el-col v-if="item.type=='dropdown_multi'">
                <el-form-item :label="item.name" :required="item.required">
                    <el-select
                    size="small"
                    @change="selectId => dropdownMulti(selectId, index1, item)"
                    v-model="item.valueCheckBoxList"
                    multiple
                    placeholder="请选择"
                    >
                        <el-option v-for="item in item.fieldOption" :key="item.option" :label="item.option" :value="item.option"> </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col v-if="item.type=='radio1'">
                <el-form-item :label="item.name" :required="item.required">
                    <span slot="label">
                        <span v-if="item.display">{{ item.name }} </span>
                        
                        <span class="no-wrap" v-if="item.tip && item.tip.type == 'text'">
                        <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                            <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                            <i class="el-icon-warning-outline"></i>
                            </el-button>
                        </el-tooltip>
                        </span>
                    </span>
                    <el-radio-group v-model="item.value" v-if="item.type == 'radio1'" @change="selectId => changeRadio(selectId, index)">
                        <el-radio v-for="(it,idx) in item.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col v-if="item.type=='textarea'">
                <el-form-item :label="item.name" :required="item.required">
                    <el-input
                    placeholder="请输入"
                    :disabled="item.disabled"
                    v-model="item.value"
                    :maxlength="item.length"
                    type="textarea"
                    style="width: 100%"
                    size="big"
                    show-word-limit
                    clearable
                    >
                    </el-input>
                </el-form-item>
                </el-col>
            <!--  radio1 或者 未使用完的油品处置照片 下边的children-->
            <el-col v-if="(item.type=='radio1' || item.nameKey=='key_1488') && item.children.length>0 ">
                    <div v-for="(itemChild2, index2) in item.children" :key="index2">
                        <div v-for="(itemChild3, index3) in itemChild2.children" :key="index3">
                            <el-col v-if="itemChild3.type=='textarea'">
                                <el-form-item :label="itemChild3.name+(index2+1)" :required="itemChild3.required">
                                    <el-input
                                    placeholder="请输入"
                                    :disabled="itemChild3.disabled"
                                    v-model="itemChild3.value"
                                    :maxlength="itemChild3.length"
                                    type="textarea"
                                    style="width: 100%"
                                    size="big"
                                    show-word-limit
                                    clearable
                                    >
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" v-if="itemChild3.type == 'img'">
                                <div style="font-size:14px;color:#606266;margin-bottom:10px;">
                                    <span v-if="itemChild3.required" class="star" style="margin-right:5px;">*</span>
                                    <span>{{ itemChild3.name }}{{index2+1}}（最多上传{{ itemChild3.length }}张图片）</span>
                                    <span v-if="index2!=0" class="delete"  @click="deletePic(index,index1,index2)">删除</span>
                                </div>
                                <el-form-item :required="itemChild3.required">
                                <!-- 上传图片 -->
                                <el-row>
                                    <el-upload
                                        v-if="itemChild3.type == 'img'"
                                        :class="{ noUploadBtn: itemChild3.imgFullDtoUrl.length >= itemChild3.length || notShowUploadBtn }"
                                        :action="uploadUrl"
                                        accept="image/*"
                                        list-type="picture-card"
                                        :limit="itemChild3.length"
                                        :auto-upload="false"
                                        :disabled="true"
                                        :file-list="itemChild3.imgFullDtoUrl"
                                        :before-upload="beforeAvatarUpload"
                                    >
                                        <div style="width:148px;height:148px;" @click="handlePictureUpload(itemChild3)">
                                        <i class="el-icon-plus"></i>
                                        </div>
                                        <div slot="file" slot-scope="{ file }">
                                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                        <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                            <span class="el-upload-list__item-preview">
                                            <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, itemChild3)"></i>
                                            </span>
                                            <span class="el-upload-list__item-preview">
                                            <i class="el-icon-crop" @click.self="handlePicturePrune(file, itemChild3)"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete">
                                            <i class="el-icon-delete" @click.self="handleRemove(file, itemChild3)"></i>
                                            </span>
                                        </span>
                                        </div>
                                    </el-upload>
                                    <el-dialog :visible.sync="imgDialogVisible">
                                    <img width="100%" :src="dialogImageUrl" alt="" />
                                    </el-dialog>
                                </el-row>
                                <!-- 上传图片 -->
                                </el-form-item>
                            </el-col>
                        </div>
                        <div v-if="index2==item.children.length-1">
                            <el-button @click="addPic(index,index1)" size="small" type="text" style="color:#001450;font-size:14px;margin-bottom:10px;">+ 添加图片和描述</el-button>
                        </div>
                    </div>
            </el-col>
            <!-- 其它方面 -->
            <el-col v-if="(item.type=='string' && item.nameKey=='key_1552')  ">
                <div v-if="item.children.length>0">
                    <div v-for="(itemChild2, index2) in item.children" :key="index2">
                    <div v-for="(itemChild3, index3) in itemChild2.children" :key="index3">
                        <el-col v-if="itemChild3.type=='textarea'">
                            <el-form-item  :required="itemChild3.required">
                                <span slot="label" >
                                    {{ itemChild3.name }}  {{(index2+1)}}
                                    <span @click="deleteOther(index,index2)" class="delete">删除</span>
                                </span>
                                <el-input
                                placeholder="请输入"
                                :disabled="itemChild3.disabled"
                                v-model="itemChild3.value"
                                :maxlength="itemChild3.length"
                                type="textarea"
                                style="width: 100%"
                                size="big"
                                show-word-limit
                                clearable
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <div v-if="itemChild3.type=='string' && itemChild3.children.length>0" 
                            v-for="(itemChild4, index4) in itemChild3.children" :key="index4">
                            <el-col :span="24" v-if="itemChild4.type == 'img'">
                            <div style="font-size:14px;color:#606266;margin-bottom:10px;">
                                <span v-if="itemChild4.required" class="star" style="margin-right:5px;">*</span>
                                <span>{{ itemChild4.name }}{{index3}}（最多上传{{ itemChild4.length }}张图片）</span>
                                <span class="delete" v-if="index3!=1"  @click="deleteOtherContPic(index,index2,index3)">删除</span>
                            </div>
                            <el-form-item :required="itemChild4.required">
                            <!-- 上传图片 -->
                            <el-row>
                                <el-upload
                                    v-if="itemChild4.type == 'img'"
                                    :class="{ noUploadBtn: itemChild4.imgFullDtoUrl.length >= itemChild4.length || notShowUploadBtn }"
                                    :action="uploadUrl"
                                    accept="image/*"
                                    list-type="picture-card"
                                    :limit="itemChild4.length"
                                    :auto-upload="false"
                                    :disabled="true"
                                    :file-list="itemChild4.imgFullDtoUrl"
                                    :before-upload="beforeAvatarUpload"
                                >
                                    <div style="width:148px;height:148px;" @click="handlePictureUpload(itemChild4)">
                                    <i class="el-icon-plus"></i>
                                    </div>
                                    <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                        <span class="el-upload-list__item-preview">
                                        <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, itemChild4)"></i>
                                        </span>
                                        <span class="el-upload-list__item-preview">
                                        <i class="el-icon-crop" @click.self="handlePicturePrune(file, itemChild4)"></i>
                                        </span>
                                        <span v-if="!disabled" class="el-upload-list__item-delete">
                                        <i class="el-icon-delete" @click.self="handleRemove(file, itemChild4)"></i>
                                        </span>
                                    </span>
                                    </div>
                                </el-upload>
                                <el-dialog :visible.sync="imgDialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="" />
                                </el-dialog>
                            </el-row>
                            <!-- 上传图片 -->
                            </el-form-item>
                            </el-col>
                            <el-col v-if="itemChild4.type=='textarea'">
                            <el-form-item :label="(itemChild4.name+index3)" :required="itemChild4.required">
                                <el-input
                                placeholder="请输入"
                                :disabled="itemChild4.disabled"
                                v-model="itemChild4.value"
                                :maxlength="itemChild4.length"
                                type="textarea"
                                style="width: 100%"
                                size="big"
                                show-word-limit
                                clearable
                                >
                                </el-input>
                            </el-form-item>
                            </el-col>
                        </div>
                        <div v-if="index3==itemChild2.children.length-1">
                            <el-button @click="addOtherContPic(index,index2,index3)" size="small" type="text" style="color:#001450;font-size:14px;margin-bottom:10px;">+ 添加图片和描述</el-button>
                        </div>
                    </div>
                    
                </div>
                </div>
                
                <div>
                    <el-button @click="addOtherCont(index,index1)" size="small" type="text" style="color:#001450;font-size:14px;margin-bottom:10px;">+ 添加其他方面</el-button>
                </div>
            </el-col>
    </div>
    </el-row>
    </el-form>
    <img-cutter
        ref="imgCutterModal"
        label="选择本地图片"
        :crossOrigin="true"
        :isModal="true"
        :crossOriginHeader="anonymous"
        :sizeChange="false"
        toolBgc="none"
        :lockScroll="true"
        :boxWidth="800"
        :boxHeight="450"
        :toolBoxOverflow="false"
        @cutDown="val => cutDown(val, item)"
    >
        <div slot="open"></div>
        <div slot="choose"></div>
    </img-cutter>
</el-card>
</template>

<script>
import imgCutter from '@/components/imgCutter.vue'
export default {
components: { imgCutter },
props: {
    oilRecipientsTransshipmentName : {
        type: String,
        default: () => {
            return ''
        }
    },
    oilRecipientsTransshipmentObj: {
        type: Array,
        default: () => {
            return []
        }
    },
    dynamicItemDto: {
        type: Object,
        default: () => {
            return []
        }
    },
},
data () {
    return {
        pruneIndex: null,
        input: '',
        uploadUrl: '',
        deviceDetailObj: this.deviceDetail,
        lubricationMethodType: '', // 润滑方式类型  1普通油类  2.油雾   3.喷射  4  脂类
        deviceForm: this.deviceObj,
        imgDialogVisible: false,
        cutFlag: false,
        notShowUploadBtn: false,
        dialogImageUrl: '',
        tempImagePath: '',
        cutFileList: {},
    }
},
mounted () {},
created () {
    
},
methods: {
    dropdown2Change(val,item) {
        console.log(val,item)
    },
    dropdownMulti (val, index, child, it) {
      child.value = child.valueCheckBoxList.toString()
    },
    // 添加图片和描述
    addPic(index,index1) {
        console.log(this.oilRecipientsTransshipmentObj[index].children[0].children[0].required,'查找是必填还是非必填')
        let data;
        if(this.oilRecipientsTransshipmentObj[index].children.length<=2) {
            if(this.oilRecipientsTransshipmentObj[index].children[0].children[0].required) {
                data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic1))
            } else {
                data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic7))
            }
            data._uid = Date.now()
            this.oilRecipientsTransshipmentObj[index].children.push(data)
        } else {
            this.$message.error('最多可添加3条')
        }
    },
    // 删除图片和描述
    deletePic(index,index1) {
        this.oilRecipientsTransshipmentObj[index].children.splice(index1,1)
    },
    // 添加其他方面
    addOtherCont(index) {
        console.log(this.oilRecipientsTransshipmentObj,index)
        if(this.oilRecipientsTransshipmentObj[index].children.length<=2) {
            const data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic2))
            data._uid = Date.now()
            this.oilRecipientsTransshipmentObj[index].children.push(data)
        } else {
            this.$message.error('最多可添加3条')
        }
    },
    // 其他方面里的 添加图片和描述
    addOtherContPic(index,index1,index2) {
        if(this.oilRecipientsTransshipmentObj[index].children[index1].children.length<=3) {
            const data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic7))
            data._uid = Date.now()
            this.oilRecipientsTransshipmentObj[index].children[index1].children.push(data)
        } else {
            this.$message.error('最多可添加3条')
        }
    },
    // 删除 其它方面里的  图片和描述
    deleteOtherContPic(index,index1,index2) {
        console.log(this.oilRecipientsTransshipmentObj,index,index1,index2)
        this.oilRecipientsTransshipmentObj[index].children[index1].children.splice(index2,1)
    },
    // 删除其他方面
    deleteOther(index,index1) {
        console.log(this.oilRecipientsTransshipmentObj[index].children,index1)
        this.oilRecipientsTransshipmentObj[index].children.splice(index1,1)
    },
    // 验证
    validateOilRecipientsTransshipment () {
        let isPass = false
        const data = this.oilRecipientsTransshipmentObj
        let notValueArr = []
        let itemChildNotValue = []
        let itemChildList=[]
        let itemChild2List=[]
        let emptyList = []
        data.forEach(it=>{
            if((it.type=='dropdown_multi' && it.valueCheckBoxList.length==0 && it.required) || (it.type!='dropdown_multi' && it.required && !it.value) ) {
                emptyList.push(it)
            }
        })
        console.log(emptyList)
        data.forEach(it=>{
            if(it.children.length>0) {
                it.children.forEach(itChild=>{
                    if(itChild.children.length>0 ) {
                        itemChildList.push(itChild)
                    }
                    if((itChild.required && (!itChild.value && itChild.type !='dropdown_multi') || (itChild.type =='dropdown_multi' && itChild.valueCheckBoxList.length==0))) {
                        notValueArr.push(itChild)
                    }
                })
            }
        })
        console.log(itemChildList,'itemChildList')
        itemChildList.forEach(itChild2=>{
            if(itChild2.children.length>0) {
                itChild2.children.forEach(itChild3=>{
                    itemChild2List.push(itChild3)
                })
            }
            
        })
        itemChild2List.forEach(itChild3=>{
            if(itChild3.children.length>0) {
                itChild3.children.forEach(itChild4=>{
                    if(itChild4.required && !itChild4.value) {
                        itemChildNotValue.push(itChild4)
                    }
                })
            }
            
        })
        let emptyListChild = emptyList.concat(notValueArr).concat(itemChildNotValue)
        console.log(emptyListChild,'emptyListChild')
        if (emptyListChild.length > 0) {
            this.$message({
            message: emptyListChild[0].name + "必填",
            type: "warning"
            });
            return;
        } else {
            isPass = true
        }
        return isPass
    },
    // 上传
    handlePictureUpload (item) {
        this.cutFileList = item
        this.cutFlag = false
        this.$refs.imgCutterModal.handleOpen()
        this.oneImg = false
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath (item, path, flag) {
        const params = {
            url: path
        }
        this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
            if (res.data.code == 1000) {
            let pathUrl = []
            if (flag) {
                item.imgFullDtoUrl[this.pruneIndex].url = res.data.data
                item.imgFullDtoUrl[this.pruneIndex].urlHalf = path
                item.value = path
            } else {
                item.imgFullDtoUrl.push({
                urlHalf: path,
                name: item.nameKey,
                url: res.data.data
                })
                item.imgFullDtoUrl.map(el => {
                pathUrl.push(el.urlHalf)
                })
                item.value = pathUrl.toString()
            }
            } else {
            this.$message({
                message: res.data.msg,
                type: 'warning'
            })
            }
        })
    },
    /**
     * @Description: 图片删除
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} item
     */
    handleRemove (file, item) {
    item.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
        this.pruneIndex = i
        }
    })
    item.imgFullDtoUrl.splice(this.pruneIndex, 1)
    },
    /**
     * @Description: 图片返显
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} pruneIndex
     * @param {*} callback
     */
    imgBackShow (file, pruneIndex, callback) {
    callback(file[pruneIndex].url)
    },
    /**
     * @Description: 图片裁剪
     * @Author: LiQiuPing
     * @param {*} fileList
     */
    handlePicturePrune (file, fileList) {
    this.cutFlag = true
    this.cutFileList = fileList
    fileList.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
        this.pruneIndex = i
        }
    })
    let url = fileList.imgFullDtoUrl[this.pruneIndex].url
    this.$refs.imgCutterModal.handleOpen({
        name: 'img',
        src: url,
        width: 400,
        height: 400
    })
    },
    // 预览
    handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.imgDialogVisible = true
    },
    /**
     * @Description: 裁剪
     * @Author: LiQiuPing
     * @param {*} fileName
     */
    cutDown (fileName) {
    let cutDownData = this.cutFileList
    var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
    var file = this.dataURLtoBlob(fileName.dataURL, '裁剪图片.' + imgGs)
    var formData = new FormData()
    formData.append('fileType', 'lubrication_point')
    formData.append('multipartFiles', file)
    this.requestMethodPost('/web/file/uploadFiles', formData)
        .then(async res => {
        res = res.data
        if (res.code === 1000) {
            cutDownData.tempImagePath = res.data[0]
            this.getFullImgPath(cutDownData, res.data[0], this.cutFlag)
            cutDownData.value = res.data[0]
        } else {
            cutDownData.imgFullDtoUrl = []
            cutDownData.notShowUploadBtn = false
            this.$message({
            message: res.msg,
            type: 'warning'
            })
        }
        })
        .catch(res => {})
    },
    /**
     * @Description: base64转换为file
     * @Author: LiQiuPing
     * @param {*} dataurl
     * @param {*} name
     */
    dataURLtoBlob (dataurl, name) {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], name, { type: mime })
    }
}
}
</script>

<style lang='less'>
.oilRecipientsTransshipmentInfo {
 .el-form--label-top .el-form-item__label {
    float: none;
    text-align: left;
    padding: 0 0 10px;
    display: flex;
}
.title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
}


.star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
}
.el-card__header {
    background: #f9f9f9;
}
.el-divider--vertical {
    width: 3px;
}
.el-divider {
    background-color: #dd0000;
    position: relative;
}
.noUploadBtn .el-upload--picture-card {
    display: none;
}

.el-upload-list__item {
    transition: none !important;
}
}
</style>
<style lang="less" scoped>
.el-upload-list--picture-card .el-upload-list__item-actions {
opacity: 1 !important;
background-color: rgba(0, 0, 0, 0.2);
}
.uploadMask {
opacity: 0;
}
.uploadMask:hover {
opacity: 1;
}
.oilRecipientsTransshipmentInfo .el-upload-list__item-thumbnail {
width: 148px;
height: 148px;
object-fit: cover;
}
</style>
