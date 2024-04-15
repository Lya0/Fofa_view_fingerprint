# 简介

魔改了这个项目，增加了fofa聚合api调用以及其他优化

https://github.com/wgpsec/fofa-search

# 修改的地方

- 使用fofa聚合api调用该hostname的指纹数据
- amap.fofa.info数据调用在backgroud.js允许并且写入缓存，优化加载
- domain，host，port增加点击跳转以及fofa查询



# 导入步骤

**要用到指纹界面的话，一定要替换api！因为打开浏览器初次加载缓存中的apikey会非常慢，所以放弃在前端设置key的方法，直接把key写死了。**

**查找flagfofaapikey，然后把flagfofaapikey改成自己的fofa的apikey即可**

![image-20240412162410921](https://adsry.oss-cn-beijing.aliyuncs.com/img@2/202404121624039.png)



谷歌开发者模式导入dist文件夹即可

![image-20240412162525816](https://adsry.oss-cn-beijing.aliyuncs.com/img@2/202404121625844.png)





# 展示效果

![image-20240412163252389](https://adsry.oss-cn-beijing.aliyuncs.com/img@2/202404121632423.png)

![image-20240415121856288](https://adsry.oss-cn-beijing.aliyuncs.com/img@2/202404151218365.png)

# 其他说明

如果聚合页面请求慢一些是fofaapi本身数据多的话本身加载时间会慢一些，由于fofa api调用速率限制，不考虑后台backgroud.js写缓存的方式来加载数据。
