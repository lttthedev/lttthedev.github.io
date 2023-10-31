function setProgress(n) {
    document.getElementById('load').style.width = (400 / 20 * n) + 'px';
    document.getElementById('back').style.width = (400 / 20 * (20 - n)) + 'px';
}
setProgress(0);
var i = 0;
var progress = [0, 0, 1, 3, 7, 17, 20];
var timer;
timer = setInterval(function () {
    setProgress(progress[i]);
    i++;
    document.getElementById('body').style.height = window.innerHeight + "px";                 //适应高度
    document.getElementById('center-div').style.height = (window.innerHeight - document.getElementById('info').clientHeight - 10) + "px";   //适应高度
    if (i >= progress.length) {
        if (timer != undefined) {
            clearInterval(timer);
        }
        window.location.href = "./desktop.html";
    }
}, 300);
function toBIOS() {
    if (timer != undefined) {
        clearInterval(timer);
    }
    setTimeout(() => {
        document.getElementById("body").innerHTML = "";
        document.getElementById("body").style.cssText = "background-color: black;"
    }, 500);
    setTimeout(() => {
        window.location.href = "./bios.html"
    }, 1000);
}
window.onkeydown = function (event) {
    event = event || window.event;
    if (event.keyCode == 113) {
        toBIOS()
    }
}
window.ontouchstart = toBIOS;
document.getElementById('center-div').style.height = (window.innerHeight - document.getElementById('info').clientHeight - 10) + "px";   //适应高度
document.oncontextmenu = function () {
    return false;
}
