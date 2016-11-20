## 注意： ##

- 发布代码后需替换`www/style/indxe.css`的字体文件`//at.alicdn.com/t/`全部替换成`../lib/antd-mobile/`(找不到插件替换。。[黑脸。黑脸])
- 需要安装cordova的插件看`package.json`
- 自签名
`jarsigner -verbose -keystore cnode.keystore -signedjar E:\study\cnodeapp\CNode.apk E:\study\cnodeapp\platforms\android\build\outputs\apk\android-release-unsigned.apk -storepass cnodeapp cnodeapp -digestalg SHA1 -sigalg MD5withRSA`
- 解释：`E:\study\cnodeapp\CNode.apk`签名apk输出路径；
`E:\study\cnodeapp\platforms\android\build\outputs\apk\android-release-unsigned.apk`未签名apk文件路径；
具体用法及参数：[http://blog.csdn.net/ygc87/article/details/7621037](http://blog.csdn.net/ygc87/article/details/7621037 "http://blog.csdn.net/ygc87/article/details/7621037")

`-digestalg SHA1 -sigalg MD5withRSA`处理某些手机安装失败问题

- 安装失败要卸载旧版再安装新版