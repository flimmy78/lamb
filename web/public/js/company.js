
function startup() {
    var method = "GET";
    var url = '/api/companys';
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            var source = document.getElementById("contents").innerHTML;
            Handlebars.registerHelper('checkpayment', function(type) {
                return type == 1 ? '预付费' : '后付费';
            });
            Handlebars.registerHelper('checkArrears', checkArrears);
            var template = Handlebars.compile(source);
            var contents = template(xhr.response);
            $("tbody").append(contents);
            $("tbody tr").hide();
            $("tbody tr").each(function(i){
                $(this).delay(i * 25).fadeIn(200);
            });
        }
    }
    xhr.open(method, url, true);
    xhr.send();
}

function show() {
    var template = document.getElementById("new-page").innerHTML;
    layer.open({
        type: 1,
        title: '创建新企业',
        area: ['700px', '385px'],
        content: template
    });
}

function formSubmit() {
    var method = "POST";
    var url = '/company/create';
    var form = document.getElementById("form");
    var data = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = function() {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            layer.closeAll();
            $("tbody").empty();
            startup();
        }
    }
    xhr.open(method, url, true);
    xhr.send(data);
}

function formChange(id) {
    var method = "POST";
    var url = '/company/update?id=' + id;
    var form = document.getElementById("form");
    var data = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            layer.closeAll();
            $("tbody").empty();
            startup();
        }
    }
    xhr.open(method, url, true);
    xhr.send(data);
}

function editCompany(id) {
    var method = "GET";
    var url = '/api/company?id=' + id;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            var source = document.getElementById("edit-page").innerHTML;
            Handlebars.registerHelper('checkpayment', function(pay, type) {
                return (pay == type) ? new Handlebars.SafeString('selected="selected"') : '';
            });
            var template = Handlebars.compile(source);
            var contents = template(xhr.response.data);
            layer.open({
                type: 1,
                title: '编辑企业信息',
                area: ['700px', '385px'],
                content: contents
            });
        }
    }
    xhr.open(method, url, true);
    xhr.send();
}

function deleteCompany(id) {
    layer.confirm('亲，确定要删除？', {
        btn: ['是','否'], icon: 3
    }, function(){
        var method = "DELETE";
        var url = '/company/delete?id=' + id;
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.onreadystatechange = function(){
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                layer.msg('删除成功!', {icon: 1, time: 1000});
                setTimeout(function() {
                    $("tbody").empty();
                    startup();
                }, 1000);
            }
        }
        xhr.open(method, url, true);
        xhr.send();
    });
}

function companyRecharge(id, name) {
    var source = document.getElementById("recharge-module").innerHTML;
    var template = Handlebars.compile(source);
    var contents = template({id: id, name: name});

    layer.open({
        type: 1,
        title: '账户充值',
        area: ['540px', '320px'],
        content: contents
    });
}

function formRecharge(id) {
    var method = "POST";
    var url = "/company/recharge?id=" + id;
    var form = document.getElementById("form");
    var data = new FormData(form);

    var money = data.get("money");
    if (money.replace(/ /g,'') == '') {
        layer.closeAll();
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = function(){
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            if (xhr.response.status == 200) {
                layer.closeAll();
                layer.msg('充值成功!', {icon: 1, time: 1000});
                setTimeout(function() {
                    $("tbody").empty();
                    startup();
                }, 1000);
            } else {
                layer.msg('充值失败: ' + xhr.response.message, {icon: 2, time: 5000});
            }
        }
        
    }
    xhr.open(method, url, true);
    xhr.send(data);
}

function checkArrears(val) {
    var style = '';

    if (val < 0) {
        style = new Handlebars.SafeString(' class="danger"');
    }

    return style;
}
