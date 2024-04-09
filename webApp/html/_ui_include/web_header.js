/**
 * [Book Club]
 * --------------------------------------
 * header.js
 */

(function () {
  var str =
    "" +
    '		<div id="header" class="header">' +
    '      <h1 class="logo"><a href="#"><span class="hidden">EVERYBOOKCLUB</span></a></h1>' +
    //     <!-- Sub 화면 상단 영역 -->
    // '      <div class="h-mob">' +
    // '         <button type="button" class="prev"><span class="hidden">이전 화면으로 이동</span></button>' +
    // "         <h2>타이틀</h2>" +
    // "      </div>" +
    '      <div class="util">' +
    '        <button type="button" class="btn-login" aria-label="로그인"><span>로그인</span></button>' + // <!-- 로그인 전 -->
    //'        <button type="button" class="btn-login user" aria-label="김로테"><span>김로테</span>님</button>' + // <!-- 로그인 후 -->
    '        <button type="button" class="btn-test" aria-label="독서진단 테스트"><span>독서진단 테스트</span></button>' +
    '        <button type="button" class="btn-mall" aria-label="도서몰"><span>도서몰</span></button>' +
    '        <button type="button" class="btn-menu" aria-label="전체 메뉴">' +
    "          <span></span>" +
    "          <span></span>" +
    "          <span></span>" +
    "        </button>" +
    "      </div>" +
    '      <div class="nav">' +
    '        <div class="logo"><span class="hidden">EVERYBOOKCLUB</span></div>' +
    '        <div class="nav__top">' +
    //'          <button type="button" class="btn round primary sm"><span>로그아웃</span></button>' + // <!-- 로그인 후 -->
    '          <button type="button" class="btn round primary sm"><span>로그인</span></button>' +
    '          <button type="button" class="btn round btn-gray sm"><span>회원가입</span></button>' +
    "        </div>" +
    '        <div class="menu scroll">' +
    '          <div class="inner">' +
    //  모바일 -> 로그인 후 사용자 정보 노출
    // '             <div class="menu__user-info">' +
    // "                <p>안녕하세요:)</p>" +
    // '                <button type="button" class="btn-login user"><span>김로테</span>님</button>' +
    // "             </div> " +
    // 모바일 :: user__info //
    '             <div class="menu__item">' +
    '                <a href="#" class="menu__anchor">에브리북클럽</a>' +
    '                <div class="menu__sub-list">' +
    '                  <div class="menu__sub-item">' +
    '                    <a href="#" class="menu__sub-anchor">에브리북클럽이란?</a>' +
    "                  </div>" +
    '                  <div class="menu__sub-item">' +
    '                    <a href="#" class="menu__sub-anchor">에브리북클럽 특징</a>' +
    "                  </div>" +
    '                  <div class="menu__sub-item">' +
    '                    <a href="#" class="menu__sub-anchor">커리큘럼</a>' +
    "                  </div>" +
    '                  <div class="menu__sub-item">' +
    '                    <a href="#" class="menu__sub-anchor">학습시스템</a>' +
    "                  </div>" +
    "                </div>" +
    "             </div>" +
    // '            <div class="menu__item">' +
    // '              <a href="#" class="menu__anchor">정기구독</a>' +
    // '              <div class="menu__sub-list">' +
    // '                <div class="menu__sub-item">' +
    // '                  <a href="#" class="menu__sub-anchor">정기구독하기</a>' +
    // "                </div>" +
    // "              </div>" +
    // "            </div>" +
    '            <div class="menu__item">' +
    '              <a href="#" class="menu__anchor">앱 다운로드</a>' +
    '              <div class="menu__sub-list">' +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">북클럽 APP 무료 이용</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">디지털콘텐츠 서비스</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">이용방법</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">체험하기</a>' +
    "                </div>" +
    "              </div>" +
    "            </div>" +
    '            <div class="menu__item">' +
    '              <a href="#" class="menu__anchor">고객지원</a>' +
    '              <div class="menu__sub-list">' +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">공지사항</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">FAQ</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">문의하기</a>' +
    "                </div>" +
    "              </div>" +
    "            </div>" +
    '            <div class="menu__item">' +
    '              <a href="#" class="menu__anchor">부모 페이지</a>' +
    '              <div class="menu__sub-list">' +
    '                <div class="menu__sub-title">회원정보</div>' +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">자녀 계정 관리</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">부모 계정 관리</a>' +
    "                </div>" +
    '                <div class="menu__sub-title">학습단계</div>' +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">학습 이력 현황</a>' +
    "                </div>" +
    '                <div class="menu__sub-item">' +
    '                  <a href="#" class="menu__sub-anchor">학습 단계 변경</a>' +
    "                </div>" +
    "              </div>" +
    "            </div>" +
    "          </div>" +
    "        </div>" +
    "      </div>" +
    '      <div class="dim"></div>' +
    "		</div>";
  document.write(str);
})();
