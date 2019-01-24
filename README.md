# puppeteer 模板项目

该项目模板是一个基于 puppeteer 的截图工具，该项目是一个 fun 工程，借助 fun 工具进行依赖安装，上传 headless_shell 大文件到 OSS，并最终部署到阿里云的函数计算平台，作为一个 serverless 的截图服务。

## 依赖工具

本项目是在 MacOS 下开发的，涉及到的工具是平台无关的，对于 Linux 和 Windows 桌面系统应该也同样适用。在开始本例之前请确保如下工具已经正确的安装，更新到最新版本，并进行正确的配置。

* [Docker](https://www.docker.com/)
* [Fun](https://github.com/aliyun/fun)
* [Fcli](https://github.com/aliyun/fcli)

Fun 和 Fcli 工具依赖于 docker 来模拟本地环境。

对于 MacOS 用户可以使用 [homebrew](https://brew.sh/) 进行安装：

```bash
brew cask install docker
brew tap vangie/formula
brew install fun
brew install fcli
```

Windows 和 Linux 用户安装请参考：

1. https://github.com/aliyun/fun/blob/master/docs/usage/installation.md
2. https://github.com/aliyun/fcli/releases

安装好后，记得先执行 `fun config` 初始化一下配置。

## 初始化

使用 fun init 命令可以快捷的将本模板项目初始化到本地。

```bash
fun init vanige/puppeteer-example
```

## 修改配置文件

在项目目录下创建 .env 文件，内容如下

```bash
# OSS Bucket 名称，由于 OSS Bucket 是全球唯一的，所以请换一个为被占用的名称，或者设定成一个已有的 BUCKET
BUCKET=chrome-headless
# OSS Region，这个 region 需要和最终部署的函数计算 region 保持一致
REGION=cn-shanghai
# 具备 OSS 写权限的 Access Key
ACCESS_KEY_ID=
ACCESS_KEY_SECRET=
```

修改 template.yml 文件的 `CHROME_BUCKET` 和 `CHROME_REGION` 字段。注意和上面的 .env 文件中的对应字段值保持一致。对应`CHROME_REGION`值的 `oss-` 前缀是必须的。

```bash
CHROME_BUCKET: chrome-headless
CHROME_REGION: oss-cn-shanghai
```

## 安装依赖

```bash
$ fun install
skip pulling image aliyunfc/runtime-nodejs8:build-1.2.0...
Task => [UNNAMED]
     => apt-get update (if need)
     => apt-get install -y -d -o=dir::cache=/code/.fun/tmp libnss3
     => bash -c 'for f in $(ls /code/.fun/tmp/archives/*.deb); do dpkg -x $f /code/.fun/root; done;'
     => bash -c 'rm -rf /code/.fun/tmp/archives'
Task => [UNNAMED]
     => bash -c  'curl -L https://github.com/muxiangqiu/puppeteer-fc-starter-kit/raw/master/chrome/headless_shell.tar.gz --output headless_shell.tar.gz'
...
```

fun install 会执行 fun.yml 文件里的任务，这些任务会：

1. 安装 puppeteer 依赖的 .so 文件；
2. 将 puppeteer 依赖的 chrome headless 二进制文件上传到 OSS；
3. 安装 npm 依赖。

## 部署

```bash
$ fun deploy
using region: cn-shanghai
using accountId: ***********4733
using accessKeyId: ***********KbBS
using timeout: 60

Waiting for service puppeteer to be deployed...
        Waiting for function html2png to be deployed...
         Waiting for packaging function html2png code...
         package function html2png code done
        function html2png deploy success
service puppeteer deploy success
```

## 执行

```bash
$ fcli function invoke -s puppeteer -f html2png
The screenshot has been uploaded to http://chrome-headless.oss-cn-shanghai.aliyuncs.com/screenshot.png
```

打开上面的返回链接，看到截取出来的是全屏滚动的长图，考虑的篇幅下面只截取了部分：
![image](https://yqfile.alicdn.com/e2d12dfbee485cac743bf179d1093d0d1a2545f4.png)

如果想换一个网址，可以使用如下命令格式

```bash
fcli function invoke -s puppeteer -f html2png --event-str 'http://www.alibaba.com'
```

## 调试

如果需要在本地调试代码，可以使用如下命令

```bash
fun local invoke html2png <<<'http://www.alibaba.com'
```

## 参考阅读

1. [三分钟学会如何在函数计算中使用 puppeteer](https://yq.aliyun.com/articles/602877)