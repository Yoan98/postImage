const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const pinyin = require("pinyin");
const CONFIG = require("./config");


// 上传后的所有文件信息
let filePostedArr = [];
let filePostedObj = {}

const supportFileType = ['png', 'jpg']

async function uploadFile({
    file,
}) {
    let formData = new FormData();
    formData.append(CONFIG.FILE_FIELD, file);

    for (let key in CONFIG.EXTRA_FORM_DATA) {
        formData.append(key, CONFIG.EXTRA_FORM_DATA[key]);
    }


    let len = await new Promise((resolve, reject) => {
        return formData.getLength((err, length) =>
            err ? reject(err) : resolve(length)
        );
    });
    const res = await axios({
        url: CONFIG.SERVICE_URL,
        method: "POST",
        data: formData,
        headers: {
            "Content-Length": len,
            "Content-Type": "multipart/form-data",
            Authorization: CONFIG.AUTH_TOKEN,
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
        if (!isSupport) {
            hasUnsupportFile = true
        }
        return isSupport
    })

    if (hasUnsupportFile) {
        console.log('exist unsupport file type')
        return
    }

    filePostedArr = Array.from(Array(fileList.length))

    fileList.forEach(async (fileName, index) => {
        let imgFile = fs.createReadStream("./needPostImg/" + fileName);
        const res = await uploadFile({
            file: imgFile,
        });

        console.log('response from upload api', res)

        const originFileName = fileName.split(".")[0];

        let pinYinName = ''
        if (CONFIG.OPEN_PINYIN_NAME){
            pinYinName = pinyin(originFileName, {
                style: pinyin.STYLE_NORMAL,
                heteronym: false
            }).join("");
            pinYinName = pinYinName.replace(/\s+/g, "");
            pinYinName = pinYinName.replace(/(\@2x|\@1x)/gi, "");
        }

        const info = {
            fileName: CONFIG.OPEN_PINYIN_NAME ? pinYinName : originFileName,
            url: res.data[CONFIG.RETURN_URL_FIELD],
        };
        filePostedArr[index] = info

        if (!filePostedArr.includes(undefined)) {
            // 生成对象结构
            filePostedArr.forEach(item => {
                filePostedObj[item.fileName.toUpperCase()] = item.url
            })
            // 写文件
            await writFile({ fileName: './files.json', str: JSON.stringify(filePostedObj) })
            console.log('Generate files.json success!!!')
        }
    });

}

main();
