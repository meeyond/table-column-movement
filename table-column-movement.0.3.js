/**
 * User: wang
 * Date: 12-12-27
 * Time: 下午2:30
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
    //表格
    var _table = $(selecter);
    //可移动列标记 class
    var _moveTdClass = moveableClass;
    //可移动列对象
    var _theadColumn;
    //所有列
    var _allTheadColumn = $(selecter).find("thead").children("tr").children();
    //当前列
    var _thisColumn;
    //
    var _x = 0;
    //是否全部列可移动
    var _all = false;
    //是否执行回调
    var _onmoveRun = false;
    //移动标记对象
    var $moveFlag;
    //回调
    var _currentColomnEles = new Array();
    var _onmove = function () {
    };
    /**
     * 鼠标事件 mousedown
     */
    var theadMouseDown = function (e) {
        var $this = $(this);
        _thisColumn = $this;
        _x = e.pageX - ($this.offset().left - 1);
        $this.attr("moveable", "1");
        setSelectedColumnStyle($this, e);
    };
    /**
     * 鼠标事件 mousemove
     */
    var theadMouseMove = function (e) {
        if (_thisColumn) {
            var $this = _thisColumn;
            if ($this.attr("moveable") == "1") {
                moving($this, e);
            }
        }
    };
    /**
     * 鼠标事件 mouseup
     */
    var theadMouseUp = function () {
        _theadColumn.attr("moveable", "0");
        $moveFlag.hide();
        if (_onmoveRun) {
            _onmove();
        }
        _onmoveRun = false;
        for (var i = 0; i < _currentColomnEles.length; i++) {
            _currentColomnEles[i].attr("style", "");
        }
    };
    /**
     * 拖动当前列响应
     * @param $this
     * @param e
     */
    var moving = function ($this, e) {
        var thisIndex = _theadColumn.index($this);
        //-2是因为移动标记样式需要
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
                    //重置列
                    reset_theadColumn();
                    _onmoveRun = true;
                }
            });
        }
    };
    /**
     * 交换表格相邻两列位置
     * @param thisCol 当前列
     * @param changeCol 目标列
     * @param tbodyTr 表格内容行jquery对象
     * @param thisIndex 当前dom index
     * @param changeIndex 交换dom index
     */
    var changeColumn = function (thisCol, changeCol, tbodyTr, thisIndex, changeIndex) {
        changeHtml(thisCol, changeCol, thisIndex, changeIndex);
        if (_all) {
            tbodyTr.each(function (index, tr) {
                var param1 = $(tr).children().eq(thisIndex);
                var param2 = $(tr).children().eq(changeIndex);
                changeHtml(param1, param2, thisIndex, changeIndex);
            });
        } else {
            tbodyTr.each(function (index, tr) {
                var param1 = $(tr).children("." + _moveTdClass).eq(thisIndex);
                var param2 = $(tr).children("." + _moveTdClass).eq(changeIndex);
                changeHtml(param1, param2, thisIndex, changeIndex);
            });
        }
    };
    /**
     * 重新定义_threadColumn
     */
    var reset_theadColumn = function () {
        if (_all) {
            _theadColumn = _table.find("thead").children("tr").children();
        } else {
            _theadColumn = _table.find("thead").find("." + _moveTdClass);
        }
    };
    /**
     * 交换相邻两个表格元素对象的位置
     * @param param1
     * @param param2
     * @param thisIndex  当前dom index
     * @param changeIndex  交换dom index
     */
    var changeHtml = function (param1, param2, thisIndex, changeIndex) {
        if (thisIndex < changeIndex) {
            //从左往右移
            param2.after(param1);
        } else {
            //从右往左移
            param2.before(param1);
        }
    };
    /**
     * 设置移动标记
     * @param $this
     * @param e
     */
    var setSelectedColumnStyle = function ($this, e) {
        if ($this.attr("moveable")) {
            var topStyle = "border-left:2px solid #777;border-right:2px solid #777;border-top:2px solid #777";
            var style = "border-left:2px solid #777;border-right:2px solid #777;";
            var bottomStyle = "border-left:2px solid #777;border-right:2px solid #777;border-bottom:2px solid #777";
            var offsetTop = $this.offset().top - 1;
            var thisColumnIndex = _theadColumn.index($this);
            var tbodyTr = _theadColumn.parent().parent().siblings("tbody").children("tr");
            var thisHeight = $this[0].offsetHeight;
            var rowCount = tbodyTr.length;
            $this.attr("style", topStyle);
            _currentColomnEles[_currentColomnEles.length] = $this;
            tbodyTr.each(function (index, tr) {
                var thisColumnEle;
                if (_all) {
                    thisColumnEle = $(tr).children().eq(thisColumnIndex);
                } else {
                    thisColumnEle = $(tr).children("." + _moveTdClass).eq(thisColumnIndex);
                }
                thisHeight += $(tr)[0].offsetHeight;
                if (index + 1 == rowCount) {
                    thisColumnEle.attr("style", bottomStyle);
                } else {
                    thisColumnEle.attr("style", style);
                }
                _currentColomnEles[_currentColomnEles.length] = thisColumnEle;
            });
            $moveFlag.css("left", e.pageX - 2).css("top", offsetTop).css("height", thisHeight).show();
        }
    };
    /**
     * 初始化
     * @return {*}
     */
    var publicInit = function () {
        $(document).bind("selectstart", function () {
            return false;
        });
        $("body").append("<div id='move_flag-what-the-fuck' style='position: absolute;z-index: 100;display: none;border: 2px solid #444;'></div>");
        $("head").append("<style type='text/css'>.moving_ele{border-left:2px solid #777;border-right:2px solid #777};.moving-b-t{border-top:2px solid #777};.moving-b-b{border-bottom: 2px solid #777;}</style>");
        $moveFlag = $("#move_flag-what-the-fuck");
        _theadColumn.live("mousedown", theadMouseDown);
        _table.bind("mousemove", theadMouseMove);
        $(document).bind("mouseup", theadMouseUp);
        return this;
    };

    /**
     * 初始化方法
     * 对外接口
     * 指定需要移动列
     * @return {publicInit}
     */
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
        return publicInit.apply(this);
    };
    /**
     * 初始化方法
     * 对外接口
     * 全部表格列都可移动
     * @return {publicInit}
     */
    this.initAll = function () {
        _all = true;
        _theadColumn = _table.find("thead").children("tr").children();
        return publicInit.apply(this);
    };
    /**
     * 移动之后回调
     * @param onmove
     */
    this.onmove = function (onmove) {
        _onmove = onmove;
    };
}
