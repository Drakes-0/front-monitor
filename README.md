# front-monitor

## 前端异常监控解决方案

对于运行在浏览器环境下的前端页面，通常可能出现的异常情况可分类列为：

* 语法错误
* 运行时同步异常
* 运行时异步异常
* Promise Unhandledrejection
* 资源加载失败
* 异步请求状态异常

> 其中语法错误不用过多关注，由于其在开发阶段在IDE下就能获得明确提示，而且无法通过构建(对于有构建阶段的项目而言)。

> Promise Unhandledrejection 在通常情况下没有提供足够有用的异常信息，也无法确定开发人员是否关心此Promise调用链的意外结果，因此可作为监听异常中的可选项。

### 运行时异常

对于运行时异常，上报错误信息，脚本链接地址和错误代码所在的行与列，如果代码在上线前已经经过压缩混淆，则在拿到上报信息之后，需要找到脚本对应的map文件，结合source-map分析工具进行进一步的定位，所以确保脚本文件的链接中含有指纹码或其他类型的版本信息。

### 资源加载失败

对于资源加载相关的异常信息，需要注意的是在监控行为初始化完成之后才能捕获(通常的优化建议包含将页面上的所有脚本至于body底部)，对于前端渲染为主的项目而言几乎没有影响，服务器直出的项目则根据需要提升脚本在页面结构中的位置。  
此外，某些浏览器环境下，没有append到真实DOM树中的DOM片段所发起的资源请求失败会被忽略。

### 异步请求状态异常

对于异步请求状态异常，我们hook了原生的XMLHttpRequest原型对象，并暂时不考虑低版本IE浏览器下的ActiveXObject，如果使用了第三方库作为AJAX方案，建议进行足够的测试保证它们仍能正常运作。

某些场景下，脚本可能会产生大量的异常，例如在`scroll`,`resize`之类高频执行的回调中抛出的错误，或者循环中发起请求等(可能是由无意或BUG导致)，因此异常上报需要有一定的过滤机制，例如缓冲，去重，自定义过滤(待补充)。

## 如何使用

通过`script`标签引用cdn文件

```html
<script type="text/javascript" src="path/to/monitor.min.js"></script>
<script type="text/javascript">
    ExceptionMonitor(options)
</script>
```

通过`npm`引用

```javascript
import ExceptionMonitor from 'monitor'

ExceptionMonitor(options)
```

## options[配置项]

```javascript
reportUrl               String  上报地址

postFields              Array   上报信息的字段名，依次表征异常信息、类型、resource、行、列和`UA`，默认['message', 'type', 'resource', 'line', 'column', 'ua']

distinct                Boolean 是否对同一异常去重，默认true

silent                  Boolean 是否阻止浏览器显示捕获的异常，默认false

bufferTime              Number  缓冲的毫秒数，默认2000，10s以上视作10s

bufferSize              Number  缓存的异常数，默认20，100以上视作100

xhrErrorLevel           String  自定义AJAX的异常范围，用`/`隔开设定的状态码，例如"404/500/502"，默认"4/5"，表示监听以`4`或`5`开头的状态码

catchUnhandledrejection Boolean 是否捕获Uncaught Promise Error，默认false

cacheKey                String  本地缓存的key值
```

### 解决方案

**TODO**  
* 监控后台，接入数据中心，通过设置的线上异常阈值，自动触发邮件/短信/im警报
* 接入`sourceMap`分析工具，自动对运行时异常进行定位，并生成报表
* 主动上报功能
* 上报信息与行为的扩展
* 联动`nginx`日志对资源异常进行分析

### 参考资料

[https://sentry.io/](https://sentry.io/)  
异常监控解决方案`sentry`

[https://www.frontjs.com/app](https://www.frontjs.com/app)  
前端异常监控`FrontJs`

[https://github.com/BetterJS](https://github.com/BetterJS)  
腾讯前端异常监控体系`BetterJS`

[http://taobaofed.org/blog/2015/10/28/jstracker-how-to-collect-data/](http://taobaofed.org/blog/2015/10/28/jstracker-how-to-collect-data/)  
淘宝前端异常监控体系`JSTracker`

[https://github.com/saijs](https://github.com/saijs)  
支付宝前端异常监控体系`Sai`

[http://www.aliued.cn/2012/10/27/%E6%9E%84%E5%BB%BAweb%E5%89%8D%E7%AB%AF%E5%BC%82%E5%B8%B8%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F-fdsafe.html](http://www.aliued.cn/2012/10/27/%E6%9E%84%E5%BB%BAweb%E5%89%8D%E7%AB%AF%E5%BC%82%E5%B8%B8%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F-fdsafe.html)  
阿里前端异常监控体系`FdSafe`
