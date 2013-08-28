//TODO 添加事件响应机制
(function($){
    /**
     * 日期选择组件
     * <br />全局访问请使用 JC.Calendar 或 Calendar
     * <br />DOM 加载完毕后
     * , Calendar会自动初始化页面所有日历组件, input[type=text][datatype=date]标签
     * <br />Ajax 加载内容后, 如果有日历组件需求的话, 需要手动使用Calendar.init( _selector )
     * <br />_selector 可以是 新加载的容器, 也可以是新加载的所有input
     * <p><b>require</b>: <a href='window.jQuery.html'>jQuery</a>
     * <br /><b>require</b>: <a href='.window.html#method_cloneDate'>window.cloneDate</a>
     * <br /><b>require</b>: <a href='.window.html#method_parseISODate'>window.parseISODate</a>
     * <br /><b>require</b>: <a href='.window.html#method_formatISODate'>window.formatISODate</a>
     * <br /><b>require</b>: <a href='.window.html#method_maxDayOfMonth'>window.maxDayOfMonth</a>
     * <br /><b>require</b>: <a href='.window.html#method_isSameDay'>window.isSameDay</a>
     * <br /><b>require</b>: <a href='.window.html#method_isSameMonth'>window.isSameMonth</a>
     * </p>
     * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
     * | <a href='http://jc.openjavascript.org/docs_api/classes/JC.Calendar.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Calendar/_demo/' target='_blank'>demo link</a></p>
     * <h2> 可用的html attribute, (input|button):(datatype|multidate)=(date|week|month|season) </h2> 
     * <dl>
     *      <dt>datatype</dt>
     *      <dd>
     *          声明日历控件的类型:
     *          <p><b>date:</b> 日期日历</p>
     *          <p><b>week:</b> 周日历</p>
     *          <p><b>month:</b> 月日历</p>
     *          <p><b>season:</b> 级日历</p>
     *      </dd>
     *
     *      <dt>multidate</dt>
     *      <dd>
     *          与 datatype 一样, 这个是扩展属性, 避免表单验证带来的逻辑冲突
     *      </dd>
     *
     *      <dt>calendarshow</dt>
     *      <dd>显示日历时的回调</dd>
     *
     *      <dt>calendarhide</dt>
     *      <dd>隐藏日历时的回调</dd>
     *
     *      <dt>calendarlayoutchange</dt>
     *      <dd>用户点击日历控件操作按钮后, 外观产生变化时触发的回调</dd>
     *
     *      <dt>calendarupdate</dt>
     *      <dd>赋值后触发的回调, params: _CalendarType, _startDate, _endDate</dd>
     *
     *      <dt>calendarclear</dt>
     *      <dd>清空日期触发的回调</dd>
     *
     *      <dt>minvalue</dt>
     *      <dd>日期的最小时间, YYYY-MM-DD</dd>
     *
     *      <dt>maxvalue</dt>
     *      <dd>日期的最大时间, YYYY-MM-DD</dd>
     *
     *      <dt>currentcanselect</dt>
     *      <dd>当前日期是否能选择, bool, default=true</dd>
     *
     *      <dt>multiselect (目前只对月份日历有效)</dt>
     *      <dd>是否为多选日历, bool, default=false</dd>
     *
     *      <dt>calendarupdatemultiselect</dt>
     *      <dd>多选日历赋值后触发的回调, params: _CalendarType, _dateArray( [ {start, end}, ... ] )</dd>
     * </dl>
     * @namespace JC
     * @class Calendar
     * @static
     * @version dev 0.2, 过程式转单例模式
     * @version dev 0.1, 2013-06-04
     * @author  qiushaowei   <suches@btbtd.org> | 75 team
     */
    window.Calendar = JC.Calendar = Calendar;
    function Calendar( _selector ){
        if( Calendar.getInstance( _selector ) ) return Calendar.getInstance( _selector );
        Calendar.getInstance( _selector, this );

        var _type = Calendar.type( _selector );

        JC.log( 'Calendar init:', _type, new Date().getTime() );

        switch( _type ){
            case 'week': 
                {
                    this._model = new Calendar.WeekModel( _selector );
                    this._view = new Calendar.WeekView( this._model );
                    break;
                }
            case 'month': 
                {
                    this._model = new Calendar.MonthModel( _selector );
                    this._view = new Calendar.MonthView( this._model );
                    break;
                }
            case 'season': 
                {
                    this._model = new Calendar.SeasonModel( _selector );
                    this._view = new Calendar.SeasonView( this._model );
                    break;
                }
            default:
                {
                    this._model = new Calendar.Model( _selector );
                    this._view = new Calendar.View( this._model );
                    break;
                }
        }

        this._init();
    }
    
    Calendar.prototype = {
        _init:
            function(){
                var _p = this;

                $( [ _p._view, _p._model ] ).on('BindEvent', function( _evt, _evtName, _cb ){
                    _p.on( _evtName, _cb );
                });

                $([ _p._view, _p._model ] ).on('TriggerEvent', function( _evt, _evtName ){
                    var _data = sliceArgs( arguments ); _data.shift(); _data.shift();
                    _p.trigger( _evtName, _data );
                });

                _p._model.init();
                _p._view.init();

                return _p;
            }    
        /**
         * 显示 Calendar
         * @method  show
         * @return  CalendarInstance
         */
        , show: 
            function(){ 
                Calendar.hide(); 
                Calendar.lastIpt = this._model.selector();
                this._view.show(); 

                Calendar.layoutInitedCallback && Calendar.layoutInitedCallback( $('body > div.UXCCalendar:visible'), _selector );
                Calendar._triggerShow();

                return this; 
            }
        /**
         * 隐藏 Calendar
         * @method  hide
         * @return  CalendarInstance
         */
        , hide: function(){ this._view.hide(); return this; }
        /**
         * 获取 显示 Calendar 的触发源选择器, 比如 a 标签
         * @method  selector
         * @return  selector
         */ 
        , selector: function(){ return this._model.selector(); }
        /**
         * 获取 Calendar 外观的 选择器
         * @method  layout
         * @return  selector
         */
        , layout: function(){ return this._model.layout(); }
        /**
         * 使用 jquery on 绑定事件
         * @method  {string}    on
         * @param   {string}    _evtName
         * @param   {function}  _cb
         * @return  CalendarInstance
         */
        , on: function( _evtName, _cb ){ $(this).on(_evtName, _cb ); return this;}
        /**
         * 使用 jquery trigger 绑定事件
         * @method  {string}    trigger
         * @param   {string}    _evtName
         * @return  CalendarInstance
         */
        , trigger: function( _evtName, _data ){ $(this).trigger( _evtName, _data ); return this;}
    }
    /**
     * 获取或设置 Calendar 的实例
     * @method getInstance
     * @param   {selector}      _selector
     * @static
     * @return  {Calendar instance}
     */
    Calendar.getInstance =
        function( _selector, _setter ){
            if( typeof _selector == 'string' && !/</.test( _selector ) ) 
                    _selector = $(_selector);
            if( !(_selector && _selector.length ) || ( typeof _selector == 'string' ) ) return;
            var _type = Calendar.type( _selector ), _insName = 'CalendarIns_' + _type;
            typeof _setter != 'undefined' && _selector.data( _insName, _setter );

            return _selector.data( _insName );
        };
    Calendar.type =
        function( _selector ){
            _selector = $(_selector);
            var _r, _type = $.trim(_selector.attr('multidate') || '').toLowerCase() 
                || $.trim(_selector.attr('datatype') || '').toLowerCase();
            switch( _type ){
                case 'week': 
                case 'month': 
                case 'season': 
                    {
                        _r = _type;
                        break;
                    }
                default: _r = 'date'; break;
            }
            return _r;
        };

    /** 
     * 判断选择器是否为日历组件的对象
     * @method  isCalendar
     * @static
     * @param   {selector}  _selector
     * return   bool
     */
    Calendar.isCalendar = 
        function( _selector ){
            _selector = $(_selector);
            var _r = 0;

            if( _selector.length ){
                if( _selector.hasClass('UXCCalendar_btn') ) _r = 1;
                if( _selector.prop('nodeName') 
                        && _selector.attr('datatype')
                        && ( _selector.prop('nodeName').toLowerCase()=='input' || _selector.prop('nodeName').toLowerCase()=='button' )
                        && ( _selector.attr('datatype').toLowerCase()=='date' 
                                || _selector.attr('datatype').toLowerCase()=='week' 
                                || _selector.attr('datatype').toLowerCase()=='month' 
                                || _selector.attr('datatype').toLowerCase()=='season' 
                                || _selector.attr('datatype').toLowerCase()=='year' 
                            )) _r = 1;
                if( _selector.prop('nodeName') 
                        && _selector.attr('multidate')
                        && _selector.prop('nodeName').toLowerCase()=='input') _r = 1;
            }

            return _r;
        };
    /**
     * 请使用 isCalendar, 这个方法是为了向后兼容
     */
    Calendar.isCalendarElement = function( _selector ){ return Calendar.isCalendar( _selector ); };
    /**
     * 弹出日期选择框
     * @method pickDate
     * @static
     * @param   {selector}  _selector 需要显示日期选择框的input[text]   
     * @example
            <dl>
                <dd>
                    <input type="text" name="date6" class="manualPickDate" value="20110201" />
                    manual JC.Calendar.pickDate
                </dd>
                <dd>
                    <input type="text" name="date7" class="manualPickDate" />
                    manual JC.Calendar.pickDate
                </dd>
            </dl>
            <script>
                $(document).delegate('input.manualPickDate', 'focus', function($evt){
                JC.Calendar.pickDate( this );
                });
            </script>
     */
    Calendar.pickDate =  
        function( _selector ){ 
            _selector = $( _selector );
            if( !(_selector && _selector.length) ) return;
            var _ins = Calendar.getInstance( _selector );
            !_ins && ( _ins = new Calendar( _selector ) );
            _ins.show();
            return;
        }; 
    /**
     * 设置是否在 DOM 加载完毕后, 自动初始化所有日期控件
     * @property    autoInit
     * @default true
     * @type    {bool}
     * @static
            <script>JC.Calendar.autoInit = true;</script>
     */
    Calendar.autoInit =  true;

    /**
     * 设置默认显示的年份数, 该数为前后各多少年 默认为前后各10年
     * @property    defaultDateSpan
     * @type        {int}
     * @default     20
     * @static
            <script>JC.Calendar.defaultDateSpan = 20;</script>
     */
    Calendar.defaultDateSpan = 20;
    /**
     * 最后一个显示日历组件的文本框
     * @property  lastIpt
     * @type    selector
     * @static
     */
    Calendar.lastIpt = null;
    /**
     * 自定义日历组件模板
     * <p>默认模板为_logic.tpl</p>
     * <p>如果用户显示定义JC.Calendar.tpl的话, 将采用用户的模板</p>
     * @property    tpl
     * @type    {string}
     * @default empty
     * @static
     */
    Calendar.tpl = '';
    /** 
     * 判断日历源控件是否为多选模式
     * @method  isMultiSelect
     * @static
     * return   bool
     */
    Calendar.isMultiSelect =
        function(){
            var _r = false;
            Calendar.lastIpt && ( _r = parseBool( Calendar.lastIpt.attr('multiselect') ) );
            return _r;
        };
    /**
     * 初始化外观后的回调函数
     * @property layoutInitedCallback
     * @type    function
     * @static
     * @default null
     */
    Calendar.layoutInitedCallback = null;
    /**
     * 日历隐藏后的回调函数
     * @property layoutHideCallback
     * @type    function
     * @static
     * @default null
     */
    Calendar.layoutHideCallback = null;
    /**
     * DOM 点击的过滤函数
     * <br />默认 dom 点击时, 判断事件源不为 input[datatype=date|daterange] 会隐藏 Calendar
     * <br /> 通过该回调可自定义过滤, 返回 false 不执行隐藏操作
     * @property domClickFilter
     * @type    function
     * @static
     * @default null
     */
    Calendar.domClickFilter = null;
    /**
     * 隐藏日历组件
     * @method  hide
     * @static
     * @example
            <script>JC.Calendar.hide();</script>
     */
    Calendar.hide =
        function(){
            $('body > div.UXCCalendar').hide();
            Calendar.layoutHideCallback && Calendar.layoutHideCallback( Calendar.lastIpt );
            Calendar._triggerHide();
        };
    /**
     * 获取初始日期对象
     * @method  getDate
     * @static
     * @param   {selector}  _selector   显示日历组件的input
     * return   { date: date, minvalue: date|null, maxvalue: date|null, enddate: date|null }
     */
    Calendar.getDate =
        function( _selector ){
            var _r = { date: null, minvalue: null, maxvalue: null, enddate: null }, _tmp;

            if( _tmp = parseISODate( _selector.val() ) ) _r.date = _tmp;
            else{
                if( _selector.val() && (_tmp = _selector.val().replace( /[^\d]/g, '' ) ).length == 16 ){
                    _r.date = parseISODate( _tmp.slice( 0, 8 ) );
                    _r.enddate = parseISODate( _tmp.slice( 8 ) );
                }else{
                    _r.date = new Date();
                }
            }

            _r.minvalue = parseISODate( _selector.attr('minvalue') );
            _r.maxvalue = parseISODate( _selector.attr('maxvalue') );
            
            return _r;
        };
    /**
     * 每周的中文对应数字
     * @property    cnWeek
     * @type    string
     * @static
     * @default 日一二三四五六 
     */
    Calendar.cnWeek = "日一二三四五六";
    /**
     * 100以内的中文对应数字
     * @property    cnUnit
     * @type    string
     * @static
     * @default 十一二三四五六七八九    
     */
    Calendar.cnUnit = "十一二三四五六七八九";
    /**
     * 转换 100 以内的数字为中文数字
     * @method  getCnNum
     * @static
     * @param   {int}   _num
     * @return  string
     */
    Calendar.getCnNum =
        function ( _num ){
            var _r = Calendar.cnUnit.charAt( _num % 10 );
            _num > 10 && ( _r = (_num % 10 !== 0 ? Calendar.cnUnit.charAt(0) : '') + _r );
            _num > 19 && ( _r = Calendar.cnUnit.charAt( Math.floor( _num / 10 ) ) + _r );
            return _r;
        };
    /**
     * 设置日历组件的显示位置
     * @method  position
     * @static
     * @param   {selector}  _ipt    需要显示日历组件的文本框
     */
    Calendar.position =
        function( _ipt, _layout ){
            if( !( _ipt && _layout ) ) return;
            _layout.css( {'left': '-9999px', 'top': '-9999px', 'z-index': ZINDEX_COUNT++ } ).show();
            var _lw = _layout.width(), _lh = _layout.height()
                , _iw = _ipt.width(), _ih = _ipt.height(), _ioset = _ipt.offset()
                , _x, _y, _winw = $(window).width(), _winh = $(window).height()
                , _scrtop = $(document).scrollTop()
                ;

            _x = _ioset.left; _y = _ioset.top + _ih + 5;

            if( ( _y + _lh - _scrtop ) > _winh ){
                JC.log('y overflow');
                _y = _ioset.top - _lh - 3;

                if( _y < _scrtop ) _y = _scrtop;
            }

            _layout.css( {left: _x+'px', top: _y+'px'} );

            JC.log( _lw, _lh, _iw, _ih, _ioset.left, _ioset.top, _winw, _winh );
            JC.log( _scrtop, _x, _y );
        };
    /**
     * 这个方法后续版本不再使用, 请使用 Calendar.position
     */
    Calendar.setPosition = Calendar.position;
    /**
     * 初始化日历组件的触发按钮
     * @method  _logic.initTrigger
     * @param   {selector}      _selector   
     * @private
     */
    Calendar.initTrigger = 
        function( _selector ){
           _selector.each( function(){
                var _p = $(this), _nodeName = (_p.prop('nodeName')||'').toLowerCase();

                if( _nodeName != 'input' ){ 
                    Calendar.initTrigger( _selector.find( $('input[type=text]') ) ); 
                    return; 
                }

                if( !($.trim( _p.attr('datatype') || '').toLowerCase() == 'date' 
                        || $.trim( _p.attr('multidate') || '')
                        || $.trim( _p.attr('datatype') || '').toLowerCase() == 'daterange') ) return;

                var _btn = _p.find( '+ input.UXCCalendar_btn' );
                if( !_btn.length ){
                    _p.after( _btn = $('<input type="button" class="UXCCalendar_btn"  />') );
                }
                _btn.data( Calendar.INPUT, _p );
            });
        };

    Calendar.INPUT = 'CalendarInput';
    
    function Model( _selector ){
        this._selector = _selector;
    }
    Calendar.Model = Model;
    
    Model.prototype = {
        init:
            function(){
                return this;
            }

        , selector: function(){ return this._selector; }
        , layout: 
            function(){
                var _r = $('#UXCCalendar');

                if( !_r.length ){
                    _r = $( Calendar.tpl || this.tpl ).hide();
                    _r.attr('id', 'UXCCalendar').hide().appendTo( document.body );
                    var _month = $( [
                                '<option value="0">一月</option>'
                                , '<option value="1">二月</option>'
                                , '<option value="2">三月</option>'
                                , '<option value="3">四月</option>'
                                , '<option value="4">五月</option>'
                                , '<option value="5">六月</option>'
                                , '<option value="6">七月</option>'
                                , '<option value="7">八月</option>'
                                , '<option value="8">九月</option>'
                                , '<option value="9">十月</option>'
                                , '<option value="10">十一月</option>'
                                , '<option value="11">十二月</option>'
                            ].join('') ).appendTo( _r.find('select.UMonth' ) );

                    _r.data('confirmMethod', _logic.onConfirm );
                    _r.data('updateYearMethod', _logic.updateYear );
                 }
                return _r;
            }
        , startYear:
            function( _dateo ){
                var _span = Calendar.defaultDateSpan, _r = _dateo.date.getFullYear();
                this.selector().is('[calendardatespan]') 
                    && ( _span = parseInt( this.selector().attr('calendardatespan'), 10 ) );
                return _r - _span;
            }
        , endYear:
            function( _dateo ){
                var _span = Calendar.defaultDateSpan, _r = _dateo.date.getFullYear();
                this.selector().is('[calendardatespan]') 
                    && ( _span = parseInt( this.selector().attr('calendardatespan'), 10 ) );
                return _r + _span;
            }
        , currentcanselect:
            function(){
                var _r = true;
                this._model.selector().is('[currentcanselect]') 
                    && ( currentcanselect = parseBool( this._model.selector().attr('currentcanselect') ) );
                return _r;
            }
        , tpl:
            [
            '<div id="UXCCalendar" class="UXCCalendar">'
            ,'    <div class="UHeader">'
            ,'        <select class="UYear"></select>'
            ,'        <img class="UImg yearctl" align="absMiddle" usemap="#UXCCalendar_Year" />'
            ,'        <map name="UXCCalendar_Year"><area shape="rect" coords="0,0,13,8" href="#" action="up"><area shape="rect" coords="0,10,13,17" href="#" action="down"></map>'
            ,'        <select class="UMonth"></select>'
            ,'        <img class="UImg monthctl" align="absMiddle" usemap="#UXCCalendar_Month"  />'
            ,'        <map name="UXCCalendar_Month"><area shape="rect" coords="0,0,13,8" href="#" action="up"><area shape="rect" coords="0,10,13,17" href="#" action="down"></map>'
            ,'    </div>'
            ,'    <table class="UTable">'
            ,'        <thead>'
            ,'            <tr>'
            ,'                <th>一</th>'
            ,'                <th>二</th>'
            ,'                <th>三</th>'
            ,'                <th>四</th>'
            ,'                <th>五</th>'
            ,'                <th>六</th>'
            ,'                <th>日</th>'
            ,'            </tr>'
            ,'        </thead>'
            ,'   </table>'
            ,'   <table class="UTable UTableBorder">'
            ,'        <tbody>'
            ,'           <!--<tr>'
            ,'                <td class="cur"><a href="#">2</a></td>'
            ,'                <td class="unable"><a href="#">2</a></td>'
            ,'                <td class="weekend cur"><a href="#">6</a></td>'
            ,'                <td class="weekend hover"><a href="#">13</a></td>'
            ,'                <td class="weekend other"><a href="#">41</a></td>'
            ,'                <td class="weekend other"><a href="#">42</a></td>'
            ,'            </tr>-->'
            ,'        </tbody>'
            ,'    </table>'
            ,'    <div class="UFooter">'
            ,'        <button type="button" class="UConfirm">确定</button>'
            ,'        <button type="button" class="UClear">清空</button>'
            ,'        <button type="button" class="UCancel">取消</button>'
            ,'    </div>'
            ,'</div>'
            ].join('')

    };
    
    function View( _model ){
        this._model = _model;
    }
    Calendar.View = View;
    
    View.prototype = {
        init:
            function() {
                return this;
            }

        , hide:
            function(){
            }

        , show:
            function(){
                var _dateo = Calendar.getDate( this._model.selector() );
                JC.log( 'Calendar.View: show', new Date().getTime(), formatISODate( _dateo.date ) );

                this._buildLayout( _dateo );
                this._buildDone();
            }
        , _buildLayout:
            function( _dateo ){
                this._model.layout();

                this._buildHeader( _dateo );
                this._buildBody( _dateo );
                this._buildFooter( _dateo );
            }
        , _buildHeader:
            function( _dateo ){
                var _p = this
                    , _layout = _p._model.layout()
                    , _ls = []
                    , _tmp
                    , _selected = _selected = _dateo.date.getFullYear()
                    , _startYear = _p._model.startYear( _dateo )
                    , _endYear = _p._model.endYear( _dateo )
                    ;
                JC.log( _startYear, _endYear );
                for( var i = _startYear; i <= _endYear; i++ ){
                    _ls.push( printf( '<option value="{0}"{1}>{0}</option>', i, i === _selected ? ' selected' : '' ) );
                }
                $( _ls.join('') ).appendTo( _layout.find('select.UYear').html('') );

                $( _layout.find('select.UMonth').val( _dateo.date.getMonth() ) );
            }
        , _buildBody:
            function( _dateo ){
                var _p = this, _layout = _p._model.layout();
                var _maxday = maxDayOfMonth( _dateo.date ), _weekday = _dateo.date.getDay() || 7
                    , _sumday = _weekday + _maxday, _row = 6, _ls = [], _premaxday, _prebegin
                    , _tmp, i, _class;

                var _beginDate = new Date( _dateo.date.getFullYear(), _dateo.date.getMonth(), 1 );
                var _beginWeekday = _beginDate.getDay() || 7;
                if( _beginWeekday < 2 ){
                    _beginDate.setDate( -( _beginWeekday - 1 + 6 ) );
                }else{
                    _beginDate.setDate( -( _beginWeekday - 2 ) );
                }
                var today = new Date();

                if( _dateo.maxvalue && !_p._model.currentcanselect() ){
                    _dateo.maxvalue.setDate( _dateo.maxvalue.getDate() - 1 );
                }

                _ls.push('<tr>');
                for( i = 1; i <= 42; i++ ){
                    _class = [];
                    if( _beginDate.getDay() === 0 || _beginDate.getDay() == 6 ) _class.push('weekend');
                    if( !isSameMonth( _dateo.date, _beginDate ) ) _class.push( 'other' );
                    if( _dateo.minvalue && _beginDate.getTime() < _dateo.minvalue.getTime() ) 
                        _class.push( 'unable' );
                    if( _dateo.maxvalue && _beginDate.getTime() > _dateo.maxvalue.getTime() ) 
                        _class.push( 'unable' );

                    if( isSameDay( _beginDate, today ) ) _class.push( 'today' );
                    if( isSameDay( _dateo.date, _beginDate ) ) _class.push( 'cur' );

                    _ls.push( '<td class="', _class.join(' '),'">'
                            ,'<a href="javascript:" date="', _beginDate.getTime(),'" title="'+formatISODate(_beginDate)+'" >'
                            , _beginDate.getDate(), '</a></td>' );
                    _beginDate.setDate( _beginDate.getDate() + 1 );
                    if( i % 7 === 0 && i != 42 ) _ls.push( '</tr><tr>' );
                }
                _ls.push('</tr>');
                _layout.find('table.UTableBorder tbody' ).html( $( _ls.join('') ) );
            }
        , _buildFooter:
            function( _dateo ){
            }
        , _buildDone:
            function(){
               Calendar.setPosition( this._model.selector(), this._model.layout() );
                this._model.selector().blur();
            }
    };

    var staticMethod = {
        _triggerShow:
            function(){
                var _ipt = Calendar.lastIpt, _tmp;
                _ipt && _ipt.attr('calendarshow') 
                    && ( _tmp = window[ _ipt.attr('calendarshow') ] )
                    && _tmp.call( _ipt );
            }
        , _triggerHide:
            function(){
                var _ipt = Calendar.lastIpt, _tmp;
                _ipt && _ipt.attr('calendarhide') 
                    && ( _tmp = window[ _ipt.attr('calendarhide') ] )
                    && _tmp.call( _ipt );
            }
        , _triggerLayoutChange:
            function(){
                var _ipt = Calendar.lastIpt, _tmp;
                _ipt && _ipt.attr('calendarlayoutchange') 
                    && ( _tmp = window[ _ipt.attr('calendarlayoutchange') ] )
                    && _tmp.call( _ipt );
            }
        , _triggerClear:
            function(){
                var _ipt = Calendar.lastIpt, _tmp;
                _ipt && _ipt.attr('calendarclear') 
                    && ( _tmp = window[ _ipt.attr('calendarclear') ] )
                    && _tmp.call( _ipt );
            }
        , _triggerUpdate:
            function( _data ){
                var _ipt = Calendar.lastIpt, _tmp;
                _ipt && _ipt.attr('calendarupdate') 
                    && ( _tmp = window[ _ipt.attr('calendarupdate') ] )
                    && _tmp.apply( _ipt, _data );
            }
        , _triggerUpdateMultiSelect:
            function( _data ){
                var _ipt = Calendar.lastIpt, _tmp;
                _ipt && _ipt.attr('calendarupdatemultiselect') 
                    && ( _tmp = window[ _ipt.attr('calendarupdatemultiselect') ] )
                    && _tmp.apply( _ipt, _data );
            }
    };
    for( var k in staticMethod ){
        Calendar[k] = staticMethod[k];
    }
    /**
     * 私有逻辑处理对象, 基本上所有逻辑方法都存放于此对象
     * @property _logic
     * @type {Object}
     * @static
     * @private
     */
    var _logic =
    {
         /**
         * 按年份更改日期
         * @method  _logic.updateYear
         * @param   {int}   _year   新的年份, YYYY
         * @private
         */
        updateYear:
            function( _year ){
                JC.log( _year );
                if ( !_logic.lastDateObj ) return;
                var _premaxday = maxDayOfMonth( _logic.lastDateObj.date )
                    , _d = new Date( _year, _logic.lastDateObj.date.getMonth(), 1 )
                    , _nextmaxday = maxDayOfMonth( _d );
                if( _premaxday > _nextmaxday ) _d.setDate( _nextmaxday );
                else _d.setDate( _logic.lastDateObj.date.getDate() );

                _logic.lastDateObj.date = _d;

                _logic.initDateLayout( _logic.lastDateObj );
            }
        /**
         * 按月份更改日期
         * @method  _logic.setNewMonth
         * @param   {int}   _month  新的月份, mm
         * @private
         */
        , setNewMonth:
            function( _month ){
                JC.log( _month );
                if ( !_logic.lastDateObj ) return;
                var _premaxday = maxDayOfMonth( _logic.lastDateObj.date )
                    , _d = new Date( _logic.lastDateObj.date.getFullYear(), _month, 1 )
                    , _nextmaxday = maxDayOfMonth( _d );
                if( _premaxday > _nextmaxday ) _d.setDate( _nextmaxday );
                else _d.setDate( _logic.lastDateObj.date.getDate() );

                _logic.lastDateObj.date = _d;

                _logic.initMonth( _logic.lastDateObj );
                _logic.initMonthDate( _logic.lastDateObj );
            }
        /**
         * 获取日历组件的外观
         * @method  _logic.getLayout
         * @return  {selector} 日历组件的selector
         * @private
         */
        , getLayout:
            function(){
            }
        /**
         * 把日期赋值给文本框
         * @method  _logic.setDate
         * @param   {int}   _timestamp  日期对象的时间戳
         * @private
         */
        , setDate:
            function( _timestamp ){
                if( !(_timestamp && Calendar.lastIpt && Calendar.lastIpt.length ) ) return;
                var _d = new Date(), _symbol = '-'; _d.setTime( _timestamp );
                var _df = Calendar.lastIpt.attr('dateFormat');
                if( _df ){
                    _df = _df.replace(/[\da-zA-Z]/g, '');
                    if( _df.length ) _df = _df.slice(0, 1);
                    _symbol = _df;
                }
                var _dStr = formatISODate( _d, _symbol );
                Calendar.lastIpt.val( _dStr ).focus();
            }
        /**
         * 给文本框赋值, 日期为控件的当前日期
         * @method  _logic.onConfirm
         * @return  {int}   0/1
         * @private
         */
        , onConfirm:
            function(){
                var _cur = _logic.getLayout().find('td.cur');
                if( !_cur.length ) _logic.getLayout().find('td.today');
                if( _cur.length && _cur.hasClass('unable') ) return 0;
                if( _cur.length ) _cur.find('a').trigger('click');

                return 1;
            }
        /**
         * 日历组件模板
         * <p>这是默认模板, 用户可以给 JC.Calendar.tpl 赋值, 更改为自己的模板</p>
         * @property    _logic.tpl
         * @type    string
         * @private
         */
        //, tpl: 
    };
    /**
     * 捕获用户更改年份 
     * <p>监听 年份下拉框</p>
     * @event year change
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar select.UYear', 'change', function( $evt ){
        /*
        var box = $(this).parents( 'div.UXCCalendar' );
        box.length && box.data('updateYearMethod') && box.data('updateYearMethod')( $(this).val()  );
        Calendar._triggerLayoutChange();
        */
        var _ins = Calendar.getInstance( Calendar.lastIpt );
        _ins && _ins.update();
    });
    /**
     * 捕获用户更改年份 
     * <p>监听 下一年按钮</p>
     * @event next year
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar button.UNextYear', 'click', function( $evt ){
        var box = $(this).parents( 'div.UXCCalendar' );
        box.length && box.data('nextYearMethod') && box.data('nextYearMethod')();
        Calendar._triggerLayoutChange();
    });
    /**
     * 捕获用户更改年份 
     * <p>监听 上一年按钮</p>
     * @event previous year
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar button.UPreYear', 'click', function( $evt ){
        var box = $(this).parents( 'div.UXCCalendar' );
        box.length && box.data('preYearMethod') && box.data('preYearMethod')();
        Calendar._triggerLayoutChange();
    });
    /**
     * 捕获用户更改月份
     * <p>监听 月份下拉框</p>
     * @event   month change
     * @private
     */
    $(document).delegate( '#UXCCalendar select.UMonth', 'change', function( $evt ){
        _logic.setNewMonth( $(this).val() );
        Calendar._triggerLayoutChange();
    });
    /**
     * 选择当前日期
     * <p>监听确定按钮</p>
     * @event   confirm click
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar button.UConfirm', 'click', function( $evt ){
        var box = $(this).parents( 'div.UXCCalendar' ), _tmp;
        if( box.length && ( _tmp = box.find('td.cur') ).length ){
            if( _tmp.hasClass( 'unable' ) ) return;
        }
        box.length && box.data('confirmMethod') && box.data('confirmMethod')( this );
        Calendar.hide();
    });
    /**
     * 增加或者减少一年
     * <p>监听 年份map</p>
     * @event   year map click
     * @private
     */
    $(document).delegate( "map[name=UXCCalendar_Year] area" , 'click', function( $evt ){
        $evt.preventDefault();
        var _p = $(this), _do = _logic.lastDateObj;
        if( !(_do && _p.attr("action") ) ) return;
        if( _p.attr("action").toLowerCase() == 'up' ){
            _do.date.setFullYear( _do.date.getFullYear() + 1 );
        }else if( _p.attr("action").toLowerCase() == 'down' ){
            _do.date.setFullYear( _do.date.getFullYear() - 1 );
        }
        _logic.initDateLayout( _do );
        JC.log( _p.attr("action") );
        Calendar._triggerLayoutChange();
    });
    /**
     * 增加或者减少一个月
     * <p>监听 月份map</p>
     * @event   month map click
     * @private
     */
    $(document).delegate( "map[name=UXCCalendar_Month] area" , 'click', function( $evt ){
        $evt.preventDefault();
        var _p = $(this), _do = _logic.lastDateObj;
        if( !(_do && _p.attr("action") ) ) return;
        if( _p.attr("action").toLowerCase() == 'up' ){
            _do.date.setMonth( _do.date.getMonth() + 1 );
            _do.initMinvalue.setMonth( _do.initMinvalue.getMonth() + 1 );
            _do.initMaxvalue.setMonth( _do.initMaxvalue.getMonth() + 1 );
        }else if( _p.attr("action").toLowerCase() == 'down' ){
            _do.date.setMonth( _do.date.getMonth() - 1 );
            _do.initMinvalue.setMonth( _do.initMinvalue.getMonth() - 1 );
            _do.initMaxvalue.setMonth( _do.initMaxvalue.getMonth() - 1 );
        }
        _logic.initDateLayout( _do );
        JC.log( _p.attr("action") );
        Calendar._triggerLayoutChange();
    });
    /**
     * 清除文本框内容
     * <p>监听 清空按钮</p>
     * @event   clear click
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar button.UClear', 'click', function( $evt ){
        Calendar.lastIpt 
            && Calendar.lastIpt.length 
            && ( Calendar.lastIpt.val(''), Calendar._triggerClear() )
            ;
    });
    /**
     * 取消日历组件, 相当于隐藏
     * <p>监听 取消按钮</p>
     * @event cancel click
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar button.UCancel', 'click', function( $evt ){
        Calendar.hide();
    });
    /**
     * 日历组件按钮点击事件
     * @event calendar button click
     * @private
     */
    $(document).delegate( 'input.UXCCalendar_btn', 'click', function($evt){
        $(this).data( Calendar.INPUT ) && Calendar.pickDate( $(this).data( Calendar.INPUT ) );
    });
    /**
     * 日历组件文本框获得焦点
     * @event input focus
     * @private
     */
    $(document).delegate( [ 'input[datatype=season]', 'input[datatype=month]', 'input[datatype=week]'
            , 'input[datatype=date]', 'input[datatype=daterange]', 'input[multidate]' ].join(), 'focus' , function($evt){
            Calendar.pickDate( this );
    });
    $(document).delegate( [ 'button[datatype=season]', 'button[datatype=month]', 'button[datatype=week]'
            , 'button[datatype=date]', 'button[datatype=daterange]', 'button[multidate]' ].join(), 'click' , function($evt){
            Calendar.pickDate( this );
    });
    /**
     * 日历组件点击事件, 阻止冒泡, 防止被 document click事件隐藏
     * @event UXCCalendar click
     * @private
     */
    $(document).delegate( 'body > div.UXCCalendar', 'click', function( $evt ){
        $evt.stopPropagation();
    });
    /**
     * 日期点击事件
     * @event date click
     * @private
     */
    $(document).delegate( '#UXCCalendar table a', 'click', function( $evt ){
        $evt.preventDefault();
        var _p = $(this), _tm = _p.attr('date')||'', _d = new Date(), _isMultiselect = Calendar.isMultiSelect();
        if( !_tm ) return;
        if( _p.parent('td').hasClass('unable') ) return;

        JC.log( _tm );

        _logic.setDate( _tm );
        Calendar.hide();

        _d.setTime( _tm );
        Calendar._triggerUpdate( [ 'date', _d, _d ] );
    });

    /**
     * DOM 加载完毕后, 初始化日历组件相关事件
     * @event   dom ready
     * @private
     */
    $(document).ready( function($evt){
        /**
         * 延迟200毫秒初始化页面的所有日历控件
         * 之所以要延迟是可以让用户自己设置是否需要自动初始化
         */
        setTimeout( function( $evt ){
            if( !Calendar.autoInit ) return;
            Calendar.initTrigger( $('input[type=text]') );
        }, 200 );
        /**
         * 监听窗口滚动和改变大小, 实时变更日历组件显示位置
         * @event  window scroll, window resize
         * @private
         */
        $(window).on('scroll resize', function($evt){
            var _layout = $('body > div.UXCCalendar:visible');
            if( !( _layout.length && Calendar.lastIpt ) ) return;
            Calendar.position( Calendar.lastIpt, _layout );
        });
        /**
         * dom 点击时, 检查事件源是否为日历组件对象, 如果不是则会隐藏日历组件
         * @event dom click
         * @private
         */
        $(document).on('click', function($evt){
            var _src = $evt.target || $evt.srcElement;

            if( Calendar.domClickFilter ) if( Calendar.domClickFilter( $(_src) ) === false ) return;

            if( Calendar.isCalendar($evt.target||$evt.targetElement) ) return;

            if( _src && ( _src.nodeName.toLowerCase() != 'input' && _src.nodeName.toLowerCase() != 'button' ) ){
                Calendar.hide(); return;
            }

            setTimeout( function(){
                if( Calendar.lastIpt && Calendar.lastIpt.length && _src == Calendar.lastIpt[0] ) return;
                Calendar.hide();
            }, 100);
        });
    });
}(jQuery));

