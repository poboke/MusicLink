<?php
//构造微云分享地址
preg_match('|\/.+\/(\w+)\.|', $_SERVER['REQUEST_URI'], $res);
$key = $res ? $res[1] : exit("Url format error!");
$url = $referer = "http://share.weiyun.com/$key";

//获取源码，匹配出下载地址
$src = curl_get_contents($url, "");
preg_match('|shareInfo = (.*);|Ui', $src, $res);
$json = $res ? json_decode($res[1]) : exit("Can not get shareInfo!");

//拼接歌曲链接
$songurl = implode("", array(
    "http://".$json->dl_svr_host,
    ":".$json->dl_svr_port,
    "/ftn_handler",
    "/".$json->dl_encrypt_url,
    "?fname=".urlencode($json->filename),
));
header("Location: $songurl");

//用curl获取网页源码
function curl_get_contents($url, $referer) {
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_REFERER, $referer);
    curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us)");
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    $src = curl_exec($curl);
    curl_close($curl);
    return $src;
}
?>
