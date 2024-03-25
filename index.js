const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const pinyin = require("pinyin");


const token =
"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiM2RmYzIzMzMzNThhYjY5YTE4MTcxZmJlZDAwOWE4NzM0MTEwYTRlNTc4Mzc5ZDA0NWM2OWZkMTA4NWJlMWEwN2RiZDFjZDU2YzkxOTZmYjUiLCJpYXQiOjE3MTA1NTc4NzQuOTIyMDA1LCJuYmYiOjE3MTA1NTc4NzQuOTIyMDA3LCJleHAiOjE3MTE4NTM4NzQuOTA4NjM4LCJzdWIiOiI2Iiwic2NvcGVzIjpbIioiXX0.SgrowcoeoqpIU4qiqE1yLpwZPCXkhOXX_toN_KWv1pqDx2SSSiBqwyJbRYqMjacofZig1NPprUViDO1BbG9ejyoaqtZIbtAN3zl3U_Wl1lwfHT3atBEPjTOzoae9rbRWNzrLz4Xe7TxzWfTM-U8HYAmJtP2lf8hgxDeydTnBrPSMGRB85Ytzss2cxtQJ09AgsAZ96UP8RjqwIIA-I0e3Ezmm7OL0sQx12kiv29WKWgQsLYZNlsvKnVLQE_QvfDOFadC2q7aEgrFdwjnuzTjdYPf7714zMRxpR5LLUzJhcsKKbxIFnKeTqTuMbncmH6wUZp0rC7_r_fCzm7ac0bTuzWwqKXB_MpRphyi5OsybI5ROzxsN7TvlxVn2fyUCAliO0jXkywZl11o-eMKf-qk-4jbRqrg5g_5gvlxdRBE7mchq8kaImnal5XYdaDAJEiWEx-yWX2wbeZIrgbxpEtGtFipbMJazLWiGRtZ0CdRkPv7lA-JP__daL4Ii_NMK_WSOTMHU8iJShg7X1bPkfLiHL9nYceTfo1TPQnZOKShuN4HsQQwezwJVz5eWP0sm3MLRl2ZGpo5TtES_mVrNSc7HLADUYq0_eXTEr1PN_tpBFyD9ejyKxnLjYXczdVkWug9J4jrfppBQM-Y1ke1XTEn6yazjKW6TXt0rXvTQNS_7dF0";
const IMG_SERVICE_URL = 'http://test.api.yichuyun.cn/api/obs/upload'

// 上传后的所有文件信息
let filePostedArr = [];
let filePostedObj ={}

const supportFileType = ['png', 'jpg']

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
    url: IMG_SERVICE_URL,
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

async function main() {
  const fileList = fs.readdirSync("./needPostImg").filter(item => {
    const fileType = item.split('.')[1]
    return supportFileType.includes(fileType)
  })
  filePostedArr = Array.from(Array(fileList.length))

  fileList.forEach(async (fileName,index) => {
    let imgFile = fs.createReadStream("./needPostImg/" + fileName);
    const res = await uploadFile({
      file: imgFile,
      token,
    });
    console.log(res)
    const originFileName = fileName.split(".")[0];
    const newName = pinyin(originFileName, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false
    }).join("");
    console.log(newName)
    const info = {
      fileName: newName.replace(/\s+/g, ""),
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
