$(function() {
    //点击去注册
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        //点击去登录
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //自定义一个表单验证属性
    var form = layui.form;

    form.verify({
        //自定义一个pwd校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        rpwd: function(value) {
            //通过形参传入确认密码框中的值
            // 再拿到密码框中的值
            // 比较两次的值是否一致
            // 如果判断不一致，直接return一个错误信息就可以了
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });
})

//定义一个layer，用于提示信息
var layer = layui.layer;

//监听注册表单的提交事件
$('#form_reg').on('submit', function(e) {
    e.preventDefault();
    //把data提取出来
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
    $.post(
        '/reguser', data,
        function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            //模拟人的点击行为
            $('#link_login').click();
        }
    );
});

//监听登录表单的提交事件
$('#form_login').submit(function(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('登录失败！');
            }
            layer.msg('登录成功！');
            //将登录成功得到的token字符串，保存到localStorage中
            localStorage.setItem('token', res.token);
            // 跳转到后台主页
            location.href = '/index.html'
        }
    });
});