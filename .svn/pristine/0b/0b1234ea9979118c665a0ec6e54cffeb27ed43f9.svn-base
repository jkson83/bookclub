$(window).ready(function () {
  // 로드 후 실행
  updateMagazineSize();
  updateButtonVisibility();
  player();

  // 썸네일 스와이퍼
  var swiper = new Swiper(".thumbnails", {
    effect: "coverflow",
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: "auto",
    // touchRatio:false,
    slideToClickedSlide: true,
    coverflowEffect: {
      rotate: 10,
      stretch: 0,
      depth: 50,
      modifier: 1,
      slideShadows: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      slideChange: function () {
        $("#magazine").turn("page", this.realIndex + 1);
      },
    },
  });

  var magazine = $("#magazine").turn({
    acceleration: true,
    width: "100%",
    height: "auto",
    autoCenter: false,
    display: "double",
    elevation: 10,
    gradients: true,
    animating: false,
    when: {
      turned: function (event, page, view) {
        // 넘기기전
        // console.log("Turned event triggered for page:", page);
        updateButtonVisibility();
        player();
        autoPlay();
        setTimeout(function () {
          swiperMove();
        }, 100);
      },
      turning: function (event, page, view) {
        // 넘기기후
        // console.log("Turning event triggered for page:", page);
        updateButtonVisibility();
        player();
        autoPlay();
        loadAndPlayAudio();
        var audioElement = $("audio");
        audioElement.each(function () {
          this.currentTime = 0;
          this.pause();
        });
        setTimeout(function () {
          swiperMove();
        }, 100);
        Hash.go("page/" + page).update();
      },
    },
  });

  // hash
  Hash.on("^page/([0-9]*)$", {
    yep: function (path, parts) {
      var page = parts[1];
      if (page !== undefined) {
        if ($("#magazine").turn("is")) $("#magazine").turn("page", page);
        updateButtonVisibility();
      }
    },
    nop: function (path) {
      if ($("#magazine").turn("is")) $("#magazine").turn("page", 1);
    },
  });

  // 썸네일 생성
  for (var i = 0; i < magazine.turn("pages"); i++) {
    $(".thumbnails .swiper-wrapper").append(
      '<div class="swiper-slide" rol="button" data-page="' +
        (i + 1) +
        '"><img src="../../resources/img/' +
        (i + 1) +
        '.jpg" alt="Thumbnail ' +
        (i + 1) +
        '"></div>'
    );
  }

  function loadAndPlayAudio() {
    var flip = new Audio(); // 오디오 요소 생성
    var audioSource = "../../resources/audio/flip.mp3"; // 오디오 파일 경로

    // 오디오 파일 로드
    flip.src = audioSource;

    // 오디오 재생
    flip.muted = true;
    flip.play();
    flip.muted = false;
    // flip.play()
    // .then(function () {
    // 	// console.log('오디오 재생 시작');
    // })
  }

  // 화면 비율별 display 모드 분기
  function updateMagazineSize() {
    var orientation = window.matchMedia("(orientation: landscape)").matches
      ? "landscape"
      : "portrait";
    if (orientation === "landscape") {
      $(".magazine-size").addClass("double");
      setTimeout(function () {
        magazine.addClass("double");
        magazine
          .turn("display", "double")
          .turn(
            "size",
            Math.round($(".magazine-size img").width() * 2),
            Math.round($(".magazine-size img").height())
          );
      }, 0);
    } else {
      $(".magazine-size").removeClass("double");
      setTimeout(function () {
        magazine.removeClass("double");
        magazine
          .turn("display", "single")
          .turn(
            "size",
            Math.round($(".magazine-size img").width()),
            Math.round($(".magazine-size img").height())
          );
      }, 0);
    }
  }

  // 오디오 재생
  function player() {
    $(".play").on("click", function () {
      var audioIndex = $(this).data("audio-index");
      var audioElement = $("audio[src$='" + audioIndex + ".mp3']");
      var playButton = $(this);
      audioElement[0].pause();
      if (audioElement.length > 0) {
        // 다른 오디오 모두 일시정지
        $("audio")
          .not(audioElement)
          .each(function () {
            this.pause();
            this.currentTime = 0;
            playButton.removeClass("active");
          });
        // 현재 오디오 재생 및 버튼 클래스 추가
        if (audioElement[0].paused) {
          audioElement[0].muted = true;
          audioElement[0].play();
          audioElement[0].muted = false;
          playButton.addClass("active");
        } else {
          audioElement[0].pause();
          playButton.removeClass("active");
        }
      }
      // 오디오가 끝날 때
      $("audio").on("ended", function () {
        var audioIndex = $(this).attr("src").match(/\d+/)[0];
        var playButton = $(".play[data-audio-index='" + audioIndex + "']");
        this.pause();
        this.currentTime = 0;
        playButton.removeClass("active");
      });
    });
  }

  // 자동재생
  function autoPlay() {
    var currentPage = $("#magazine").turn("page");
    var totalPages = $("#magazine").turn("pages");
    var autoTurnInterval;
    var isAutoPlaying = false;

    function playAudioAndTurnPage() {
      var audioElement = $("#magazine").find(
        '.page[data-page="' + currentPage + '"] audio'
      )[0];

      if (audioElement) {
        audioElement.play();
        audioElement.onended = function () {
          currentPage++;
          if (currentPage <= totalPages && isAutoPlaying) {
            $("#magazine").turn("page", currentPage);
            autoTurnInterval = setTimeout(playAudioAndTurnPage, 1500);
          }
        };
      } else {
        currentPage++;
        if (currentPage <= totalPages && isAutoPlaying) {
          $("#magazine").turn("page", currentPage);
          autoTurnInterval = setTimeout(playAudioAndTurnPage, 1500);
        }
      }
      if (currentPage == totalPages || currentPage >= totalPages) {
        setTimeout(function () {
          $("#magazine").turn("page", 1);
          $(".stop").hide();
          $(".auto").show();
        }, 3000);
        currentPage = null;
        // autoTurnInterval = setTimeout(playAudioAndTurnPage, 3000);
      }
    }

    $(".auto").on("click", function () {
      $(this).hide();
      $(".stop").show();
      setTimeout(function () {
        if (!isAutoPlaying) {
          isAutoPlaying = true;
          currentPage = $("#magazine").turn("page");
          playAudioAndTurnPage();
        }
      }, 3000);
    });

    $(".stop,.prevBtn,.nextBtn").on("click", function () {
      var audioElement = $("#magazine").find(
        '.page[data-page="' + currentPage + '"] audio'
      )[0];
      $(".stop").hide();
      $(".auto").show();
      isAutoPlaying = false;
      // audioElement.pause();
      // audioElement.currentTime = 0;
      clearTimeout(autoTurnInterval);
    });
  }

  // 좌우 화살표 노출
  function updateButtonVisibility() {
    var currentPage = $("#magazine").turn("page");
    var totalPages = $("#magazine").turn("pages");
    if (currentPage === 1) {
      $(".prevBtn").hide();
    } else {
      $(".prevBtn").show();
    }
    if (currentPage === totalPages) {
      $(".nextBtn").hide();
    } else {
      $(".nextBtn").show();
    }
  }

  // 전체화면
  $(".full").on("click", function (e) {
    e.preventDefault();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  // 스와이퍼
  function swiperMove() {
    var currentPage = magazine.turn("page"); // Get the next page after turning
    //swiper.slideTo(currentPage-1,0,false)
  }

  // UI 컨트롤
  $(".swiper-slide").on("click", function () {
    var page = $(this).data("page");
    magazine.turn("page", page);
  });
  $(".prevBtn").on("click", function () {
    magazine.turn("previous");
    var currentPage = magazine.turn("page"); // Get the next page after turning
    //swiper.slideTo(currentPage - 1);          // Synchronize the Swiper to the next page
  });
  $(".nextBtn").on("click", function () {
    magazine.turn("next");
    var currentPage = magazine.turn("page"); // Get the next page after turning
    //swiper.slideTo(currentPage - 1);          // Synchronize the Swiper to the next page
  });
  $(".btn_thumbnail").on("click", function () {
    $(this).toggleClass("active");
    $(this).parent().toggleClass("active");
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 37) $("#magazine").turn("previous");
    else if (e.keyCode == 39) $("#magazine").turn("next");
  });

  // resize 시 새로고침 (재배치)
  $(window).on("resize", function () {
    updateMagazineSize();
  });

  // 이북 크게 보기 기능
  const fullShowEbook = {
    $target: null,
    $btnFull: null,
    $btnText: null,
    $hideEle: [],
    flag: 0,
    activeFn: () => {
      const obj = fullShowEbook;
      obj.$hideEle.each(function (idx, item) {
        $(item).hide();
      });
      $(".wrap.read .book-content").css({ height: "100vh" });
      $(".magazine-size").css({ height: "100vh" });
      $(".magazine").css({ top: 0 });
      $(".magazine").addClass("zoom");
      obj.$btnText.text("복구");
      obj.$target.addClass("zoomout");
      updateMagazineSize();
      obj.flag = 1;
    },
    recoverFn: () => {
      const obj = fullShowEbook;
      obj.$hideEle.each(function (idx, item) {
        $(item).show();
      });
      $(".wrap.read .book-content").removeAttr("style");
      $(".magazine-size").removeAttr("style");
      $(".magazine").css({ top: "10.86vh" });
      $(".magazine").removeClass("zoom");
      obj.$btnText.text("확대");
      obj.$target.removeClass("zoomout");
      updateMagazineSize();
      obj.flag = 0;
    },
    clickFn: () => {
      const obj = fullShowEbook;
      !obj.flag ? obj.activeFn() : obj.recoverFn();
    },
    init: (event) => {
      const obj = fullShowEbook;
      obj.$target = $("[data-full-ebook]");
      obj.$target.append(
        '<button type="button"><span class="hide">확대</span></button>'
      );
      obj.$btnFull = obj.$target.find("button");
      obj.$btnText = obj.$target.find("span");
      obj.$hideEle = $(".read-top");
      obj.$btnFull.on("click", obj.clickFn);

      // $(document).keydown(function(event) {
      //   if ( event.keyCode == 27 || event.which == 27 ) {
      //     obj.recoverFn();
      //   }
      // });
    },
  };
  fullShowEbook.init();
});
