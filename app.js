const exiftool = require('node-exiftool')
const fs = require('fs')
const dayjs = require('dayjs')
const path = require('path')

const ep = new exiftool.ExiftoolProcess()

const baseDir = 'E:\\重要资料导入备份\\icloud照片备份20240623\\iCloud 照片 (3)\\iCloud 照片'

ep
  .open()
  // read directory
  .then(() => ep.readMetadata(baseDir, ['-File:all']))
  .then(function(res) {
    console.log('读取ok', res)
    const exifInfos = res?.data
    for (let item of exifInfos) {
      // 找到可用的日期
      let mydate = item?.CreateDate || item?.ModifyDate || item?.DateTimeOriginal || item?.ProfileDateTime || item?.SubSecCreateDate || item?.TrackCreateDate || item?.TrackModifyDate
       || item?.MediaCreateDate || item?.MediaModifyDate || item?.CreationTime
      if (!mydate) {
        const result =  fs.statSync(item?.SourceFile)
        mydate = dayjs(result?.ctime || result?.mtime).format('YYYY-MM-DD HH-mm') || '2024-12-09 nodejs-auto-generate'
      }
      const newname = mydate.replace(/:/g, '-').replace(/[+\.]+$/g, '')
      const newpath = path.resolve(baseDir, newname + path.extname(item?.SourceFile))
      console.log('rename file', item?.SourceFile, newpath)
      fs.renameSync(item?.SourceFile, newpath)
    }


  }, function(err) {
    console.log('get meta error')
    console.error(err)
  })
  .then(() => ep.close())
  .catch(function(err) {
    console.log('close occur error')
    console.error(err)
  })