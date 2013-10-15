// by www.poboke.com
 
$(function() {

    //点击播放按钮
    var audio = audiojs.createAll()[0];
    $('#playaudio').click(function() {
        var url = $('#outputurl').val();
        if (url == '') {
            show('外链地址不能为空！');
            return;
        } else if (url.substr(url.length-3) != 'mp3') {
            show('目前只支持mp3音乐播放！');
            return;
        }
        audio.load(url);
        audio.play();
    });

    //点击分享地址添加到文本框
    $('form #sharelink').click(function() {
        var url = $(this).html();
        url = url.replace('&amp;', '&');
        $('#inputurl').val(url);
        $('#outputurl').val('');
    });

    //弹出信息框
    function show(message, type, pos) {
        //弹框位置
        var pos = pos || 1;
        posdict = {
            1 : 'messenger-on-top',
            2 : 'messenger-on-bottom',
            4 : 'messenger-on-left',
            8 : 'messenger-on-right',
        }
        var style = 'messenger-theme-ice messenger-fixed';
        for (var i in posdict) {
            if (pos & i) {
                style += ' ' + posdict[i];
            }
        }
        $._messengerDefaults = {extraClasses: style}

        $.globalMessenger().post({
            message: message,
            type: type || 'error',
            id: 'Only one at a time!',
            showCloseButton: true,
            hideAfter: 4,
        });
    }

    //ajax获取外链地址
    $('#getlink').click(function() {
        var url = encodeURIComponent($('#inputurl').val());
        if (url == '') {
            show('分享地址不能为空！');
            return;
        }
        $.get('link.php?url=' + url, function(data, status) {
            var json = eval('('+data+')');
            if (json.code == 0) {
                var hostname = 'http://' + window.location.hostname;
                var path = '';
                var url = hostname + path + json.link;
                $('#outputurl').val(url);
                show('成功获取外链地址！', 'success', 9);
            } else {
                show({
                    '99'  : '未知错误！',
                    '101' : '不支持的外链地址！',
                    '102' : '地址错误或网络出错！',
                    '103' : '获取不到文件扩展名，请检查地址是否有误！',
                }[json.code]);
            }
        });
    });

});


