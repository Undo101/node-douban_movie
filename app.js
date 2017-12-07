//console.log('JavaScript才是世界上最好的语言，前后端通吃'); 
// 引入http模块，发出http请求,系统级别模块
var http = require('http'),
//加密的http请求
https=require('https'),
//文件系统模块，用于打开读取硬盘上的文件，前端无法实现, node.js具有操作系统的能力
fs=require('fs'),
//路径模块，读取文件，需要给出路径
path=require('path'),
//第三方模块，在服务器端模拟出前段DOM树
cheerio=require('cheerio');
// 要抓取的页面对象字面量
var opt={
    hostname:'movie.douban.com',
    path:'/top250',
    port:80
}
// 释放我们的小蜘蛛
function spiderMovie(index){
    // 使用http框向网址发送请求
    // console.log(index);
    //hostname是变量
     https.get('https://'+opt.hostname+opt.path+'?start='+index,function(res){
        //  设置编码
        //  返回的是数据流
         var html='';
          res.setEncoding('utf-8');
          //  文件可能比较大，一次发放一个数据包
        //  每次有数据到达，触发data事件
        res.on('data',function(chunk){
            html+=chunk;
           
        })
        res.on('end',function(){
            // 使用第三方cheerio库，加载我们得到的html字符串
            // 在内存里创建并模拟一个DOM
            //console.log('html');
            var $=cheerio.load(html);
            // 选中所有类名为item的元素，电影的内容组合
            // 把$视为查找元素 document.querySelectorAll('.item')
            var i=0;
            $('.item').each(function(){
                // 找到item下的img元素，并且获得它的src属性
                var picUrl =$('.pic img',this).attr('src');
                // if(i<1){
                downloadImg('./img/',picUrl);
                // i++;
                // }
            })

        })                      
     })
}
// 下载图片 图片放哪 ，图片远程网址
function downloadImg(imgDir,url){
    // https请求图片;
    https.get(url, function(res){
        var data='';
        res.setEncoding('binary');
        res.on('data',function(chunk){
            data+=chunk;
        })
        res.on('end',function(){
            // 图片下载完成，保存
            fs.writeFile(imgDir+path.basename(url),data, 'binary',function(err){
                if(err){
                    console.log('保存图片失败');
                }
                else{
                    console.log('图片保存到服务器');
                }
            })
        })
    });

}
spiderMovie(0);
// //黑盒子
// function *doSpider(x){
//     var start=0;
//     while(start<x){
//         yield start;
//         spiderMovie(start);
//         start +=25;
//     }
// }
// for(var x of doSpider(250)){
//     console.log(x);
// }

