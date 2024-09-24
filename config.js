module.exports = {
    // 上传图片的后端服务地址
    // the url which upload img to back-end service
    SERVICE_URL: '',
    // 上传图片的后端服务的token
    // the back-end upload api Authorization token
    AUTH_TOKEN: ``,
    SUPPORT_FILE_TYPE: ['png', 'jpg'],
    // 上传图片的后端服务的form-data参数的文件字段
    // the file field of upload api form-data parameter
    FILE_FIELD: 'upload',
    // 如果开启，输出文件名将会是中文拼音
    // if open, the output file name will be chinese pinyin letter
    // 如果关闭，输出文件名将会和输入文件名一样
    // if close, the output file name will be the same as the input file name
    OPEN_PINYIN_NAME: true,
    // 上传图片的后端服务的返回的url字段
    // the returned url field from upload api response (res.data[RETURN_URL_FIELD])
    RETURN_URL_FIELD: 'upload',
    // 上传图片的后端服务的form-data参数
    // the form data which you need to send to upload api
    EXTRA_FORM_DATA:{
        save_path: "imgs",
        file_key: "upload",
        file_pre: "img",
    }
}