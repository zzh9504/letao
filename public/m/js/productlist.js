$(function() {
    
    // 1. 获取url中的参数的值 按照=分割取第二个值(索引是1) 进行转码
    // 使用一个函数 根据参数名去参数的值
    var search = getQueryString('search');
    // console.log(search);
    // 2. 调用查询商品数据的函数
    queryProduct();
    
   
    // 1. 给当前搜索按钮添加点击事件
    $('.btn-search').on('tap', function() {
        // 2. 获取当前输入框的值  只要把外面的全局的search覆盖
        search = $('.input-search').val();
        console.log(search);
        queryProduct();
    });

    // 由于商品查询经常使用 封装到一个公共函数里面 方便调用
    function queryProduct() {
        // 3. 根据当前输入的search发送请求渲染页面
        $.ajax({
            url: '/product/queryProduct',
            beforeSend: function() { // 请求之前会触发的回调函数
                // 请求之前显示遮罩层
                $('.mask').show();
            },
            complete: function() { // 请求之后会触发函数
                // 请求之后隐藏遮罩层
                $('.mask').hide();
            },
            // page 第几页 pageSize 每页大小 proName搜索关键字
            data: { page: 1, pageSize: 4, proName: search },
            success: function(data) {
                // 3. 调用模板生成html
                var html = template('productListTpl', data);
                // 4. 渲染到商品列表内容的ul
                $('.product-list .content ul').html(html);
            }
        });
    }

    // 1. 给所有排序的a添加点击事件
    $('.product-list .title ul li a').on('tap', function() {
        // 2. 获取当前排序的顺序
        var sort = $(this).data('sort');
        // 3. 修改整个sort的值 如果是1改成2  如果是2改成1
        sort = sort == 1 ? 2 : 1;
        // 4. 变了后重新改变页面的sort的值为当前变了的值
        $(this).data('sort', sort);
        // 5. 获取当前排序的方式
        var sortType = $(this).data('sort-type');
        
        var params = { page: 1, pageSize: 4, proName: search};
        // 给对象动态添加键 和 值  键名是变量不能使用.不能直接在{}里面加 一定要使用[]
        params[sortType] = sort;
        console.log(params);
        $.ajax({
            url: '/product/queryProduct',
            // page 第几页 pageSize 每页大小 proName搜索关键字
            data: params,
            success: function(data) {
                // 3. 调用模板生成html
                var html = template('productListTpl', data);
                // 4. 渲染到商品列表内容的ul
                $('.product-list .content ul').html(html);
            }
        });
       
    });

 
    // 4. 定义一个全局变量page表示当前页面数
    var page = 1;
    // 1. 初始化下拉刷新的效果
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {    
                contentdown: "你正在进行下拉还可以继续拉...", 
                contentover: "你已经拉到了可以刷新的位置 可以松手了",
                contentrefresh: "正在给你拼命刷新数据...", 
                callback: function() { //下拉刷新的回调函数 进行数据请求 下拉松手后就会还执行
                    //本地速度很快 加一个定时器延迟1秒钟执行请求和结束下拉效果
                    setTimeout(function() {
                        // 2. 拉了之后请求数据刷新页面 发请求刷新数据即可
                        queryProduct();
                        // 3. 当数据请求完毕页面刷新完毕后 结束下拉刷新  函数版本不一样 函数名不一样 注意当前结束函数
                        // endPulldownToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 9. 下拉完成后 重置这个上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 10. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                contentrefresh: "正在拼命加载更多数据...", 
                contentnomore: '再下实在是给不了更多!',
                callback: function() {
                    // 请求更多数据 在页面中去追加
                    // 如果请求更多数据 修改参数的page值 第一页是1  第二页2 第三页3                   
                    setTimeout(function() {
                        // 5. 每次上拉让当前的page++
                        page++;
                        // 6. 调用API传入对应的参数 请求++之后的数据
                        $.ajax({
                            url: '/product/queryProduct',
                            // page 第几页使用当前++后的page变量 pageSize 每页大小 proName搜索关键字
                            data: { page: page, pageSize: 4, proName: search },
                            success: function(data) {
                                // 7. 判断数据还有没有长度 有长度表示有数据 追加 没长度 表示没有数据 就结束下拉并且提示没有数据
                                // data是对象 {data:[]}  data.data取 data对象里面的data数组 里面data数组的.length
                                if (data.data.length > 0) {
                                    // 7.1 调用模板生成html
                                    var html = template('productListTpl', data);
                                    // 7.2 追加到商品列表内容的ul
                                    $('.product-list .content ul').append(html);
                                    // 7.3 加载完成后结束上拉加载的效果 MUI 结束上拉的函数endPullupToRefresh
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                }else{
                                	// 8. 没有长度提示没有数据 了 endPullupToRefresh提示没有数据传人一个true
                                	mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });

   
	 // 1. 给所有购买按钮添加点击事件
	 $('.product-list').on('tap','.btn-buy',function () {
	 		// 2. 获取当前点击商品id 
	 		var id = $(this).data('id');
	 		// 3. 使用location跳转商品详情页面  把id作为参数传递到商品详情
	 		location = 'detail.html?id='+id;
	 });
    // 根据url参数名取值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
});
