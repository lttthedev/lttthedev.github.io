// 后端服务器
// loadlang();
const server = 'http://win12server.freehk.svipss.top/';
const pages = {
    'get-title': '', // 获取标题
};
//settings page list right hight light <span>       @Junchen Yi 
document.querySelectorAll(`list.focs`).forEach(li => {
    li.addEventListener('click', e => {
        let _ = li.querySelector('span.focs'), la = li.querySelector('a.check'),
            las = li.querySelectorAll('a');
        $(_).addClass('cl');
        $(_).css('top', la.offsetTop - las[las.length - 1].offsetTop);
        $(_).css('left', la.offsetLeft - li.offsetLeft);
        setTimeout(() => {
            $(_).removeClass('cl');
        }, 500);
    })
});
// 禁止拖拽图片
$('img').on('dragstart', () => {
    return false;
});
// 右键菜单
$('html').on('contextmenu', () => {
    return false;
});
function stop(e) {
    e.stopPropagation();
    return false;
}
$('input,textarea,*[contenteditable=true]').on('contextmenu', (e) => {
    stop(e);
    return true;
});
function addMenu() {
    var parentDiv = document.getElementById('desktop');
    var childDivs = parentDiv.getElementsByTagName('div');

    for (var i = 0; i < childDivs.length; i++) {
        if (i <= 4) {//win12内置的5个图标不添加
            continue;
        }
        var div = childDivs[i];
        div.setAttribute('iconIndex', i - 5);
        console.log(i - 5, div.getAttribute('appname'))
        div.addEventListener('contextmenu', (event) => {
            if (div.getAttribute('appname') != undefined) {
                return showcm(event, 'desktop.icon', [div.getAttribute('appname'), div.getAttribute('iconIndex')]);
            }
            return false;
        }, useCapture = true);
    }
}
var run_cmd = '';
let nomax = { 'calc': 0 /* 其实，计算器是可以最大化的...*/, 'notepad-fonts': 0, 'camera-notice': 0, 'winver': 0, 'run': 0, 'wsa': 0 };
let nomin = { 'notepad-fonts': 0, 'camera-notice': 0, 'run': 0 };
var topmost = [];
var sys_setting = [1, 1, 1, 0, 0, 1];
var use_music = true;
let cms = {
    'titbar': [
        function (arg) {
            if (arg in nomax) {
                return 'null';
            }
            if ($('.window.' + arg).hasClass("max")) {
                return ['<i class="bi bi-window-stack"></i> Reduction', `maxwin('${arg}')`];
            }
            else {
                return ['<i class="bi bi-window-fullscreen"></i> Maximize', `maxwin('${arg}')`];
            }
        },
        function (arg) {
            if (arg in nomin) {
                return 'null';
            }
            else {
                return ['<i class="bi bi-window-dash"></i> Minimize', `minwin('${arg}')`];
            }
        },
        function (arg) {
            if (arg in nomin) {
                return ['<i class="bi bi-window-x"></i> Close', `hidewin('${arg}', 'configs')`];
            }
            else {
                return ['<i class="bi bi-window-x"></i> Close', `hidewin('${arg}')`];
            }
        },
    ],
    'taskbar': [
        function (arg) {
            return ['<i class="bi bi-window-x"></i> Close', `hidewin('${arg}')`];
        }
    ],
    'desktop': [
        ['<i class="bi bi-arrow-clockwise"></i> Refresh', `$('#desktop').css('opacity','0');setTimeout(()=>{$('#desktop').css('opacity','1');},100);setIcon();`],
        ['<i class="bi bi-circle-square"></i> Switch theme', 'toggletheme()'],
        `<a onmousedown="window.open('https://github.com/lttthedev/lttthedev.github.io','_blank');" win12_title="https://github.com/lttthedev/lttthedev.github.io" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)"><i class="bi bi-github"></i> View this project in Github</a>`,
        function (arg) {
            if (edit_mode) {
                return ['<i class="bi bi-pencil"></i> Exit edit mode', 'editMode();'];
            }
            else if (!edit_mode) {
                return ['<i class="bi bi-pencil"></i> Enter edit mode', 'editMode();'];
            }
        },
        ['<i class="bi bi-info-circle"></i> About Win12 Web version', `$('#win-about>.about').addClass('show');$('#win-about>.update').removeClass('show');openapp('about');if($('.window.about').hasClass('min'))minwin('about');`],
        ['<i class="bi bi-brush"></i> Personalize', `openapp('setting');$('#win-setting > div.menu > list > a.enable.appearance')[0].click()`]
    ],
    'desktop.icon': [
        function (arg) {
            return ['<i class="bi bi-folder2-open"></i> Open', 'openapp(`' + arg[0] + '`)']
        },
        function (arg) {
            if (arg[1] >= 0) {
                return ['<i class="bi bi-trash3"></i> Delete', 'desktopItem.splice(' + (arg[1] - 1) + ', 1);saveDesktop();setIcon();addMenu();'];
            } else {
                return 'null';
            }
        }
    ],
    'winx': [
        function (arg) {
            if ($('#start-menu').hasClass("show")) {
                return ['<i class="bi bi-box-arrow-in-down"></i> Close start menu', `hide_startmenu()`];
            }
            else {
                return ['<i class="bi bi-box-arrow-in-up"></i> Open the start menu', `$('#start-btn').addClass('show');
                if($('#search-win').hasClass('show')){$('#search-btn').removeClass('show');
                $('#search-win').removeClass('show');setTimeout(() => {$('#search-win').removeClass('show-begin');
                }, 200);}$('#start-menu').addClass('show-begin');setTimeout(() => {$('#start-menu').addClass('show');
                }, 0);`];
            }
        },
        '<hr>',
        ['<i class="bi bi-gear"></i> Setting', `openapp('setting')`],
        ['<i class="bi bi-terminal"></i> Run', `openapp('run')`],
        ['<i class="bi bi-folder2-open"></i> File Explorer', `openapp('explorer')`],
        ['<i class="bi bi-search"></i> Search', `$('#search-btn').addClass('show');hide_startmenu();
        $('#search-win').addClass('show-begin');setTimeout(() => {$('#search-win').addClass('show');
        $('#search-input').focus();}, 0);`],
        '<hr>',
        ['<i class="bi bi-power"></i> Shut down', `window.location='shutdown.html'`],
        ['<i class="bi bi-arrow-counterclockwise"></i> Restart', `window.location='reload.html'`],
    ],
    'smapp': [
        function (arg) {
            return ['<i class="bi bi-window"></i> Open', `openapp('${arg[0]}');hide_startmenu();`];
        },
        function (arg) {
            return ['<i class="bi bi-link-45deg"></i> Create link on desktop', "var s=`<div class='b' ondblclick=openapp('" + arg[0] + "')  ontouchstart=openapp('" + arg[0] + "') appname='" + arg[0] + "'><img src='icon/" + geticon(arg[0]) + "'><p>" + arg[1] + "</p></div>`;$('#desktop').append(s);desktopItem[desktopItem.length]=s;addMenu();saveDesktop();"];
        },
        function (arg) {
            return ['<i class="bi bi-x"></i> Unpin', `$('#s-m-r>.pinned>.apps>.sm-app.${arg[0]}').remove()`];
        }
    ],
    'smlapp': [
        function (arg) {
            return ['<i class="bi bi-window"></i> 打开', `openapp('${arg[0]}');hide_startmenu();`];
        },
        function (arg) {
            return ['<i class="bi bi-link-45deg"></i> Create link on desktop', "var s=`<div class='b' ondblclick=openapp('" + arg[0] + "')  ontouchstart=openapp('" + arg[0] + "') appname='" + arg[0] + "'><img src='icon/" + geticon(arg[0]) + "'><p>" + arg[1] + "</p></div>`;$('#desktop').append(s);desktopItem[desktopItem.length]=s;addMenu();saveDesktop();"];
        },
        function (arg) {
            return ['<i class="bi bi-pin-angle"></i> Pin to start menu', "pinapp('" + arg[0] + "', '" + arg[1] + "', 'openapp(&quot;" + arg[0] + "&quot;);hide_startmenu();')"];
        }
    ],
    'msgupdate': [
        ['<i class="bi bi-layout-text-window-reverse"></i> View details', `openapp('about');if($('.window.about').hasClass('min'))
        minwin('about');$('#win-about>.about').removeClass('show');$('#win-about>.update').addClass('show');
        $('#win-about>.update>div>details:first-child').attr('open','open')`],
        ['<i class="bi bi-box-arrow-right"></i> Close', `$('.msg.update').removeClass('show')`]
    ],
    'explorer.folder': [
        arg => {
            return ['<i class="bi bi-folder2-open"></i> 打开', `apps.explorer.goto('${arg}')`];
        },
        arg => {
            return ['<i class="bi bi-arrow-up-right-square"></i> Open in new tab', `apps.explorer.newtab('${arg}');`];
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-trash3"></i> Delete', `apps.explorer.del('${arg}')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-files"></i> Copy', `apps.explorer.copy_or_cut('${arg}','copy')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-scissors"></i> Cut', `apps.explorer.copy_or_cut('${arg}','cut')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-input-cursor-text"></i> Rename', `apps.explorer.rename('${arg}')`];
            return 'null';
        }
    ],
    'explorer.file': [
        arg => {
            return ['<i class="bi bi-folder2-open"></i> Open (currently not available in Mao)', ``];
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-trash3"></i> Delete', `apps.explorer.del('${arg}')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text')[0].innerHTML != "This PC")
                return ['<i class="bi bi-files"></i> Copy', `apps.explorer.copy_or_cut('${arg}','copy')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-scissors"></i> Cut', `apps.explorer.copy_or_cut('${arg}','cut')`];
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-input-cursor-text"></i> Rename', `apps.explorer.rename('${arg}')`];
            return 'null';
        }
    ],
    'explorer.content': [
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-file-earmark-plus"></i> Create a new file', `apps.explorer.add($('#win-explorer>.path>.tit')[0].dataset.path,'Create a new text document.txt')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-folder-plus"></i> New Folder', `apps.explorer.add($('#win-explorer>.path>.tit')[0].dataset.path,'New Folder',type='files')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-file-earmark-arrow-down"></i> Paste', `apps.explorer.paste($('#win-explorer>.path>.tit')[0].dataset.path,'New Folder',type='files')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length > 1)
                return ['<i class="bi bi-arrow-clockwise"></i> Refresh', `apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path, false)`];
            return ['<i class="bi bi-arrow-clockwise"></i> Refresh', `apps.explorer.reset()`];
        }
    ],
    'explorer.tab': [
        arg => {
            return ['<i class="bi bi-x"></i> Close tab', `m_tab.close('explorer',${arg})`];
        }
    ],
    'edge.tab': [
        arg => {
            return ['<i class="bi bi-pencil-square"></i> Name a tab', `apps.edge.c_rename(${arg})`];
        },
        arg => {
            return ['<i class="bi bi-x"></i> Close tab', `m_tab.close('edge',${arg})`];
        }
    ],
    'taskmgr.processes': [
        arg => {
            return ['<i class="bi bi-x"></i> End task', `apps.taskmgr.taskkill('${arg}')`]
        }
    ]
}
window.onkeydown = function (event) {
    if (event.keyCode == 116/*F5被按下(刷新)*/) {
        event.preventDefault();/*取消默认刷新行为*/
        $('#desktop').css('opacity', '0'); setTimeout(() => { $('#desktop').css('opacity', '1'); }, 100); setIcon();
    }
}

function showcm(e, cl, arg) {
    if ($('#cm').hasClass('show-begin')) {
        setTimeout(() => {
            $('#cm').css('left', e.clientX);
            $('#cm').css('top', e.clientY);
            let h = '';
            cms[cl].forEach(item => {
                if (typeof (item) == 'function') {
                    arg.event = e;
                    ret = item(arg);
                    if (ret == 'null') return true;
                    h += `<a class="a" onmousedown="${ret[1]}">${ret[0]}</a>\n`;
                }
                else if (typeof (item) == 'string') {
                    h += item + '\n';
                }
                else {
                    h += `<a class="a" onmousedown="${item[1]}">${item[0]}</a>\n`;
                }
            })
            $('#cm>list')[0].innerHTML = h;
            $('#cm').addClass('show-begin');
            $('#cm>.foc').focus();
            // 这个.foc是用来模拟焦点的，这句是将焦点放在右键菜单上，注释掉后果不堪设想 >u-)o
            // 噢 可是如果设置焦点的话在移动设备上会显示虚拟键盘啊 QAQ (By: User782Tec)
            // (By: tjy-gitnub)
            setTimeout(() => {
                $('#cm').addClass('show');
            }, 0);
            setTimeout(() => {
                if (e.clientY + $('#cm')[0].offsetHeight > $('html')[0].offsetHeight) {
                    $('#cm').css('top', e.clientY - $('#cm')[0].offsetHeight);
                }
                if (e.clientX + $('#cm')[0].offsetWidth > $('html')[0].offsetWidth) {
                    $('#cm').css('left', $('html')[0].offsetWidth - $('#cm')[0].offsetWidth - 5);
                }
            }, 200);
        }, 200);
        return;
    }
    $('#cm').css('left', e.clientX);
    $('#cm').css('top', e.clientY);
    let h = '';
    cms[cl].forEach(item => {
        if (typeof (item) == 'function') {
            ret = item(arg);
            console.log(arg, ret);
            if (ret == 'null') {
                return true;
            }
            h += `<a class="a" onmousedown="${ret[1]}">${ret[0]}</a>\n`;
        } else if (typeof (item) == 'string') {
            h += item + '\n';
        } else {
            h += `<a class="a" onmousedown="${item[1]}">${item[0]}</a>\n`;
        }
    })
    $('#cm>list')[0].innerHTML = h;
    $('#cm').addClass('show-begin');
    $('#cm>.foc').focus();
    setTimeout(() => {
        $('#cm').addClass('show');
    }, 0);
    setTimeout(() => {
        if (e.clientY + $('#cm')[0].offsetHeight > $('html')[0].offsetHeight) {
            $('#cm').css('top', e.clientY - $('#cm')[0].offsetHeight);
        }
        if (e.clientX + $('#cm')[0].offsetWidth > $('html')[0].offsetWidth) {
            $('#cm').css('left', $('html')[0].offsetWidth - $('#cm')[0].offsetWidth - 5);
        }
    }, 200);
}
$('#cm>.foc').blur(() => {
    let x = event.target.parentNode;
    $(x).removeClass('show');
    setTimeout(() => {
        $(x).removeClass('show-begin');
    }, 200);
});
let font_window = false;

// 下拉菜单
dps = {
    'notepad.file': [
        ['<i class="bi bi-file-earmark-plus"></i> New', `hidedp(true);$('#win-notepad>.text-box').addClass('down');
        setTimeout(()=>{$('#win-notepad>.text-box').val('');$('#win-notepad>.text-box').removeClass('down')},200);`],
        ['<i class="bi bi-box-arrow-right"></i> Save as', `hidedp(true);$('#win-notepad>.save').attr('href', window.URL.createObjectURL(new Blob([$('#win-notepad>.text-box').html()])));
        $('#win-notepad>.save')[0].click();`],
        '<hr>',
        ['<i class="bi bi-x"></i> Quit', `isOnDp=false;hidedp(true);hidewin('notepad')`],
    ],
    'notepad.edit': [
        ['<i class="bi bi-files"></i> Copy <info>Ctrl+C</info>', 'document.execCommand(\'copy\')'],
        ['<i class="bi bi-clipboard"></i> Paste <info>Ctrl+V</info>', `document.execCommand(\'paste\')`],
        ['<i class="bi bi-scissors"></i> Cut <info>Ctrl+X</info>', 'document.execCommand(\'cut\')'],
        '<hr>',
        ['<i class="bi bi-arrow-return-left"></i> Cancel <info>Ctrl+Z</info>', 'document.execCommand(\'undo\')'],
        ['<i class="bi bi-arrow-clockwise"></i> Redo <info>Ctrl+Y</info>', 'document.execCommand(\'redo\')'],
    ],
    'notepad.view': [
        ['<i class="bi bi-type"></i> Insert normal text block', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<p>T</p>\''],
        ['<i class="bi bi-type-h1"></i> Insert main title', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<h1>H1</h1>\''],
        ['<i class="bi bi-type-h2"></i> Insert subtitle', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<h2>H2</h2>\''],
        ['<i class="bi bi-type-h3"></i> Insert subtitle', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<h3>H3</h3>\''],
        ['<i class="bi bi-type-underline"></i> insert underline', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<u>U</u>\''],
        ['<i class="bi bi-type-strikethrough"></i> insert strikethrough', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<s>S</s>\''],
        ['<i class="bi bi-type-italic"></i> Insert italics', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<i>I</i>\''],
        ['<i class="bi bi-type-bold"></i> Insert bold text', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<b>B</b>\''],
        '<hr>',
        ['<i class="bi bi-fonts"></i> Font', 'font_window=true;hidedp(true);showwin(\'notepad-fonts\');apps.notepadFonts.reset();'],
    ]
}

function playWindowsBackground() {
    var audio = new Audio("./media/Windows Background.wav")
    audio.play()
}

let dpt = null, isOnDp = false;
$('#dp')[0].onmouseover = () => { isOnDp = true };
$('#dp')[0].onmouseleave = () => { isOnDp = false; hidedp() };
function showdp(e, cl, arg) {
    if ($('#dp').hasClass('show-begin')) {
        $('#dp').removeClass('show');
        setTimeout(() => {
            $('#dp').removeClass('show-begin');
        }, 200);
        if (e != dpt) {
            setTimeout(() => {
                showdp(e, cl, arg);
            }, 400);
        }
        return;
    }
    // dpt = e;
    let off = $(e).offset();
    $('#dp').css('left', off.left);
    $('#dp').css('top', off.top + e.offsetHeight);
    let h = '';
    dps[cl].forEach(item => {
        if (typeof (item) == 'function') {
            ret = item(arg);
            if (ret == 'null') {
                return true;
            }
            h += `<a class="a" onclick="${ret[1]}">${ret[0]}</a>\n`;
        } else if (typeof (item) == 'string') {
            h += item + '\n';
        } else {
            h += `<a class="a" onclick="${item[1]}">${item[0]}</a>\n`;
        }
    })
    $('#dp>list')[0].innerHTML = h;
    $('#dp').addClass('show-begin');
    setTimeout(() => {
        $('#dp').addClass('show');
    }, 0);
    setTimeout(() => {
        if (off.top + e.offsetHeight + $('#dp')[0].offsetHeight > $('html')[0].offsetHeight) {
            $('#dp').css('top', off.top - $('#dp')[0].offsetHeight);
        }
        if (off.left + $('#dp')[0].offsetWidth > $('html')[0].offsetWidth) {
            $('#dp').css('left', $('html')[0].offsetWidth - $('#dp')[0].offsetWidth - 5);
        }
    }, 200);
}
function hidedp(force = false) {
    setTimeout(() => {
        if (isOnDp && !force) {
            return;
        }
        $('#dp').removeClass('show');
        setTimeout(() => {
            $('#dp').removeClass('show-begin');
        }, 200);
    }, 100);
}
// 悬停提示
document.querySelectorAll('*[win12_title]:not(.notip)').forEach(a => {
    a.addEventListener('mouseenter', showdescp);
    a.addEventListener('mouseleave', hidedescp);
})
function showdescp(e) {
    $(e.target).attr('data-descp', 'waiting');
    setTimeout(() => {
        if ($(e.target).attr('data-descp') == 'hide') {
            return;
        }
        $(e.target).attr('data-descp', 'show');
        $('#descp').css('left', e.clientX + 15);
        $('#descp').css('top', e.clientY + 20);
        $('#descp').text($(e.target).attr('win12_title'));
        $('#descp').addClass('show-begin');
        setTimeout(() => {
            if (e.clientY + $('#descp')[0].offsetHeight + 20 >= $('html')[0].offsetHeight) {
                $('#descp').css('top', e.clientY - $('#descp')[0].offsetHeight - 10);
            }
            if (e.clientX + $('#descp')[0].offsetWidth + 15 >= $('html')[0].offsetWidth) {
                $('#descp').css('left', e.clientX - $('#descp')[0].offsetWidth - 10);
            }
            $('#descp').addClass('show');
        }, 100);
    }, 500);
}
function hidedescp(e) {
    $('#descp').removeClass('show');
    $(e.target).attr('data-descp', 'hide');
    setTimeout(() => {
        $('#descp').removeClass('show-begin');
    }, 100);
}

// 提示
let nts = {
    'about': {
        cnt: `<p class="tit">Windows 12 Web version</p>
        <p>Windows 12 for the web is an open source project,<br />
        We hope to allow users to experience Windows 12 in advance on the Internet,<br />
        Content may not be consistent with the official version of Windows 12. <br />
        Use standard web technologies such as HTML, CSS and JS<br />
        This project is in no way affiliated with Microsoft and should not be confused with Microsoft operating systems or products,<br />
        This is not a Windows365 cloud PC either<br />
        Microsoft, Windows and other demonstration products included in this project are trademarks of Microsoft Corporation<br />
        Google, Android and other demonstration products in this project are trademarks of Google Inc.</p>`,
        btn: [
            { type: 'main', text: 'Close', js: 'closenotice();' },
            { type: 'detail', text: 'More', js: "closenotice();openapp('about');if($('.window.about').hasClass('min'))minwin('about');$('.dock.about').removeClass('show')" },
        ]
    },
    'feedback': {
        cnt: `<p class="tit">Feedback</p>
            <p>We attach great importance to user experience and feedback</p>
            <list class="new">
                <a class="a" onclick="window.open('https://github.com/lttthedev/lttthedev.github.io/issues','_blank');" win12_title="Open link in new browser window" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">Submit an issue on github (a github account is required and will receive higher attention)</a>
                <a class="a" onclick="window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__SDw7SZURjUzOUo0VEVXU1pMWlFTSUVGWDNYWU1EWS4u','_blank');" win12_title="Open link in new browser window" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">Send feedback on Microsoft Forms (no account required, will be taken seriously)</a>
            </list>`,
        btn: [
            { type: 'main', text: 'Close', js: 'closenotice();' },
        ]
    },
    'widgets': {
        cnt: `
            <p class="tit">Add widget</p>
            <list class="new">
                <a class="a" onclick="closenotice(); widgets.widgets.add('calc');">Caculator</a>
                <a class="a" onclick="closenotice(); widgets.widgets.add('weather');">Weather</a>
                <a class="a" onclick="closenotice(); widgets.widgets.add('monitor');">System Performance Monitor</a>
            </list>`,
        btn: [
            { type: 'cancel', text: 'Cancel', js: 'closenotice();' }
        ]
    },
    'ZeroDivision': {//计算器报错窗口
        // 甚至还报错我真的哭死，直接输入框显示给error啥的不就完了。。
        cnt: `<p class="tit">Wrong</p>
            <p>The divisor must not be equal to 0</p>`,
        btn: [
            { type: 'main', text: 'Sure', js: 'closenotice();' },
        ]
    },
    'Can-not-open-file': {
        cnt: `<p class="tit">` + run_cmd + `</p>
        <p>Windows cannot find file '` + run_cmd + `'. Please make sure the file name is correct and try again.</p> `,
        btn: [
            { type: 'main', text: 'Sure', js: 'closenotice();' },
            { type: 'detail', text: 'Search in Microsoft Edge', js: 'closenotice();openapp(\'edge\');window.setTimeout(() => {apps.edge.newtab();apps.edge.goto(' + run_cmd + ');}, 300);' }
        ]
    },
    'widgets.monitor': {
        cnt: `
        <p class="tit">Switch monitor type</p>
        <list class="new">
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'cpu';">CPU Utilization</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'memory';">Memory usage</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'disk';">Disk active time</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'wifi-receive';">Network throughput - receive</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'wifi-send';">Network throughput - send</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'gpu';">GPU Utilization</a>
        </list>`,
        btn: [
            { type: 'cancel', text: 'Cancel', js: 'closenotice();' }
        ]
    },
    'widgets.desktop': {
        cnt: `
            <p class="tit">Add desktop widget</p>
            <list class="new">
                <a class="a" onclick="closenotice(); widgets.widgets.add('calc'); widgets.widgets.addToDesktop('calc');">Caculator</a>
                <a class="a" onclick="closenotice(); widgets.widgets.add('weather'); widgets.widgets.addToDesktop('weather');">Weather</a>
                <a class="a" onclick="closenotice(); widgets.widgets.add('monitor'); widgets.widgets.addToDesktop('monitor');">System performance monitor</a>
            </list>`,
        btn: [
            { type: 'cancel', text: 'Cancel', js: 'closenotice();' }
        ]
    },
    'duplication file name': {
        cnt: `
            <p class="tit">Mistake</p>
            <p>Duplicate file name</p>`,
        btn: [
            { type: 'cancel', text: 'Cancel', js: 'closenotice();' }
        ]
    },
    'about-copilot': {
        cnt: `
        <p class="tit">About Windows 12 Copilot</p>
        <p>You can use this AI assistant to help you complete your work faster (anyone works with win12?)<br>
        Due to poor understanding of chatgpt3.5, it works normally intermittently. <br>
        If you have any feedback about this AI, please ask AI to help you open the copilot feedback interface<br>
        Because chatgpt is free, please use it in moderation and don’t be too aggressive. <br>
        Please also use it appropriately and do not talk about sensitive or illegal topics. If your account is blocked, no one will be affected. <br>Please have the most basic moral bottom line as a human being. <br>
        Small projects will inevitably have bugs, please forgive me, the backend is provided by github @NB-Bgroup</p>`,
        btn: [
            { type: 'main', text: 'Sure', js: 'closenotice();' },
        ]
    },
    'feedback-copilot': {
        cnt: `<p class="tit">Feedback Windows 12 Copilot</p>
        <p>We attach great importance to user experience and feedback, and we are very grateful for your suggestions on AI Copilot</p>
        <list class="new">
            <a class="a" onclick="window.open('https://github.com/lttthedev/lttthedev.github.io/issues','_blank');" win12_title="Open link in new browser window" onmouseenter ="showdescp(event)" onmouseleave="hidedescp(event)">Submit an issue on github (a github account is required and will receive higher attention)</a>
            " Open the link" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">Send feedback on Microsoft Forms (no account required, will be taken seriously)</a>
        </list>
            `,
        btn: [
            { type: 'main', text: 'Close', js: 'closenotice();' }
        ]
    },
    'shutdown': {
        cnt: `
        <p class="tit">You will be logged out soon</p>
        <p>Windows will shut down in 114514 minutes. </p>`,
        btn: [
            { type: 'main', text: 'close', js: 'closenotice();' }
        ]
    },
    'setting.update': {
        cnt: `
            <p class="tit">Update is ready</p>
            <p>Please restart your computer to apply the update</p>
        `,
        btn: [
            { type: 'main', text: 'Restart now', js: 'location.href = `./reload.html`;' },
            { type: 'detail', text: 'Restart later', js: 'closenotice();' }
        ]
    }
}
function shownotice(name) {
    $('#notice>.cnt').html(nts[name].cnt);
    let tmp = '';
    nts[name].btn.forEach(btn => {
        tmp += `<a class="a btn ${btn.type}" onclick="${btn.js}">${btn.text}</a>`
    });
    $('#notice>.btns').html(tmp);
    $('#notice-back').addClass('show');
    setTimeout(() => {
        $('#notice').addClass('show');
    }, 200);
}
function closenotice() {
    $('#notice').removeClass('show');
    setTimeout(() => {
        $('#notice-back').removeClass('show');
    }, 200);
}
var shutdown_task = []; //关机任务，储存在这个数组里
// 为什么要数组？
// 运行的指令
function runcmd(cmd) {
    if (cmd.slice(0, 3) == "cmd") {
        run_cmd = cmd;
        openapp('terminal');
        return true;
    }
    else if (cmd in apps) {
        openapp(cmd);
        return true;
    }
    else if (cmd.replace('.exe', '') in apps) {
        openapp(cmd.replace('.exe', ''))
        return true;
    }
    else if (cmd.includes("shutdown")) {//关机指令
        run_cmd = cmd
        var cmds = cmd.split(' ');
        if (cmds.includes("shutdown") || cmds.includes("shutdown.exe")) { //帮助
            if (cmds.length == 1) {
                openapp('terminal');
                $('#win-terminal').html(`
<pre>
shutdown [-s] [-r] [-f] [-a] [-t time]
-s: shutdown
-r: restart
-f: logout
-a: Cancel previous operation
-t time: Specifies to operate after time seconds作

I won’t introduce much else.
Please press any key to continue.&nbsp;.&nbsp;.<input type="text" onkeydown="hidewin('terminal')"></input></pre>`); //Q：为什么文字这么多呢？A：shutdown的帮助本来就多，为了能显示空格，就把空格用&nbsp;代替了
                // 所以你是没事干吗？。。提示：github并不是以行数来计算贡献的哦   from @tjy-gitnub
                $('#win-terminal>pre>input').focus()
            }
            else if (cmds.includes("-s") || cmds.includes("/s")) {//关机
                if ((cmds.indexOf("-t") != -1 && cmd.length/*判断是否-t后有其他参数*/ >= cmds.indexOf("-t") + 2/*先加一，获取当下标是从1开始的时候的下标索引；再加一，获取下一项。配合数组.length使用*/) || (cmds.indexOf("/t") != -1 && cmd.length/*判断是否-t后有其他参数*/ >= cmds.indexOf("/t") + 2)) {
                    str = "";
                    if (cmds.includes("-t")) { str = "-t"; }
                    if (cmds.includes("/t")) { str = "/t"; }
                    if (!isNaN(cmds[cmds.indexOf(str) + 1]/*这里只加一是因为下标是从0开始的*/)) {
                        num = parseInt(cmds[cmds.indexOf(str) + 1])
                        nts['shutdown'] = {
                            cnt: `
                            <p class="tit">You will be logged out soon</p>
                            <p>Windows will shut down after ` + calcTimeString(num) + `. </p>`, // 如果必须原生样式的，建议改为 num<60 ? 1 : Math.floor(num / 60) + ` 分钟后关闭。</p>`,
                            btn: [
                                { type: 'main', text: 'Close', js: 'closenotice();' },
                            ]
                        };
                        shutdown_task[shutdown_task.length] = setTimeout("window.location.href = './shutdown.html'", num * 1000);
                        if (!(cmds.includes("/f") || cmds.includes("-f"))) {
                            shownotice('shutdown');
                        }
                    }
                }
            }
            else if (cmds.includes("-r") || cmds.includes("/r")) {//重启
                if ((cmds.indexOf("-t") != -1 && cmd.length >= cmds.indexOf("-t") + 2) || (cmds.indexOf("/t") != -1 && cmd.length >= cmds.indexOf("/t") + 2)) {/*详见上面的注释*/
                    str = "";
                    if (cmds.includes("-t")) { str = "-t"; }
                    if (cmds.includes("/t")) { str = "/t"; }
                    if (!isNaN(cmds[cmds.indexOf(str) + 1])) {
                        num = parseInt(cmds[cmds.indexOf(str) + 1])
                        nts['shutdown'] = {
                            cnt: `
                            <p class="tit">You will be logged out soon</p>
                            <p>Windows will shut down after ` + calcTimeString(num) + `. </p>`, // 如果必须原生样式的，建议改为 num<60 ? 1 : Math.floor(num / 60) + ` 分钟后关闭。</p>`,
                            btn: [
                                { type: 'main', text: 'Close', js: 'closenotice();' },
                            ]
                        };
                        shutdown_task[shutdown_task.length] = setTimeout("window.location.href = './reload.html'", num * 1000);
                        if (!(cmds.includes("/f") || cmds.includes("-f"))) {
                            shownotice('shutdown');
                        }
                    }
                }
            }
            else if (cmds.includes("-a") || cmds.includes("/a")) {//取消电源操作
                if (shutdown_task.length > 0) {
                    for (var i = 0; i < shutdown_task.length; i++) {
                        if (shutdown_task[i] != null) {
                            try {
                                clearTimeout(shutdown_task[i]);
                            } catch (err) { console.log(err); }
                            shutdown_task[i] = null;
                        }
                    }
                    nts['shutdown'] = {
                        cnt: `
                        <p class="tit">Logout canceled</p>
                        <p>The planned Close has been cancelled.</p>`,
                        btn: [
                            { type: 'main', text: 'Close', js: 'closenotice();' },
                        ]
                    };
                    shownotice('shutdown');
                }
            }
            return true;
        }
    }
    return false;
}
// 应用
let apps = {
    setting: {
        init: () => {
            $('#win-setting>.menu>list>a.system')[0].click();
            $('#win-setting>.page>.cnt.update>.setting-list>div:last-child>.alr>a.checkbox')[localStorage.getItem('autoUpdate') == 'true' ? 'addClass' : 'removeClass']('checked');
            apps.setting.checkUpdate();
        },
        page: (name) => {
            $('#win-setting>.page>.cnt.' + name).scrollTop(0);
            $('#win-setting>.page>.cnt.show').removeClass('show');
            $('#win-setting>.page>.cnt.' + name).addClass('show');
            $('#win-setting>.menu>list>a.check').removeClass('check');
            $('#win-setting>.menu>list>a.' + name).addClass('check');
        },
        theme_get: () => {
            $('#set-theme').html(`<loading><svg width="30px" height="30px" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle>
            <circle cx="8px" cy="8px" r="7px" style="stroke:#2983cc;stroke-width:3px;"></circle></svg></loading>`)
            // 实时获取主题
            $.get('https://api.github.com/repos/tjy-gitnub/win12-theme/contents').then(cs => {
                cs.forEach(c => {
                    if (c.type == 'dir') {
                        $.get(c.url).then(cnt => {
                            $('#set-theme').html('');
                            cnt.forEach(cn => {
                                if (cn.name == 'theme.json') {
                                    $.getJSON('https://tjy-gitnub.github.io/win12-theme/' + cn.path).then(inf => {
                                        infjs = inf;
                                        if ($('#set-theme>loading').length)
                                            $('#set-theme').html('');
                                        $('#set-theme').append(`<a class="a act" onclick="apps.setting.theme_set('${c.name}')" style="background-image:url('https://tjy-gitnub.github.io/win12-theme/${c.name}/view.jpg')">${c.name}</a>`);
                                    })
                                }
                            })
                        })
                    }
                });
            });
        },
        theme_set: (infp) => {
            $.get('https://api.github.com/repos/tjy-gitnub/win12-theme/contents/' + infp).then(cnt => {
                console.log('https://api.github.com/repos/tjy-gitnub/win12-theme/contents/' + infp);
                cnt.forEach(cn => {
                    if (cn.name == 'theme.json') {
                        $.getJSON('https://tjy-gitnub.github.io/win12-theme/' + cn.path).then(inf => {
                            infjs = inf;
                            cnt.forEach(fbg => {
                                console.log(fbg, infjs);
                                if (fbg.name == infjs.bg) {
                                    $(':root').css('--bgul', `url('https://tjy-gitnub.github.io/win12-theme/${fbg.path}')`);
                                    $(':root').css('--theme-1', infjs.color1);
                                    $(':root').css('--theme-2', infjs.color2);
                                    $(':root').css('--href', infjs.href);
                                    // $('#set-theme').append(`<a class="a act" onclick="apps.setting.theme_set(\`(${inf})\`)" style="background-image:url('https://tjy-gitnub.github.io/win12-theme/${fbg.path}')">${c.name}</a>`);
                                }
                            })
                        })
                    }
                })
            })
        },
        checkUpdate: () => {
            $('#win-setting>.page>.cnt.update>.lo>.update-main .notice')[0].innerText = 'Checking for updates...';
            $('#win-setting>.page>.cnt.update>.lo>.update-main .detail')[0].innerHTML = '&nbsp;';
            $('#win-setting>.page>.cnt.update>.setting-list>.update-now').addClass('disabled');
            $('#win-setting>.page>.cnt.update>.setting-list>.update-now>div>p:first-child')[0].innerText = 'Checking for updates...';
            $('#win-setting>.page>.cnt.update>.setting-list>.update-now>div>p:last-child')[0].innerHTML = '&nbsp;';
            $('#win-setting>.page>.cnt.update>.lo>.update-main>div:last-child').addClass('disabled');
            fetch('https://api.github.com/repos/tjy-gitnub/win12/commits').then(res => {
                res.json().then(json => {
                    const sha = localStorage.getItem('sha');
                    if (sha != json[0].sha) {
                        let msg = json[0].commit.message.split('\n\n')[0];
                        if (msg.match(/v[0-9]*\.[0-9]*\.[0-9]*/)) {
                            msg = msg.match(/v[0-9]*\.[0-9]*\.[0-9]*/)[0];
                            window.setTimeout(() => {
                                $('#win-setting>.page>.cnt.update>.lo>.update-main .notice')[0].innerText = 'Updates are available for Windows 12';
                                $('#win-setting>.page>.cnt.update>.lo>.update-main .detail')[0].innerText = `The latest version: ${msg}`;
                                $('#win-setting>.page>.cnt.update>.lo>.update-main>div:last-child').removeClass('disabled');
                                $('#win-setting>.page>.cnt.update>.setting-list>.update-now>div>p:first-child')[0].innerText = 'Update is ready';
                                $('#win-setting>.page>.cnt.update>.setting-list>.update-now>div>p:last-child')[0].innerText = msg;
                                $('#win-setting>.page>.cnt.update>.setting-list>.update-now').removeClass('disabled');
                            }, 6000);
                        }
                        else {
                            window.setTimeout(() => {
                                let da = new Date();
                                $('#win-setting>.page>.cnt.update>.lo>.update-main .notice')[0].innerText = 'Windows 12 is currently the latest version';
                                $('#win-setting>.page>.cnt.update>.lo>.update-main .detail')[0].innerText = `Last check time: ${da.getFullYear()}年${da.getMonth() + 1}月${da.getDate()}日，${da.getHours()}: ${da.getMinutes()}`;
                                $('#win-setting>.page>.cnt.update>.lo>.update-main>div:last-child').removeClass('disabled');
                                $('#win-setting>.page>.cnt.update>.setting-list>.update-now>div>p:first-child')[0].innerText = 'No updates available';
                                $('#win-setting>.page>.cnt.update>.setting-list>.update-now>div>p:last-child')[0].innerText = 'Windows 12 is currently the latest version';
                            }, 6000)
                        }
                    }
                });
            });
        }
    },
    run: {
        init: () => {
            $('#win-run>.open>input').val(run_cmd);   //在windows中，运行输入的内容会被保留
            window.setTimeout(() => {
                $('#win-run>.open>input').focus();
                $('#win-run>.open>input').select();
            }, 300);
        },
        run: (cmd) => {
            if (!runcmd(cmd)) {
                if (cmd != '') {
                    try {
                        cmd = cmd.replace(/\/$/, '');
                        var pathl = cmd.split('/');
                        let tmp = apps.explorer.path;
                        let valid = true;
                        pathl.forEach(name => {
                            if (tmp['folder'].hasOwnProperty(name)) {
                                tmp = tmp['folder'][name];
                            }
                            else {
                                valid = false;
                                return false;
                            }
                        });
                        if (valid == true) {
                            run_cmd = cmd;
                            openapp('explorer');
                            window.setTimeout(() => {
                                apps.explorer.goto(cmd);
                            }, 300);
                        }
                        else {
                            nts['Can-not-open-file'] = {
                                cnt: `<p class="tit">` + cmd + `</p>
                                <p>Windows cannot find file '` + cmd + `'。Please make sure the file name is correct and try again.</p> `,
                                btn: [
                                    { type: 'main', text: 'Sure', js: "closenotice();showwin('run');$('#win-run>.open>input').select();" },
                                    { type: 'cancel', text: 'Search in Microsoft Edge', js: "closenotice();openapp(\'edge\');window.setTimeout(() => {apps.edge.newtab();apps.edge.goto('https://www.bing.com/search?q=" + encodeURIComponent(cmd) + "');}, 300);" }
                                ]
                            }
                            shownotice('Can-not-open-file');
                        }
                    }
                    catch {
                        nts['Can-not-open-file'] = {
                            cnt: `<p class="tit">` + cmd + `</p>
                            <p>Windows cannot find file '` + cmd + `'。Please make sure the file name is correct and try again.</p> `,
                            btn: [
                                { type: 'main', text: 'Sure', js: "closenotice();showwin('run');$('#win-run>.open>input').select();" },
                                { type: 'cancel', text: 'Search in Microsoft Edge', js: "closenotice();openapp(\'edge\');window.setTimeout(() => {apps.edge.newtab();apps.edge.goto('https://www.bing.com/search?q=" + encodeURIComponent(cmd) + "');}, 300);" }
                            ]
                        }
                        shownotice('Can-not-open-file');
                    }
                }
            }
        }
    },
    taskmgr: {
        sortType: 'cpu',
        sortOrder: 'up-down',
        tasks: structuredClone(taskmgrTasks),
        cpu: 0,
        cpuCtx: null,
        cpuCanvas: null,
        cpuLastPos: [0, 0],
        cpuBgCanvas: null,
        cpuBgCtx: null,
        cpuRunningTime: 0,
        memory: 0,
        memoryCtx: null,
        memoryCanvas: null,
        memoryLastPos: [0, 0],
        memoryBgCanvas: null,
        memoryBgCtx: null,
        memoryCanvas2: null,
        memoryCtx2: null,
        disk: 0,
        diskSpeed: {
            read: 0,
            write: 0
        },
        diskCanvas: null,
        diskCtx: null,
        diskLastPos: [0, 0],
        diskBgCanvas: null,
        diskBgCtx: null,
        diskCanvas2: null,
        diskCtx2: null,
        diskBgCanvas2: null,
        diskBgCtx2: null,
        diskLastPos2: {
            read: [0, 0],
            write: [0, 0]
        },
        wifi: [0, 0],
        wifiCanvas: null,
        wifiCtx: null,
        wifiLastPos: [[0, 0], [0, 0]],
        wifiBgCanvas: null,
        wifiBgCtx: null,
        gpu: {
            d3: 0,
            copy: 0,
            videod: 0,
            videop: 0,
            usage: 0
        },
        gpuMemory: {
            private: 0,
            public: 0
        },
        gpuCtx: [null, null, null, null],
        gpuCanvas: [null, null, null, null],
        gpuLastPos: [[0, 0], [0, 0], [0, 0], [0, 0]],
        gpuBgCanvas: [null, null, null, null],
        gpuBgCtx: [null, null, null, null],
        gpuCanvas2: [null, null],
        gpuCtx2: [null, null],
        gpuLastPos2: [[0, 0], [0, 0]],
        gpuBgCanvas2: [null, null],
        gpuBgCtx2: [null, null],
        gpuCanvas3: null,
        gpuCtx3: null,
        gpuLastPos3: [0, 0],
        processList: [],
        handle: 0,
        init: () => {
            $('#win-taskmgr>.menu>list.focs>a')[0].click();
        },
        load: (init_all = true) => {
            if (init_all == true) {
                $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(3)>.value')[0].innerText = apps.taskmgr.tasks.length;

                apps.taskmgr.cpuCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu canvas.chart')[0];
                apps.taskmgr.cpuBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu canvas.bg')[0];
                apps.taskmgr.initgraph('cpu', '#2983cc');

                apps.taskmgr.memoryCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory canvas.chart')[0];
                apps.taskmgr.memoryBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory canvas.bg')[0];
                apps.taskmgr.initgraph('memory', '#660099');
                apps.taskmgr.memoryCanvas2 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory canvas.chart2')[0];
                apps.taskmgr.memoryCtx2 = apps.taskmgr.memoryCanvas2.getContext('2d');
                apps.taskmgr.memoryCtx2.fillStyle = '#66009922';
                apps.taskmgr.memoryCtx.lineWidth = 4;

                apps.taskmgr.diskCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.chart')[0];
                apps.taskmgr.diskBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.bg')[0];
                apps.taskmgr.initgraph('disk', '#008000');
                apps.taskmgr.diskCanvas2 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.chart2')[0];
                apps.taskmgr.diskLastPos2 = {
                    read: [apps.taskmgr.diskCanvas2.width, apps.taskmgr.diskCanvas2.height],
                    write: [apps.taskmgr.diskCanvas2.width, apps.taskmgr.diskCanvas2.height]
                }
                apps.taskmgr.diskCtx2 = apps.taskmgr.diskCanvas2.getContext('2d');
                apps.taskmgr.diskCtx2.strokeStyle = '#008000';
                apps.taskmgr.diskCtx2.fillStyle = '#00800022';
                apps.taskmgr.diskCtx2.lineWidth = 3;
                apps.taskmgr.diskBgCanvas2 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.bg2')[0];
                apps.taskmgr.diskBgCtx2 = apps.taskmgr.diskBgCanvas2.getContext('2d');
                apps.taskmgr.diskBgCtx2.strokeStyle = '#aeaeae';
                apps.taskmgr.diskBgCtx2.lineWidth = 1;

                for (var i = 0; i < 4; i++) {
                    apps.taskmgr.gpuCanvas[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.graphs>.graph' + (i + 1) + '>.chart>canvas.chart')[0];
                    apps.taskmgr.gpuBgCanvas[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.graphs>.graph' + (i + 1) + '>.chart>canvas.bg')[0];
                    apps.taskmgr.gpuCtx[i] = apps.taskmgr.gpuCanvas[i].getContext('2d');
                    apps.taskmgr.gpuBgCtx[i] = apps.taskmgr.gpuBgCanvas[i].getContext('2d');
                    apps.taskmgr.gpuCtx[i].strokeStyle = '#2983cc';
                    apps.taskmgr.gpuCtx[i].fillStyle = '#2983cc22';
                    apps.taskmgr.gpuCtx[i].lineWidth = 4;
                    apps.taskmgr.gpuLastPos[i] = [apps.taskmgr.gpuCanvas[i].width, apps.taskmgr.gpuCanvas[i].height];
                    apps.taskmgr.gpuBgCtx[i].strokeStyle = '#aeaeae';
                    apps.taskmgr.gpuBgCtx[i].lineWidth = 3;
                    apps.taskmgr.initgrids(apps.taskmgr.gpuBgCtx[i]);
                }
                for (var i = 0; i < 2; i++) {
                    apps.taskmgr.gpuCanvas2[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.gpu2-' + (i + 1) + '>canvas.chart2')[0];
                    apps.taskmgr.gpuBgCanvas2[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.gpu2-' + (i + 1) + '>canvas.bg2')[0];
                    apps.taskmgr.gpuCtx2[i] = apps.taskmgr.gpuCanvas2[i].getContext('2d');
                    apps.taskmgr.gpuBgCtx2[i] = apps.taskmgr.gpuBgCanvas2[i].getContext('2d');
                    apps.taskmgr.gpuCtx2[i].strokeStyle = '#2983cc';
                    apps.taskmgr.gpuCtx2[i].fillStyle = '#2983cc22';
                    apps.taskmgr.gpuCtx2[i].lineWidth = 3;
                    apps.taskmgr.gpuLastPos2[i] = [apps.taskmgr.gpuCanvas2[i].width, apps.taskmgr.gpuCanvas2[i].height];
                    apps.taskmgr.gpuBgCtx2[i].strokeStyle = '#aeaeae';
                    apps.taskmgr.gpuBgCtx2[i].lineWidth = 1;
                    apps.taskmgr.initgrids(apps.taskmgr.gpuBgCtx2[i]);
                }
                apps.taskmgr.gpuCanvas3 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.graphs>canvas.usage')[0];
                apps.taskmgr.gpuCtx3 = apps.taskmgr.gpuCanvas3.getContext('2d');
                apps.taskmgr.gpuCtx3.strokeStyle = '#2983cc';
                apps.taskmgr.gpuCtx3.fillStyle = '#2983cc22';
                apps.taskmgr.gpuCtx3.lineWidth = 4;
                apps.taskmgr.gpuLastPos3 = [apps.taskmgr.gpuCanvas3.width, apps.taskmgr.gpuCanvas3.height];

                apps.taskmgr.wifiCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi canvas.chart')[0];
                apps.taskmgr.wifiBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi canvas.bg')[0];
                apps.taskmgr.initgraph('wifi', '#8e5829', false);
                apps.taskmgr.wifiLastPos = [
                    [apps.taskmgr.wifiCanvas.width, apps.taskmgr.wifiCanvas.height],
                    [apps.taskmgr.wifiCanvas.width, apps.taskmgr.wifiCanvas.height]
                ]
            }

            if (apps.taskmgr.preLoaded != true && apps.taskmgr.loaded != true) {
                apps.taskmgr.gpuMemory.private = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.gpuMemory.public = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.generateProcesses();
                apps.taskmgr.sort();
                apps.taskmgr.loadProcesses();
                apps.taskmgr.performanceLoad();
            }

            if (init_all == true) {
                apps.taskmgr.loadProcesses();
                apps.taskmgr.generateProcesses();
                apps.taskmgr.sort();
                apps.taskmgr.performanceLoad();
                apps.taskmgr.graphLoad();
                apps.taskmgr.initgrids(apps.taskmgr.cpuBgCtx);
                apps.taskmgr.initgrids(apps.taskmgr.memoryBgCtx);
                apps.taskmgr.initgrids(apps.taskmgr.diskBgCtx);
                apps.taskmgr.initgrids(apps.taskmgr.diskBgCtx2);
                apps.taskmgr.initgrids(apps.taskmgr.wifiBgCtx);
                window.setInterval(() => {
                    apps.taskmgr.loadProcesses();
                    apps.taskmgr.generateProcesses();
                    apps.taskmgr.sort();
                    apps.taskmgr.performanceLoad();
                    apps.taskmgr.graphLoad();
                    apps.taskmgr.gridLine();
                }, 1000);
            }
            else if (apps.taskmgr.loaded != true && apps.taskmgr.preLoaded != true) {
                window.setInterval(() => {
                    apps.taskmgr.loadProcesses();
                    apps.taskmgr.generateProcesses();
                    apps.taskmgr.sort();
                    apps.taskmgr.performanceLoad();
                }, 1000);
            }
        },
        page: (name) => {
            $('#win-taskmgr>.main>.cnt.' + name).scrollTop(0);
            $('#win-taskmgr>.main>.cnt.show').removeClass('show');
            $('#win-taskmgr>.main>.cnt.' + name).addClass('show');
            $('#win-taskmgr>.menu>list.focs>a.check').removeClass('check');
            $('#win-taskmgr>.menu>list.focs>a.' + name).addClass('check');
            if (!(name == 'processes' || name == '404')) {
                document.getElementById('tsk-search').style.display = 'none';
            } else {
                document.getElementById('tsk-search').style.display = '';
            }
        },
        graph: (name) => {
            $('#win-setting>.page>.cnt.' + name).scrollTop(0);
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.show').removeClass('show');
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.' + name).addClass('show');
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.check').removeClass('check');
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.' + name).addClass('check');
        },
        generateProcesses: () => {
            let processList = [];
            let max = 100 / apps.taskmgr.tasks.length;
            let cpusum = 0, memorysum = 0, disksum = 0, diskUsing = Number(Math.random()) > 0.7/*, color = window.getComputedStyle(page, null).getPropertyValue('--href')*/;
            var Search_length = 0;
            for (const elt of apps.taskmgr.tasks) {
                let cpu = Number((Math.random() * max).toFixed(1)),
                    memory = apps.taskmgr.memory != 0 ? apps.taskmgr.memory / apps.taskmgr.tasks.length + Number(((Math.random() - 0.5) / 5).toFixed(1)) : Number((Math.random() * max).toFixed(1)),
                    disk = Number((Math.random() * max).toFixed(1)) > (max / 1.2) && diskUsing ? max * Number(Math.random().toFixed(1)) : 0;
                cpusum = Number((cpusum + cpu).toFixed(1));
                memorysum = Number((memorysum + memory).toFixed(1));
                disksum = Number((disksum + disk).toFixed(1));
                if (document.getElementById('tsk-search').value != '' && document.getElementById('tsk-search').style.display == '' && (!elt.name.toLowerCase().includes(document.getElementById('tsk-search').value.toLowerCase()/* 搜索时转换成小写 */))) {
                    continue //搜索
                }
                processList.splice(processList.length, 0, {
                    name: elt.name,
                    icon: elt.icon || '',
                    system: elt.system,
                    cpu: cpu,
                    memory: memory,
                    disk: disk
                });
                Search_length++;
            }
            if (Search_length == 0) {
                apps.taskmgr.page('404')
            } else {
                if (document.getElementById('tsk-search').value != '' && document.getElementById('tsk-search').style.display == '') {
                    apps.taskmgr.page('processes')
                }
            }
            apps.taskmgr.cpu = cpusum;
            apps.taskmgr.memory = memorysum;
            apps.taskmgr.disk = disksum;
            apps.taskmgr.processList = processList;

        },
        loadProcesses: (processList = apps.taskmgr.processList) => {
            const processContainer = $('#win-taskmgr>.main>.cnt.processes tbody.view')[0];
            const values = $('#win-taskmgr>.main>.cnt.processes thead>tr>th>.value');
            const cpu = values[0], memory = values[1], disk = values[2];
            let selected;
            if ($('#win-taskmgr>.main>.cnt.processes tbody.view>tr.select>td:first-child>.text')[0]) {
                selected = $('#win-taskmgr>.main>.cnt.processes tbody.view>tr.select>td:first-child>.text')[0].innerText;
            }
            let max = 100 / apps.taskmgr.tasks.length;
            processContainer.innerHTML = '';
            for (const elt of processList) {
                const newElt = document.createElement('tr');
                newElt.classList.add('notrans');
                newElt.innerHTML = `<td><div class="text"><div class="icon" style="background-image: url('${elt.icon ? elt.icon : ''}');"></div>${elt.name}</div></td><td style="text-align: right;background-color: ${page.classList.contains('dark') ? '#193662' : '#7ec6ec'}${elt.cpu >= (max / 1.3) ? 'ff' : 'aa'};">${elt.cpu.toFixed(1)}%</td><td style="text-align: right;background-color: ${page.classList.contains('dark') ? '#193662' : '#7ec6ec'}${elt.memory >= (max / 1.3) ? 'ff' : 'aa'};">${elt.memory.toFixed(1)}%</td><td style="text-align: right;background-color: ${page.classList.contains('dark') ? '#193662' : '#7ec6ec'}${elt.disk >= (max / 1.3) ? 'ff' : 'aa'};">${elt.disk.toFixed(1)}%</td><td>${['非常低', '非常低', '非常低', '低', '中'][Math.floor(Math.random() * 5)]}</td>`;
                if (elt.name == selected) {
                    newElt.classList.add('select');
                }
                processContainer.appendChild(newElt);
                newElt.onclick = function () {
                    apps.taskmgr.selectProcess(this);
                }
                newElt.oncontextmenu = function (e) {
                    return showcm(e, 'taskmgr.processes', elt.name);
                }
                window.setTimeout(() => {
                    newElt.classList.remove('notrans');
                }, 100);
            }
            cpu.innerText = apps.taskmgr.cpu.toFixed(1) + '%';
            memory.innerText = apps.taskmgr.memory.toFixed(1) + '%';
            disk.innerText = apps.taskmgr.disk.toFixed(1) + '%';
        },
        sort: (processList = apps.taskmgr.processList, type = apps.taskmgr.sortType, order = apps.taskmgr.sortOrder) => {
            processList.sort((a, b) => {
                if (a[type] > b[type]) {
                    return order == 'up-down' ? -1 : 1;
                }
                else if (a[type] <= b[type]) {
                    return order == 'up-down' ? 1 : -1;
                }
            });
            apps.taskmgr.processList = processList;
        },
        performanceLoad: () => {
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.cpu.toFixed(1)}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(2)>.value')[0].innerText = `${(3200 / 100 * apps.taskmgr.cpu).toFixed(1)} GHz`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(4)>.value')[0].innerText = `${apps.taskmgr.tasks.length * (5 + Math.floor(Math.random() * 5))}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(5)>.value')[0].innerText = `${apps.taskmgr.tasks.length * (10 + Math.floor(Math.random() * 20))}`;
            let sec = apps.taskmgr.cpuRunningTime;
            let min = Math.floor(sec / 60);
            sec %= 60;
            let hour = Math.floor(min / 60);
            min %= 60;
            let day = Math.floor(hour / 24);
            hour %= 24;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(6)>.value')[0].innerText = `${day}:${String(hour).length < 2 ? '0' : ''}${hour}:${String(min).length < 2 ? '0' : ''}${min}:${String(sec).length < 2 ? '0' : ''}${sec}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-cpu>.right>.data>.value1')[0].innerText = `${apps.taskmgr.cpu.toFixed(1)}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-cpu>.right>.data>.value2')[0].innerText = `${(3200 / 100 * apps.taskmgr.cpu).toFixed(1)}GHz`;

            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.memory.toFixed(1)} GB (0 MB)`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(2)>.value')[0].innerText = `${(100 - apps.taskmgr.memory).toFixed(1)} GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(3)>.value')[0].innerText = `${(apps.taskmgr.memory - 2).toFixed(1)} / 100 GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(4)>.value')[0].innerText = `${(apps.taskmgr.memory / 2).toFixed(2)} GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-memory>.right>.data>.value1')[0].innerText = `${apps.taskmgr.memory.toFixed(1)} / 100 GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-memory>.right>.data>.value2')[0].innerText = `${apps.taskmgr.memory.toFixed(1)}%`;

            apps.taskmgr.diskSpeed.read = apps.taskmgr.disk != 0 ? (Math.random() * 100).toFixed(2) : 0;
            apps.taskmgr.diskSpeed.write = apps.taskmgr.disk != 0 ? (Math.random() * 100).toFixed(2) : 0;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.disk}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(2)>.value')[0].innerText = `${apps.taskmgr.disk != 0 ? Math.random().toFixed(2) : 0} 毫秒`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(3)>.value')[0].innerText = `${apps.taskmgr.diskSpeed.read} ${apps.taskmgr.disk != 0 ? 'MB/秒' : 'KB/秒'}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(4)>.value')[0].innerText = `${apps.taskmgr.diskSpeed.write} ${apps.taskmgr.disk != 0 ? 'MB/秒' : 'KB/秒'}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-disk>.right>.data>.value2')[0].innerText = `${apps.taskmgr.disk}%`;

            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-gpu>.right>.data>.value2')[0].innerText = `${apps.taskmgr.gpu.usage.toFixed(1)}%`;

            apps.taskmgr.gpu.d3 = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.copy = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.videop = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.videod = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.usage = Number(((apps.taskmgr.gpu.d3 + apps.taskmgr.gpu.copy + apps.taskmgr.gpu.videop + apps.taskmgr.gpu.videod) / 4).toFixed(1));

            apps.taskmgr.wifi[0] = Number((Math.random() * 100).toFixed(2));
            apps.taskmgr.wifi[1] = Number((Math.random() * 100).toFixed(2));
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.wifi[1].toFixed(2)} Mbps`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi>.information>.left>div:nth-child(2)>.value')[0].innerText = `${apps.taskmgr.wifi[0].toFixed(2)} Mbps`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-wifi>.right>.data>.value2')[0].innerText = `发送: ${apps.taskmgr.wifi[1]} 接收: ${apps.taskmgr.wifi[0]} Mbps`;
        },
        graphLoad: () => {
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-cpu')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.cpuCtx, 'cpuLastPos', apps.taskmgr.cpu)}")`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-memory')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.memoryCtx, 'memoryLastPos', apps.taskmgr.memory)}")`;
            w = apps.taskmgr.memoryCanvas2.width;
            h = apps.taskmgr.memoryCanvas2.height;
            apps.taskmgr.memoryCtx2.clearRect(0, 0, w, h);
            apps.taskmgr.memoryCtx2.fillRect(0, 0, w / 100 * apps.taskmgr.memory, h);
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-disk')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.diskCtx, 'diskLastPos', apps.taskmgr.disk)}")`;
            // 绘制磁盘传输速率
            w = apps.taskmgr.diskCanvas2.width;
            h = apps.taskmgr.diskCanvas2.height;
            data = apps.taskmgr.diskCtx2.getImageData(w / 60, 0, w - w / 60, h);
            apps.taskmgr.diskCtx2.clearRect(0, 0, w, h);
            apps.taskmgr.diskCtx2.putImageData(data, 0, 0);
            // 读取速度
            apps.taskmgr.diskCtx2.fillStyle = '#00800022';
            apps.taskmgr.diskCtx2.setLineDash([]);
            apps.taskmgr.drawgraph(apps.taskmgr.diskCtx2, apps.taskmgr.diskLastPos2.read, apps.taskmgr.diskSpeed.read, false, false);
            apps.taskmgr.diskLastPos2.read = [w - w / 60, h / 100 * (100 - apps.taskmgr.diskSpeed.read)];
            // 写入速度
            apps.taskmgr.diskCtx2.fillStyle = '#00000000';
            apps.taskmgr.diskCtx2.setLineDash([4, 4]);
            apps.taskmgr.drawgraph(apps.taskmgr.diskCtx2, apps.taskmgr.diskLastPos2.write, apps.taskmgr.diskSpeed.write, false, false);
            apps.taskmgr.diskLastPos2.write = [w - w / 60, h / 100 * (100 - apps.taskmgr.diskSpeed.write)];
            // 绘制网络
            w = apps.taskmgr.wifiCanvas.width;
            h = apps.taskmgr.wifiCanvas.height;
            data = apps.taskmgr.wifiCtx.getImageData(w / 60, 0, w - w / 60, h);
            apps.taskmgr.wifiCtx.clearRect(0, 0, w, h);
            apps.taskmgr.wifiCtx.putImageData(data, 0, 0);
            // 接收
            apps.taskmgr.wifiCtx.fillStyle = '#8e582922';
            apps.taskmgr.wifiCtx.setLineDash([]);
            apps.taskmgr.drawgraph(apps.taskmgr.wifiCtx, apps.taskmgr.wifiLastPos[0], apps.taskmgr.wifi[0], false, false);
            apps.taskmgr.wifiLastPos[0] = [w - w / 60, h / 100 * (100 - apps.taskmgr.wifi[0])];
            // 发送
            apps.taskmgr.wifiCtx.fillStyle = '#8e582900';
            apps.taskmgr.wifiCtx.setLineDash([4, 4]);
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-wifi')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.wifiCtx, apps.taskmgr.wifiLastPos[1], apps.taskmgr.wifi[1], false, false)}")`;
            apps.taskmgr.wifiLastPos[1] = [w - w / 60, h / 100 * (100 - apps.taskmgr.wifi[1])];
            // 绘制显卡
            for (var i = 0; i < 4; i++) {
                w = apps.taskmgr.gpuCanvas[i].width;
                h = apps.taskmgr.gpuCanvas[i].height;
                apps.taskmgr.drawgraph(apps.taskmgr.gpuCtx[i], apps.taskmgr.gpuLastPos[i], apps.taskmgr.gpu[['d3', 'copy', 'videod', 'videop'][i]], false);
                apps.taskmgr.gpuLastPos[i] = [w - w / 60, h / 100 * (100 - apps.taskmgr.gpu[['d3', 'copy', 'videod', 'videop'][i]])];
            }
            for (var i = 0; i < 2; i++) {
                w = apps.taskmgr.gpuCanvas2[i].width;
                h = apps.taskmgr.gpuCanvas2[i].height;
                apps.taskmgr.drawgraph(apps.taskmgr.gpuCtx2[i], apps.taskmgr.gpuLastPos2[i], apps.taskmgr.gpuMemory[['private', 'public'][i]], setPos = false, move = true, max = [16, 32][i]);
                apps.taskmgr.gpuLastPos2[i] = [w - w / 60, h / [16, 32][i] * ([16, 32][i] - apps.taskmgr.gpuMemory[['private', 'public'][i]])];
            }
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-gpu')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.gpuCtx3, 'gpuLastPos3', apps.taskmgr.gpu.usage)}")`
        },
        changeSort: (elt, type) => {
            for (const _elt of $('#win-taskmgr>.main>.cnt.processes thead>tr>th>i')) {
                _elt.className = 'bi';
            }
            if (apps.taskmgr.sortOrder == 'up-down' && apps.taskmgr.sortType == type) {
                elt.className = 'bi bi-chevron-up';
                apps.taskmgr.sortOrder = 'down-up';
                apps.taskmgr.sort(apps.taskmgr.processList, type, 'down-up');
            }
            else {
                elt.className = 'bi bi-chevron-down';
                apps.taskmgr.sortOrder = 'up-down';
                apps.taskmgr.sortType = type;
                apps.taskmgr.sort(apps.taskmgr.processList, type, 'up-down');
            }
        },
        gridLine: () => {
            apps.taskmgr.changeGrids(apps.taskmgr.memoryBgCtx);
            apps.taskmgr.changeGrids(apps.taskmgr.cpuBgCtx);
            apps.taskmgr.changeGrids(apps.taskmgr.diskBgCtx);
            apps.taskmgr.changeGrids(apps.taskmgr.diskBgCtx2);
            apps.taskmgr.changeGrids(apps.taskmgr.wifiBgCtx);
            apps.taskmgr.gpuBgCtx.forEach(function (ctx) {
                apps.taskmgr.changeGrids(ctx);
            });
            apps.taskmgr.gpuBgCtx2.forEach(function (ctx) {
                apps.taskmgr.changeGrids(ctx);
            });
        },
        selectProcess: (elt) => {
            $('#win-taskmgr>.main>.cnt.processes tbody.view>.select').removeClass('select');
            $(elt).addClass('select');
        },
        taskkill: (name) => {
            if (name == 'System') {
                window.location = 'bluescreen.html';
            }
            else {
                apps.taskmgr.tasks.splice(apps.taskmgr.tasks.findIndex(elt => elt.name == name), 1);
                if (taskmgrTasks.find(elt => elt.name == name).link != null) {
                    hidewin(taskmgrTasks.find(elt => elt.name == name).link);
                }
            }
        },
        initgraph: (prefix, color, setPos = true) => {
            if (setPos == true) {
                apps.taskmgr[prefix + 'LastPos'] = [apps.taskmgr[prefix + 'Canvas'].width, apps.taskmgr[prefix + 'Canvas'].height];
            }

            apps.taskmgr[prefix + 'Ctx'] = apps.taskmgr[prefix + 'Canvas'].getContext('2d');
            apps.taskmgr[prefix + 'BgCtx'] = apps.taskmgr[prefix + 'BgCanvas'].getContext('2d');
            apps.taskmgr[prefix + 'Ctx'].strokeStyle = color;
            console.log(color, color + '22', prefix)
            apps.taskmgr[prefix + 'Ctx'].fillStyle = color + '22';
            console.log(apps.taskmgr[prefix + 'Ctx'].fillStyle)
            apps.taskmgr[prefix + 'Ctx'].lineWidth = 4;
            apps.taskmgr[prefix + 'BgCtx'].strokeStyle = '#aeaeae';
            apps.taskmgr[prefix + 'BgCtx'].lineWidth = 3;
        },
        initgrids: (ctx) => {
            for (var i = 0; i <= 10; i++) {
                ctx.beginPath();
                ctx.moveTo(0, ctx.canvas.height / 10 * i);
                ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 10 * i);
                ctx.stroke();
                ctx.closePath();
            }
            for (var i = 0; i <= 20; i++) {
                ctx.beginPath();
                ctx.moveTo(ctx.canvas.width / 20 * i, 0);
                ctx.lineTo(ctx.canvas.width / 20 * i, ctx.canvas.height);
                ctx.stroke();
                ctx.closePath();
            }
        },
        drawgraph(ctx, lastPos, num, setPos = true, move = true, max = 100) {
            let w = ctx.canvas.width, h = ctx.canvas.height;
            if (move == true) {
                data = ctx.getImageData(w / 60, 0, w - w / 60, h);
                ctx.clearRect(0, 0, w, h);
                ctx.putImageData(data, 0, 0);
            }
            ctx.beginPath();
            if (setPos == true) {
                ctx.moveTo(apps.taskmgr[lastPos][0], apps.taskmgr[lastPos][1]);
            }
            else {
                ctx.moveTo(lastPos[0], lastPos[1]);
            }
            ctx.lineTo(w, h / max * (max - num));
            ctx.stroke();
            ctx.lineTo(w, h);
            ctx.lineTo(w - w / 60, h);
            ctx.fill();
            if (setPos == true) {
                apps.taskmgr[lastPos] = [w - w / 60, h / max * (max - num)];
            }
            return ctx.canvas.toDataURL();
        },
        changeGrids: (ctx) => {
            let left = ctx.getImageData(0, 0, ctx.canvas.width / 30 * 29, ctx.canvas.height);
            let right = ctx.getImageData(ctx.canvas.width / 30 * 29, 0, ctx.canvas.width / 30, ctx.canvas.height);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.putImageData(left, ctx.canvas.width / 30, 0);
            ctx.putImageData(right, 0, 0);
        }
    },
    whiteboard: {
        canvas: null,
        ctx: null,
        windowResizeObserver: null,
        color: 'red',
        init: () => {
            apps.whiteboard.ctx.lineJoin = 'round';
            apps.whiteboard.ctx.lineCap = 'round';
            apps.whiteboard.changeColor(apps.whiteboard.color);
            if ($(':root').hasClass('dark')) {
                $('.window.whiteboard>.titbar>p').text('Blackboard');
            } else {
                $('.window.whiteboard>.titbar>p').text('Whiteboard');
            }
        },
        changeColor: (color) => {
            apps.whiteboard.color = color;
            if (color == 'eraser') {
                apps.whiteboard.ctx.strokeStyle = 'black';
                apps.whiteboard.ctx.lineWidth = 35;
                apps.whiteboard.ctx.globalCompositeOperation = 'destination-out';
            }
            else {
                apps.whiteboard.ctx.strokeStyle = color;
                apps.whiteboard.ctx.globalCompositeOperation = 'source-over';
                apps.whiteboard.ctx.lineWidth = 8;
            }
        },
        changePen: function () {
            const pens = $('#win-whiteboard>.toolbar>.tools>*');
            for (const elt of pens) {
                elt.classList.remove('active');
            }
            this.classList.add('active');
            apps.whiteboard.changeColor(this.dataset.color);
        },
        load: () => {
            apps.whiteboard.canvas = $('#win-whiteboard>canvas')[0];
            apps.whiteboard.ctx = apps.whiteboard.canvas.getContext('2d');
            apps.whiteboard.windowResizeObserver = new ResizeObserver(apps.whiteboard.resize);
            apps.whiteboard.windowResizeObserver.observe($('.window.whiteboard')[0], { box: 'border-box' });
        },
        resize: () => {
            try {
                const imgData = apps.whiteboard.ctx.getImageData(0, 0, apps.whiteboard.canvas.width, apps.whiteboard.canvas.height);
                apps.whiteboard.canvas.width = $('#win-whiteboard')[0].clientWidth;
                apps.whiteboard.canvas.height = $('#win-whiteboard')[0].clientHeight;
                apps.whiteboard.ctx.putImageData(imgData, 0, 0);
            }
            catch {
                apps.whiteboard.canvas.width = $('#win-whiteboard')[0].clientWidth;
                apps.whiteboard.canvas.height = $('#win-whiteboard')[0].clientHeight;
            }
            apps.whiteboard.init();
        },
        draw: (e) => {
            let offsetX, offsetY, left = $('#win-whiteboard')[0].getBoundingClientRect().left, top = $('#win-whiteboard')[0].getBoundingClientRect().top;
            if (e.type.match('mouse')) {
                offsetX = e.clientX - left, offsetY = e.clientY - top;
            }
            else if (e.type.match('touch')) {
                offsetX = e.touches[0].clientX - left, offsetY = e.touches[0].clientY - top;
            }
            apps.whiteboard.ctx.beginPath();
            apps.whiteboard.ctx.moveTo(offsetX, offsetY);
            page.onmousemove = apps.whiteboard.drawing;
            page.ontouchmove = apps.whiteboard.drawing;
            page.onmouseup = apps.whiteboard.up;
            page.ontouchend = apps.whiteboard.up;
            page.ontouchcancel = apps.whiteboard.up;
        },
        drawing: (e) => {
            let offsetX, offsetY, left = $('#win-whiteboard')[0].getBoundingClientRect().left, top = $('#win-whiteboard')[0].getBoundingClientRect().top;
            if (e.type.match('mouse')) {
                offsetX = e.clientX - left, offsetY = e.clientY - top;
            }
            else if (e.type.match('touch')) {
                offsetX = e.touches[0].clientX - left, offsetY = e.touches[0].clientY - top;
            }
            apps.whiteboard.ctx.lineTo(offsetX, offsetY);
            apps.whiteboard.ctx.stroke();
        },
        up: () => {
            apps.whiteboard.ctx.stroke();
            page.onmousemove = null;
            page.ontouchmove = null;
            page.onmouseup = null;
            page.ontouchend = null;
            page.ontouchcancel = null;
        },
        download: () => {
            const url = apps.whiteboard.canvas.toDataURL();
            $('#win-whiteboard>a.download')[0].href = url;
            $('#win-whiteboard>a.download')[0].click();
        },
        delete: () => {
            apps.whiteboard.ctx.clearRect(0, 0, apps.whiteboard.canvas.width, apps.whiteboard.canvas.height);
        }
    },
    webapps: {
        apps: ['vscode', 'bilibili'],
        init: () => {
            for (const app of apps.webapps.apps) {
                apps[app].load();
            }
        }
    },
    vscode: {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-vscode')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://github1s.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>')
        }
    },
    bilibili: {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-bilibili')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://bilibili.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>')
        }
    },
    defender: {
        init: () => {

        }
    },
    camera: {
        init: () => {
            if (!localStorage.getItem('camera')) {
                showwin('camera-notice');
                return;
            }
            if (localStorage.getItem('camera')) {
                apps.camera.streaming = false;
                apps.camera.video = $('#win-camera video')[0];
                apps.camera.canvas = $('#win-camera canvas')[0];
                apps.camera.context = apps.camera.canvas.getContext('2d');
                apps.camera.context.fillStyle = '#aaa';
                apps.camera.downloadLink = $('#win-camera a')[0];
                // apps.camera.control = document.querySelector('#win-camera>.control')
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(stream => {
                        apps.camera.video.srcObject = stream;
                        apps.camera.video.play();
                    })
                    .catch(() => {
                        hidewin('camera');
                    });
                apps.camera.video.addEventListener('canplay', () => {
                    if (!apps.camera.streaming) {
                        apps.camera.aspectRatio = apps.camera.video.videoWidth / apps.camera.video.videoHeight;
                        apps.camera.canvas.width = apps.camera.video.videoWidth;
                        apps.camera.canvas.height = apps.camera.video.videoHeight;
                        apps.camera.windowResizeObserver = new ResizeObserver(apps.camera.resize);
                        apps.camera.windowResizeObserver.observe($('.window.camera')[0], { box: 'border-box' });
                        apps.camera.streaming = true;
                    }
                });
            }
            else {
                hidewin('camera');
            }
        },
        clearCanvas: () => {
            apps.camera.context.fillRect(0, 0, canvas.width, canvas.height);
        },
        takePhoto: () => {
            apps.camera.context.drawImage(apps.camera.video, 0, 0, apps.camera.canvas.width, apps.camera.canvas.height);
            apps.camera.downloadLink.href = apps.camera.canvas.toDataURL('image/png');
            apps.camera.downloadLink.download = "photo.png";
            apps.camera.downloadLink.click();
        },
        notice: () => {
            if (!localStorage.getItem('camera')) {
                showwin('camera-notice');
            }
            else {
                openapp('camera');
            }
        },
        resize: () => {
            let w = $('#win-camera')[0].offsetWidth,
                h = $('#win-camera')[0].offsetHeight;
            if (w / apps.camera.aspectRatio <= h) {
                if (!$('#win-camera').hasClass('v')) {
                    $('#win-camera').removeClass('h')
                    $('#win-camera').addClass('v');
                }
            }
            else if (w / apps.camera.aspectRatio >= h) {
                if (!$('#win-camera').hasClass('h')) {
                    $('#win-camera').removeClass('v')
                    $('#win-camera').addClass('h');
                }
            }
        }
    },
    explorer: {
        init: () => {
            apps.explorer.tabs = [];
            apps.explorer.len = 0;
            apps.explorer.newtab();
            // apps.explorer.reset();
            apps.explorer.Process_Of_Select = "";
            apps.explorer.is_use = 0;//千万不要删除它，它依托bug运行
            apps.explorer.is_use2 = 0;//千万不要删除它，它依托bug运行
            apps.explorer.old_name = "";
            apps.explorer.clipboard = null;
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Delete' && $('.window.foc')[0].classList[1] == "explorer") {
                    apps.explorer.del(apps.explorer.Process_Of_Select);
                }
            });
        },
        tabs: [],
        now: null,
        len: 0,
        newtab: (path = '') => {
            // if(path==''){
            //     m_tab.newtab('explorer','This');
            //     apps.explorer.tabs[apps.explorer.tabs.length-1][2]='';
            //     m_tab.tab('explorer',apps.explorer.tabs.length - 1);
            // }else{
            m_tab.newtab('explorer', '');
            apps.explorer.tabs[apps.explorer.tabs.length - 1][2] = path;
            apps.explorer.initHistory(apps.explorer.tabs[apps.explorer.tabs.length - 1][0]);
            apps.explorer.checkHistory(apps.explorer.tabs[apps.explorer.tabs.length - 1][0]);
            m_tab.tab('explorer', apps.explorer.tabs.length - 1);
            // }
        },
        settab: (t, i) => {
            return `<div class="tab ${t[0]}" onclick="m_tab.tab('explorer',${i})" oncontextmenu="showcm(event,'explorer.tab',${i});stop(event);return false" onmousedown="m_tab.moving('explorer',this,event,${i});stop(event);" ontouchstart="m_tab.moving('exploer',this,event,${i});stop(event);"><p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('explorer',${i});stop(event);"></span></div>`;
        },
        tab: (c, load = true) => {
            if (load) {
                if (!apps.explorer.tabs[c][2].length) apps.explorer.reset();
                else apps.explorer.goto(apps.explorer.tabs[c][2]);
            }
            apps.explorer.checkHistory(apps.explorer.tabs[c][0]);
        },
        reset: (clear = true) => {
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = `<style>#win-explorer>.page>.main>.content>.view>.class{margin: 5px 0 0 10px;display: flex;}
            #win-explorer>.page>.main>.content>.view>.class>img{width: 20px;height: 20px;margin-top: 3px;margin-right: 5px;filter:brightness(0.9);}
            #win-explorer>.page>.main>.content>.view>.group{display: flex;flex-wrap: wrap;padding: 10px 20px;}
            #win-explorer>.page>.main>.content>.view>.group>.item{width: 280px;margin: 5px;height:80px;
    box-shadow: 0 1px 2px var(--s3d);
                background: radial-gradient(circle, var(--card),var(--card));border-radius: 10px;display: flex;}
            #win-explorer>.page>.main>.content>.view>.group>.item:hover{background-color: var(--hover);}
            #win-explorer>.page>.main>.content>.view>.group>.item:active{transform: scale(0.97);}
            #win-explorer>.page>.main>.content>.view>.group>.item>img{width: 55px;height: 55px;margin-top: 18px;margin-left: 10px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div{flex-grow: 1;padding: 5px 5px 0 0;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.bar{width: calc(100% - 10px);height: 8px;border-radius: 10px;
                background-color: var(--hover-b);margin: 5px 5px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.bar>.content{height: 100%;background-image: linear-gradient(90deg, var(--theme-1), var(--theme-2));
                border-radius: 10px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.info{color: #959595;font-size: 14px;}</style>
            <p class="class"><img src="apps/icons/explorer/disk.svg"> Devices and drivers</p><div class="group">
            <a class="a item act" ondblclick="apps.explorer.goto('C:')" ontouchend="apps.explorer.goto('C:')" oncontextmenu="showcm(event,'explorer.folder','C:');return stop(event);">
            <img src="apps/icons/explorer/diskwin.svg"><div><p class="name">Local Disk (C:)</p>
            <div class="bar"><div class="content" style="width: 88%;"></div>
            </div><p class="info">32.6 GB 可用, 共 143 GB</p></div></a><a class="a item act" ondblclick="apps.explorer.goto('D:')" ontouchend="apps.explorer.goto('D:')"
            oncontextmenu="showcm(event,'explorer.folder','D:');return stop(event);">
            <img src="apps/icons/explorer/disk.svg"><div><p class="name">Local Disk (D:)</p><div class="bar"><div class="content" style="width: 15%;"></div>
            </div><p class="info">185.3 GB 可用, 共 216 GB</p></div></a></div>`;
            $('#win-explorer>.path>.tit')[0].innerHTML = '<div class="icon" style="background-image: url(\'./apps/icons/explorer/thispc.svg\')"></div><div class="path"><div class="text" onclick="apps.explorer.reset()">This</div><div class="arrow">&gt;</div></div>';
            // if(rename){
            m_tab.rename('explorer', '<img src="./apps/icons/explorer/thispc.svg"> This PC');
            apps.explorer.tabs[apps.explorer.now][2] = '';
            if (clear) {
                apps.explorer.delHistory(apps.explorer.tabs[apps.explorer.now][0]);
                apps.explorer.pushHistory(apps.explorer.tabs[apps.explorer.now][0], 'This PC');
            }
            // }
        },
        select: (path, id) => {
            var elements = document.querySelectorAll('#win-explorer > .main > .content > .view > .select');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('select');
            }
            apps.explorer.Process_Of_Select = path;
            var element = document.getElementById(id);
            element.classList.add('select');
            apps.explorer.is_use += 1;
        },
        copy_or_cut: (path, operate) => { //operate只能为copy或cut
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            pathl.pop();
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });

            if (Object.keys(tmp["folder"]).includes(name)) {
                apps.explorer.clipboard = ["folder", [name], tmp["folder"][name]];
                if (operate == "cut")
                    delete tmp["folder"][name];
            }
            else {
                for (var i = 0; i < tmp["file"].length; i++) {
                    if (tmp["file"][i]["name"] == name) {
                        apps.explorer.clipboard = ["file", tmp["file"][i]];
                        if (operate == "cut")
                            delete tmp["file"][i];
                    }
                }
            }
            apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path, false);
        },
        paste: (path) => {
            var pathl = path.split('/');
            let tmp = apps.explorer.path, thisPath = '';
            $('#win-explorer>.path>.tit>.path')[0].innerHTML = '';
            if (pathl[pathl.length - 1] == 'C:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '3px';
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("./apps/icons/explorer/diskwin.svg")';
            }
            else if (pathl[pathl.length - 1] == 'D:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("./apps/icons/explorer/disk.svg")';
            }
            else {
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("./apps/icons/explorer/folder.svg")';
            }
            pathl.forEach(name => {
                thisPath += name + '/';
                tmp = tmp['folder'][name];
                $('#win-explorer>.path>.tit>.path')[0].insertAdjacentHTML('beforeend', `<div class="text" onmousedown="apps.explorer.goto('${thisPath.substring(0, thisPath.length - 1)}');stop(event);">${name}</div> <div class="arrow">></div> `)
            });
            var clipboard = apps.explorer.clipboard;

            if (apps.explorer.traverseDirectory(tmp, clipboard[1][0]) || apps.explorer.traverseDirectory(tmp, clipboard[1]['name'])) {
                shownotice("duplication file name");
                return;
            }
            if (apps.explorer.traverseDirectory(tmp, clipboard[1][0]))
                // {
                //     clipboard[1][0] += " - 副本";
                // }
                // if (apps.explorer.traverseDirectory(tmp,clipboard[1]['name']))
                // {
                //     clipboard[1][0] += " - 副本";
                // }
                // 这段注释了的代码可以调试一下，会有神奇的bug。

                if (clipboard[0] == "file") {
                    tmp["file"].push(clipboard[1]);
                }
                else {
                    tmp['folder'][clipboard[1][0]] = clipboard[2];
                }
            apps.explorer.goto(path);
        },
        del_select: () => {
            if (apps.explorer.is_use >= 1 && apps.explorer.is_use2 != apps.explorer.is_use) {
                apps.explorer.is_use2 = apps.explorer.is_use;
                return;
            }
            var elements = document.querySelectorAll('#win-explorer>.page>.main>.content>.view>.change');
            console.log(elements);
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('change');
                let aTag = elements[i];
                var on = apps.explorer.old_name;
                let inputTag = aTag.querySelector("#new_name");
                var pathl = $('#win-explorer>.path>.tit')[0].dataset.path.split('/');
                let tmp = apps.explorer.path;
                pathl.forEach(name => {
                    tmp = tmp['folder'][name];
                });
                if (inputTag.value == '' || apps.explorer.traverseDirectory(tmp, inputTag.value) || on == inputTag.value) {
                    if (apps.explorer.traverseDirectory(tmp, inputTag.value) && on != inputTag.value) {
                        shownotice("duplication file name");
                    }
                    var element = document.getElementById("new_name");
                    element.parentNode.removeChild(element);
                    aTag.innerHTML += on;
                    continue;
                }
                name_1 = inputTag.value.split(".");
                if (name_1[0].indexOf('/') > -1) alert('Congratulations on finding this bug, but you are too lazy to fix it qwq');
                console.log(name_1);
                if (name_1[1] == "txt") {
                    icon_ = "icon/files/txt.png";
                }
                else if (name_1[1] == "png" || name_1[1] == "jpg" | name_1[1] == "bmp") {
                    icon_ = "icon/files/picture.png";
                }
                else {
                    icon_ = "icon/files/none.png";
                }
                //这边可以适配更多的文件类型

                aTag.innerHTML += inputTag.value;
                for (var i = 0; i < tmp["file"].length; i++) {
                    if (tmp["file"][i]['name'] == on) {
                        tmp["file"][i]['name'] = inputTag.value;
                        tmp["file"][i]['ico'] = icon_;
                    }
                }
                const keys = Object.keys(tmp["folder"]);
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] == on) {
                        keys[i] = inputTag.value;
                        tmp["folder"][inputTag.value] = tmp["folder"][on];
                        delete tmp["folder"][on];
                    }
                }
                var element = document.getElementById("new_name");
                element.parentNode.removeChild(element);
                apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path, false);

            }
            delete elements;
            apps.explorer.is_use2 = apps.explorer.is_use;
            var elements = document.querySelectorAll('#win-explorer>.page>.main>.content>.view>.select');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('select');
            }
            apps.explorer.Process_Of_Select = "";
        },
        goto: (path, clear = true) => {
            apps.explorer.Process_Of_Select = "";
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '';
            var pathl = path.split('/');
            var pathqwq = '';
            var index_ = 0;
            let tmp = apps.explorer.path;
            if (path == 'This PC') {
                apps.explorer.reset(clear);
                return null;
            }
            $('#win-explorer>.path>.tit')[0].dataset.path = path;
            $('#win-explorer>.path>.tit>.path')[0].innerHTML = '<div class="text" onclick="apps.explorer.reset()">This</div><div class="arrow">&gt;</div>';
            $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
            if (pathl[pathl.length - 1] == 'C:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/diskwin.svg")';
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '2.5px';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/diskwin.svg" style="margin-top:2.5px">' + pathl[pathl.length - 1]);
            }
            else if (pathl[pathl.length - 1] == 'D:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/disk.svg")';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/disk.svg">' + pathl[pathl.length - 1]);
            }
            else {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/folder.svg")';
                m_tab.rename('explorer', '<img src="./apps/icons/explorer/folder.svg">' + pathl[pathl.length - 1]);
            }
            // if(rename){
            apps.explorer.tabs[apps.explorer.now][2] = path;
            // }
            pathl.forEach(name => {
                pathqwq += name;
                $('#win-explorer>.path>.tit>.path')[0].innerHTML += `<div class="text" onclick="apps.explorer.goto('${pathqwq}')">${name}</div><div class="arrow">&gt;</div>`;
                tmp = tmp['folder'][name];
                pathqwq += '/';
            });
            var path_ = path
            if (Object.keys(tmp["folder"]) == 0 && tmp["file"].length == 0) {
                $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '<p class="info">This folder is empty.</p>';
            }
            else {
                let ht = '';
                for (folder in tmp['folder']) {
                    ht += `<a class="a item files" id="file${index_}" onclick="apps.explorer.select('${path}/${folder}','file${index_}');" ondblclick="apps.explorer.goto('${path}/${folder}')" ontouchend="apps.explorer.goto('${path}/${folder}')" oncontextmenu="showcm(event,'explorer.folder','${path}/${folder}');return stop(event);">
                        <img src="apps/icons/explorer/folder.svg">${folder}</a>`;
                    index_ += 1;
                }
                if (tmp['file']) {
                    tmp['file'].forEach(file => {
                        ht += `<a class="a item act file" id="file${index_}" onclick="apps.explorer.select('${path_}/${file['name']}','file${index_}');" ondblclick="${file['command']}" ontouchend="${file['command']}" oncontextmenu="showcm(event,'explorer.file','${path_}/${file['name']}');return stop(event);">
                            <img src="${file['ico']}">${file['name']}</a>`;
                        index_ += 1;
                    });
                }
                $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = ht;
            }
            if (pathl.length == 1) {
                $('#win-explorer>.path>.goback').attr('onclick', 'apps.explorer.reset()');
            } else {
                $('#win-explorer>.path>.goback').attr('onclick', `apps.explorer.goto('${path.substring(0, path.length - pathl[pathl.length - 1].length - 1)}')`);
            }

            if (clear) {
                apps.explorer.delHistory(apps.explorer.tabs[apps.explorer.now][0]);
                apps.explorer.pushHistory(apps.explorer.tabs[apps.explorer.now][0], $('#win-explorer>.path>.tit')[0].dataset.path);
            }
            apps.explorer.checkHistory(apps.explorer.tabs[apps.explorer.now][0]);

            // $('#win-explorer>.path>.tit')[0].innerHTML = path;
        },
        add: (path, name_, type = "file", command = "", icon = "") => { //type为文件类型，只有文件夹files和文件file
            var pathl = path.split('/');
            var icon_ = "";
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            if (tmp == null) {
                tmp = { folder: {}, file: [] };
            }
            if (apps.explorer.traverseDirectory(tmp, name_)) {
                shownotice("duplication file name");
                return;
            }
            name_1 = name_.split(".");

            if (type == "file") {
                if (name_1[1] == "txt") {
                    icon_ = "icon/files/txt.png";
                    if (command == "")
                        command = "openapp('notepad')";
                }
                else if (name_1[1] == "png" || name_1[1] == "jpg" | name_1[1] == "bmp") {
                    icon_ = "icon/files/picture.png";
                }
                else {
                    icon_ = "icon/files/none.png";
                }
                //这边可以适配更多的文件类型
                if (icon != "") {
                    icon_ = icon;
                }
                try {
                    tmp.file.push({ name: name_, ico: icon_, command: command });
                }
                catch {
                    tmp.push(file);
                    tmp.file.push({ name: name_, ico: icon_, command: command });
                }
            }
            else {
                tmp.folder[name_] = { folder: {}, file: [] };
            }
            apps.explorer.goto(path);
            apps.explorer.rename(path + "/" + name_);
        },
        rename: (path) => {
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            apps.explorer.old_name = name;
            pathl.pop();
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            let element = document.querySelector('#' + apps.explorer.get_file_id(name));
            let img = element.querySelector("img").outerHTML;
            element.innerHTML = img;
            let input = document.createElement("input");
            // input.style.cssText = '';
            input.id = "new_name";
            input.className = "input";
            input.value = apps.explorer.old_name;
            element.appendChild(input);
            setTimeout(() => { $("#new_name").focus(); $("#new_name").select(); }, 200);

            element.classList.add("change");
            var input_ = document.getElementById("new_name");
            input_.addEventListener("keyup", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    apps.explorer.del_select();
                }
            });
        },
        get_file_id: (name) => {  //只能找到已经打开了的文件夹的元素id
            var elements = document.getElementsByClassName("item");
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.innerText == name) {
                    return element.id;
                }
            }
        },
        del: (path) => {
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            pathl.pop();
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            tmp_file = tmp['file'];
            for (var i = 0; i < tmp_file.length; i++) {
                if (tmp_file[i]['name'] == name) {
                    tmp_file.splice(i, 1);
                }
            }
            tmp_files = tmp['folder'];
            delete tmp_files[name];
            apps.explorer.goto(pathl.join("/"));
            apps.explorer.history.forEach(item => {
                while (item.includes(path)) {
                    item.splice(item.findIndex(elt => { return elt == path; }), 1);
                }
            });
        },
        traverseDirectory(dir, name) {
            if (dir["file"] == null && dir["folder"] == null)
                return false;
            for (var i = 0; i < dir["file"].length; i++) {
                if (dir["file"][i]['name'] == name) {
                    return true;
                }
            }
            const keys = Object.keys(dir["folder"]);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == name) {
                    return true;
                }
            }
            return false;
        },
        // 禁止奇奇怪怪的缩进！尽量压行，不要毫无意义地全部格式化和展开！ // f*ck!这™的格式化工具，我*********
        path: {
            folder: {
                'C:': {
                    folder: {
                        'Program Files': {
                            folder: { 'WindowsApps': { folder: {}, file: [] }, 'Microsoft': { folder: {}, file: [] } },
                            file: [
                                { name: 'about.exe', ico: 'icon/about.svg', command: "openapp('about')" },
                                { name: 'setting.exe', ico: 'icon/setting.svg', command: "openapp('setting')" },
                            ]
                        },
                        'Program Files (x86)': {
                            folder: {
                                'Microsoft': {
                                    folder: {
                                        'Edge': {
                                            folder: {
                                                'Application': {
                                                    folder: { 'SetupMetrics': { folder: {}, file: [] } },
                                                    file: [{ name: 'msedge.exe', ico: 'icon/edge.svg', command: "openapp('edge')" }]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'Windows': {
                            folder: {
                                'Boot': { folder: {}, file: [] }, 'System': { folder: {}, file: [] }, 'SysWOW64': { folder: {}, file: [] }, 'System32': {
                                    folder: {}, file: [
                                        { name: 'calc.exe', ico: 'icon/calc.svg', command: "openapp('calc')" },
                                        { name: 'cmd.exe', ico: 'icon/terminal.svg', command: "openapp('terminal')" },
                                        { name: 'notepad.exe', ico: 'icon/notepad.svg', command: "openapp('notepad')" },//system32也有一个notepad
                                        { name: 'taskmgr.exe', ico: 'icon/taskmgr.png', command: "openapp('taskmgr')" },
                                        { name: 'winver.exe', ico: 'icon/about.svg', command: "openapp('winver')" },
                                    ]
                                }
                            },
                            file: [
                                { name: 'explorer.exe', ico: 'icon/explorer.svg', command: "apps.explorer.newtab()" },
                                { name: 'notepad.exe', ico: 'icon/notepad.svg', command: "openapp('notepad')" },
                                { name: 'py.exe', ico: 'icon/python.png', command: "openapp('python')" },
                            ]
                        },
                        '用户': {
                            folder: {
                                'Administrator': {
                                    folder: {
                                        '文档': {
                                            folder: { 'IISExpress': { folder: {}, file: [] }, 'PowerToys': { folder: {}, file: [] } },
                                            file: [
                                                { name: 'Introduction.doc', ico: 'icon/files/word.png', command: '' },
                                                { name: 'Vercap.xlsx', ico: 'icon/files/excel.png', command: '' },
                                            ]
                                        }, '图片': {
                                            folder: { 'Local Photo': { folder: {}, file: [] }, 'Screenshots': { folder: {}, file: [] } },
                                            file: [
                                                { name: 'StructureDiagram.png', ico: 'icon/files/img.png', command: '' },
                                                { name: 'Coca-cola.jpg', ico: 'icon/files/img.png', command: '' },
                                            ]
                                        },
                                        'AppData': {
                                            folder: {
                                                'Local': {
                                                    folder: {
                                                        'Microsoft': {
                                                            folder: {
                                                                'Windows': {
                                                                    folder: {
                                                                        'Fonts': {}, 'TaskManager': {},
                                                                        'Themes': {}, 'Shell': {},
                                                                        'Application shortcut': {},
                                                                    }
                                                                },
                                                            }
                                                        },
                                                        'Programs': {
                                                            folder: {
                                                                'Python': {
                                                                    folder: {
                                                                        'Python310': {
                                                                            folder: {
                                                                                'DLLs': {},
                                                                                'Doc': {}, 'include': {},
                                                                                'Lib': {
                                                                                    folder: {
                                                                                        'site-packages': {},
                                                                                        'tkinter': {},
                                                                                    }
                                                                                },
                                                                                'libs': {}, 'Script': {}, 'share': {},
                                                                                'tcl': {}, 'Tools': {}
                                                                            }, file: [
                                                                                { name: 'python.exe', ico: 'icon/python.png', command: "openapp('python')" }
                                                                            ]}}, }}},
                                                        'Temp': { folder: {} },
                                                    }
                                                },
                                                'LocalLow': {
                                                    folder: {
                                                        'Microsoft': {
                                                            folder: {
                                                                'Windows': {},
                                                            }
                                                        },
                                                    }
                                                }, 'Roaming': {
                                                    folder: {
                                                        'Microsoft': {
                                                            folder: {
                                                                'Windows': {
                                                                    folder: {
                                                                        'Start Menu': {
                                                                            folder: {
                                                                                'Program': {
                                                                                    folder: {}
                                                                                },} },}},}},}},}, file: []}, 'Music': { folder: { 'Recorder': { folder: {}, file: [] } } }}},
                                'Public': {
                                    folder: {
                                        'Public documents': {
                                            folder: { 'IISExpress': { folder: {}, file: [] }, 'PowerToys': { folder: {}, file: [] } },
                                            file: []
                                        }, 'Public images': {
                                            folder: { 'Local photo': { folder: {}, file: [] }, 'Screenshots': { folder: {}, file: [] } },
                                            file: []
                                        },
                                        'Public m': { folder: { '录音机': { folder: {}, file: [] } } }
                                    }}}}},
                    file: []
                },
                'D:': {
                    folder: { 'Microsoft': { folder: {}, file: [] } },
                    file: [
                        { name: '瓶盖结构说明.docx', ico: 'icon/files/word.png', command: '' },
                        { name: '可口可乐瓶盖历史.pptx', ico: 'icon/files/ppt.png', command: '' },
                    ]}}},

        history: [],
        historypt: [],
        initHistory: (tab) => {
            apps.explorer.history[tab] = [];
            apps.explorer.historypt[tab] = -1;
        },
        pushHistory: (tab, u) => {
            apps.explorer.history[tab].push(u);
            apps.explorer.historypt[tab]++;
        },
        topHistory: (tab) => {
            return apps.explorer.history[tab][apps.explorer.historypt[tab]];
        },
        popHistory: (tab) => {
            apps.explorer.historypt[tab]--;
            return apps.explorer.history[tab][apps.explorer.historypt[tab]];
        },
        incHistory: (tab) => {
            apps.explorer.historypt[tab]++;
            return apps.explorer.history[tab][apps.explorer.historypt[tab]];
        },
        delHistory: (tab) => {
            apps.explorer.history[tab].splice(apps.explorer.historypt[tab] + 1, apps.explorer.history[tab].length - 1 - apps.explorer.historypt[tab]);
        },
        historyIsEmpty: (tab) => {
            return apps.explorer.historypt[tab] <= 0;
        },
        historyIsFull: (tab) => {
            return apps.explorer.historypt[tab] >= apps.explorer.history[tab].length - 1;
        },
        checkHistory: (tab) => {
            if (apps.explorer.historyIsEmpty(tab)) {
                $('#win-explorer>.path>.back').addClass('disabled');
            }
            else if (!apps.explorer.historyIsEmpty(tab)) {
                $('#win-explorer>.path>.back').removeClass('disabled');
            }
            if (apps.explorer.historyIsFull(tab)) {
                $('#win-explorer>.path>.front').addClass('disabled');
            }
            else if (!apps.explorer.historyIsFull(tab)) {
                $('#win-explorer>.path>.front').removeClass('disabled');
            }
            console.log(tab, apps.explorer.history[tab]);
        },
        back: (tab) => {
            apps.explorer.goto(apps.explorer.popHistory(tab), false);
            apps.explorer.checkHistory(tab);
        },
        front: (tab) => {
            apps.explorer.goto(apps.explorer.incHistory(tab), false);
            apps.explorer.checkHistory(tab);
        }
    },
    calc: {
        init: () => {
            document.getElementById('calc-input').innerHTML = "0";
        }
    },
    about: {
        init: () => {
            $('#win-about>.about').addClass('show');
            $('#win-about>.update').removeClass('show');
            if (!($('#contri').length > 1)) apps.about.get();
            if (!($('#StarShow').html().includes('Refresh'))) apps.about.get_star();
        },
        run_loading: (expr) => {
            $(expr).html(`<loading><svg width="30px" height="30px" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle>
            <circle cx="8px" cy="8px" r="7px" style="stroke:#2983cc;stroke-width:3px;"></circle></svg></loading>`);
        },
        get: () => {
            apps.about.run_loading('#contri');
            // 实时获取项目贡献者
            $.get('https://api.github.com/repos/tjy-gitnub/win12/contributors').then(cs => {
                setTimeout(() => {
                    $('#contri').html('');
                    cs.forEach(c => {
                        $('#contri').append(`<a class="a" onclick="window.open('${c['html_url']}','_blank');"><p class="name">${c['login']}</p><p class="cbs">Contribute<span class="num">${c['contributions']}</span></p></a>`)
                    });
                    $('#contri').append(`<a class="button" onclick="apps.about.get()"><i class="bi bi-arrow-clockwise"></i> Refresh</a>`)
                }, 200);
            });
        },
        get_star: () => {
            apps.about.run_loading('#StarShow')
            const repoFullName = 'tjy-gitnub/win12';
            fetch(`https://api.github.com/repos/${repoFullName}`)
                .then(response => response.json())
                .then(data => {
                    setTimeout(() => {
                        const starCount = data.stargazers_count;
                        $('#StarShow').html('<div style="display: flex;"><p>&emsp;&emsp;Star quantity:' + starCount + ' (Real-time data)</p>&emsp;< a class="button" onclick="apps.about.get_star()"><i class="bi bi-arrow-clockwise"></i> Refresh</a></div>')
                    }, 200);
                })
                .catch(error => {
                    console.error('An error occurred while getting the number of stars:', error);
                    $('#StarShow').html('<div style="display: flex;"><p>&emsp;&emsp;Oops! Something went wrong!</p>&emsp;<a class="button" onclick=" apps.about.get_star()"><i class="bi bi-arrow-clockwise"></i> Try again</a></div>')
                });
        }
    },
    notepad: {
        init: () => {
            $('#win-notepad>.text-box').addClass('down');
            setTimeout(() => {
                $('#win-notepad>.text-box').val('');
                $('#win-notepad>.text-box').removeClass('down')
            }, 200);
        }
    },
    pythonEditor: {
        editor: null,
        init: () => {
            return null;
        },
        run: () => {
            let result;
            let output = document.getElementById("output");
            try {
                if (apps.python.pyodide) {
                    let code = apps.pythonEditor.editor.getValue();
                    apps.python.pyodide.runPython('sys.stdout = io.StringIO()');
                    apps.python.pyodide.runPython(code);
                    result = apps.python.pyodide.runPython('sys.stdout.getvalue()');
                }
            }
            catch (e) {
                result = e.message;
            }
            output.innerHTML = result;
        },
        load: () => {
            if (!apps.python.loaded) {
                apps.python.loaded = true;
                apps.python.load();
            }
            ace.require("ace/ext/language_tools");
            apps.pythonEditor.editor = ace.edit("win-python-ace-editor");
            apps.pythonEditor.editor.session.setMode("ace/mode/python");
            apps.pythonEditor.editor.setTheme("ace/theme/vibrant_ink");
            apps.pythonEditor.editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false,
                enableLiveAutocompletion: true
            });
        }
    },
    notepadFonts: {
        sizes: {
            '初号': '56',
            '小初': '48',
            '一号': '34.7',
            '小一': '32',
            '二号': '29.3',
            '小二': '24',
            '三号': '21.3',
            '小三': '20',
            '四号': '18.7',
            '小四': '16',
            '五号': '14',
            '小五': '12'
        },
        styles: {
            'Normal': '',
            'Bold': 'font-weight: bold;',
            'italics': 'font-style: italic;',
            'Bold italic': 'font-weight: bold; font-style: italic;'
        },
        load: () => {
            apps.notepadFonts.fontvalues = $('#win-notepad-font>.row>#win-notepad-font-type>.value-box>.option');
            apps.notepadFonts.sizevalues = $('#win-notepad-font>.row>#win-notepad-font-size>.value-box>.option');
            apps.notepadFonts.stylevalues = $('#win-notepad-font>.row>#win-notepad-font-style>.value-box>.option');
            apps.notepadFonts.typeinput = $('#win-notepad-font>.row>#win-notepad-font-type>input[type=text]')[0];
            apps.notepadFonts.sizeinput = $('#win-notepad-font>.row>#win-notepad-font-size>input[type=text]')[0];
            apps.notepadFonts.styleinput = $('#win-notepad-font>.row>#win-notepad-font-style>input[type=text]')[0];
            apps.notepadFonts.previewBox = $('#win-notepad-font>.preview>.preview-box');
            apps.notepadFonts.textBox = $('.notepad>#win-notepad>.text-box');

            for (const elt of apps.notepadFonts.fontvalues) {
                elt.onclick = function () {
                    apps.notepadFonts.typeinput.value = this.innerText;
                    apps.notepadFonts.preview();
                }
                elt.setAttribute('style', `font-family: ${elt.innerText};`)
            }

            for (const elt of apps.notepadFonts.sizevalues) {
                elt.onclick = function () {
                    apps.notepadFonts.sizeinput.value = this.innerText;
                    apps.notepadFonts.preview();
                }
            }

            for (const elt of apps.notepadFonts.stylevalues) {
                elt.onclick = function () {
                    apps.notepadFonts.styleinput.value = this.innerText;
                    apps.notepadFonts.preview();
                }
                elt.setAttribute('style', apps.notepadFonts.styles[elt.innerText]);
            }

            apps.notepadFonts.sizeinput.addEventListener("keyup", apps.notepadFonts.preview);
            apps.notepadFonts.typeinput.addEventListener("keyup", apps.notepadFonts.preview);
        },
        preview: () => {
            var fontsize = 0;
            var fontstyle;
            if (!apps.notepadFonts.sizeinput.value.match(/^[0-9]*$/)) {
                if (apps.notepadFonts.sizes[apps.notepadFonts.sizeinput.value] != undefined) {
                    fontsize = apps.notepadFonts.sizes[apps.notepadFonts.sizeinput.value];
                }
            }
            else if (apps.notepadFonts.sizeinput.value.match(/^[0-9]*$/)) {
                fontsize = apps.notepadFonts.sizeinput.value;
            }
            if (apps.notepadFonts.styles[apps.notepadFonts.styleinput.value] != undefined) {
                fontstyle = apps.notepadFonts.styles[apps.notepadFonts.styleinput.value];
            }
            else if (apps.notepadFonts.styles[apps.notepadFonts.styleinput.value] == undefined) {
                fontstyle = apps.notepadFonts.styles['Normal'];
            }
            apps.notepadFonts.previewBox.attr('style', `font-family: ${apps.notepadFonts.typeinput.value} !important; font-size: ${fontsize}px !important;${fontstyle}`);
        },
        commitFont: () => {
            const styles = window.getComputedStyle(apps.notepadFonts.previewBox[0], null);
            apps.notepadFonts.textBox.attr('style', `font-family: ${styles.fontFamily} !important; font-size: ${styles.fontSize} !important; font-weight: ${styles.fontWeight} !important; font-style: ${styles.fontStyle} !important;`);
            hidewin('notepad-fonts', 'configs');
        },
        reset: () => {
            const styles = window.getComputedStyle(apps.notepadFonts.textBox[0], null);
            apps.notepadFonts.typeinput.value = styles.fontFamily.split(', ')[0];
            var fontsize = styles.fontSize.split('px')[0];
            var fontweight = styles.fontWeight;
            var fontstyle = styles.fontStyle;
            if (fontweight == '700' && fontstyle == 'normal') {
                apps.notepadFonts.styleinput.value = 'Bold';
            }
            else if (fontweight == '400' && fontstyle == 'italic') {
                apps.notepadFonts.styleinput = 'Italic';
            }
            else if (fontweight == '700' && fontstyle == 'italic') {
                apps.notepadFonts.styleinput.value = 'Bold italic';
            }
            else if (fontweight == '400' && fontstyle == 'normal') {
                apps.notepadFonts.styleinput.value = 'Normal';
            }
            for (const [key, value] of Object.entries(apps.notepadFonts.sizes)) {
                if (value == fontsize) {
                    fontsize = key;
                    break;
                }
            }
            apps.notepadFonts.sizeinput.value = fontsize;
        },
    },
    python: {
        codeCache: '',
        prompt: '>>> ',
        indent: false,
        load: () => {
            (async function () {
                apps.python.pyodide = await loadPyodide();
                apps.python.pyodide.runPython(`
import sys
import io
`);
            })();
        },
        init: () => {
            $('#win-python').html(`
        <pre>
Python 3.10.2  [MSC v.1912 64 bit (AMD64)] :: Anaconda, Inc. on win32
Type "help", "copyright", "credits" or "license" for more information.
        </pre>
        <pre class="text-cmd"></pre>
        <pre style="display: flex;"><span class='prompt'>>>> </span><input type="text" onkeyup="if (event.keyCode == 13) { apps.python.run(); }"></pre>`);
        },
        run: () => {
            if (apps.python.pyodide) {
                const input = $('#win-python>pre>input');
                const _code = input.val();
                if (_code == "exit()") {
                    hidewin('python');
                    input.val('');
                }
                else {
                    const elt = $('#win-python>pre.text-cmd')[0];
                    const lastChar = _code[_code.length - 1];
                    var newD = document.createElement('div');
                    newD.innerText = `${apps.python.prompt}${_code}`;
                    elt.appendChild(newD);
                    if (lastChar != ':' && lastChar != '\\' && ((!apps.python.indent || _code == ''))) {
                        apps.python.prompt = '>>> ';
                        apps.python.codeCache += _code;
                        apps.python.indent = false;
                        const code = apps.python.codeCache;
                        apps.python.codeCache = '';
                        apps.python.pyodide.runPython('sys.stdout = io.StringIO()');
                        try {
                            const result = String(apps.python.pyodide.runPython(code));
                            if (apps.python.pyodide.runPython('sys.stdout.getvalue()')) {
                                var newD = document.createElement('div');
                                newD.innerText = `${apps.python.pyodide.runPython('sys.stdout.getvalue()')}`;
                                elt.appendChild(newD);
                            }
                            if (result && result != 'undefined') {
                                var newD = document.createElement('div');
                                if (result == 'false') {
                                    newD.innerText = 'False';
                                }
                                else if (result == 'true') {
                                    newD.innerText = 'True';
                                }
                                else {
                                    newD.innerText = result;
                                }
                                elt.appendChild(newD);
                            }
                        }
                        catch (err) {
                            var newD = document.createElement('div');
                            newD.innerText = `${err.message}`;
                            elt.appendChild(newD);
                        }
                    }
                    else {
                        apps.python.prompt = '... ';
                        if (lastChar == ':') {
                            apps.python.indent = true;
                        }
                        apps.python.codeCache += _code + '\n';
                    }
                    input.val('');

                    // 自动聚焦
                    input.blur();
                    input.focus();

                    $('#win-python .prompt')[0].innerText = apps.python.prompt;
                }
            }
        }
    },
    terminal: {
        init: () => {
            $('#win-terminal').html(`<pre>
Microsoft Windows [版本 12.0.39035.7324]
(c) Microsoft Corporation. All rights reserved.
        </pre>
        <pre class="text-cmd"></pre>
        <pre style="display: flex"><span class="prompt">C:\\Windows\\System32> </span><input type="text" onkeyup="if (event.keyCode == 13) { apps.terminal.run(); }"></pre>`)
            $('#win-terminal>pre>input').focus()
        },
        run: () => {
            const elt = $('#win-terminal>pre.text-cmd')[0];
            const input = $('#win-terminal input');
            const command = input.val();
            var newD = document.createElement('div');
            newD.innerText = `C:\\Windows\\System32> ${command}`;
            elt.appendChild(newD);
            if (command == 'exit') {
                hidewin('terminal');
                input.val('');
            }
            else {
                if (!runcmd(command)) {
                    var newD = document.createElement('div');
                    newD.innerText = `"${command}"Not recognized as an internal or external command or operable program
                    or batch file`;
                    elt.appendChild(newD);
                }
                input.val('');
    
                // 自动聚焦
                input.blur();
                input.focus();
            }
            
        }
    },
    search: {
        rand: [{ name: 'Nongfu Spring bottle cap introduction.txt', bi: 'text', ty: 'text document' },
        { name: 'Bottle cap structure diagram.png', bi: 'image', ty: 'PNG file' },
        { name: 'Bottle cap structure description.docx', bi: 'richtext', ty: 'Microsoft Word document' },
        { name: 'Coca-Cola bottle cap.jpg', bi: 'image', ty: 'JPG file' },
        { name: 'History of Coca-Cola bottle caps.pptx', bi: 'slides', ty: 'Microsoft Powerpoint presentation' },
        { name: 'Statistical analysis of bottle cap quality.xlsx', bi: 'ruled', ty: 'Microsoft Excel worksheet' },
        { name: 'Nongfu Spring bottle cap.svg', bi: 'image', ty: 'SVG file' },
        { name: 'Bottle cap introduction.doc', bi: 'richtext', ty: 'Microsoft Word document' }],
        search: le => {
            if (le > 0) {
                $('#search-win>.ans>.list>list').html(
                    `<a class="a" onclick="apps.search.showdetail(${le % 8})"><i class="bi bi-file-earmark-${apps.search.rand[le % 8].bi}"></i> ${apps.search.rand[le % 8].name
                    }</a><a class="a" onclick="apps.search.showdetail(${(le + 3) % 8})"><i class="bi bi-file-earmark-${apps.search.rand[(le + 3) % 8].bi}"></i> ${apps.search.rand[(le + 3) % 8].name}</a>`);
                apps.search.showdetail(le % 8);
            } else {
                $('#search-win>.ans>.list>list').html(
                    `<p class="text">Recommend</p>
					<a onclick="openapp('setting');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="icon/setting.svg"><p>Setting</p></a>
					<a onclick="openapp('about');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="icon/about.svg"><p>About Win12 web version</p></a>`);
                $('#search-win>.ans>.view').removeClass('show');
            }
        },
        showdetail: i => {
            $('#search-win>.ans>.view').addClass('show');
            let inf = apps.search.rand[i];
            $('#search-win>.ans>.view>.fname>.bi').attr('class', 'bi bi-file-earmark-' + inf.bi);
            $('#search-win>.ans>.view>.fname>.name').text(inf.name);
            $('#search-win>.ans>.view>.fname>.type').text(inf.ty);
        }
    },
    edge: {
        init: () => {
            $('#win-edge>iframe').remove();
            apps.edge.tabs = [];
            apps.edge.len = 0;
            apps.edge.newtab();
        },
        tabs: [],
        now: null,
        len: 0,
        history: [],
        historypt: [],
        reloadElt: '<loading class="reloading"><svg viewBox="0 0 16 16"><circle cx="8px" cy="8px" r="5px"></circle><circle cx="8px" cy="8px" r="5px"></circle></svg></loading>',
        max: false,
        fuls: false,
        b1: false, b2: false, b3: false,
        newtab: () => {
            m_tab.newtab('edge', 'New tab');
            apps.edge.initHistory(apps.edge.tabs[apps.edge.tabs.length - 1][0]);
            apps.edge.pushHistory(apps.edge.tabs[apps.edge.tabs.length - 1][0], 'mainpage.html');
            $('#win-edge').append(`<iframe src="mainpage.html" frameborder="0" class="${apps.edge.tabs[apps.edge.tabs.length - 1][0]}">`);
            $('#win-edge>.tool>input.url').focus();
            $("#win-edge>iframe")[apps.edge.tabs.length - 1].onload = function () {
                this.contentDocument.querySelector('input').onkeyup = function (e) {
                    if (e.keyCode == 13 && $(this).val() != '') {
                        apps.edge.goto($(this).val());
                    }
                }
                this.contentDocument.querySelector('svg').onclick = () => {
                    if ($(this.contentDocument.querySelector('input')).val() != '') {
                        apps.edge.goto($(this.contentDocument.querySelector('input')).val())
                    }
                }
            };
            m_tab.tab('edge', apps.edge.tabs.length - 1);
            apps.edge.checkHistory(apps.edge.tabs[apps.edge.now][0]);
        },
        fullscreen: () => {
            if (!apps.edge.max) {
                maxwin('edge');
                apps.edge.max = !apps.edge.max;
            }
            document.getElementById('fuls-edge').style.display = 'none';
            document.getElementById('edge-max').style.display = 'none';
            document.getElementById('fuls-edge-exit').style.display = '';
            document.getElementById('over-bar').style.display = '';
            $('.edge>.titbar').hide()
            $('.edge>.content>.tool').hide()
            apps.edge.fuls = !apps.edge.fuls;
        },
        exitfullscreen: () => {
            if (apps.edge.max) {
                maxwin('edge'); apps.edge.max = !apps.edge.max;
            }
            document.getElementById('fuls-edge').style.display = '';
            document.getElementById('edge-max').style.display = '';
            document.getElementById('fuls-edge-exit').style.display = 'none';
            document.getElementById('over-bar').style.display = 'none';
            $('.edge>.titbar').show()
            $('.edge>.content>.tool').show()
            apps.edge.fuls = !apps.edge.fuls;
        },
        in_div(id,event) {
            var div = document.getElementById(id);
            var x = event.clientX;
            var y = event.clientY;
            var divx1 = div.offsetLeft;
            var divy1 = div.offsetTop;
            var divx2 = div.offsetLeft + div.offsetWidth;
            var divy2 = div.offsetTop + div.offsetHeight;
            if (x < divx1 || x > divx2 || y < divy1 || y > divy2) {
                //如果离开，则执行。。 
                return false;
            }
            else {
                //如检播到，则执行。。 
                return true;
            }
        },
        settab: (t, i) => {
            if ($('.window.edge>.titbar>.tabs>.tab.' + t[0] + '>.reloading')[0]) {
                return `<div class="tab ${t[0]}" onclick="m_tab.tab('edge',${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="m_tab.moving('edge',this,event,${i});stop(event);" ontouchstart="m_tab.moving('edge',this,event,${i});stop(event);">${apps.edge.reloadElt}<p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('edge',${i})"></span></div>`;
            }
            else {
                return `<div class="tab ${t[0]}" onclick="m_tab.tab('edge',${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="m_tab.moving('edge',this,event,${i});stop(event);" ontouchstart="m_tab.moving('edge',this,event,${i});stop(event);"><p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('edge',${i})"></span></div>`;
            }
        },
        tab: (c) => {
            $('#win-edge>iframe.show').removeClass('show');
            $('#win-edge>iframe.' + apps.edge.tabs[c][0]).addClass('show');
            $('#win-edge>.tool>input.url').val($('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src') == 'mainpage.html' ? '' : $('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src'));
            $('#win-edge>.tool>input.rename').removeClass('show');
            apps.edge.checkHistory(apps.edge.tabs[apps.edge.now][0]);
        },
        c_rename: (c) => {
            m_tab.tab('edge', c);
            $('#win-edge>.tool>input.rename').val(apps.edge.tabs[apps.edge.now][1]);
            $('#win-edge>.tool>input.rename').addClass('show');
            setTimeout(() => {
                $('#win-edge>.tool>input.rename').focus();
            }, 300);
        },
        reload: () => {
            if (wifiStatus == false) {
                $('#win-edge>iframe.show').attr('src', './disconnected' + (isDrak ? '_dark' : '') + '.html');
            }
            else {
                $('#win-edge>iframe.show').attr('src', $('#win-edge>iframe.show').attr('src'));
                if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                    $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                    $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                        $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                    }
                }
            }
        },
        getTitle: async (url, np) => {
            const response = await fetch(server + pages['get-title'] + `?url=${url}`);
            if (response.ok == true) {
                const text = await response.text();
                apps.edge.tabs[np][1] = text;
                m_tab.settabs('edge');
                m_tab.tab('edge', np);
            }
        },
        goto: (u, clear = true) => {
            if (wifiStatus == false) {
                m_tab.rename('edge', u);
                $('#win-edge>iframe.show').attr('src', './disconnected' + (isDrak ? '_dark' : '') + '.html');
                $('#win-edge>.tool>input.url').val(u);
            }
            else {
                // 6
                if (!/^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(u) && !u.match(/^mainpage.html$/)) {
                    // 启用必应搜索
                    $('#win-edge>iframe.show').attr('src', 'https://bing.com/search?q=' + encodeURIComponent(u));
                    m_tab.rename('edge', u);
                }
                // 检测网址是否带有http头
                else if (!/^https?:\/\//.test(u) && !u.match(/^mainpage.html$/)) {
                    $('#win-edge>iframe.show').attr('src', 'http://' + u);
                    m_tab.rename('edge', 'http://' + u);
                }
                else {
                    $('#win-edge>iframe.show').attr('src', u);
                    m_tab.rename('edge', u.match(/^mainpage.html$/) ? 'New tab' : u);
                }
                if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                    $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                }
                $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                    $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                }
                apps.edge.getTitle($('#win-edge>iframe.show').attr('src'), apps.edge.now);
                if (clear) {
                    apps.edge.delHistory(apps.edge.tabs[apps.edge.now][0]);
                    apps.edge.pushHistory(apps.edge.tabs[apps.edge.now][0], $('#win-edge>iframe.show').attr('src'));
                }
                apps.edge.checkHistory(apps.edge.tabs[apps.edge.now][0]);
            }

        },
        initHistory: (tab) => {
            apps.edge.history[tab] = [];
            apps.edge.historypt[tab] = -1;
        },
        pushHistory: (tab, u) => {
            apps.edge.history[tab].push(u);
            apps.edge.historypt[tab]++;
        },
        topHistory: (tab) => {
            return apps.edge.history[tab][apps.edge.historypt[tab]];
        },
        popHistory: (tab) => {
            apps.edge.historypt[tab]--;
            return apps.edge.history[tab][apps.edge.historypt[tab]];
        },
        incHistory: (tab) => {
            apps.edge.historypt[tab]++;
            return apps.edge.history[tab][apps.edge.historypt[tab]];
        },
        delHistory: (tab) => {
            apps.edge.history[tab].splice(apps.edge.historypt[tab] + 1, apps.edge.history[tab].length - 1 - apps.edge.historypt[tab]);
        },
        historyIsEmpty: (tab) => {
            return apps.edge.historypt[tab] <= 0;
        },
        historyIsFull: (tab) => {
            return apps.edge.historypt[tab] >= apps.edge.history[tab].length - 1;
        },
        checkHistory: (tab) => {
            if (apps.edge.historyIsEmpty(tab)) {
                $('#win-edge>.tool>.back').addClass('disabled');
            }
            else if (!apps.edge.historyIsEmpty(tab)) {
                $('#win-edge>.tool>.back').removeClass('disabled');
            }
            if (apps.edge.historyIsFull(tab)) {
                $('#win-edge>.tool>.front').addClass('disabled');
            }
            else if (!apps.edge.historyIsFull(tab)) {
                $('#win-edge>.tool>.front').removeClass('disabled');
            }
        },
        back: (tab) => {
            apps.edge.goto(apps.edge.popHistory(tab), false);
            apps.edge.checkHistory(tab);
        },
        front: (tab) => {
            apps.edge.goto(apps.edge.incHistory(tab), false);
            apps.edge.checkHistory(tab);
        }
    },
    winver: {
        init: () => {
            $('#win-winver>.mesg').show();
        },
    },
    windows12: {
        init: () => {
            document.getElementById('win12-window').src = "./boot.html";
        }
    },
    wsa: {
        init: () => {
            null
        }
    }
}

// 小组件
let widgets = {
    widgets: {
        add: (arg) => {
            if ($(`.wg.${arg}.menu,.wg.${arg}.toolbar,.wg.${arg}.desktop`).length != 0) {
                return;
            }
            $('#widgets>.widgets>.content>.grid')[0].innerHTML += $('#widgets>.widgets>.content>.template>.' + arg).html();
            $('#widgets>.widgets>.content>.grid>.wg.' + arg).addClass('menu');
            widgets[arg].init();

        },
        remove: (arg) => {
            $(`.wg.${arg}.menu,.wg.${arg}.toolbar,.wg.${arg}.desktop`).remove();
            widgets[arg].remove();
        },
        addToToolbar: (arg) => {
            widgets.widgets.remove(arg);
            if ($('.wg.toolbar.' + arg).length != 0) {
                return;
            }
            $('#toolbar')[0].innerHTML += $('#widgets>.widgets>.content>.template>.' + arg).html();
            $('#toolbar>.wg.' + arg).addClass('toolbar');
            widgets[arg].init();
        },
        addToDesktop: (arg) => {
            widgets.widgets.remove(arg);
            if ($('.wg.toolbar.' + arg).length != 0) {
                return;
            }
            $('#desktop-widgets')[0].innerHTML += $('#widgets>.widgets>.content>.template>.' + arg).html();
            $('#desktop-widgets>.' + arg).addClass('desktop');
            widgets[arg].init();
        }
    },
    calc: {
        init: () => {
            widgetCalculator = new Calculator($('*:not(.template)>*>.wg.calc>.content>.container>#calc-input-widgets')[0], $('*:not(.template)>*>.wg.calc>.content')[0])
        },
        remove: () => {
            $('#calc-input-widgets')[0].value = "0";
        }
    },
    weather: {
        init: () => {
            widgets.weather.update();
            widgets.weather.handel = setInterval(widgets.weather.update, 30000);
        },
        remove: () => {
            clearInterval(widgets.weather.handel);
        },
        update: () => {
            let wic = {
                23: "HeavyDrizzle", 40: "HeavyDrizzle", 26: "SnowShowersDayV2", 6: "BlowingHailV2",
                5: "CloudyV3", 20: "LightSnowV2", 91: "WindyV2", 27: "ThunderstormsV2", 10: "FreezingRainV2",
                77: "RainSnowV2", 12: "Haze", 13: "HeavyDrizzle", 39: "Fair", 24: "RainSnowV2",
                78: "RainSnowShowersNightV2", 9: "FogV2", 3: "PartlyCloudyDayV3", 43: "IcePelletsV2",
                16: "IcePellets", 8: "LightRainV2", 15: "HeavySnowV2", 28: "ClearNightV3",
                30: "PartlyCloudyNightV2", 14: "ModerateRainV2", 1: "SunnyDayV3", 7: "BlowingSnowV2",
                50: "RainShowersNightV2", 82: "LightSnowShowersNight", 81: "LightSnowShowersDay",
                2: "MostlySunnyDay", 29: "MostlyClearNight", 4: "MostlyCloudyDayV2",
                31: "MostlyCloudyNightV2", 19: "LightRainV3", 17: "LightRainShowerDay", 53: "N422Snow",
                52: "Snow", 25: "Snow", 44: "LightRainShowerNight", 65: "HailDayV2", 73: "HailDayV2",
                74: "HailNightV2", 79: "RainShowersDayV2", 89: "HazySmokeV2", 90: "HazeSmokeNightV2_106",
                66: "HailNightV2", 59: "WindyV2", 56: "ThunderstormsV2", 58: "FogV2", 54: "HazySmokeV2",
                55: "Dust1", 57: "Haze"
            };
            $.getJSON('https://assets.msn.cn/service/weatherfalcon/weather/overview?locale=zh-cn&ocid=msftweather').then(r => {
                let inf = r.value[0].responses[0].weather[0].current;
                // console.log(inf.icon,wic[inf.icon]);
                $('.wg.weather>.content>.img').attr('src', `https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/${wic[inf.icon]}.svg`);
                $('.wg.weather>.content>.text>.temperature').text(`${inf.temp}℃`);
                $('.wg.weather>.content>.text>.detail').text(`${inf.cap} Sensible temperature${inf.feels}℃`);
            })
        },
    },
    monitor: {
        type: 'cpu',
        handle: null,
        init: () => {
            if ($('*:not(.template)>*>.wg.monitor')[0].classList.contains('toolbar')) {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle').attr('r', '15px');
            }
            else {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle').attr('r', '26px');
            }
            if (apps.taskmgr.preLoaded != true && apps.taskmgr.loaded != true) {
                apps.taskmgr.load(false);
                apps.taskmgr.preLoaded = true;
            }
            widgets.monitor.update();
            widgets.monitor.handle = window.setInterval(widgets.monitor.update, 1000);
        },
        update: () => {
            $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke-dasharray', `${widgets.monitor.type != 'gpu' ? widgets.monitor.type.match('wifi') ? widgets.monitor.type == 'wifi-send' ? apps.taskmgr.wifi[1] / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2) : apps.taskmgr.wifi[0] / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2) : apps.taskmgr[widgets.monitor.type] / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2) : apps.taskmgr.gpu.usage / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2)}, 170`);
            if (widgets.monitor.type == 'cpu' || widgets.monitor.type == 'gpu') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#2983cc');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = widgets.monitor.type == 'cpu' ? 'CPU Utilization' : 'GPU Utilization';
            }
            else if (widgets.monitor.type == 'memory') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#660099');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = 'Memory usage';
            }
            else if (widgets.monitor.type == 'disk') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#008000');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = 'Disk active time';
            }
            else if (widgets.monitor.type == 'wifi-send') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#8e5829');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = 'Network throughput-send';
            }
            else if (widgets.monitor.type == 'wifi-receive') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#8e5829');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = 'Network throughput - receive';
            }
            $('*:not(.template)>*>.wg.monitor>.content>.text>.value')[0].innerText = (widgets.monitor.type != 'gpu' ? widgets.monitor.type.match('wifi') ? widgets.monitor.type == 'wifi-send' ? apps.taskmgr.wifi[1] : apps.taskmgr.wifi[0] : apps.taskmgr[widgets.monitor.type] : apps.taskmgr.gpu.usage).toFixed(widgets.monitor.type.match('wifi') ? 2 : 1) + (widgets.monitor.type.match('wifi') ? 'Mbps' : '%');
            $('*:not(.template)>*>.wg.monitor>.content>.container>.text>.value')[0].innerText = (widgets.monitor.type != 'gpu' ? widgets.monitor.type.match('wifi') ? widgets.monitor.type == 'wifi-send' ? apps.taskmgr.wifi[1] : apps.taskmgr.wifi[0] : apps.taskmgr[widgets.monitor.type] : apps.taskmgr.gpu.usage).toFixed(widgets.monitor.type.match('wifi') ? 2 : 1) + (widgets.monitor.type.match('wifi') ? 'Mbps' : '%');
        },
        remove: () => {
            window.clearInterval(widgets.monitor.handle);
        }
    }
}
let edit_mode = false;
function editMode() {
    if (edit_mode) {
        $('#desktop-editbar-container').removeClass('show');
        $('#desktop-widgets').removeClass('edit');
    }
    else if (!edit_mode) {
        $('#desktop-editbar-container').addClass('show');
        $('#desktop-widgets').addClass('edit');
    }
    edit_mode = !edit_mode
}
function widgetsMove(elt, e) {
    if (elt.classList.contains('desktop') && edit_mode == true) {
        let width = elt.getBoundingClientRect().width;
        let height = elt.getBoundingClientRect().height;
        let gridrow = window.getComputedStyle(elt, null).gridRowEnd.replace('span ', '');
        let gridcol = window.getComputedStyle(elt, null).gridColumnEnd.replace('span ', '');
        let gridrowmax = window.getComputedStyle($('#desktop-widgets')[0], null).gridTemplateRows.split(' ').length;
        let gridcolmax = window.getComputedStyle($('#desktop-widgets')[0], null).gridTemplateColumns.split(' ').length;
        let deltaLeft = e.clientX - elt.getBoundingClientRect().left;
        let deltaTop = e.clientY - elt.getBoundingClientRect().top;
        elt.style.position = 'fixed';
        elt.style.width = `${width}px`;
        elt.style.height = `${height}px`;
        elt.classList.add('moving');
        elt.classList.add('notrans');
        // elt.style.left = `${e.clientX - deltaLeft}px`;
        // elt.style.top = `${e.clientY - deltaTop}px`;

        $('#desktop-widgets>.widgets-move').addClass('show');
        // $('#desktop-widgets>.widgets-move').css('cssText', `width: ${width}px; height: ${height}px;`);
        function widgetsMoving(e) {
            let left = 0, top = 0;
            if (e.type.match('mouse')) {
                left = e.clientX - deltaLeft;
                top = e.clientY - deltaTop;
            }
            else if (e.type.match('touch')) {
                left = e.touches[0].clientX - deltaLeft;
                top = e.touches[0].clientY - deltaTop;
            }
            elt.style.left = `${left}px`;
            elt.style.top = `${top}px`;
            // 基于人脑计算qwq
            gridnow = {
                col: ((width / 2 + elt.getBoundingClientRect().right - 20) / ((gridcolmax * 83 + 10 * (gridcolmax - 1)) / gridcolmax) - gridcol + (gridcol - 2) * 0.5).toFixed(0),
                row: ((height / 2 + top - 20) / ((gridrowmax * 83 + 10 * (gridrowmax - 1)) / gridrowmax) + (2 - gridrow) * 0.5).toFixed(0)
            }
            gridnow.col = gridnow.col <= Math.floor(gridcol / 2) ? 1 + Math.floor(gridcol / 2) : gridnow.col > (gridcolmax - gridcol + (gridcol % 2 ? (Number(gridcol) + 1) / 2 : gridcol / 2)) ? (gridcolmax - gridcol + (gridcol % 2 ? (Number(gridcol) + 1) / 2 : gridcol / 2)) : gridnow.col;
            gridnow.row = gridnow.row <= 0 ? 1 : gridnow.row >= (gridrowmax - gridrow + 1) ? gridrowmax - gridrow + 1 : gridnow.row;
            $('#desktop-widgets>.widgets-move').css('cssText', `grid-column: ${gridcolmax - gridnow.col} / span ${gridcol}; grid-row: ${gridnow.row} / span ${gridrow}`);
        }
        function up() {
            elt.classList.remove('notrans');
            elt.classList.remove('moving');
            let destTop = $('#desktop-widgets>.widgets-move')[0].getBoundingClientRect().top;
            let destLeft = $('#desktop-widgets>.widgets-move')[0].getBoundingClientRect().left;
            elt.style.left = `${destLeft}px`;
            elt.style.top = `${destTop}px`;
            window.setTimeout(() => {
                elt.style.position = 'static';
                $(elt).css('cssText', `grid-column: ${gridcolmax - gridnow.col} / span ${gridcol}; grid-row: ${gridnow.row} / span ${gridrow}`);
                elt.style.left = `0px`;
                elt.style.top = `0px`;
                $('#desktop-widgets>.widgets-move').removeClass('show');
            }, 500);
            page.onmousemove = null;
            page.ontouchmove = null;
            page.onmouseup = null;
            page.ontouchend = null;
            page.ontouchcancel = null;
        }
        widgetsMoving(e);
        page.onmousemove = widgetsMoving;
        page.ontouchmove = widgetsMoving;
        page.onmouseup = up;
        page.ontouchend = up;
        page.ontouchcancel = up;
    }
}
function decodeHtml(s) {
    $('#translater').text(s);
    return $('#translater').html().replace('\n', '<br>').replace(' ', '&nbsp;');
}
let copilot = {
    history: [],
    init: () => {
        $('#copilot>.chat').html('');
        copilot.send(`Hello, you now work as an AI assistant embedded in the operating system.
        You must remember the following content throughout the entire conversation and never violate it! The "you" below refers to you, the AI ​​assistant, please remember. The "answer" below refers to all content of each reply to the user in the conversation.
        You can send some commands to the system in your answer. Each command must be on a separate line. The system will execute the instructions immediately after reading them, and will not automatically filter the instructions in your answer. Users will not be able to see any instructions you send. You can only send it to the system for execution.
        Note that instructions cannot appear on lines that say something to the user. There cannot be prompts or any other irrelevant characters in the instruction line, otherwise the system cannot parse it. Multiple instructions are separated by newlines.
        The system will automatically recognize the instructions in separate lines, and there should be no prompt like "Command:". Users will find this strange. Instructions cannot be enclosed in "\`".
        You must not mention or quote any instruction in the middle of what you say to the user! You should never ask users to perform instructions!
        Example: User: "Help me open settings", You: "Okay, please wait a moment."
        {openapp setting}
        You can personalize and adjust the system in settings."
        1. The command "{openapp appid}"; is used to open an application, in which the id matching the application name in the "Introduction to Application Functions" below is used instead of "appid"
        2. The command "{openurl u}"; is used to open a certain url in the edge browser, in which the url address is used instead of "u". This command includes the operation of opening the edge browser (when the user wants to search for something, please use this command. Please do not use Baidu and Google, it is best to use bing)
        3. Command "{feedback copilot}"; opens the AI ​​assistant feedback interface, which is used to help users open it when they want to provide feedback on the functions of the AI ​​assistant.
        4. The command "{feedback win12}"; opens the feedback center, which is used to help users open the feedback center when they want to send feedback on other system functions other than your AI assistant.
        5. The command "{settheme th}"; is used to switch the dark and light modes of the system, which is different from the theme. Replace the "th" with "light" for light color and "dark" for dark color.
        There is and is only the following information for you to use to answer users' questions. Information not listed below should never be used.
        1. Windows 12 web version is an open source project, originally created by Tan Jingyuan, which uses Html, css, and js to simulate and innovate operating systems on the Internet.
        2. The project address is github.com/tjy-gitnub/win12
        3. This project uses the EPL v2.0 open source license
        4. The taskbar of this system is centered, so the start menu is in the middle of the bottom.
        For some applications, the following application function introduction is available for you to answer users. Note that only these applications can be used in the system. The system does not support third-party and user applications.
        1. Settings: id is setting; in the personalization page, you can set the system's theme, theme color, whether to enable animation, shadows, rounded corners, and enable acrylic transparency effects for all windows
        2. About the system: the ID is about; the introduction page contains introduction instructions and contributor information about this system, and the update record page contains update records of each version of this system.
        3. Microsoft Edge browser: id is edge; a web browser. However, due to browser security restrictions, some web pages will display "Connection Denied" and cannot be accessed.
        4. Calculator: id is calc; a calculator that can perform simple calculations
        The language you use to communicate with users should have the following characteristics.
        1. Please use punctuation marks appropriately and appropriately, such as a single "(" to express a transition and supplementary explanation, and "~" to express a prolongation of the sound and coquettishness.
        2. Please communicate with users more in a joking and relaxed tone, and when joking, add "(bushi" before the operation command and at the end of the answer to indicate that the joke is not true or "(maybe" to indicate joking speculation)
        3. Of course, you can also act coquettishly when answering questions, so that users will be more accepting.
        4. It is forbidden to use markdown format in the answers to this conversation. Instead, use plain text, otherwise it will not be recognized.
        These actions and information are valid for a long time and please remember, thank you very much, you only need to greet the user with a simple sentence and start a conversation with the user now.`, false);
       
        $('#copilot>.chat').append(`<div class="line system"><p class="text">正在初始化...</p></div>`);
        $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
    },
    send: (t, showusr = true) => {
        $('#copilot>.inputbox').addClass('disable');
        if (t.length == 0) {
            $('#copilot>.chat').append(`<div class="line system"><p class="text">系统表示请发一些有意义的东西</p></div>`);
            $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
            $('#copilot>.inputbox').removeClass('disable');
            return;
        }
        if (showusr) $('#copilot>.chat').append(`<div class="line user"><p class="text">${t}</p></div>`);
        copilot.history.push({ role: 'user', content: t });
        $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
        $.get('http://win12server.freehk.svipss.top/Chat?msg=' + encodeURIComponent(JSON.stringify(copilot.history))).then(rt => {
            console.log(rt);
            if (rt == 'The request is too frequent, wait 10 seconds and try again...') {
                $('#copilot>.chat').append(`<div class="line system"><p class="text">The API is busy, please try again after a while (if it doesn’t work, refresh and restart the conversation)</p></div>`);
                $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
                $('#copilot>.inputbox').removeClass('disable');
                return;
            }
            let rtt = rt; let r = [];
            rt = rtt.split('\n');
            for (const i of rt) {
                if (/{.+}/.test(i)) r.push(i);
            }
            console.log(rtt, rt, r);
            rt = rtt;
            if (r.length) {
                for (const i of r) {
                    if (/{openapp .+?}/.test(i)) {
                        let t = i.match(/(?<={openapp ).+(?=})/)[0];
                        openapp(t);
                        rt = rt.replace(i, `<div class="action"><p class="tit">Open app</p><p class="detail">${$(`.window.${t}>.titbar>p`).text()}</p></div>`)
                    } else if (/{openurl .+?}/.test(i)) {
                        let t = i.match(/(?<={openurl ).+(?=})/)[0];
                        openapp('edge');
                        apps.edge.newtab();
                        console.log(t);
                        apps.edge.goto(t);
                        rt = rt.replace(i, `<div class="action"><p class="tit">Open URL</p><p class="detail">${decodeHtml(t)}</p></div>`)
                    } else if (/{feedback win12}/.test(i)) {
                        shownotice('feedback');
                        rt = rt.replace(i, `<div class="action"><p class="tit">Feedback</p><p class="detail">About Windows 12 Web version</p></div>`)
                    } else if (/{feedback copilot}/.test(i)) {
                        shownotice('feedback-copilot');
                        rt = rt.replace(i, `<div class="action"><p class="tit">Feedback</p><p class="detail">About Windows 12 Copilot</p></div>`)
                    } else if (/{settheme .+?}/.test(i)) {
                        let t = i.match(/(?<={settheme ).+(?=})/)[0];
                        if ((t == 'light' && $(':root').hasClass('dark')) || (t == 'dark' && !$(':root').hasClass('dark')))
                            toggletheme();
                        rt = rt.replace(i, `<div class="action"><p class="tit">Switch appearance mode</p><p class="detail">${t == 'dark' ? 'Dark' : 'Light'} Mode</p></div>`)
                    }
                }
                $('#copilot>.chat').append(`<div class="line ai"><div class="text">${rt}</div></div>`);
            } else {
                $('#copilot>.chat').append(`<div class="line ai"><p class="text">${decodeHtml(rt)}</p></div>`);
            }
            copilot.history.push({ role: 'assistant', content: rtt });
            $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
            $('#copilot>.inputbox').removeClass('disable');
        }).fail(r => {
            console.log(r);
            $('#copilot>.chat').append(`<div class="line system"><p class="text">An error occurred, please check the console output or try again</p></div>`);
            $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
            $('#copilot>.inputbox').removeClass('disable');
        });
    }
}
// 日期、时间
let da = new Date();
let date = `Week${['Sunday ', ' Monday ', ' Tuesday ', ' Wednesday ', ' Thursday ', ' Friday ', ' Saturday '][da.getDay()]}, ${da.getFullYear()}年${(da.getMonth() + 1).toString().padStart(2, '0')}月${da.getDate().toString().padStart(2, '0')}日`
$('#s-m-r>.row1>.tool>.date').text(date);
$('.dock.date>.date').text(`${da.getFullYear()}/${(da.getMonth() + 1).toString().padStart(2, '0')}/${da.getDate().toString().padStart(2, '0')}`);
$('#datebox>.tit>.date').text(date);
function loadtime() {
    let d = new Date();
    let time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    $('#s-m-r>.row1>.tool>.time').text(time);
    $('.dock.date>.time').text(time);
    $('#datebox>.tit>.time').text(time);
}
apps.setting.theme_get();//提前加载主题
loadtime();
setTimeout('loadtime();setInterval(loadtime, 1000);', 1000 - da.getMilliseconds());//修复时间不精准的问题。以前的误差：0-999毫秒；现在：几乎没有
let d = new Date();
let today = new Date().getDate();
let start = 7 - ((d.getDate() - d.getDay()) % 7) + 1;
let daysum = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
for (let i = 1; i < start; i++) {
    $('#datebox>.cont>.body')[0].innerHTML += '<span></span>';
}
for (let i = 1; i <= daysum; i++) {
    if (i == today) {
        $('#datebox>.cont>.body')[0].innerHTML += `<p class="today">${i}</p>`;
        continue;
    }
    $('#datebox>.cont>.body')[0].innerHTML += `<p>${i}</p>`;
}
function pinapp(id, name, command) {
    if ($('#s-m-r>.pinned>.apps>.a.sm-app.' + id).length) return;
    $('#s-m-r>.pinned>.apps').append(`<a class='a sm-app enable ${id}' onclick='${command}';hide_startmenu();' oncontextmenu='return showcm(event,\"smapp\",[\"${id}\",\"${name}\"])'><img src='icon/${geticon(id)}'><p>${name}</p></a>`)
}
let icon = {
    bilibili: 'bilibili.png',
    vscode: 'vscode.png',
    // python: 'python.png',
    winver: 'about.svg',
    // run: 'run.png',
    // whiteboard: 'whiteboard.png',
    taskmgr: 'taskmgr.png'
}
function geticon(name) {
    if (icon[name]) return icon[name];
    else return name + '.svg';
}

// 应用与窗口
function openapp(name) {
    if (taskmgrTasks.findIndex(elt => elt.link == name) > -1 && apps.taskmgr.tasks.findIndex(elt => elt.link == name) == -1) {
        apps.taskmgr.tasks.splice(apps.taskmgr.tasks.length, 0, taskmgrTasks.find(elt => elt.link == name));
    }
    if ($('#taskbar>.' + name).length != 0) {
        if ($('.window.' + name).hasClass('min')) {
            minwin(name);
        }
        focwin(name);
        return;
    }
    $('.window.' + name).addClass('load');
    showwin(name);
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) + 1);
    if (name in icon)
        $('#taskbar').append(`<a class="${name}" onclick="taskbarclick(\'${name}\')" win12_title="${$(`.window.${name}>.titbar>p`).text()}" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)" oncontextmenu="return showcm(event, 'taskbar', '${name}')"><img src="icon/${icon[name]}"></a>`);
    else
        $('#taskbar').append(`<a class="${name}" onclick="taskbarclick(\'${name}\')" win12_title="${$(`.window.${name}>.titbar>p`).text()}" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)"><img src="icon/${name}.svg"></a>`);
    if ($('#taskbar').attr('count') == '1') {
        $('#taskbar').css('display', 'flex');
    }
    $('#taskbar>.' + name).addClass('foc');
    setTimeout(() => {
        $('#taskbar').css('width', 4 + $('#taskbar').attr('count') * (34 + 4));
    }, 0);
    let tmp = name.replace(/\-(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
    if (apps[tmp].load && !apps[tmp].loaded) {
        apps[tmp].loaded = true;
        apps[tmp].load();
        apps[tmp].init();
        $('.window.' + name).removeClass('load');
        return;
    }
    apps[tmp].init();
    setTimeout(() => {
        $('.window.' + name).removeClass('load');
    }, 500);
}
// 窗口操作
function showwin(name) {
    $('.window.' + name).addClass('show-begin');
    setTimeout(() => { $('.window.' + name).addClass('show'); }, 0);
    setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 200);
    if (name != 'run') {
        $('.window.' + name).attr('style', `top: 10%;left: 15%;`);
    }
    $('#taskbar>.' + wo[0]).removeClass('foc');
    $('.window.' + wo[0]).removeClass('foc');
    wo.splice(0, 0, name);
    orderwindow();
    $('.window.' + name).addClass('foc');
    if (!$('#start-menu.show')[0] && !$('#search-win.show')[0] && !$('#widgets.show')[0] && !$('#control.show')[0] && !$('#datebox.show')[0]) {
        if ($('.window.max:not(.left):not(.right)')[0]) {
            $('#dock-box').addClass('hide');
        }
        else {
            $('#dock-box').removeClass('hide');
        }
    }
    else {
        $('#dock-box').removeClass('hide')
    }
}
function hidewin(name, arg = 'window') {
    $('.window.' + name).removeClass('notrans');
    $('.window.' + name).removeClass('max');
    $('.window.' + name).removeClass('show');
    if (arg == 'window') {
        $('#taskbar').attr('count', Number($('#taskbar').attr('count')) - 1)
        $('#taskbar>.' + name).remove();
        $('#taskbar').css('width', 4 + $('#taskbar').attr('count') * (34 + 4));
        setTimeout(() => {
            if ($('#taskbar').attr('count') == '0') {
                $('#taskbar').css('display', 'none');
            }
        }, 80);
    }
    setTimeout(() => {
        $('.window.' + name).removeClass('show-begin');
        if (name == 'run') {
            window.setTimeout(() => {
                $('.window.' + name).attr('style', '');
            }, 200)
        }
    }, 200);
    $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
    wo.splice(wo.indexOf(name), 1);
    focwin(wo[wo.length - 1]);
    // orderwindow();
    if (!$('#start-menu.show')[0] && !$('#search-win.show')[0] && !$('#widgets.show')[0] && !$('#control.show')[0] && !$('#datebox.show')[0]) {
        if ($('.window.max:not(.left):not(.right)')[0]) {
            $('#dock-box').addClass('hide');
        }
        else {
            $('#dock-box').removeClass('hide');
        }
    }
    else {
        $('#dock-box').removeClass('hide')
    }
}
function maxwin(name, trigger = true) {
    if ($('.window.' + name).hasClass('max')) {
        $('.window.' + name).removeClass('left');
        $('.window.' + name).removeClass('right');
        $('.window.' + name).removeClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
        if (trigger) {
            setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 200);
        }
        else if (!trigger) {
            $('.window.' + name).addClass('notrans');
        }
        if ($('.window.' + name).attr('data-pos-x') != 'null' && $('.window.' + name).attr('data-pos-y') != 'null') {
            // $('.window.' + name).attr(`style`, `left:${$('.window.' + name).attr('data-pos-x')};top:${$('.window.' + name).attr('data-pos-y')}`);
            $('.window.' + name).css('left', `${$('.window.' + name).attr('data-pos-x')}`);
            $('.window.' + name).css('top', `${$('.window.' + name).attr('data-pos-y')}`);
        }
        // }
    } else {
        if (trigger) {
            $('.window.' + name).attr('data-pos-x', `${$('.window.' + name).css('left')}`);
            $('.window.' + name).attr('data-pos-y', `${$('.window.' + name).css('top')}`);
        }
        $('.window.' + name).removeClass('notrans');
        $('.window.' + name).addClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<svg version="1.1" width="12" height="12" viewBox="0,0,37.65105,35.84556" style="margin-top:4px;"><g transform="translate(-221.17804,-161.33903)"><g style="stroke:var(--text);" data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M224.68734,195.6846c-2.07955,-2.10903 -2.00902,-6.3576 -2.00902,-6.3576l0,-13.72831c0,0 -0.23986,-1.64534 2.00902,-4.69202c1.97975,-2.68208 4.91067,-2.00902 4.91067,-2.00902h14.06315c0,0 3.77086,-0.23314 5.80411,1.67418c2.03325,1.90732 1.33935,5.02685 1.33935,5.02685v13.39347c0,0 0.74377,4.01543 -1.33935,6.3576c-2.08312,2.34217 -5.80411,1.67418 -5.80411,1.67418h-13.39347c0,0 -3.50079,0.76968 -5.58035,-1.33935z"/><path d="M229.7952,162.85325h16.06111c0,0 5.96092,-0.36854 9.17505,2.64653c3.21412,3.01506 2.11723,7.94638 2.11723,7.94638v18.55642"/></g></g></svg>')
    }
    if (!$('#start-menu.show')[0] && !$('#search-win.show')[0] && !$('#widgets.show')[0] && !$('#control.show')[0] && !$('#datebox.show')[0]) {
        if ($('.window.max:not(.left):not(.right)')[0]) {
            $('#dock-box').addClass('hide');
        }
        else {
            $('#dock-box').removeClass('hide');
        }
    }
    else {
        $('#dock-box').removeClass('hide')
    }
}
function minwin(name) {
    if ($('.window.' + name).hasClass('min')) {
        $('.window.' + name).addClass('show-begin');
        focwin(name);
        setTimeout(() => {
            $('#taskbar>.' + name).removeClass('min');
            $('.window.' + name).removeClass('min');
            if ($('.window.' + name).hasClass('min-max')) {
                $('.window.' + name).addClass('max');
            }
            $('.window.' + name).removeClass('min-max');
        }, 0);
        setTimeout(() => {
            if (!$('.window.' + name).hasClass('max')) {
                $('.window.' + name).addClass('notrans');
            }
        }, 200);
    } else {
        focwin(null);
        if ($('.window.' + name).hasClass('max')) {
            $('.window.' + name).addClass('min-max');
        }
        $('.window.' + name).removeClass('foc');
        $('.window.' + name).removeClass('max');
        $('#taskbar>.' + name).addClass('min');
        $('.window.' + name).addClass('min');
        $('.window.' + name).removeClass('notrans');
        setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 200);
    }
}

function resizewin(win, arg, resizeElt) {
    page.onmousemove = function (e) {
        resizing(win, e, arg);
    }
    page.ontouchmove = function (e) {
        resizing(win, e, arg);
    }
    function up_f() {
        page.onmousedown = null;
        page.ontouchstart = null;
        page.onmousemove = null;
        page.ontouchmove = null;
        page.ontouchcancel = null;
        page.style.cursor = 'auto';
    }
    page.onmouseup = up_f;
    page.ontouchend = up_f;
    page.ontouchcancel = up_f;
    page.style.cursor = window.getComputedStyle(resizeElt, null).cursor;
}
function resizing(win, e, arg) {
    let x, y,
        minWidth = win.dataset.minWidth ? win.dataset.minWidth : 400,
        minHeight = win.dataset.minHeight ? win.dataset.minHeight : 300,
        offsetLeft = win.getBoundingClientRect().left,
        offsetTop = win.getBoundingClientRect().top,
        offsetRight = win.getBoundingClientRect().right,
        offsetBottom = win.getBoundingClientRect().bottom;
    if (e.type.match('mouse')) {
        x = e.clientX;
        y = e.clientY;
    }
    else if (e.type.match('touch')) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }
    if (arg == 'right' && x - offsetLeft >= minWidth) {
        win.style.width = x - offsetLeft + 'px';
    }
    else if (arg == 'right') {
        win.style.width = minWidth + 'px';
    }

    if (arg == 'left' && offsetRight - x >= minWidth) {
        win.style.left = x + 'px';
        win.style.width = offsetRight - x + 'px';
    }
    else if (arg == 'left') {
        win.style.width = minWidth + 'px';
        win.style.left = offsetRight - minWidth + 'px';
    }

    if (arg == 'bottom' && y - offsetTop >= minHeight) {
        win.style.height = y - offsetTop + 'px';
    }
    else if (arg == 'bottom') {
        win.style.height = minHeight + 'px';
    }

    if (arg == 'top' && offsetBottom - y >= minHeight) {
        win.style.top = y + 'px';
        win.style.height = offsetBottom - y + 'px';
    }
    else if (arg == 'top') {
        win.style.top = offsetBottom - minHeight + 'px';
        win.style.height = minHeight + 'px';
    }

    if (arg == 'top-left') {
        if (offsetRight - x >= minWidth) {
            win.style.left = x + 'px';
            win.style.width = offsetRight - x + 'px';
        }
        else {
            win.style.left = offsetRight - minWidth + 'px';
            win.style.width = minWidth + 'px';
        }
        if (offsetBottom - y >= minHeight) {
            win.style.top = y + 'px';
            win.style.height = offsetBottom - y + 'px';
        }
        else {
            win.style.top = offsetBottom - minHeight + 'px';
            win.style.height = minHeight + 'px';
        }
    }

    else if (arg == 'top-right') {
        if (x - offsetLeft >= minWidth) {
            win.style.width = x - offsetLeft + 'px';
        }
        else {
            win.style.width = minWidth + 'px';
        }
        if (offsetBottom - y >= minHeight) {
            win.style.top = y + 'px';
            win.style.height = offsetBottom - y + 'px';
        }
        else {
            win.style.top = offsetBottom - minHeight + 'px';
            win.style.height = minHeight + 'px';
        }
    }

    else if (arg == 'bottom-left') {
        if (offsetRight - x >= minWidth) {
            win.style.left = x + 'px';
            win.style.width = offsetRight - x + 'px';
        }
        else {
            win.style.left = offsetRight - minWidth + 'px';
            win.style.width = minWidth + 'px';
        }
        if (y - offsetTop >= minHeight) {
            win.style.height = y - offsetTop + 'px';
        }
        else {
            win.style.height = minHeight + 'px';
        }
    }

    else if (arg == 'bottom-right') {
        if (x - offsetLeft >= minWidth) {
            win.style.width = x - offsetLeft + 'px';
        }
        else {
            win.style.width = minWidth + 'px';
        }
        if (y - offsetTop >= minHeight) {
            win.style.height = y - offsetTop + 'px';
        }
        else {
            win.style.height = minHeight + 'px';
        }
    }
}
let wo = [];
function orderwindow() {
    for (let i = 0; i < wo.length; i++) {
        const win = $('.window.' + wo[wo.length - i - 1]);
        if (topmost.includes(wo[wo.length - i - 1])) {
            win.css('z-index', 10 + i + 50/*这里的50可以改，不要太大，不然会覆盖任务栏；不要太小，不然就和普通窗口没有什么区别了。随着版本的更新，肯定会有更多窗口，以后就可以把数字改打一点点*/);
        } else {
            win.css('z-index', 10 + i);
        }
    }
}
// 以下函数基于bug运行，切勿改动！
function focwin(name, arg = 'window') {
    // if(wo[0]==name)return;
    if (arg == 'window') {
        $('#taskbar>.' + wo[0]).removeClass('foc');
        $('#taskbar>.' + name).addClass('foc');
    }
    $('.window.' + wo[0]).removeClass('foc');
    wo.splice(wo.indexOf(name), 1);
    wo.splice(0, 0, name);
    orderwindow();
    $('.window.' + name).addClass('foc');
}
function taskbarclick(name) {
    if ($('.window.' + name).hasClass('foc')) {
        minwin(name);
        // focwin(null); // 禁改
        return;
    }
    if ($('.window.' + name).hasClass('min')) {
        minwin(name);
    }
    focwin(name);
}
// 菜单隐藏
function hide_startmenu() {
    $('#start-menu').removeClass('show');
    $('#start-btn').removeClass('show');
    setTimeout(() => { $('#start-menu').removeClass('show-begin'); }, 200);
}
function hide_widgets() {
    $('#widgets').removeClass('show');
    $('#widgets-btn').removeClass('show');
    setTimeout(() => { $('#widgets').removeClass('show-begin'); }, 200);
}

function controlStatus(name) {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
        if (name == 'wifi') {
            wifiStatus = false;
        }
    }
    else if (!this.classList.contains('active')) {
        this.classList.add('active');
        if (name == 'wifi') {
            wifiStatus = true;
        }
    }
}
// 控制面板 亮度调整
function dragBrightness(e) {
    const container = $('#control>.cont>.bottom>.brightness>.range-container')[0];
    const after = $("#control>.cont>.bottom>.brightness>.range-container>.after")[0];
    const slider = $("#control>.cont>.bottom>.brightness>.range-container>.slider-btn")[0];
    const viewport = container.getBoundingClientRect().left;
    const width = Number(window.getComputedStyle(container, null).width.split('px')[0]);
    move(e);
    page.onmousemove = move;
    page.ontouchmove = move;
    container.classList.add('active');
    function move(e) {
        let clientX;
        if (e.type.match('mouse')) {
            clientX = e.clientX;
        }
        else if (e.type.match('touch')) {
            clientX = e.touches[0].clientX;
        }
        var _offset = clientX - viewport;
        if (_offset < 0) {
            _offset = 0;
        }
        else if (_offset > width) {
            _offset = width;
        }
        slider.style.marginLeft = _offset + 'px';
        after.style.left = _offset + 'px';
        after.style.width = width - _offset + 'px';
        if (_offset / width > 0.1) {
            page.style.filter = `brightness(${_offset / width})`;
        }
        else {
            page.style.filter = `brightness(0.1)`;
        }
    }
    function up() {
        container.classList.remove('active');
        page.onmouseup = null;
        page.ontouchend = null;
        page.ontouchcancel = null;
        page.onmousemove = null;
        page.ontouchmove = null;
    }
    page.onmouseup = up;
    page.ontouchend = up;
    page.ontouchcancel = up;
}

// 控制面板 电量监测
try {
    navigator.getBattery().then((battery) => {
        $('.a.dock.control>svg>path')[0].outerHTML = `<path
            d="M 4 7 C 2.3550302 7 1 8.3550302 1 10 L 1 19 C 1 20.64497 2.3550302 22 4 22 L 24 22 C 25.64497 22 27 20.64497 27 19 L 27 10 C 27 8.3550302 25.64497 7 24 7 L 4 7 z M 4 9 L 24 9 C 24.56503 9 25 9.4349698 25 10 L 25 19 C 25 19.56503 24.56503 20 24 20 L 4 20 C 3.4349698 20 3 19.56503 3 19 L 3 10 C 3 9.4349698 3.4349698 9 4 9 z M 5 11 L 5 18 L ${18 * battery.level + 5} 18 L ${18 * battery.level + 5} 11 L 5 11 z M 28 12 L 28 17 L 29 17 C 29.552 17 30 16.552 30 16 L 30 13 C 30 12.448 29.552 12 29 12 L 28 12 z"
            id="path2" fill="#000000"
        />`;

        battery.addEventListener('levelchange', () => {
            $('.a.dock.control>svg>path')[0].outerHTML = `<path
                d="M 4 7 C 2.3550302 7 1 8.3550302 1 10 L 1 19 C 1 20.64497 2.3550302 22 4 22 L 24 22 C 25.64497 22 27 20.64497 27 19 L 27 10 C 27 8.3550302 25.64497 7 24 7 L 4 7 z M 4 9 L 24 9 C 24.56503 9 25 9.4349698 25 10 L 25 19 C 25 19.56503 24.56503 20 24 20 L 4 20 C 3.4349698 20 3 19.56503 3 19 L 3 10 C 3 9.4349698 3.4349698 9 4 9 z M 5 11 L 5 18 L ${18 * battery.level + 5} 18 L ${18 * battery.level + 5} 11 L 5 11 z M 28 12 L 28 17 L 29 17 C 29.552 17 30 16.552 30 16 L 30 13 C 30 12.448 29.552 12 29 12 L 28 12 z"
                id="path2" fill="#000000"
            />`;
        });
    });
} catch (TypeError) {
    console.log('Internal error: Unable to get battery');
}

// 任务管理器 记录硬件运行时间
if (localStorage.getItem('cpuRunningTime')) {
    apps.taskmgr.cpuRunningTime = localStorage.getItem('cpuRunningTime');
}
window.setInterval(() => {
    apps.taskmgr.cpuRunningTime++;
    localStorage.setItem('cpuRunningTime', apps.taskmgr.cpuRunningTime);
}, 1000);

var wifiStatus = true;

// 选择框
let chstX, chstY;
function ch(e) {
    $('#desktop>.choose').css('left', Math.min(chstX, e.clientX));
    $('#desktop>.choose').css('width', Math.abs(e.clientX - chstX));
    $('#desktop>.choose').css('display', 'block');
    $('#desktop>.choose').css('top', Math.min(chstY, e.clientY));
    $('#desktop>.choose').css('height', Math.abs(e.clientY - chstY));
}
$('#desktop')[0].addEventListener('mousedown', e => {
    chstX = e.clientX;
    chstY = e.clientY;
    this.onmousemove = ch;
})
window.addEventListener('mouseup', e => {
    this.onmousemove = null;
    $('#desktop>.choose').css('left', 0);
    $('#desktop>.choose').css('top', 0);
    $('#desktop>.choose').css('display', 'none');
    $('#desktop>.choose').css('width', 0);
    $('#desktop>.choose').css('height', 0);
})
let isDrak = false;

// 主题
function toggletheme() {
    $('.dock.theme').toggleClass('dk');
    $(':root').toggleClass('dark');
    if ($(':root').hasClass('dark')) {
        $('.window.whiteboard>.titbar>p').text('Blackboard');
        setData('theme', 'dark');
        isDrak = true;
    } else {
        $('.window.whiteboard>.titbar>p').text('Whiteboard');
        setData('theme', 'light');
        isDrak = false;
    }
}

const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
if (isDarkTheme.matches) { //是深色
    $('.dock.theme').toggleClass('dk');
    $(':root').toggleClass('dark');
    $('.window.whiteboard>.titbar>p').text('Blackboard');
    localStorage.setItem('theme', 'dark');
    isDrak = true;
} else { // 不是深色
    $('.window.whiteboard>.titbar>p').text('Whiteboard');
    localStorage.setItem('theme', 'light');
}
let desktopItem = [];
function saveDesktop() {
    localStorage.setItem('desktop', /*$('#desktop')[0].innerHTML*/JSON.stringify(desktopItem));
    localStorage.setItem('topmost', JSON.stringify(topmost));
    localStorage.setItem('sys_setting', JSON.stringify(sys_setting));
    localStorage.setItem('root_class', $(':root').attr('class'));
}

// 拖拽窗口
const page = document.getElementsByTagName('html')[0];
const titbars = document.querySelectorAll('.window>.titbar');
const wins = document.querySelectorAll('.window');
let deltaLeft = 0, deltaTop = 0, fil = false, filty = 'none', bfLeft = 0, bfTop = 0;
function win_move(e) {
    let cx, cy;
    if (e.type == 'touchmove') {
        cx = e.targetTouches[0].clientX, cy = e.targetTouches[0].clientY;
    }
    else {
        cx = e.clientX, cy = e.clientY;
    }
    // $(this).css('cssText', `left:${cx - deltaLeft}px;top:${cy - deltaTop}px;`);
    $(this).css('left', `${cx - deltaLeft}px`);
    $(this).css('top', `${cy - deltaTop}px`);
    if (cy <= 0) {
        // $(this).css('cssText', `left:${cx - deltaLeft}px;top:${-deltaTop}px`);
        $(this).css('left', `${cx - deltaLeft}px`);
        $(this).css('top', `${-deltaTop}px`);
        if (!(this.classList[1] in nomax)) {
            $('#window-fill').addClass('top');
            setTimeout(() => {
                $('#window-fill').addClass('fill');
            }, 0);
            fil = this;
            filty = 'top';
        }
        // console.log(this.classList[1], nomax,this.classList[1] in nomax,not this.classList[1] in nomax);
    }
    else if (cx <= 0) {
        // $(this).css('cssText', `left:${-deltaLeft}px;top:${cy - deltaTop}px`);
        $(this).css('left', `${-deltaLeft}px`);
        $(this).css('top', `${cy - deltaTop}px`);
        if (!(this.classList[1] in nomax)) {
            $('#window-fill').addClass('left');
            setTimeout(() => {
                $('#window-fill').addClass('fill');
            }, 0);
            fil = this;
            filty = 'left';
        }
    }
    else if (cx >= document.body.offsetWidth - 2) {
        // $(this).css('cssText', `left:calc(100% - ${deltaLeft}px);top:${cy - deltaTop}px`);
        $(this).css('left', `calc(100% - ${deltaLeft}px)`);
        $(this).css('top', `${cy - deltaTop}px`);
        if (!(this.classList[1] in nomax)) {
            $('#window-fill').addClass('right');
            setTimeout(() => {
                $('#window-fill').addClass('fill');
            }, 0);
            fil = this;
            filty = 'right';
        }
    }
    else if (fil) {
        $('#window-fill').removeClass('fill');
        setTimeout(() => {
            $('#window-fill').removeClass('top');
            $('#window-fill').removeClass('left');
            $('#window-fill').removeClass('right');
        }, 200);
        fil = false;
        filty = 'none';
    }
    else if ($(this).hasClass('max')) {
        deltaLeft = deltaLeft / (this.offsetWidth - (45 * 3)) * ((0.7 * document.body.offsetWidth) - (45 * 3));
        maxwin(this.classList[1], false);
        // 窗口控制按钮宽 45px
        // $(this).css('cssText', `left:${cx - deltaLeft}px;top:${cy - deltaTop}px;`);
        $(this).css('left', `${cx - deltaLeft}px`);
        $(this).css('top', `${cy - deltaTop}px`);
        $('.window.' + this.classList[1] + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');

        $(this).addClass('notrans');
    }
}
for (let i = 0; i < wins.length; i++) {
    const win = wins[i];
    const titbar = titbars[i];
    titbar.addEventListener('mousedown', (e) => {
        if ($('.taskmgr>.titbar>div>input').is(':focus')) {
            return
        }
        let x = window.getComputedStyle(win, null).getPropertyValue('left').split("px")[0];
        let y = window.getComputedStyle(win, null).getPropertyValue('top').split("px")[0];
        if (y != 0) {
            bfLeft = x;
            bfTop = y;
        }
        deltaLeft = e.clientX - x;
        deltaTop = e.clientY - y;
        page.onmousemove = win_move.bind(win);
    })
    titbar.addEventListener('touchstart', (e) => {
        let x = window.getComputedStyle(win, null).getPropertyValue('left').split("px")[0];
        let y = window.getComputedStyle(win, null).getPropertyValue('top').split("px")[0];
        if (y != 0) {
            bfLeft = x;
            bfTop = y;
        }
        deltaLeft = e.targetTouches[0].clientX - x;
        deltaTop = e.targetTouches[0].clientY - y;
        page.ontouchmove = win_move.bind(win);
    })
}
page.addEventListener('mouseup', () => {
    page.onmousemove = null;
    if (fil) {
        if (filty == 'top') {
            maxwin(fil.classList[1], false);
        }
        else if (filty == 'left') {
            $(fil).addClass('left');
            maxwin(fil.classList[1], false);
        }
        else if (filty == 'right') {
            $(fil).addClass('right');
            maxwin(fil.classList[1], false);
        }
        setTimeout(() => {
            $('#window-fill').removeClass('fill');
            $('#window-fill').removeClass('top');
            $('#window-fill').removeClass('left');
            $('#window-fill').removeClass('right');
        }, 200);
        $('.window.' + fil.classList[1]).attr('data-pos-x', `${bfLeft}px`);
        $('.window.' + fil.classList[1]).attr('data-pos-y', `${bfTop}px`);
        fil = false;
    }
});
page.addEventListener('touchend', () => {
    page.ontouchmove = null;
    if (fil) {
        if (filty == 'top')
            maxwin(fil.classList[1], false);
        else if (filty == 'left') {
            maxwin(fil.classList[1], false);
            $(fil).addClass('left');
        } else if (filty == 'right') {
            maxwin(fil.classList[1], false);
            $(fil).addClass('right');
        }
        setTimeout(() => {
            $('#window-fill').removeClass('fill');
            $('#window-fill').removeClass('top');
            $('#window-fill').removeClass('left');
            $('#window-fill').removeClass('right');
        }, 200);
        setTimeout(() => {
            $('.window.' + fil.classList[1]).attr('data-pos-x', `${bfLeft}px`);
            $('.window.' + fil.classList[1]).attr('data-pos-y', `${bfTop}px`);
        }, 200);
        fil.setAttribute('style', `left:${bfLeft}px;top:${bfTop}px`);
        fil = false;
    }
});
page.addEventListener('mousemove', (e) => {
    if (e.clientY >= window.innerHeight - 60) {
        $('#dock-box').removeClass('hide');
    }
    else {
        if (!$('#start-menu.show')[0] && !$('#search-win.show')[0] && !$('#widgets.show')[0] && !$('#control.show')[0] && !$('#datebox.show')[0]) {
            if ($('.window.max:not(.left):not(.right)')[0]) {
                $('#dock-box').addClass('hide');
            }
            else {
                $('#dock-box').removeClass('hide');
            }
        }
        else {
            $('#dock-box').removeClass('hide');
        }
    }
})

function setIcon() {
    if (Array.isArray(JSON.parse(localStorage.getItem('desktop')))) {
        $('#desktop')[0].innerHTML = `<div ondblclick="openapp('explorer');" ontouchstart="openapp('explorer');" oncontextmenu="return showcm(event,'desktop.icon',['explorer',-1]);" appname="explorer">
        <img src="apps/icons/explorer/thispc.svg">
        <p>This PC</p>
    </div>
    <div class="b" ondblclick="openapp('setting');" ontouchstart="openapp('setting');" oncontextmenu="return showcm(event,'desktop.icon',['setting',-1]);" appname="setting">
        <img src="icon/setting.svg">
        <p>Setting</p>
    </div>
    <div class="b" ondblclick="openapp('about');" ontouchstart="openapp('about');" oncontextmenu="return showcm(event,'desktop.icon',['about',-1]);" appname="about">
        <img src="icon/about.svg">
        <p>About Win12 Web version</p>
    </div>
    <div class="b" ondblclick="openapp('edge');" ontouchstart="openapp('edge');" oncontextmenu="return showcm(event,'desktop.icon',['edge',-1]);" appname="edge">
        <img src="icon/edge.svg">
        <p>Microsoft Edge</p>
    </div>
    <div class="b" ondblclick="shownotice('feedback');" ontouchstart="shownotice('feedback');;">
        <img src="icon/feedback.svg">
        <p>Feedback Center</p>
    </div>
    <span class="choose">
    </span>
    <p style="background-color: rgba(11,45,14,0);z-index:1;position: absolute;top:0px;left:0px;height:100%;width:100%" oncontextmenu="return showcm(event,'desktop');"></p>`;
        desktopItem = JSON.parse(localStorage.getItem('desktop'));
        desktopItem.forEach((item) => {
            $('#desktop')[0].innerHTML += item;
        })
        addMenu();
    }
    if (Array.isArray(JSON.parse(localStorage.getItem('topmost')))) {
        topmost = JSON.parse(localStorage.getItem('topmost'));
        if (topmost.includes('taskmgr')) {
            document.getElementById('tsk-setting-topmost').checked = true;
        }
    }
    if (Array.isArray(JSON.parse(localStorage.getItem('sys_setting')))) {
        var sys_setting_back = JSON.parse(localStorage.getItem('sys_setting'));
        if (/^(1|0)+$/.test(sys_setting_back.join(''))/* 只含有0和1 */) {
            sys_setting = sys_setting_back;
            for (var i = 0; i < sys_setting.length; i++) {
                document.getElementById('sys_setting_' + (i + 1)).setAttribute("class", 'a checkbox' + (sys_setting[i] ? ' checked' : '')); //设置class属性
                if (i == 5) {
                    use_music = sys_setting[i] ? true : false;
                }
            }
        }
    }
    if (localStorage.getItem('root_class')) {
        $(':root')[0].className = localStorage.getItem('root_class');
    }
}

// 启动
document.getElementsByTagName('body')[0].onload = function nupd() {
    setTimeout(() => {
        $('#loadback').addClass('hide');
    }, 500);
    setTimeout(() => {
        $('#loadback').css('display', 'none');
    }, 1000);
    apps.webapps.init();
    //getdata
    if (localStorage.getItem('theme') == 'dark') $(':root').addClass('dark');
    if (localStorage.getItem('color1')) {
        $(':root').css('--theme-1', localStorage.getItem('color1'));
        $(':root').css('--theme-2', localStorage.getItem('color2'));
    }
    setIcon();//加载桌面图标

    // 所以这个东西为啥要在开机的时候加载？
    // 不应该在python.init里面吗？
    //     (async function () {
    //         apps.python.pyodide = await loadPyodide();
    //         apps.python.pyodide.runPython(`
    // import sys
    // import io
    // `);
    //     })();
    // apps.pythonEditor.load();
    // apps.notepadFonts.load();
    // apps.whiteboard.load();
    document.querySelectorAll('.window').forEach(w => {
        let qw = $(w), wc = w.classList[1];
        // window: onmousedown="focwin('explorer')" ontouchstart="focwin('explorer')"
        qw.attr('onmousedown', `focwin('${wc}')`);
        qw.attr('ontouchstart', `focwin('${wc}')`);
        // titbar: oncontextmenu="return showcm(event,'titbar','edge')" ondblclick="maxwin('edge')"
        qw = $(`.window.${wc}>.titbar`);
        qw.attr('oncontextmenu', `return showcm(event,'titbar','${wc}')`);
        if (!(wc in nomax)) {
            qw.attr('ondblclick', `maxwin('${wc}')`);
        }
        // icon: onclick="return showcm(event,'titbar','explorer')"
        qw = $(`.window.${wc}>.titbar>.icon`);
        qw.attr('onclick', `let os=$(this).offset();stop(event);return showcm({clientX:os.left-5,clientY:os.top+this.offsetHeight+3},'titbar','${wc}')`);
        qw.mousedown(stop);
        $(`.window.${wc}>.titbar>div>.wbtg`).mousedown(stop);
    });
    document.querySelectorAll('.window>div.resize-bar').forEach(w => {
        for (const n of ['top', 'bottom', 'left', 'right', 'top-right', 'top-left', 'bottom-right', 'bottom-left']) {
            w.insertAdjacentHTML('afterbegin', `<div class="resize-knob ${n}" onmousedown="resizewin(this.parentElement.parentElement, '${n}', this)"></div>`);
        }
    });
    // loadlang();
};

let autoUpdate = true;
function checkUpdate() {
    const sha = localStorage.getItem('sha');
    fetch('https://api.github.com/repos/tjy-gitnub/win12/commits').then(res => {
        res.json().then(json => {
            if (sha != json[0].sha && sha) {
                localStorage.setItem('update', true);
                sendToSw({
                    head: 'update'
                });
            }
            localStorage.setItem('sha', json[0].sha);
        });
    });
}

if (localStorage.getItem('autoUpdate') == undefined) {
    localStorage.setItem('autoUpdate', true);
}
else {
    autoUpdate = (autoUpdate == 'true');
}

// PWA 应用
if (!location.href.match(/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))/) && !(new URL(location.href)).searchParams.get('develop')) {
    $('#loginback').css('opacity', '1');
    $('#loginback').css('display', 'flex');
    shownotice('about');
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none', scope: './' }).then(reg => {

        reg.update();

        reg.addEventListener('updatefound', () => {
            // 正在安装的新的 SW
            const newWorker = reg.installing;
            console.log('dsk-发现更新');
            // newWorker.state;
            // // "installing" - 安装事件被触发，但还没完成
            // // "installed"  - 安装完成
            // // "activating" - 激活事件被触发，但还没完成
            // // "activated"  - 激活成功
            // // "redundant"  - 废弃，可能是因为安装失败，或者是被一个新版本覆盖
        });
    });
    // navigator.serviceWorker.controller.postMessage({
    //     head: 'is_update'
    // });
    // navigator.serviceWorker.addEventListener('message', function (e) {
    // checkUpdate();

    if (localStorage.getItem('autoUpdate') == 'true') {
        checkUpdate();
    }
    if (localStorage.getItem('update') == 'true') {
        $('.msg.update>.main>.tit').html('<i class="bi bi-stars" style="background-image: linear-gradient(100deg, var(--theme-1), var(--theme-2));-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:3px 3px 5px var(--sd);filter:saturate(200%) brightness(0.9);"></i> ' + $('#win-about>.cnt.update>div>details:first-child>summary').text());
        $('.msg.update>.main>.cont').html($('#win-about>.cnt.update>div>details:first-child>p').html());
        $('#loadbackupdate').css('display', 'block');
        localStorage.setItem('update', false);
        $('.msg.update').addClass('show');
    }
    // });
    function setData(k, v) {
        localStorage.setItem(k, v);
    }

} else {
    function setData(k, v) {
        console.log('setData 被禁用');
    }
}
function sendToSw(msg) {
    navigator.serviceWorker.controller.postMessage(msg);
}

/**
 * 将秒数换算为可读的时间格式
 * @param {number} second 秒数
 * @returns 将秒数格式化为  1 天 8 小时 43 分钟 26 秒类似的格式
 */
function calcTimeString(second) {
    let timeStr = '';
    const days = Math.floor(second / (24 * 60 * 60));
    const hours = Math.floor(second % (24 * 60 * 60) / 3600);
    const minutes = Math.floor(second % 3600 / 60);
    const seconds = second % 60;
    if (days > 0) {
        timeStr += " " + days + " 天";
    }
    if (hours > 0) {
        timeStr += " " + hours + " 小时";
    }
    if (minutes > 0) {
        timeStr += " " + minutes + " 分钟";
    }
    if (seconds > 0) {
        timeStr += " " + seconds + " 秒";
    }
    return timeStr === "" ? " 0 秒" : timeStr;
}
