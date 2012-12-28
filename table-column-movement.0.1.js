/**
 * @author: meeyond
 * @date: 12-12-27 @time: 下午2:30
 *
 * 用法
 * 1: new一个TalbeColumn对象
 *         tableColumn = new TableColumn(".move","moveable");
 *         or
 *         tableColumn = new TableColumn(".move");
 * 2：调用初始化方法
 *         tableColumn.init(); 需要第二个参数  选择表可以移动的列
 *         tableColumn.initAll();不需要第二个参数 表的所有列都可以移动
 * 3：移动回调方法(可选)
 *         tableColumn.onmove(function () {
 *             alert("onmove");
 *         });
 * 4:可以这样写：tableColumn.init().onmove(function(){
 *      alert(""onmove);
 *  });
 *
 *  @param selecter 参数为表格选择器
 *  @param moveableClass 可以移动的列的class
 *
 * @type {TableColumn}
 */

function TableColumn(selecter, moveableClass) {
    if (selecter == undefined) {
        throw "The selecter of table is not undefined!";
    }
    var _table = $(selecter);
    var _moveTdClass = moveableClass;
    var _theadColumn;
    var _allTheadColumn = $(selecter).find("thead").children("tr").children();
    var _thisColumn;
    var _x = 0;
    var _all = false;
    var _onmoveRun = false;
    var $moveFlag;
    var _onmove = function () {
    };
    var theadMouseDown = function (e) {
        var $this = $(this);
        _thisColumn = $this;
        _x = e.pageX - ($this.offset().left - 1);
        $this.attr("moveable", "1");
        setSelectedColumnStyle($this, e);
    };
    var theadMouseMove = function (e) {
        if (_thisColumn) {
            var $this = _thisColumn;
            if ($this.attr("moveable") == "1") {
                moving($this, e);
            }
        }
    };
    var theadMouseUp = function () {
        _theadColumn.attr("moveable", "0");
        $moveFlag.hide();
        if (_onmoveRun) {
            _onmove();
        }
        _onmoveRun = false;
    };
    this.onmove = function (onmove) {
        _onmove = onmove;
    };
    var moving = function ($this, e) {
        var thisIndex = _theadColumn.index($this);
        var left = e.pageX - 2;
        if (left > _table.offset().left && left < _table.offset().left + _table.width()) {
            $moveFlag.css("left", left);
            _theadColumn.each(function (index, headTr) {
                var r = $(headTr).offset().left + $(headTr).width();
                var l = $(headTr).offset().left;
                var changeIndex = _theadColumn.index($(headTr));
                if (left > l && left < r && index != thisIndex) {
                    var tbodyTr = _theadColumn.parent().parent().siblings("tbody").children("tr");
                    changeColumn($this, $(headTr), tbodyTr, thisIndex, changeIndex);
                    _thisColumn.attr("moveable", "0");
                    _thisColumn = $(headTr);
                    _thisColumn.attr("moveable", "1");
                    _onmoveRun = true;
                }
            });
        }
    };
    var changeColumn = function (thisCol, changeCol, tbodyTr, thisIndex, changeIndex) {
        changHtml(thisCol, changeCol);
        if (_all) {
            tbodyTr.each(function (index, tr) {
                var param1 = $(tr).children().eq(thisIndex);
                var param2 = $(tr).children().eq(changeIndex);
                changHtml(param1, param2);
            });
        } else {
            tbodyTr.each(function (index, tr) {
                var param1 = $(tr).children("." + _moveTdClass).eq(thisIndex);
                var param2 = $(tr).children("." + _moveTdClass).eq(changeIndex);
                changHtml(param1, param2);
            });
        }
    };
    var changHtml = function (param1, param2) {
        var tempHtml = param1.html();
        param1.html(param2.html());
        param2.html(tempHtml);
    };
    var setSelectedColumnStyle = function ($this, e) {
        if ($this.attr("moveable")) {
            var offsetTop = $this.offset().top - 1;
            var tbodyTr = _theadColumn.parent().parent().siblings("tbody").children("tr");
            var row = tbodyTr.length;
            var thisHeight = $this[0].offsetHeight;
            tbodyTr.each(function (index, tr) {
                thisHeight += $(tr)[0].offsetHeight;
            });
            $moveFlag.css("left", e.pageX - 2).css("top", offsetTop).css("height", thisHeight).show();
        }
    };
    var i = function () {
        $(document).bind("selectstart", function () {
            return false;
        });
        $("body").append("<div id='move_flag-what-the-fuck' style='position: absolute;z-index: 100;display: none;border: 2px solid #444;'></div>");
        $moveFlag = $("#move_flag-what-the-fuck");
        _theadColumn.live("mousedown", theadMouseDown);
        _table.bind("mousemove", theadMouseMove);
        $(document).bind("mouseup", theadMouseUp);
        return this;
    };
    this.init = function () {
        if (_moveTdClass == undefined) {
            throw "The 2nd param is not undefined!";
        }
        var tbodyTr = _allTheadColumn.parent().parent().siblings("tbody").children("tr");
        _allTheadColumn.each(function (index, td) {
            if ($(td).hasClass(_moveTdClass)) {
                tbodyTr.each(function (i, tr) {
                    $(tr).children().eq(index).addClass(_moveTdClass);
                });
            }
        });
        _theadColumn = _table.find("thead").find("." + _moveTdClass);
        return i.apply(this);
    };
    this.initAll = function () {
        _all = true;
        _theadColumn = _table.find("thead").children("tr").children();
        return i.apply(this);
    };
}
