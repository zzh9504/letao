  $(function(){
      mui('.mui-scroll-wraper').scroll({
          indicators:false,//是否显示滚动条
          deceleration:0.0005
      });
      $.ajax({
          url:'/category/queryTopCategory',
          success:function(data){
              console.log(data);
              var html = template('categoryLeftTpl',data);
              $('.category-left ul').html(html);
          }
      });
      $('.category-left ul').on('tap','li a', function(){
          var id = $(this).data('id');
          querySecondCategory(id);
          $(this).parent().addClass('active').siblings().removeClass('active');
      });
      querySecondCategory(1);
      function querySecondCategory(id){
          $.ajax({
              url:'/category/querySecondCategory',
              data:{ id: id },
              success:function(data){
                  var html = template('categoryRightTpl',data);
                  $('.category-right ul').html(html);
              }
          });
      }
  })