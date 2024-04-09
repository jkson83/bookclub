;(function(win, doc, undefined) {

	'use strict';

	var $WIN = $(window);
	var $DOC = $(document);

	BOOK.common = {
		init : function(){
			BOOK.common.subNav();
			BOOK.table.scroll();

			// 모달 호출
			const btns = document.querySelectorAll('.btn-modal');

			BOOK.scrollBar.init({
				callback: function(){
					// console.log('end');
				}
			});

			for (const btn of btns) {
				btn.addEventListener('click', (e) => {
					const el = e.currentTarget;
					const id = el.dataset.id;
					const src = el.dataset.src;

					// callback 함수 필요할경우
					if (id === 'sampleModal') {
						BOOK.modal.show({
							id:id,
							src: src,
							callback: () => {
								alert(11)
								setTimeout(()=>{
									BOOK.datepicker.init();
								},0)

							}
						});
					} else {
						BOOK.modal.show({
							id:id,
							src: src,
							callback: () => {
								BOOK.datepicker.init();

							}
						});
					}
				});
			}

			BOOK.datepicker.init({
				id: 'input id name',
				date: 'YYYY.MM.DD',
				min: 'YYYY.MM.DD',
				max: 'YYYY.MM.DD',
				title: 'title name',
				//period: 'start' or 'end',
				// callback: function(){
				// 	console.log('callback init');
				// }
			});

			BOOK.form.fileUpload();

			

		},
		subNav : function() {
			if ($('.sub-nav').length > 0) {
				var lnbObj = $('.sub-nav');
                if ($('.sub-nav.b2c').length > 0) {
                    $('.sub-nav').html($adminNavB2C);
                } else {
                    $('.sub-nav').html($adminNavB2B);
                }
				var mid = pageInfo.mid
					, sid = !!pageInfo.sid ? pageInfo.sid : ''
					, mMenuObj = $('#menu' + mid)
					, sMenuObj = mMenuObj.next('.sub').find('li').eq(sid - 1);
					mMenuObj.addClass('on');
					mMenuObj.next('.sub').addClass('on');
					sMenuObj.addClass('current');

				$('.sub-nav').find('.mMenu').on('click', function(e) {
					e.preventDefault();
					var subMenu = $(this).closest('li').find('.sub');
					if (subMenu.length > 0 && !!!subMenu.hasClass('on')) {
						$('.nav > li').find('.mMenu').removeClass('on');
						$('.sub').removeClass('on').slideUp(200);

						if (!!!$(this).closest('li').find('.sub').hasClass('on')) {
							$(this).addClass('on');
							subMenu.addClass('on').slideDown(200);
						}
					}
				});
			}
		},
	}

	//기본실행
	doc.addEventListener("DOMContentLoaded", function(){
		BOOK.common.init();
	});

})(window, document);


$(document).ready(function() {
	$('body.b2b').find('.main-wrap').prepend('<button type="button" class="menu"><span class="hide">메뉴</span></button>');
	$('.menu').on('click',function(){
		$(this).toggleClass('open');
		$('.sub-nav').toggleClass('is-active');
	})
})

var $adminNavB2B = ''
+'<ul class="nav"> '
    +'<li><a href="#" id="menu1">관리자 계정관리</a> '    // 하단 메뉴 없을시 a 클래스 mMenu 삭제
     +'<li><a href="#" id="menu2" class="mMenu">권한 관리</a> '
     +'<ul class="sub">'
     +'<li><a href="#"><span>권한 관리<span></a></li>'
     +'<li><a href="#"><span>권한 설정<span></a></li>'
     +'</ul> '
     +'</li>'
	 +'<li><a href="#" id="menu3">센터 관리</a></li>'
	 +'<li><a href="#" id="menu4">학생 관리</a></li>'
	 +'<li><a href="#" id="menu5">스티커 관리</a></li>'
	 +'<li><a href="#" id="menu6">LMS</a></li>'
	 +'<li><a href="#" id="menu7">포트폴리오</a></li>'
	 +'<li><a href="#" id="menu8">커뮤니티</a></li>'
 +'</ul>'


 var $adminNavB2C = ''
 +'<ul class="nav"> '
      +'<li><a href="#" id="menu1">관리자 계정관리</a> '    // 하단 메뉴 없을시 a 클래스 mMenu 삭제
      +'<li><a href="#" id="menu2" class="mMenu">권한 관리</a> '
      +'<ul class="sub">'
      +'<li><a href="#"><span>권한 관리<span></a></li>'
      +'<li><a href="#"><span>권한 설정<span></a></li>'
      +'</ul> '
      +'</li>'
      +'<li><a href="#" id="menu3" class="mMenu">회원 관리</a> '
      +'<ul class="sub">'
      +'<li><a href="#"><span>회원 목록<span></a></li>'
      +'<li><a href="#"><span>탈퇴 회원 목록<span></a></li>'
      +'</ul> '
      +'</li>'
      +'<li><a href="#" id="menu4">LMS</a> '
      +'<li><a href="#" id="menu5" class="mMenu">CMS</a> '
      +'<ul class="sub">'
      +'<li><a href="#"><span>도서<span></a></li>'
      +'<li><a href="#"><span>이북<span></a></li>'
      +'<li><a href="#"><span>독서확인학습<span></a></li>'
      +'<li><a href="#"><span>소리내어 읽기<span></a></li>'
	  +'<li><a href="#"><span>글쓰기<span></a></li>'
      +'<li><a href="#"><span>문해력 게임<span></a></li>'
      +'</ul> '
      +'</li>'
      +'<li><a href="#" id="menu6" class="mMenu">고객 지원</a> '
      +'<ul class="sub">'
      +'<li><a href="#"><span>공지사항<span></a></li>'
      +'<li><a href="#"><span>FAQ<span></a></li>'
      +'<li><a href="#"><span>문의하기<span></a></li>'
      +'</ul> '
      +'</li>'
      +'<li><a href="#" id="menu7">통계</a> '
  +'</ul>'