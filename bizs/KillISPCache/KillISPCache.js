/**
 * 应用场景
 * <br /><b>ISP 缓存问题 引起的用户串号</b>
 
 * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
 * | <a href='http://jc.openjavascript.org/docs_api/classes/window.Bizs.KillISPCache.html' target='_blank'>API docs</a>
 * | <a href='../../bizs/KillISPCache/_demo' target='_blank'>demo link</a></p>
 *
 * <h2>页面只要引用本文件, 默认会自动初始化 KillISPCache 逻辑</h2>
 * <dl>
 *      <dt>影响到的地方: </dt>
 *      <dd>每个 a node 会添加 isp 参数/dd>
 *      <dd>每个 form node 会添加 isp 参数</dd>
 *      <dd>每个 ajax get 请求会添加 isp 参数</dd>
 * </dl>
 *
 * @namespace       window.Bizs
 * @class           KillISPCache
 * @extends         JC.BaseMVC
 * @constructor 
 * @author  qiushaowei  .1  2013-09-07
 */
;(function($){
    window.Bizs.KillISPCache = KillISPCache;

    function KillISPCache( _selector ){
        if( KillISPCache._instance ) return KillISPCache._instance;

        this._model = new KillISPCache.Model( _selector );

        this._init();
    }

    KillISPCache.prototype = {
        _beforeInit:
            function(){
                JC.log( 'KillISPCache._beforeInit', new Date().getTime() );
                this._model.processAjax();
            }
        , process:
            function( _selector, _ignoreSameLinkText ){
                _selector && ( _selector = $( _selector ) );
                if( !( _selector && _selector.length ) ) return;
                var _p = this;
                _p._model.ignoreSameLinkText( _ignoreSameLinkText );
                _p._model.selector( _selector );
                _p._model.processLink();
                _p._model.processForm();
                return this;
            }
    };
    /**
     * 获取 KillISPCache 实例 ( 单例模式 )
     * @method getInstance
     * @param   {selector}      _selector
     * @static
     * @return  {KillISPCacheInstance}
     */
    KillISPCache.getInstance = 
        function(){
            !KillISPCache._instance && ( KillISPCache._instance = new KillISPCache() );
            return KillISPCache._instance;
        }
    /**
     * 是否忽略 url 跟 文本 相同的节点
     * @property    ignoreSameLinkText
     * @type        bool
     * @default     true
     * @static
     */
    KillISPCache.ignoreSameLinkText = true;

    KillISPCache.Model =
        function( _selector ){
            this._selector = _selector;
        };

    KillISPCache.Model.prototype = {
        init:
            function(){
                this._postfix = printf( '{0}_{1}'
                                        , new Date().getTime().toString()
                                        , Math.round( Math.random() * 10000000 )
                                    );
                this._ignoreSameLinkText = true;
            }
        , processLink:
            function(){
                var _p = this;
                this.selector().find('a[href]').each(function(){
                    var _sp = $(this), _url = (_sp.attr('href')||'').trim(), _text = _sp.html().trim();
                    if( /javascript\:/.test( _url ) || /^[\s]*\#/.test( _url ) ) return;
                    
                    if( _p.ignoreSameLinkText && _url.trim() == _sp.html().trim() ) return;

                    _url = addUrlParams( _url, { 'isp': _p.postfix() } );
                    _sp.attr( 'href', _url );
                    _sp.html( _text );
                });

            }
        , processForm:
            function(){
            }
        , processAjax:
            function(){
            }
        , ignoreSameLinkText:
            function( _setter ){
                typeof _setter != 'undefined' && ( KillISPCache.ignoreSameLinkText = _setter );
                return KillISPCache.ignoreSameLinkText;
            }
        , postfix: function(){ return this._postfix; }
    };

    JC.BaseMVC.power( KillISPCache );

    $(document).ready( function(){
        setTimeout( function(){
            KillISPCache.autoInit 
                && KillISPCache.getInstance().process( $(document) );
        }, 1 );
    });

    /**
     * 对链接添加 随机参数, 防止 ISP 缓存
     */
    function killISPCache( _selector, _ignoreSameLinkText ){
        var _tm = new Date().getTime().toString() + '_' + Math.round( Math.random() * 10000000 );

        _selector = _selector || $(document.body);
        typeof _ignoreSameLinkText == 'undefined' && ( _ignoreSameLinkText = true );

        _selector.find('form').each(function(){
            _p = $( this );
            if( !_p.find('input[name=isp]').length ){
                $( '<input type="hidden" name="isp" value="'+_tm+'" >' ).appendTo( _p );
            }
        });
    }

}(jQuery));
