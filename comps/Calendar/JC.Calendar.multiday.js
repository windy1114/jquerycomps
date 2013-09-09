(function($){
    /**
     * 多先日期弹框的模板HTML
     * @for         JC.Calendar
     * @property    multiDayTpl
     * @type        string
     * @default     empty
     * @static
     */

    JC.Calendar.multiDayTpl = '';

    function MultiDayModel( _selector ){
        this._selector = _selector;
        
    }
    JC.Calendar.MultiDayModel = MultiDayModel;
    
    function MultiDayView( _model ){
        this._model = _model;
		
    }
    JC.Calendar.MultiDayView = MultiDayView;

    JC.Calendar.clone( MultiDayModel, MultiDayView );
	
    MultiDayModel.prototype.layout = 
        function(){
            var _r = $('#UXCCalendar_multi_day');

            if( !_r.length ){
                _r = $( JC.Calendar.multiDayTpl || this.tpl ).hide();
                _r.attr('id', 'UXCCalendar_multi_day').hide().appendTo( document.body );
             }
            return _r;
        };
		
	MultiDayModel.prototype.tpl =
        [
        '<div id="UXCCalendar_multi_day" class="UXCCalendar UXCCalendar_multi_day" >'
        ,'    <div class="UHeader">'
        ,'       <span class="UYear">'
        ,'       </span>年'
        ,'       <span class="UMonth">'
        ,'       </span>月'
        ,'       的日历'
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

    MultiDayModel.prototype.multiLayoutDate = 
    	function () {
    		// var _p = this
    		// 	, _dateo = p.defaultDate()
    		// 	;

    		// JC.log("MultiDayModel.multiLayoutDate:", _dateo);
    		// _dateo.multidate = [];

    		// _p.layout().find('td.cur').each(function () {
    		// 	var _sp = $(this),
    		// 		_date = _sp.attr('date');

    		// 	_dateo.multidate.push(_date);
    		// });
    		// return _dateo;
    	}

    MultiDayModel.prototype.defaultMultiselectDate = 
    	function ( _r ) {

    		var _p = this
                , _selector = _p.selector()
                , _tmp
                , _multidate
                , _dstart, _dend
                ;

            if( _tmp = parseISODate( _selector.val() ) ) _r.date = _tmp;
            else{
                // if( _selector.val() && (_tmp = _selector.val().replace( /[^\d,]/g, '' ) ).length ){
                //     _tmp = _tmp.split(',');
                //     _multidate = [];

                //     $.each( _tmp, function( _ix, _item ){
                //         if( _item.length != 16 ) return;
                //         _dstart = parseISODate( _item.slice( 0, 8 ) );
                //         _dend = parseISODate( _item.slice( 8 ) );

                //         if( !_ix ){
                //             _r.date = cloneDate( _dstart );
                //             _r.enddate = cloneDate( _dend );
                //         }
                //         _multidate.push( { 'start': _dstart, 'end': _dend } );
                //     });

                //     _r.multidate = _multidate;

                // }else{
                //     _tmp = new Date();
                //     _r.date = new Date( _tmp.getFullYear(), _tmp.getMonth(), _tmp.getDate() );
                //     _r.enddate = cloneDate( _r.date );
                //     _r.enddate.setDate( maxDayOfMonth( _r.enddate ) );
                //     _r.multidate = [];
                //     _r.multidate.push( {'start': cloneDate( _r.date ), 'end': cloneDate( _r.enddate ) } );
                // }
            }
			
            return _r;
    	}

    MultiDayModel.prototype.multiselectDate =
        function(){
            var _p = this
            	, _r = []
            	, _sp
            	, _item
            	, _date
            	;

            _p.layout().find('td.cur').each( function () {
                _sp = $(this);
                _item = _sp.find( '> a[date]' );

                if( _sp.hasClass( 'unable' ) ) return;
                _date = new Date();
                _date.setTime( _item.attr("date") );
                _r.push( _date );
                
            });
           
            return _r;
        };

    MultiDayView.prototype.updateSelected = 
        function( _userSelectedItem ){
            var _p = this
            	, _dstart
            	, _dend
            	, _tmp
            	, _text
            	, _ar
            	;

            if( !_userSelectedItem ) {
               if( _p._model.multiselect() ){
                    _tmp = this._model.multiselectDate();

                    if( !_tmp.length ) return;
                    
                    _ar = [];
                    
                    for (var i = 0; i < _tmp.length; i++) {
                    	_ar.push(formatISODate(_tmp[i]));
                    }
                    _text = _ar.join(',');
                    
                }else{
                    _tmp = this._model.selectedDate();
                    
                }
            } else {
                _userSelectedItem = $( _userSelectedItem );
                _tmp = getJqParent( _userSelectedItem, 'td' );
                if( _tmp && _tmp.hasClass('unable') ) return;

                if( _p._model.multiselect() ){
                    _tmp.toggleClass('cur');
                    return;
                }
                _date = new Date(); 
                _date.setTime( _userSelectedItem.attr('date') );
                _text = _userSelectedItem.attr("date");
                _text = printf( '{0}', formatISODate( _date ) );
               
            }

            if( !_text ) return;

            _p._model.selector().val( _text );
            $(_p).trigger( 'TriggerEvent', [ JC.Calendar.Model.UPDATE, 'multiday', _tmp ] );

            JC.Calendar.hide();
        };
	
	MultiDayView.prototype._buildHeader = 
		function( _dateo ){
			var _p = this, 
				_layout = _p._model.layout();
			
			var year = _dateo.date.getFullYear(),
				month = _dateo.date.getMonth() + 1;
			
			_layout.find('div.UHeader span.UYear').html(year);
			_layout.find('div.UHeader span.UMonth').html(month);
				
		};
	
	MultiDayView.prototype._buildBody =
        function( _dateo ){
				var _p = this, _layout = _p._model.layout();
                var _maxday = maxDayOfMonth( _dateo.date ), 
                    _ls = [],
                    i, 
					_class, 
					_tempDate, 
					_tempDay,
					_today = new Date();
				
				_tempDate = new Date(_dateo.date.getFullYear(), _dateo.date.getMonth(), 1);
				_tempDay = _tempDate.getDay();
				
				_ls.push('<tr><td>星期</td>');
				
				for ( i = 0; i < _maxday; i++ ) {
					_class = [];
					
					if (_tempDay == 0 || _tempDay == 6) {
						_class.push("red");
					}
					
					_ls.push('<td class="' , _class.join(" ") , '">' 
						, Calendar.cnWeek[_tempDay] , '</td>');
					_tempDate.setDate(_tempDate.getDate() + 1);
					_tempDay = _tempDate.getDay();
					
				}
				
				_ls.push('</tr>');
				
				
                _ls.push('<tr><td>日期</td>'); 
				_tempDate = new Date(_dateo.date.getFullYear(), _dateo.date.getMonth(), 1);
				for ( i = 1; i <= _maxday; i++) {
					_class = getClass(_dateo, _tempDate, _today);
					_ls.push('<td class="' , _class.join(" ") , '"><a href="javascript:;" date="'
						, _tempDate.getTime() ,'" >' ,  i , '</a></td>');
						
					_tempDate.setDate(_tempDate.getDate() + 1);
					_tempDay = _tempDate.getDay();
					
				}
				
                _ls.push('</tr>');
                

				_ls.push('<tr class="Uchkdate"><td><label><input type="checkbox" value=""  />全选</lable></td>');
				_tempDate = new Date(_dateo.date.getFullYear(), _dateo.date.getMonth(), 1);
				
				for ( i = 0; i < _maxday; i++) {
					_class = getClass(_dateo, _tempDate, _today);

					_ls.push('<td class="', _class.join(" ") ,'"><input type="checkbox" date="' , _tempDate.getTime() , '" value="'
						, formatISODate(_tempDate) ,'" /></td>');
					
					_tempDate.setDate(_tempDate.getDate() + 1);
					_tempDay = _tempDate.getDay();
					
				}
				
				_ls.push('</tr>');
				
				
                _layout.find('table.UTableBorder tbody' ).html( $( _ls.join('') ) );
        };
	
	function getClass(_dateo, _tempDate, _today) {
		var _class = [];

		if( _dateo.minvalue) {
			if( _tempDate.getTime() < _dateo.minvalue.getTime() ) {
				_class.push( 'unable' );
			}
		} 
            
        if( _dateo.maxvalue ) {
			if ( _tempDate.getTime() > _dateo.maxvalue.getTime() ) {
				_class.push( 'unable' );
			}
		} 
           
		if( isSameDay( _tempDate, _today ) ) {
			_class.push( 'today' );
		}
		
        if( isSameDay( _dateo.date, _tempDate ) ) {
			_class.push( 'cur' );
		}

		return _class;
	}


}(jQuery));