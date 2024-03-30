const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const pinyin = require("pinyin");


const token =
    "";
const IMG_SERVICE_URL = 'http://test.api.yichuyun.cn/api/obs/upload'

// 上传后的所有文件信息
let filePostedArr = [];
let filePostedObj = {}

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
}) {
    const res = await fs.writeFileSync('./' + fileName, str)
    return res
}

async function main() {

    let hasUnsupportFile = false
    const fileList = fs.readdirSync("./needPostImg").filter(item => {
        const fileType = item.split('.')[1]
        const isSupport = supportFileType.includes(fileType)
        if (hasUnsupportFile) {
            hasUnsupportFile = true
        }
        return isSupport
    })

    if (hasUnsupportFile) {
        console.log('存在不支持的文件类型')
        return
    }

    filePostedArr = Array.from(Array(fileList.length))

    fileList.forEach(async (fileName, index) => {
        let imgFile = fs.createReadStream("./needPostImg/" + fileName);
        const res = await uploadFile({
            file: imgFile,
            token,
        });

        console.log(res)

        const originFileName = fileName.split(".")[0];
        let newName = pinyin(originFileName, {
            style: pinyin.STYLE_NORMAL,
            heteronym: false
        }).join("");
        newName = newName.replace(/\s+/g, "");
        newName = newName.replace(/(\@2x|\@1x)/gi, "");
        newName = newName.replace(/\([0-9a-z]*\)/gi, "");
        const info = {
            fileName: newName,
            url: res.data.upload,
        };
        filePostedArr[index] = info

        if (!filePostedArr.includes(undefined)) {
            // 生成对象结构
            filePostedArr.forEach(item => {
                filePostedObj[item.fileName.toUpperCase()] = item.url
            })
            // 写文件
            await writFile({ fileName: './files.json', str: JSON.stringify(filePostedObj) })
            console.log('生成完毕')
        }
    });

}

main();
