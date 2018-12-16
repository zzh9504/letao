$(function() {

    // 调用封装好的查询购车商品和渲染函数
    queryCart();

    // 5. 定义一个page = 1;
    var page = 1;
    // 1. 添加下拉上拉结构
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {
                callback: function() {
                    // 模拟请求网络请求延迟
                    setTimeout(function() {
                        // 3. 在下拉刷新的函数请求最新的数据
                        queryCart();
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                callback: function() {
                    // 只是为了模拟延迟
                    setTimeout(function() {
                        // 6. 上拉加载的回调函数让page++
                        page++;
                        // 7. 请求page++了之后的更多的数据
                        $.ajax({
                            url: '/cart/queryCartPaging',
                            data: { page: page, pageSize: 4 },
                            success: function(data) {
                                console.log(data);
                                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                                if (data.error) {
                                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                                    location = 'login.html?returnUrl=' + location.href;
                                } else {
                                    // []  一开始这个样子的数组
                                    // {
                                    // 	data:[]
                                    // }// 变成这个样子的对象
                                    console.log(data instanceof Array);
                                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                                    if (data instanceof Array) {
                                        data = {
                                            data: data
                                        }
                                    }
                                    if (data.data.length > 0) {
                                        // 调用模板方法生成html
                                        var html = template('cartListTpl', data);
                                        // 8. 追加append到购物车的列表
                                        $('.cart-list').append(html);
                                        // 9. 结束上拉加载效果
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    } else {
                                        // 10. 结束上拉加载效果提示没有数据了
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }

                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });
    // 把请求购物车商品数据函数封装起来
    function queryCart() {
        $.ajax({
            url: '/cart/queryCartPaging',
            data: { page: 1, pageSize: 4 },
            success: function(data) {
                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                if (data.error) {
                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                	  // 注意页面刚刚加载请求数据 可能没有数据 也要把数据处理成一个对象 
                    console.log(data instanceof Array);
                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                    if (data instanceof Array) {
                        data = {
                            data: data
                        }
                    }
                    console.log(data);
                    // 调用模板方法生成html
                    var html = template('cartListTpl', data);
                    // 渲染到购物车列表的容器里面
                    $('.cart-list').html(html);
                }
            }
        });
    }
})
