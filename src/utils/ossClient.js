import { requestMethodGetTip } from "../api/api";
import { fullScreen_loading } from "../generalComponents/fullScreenLoading";
import CryptoJS from "crypto-js";
/**
 *    await oss_client.getOSSClientInstance();
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      uploadFileRes.name [文件上传成功后的半路经] √
 */

export default class OSSClient {
  ClienInstance = null;
  OSSCertificate = null;
  OSSCache = false;
  constructor() {}

  createOSSCliet(ossCertificate) {
    const { accessId, accessKeySecret, accessKeyToken, bucket, host, key, region } = ossCertificate;
    return new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: region,
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: accessId,
      accessKeySecret: accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: accessKeyToken,
      // 填写Bucket名称。
      bucket: bucket
    });
  }

  async getOSSClientInstance(fileType, needCache = false) {
    this.OSSCache = needCache;
    if (this.OSSCache && this.ClienInstance) {
      return this.ClienInstance;
    }
    const params = {
      fileType: fileType ? fileType : "service_apply_video"
    };
    try {
      const ossCertificate = await requestMethodGetTip("/oss/signature", params);
      if (ossCertificate.data.code == 1000) {
        this.OSSCertificate = ossCertificate.data.data;
        this.ClienInstance = this.createOSSCliet(ossCertificate.data.data);
        return this.ClienInstance;
      }
    } catch (err) {
      console.error("GetOSSClientInstance ERR", err);
    }
  }

  async uploadFile(file, fileName, needLoading) {
    try {
      if (needLoading) fullScreen_loading.LOADING();
      const md5 = await this.encryptFile(file);
      const options = {
        headers: { "Content-MD5": md5 }
      };
      const result = await this.ClienInstance.put(this.OSSCertificate.key + `${new Date().getTime()}/` + fileName || `${new Date().getTime()}/` + file.fileName, file, options);
      if (needLoading) fullScreen_loading.ENDLOADING();
      return result;
    } catch (e) {
      console.error(e);
      if (needLoading) fullScreen_loading.ENDLOADING();
      ELEMENT.Message.error("上传失败,请稍后重试。");
    }
  }

  encryptFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        const contentMD5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(e.target.result));
        const contentMD5Base64 = contentMD5.toString(CryptoJS.enc.Base64);
        resolve(contentMD5Base64);
      };

      fileReader.readAsBinaryString(file);
    });
  }
}
export const oss_client = new OSSClient();
