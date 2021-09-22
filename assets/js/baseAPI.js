//每次调用$.ajax()或$.post()或$.get()的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    //拼接请求的真正路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})