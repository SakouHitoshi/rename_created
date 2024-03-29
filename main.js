#! /usr/bin/env node

const fs = require('fs')
const path = require("path")
const dirPath = process.argv[2]
const newDirPath = dirPath.endsWith("/") ? dirPath : dirPath + "/"
const fileNames = fs.readdirSync(newDirPath)

const red     = '\u001b[31m';
const blue    = '\u001b[34m';
const reset   = '\u001b[0m';

const targetFileNames = fileNames.filter(RegExp.prototype.test, /.*\.jpg$|\.JPG$|\.jpeg$|\.JPEG$|\.png$|\.PNG$|\.AAE$|\.gif$|\.tif$|\.tiff$|\.HEIC$|\.MOV$|\.mov$|\.MPEG$|\.mpeg$|\.mpg$|\.MP4$|\.mp4$|\.AVI$|\.avi$|\.wmv$|\.flv$|\.mkv$/)

const fullPathAndNewFullPath = targetFileNames.map((fileName) => {
  const year = fs.statSync(newDirPath + fileName).birthtime.getFullYear()
  const month = fs.statSync(newDirPath + fileName).birthtime.getMonth() + 1
  const day = fs.statSync(newDirPath + fileName).birthtime.getDate()
  const hours = fs.statSync(newDirPath + fileName).birthtime.getHours()
  const minutes = fs.statSync(newDirPath + fileName).birthtime.getMinutes()
  const newName = `${year}年${month}月${day}日${hours}時${minutes}分${path.extname(fileName)}`
  return {
    fullPath: path.join(newDirPath, fileName),
    newFullPath: path.join(newDirPath, newName)
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
  someSerialNumFullPathAndNewFullPath.forEach((file) => {
    console.log(file.fullPath.match(/([^/]+?)?$/)[1] + "  -->  " + blue + file.newFullPath.match(/([^/]+?)?$/)[1] + reset)
  })
  console.log(`項目数:${blue}${someSerialNumFullPathAndNewFullPath.length}${reset}`)

  const {Confirm} = require('enquirer');

  const prompt = new Confirm({
    name: 'question',
    message: 'ファイルをリネームしますか？'
  });

  try {
    const answer = await prompt.run()
    if (answer) {
      someSerialNumFullPathAndNewFullPath.forEach(fileName => {
        fs.rename(fileName.fullPath, fileName.newFullPath, err => {
          if (err) throw err
        })
      })
      console.log(blue + 'リネームしました！' + reset)
    } else {
      console.log(red + 'キャンセルしました。' + reset)
    }
  } catch (error) {
    console.error(error);
  }
}

main()
