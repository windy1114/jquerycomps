;(function($){
    !window.JC && (window.JC = { log:function(){} });
    window.ZINDEX_COUNT = window.ZINDEX_COUNT || 50001;

    window.Suggest = JC.Suggest = Suggest;
    /**
     * Suggest 模板类
     * <br />要新建一个组件时, 直接 copy Suggest 组件改一下命名就可以开始编码了
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
        this._model = new Model( _selector );
        this._view = new View( this._model );

        this._init();
    }
    
    Control.prototype = {
        _init:
            function(){
                
                return this;
            }    
    }
    
    function Model( _selector ){
        this._selector = _selector;
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                return this;
            }
    };
    
    function View( _model ){
        this._model = _model;

        this._init();
    }
    
    View.prototype = {
        _init:
            function() {
                return this;
            }
        
    };

}(jQuery));
