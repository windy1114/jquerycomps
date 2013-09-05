 ;(function($){
    /**
     * 初始化 checkbox 全选反选功能
     * <br />只要引用本脚本, 页面加载完毕时就会自动初始化全选反选功能
     * <br /><br />动态添加的 DOM 需要显式调用 JC.Form.initCheckAll( domSelector ) 进行初始化
     * <br /><br />要使页面上的全选反选功能能够自动初始化, 需要在全选反选按钮上加入一些HTML 属性
     * <br /><b>checktype</b>: all | inverse, all=全选/全不选, inverse=反选
     * <br /><b>checkfor</b>: selector, 要全选/反选的 checkbox 选择器语法
     * <br /><b>checkall</b>: selector, 全选按钮的选择器, 这个只有反选按钮需要, 反选时变更全选按钮的状态
     * @method  initCheckAll
     * @static
     * @for JC.Form
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 75 team
     * @date    2013-06-11
     * @param   {selector}  _selector   要初始化的全选反选的父级节点
     * @example
            <h2>AJAX data:</h2>
            <dl class="def example24">
                <dt>checkall example 24</dt>
                <dd>
                    <label>
                        <input type="checkbox" checktype="all" checkfor="dl.example24 input[type=checkbox]">
                        全选
                    </label>
                    <label>
                        <input type="checkbox" checktype="inverse" checkfor="dl.example24 input[type=checkbox]" checkall="dl.example24 input[checktype=all]">
                        反选
                    </label>
                </dd>
                <dd>
                    <label>
                        <input type='checkbox' value='' name='' checked />
                        checkall24_1
                    </label>
                    <label>
                        <input type='checkbox' value='' name='' checked />
                        checkall24_2
                    </label>
                    <label>
                        <input type='checkbox' value='' name='' checked />
                        checkall24_3
                    </label>
                    <label>
                        <input type='checkbox' value='' name='' checked />
                        checkall24_4
                    </label>
                    <label>
                        <input type='checkbox' value='' name='' checked />
                        checkall24_5
                    </label>
                </dd>
            </dl>

            <script>
            $(document).delegate( 'button.js_ajaxTest', 'click', function(){
                var _p = $(this);
                _p.prop('disabled', true);
                setTimeout( function(){ _p.prop('disabled', false); }, 1000 );

                $.get( './data/initCheckAll.php?rnd='+new Date().getTime(), function( _r ){
                    var _selector = $(_r);
                    $( $( 'body' ).children().first() ).before( _selector );
                    JC.Form.initCheckAll( _selector );
                });
            });
            </script>
     */
    AutoChecked.initCheckAll = 
        function( _selector ){
            _selector = $( _selector );
            var _ls = _selector.find( 'input[type=checkbox][checktype][checkfor]' ), _p;
            _ls.each( function(){
                _p = $(this);
                if( !AutoChecked.isAutoChecked( _p ) ) return;
                if( AutoChecked.getInstance( _p ) ) return;
                new AutoChecked( _p );
            });
        };
    JC.Form.initCheckAll = AutoChecked.initCheckAll;

    function AutoChecked( _selector ){
        if( AutoChecked.getInstance( _selector ) ) return AutoChecked.getInstance( _selector );
        AutoChecked.getInstance( _selector, this );

        JC.log( 'AutoChecked init', new Date().getTime() );

        this._model = new Model( _selector );
        this._view = new View( this._model );

        this._init();
    }
    
    AutoChecked.prototype = {
        _init:
            function(){
                var _p = this;

                _p._initHandlerEvent();

                $( [ _p._view, _p._model ] ).on('BindEvent', function( _evt, _evtName, _cb ){
                    _p.on( _evtName, _cb );
                });

                $([ _p._view, _p._model ] ).on('TriggerEvent', function( _evt, _evtName ){
                    var _data = sliceArgs( arguments ); _data.shift(); _data.shift();
                    _p.trigger( _evtName, _data );
                });

                _p._model.init();
                _p._view.init();

                _p._view.itemChange();

                return _p;
            }    

        , _initHandlerEvent:
            function(){
                var _p = this;
                _p.selector().on('change', function(){
                    _p.trigger( _p._model.checktype() );
                });

                _p.on('all', function(){
                    JC.log( 'AutoChecked all', new Date().getTime() );
                    _p._view.allChange();
                });

                _p.on('inverse', function(){
                    JC.log( 'AutoChecked inverse', new Date().getTime() );
                    _p._view.inverseChange();
                });

                if( !( _p._model.checktype() == 'inverse' && _p._model.hasCheckAll() ) ){
                    $( _p._model.delegateElement() ).delegate( _p._model.delegateSelector(), 'click', function( _evt ){
                        if( AutoChecked.isAutoChecked( $(this) ) ) return;
                        JC.log( 'AutoChecked change', new Date().getTime() );
                        _p._view.itemChange();
                    });
                }

            }
        /**
         * 获取 显示 AutoChecked 的触发源选择器, 比如 a 标签
         * @method  selector
         * @return  selector
         */ 
        , selector: function(){ return this._model.selector(); }
        /**
         * 使用 jquery on 绑定事件
         * @method  {string}    on
         * @param   {string}    _evtName
         * @param   {function}  _cb
         * @return  AutoCheckedInstance
         */
        , on: function( _evtName, _cb ){ $(this).on(_evtName, _cb ); return this;}
        /**
         * 使用 jquery trigger 绑定事件
         * @method  {string}    trigger
         * @param   {string}    _evtName
         * @return  AutoCheckedInstance
         */
        , trigger: function( _evtName, _data ){ $(this).trigger( _evtName, _data ); return this;}
    }
    /**
     * 获取或设置 AutoChecked 的实例
     * @method getInstance
     * @param   {selector}      _selector
     * @static
     * @return  {AutoChecked instance}
     */
    AutoChecked.getInstance =
        function( _selector, _setter ){
            if( typeof _selector == 'string' && !/</.test( _selector ) ) 
                    _selector = $(_selector);
            if( !(_selector && _selector.length ) || ( typeof _selector == 'string' ) ) return;
            typeof _setter != 'undefined' && _selector.data( 'AutoCheckedIns', _setter );

            return _selector.data('AutoCheckedIns');
        };
    /**
     * 判断 selector 是否可以初始化 AutoChecked
     * @method  isAutoChecked
     * @param   {selector}      _selector
     * @static
     * @return  bool
     */
    AutoChecked.isAutoChecked =
        function( _selector ){
            var _r;
            _selector 
                && ( _selector = $(_selector) ).length 
                && ( _r = _selector.is( '[checkfor]' ) && _selector.is( '[checktype]' ) );
            return _r;
        };
    
    function Model( _selector ){
        this._selector = _selector;
    }

    Model.isParentSelectorRe = /^[\/\|<]/;
    Model.parentSelectorRe = /[^\/\|<]/g;
    Model.childSelectorRe = /[\/\|<]/g;

    Model.prototype = {
        init:
            function(){
                return this;
            }
        , checktype:
            function(){
                return ( this.selector().attr('checktype') || '' ).toLowerCase();
            }

        , checkfor:
            function(){
                return ( this.selector().attr('checkfor') || '' );
            }

        , checkall:
            function(){
                return ( this.selector().attr('checkall') || '' );
            }

        , hasCheckAll: function(){ return this.selector().is('[checkall]') && this.selector().attr('checkall'); }

        , selector: function(){ return this._selector; }

        , isParentSelector: function(){ return Model.isParentSelectorRe.test( this.selector().attr( 'checkfor' ) ); }

        , delegateSelector:
            function(){
                var _r = this.selector().attr('checkfor'), _tmp;
                if( this.isParentSelector() ){
                    if( /^</.test( this.checkfor() ) ){
                        this.checkfor().replace( /[\s]([\s\S]+)/, function( $0, $1 ){
                            _r = $1;
                        });
                    }else{
                        _r = this.checkfor().replace( Model.childSelectorRe, '' );
                    }
                }
                return _r;
            }

        , delegateElement:
            function(){
                var _p = this, _r = $(document), _tmp;
                if( this.isParentSelector() ){
                    if( /^</.test( this.checkfor() ) ){
                        this.checkfor().replace( /^([^\s]+)/, function( $0, $1 ){
                            _r = parentSelector( _p.selector(), $1 );
                        });
                    }else{
                        _tmp = this.checkfor().replace( Model.parentSelectorRe, '' );
                        _r = parentSelector( _p.selector(), _tmp );
                    }
                }
                return _r;
            }

        , items:
            function(){
                return this.delegateElement().find( this.delegateSelector() );
            }

        , checkedAll: function(){ return this.selector().prop('checked'); }
        , checkedInverse: function(){ return this.selector().prop('checked'); }

        , allSelector:
            function(){
                var _r;
                if( this.checktype() == 'inverse' ){
                    this.checkall() 
                        && ( _r = parentSelector( this.selector(), this.checkall() ) )
                        ;
                }else{
                    _r = this.selector();
                }
                return _r;
            }
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {
                return this;
            }
        , itemChange:
            function(){
                switch( this._model.checktype() ){
                    case 'all': this._fixAll(); break;
                }
            }
        , allChange:
            function(){
                var _p = this, _checked = _p._model.checkedAll();
                _p._model.items().each( function(){
                    if( AutoChecked.isAutoChecked( $(this) ) ) return;
                    if( $(this).is('[disabled]') ) return;
                    $(this).prop( 'checked', _checked );
                });
            }
        , inverseChange:
            function(){
                var _p = this;
                _p._model.items().each( function(){
                    var _sp = $(this);
                    if( AutoChecked.isAutoChecked( _sp ) ) return;
                    if( $(this).is('[disabled]') ) return;
                    _sp.prop( 'checked', !_sp.prop('checked') );
                });
                this._fixAll();
            }
        , _fixAll:
            function(){
                var _p = this, _checkAll = true;
                if( _p._model.allSelector().prop( 'disabled' ) ) return;

                _p._model.items().each( function(){
                    if( AutoChecked.isAutoChecked( $(this) ) ) return;
                    if( $(this).is('[disabled]') ) return;
                    if( !$(this).prop('checked') ) return _checkAll = false;
                });

                JC.log( '_fixAll:', _checkAll );

                _p._model.allSelector().prop('checked', _checkAll);
            }
    };
 
    $(document).ready( function( _evt ){
        JC.Form.initCheckAll( $(document) );
    });
}(jQuery));
