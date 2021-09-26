$(function() {
    var form = layui.form;

    // 表单验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '你改了个寂寞!';
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '这不中！';
            }
        }
    });

    // 修改密码,发送请求
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败!')
                }
                layui.layer.msg('更新密码成功')

                //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
});