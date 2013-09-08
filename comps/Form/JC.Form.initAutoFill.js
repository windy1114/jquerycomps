 ;(function($){
    /**
     * 表单自动填充 URL GET 参数
     * <br />只要引用本脚本, DOM 加载完毕后, 页面上所有带 class js_autoFillUrlForm 的 form 都会自动初始化默认值
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
     * | <a href='http://jc.openjavascript.org/docs/docs_api/classes/JC.Form.html' target='_blank'>API docs</a>
     * @method  initAutoFill
     * @static
     * @for JC.Form
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 75 team
     * @date    2013-06-13
     * @param   {selector|url string}   _selector   显示指定要初始化的区域, 默认为 document
     * @param   {string}                _url        显示指定, 取初始化值的 URL, 默认为 location.href
     * @example
     *      JC.Form.initAutoFill( myCustomSelector, myUrl );
     */
     JC.Form.initAutoFill =
        function( _selector, _url ){
            if( !(_selector && _selector.length ) ) _selector = $(document);
            _url = _url || location.href;

            JC.log( 'JC.Form.initAutoFill' );

            if( _selector.prop( 'nodeName' ).toLowerCase() == 'form' ){
                fillForm( _selector, _url );
            }else{
                _selector.find('form.js_autoFillUrlForm').each( function(){
                    fillForm( this, _url );
                });
            }

        };

    function fillForm( _selector, _url ){
        _selector = $(_selector);
        
        _selector.find( 'input[type=text][name],input[type=password][name],textarea[name]' ).each( function(){
            var _sp = $(this);
            if( hasUrlParam( _url, _sp.attr('name') ) ){
                _sp.val( decode( getUrlParam( _url, _sp.attr('name') ).replace(/[\+]/g, ' ' ) ) );
            }
        });

        _selector.find( 'select[name]' ).each( function(){
            var _sp = $(this), _uval = decode( getUrlParam( _url, _sp.attr('name') ).replace(/[\+]/g, ' ' ) ) ;
            if( hasUrlParam( _url, _sp.attr('name') ) ){
                if( selectHasVal( _sp, _uval ) ){
                    _sp.val( getUrlParam( _url, _sp.attr('name') ) );
                }else{
                    _sp.attr( 'selectvalue', _uval );
                }
            }
        });
    }
    /**
     * 自定义 URI decode 函数
     * @property    initAutoFill.decodeFunc
     * @static
     * @for JC.Form
     * @type    function
     * @default null
     */
    JC.Form.initAutoFill.decodeFunc;

    function decode( _val ){
        try{
            _val = (JC.Form.initAutoFill.decodeFunc || decodeURIComponent)( _val );
        }catch(ex){}
        return _val;
    }
    /**
     * 判断下拉框的option里是否有给定的值
     * @method  initAutoFill.selectHasVal
     * @private
     * @static
     * @param   {selector}  _select
     * @param   {string}    _val    要查找的值
     */
    function selectHasVal( _select, _val ){
        var _r = false, _val = _val.toString();
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( _tmp.val() == _val ){
                _r = true;
                return false;
            }
        });
        return _r;
    }

    $(document).ready( function( _evt ){ JC.Form.initAutoFill(); });

}(jQuery));

