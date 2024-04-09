export default class DrawDrop {
  constructor(opt) {
    this.id = opt.id;
    this.answer = opt.answer;
    this.callback = opt.callback;
    this.callbackComplete = opt.callbackComplete;
    this.doc = document.documentElement;
    this.wrap = document.querySelector(
      '.mdl-drag[data-drag-id="' + this.id + '"]'
    );
    this.drops = this.wrap.querySelectorAll(".mdl-drag-drop[data-drag-name]");
    this.items = this.wrap.querySelectorAll(".mdl-drag-item[data-drag-name]"); //
    this.areas = this.wrap.querySelectorAll(".mdl-drag-area[data-drag-name]");
    this.array_area = [];
    this.el_scroll = document.querySelector("[data-pagescroll]");

    this.wrap_rect = this.wrap.getBoundingClientRect();
    this.wrap_t = this.wrap_rect.top;
    this.wrap_l = this.wrap_rect.left;

    this.win_y = this.el_scroll ? this.el_scroll.scrollTop : window.scrollY;
    this.win_x = this.el_scroll ? this.el_scroll.scrollLeft : window.scrollX;
    this.complete_n = 0;
    this.answer_n = 0;
    this.answer_len = this.answer.length;
    this.init();
  }

  init() {
    const set = () => {
      this.wrap_rect = this.wrap.getBoundingClientRect();
      this.wrap_t = this.wrap_rect.top;
      this.wrap_l = this.wrap_rect.left;
      this.array_area = [];
      this.areas = this.wrap.querySelectorAll(".mdl-drag-area[data-drag-name]");

      for (let i = 0, len = this.answer_len; i < len; i++) {
        const _item = this.wrap.querySelector(
          '.mdl-drag-item[data-drag-name="' + this.answer[i].name + '"]'
        );
        const _area = this.wrap.querySelector(
          '.mdl-drag-area[data-drag-name="' + this.answer[i].name + '"]'
        );
        const _drop = this.wrap.querySelector(
          '.mdl-drag-drop[data-drag-name="' + this.answer[i].name + '"]'
        );

        this.answer[i].sum ? (_area.dataset.dragSum = this.answer[i].sum) : "";
        this.answer[i].move
          ? (_area.dataset.dragMove = this.answer[i].move)
          : "";
        this.answer[i].align
          ? (_area.dataset.dragAlign = this.answer[i].align)
          : "";
        this.answer[i].limit
          ? (_area.dataset.dragLimit = this.answer[i].limit)
          : "";
        this.answer[i].copy
          ? (_drop.dataset.dragCopy = this.answer[i].copy)
          : "";
      }

      for (let item of this.areas) {
        const rect = item.getBoundingClientRect();

        this.array_area.push({
          name: item.dataset.dragName,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          x: rect.x,
          y: rect.y,
          rangeX: [rect.left, rect.left + rect.width],
          rangeY: [rect.top, rect.top + rect.height],
        });
      }
      console.log(this.array_area);
    };
    set();

    const calc = (v, w) => {
      let n = this[v];
      n = w === "-" ? n - 1 : w === "+" ? n + 1 : n;
      n < 0 ? (n = 0) : "";
      this[v] = n;
    };

    //clone drag
    const actStartClone = (e) => {
      const el_this = e.currentTarget;
      const el_this_area = el_this.closest(".mdl-drag-area");
      const el_wrap = el_this.closest(".mdl-drag");
      const data_name = el_this.dataset.dragName;
      const area_name = el_this_area.dataset.dragName;

      el_this.removeAttribute("data-drag-state");
      el_this.classList.add("active");
      this.el_scroll.dataset.pagescroll = "hidden";

      this.win_y = this.el_scroll ? this.el_scroll.scrollTop : window.scrollY;
      this.win_x = this.el_scroll ? this.el_scroll.scrollLeft : window.scrollX;
      this.wrap_rect = this.wrap.getBoundingClientRect();
      this.wrap_t = this.wrap_rect.top + this.win_y;
      this.wrap_l = this.wrap_rect.left + this.win_x;

      const rect_this = el_this.getBoundingClientRect();
      const rect_area = el_this_area.getBoundingClientRect();

      let _x = !!e.clientX ? e.clientX : e.targetTouches[0].clientX;
      let _y = !!e.clientY ? e.clientY : e.targetTouches[0].clientY;
      let m_x;
      let m_y;

      if (getComputedStyle(el_this_area).display !== "flex") {
        m_x = _x - rect_area.left - rect_this.width / 2;
        m_y = _y - rect_area.top - rect_this.height / 2;
      } else {
        m_x = _x - rect_area.left - rect_area.width / 2;
        m_y = _y - rect_area.top - rect_area.width / 2;
      }

      el_this.style.transform = "translate(" + m_x + "px, " + m_y + "px)";

      const actEnd = (e) => {
        const e_x = _x;
        const e_y = _y;
        let is_range;
        let is_name;

        this.el_scroll.dataset.pagescroll = "auto";
        el_this.classList.remove("active");

        for (let i = 0, len = this.array_area.length; i < len; i++) {
          const is_x =
            this.array_area[i].rangeX[0] - this.win_x < e_x &&
            this.array_area[i].rangeX[1] - this.win_x > e_x;
          const is_y =
            this.array_area[i].rangeY[0] - this.win_y < e_y &&
            this.array_area[i].rangeY[1] - this.win_y > e_y;

          if (is_x && is_y) {
            is_range = true;
            is_name = this.array_area[i].name;
            m_x =
              _x - this.array_area[i].left - rect_this.width / 2 + this.win_x;
            m_y =
              _y - this.array_area[i].top - rect_this.height / 2 + this.win_y;

            break;
          } else {
            is_range = false;
          }
        }

        if (is_range) {
          const current_area = el_wrap.querySelector(
            '.mdl-drag-area[data-drag-name="' + is_name + '"]'
          );
          const limit = Number(current_area.dataset.dragLimit);
          const current_area_drops = current_area.querySelectorAll(
            ".mdl-drag-drop[data-drag-name]"
          );
          const n = current_area_drops.length;
          const area_in_clone = el_this;

          const act = () => {
            area_in_clone.dataset.dragState = "complete";
            area_in_clone.style.transform =
              "translate(" + m_x + "px, " + m_y + "px)";
            current_area.insertAdjacentElement("beforeend", area_in_clone);

            this.callback &&
              this.callback({
                sum: this.answer_len,
                value: "value",
                name: data_name,
                state: data_name === is_name,
              });
          };

          area_name !== is_name
            ? el_this.remove()
            : (area_in_clone.dataset.dragState = "complete");

          if (limit !== n) {
            act();
          } else {
            if (area_name !== is_name) {
              if (limit === 1) {
                const __name = current_area.querySelector(
                  ".mdl-drag-drop[data-drag-name]"
                ).dataset.dragName;
                current_area
                  .querySelector(".mdl-drag-drop[data-drag-name]")
                  .remove();
                const __drop = el_wrap.querySelector(
                  '.mdl-drag-drop[data-drag-name="' + __name + '"]'
                );
                __drop.classList.remove("disabled");
                calc("complete_n", "-");
                act();
              } else {
                calc("complete_n", "-");
                el_wrap
                  .querySelector(
                    '.mdl-drag-drop.disabled[data-drag-name="' +
                      data_name +
                      '"]'
                  )
                  .classList.remove("disabled");

                data_name === is_name
                  ? calc("answer_n", "+")
                  : calc("answer_n", "-");
              }
            }
          }

          el_this.addEventListener("mousedown", actStartClone);
          el_this.addEventListener("touchstart", actStartClone, {
            passive: true,
          });
        } else {
          calc("complete_n", "-");
          calc("answer_n", "-");

          el_this.remove();

          const _disabled_drops = el_wrap.querySelectorAll(
            '.mdl-drag-drop.disabled[data-drag-name="' + data_name + '"]'
          );

          for (let item2 of _disabled_drops) {
            item2.classList.remove("disabled");
          }
        }

        this.doc.removeEventListener("mousemove", actMove);
        this.doc.removeEventListener("mouseup", actEnd);
        this.doc.removeEventListener("touchmove", actMove);
        this.doc.removeEventListener("touchend", actEnd);
      };

      const actMove = (e) => {
        _x = !!e.clientX ? e.clientX : e.targetTouches[0].clientX;
        _y = !!e.clientY ? e.clientY : e.targetTouches[0].clientY;

        if (getComputedStyle(el_this_area).display !== "flex") {
          m_x = _x - rect_area.left - rect_this.width / 2;
          m_y = _y - rect_area.top - rect_this.height / 2;
        } else {
          m_x = _x - rect_area.left - rect_area.width / 2;
          m_y = _y - rect_area.top - rect_area.width / 2;
        }

        el_this.style.transform = "translate(" + m_x + "px, " + m_y + "px)";
      };

      this.doc.addEventListener("mousemove", actMove);
      this.doc.addEventListener("mouseup", actEnd);
      this.doc.addEventListener("touchmove", actMove);
      this.doc.addEventListener("touchend", actEnd);
    };

    //original drag
    const actStart = (e) => {
      const el_this = e.currentTarget;
      const el_wrap = el_this.parentNode;
      const el_clone = el_this.cloneNode(true);
      const data_copy = el_this.dataset.dragCopy;
      const data_name = el_this.dataset.dragName;
      const rect_this = el_this.getBoundingClientRect();

      this.el_scroll.dataset.pagescroll = "hidden";

      (data_copy === "false" || !data_copy) &&
        el_this.classList.add("disabled");
      el_clone.classList.add("clone");
      el_clone.dataset.dragType = "clone";
      el_clone.classList.add("active");
      el_wrap.insertAdjacentElement("beforeend", el_clone);

      this.win_y = this.el_scroll ? this.el_scroll.scrollTop : window.scrollY;
      this.win_x = this.el_scroll ? this.el_scroll.scrollLeft : window.scrollX;
      this.wrap_rect = this.wrap.getBoundingClientRect();
      this.wrap_t = this.wrap_rect.top + this.win_y;
      this.wrap_l = this.wrap_rect.left + this.win_x;

      // this.area = document.querySelector('.mdl-drag-area[data-drag-name="'+ data_name +'"]');

      let _x = !!e.clientX ? e.clientX : e.targetTouches[0].clientX;
      let _y = !!e.clientY ? e.clientY : e.targetTouches[0].clientY;
      let m_x = _x - this.wrap_l - rect_this.width / 2 + this.win_x;
      let m_y = _y - this.wrap_t - rect_this.height / 2 + this.win_y;

      el_clone.style.transform = "translate(" + m_x + "px, " + m_y + "px)";

      const actEnd = (e) => {
        const e_x = _x;
        const e_y = _y;
        let is_range;
        let is_name;

        this.el_scroll.dataset.pagescroll = "auto";
        el_clone.classList.remove("active");

        for (let i = 0, len = this.array_area.length; i < len; i++) {
          const is_x =
            this.array_area[i].rangeX[0] - this.win_x < e_x &&
            this.array_area[i].rangeX[1] - this.win_x > e_x;
          const is_y =
            this.array_area[i].rangeY[0] - this.win_y < e_y &&
            this.array_area[i].rangeY[1] - this.win_y > e_y;

          if (is_x && is_y) {
            is_range = true;
            is_name = this.array_area[i].name;
            m_y = m_y - (this.array_area[i].top - this.wrap_t);
            m_x = m_x - (this.array_area[i].left - this.wrap_l);
            break;
          } else {
            is_range = false;
          }
        }

        if (is_range) {
          const current_area = el_wrap.querySelector(
            '.mdl-drag-area[data-drag-name="' + is_name + '"]'
          );
          const limit = Number(current_area.dataset.dragLimit);
          const is_move = current_area.dataset.dragMove;
          const current_area_drops = current_area.querySelectorAll(
            ".mdl-drag-drop[data-drag-name]"
          );
          const n = current_area_drops.length;
          const area_in_clone = el_clone;
          el_clone.remove();

          const act = () => {
            area_in_clone.style.transform =
              "translate(" + m_x + "px, " + m_y + "px)";
            area_in_clone.dataset.dragState = "complete";
            current_area.insertAdjacentElement("beforeend", area_in_clone);
            calc("complete_n", "+");
            data_name === is_name ? calc("answer_n", "+") : "";

            for (let i = 0; i < this.answer_len; i++) {
              if (this.answer[i].name.toString() === data_name) {
                this.answer[i].state = data_name === is_name;
              }
            }

            this.callback &&
              this.callback({
                name: data_name,
                state: data_name === is_name,
                answer: this.answer,
              });
          };

          if (limit === n) {
            if (limit === 1) {
              const __name = current_area.querySelector(
                ".mdl-drag-drop[data-drag-name]"
              ).dataset.dragName;
              current_area
                .querySelector(".mdl-drag-drop[data-drag-name]")
                .remove();
              const __drop = el_wrap.querySelector(
                '.mdl-drag-drop[data-drag-name="' + __name + '"]'
              );
              __drop.classList.remove("disabled");
              act();
              calc("complete_n", "-");
            } else {
              el_this.classList.remove("disabled");
            }
          } else {
            act();
          }

          const area_drops = current_area.querySelectorAll(
            ".mdl-drag-drop[data-drag-name]"
          );

          if (is_move === "true") {
            for (let item of area_drops) {
              item.addEventListener("mousedown", actStartClone);
              item.addEventListener("touchstart", actStartClone, {
                passive: true,
              });
            }
          }
        } else {
          el_clone.remove();
          el_this.classList.remove("disabled");
        }
        console.log(
          " this.complete_n",
          this.complete_n,
          this.answer_len,
          this.answer_n
        );

        this.complete_n === this.answer_len && this.completeCallback();

        this.doc.removeEventListener("mousemove", actMove);
        this.doc.removeEventListener("mouseup", actEnd);
        this.doc.removeEventListener("touchmove", actMove);
        this.doc.removeEventListener("touchend", actEnd);
      };

      const actMove = (e) => {
        _x = !!e.clientX ? e.clientX : e.targetTouches[0].clientX;
        _y = !!e.clientY ? e.clientY : e.targetTouches[0].clientY;
        m_x = _x - this.wrap_l - rect_this.width / 2 + this.win_x;
        m_y = _y - this.wrap_t - rect_this.height / 2 + this.win_y;

        el_clone.style.transform = "translate(" + m_x + "px, " + m_y + "px)";
      };

      this.doc.addEventListener("mousemove", actMove);
      this.doc.addEventListener("mouseup", actEnd);
      this.doc.addEventListener("touchmove", actMove);
      this.doc.addEventListener("touchend", actEnd);
    };

    for (let item of this.drops) {
      item.addEventListener("mousedown", actStart);
      item.addEventListener("touchstart", actStart, { passive: true });
    }
  }

  completeCallback() {
    this.callbackComplete &&
      this.callbackComplete({
        sum: this.answer_len,
        value: this.answer_n,
        state: this.answer_len === this.answer_n ? true : false,
        answer: this.answer,
      });
  }
  // 초기화
  reset() {
    for (let i = 0, len = this.answer_len; i < len; i++) {
      this.answer[i].state = false;
    }
    for (let item of this.areas) {
      const drops = item.querySelectorAll(".mdl-drag-drop[data-drag-name]");
      item.removeAttribute("data-state");
      for (let drop of drops) {
        drop.remove();
      }
    }
    for (let item of this.items) {
      item.removeAttribute("data-result");
    }
    for (let item of this.drops) {
      const btns = document.querySelector(".q-checked-box");
      const btnAgain = document.querySelector(".q-check-btn");

      this.wrap.classList.remove("complete", "correct", "error");
      item.classList.remove("disabled");
      btns.classList.add("disabled");
      btnAgain.classList.remove("disabled");
    }

    this.wrap.removeAttribute("data-state");
    this.complete_n = 0;
    this.answer_n = 0;
  }
  // 정답 체크 data-statue= {{ true / false}}
  check() {
    let trueCount = 0;

    for (let i = 0; i < this.answer_len; i++) {
      const name = this.answer[i].name;
      const el_area = this.wrap.querySelector(
        '.mdl-drag-area[data-drag-name="' + name + '"]'
      );
      const el_drops = el_area.querySelectorAll(
        ".mdl-drag-drop[data-drag-name]"
      );

      const sum = this.answer[i].sum;
      let n = 0;
      let is_state = false;

      if (el_drops) {
        if (sum !== el_drops.length) {
          is_state = false;
          this.answer[i].state = false;
        } else {
          for (let item of el_drops) {
            if (item.dataset.dragName === name.toString()) {
              is_state = true;
              this.answer[i].state = true;
              this.items[i].dataset.result = true;
            } else {
              is_state = false;
              this.answer[i].state = false;
              this.items[i].dataset.result = false;
            }
            n = n + 1;
            if (n === sum) break;
          }
        }

        el_area.dataset.state = is_state;

        if (!!is_state) {
          trueCount++;
        }

        const parentElement = this.wrap;
        const btns = document.querySelector(".q-checked-box");
        const btnAgain = document.querySelector(".q-check-btn");
        const btnNext = document.querySelector(".q-next-btn");
        const allStatesTrue = this.answer.every((item) => item.state === true);
        const errorType = document.querySelector(".layer-wrong");
        const correctType = document.querySelector(".layer-correct");

        btnNext.classList.remove("disabled");

        if (allStatesTrue) {
          parentElement.classList.add("correct");
          parentElement.classList.remove("error");

          correctType.style.display = "block";

          btns.classList.add("disabled");
          btnAgain.classList.add("disabled");
        } else {
          parentElement.classList.remove("correct");
          parentElement.classList.add("error");

          errorType.style.display = "block";

          btns.classList.add("disabled");
          btnNext.classList.remove("disabled");
        }
      }
    }
  }
  // 정해진 정답 확인
  complete() {
    this.reset();
    for (let item of this.drops) {
      const name = item.dataset.dragName;
      const area = this.wrap.querySelector(
        '.mdl-drag-area[data-drag-name="' + name + '"]'
      );
      const el_clone = item.cloneNode(true);

      item.classList.add("disabled");
      this.wrap.dataset.state = "complete";
      el_clone.dataset.dragState = "complete";
      area.insertAdjacentElement("beforeend", el_clone);

      this.complete_n = this.answer_len;
      this.answer_n = this.answer_len;
    }
  }
}
