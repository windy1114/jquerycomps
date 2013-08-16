//TODO: 错误提示 不占用页面宽高, 使用 position = absolute,  date = 2013-08-03
//TODO: 错误时, 添加 class iserror 
//TODO: 添加 validmsg, 正确时的提示, class = isvalid 
;(function($){
    !window.JC && (window.JC = { log:function(){} });
    /**
     * 表单验证
     * <br />全局访问请使用 JC.Valid 或 Valid
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/openjavascript/jquerycomps' target='_blank'>JC Project Site</a>
     * | <a href='http://jc.openjavascript.org/docs_api/classes/JC.Valid.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Valid/_demo/' target='_blank'>demo link</a></p>
     * <h2>Form 的可用 html attribute</h2>
     * <dl>
     *  <dt>errorabort = bool</dt>
     *  <dd>查检Form Control时, 如果发生错误是否继续检查下一个</dd>
     *  <dd>default = true</dd>
     * </dl>
     * <h2>Form Control的可用 html attribute</h2>
     * <dl>
     *      <dt>reqmsg = 错误提示</dt>
     *      <dd>值不能为空</dd>
     *
     *      <dt>errmsg = 错误提示</dt>
     *      <dd>格式错误, 但不验证为空的值</dd>
     *
     *      <dt>focusmsg = 控件获得焦点的提示信息</dt>
     *      <dd>
     *          这个只作提示用
     *          <br />如果 control 的内容是正确的 class=focusmsg isvalid
     *          <br />如果 control 的内容是错误的 class=focusmsg iserror
     *      </dd>
     *
     *      <dt>emel = selector</dt>
     *      <dd>显示错误的selector</dd>
     *
     *      <dt>ignoreprocess = bool</dt>
     *      <dd>验证表单时, 是否忽略</dd>
     *      <dd>default = false</dd>
     *
     *      <dt>minlength = int(最小长度)</dt>
     *      <dd>验证内容的最小长度, 但不验证为空的值</dd>
     *
     *      <dt>maxlength = int(最大长度)</dt>
     *      <dd>验证内容的最大长度, 但不验证为空的值</dd>
     *
     *      <dt>minvalue = [number|ISO date](最小值)</dt>
     *      <dd>验证内容的最小值, 但不验证为空的值</dd>
     *
     *      <dt>maxvalue = [number|ISO date](最大值)</dt>
     *      <dd>验证内容的最大值, 但不验证为空的值</dd>
     *
     *      <dt>datatype: 常用数据类型</dt>
     *      <dd><b>n:</b> 检查是否为正确的数字</dd>
     *      <dd><b>n-i.f:</b> 检查数字格式是否附件要求, i[整数位数], f[浮点数位数], n-7.2 = 0.00 ~ 9999999.99</dd>
     *      <dd>
     *          <b>nrange:</b> 检查两个control的数值范围
     *          <dl>
     *              <dd>html attr <b>fromNEl:</b> 指定开始的 control</dd>
     *              <dd>html attr <b>toNEl:</b> 指定结束的 control</dd>
     *              <dd>如果不指定 fromNEl, toNEl, 默认是从父节点下面找到 nrange, 按顺序定为 fromNEl, toNEl</dd>
     *          </dl>
     *      </dd>
     *      <dd><b>d:</b> 检查是否为正确的日期, YYYYMMDD, YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD</dd>
     *      <dd>
     *          <b>daterange:</b> 检查两个control的日期范围
     *          <dl>
     *              <dd>html attr <b>fromNEl:</b> 指定开始的 control</dd>
     *              <dd>html attr <b>toNEl:</b> 指定结束的 control</dd>
     *              <dd>如果不指定 fromNEl, toNEl, 默认是从父节点下面找到 nrange, 按顺序定为 fromNEl, toNEl</dd>
     *          </dl>
     *      </dd>
     *      <dd><b>time:</b> 是否为正确的时间, hh:mm:ss</dd>
     *      <dd><b>minute:</b> 是否为正确的时间, hh:mm</dd>
     *      <dd>
     *          <b>bankcard:</b> 是否为正确的银行卡
     *          <br />  格式为 d{19} | d{16} | 1111 1111 1111 1111 111 | 1111 1111 1111 1111111
     *      </dd>
     *      <dd>
     *          <b>cnname:</b> 中文姓名
     *          <br>格式: 汉字和大小写字母
     *          <br>规则: 长度 2-32个字节, 非 ASCII 算2个字节
     *      </dd>
     *      <dd>
     *          <b>username:</b> 注册用户名
     *          <br>格式: a-zA-Z0-9_-
     *          <br>规则: 首字母必须为 [a-zA-Z0-9], 长度 2 - 30
     *      </dd>
     *      <dd><b>idnumber:</b> 身份证号码, 15~18 位</dd>
     *      <dd><b>mobilecode:</b> 手机号码, 11位, (13|14|15|16|18|19)[\d]{9}</dd>
     *      <dd><b>mobile:</b> mobilecode 的别名</dd>
     *      <dd><b>mobilezonecode:</b> 带 国家代码的手机号码, [+国家代码] [零]11位数字</dd>
     *      <dd><b>phonecode:</b> 电话号码, 7~8 位数字, [1-9][0-9]{6,7}</dd>
     *      <dd><b>phone:</b> 带区号的电话号码, [区号][空格|空白|-]7~8位电话号码</dd>
     *      <dd><b>phoneall:</b> 带国家代码, 区号, 分机号的电话号码, [+国家代码][区号][空格|空白|-]7~8位电话号码#1~6位</dd>
     *      <dd><b>phonezone:</b> 电话区号, 3~4位数字</dd>
     *      <dd><b>phoneext:</b> 电话分机号, 1~6位数字</dd>
     *      <dd><b>mobilephone:</b> mobilecode | phone</dd>
     *      <dd><b>mobilephoneall:</b> mobilezonecode | phoneall</dd>
     *      <dd><b>reg:</b> 自定义正则校验, /正则规则/[igm]</dd>
     *      <dd>
     *          <b>vcode:</b> 验证码, 0-9a-zA-Z, 长度 默认为4
     *          <br />可通过 vcode-[\d], 指定验证码长度
     *      </dd>
     *      <dd>
     *          <b>text:</b> 显示声明检查的内容为文本类型
     *          <br />默认就是 text, 没有特殊原因其实不用显示声明
     *      </dd>
     *      <dd>
     *          <b>bytetext:</b> 声明按字节检查文本长度
     *          <br /> ASCII 算一个字符, 非 ASCII 算两个字符
     *      </dd>
     *      <dd><b>url:</b> URL 格式, ftp, http, https</dd>
     *      <dd><b>domain:</b> 匹配域名, 宽松模式, 允许匹配 http(s), 且结尾允许匹配反斜扛(/)</dd>
     *      <dd><b>stricdomain:</b> 匹配域名, 严格模式, 不允许匹配 http(s), 且结尾不允许匹配反斜扛(/)</dd>
     *      <dd><b>email:</b> 电子邮件</dd>
     *      <dd><b>zipcode:</b> 邮政编码, 0~6位数字</dd>
     *
     *      <dt>subdatatype: 特殊数据类型</dt>
     *      <dd>
     *          <dl>
     *              <dt>alternative: N 个 Control 必须至少有一个非空的值</dt>
     *              <dd><b>datatarget:</b> 显式指定同一组 control, 默认在父级下查找[subdatatype=alternative]</dd>
     *              <dd><b>alternativemsg:</b> N 选一的错误提示</dd>
     *          </dl>
     *      </dd>
     *      <dd>
     *          <dl>
     *              <dt>reconfirm: N 个 Control 的值必须保持一致</dt>
     *              <dd><b>datatarget:</b> 显式指定同一组 control, 默认在父级下查找[subdatatype=reconfirm]</dd>
     *              <dd><b>reconfirmmsg:</b> 值不一致时的错误提示</dd>
     *          </dl>
     *      </dd>
     * </dl>
     * @namespace JC
     * @class Valid
     * @static
     * @version dev 0.2
     * @author  qiushaowei   <suches@btbtd.org> | 75 team
     * @date    2013-08-15(函数模式改单例模式), 2013-05-22
     */
    JC.Valid = window.Valid = Valid;
    
    function Valid(){

        if( Valid._instance ) return Valid._instance;
        Valid._instance = this;

        this._model = new Model();
        this._view = new View( this._model );

        this._init();
    }
    
    Valid.prototype = {
        _init:
            function(){
                var _p = this;
                $( [ this._view, this._model ] ).on('BindEvent', function( _evt, _evtName, _cb ){
                    _p.on( _evtName, _cb );
                });

                $([ this._view, this._model ] ).on('TriggerEvent', function( _evt, _evtName ){
                    var _data = sliceArgs( arguments ); _data.shift(); _data.shift();
                    _p.trigger( _evtName, _data );
                });

                _p.on( 'SetValid', function( _evt ){
                    var _data = sliceArgs( arguments ); _data.shift();
                    _p._view.valid.apply( _p._view, _data );
                });

                _p.on( 'SetError', function( _evt ){
                    var _data = sliceArgs( arguments ); _data.shift();
                    _p._view.error.apply( _p._view, _data );
                });

                _p.on( 'FocusMsg', function( _evt ){
                    var _data = sliceArgs( arguments ); _data.shift();
                    _p._view.focusmsg.apply( _p._view, _data );
                });

                this._view.init();

                return this;
            }    
        /**
         * 使用 jquery on 绑定事件
         * @method  {string}    on
         * @param   {string}    _evtName
         * @param   {function}  _cb
         * @return  ValidInstance
         * @private
         */
        , on: function( _evtName, _cb ){ $(this).on(_evtName, _cb ); return this;}
        /**
         * 使用 jquery trigger 绑定事件
         * @method  {string}    trigger
         * @param   {string}    _evtName
         * @return  ValidInstance
         * @private
         */
        , trigger: function( _evtName, _data ){ $(this).trigger( _evtName, _data ); return this;}
        /**
         * 分析_item是否附合规则要求
         * @method  parse
         * @param   {selector}  _item 
         * @private
         */
        , parse: 
            function(){
                var _p = this, _r = true, _items = sliceArgs( arguments );

                $.each( _items, function( _ix, _item ){
                    _item = $( _item );
                    _item.each( function(){
                        var _sitem = $(this);
                        if( !_p._model.isAvalible( _sitem ) ) return;
                        if( !_p._model.isValid( _sitem ) ) return;

                        var _dt = _p._model.parseDatatype( _sitem )
                            , _subdt = _p._model.parseSubdatatype( _sitem )
                            , _nm = _sitem.prop('nodeName').toLowerCase();

                        JC.log( 'datatype:', _dt, _subdt );
                        //TODO: 这里需要更详细的判断, control, form, Valid.autoTrim
                        switch( _nm ){
                            case 'input':
                            case 'textarea':
                                {
                                    Valid.autoTrim && ( _sitem.val( $.trim( _sitem.val() ) ) );
                                    _sitem.val( $.trim( _sitem.val()||'' ) );
                                    break;
                                }
                        }

                        if( !_p._model.reqmsg( _sitem ) ){
                            _r = false;
                            return;
                        }

                        if( !_p._model.lengthValid( _sitem ) ){
                            _r = false;
                            return;
                        }

                        if( _dt && _p._model[ _dt ] && _sitem.val() ){
                            if( !_p._model[ _dt ]( _sitem ) ){
                                _r = false;
                                return;
                            }
                        }
                        
                        if( _subdt && _p._model[ _subdt ] && ( _sitem.val() || _subdt == 'alternative' ) ){
                            if( !_p._model[ _subdt ]( _sitem ) ){
                                _r = false;
                                return;
                            }
                        }

                        //_p._view.valid( _sitem );
                        _p.trigger( 'SetValid', _sitem ); 
                    });
                });
                return _r;
            }

        , check:
            function(){
                var _p = this, _r = true, _items = sliceArgs( arguments ), i, j;
                $.each( _items, function( _ix, _item ){
                    _item = $(_item);
                    if( _p._model.isForm( _item ) ){
                        var _errorabort = _p._model.isErrorAbort( _item ), tmp;
                        for( i = 0, j = _item[0].length; i < j; i++ ){
                            if( _p._model.isIgnoreProcess( $(_item[0][i]) ) ) continue;
                            !_p.parse( $(_item[0][i]) ) && ( _r = false );
                            if( _errorabort && !_r ) break;
                        }
                    } else _r = _p.parse( _item );
                });
                return _r;
            }
        , clearError:
            function(){
                var _items = sliceArgs( arguments ), _p = this;
                $.each( _items, function( _ix, _item ){
                    $( _item ).each( function(){
                        var _item = $(this);
                        switch( _item.prop('nodeName').toLowerCase() ){
                            case 'form': 
                                {
                                    for( var i = 0, j = _item[0].length; i < j; i++ ){
                                        var tmp = $(_item[0][i]);
                                        Valid.setValid( tmp, 1 );
                                    }
                                    break;
                                }
                            default: Valid.setValid( _item, 1 ); break;
                        }
                    });

                });
                return this;
            }
        , isValid:
            function( _selector ){
                return this._model.isValid( _selector );
            }
        , formHasValue:
            function( _fm, _ignoreSelector ){
               var _r = false, _item, _nt;
                _fm && ( _fm = $( _fm ) );

                if( _fm && _fm.length ){
                    for( var i = 0, j = _fm[0].length; i < j; i++ ){
                        _item = $(_fm[0][i]);
                        if( _item.is('[disabled]') ) return;
                        _nt = _item.prop('nodeName').toLowerCase();

                        if( _ignoreSelector ){
                            if( _item.is( _ignoreSelector ) ) continue;
                        }
                                        
                        switch( _item.prop('type').toLowerCase() ){

                            case 'select-multiple':
                            case 'select-one':
                            case 'select':
                            case 'file': 
                            case 'textarea':
                            case 'password':
                            case 'hidden':
                            case 'text': 
                                {
                                    if( $.trim( _item.val() ).length ) return true;
                                    break;
                                }

                           case 'checkbox':
                            case 'radio':
                                {
                                    if( _item.prop('checked') ) return true;
                                    break;
                                }
                        }
                    }
                }
                return _r;
            }
    }

    /**
     * 验证一个表单项, 如 文本框, 下拉框, 复选框, 单选框, 文本域, 隐藏域
     * @method check
     * @static
     * @param      {selector}    _item 需要验证规则正确与否的表单/表单项( <b>可同时传递多个_item</b> )
     * @example 
     *          JC.Valid.check( $( selector ) );
     *          JC.Valid.check( $( selector ), $( anotherSelector );
     *          JC.Valid.check( document.getElementById( item ) );
     *
     *          if( !JC.Valid.check( $('form') ) ){
     *              _evt.preventDefault();
     *              return false;
     *          }
     * @return    {boolean}
     */
    Valid.checkAll = Valid.check = 
        function(){ return Valid.getInstance().check.apply( Valid.getInstance(), sliceArgs( arguments ) ); }
    /**
     * 这个方法是 <a href='JC.Valid.html#method_check'>Valid.check</a> 的别名
     * @method checkAll
     * @static
     * @param      {selector}    _item -   需要验证规则正确与否的表单/表单项
     * @see Valid.check
     */
    /**
     * 获取 Valid 的实例 ( <b>Valid 是单例模式</b> )
     * @method getInstance
     * @param   {selector}      _selector
     * @static
     * @return  {Valid instance}
     */
    Valid.getInstance = function(){ !Valid._instance && new Valid(); return Valid._instance; };
    /**
     * 判断 selector 是否 Valid 的处理对象
     * @method  isValid
     * @param   {selector}      _selector
     * @return  bool
     * @static
     */
    Valid.isValid = function( _selector ){ return Valid.getInstance().isValid( _selector ); };
    /**
     * 把一个表单项的状态设为正确状态
     * @method  setValid
     * @param   {selector}  _item
     * @param   {int}       _tm     延时 _tm 毫秒显示处理结果, 默认=150
     * @static
     */
    Valid.setValid = 
        function(_item, _tm){ 
            return Valid.getInstance().trigger( 'SetValid', sliceArgs( arguments) ); 
        }
    /**
     * 把一个表单项的状态设为错误状态
     * @method  setError
     * @param   {selector}  _item
     * @param   {string}    _msgAttr    - 显示指定需要读取的错误信息属性名, 默认为 reqmsg, errmsg, 通过该属性可以指定别的属性名
     * @param   {bool}      _fullMsg    - 显示指定错误信息为属性的值, 而不是自动添加的 请上传/选择/填写
     * @static
     */
    Valid.setError = 
        function(_item, _msgAttr, _fullMsg){ 
            return Valid.getInstance().trigger( 'SetError', sliceArgs( arguments) );
        }

    /**
     * 显示 focusmsg 属性的提示信息( 如果有的话 )
     * @method  focusmsg
     * @param   {selector}  _item
     * @param   {bool}      _setHide
     * @static
     */
    Valid.focusmsg =
        function( _item, _setHide ){
            return Valid.getInstance().trigger( 'FocusMsg', sliceArgs( arguments ) );
        }
     /**
     * 清除Valid生成的错误样式
     * @method clearError
     * @static
     * @param   {form|input|textarea|select|file|password}  _selector -     需要清除错误的选择器
     * @example
     *          JC.Valid.clearError( 'form' );
     *          JC.Valid.clearError( 'input.some' );
     */
    Valid.clearError = 
        function(){ return Valid.getInstance().clearError.apply( Valid.getInstance(), sliceArgs( arguments ) ); }
    /**
     * 验证发生错误时, 是否终止继续验证
     * <br /> 为真终止继续验证, 为假将验证表单的所有项, 默认为 false
     * @property    errorAbort
     * @type        bool
     * @default     false
     * @static
     * @example
            $(document).ready( function($evt){
                JC.Valid.errorAbort = true;
            });
     */
    Valid.errorAbort = false;
    /**
     * 是否自动清除两边的空格
     * @property    autoTrim
     * @type        bool
     * @default     true
     * @static
     * @example
            $(document).ready( function($evt){
                JC.Valid.autoTrim = false;
            });
     */
    Valid.autoTrim = true;
    /**
     * 检查一个表单是否有内容
     * @method  formHasValue
     * @param   {selector}      _fm
     * @param   {selector}      _ignoreSelector
     * @return  bool
     * @static
     * @example
             $('form.js-valid').on('submit', function( $evt ){
                var _p = $(this);

                if( !JC.Valid.formHasValue( _p ) ){
                    $evt.preventDefault();
                    JC.alert( '表单内容为空, 不能提交!', _p.find('button[type=submit]'), 1 );
                    return false;
                }

                if( !JC.Valid.check( _p ) ){
                    $evt.preventDefault();
                    return false;
                }
            });
     */
    Valid.formHasValue =
        function(){ return Valid.getInstance().formHasValue.apply( Valid.getInstance(), sliceArgs( arguments ) ); }
    
    function Model(){
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                return this;
            }
        /**
         * 获取 _item 的检查类型
         * @method  parseDatatype
         * @private
         * @static
         * @param   {selector}  _item
         */
        , parseDatatype: 
            function( _item ){
                return ( _item.attr('datatype') || 'text').toLowerCase().replace(/\-.*/, '');
            }
       /**
         * 获取 _item 的检查子类型, 所有可用的检查子类型位于 _logic.subdatatype 对象
         * @method  parseSubdatatype
         * @private
         * @static
         * @param   {selector}  _item
         */
        , parseSubdatatype: 
            function( _item ){
                return ( _item.attr('subdatatype') || '').toLowerCase().replace(/\-.*/, '');
            }
        , isAvalible: 
            function( _item ){
                return _item.is(':visible') && !_item.is('[disabled]');
            }
        , isForm:
            function( _item ){
                var _r;
                _item.prop('nodeName') 
                    && _item.prop('nodeName').toLowerCase() == 'form'
                    && ( _r = true )
                    ;
                return _r;
            }
        , isErrorAbort:
            function( _item ){
                var _r = Valid.errorAbort;
                _item.is('[errorabort]') && ( _r = parseBool( _item.attr('errorabort') ) );
                return _r;
            }
        , isIgnoreProcess:
            function( _item ){
                return _item.is('[ignoreprocess]');
            }
        , isValid:
            function( _item ){
                _item = $(_item);
                var _r, _tmp;
                _item.each( function(){
                    _tmp = $(this);
                    if( _tmp.is( '[datatype]' ) || _tmp.is( '[subdatatype]' ) 
                        || _tmp.is( '[minlength]' ) || _tmp.is( '[maxlength]' )  
                        || _tmp.is( '[reqmsg]' ) 
                        || _tmp.is( 'form' ) 
                    ) 
                        _r = true;
                });
                return _r;
            }
        /**
         * 检查内容的长度
         * @method  lengthValid
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {string}    datatype        数字类型 text|bytetext|richtext
         *
         * @attr    {integer}   minlength       内容最小长度
         * @attr    {integer}   maxlength       内容最大长度
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_name" minlength="2" maxlength="120" reqmsg="公司名称" errmsg="请检查格式,长度2-120" /> <em>公司名称描述</em>
                </div>
         */
        , lengthValid: 
            function( _item ){
                var _p = this, _r = true
                    , _dt = _p.parseDatatype( _item )
                    , _min, _max, _val = $.trim( _item.val() ), _len
                    ;
                if( !_val ) return _r;

                if( _item.is( '[minlength]' ) ){
                    JC.log( 'minlength' );
                    _min = parseInt( _item.attr( 'minlength' ), 10 ) || 0;
                }
                
                if( _item.is( '[maxlength]' ) ){
                    JC.log( 'maxlength' );
                    _max = parseInt( _item.attr( 'maxlength' ), 10 ) || 0;
                }
                /**
                 * 根据特殊的 datatype 实现不同的计算方法
                 */
                switch( _dt ){
                    case 'bytetext':
                        {
                            _len = _p.bytelen( _val );
                            break;
                        }
                    case 'richtext':
                    default:
                        {
                            _len = _val.length;
                            break;
                        }
                }

                _min && ( _len < _min ) && ( _r = false );
                _max && ( _len > _max ) && ( _r = false );

                JC.log( 'lengthValid: ', _min, _max, _r );

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );

                return _r;
            }

        /**
         * 检查内容是否为空,
         * <br>如果声明了该属性, 那么 value 须不为空
         * @method  reqmsg
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_name" reqmsg="公司名称" /> <em>公司名称描述</em>
                </div>
         */
        , reqmsg: 
            function( _item ){
                if( !_item.is('[reqmsg]') ) return true;

                var _r, _p = this;
                if( _item.val() && _item.val().constructor == Array ){
                    _r = !!( $.trim( _item.val().join('') + '' ) );
                }else{
                    _r = !!$.trim( _item.val() ||'') ;
                }

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item, 'reqmsg' ] );
                JC.log( 'regmsgValid: ' + _r );
                return _r;
            }
        /**
         * 检查是否为正确的数字<br />
         * <br>默认范围 0 - Math.pow(10, 10)
         * @method  n
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {require}               datatype    - n | n-整数位数.小数位数
         * @attr    {integer|optional}      minvalue    - 数值的下限
         * @attr    {integer|optional}      maxvalue    - 数值的上限
         *
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_n" errmsg="请填写正确的正整数" datatype="n" >
                </div>
                <div class="f-l">
                    <input type="TEXT" name="company_n1" errmsg="请填写正确的数字, 范围1-100" datatype="n" minvalue="1", maxvalue="100" >
                </div>
                <div class="f-l">
                    <input type="TEXT" name="company_n2" errmsg="请填写正确的数字" datatype="n-7.2" >
                </div>
         *
         */
        , n: 
            function( _item ){
                var _p = this, _r = true
                    , _valStr = _item.val()
                    , _val = +_valStr
                    ,_min = 0
                    , _max = Math.pow( 10, 10 )
                    , _n, _f, _tmp;

                if( _item.is('[minvalue]') ){
                    if( /\./.test( _item.attr('minvalue') ) ){
                        _tmp = parseFloat( _item.attr('minvalue') );
                    }else{
                        _tmp = parseInt( _item.attr('minvalue') );
                    }
                    if( !isNaN( _tmp ) ){
                        _min += _tmp;
                    }
                }

                if( !isNaN( _val ) && _val >= _min ){
                    _item.attr('datatype').replace( /^n[^\-]*\-(.*)$/, function( $0, $1 ){
                        _tmp = $1.split('.');
                        _n = _tmp[0];
                        _f = _tmp[1];
                    });
                    if( _item.is('[maxvalue]') ) _max = +_item.attr('maxvalue') || _max;

                    if( _val >= _min && _val <= _max ){
                        typeof _n != 'undefined' && typeof _f != 'undefined' && ( _r = new RegExp( '^(?:\-|)(?:[\\d]{0,'+_n+'}|)(?:\\.[\\d]{1,'+_f+'}|)$' ).test( _valStr ) );
                        typeof _n != 'undefined' && typeof _f == 'undefined' && ( _r = new RegExp( '^(?:\-|)[\\d]{1,'+_n+'}$' ).test( _valStr ) );
                        typeof _n == 'undefined' && typeof _f != 'undefined' && ( _r = new RegExp( '^(?:\-|)\\.[\\d]{1,'+_f+'}$' ).test( _valStr ) );
                        typeof _f == 'undefined' && /\./.test( _valStr ) && ( _r = false );
                    } else _r = false;

                    JC.log( 'nValid', _val, typeof _n, typeof _f, typeof _min, typeof _max, _min, _max );
                }else _r = false;

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );

                return _r;
            }
        /**
         * 检查两个输入框的数值
         * <br /> 数字格式为 0-pow(10,10)
         * <br /> 带小数点使用 nrange-int.float, 例: nrange-1.2  nrange-2.2
         * <br /> <b>注意:</b> 如果不显示指定 fromNEl, toNEl, 
         *              将会从父级查找 datatype=nrange属性的input, 如果数量等于2, 则会进行验证, 不等2将忽略
         * @method  nrange
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {require}               datatype    - nrange
         * @attr    {selector|optional}     fromNEl     - 起始数值选择器
         * @attr    {selector|optional}     toNEl       - 结束数值选择器
         * @attr    {date string|optional}  minvalue    - 数值的下限
         * @attr    {date string|optional}  maxvalue    - 数值的上限
         * @example
            <div class="f-l label">
                <label>(datatype nrange)正数:<br/><b style="color:red">注意: 这个是大小颠倒位置的nrange</b></label>
                大<input type="text" name="company_n10" id="company_n10" fromNEl="company_n11"
                    errmsg="请填写正确的数值范围" datatype="nrange" emEl="nrange_n1011" >
                - 小<input type="text" name="company_n11" id="company_n11" toNEl="company_n10"
                    errmsg="请填写正确的数值范围" datatype="nrange" emEl="nrange_n1011" >
                <em id="nrange_n1011"></em>
            </div>
         */
        , nrange:
            function( _item ){
                var _p = this, _r = _p.n( _item ), _min, _max;

                if( _r ){
                    var _fromNEl, _toNEl;
                    if( _item.is( '[fromNEl]' ) ) _fromNEl = _p.getElement( _item.attr('fromNEl') );
                    if( _item.is( '[toNEl]' ) ) _toNEl = _p.getElement( _item.attr('toNEl') );

                    if( !(_fromNEl && _fromNEl.length || _toNEl && _toNEl.length) ){
                        var _pnt = _item.parent(), _items = [];
                            _pnt.find('input[datatype]').each( function(){
                                var _sp = $(this);
                                /nrange/i.test( _sp.attr('datatype') ) && _items.push( this );
                            });
                            JC.log( 'ccc', _items.length );
                            if( _items.length === 2 ){
                                _fromNEl = $(_items[0]);
                                _toNEl = $(_items[1]);
                            }
                    }
                    if( _fromNEl && _fromNEl.length || _toNEl && _toNEl.length ){

                        _fromNEl && _fromNEl.length && !( _toNEl && _toNEl.length ) && ( _toNEl = _item );
                        !(_fromNEl && _fromNEl.length) && _toNEl && _toNEl.length && ( _fromNEl = _item );

                        JC.log( 'nrange', _fromNEl.length, _toNEl.length );

                        _toNEl.val( $.trim( _toNEl.val() ) );
                        _fromNEl.val( $.trim( _fromNEl.val() ) );
                        
                        if( _toNEl[0] != _fromNEl[0] && _toNEl.val().length && _fromNEl.val().length ){

                            _r && ( _r = _p.n( _toNEl ) );
                            _r && ( _r = _p.n( _fromNEl ) );

                            _r && ( +_fromNEl.val() ) > ( +_toNEl.val() ) && ( _r = false );
                            
                            JC.log( +_fromNEl.val(), +_toNEl.val(), _r );

                            _r && $(_p).trigger( 'TriggerEvent', [ 'SetValid', _fromNEl ] );
                            _r && $(_p).trigger( 'TriggerEvent', [ 'SetValid', _toNEl ] );

                            if( _r ){ _fromNEl.removeClass('error'); _toNEl.removeClass('error'); }
                            else{ _fromNEl.addClass('error'); _toNEl.addClass('error'); }
                        }
                    }
                }

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );

                return _r;
            }
        /**
         * 检查是否为合法的日期,
         * <br />日期格式为 YYYYMMDD, YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD
         * @method  d
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {require}               datatype    - d
         * @attr    {date string|optional}  minvalue    - 日期的下限
         * @attr    {date string|optional}  maxvalue    - 日期的上限
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_d" errmsg="请填写正确的日期范围2013-05-01 - 2013-05-31" datatype="daterange" minvalue="2013-05-01" maxvalue="2013-05-31" >
                </div>
         */
        , d: 
            function( _item ){
                var _p = this, _val = $.trim( _item.val() ), _r, _re = /^[\d]{4}([\/.-]|)[01][\d]\1[0-3][\d]$/;
                if( !_val ) return true;
                    
                if( _r = _re.test( _val ) ){
                    var _utime = _p.getTimestamp( _item.val() ), _minTime, _maxTime;

                    if( _item.is('[minvalue]') && ( _r = _re.test( _item.attr('minvalue') ) ) ){
                        _minTime = _p.getTimestamp( _item.attr('minvalue') );
                        _utime < _minTime && ( _r = false );
                    }

                    if( _r && _item.is('[maxvalue]') && ( _r = _re.test( _item.attr('maxvalue') ) ) ){
                        _maxTime = _p.getTimestamp( _item.attr('maxvalue') );
                        _utime > _maxTime && ( _r = false );
                    }
                }

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );

                return _r;
            }
        /**
         * 检查两个输入框的日期
         * <br />日期格式为 YYYYMMDD, YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD
         * <br /> <b>注意:</b> 如果不显示指定 fromDateEl, toDateEl, 
         *              将会从父级查找 datatype=datarange属性的input, 如果数量等于2, 则会进行验证, 不等2将忽略
         * @method  daterange
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {require}               datatype    - datarange
         * @attr    {selector|optional}     fromDateEl  - 起始日期选择器
         * @attr    {selector|optional}     toDateEl    - 结束日期选择器
         * @attr    {date string|optional}  minvalue    - 日期的下限
         * @attr    {date string|optional}  maxvalue    - 日期的上限
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_daterange" errmsg="请填写正确的日期范围,并且起始日期不能大于结束日期" id="start_date" 
                        datatype="daterange" toDateEl="end_date" emEl="date-err-em" >
                    - <input type="TEXT" name="company_daterange" errmsg="请填写正确的日期范围,并且起始日期不能大于结束日期" id="end_date" 
                        datatype="daterange" fromDateEl="start_date" emEl="date-err-em" >
                    <br /><em id="date-err-em"></em>
                </div>
         */
        , daterange:
            function( _item ){
                var _p = this, _r = _p.d( _item ), _min, _max;

                if( _r ){
                    var _fromDateEl, _toDateEl;
                    if( _item.is( '[fromDateEl]' ) ) _fromDateEl = _p.getElement( _item.attr('fromDateEl') );
                    if( _item.is( '[toDateEl]' ) ) _toDateEl = _p.getElement( _item.attr('toDateEl') );

                    if( !(_fromDateEl && _fromDateEl.length || _toDateEl && _toDateEl.length) ){
                        var _pnt = _item.parent(), _items = _pnt.find('input[datatype=daterange]');
                            if( _items.length === 2 ){
                                _fromDateEl = $(_items[0]);
                                _toDateEl = $(_items[1]);
                            }
                    }
                    if( _fromDateEl && _fromDateEl.length || _toDateEl && _toDateEl.length ){

                        _fromDateEl && _fromDateEl.length && !( _toDateEl && _toDateEl.length ) && ( _toDateEl = _item );
                        !(_fromDateEl && _fromDateEl.length) && _toDateEl && _toDateEl.length && ( _fromDateEl = _item );

                        JC.log( 'daterange', _fromDateEl.length, _toDateEl.length );

                        _toDateEl.val( $.trim( _toDateEl.val() ) );
                        _fromDateEl.val( $.trim( _fromDateEl.val() ) );
                        if( _toDateEl[0] != _fromDateEl[0] && _toDateEl.val().length && _fromDateEl.val().length ){

                            _r && ( _r = _p.d( _toDateEl ) );
                            _r && ( _r = _p.d( _fromDateEl ) );

                            _r && _p.getTimestamp( _fromDateEl.val() ) > _p.getTimestamp( _toDateEl.val() ) && ( _r = false );

                            _r && $(_p).trigger( 'TriggerEvent', [ 'SetValid', _fromDateEl ] );
                            _r && $(_p).trigger( 'TriggerEvent', [ 'SetValid', _toDateEl ] );

                            if( _r ){ _fromDateEl.removeClass('error'); _toDateEl.removeClass('error'); }
                            else{ _fromDateEl.addClass('error'); _toDateEl.addClass('error'); }
                        }
                    }
                }else{
                    //!_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                }

                return _r;
            }
        /**
         * 检查时间格式, 格式为 hh:mm:ss
         * @method  time
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_time" errmsg="正确的时间, 格式为 hh:mm:ss" datatype="time" >
                </div>
         */
        , time: 
            function( _item ){
                var _p = this, _r = /^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查时间格式, 格式为 hh:mm
         * @method  minute
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_time" errmsg="正确的时间, 格式为 hh:mm" datatype="minute" >
                </div>
         */
        , minute: 
            function( _item ){
                var _p = this, _r = /^(([0-1]\d)|(2[0-3])):[0-5]\d$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查银行卡号码
         * <br />格式为 d{19} | d{16} | 1111 1111 1111 1111 111 | 1111 1111 1111 1111111
         * @method  bankcard
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_idnumber" 
                        datatype="idnumber" errmsg="请填写正确的身份证号码">
                </div>
         */
        , bankcard:
            function( _item ){
                var _p = this
                    , _r = /^[1-9][\d]{3}(?: |)(?:[\d]{4}(?: |))(?:[\d]{4}(?: |))(?:[\d]{4})(?:(?: |)[\d]{3}|)$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查中文姓名
         * <br>格式: 汉字和大小写字母
         * <br>规则: 长度 2-32个字节, 非 ASCII 算2个字节
         * @method  cnname
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_cnname" 
                        datatype="cnname" reqmsg="姓名" errmsg="请填写正确的姓名">
                </div>
         */
        , cnname:
            function( _item ){
                var _p = this
                    , _r = _p.bytelen( _item.val() ) < 32 && /^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查注册用户名
         * <br>格式: a-zA-Z0-9_-
         * <br>规则: 首字母必须为 [a-zA-Z0-9], 长度 2 - 30
         * @method  username
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_username" 
                        datatype="username" reqmsg="用户名" errmsg="请填写正确的用户名">
                </div>
         */
        , username:
            function( _item ){
                var _p = this, _r = /^[a-zA-Z0-9][\w-]{2,30}$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查身份证号码<br />
         * 目前只使用最简单的位数判断~ 有待完善
         * @method  idnumber
         * @private
         * @static
         * @param   {selector}  _item
         * @example
            <div class="f-l">
                <input type="TEXT" name="company_idnumber" 
                    datatype="idnumber" errmsg="请填写正确的身份证号码">
            </div>
         */
        , idnumber:
            function( _item ){
                var _p = this, _r = /^[0-9]{15}(?:[0-9]{2}(?:[0-9xX])|)$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查手机号码<br />
         * @method  mobilecode
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {bool}      _noError
         * @example
            <div class="f-l">
                <input type="TEXT" name="company_mobile" 
                    datatype="mobilecode" subdatatype="alternative" datatarget="input[name=company_phonecode]" alternativemsg=" "
                    errmsg="请填写正确的手机号码">
            </div>
         */
        , mobilecode: 
            function( _item, _noError ){
                var _p = this, _r =  /^(?:13|14|15|16|18|19)[\d]{9}$/.test( _item.val() );
                !_noError && !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查手机号码
         * <br />这个方法是 mobilecode 的别名
         * @method  mobile
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {bool}      _noError
         */
        , mobile:
            function( _item, _noError ){
                return this.mobilecode( _item, _noError );
            }
        /**
         * 检查手机号码加强方法
         * <br>格式: [+国家代码] [零]11位数字
         * @method  mobilezonecode
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {bool}      _noError
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_mobilezone" 
                        datatype="mobilezonecode" 
                        errmsg="请填写正确的手机号码">
                </div>
         */
        , mobilezonecode: 
            function( _item, _noError ){
                var _p = this, _r = /^(?:\+[0-9]{1,6} |)(?:0|)(?:13|14|15|16|18|19)\d{9}$/.test( _item.val() );
                !_noError && !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查电话号码
         * <br>格式: 7/8位数字
         * @method  phonecode
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div>
                    <input type='TEXT' name='company_phonecode' style="width:80px;" value='' size="8" 
                        datatype="phonecode" errmsg="请检查电话号码格式" emEl="#phone-err-em" />
                </div>
         */
        , phonecode: 
            function( _item ){
                var _p = this, _r =  /^[1-9][0-9]{6,7}$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查电话号码
         * <br>格式: [区号]7/8位电话号码
         * @method  phone
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {bool}      _noError
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_phone" 
                        datatype="phone" 
                        errmsg="请填写正确的电话号码">
                </div>
         */
        , phone:
            function( _item, _noError ){
                var _p = this, _r = /^(?:0(?:10|2\d|[3-9]\d\d)(?: |\-|)|)[1-9][\d]{6,7}$/.test( _item.val() );
                !_noError && !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查电话号码
         * <br>格式: [+国家代码][ ][电话区号][ ]7/8位电话号码[#分机号]
         * @method  phoneall
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {bool}      _noError
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_mobilezone" 
                        datatype="phoneall" 
                        errmsg="请填写正确的电话号码">
                </div>
         */
        , phoneall:
            function( _item, _noError ){
                var _p = this
                    , _r = /^(?:\+[\d]{1,6}(?: |\-)|)(?:0[\d]{2,3}(?:\-| |)|)[1-9][\d]{6,7}(?:(?: |)\#[\d]{1,6}|)$/.test( _item.val() );
                !_noError && !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查电话区号
         * @method  phonezone
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div>
                    <input type='TEXT' name='company_phonezone' style="width:40px;" value='' size="4" 
                        datatype="phonezone" emEl="#phone-err-em" errmsg="请填写正确的电话区号" />
                </div>
         */
        , phonezone: 
            function( _item ){
                var _p = this, _r = /^[0-9]{3,4}$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查电话分机号码
         * @method  phoneext
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div>
                    <input type='TEXT' name='company_phoneext' style="width:40px;" value='' size="4" 
                        datatype="phoneext" emEl="#phone-err-em" errmsg="请填写正确的分机号" />
                </div>
         */
        , phoneext: 
            function( _item ){
                var _p = this, _r =  /^[0-9]{1,6}$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查手机号码/电话号码
         * <br />这个方法是原有方法的混合验证 mobilecode + phone
         * @method  mobilephone
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l label">
                    <label>(datatype mobilephone, phone + mobilecode)手机号码或电话号码:</label>
                </div>
                <div class="f-l">
                    <input type="text" name="company_mobilephone" 
                        datatype="mobilephone"
                        errmsg="请填写正确的手机/电话号码">
                </div>
         */
        , mobilephone:
            function( _item ){
                var _p = this, _r = this.mobilecode( _item, true ) || this.phone( _item, true );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }

        /**
         * 检查手机号码/电话号码, 泛匹配
         * <br />这个方法是原有方法的混合验证 mobilezonecode + phoneall
         * @method  mobilephoneall
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l label">
                    <label>(datatype mobilephoneall, phoneall + mobilezonecode)手机号码或电话号码:</label>
                </div>
                <div class="f-l">
                    <input type="text" name="company_mobilephoneall" 
                        datatype="mobilephoneall"
                        errmsg="请填写正确的手机/电话号码">
                </div>
         */
        , mobilephoneall:
            function( _item ){
                var _p = this, _r = this.mobilezonecode( _item, true ) || phoneall( _item, true );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 自定义正则校验
         * @method  reg
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {string}    reg-pattern     正则规则 /规则/选项
         * @example
                    <div><input type="TEXT" name="company_addr" datatype="reg" reg-pattern="/^[\s\S]{2,120}$/i" errmsg="请填写正确的地址"></div>
                    <div><input type="TEXT" name="company_addr" datatype="reg-/^[\s\S]{2,120}$/i" errmsg="请填写正确的地址"></div>
         */
        , reg: 
            function( _item ){
                var _p = this, _r = true, _pattern;
                if( _item.is( '[reg-pattern]' ) ) _pattern = _item.attr( 'reg-pattern' );
                if( !_pattern ) _pattern = $.trim(_item.attr('datatype')).replace(/^reg(?:\-|)/i, '');

                _pattern.replace( /^\/([\s\S]*)\/([\w]{0,3})$/, function( $0, $1, $2 ){
                    JC.log( $1, $2 );
                    _r = new RegExp( $1, $2 || '' ).test( _item.val() );
                });

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );

                return _r;
            }
        /**
         * 检查验证码<br />
         * 格式: 为 0-9a-zA-Z, 长度 默认为4
         * @method  vcode
         * @private
         * @static
         * @param   {selector}  _item
         * @attr    {string}    datatype    vcode|vcode-[\d]+
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_vcode" style="width: 40px;"
                        datatype="vcode" reqmsg="验证码" errmsg="请填写正确的验证码">
                </div>
                <div class="f-l">
                    <input type="TEXT" name="company_vcode" style="width: 40px;"
                        datatype="vcode-5" errmsg="请填写正确的验证码">
                </div>
         */
        , vcode:
            function( _item ){
                var _p = this, _r, _len = parseInt( $.trim(_item.attr('datatype')).replace( /^vcode(?:\-|)/i, '' ), 10 ) || 4; 
                JC.log( 'vcodeValid: ' + _len );
                _r = new RegExp( '^[0-9a-zA-Z]{'+_len+'}$' ).test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查文本长度
         * @method  text
         * @private
         * @static
         * @see length
         * @attr    {string}    datatype    text
         */
        , text: function(_item){ return true; }
        /**
         * 检查文本的字节长度
         * @method  bytetext
         * @private
         * @static
         * @see length
         * @attr    {string}    datatype    bytetext
         */
        , bytetext: function(_item){ return true; }
        /**
         * 检查富文本的字节
         * <br />TODO: 完成富文本长度检查
         * @method  richtext
         * @private
         * @static
         * @see length
         * @attr    {string}    datatype    richtext
         */
        , richtext: function(_item){ return true; }
        /**
         * 计算字符串的字节长度, 非 ASCII 0-255的字符视为两个字节
         * @method  bytelen
         * @private
         * @static
         * @param   {string}    _s
         */
        , bytelen: 
            function( _s ){
                return _s.replace(/[^\x00-\xff]/g,"11").length;
            }
        /**
         * 检查URL
         * @method  url
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_url" datatype="url" errmsg="请填写正确的网址">
                </div>
         */
        , url: 
            function( _item ){
                var _p = this
                    , _r = /^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查域名
         * @method  domain
         * @private
         * @static
         * @param   {selector}  _item
                <div class="f-l">
                    <input type="TEXT" name="company_domain" datatype="domain" reqmsg="域名" errmsg="请填写正确的域名">
                </div>
         */
        , domain:
            function( _item ){
                //var _r = /^(?:(?:f|ht)tp\:\/\/|)((?:(?:(?:\w[\.\-\+]?)*)\w)*)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})(?:\/|)$/.test( _item.val() );
                var _p = this
                    , _r = /^(?:htt(?:p|ps)\:\/\/|)((?:(?:(?:\w[\.\-\+]*))\w)*)((?:(?:(?:\w[\.\-\+]*){0,62})\w)+)\.(\w{2,6})(?:\/|)$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查域名
         * @method  stricdomain
         * @private
         * @static
         * @param   {selector}  _item
                <div class="f-l">
                    <input type="TEXT" name="company_domain" datatype="stricdomain" reqmsg="域名" errmsg="请填写正确的域名">
                </div>
         */
        , stricdomain:
            function( _item ){
                var _p = this
                    , _r = /^((?:(?:(?:\w[\.\-\+]*))\w)*)((?:(?:(?:\w[\.\-\+]*){0,62})\w)+)\.(\w{2,6})$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查电子邮件
         * @method  email
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_email" datatype="email" reqmsg="邮箱" errmsg="请填写正确的邮箱">
                </div>
         */
        , email: 
            function( _item ){
                var _p = this, _r = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 检查邮政编码
         * @method  zipcode
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <div class="f-l">
                    <input type="TEXT" name="company_zipcode" datatype="zipcode" errmsg="请填写正确的邮编">
                </div>
         */
        , zipcode: 
            function( _item ){
                var _p = this, _r = /^[0-9]{6}$/.test( _item.val() );
                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item ] );
                return _r;
            }
        /**
         * 此类型检查 2|N个对象必须至少有一个是有输入内容的, 
         * <br> 常用于 手机/电话 二填一
         * @method  alternative
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <dd>
                <div class="f-l label">
                    <label>(datatype phonezone, phonecode, phoneext)电话号码:</label>
                </div>
                <div class="f-l">
                    <input type='TEXT' name='company_phonezone' style="width:40px;" value='' size="4" 
                        datatype="phonezone" emEl="#phone-err-em" errmsg="请填写正确的电话区号" />
                    - <input type='TEXT' name='company_phonecode' style="width:80px;" value='' size="8" 
                        datatype="phonecode" subdatatype="alternative" datatarget="input[name=company_mobile]" alternativemsg="电话号码和手机号码至少填写一个"
                        errmsg="请检查电话号码格式" emEl="#phone-err-em" />
                    - <input type='TEXT' name='company_phoneext' style="width:40px;" value='' size="4" 
                        datatype="phoneext" emEl="#phone-err-em" errmsg="请填写正确的分机号" />
                    <em id="phone-err-em"></em>
                </div>
                </dd>

                <dd>
                <div class="f-l label">
                    <label>(datatype mobilecode)手机号码:</label>
                </div>
                <div class="f-l">
                    <input type="TEXT" name="company_mobile" 
                        datatype="mobilecode" subdatatype="alternative" datatarget="input[name=company_phonecode]" alternativemsg=" "
                        errmsg="请填写正确的手机号码">
                </div>
                </dd>
         */
        , alternative:
            function( _item ){
                var _p = this, _r = true, _target;
                JC.log( 'alternative' );

                _item.is( '[datatarget]' ) && (_target = $(_item.attr('datatarget')) );
                !( _target && _target.length ) && ( _target = _item.parent().find('[subdatatype=alternative]') );

                if( _target.length && !$.trim( _item.val() ) ){
                    var _hasVal = false;
                    _target.each( function(){ if( $(this).val() ){ _hasVal = true; return false; } } );
                    _r = _hasVal;
                }

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item, 'alternativemsg', true ] );
                !_r && _target && _target.length 
                    && _target.each( function(){ 
                        $(_p).trigger( 'TriggerEvent', [ 'SetError', $(this), 'alternativemsg', true ] );
                    });
                _r && _target && _target.length 
                    && $(_p).trigger( 'TriggerEvent', [ 'SetValid', _target ] );

                return _r;
            }
        /**
         * 此类型检查 2|N 个对象填写的值必须一致
         * 常用于注意时密码验证/重置密码
         * @method  reconfirm
         * @private
         * @static
         * @param   {selector}  _item
         * @example
                <dd>
                <div class="f-l label">
                    <label>(datatype text, subdatatype reconfirm)用户密码:</label>
                </div>
                <div class="f-l">
                    <input type="PASSWORD" name="company_pwd" 
                    datatype="text" subdatatype="reconfirm" datatarget="input[name=company_repwd]" reconfirmmsg="用户密码和确认密码不一致"
                    minlength="6" maxlength="15" reqmsg="用户密码" errmsg="请填写正确的用户密码">
                </div>
                </dd>

                <dd>
                <div class="f-l label">
                    <label>(datatype text, subdatatype reconfirm)确认密码:</label>
                </div>
                <div class="f-l">
                    <input type="PASSWORD" name="company_repwd" 
                    datatype="text" subdatatype="reconfirm" datatarget="input[name=company_pwd]" reconfirmmsg="确认密码和用户密码不一致"
                    minlength="6" maxlength="15" reqmsg="确认密码" errmsg="请填写正确的确认密码">
                </div>
                </dd>
         */
        , reconfirm:
            function( _item ){
                var _p = this, _r = true, _target;

                JC.log( 'reconfirm' );

                _item.is( '[datatarget]' ) && (_target = $(_item.attr('datatarget')) );
                !( _target && _target.length ) && ( _target = _item.parent().find('[subdatatype=reconfirm]') );

                if( _target && _target.length ){
                    _target.each( function(){ if( _item.val() != $(this).val() )  _r = false; } );
                }

                !_r && $(_p).trigger( 'TriggerEvent', [ 'SetError', _item, 'reconfirmmsg', true ] );
                !_r && _target.length && _target.each( function(){ 
                    $(_p).trigger( 'TriggerEvent', [ 'SetError', $(this), 'reconfirmmsg', true ] );
                } );
                _r && _target.length
                    && $(_p).trigger( 'TriggerEvent', [ 'SetValid', _target ] );

                return _r;
            }
        , findFocusmsgEle:
            function( _item ){
                return _item.find( '~ em.focusmsg' );
            }
        , findErrorEle:
            function( _item ){
                var _r = _item.find( '~ em.error' );
                if( _item.attr('emel') ) _r = $( ('#' + _item.attr('emel')).replace(/[\#]+/g, '#' ) );
                return _r;
            }
        /**
         * 获取 _selector 对象
         * <br />这个方法的存在是为了向后兼容qwrap, qwrap DOM参数都为ID
         * @method  getElement
         * @private
         * @static
         * @param   {selector}  _selector
         */
        , getElement: 
            function( _selector, _item ){
                if( /^\^$/.test( _selector ) ){
                    _selector = $( _item.parent().find('~ em.error') );
                }else if( /^[\w-]+$/.test( _selector ) ) {
                    _selector = '#' + _selector;
                }
                _selector = _selector.replace( /[\#]+/g, '#' );
                return $(_selector );
            }
        /**
         * 获取对应的错误信息, 默认的错误信息有 reqmsg, errmsg, <br />
         * 注意: 错误信息第一个字符如果为空格的话, 将完全使用用户定义的错误信息, 将不会动态添加 请上传/选择/填写
         * @method  getMsg
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {string}    _msgAttr    - 显示指定需要读取的错误信息属性名, 默认为 reqmsg, errmsg, 通过该属性可以指定别的属性名
         * @param   {bool}      _fullMsg    - 显示指定错误信息为属性的值, 而不是自动添加的 请上传/选择/填写
         */
        , getMsg: 
            function( _item, _msgAttr, _fullMsg ){
                var _msg = _item.is('[errmsg]') ? ' ' + _item.attr('errmsg') : _item.is('[reqmsg]') ? _item.attr('reqmsg') : '';
                _msgAttr && (_msg = _item.attr( _msgAttr ) || _msg );
                _fullMsg && _msg && ( _msg = ' ' + _msg );

                if( _msg && !/^[\s]/.test( _msg ) ){
                    switch( _item.prop('type').toLowerCase() ){
                        case 'file': _msg = '请上传' + _msg; break;

                        case 'select-multiple':
                        case 'select-one':
                        case 'select': _msg = '请选择' + _msg; break;

                        case 'textarea':
                        case 'password':
                        case 'text': _msg = '请填写' + _msg; break;
                    }
                }

                JC.log( '_msg: ' + _msg, _item.prop('type').toLowerCase() );

                return $.trim(_msg);
            }
        /**
         * 获取日期字符串的 timestamp, 字符串格式为 YYYY[^\d]*?MM[^\d]*?DD
         * @method  _logic.getTimestamp
         * @private
         * @static
         * @param   {string}    _date_str
         */
        , getTimestamp:
            function( _date_str ){
                return parseISODate( _date_str ).getTime();
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
        /**
         * 显示正确的视觉效果
         * @method  valid
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {int}       _tm
         */
        , valid:
            function( _item, _tm ){
                _item && ( _item = $(_item) );
                var _p = this;
                if( !_p._model.isValid( _item ) ) return false;
                setTimeout(function(){
                    _item.removeClass('error');
                    _item.find('~ em:not("em.focusmsg, em.error")').show();
                    _item.find('~ em.error').hide();
                    _item.attr('emel') && _p._model.getElement( _item.attr('emel'), _item ).hide();
                }, _tm || 150);
            }
        /**
         * 显示错误的视觉效果
         * @method  error
         * @private
         * @static
         * @param   {selector}  _item
         * @param   {string}    _msgAttr    - 显示指定需要读取的错误信息属性名, 默认为 reqmsg, errmsg, 通过该属性可以指定别的属性名
         * @param   {bool}      _fullMsg    - 显示指定错误信息为属性的值, 而不是自动添加的 请上传/选择/填写
         */
        , error: 
            function( _item, _msgAttr, _fullMsg ){
                _item && ( _item = $(_item) );
                var _p = this, arg = arguments;
                if( !_p._model.isValid( _item ) ) return false;
                if( _item.is( '[validnoerror]' ) ) return;

                setTimeout(function(){
                    var _msg = _p._model.getMsg.apply( _p._model, [].slice.call( arg ) ), _errEm;

                    _item.addClass( 'error' );
                    _item.find('~ em:not(.error)').hide();

                    if( _item.is( '[emEl]' ) ){
                        ( _errEm = _p._model.getElement( _item.attr( 'emEl' ) , _item) ) && _errEm.length && _errEm.addClass('error');
                    }
                    !( _errEm && _errEm.length ) && ( _errEm = _item.find('~ em.error') );
                    if( !_errEm.length ){
                        ( _errEm = $('<em class="error"></em>') ).insertAfter( _item );
                    }
                    JC.log( 'error: ' + _msg );
                    _errEm.html( _msg ).show() 
                }, 150);

                return false;
            }
        , focusmsg:
            function( _item, _setHide ){
                if( _item && ( _item = $( _item ) ).length && _item.is('[focusmsg]') ){
                    var _focusmsgem = this._model.findFocusmsgEle( _item )
                        , _errorEm = this._model.findErrorEle( _item );
                    if( _setHide ){
                        _focusmsgem.hide();
                        JC.log( 'hide focusmsg', _focusmsgem.length );
                        return;
                    }
                    if( _errorEm.length && _errorEm.is(':visible') ) return;
                        JC.log( 'show focusmsg' );
                    !_focusmsgem.length 
                        && ( _focusmsgem = $('<em class="focusmsg"></em>')
                             , _item.after( _focusmsgem )
                           );
                    _focusmsgem.removeClass( 'isvalid' ).removeClass( 'iserror' );
                    _item.attr('validnoerror', true);
                    var _r = Valid.getInstance().parse( _item );
                    _item.removeAttr('validnoerror');
                    _r ? _focusmsgem.addClass('isvalid') : _focusmsgem.addClass( 'iserror' );
                    _focusmsgem.html( _item.attr('focusmsg') ).show();
                }
            }
    };
    /**
     * 响应表单子对象的 blur事件, 触发事件时, 检查并显示错误或正确的视觉效果
     * @private
     */
    $(document).delegate( 'input[type=text], input[type=password], textarea', 'blur', function($evt){
        Valid.getInstance().trigger( 'FocusMsg',  [ $(this), true ] );
        Valid.check( $(this) );
    });
    /**
     * 响应表单子对象的 change 事件, 触发事件时, 检查并显示错误或正确的视觉效果
     * @private
     */
    $(document).delegate( 'select, input[type=file]', 'change', function($evt){
        Valid.check( $(this) );
    });
    /**
     * 响应表单子对象的 focus 事件, 触发事件时, 如果有 focusmsg 属性, 则显示对应的提示信息
     * @private
     */
    $(document).delegate( 'input[type=text], input[type=password], textarea, select, input[type=file]', 'focus', function($evt){
        Valid.getInstance().trigger( 'FocusMsg',  [ $(this) ] );
    });
    /**
     * 响应表单子对象的 blur事件, 触发事件时, 如果有 focusmsg 属性, 则显示对应的提示信息
     * @private
     */
    $(document).delegate( 'select, input[type=file]', 'blur', function($evt){
        Valid.getInstance().trigger( 'FocusMsg',  [ $(this), true ] );
    });

}(jQuery))
