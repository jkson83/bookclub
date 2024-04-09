/**
 * WORKLIST
 * --------------------------------------
 * @Version 1.5
 * @Author Goang
 * ======================================
 * @Usage
 * [U22/12/8] 작업리스트 변경금지 클래스(num, depth*, path, ddate, rdate, pdate, mdate, info, log)
 * [U22/11/23]동일 페이지 2개 열려 있을경우 Setting localStorage 적용 안됨에 주의
 * [U22/01/10][html] 페이지 카운트 제외 클래스 : tbody > tr.nocnt
 * [U22/01/07][html] 작업리스트 페이지 타입 정의
 *    - workList: <body data-page="worklist">
 *    - todoList: <body data-page="todo">
 *    - guideList: <body data-page="guide">
 *    - directory: <body data-page="directory">
 * [U21/00/00][html] Nav > 1Depth 2줄: a.row2
 * 		- ex) <li><a href="javascript:void(0);" class="row2"><span>전자금융거래 <br> 회원가입</span></a></li>
 * [U21/00/00][html] Nav > SubNavigation Depth2 메뉴 강제 Hide
 *    - data-depth2 = "hide" 추가
 *    - ex) <li data-depth2="hide"><a href="javascript:void(0);"><span>공통</span></a></li>
 * --------------------------------------
 * @Todo
 * [Todo][22/12/12] 팝업 텍스트 필터링 setMap으로 이동, 설정하기 쉽게.
			- var popTxtFlag = ($(this).find('td.depth2').text().search('\\(P') != -1 || ...
 * [Todo][22/12/08] Directory List: css, js 파일 프로젝트경로, 서버경로 바로가기 링크 구현
 * [Todo][22/12/06] Table Search 이후 Table Folding 작동 안됨
 * [Todo][22/11/24] page.is_viewAll= false 일경우(View all 아닐때) : 개별 소트 기능
 * [Todo][22/11/02] v1.1 : colorbox 로컬 파일에서 cross-origin frame Error.
 * [Todo][22/03/18] 예정일, 완료일 날짜타입 변경 시 Search.set() sortDate_year로 변경 (현재, 00/00 -> 00/00/00)
 * [Todo][22/03/02] resizeMode & autoPlay 에서 바탕화면 클릭시 autoPlay 중지안됨
 * --------------------------------------
 * @Log
 * [v1.5][23/027/20] 자르는 글자수 및 앞글자 제외 수 수정 및 추가
 * [v1.4][23/01/20] __projectDate 추가 및 1년이상 프로젝트시 yearChangeNum 삭제
 * [v1.33][22/12/21] num couting 역순 추가: todo,body[data-num-reverse="true"]
 * [v1.33][22/12/21] 완료일 날짜 구분자(/ :__g.dateObj.seperate) 없을시 미완료 처리(작업중, 작업예정 등등 미완)
 * [v1.33][22/12/20] depth 동일 메뉴 삭제 에서 .blurred 처리로 변경, Gnb Depth2 영향도 반영
 * [v1.32][22/12/12] Filter 외부 인클루드 파일에서 내부 setHtml의 append로 변경
 * [v1.31][22/12/8] Component & Info 영역 Search 및 연계 적용
 * [v1.31][22/12/7] Popup.open 수정, Log .desc 마크업 삭제(td.log > * 로 변경), Log Popup: Table Template 젹용
 * [v1.3][22/12/5] Log Search 적용 및 templet 변경 .desc > time(날짜)
 * [v1.23][22/12/1] TableHead class, label명 Setting > Search & Export 연동
 * [v1.22][22/11/25] Nav Scroll Mode & Hash Mode 추가, Hash Mode 시 개별 검색 추가
 * [v1.21][22/11/24] Nav ViewOne 모드시 Hash 태그로 수정
 * [v1.21][22/11/23] Publishing Info > Log: desc 버튼 > Popup view로 수정
 * [v1.2][22/11/21] TableHead의 class, label명 setting > Table Show 연동
 * 		- colorbox scrollHandler() 추가 : PC/MO 사이즈 스크롤 컨트롤
 * 		- td.etc > td.log 로 변경
 * [v1.1][22/11/02]
 * [v1.0][22/03/07] Report 개인휴가 삽입에서 WEEK 에 -(음) 로 나오는 버그 패치
**/


var Worklist = (function(){
	var htmlMap = {}
		, __projectDate = {}
		, __manmonth = {}
		, __g = {}
		, rMap ={}
		, navMap ={}
		, dataMap ={}
	;

	var setMap = function(options){
		__projectDate = {
			//12개월 미만 프로젝트만 설정 가능.
			projectStartDate: '2023/10/06',
			projectEndDate: '2023/12/31'
		}
		, __manmonth = {
			//법정공휴일(양력)
			holiday_default :[
				{date: '1/1', label: '신정'}
				, {date: '3/1', label: '3.1절'}
				, {date: '5/1', label: '근로자의날'}
				, {date: '5/5', label: '어린이날'}
				, {date: '6/6', label: '현중일'}
				, {date: '8/15', label: '광복절'}
				, {date: '10/3', label: '개천철'}
				, {date: '10/9', label: '한글날'}
				, {date: '12/25', label: '성탄절'}
			]
			//법정공휴일(음력) & 대체공휴일 & 고객사 인정휴가 등 추가 휴일 삽입 : year 기입 필수
			, holiday :[
				{date: '2023/1/22', label: '설연휴'}
				, {date: '2023/1/23', label: '설연휴'}
				, {date: '2023/1/24', label: '설연휴'}

				, {date: '2023/5/27', label: '부처님오신날'}
				, {date: '2023/5/29', label: '부처님오신날(대체공휴일)'}

				, {date: '2023/9/28', label: '추석연휴'}
				, {date: '2023/9/29', label: '추석연휴'}
				, {date: "2023/10/2", label: "임시공휴일"}
			]

			, corder:[
				{
					id: "corder01",
					name: "장홍준",
					startDate: "2023/10/6",
					endDate: "2023/10/31",
					vacation: [
						{date: '2023/10/13', label: '반차(오전)', day:0.5},
						{date: '2023/10/19', label: '연차', day:1}
					]
				}
				, {
					id: "corder02",
					name: "N/A",
					startDate: "2023/10/1",
					endDate: "2023/10/31",
					vacation: []
				}
			]
		}
		, rMap = {
			root : $('html, body')
			, body : $('body')
			, header : $('.header')
			, tab_nav : $('.tab_nav')
			, tab_navList : $('.tab_nav > ul > li')
			, info_section : $('.info_section')
			, tobe_section : $('.tobe_section')
			, content : $('#content')
			, tab_content : $('.tab_contents_wrap')
			, contentTrs : $('.tab_contents_wrap tbody > tr')
			, tab_title : $('.tab_contents_wrap > h3')
		}
		, classMap = {
			cell : {depth2 : 'depth2'}
			, nocnt : 'nocnt'
			, nolink : 'nolink'
		}
		, __g = {
			defaultObj : options || {}
			, projectID : options.version || 'worklis'
			, is_mobile : $('html').hasClass('mobile') ? true : false
			, device : $('html').hasClass('mobile') ? 'mobile' : 'desktop'
			, fileName : Util.getFileName()
			, fileDir : Util.getDirName()
			, url_info : String(window.location.href.slice(window.location.href.indexOf('?')+1).split('&'))

			, totalCnt : 0
			, totalNoCnt : 0 // 전체갯수 제외 (tr.nocnt)
			, is_firstNum : true //초기만 td.num html삽입 (total 갯수 Logic)

			, page : {
				is_viewAll : true // View All true 인지
				, scrollMode : false //Depth1 탭 클릭시 true: hash, false: scroll
			}
			, localStorage :  Storage.get(__g.projectID) || false
			, is_storage : $('html').hasClass('localstorage') ? true : false
			, storageObj : {} //localStorage 저장 객체
			, compareDefaultObj : ''// 초기 defaultObj 저장 하여 storageObj 와 비교

			, settingObj : {
				// data : {} , option : {} , search : {} , table : {}
			}
			, tableHeadObj : {
				label : []
				, class : []
			}
			, focusObj : null
			, navNum : rMap.tab_navList.size() -1 //1Depth length
			, winScroll : 0 //현재 스크롤
			, filterObj : {
				delete : true
				, group : true
				, open2 : false//2차 오픈 추가: 2020/03/10
				, child : true
			}
			, dataObj : {
				depSize : 1 //th.depth 수
				, folding_depth : null //2~n까지 폴딩 버튼 삽입(Default: 2미만 안보임)
				, debug_mode : false
				, test_mode : false
				, equal_text_view : false//테이블 같은 텍스트 안보이게 처리
			}
			, dateObj :{
				seperate : '/' //날짜 포맷
				, seperates_changes : ['-', '_', '.', ',', '/'] //seperate로 변경할 날짜 포맷 형식들
				, zeroFill : 2 // 1: 9/9, 2: 09/09
				, yearPrefix : '20'
				, datePeriodFlag : false // false: 전체기간, true: 기간설정
			}
			, searchOption : {
				viewMode :"select" //Search_head 관련 select or button //@TODO: search Option이 Filter일 경우(셀렉트박스 or 버튼타입 구분)
				, all_target_mode : true
			}
			, logObj : {
				isShowAll : false //Log 한줄 보기
			}
			, layerPopUrl :{//2023: 사용안함
				guide : '../_pub_guide/guide_sample/layerPop_worklist.html' //레이어팝업 가이드 URL
				, server : '../../' + __g.fileDir + '/' // 서버에서 레이어팝업 호출시 경로
				, local : '../../webApp/'  +__g.fileDir + '/' //로컬에서 레이어팝업 호출시 경로
			}
			, linkObj : {
				worklist : decodeURI(Util.getFileName()).split('.')[0]+'.worklist.html'
				, todo : decodeURI(Util.getFileName()).split('.')[0]+'.todo.html'
			}
		}
		, navMap = {
			overNum : -1
			, overNum2 : -1
			, overNum3 : -1
			, activeNum : __g.navNum //초기 전체 보기 활성화(View All)
			, activeNum2 : false
			, activeNum3 : false
		}
		, dataMap = {
			Odata : {
				ARindex : [] //depths별 인덱스(Default :0)
				, ARcnt : [] //depths별 카운트(Default :0)
				, ARtxt : []
				, List : []
			}
			, Onum : {
				// Len1 : [] //2Depths 수
				// , Pos2 : [] //2Depths 위치
			}
		}
	}

	var setHtml = function(){
		htmlMap = {
			infoSection : {
				filterBox : ''
					+'<div class="box filter_box">'
					+'	<h2>Filter</h2>'
					+'	<div class="box_wrap">'
					+'		<div class="filter_rate">'
					+'			<table>'
					+'				<caption>Filter</caption>'
					+'				<colgroup><col width="100px" /><col width="atuo" /></colgroup>'
					+'				<tbody>'
					+'					<tr>'
					+'						<th rowspan="2"><span class="total_rate">&nbsp;<span></th>'
					+'						<td class="filterOption">'
					+'							<p><strong>Delete</strong>'
					+'								<label><input type="radio" name="ch_del" id=del01 value="true"  /> 포함</label>'
					+'								<label><input type="radio" name="ch_del" id="del02" value="false" checked /> 제외</label>'
					+'							</p>'
					+'							<p class="ml10"><strong> Group</strong>'
					+'								<label><input type="radio" name="ch_group" id="gropu01" value="true" checked /> Yes</label>'
					+'								<label><input type="radio" name="ch_group" id=gropu02 value="false" /> No</label>'
					+'							</p>'
					+'							<p class="ml10"><strong> Child</strong>'
					+'								<label><input type="radio" name="ch_child" id="child01" value="true" checked /> Yes</label>'
					+'								<label><input type="radio" name="ch_child" id=child02 value="false" /> No</label>'
					+'							</p>'
					+'						</td>'
					+'					</tr>'
					+'					<tr>'
					+'						<td class="filter_btn">'
					+'							<div>'
					+'								<a href="javascript:void(0);" class="equal btn bullet" title="equal"><span>동일</span></a>'
					+'								<a href="javascript:void(0);" class="popup btn bullet" title="popup"><span>팝업</span></a>'
					+'								<a href="javascript:void(0);" class="del btn bullet" title="del"><span>삭제</span></a>'
					+'								<a href="javascript:void(0);" class="result btn bullet" title="result"><span>완료</span></a>'
					+'								<a href="javascript:void(0);" class="result_ex btn bullet" title="result_ex"><span>미완</span></a>'
					+'								<a href="javascript:void(0);" class="total btn bullet on" title="total"><span>Total</span></a>'
					+'							</div>'
					// +'							<div>'
					// +'								<a href="javascript:void(0);" class="new btn bullet" title="del"><span>신규</span></a>'
					// +'								<a href="javascript:void(0);" class="rework btn bullet" title="del"><span>재확인</span></a>'
					// +'								<a href="javascript:void(0);" class="hold btn bullet" title="del"><span>보류</span></a>'
					// +'							</div>'
					+'						</td>'
					+'					</tr>'
					+'					<tr>'
					+'						<th rowspan="2"><label for="id_search">Search</label></th>'
					+'						<td class="search">'
					+'							<input type="text" name="search" value="" id="id_search" placeholder="Search" />'
					+'						</td>'
					+'					</tr>'
					+'				</tbody>'
					+'			</table>'
					+'		</div>'
					+'	</div>'
					+'</div>'
			}
			, setting : {
				option : ''
					+'<div id="setting">'
					+'  <a href="javascript:void(0)" class="btn_setting"><span class="blind">Open</span></a>'
					+'  <div class="setting_panel">'
					+'    <div class="setting_top">'
					+'      <h2>Settings</h2>'
					+'      <a href="javascript:void(0)" class="btn_close"><i class="x"></i></a>'
					+'    </div>'
					+'    <div class="setting_wrap">'
					+'      <div class="setting_body">'
					+'        <div class="group">'//Data
					+'          <div class="option_area" data-option="data">'
					+'            <h3><label><input class="chkall" type="checkbox" name="ch_group01"><span>Data</span></label></h3>'
					+'            <ul class="option_list">'
					+'              <li><label><input type="checkbox" name="data"><span>Basic</span></label></li>'
					+'              <li><label><input type="checkbox" name="nav_depth2"><span>GNB Depth2</span></label></li>'
					+'              <li><label><input type="checkbox" name="table_folding"><span> Table Folding</span></label></li>'
					+'              <li><label><input type="checkbox" name="filter"><span> Filter</span></label></li>'
					+'            </ul>'
					+'          </div>'
					+'        </div>'
					+'        <div class="group">'//Option
					+'          <div class="option_area" data-option="option">'
					+'            <h3><label><input class="chkall" type="checkbox" name="ch_group01"><span>Option</span></label></h3>'
					+'            <ul class="option_list">'
					+'              <li><label><input type="checkbox" name="component"><span> Component</span></label></li>'
					+'              <li><label><input type="checkbox" name="quick"><span> Quick</span></label></li>'
					+'              <li><label><input type="checkbox" name="id_split"><span>ID Split</span></label></li>'
					+'              <li><label><input type="checkbox" name="scroll"><span> Page Scroll</span></label></li>'
					+'            </ul>'
					+'          </div>'
					+'        </div>'
					+'        <div class="group">'//Search
					+'          <div class="option_area" data-option="search">'
					+'            <h3><label><input class="chkall" type="checkbox" name="ch_group02"><span>Search</span></label></h3>'
					+'            <ul class="option_list"></ul>'
					+'          </div>'
					+'        </div>'
					+'        <div class="group">'//Table
					+'          <div class="option_area table_area" data-option="table">'
					+'            <h3><label><input class="chkall" type="checkbox" name="ch_group03"><span>Table Show</span></label></h3>'
					+'            <ul class="option_list"></ul>'
					+'          </div>'
					+'        </div>'
					+'        <div class="group">'//Etc
					+'          <div class="option_area" data-option="etc">'
					+'            <h3><strong>Etc</strong></h3>'
					+'            <div class="option_list">'
					// +'             <a href="javascript:void(0);" class="btn btn_check"><span>검수요청</span></a>'
					+'            	<a href="javascript:void(0);" class="btn btn_export"><span>Export</span></a>'
					+'            	<a href="javascript:void(0);" class="btn btn_report"><span>Report</span></a>'
					+'            	<a href="javascript:void(0);" class="btn btn_reset"><span>Reset</span></a>'
					+'            </div>'
					+'          </div>'
					+'        </div>'
					+'      </div>'
					+'      <div class="setting_footer">'
					+'      	<a href="javascript:void(0)" class="btn btn_action"><span>Save</span></a>'
					+'      </div>'
					+'    </div>'
					+'  </div>'
					// +'<div class="dimmed"></div>'
					+'</div>'
			}
			, quick : {
				bottom : ''
					+'<div class="quick_area">'
					+ '<div class="quick_wrap">'
					+   '<a href="javascipt:void(0);" class="btn_top"><span>↑</span></a>'
					+   '<a href="javascipt:void(0);" class="page_up"><span>∧</span></a>'
					+   '<a href="javascipt:void(0);" class="page_down"><span>∨</span></a>'
					+   '<a href="javascipt:void(0);" class="btn_bottom"><span>↓</span></a>'
					+ '</div>'
					+ '<div class="cate_wrap">'
					+   '<a href="javascipt:void(0);" class="cate_up"><span>↑</span></a>'
					+   '<a href="javascipt:void(0);" class="cate_down"><span>↓</span></a>'
					+ '</div>'
					+'</div>'
				// , content : '<span class="top_btn"><a href="javascript:void(0);" >↑top</a></span>'
			}
			, table : {
				fold : '<a href="javascript:;" class="btn_fold_depth fr on"><i></i></a>'
				, log : '<a href="javascript:;" class="btn_fold_log fr"><i></i></a>'
			}
			, colorbox : {
				menu : ''
					+'  <div class="footMenu ">'
					+'    <div class="optionBar clearfix">'
					+'      <div class="btn_area fl ">'
					+'        <a href="javascript:void(0);" class="btn_cbox close_btn"><span>닫기</span></a>'
					+'        <a href="javascript:void(0);" class="btn_cbox prev_btn"><span>이전</span></a>'
					+'        <a href="javascript:void(0);" class="btn_cbox next_btn"><span>다음</span></a>'
					+'        <a href="javascript:void(0);" class="btn resize_btn"><span>ReSize</span></a>'
					+'        <a href="javascrpt:void(0);" class="btn id_link" target="_blank"><span>Open</span></a>'
					+'        <strong class="cate" style="padding-left:3px;color:#555;"></strong> | <span class="page" style="padding-left:0px;color:#555; font-size:11px; letter-spacing:-1px"></span>'
					+'      </div>'
					+'      <div class="btn_area fr">'
					+'        <div class="info_area">'
					+'          <span class="id_txt">pageID</span>'
					// +'         <p class="menu_txt" style="margin:0;"><span class="page"></span></p>'
					+'        </div>'
					+'        <select name="" id="autoSelect">'
					+'          <option value="0.5">0.5</option>'
					+'          <option value="0.8">0.8</option>'
					+'          <option value="1" selected="selected">1.0</option>'
					+'          <option value="2">2.0</option>'
					+'          <option value="3">3.0</option>'
					+'        </select>'
					+'        <a href="javascript:void(0);" class="btn_cbox auto_btn"><span>Auto</span></a>'
					+'        <a href="javascript:void(0);" class="btn_cbox prev_btn"><span>이전</span></a>'
					+'        <a href="javascript:void(0);" class="btn_cbox next_btn"><span>다음</span></a>'
					+'        <a href="javascript:void(0);" class="btn_cbox close_btn"><span>닫기</span></a>'
					+'      </div>'
					+'    </div>'
					+'    <div class="resizeBar">'
					+'      <div class="control">'
					+'        <span class="bar s360" data-width="280"></span>'
					+'        <span class="bar s360" data-width="320"></span>'
					+'        <span class="bar s360" data-width="360"></span>'
					+'        <span class="bar s768" data-width="768"></span>'
					+'       	<span class="bar s1000" data-width="1000"></span>'
					+'        <span class="bar s1280" data-width="1280"></span>'
					+'       	<span class="bar s1440" data-width="1440"></span>'
					+'        <span class="bar s1600" data-width="1600"></span>'
					+'        <span class="bar s1920" data-width="1920"></span>'
					+'      </div>'
					+'      <div class="control">'
					+'      </div>'
					+'    </div>'
					+'</div>'
			}
			, popup :{
				template : ''
					+'<div class="modal">'
					+'  <div class="pop_area">'
					+'    <div class="pop_wrap">'
					+'      <div class="pop_head"></div>'
					+'      <div class="pop_con"></div>'
					+'      <div class="popFoot"></div>'
					+'      <a href="javascript:void(0)" class="btn_close"><i class="x"></i></a>'
					+'    </div>'
					+'  </div>'
					+'</div>'
				// , dimm : '<div class="dimmed"></div>'

				, exportWorklist : ''
					+'<div class="table_export">'
					+'	<div class="btn_wrap">'
					+'		<input class="chkall" type="checkbox" checked="checked" name="ch_export_all">'
					+' 		<a href="javascript:void(0);" class="btn btn_copy"><span> Export</span></a>'
					+'  </div>'
					+'  <div class="table_export_head">'
					+'    <table class="fixed">'
					+'      <colgroup></colgroup>'
					+'      <thead>'
					+'        <tr></tr>'
					+'      </thead>'
					+'      <tbody>'
					+'        <tr><td colspan="11" style="display:none;">&nbsp;</td></tr>'
					+'      </tbody>'
					+'    </table>'
					+'  </div>'
					+'  <div class="tab_contents_wrap table_export_body">'
					+'    <table width="100%;">'
					+'      <colgroup></colgroup>'
					+'      <tbody></tbody>'
					+'    </table>'
					+'  </div>'
					+'</div>'
			}
			, dimm : $('body').append('<div class="dimmed"></div>')
		}
	}

	/**
	 * project
	 * --------------------------------------
	 * 1. Date 설정
	 * 1. Title 설정(title, HeadTitle, Depth1)
	 */
	var project = (function(){
		var setDate = function(){
			__projectDate.projectStartDate = Data.dateFormat(__projectDate.projectStartDate);
			__projectDate.projectEndDate = Data.dateFormat(__projectDate.projectEndDate);

			if(!__g.dateObj.datePeriodFlag){
				__projectDate.projectStartDate_ORI = __projectDate.projectStartDate
				__projectDate.projectEndDate_ORI = __projectDate.projectEndDate
			}

			var ARstart = __projectDate.projectStartDate.split(__g.dateObj.seperate);
			var ARend = __projectDate.projectEndDate.split(__g.dateObj.seperate);

			__projectDate.error =false;//Error
			if(Number(ARstart[0]) > Number(ARend[0])) __projectDate.error = 'year';
			if(Number(ARstart[0]) == Number(ARend[0]) && Number(ARstart[1]) > Number(ARend[1])) __projectDate.error = 'month';
			if(Number(ARstart[0]) == Number(ARend[0]) && Number(ARstart[1]) == Number(ARend[1]) && Number(ARstart[2]) > Number(ARend[2])) __projectDate.error = 'date';

			__projectDate.startYear = ARstart[0];
			__projectDate.startMonth = ARstart[1];
			__projectDate.startDate = ARstart[2];
			__projectDate.endYear = ARend[0];
			__projectDate.endMonth = ARend[1];
			__projectDate.endDate = ARend[2];

			__projectDate.totalYear = Number(__projectDate.startYear);
			__projectDate.totalMonth = Number(__projectDate.startYear);
			__projectDate.totalWeek = 0;
			__projectDate.totalDate = 0;
			__projectDate.totaHoliday  = 0;

			__projectDate.ARyear = [Number(__projectDate.startYear)];
			__projectDate.ARmonth = [Number(__projectDate.startMonth)];
			__projectDate.ARweek = [];

			setPeriod();
		}

		, setPeriod = function(){
			var periodYear = Number(__projectDate.endYear - __projectDate.startYear)
				, firstMonth = Number(__projectDate.startMonth)
				, lastMonth = Number(__projectDate.endMonth)
				, firstMonthCnt = firstMonth + (12 - firstMonth)
				, yearCnt = 0
				, monthCnt = 0
			;

			for(var yy =0; yy <= periodYear; yy++){
				//project 기간이 같은 해일때
				if(periodYear == 0){
					for(var i = (firstMonth + 1); i <= lastMonth; i++) {
						__projectDate.ARmonth.push(i);
						__projectDate.ARyear.push(Number(__projectDate.startYear));
						monthCnt++;
					}
				}
				//project 기간이 1년 이상일때
				else{
					if(yy ==0){//첫해
						for(var i = (firstMonth + 1); i <= firstMonthCnt; i++) {
							__projectDate.ARmonth.push(i);
							__projectDate.ARyear.push(Number(__projectDate.startYear));
							monthCnt++;
						}
					}else if(yy == periodYear){//마지막해
						for(var i = 1; i <= lastMonth; i++) {
							__projectDate.ARmonth.push(i);
							__projectDate.ARyear.push(Number(__projectDate.startYear) + yearCnt)
							monthCnt++;
						}
					}else{//중간해(1년 초과)
						for(var i = 1; i <= 12; i++) {
							__projectDate.ARmonth.push(i);
							__projectDate.ARyear.push(Number(__projectDate.startYear) + yearCnt)
							monthCnt++;
						}
					}
					yearCnt ++;
				}
			}

			__projectDate.totalMonth = monthCnt;
			__projectDate.totalYear = (monthCnt/12).toFixed(2);
		}

		, setTitle = function(){
			var $h1 = rMap.body.find('#wrap > h1');
			var $title = $('html head').find('title');
			var projectName = $h1.html() || Util.getProjectName();
			var listName = rMap.body.data('page') || 'worklist';
			listName = listName.toUpperCase();

			//title
			$title.find('>*').empty().remove();
			$title.text(listName +' | '+ projectName);

			//h1
			$h1.find('>*').empty().remove();
			$h1.html('<a href="worklist.html">'+projectName+'<small> '+listName+'</small></a>')

			//tab_title
			//h3 요소에 header > .tab_nav 기본 가져옮
			//텍스트 있을경우 Depth1 (텍스트)
			rMap.tab_navList.each(function(i){;
				var tabTitle = $(this).find('> a > span').text() || '';
				var $targetTab = rMap.tab_content.eq(i);
				var $h3 = $targetTab.find('h3');
				var h3Title = $h3.text() || '';

				if(!!h3Title){
					$h3.data('dir', h3Title);
					h3Title = '('+$h3.text().trim()+')';
				}

				$h3.text('');
				$h3.prepend('<span class="title" style="color:#666;">'+tabTitle+' </span>'+h3Title);
			});
		}

		, initModule = function(){
			setDate();
			setTitle();
		}

		return{
			initModule : initModule
			, setDate : setDate
		}
	})();


	var directory = (function(){
		function isFile(str){
			var fileType = [
				'html','htm',
				'css', 'scss', 'sass', 'less',
				'js', 'json',
				'jpg', 'jpeg', 'png', 'gif',
				'pptx', 'doc', 'excel', 'pdf',
				'eot', 'woff', 'otf',
				'md'
			];

			for(var i = 0; i <= fileType.length-1; i++){
				if(str.trim().toLowerCase() == fileType[i]) return true;
			}
			return false;
		}

		function isIMG(str){
			var fileType = ['jpg', 'jpeg', 'png', 'gif'];
			for(var i = 0; i <= fileType.length-1; i++){
				if(str.trim().toLowerCase() == fileType[i]) return true;
			}
			return false;
		}


		var setType = function(){
			rMap.tab_content.each(function(){
				var $table = $(this);
				var dataPath1 = $table.find('h3').data('path') || '';
				var dataPath2 = $table.find('h3').data('path2') || false;

				$(this).find('table tbody > tr').each(function(){
					var $tr = $(this);
					var filePath = '';
					var fileStr = '';

					$tr.find('> td[class*="depth"]').each(function(i){
						fileStr += $(this).text();
						if($(this).text() != '') filePath += '/' + $(this).text();
					});

					if(fileStr.search('\\.') != -1){
						//Type: File Extension:  select Option 과 연결
						var ARfileStr = fileStr.split('.');
						var fileType = (ARfileStr[ARfileStr.length - 1]).trim();

						//01.Publish
						if(isFile(fileType)) {
							$tr.find('.type').text(fileType);

							//Path
							var ARfilePath = filePath.split('/');
							var fileName = ARfilePath[ARfilePath.length - 1];
							var localPath = (dataPath1 + filePath).replaceAll('//', '/');
							var serverPath = dataPath2 ? (dataPath2 + filePath).replaceAll('//', '/') : false;

							// 링크 예외  [data-path="hide"]
							if($table.data('path') != 'hide' && $(this).data('path') != 'hide'){
								var localLink =  '<a href="'+localPath+'" target="_blank">'+fileName+'</a>'
								var serverLink =  '<a href="'+serverPath+'" target="_blank">'+fileName+'</a>'

								if(isIMG(fileType)){
									localLink = ''
										+'<a href="'+localPath+'" target="_blank" style="display:block;text-align:center;">'
										+	'<img src="'+localPath+'" alt="" style="max-width:40px; max-height:25px;vertical-align:middle;">'
										+'</a>'
									;

									serverLink = ''
										+'<a href="'+serverPath+'" target="_blank" style="display:block;text-align:center;">'
										+	'<img src="'+serverPath+'" alt="" style="max-width:40px; max-height:25px;vertical-align:middle;">'
										+'</a>'
									;
								}

								$tr.find('.path').html(localLink);
								if(serverPath) $tr.find('.path2').html(serverLink);

								//tst
								// $tr.find('.log').html(localPath);
							}else{
								$tr.find('.path').text('N/A');
								$tr.find('.path2').text('N/A');
							}

						}else{
							//Type: Dir
							$tr.find('.type').html('<span style="color:#ddd">dir</span>');
						}
					}else{
						//Type: Dir
						$tr.find('.type').html('<span style="color:#ddd">dir</span>');
					}
				});
			});
		}


		var setLink = function(){

		}

		var initModule = function(){
			if(rMap.body.data('page') == 'directory' || rMap.body.data('page') == 'resource'){
				setType();
			}
		}
		return{
			initModule : initModule
		}
	})();


	/**
	 * Storage
	 * --------------------------------------
	 * 전체 공통 storage 와 개별 Storage 구분
	 * 1. 초기설정 -> storage에 한번도 저장 이력 없을시 실행
	 * 2. 초기강제설정 및 storage 설정 불가 항목
	 * 3. setting 에서 설정 -> storage 저장
	 * setting: {
	 *  true : check, enabled
	 *  false: check, enabled
	 *  O : check, disabled
	 *  X : uncheck, disabled
	 * }
	 */
	var Storage = (function(){
		var set = function(obj, val){
			_set(__g.projectID, JSON.stringify(__g.storageObj));
		}

		, get = function(obj){
			return _get(__g.projectID);
		}

		, remove = function(key){
			localStorage.removeItem(key);
		}

		, _set = function(name, val){
			window.localStorageAlias = window.localStorage;
			if(!$('html').hasClass('localstorage')){
				window.localStorageAlias = {};
				window.localStorageAlias.removeItem = function () { };
			}else{
				if (typeof (Storage) !== "undefined") {
					localStorage.setItem(name, val);
				} else {
					window.alert('로컬스토리지를 지원하지 않는 브라우저입니다.');
				}
			}
		}

		, _get = function(name){
			window.localStorageAlias = window.localStorage;
			if(!$('html').hasClass('localstorage')){
				window.localStorageAlias = {};
				window.localStorageAlias.removeItem = function () { };
			}else{
				if (typeof (Storage) !== "undefined") {
					return localStorage.getItem(name);
				} else {
					window.alert('로컬스토리지를 지원하지 않는 브라우저입니다.');
				}
			}
		}

		, initModule = function(){
			__g.localStorage = get(__g.projectID) || false;
			__g.storageObj= __g.localStorage ? JSON.parse(__g.localStorage) : __g.defaultObj;

			__g.defaultObj[__g.device] = __g.defaultObj[__g.device] || {};
			__g.defaultObj[__g.device].setting = __g.defaultObj[__g.device].setting || {};
			__g.defaultObj[__g.device].colorBox = __g.defaultObj[__g.device].colorBox || {};
			__g.defaultObj[__g.device].headerFolding = __g.defaultObj[__g.device].headerFolding || {};

			__g.storageObj[__g.device] = __g.storageObj[__g.device] || {};
			__g.storageObj[__g.device].setting = __g.storageObj[__g.device].setting || {};
			__g.storageObj[__g.device].colorBox = __g.storageObj[__g.device].colorBox || {};
			__g.storageObj[__g.device].headerFolding = __g.storageObj[__g.device].headerFolding || {};

			//비교
			// __g.compareDefaultObj = JSON.stringify(__g.defaultObj)
			// console.log(JSON.stringify(__g.defaultObj))
			// __g.storageObj.saveDefault = __g.compareDefaultObj

			if(__g.is_storage){//기존 스토리지 제거
				//remove('worklistnew');
			}
		}

		return{
			initModule : initModule
			, set : set
			, get : get
			, remove : remove
		}
	})();


	/**
	 * Setting
	 * --------------------------------------
	 */
	var Setting = (function(){
		var bool = function(b){
			if(typeof b === "boolean"){return b;}
			else if(typeof b === "string" && (b.toLowerCase() == "true" || b.toLowerCase() == "y" || b.toLowerCase() == "o")){return true;}
			else if(typeof b === "string" && (b.toLowerCase() == "false"|| b.toLowerCase() == "n" || b.toLowerCase() == "x")){return false;}
			else{return false;}
		}

		, init = function(_arg){
			var target = _arg.target
				, $optionGroup = $('#setting .option_area[data-option ="'+target+'"]')
				, setOption = $optionGroup.data('option')
				, $chkObj = $optionGroup.find('input[type=checkbox]:not(.chkall)')
			;

			if(!__g.storageObj[__g.device].setting[target]) __g.storageObj[__g.device].setting[target] =[];
			if(!__g.defaultObj[__g.device].setting[target]) __g.defaultObj[__g.device].setting[target] =[];

			__g.settingObj[setOption] ={};//동적 Object 생성

			$chkObj.each(function(i){// Chk 저장
				var name = $(this).attr('name')
				__g.settingObj[setOption][name] = false;
			});

			//init
			var objCnt =0;
			for(var name in __g.settingObj[target]){
				if(!!!name) return;

				var $chkbox = $('input[name="'+name+'"]');
				$chkbox.attr('data-index', objCnt);//현재 index 저장

				//스토리지 객체 데이터 저장
				__g.settingObj[target][name] = __g.storageObj[__g.device].setting[target][objCnt];

				if(Setting.bool(__g.storageObj[__g.device].setting[target][objCnt])) $chkbox.prop('checked', true);
				else $chkbox.prop('checked', false);

				if(__g.settingObj[target][name] === "O") {
					$chkbox.attr('disabled', true);
					$chkbox.prop('checked', true);
				}

				if(__g.defaultObj[__g.device].setting[target][objCnt] === "X") {
					__g.settingObj[target][name] = "X";
					$chkbox.attr('disabled', true);
					$chkbox.prop('checked', false);
				}

				if(__g.defaultObj[__g.device].setting[target][objCnt] === "O") {
					__g.settingObj[target][name] = "O";
					$chkbox.attr('disabled', true);
					$chkbox.prop('checked', true);
				}

				//data groups > data-group(GNB Depth2, Table Folding, Filter)은 Data가 체크 되어 있으면 모두 Disabled 해제
				// 초기 data-storage-force 값이 N 일경우는 disabled로 (EX. TODO LIST )
				if(target =='option' && $chkbox.hasClass('data_group')){
					if(__g.storageObj[__g.device].setting[target][0] == true) { //Data 가 체크 되 어 있을시 하위 그룹 선택가능
						$chkbox.attr('disabled', false);
					}
					if(__g.defaultObj[__g.device].setting[target][objCnt] === "X") { // X 일 경우에도 체크 할수 없음
						$chkbox.attr('disabled', true);
						$chkbox.prop('checked', false)
						$chkbox.removeClass('data_group')
					}
				}

				objCnt++;
			}

			optionCheck(_arg);
		}

		, optionCheck = function(_arg){
			var target = _arg.target;

			//전체 체크
			var $optionGroup = $('#setting .option_area[data-option ="'+target+'"]')
				, $chkAll = $optionGroup.find('.chkall')
				, $chkObj = $optionGroup.find('input[type=checkbox]:not(.chkall)')
				, len = $chkObj.length

				, $chkObj_enable = $optionGroup.find('input[type=checkbox]:not(.chkall):not(:disabled)') //enabeld All
				, len_enable = $chkObj_enable.length

				, $chkObj_disable = $optionGroup.find('input[type=checkbox]:not(.chkall):disabled') //disabled All
				, len_disable = $chkObj_disable.length

				, $chkObj_enable_true = $optionGroup.find('input[type=checkbox]:not(.chkall):checked:not(:disabled)') //enabled checked
				, len_enable_true = $chkObj_enable_true.length

				, $chkObj_disable_true = $optionGroup.find('input[type=checkbox]:not(.chkall):disabled:checked') //disabled checked
				, len_disable_true = $chkObj_disable_true.length

				, $chkObj_true = $optionGroup.find('input[type=checkbox]:not(.chkall):checked') //checked All
				, len_true = $chkObj_true.length

				, $chkObj_false = $optionGroup.find('input[type=checkbox]:not(.chkall):not(:checked)') //unchecked All
				, len_false = $chkObj_false.length

				, chkedLen = $optionGroup.find('input[type=checkbox]:not(.chkall):checked:not([disabled])').length// chkall 제외 체크된 수
				, checkedLen_dis = $optionGroup.find('input[type=checkbox]:not(.chkall):disabled').length// chkall 제외 체크된 수
			;

			// console.log(target, ' : 전체', len)
			// console.log('enable', len_enable, '\t\t\tdisable', len_disable)
			// console.log('enable_true', len_enable_true, '\t\tdisable_true', len_disable_true)
			// console.log('true', len_true, '\t\t\t\tfalse', len_false)
			// console.log('---------')

			//전체체크 Init :
			//체크 가능 갯수와 체크 수 같으면 : checkAll Check
			// if (len_enable === len_true && !!len_true) {
			if (len_enable === len_enable_true && !!len_enable_true) {
				$chkAll.prop('checked', true).change();
			}
			if (len_disable === len_disable_true && !!len_disable_true && len_enable === 0) {
				$chkAll.prop('checked', true).change();
			}

			if(len === len_disable){
				$chkAll.attr('disabled', true);
			}

			if (len_enable === len_enable_true && !!len_enable) {
				$chkAll.prop('checked', true).change();
			}

			$(document).off('click.option_chk_'+target).on(
				'click.option_chk_'+target
				, '[data-option ="'+target+'"] input[type=checkbox]'
				, function() {
					chkedLen = $optionGroup.find('input[type=checkbox]:not(.chkall):not(:disabled):checked').length;

					if (!!!$(this).hasClass('chkall')) {//개별체크
						if (len_enable === chkedLen) {
							$chkAll.prop('checked', true).change();
							$chkObj_enable.prop('checked', true).change();
						} else {
							$chkAll.prop('checked', false).change();
						}
					}else {//전체 체크
						if($chkAll.prop('checked')){
							$chkAll.prop('checked', true).change();
							$chkObj_enable.prop('checked', true).change();
						}else{
							$chkAll.prop('checked', false).change();
							$chkObj_enable.prop('checked', false).change();
						}
					}
				}
			);

			$chkObj.each(function(i){
				$(this).change(function(){
					var index = $(this).data('index')
						, name = $(this).attr('name')
						, str = ''
					;

					//강제 적용은 스토리지 저장 제외
					if(__g.defaultObj[__g.device].setting[target][index] === "X") return;
					if(__g.defaultObj[__g.device].setting[target][index] === "O") return;

					if($(this).prop('checked')) str = true;
					else if($(this).attr('disabled', false)) str = false;

					__g.storageObj[__g.device].setting[target][index] = str;
				});
			});

			//option > Data 연계되어 있는 요소
			if(target =='option'){
				$('input[name="data"]').change(function(){
					var index = $(this).data('index');
					var str = '';
					if($(this).prop('checked')) {
						str = true;
						$('.data_group').attr('disabled', false);
					}else {
						str = false;
						$('.data_group').attr('disabled', true);
						$('.data_group').prop('checked', false).change();
					}
					__g.storageObj[__g.device].setting[target][0]= str;
				});
			}
		}

		, _saveHandler = function(){
			$('#setting .btn_action').on('click', function(){
				Storage.set();
				location.reload();
			});

			$('#setting .btn_reset').on('click', function(){
				Storage.remove(__g.projectID);
				location.reload();
			});
		}

		, _appendLayout = function(){
			rMap.body.prepend(htmlMap.setting.option);

			$('#setting .btn_setting').on('click', function(){open();});
			$(document).off('click.setting').on('click.setting', '.setting_on .dimmed, .setting_on .btn_close', function(){
				close();
			});
		}

		, _appendTableShow_Search = function(){
			var $settingTableShow =$('#setting').find('.option_area[data-option="table"] .option_list'); //Table Show
			var $settingSearch =$('#setting').find('.option_area[data-option="search"] .option_list'); // Search

			rMap.tab_content.eq(0).find('> table > thead > tr th').each(function(i){
				var className = $(this).attr('class');
				var labelName = $(this).text().split(' ')[0];
				__g.tableHeadObj.label[i] = labelName;
				__g.tableHeadObj.class[i] = className;
				$settingTableShow.append('<li><label><input type="checkbox" name="t_'+className+'"><span>'+labelName+'</span></label></li>');
				$settingSearch.append('<li><label><input type="checkbox" name="'+className+'"><span>'+labelName+'</span></label></li>');
			});

			setTimeout(function(){
				__g.settingObj.table2 = {}
				for(var i= 0; i < __g.tableHeadObj.class.length; i++){
					var className = __g.tableHeadObj.class[i];

					// Setting 테이블만 보이게 : 나머지는 삭제
					if(!!!Setting.bool(__g.settingObj.table["t_"+className])) rMap.tab_content.find('.'+className).remove();
				}
			},10)
		}

		, open =function(){
			rMap.body.addClass('setting_on');
		}

		, close =function(){
			rMap.body.removeClass('setting_on');
		}

		, initModule = function(_callback){
			_appendLayout();
			_appendTableShow_Search();
			init({target : 'data'});
			init({target : 'option'});
			init({target : 'search'});
			init({target : 'table'});
			_saveHandler();

			if(_callback) _callback();
		}
		return {
			initModule : initModule
			, open : open
			, close : close
			, bool : bool
		}
	})();


	/**
	 * Search
	 * --------------------------------------
	 * week, corder
	 */
	var Search = (function(){
		var thisMap = {}

		var setMap = function(_arg){
			thisMap ={
				// all_target_mode: (true: 전체 테이블 카테고리 , false: 해당 테이블 카테고리)
				all_target_mode : __g.searchOption.all_target_mode
				, searchOn : false
			}
		}

		//전체 테이블 검색
		, set = function(_arg, _callback){
			var labelName =_arg.label
				, targetClass = _arg.class
				, sortType = _arg.sort
				, $target = $('.tab_contents_wrap thead').find('.'+targetClass)
				, $target_search = $('#content').find('td.'+targetClass)
				, ARfind = []
			;

			__g.settingObj.search_classes =[];
			if(targetClass == 'tag') $target_search = $target_search.find('> span');
			if(targetClass == 'log') $target_search = $target_search.find('> dl');

			$target_search.each(function(index, el) {
				if(targetClass == 'tag') ARfind.push($(this).text());
				else if(targetClass == 'log') ARfind.push($(this).find('> dt').text());
				else ARfind.push($(this).text());
			});

			//중복제거
			var ARcopy = ARfind.filter(function(item, idx) {
				return ARfind.indexOf(item) == idx;
			});

			if(sortType == 'date') ARcopy = Helper.sortDate(ARcopy);
			else ARcopy = Helper.sortStr(ARcopy);

			$target.html('<div class="search_select_area"><label>'+labelName+' </label><select class="se_'+targetClass+'"><option value="all">'+labelName+'</option></div>');

			for ( var i = 0; i < ARcopy.length; i++ ) {
				var str = ARcopy[i] ? ARcopy[i] : ''
				$('select', $target).append('<option value=' + str +'>' + str + '</option> ');
			}

			if(_callback) _callback($target, targetClass, _arg);
		}

		//개별 테이블 검색(thisMap.all_target_mode 변경 이후)
		, set_one = function(_arg, _callback){
			var $table = $('.tab_contents_wrap');

			$table.each(function(){
				var $curTable = $(this)
					, labelName =_arg.label
					, targetClass = _arg.class
					, sortType = _arg.sort
					, $target = $(this).find('thead').find('.'+targetClass)
					, $target_search =  $(this).find('td.'+targetClass)
					, ARfind = []
				;

				if(targetClass == 'tag') $target_search = $target_search.find('> span');
				if(targetClass == 'log') $target_search = $target_search.find('> dl')
				//Data Init
				$target_search.each(function(index, el) {
					if(targetClass == 'tag') ARfind.push($(this).text());
					else if(targetClass == 'log') ARfind.push($(this).find('> dt').text());
					else ARfind.push($(this).text());
				});

				//중복제거
				var ARcopy = ARfind.filter(function(item, idx) {
					return ARfind.indexOf(item) == idx;
				});

				if(sortType == 'date') ARcopy = Helper.sortDate(ARcopy);
				else ARcopy = Helper.sortStr(ARcopy);

				$target.html('<div class="search_select_area"><label>'+labelName+' </label><select class="se_'+targetClass+'"><option value="all">'+labelName+'</option></div>');

				for ( var i = 0; i < ARcopy.length; i++ ) {
					var str = ARcopy[i] ? ARcopy[i] : ''
					$('select', $target).append('<option value=' + str +'>' + str + '</option> ');
				}

				if(_callback) _callback($target, targetClass, _arg);
			});
		}

		, eventHandler = function($target, targetClass, _arg){
			$('select', $target).off().on('change', function(e){
				var $this = $('option:selected', $(this))
					, val = $this.val()
					, val_text = $this.text()
					, name = $(this).attr('class')
					, index = $this.index()
					, $trs = rMap.contentTrs
				;

				var $desc;
				if(targetClass == 'tag') $desc = $trs.find('> span');
				if(targetClass == 'log') $desc = $trs.find('> dl');

				thisMap.searchOn = true;

				var $curTable =$('.tab_contents_wrap');

				if(!thisMap.all_target_mode){ //개별 테이블 모드 일때
					$curTable = $(e.target).closest('.tab_contents_wrap')
					$trs = $curTable.find("tbody tr");
				}
				else{
					//init(주변 셀렉트 초기화)
					$this.closest('th').siblings().find('.search_select_area').find('option').prop('selected', false);
					$this.closest('.tab_contents_wrap').siblings().each(function(){
						$(this).find('.search_select_area').find('option').prop('selected', false);
						$(this).find('.'+name).find('option').eq(index).prop('selected', true).siblings().prop('selected', false);
					});
				}

				if(val == 'all'){
					$trs.show().removeClass('sortOn');
					$curTable.find('thead .search_cnt').remove();

					if(targetClass == 'tag') Component.active('All');
					return;
				}else{
					var totalCnt=0;

					if(targetClass == 'tag') Component.active(val_text);

					$trs.each(function(i){
						var $tr = $(this);
						$tr.hide().removeClass('sortOn');
						//[tag]
						if(targetClass == 'tag'){
							$tr.find('.'+targetClass).find('> span').each(function(){
								if($(this).text() === val_text){
									$tr.show().addClass('sortOn');
									totalCnt++;
								}
							});
						}
						//[log]
						else if(targetClass == 'log'){
							$tr.find('.'+targetClass).find('> dl').each(function(){
								if(!__g.logObj.isShowAll) $(this).hide();
								if($(this).find('> dt').text() === val_text){
									if(!__g.logObj.isShowAll) $(this).show();//desc
									$tr.show().addClass('sortOn');
									totalCnt++;
								}
							});
						}
						else{
							if($tr.find('.'+targetClass).text() === val_text){
								$tr.show().addClass('sortOn');
								totalCnt++;
							}
						}
					});
					$curTable.find('thead .search_cnt').remove();
					$(this).before('<div class="search_cnt">'+totalCnt+'</div>');
				}
			});
		}

		//table에 select박스로 삽입
		, init = function(){
			rMap.tab_content.eq(0).find('> table > thead > tr th').each(function(i){
				var className = $(this).attr('class')
					, labelName = $(this).text().split(' ')[0]
					, sortType = (className =='num' || className =='ddate' || className =='rdate' || className =='log') ? "date" : "string"
				;

				if(Setting.bool(__g.settingObj.search[className])){
					if(!thisMap.all_target_mode) set_one({label: labelName, class: className, sort: sortType}, eventHandler);
					else set({label: labelName, class: className, sort: sortType}, eventHandler);
				}
			});
		}

		, reset = function(){
			if(__g.filterObj.delete) {//삭제 포함: 전체
				rMap.tab_content.find("tbody tr").show().removeClass('sortOn');
			}else{
				rMap.tab_content.find("tbody tr:not(.del)").show().removeClass('sortOn');
			}
		}

		, initModule =function(){
			setMap();
			reset();
			init();
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * Search
	 * --------------------------------------
	 * 상단 Header Info 영역에 Search Make,  Type: select or button(현재 주석처리)
	 */
	var Search_header = (function(){
		var inspectSearch = function(_target, _val){
			var $trs = rMap.contentTrs;
			if(_val == 'all'){
				$trs.show();
				return;
			}
			$trs.hide();
			$trs.each(function(){
				if($(this).find(_target).text() == _val){
					$(this).show();
				}
			});
		}

		, update =function(){
		}

		, reset =function(){
		}

		//header .info_section에 삽입: 추후 작업예정
		, set = function(_arg, _callback){
			var labelName =_arg.label
				, targetClass = _arg.class
				, sortType = _arg.sort
				, viewMode = _arg.viewMode ? _arg.viewMode : __g.searchOption.viewMode // Type : select  or button
				, targetName ='filter_'+targetClass
			;

			$('.box.search_box').append('<div class="box_wrap '+targetName+'"></div>');

			var $target = $('.'+targetName)
				, $target_search = $('td.'+targetClass)
				, ARfind = []
			;

			//Data Init
			$target_search.each(function(index, el) {
				ARfind.push($(this).text());
			});

			//중복제거
			var ARcopy = ARfind.filter(function(item, idx) {
				return ARfind.indexOf(item) == idx;
			});

			//비교
			if(sortType == 'date') ARcopy = Helper.sortDate(ARcopy);
			else ARcopy = Helper.sortStr(ARcopy);

			//Append
			if(viewMode != "select"){
				//viewMode : select
				for ( var i = 0; i < ARcopy.length; i++ ) {
					$target.append('<a href="javascript:void(0);" class="'+targetClass+' btn"><span>' + ARcopy[i] + '</span></a> ');
				}
				$('.btn', $target).on('click', function(){
					var val = $(this).text();
					inspectSearch($target_search.selector, val)
				});
			}else{
				//viewMode : Button Case
				//infosection insert
				$target.append('<div class="search_select_area"><label>'+labelName+' </label><select><option value="all">'+labelName+'</option></div>');
				for ( var i = 0; i < ARcopy.length; i++ ) {
					$('select', $target).append('<option>' + ARcopy[i] + '</option> ');
				}

				$('select', $target).on('change', function(){
					var val = $('option:selected', $(this)).val();
					inspectSearch($target_search.selector, val)
				});
			}

			if(_callback) _callback();
		}

		, init =function(){
			$('.info_section').find('.filter_box').after('<div class="box search_box"><h2>Search.</h2></div>');
			if(Setting.bool(__g.settingObj.search.corder)) set({label: '담당자', class: 'corder', sort: 'string'}, function(){});
			if(Setting.bool(__g.settingObj.search.ddate)) set({label: '예정', class: 'ddate', sort: 'date'}, function(){});
			if(Setting.bool(__g.settingObj.search.rdate)) set({label: '완료', class: 'rdate', sort: 'date'}, function(){});
			if(Setting.bool(__g.settingObj.search.pdate)) set({label: '검수대상', class: 'pdate', sort: 'string'}, function(){});
			if(Setting.bool(__g.settingObj.search.mdate)) set({label: '고객검수', class: 'mdate', sort: 'string'}, function(){});
		}

		, initModule =function(){
			init();
		}

		return {
			initModule: initModule
		}
	})();


	/**
	 * Data
	 * --------------------------------------
	 * Depths별 셋팅
	 * 날짜 포맷 셋팅: "/" 로 치환, 월/일: 0 제거
	 * Table Data 초기화: 좌우 공백제거, 날짜 포맷, TableFolding 연동
	 */
	var Data = (function(){
		var var_init = function(){
			//2Depths 사이즈 : 2Depths ~ => depSize + 1
			//th.depth 클래스 수로 저장
			var $th = rMap.tab_content.eq(0).find('thead > tr > th');
			var depSize = 1;
			$th.each(function(){
				if($(this).attr('class').search('depth') != -1) depSize++;
			});

			__g.dataObj.depSize = depSize;
			__g.dataObj.folding_depth = depSize;

			//Object Setting : Onum
			for(var i=1; i<= __g.dataObj.depSize; i++){
				dataMap.Onum['Len'+i] = []; //Depths 수
				if(i > 1) dataMap.Onum['Pos'+i] = []; //Depths 위치
			}
		}

		//날짜 포맷 셋팅
		, dateFormat = function(_str){
			var dateStr = _str.replaceAll(' ', '');
			for(var i=0; i<=__g.dateObj.seperates_changes.length -1; i++){
				if(__g.dateObj.seperates_changes[i] != __g.dateObj.seperate){
					dateStr = dateStr.replaceAll(__g.dateObj.seperates_changes[i], __g.dateObj.seperate);
				}
			}
			var ARstr = dateStr.split(__g.dateObj.seperate);
			var strTmp = '';

			for(var i = 0; i<ARstr.length; i++){
				if(!isNum(ARstr[i])) return;//숫자 아닐때
				if(i == ARstr.length-1) strTmp += Number(ARstr[i]).zf(__g.dateObj.zeroFill); //일짜 뒤 '/' 삭제
				else strTmp += Number(ARstr[i]).zf(__g.dateObj.zeroFill) + __g.dateObj.seperate;
			}

			if(isNull(strTmp) || isNull(dateStr) || dateStr.length < 2) strTmp= dateStr;
			return strTmp;
		}

		, dateChange = function($date){
			var dateStr = $date.text()
				, formatStr = String(dateFormat(dateStr))
				, strFullTmp = ''
				, monthNum = Number(formatStr.split(__g.dateObj.seperate)[0])
			;

			//날짜 기준 년도 삽입: (Only, 1년미만 프로젝트)
			for(var i=0; i<__projectDate.ARmonth.length; i++){
				if(String(__projectDate.ARmonth[i]) == String(monthNum)) strFullTmp = __projectDate.ARyear[i] + __g.dateObj.seperate+formatStr
			}

			if(isNull(formatStr) || isNull(dateStr) || dateStr == __g.dateObj.seperate || dateStr.length < 2) {
				$date.attr('data-date', dateStr);
				$date.text(dateStr);
			}else{
				$date.attr('data-date', strFullTmp);
				$date.text(formatStr);
			}
		}

		//Table Data 초기화
		, data_init = function(){
			var tmp = {}
				, depNum = __g.dataObj.depSize
			;

			var $td = rMap.tab_content.find('tbody >tr >td:not(.num, .log)');
			var $log = rMap.tab_content.find('tbody >tr >td.log');
			$td.each(function(){
				$(this).html(lrtrim($(this).html()));
				var className = $(this).attr('class');
				if(className =='num' || className =='ddate' || className =='rdate'){
					dateChange($(this));
				}
			});

			$log.find('> dl').find('> dt').each(function(){//[Log]
				dateChange($(this));
			});

			//TR 셋팅
			rMap.tab_content.each(function(i){
				//변수셋팅
				for(var j = 1; j <= depNum; j++){
					if(j == 1){
						tmp.txt1 = lrtrim(rMap.tab_navList.eq(i).find('>a').text());
						tmp.index1 = i;
						tmp.cnt1 = -1;
					}else{
						tmp['txt'+j] = '';
						tmp['index'+j] = -1;
						tmp['cnt'+j] = -1;
					}
				}

				var ARindex = dataMap.Odata.ARindex[i] = []
					, ARcnt = dataMap.Odata.ARcnt[i] = []
					, ARtxt = dataMap.Odata.ARtxt[i] = []
					, Olist = dataMap.Odata.List[i] = []
					, headers = $(this).find('thead > tr > th')
					, cur = {} //cur.txt1
				;

				//tBody >tr
				$(this).find('tbody >tr').each(function(ii, row){

					for(var jj = 2; jj <= depNum; jj++){
						cur['txt'+jj] = $(this).find('> td.depth'+jj).text();
					}
					tmp.cnt1++;

					//------------------------------
					//초기시 //!txt2
					//------------------------------
					if(cur.txt2 !='' && cur.txt2 != tmp.txt2){//이전 뎁스 메뉴와 같지 않으면
						tmp.txt2 = cur.txt2;
						tmp.index2++;
						tmp.cnt2=0;

						tmp.txt3 = tmp.txt4 = tmp.txt5 ='';
						tmp.index3 = tmp.index4 = tmp.index5 = -1;
						tmp.cnt3 = tmp.cnt4 = tmp.cnt5 = -1;

						//2Depths 일경우 예외처리 ----(예정)
						//3Depths 부터 ~ End Depth
						for(var jjj=3; jjj <= depNum; jjj++){
							if(cur['txt'+jjj] !=''){
								tmp['txt'+jjj] = cur['txt'+jjj];
								tmp['index'+jjj]++;

								for(var k = jjj; k <= depNum; k++){
									tmp['cnt'+k] = -1;
								}
							}
						}
					}else{
						tmp.cnt2++;
						if(cur.txt2 !='' && cur.txt2 == tmp.txt2){//텍스트 같을때 삭제
							// $(this).find('> td.depth2').text('');
							$(this).find('> td.depth2').wrapInner('<span class="blurred">'); //[2022.12.20]
						}
					}

					//------------------------------
					//개별
					//------------------------------
					for(var m =3; m <= depNum; m++){
						if(cur['txt'+m] != '' && cur['txt'+m] != tmp['txt'+m]){
							tmp['txt'+m] = cur['txt'+m];
							tmp['index'+m]++;
							tmp['cnt'+m] = 0;

							if(m <depNum){//마지막 Depths 제외
								for(var n = (m+1); n <= depNum; n++){
									tmp['txt'+n] = '';
									tmp['index'+n] = -1;
									tmp['cnt'+n] = -1;
								}
							}
						}else{
							tmp['cnt'+m]++;
							if(tmp['cnt'+m] != 0 && cur['txt'+m] == tmp['txt'+m]){//텍스트 같을때 삭제
								// $(this).find('> td.depth'+m).text('');
								$(this).find('> td.depth'+m).wrapInner('<span class="blurred">'); //[2022.12.20]
							}
						}
					}

					//============================================
					//Save Data
					var ARdata_index = []
						, ARdata_cnt = []
						, ARdata_txt = []
						, Olist2 = Olist[ii] ={}
					;

					//insert of Data
					for(var d = 1; d <= depNum; d++){
						$(this).data('txt'+d, tmp['txt'+d]);
						$(this).data('index'+d, tmp['index'+d]);
						$(this).data('cnt'+d, tmp['cnt'+d]);

						ARdata_index[d-1] = tmp['index'+d];
						ARdata_cnt[d-1] = tmp['cnt'+d];
						ARdata_txt[d-1] = tmp['txt'+d];
					}

					ARindex[ii] = ARdata_index;
					ARcnt[ii] = ARdata_cnt;
					ARtxt[ii] = ARdata_txt;

					$(row).find('>td').each(function(iii, cell){
						Olist2[$(headers[iii]).attr('class')] = $(cell).text();
						if($(this).hasClass('path')){
							Olist2['link'] = $(cell).find('a').attr('href');//링크삽입
						}
					});

					//----------------
					//추후삭제
					if(__g.dataObj.test_mode){
						$(this).attr({
							'data-index' : ARdata_index
							, 'data-cnt' : ARdata_cnt
							//, 'data-txt' : ARdata_txt
						});
					}

					if(__g.dataObj.debug_mode){
						for(var t=2; t<=depNum; t++){
							$(this).find('td.depth'+t).html(
								$(this).find('td.depth'+t).text()
								+ '<span class="fr mr5">'
								+   $(this).data('index'+t)+ ' : ' + $(this).data('cnt'+t)
								+ '</span>'
							);
						}
					}
				});

				if(__g.dataObj.debug_mode){
					$(this).find('>h3').html($(this).find('>h3').text() + ': [cnt1 : '+ tmp.cnt1 +']')
				}
			});
		}


		//TableFolding 연계
		, transData = function(){
			var depNum = __g.dataObj.depSize;

			rMap.tab_content.each(function(i){
				var ARindex = dataMap.Odata.ARindex[i]
					, ARcnt = dataMap.Odata.ARcnt[i]
					, Olist = dataMap.Odata.List[i]
					, tmp = {}
				;

				dataMap.Onum.Len1[i] = Number(ARindex[ARindex.length-1][1]) +1;

				for(var o=2; o<=depNum; o++){
					dataMap.Onum['Len'+o][i]= [];
					dataMap.Onum['Pos'+o][i]= [];

					tmp['cnt'+o] = 0;
					tmp['num'+o] = 0;
				}

				//Data Setting
				$(this).find('tbody >tr').each(function(ii, row){
						if($(this).hasClass('del')) return true;//삭제 제외

						for(var o=2; o<=depNum; o++){
							if(ARcnt[ii][o-1] == 0){//2Depths: 첫번째 포지션 위치 저장
								dataMap.Onum['Pos'+o][i][tmp['cnt'+o]] = ii;
								tmp['cnt'+o]++;
								tmp['num'+o] = 0;
								$(this).data('first'+o, true);

								if(__g.dataObj.test_mode) $(this).attr('data-first'+o, true); //추후 삭제
							}
							tmp['num'+o]++;
							dataMap.Onum['Len'+o][i][tmp['cnt'+o]-1] = tmp['num'+o];
						}
				});
			});

			if(__g.dataObj.test_mode){
				console.log(dataMap.Odata, 'dataMap.Odata')
				console.log(dataMap.Onum, 'dataMap.Onum')
			}
		}

		, initModule =function(){
			var_init();
			data_init();
		}

		return {
			initModule : initModule
			, dateFormat : dateFormat
			, transData : transData
		}
	})();


	/**
	 * View
	 * --------------------------------------
	 * viewAll 인지 viewOne 인지에 따라 Change
	 */
	var View = (function(){
		var viewAll = function(_target){
			__g.page.is_viewAll = true;
		}
		, viewOne = function(_target){
			__g.page.is_viewAll = false;
		}
		, watch = function(){
			if(__g.page.is_viewAll){
				viewAll();
			}else{
				viewOne();
			}
		}
		, initModule = function(){
			watch();
		}

		return {
			initModule : initModule
			, watch : watch
			, viewAll : viewAll
			, viewOne : viewOne
		}
	})();


	/**
	 * Nav
	 * --------------------------------------
	 * Navigation
	 * SubNavigation
	 */
	var Nav = (function(){
		var is_fixDep2Pad = true //2Depths 고정여부, contentr와 nav 상태분리
			, is_vertical = false //Default: 가로메뉴
			, headerGapPad = $('.header').height() + 8
			, is_init_depth1 = true //초기 1Depth 활성화 적용 여부
			, ARcontentTop =[] //각 테이블 top 위치 저장
		;

		if(is_vertical) $('.tab_nav').addClass("vertical");//세로메뉴

		var _show = function(_target){
			var $depth1 = rMap.tab_navList
				, $depth1_on = $depth1.eq(navMap.overNum)
			;

			$depth1_on.addClass('active').siblings().removeClass('active');

			if(is_vertical) return;

			//2Depths 메뉴가 보여질 경우
			if(Setting.bool(__g.settingObj.data.nav_depth2) != true) return;
			var $depth2 = $depth1_on.find('.subNav')
				, $depth2_on = $depth2.find('>ul > li').eq(navMap.overNum2)
			;

			$depth2_on.addClass('active').siblings().removeClass('active');

			//2Depth 높이 생성
			var _h = $depth2.outerHeight();

			$('.tab_nav > ul').css({'padding-bottom' : _h});

			//가로메뉴 일 경우
			if(!is_vertical){
				// var pb = (_target == 'content' && is_fixDep2Pad == false) ? 0 : 31;
				// $('.tab_nav > ul > li').css({'padding-bottom' : pb});
			}
		}

		, _hide = function(){
			var $depth1 = rMap.tab_navList
				, $depth1_on = $depth1.eq(navMap.overNum)
			;

			//2Depths 메뉴가 보여질 경우
			if(Setting.bool(__g.settingObj.data.nav_depth2) != true) return;

			$depth1_on.removeClass('hover');

			//가로메뉴 일 경우
			if(!is_vertical){
				// var pb = (is_fixDep2Pad) ? 31 : 0;
				// $('.tab_nav > ul > li').css({'padding-bottom' : pb});
			}
		}

		//테이블 tr hover > TopNav 1Depth, 2Depths 메뉴 활성화
		, contentHandler = function(){
			rMap.tab_content.each(function(i){
				var _this =$(this);
				$(this).find('tbody tr').on({
					'mouseenter focusin' : function(){
						var index1 = $(this).data('index1')
							, index2 = $(this).data('index2')
						;
						navMap.overNum = index1;
						navMap.overNum2 = index2;
						_show('content');
						return false;
					}
					, 'mouseleave focusout' : function(){
						_hide()
						return false;
					}
				});
			});
		}

		, navHandler = function(){
			function FNfocusOut(){
				rMap.tab_content.find('tr').removeClass('focus');
			}

			//foucs out
			rMap.root.on('click', function(){
				FNfocusOut();
				// return false; //사용하면 안됨
			});

			//extra over시
			rMap.tab_nav.on({
				'mouseover' : function(){
					_show();
					return false;
				}
				,'mouseout' : function(){
					_hide();
					return false;
				}
			});

			//메뉴
			rMap.tab_navList.each(function(i){
				var $depth1 = $(this);

				//#Hash
				$depth1.find('>a').attr('rel', 'tab'+i);

				//1Depth > li
				$depth1.on({
					'mouseenter focusin' : function(){
						return false;
					}
					, 'mouseleave focusout' : function(){
						return false;
					}
				});

				//1Depth > li > a
				$depth1.find('> a').on({
					'mouseenter focusin' : function(){
						navMap.overNum = $(this).parent().index();
						_show();

						if(i == __g.navNum){
							// console.log('전체보기');
						}
						return false;
					}
					, 'mouseleave focusout' : function(){
						navMap.overNum = navMap.activeNum;
						_hide();
						return false;
					}
					, click : function(e){
						navMap.activeNum = $(this).parent().index();

						//Hash Mode
						if(!!!__g.page.scrollMode){
							//전체보기
							if(navMap.activeNum == __g.navNum){
								rMap.tab_content.show();
								View.viewAll(e.target);
								location.hash = '';
								__g.searchOption.all_target_mode = true;
							}else{
								rMap.tab_content.hide().eq(navMap.activeNum).show();
								View.viewOne(e.target);
								var tabID = $(this).attr('rel');
								location.hash = tabID;
								__g.searchOption.all_target_mode = false;
							}

							Search.initModule();
							Log.resetModule();

							$(this).parent().addClass('on').siblings().removeClass('on');
							rMap.root.scrollTop(0);
						}

						//Scroll MODE
						else{
							if(navMap.activeNum == __g.navNum){
								$(this).parent().addClass('on').siblings().removeClass('on');
								rMap.root.scrollTop(0);
							}else{
								Nav.goContent(navMap.activeNum);
							}
						}

						return false;
					}
				});

				//============================================
				//2Depth > li
				$('.subNav', $depth1).on({
					'mouseenter focusin' : function(){
						navMap.overNum = $depth1.index();
						navMap.overNum2 = -1;
						return false;
					}
					, 'mouseleave focusout' : function(){
						_hide();
						return false;
					}
				});

				//2Depth > li > a
				$('.subNav li a', $depth1).on({
					'mouseenter focusin' : function(){
						navMap.overNum = $depth1.index();
						navMap.overNum2 = $(this).parent().index();
						_show();
						return false;
					}
					, 'mouseleave focusout' : function(){
						navMap.overNum = navMap.activeNum;
						navMap.overNum2 = navMap.activeNum2;
						_hide();
						return false;
					}
					,'click' : function(e){
						var curIndex2 = Number($(this).data('index'))
							, $focusTarget = rMap.tab_content.eq(navMap.overNum).find('tbody > tr')
						;

						FNfocusOut();//기존 focus 삭제

						//ViewAll 아닐경우: 2Depth 클릭시 해당 1Depth로 이동후 scrollTop
						if((navMap.activeNum != __g.navNum)  && (navMap.overNum != navMap.activeNum)){
							View.viewOne(e.target);
							navMap.activeNum = navMap.overNum;
							rMap.tab_navList.eq(navMap.activeNum).find('>a').click();
							_show();
						}

						headerGapPad = $('.header').height() +8;
						var goTop = $focusTarget.eq(curIndex2-1).addClass('focus').offset().top - headerGapPad;
						rMap.root.stop().animate({'scrollTop' : goTop}, 'fast');

						return false;
					}
				});
			});
		}

		, goContent = function(){
			if(!!!navMap.overNum) navMap.overNum = 0;

			//viewAll 일 경우
			if(__g.page.is_viewAll){
				if(navMap.overNum < 0 ) navMap.overNum = ARcontentTop.length - 1;
				if(navMap.overNum > ARcontentTop.length - 1) navMap.overNum = 0;

				headerGapPad = $('.header').height() + 8;

				var $con = $('#tab'+navMap.overNum)
				var goPos = $con.offset().top - headerGapPad;
				rMap.root.stop().animate({scrollTop: goPos}, 'fast');
				_show();

				//해당테이블 아웃라인
				$con.find('h3').addClass('point');
				$con.find('>table').addClass('outline');

				setTimeout(function(){
					$con.find('h3').removeClass('point');
					$con.find('>table').removeClass('outline');
				},1000);
			}else{
				if(navMap.overNum < 0 ) navMap.overNum = __g.navNum - 1;
				if(navMap.overNum > __g.navNum - 1) navMap.overNum = 0;

				navMap.activeNum = navMap.overNum;
				rMap.tab_navList.removeClass('active');
				rMap.tab_navList.eq(navMap.activeNum).find('>a').click();
			}
		}

		//ViewAll일 경우: 초기 화면 포지션에 위치에 따른 네비게이션 active
		, initDepth1 = function(){
			headerGapPad = $('.header').height() + 8;
			var screenH = $(window).height();
			var curPos = document.documentElement.scrollTop + headerGapPad;

			rMap.tab_content.each(function(i){
				//탭에 ID부여 및 포지션 정의
				$(this).attr('id', 'tab'+i);
				var val = $(this).offset().top;
				ARcontentTop.push(val);
				//현재 top 포지션 기억해 인덱스 저장
				if((curPos - val) < 0 && is_init_depth1) {
					navMap.overNum = i - 1;
					is_init_depth1 = false;
				}
			});
		}

		, initDepth2 = function(){
			//서브 네비 셋팅, 화면 작을때 Depth1 메뉴 스크롤 생기게
			rMap.tab_navList.each(function(i){
				if($(this).data('depth2') == 'hide'){
					//2Depth  강제로 안보이게 할 경우
				}else{
					$(this).append('<div class="subNav"><ul></ul></div>');//2Depths 네비게이션 Append
					var $subNav = $(this).find('.subNav > ul');

					rMap.tab_content.eq(i).find('tbody td.depth2').each(function(ii){
						var menu2Txt = ($(this).find('.blurred').length) ? '': $(this).text();
						if($(this).closest('tr').hasClass('del')) return true;//del 제거후 소팅
						if(menu2Txt != '') $subNav.append('<li><a href="javascript:void(0);" data-index='+Number(ii+1)+'>' + menu2Txt+'</a></li>');
					});
				}

				//2Depth 없는 경우 .subNav 제거
				if(! $(this).find('.subNav > ul > li').size()) $(this).find('.subNav').remove();
			});
		}

		/*
		 * 1. Desktop 일때 > body Scroll
		 *  - navWidth < document.outerWidth()
		 *  - navWidth <1000
		 * 2. Mobile 일때 > Nav Scroll
		 */
		, setWidth = function(){
			//모바일 1Depths 메뉴 가로 스크롤 화면일꼉우 small Size로 변경
			var breakpoint = 960;
			function navWidth(){
				var mW = 0;
				var gap = 2;
				var mgap = 5;
				rMap.tab_navList.each(function(i){mW +=$(this).outerWidth() + gap });
				var _width = mW+mgap;
				if(!__g.is_mobile) {
					_width = _width > breakpoint ? (mW + mgap) : breakpoint ;
					var bodyW = (_width > $(document).outerWidth()) ? $(document).outerWidth() : _width-10
					rMap.body.css({'min-width' : (bodyW) });
				}

				if($(document).outerWidth() < _width){
					$('body').addClass('nav_scroll');
					var newW = 0;
					rMap.tab_navList.each(function(i){
						newW += $(this).outerWidth() + gap;
					});
					_width = newW;
				}
				return _width;
			}


			$(window).resize(function(e) {
				var docW = $(document).outerWidth()
				var navW = navWidth() + 10;
				rMap.tab_nav.find('>ul').css({'width' : Number(navW) });
				//1. Desktop
				if(!__g.is_mobile){
					if(docW < breakpoint){//Body Scroll로 변환
						$('body').addClass('nav_scroll');
					}
				}
			}).resize();
		}

		, initModule = function(){
			//PC일경우 GNB Depth2 True 일때
			if(!__g.is_mobile && Setting.bool(__g.settingObj.data.nav_depth2)){
				initDepth2();
			}

			setWidth();
			navHandler();
			contentHandler();

			if(Setting.bool(__g.settingObj.option.scroll)) __g.page.scrollMode = true;
			else __g.page.scrollMode = false;

			setTimeout(function(){
				initDepth1();//top position setting
			},500);

			if(__g.page.scrollMode){//scrollMode
				location.hash = '';
				navMap.activeNum = navMap.overNum = __g.navNum;
				rMap.tab_navList.eq(__g.navNum).find('>a').text('↑top');
			}else{//HashMode
				var $hash = location.hash;
				var activeNum = Number($hash.substring(4));

				if(!!$hash){
					navMap.overNum = navMap.activeNum = activeNum;
				}else{//전체보기
					navMap.overNum = navMap.activeNum = __g.navNum;
				}
				_show();
				rMap.tab_navList.eq(__g.navNum).find('>a').text('View All');
			}

			rMap.tab_navList.eq(navMap.activeNum).find('>a').click();
		}

		return {
			initModule : initModule
			, goContent : goContent
		}
	})();


	/**
	 * Quick
	 * --------------------------------------
	 * Top_Bottom, pageUp_Down, categoryUp_Down
	 */
	var Quick = (function(){
		var
		appendLayout =function(){
			rMap.body.append(htmlMap.quick.bottom);
		}

		, eventHandler =function(){
			var $quickArea =$('.quick_area')
				, $pgUp = $('.page_up', $quickArea)
				, $pgDown = $('.page_down', $quickArea)
				, $btnTop = $('.btn_top', $quickArea)
				, $btnBottom = $('.btn_bottom', $quickArea)
				, $topBtn = $('.top_btn')
				, $cateUp = $('.cate_up')
				, $cateDown = $('.cate_down')
				, gap = $('.header').height() + 8
			;

			//page Up Down
			$pgUp.on('click', function(){
				var wH = $(window).height() - gap
					, $diffTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				rMap.root.stop().animate({scrollTop:$diffTop - wH}, 'fast');
				return false;
			});
			$pgDown.on('click', function(){
				var wH = $(window).height() - gap
					, $diffTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				rMap.root.stop().animate({scrollTop:$diffTop + wH}, 'fast');
				return false;
			});

			//Top Bottom
			$btnTop.on('click', function(){
				rMap.root.stop().animate({scrollTop:0}, 'fast');
				return false;
			});
			$btnBottom.on('click', function(){
				rMap.root.stop().animate({scrollTop:$(document).height()}, 'fast');
				return false;
			});
			$topBtn.on('click', function(){
				$btnTop.trigger('click');
				return false;
			});

			//content Up Down
			$cateUp.on('click', function(e){
				Nav.goContent(navMap.overNum--);
				return false;
			});
			$cateDown.on('click', function(e){
				Nav.goContent(navMap.overNum++);
				return false;
			});
		}

		, initModule =function(){
			appendLayout();
			eventHandler();
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * Table Folding
	 * --------------------------------------
	 */
	var TableFolding = (function(){
		//접고 펼치기 아이콘
		var icon_open = 'plus'
			, icon_close = 'minus'
			, watchFolding = []
		;

		//tHead
		//-------------------------------------
		// 1. tbody 하나라도 접혀졌을때 (+일경우) : thead +
		// 2. tBody 전체 펼쳐졌을때 (-일경우) : thead -
		// 3. nDepth 클릭시 하위 전체 펼치기 접기는 따로 버튼 생성예정(ex. 번호옆)
		function headEventHandler(e){
			var $a = e
				, $th = $a.parent()
				, $target = $a.closest('table').find('tbody > tr')
				, curDepNum = $th.attr('class').substr(5)//depth2, depth3 ...
			;

			$target.each(function(){
				var _this = $(this);

				//body dep가 모두 펼쳐 졌을때 > 접기
				if($a.hasClass('on')){
					_this.addClass('off'+curDepNum);
					if(_this.data('first'+curDepNum)){
						_this.removeClass('off'+curDepNum);
						_this.addClass('on');
					}
				}
				//body 하나라도 접혀졌을때 > 펼치기
				else{
					_this.removeClass('off'+curDepNum);
					if(_this.data('first'+curDepNum)){
						_this.removeClass('off'+curDepNum);
						_this.removeClass('on');
					}
				}
			});

			iconToggle($a);
			return false;
		}

		//tBody
		function bodyEventHandler(e){
			var $a = e
				, $td = $a.parent()
				, $tr = $a.parent().parent()
				, $target = $tr.siblings('tr')
				, curDepNum = $td.attr('class').substr(5)//depth2, depth3 ...
				, tmp = {}
			;

			for(var i = 2; i <= curDepNum; i++){
				tmp['curIndex'+i] = $tr.data('index'+i);
			}

			$target.each(function(){
				for(j = 2; j <= curDepNum; j++){
					if(tmp['curIndex'+j] == $(this).data('index'+j)) continue;
					else return true;
				}
				if(! $(this).data('first'+curDepNum)){
					$(this).toggleClass('off'+curDepNum);
				}
			});

			iconToggle($a);
			return false;
		}


		var init = function(){
			var depNum = __g.dataObj.depSize -1;//마지막 폴딩은 삭제

			rMap.tab_content.each(function(i){
				$(this).find('>h3').prepend(htmlMap.table.fold);
				for(var d=2; d<=depNum; d++){
					watchFolding[d]=0;//폴딩 watch 변수초기화

					$(this).find('thead > tr > th.depth'+d).append(htmlMap.table.fold);

					var len = dataMap.Onum['Pos'+d][i].length;
					for(var ii = 0; ii < len; ii++){
						var trPos = Number(dataMap.Onum['Pos'+d][i][ii])+1;
						var trNum = Number(dataMap.Onum['Len'+d][i][ii]);
						var $tr = $(this).find('tr').eq(trPos);

						if(trNum > 1){//하위 메뉴가 하나 이상일 경우 버튼 삽입
							$tr.find('> td.depth'+d).append(htmlMap.table.fold);
						}
					}
				}
			});
		}

		, iconToggle = function(_target){
			var $a = _target
				, tag = $a.parent()[0].tagName
				, $curTable = $a.closest('.tab_contents_wrap')
				, curDepNum = $a.parent().attr('class').substr(5)//depth2, depth3...
			;

			$a.toggleClass('on');

			if($a.hasClass('on')){
				$a.find('i').removeClass(icon_open).addClass(icon_close);
			}else{
				$a.find('i').removeClass(icon_close).addClass(icon_open);
			}

			//watch
			if(tag == 'TD'){
				var $thBtn = $curTable.find('thead .depth'+curDepNum).find('.btn_fold_depth');
				if($a.hasClass('on')) watchFolding[curDepNum]++;
				else watchFolding[curDepNum]--;

				if(watchFolding[curDepNum]=='0'){
					$thBtn.addClass('on').find('i').removeClass(icon_open).addClass(icon_close)
				}else{
					$thBtn.removeClass('on').find('i').removeClass(icon_close).addClass(icon_open)
				}
			}

			if(tag == 'TH'){
				var $tdBtn = $curTable.find('tbody .depth'+curDepNum).find('.btn_fold_depth');
				if($a.hasClass('on')){
					$tdBtn.addClass('on').find('i').removeClass(icon_open).addClass(icon_close)
					watchFolding[curDepNum] = 0;
				}else{
					$tdBtn.removeClass('on').find('i').removeClass(icon_close).addClass(icon_open)
					watchFolding[curDepNum] = $tdBtn.size()*(-1);
				}
			}
		}

		, eventHandler = function(){
			rMap.tab_content.find('h3 > .btn_fold_depth').on('click', function(){
				var $a= $(this);
				var $target = $a.parent().parent().find('table > tbody');

				$a.toggleClass('on');

				if($a.hasClass('on')){//펼치기 : + > -
					$a.find('i').removeClass(icon_open).addClass(icon_close);
					$target.show();
				}else{//접기 : - > +
					$a.find('i').removeClass(icon_close).addClass(icon_open);
					$target.hide();
				}
			});

			rMap.tab_content.find('thead th > .btn_fold_depth').on('click', function(e){
				headEventHandler($(e.currentTarget));
			});

			rMap.tab_content.find('tbody td > .btn_fold_depth').on('click', function(e){
				bodyEventHandler($(e.currentTarget));
			});
		}

		, initModule = function(){
			Data.transData();
			init();
			eventHandler();
		}

		return {
			initModule : initModule
		}
	})()


	/**
	 * Header Folding
	 * --------------------------------------
	 * header 전체 폴딩
	 * 1. IF top == 0
	 *  - 초기 close 상태
	 *  - localStorage : headerClose = true(Header Hide) , false (Header Show)
	 * 2. IF top > 0
	 *  - 무조건 : close 상태
	 */
	var HeaderFolding = (function(){
		function setHeader(){
			if(headerT_Flag){
				$toggleBtn.text('Open');
				rMap.info_section.stop().hide();
			}else{
				$toggleBtn.text('Close');
				rMap.info_section.stop().show();
			}
		}

		function setScrollHeader(){
			if(headerS_Flag){//접기
				$toggleBtn.text('Open');
				rMap.info_section.stop().hide();
			}else{//펼치기
				$toggleBtn.text('Close');
				rMap.info_section.stop().show();
			}
		}

		var $toggleBtn = Object
			, fixedFlag = false //스크롤시 fixed여부
			, headerT_Flag = true //탑일경우: true : open,  false : close
			, headerS_Flag = true//true(접기), false(펼침)
		;

		var appendLayout = function(){
			rMap.info_section.find('>div h2').prepend(' <a href="javascript:void(0);" class="btn_close_info on"> <i></i> </a>');
			rMap.info_section.after('<div class="btn_fold_info"> <a href="javascript:void(0);"><span> Close </span></a> </div>');
			$toggleBtn = $('.btn_fold_info a');
		}

		, eventHandler = function(){
			$toggleBtn.on('click', function(){
				if(rMap.body.hasClass('headerFloating') ) {//top > 0
					headerS_Flag = !headerS_Flag;
					setScrollHeader();
				} else {// top == 0
					headerT_Flag = !headerT_Flag;
					rMap.body.attr('data-headerClose', headerT_Flag);
					__g.storageObj[__g.device].headerFolding.headerClose = headerT_Flag;
					Storage.set();
					setHeader();
				}
				return false;
			});

			// - 스크롤 IA 영역  HeadFix
			$(window).scroll(function(){
				__g.winScroll = $(window).scrollTop();

				if(fixedFlag) return;

				if(__g.winScroll > 1){
					headerS_Flag = true;//스크롤시 무조건 접기
					setScrollHeader();
					rMap.body.addClass('headerFloating');
					rMap.content.css({'margin-top' : rMap.tab_nav.height() + 82});
					rMap.body.css({'padding-bottom' : rMap.tab_nav.height() + 82});
				} else {
					setHeader();
					rMap.body.removeClass('headerFloating');
					rMap.content.css({'margin-top' : 40});
				}
			}).scroll();

			//info_section 각각 폴딩
			rMap.info_section.find('.btn_close_info').each(function(i){
				$(this).on('click', function(){
					$(this).closest('div').toggleClass('hide');
					if($(this).closest('div').hasClass('hide')) $(this).removeClass('on');
					else $(this).addClass('on');
					return false;
				});

				if(__g.is_mobile){
					$('.info_box').addClass('hide')
					$('.link_box').addClass('hide')
					$('.filter_box').addClass('hide')
					$('.comp_box').addClass('hide')
				}
			});
		}

		//header 전체 폴딩 localStorage
		, localStorage = function(){
			if(__g.storageObj[__g.device].headerFolding.headerClose){
				headerT_Flag = true;
				rMap.info_section.stop().hide();
			}else{
				headerT_Flag = false;
				rMap.info_section.stop().show();;
			}
			tmp_Flag = headerT_Flag;

			//IE 로컬 스토리지 지원 안할때 초기 무조건 펼쳐지게
			if($('html').hasClass('ie')) {
				$toggleBtn.text('Close');
				rMap.info_section.stop().show();
				headerT_Flag =false
			}

			setHeader();
		}

		, initModule =function(){
			appendLayout();
			eventHandler();
			localStorage();
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * ColorBox : Footer Menu
	 * --------------------------------------
	 */
	var ColorBox = (function(){
		var fMap = {}
			, cbVar = {}
		;

		var setMap=function(){
			var bottomGap =40;
			fMap = {
				footMenu : $('.footMenu')
				, autoSelect : $('#autoSelect')
				, resizeBtn : $('.resize_btn', this.footMenu)//리사이즈 토글 버튼
				, resizeBar : $('.resizeBar', this.footMenu)//사이즈바 컨트롤
				, control : $('.control', this.footMenu)
				, control_btn : $('.bar', this.footMenu)
				, infoTxt : $('.info_txt', this.footMenu)
			}

			cbVar = {
				className : 'iframe'
				, bottomGap : bottomGap
				, bottomGap_resize : bottomGap +19
				, outerGap : 22 //45
				, curSize :  __g.storageObj[__g.device].colorBox.curSize
				, resizeMode : __g.storageObj[__g.device].colorBox.resizeMode ? __g.storageObj[__g.device].colorBox.resizeMode : 'Resize'
				, ARresize :[]
				, option : {width : '100%', height : $(window).height()- bottomGap, top : 0 }
				, autoID : 'autoID'
				, autoFlag : false
				, saveResizeBtn : $('.'+cbVar.curSize)
			}


			fMap.control_btn.eq(0).append('<span class="info_txt"></span>');
			fMap.infoTxt = fMap.footMenu.find('.info_txt');
			//ARresize
			fMap.control_btn.each(function(i){
				var _width = $(this).data('width');
				cbVar.ARresize[i] = _width;

				$(this).css({
					'z-index' : 1000 -(i * 10)
					, 'width' : _width
					, 'margin-left' : (_width/2) * -1
				})
			});
		}

		, appendLayout =function(){
			rMap.body.append(htmlMap.colorbox.menu);
		}

		, colorBoxHandler = function(){
			$('.'+cbVar.className).colorbox({
				iframe : true
				, width : cbVar.option.width
				, height : cbVar.option.height
				, top : cbVar.option.top
				, opacity : 1.0
				, current : ""
				, onOpen:function(){
					addFootMenu();
					return false;
				}
				, onLoad:function(){
					console.log('iframe Load complete')
					return false;
				}
				, onComplete :function(){
					if(cbVar.resizeMode == 'Resize'){
						if(!cbVar.autoFlag) resizeBtnTrigger();
					}else{
						fullsizeBtnTrigger();
					}
					scrollbarHandler();
					return false;
				}
				, onCleanup:function(){
					return false;
				}
				, onClosed:function(){
					removeFootMenu();
					return false;
				}
			});



			// iFrame 안 컨텐트 모바일, PC, mobile  토클 : 768 이하일경우 scrollbar 사이즈 보이게
			// 대표  ui_common.js 와 연계(2022)
			function scrollbarHandler(){
				// var $iframe = $('#cboxIframe');
				// var breakPoint = 768;//@
				// $iframe.removeClass('loadOn');
				// clearInterval(toggleID);

				// var toggleID = setInterval(function(){
				//  var _name = $iframe.attr('name');
				//  if($iframe.hasClass('loadOn')){
				//    clearInterval(toggleID);
				//  }else{
				//    if(cbVar.curSize <= breakPoint) window[_name].toggleWorklist('mobile');
				//    else window[_name].toggleWorklist();
				//  }
				// }, 300);


				var $iframe = $('#cboxIframe');
				var breakPoint = 768;//@
				var addCss = ''
					+'<style class="scroll">'
					+'	::-webkit-scrollbar{display: none}'
					+'	body{-ms-overflow-style:none}'
					+'</style>'
				;

				$iframe.contents().find('html').addClass('iframe');

				if(cbVar.curSize <= breakPoint){
					if(!!!$iframe.contents().find('.scroll').length){
						setTimeout(function(){
							$iframe.contents().find('html').append(addCss);
						},100);
					}
				}else{
					$iframe.contents().find('.scroll').each(function(){
						$(this).remove();
					});
				}
			}

			function resetColorbox(){
				$('.'+cbVar.className).colorbox({
					width : cbVar.option.width
					, height : cbVar.option.height
					, top : cbVar.option.top
					, opacity : 1.0
					, current : ''
				});
				$.colorbox.resize(cbVar.option);
			}

			function addFootMenu(){
				rMap.body.css({'overflow': 'hidden'});
				fMap.footMenu.addClass('on');
				addTitle();
			}

			function removeFootMenu(){
				rMap.body.css({'overflow': 'auto'});
				fMap.footMenu.removeClass('on');
			}

			function addTitle(){
				var prop = $.colorbox.element();
				var curDepNum = prop.closest('.tab_contents_wrap').index();
				var curMenu = $('.tab_nav > ul').find('>li').eq(curDepNum).find('>a span').text();
				var curTitle = prop.context.title;
				var ARpath = prop.context.pathname.split('/');
				var _path1 = ARpath[ARpath.length -2];
				var _path2 = ARpath[ARpath.length -1];

				fMap.footMenu.find('.id_txt').text(_path1 +'/'+ _path2 );
				fMap.footMenu.find('.optionBar .btn_area .cate').text(curMenu);
				fMap.footMenu.find('.optionBar .btn_area .page').text(curTitle);

				//레이어 팝업등에서 강제 포커스 가져오기 위해
				setTimeout(function(){
					$('html').focus();
				}, 300)
			}


			//EVENT Handler
			//새창 열기
			fMap.footMenu.find('.id_link').on('click', function(){
				var prop=$.colorbox.element();
				window.open(prop.context.href);
				clearAuto();
				return false;
			});
			//이전
			fMap.footMenu.find('.prev_btn').on('click', function(){
				$.colorbox.prev();
				clearAuto();
				addTitle();
				return false;
			});
			//다음
			fMap.footMenu.find('.next_btn').on('click', function(){
				$.colorbox.next();
				clearAuto();
				addTitle();
				return false;
			});
			//방향키
			$('html').keyup(function(e){
				clearAuto();
				if(fMap.footMenu.hasClass('on')){
					var key = e.which;
					if(key == 37 || key == 39) addTitle();
				}
				return false;
			});
			//닫기
			fMap.footMenu.find('.close_btn').on('click', function(){
				$.colorbox.close();
				clearAuto();
				return false;
			});
			//자동
			fMap.footMenu.find('.auto_btn').on('click', function(){
				if(!cbVar.autoFlag){
					var timeVal = fMap.autoSelect.val();
					cbVar.autoID=setInterval(function(){
						$.colorbox.next();
						addTitle();
					}, timeVal*1000);
					$(this).addClass('on');
					cbVar.autoFlag=true;
				}else{
					clearInterval(cbVar.autoID);
					$(this).removeClass('on');
					cbVar.autoFlag=false;
				}
				return false;
			});
			//자동 설정 셀렉트 박스
			fMap.autoSelect.on('change', function(){
				clearAuto();
			});
			//자동 Clear
			function clearAuto(){
				if(cbVar.autoFlag) {
					fMap.footMenu.find('.auto_btn').trigger('click');
				}
			}
			//Resize,
			function resizeBtnTrigger(){
				cbVar.resizeMode = "Resize";
				__g.storageObj[__g.device].colorBox.resizeMode ='Resize';
				Storage.set();
				$('.s'+cbVar.curSize).trigger('click');
				scrollbarHandler();
				fMap.resizeBar.addClass('on');
				fMap.resizeBtn.find('span').text('Fullsize');
			}
			//FullSize
			function fullsizeBtnTrigger(){
				cbVar.resizeMode = "Fullsize";
				__g.storageObj[__g.device].colorBox.resizeMode ='Fullsize';
				Storage.set();
				cbVar.option = {width : '100%', height : $(window).height()-cbVar.bottomGap, top : 0};
				fMap.resizeBar.removeClass('on');
				fMap.resizeBtn.find('span').text('Resize');
			}
			//리사이즈 토글 버튼
			fMap.resizeBtn.on({
				click : function(){
					if(cbVar.resizeMode == "Fullsize"){
						resizeBtnTrigger();
					}else{
						fullsizeBtnTrigger();
					}
					resetColorbox();
					clearAuto();
					return false;
				}
			});
			//사이즈바 컨트롤
			fMap.control_btn.each(function(){
				var $btn=$(this);
				$btn.on({
					mouseenter : function(){
						var dataW=$(this).data('width');
						fMap.infoTxt.text(dataW);
						fMap.control_btn.removeClass('on');
						$(this).addClass('on').prevAll().addClass('on');
						return false;
					}
					, mouseleave : function(){
						fMap.infoTxt.text(cbVar.curSize);
						fMap.control_btn.removeClass('on');
						cbVar.saveResizeBtn.addClass('on').prevAll().addClass('on');
						return false;
					}
					, click : function(){
						cbVar.resizeMode = 'Resize';
						var dataW = $(this).data('width');
						cbVar.curSize = dataW;
						__g.storageObj[__g.device].colorBox.resizeMode ='Resize';
						__g.storageObj[__g.device].colorBox.curSize =cbVar.curSize;
						Storage.set();
						cbVar.saveResizeBtn =$(this);
						fMap.infoTxt.text(cbVar.curSize);
						$(this).addClass('on').prevAll().addClass('on');

						cbVar.option = {width : Number(dataW + cbVar.outerGap) , height : $(window).height()- Number(cbVar.bottomGap_resize) , top : 0};
						resetColorbox();
						clearAuto();
						scrollbarHandler();
						return false;
					}
				});
			});
			//Resize
			$(window).on('resize', function(){
				if(cbVar.resizeMode == 'Fullsize'){
					cbVar.option = {width : $(this).width() , height : $(this).height()-cbVar.bottomGap , top : 0};
					resetColorbox();
				}
			});
		}

		, eventHandler = function(){
			rMap.tab_content.find('tr').each(function(i){
				var target = 'td.num span.number'
					, target_a = $(this).find('.num a')
					, $pageName = $(this).find('.page').text()
					, goURL = $(this).find('.path a').attr('href')
				;

				//현재 화면에 보여지는 것만 이벤트 걸것: 2020.0608
				if($(this).hasClass('del')
					|| $(this).hasClass('off') //open2
					|| $(this).hasClass('open2-off') //open2
					|| !$(this).find('.rdate').text()
					|| $(this).find('.rdate').text() == "-"
					|| typeof goURL=="undefined"
					|| $(this).context.style.display == 'none'
					|| $(this).css("display") == 'none')
				{
					target_a.removeClass('iframe cboxElement'); //colorbox object 삭제
				}else{
					//레이어 팝업일경우
					if($(this).hasClass('layer')){
						if(__g.url_info.search('file') != -1) goURL = __g.layerPopUrl.local + goURL; //로컬로 볼경우
						else goURL = __g.layerPopUrl.guide + '?' + __g.layerPopUrl.server + goURL; //서버에서 볼경우
					}
					$(this).find(target).html("<a href="+goURL+" rel='"+cbVar.className+"' class='"+cbVar.className+"' title='"+$pageName+"'>"+$(this).find(target).text()+"</a>");
				}
			});

			//링크: Focus 색상
			rMap.tab_content.find('table tr td a').on({
				focusin : function(){
					$(this).closest('tr').addClass('focus');
					return false;
				}
				, focusout : function(){
					$(this).closest('tr').removeClass('focus');
					return false;
				}
			});
		}

		, resetModule =function(){
			$('.footMenu').remove();
			initModule();
		}

		, initModule =function(){
			appendLayout();
			setMap();
			eventHandler();
			colorBoxHandler();
		}

		return {
			initModule: initModule
			, resetModule : resetModule
		}
	})();


	/**
	 * AppendNum
	 * --------------------------------------
	 * 초기 숫자 삽입(& 역순)
	 */
	var AppendNum = (function(){
		var appendNumber = function($obj){
			var tmpIndex = 0
				, tmpNoIndex = 0
				, subIndex = 0
				, increaseNum = 1
				, $contentTR = rMap.tab_content.find('tbody > tr')
			;

			$('body').attr('data-childOption', __g.filterObj.group)//child Option일 경우 td.Num 폰트 스타일

			$contentTR.each(function(){
				//포함되지 않는 케이스
				if($(this).hasClass('nocnt')) {
					__g.totalNoCnt = tmpNoIndex + increaseNum;
					if(__g.is_firstNum) $('td:first-child', $(this)).before('<td class="num"><span class="number">- '+ __g.totalNoCnt + '</span></td>');//init
					else $('td:first-child', $(this)).text(__g.totalNoCnt);
					tmpNoIndex = __g.totalNoCnt;
					return;
				}

				if(__g.filterObj.group && $(this).hasClass('child')){
					__g.totalCnt = tmpIndex;
					subIndex = subIndex + increaseNum;
					if(__g.is_firstNum) $('td:first-child', $(this)).before('<td class="num"><span class="number">'+ __g.totalCnt +"-"+subIndex+'</span></td>');//init
				}
				// 2차 오픈 추가: 2020-03-10
				/*else if(! __g.filterObj.open2 && $(this).hasClass('open2')){
					return
				}*/
				else{
					__g.totalCnt = tmpIndex + increaseNum;
					subIndex = 0;
					if(__g.is_firstNum) $("td:first-child", $(this)).before('<td class="num"><span class="number">'+ __g.totalCnt +'</span></td>');//init
					else $('td:first-child', $(this)).text(__g.totalCnt);
					tmpIndex = __g.totalCnt;
				}
			});

			//역순
			if(!!!$obj.increases){
				increaseNum = -1;
				__g.totalCnt = __g.totalCnt + 1;//전체 갯수(0부터 시작)  + 1
				$contentTR.each(function(){
					if(__g.filterObj.group && $(this).hasClass('child')){

					}else{
						__g.totalCnt = __g.totalCnt + increaseNum;
						$('td:first-child', $(this)).text(__g.totalCnt)
					}
				});
			}

			__g.is_firstNum = false;
		}

		, initModule = function(){
			if(rMap.body.data('page') == "todo" || rMap.body.data('page')=='help.todo' || rMap.body.data('num-reverse')){
				appendNumber({'increases': false});
			}else{
				appendNumber({'increases': true});
			}
		}

		return {
			initModule: initModule
		}
	})();


	/**
	 * Filter Button : IA Optional
	 * --------------------------------------
	 * open2 에서 호출 됨
	 */
	var Filter = (function(){
		var $content // rMap.tab_content.find('tbody')
			, $contentTR // $content.find('tr')

			, $newBtn 		    //신규
			, $delBtn 		    //삭제
			, $holdBtn 		    //보류
			, $reworkBtn 		  //재확인
			, $equalBtn 		  //동일
			, $layerBtn 		  //레이어팝
			, $popupBtn 		  //팝업
			, $resultBtn 		  //완료
			, $resultBtn_ex   //미완료
			, $totalBtn 		  //전체
			, $open2Btn 		  //2차오픈
			, $searchBtn 			//$('input#id_search')
			, sortType 				//false(filter 버튼 클릭시 카운트 재졍렬 여부)
			, cnt 						// 1
			, delFlag 				// 0
			, oldBtn 					//클릭 버튼 저장
			, btnName 				//total 전체 버튼 초기셋팅
			, qs 							//Search

			, setMap = function(){
				$content = rMap.tab_content.find('tbody')
				, $contentTR = $content.find('tr')
				, $newBtn = rMap.info_section.find('a.new')             //신규
				, $delBtn = rMap.info_section.find('a.del')             //삭제
				, $holdBtn = rMap.info_section.find('a.hold')           //보류
				, $reworkBtn = rMap.info_section.find('a.rework')       //재확인
				, $equalBtn = rMap.info_section.find('a.equal')         //동일
				, $layerBtn = rMap.info_section.find('a.layer')         //레이어팝
				, $popupBtn = rMap.info_section.find('a.popup')         //팝업
				, $resultBtn = rMap.info_section.find('a.result')       //완료
				, $resultBtn_ex = rMap.info_section.find('a.result_ex') //미완료
				, $totalBtn = rMap.info_section.find('a.total')         //전체
				, $open2Btn = rMap.info_section.find('a.open2')         //2차오픈
				, $searchBtn =$('input#id_search')
				, sortType = false                                      //filter 버튼 클릭시 카운트 재졍렬 여부
				, cnt = 1
				, delFlag = 0
				, oldBtn                                                //클릭한 버튼 저장
				, btnName = 'total'                                     //전체 버튼 초기셋팅
				, qs= $searchBtn.quicksearch(rMap.contentTrs) //Search
			}
		;

		function setRdate($target){//완료일 구분
			var flag = ($target.find('td.rdate').text().search('\\'+__g.dateObj.seperate) != -1) ? true : false;
			return flag;
		}

		function open2Handler (){
			if(__g.filterObj.open2) $('.open2').removeClass('open2-off')
			else $('.open2').addClass('open2-off');
		}

		function update(){
			calculator();
			calculator_cate();
			reload();
		}

		function reload(){
			$('.'+btnName).trigger('click');//초기: 전체 버튼
		}

		function calculator(){
			var newCnt = 0
				, delCnt = 0
				, holdCnt = 0
				, reworkCnt = 0
				, equalCnt = 0
				, layerCnt = 0
				, popupCnt = 0
				, resultCnt = 0 		//완료
				, result_exCnt = 0 	// 미완
				, realCnt = 0
				, childCnt = 0
				, realPercent
				, open2Cnt = 0 //2차 오픈 관련: 2020-03-10
			;
			__g.totalCnt = 0; //전역에서 재정의

			$contentTR.each(function(index){
				//Open2
				if($(this).hasClass('open2-off')) {
					open2Cnt++;
					return
				}

				var rdateTxtFlag = setRdate($(this));

				//링크색상 변경
				if($('body').hasClass('linkShow')){//2021.1.11 : 수정
					//worklis.modify page 경우 링크 보이게
				}else{
					if($(this).find('td.rdate').text() == 'N/A') {
						// $(this).find('td.num .number a').contents().unwrap();
						// $(this).find('td.path > a').attr('href', 'javascript:void(0);')
						// $(this).find('td.path > a').removeAttr('target')
						$(this).find('td.path > a').contents().unwrap()
						// $(this).find('td.path').addClass('no-link');
					}
					if(!rdateTxtFlag ) {
						// $(this).find('td.num .number a').contents().unwrap();
						// $(this).find('td.path > a').attr('href', 'javascript:void(0);')
						// $(this).find('td.path > a').removeAttr('target')
						// $(this).find('td.path > a').contents().unwrap()
						$(this).find('td.path').addClass('no-link');
					}
				}

				//전체갯수 제외
				if($(this).hasClass('nocnt')) return;

				//Child Group
				if(__g.filterObj.group && $(this).hasClass('child')) {
					childCnt++;
					return
				}

				//팝업 텍스트 필터링
				var popTxtFlag = ($(this).find('td.depth2').text().search('\\(P') != -1 ||
											    $(this).find('td.depth3').text().search('\\(P') != -1 ||
											    $(this).find('td.depth4').text().search('\\(P') != -1 ||
											    $(this).find('td.depth5').text().search('\\(P') != -1 ||
											    $(this).find('td.depth6').text().search('\\(P') != -1 ||
											    $(this).find('td.page').text().search('\\(P') != -1  ||
											    $(this).find('td.type').text().search('\\P') != -1  ||

											    $(this).find('td.depth2').text().search('\\(팝') != -1 ||
											    $(this).find('td.depth3').text().search('\\(팝') != -1 ||
											    $(this).find('td.depth4').text().search('\\(팝') != -1 ||
											    $(this).find('td.depth5').text().search('\\(팝') != -1 ||
											    $(this).find('td.depth6').text().search('\\(팝') != -1 ||
											    $(this).find('td.page').text().search('\\(팝') != -1
												) ? true : false
				;

				//Delete 포함 체크시
				if(__g.filterObj.delete){
					if($(this).hasClass('new')) newCnt++;
					if($(this).hasClass('del')) delCnt++;
					if($(this).hasClass('hold')) holdCnt++;
					if($(this).hasClass('rework')) reworkCnt++;
					if($(this).hasClass('equal')) equalCnt++;
					if($(this).hasClass('layer')) layerCnt++;
					if($(this).hasClass('open2')) open2Cnt++;//2차 오픈 관련: 2020-03-10
					if($(this).hasClass('popup')) popupCnt++;

					if(rdateTxtFlag) resultCnt++;//완료
					else result_exCnt++//미완료

					if(popTxtFlag) {//팝업
						popupCnt++;
						$(this).addClass('popup');
					}

					__g.totalCnt++;//전체
				}

				//Delete 제외 체크시
				else{
					if($(this).hasClass('del')){
						if($(this).hasClass('hold')) holdCnt++;//App으로 변경

					}else{
						if($(this).hasClass('new')) newCnt++;
						if($(this).hasClass('del')) delCnt++;
						if($(this).hasClass('hold')) holdCnt++;
						if($(this).hasClass('rework')) reworkCnt++;
						if($(this).hasClass('equal')) equalCnt++;
						if($(this).hasClass('layer')) layerCnt++;
						if($(this).hasClass('open2')) open2Cnt++;//2차 오픈 관련: 2020-03-10ㄴ
						if($(this).hasClass('popup')) popupCnt++;

						if(rdateTxtFlag) resultCnt++;//완료
						else result_exCnt++//미완료

						if(popTxtFlag) {//팝업
							popupCnt++;
							$(this).addClass('popup');
						}

						__g.totalCnt++;//전체
					}
				}
			});

			//버튼 카운트 삽입
			$newBtn.find('span').text('신규 : ' + newCnt);
			$delBtn.find('span').text('삭제 : ' + delCnt);
			$holdBtn.find('span').text('보류 : ' + holdCnt);
			$reworkBtn.find('span').text('재확인 : ' + reworkCnt);
			$equalBtn.find('span').text('동일 : ' + equalCnt);
			$layerBtn.find('span').text('레이어 : ' + layerCnt);
			$popupBtn.find('span').text('팝업 : ' + popupCnt);

			$resultBtn.find('span').text('완료 : ' + resultCnt);
			$resultBtn_ex.find('span').text('미완 : ' + result_exCnt);
			$totalBtn.find('span').text('전체 : ' + __g.totalCnt);

			if(__g.filterObj.open2){
				$open2Btn.show();
				$open2Btn.find('span').text('후행 : ' + open2Cnt);
			}else{
				$open2Btn.hide();
			}

			var realPercent = (resultCnt/__g.totalCnt)*100;
			if(String(realPercent).split('.')[1]) realPercent = realPercent.toFixed(2);
			$('.total_rate span').html('<span style="font-size:20px">' + realPercent +'</span>% ');
		}

		//Calculator: 각 카테고리별 통계
		function calculator_cate(){
			var str = "<span class='info_calc' style='float: right; padding-right:10px;'> 0/0</span>"
			rMap.tab_title.find('.info_calc').remove(); //초기화
			rMap.tab_title.append(str);

			$('.info_calc').each(function(){

				var $table = $(this).parent().parent().find('table > tbody');
				var open2Cnt = 0 //2차 오픈 관련: 2020-03-10
					, delCnt = 0
					, childCnt = 0
					, resultCnt = 0 //완료수
					, realPercent
				;
				__g.totalCnt = Number($table.find('tr').size()) //전체수

				$table.find('tr').each(function(index){
					//Delete
					if($(this).hasClass('del')){
						if(__g.filterObj.delete) {
							if($(this).hasClass('child')){
								__g.totalCnt--;//삭제제외(Default)
							}
						}//삭제포함
						else __g.totalCnt--;//삭제제외(Default)
					}

					//Group
					if($(this).hasClass('child')){
						if(__g.filterObj.group) {
							if($(this).hasClass('del')) {}
							else __g.totalCnt--;//Yes(Default)
						}
					}

					//open2
					if($(this).hasClass('open2')){
						if(__g.filterObj.open2) {}//1차
						else __g.totalCnt--;//전체(Default)
					}

					//완료일 Count
					var rdateTxtFlag = setRdate($(this));
					if(!rdateTxtFlag){}
					// 작업완료일 기입시
					else {
						resultCnt++;

						//Delete
						if($(this).hasClass('del')){
							if(__g.filterObj.delete) {}//삭제포함
							else resultCnt--;//삭제제외(Default)
						}

						//Group
						if($(this).hasClass('child')){
							if(__g.filterObj.group) resultCnt--; //Yes(Default)
						}

						//open2
						if($(this).hasClass('open2')){
							if(__g.filterObj.open2) {}//1차
							else resultCnt--;//전체(Default)
						}
					}
				});

				var percent = (resultCnt/__g.totalCnt)*100;
				if(String(percent).split('.')[1]) percent = percent.toFixed(2);

				if(isNaN(percent)) percent = 0;
				$(this).html(resultCnt + ' / ' + '<strong style="color:#888">'+__g.totalCnt +'</strong> = ' + percent + '%');
			});
		}

		//Show
		function trShow($tr){
			$tr.removeClass('off');
		}

		//Hide
		function trHide($tr){
			$tr.addClass('off');
		}

		function eventReset($onBtn){
			$contentTR.addClass('off');//초기 숨김
			$contentTR.each(function(index){
				var rdateTxtFlag = setRdate($(this));

				//1.동일
				if(btnName =="equal"){
					trHide($(this));
					if($(this).hasClass('equal')) trShow($(this));
					return
				}
				//2.보류
				if(btnName =="hold"){
					trHide($(this));
					if($(this).hasClass('hold')) trShow($(this));
					return
				}
				//3.재확인
				if(btnName =="rework"){
					trHide($(this));
					if($(this).hasClass('rework')) trShow($(this));
					return
				}
				//4.팝업
				if(btnName =="popup"){
					trHide($(this));
					if($(this).hasClass('popup')) trShow($(this));
					return
				}
				//5.신규
				if(btnName =="new"){
					trHide($(this));
					if($(this).hasClass('new')) trShow($(this));
					return
				}
				//6.삭제
				if(btnName =="del" && __g.filterObj.delete){
					trHide($(this));
					if($(this).hasClass('del')) trShow($(this));
					return
				}
				//00. 2차 오픈
				if(btnName =="open2" && __g.filterObj.open2){
					trHide($(this));
					if($(this).hasClass('open2')) trShow($(this));
					return
				}

				//======================
				//1.전체
				if(btnName =="total"){
					trShow($(this));
					if(__g.filterObj.delete){
					}else{
						if($(this).hasClass('del')) trHide($(this));
					}
					return
				}

				//2. 완료, 미완료
				if(btnName =="result" || btnName =="result_ex"){
					if(rdateTxtFlag){//완료
						if(btnName =="result"){
							trShow($(this));//show, Delete 포함
							if(! __g.filterObj.delete && $(this).hasClass('del')) trHide($(this));//hide //Delete 제외
						}
					} else{//미완료
						if(btnName =="result_ex"){
							trShow($(this));//Delete 포함
							if(! __g.filterObj.delete && $(this).hasClass('del')) trHide($(this));//Delete 제외
						}
					}
					return
				}
			});
		}

		//EVENT
		function eventHandler(){
			//============================
			//삭제 라디오 버튼
			$('input[name="ch_del"]').change(function(){
				__g.filterObj.delete = $(this).val() == "true" ? true : false;
				update();
			});

			//그룹
			$('input[name="ch_group"]').change(function(){
				__g.filterObj.group =  $(this).val() == "true" ? true : false;
				update();

				__g.is_firstNum = true;
				$contentTR.find('td:first-child').remove();
				AppendNum.initModule();
				ColorBox.resetModule();
			});

			//Child
			var $childItem = $("tr.child");
			$('input[name="ch_child"]').change(function(){
				__g.filterObj.child = $(this).val() == "true" ? true : false;
				if(__g.filterObj.child) $childItem.show();
				else $childItem.hide();
			});

			// /2차 오픈 관련 Check
			$('input[name="ch_open2"]').change(function(){
				__g.filterObj.open2 = $(this).val() == "true" ? true : false;
				open2Handler();
				resetModule();
			});

			//============================
			//동일....전체 버튼 그룹
			var $targetBtns = $('.filter_btn .btn');

			$targetBtns.on('click', function(){
				//btns Reset
				var $onBtn = $(this);
				btnName= $onBtn.attr('class').split(' ')[0];
				$targetBtns.removeClass('on');
				$onBtn.addClass('on');

				eventReset($(this));
				ColorBox.resetModule();
				return false;
			});
		}

		//[filterOption
		var option_init = function(){
			__g.filterObj.delete = $('input[name="ch_del"]:checked').val() == "true" ? true : false;
			__g.filterObj.group = $('input[name="ch_group"]:checked').val() == "true" ? true : false;
			__g.filterObj.open2 = $('input[name="ch_open2"]:checked').val() == "true" ? true : false;// 2차 오픈 추가 : 2020-03-10
			__g.filterObj.child = $('input[name="ch_child"]:checked').val() == "true" ? true : false;// Child 추가 : 2021-11
		}

		, appendHtml = function(){
			rMap.info_section.append(htmlMap.infoSection.filterBox);
		}

		, resetModule = function(){
			option_init();
			update();
		}

		, initModule = function(){
			appendHtml();
			setMap();
			option_init();
			update();
			eventHandler();
			$('.'+btnName).trigger('click');//삭제 제외 버튼
		}

		return {
			initModule : initModule
			, resetModule : resetModule
		}
	})();


	/**
	 * Popup
	 * --------------------------------------
	 */
	var Popup = (function(){
		var open = function(name, title, data, _callback){

			$('body').append(htmlMap.popup.template);

			var $pop = $('.modal')
				, $popHead = $('.modal .pop_head')
				, $popCon = $('.modal .pop_area .pop_con')
			;

			$pop.addClass(name);
			$popHead.text(title)
			$('body').addClass('is_popOn');
			if(_callback) _callback();

			setTimeout(function(){
				$popCon.html(data);
				$pop.addClass('motion');
			},60);
		}

		, close = function(_callback){
			var $pop = $('.modal');
			var $popCon = $('.modal .pop_area .pop_con');
			$pop.addClass('modal');
			$pop.removeClass('motion').addClass('motion_end');

			setTimeout(function(){
				$('body').removeClass('is_popOn');
				$pop.remove();

				if(_callback) _callback();
			},160);
		}

		, initModule = function(){

			$(document).off('click.popclose').on('click.popclose', '.is_popOn .dimmed, .is_popOn .btn_close', function(){
				Popup.close(function(){
					if(__g.focusObj) __g.focusObj.addClass('focus');
				});
			});
		}

		return {
			initModule : initModule
			, open : open
			, close : close
		}
	})();


	/**
	 * Component Find
	 * --------------------------------------
	 */
	var Component = (function(){
		var initModule = function(){
			rMap.body.attr('data-component', true);

			var arrayComp = new Array();

			//Comp 추출
			rMap.tab_content.find('td.tag span').each(function(index, el) {
				arrayComp.push($(this).text());
			});

			//Comp 중복제거
			var overlapComp = arrayComp.filter(function(item, idx) {
				return arrayComp.indexOf(item) == idx;
			});

			//버튼 내림차순 정렬
			overlapComp = overlapComp.sort(function(a, b) {
				var upperCaseA = a.toUpperCase();
				var upperCaseB = b.toUpperCase();

				if(upperCaseA > upperCaseB) return 1;
				if(upperCaseA < upperCaseB) return -1;
				if(upperCaseA === upperCaseB) return 0;
			});

			//Comp box 생성
			rMap.info_section.append('<div class="box comp_box"><h2>Tag</h2><div class="box_wrap"></div></div>');

			var $compBox = rMap.info_section.find('.comp_box');
			var $compBoxWrap = $compBox.find('.box_wrap');
			var $trs = rMap.contentTrs;

			for ( var i = 0; i < overlapComp.length; i++ ) {
				$compBoxWrap.append('<span>' + overlapComp[i] + '</span>');
			}

			//All btn 추가
			$compBoxWrap.prepend('<span class="all active">All</span>');

			//EventHandler compBox
			$compBoxWrap.find('>span').on('click', function(){
				var text = $(this).text();
				$(this).addClass('active').siblings().removeClass('active');

				//Table Search Case
				if($(document).find('select.se_tag').length){
					if($(this).hasClass('all')){
						$(document).find('select.se_tag option:eq(0)').prop("selected", true).change();
					}else{
						$('select.se_tag').val(text).change();
					}
				}

				//Only component Case
				else{
					if($(this).hasClass('all')){
						$trs.show()
					}else{
						$trs.hide();
						$trs.each(function(){
							if($(this).find('td.tag').text().search(text) != -1) {
								$(this).closest('tr').show();
							}
						});
					}
				}
			});

			//EventHandler Table
			$trs.find('td.tag span').on('click', function(){
				var text = $(this).text();

				//Table Search Case
				if($(document).find('select.se_tag').length){
					$('select.se_tag').val(text).change();
				}

				//Only component Case
				else{
					$trs.hide();
					$trs.each(function(){
						if($(this).find('td.tag').text().search(text) != -1) {
							$(this).closest('tr').show();
						}
					});
				}

				active(text);
			});
		}

		var active = function(text){
			var $compBoxWrap = rMap.info_section.find('.comp_box .box_wrap');
			$compBoxWrap.find('>span').each(function(){
				if($(this).text() == text) $(this).addClass('active');
				else $(this).removeClass('active');
			});
		}

		//22.12.8 사용안함
		var setWrap = function(){
			$('td.tag').each(function(){
				var $spanTxt = $(this).find('>span').text();
				if($spanTxt.length){
					$(this).wrapInner('<div class="comp_wrap">')
				}
			});
		}

		return {
			initModule : initModule
			, active : active
		}
	})();


	/**
	 * Layout
	 * --------------------------------------
	 * 사용안함
	 */
	var Layout = (function(){
		var appendLayout =function(_callback){
			var curIndex = 0
				, tmpIndex = 0
				, curIndex_sub = 0
			;

			//tabContent : 번호 자동 추가
			rMap.tab_content.find('tbody tr').each(function(index){
					$("td:first-child", $(this)).before("<td class='num' align='center'>"+ curIndex +"</td>");
			});

			//화면 튐 현상 방지 위해
			// rMap.content.css({'visibility' :'visible'});
			if(_callback) _callback();
		}

		//Link info : 현재 디렉토리 활성화
		, setLocation = function(){
			rMap.tobe_section.find('a').each(function(){
				var urlStr=$(this).attr('href');
				// console.log('urlStr :'+urlStr, __g.fileDir);
				if(urlStr.search(__g.fileDir) != -1){
					$(this).addClass('active');
				}
			});
		}

		, event_loadLayerPopHandler = function(){
			//레이어팝업 클릭시 : (colorbox에서 레이어 팝업 링크시 )
			rMap.tab_content.find('tbody tr.layer .path a').on('click' , function(){
				var goURL=$(this).attr('href');
				if(__g.url_info.search('file') != -1) {//로컬로 볼경우
					goURL = __g.layerPopUrl.local + goURL;
				} else {//서버에서 볼경우s
					goURL = __g.layerPopUrl.guide + '?' + __g.layerPopUrl.server + goURL;
				}
				window.open(goURL);
				return false;
			});

			/* ----
				// - 팝업 클릭시 제제
				here CODE INSERT
			*/
		}

		, initModule =function(){
			// setLocation();
			appendLayout();
			// event_loadLayerPopHandler();//Load LayerPop 사용시
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * SideNav
	 * --------------------------------------
	 * 현재 사용안함
	 */
	var SideNav = (function(){
		var Onum = dataMap.Onum;
		var init = function(){
			var dep1Len = Number(dataMap.Onum.Len1.length) -1
				, btnHtml = '<a href="javascript:void(0);" class="gnbOpenBtn"><i class="fa fa-fw fa-bars"></i><span class="blind">메뉴</span></a>'
				, gnbHtml = ''
					gnbHtml +='<div class="gnb">'
					gnbHtml +='   <div class="gnbHead">'
					gnbHtml +='     <div class="gnbTitle">'
					gnbHtml +='       <h2>'+$('#wrap').find('h1').html()+'</h2>'
					gnbHtml +='     </div>'
					gnbHtml +='     <div class="gnbOption">'
					gnbHtml +='     </div>'
					gnbHtml +='   </div>'

					gnbHtml +='   <div class="gnbBody">'
					gnbHtml +='     <div class="gnbNav">'
					gnbHtml +='       <ul class="menuWrap">'
					for(var i=0; i<= dep1Len; i++){
						var title01 = dataMap.Odata.ARtxt[i][0][0]
						gnbHtml +='       <li>'
						gnbHtml +='         <a href="javascript:void(0);">'+title01+'</a>'
						gnbHtml +='       </li>'
					}
					gnbHtml +='       </ul>'
					gnbHtml +='     </div>' //gnbNav

					gnbHtml +='     <div class="gnbCon">'
						//------------------------------------
						// Sub Depths insert
						//------------------------------------
					gnbHtml +='     </div>'//gnbCon
					gnbHtml +='   </div>'//gnbBody

					gnbHtml +='   <a href="javascript:void(0)" class="gnbCloseBtn"><i class="fa fa-close"></i></a>'//gnbBody
					gnbHtml +='</div>'//gnb
				;

			$('body').prepend(gnbHtml)
			$('#wrap').prepend(btnHtml)

			subinit();
		}

		, subinit = function(){
			// console.log('subinit=====: '+Number(dataMap.Odata.ARtxt.length -1));
			var dep1Len = Number(dataMap.Odata.ARtxt.length -1)
				, gnbHtml = ''
				, depNum = __g.dataObj.depSize
				, tmpObj ={}
				, startTag = '<ul><li>'
				, endTag = '</li></ul>'
			;

			// console.log('dep1Len : '+dep1Len);
			// console.log('depNum :'+depNum);

			for(var i=0; i<= dep1Len; i++){
				var title01 = dataMap.Odata.ARtxt[i][0][0];
				var dep2Len = Number(dataMap.Odata.ARtxt[i].length -1);

				for(var ii =1; ii < depNum; ii++){
					tmpObj['tTxt'+ii] =new Object();
					tmpObj['dTxt'+ii] =new Object();
					// tmpObj['cnt'+ii] =new Object();
				}

				gnbHtml +='<div class="conWrap">'
				gnbHtml +=' <h3 class="title_2dep">'+title01+'</h3>'
				gnbHtml +=' <ul class="menuWrap">'

				for(var j=0; j<= dep2Len; j++){
					var dTxt0 = dataMap.Odata.ARtxt[i][j]; //삭제(.del) 제외(중요)
					if(dTxt0 === "" || dTxt0 ===undefined || String(dTxt0) ==="undefined" || dTxt0 =="NaN"|| dTxt0==null){
						// console.log('삭제(.del) 제외(중요)')
						// return false;(xxx)
					}else{

						for(var jj =1; jj < depNum; jj++){
							tmpObj['dTxt'+jj] = dataMap.Odata.ARtxt[i][j][jj];

							if(tmpObj['tTxt'+jj] == tmpObj['dTxt'+jj]) tmpObj['dTxt'+jj] = ''
							else tmpObj['tTxt'+jj] = tmpObj['dTxt'+jj];
						}

						var title02 = ''
						// var tmpK = 0;

						for(var k =1; k < depNum; k++){
							// console.log('li : '+dataMap.Odata.ARcnt[i][j][1])//dep2

							/*
							if(dataMap.Odata.ARcnt[i][j][1] !=0){
								var _htm = ''
								_htm = '<ul>'
								_htm += ' <li>'
								_htm += '   <span class="sdep"'+depNum+' style="padding-left:'+Number(10*k -10)+'px"'+tmpObj['dTxt'+k]+'</span>'

								title02 += (tmpObj['dTxt'+k]) ? _htm : ''
							}else{
								title02 += (tmpObj['dTxt'+k]) ? '<span class="sdep"'+depNum+' style="padding-left:'+Number(10*k -10)+'px">└ '+tmpObj['dTxt'+k]+'</span>' : ''
							}
							*/

							// tmpK = k

							// var _html = '<span class="step step'+k+'\" style="padding-left:'+Number(10*k -10)+'px">└ '+tmpObj['dTxt'+k]+'</span>'
							var _html = '<span class="step" data-cnt='+k+'\" style="padding-left:'+Number(10*k -10)+'px">└ '+tmpObj['dTxt'+k]+'</span>'
							title02 += (tmpObj['dTxt'+k]) ? _html : ''
						}

						/*
						title02 += (dTxt1) ? '<span class="sdep2" style="padding-left:0px">'+dTxt1+'</span>' : ''
						title02 += (dTxt2) ? '<span class="sdep3" style="padding-left:0px">'+'└ ' +dTxt2+'</span>' : ''
						title02 += (dTxt3) ? '<span class="sdep4" style="padding-left:10px">'+'└ ' +dTxt3+'</span>' : ''
						title02 += (dTxt4) ? '<span class="sdep5" style="padding-left:20px">'+'└ ' +dTxt4+'</span>' : ''
						title02 += (dTxt5) ? '<span class="sdep6" style="padding-left:30px">'+'└ ' +dTxt5+'</span>' : ''
						*/

						gnbHtml +='   <li>'
						gnbHtml +='     <a href="javascript:void(0);">'+title02+'</a>'
						gnbHtml +='   </li>'
					}

				}//End of dep2Len

				gnbHtml +=' </ul>'
				gnbHtml +='</div>' //gnbConWrap

			}//End of dep1Len

			$('.gnbCon').append(gnbHtml);

			// console.log('thisClass : '+thisClass)
			//reWrap
			$('.step').each(function(){
				var thisData = $(this).attr('data-cnt')
				$(this).removeAttr('class').parent().parent().attr('data-cnt', thisData);
			});
		}

		, eventHandler = function(){
			//Gnb Open
			$('.gnbOpenBtn').on('click', function(){
				$('.gnb').addClass('on');
			});
				//Gnb Close
			$('.gnbCloseBtn').on('click', function(){
				$('.gnb').removeClass('on');
			});
		}

		, initModule =function(){
			init();
			eventHandler();
			$('.gnb').addClass('on');
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * IAcompare
	 * --------------------------------------
	 * __g.dataObj Option과연동: 2021.12
	 */
	var Export = (function(){
		var excelExport = function(){
			var $btn = $('#setting .option_area[data-option="etc"] .btn_export')
				, $table = rMap.tab_content
				, worklistCopy = 'worklistCopy'
				, tableCopyHead = 'tableCopyHead'
				, tableCopyBody = 'tableCopyBody'
			;

			$btn.on('click', function(){
				var $trs = '';

				//1Depth 메뉴명 삽입
				$table.find('tbody').each(function(i){
					$(this).find('tr').eq(0).addClass('tmp_depth1_first'); //첫 Depth1 Flag
					$trs += $(this).html();
				});

				Popup.open('modal_export', 'Export', htmlMap.popup.exportWorklist , function(){
					$('.pop_con').css('visibility', 'hidden');

					setTimeout(function(){
						$('.modal').find('.table_export').attr('id', worklistCopy);
						$('.modal').find('.table_export_head').attr('id', tableCopyHead);
						$('.modal').find('.table_export_body').attr('id', tableCopyBody);
						$('.modal').find('.table_export_body tbody').append($trs);
						tableModify();
					}, 300);
				});

				Setting.close(); // 셋팅 사이드 받 닫기
				return false;
			});

			function tableModify(){
				var $worklistCopy = $('#'+ worklistCopy)
					, $tableCopyHead = $('#'+ tableCopyHead)
					, $tableCopyBody = $('#'+ tableCopyBody)
					, $colgroup = rMap.tab_content.eq(0).find('> table colgroup').html()
					, $thead = ''
				;

				rMap.tab_content.eq(0).find('> table > thead > tr th').each(function(i){
					var className = $(this).attr('class');
					var labelName = $(this).text().split(' ')[0];
					var hideStyle = '';
					if($(this).css('display') == 'none') hideStyle = 'style="display:none;"';
					$thead += '<th scope="col" class="'+className+'" '+hideStyle+'><label><input type="checkbox" checked="checked" name="ch_export_'+className+'"><span>'+labelName+'</span></label></th>'
				});

				$tableCopyHead.find('colgroup').append($colgroup);
				$tableCopyBody.find('colgroup').append($colgroup);
				$tableCopyHead.find('thead > tr').append($thead)

				setTimeout(function(){
					$worklistCopy.find('.info').remove();
					$worklistCopy.find('.log').remove();

					$tableCopyBody.find('.child').remove();
					$tableCopyBody.find('.del').removeClass('off');
					$tableCopyBody.find('.btn_fold_depth').removeClass('off');
					$tableCopyBody.find('.btn_fold_depth').remove();

					var _th = $tableCopyBody.find('>table').outerHeight() + 80 - 47
						, _ph = $('.pop_con').height()
					;

					if(_th <= _ph ) $tableCopyHead.css('right', 0); //세로 스크롤 없을경우

					//1Depth 삽입
					$table.find('.tmp_depth1_first').removeClass('tmp_depth1_first');//바닥 worklist table depth1 flag 제거
					$tableCopyHead.find('colgroup').find('.num').after('<col class="depth1" style="width:8%" />')
					$tableCopyHead.find('thead > tr').find('.num').after('<th scope="col" class="depth1"><label><input type="checkbox" checked="checked" name="ch_export_depth1"><span>1Depth</span></label></th>')
					$tableCopyBody.find('colgroup').find('.num').after('<col class="depth1" style="width:8%" />')
					$tableCopyBody.find('tbody .num').after('<td class="depth1"></td>');

					var depth1_cnt = 0;
					$tableCopyBody.find('tr').each(function(i){
						$(this).find('.num').text($(this).find('.num').text());
						if($(this).hasClass('tmp_depth1_first')){
							var $depth1_title= $('.tab_nav > ul> li').eq(depth1_cnt++).find('span').text();
							$(this).find('.depth1').text($depth1_title);
						}
					});
				},100);

				setTimeout(function(){
					$('.pop_con').css('visibility', 'visible');
				}, 200);


				//-----------------------------------------------------
				// Str
				//-----------------------------------------------------
				var copyStr =''
					, chkObj = {}
					, chkNum =0
				;

				//체크박스 선택후 Export 버튼 클릭시
				$('.btn_copy', $worklistCopy).on('click', function(){
					$tableCopyHead.find('> table > thead > tr th').each(function(i){
						var className = $(this).attr('class');
						var labelName = $(this).find('label span').text();
						chkObj[className] = $('input:checkbox[name=ch_export_'+className+']').is(':checked') ? true : false;
					});

					$tableCopyBody.find('tbody > tr').each(function(i){
						var $tr = $(this);
						if(i==0){//첫행:
							$tableCopyHead.find('> table > thead > tr th').each(function(i){
								var className = $(this).attr('class');
								var labelName = $(this).find('label span').text();
								if(chkObj[className]) {copyStr += labelName + '\t'; chkNum++;}
							});
							copyStr +='\r';
						}

						$tableCopyHead.find('> table > thead > tr th').each(function(){
							var className = $(this).attr('class');
							var labelName = $(this).find('label span').text();
							if(chkObj[className]) copyStr += $tr.find('td.'+className).text().trim(' ', '') + '\t';
						});
						copyStr += '\r';
					});

					var _width = (chkNum * 100) > 360 ? chkNum * 100 : 360;
					var copyData =''
						+'<a href="javascript:void(0);" class="btn btn_back" style="position:absolute; right:40px; top:8px;"><span>Back</span></a>'
						+'<textarea class="copy_input" readonly="" style="line-height:1; width:'+_width+'px; outline:0; height:calc(100vh - 500px); padding:10px 10px 30px; border:none; font-size:9px; color:#999;">'+copyStr+'</textarea>'
					;

					Popup.open('modal_copy', 'Copy', copyData, function(){
						setTimeout(function(){
							$('.copy_input').focus().select();
							$('.copy_input').on('click', function(){
								$(this).focus().select();
							});

							//Back
							$('.btn_back').on('click', function(){
								Popup.close(function(){
									$('.btn_export').trigger('click');
									return false;
								});
							});
						}, 300);
					});

					return false;
				});

				//all check
				var $tableExport = $('.table_export')
				$(document).off('click.export').on(
					'click.export'
					, '.table_export input[type=checkbox]'
					, function() {
						var $chkObj = $tableExport.find('input[type=checkbox]:not(.chkall)')
							, chkObjLen = $chkObj.length
							, chkedLen = $tableExport.find('input[type=checkbox]:not(.chkall):checked').length
							, $chkAll = $tableExport.find('.chkall')
						;

						// '전체' 체크 여부
						if (!!!$(this).hasClass('chkall')) {
							if (chkObjLen === chkedLen) {
								$chkAll.prop('checked', true).change();
								$chkObj.prop('checked', true).change();
							} else {
								$chkAll.prop('checked', false).change();
							}
						}
						//전체 체크
						else {
							if($chkAll.prop('checked')){
								$chkAll.prop('checked', true).change();
								$chkObj.prop('checked', true).change();
							}else{
								$chkAll.prop('checked', false).change();
								$chkObj.prop('checked', false).change();
							}
						}
					}
				);

			}
		}

		//검수요청 클릭시 : 검수대상과 고객검수 다른 부분 체크
		, checkCompare = function(){
			var $table = rMap.tab_content;
			var addBtn ='<a href="javascript:void(0);" class="btn btn_check"><span>검수요청</span></a>';
			$('.link_box .etc_section > div').append(addBtn);

			$('.btn_check').on('click', function(){
				$(this).addClass('active');
				$('tbody tr', $table).each(function(){
					var val1 = $(this).find('.pdate').text().trim(' ', '');
					var val2 = $(this).find('.mdate').text().trim(' ', '');
					$(this).hide();

					if(val1 != val2) {
						if(val1 == '○' && val2 == '●' ) return;
						if(val1 == '●' && val2 == '■' ) return;
						if($(this).hasClass('del')) return;
						$(this).show()
					}
				});
				Setting.close(); // 셋팅 사이드 바 닫기
				return false;
			});
		}

		, initModule = function(){
			excelExport();
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * Filter Button : IA Optional
	 * --------------------------------------
	 * AppendBtn : Link info. > .btn_more
	 * Log find ID & goURL
	 */
	var Log = (function(){
		var viewOneLine =  function($content){
			var $logCell = $content ? $content.find('td.log') : rMap.tab_content.find('td.log');
			$logCell.each(function(){
				var $desc = $(this).find('> *:not(.btn_more)');
				$desc.hide();
				if(!__g.is_mobile) $desc.eq(0).show();// 모바일 경우 처음부터 모두 hidden
			});
		}

		, foldingHandler = function(){
			if(rMap.tab_content.find('.btn_fold_log').length) return false;

			var $thLog = rMap.tab_content.find('th.log')
				, $tdLog = rMap.tab_content.find('td.log')
			;

			$thLog.append(htmlMap.table.log);
			var $logBtn = rMap.tab_content.find('.btn_fold_log');

			if(__g.logObj.isShowAll) $logBtn.addClass('on');
			else $logBtn.removeClass('on')

			var $desc = $tdLog.find('> *:not(.btn_more)');
			$logBtn.off().on('click', function(){
				$logBtn.toggleClass('on')
				if($(this).hasClass('on')){
					__g.logObj.isShowAll = true;
					$desc.show();
				}else{
					__g.logObj.isShowAll = false;
					viewOneLine();
				}

				if($(this).closest('.tab_contents_wrap').attr('id') != 'tab0'){
					var pos =$(this).offset().top;
					$(window).scrollTop(pos - 310);
				}
			});
		}

		, resetModule = function(){
			foldingHandler();//Search.init() 에서 호출 됨
		}

		, initModule = function(){
			foldingHandler();
		}

		return {
			initModule : initModule
			, resetModule : resetModule
		}
	})();


	var More = (function(){
		// Usage HTML
		// <div data-ui="more" data-title="Nocite">
		// 	<dl><dt>12/05</dt><dd>확인필요</dd></dl>
		// 	<dl><dt>12/04</dt><dd>test</dd></dl>
		// 	<dl><dt>12/03</dt><dd>test</dd></dl>
		// </div>

		var set = function($obj){
			$obj.target.each(function(){
				$this = $(this)
				var $data = $(this).find('> *:not(.btn_more)');

				//Todo 바로가기: <i>TD001</i>
				$data.each(function(){

					//날짜가 있을경우: [/]
					if(!!$(this).find('dt').text()){
						$(this).addClass('is_date');
					}else{
						$(this).addClass('no_date')
					}

					//TODO
					var $i = $(this).find('i');
					$i.each(function(){
						$(this).wrap('<a href='+__g.linkObj.todo+'?find='+$(this).text()+' target="_blank">');
					})
				});

				//비고란 한줄 이상일경우 popup
				if($data.size() > 1){
					//데이터 저장
					$(this).data('save', transTable($(this)));

					//Button insert
					$(this).append('<a href="javascript:void(0)" class="btn_more"><i></i></a>');
					var $btn = $(this).find('.btn_more');

					//Button Handler
					$btn.on('click', function(){
						__g.focusObj = $(this).closest('tr');
						var title = $(this).closest('[data-ui="more"]').data('title') || 'Info';
						if($(this).closest('.log').length) title= 'Log';

						var data = $(this).parent().data('save');

						Popup.open('modal_log', title, data, function(){});
					});

					// data-show="": 한줄 show
					// data-show="true": 전체 show
					// data-show="false": 전체 hide
					var isShow = $(this).closest('[data-show]').data('show');
					if(!isShow){
						if(isShow === false) $data.hide(); //false
						else $data.hide().eq(0).show();// undefined
					}
				}
			});

			$obj.target.addClass('show');
		}

		, transTable = function($data){
			var html ='';
			html +='<div class="table_log">';
			html +='  <table width="100%;">';
			html +=' 	 <colgroup><col width="70px" /><col width="auto" /></colgroup>';
			html +='    <tbody>'

			$data.find('> *').each(function(i){
				var dt = $(this).find('> dt').text();
				var copy = $(this).clone();
				copy.find('> dt').empty().remove();
				var dd = ltrim(copy.html());

				if(!dt && !dd){

				}else{
					if(!dt) dt = "N/A";
					html +='	  	<tr><th scipe="row">'+ dt +'</th> <td>'+ dd +'</td></tr>';
				}
			});

			html +='    </tbody>';
			html +='  </table>';
			html +='</div>';

			return html;
		}

		, initModule = function(){
			set({target: rMap.body.find('[data-ui="more"]')}); //More
			set({target: rMap.tab_content.find('td.log')}); // Log
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * Todo
	 * --------------------------------------
	 */
	var Todo = (function(){
		//현재 페이지가 todolist일 경우 todoID Search & focus
		var todoSearch = function(){
			if(decodeURI(Util.getFileName()) != __g.linkObj.todo)  return false;

			// var $trs = rMap.contentTrs;
			var $trs = $('.tab_contents_wrap tbody').find('tr');
			var queryText = location.search.substring(1);
			if(!queryText) return;

			var queryObj = JSON.parse('{"' + decodeURI(queryText).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + ' "}');
			var findTxt = String(queryObj.find.trim());

			if(!!findTxt){
				setTimeout(function(){
					$trs.each(function(){
						if(findTxt === $(this).find('td.id').text()){
							$(this).closest('tr').addClass('focus');
							var pos =$(this).closest('tr').offset().top;
							$(window).scrollTop(pos - 400);
							return false;
						}else{
							// Popup.open('modal_search', 'Not Found', '<strong style="font-size:14px">ID: '+findTxt+'</strong>');
						}
					});
				},500);
			}
		}

		var initModule = function(){
			todoSearch();
		}

		return {
			initModule : initModule
		}
	})();


	/**
	 * Etc
	 * --------------------------------------
	 */
	var Etc = (function(){

		var idSplit = function(){
			var $path = rMap.tab_content.find('tbody .path > a');
			var num_prefix = 1;//앞 글자 제외 글자수(Default:0)
			var num_afterfix = 1;//뒷 글자 제외 글자수(Default:0)
			var num_split = 2;//자르는 숫자(색 변환 글자 간격)

			function splitString(str, size) {
				var ARstr = [];
				for (var i = 0; i < str.length; i += size) {
					ARstr.push(str.substring(i, i + size));
				}
				return ARstr;
			}

			$path.each(function(){
				var ARtxt = $(this).text().replaceAll(' ', '').split('_')// underbar 뒷부분 제외 위해
					, ARtxt_new =''
					, str_prefix = ''
					, str_afterfix = ''
					, str = ''
				;

				if(ARtxt[0].length > 0 && num_split > 0){
					if(num_prefix > 0) str_prefix ='<span class="prefix">' + ARtxt[0].substring(0, num_prefix) + '</span>';
					if(num_afterfix > 0) str_afterfix ='<span class="afterfix">' + ARtxt[0].substring(ARtxt[0].length, ARtxt[0].length - num_afterfix) + '</span>';

					ARtxt_new = ARtxt[0].substring(num_prefix, ARtxt[0].length - num_afterfix);

					var ARsplitStr = splitString(ARtxt_new, num_split);
					for(var i =0; i< ARsplitStr.length; i++){
						str +='<span>' + ARsplitStr[i] + '</span>';
					}

					$(this).empty().html('<span class="id_split">' + str_prefix + str + str_afterfix + (!!ARtxt[1] ? '_'+ARtxt[1] : '' ) +'</span>');
				}
			});
		}


		, initModule = function(){
			// idSplit();
		}

		return {
			initModule : initModule
			, idSplit : idSplit
		}
	})();


	/**
	 * Helper
	 * --------------------------------------
	 * 날짜/문자열 검색, 날짜를 숫자로 변경
	 */
	var Helper = (function(){
		//날짜 검색
		var sortDate = function(_AR){
			return _AR.sort(function(a, b) {
					var sortA = a;
					var sortB = b;
					var ARa = sortA.split(__g.dateObj.seperate);
					var ARb = sortB.split(__g.dateObj.seperate);

					ARa[1] = (!!ARa[1]) ? ((ARa[1].length ==1) ? '0' + ARa[1] : ARa[1]) : 0
					ARb[1] = (!!ARb[1]) ? ((ARb[1].length ==1) ? '0' + ARb[1] : ARb[1]) : 0

					sortA = Number(ARa[0] + ARa[1]);
					sortB = Number(ARb[0] + ARb[1]);

					// console.log(_AR, sortA, sortB)

					if(sortA == NaN || !!!sortA) sortA =0;
					if(sortB == NaN || !!!sortB) sortB =0;

					// console.log('sortData:', sortA, sortB)

					if(sortA > sortB) return 1;
					if(sortA < sortB) return -1;
					if(sortA === sortB) return 0;
				})
			;
		}

		var sortDate_year = function(_AR){
			return _AR.sort(function(a, b) {
				var sortA = dateToNum(a);
				var sortB = dateToNum(b);

				if(sortA > sortB) return 1;
				if(sortA < sortB) return -1;
				if(sortA === sortB) return 0;
			});
		}

		//프로젝트 시작일 종료일과 비교해서 기간내 산출
		var periodDate = function(a){
			var sortA = dateToNum(a);
			var sortB = dateToNum(__projectDate.projectStartDate);
			var sortC = dateToNum(__projectDate.projectEndDate);

			var bFlag = false; //시작일
			var cFlag = false; //종료일

			if(sortA >= sortB) bFlag = true;
			if(sortA <= sortC) cFlag = true;
			if(bFlag && cFlag) return true;
			else return false;
		}

		//날짜를 숫자로 변경
		var dateToNum = function(a){
			var sortA = a;
			var ARa = sortA.split(__g.dateObj.seperate);
			ARa[1] = (!!ARa[1]) ? ARa[1].zf(2) : 0
			ARa[2] = (!!ARa[2]) ? ARa[2].zf(2) : 0

			sortA = Number(ARa[0] + ARa[1] + ARa[2]);
			if(sortA == NaN || !!!sortA) sortA =0;

			return sortA;
		}

		//문자열 검색
		var sortStr = function(_AR){
			return _AR.sort(function(a, b) {
					var upperCaseA = a.toUpperCase();
					var upperCaseB = b.toUpperCase();

					if(upperCaseA > upperCaseB) return 1;
					if(upperCaseA < upperCaseB) return -1;
					if(upperCaseA === upperCaseB) return 0;
				})
			;
		}

		return {
			sortDate : sortDate
			, sortDate_year : sortDate_year
			, periodDate : periodDate
			, dateToNum : dateToNum
			, sortStr : sortStr
		}
	})();


	/**
	 * Report
	 * --------------------------------------
	 * 2020.02.07: 생산성관련 작업 시작
	 * idea
	 * - 년간, 월간, 주간, 일간 Table / 통계
	 * - 월간
		1,2,3,4,5,6
	 */
	var Report = (function(){
		var reportMap ={}
			, reportObj ={}
		;

		function stringToDate(str){
			var trimStr=trimLR(str);
			var arr=trimStr.split('.');
			if(trimStr.length!=10||arr.length!=3) return false;
			var ret=new Date(Number(arr[0]),Number(arr[1])-1,Number(arr[2]));
			if(ret=="Invalid Date") return false;

			return ret;
		}

		var setMap = function(_arg){
			reportMap ={
				reportTable_calendar : ''
					+'  <div class="report_area calendar_report">'
					+'    <div class="btn_area">'
					+'      <strong class="date_form  mt10"><span class="start_date">'+__projectDate.projectStartDate+'</span> ~ <span class="end_date">'+__projectDate.projectEndDate+'</span></strong>'
					+'      <a href="javascript:void(0);" class="btn btn_report btn_period"><span>기간검색</span></a>'
					+'      <a href="javascript:void(0);" class="btn btn_report btn_total"><span>초기화</span></a>'
					+'    </div>'
					+'    <div class="report_wrap">'
					+'      <div class="table_report_clone">'
					+'        <table width="100%;">'
					+'          <thead class="table_report_head">'
					+'            <tr class="tr_hread tr_year"><th scope="row" class="seperate">Calendar</th></tr>'
					+'          </thead>'
					+'          <tbody class="table_report_body"></tbody>'
					+'          <tfoot class="table_report_foot">'
					+'            <tr class="tr_foot tr_total"><th scope="row">Total</th></tr>'
					+'          </tfoot>'
					+'        </table>'
					+'      </div>'
					+'      <div class="table_report">'
					+'        <table width="100%;">'
					+'          <thead class="table_report_head">'
					+'            <tr class="tr_hread tr_year"><th scope="row" class="seperate" rowspan="2">Calendar</th></tr>'
					+'            <tr class="tr_hread tr_date"></tr>'
					+'          </thead>'
					+'          <tbody class="table_report_body">'
					+'          </tbody>'
					+'          <tfoot class="table_report_foot">'
					+'            <tr class="tr_foot tr_total "><th scope="row" rowspan="2">Total</th></tr>'
					+'            <tr class="tr_foot tr_week"></tr>'
					+'          </tfoot>'
					+'        </table>'
					+'      </div>'
					+'    </div>'
					+'  </div>'
			}
		}

		, appendTable = function(_class, _title){
			var reportTable = ''
				+'<div class="report_area '+_class+'">'
				+'  <div class="report_wrap">'
				+'    <div class="table_report">'
				+'      <table width="100%;">'
				+'        <thead class="table_report_head">'
				+'          <tr class="tr_thead"><th scope="row" class="seperate">'+_title+'</th></tr>'
				+'        </thead>'
				+'        <tbody class="table_report_body"></tbody>'
				+'        <tfoot class="table_report_foot">'
				+'          <tr class="tr_foot tr_total"><th scope="row">Total</th></tr>'
				+'        </tfoot>'
				+'      </table>'
				+'    </div>'
				+'  </div>'
				+'</div>'
			;

			var cloneTable = ''
				+'    <div class="table_report_clone">'
				+'      <table width="100%;">'
				+'        <thead class="table_report_head">'
				+'          <tr class="tr_hread"><th scope="row" class="seperate">'+_title+'</th></tr>'
				+'        </thead>'
				+'        <tbody class="table_report_body"></tbody>'
				+'        <tfoot class="table_report_foot">'
				+'          <tr class="tr_foot tr_total"><th scope="row">Total</th></tr>'
				+'        </tfoot>'
				+'      </table>'
				+'    </div>'
			;

			var $appendArea = $('.modal .pop_con').append(reportTable);

			//clone
			if(_class == 'date_report' || _class == 'week_report'){// Date Table 일경우 Left Fix
				$appendArea.find('.'+_class+' .report_wrap').prepend(cloneTable);
			}
			var $newArea =$('.modal').find('.'+_class);

			return $newArea;
		}

		, setData = function(){
			var $trs = rMap.contentTrs;

			//NAME FIND
			var ARcorder_tmp =[];
			var ARcorder_tmp_empty_index =[];//담당자 없음 index
			var ARdate_tmp_nan_index =[];//완료일 N/A index
			var ARdate_tmp =[];
			var ARmonth_tmp =[];

			var ARcorder = []
			var ARdate = []
			var ARday = []
			var ARmonth = []

			//지정일자별: 20220100 zerofill 삽입후
			var ARstartDate = __projectDate.projectStartDate.split(__g.dateObj.seperate);
			var ARendDate = __projectDate.projectEndDate.split(__g.dateObj.seperate);
			var startDateNum = ARstartDate[0]+ ARstartDate[1].zf(2) + ARstartDate[2].zf(2);
			var endDateNum = ARendDate[0]+ ARendDate[1].zf(2) + ARendDate[2].zf(2);

			$trs.each(function(index, el) {
				//1. corder
				var corderTxt = $(this).find('td.corder').text();
				if(!!corderTxt) ARcorder_tmp.push(corderTxt);
				else ARcorder_tmp_empty_index.push(index); //담당자없음 저장

				//2. Date
				var dayData = $(this).find('td.rdate').data('date');
				if(!!dayData) ARdate_tmp.push(dayData);
				else ARdate_tmp_nan_index.push(index)
			});

			// console.log('ARdate:', ARdate_tmp)

			// 1. Corder 중복제거, Sort
			ARcorder = ARcorder_tmp.filter(function(item, idx) {
				return ARcorder_tmp.indexOf(item) == idx;
			});
			ARcorder = Helper.sortStr(ARcorder);

			// 2. Date 중복제거, Sort
			ARdate = ARdate_tmp.filter(function(item, idx) {
				return ARdate_tmp.indexOf(item) == idx;
			});
			ARdate = Helper.sortDate_year(ARdate);

			//3. 지정일별 Day, Month 설정
			for(var i=0; i<=ARdate.length - 1; i++){
				var ARnum = ARdate[i].split(__g.dateObj.seperate);
				var dayNum = ARnum[0]+ String(ARnum[1]).zf(2) + String(ARnum[2]).zf(2);//20210304
				var monthStr = ARnum[0]+__g.dateObj.seperate+ String(ARnum[1]).zf(__g.dateObj.zeroFill);

				if(dayNum < startDateNum) { //지정일 보다 작을때
					// console.log('-:', startDateNum , dayNum)
				}else if(dayNum > endDateNum){ //지정일 보다 클때
					// console.log('+: ', endDateNum , dayNum)
				} else{
					ARday.push(ARdate[i]); //2021/01/01
					ARmonth.push(monthStr);//2021/01
				}
			}

			// month 중복제거 Sort
			ARmonth = ARmonth.filter(function(item, idx) {
				return ARmonth.indexOf(item) == idx;
			});
			ARmonth = Helper.sortDate_year(ARmonth);

			//4. Insert Obj
			reportObj.corder = ARcorder;
			reportObj.corder_empty_index =ARcorder_tmp_empty_index; //코더 담당자 없음

			reportObj.day = ARday;
			reportObj.day_nan_index =ARdate_tmp_nan_index; //rdate N/A

			reportObj.month = ARmonth;
			reportObj.obj=[];

			//CALC
			reportObj.totalSum = 0; // 전체본수
			reportObj.totalRow = []; // 전체본수(개인별)
			reportObj.totalCol_day = []; // 전체본수(일별)
			reportObj.totalCol = []; // 전체본수(월별)

			//init
			for(var i = 0; i<=reportObj.corder.length-1; i++){
				var cntYear = 0;
				reportObj.totalRow[i]=0+i;
				reportObj.obj[i]={};
				reportObj.obj[i].corder = reportObj.corder[i];
				reportObj.obj[i].day = new Array(ARmonth.length);
				reportObj.obj[i].month = new Array(ARmonth.length);
				reportObj.obj[i].nan_cnt = 0;//N/A cnt

				//day
				for(var p=0; p <= ARday.length-1; p++){
					reportObj.totalCol_day[p]=0;
					reportObj.obj[i].day[p]={};
					reportObj.obj[i].day[p].label=ARday[p];
					reportObj.obj[i].day[p].cnt =0;
				}

				//month
				for(var p=0; p <= ARmonth.length-1; p++){
					reportObj.totalCol[p]=0;
					reportObj.obj[i].month[p]={};
					reportObj.obj[i].month[p].label=ARmonth[p];
					reportObj.obj[i].month[p].cnt =0;
				}
			}

			for(var i = 0; i<=reportObj.corder.length-1; i++){
				$trs.each(function(ii){
					//Corder
					var corderTxt = $(this).find('.corder').text();
					if(corderTxt == reportObj.corder[i]){

						var strDate = $(this).find('.rdate').data('date');
						var str_month = '';

						//담당자별 일취합
						for(var iii=0; iii <= ARday.length-1; iii++){
							if(strDate == ARday[iii]){
								reportObj.obj[i].day[iii].cnt++;
							}
						}

						//담당자별 월취합
						if(!!strDate){
							var ARstr = strDate.split(__g.dateObj.seperate);
							str_month = ARstr[0]+__g.dateObj.seperate+ARstr[1];
							// console.log('str_month2:'+ii, str_month)
							for(var iii=0; iii <= ARmonth.length-1; iii++){
								if(str_month == ARmonth[iii]){
									reportObj.obj[i].month[iii].cnt++;
								}
							}
						}

						//N/A 별 취함
						if(strDate == "N/A"){
							reportObj.obj[i].nan_cnt++;
						}
					} //end if
				}); // end trs Each


				//담당자별 월취합 첫달, 마지막달
				//첫달
				var monFirstCnt =0;
				var monLastCnt =0;

				//프로젝트 설정기간 내 작업본수 없을시 Bug 방지
				if(reportObj.obj[i].day.length-1 < 0) {
					return false;
				}

				for(var iii=0; iii <= reportObj.obj[i].day.length-1; iii++){
					var _AR = reportObj.obj[i].day[iii].label.split(__g.dateObj.seperate);
					var _target = _AR[0]+__g.dateObj.seperate+_AR[1];

					var _first = reportObj.obj[i].month[0].label;
					var _last = reportObj.obj[i].month[reportObj.obj[i].month.length-1].label;

					if(_first === _target){
						monFirstCnt += reportObj.obj[i].day[iii].cnt;
					}
					if(reportObj.obj[i].day.length >1){
						if(_last === _target){
							monLastCnt += reportObj.obj[i].day[iii].cnt
						}
					}
				}

				reportObj.obj[i].month[0].cnt = monFirstCnt;
				reportObj.obj[i].month[reportObj.obj[i].month.length-1].cnt = monLastCnt;


				//###Sum
				for(var iiii=0; iiii <= ARday.length-1; iiii++){
					reportObj.totalCol_day[iiii] += reportObj.obj[i].day[iiii].cnt;
				}
				for(var iiii=0; iiii <= ARmonth.length-1; iiii++){
					reportObj.totalRow[i] += reportObj.obj[i].month[iiii].cnt;
					reportObj.totalCol[iiii] += reportObj.obj[i].month[iiii].cnt;
				}

				reportObj.totalSum += Number(reportObj.totalRow[i]);
			}// end for corder


			//월별 검색할 날짜 Data
			__projectDate.ARmonth_date=[]
			for(var i = 0; i<= reportObj.month.length-1; i++){
				var mothStr= reportObj.month[i]
				__projectDate.ARmonth_date[i] = new Array();

				for(var ii =0; ii<= reportObj.day.length-1; ii++){
					var ARdayStr = reportObj.day[ii].split(__g.dateObj.seperate)
					var dayStr = ARdayStr[0] + __g.dateObj.seperate + ARdayStr[1];
					if(mothStr == dayStr){
						__projectDate.ARmonth_date[i].push(reportObj.day[ii])
					}
				}
			}

			return true;
		}

		, table_calendar = function(){
			if(__projectDate.error) {
				console.log('##[setProjectDate Error]##')
				return;
			}

			var $newArea= $('.modal .pop_con').append(reportMap.reportTable_calendar);
			var $reportArea =$('.modal').find('.report_area.calendar_report');

			var $table =$reportArea.find('.table_report');
			var $thead =$table.find('.table_report_head');
			var $tbody =$table.find('.table_report_body');
			var $tfoot =$table.find('.table_report_foot');

			var $tableClone =$reportArea.find('.table_report_clone');
			var $theadClone =$tableClone.find('.table_report_head');
			var $tbodyClone =$tableClone.find('.table_report_body');
			var $tfootClone =$tableClone.find('.table_report_foot');

			var rowStart = 0;
			var colStart = 0;
			var rowNum = reportObj.day.length-1;
			var colNum = reportObj.corder.length-1;

			var ARmonth = __projectDate.ARmonth;
			var ARweekStr = ['일', '월', '화', '수', '목', '금', '토'];

			__projectDate.ARweek_date =[]; //주당 날짜 삽입;

			var weekCnt = 1;
			var dateCnt = 0;
			var holidayCnt = 0;

			//=== calendar
			// Create Col : corder
			for(var k = colStart ; k<= colNum; k++){
				var corderStr = reportObj.corder[k] ? reportObj.corder[k] : '담당자없음';
				$tbody.append('<tr class="tr'+k+'"><th scope="row" class="corder">'+corderStr+'</th></tr>');
				$tbodyClone.append('<tr class="tr'+k+'"><th scope="row" class="corder">'+corderStr+'</th></tr>');//clone
			}

			//Month
			for(var i = 0; i < ARmonth.length;  i++){
				var monObj = ARmonth[i];
				var cruDate = new Date(__projectDate.ARyear[i],monObj, 0);
				var year = cruDate.getFullYear();
				var mon = cruDate.getMonth() + 1;

				var startDate = 0;
				var lastDate = (new Date(year, mon, 0)).getDate();
				var startWeek = 0;// week
				// var lastWeek = 0;// week
				var colgroupNum = lastDate ;

				//첫달
				if(i ==0) {
					startDate = Number(__projectDate.startDate - 1);
					colgroupNum = lastDate - startDate;

					//week(첫째 주)
					var tmpDate = new Date(__projectDate.ARyear[i], mon -1, __projectDate.startDate);
					var strYear = __projectDate.ARyear[i]+__g.dateObj.seperate+mon.zf(__g.dateObj.zeroFill)+__g.dateObj.seperate+__projectDate.startDate.zf(__g.dateObj.zeroFill);
					startWeek = tmpDate.getDay();

					if(startWeek > 0){
						$tfoot.find('tr.tr_week').append('<th scope="col" data-date="'+strYear+'" data-week="1" colspan='+(7 - startWeek)+'> W'+ 1 +' : <span class="sum link_num">0</span></th>');
						__projectDate.ARweek_date[1] = new Array();
					}
				}

				//마지막달
				if(i == ARmonth.length-1) {
					lastDate = __projectDate.endDate;
				}

				// 구분/년 삽입
				var trYearStr = __projectDate.ARyear[i] +__g.dateObj.seperate + mon.zf(__g.dateObj.zeroFill);
				$thead.find('tr.tr_year').append('<th scope="col" class="th_year" data-year='+trYearStr+' colspan ="'+colgroupNum+'">'+trYearStr+'</th>');

				for(var ii = startDate; ii< lastDate;ii++) {
					var yearStr = __projectDate.ARyear[i];
					var dateStr = String(ii+1).zf(__g.dateObj.zeroFill);
					var dateFullStr = yearStr +__g.dateObj.seperate+ monObj.zf(__g.dateObj.zeroFill) +__g.dateObj.seperate+ String(ii+1).zf(__g.dateObj.zeroFill);
					var monDayStr = monObj.zf(__g.dateObj.zeroFill) +__g.dateObj.seperate+ String(ii+1).zf(__g.dateObj.zeroFill);
					// 기준 연단위 변화 로 인하여 : 기본 작업리스트에 년도 삽입으로 변경 고려

					var newDate = new Date(year, mon -1, ii + 1);
					var newDay = newDate.getDay();
					var dayStr = ARweekStr[newDay];

					// Head: 구분
					if(newDay == 6){// 토
						$thead.find('tr.tr_date').append('<th scope="col" class="item holiday holiday_sa" data-index="'+dateCnt+'" data-date="'+dateFullStr+'" data-day="'+monDayStr+'" data-week="'+weekCnt+'" title="'+dayStr+'">'+dateStr+'</th>')
						holidayCnt++;
					}else if(newDay == 0){// 일
						$thead.find('tr.tr_date').append('<th scope="col" class="item holiday holiday_su" data-index="'+dateCnt+'" data-date="'+dateFullStr+'" data-day="'+monDayStr+'" data-week="'+weekCnt+'" title="'+dayStr+'">'+dateStr+'</th>')
						holidayCnt++;
						//week: 주
						__projectDate.ARweek_date[weekCnt+1]= new Array();
						weekCnt++;
						$tfoot.find('tr.tr_week').append('<th scope="col" data-date="'+(yearStr +__g.dateObj.seperate+ monObj +__g.dateObj.seperate+ (ii+2))+'"data-week="'+weekCnt+'" colspan="7"> W'+weekCnt+' : <span class="sum link_num">0</span></th>');
					}else{
						$thead.find('tr.tr_date').append('<th scope="col" class="item" data-index="'+dateCnt+'" data-date="'+dateFullStr+'" data-day="'+monDayStr+'" data-week="'+weekCnt+'">'+dateStr+'</th>');
					}

					//Body
					$tbody.find('tr').append('<td class="item" data-index="'+dateCnt+'" data-date="'+dateFullStr+'" data-week="'+weekCnt+'"></td>');

					//footer
					$tfoot.find('tr.tr_total').append('<th scope="row" class="total page" data-index="'+dateCnt+'" data-date="'+dateFullStr+'" data-week="'+weekCnt+'">&nbsp;</th>');

					//주당 날짜 저장
					__projectDate.ARweek_date[weekCnt].push(dateFullStr);

					dateCnt++;

					//공휴일 삽입: Custom Holiday
					for(var hh =0; hh<= __manmonth.holiday.length-1; hh++){
						var holidayStr = Data.dateFormat(__manmonth.holiday[hh].date);
						var holidayLabel = __manmonth.holiday[hh].label;

						if(dateFullStr == holidayStr) {
							var $target_holiday = $thead.find('tr.tr_date').find('th[data-date="'+dateFullStr+'"]')
							$target_holiday.addClass('holiday holiday_custom');
							$target_holiday.attr('title', holidayLabel);
							holidayCnt++;
						}
					}

					for(var hh =0; hh<= __manmonth.holiday_default.length-1; hh++){
						var holidayStr = Data.dateFormat(__manmonth.holiday_default[hh].date);
						var holidayLabel = __manmonth.holiday_default[hh].label;
						var dateHolidayStr = dateFullStr.split(__g.dateObj.seperate)[1] + '/' + dateFullStr.split(__g.dateObj.seperate)[2]
						if(dateHolidayStr == holidayStr) {
							// console.log('holidayStr:', holidayStr);
							var $target_holiday = $thead.find('tr.tr_date').find('th[data-day="'+dateHolidayStr+'"]')
							$target_holiday.addClass('holiday holiday_custom');
							$target_holiday.attr('title', holidayLabel);
							holidayCnt++;
						}
					}
				}
			}

			__projectDate.totalDate = dateCnt;
			__projectDate.totalWeek = weekCnt;
			__projectDate.totaHoliday = holidayCnt
			//=== End calendar


			//Total =================
			//3. Tfoot: page Total & insert Date
			for(var i = colStart ; i<= colNum; i++){
				var $tds = '';

				for(var j=rowStart; j<=rowNum; j++ ){
					var pageCnt = (reportObj.obj[i].day[j].cnt != 0) ? reportObj.obj[i].day[j].cnt : '';
					var pageLabel = reportObj.obj[i].day[j].label;
					$tbody.find('tr.tr'+i).find('td[data-date="'+pageLabel+'"]').html('<span class="link_num">'+pageCnt+'</span>');
					$tfoot.find('tr.tr_total').find('th.total[data-date="'+pageLabel+'"]').html('<span class="link_num">'+reportObj.totalCol_day[j]+'</span>');
				}

				var corderStr = reportObj.corder[i];

				//개인휴가 삽입
				for(var dd= 0; dd<=__manmonth.corder.length -1; dd++){
					if(__manmonth.corder[dd].name == corderStr) {
						for(var cc= 0; cc<=__manmonth.corder[dd].vacation.length -1; cc++){
							var vacationStr = Data.dateFormat(__manmonth.corder[dd].vacation[cc].date);
							var vacationLabel = __manmonth.corder[dd].vacation[cc].label;
							var vacationDay = __manmonth.corder[dd].vacation[cc].day;
							$tbody.find('tr.tr'+i).find('td[data-date="'+vacationStr+'"]').addClass('vacation')
							$tbody.find('tr.tr'+i).find('td[data-date="'+vacationStr+'"]').html('<span class="vacation_num" title="'+vacationLabel+'">-'+vacationDay+'</span>');
						}
					}
				}
			}

			//3. Tfoot: Week Total
			reportObj.week=[];
			reportObj.totalCol_week=[];

			for(var k = colStart ; k<= colNum; k++){
				reportObj.obj[k].week = [];
			}

			//개인별 week CALC
			for(var i = 0 ; i<= __projectDate.totalWeek; i++){
				//개인별 week
				for(var k = colStart ; k<= colNum; k++){
					reportObj.obj[k].week[i] ={}
					var weekSum_corder = 0;
					$tbody.find('tr').eq(k).find('td[data-week="'+i+'"]').each(function(){
						if($(this).find('.link_num').text() != 0){
							weekSum_corder += Number($(this).find('.link_num').text());
						}
					});
					// reportObj.obj[k].week[i].year = weekSum_corder;//@@@@ 년도 삽입예정
					reportObj.obj[k].week[i].cnt = weekSum_corder;
				}

				//전체 week
				var weekSum_total = 0;
				$tfoot.find('tr.tr_total').find('th[data-week="'+i+'"]').each(function(){
					if($(this).text() != 0){
						weekSum_total += Number($(this).text());
					}
				});
				__projectDate.ARweek[i] = weekSum_total;

				if(weekSum_total != 0 ) {
					reportObj.totalCol_week.push(weekSum_total) ;
					reportObj.week.push(i) ;
					$tfoot.find('tr.tr_week').find('th[data-week="'+i+'"] .sum').text(weekSum_total);
				}
			}

			//EVNET: Date & Total
			$table.find('td.item:not(.vacation), th.total').on('click', function(){
				showItem($(this))
			});

			function showItem($this){
				var totalFlag = $this.hasClass('total') ? true : false;
				if($this.text().length>0){
					var dateStr = $this.data('date');
					var corder = reportObj.corder[$this.parent().index()];

					var cnt = 1;
					var $trs = rMap.contentTrs;
					$trs.each(function(){
						$(this).hide();
						var targetDate = $(this).find('.rdate').data('date');

						if(totalFlag) {
							if(targetDate == dateStr) showPage($(this), cnt++);
						}else{
							if($(this).find('.corder').text() == corder && targetDate == dateStr) showPage($(this), cnt++);
						}
					});
					Popup.close();
				}
			}//end Event showItem

			//EVNET: week
			$table.find('tr.tr_week th').on('click', function(){
				showItem_week($(this))
			});

			function showItem_week($this){
				if($this.find('.sum').text().length>0){
					var idx = $this.index();
					var idx_week = $this.data('week')
					var ARdateStr = __projectDate.ARweek_date[idx_week];
					var corder = reportObj.corder[$this.parent().index()];
					var cnt = 1;

					rMap.contentTrs.each(function(){
						$(this).hide();
						var targetDate = $(this).find('.rdate').data('date');
						for(var i = 0; i< ARdateStr.length; i++){
							if(targetDate == ARdateStr[i]) showPage($(this), cnt++);
						}
					});
					Popup.close();
				}
			}//end Event showItem
		}

		, table_date = function(){
			var $reportArea = appendTable('date_report', 'Date');

			var $table =$reportArea.find('.table_report');
			var $thead =$table.find('.table_report_head');
			var $tbody =$table.find('.table_report_body');
			var $tfoot =$table.find('.table_report_foot');

			var $tableClone =$reportArea.find('.table_report_clone');
			var $theadClone =$tableClone.find('.table_report_head');
			var $tbodyClone =$tableClone.find('.table_report_body');
			var $tfootClone =$tableClone.find('.table_report_foot');

			var rowStart = 0;
			var rowEnd = reportObj.day.length-1;
			var colStart = 0;
			var colNum = reportObj.corder.length-1;

			//1. Thead, Tfoot
			var $thead_ths ='';
			var $tfoot_ths ='';

			for(var i = rowStart ; i<= rowEnd; i++){
				var monStr = reportObj.day[i] ? reportObj.day[i] +'': '내용없음';
				var dateFullStr = reportObj.day[i];
				var ARdateYear = reportObj.day[i].split(__g.dateObj.seperate);
				var dateYear = ARdateYear[0]+__g.dateObj.seperate+ARdateYear[1];

				$thead_ths += '<th scope="col" class="item" data-date="'+dateFullStr+'" data-year="'+dateYear+'"><a href="javascript:void(0);" class="btn_cal_move btn_date">'+monStr+'</a></th>';
				$tfoot_ths += '<th class="total" data-date="'+dateFullStr+'"><span class="link_num">'+reportObj.totalCol_day[i]+'</span></th>';
			}

			$thead.find('tr').append($thead_ths);
			$tfoot.find('tr').append($tfoot_ths);

			//2.Tbody
			for(var i = colStart ; i<= colNum; i++){
				var corderStr = reportObj.corder[i] ? reportObj.corder[i] : '담당자없음';
				var $tds = '';

				for(var j = rowStart; j <= rowEnd; j++ ){
					var pageCnt = (reportObj.obj[i].day[j].cnt != 0) ? reportObj.obj[i].day[j].cnt : '';
					var dateFullStr = reportObj.obj[i].day[j].label;
					if(pageCnt =='') $tds += '<td class="item item'+j+'"></td>';
					else $tds += '<td class="cursor item item'+j+'" data-date="'+dateFullStr+'"><span class="link_num">'+pageCnt+'</span></td>';
				}

				var _tbody =''
					+'<tr>'
					+ '<th scope="row" class="corder">'+corderStr+'</th>'
					+ $tds
					+'</tr>'
				;
				$tbody.append(_tbody);
				$tbodyClone.append(_tbody);
			}

			//Event
			$table.find('td.item, th.total').on('click', function(){
				showItem($(this))
			});

			function showItem($this){
				var totalFlag = $this.hasClass('total') ? true : false;
				if($this.text().length>0){
					var idx = $this.index();
					var dateStr = $this.closest('table').find('thead th').eq(idx).data('date');
					var corder = reportObj.corder[$this.parent().index()];

					var cnt = 1;
					rMap.contentTrs.each(function(){
						$(this).hide();
						var targetStr = $(this).find('.rdate').data('date');

						if(totalFlag) {
							if(targetStr == dateStr) showPage($(this), cnt++);
						}else{
							if($(this).find('.corder').text() == corder && targetStr == dateStr) showPage($(this), cnt++);
						}
					});
					Popup.close();
				}
			}//end Event showItem
		}

		, table_week = function(){
			var $reportArea = appendTable('week_report', "Week")
				, $table =$reportArea.find('.table_report')
				, $thead =$table.find('.table_report_head')
				, $tbody =$table.find('.table_report_body')
				, $tfoot =$table.find('.table_report_foot')
				//clone
				, $tableClone =$reportArea.find('.table_report_clone')
				, $theadClone =$tableClone.find('.table_report_head')
				, $tbodyClone =$tableClone.find('.table_report_body')
				, $tfootClone =$tableClone.find('.table_report_foot')

				, rowStart = 0
				, colStart = 0
				, rowNum = reportObj.week.length-1
				, colNum = reportObj.corder.length-1

				//1. Thead, Tfoot
				, $thead_ths =''
				, $tfoot_ths =''
			;

			for(var i = rowStart ; i<= rowNum; i++){
				var weekNum = reportObj.week[i]
					, weekStart = __projectDate.ARweek_date[weekNum][0]
					, weekEnd = __projectDate.ARweek_date[weekNum][__projectDate.ARweek_date[weekNum].length - 1]
				;
				$thead_ths += '<th scope="col" data-week="'+weekNum+'" data-week-start="'+weekStart+'" data-week-end="'+weekEnd+'"><a href="javascript:void(0);" class="btn_cal_move btn_week"> W'+reportObj.week[i]+'</a></th>';
				$tfoot_ths += '<th class="total"><span class="link_num">'+reportObj.totalCol_week[i]+'</span></th>';
			}

			$thead.find('tr').append($thead_ths);
			$tfoot.find('tr').append($tfoot_ths);

			//2. Tbody
			for(var i = colStart ; i <= colNum; i++){
				var corderStr = reportObj.corder[i] ? reportObj.corder[i] : '담당자없음';
				var $tds = '';

				for(var j = rowStart; j <= rowNum; j++ ){
					var pageCnt = (reportObj.obj[i].week[reportObj.week[j]].cnt != 0) ? reportObj.obj[i].week[reportObj.week[j]].cnt : '';
					$tds += '<td class="item item'+j+'"><span class="link_num">'+pageCnt+'</span></td>';
				}

				var _tbody =''
					+'<tr>'
					+ '<th scope="row" class="corder">'+corderStr+'</th>'
					+ $tds
					+'</tr>'
				;
				$tbody.append(_tbody);
				$tbodyClone.append(_tbody);
			}


			//Event
			$table.find('td.item, th.total').on('click', function(){
				showItem($(this))
			});

			function showItem($this){
				var totalFlag = $this.hasClass('total') ? true : false;
				if($this.text().length>0){
					var idx = $this.index()
						, idx_week = $this.closest('table').find('thead th').eq(idx).data('week')
						, ARdateStr = __projectDate.ARweek_date[idx_week]
						, corder = reportObj.corder[$this.parent().index()]
					;

					var cnt = 1;
					rMap.contentTrs.each(function(){
						$(this).hide();
						var targetData = $(this).find('.rdate').data('date');

						for(var i = 0; i< ARdateStr.length; i++){
							if(totalFlag) {
								if(targetData == ARdateStr[i]) showPage($(this), cnt++);
							}else{
								if($(this).find('.corder').text() == corder && targetData == ARdateStr[i]) showPage($(this), cnt++);
							}
						}
					});
					Popup.close();
				}
			}//end Event showItem
		}

		, table_month = function(){
			var $reportArea = appendTable('month_report', 'Month');

			var $table =$reportArea.find('.table_report');
			var $thead =$table.find('.table_report_head');
			var $tbody =$table.find('.table_report_body');
			var $tfoot =$table.find('.table_report_foot');

			var rowStart = 0;
			var rowNum = reportObj.month.length-1;
			var colStart = 0;
			var colNum = reportObj.corder.length-1;

			//1. Thead, Tfoot
			var $thead_ths ='';
			var $tfoot_ths ='';
			for(var i = rowStart ; i<= rowNum; i++){
				var monStr = reportObj.month[i] ? reportObj.month[i] : '내용없음';
				var dataMonth =  reportObj.obj[0].month[i].label;
				if(monStr == "N월")  monStr = "N/A";
				$thead_ths += '<th scope="col" class="item" data-year='+dataMonth+'><a href="javascript:void(0);" class="btn_cal_move btn_month">'+monStr+'</a></th>';
				$tfoot_ths += '<th class="total" data-month="'+dataMonth+'"><span class="link_num">'+reportObj.totalCol[i]+'</span></th>';
			}
			$thead.find('tr').append($thead_ths);
			$tfoot.find('tr').append($tfoot_ths);

			//2.Tbody
			for(var i = colStart ; i<= colNum; i++){
				var corderStr = reportObj.corder[i] ? reportObj.corder[i] : '담당자없음';
				var $tds = '';

				for(var j=rowStart; j<=rowNum; j++ ){
					var pageCnt = (reportObj.obj[i].month[j].cnt != 0) ? reportObj.obj[i].month[j].cnt : '';
					var dataMonth = reportObj.obj[i].month[j].label;
					if(pageCnt =='') $tds += '<td class="item item'+j+'" data-month="'+dataMonth+'"></td>';
					else $tds += '<td class="cursor item item'+j+'" data-month="'+dataMonth+'"><span class="link_num">'+pageCnt+'</span></td>';
				}

				var _tbody =''
					+'<tr>'
					+ '<th scope="row" class="corder">'+corderStr+'</th>'
					+ $tds
					+'</tr>'
				;
				$tbody.append(_tbody);
			}

			//Event
			$table.find('td.item, th.total').on('click', function(){
				showItem($(this))
			});


			function showItem($this){
				var totalFlag = $this.hasClass('total') ? true : false;

				if($this.text().length>0){
					var idx = $this.index();
					var dataMonth = $this.data('month');
					var corder = reportObj.corder[$this.parent().index()];

					//첫달, 마지막달
					var firstMonth = reportObj.month[0];//2021/01
					var lastMonth = firstMonth;
					if(reportObj.month.length > 1) lastMonth = reportObj.month[reportObj.month.length-1]//2021/01

					var cnt = 1;

					rMap.contentTrs.each(function(){
						$(this).hide();
						var monData = $(this).find('.rdate').data('date');
						if(!!monData){
							var ARdata = monData.split(__g.dateObj.seperate);
							var targetData = ARdata[0]+__g.dateObj.seperate+ARdata[1];

							__projectDate.ARmonth_date[idx -1]

							if(totalFlag) {
								if(targetData == dataMonth) {
									if(dataMonth == firstMonth || dataMonth == lastMonth){
										for(var iii = 0; iii <= __projectDate.ARmonth_date[idx -1].length-1; iii++){
											if(monData == __projectDate.ARmonth_date[idx -1][iii]) showPage($(this), cnt++);
										}
									}else showPage($(this), cnt++);
								}
							}else{
								if($(this).find('.corder').text() == corder && targetData == dataMonth) {
									if(dataMonth == firstMonth || dataMonth == lastMonth){
										for(var iii = 0; iii <= __projectDate.ARmonth_date[idx -1].length-1; iii++){
											if(monData == __projectDate.ARmonth_date[idx -1][iii]) showPage($(this), cnt++);
										}
									}else showPage($(this), cnt++);
								}
							}
						}
					});
					Popup.close();
				}
			}//end Event showItem
		}

		, table_total = function(){
			var $reportArea = appendTable('total_report', 'Total');
			var $table =$reportArea.find('.table_report');
			var $thead =$table.find('.table_report_head');
			var $tbody =$table.find('.table_report_body');
			var $tfoot =$table.find('.table_report_foot');
			var calStr = '* '+Number(__projectDate.totalYear)+'년('
				+ __projectDate.totalMonth +'개월, '
				+ __projectDate.totalWeek +'주,  '
				+ __projectDate.totalDate +'일('
				+ '작업일+휴일='
				+ Number(__projectDate.totalDate - __projectDate.totaHoliday) +'+'
				+ __projectDate.totaHoliday +')'
			;

			$table.append('<div class="info_area">* 작업완료일기준(Child, Delete 포함)</div>')

			var rowStart = 0;
			var colStart = 0;
			var rowNum = 1;
			var colNum = reportObj.corder.length-1;

			//1. Thead, Tfoot
			var $thead_ths = ''
				+'<th scope="col" class="item">Pages</th>'
				+'<th scope="col" class="item nan">Except</th>'
				+'<th scope="col" class="item startdate">투입일</th>'
				+'<th scope="col" class="item enddate">철수일</th>'
				+'<th scope="col" class="item holiday">휴가</th>'
				+'<th scope="col" class="item workday">작업일</th>'
				+'<th scope="col" class="item rate">생산성</th>'
			;

			$thead.find('tr').append($thead_ths);

			//2.Tbody
			var tmpNanNum = 0;
			var vacationNumTotal = 0; //전체휴가
			var vacationNumTotal_period = 0; //기간내 전체휴가
			var realWorkdayNumTotal = 0; //총 작업일
			var rateTotal = 0; //총 생산성
			for(var i = colStart ; i<= colNum; i++){
				var corderStr = reportObj.corder[i] ? reportObj.corder[i] : '담당자없음';

				var nanNum = reportObj.obj[i].nan_cnt; //N/A
				tmpNanNum += nanNum;

				//휴가
				var vacationNum = 0;
				var vacationNum_period = 0;

				//투입일
				var startDate = 0;
				var endDate = 0;
				var startIndex = 0;
				var endIndex = 0;

				var workdayNum =0;
				var holidayNum = 0;
				var holidayNumTotal = 0;
				var realWorkdayNum = 0;

				var rate = 0;

				for(var dd= 0; dd<=__manmonth.corder.length -1; dd++){
					if(__manmonth.corder[dd].name == corderStr) {
						//투입, 철수일
						startDate = __manmonth.corder[dd].startDate = Data.dateFormat(__manmonth.corder[dd].startDate);
						endDate = __manmonth.corder[dd].endDate = Data.dateFormat(__manmonth.corder[dd].endDate);

						//개인의 투입 철수일 기준
						// 1. 프로젝트시작일(02/02) > 투입일(01/01) = 프로젝트 (X)
						// 1. 프로젝트시작일(01/01) <= 투입일(02/02) = 투입일
						// 2. 프로젝트종료일(02/02) >= 철수일(01/01) = 철수일
						// 2. 프로젝트종료일(01/01) < 철수일(02/02) = 종료일(x)\

						var inputDate =startDate;
						var outputDate = endDate
						var inputNum = Helper.dateToNum(startDate);
						var outputNum = Helper.dateToNum(endDate);
						var projectStartNum = Helper.dateToNum(__projectDate.projectStartDate);
						var projectEndNum = Helper.dateToNum(__projectDate.projectEndDate);
						if(inputNum <= projectStartNum) inputDate = __projectDate.projectStartDate;
						if(outputNum >= projectEndNum) outputDate = __projectDate.projectEndDate;

						startIndex = Number($('.calendar_report .table_report_head .tr_date').find('th[data-date="'+inputDate+'"]').index());
						endIndex = Number($('.calendar_report .table_report_head .tr_date').find('th[data-date="'+outputDate+'"]').index());

						//작업자별 휴가
						for(var cc= 0; cc<= __manmonth.corder[dd].vacation.length -1; cc++){
							vacationNum += __manmonth.corder[dd].vacation[cc].day;//개인의 전체휴가
							var periodFlag = Helper.periodDate(__manmonth.corder[dd].vacation[cc].date);//개인의 프로젝트 기간내 휴가 true
							if(periodFlag) vacationNum_period += __manmonth.corder[dd].vacation[cc].day;
						}
					}
				}
				vacationNumTotal += vacationNum//전체 휴가일
				vacationNumTotal_period += vacationNum_period//기간내  휴가일

				//실 작업일수 계산, 휴일계산
				$('.calendar_report .table_report_head .tr_date').find('th').each(function(i){
					if(i >= startIndex && i <= endIndex ){
						workdayNum++;
						if($(this).hasClass('holiday')) holidayNum++;
					}
				});

				//실 작업일
				realWorkdayNum = workdayNum - holidayNum - vacationNum_period;
				realWorkdayNumTotal += realWorkdayNum


				//생산성 = page / 작업일
				rate = Number(reportObj.totalRow[i] / realWorkdayNum).toFixed(2);
				//=========================================================

				//작업자별
				var _tbody =''
					+'<tr>'
					+ '<th scope="row" class="corder">'+corderStr+'</th>'
					+ '<td scope="row" class="cursor item"><span class="link_num">'+reportObj.totalRow[i]+'</span></td>'// Pages
					+ '<td scope="row" class="cursor item nan"><span class="link_num">N/A : '+nanNum+'</span></td>'// N/A
					+ '<td scope="row" class="item period startdate"><span class="link_num no_link">'+startDate+'</span></td>'// 투입일
					+ '<td scope="row" class="item period enddate"><span class="link_num no_link">'+endDate +'</span></td>'// 철수일
					+ '<td scope="row" class="item holiday"><span class="link_num no_link">'+vacationNum_period +'</span></td>'// 기간휴가
					+ '<td scope="row" class="item workday"><span class="link_num no_link">'+realWorkdayNum +'</span></td>'// 작업일
					+ '<td scope="row" class="item rate"><span class="link_num no_link">'+rate +'</span></td>'// 생산성
					+'</tr>'
				;
				$tbody.append(_tbody);
			}

			var empty_nanNum = reportObj.day_nan_index.length - tmpNanNum;

			//총생산성
			rateTotal = Number(reportObj.totalSum / realWorkdayNumTotal).toFixed(2);

			//담당자 없음
			var _tbody2 =''
				+'<tr>'
				+ '<th scope="row" class="corder">담당자없음</th>'//
				+ '<td scope="row" class="cursor item empty "><span class="link_num">('+(reportObj.corder_empty_index.length)+')</span></td>'// Pages(담당자 없음)
				+ '<td scope="row" class="cursor item empty nodate"><span class="link_num">No Date : '+(reportObj.day_nan_index.length)+'</span></td>'// N/A(날짜 없음)
				+ '<td scope="row" class="cursor item empty period startdate"><span class="link_num no_link">-</span></td>'// 투입일
				+ '<td scope="row" class="cursor item empty period enddate"><span class="link_num no_link">-</span></td>'// 철수일
				+ '<td scope="row" class="cursor item empty holiday"><span class="link_num no_link">-</span></td>'// 휴가
				+ '<td scope="row" class="cursor item empty workday"><span class="link_num no_link">-</span></td>'// 작업일
				+ '<td scope="row" class="cursor item empty rate"><span class="link_num no_link">-</span></td>'// 생산성
				+'</tr>'
			;
			$tbody.append(_tbody2);

			//3.Tfoot
			var $tfoot_ths =''
				+'<th scope="row" class="total page" style="min-width:100px"><span class="link_num">'+Number(reportObj.totalSum)+'</span></th>'// Total
				+'<th scope="row" class="total nan nodate" style="width:100px"><span class="link_num">'+Number((nanNum) + (reportObj.day_nan_index.length))+'</span></th>' //N/A, NoDate
				+'<th scope="row" class="total period startdate" style="width:100px"><span class="link_num no_link">'+__projectDate.projectStartDate +'</span></th>' // 투입일
				+'<th scope="row" class="total period enddate" style="width:100px"><span class="link_num no_link">'+__projectDate.projectEndDate +'</span></th>' // 철수일
				+'<th scope="row" class="total holiday" style="width:100px"><span class="link_num no_link">'+vacationNumTotal_period+'</span></th>' // 기간휴가
				+'<th scope="row" class="total workday" style="width:100px"><span class="link_num no_link">'+realWorkdayNumTotal+'</span></th>' // 작업일
				+'<th scope="row" class="total rate" style="width:100px"><span class="link_num no_link">'+rateTotal+'</span></th>' // 총생산성
			;
			$tfoot.find('tr').append($tfoot_ths);

			//Event
			$table.find('td.item:not(.holiday), th.total:not(.holiday)').on('click', function(){
				if($(this).find('.link_num').hasClass('no_link')) return false;
				showItem($(this));
			});

			function showItem($this){
				var totalFlag = $this.hasClass('total') ? true : false;//total
				var emptyFlag = $this.hasClass('empty') ? true : false;//담당자 없음
				var nanFlag = $this.hasClass('nan') ? true : false;//N/A
				var nodateFlag = $this.hasClass('nodate') ? true : false;//날짜없음

				if($this.text().length>0){
					var idx = $this.index();
					var corder = reportObj.corder[$this.parent().index()];

					var cnt = 1;
					rMap.contentTrs.each(function(i){
						$(this).hide();
						var targetCorderStr = $(this).find('.corder').text();
						var targetDateStr = $(this).find('.rdate').data('date');
						var periodFlag = Helper.periodDate(targetDateStr);//프로젝트 기간내 날짜일경우 true

						if(totalFlag) {//Total : 완료일 없을경우 제외
							if(nanFlag){//완료일(N/A)
								if(nodateFlag){//No Date
									if(targetDateStr == 'N/A' || targetDateStr == '') {
										showPage($(this), cnt++);
									}
								}else{
									if(targetDateStr == 'N/A') showPage($(this), cnt++);
								}
							}else if(targetDateStr != '' && targetDateStr !='N/A' ) {//: 완료일 없을경우 제외
								if(periodFlag) showPage($(this), cnt++); // 고민필요
							}
						}
						else{
							if(emptyFlag && !nanFlag){//담당자없음
								if(targetCorderStr == ''&& targetDateStr !='N/A') {//: 완료일 없을경우
									showPage($(this), cnt++);
								}
							}
							else if(emptyFlag && nanFlag){//담당자 없음, 완료일(N/A)
								if(targetCorderStr == '' && targetDateStr == 'N/A') {
									showPage($(this), cnt++);
								}
							}
							else if(nanFlag && !emptyFlag){//완료일(N/A)
								if(targetCorderStr == corder && targetDateStr == 'N/A') {
									showPage($(this), cnt++);
								}
							}
							else if(nanFlag && nodateFlag){//담당자 없음, 날짜없음
								if(targetCorderStr == '' && targetDateStr == '') {
									showPage($(this), cnt++);
								}
							}
							else if(targetCorderStr == corder && targetDateStr != '' && targetDateStr !='N/A') {
								if(periodFlag)  showPage($(this), cnt++);
							}
						}
					});
					Popup.close();
				}
			}//end Event showItem
		}

		, table_handler = function(){
			//date
			$('.btn_cal_move.btn_date').on('click', function(){
				$('.pop_con').scrollTop(0);
				// var value = $(this).text();
				var value = $(this).parent().data('date')
				var $target =$('.calendar_report .table_report .table_report_head .tr_date').find('.item[data-date="'+value+'"]');
				var ARyearStr = $target.data('date').split(__g.dateObj.seperate);
				var yearStr = String(ARyearStr[0] +__g.dateObj.seperate + ARyearStr[1]);
				var $yearTarget = $('.calendar_report .table_report .table_report_head').find('.th_year[data-year="'+yearStr+'"]');
				var goLeft = $yearTarget.position().left - 107;
				$('.calendar_report .table_report').scrollLeft(goLeft);

				//blink
				$target.addClass('set_blink');
				setTimeout(function(){$target.removeClass('set_blink')},1000);
			});

			//week
			$('.btn_cal_move.btn_week').on('click', function(){
				$('.pop_con').scrollTop(0);
				var value = $(this).parent().data('week');
				var $target = $('.calendar_report .table_report .table_report_foot .tr_week').find('th[data-week="'+value+'"]');
				var goLeft = $target.position().left - 107;
				$('.calendar_report .table_report').scrollLeft(goLeft);

				//blink
				$target.addClass('set_blink');
				setTimeout(function(){$target.removeClass('set_blink')},1000);
			});

			//month
			$('.btn_cal_move.btn_month').on('click', function(){
				$('.pop_con').scrollTop(0);
				var yearStr = $(this).parent().data('year');
				var $yearTarget = $('.calendar_report .table_report .table_report_head').find('.th_year[data-year="'+yearStr+'"]');

				var $dateTarget = $('.date_report .table_report .table_report_head').find('.item[data-year="'+yearStr+'"]');
				var goLeft = $yearTarget.position().left - 107;
				var goLeft_date = $dateTarget.position().left - 107;
				$('.calendar_report .table_report').scrollLeft(goLeft);
				$('.date_report .table_report').scrollLeft(goLeft);

				//blink
				$yearTarget.addClass('set_blink');
				$dateTarget.addClass('set_blink');
				setTimeout(function(){
					$yearTarget.removeClass('set_blink')
					$dateTarget.removeClass('set_blink')
				},1000);
			});


			//corder
			var toggleFlag = false;
			$('.report_area .table_report_body .corder').on('click', function(){
				var idx = $(this).parent().index();
				// console.log('corder :'+ idx)
				$('.report_area').each(function(){
					$(this).find('.table_report_body').each(function(){
						if(! toggleFlag) $(this).find('tr').eq(idx).siblings().hide();
						else $(this).find('tr').eq(idx).siblings().show();
					})
				})
				toggleFlag  = !toggleFlag;
			});


			//캘린더 날짜 클릭시 재설정
			var calCnt = 0;
			var setStartDate;
			var setEndDate;
			var setStartDateNum;
			var setEndDateNum;
			var $calDate = $('.report_area.calendar_report .table_report .table_report_head .tr_hread.tr_date');
			var $periodBtn = $('.calendar_report .btn_area .btn_period');
			var $totalBtn = $('.calendar_report .btn_area .btn_total');
			var $dateForm = $('.calendar_report .btn_area .date_form');
			var $startForm = $dateForm.find('.start_date')
			var $endForm = $dateForm.find('.end_date')

			function btnPeriodSet(){
				if(__g.dateObj.datePeriodFlag){//기간설정
					$periodBtn.removeClass('active')
					$totalBtn.show();
					$totalBtn.addClass('active')
				}else{
					$totalBtn.hide();
				}
			}

			btnPeriodSet()

			//calandar Date Handler
			//초기날 , 마지막 날설정
			$calDate.find('.item').on('click', function(){
				calCnt ++;

				if($(this).hasClass('start')){
					$(this).removeClass('start');
					$calDate.find('.item').removeClass('end');
					setStartDate = __projectDate.projectStartDate;
					setEndDate = __projectDate.projectEndDate;
					$startForm.text(setStartDate);
					$endForm.text(setEndDate);

					$periodBtn.removeClass('active');
					calCnt =0;
				}
				else if($(this).hasClass('end')){
					$(this).removeClass('end');
					setEndDate = __projectDate.projectEndDate;
					$endForm.text(setEndDate);
					$periodBtn.removeClass('active');
					calCnt =1;
				}
				else{
					if(calCnt == 1){
						$(this).addClass('start');
						setStartDate = $(this).data('date');
						setStartDateNum = Helper.dateToNum(setStartDate);
						$startForm.text(setStartDate);
					}
					if(calCnt ==2){
						$(this).addClass('end')
						setEndDate = $(this).data('date');
						setEndDateNum = Helper.dateToNum(setEndDate);

						//초기 설정 이전 날짜 선택시
						if(setStartDateNum >= setEndDateNum){
							calCnt =1;
							//reset
							$calDate.find('.item').removeClass('start');
							$calDate.find('.item').removeClass('end');

							$(this).addClass('start');
							setStartDate = $(this).data('date');
							setStartDateNum = Helper.dateToNum(setStartDate);
							$startForm.text(setStartDate);
						}else{
							$periodBtn.addClass('active');
							$endForm.text(setEndDate);
						}
					}
				}
			});

			//기간설정
			$periodBtn.on('click', function(){
				if(calCnt >=2){
					__projectDate.projectStartDate = setStartDate
					__projectDate.projectEndDate = setEndDate
					__g.dateObj.datePeriodFlag = true;

					Popup.close(function(){
						Popup.open('modal_report', 'Search', '' , function(){
							set();
						});
					})
				}
			})

			//기간 초기화
			$totalBtn.on('click', function(){
				if(__g.dateObj.datePeriodFlag){
					__projectDate.projectStartDate = __projectDate.projectStartDate_ORI
					__projectDate.projectEndDate = __projectDate.projectEndDate_ORI

					__g.dateObj.datePeriodFlag = false;

					Popup.close(function(){
						Popup.open('modal_report', 'Search', '' , function(){
							set();
						});
					})
				}
			})
		}

		, showPage = function($this, _cnt){
			$this.find('td.num').find('.number_tmp').remove();
			$this.show();
			$this.find('td.num').append('<i class="number_tmp">'+(_cnt)+'</i>');
		}

		, appendBtn = function(){
			var $option_list = $('#setting .option_area[data-option="etc"] .option_list');
			$('.filter_rate tr:last-child label').append('<a href="javascript:void(0);" class="btn_report" style="text-decoration:none; cursor:default;"><span style="min-width:10px;">.</span></a>');

			var $btn = $('.btn_report');

			//01. Setting.btn_export 클릭시
			$btn.on('click', function(){
				open();
				Setting.close();
				return false;
			});
		}

		, open = function(){
			Popup.open('modal_report', 'Search', '' , function(){
				set();
			});
		}

		//Setting > Search > 담당자 체크 되어 있어야 정확한 수치 가능 (담당자등 : 공백제거 원인)
		, set = function(){
			setMap();
			project.setDate();

			if(setData()){
				setTimeout(function(){
					table_calendar();
					table_date();
					table_week();
					table_month();
					table_total();
					table_handler();
				}, 300);
			}else{
				Popup.close(function(){
					__projectDate.projectStartDate = __projectDate.projectStartDate_ORI;
					__projectDate.projectEndDate = __projectDate.projectEndDate_ORI;
					__g.dateObj.datePeriodFlag = false;
					Popup.open('modal_alert', 'Alert', '<div>작업된 페이지가 없습니다. <br> 기간설정을 다시 해주세요.</div>');
				});
			}
		}

		, initModule = function(){
			appendBtn();
			// open();
		}

		return {
			initModule : initModule
			, open : open
		}
	})();


	/**
	 * init
	 * --------------------------------------
	 */
	var initModule = function(options, callback){
		options = options || {
			version : 'worklist'
			, desktop:{
				setting:{
					table :[true, true, true, true,	true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
				}
			}
		};

		setMap(options);
		project.initModule();
		directory.initModule();
		setHtml();

		Storage.initModule();
		View.initModule();

		Setting.initModule(function(){
			AppendNum.initModule();//초기 넘버링
			if(Setting.bool(__g.settingObj.data.data)) Data.initModule();
			if(Setting.bool(__g.settingObj.data.table_folding)) TableFolding.initModule();// Data와 연동
			Nav.initModule();//2Depth show는 Data와 연동
			if(Setting.bool(__g.settingObj.data.filter)) Filter.initModule(); // ColorBox는 Data와 연동
			if(Setting.bool(__g.settingObj.option.component)) Component.initModule();

			HeaderFolding.initModule();
			Popup.initModule();
			Search.initModule(); //Table과 연동
			Log.initModule();//[22/12/06]: folding Btn insert 위해 Serch 뒤에 호출
			More.initModule();
			Export.initModule();
			if(Setting.bool(__g.settingObj.option.id_split)) Etc.idSplit();
			// SideNav.initModule(); //20211222 추후 작업예정
			if(Setting.bool(__g.settingObj.option.quick)) Quick.initModule();
		});

		Todo.initModule();
		Report.initModule();

		rMap.content.css({'visibility' :'visible'});//화면 튐현상 방지
		$('.info_section .info_box').addClass('show');

		// console.log('testsestste')
		if (callback) callback();
		//초기 보여지는 메뉴 : View All(전체보기) -> 추후 set으로 변경
	}

	var colorboxReset = function(){
		ColorBox.resetModule();
	}

	return {
		initModule : initModule
		, colorboxReset : colorboxReset
		, report : Report.open
	}
})();





//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
function report(){
	Worklist.report();
}

/*
//colorbox iframe 관련 ui_common.js 에서 호출
function toggleWatch(){
	var $iframe = $('#cboxIframe');
	$iframe.addClass('loadOn');
}
*/
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■




//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■




//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■



/**
* worklist.util
* --------------------------------------
*/

function checkBrowser() {
 var browserType = "";
 if(navigator.userAgent.indexOf("MSIE") != -1) {
	browserType = "IE";
	return browserType;
 }
 if(navigator.userAgent.indexOf("Firefox") != -1) {
	browserType = "FF";
	return browserType;
 }
 if(navigator.userAgent.indexOf("Mozilla") != -1) {
	browserType = "MZ";
	return browserType;
 }
 if(navigator.userAgent.indexOf("Opera") != -1) {
	browserType = "OP";
	return browserType;
 }
 if(navigator.userAgent.indexOf("Safari") != -1) {
	browserType = "SF";
	return browserType;
 }
 if(navigator.userAgent.indexOf("Mac") != -1) {
	browserType = "MC";
	return browserType;
 }

 browserType = "NG";
 return browserType;
}


/**
* Util Function
* --------------------------------------
*/
var Util = {
	getFileName : function() {
		var path=location.pathname.split("/");
		return path[path.length-1];
	}
	, getDirName : function() {
		var path=location.pathname.split("/");
		return path[path.length-2];
	}
	, getProjectName : function() {
		var path=location.pathname.split("/");
		return path[1];
	}
	, isChrome : function(){
		if(navigator.userAgent.indexOf("Chrome") != -1){
			return true;
		}
		return false;
	}
	, isLocal : function(){
		if(window.location.toString().substr(0,4) == "http"){
			return false;
		}else{
			return true;
		}
	}
	, windowPopup : function (_url, _win, _w, _h,_scroll){
		var popW=_w;
		var popH=_h;
		var windowX = Math.ceil( (window.screen.width - popW) / 2 );
		var windowY =30;
		window.open(_url, _win, 'width='+_w+', height='+_h+', menubar=no, status=no, toolbar=no, scrollbars='+_scroll+', left='+windowX+', top='+windowY);
	}
	, tabHandler : function (_tabNav, _tabCon, _num, _callback){
		var initActNum=_num;
		var $tabNav=$(_tabNav);
		var $tabCon=$(_tabCon);
		var $navItem = $tabNav.find("li");

		$navItem.eq(initActNum).addClass("on");
		$tabCon.hide();
		$tabCon.eq(initActNum).show();

		$navItem.each(function(){
			$(this).find('a').attr('role', 'tab');
			$(this).find('a').attr('title', '선택하기');
			$(this).find('a').attr('aria-selected', 'false');
		});

		$navItem.eq(initActNum).find('a').attr('title', '선택됨');
		$navItem.eq(initActNum).find('a').attr('aria-selected', true);

		$tabNav.on('click','a',function(){
			var clickNum = $(this).parent().index();
			$navItem.removeClass("on").eq(clickNum).addClass("on");

			$navItem.find('a').attr('title', '선택하기');
			$navItem.find('a').attr('aria-selected', 'false');
			$navItem.eq(clickNum).find('a').attr('title', '선택됨');
			$navItem.eq(clickNum).find('a').attr('aria-selected', true);

			$tabCon.hide();
			$tabCon.eq(clickNum).show();

			if(_callback) _callback(clickNum);
			return false;
		});
	}
	, scrollWatch : function(_callback){
		var
			intervalID
			, checkNum = 0
			, tmpNum = 0
			, flag = false
			, aniSpeed = 360
		;
		var scrollEndCheck=function(_callback){
			clearInterval(intervalID);
			intervalID=setInterval(function(){
				if(tmpNum==checkNum){
					clearInterval(intervalID);
					checkNum=0;
					tmpNum=0;
					if(_callback) _callback();
					setTimeout(function(){
						flag=false;
					}, aniSpeed);
				}
				tmpNum=checkNum;
			},200);
		};
		$(window).scroll(function(event) {
			checkNum++;
			if(!flag) {
				flag=true;
				scrollEndCheck(_callback);
			}
		});
	}
	, resizeWatch : function(_callback){
		var
			intervalID
			, checkNum = 0
			, tmpNum = 0
			, flag = false
			, delay = 600
		;
		var resizeEndCheck=function(){
			clearInterval(intervalID);
			intervalID=setInterval(function(){
				if(tmpNum==checkNum){
					clearInterval(intervalID);
					checkNum=0;
					tmpNum=0;
					if(_callback) _callback();
					setTimeout(function(){
						flag=false;
						return false;
					}, delay);
				}
				tmpNum=checkNum;
			},200);
		};
		$(window).resize(function(event) {
			checkNum++;
			if(!flag) {
				flag=true;
				resizeEndCheck();
			}
		});
	}
};


/**
 * css 로드
 *
 * @ignore
 * @date 2021.07.22
 * @param {String} path
 * @return
 * @example
 */
function loadCss(path){
	var cssAry = $("head").find("link[rel='stylesheet']");
	for( var i = 0 ; i < cssAry.length ; i++ ){
		if( cssAry[i].href.replace(location.protocol + "//" + location.host,"") == path ){
			return;
		}
	}
	$("<link>").appendTo("head").attr({type:"text/css", rel:"stylesheet",href:path});
}



/**
 * 객체기능추가
 *
 */
!(function(){
	// Math객체에 trunc 함수 추가
	if( !Math.trunc ){
		Math.trunc = function(n){return n < 0 ? Math.ceil(n) : Math.floor(n);};
	}

	// String객체에 replaceAll 함수 추가
	if( !String.prototype.replaceAll ){
		String.prototype.replaceAll = function(e, r) {return e = e.replace(/(\W)/g, "\\$1"),this.replace(new RegExp(e,"gi"), r);};
	}

	// String객체에 startsWith 함수 추가
	if( !String.prototype.startsWith ){
		String.prototype.startsWith = function(e) {return this.substring(0, e.length) == e;};
	}

	// String객체에 endsWith 함수 추가
	if( !String.prototype.endsWith ){
		String.prototype.endsWith = function(e) {return this.substring(this.length - e.length, this.length) == e;};
	}

	//String객체에 string 함수 추가
	if( !String.prototype.string ){
		String.prototype.string = function(len){
			var s = '', i = 0;
			while (i++ < len) {s += this; }
			return s;
		};
	}

	/**
	 * String객체에 글자를 앞에서부터 원하는 바이트만큼 잘라 리턴하는 함수 추가
	 *
	 * @param len : 자를 byte수
	 * @example var str = "1234"; str.cut(2);
	 */
	if( !String.prototype.cut ){
		String.prototype.cut = function(len){
			var str = this, l = 0;
			for (var i = 0; i < str.length; i++) {
				l += (str.charCodeAt(i) > 128) ? 2 : 1;
				if (l > len) return str.substring(0, i);
			}
			return str;
		};
	}

	/**
	 * String객체에 문자열 사이즈를 구하는 함수 추가(유니코드 2byte 계산)
	 *
	 * @example var str = "가나다"; str.len();
	 */
	if( !String.prototype.len ){
		String.prototype.len = function(){
			var val = this;
			// 입력받은 문자열을 escape() 를 이용하여 변환한다.
			// 변환한 문자열 중 유니코드(한글 등)는 공통적으로 %uxxxx로 변환된다.
			var temp_estr = escape(val);
			var s_index = 0;
			var e_index = 0;
			var temp_str = "";
			var cnt = 0;

			// 문자열 중에서 유니코드를 찾아 제거하면서 갯수를 센다.
			// 제거할 문자열이 존재한다면
			while ((e_index = temp_estr.indexOf("%u", s_index)) >= 0) {
				temp_str += temp_estr.substring(s_index, e_index);
				s_index = e_index + 6;
				cnt++;
			}

			temp_str += temp_estr.substring(s_index);
			temp_str = unescape(temp_str); // 원래 문자열로 바꾼다.

			// 유니코드는 2바이트 씩 계산하고 나머지는 1바이트씩 계산한다.
			return ((cnt * 2) + temp_str.length) + "";
		};
	}

	/**
	 * String객체에 숫자만추출하는 함수 추가
	 * @example var str = " a1b "; str.num();
	 */
	if( !String.prototype.num ){
		String.prototype.num = function(){return (this.trim().replace(/[^0-9]/g, ""));};
	}

	/**
	 * String객체에 zeroFill 함수 추가
	 * @example var str = "1"; str.zf(10);
	 */
	if( !String.prototype.zf ){
		String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
	}

	/**
	 * String객체에 trim 함수 추가
	 * @example var str = " 1 "; str.trim();
	 */
	if( !String.prototype.trim ){
		String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};
	}

	/**
	 * Number객체에 zeroFill 함수 추가
	 * @example var num = 1; num.zf(10);
	 */
	if( !Number.prototype.zf ){
		Number.prototype.zf = function(len){return this.toString().zf(len); };
	}

	/**
	 * Array값 비교
	 * @param a 해당 array값
	 * @param obj 비교대상 값
	 * @returns {Boolean}
	 */
	if( !Array.prototype.contains && 1 == 2 ){
		Array.prototype.contains = function(needle){return this.indexOf(needle) > -1 ? true : false; };
	}
})();



/**
 * 객체에 대한 null 체크
 * @param {Object} o - 객체
 * @return {Boolean} true/false
 * @example
 * isNull(undefined); // true;
 * isNull("");        // true;
 * isNull();          // true;
 * isNull(null);      // true;
 */
function isNull(o){return typeof o === "undefined" || o == null || String(o) == "" || String(o) == "undefined" ? true : false;}

/**
 * trim 기능
 * @param {String} s - 문자열
 * @return {String} s
 * @example
 */
function trim(s){return !isNull(s) ? s.replace(/(^\s*)|(\s*$)/g, "") : "";}

/**
 * 문자열에 대한 null/공백 체크 (공백이 있을경우 trim 처리)
 * @param {String} s - 문자열
 * @return {Boolean} true/false
 * @example
 * isEmpty(undefined); // true;
 * isEmpty("");        // true;
 * isEmpty();          // true;
 * isEmpty(null);      // true;
 * isEmpty(" ");       // true;
 */
function isEmpty(s){return isNull(s) || (typeof s === "string" && trim(s) == "") ? true : false;}

/**
 * left trim 기능
 * @param {String} s
 * @return {String} s
 * @example
 */
function ltrim(s){return s.replace(/(^\s*)/g, "");}

/**
 * right trim 기능
 * @param {String} s
 * @return {String} s
 * @example
 */
function rtrim(s){return s.replace(/(\s*$)/g, "");}

/**
 * left & right trim 기능
 */
function lrtrim(s){return rtrim(ltrim(s));}

/**
 * 넘겨받은 첫번째 인자에 대해 string형태로 변환하여 리턴, null일 경우 두번째 인자로 변환하여 리턴하고 두번째가 없을 경우 "" 리턴
 * @param {String} s - 첫번째 인자값
 * @param {String} nVal - null일경우 리턴될 두번째 인자값
 * @return {String}
 * @example
 */
function getStr(s,nVal){return !isNull(s) ? String(s) : nVal || "";}

/**
 * 넘겨받은 첫번째 인자에 대해 number형태로 변환하여 리턴, number형식이 아닐경우 두번째 인자로 변환하여 리턴하고 두번째가 없을 경우 0 리턴
 * @param {String|Number} n - 첫번째 인자값
 * @param {Number} nVal - number형식이 아닐 경우 리턴될 두번째 인자값
 * @return {Number}
 * @example
 * getNum("123");  // 123
 * getNum(123);    // 123
 * getNum(null,0); // 0
 * getNum("a",0);  // 0
 */
//function getNum(n,nVal){return !isNaN(n) ? Number(n,10) : nVal || 0;}
function getNum(n,nVal){if( !isNull(n) && typeof n === "string" ){n=n.replaceAll(",","");}return !isNaN(n) ? Number(n,10) : nVal || 0;}

/**
 * 숫자형식인지 여부 확인
 * @param {String|Number} n - 인자값
 * @return {Boolean}
 * @example
 * isNum("123");      // true
 * isNum("123,456");  // true
 * isNum("asdf");     // false
 */
function isNum(n){if( !isNull(n) && typeof n === "string" ){n=n.replaceAll(",","");}return /^[0-9.+]*$/.test(n);}

/**
 * 넘겨받은 인자값을 금액형태(3자리마다 콤마추가)로 변환하여 리턴
 * @param {String|Number} e
 * @return {String}
 * @example
 * getCommaNum("123123"); // "123,123"
 * getCommaNum(123123);   // "123,123"
 */
function getCommaNum(e){if(isNaN(e)){return "";}var t=e+"";if(0!=t.length){var r="",a="",n="";"+"!=t.substring(0,1)&&"-"!=t.substring(0,1)||(r=t.substring(0,1),t=t.substring(1)),-1<t.indexOf(".")&&(n=t.substring(t.indexOf(".")),t=t.substring(0,t.indexOf(".")));for(var o=t.length-3;1<=o;o-=3){a=","+t.substring(o,o+3)+a;}return r+(a=t.substring(0,o+3)+a)+n;}}

/**
 * 넘겨받은 첫번째 인자에 대한 boolean값 혹은 Y/N y/n 값을 체크하여 true/false를 리턴하고 첫번째 인자가 null일 경우 두번째 인자를 기본값으로 리턴
 * @param {Boolean|String} b - true/false "Y"/"N" "y"/"n" 가능
 * @param {Boolean} d - true/false
 * @return {Boolean}
 * @example
 * var yn = true;
 * getBoolean(true);       // true
 * getBoolean("true");     // true
 * getBoolean("Y");        // true
 * getBoolean(null,false); // false
 * getBoolean(null,true);  // true
 */
function getBoolean(b,d){
	if(typeof b==="boolean"){return b;}
	else if(typeof b==="string"&&(b.toLowerCase()=="true"||b.toLowerCase()=="y")){return true;}
	else if(typeof b==="string"&&(b.toLowerCase()=="false"||b.toLowerCase()=="n")){return false;}
	else if(!isNull(d)){return getBoolean(d);}
	else{return false;}
}


