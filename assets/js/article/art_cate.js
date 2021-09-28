$(function() {
    var layer = layui.layer
    var form = layui.form


    initArtCatelist()


    //获取文章分类的列表
    function initArtCatelist() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    var indexAdd = null
        //弹出层
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '<b>添加文章分类</b>',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式，为form-add 表单绑定 submit事件(因为这个表单时用js追加上去的)
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
            // alert('ok')
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCatelist()
                layer.msg('新增分类成功')
                    //根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    //点击编辑出现弹出层
    var indexedit = null
        //通过代理的形式，为btn-edit绑定点击事件
    $('tbody').on('click', '.btn-edit', function(e) {
        // alert('ok')
        indexedit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '<b>修改文章分类</b>',
            content: $('#dialog-edit').html()
        })


        var id = $(this).attr('data-id')
        console.log(id)
            //发起ajax请求获取对应分类的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })


    //通过代理的形式，为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
            // alert('ok')
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // alert('ok')
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                layer.close(indexedit)
                initArtCatelist()
            }
        })
    })

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        // alert('ok')
        var id = $(this).attr('data-id')
        layer.confirm('您确定?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    initArtCatelist()
                }
            })

        });
    })
})