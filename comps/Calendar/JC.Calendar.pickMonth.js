(function($){
    /**
     * 自定义月份弹框的模板HTML
     * @for         JC.Calendar
     * @property    monthTpl
     * @type        string
     * @default     empty
     * @static
     */
    JC.Calendar.monthTpl = '';

    function MonthModel( _selector ){
        this._selector = _selector;
    }
    JC.Calendar.MonthModel = MonthModel;
    
    function MonthView( _model ){
        this._model = _model;
    }
    JC.Calendar.MonthView = MonthView;

    JC.Calendar.clone( MonthModel, MonthView );

    MonthModel.prototype.layout = 
        function(){
            var _r = $('#UXCCalendar_month');

            if( !_r.length ){
                _r = $( JC.Calendar.monthTpl || this.tpl ).hide();
                _r.attr('id', 'UXCCalendar_month').hide().appendTo( document.body );
             }
            return _r;
        };

    MonthModel.prototype.tpl =
        [
        '<div id="UXCCalendar_month" class="UXCCalendar UXCCalendar_week UXCCalendar_month" >'
        ,'    <div class="UHeader">'
        ,'        <button type="button" class="UButton UNextYear">&nbsp;&gt;&gt;&nbsp;</button>'
        ,'        <button type="button" class="UButton UPreYear">&nbsp;&lt;&lt;&nbsp;</button>'
        ,'        <select class="UYear" style=""></select>'
        ,'    </div>'
        ,'    <table class="UTable UTableBorder">'
        ,'        <tbody></tbody>'
        ,'    </table>'
        ,'    <div class="UFooter">'
        ,'        <button type="button" class="UConfirm">确定</button>'
        ,'        <button type="button" class="UClear">清空</button>'
        ,'        <button type="button" class="UCancel">取消</button>'
        ,'    </div>'
        ,'</div>'
        ].join('');

    MonthModel.prototype.month = 
        function(){
            var _r = 0, _tmp, _date;
            ( _tmp = this.layout().find('td.cur a[dstart]') ).length
                && ( _date = new Date() )
                && (
                        _date.setTime( _tmp.attr('dstart') )
                        , _r = _date.getMonth()
                   )
                ;
            return _r;
        };

    MonthModel.prototype.selectedDate =
        function(){
            var _r, _tmp, _item;
            _tmp = this.layout().find('td.cur');
            _tmp.length 
                && !_tmp.hasClass( 'unable' )
                && ( _item = _tmp.find('a[dstart]') )
                && ( 
                        _r = { 'start': new Date(), 'end': new Date() }
                        , _r.start.setTime( _item.attr('dstart') ) 
                        , _r.end.setTime( _item.attr('dend') ) 
                    )
                ;
            return _r;
        };

    MonthModel.prototype.defaultMultiselectDate =
        function( _r ){
            var _p = this
                , _selector = _p.selector()
                , _tmp
                , _multidatear
                , _dstart, _dend
                ;

            if( _tmp = parseISODate( _selector.val() ) ) _r.date = _tmp;
            else{
                if( _selector.val() && (_tmp = _selector.val().replace( /[^\d,]/g, '' ) ).length ){
                    _tmp = _tmp.split(',');
                    _multidatear = [];

                    $.each( _tmp, function( _ix, _item ){
                        if( _item.length != 16 ) return;
                        _dstart = parseISODate( _item.slice( 0, 8 ) );
                        _dend = parseISODate( _item.slice( 8 ) );

                        if( !_ix ){
                            _r.date = cloneDate( _dstart );
                            _r.enddate = cloneDate( _dend );
                        }
                        _multidatear.push( { 'start': _dstart, 'end': _dend } );
                    });

                    _r.multidate = _multidatear;

                }else{
                    _tmp = new Date();
                    _r.date = new Date( _tmp.getFullYear(), _tmp.getMonth(), _tmp.getDate() );
                    _r.enddate = cloneDate( _r.date );
                    _r.enddate.setDate( maxDayOfMonth( _r.enddate ) );
                    _r.multidate = [];
                    _r.multidate.push( {'start': cloneDate( _r.date ), 'end': cloneDate( _r.enddate ) } );
                }
            }
            return _r;
        };

    MonthModel.prototype.multiLayoutDate = 
        function(){
            var _p = this
                , _dateo = _p.defaultDate()
                , _year = _p.year()
                ;

            JC.log( 'MonthModel.multiLayoutDate:', new Date().getTime() );
            _dateo.multidate = [];

            _p.layout().find('td.cur').each(function(){
                var _sp = $(this);
                var _item = _sp.find('> a[dstart]'), _dstart = new Date(), _dend = new Date();
                _dstart.setTime( _item.attr('dstart') );
                _dend.setTime( _item.attr('dend') );
                _dateo.multidate.push( { 'start': _dstart, 'end': _dend } );
            });

            _dateo.date.setFullYear( _year );
            _dateo.enddate.setFullYear( _year );

            $.each( _dateo.multidate, function( _ix, _item ){
                _item.start.setFullYear( _year );
                _item.end.setFullYear( _year );
            });

            return _dateo;
        };

    MonthView.prototype.updateMultiYear =
        function( _offset ){
            var _dateo = this._model.layoutDate(), _day, _max;

            //JC.log( 'xdfsadfasefasf', _dateo.multidate == null );
            JC.log( 'MonthView.updateMultiYear:', new Date().getTime() );

            tmpUpdateMultiYear( _dateo.date, _offset );
            tmpUpdateMultiYear( _dateo.enddate, _offset );

            if( _dateo.multidate ){
                //JC.log( _dateo.multidate.length );
                $.each( _dateo.multidate, function( _ix, _item ){
                    tmpUpdateMultiYear( _item.start, _offset );
                    tmpUpdateMultiYear( _item.end, _offset );
                    JC.log('xxxxxxxxxxxxxxxxxxxxxxx', _item.start, _item.end, _offset );
                });
            }

            this._buildLayout( _dateo );
            this._buildDone();
        };
    function tmpUpdateMultiYear( _date, _offset ){
        var _day, _max;
        _day = _date.getDate();
        _date.setDate( 1 );
        _date.setFullYear( _date.getFullYear() + _offset );
        _max = maxDayOfMonth( _date );
        _day > _max && ( _day = _max );
        _date.setDate( _day );
    }

    MonthView.prototype._buildBody =
        function( _dateo ){
            var _p = this
                , _date = _dateo.date
                , _layout = _p._model.layout()
                , today = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() ).getTime()
                , nextCount = 0
                , _ls = [], _class, _data, _title, _dstart, _dend, _year = _date.getFullYear()
                , _rows = 4
                , ipt = JC.Calendar.lastIpt
                , currentcanselect = parseBool( ipt.attr('currentcanselect') )
                , _tmpMultidate = _dateo.multidate ? _dateo.multidate.slice() : null
                ;

                if( _dateo.maxvalue && currentcanselect ){
                    _dateo.maxvalue.setDate( maxDayOfMonth( _dateo.maxvalue ) );
                }

                _ls.push('<tr>');
                for( i = 1, j = 12; i <= j; i++ ){
                    _dstart = new Date( _year, i - 1, 1 ); 
                    _dend = new Date( _year, i - 1, maxDayOfMonth( _dstart ) );

                    _title = printf( "{0}年 {1}月<br/>开始日期: {2} (周{4})<br />结束日期: {3} (周{5})"
                                , _year
                                , JC.Calendar.getCnNum( i )
                                , formatISODate( _dstart )
                                , formatISODate( _dend )
                                , JC.Calendar.cnWeek.charAt( _dstart.getDay() % 7 )
                                , JC.Calendar.cnWeek.charAt( _dend.getDay() % 7 )
                                );

                    _class = [];

                    if( _dateo.minvalue && _dstart.getTime() < _dateo.minvalue.getTime() ) 
                        _class.push( 'unable' );
                    if( _dateo.maxvalue && _dend.getTime() > _dateo.maxvalue.getTime() ){
                        _class.push( 'unable' );
                    }

                    if( _tmpMultidate ){
                        //JC.log( '_tmpMultidate.length:', _tmpMultidate.length );
                        $.each( _tmpMultidate, function( _ix, _item ){
                            //JC.log( _dstart.getTime(), _item.start.getTime(), _item.end.getTime() );
                            if( _dstart.getTime() >= _item.start.getTime() 
                              && _dstart.getTime() <= _item.end.getTime() ){
                                _class.push( 'cur' );
                                _tmpMultidate.splice( _ix, 1 );
                                //JC.log( _tmpMultidate.length );
                                return false;
                            }
                        });
                    }else{
                        if( _date.getTime() >= _dstart.getTime() 
                                && _date.getTime() <= _dend.getTime() ) _class.push( 'cur' );
                    }
                    if( today >= _dstart.getTime() && today <= _dend.getTime() ) _class.push( 'today' );

                    _cnUnit = JC.Calendar.cnUnit.charAt( i % 10 );
                    i > 10 && ( _cnUnit = "十" + _cnUnit );

                    _ls.push( printf( '<td class="{0}"><a href="javascript:" title="{1}"'+
                                    ' dstart="{3}" dend="{4}" month="{5}" >{2}月</a></td>'
                                , _class.join(' ')
                                , _title
                                , _cnUnit
                                , _dstart.getTime()
                                , _dend.getTime()
                                , i
                            ));
                    if( i % 3 === 0 && i != j ) _ls.push( '</tr><tr>' );
                }
                _ls.push('</tr>'); 
 
                _layout.find('table.UTableBorder tbody' ).html( $( _ls.join('') ) );
        };

    MonthModel.prototype.multiselectDate =
        function(){
            var _p = this, _r = [], _sp, _item, _dstart, _dend;
            _p.layout().find('td.cur').each( function(){
                _sp = $(this); _item = _sp.find( '> a[dstart]' );
                if( _sp.hasClass( 'unable' ) ) return;
                _dstart = new Date(); _dend = new Date();
                _dstart.setTime( _item.attr('dstart') );
                _dend.setTime( _item.attr('dend') );
                _r.push( { 'start': _dstart, 'end': _dend } );
            });
            return _r;
        };

    MonthView.prototype.updateSelected = 
        function( _userSelectedItem ){
            var _p = this, _dstart, _dend, _tmp, _text, _ar;
            if( !_userSelectedItem ){
                if( _p._model.multiselect() ){
                    _tmp = this._model.multiselectDate();
                    if( !_tmp.length ) return;
                    _ar = [];
                    $.each( _tmp, function( _ix, _item ){
                        _ar.push( printf( '{0} 至 {1}', formatISODate( _item.start ), formatISODate( _item.end ) ) );
                    });
                    _text = _ar.join(',');
                }else{
                    _tmp = this._model.selectedDate();
                    _tmp && ( _dstart = _tmp.start, _dend = _tmp.end );

                    _dstart && _dend 
                        && ( _text = printf( '{0} 至 {1}', formatISODate( _dstart ), formatISODate( _dend ) ) );
                }
            }else{
                _userSelectedItem = $( _userSelectedItem );
                _tmp = getJqParent( _userSelectedItem, 'td' );
                if( _tmp && _tmp.hasClass('unable') ) return;

                if( _p._model.multiselect() ){
                    _tmp.toggleClass('cur');
                    return;
                }
                _dstart = new Date(); _dend = new Date();
                _dstart.setTime( _userSelectedItem.attr('dstart') );
                _dend.setTime( _userSelectedItem.attr('dend') );

                _text = printf( '{0} 至 {1}', formatISODate( _dstart ), formatISODate( _dend ) );
            }

            if( !_text ) return;

            _p._model.selector().val( _text );
            $(_p).trigger( 'TriggerEvent', [ JC.Calendar.Model.UPDATE, 'month', _dstart, _dend ] );

            JC.Calendar.hide();
        };

}(jQuery));
