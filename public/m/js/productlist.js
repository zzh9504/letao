$(function () {
    var search = decodeURI(location.search.split('=')[1]);
    console.log(search);

    // 调用商品列表的API
    $.ajax({
        url:'/product/queryProduct',
        data:{page:1,pageSize:4,proName:search},
        success:function(data){
            // 调用模板生成html
            var html = template('productListTpl',data);
            // 渲染到商品列表内容的ul
            $('.product-list .content ul').html(html);
        }
    })
});