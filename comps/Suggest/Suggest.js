;(function($){
    //TODO: 自动生成 layout, layout 自动定位 
    !window.JC && (window.JC = { log:function(){} });
    window.ZINDEX_COUNT = window.ZINDEX_COUNT || 50001;

    window.Suggest = JC.Suggest = Suggest;
    /**
     * Suggest 关键词补全提示类
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
     * | <a href='http://jc.openjavascript.org/docs_api/classes/JC.Suggest.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Suggest/_demo' target='_blank'>demo link</a></p>
     * @namespace JC
     * @class Suggest
     * @constructor
     * @param   {selector|string}   _selector   
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 75 Team
     * @date    2013-08-11
     * @example
     */
    function Suggest( _selector ){
        _selector && ( _selector = $(_selector) );
        if( !_selector || Suggest.getInstance( _selector ) ) return;
        Suggest.getInstance( _selector, this );

        this._model = new Model( _selector );
        this._view = new View( this._model );

        this._init();
    }
    
    Suggest.prototype = {
        _init:
            function(){
                var _p = this;

                this._initHanlderEvent();

                _p._view.init();
                _p._model.init();

                this._initActionEvent();
                 
                return _p;
            }    
        /**
         *
         *  suggest_so({ "p" : true,
              "q" : "shinee",
              "s" : [ "shinee 综艺",
                  "shinee美好的一天",
                  "shinee hello baby",
                  "shinee吧",
                  "shinee泰民",
                  "shinee fx",
                  "shinee快乐大本营",
                  "shinee钟铉车祸",
                  "shinee年下男的约会",
                  "shinee dream girl"
                ]
            });
         */
        , update: 
            function( _evt, _data ){
                var _p = this;
                typeof _data == 'undefined' && ( _data = _evt );

                if( _data && _data.q ){
                    _p._model.cache( _data.q, _data );
                }

                this._view.update( _data );
            }
        /**
         * 显示 Suggest 
         * @method  hide
         * @return  SuggestInstance
         */
        , show: function(){ this._view.show(); return this; }
        /**
         * 隐藏 Suggest
         * @method  hide
         * @return  SuggestInstance
         */
        , hide: function(){ this._view.hide(); return this; }
        /**
         * 获取 显示 Suggest 的触发源选择器, 比如 a 标签
         * @method  selector
         * @return  selector
         */ 
        , selector: function(){ return this._model.selector(); }
        /**
         * 获取 Suggest 外观的 选择器
         * @method  layout
         * @return  selector
         */
        , layout: function(){ return this._model.layout(); }
        /**
         * 使用 jquery on 绑定事件
         * @method  {string}    on
         * @param   {string}    _evtName
         * @param   {function}  _cb
         * @return  SuggestInstance
         */
        , on: function( _evtName, _cb ){ $(this).on(_evtName, _cb ); return this;}
        /**
         * 使用 jquery trigger 绑定事件
         * @method  {string}    trigger
         * @param   {string}    _evtName
         * @return  SuggestInstance
         */
        , trigger: function( _evtName, _data ){ $(this).trigger( _evtName, _data ); return this;}
        , _initHanlderEvent:
            function(){
                var _p = this;

                $(_p._view).on('BindEvent', function( _evt, _evtName, _cb ){
                    _p.on( _evtName, _cb );
                });

                $(_p._view).on('TriggerEvent', function( _evt, _evtName, _data ){
                    _p.trigger( _evtName, [ _data ] );
                });

                $(_p._model).on('BindEvent', function( _evt, _evtName, _cb ){
                    _p.on( _evtName, _cb );
                });

                $(_p._model).on('TriggerEvent', function( _evt, _evtName, _data ){
                    //JC.log( JSON.stringify( _data ) );
                    _p.trigger( _evtName, _data );
                });
            }
        , _initActionEvent:
            function(){
                var _p = this;

                _p.on( 'UPDATE', _p.update );

                //TODO: 添加缓存控制
                _p._model.selector().on('keyup', function( _evt ){
                    var _sp = $(this), _val = _sp.val().trim();
                    JC.log( 'keyup', _val, new Date().getTime() );

                    if( !_val ){
                        _p.update();
                        return;
                    }

                    if( _p._model.cache( _val ) ){
                        _p.update( _p._model.cache( _val ) );
                        return;
                    }

                    if( _p._model.preValue === _val ){
                        return;
                    }
                    _p._model.preValue = _val;

                    JC.log( _val );

                    if( _p._model.queryInterval ){
                        if( _p._model.timeout ){
                            clearTimeout( _p._model.timeout );
                        }
                        _p._model.timeout =
                            setTimeout( function(){
                                _p._model.getData( _val );
                            }, _p._model.queryInterval );
                    }else{
                        _p._model.getData( _val );
                    }
                });

                _p._model.selector().on('keydown', function( _evt ){
                    var _keycode = _evt.keyCode;
                    switch( _keycode ){
                        case 38://up
                            {
                                _evt.preventDefault();
                                break;
                            }
                        case 40://down
                            {
                                _evt.preventDefault();
                                break;
                            }
                    }
                });

                $( _p._model.layout() ).delegate( '.js_sugItem', 'mouseenter', function(_evt){
                    $(this).addClass('active');
                });

                $( _p._model.layout() ).delegate( '.js_sugItem', 'mouseleave', function(_evt){
                    $(this).removeClass('active');
                });

                _p.selector().on( 'click', function(_evt){
                    _evt.stopPropagation();
                    _p.selector().trigger( 'keyup' );
                });

                $( _p._model.layout() ).delegate( '.js_sugItem', 'click', function(_evt){
                    var _sp = $(this), _keyword = _sp.attr('keyword');
                    try{ _keyword = decodeURIComponent( _keyword ); }catch(ex){}
                    _p.selector().val( _keyword );
                    _p.hide();
                    
                    _p._model.sugselected() && _p._model.sugselected().call( _p, _keyword );
                });
            }

    }
    /**
     * 获取或设置 Suggest 的实例
     * @method getInstance
     * @param   {selector}              _selector
     * @param   {SuggestInstace|null}   _setter
     * @static
     * @return  {Suggest instance}
     */
    Suggest.getInstance =
        function( _selector, _setter ){
            if( typeof _selector == 'string' && !/</.test( _selector ) ) 
                    _selector = $(_selector);
            if( !(_selector && _selector.length ) || ( typeof _selector == 'string' ) ) return;
            typeof _setter != 'undefined' && _selector.data( 'SuggestInstace', _setter );

            return _selector.data('SuggestInstace');
        };
    /**
     * 判断 selector 是否可以初始化 Suggest
     * @method  isSuggest
     * @param   {selector}      _selector
     * @static
     * @return  bool
     */
    Suggest.isSuggest =
        function( _selector ){
            var _r;
            _selector 
                && ( _selector = $(_selector) ).length 
                && ( _r = _selector.is( '[suglayout]' ) );
            return _r;
        };
    /**
     * 设置 Suggest 是否需要自动初始化
     * @property    autoInit
     * @type        bool
     * @default     true
     * @static
     */
    Suggest.autoInit = true;
    Suggest.layoutTpl = '';
    
    function Model( _selector ){
        this._selector = _selector;
        this._id = 'Suggest_' + new Date().getTime();
    }
    
    Model.prototype = {
        init:
            function(){
                return this;
            }

        , selector: function(){ return this._selector; }
        , layoutTpl: '<dl class="sug_layout js_sugLayout" style="display:none;"></dl>'
        , layout: 
            function(){

                !this._layout && this.selector().is('[suglayout]') 
                    && ( this._layout = $( this.selector().attr('suglayout') ) );

                !this._layout && ( this._layout = $( Suggest.layoutTpl() || this.layoutTpl ) );
                !this._layout.hasClass('js_sugLayout') && this._layout.addClass( 'js_sugLayout' );

                return this._layout;
            }
        , sugwidth:
            function(){
                this.selector().is('[sugwidth]') 
                    && ( this._sugwidth = parseInt( this.selector().attr('sugwidth') ) );
                !this._sugwidth && ( this._sugwidth = parseInt( this.selector().prop('offsetWidth') ) );
                return this._sugwidth;
            }
        , sugoffsetleft:
            function(){
                this.selector().is('[sugoffsetleft]') 
                    && ( this._sugoffsetleft = parseInt( this.selector().attr('sugoffsetleft') ) );
                !this._sugoffsetleft && ( this._sugoffsetleft = 0 );
                return this._sugoffsetleft;
            }
        , sugoffsettop:
            function(){
                this.selector().is('[sugoffsettop]') 
                    && ( this._sugoffsettop = parseInt( this.selector().attr('sugoffsettop') ) );
                !this._sugoffsettop && ( this._sugoffsettop = 0 );
                return this._sugoffsettop;
            }
        , sugsidepadding:
            function(){
                this.selector().is('[sugsidepadding]') 
                    && ( this._sugsidepadding = parseInt( this.selector().attr('sugsidepadding') ) );
                !this._sugsidepadding && ( this._sugsidepadding = 0 );
                return this._sugsidepadding;
            }
        , _dataCallback:
            function( _data ){
                $(this).trigger( 'TriggerEvent', ['UPDATE', _data] );
            }
        , sugcallback:
            function(){
                var _p = this;
                this.selector().is('[sugcallback]') 
                    && ( this._sugcallback = this.selector().attr('sugcallback') );
                !this._sugcallback && ( this._sugcallback = 'SuggestDataCallback' );
                !window[ this._sugcallback ] 
                    && ( window[ this._sugcallback ] = function( _data ){ _p._dataCallback( _data ); } );

                return this._sugcallback;
            }
        , sugurl:
            function( _word ){
                this.selector().is('[sugurl]') 
                    && ( this._sugurl = this.selector().attr('sugurl') );
                !this.selector().is('[sugurl]') && ( this._sugurl = '?word={0}&callback={1}' );
                this._sugurl = printf( this._sugurl, _word, this.sugcallback() );
                return this._sugurl;
            }
        , sugneedscripttag:
            function(){
                this._sugneedscripttag = true;
                this.selector().is('[sugneedscripttag]') 
                    && ( this._sugneedscripttag = parseBool( this.selector().attr('sugneedscripttag') ) );
                return this._sugneedscripttag;
            }
        , getData:
            function( _word ){
                var _p = this, _url = this.sugurl( _word ), _script, _scriptId = 'script_' + _p._id;
                JC.log( _url, new Date().getTime() );
                if( this.sugneedscripttag() ){
                    $( '#' + _scriptId ).remove();
                    _script = printf( '<script id="{1}" src="{0}"><\/script>', _url, _scriptId );
                    $( _script ).appendTo( document.body );
                }else{
                    $.get( _url, function( _d ){
                        _d = $.parseJSON( _d );
                        _p._dataCallback( _d );
                    });
                }
            }
        , cache: 
            function( _key, _val ){
                this._cache = this._cache || {};
                typeof _val != 'undefined' && ( this._cache[ _key ] = _val );
                return this._cache[ _key ];
            }
        , sugselected:
            function(){
                var _p = this;
                this.selector().is('[sugselected]') 
                    && ( this._sugselected = this.selector().attr('sugselected') );
                return this._sugselected ? window[ this._sugselected] : null;
            }
        , queryInterval: 200
        , timeout: null
        , preValue: null
        , keyindex: 0
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {
                return this;
            }

        , show: 
            function(){ 
                this._model.layout().show(); 
            }
        , hide: 
            function(){ 
                this._model.layout().hide().find( '.js_sugItem' ).removeClass('active'); 
            }
        , update:
            function( _data ){
                var _p = this, _ls = [], _query, _tmp, _text;

                if( !( _data && _data.s && _data.s.length ) ){
                    _p.hide();
                    return;
                }

                for( var i = 0, j = _data.s.length; i < j; i++ ){
                    _tmp = _data.s[i], _text = _tmp, _query = _data.q || '';
                    if( _tmp.indexOf( _query ) > -1 ){
                        _text = _text.slice( _query.length );
                        _text = '<b>' + _text + '</b>';
                    }
                    else _query = '';
                    _ls.push( printf('<dd keyword="{2}" class="js_sugItem">{0}{1}</dd>'
                                , _query, _text, encodeURIComponent( _tmp ) ) );
                }

                _p._model.layout().html( _ls.join('') );
                _p._model.keyindex = 0;

                _p.show();
            }
    };

    $(document).delegate( 'input[type=text]', 'focus', function( _evt ){
        var _p = $(this), _ins = Suggest.getInstance( _p );
        if( _ins || !Suggest.isSuggest( _p ) || !Suggest.autoInit ) return;
        JC.log( 'Suggest input fined:', _p.attr('name'), new Date().getTime() );
        _ins = new Suggest( _p );
    });

    $(document).on('click', function( _evt ){
        $('dl.js_sugLayout, div.js_sugLayout').hide();
    });

}(jQuery));
