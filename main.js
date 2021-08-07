#! /usr/bin/env node

const fs = require('fs')
const path = require("path")
const dirPath = process.argv[2]
const fileNames = fs.readdirSync(dirPath)

const targetFileNames = fileNames.filter(RegExp.prototype.test, /.*\.jpg$|\.JPG$|\.jpeg$|\.JPEG$|\.png$|\.PNG$|\.AAE$|\.gif$|\.tif$|\.tiff$|\.HEIC$|\.MOV$|\.mov$|\.MPEG$|\.mpeg$|\.mpg$|\.MP4$|\.mp4$|\.AVI$|\.avi$|\.wmv$|\.flv$|\.mkv$/)

const fullPathAndNewFullPath = targetFileNames.map((fileName) => {
  const year = fs.statSync(dirPath + fileName).birthtime.getFullYear()
  const month = fs.statSync(dirPath + fileName).birthtime.getMonth() + 1
  const day = fs.statSync(dirPath + fileName).birthtime.getDate()
  const hours = fs.statSync(dirPath + fileName).birthtime.getHours()
  const minutes = fs.statSync(dirPath + fileName).birthtime.getMinutes()
  const newName = `${year}年${month}月${day}日${hours}時${minutes}分${path.extname(fileName)}`
  return {
    fullPath: path.join(dirPath, fileName),
    newFullPath: path.join(dirPath, newName)
  }
})

fullPathAndNewFullPath.sort((a, b) => {
  if (a.newFullPath > b.newFullPath) {
    return 1;
  } else {
    return -1;
  }
})

const someSerialNumFullPathAndNewFullPath = fullPathAndNewFullPath.map((file, i, array) => {
  const fileNameReg = /.+(?=\.)/
  const extensionReg = /[^.]+$/
  let serialNum = i

  while (serialNum - 1 >= 0 && array[serialNum - 1].newFullPath === file.newFullPath) serialNum--
  if (i === serialNum && (i === array.length - 1 || file.newFullPath !== array[i + 1].newFullPath))
    return {
      fullPath: file.fullPath,
      newFullPath: file.newFullPath
    }
  else
    return {
      fullPath: file.fullPath,
      newFullPath: `${file.newFullPath.match(fileNameReg)}_${i - serialNum + 1}.${file.newFullPath.match(extensionReg)}`
    }
})

async function main() {
  someSerialNumFullPathAndNewFullPath.forEach((file, index) => {
    console.log(file.fullPath.match(/([^/]+?)?$/)[1] + "  -->  " + file.newFullPath.match(/([^/]+?)?$/)[1])
  })

  const {Confirm} = require('enquirer');

  const prompt = new Confirm({
    name: 'question',
    message: '写真を変換しますか？'
  });

  try {
    const answer = await prompt.run()
    if (answer) {
      someSerialNumFullPathAndNewFullPath.forEach(fileName => {
        fs.rename(fileName.fullPath, fileName.newFullPath, err => {
          if (err) throw err
        })
      })
      console.log('変換しました！')
    } else {
      console.log('キャンセルしました。')
    }
  } catch (error) {
    console.error(error);
  }
}

main()
