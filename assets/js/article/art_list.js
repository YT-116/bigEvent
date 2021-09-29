$(function() {
    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }



    //定义一个查询的参数对象，将来请求对象数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求到第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的状态
    }

    initTable()
    initCate()


    var layer = layui.layer
        //获取文章发表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }

                // alert('获取成功')
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //渲染分页
                renderPage(res.total)
            }
        })
    }


    var form = layui.form
        //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取文章分类失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                    //通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }


    //为筛选表单绑定submit事件
    $('#form-search').submit(function(e) {
        e.preventDefault()
            //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[nam=state]').val()
            // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件，重新渲染表格中的数据
        initTable()
    })


    var laypage = layui.laypage
        //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数居条款
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8],
            //分页发生切换时，会触发jump函数
            // 触发jump回调函数的方式有两种
            // 1 点击页码的时候，会触发jump回调
            // 2 只要调用了renderpage函数，就会调用jump
            jump: function(obj, first) {
                //把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                    //根据最新的q获取对应的数据列表
                    //把最新的条目数，赋值到这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                    // initTable()
                if (!first) {
                    //可以通过first的值来判断是通过那种方式触发的，如果first的值为true，则为方式2出发的，否则是方式1触发的
                    initTable()
                }
            }
        })
    }

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
            //查询页面有多少个删除按钮
            var len = $('.btn-delete').length
                //获取文章的id
            var id = $(this).attr('data-id')
                //询问是否要删除数据
            layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'get',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除失败')
                        }
                        layer.msg('删除成功')
                        if (len === 1) {
                            //如果len的值等于1，证明删除完毕之后，页面就没有任何数据了
                            //但是页面的num最小为1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                })
                layer.close(index)
            })
        })
        //通过代理的形式为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        // alert('ok')
        location.href = 'art_pub.html'
    })

})