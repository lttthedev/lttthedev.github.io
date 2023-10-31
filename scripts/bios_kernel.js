var code = "null";
function addZero(i) {
    return i < 10 ? ('0' + i) : i
}
function timeChange() {
    d = new Date()
    document.getElementById('time').innerHTML = "[" + addZero(d.getHours()) + ":" + addZero(d.getMinutes()) + ":" + addZero(d.getSeconds()) + "]";
    document.getElementById('date').innerHTML = "[" + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + "]";

    //顺便适应高度
    // document.getElementById('body').style.height = window.innerHeight + "px";
    // document.getElementById('mainPage').style.height = (window.innerHeight - 150) + 'px';
    // document.getElementById('exitPage').style.height = (window.innerHeight - 150) + 'px';
}
function toBoot() {
    document.getElementById('background').style.display = '';
    setTimeout('document.getElementById(`body`).innerHTML=``;document.getElementById(`body`).style.cssText=`background-color: black;`;', 500); setTimeout('window.location.href=`./boot.html`', 1000); //Boot延迟
}
function BIOS_confirm(tit, okcode, width) {
    document.getElementById('confirm-tit').innerHTML = tit;
    document.getElementById('exit_confirm').style.display = '';
    document.getElementById('background').style.display = '';
    document.getElementById('confirm').style.width = (window.innerWidth * width / 100) + "px";
    code = okcode;
}
setTimeout("timeChange();setInterval(timeChange,1000)", 1000 - (new Date()).getMilliseconds());

var here;
var tab = 0, tab_back = tab;
var btn = 0, btn_back = btn;
var foc = 0, foc_back = foc;
timeChange();
function ChangePage() {
    if (!tab) {
        document.getElementById('exitPage').style.display = 'none';
        document.getElementById('mainPage').style.display = '';
        document.getElementById('exit').style.cssText = 'background-color: #0100a2;color: #aaaaaa;';
        document.getElementById('main').style.cssText = 'color: #ffffff;background-color: #aaaaaa;';
        here = 'main';
        tab = 0;
    } else {
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('exitPage').style.display = '';
        document.getElementById('main').style.cssText = 'background-color: #0100a2;color: #aaaaaa;';
        document.getElementById('exit').style.cssText = 'color: #ffffff;background-color: #aaaaaa;';
        here = 'exit';
        tab = 1;
    }
}
ChangePage();
h = window.innerHeight * 0.15;
w = window.innerWidth * 0.3;
document.getElementById('confirm').style.height = h + "px";
document.getElementById('confirm').style.width = w + "px";
document.oncontextmenu = function () {
    return false;
}
var tabs = ['main', 'exit']
window.onkeydown = function (event) {
    event = event || window.event;
    tab_back = tab;
    if (document.getElementById('background').style.display != '') {
        if (event.keyCode == 9) {
            event.preventDefault();
            tab++;
            foc = 0;
            tab = tab % 2;
            ChangePage();
        }
        if (event.keyCode == 121/*F10=退出*/) {
            event.preventDefault();
            eval(document.getElementById('e1').getAttribute('click'));
        }
        if (event.keyCode == 39) {
            event.preventDefault();
            tab++;
        } else if (event.keyCode == 37) {
            event.preventDefault();
            tab--;
        }
        if (tab + 1 > 0 && tab + 1 <= tabs.length && foc == 0) {
            if ([37, 39].includes(event.keyCode)) {
                ChangePage();
            }
        } else {
            tab = tab_back;
        }
        foc_back = foc;
        if (event.keyCode == 40) {
            event.preventDefault();
            foc++;
        } else if (event.keyCode == 38) {
            event.preventDefault();
            foc--;
        }
        if (tab == 1 && foc <= 3 && foc >= 0) {
            if (!foc) { //0
                if (tab)
                    document.getElementById('exit').style.cssText = 'color: #ffffff;background-color: #aaaaaa;';
                else
                    document.getElementById('main').style.cssText = 'color: #ffffff;background-color: #aaaaaa;';
                for (var i = 1; i <= 3; i++)
                    document.getElementById('e' + i).style.color = "#0100a2";
            } else {
                if (tab)
                    document.getElementById('exit').style.cssText = 'color: #0100a2;background-color: #aaaaaa;';
                else
                    document.getElementById('main').style.cssText = 'color: #0100a2;background-color: #aaaaaa;';
                for (var i = 1; i <= 3; i++)
                    document.getElementById('e' + i).style.color = "#0100a2";
                document.getElementById('e' + foc).style.color = "#fff";
                if (event.keyCode == 13) {
                    eval(document.getElementById('e' + foc).getAttribute('click'));
                }
            }
        } else {
            foc = foc_back;
        }
    } else {
        btn_back = btn;
        if (event.keyCode == 39) {
            event.preventDefault();
            btn++;
        } else if (event.keyCode == 37) {
            event.preventDefault();
            btn--;
        }
        if ([0, 1].includes(btn)) {
            if (btn) {//1
                document.getElementById('cancel-btn').style.cssText = "background-color: #000;color: #fff;";
                document.getElementById('ok-btn').style.cssText = "color: #000;background-color: #fff;";
            } else {//0
                document.getElementById('ok-btn').style.cssText = "background-color: #000;color: #fff;";
                document.getElementById('cancel-btn').style.cssText = "color: #000;background-color: #fff;";
            }
        } else {
            btn = btn_back;
        }
        if (event.keyCode == 13) {
            event.preventDefault();
            if (btn) {
                eval(document.getElementById('cancel-btn').getAttribute('click'));
            } else {
                eval(document.getElementById('ok-btn').getAttribute('click'));
            }
            btn = 0;
            document.getElementById('ok-btn').style.cssText = "background-color: #000;color: #fff;";
            document.getElementById('cancel-btn').style.cssText = "color: #000;background-color: #fff;";
        }
    }
}