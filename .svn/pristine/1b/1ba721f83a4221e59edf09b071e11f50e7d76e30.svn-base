$(function () {
  // $(".btn-menu").on("click", function () {
  //   $(".utill").toggleClass("is-active");
  //   $("body").toggleClass("modal-open");
  //   $(".nav").toggleClass("is-open");
  //   $(".menu__sub-list").slideUp();
  //   return false;
  // });
  // $(".menu__anchor").on("click", function () {
  //   $(".menu__sub-list").slideUp();
  //   let anchor = $(".menu__anchor");
  //   anchor.not($(this)).next(".menu__sub-list").slideUp();
  //   $(this).next(".menu__sub-list").stop().slideDown();
  //   return false;
  // });

  $(".btn-gnb-menu").on("click", function () {
    $(".gnb-list-area").addClass("open");
  });

  $(".close-gnb").on("click", function () {
    $(".gnb-list-area").removeClass("open");
  });
});

/* modal */
var modal = (function () {
  var popupCount = 0;
  var bg = null;
  var links = [];

  function openSet(obj, openAfterAction) {
    if (popupCount === 0 && bg == null) {
      if ($(".modal-popup-bg").length === 0) {
        $("body").append('<div class="modal-popup-bg"></div>');
      }
      bg = $(".modal-popup-bg");
    }
    popupCount = popupCount + 1;

    /* open */
    $("body").addClass("body-is-modal");
    obj.fadeIn(200, "linear", function () {
      obj.addClass("active");
      if (openAfterAction) openAfterAction();
    });
    bg.fadeIn(200, "linear");

    /* focus */
    var modalChildren = obj.find("a, button, input, object, select, textarea");
    modalChildren.first().focus();
    if (modalChildren.length === 1) {
      modalChildren.off("keydown").on("keydown", function (e) {
        if (e.keyCode === 9) {
          modalChildren.first().focus();
          return false;
        }
      });
    } else {
      modalChildren
        .last()
        .off("keydown")
        .on("keydown", function (e) {
          if (e.keyCode === 9) {
            if (!e.shiftKey) {
              modalChildren.first().focus();
              return false;
            }
          }
        });
      modalChildren
        .first()
        .off("keydown")
        .on("keydown", function (e) {
          if (e.keyCode === 9) {
            if (e.shiftKey) {
              modalChildren.last().focus();
              return false;
            }
          }
        });
    }
  }

  function open(link, target, openAfterAction) {
    var popObj = $(target);
    var linkHref = link;

    links.push(link);
    openSet(popObj, openAfterAction);

    popObj
      .find(".modal-popup-close")
      .off("click")
      .on("click", function () {
        close(popObj);
        linkHref.focus();
        return false;
      });
  }

  function close(obj) {
    var $closeTarget = obj.hasClass("modal-popup")
      ? obj
      : obj.closest(".modal-popup");

    popupCount = popupCount - 1;
    if (links[popupCount]) {
      links[popupCount].focus();
      links.pop();
    }

    $("body").removeClass("body-is-modal");

    if (popupCount === 0) {
      bg.fadeOut(200);
    }
    if ($closeTarget.hasClass("alert-pop")) {
      $closeTarget.remove();
    } else {
      $closeTarget.removeClass("active").fadeOut(200, "linear");
    }
  }

  function alert(link, config) {
    // { type, text, ok, cancel }
    var alertSet = {
      type: config.type || "alert",
      text: config.text || "메세지를 넣어주세요.",
      okText: config.okText || "확인",
      cancelText: config.cancelText || "취소",
      ok: config.ok,
      cancel: config.cancel,
      closeIcon: !!config.closeIcon,
      buttonSize: config.buttonSize || "small",
      mode: config.multiple,
    };
    var buttonCloseSource = "";
    if (alertSet.closeIcon) {
      buttonCloseSource =
        '<article class="modal-popup-header"><button class="modal-popup-close only-icon"><i class="icon-x icon-20">닫기</i></button></article>';
    }
    var buttonAddSource =
      alertSet.type === "alert"
        ? ""
        : '<button type="button" class="alert-popup-cancel block gray ' +
          alertSet.buttonSize +
          ' inline">' +
          alertSet.cancelText +
          "</button>";
    var $alert = $(
      "" +
        '<div class="modal-popup modal-popup--alert">' +
        '  <div class="modal-popup-outer">' +
        '    <section class="modal-popup-container">' +
        buttonCloseSource +
        '      <article class="modal-popup-body">' +
        '        <p class="modal-popup-alert-message">' +
        alertSet.text +
        "        </p>" +
        "      </article>" +
        '      <article class="modal-popup-footer">' +
        buttonAddSource +
        '        <button type="button" class="alert-popup-ok block ' +
        alertSet.buttonSize +
        ' inline">' +
        alertSet.okText +
        "        </button>" +
        "      </article>" +
        "    </section>" +
        "  </div>" +
        "</div>"
    );
    $("body").append($alert);

    if (link) {
      links.push(link);
    }
    openSet($alert);

    /* 2021.08.06 수정 (multiple, cancle 추가) */
    $alert
      .find("button")
      .off("click")
      .on("click", function () {
        if (!config.mode == "multiple") {
          close($alert);
        }

        if ($(this).hasClass("alert-popup__ok")) {
          if (alertSet.ok) {
            alertSet.ok(link);
          }
          if (config.mode == "multiple") {
            $alert.find(".multiple__change-text").html(config.modeChangeText);
            if ($alert.find(".alert-popup__cancel").length == 0) {
              close($alert);
              setTimeout(function () {
                $alert.remove();
              }, 300);
            } else {
              $alert.find(".alert-popup__cancel").remove();
            }
          } else {
            close($alert);
            setTimeout(function () {
              $alert.remove();
            }, 300);
          }
        } else if ($(this).hasClass("alert-popup__cancel")) {
          if (alertSet.cancel) {
            alertSet.cancel(link);
          }
          if (config.mode == "multipleCancle") {
            $alert.find(".multiple__change-text").html(config.modeChangeText);
            if ($alert.find(".alert-popup__cancel").length == 0) {
              close($alert);
              setTimeout(function () {
                $alert.remove();
              }, 300);
            } else {
              $alert.find(".alert-popup__cancel").remove();
            }
          } else {
            close($alert);
            setTimeout(function () {
              $alert.remove();
            }, 300);
          }
        }

        if (!config.mode == "multiple") {
          setTimeout(function () {
            $alert.remove();
          }, 300);
        }
        return false;
      });
  }

  return { open: open, close: close, alert: alert };
})();

(function (win, doc) {
  "use strict";

  const global = "bookclub";
  win[global] = {};

  const Global = win[global];

  win.addEventListener("DOMContentLoaded", function () {
    Global.emailDirect.init({ id: "selectbox1" });
    Global.agreechk.init();
    Global.accodian.init();
  });

  let getSiblings = function (e) {
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if (!e.parentNode) {
      return siblings;
    }
    // first child of the parent node
    let sibling = e.parentNode.firstChild;
    // collecting siblings
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== e) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  };

  Global.emailDirect = {
    init: function (opt) {
      const _this = this;
      _this.id = opt.id;
      const selbox = doc.querySelector('[data-id="' + _this.id + '"]');

      console.log(_this.id, selbox);

      if (!selbox) {
        return false;
      }

      selbox.addEventListener("change", function () {
        Global.emailDirect.event(this.dataset.id);
      });
    },
    event: function (v) {
      const _this = doc.querySelector('[data-id="' + v + '"]');
      const emailWrap = doc.querySelector(".email-item");

      if (_this.value === "") {
        emailWrap.classList.add("on");
      } else {
        emailWrap.classList.remove("on");
      }
    },
  };

  Global.agreechk = {
    init: function () {
      const agreeWrap = doc.querySelector(".term-wrap");
      const inputs = doc.querySelectorAll(".check-item");
      const inputAllWrap = doc.querySelector('input[data-id="all"]');

      if (!agreeWrap) {
        return false;
      }

      // 전체동의
      inputAllWrap.addEventListener("change", function (e) {
        Global.agreechk.evtCheckAll(e, inputAllWrap);
      });

      // 개별동의
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", function () {
          Global.agreechk.evtCheck();
        });
      }
    },
    evtCheckAll: function (e, inpWrap) {
      const t = e.target;
      const inpChild = getSiblings(inpWrap.parentElement);

      console.log(t);

      if (!t.checked) {
        inpChild.forEach(function (input) {
          input.children[0].checked = false;
        });
      } else {
        inpChild.forEach(function (input) {
          input.children[0].checked = true;
        });
      }
    },
    evtCheckAll2: function (e, inpWrap) {
      const t = e.target;
      const inpChild = getSiblings(inpWrap.parentElement);

      console.log(t);

      if (!t.checked) {
        inpChild.forEach((input) => (input.children[0].checked = false));
      } else {
        inpChild.forEach((input) => (input.children[0].checked = true));
      }
    },
    evtCheck: function () {
      const inputAllWrap = doc.querySelector('input[data-id="all"]');
      const isCheck = doc.querySelectorAll('[data-name="agree"]');
      let len = isCheck.length;
      let checked = 0;

      for (let j = 0; j < len; j++) {
        if (isCheck[j].checked) {
          checked += 1;
        }
      }

      if (checked == len) {
        inputAllWrap.checked = true;
      } else {
        inputAllWrap.checked = false;
      }
      //console.log(checked, isCheck.length);
    },
  };

  Global.accodian = {
    init: function () {
      $(document).on("click", ".ui-acco-btn", function () {
        var $accoWrap = $(this).parents(".ui-acco-wrap");
        var $accoPanel = $(this).parent().next();

        $accoWrap.siblings().removeClass("active");
        $accoWrap.siblings().find(".ui-acco-panel").stop().slideUp(300);
        $accoWrap.siblings().find(".ui-acco-panel").attr("aria-hidden", true);

        if (!$accoWrap.hasClass("active")) {
          $accoWrap.addClass("active");
          $accoPanel.stop().slideDown(300);
          $accoPanel.attr("aria-hidden", false);
          $(this).attr("aria-expanded", true);

          if ($(this).attr("href")) {
            $(this).attr("aria-expanded", false);
            $accoWrap.removeClass("active");
          }
        } else {
          $accoWrap.removeClass("active");
          $accoPanel.stop().slideUp(300);
          $accoPanel.attr("aria-hidden", true);
          $(this).attr("aria-expanded", false);
        }
      });
    },
  };
})(window, document);
