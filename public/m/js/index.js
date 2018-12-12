$(function(){
    
    //获得slider插件对象
    var slider = mui("#slider");
    slider.slider({
        interval: 5000
    });
    // 初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration:0.0005  //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
})