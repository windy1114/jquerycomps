;(function($){
    window.Fixed = JC.Fixed = Fixed;
    /**
     * 标签固定位置显示
     * <dl>
     *      <dd><b>require</b>: <a href='window.jQuery.html'>jQuery</a></dd>
     *      <dd><b>require</b>: <a href='.window.html#property_$.support.isFixed'>$.support.isFixed</a></dd>
     * </dl>
     * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
     * | <a href='http://jc.openjavascript.org/docs_api/classes/JC.Fixed.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Fixed/_demo' target='_blank'>demo link</a></p>
     * @namespace JC
     * @class Fixed
     * @constructor
     * @param   {selector|string}   _selector   
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 75 Team
     * @date    2013-07-20
     * @example
     */
    function Fixed( _selector ){
        this._model = new Model( _selector );
        this._view = new View( this._model );

        this._init();
    }

    Fixed.autoInit = true;
    
    Fixed.prototype = {
        _init:
            function(){
                $( [ this._view, this._model ] ).on('BindEvent', function( _evt, _evtName, _cb ){
                    _p.on( _evtName, _cb );
                });

                $([ this._view, this._model ] ).on('TriggerEvent', function( _evt, _evtName ){
                    var _data = sliceArgs( arguments ); _data.shift(); _data.shift();
                    _p.trigger( _evtName, _data );
                });

                this._model.init();
                this._view.init();

                JC.log('Fixed init:', new Date().getTime() );

                return this;
            }    
        /**
         * 显示 Fixed
         * @method  show
         * @return  FixedIns
         */
        , show: function(){ this._view.show(); return this; }
        /**
         * 隐藏 Fixed
         * @method  hide
         * @return  FixedIns
         */
        , hide: function(){ this._view.hide(); return this; }
        /**
         * 获取 Fixed 外观的 选择器
         * @method  layout
         * @return  selector
         */
        , layout: function(){ return this._model.layout(); }
        /**
         * 使用 jquery on 绑定事件
         * @method  {string}    on
         * @param   {string}    _evtName
         * @param   {function}  _cb
         * @return  FixedIns
         */
        , on: function( _evtName, _cb ){ $(this).on(_evtName, _cb ); return this;}
        /**
         * 使用 jquery trigger 绑定事件
         * @method  {string}    trigger
         * @param   {string}    _evtName
         * @return  FixedIns
         */
        , trigger: function( _evtName, _data ){ $(this).trigger( _evtName, _data ); return this;}
    }
    /**
     * 获取或设置 Fixed 的实例
     * @method getInstance
     * @param   {selector}      _selector
     * @static
     * @return  {Fixed instance}
     */
    Fixed.getInstance =
        function( _selector, _setter ){
            if( typeof _selector == 'string' && !/</.test( _selector ) ) 
                    _selector = $(_selector);
            if( !(_selector && _selector.length ) || ( typeof _selector == 'string' ) ) return;
            typeof _setter != 'undefined' && _selector.data( 'FixedIns', _setter );

            return _selector.data('FixedIns');
        };
    /**
     * 判断 selector 是否可以初始化 Fixed
     * @method  isFixed
     * @param   {selector}      _selector
     * @static
     * @return  bool
     */
    Fixed.isFixed =
        function( _selector ){
            var _r;
            _selector 
                && ( _selector = $(_selector) ).length 
                && ( _r = _selector.is( '[Fixedlayout]' ) );
            return _r;
        };
    
    function Model( _layout ){
        this._layout = _layout;
    }
    
    Model.prototype = {
        init:
            function(){
                return this;
            }

        , isFixedTop: function(){ return this._layout.is('[fixedtop]'); }
        , isFixedRight: function(){ return this._layout.is('[fixedright]'); }
        , isFixedBottom: function(){ return this._layout.is('[fixedbottom]'); }
        , isFixedLeft: function(){ return this._layout.is('[fixedleft]'); }

        , fixedtop: function(){ return parseInt( this._layout.attr('fixedtop'), 10 ); }
        , fixedright: function(){ return parseInt( this._layout.attr('fixedright'), 10 ); }
        , fixedbottom: function(){ return parseInt( this._layout.attr('fixedbottom'), 10 ); }
        , fixedleft: function(){ return parseInt( this._layout.attr('fixedleft'), 10 ); }

        , fixedmoveto: 
            function(){ 
                var _r = '', _moveItem = this.moveToItem();
                _moveItem && _moveItem.length && ( _r = _moveItem.attr('fixedmoveto') || '' );
                return _r.trim();
            }
        , moveToItem: 
            function(){ 
                var _r = this.layout().is('[fixedmoveto]') ? this.layout() : null, _tmp;
                if( !_r ){
                    ( _tmp = this._layout.find('[fixedmoveto]') ).length && ( _r = _tmp );
                }
                return _r; 
            }

        , layout: function(){ return this._layout; }

        , fixedmoveeffect:
            function(){
                var _r = true, _moveItem = this.moveToItem();

                _moveItem && _moveItem.length 
                    && _moveItem.is( '[fixedmoveeffect]' )
                    && ( _r = parseBool( _moveItem.attr('fixedmoveeffect') ) )
                    ;

                return _r;
            }
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {

                $.support.isFixed ? this._initFixedSupport() : this._initFixedUnsupport();

                this._initMoveTo();
                this._model.layout().show();

                return this;
            }

        , _initMoveTo:
            function(){
                var _p = this, _moveItem = _p._model.moveToItem(), _movevalue = _p._model.fixedmoveto();
                if( !( _moveItem && _moveItem.length && _movevalue.length ) ) return;


                _moveItem.on( 'click', function( _evt ){
                    JC.log( '_moveItem click', _movevalue,  new Date().getTime() );
                });
            }

        , _initFixedSupport:
            function(){
                var _p = this;

                _p._model.isFixedTop() && _p._model.layout().css( 'top', _p._model.fixedtop() + 'px' );
                _p._model.isFixedRight() && _p._model.layout().css( 'right', _p._model.fixedright() + 'px' );
                _p._model.isFixedBottom() && _p._model.layout().css( 'bottom', _p._model.fixedbottom() + 'px' );
                _p._model.isFixedLeft() && _p._model.layout().css( 'left', _p._model.fixedleft() + 'px' );

                _p._model.layout().css( 'position', 'fixed' );
            }

        , _initFixedUnsupport:
            function(){
            }

        , hide:
            function(){
            }

        , show:
            function(){
            }
    };

    $(document).ready( function(){
        if( !Fixed.autoInit ) return;

        $( 'div.js_autoFixed, dl.js_autoFixed, ul.js_autoFixed, ol.js_autoFixed, button.js_autoFixed').each( function(){
            new Fixed( $(this) );
        });
    });

}(jQuery));
