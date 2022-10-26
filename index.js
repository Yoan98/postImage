const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

async function uploadFile({
  file,
  save_path = "imgs",
  file_key = "upload",
  file_pre = "img",
  token,
}) {
  let formData = new FormData();
  formData.append("upload", file);
  formData.append("file_key", file_key);
  formData.append("save_path", save_path);
  formData.append("file_pre", file_pre);
  let len = await new Promise((resolve, reject) => {
    return formData.getLength((err, length) =>
      err ? reject(err) : resolve(length)
    );
  });
  const res = await axios({
    url: "https://api.yichuyun.cn/api/obs/upload",
    method: "POST",
    data: formData,
    headers: {
      "Content-Length": len,
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
  return res.data;
}
async function writFile({
  fileName,
  str
}){
  const res = await fs.writeFileSync('./'+fileName,str)
  return res
}
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiZTExNDE1ZTUzZTI2OGU5ZTVlZWE3M2YwZDZjN2ZmYzQ2NjQ4N2RmYjFiNDYwM2Q4NDRmZTBjNWZjMDYyNTI4NWQyODNkMjNkZjBhMmZmNTAiLCJpYXQiOjE2NjY2MDM0NDQuODE2MDkyLCJuYmYiOjE2NjY2MDM0NDQuODE2MDkzLCJleHAiOjE2NjcyMDgyNDQuODA2NDk3LCJzdWIiOiIxOSIsInNjb3BlcyI6WyIqIl19.Nw2Evxo6_u9IeB9W0VmcnGAuc9lCrfaLXdnbGQqlVI4uRWaVESk2EvpLBqj8XSFGfccV7YLySC9mKVELbmQQKrZ53YAJQQnO_VcT3-1A08QUQQ3-lPq579ssqgHBILId5_UpxLg7sEnCZwgv_k0H5ui5wTNlkkCCKHX3Zvf9u4o4Mn7ah_CMBgakrwDSWzLRTHYD7WeulkWNYIjWsne_5wi7q-XxUH6uEJ6NGMBJbj2DEYgQP6Sl9F5MYWh1tqsZRq0I9ZAE6y23BvfkymsK6V6svdQR0GnDsBzz0Yt0vwY23gZqb_Zkn9QbmkDXi7zvOAziqaT2tLi9buZJOETN_Wh3N5Q6GGqAMqNl60eEPTMEFY10ytXWwB-1HYpswqHee636daaJbrXhKLhg9UwGRORnGFqSOf-egmEJgx-OrZ9no9vxJz05S7h775WJoie0_64AgC32bRtGedopgp5H_8p1_n2A3RsdfV9Dc5J0qby1-OI5UkQWweNPCiePMS6tqUPn10LOHp1J65wUU8amU-Lc3ASPjGLhOVpqhVVusG_XLDQoHoSjORpDt-OU1VGzat9uWDFUIeiOLo21N8A_yLh25ALqJwolAFLmaXrKLAGSXU85mD-BghI1QLXMVTcBfr8OrYcJL9-Hg4FDbNs5324r2Yje_3eR0k32GSa2_Wg";

// 上传后的所有文件信息
let filePostedInfo = [];

async function main() {
  const fileList = fs.readdirSync("./needPostImg");
  filePostedInfo = Array.from(Array(fileList.length))

  fileList.forEach(async (fileName,index) => {
    let imgFile = fs.createReadStream("./needPostImg/" + fileName);
    const res = await uploadFile({
      file: imgFile,
      token,
    });
    const info = {
      fileName: fileName.split(".")[0],
      url: res.data.upload,
    };
    filePostedInfo[index] = info

    if (!filePostedInfo.includes(undefined)){
      // 写文件
      await writFile({fileName:'./files.json',str: JSON.stringify(filePostedInfo)})
      console.log('生成完毕')
    }
  });

}

main();
