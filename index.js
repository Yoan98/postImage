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
  "";

// 上传后的所有文件信息
let filePostedArr = [];
let filePostedObj ={}

async function main() {
  const fileList = fs.readdirSync("./needPostImg");
  filePostedArr = Array.from(Array(fileList.length))

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
    filePostedArr[index] = info

    if (!filePostedArr.includes(undefined)){
      // 生成对象结构
      filePostedArr.forEach(item => {
        filePostedObj[item.fileName.toUpperCase()] = item.url
      })
      // 写文件
      await writFile({fileName:'./files.json',str: JSON.stringify(filePostedObj)})
      console.log('生成完毕')
    }
  });

}

main();
