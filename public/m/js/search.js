$(function(){
    $('.btn-search').on('tap',function(){
        /* 获取输入框输入的内容 */
        var search = $('.input-search').val();

        if(!search.trim()){
            alert('请输入要搜索的商品');
            return;
        }
        /* 获取本地存储的值 */
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        console.log(historyData);

        if(historyData.indexOf(search) != -1){
            historyData.splice(historyData.indexOf(search), 1);
        }

        historyData.unshift(search);

        /* 把数据存储到本地存储中 */
        localStorage.setItem('searchHistory', JSON.stringify(historyData));

        queryHistory();

        location = 'productlist.html?search='+search;
    });
    queryHistory();

    /* 查询搜索记录 */
    function queryHistory(){
        
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];

        historyData = {rows:historyData};
        console.log(historyData);

        var html = template('seatchListTpl',historyData);
        $('.search-history .mui-table-view').html(html);
    }

    /* 删除搜索记录 */

    /* 给所有x按钮添加点击事件 */
    $('.search-history .mui-table-view').on('tap', '.btn-delete', function(){
        var index = $(this).data('index');

        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];

        historyData.splice(index,1);
        console.log(historyData);

        localStorage.setItem('searchHistory', JSON.stringify(historyData));

        queryHistory();
    });

    /* 清空搜索记录 */
    $('.btn-clear').on('tap', function(){
        localStorage.removeItem('searchHistory');
        queryHistory();
    });
});