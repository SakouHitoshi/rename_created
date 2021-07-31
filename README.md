# rename_created
Rename photos and videos to the creation date.
## supported extensions
### photo
.jpg .JPG .jpeg .JPEG .png .PNG .AAE .gif .tif .tiff .HEIC
### movie
.MOV .mov .MPEG .mpeg .mpg .MP4 .mp4 .AVI .avi .wmv

## install
```
$ npm install -g rename_created
```

## usage
1. Specify the directory where the files you want to convert are located
```
rename_created [directory]
```
2. The name of the file before conversion and the name of the file after conversion will be displayed.
Type "y" to start the conversion
```
test01.jpg  -->  2018年10月4日11時35分.jpg
test02.png  -->  2018年10月5日12時25分.png
test03.HEIC  -->  2018年10月7日4時40分.HEIC
test04.gif  -->  2018年10月14日4時23分.gif
test05.AAE  -->  2018年10月24日16時34分.AAE
✔ 写真を変換しますか？ (y/N) · false
変換しました！
```
