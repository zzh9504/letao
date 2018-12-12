// 因为这个js对页面渲染有影响放到前面写
function getHtmlFontsize(){
    // 假设一个设计稿的宽度 750
    var DesignWidth = 750;
    var DesignFontSize = 200;
    // 获取当前视口的宽度
    var nowWidth = document.documentElement.clientWidth;

    var nowFontSize = nowWidth / (DesignWidth / DesignFontSize);
    document.documentElement.style.fontSize = nowFontSize + "px";
}
getHtmlFontsize();
window.addEventListener('resize', getHtmlFontsize);