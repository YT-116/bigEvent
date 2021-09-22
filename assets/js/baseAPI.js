//每次调用$.ajax()或$.post()或$.get()的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    //拼接请求的真正路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    //统一为有权限的接口设置headers请求头，省的一个一个的写
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    //全局统一挂载 complete 回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1 清除本地存储的token
            localStorage.removeItem('token');
            // 2 重新跳转登录界面
            location.href = '/login.html';
        }
    }
})