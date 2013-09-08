;(function($){
    /**
     * 应用场景
     * <br />get 查询表单
     * <br />post 提交表单
     * <br />ajax 提交表单
     * <br />iframe 提交表单
     * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
     * | <a href='http://jc.openjavascript.org/docs_api/classes/window.Bizs.FormLogic.html' target='_blank'>API docs</a>
     * | <a href='../../bizs/FormLogic/_demo' target='_blank'>demo link</a></p>
     * require: <a href='../classes/window.jQuery.html'>jQuery</a>
     * <br/>require: <a href='../classes/JC.Valid.html'>JC.Valid</a>
     * <br/>require: <a href='../classes/JC.Form.html'>JC.Form</a>
     * <p>extend: <a href='../classes/JC.BaseMVC.html'>JC.BaseMVC</a></p>
     *
     * <h2>页面只要引用本文件, 默认会自动初始化 from class="js_autoFormLogic" 的表单</h2>
     * <h2>可用的 HTML 属性</h2>
     * <dl>
     *      <dt></dt>
     *      <dd></dd>
     * </dl>
     * @namespace       window.Bizs
     * @class           FormLogic
     * @extends         JC.BaseMVC
     * @constructor 
     * @author  qiushaowei  .1  2013-09-08
     * @example
     */
    Bizs.FormLogic = FormLogic;
    function FormLogic( _selector ){
        _selector && ( _selector = $( _selector ) );
        if( FormLogic.getInstance( _selector ) ) return FormLogic.getInstance( _selector );
        FormLogic.getInstance( _selector, this );

        this._model = new FormLogic.Model( _selector );
        //this._view = new FormLogic.View( this._model );

        this._init( );
    }
    
    !JC.Valid && JC.use( 'Valid' );
    !JC.Form && JC.use( 'Form' );

    /**
     * 处理 form 或者 _selector 的所有form
     * @method process
     * @param   {selector}  _selector
     * @return  {Array}     Array of FormLogicInstance
     * @static
     */
    FormLogic.process =
        function( _selector ){
            var _r = [];
            _selector && ( _selector = $( _selector ) );
            if( !( _selector && _selector.length ) ) return;
            if( _selector.prop('nodeName').toLowerCase() == 'form' ){
                _r.push( new FormLogic( _selector ) );
            }else{
                _selector.find('form.js_autoFormLogic').each( function(){
                    _r.push( new FormLogic( this  ) );
                });
            }
            return _r;
        };

    FormLogic.prototype = {
        _beforeInit:
            function(){
                JC.log( 'FormLogic._beforeInit', new Date().getTime() );
            }
        , _initHanlderEvent:
            function(){
                var _p = this
                    , _type = _p._model.formtype()
                    , _sp
                    ;

                this.selector().on('submit', function( _evt ){
                    _sp = $(this);

                    if( _p._model.formBeforeProcess() ){
                        if( _p._model.formBeforeProcess().call( _p._selector, _evt, _p ) === false ){
                            _p._model.prevent( _evt );
                        }
                    }

                    if( !JC.Valid.check( _sp ) ){
                        return _p._model.prevent( _evt );
                    }

                    if( _p._model.formAfterProcess() ){
                        if( _p._model.formAfterProcess().call( _p._selector, _evt, _p ) === false ){
                            _p._model.prevent( _evt );
                        }
                    }

                    if( _type == FormLogic.Model.AJAX ){
                    }

                });
            }
    };

    JC.BaseMVC.buildModel( FormLogic );

    FormLogic.Model._instanceName = 'FormLogicIns';
    FormLogic.Model.GET = 'get';
    FormLogic.Model.POST = 'post';
    FormLogic.Model.AJAX = 'ajax';
    FormLogic.Model.IFRAME = 'iframe';

    FormLogic.Model.prototype = {
        init:
            function(){
            }
        , formtype: 
            function(){ 
                var _r = this.stringProp( 'method' );
                !_r && ( _r = FormLogic.Model.GET );
                _r = this.stringProp( 'formtype' ) || _r;
                return _r;
           }

        , formBeforeProcess: function(){ return this.callbackProp( 'formBeforeProcess' ); }
        , formAfterProcess: function(){ return this.callbackProp( 'formAfterProcess' ); }

        , prevent: function( _evt ){ _evt.preventDefault(); return false; }
    };

    JC.BaseMVC.build( FormLogic, 'Bizs' );

    $(document).ready( function(){
        setTimeout( function(){
            FormLogic.autoInit && FormLogic.process( $(document) );
        }, 1 );
    });

}(jQuery));
