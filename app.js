const exiftool = require('node-exiftool')
const fs = require('fs')
const dayjs = require('dayjs')
const path = require('path')

exports.renameOneDir = function(baseDir) {
  const ep = new exiftool.ExiftoolProcess()
  ep.open()
  // read directory
  .then(() => ep.readMetadata(baseDir, ['-File:all']))
  .then(function(res) {
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
    ep.close()
  })
}