// 回填表单数据
var renderFormByResult = function(result, container) {
    var body = container || $('body');

    body.find("input, select, span, textarea").each(function(i, el) {
        if ($(el).attr('name')) {
            var theValue = digValueFromJson($(el).attr('name'), result);
            if (el.tagName == "SPAN") {
                $(el).text(theValue);
            } else {
                $(el).val(theValue);
            }
            console.log("%s %s: %s", el.tagName, $(el).attr('name'), theValue);
        }
    });
}

// 根据接口数据渲染页面
var renderByJson = function(url, data, callback) {
    var url = global.host + url,
        data = $.param(data);

    $.ajax({
        url: url,
        type: "post",
        data: data,
        dataType: "json",
        success: function(result) {
            if ("0" == result.code) {
                console.log(result.res.data);
                renderFormByResult(result.res.data);
                if ("function" == typeof callback) {
                    callback(result.res.data);
                }
            }else {
                if (global.process.dev) {
                    if (result.res.msg || result.msg) {
                        validatePrompt(result.res.msg || result.msg);
                    }
                } else {
                    validatePrompt(result.res.msg || result.msg);
                }
            }
        }
    })
}

function getArgs() {
    var args = {};
    var query = location.search.substring(1);
    // Get query string
    var pairs = query.split("&");
    // Break at ampersand
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        // Look for "name=value"
        if (pos == -1) continue;
        // If not found, skip
        var argname = pairs[i].substring(0, pos); // Extract the name
        var value = pairs[i].substring(pos + 1); // Extract the value
        value = decodeURIComponent(value); // Decode it, if needed
        args[argname] = value;
        // Store as a property
    }
    return args; // Return the object
}

var BasicData ={
       "relationType": [
                {
                  "text": "父母",
                  "value": "父母"
                },
                {
                  "text": "兄弟姐妹",
                  "value": "兄弟姐妹"
                },
                {
                  "text": "同事",
                  "value": "同事"
                },
                {
                  "text": "同学",
                  "value": "同学"
                },
                {
                  "text": "朋友",
                  "value": "朋友"
                },
                {
                  "text": "亲属",
                  "value": "亲属"
                },
                {
                  "text": "配偶",
                  "value": "配偶"
                },
                {
                  "text": "其他",
                  "value": "其他"
                }
        ]
}

$.ajaxSetup({
    error: function(xhr, error) {
        var message = "网络异常，请重试";
        // alert(message);
    },
});

function showIconDialog(content, title, confirm, close) {
    var dialog = $('.weui_dialog_icon');
    summonDialog(dialog, content, title, confirm, close);
}
function showDialog(content, title, confirm, close) {
    var dialog = $('.weui_dialog_alert');
    summonDialog(dialog, content, title, confirm, close);
}
function summonDialog(dialog, content, title, confirm, close) {
    if (dialog.length <= 0) return false;

    if (content) {
        dialog.find('.weui_dialog_bd.prompt_text').html(content);
    } else {
        dialog.find('.weui_dialog_bd.prompt_text').html("");
    }
    if (title) {
        dialog.find('.weui_dialog_title').html(title);
    } else {
        dialog.find('.weui_dialog_title').html("");
    }
    if ("function" == typeof close && "function" == typeof confirm) {
        dialog.find('.weui_btn_dialog.primary').on('click', function () {confirm(dialog)});
        dialog.find('.weui_btn_dialog.btn-close').on('click', function () {close(dialog)});
    } else if ("function" == typeof confirm) {
        dialog.find('.weui_btn_dialog.primary').on('click', function () {confirm(dialog)});
        dialog.find('.weui_btn_dialog.btn-close').hide();
    } else {
        dialog.find('.weui_btn_dialog.primary').on('click', function () {
            dialog.hide();
        });
        dialog.find('.weui_btn_dialog.close').hide();
    }
    dialog.show();
}


