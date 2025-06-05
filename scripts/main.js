class Quiz {
  constructor(quizElement, quizData) {
    this.quizElement = quizElement;
    this.quizData = quizData;
    this.currentQuestion = 1;
    this.userAnswers = {};

    this.quizId =
      this.quizElement.dataset.quizId || Math.random().toString(36).slice(2, 8);

    // Привязываем контекст к методу
    this.handleRadioChange = this.handleRadioChange.bind(this);

    this.initElements();
    this.bindEvents();
    this.renderQuestion(this.currentQuestion);
  }

  initElements() {
    this.quizQuestionNumberEl = this.quizElement.querySelector(
      "[data-quiz-question-number]"
    );
    this.quizQuestionTextEl = this.quizElement.querySelector(
      "[data-quiz-question-text]"
    );
    this.quizAnswersList = this.quizElement.querySelector(
      "[data-quiz-answers]"
    );
    this.backBtn = this.quizElement.querySelector(".quiz__btn-back");
    this.nextBtn = this.quizElement.querySelector(".quiz__btn-next");

    this.quizFormWrapper = this.quizElement.querySelector(
      "[data-quiz-form-wrapper]"
    );
    this.quizQuestions = this.quizElement.querySelector(
      "[data-quiz-questions]"
    );
    this.quizForm = this.quizElement.querySelector("[data-quiz-form]");
    this.quizRight = this.quizElement.querySelector("[data-quiz-right]");
    this.quizSuccess = this.quizElement.querySelector("[data-quiz-success]");
  }

  bindEvents() {
    this.nextBtn.addEventListener("click", () => this.handleNextClick());
    this.backBtn.addEventListener("click", () => this.handleBackClick());
    this.quizForm.addEventListener("submit", (e) => this.handleFormSubmit(e));
  }

  bindRadioEvents() {
    const radioInputs = this.quizAnswersList.querySelectorAll(
      ".custom-radio__input"
    );
    radioInputs.forEach((radio) => {
      radio.removeEventListener("change", this.handleRadioChange);
      radio.addEventListener("change", this.handleRadioChange);
    });
  }

  handleRadioChange(e) {
    const questionNumber = this.currentQuestion;
    this.userAnswers[`question-${questionNumber}`] = e.target.value;
    this.nextBtn.disabled = false;

    const label = e.target.closest(".quiz__answers-item");
    if (label) {
      label.style.transform = "scale(1.02)";
      setTimeout(() => {
        label.style.transform = "scale(1)";
      }, 200);
    }
  }

  renderQuestion(number) {
    const question = this.quizData[number - 1];
    const totalQuestions = this.quizData.length;
    const progressPercent = Math.round((number / totalQuestions) * 100);

    this.quizQuestionTextEl.style.opacity = 0;
    this.quizAnswersList.style.opacity = 0;

    setTimeout(() => {
      this.quizQuestionNumberEl.textContent = `${number}.`;
      this.quizQuestionTextEl.textContent = question.question;
      this.quizAnswersList.innerHTML = "";

      question.answers.forEach((answer, index) => {
        const answerId = `quiz-${this.quizId}-question-${number}-option-${
          index + 1
        }`;
        const radioName = `quiz-${this.quizId}-question-${number}`;
        const isChecked = this.userAnswers[`question-${number}`] === answer;

        const answerItem = document.createElement("li");
        answerItem.className = "quiz__answers-item";
        answerItem.style.opacity = "0";
        answerItem.style.transform = "translateY(20px)";
        answerItem.style.transition = `opacity 0.3s ease ${
          index * 0.1
        }s, transform 0.3s ease ${index * 0.1}s`;

        answerItem.innerHTML = `
          <div class="custom-radio">
            <input
              type="radio"
              id="${answerId}"
              name="${radioName}"
              class="custom-radio__input"
              ${isChecked ? "checked" : ""}
              value="${answer}"
            />
            <label for="${answerId}" class="custom-radio__label">
              ${answer}
            </label>
          </div>
        `;
        this.quizAnswersList.appendChild(answerItem);

        setTimeout(() => {
          answerItem.style.opacity = "1";
          answerItem.style.transform = "translateY(0)";
        }, 50);
      });

      const progressPercentEl = this.quizElement.querySelector(
        ".quiz__bar-complete-percent"
      );
      const progressLineEl = this.quizElement.querySelector(
        ".quiz__bar-complete-line"
      );

      if (progressPercentEl)
        progressPercentEl.textContent = `${progressPercent}%`;
      if (progressLineEl) progressLineEl.style.width = `${progressPercent}%`;

      this.backBtn.style.visibility = number === 1 ? "hidden" : "visible";
      this.nextBtn.disabled = !this.userAnswers[`question-${number}`];

      this.quizQuestionTextEl.style.opacity = 1;
      this.quizAnswersList.style.opacity = 1;

      this.bindRadioEvents();
    }, 300);
  }

  handleNextClick() {
    this.nextBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.nextBtn.style.transform = "scale(1)";
    }, 200);

    if (this.currentQuestion < this.quizData.length) {
      const selectedAnswer = this.quizAnswersList.querySelector(
        ".custom-radio__input:checked"
      );
      if (selectedAnswer) {
        this.userAnswers[`question-${this.currentQuestion}`] =
          selectedAnswer.value;
        this.currentQuestion++;
        this.renderQuestion(this.currentQuestion);
      }
    } else {
      this.showQuizForm();
      console.log("Quiz completed!", this.userAnswers);
    }
  }

  handleBackClick() {
    this.backBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.backBtn.style.transform = "scale(1)";
    }, 200);

    if (this.currentQuestion > 1) {
      const selectedAnswer = this.quizAnswersList.querySelector(
        ".custom-radio__input:checked"
      );
      if (selectedAnswer) {
        this.userAnswers[`question-${this.currentQuestion}`] =
          selectedAnswer.value;
      }

      this.currentQuestion--;
      this.renderQuestion(this.currentQuestion);
    }
  }

  showQuizForm() {
    if (this.quizFormWrapper) this.quizFormWrapper.style.display = "flex";
    if (this.quizQuestions) this.quizQuestions.style.display = "none";
    if (this.quizRight) this.quizRight.style.display = "none";
  }

  showSuccess() {
    if (this.quizFormWrapper) this.quizFormWrapper.style.display = "none";
    if (this.quizSuccess) this.quizSuccess.style.display = "flex";
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const nameInput = this.quizForm.querySelector("[data-quiz-name-input]");
    const phoneInput = this.quizForm.querySelector("[data-quiz-phone-input]");
    const checkbox = this.quizFormWrapper.querySelector("[data-quiz-checkbox]");
    const errorEl = this.quizForm.querySelector("[data-quiz-error]");

    const name = nameInput.value;
    const phone = phoneInput.value;

    const valid = validateForm(name, phone, checkbox);

    if (!valid.isValid) {
      errorEl.style.display = "block";
      errorEl.innerHTML = valid.message;
      return;
    }

    errorEl.style.display = "none";

    const formData = new FormData(this.quizForm);
    console.log("Форма отправлена, данные - ", Object.fromEntries(formData));
    const payload = new FormData();
    payload.append("name", name);
    payload.append("phone", phone);
    payload.append("form_type", "quiz");

    Object.entries(this.userAnswers).forEach(([question, answer]) => {
      payload.append(question, answer);
    });

    fetch("send.php", {
      method: "POST",
      body: payload,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          this.showSuccess();
        } else {
          errorEl.style.display = "block";
          errorEl.innerHTML = "Ошибка отправки. Попробуйте позже.";
        }
      })
      .catch(() => {
        errorEl.style.display = "block";
        errorEl.innerHTML = "Сетевая ошибка. Попробуйте позже.";
      });
  }
}

const quizData = [
  {
    question: "Сколько зубов нужно восстановить?",
    answers: [
      "Один зуб",
      "Несколько зубов",
      "Всю челюсть",
      "Обе челюсти",
      "Затрудняюсь ответить",
    ],
  },
  {
    question: "Зубов нет, или их нужно предварительно удалить?",
    answers: ["Зубов нет", "Нужно удалить", "Затрудняюсь ответить"],
  },
  {
    question: "Какие зубы нужно восстановить?",
    answers: [
      "Передние",
      "Жевательные",
      "И те, и другие",
      "Затрудняюсь ответить",
    ],
  },
  {
    question: "Вам нужен налоговый вычет?",
    answers: ["Да", "Нет", "Затрудняюсь ответить"],
  },
  {
    question: "Когда планируете начать лечение?",
    answers: [
      "Как можно скорее",
      "В течение недели",
      "В течение месяца",
      "Затрудняюсь ответить",
    ],
  },
];

document.querySelectorAll("[data-quiz]").forEach((quizElement) => {
  new Quiz(quizElement, quizData);
});

function validateForm(name, phone, checkbox) {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Имя не должно быть пустым" };
  }

  const cleanedPhone = phone.replace(/\D/g, "");

  if (!cleanedPhone) {
    return { isValid: false, message: "Телефон не должен быть пустым" };
  }

  if (cleanedPhone.length !== 11) {
    return {
      isValid: false,
      message: "Телефон должен состоять из 10 цифр (без кода страны)",
    };
  }

  if (!checkbox.checked) {
    return {
      isValid: false,
      message: "Нужно отметить чекбокс ниже",
    };
  }

  if (!/^\d+$/.test(cleanedPhone)) {
    return { isValid: false, message: "Телефон должен содержать только цифры" };
  }

  return { isValid: true, message: "Данные корректны" };
}

const diagForm = document.querySelector("[data-diag-form]");
const diagNameInput = document.querySelector("[data-diag-name-input]");
const diagPhoneInput = document.querySelector("[data-diag-phone-input]");
const diagCheckbox = document.querySelector("[data-diag-checkbox]");

diagForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = diagNameInput.value;
  const phone = diagPhoneInput.value;
  const valid = validateForm(name, phone, diagCheckbox);
  const errorEl = document.querySelector("[data-diag-error]");

  if (!valid.isValid) {
    errorEl.style.display = "block";
    errorEl.innerHTML = valid.message;
    return;
  }

  const payload = new FormData();
  payload.append("name", name);
  payload.append("phone", phone);
  payload.append("form_type", "reception");

  fetch("send.php", {
    method: "POST",
    body: payload,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        window.location.href = "/thanks.html";
      } else {
        errorEl.style.display = "block";
        errorEl.innerHTML = "Ошибка отправки. Попробуйте позже.";
      }
    })
    .catch(() => {
      errorEl.style.display = "block";
      errorEl.innerHTML = "Сетевая ошибка. Попробуйте позже.";
    });
});

const callForm = document.querySelector("[data-call-form]");
const callNameInput = document.querySelector("[data-call-name-input]");
const callPhoneInput = document.querySelector("[data-call-phone-input]");
const callCheckbox = document.querySelector("[data-call-checkbox]");

callForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = callNameInput.value;
  const phone = callPhoneInput.value;
  const valid = validateForm(name, phone, callCheckbox);
  const errorEl = document.querySelector("[data-call-error]");

  if (!valid.isValid) {
    errorEl.style.display = "block";
    errorEl.innerHTML = valid.message;
    return;
  }

  const payload = new FormData();
  payload.append("name", name);
  payload.append("phone", phone);
  payload.append("form_type", "call");

  fetch("send.php", {
    method: "POST",
    body: payload,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        window.location.href = "/thanks.html";
      } else {
        errorEl.style.display = "block";
        errorEl.innerHTML = "Ошибка отправки. Попробуйте позже.";
      }
    })
    .catch(() => {
      errorEl.style.display = "block";
      errorEl.innerHTML = "Сетевая ошибка. Попробуйте позже.";
    });
});

const receptionForm = document.querySelector("[data-reception-form]");
const receptionNameInput = document.querySelector(
  "[data-reception-name-input]"
);
const receptionPhoneInput = document.querySelector(
  "[data-reception-phone-input]"
);
const receptionCheckbox = document.querySelector("[data-reception-checkbox]");

receptionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = receptionNameInput.value;
  const phone = receptionPhoneInput.value;
  const valid = validateForm(name, phone, receptionCheckbox);
  const errorEl = document.querySelector("[data-reception-error]");

  if (!valid.isValid) {
    errorEl.style.display = "block";
    errorEl.innerHTML = valid.message;
    return;
  }

  const payload = new FormData();
  payload.append("name", name);
  payload.append("phone", phone);
  payload.append("form_type", "reception");

  fetch("send.php", {
    method: "POST",
    body: payload,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        window.location.href = "/thanks.html";
      } else {
        errorEl.style.display = "block";
        errorEl.innerHTML = "Ошибка отправки. Попробуйте позже.";
      }
    })
    .catch(() => {
      errorEl.style.display = "block";
      errorEl.innerHTML = "Сетевая ошибка. Попробуйте позже.";
    });
});

// swiper

const photosSwiper = new Swiper(".photos__swiper", {
  slidesPerView: 1.1,
  spaceBetween: 20,
  centeredSlides: true,
  initialSlide: 1,
  navigation: {
    nextEl: ".photos-button-next",
    prevEl: ".photos-button-prev",
  },
  slideActiveClass: "active-slide",
  breakpoints: {
    1600: {
      spaceBetween: 360,
      slidesPerView: 2.5,
    },
    1500: {
      spaceBetween: 300,
    },
    1400: {
      slidesPerView: 2.5,
      spaceBetween: 200,
    },
    986: {
      slidesPerView: 2.3,
      spaceBetween: 80,
    },
    700: {
      slidesPerView: 1.8,
      spaceBetween: 80,
    },
    524: {
      slidesPerView: 1.3,
      spaceBetween: 50,
    },
  },
});

ymaps.ready(init);

function init() {
  var map = new ymaps.Map("map", {
    center: [53.195873, 50.100202],
    zoom: 11,
    controls: ["zoomControl"],
  });

  // Блокируем все взаимодействия
  map.behaviors.disable([
    "drag",
    "scrollZoom",
    "dblClickZoom",
    "rightMouseButtonMagnifier",
    "multiTouch",
  ]);

  // Разблокируем при клике
  map.events.add("click", function () {
    if (!map._isInteractive) {
      map.behaviors.enable(["drag", "scrollZoom"]);
      document.getElementById("map").classList.add("active");
      map._isInteractive = true;
    }
  });

  // Список адресов
  var addresses = [
    {
      name: "S2 clinic",
      address: "Самара, пр.Кирова, 322а, к.1",
      coords: [53.232245, 50.207036],
    },
    {
      name: "S2 clinic",
      address: "Самара, Московское ш., 27",
      coords: [53.212678, 50.159196],
    },
    {
      name: "S2 clinic",
      address: "Самара, Молодёжная, 10",
      coords: [53.186365, 50.094871],
    },
    {
      name: "S2 clinic",
      address: "Самара, А.Толстого, 100",
      coords: [53.193211, 50.1186],
    },
  ];

  // Добавляем метки с красивыми балунами
  addresses.forEach(function (item) {
    // Создаем HTML-содержимое для балуна
    var balloonContent = `
                    <div class="balloon-content">
                        <div class="balloon-title">${item.name}</div>
                        <div class="balloon-address">${item.address}</div>
                    </div>
                `;

    var placemark = new ymaps.Placemark(
      item.coords,
      {
        balloonContentHeader: item.name,
        balloonContentBody: item.address,
        // Альтернативный вариант с полным контролем через HTML:
        balloonContent: balloonContent,
      },
      {
        preset: "islands#blueIcon",
        balloonCloseButton: true,
        hideIconOnBalloonOpen: false,
      }
    );

    // Открываем балун при клике
    placemark.events.add("click", function (e) {
      e.get("target").balloon.open();
    });

    map.geoObjects.add(placemark);
  });

  // Автомасштабирование
  if (addresses.length > 0) {
    map.setBounds(map.geoObjects.getBounds(), {
      checkZoomRange: true,
      zoomMargin: 50, // Добавляем отступы от краев
    });
  }
}

const mapCard = document.querySelector("[data-map-card]");
const mapCardBtn = document.querySelector("[data-map-card-btn]");

mapCardBtn.addEventListener("click", (e) => {
  e.preventDefault();
  mapCard.classList.add("card-hidden");
});

function usePhoneMask() {
  const phoneInputs = document.querySelectorAll('input[name="phone"]');
  const maskOptions = {
    mask: "+{7} (000) 000-00-00",
  };
  phoneInputs.forEach((input) => {
    const mask = IMask(input, maskOptions);
  });
}
usePhoneMask();

// modals

const quizModal = document.querySelector("[data-quiz-modal]");
const callModal = document.querySelector("[data-call-modal]");
const receptionModal = document.querySelector("[data-reception-modal]");

const showQuizModal = () => {
  quizModal.classList.add("quiz-modal-active");
  document.body.style.overflow = "hidden";
};
const hideQuizModal = () => {
  quizModal.classList.remove("quiz-modal-active");
  document.body.style.overflow = "auto";
};

const showCallModal = () => {
  callModal.classList.add("call-modal-active");
  document.body.style.overflow = "hidden";
};
const hideCallModal = () => {
  callModal.classList.remove("call-modal-active");
  document.body.style.overflow = "auto";
};

const showReceptionModal = () => {
  receptionModal.classList.add("reception-modal-active");
  document.body.style.overflow = "hidden";
};
const hideReceptionModal = () => {
  receptionModal.classList.remove("reception-modal-active");
  document.body.style.overflow = "auto";
};

quizModal.addEventListener("click", (e) => {
  if (!e.target.closest(".quiz")) {
    hideQuizModal();
  }
});
callModal.addEventListener("click", (e) => {
  if (!e.target.closest(".call__form-wrapper")) {
    hideCallModal();
  }
});
receptionModal.addEventListener("click", (e) => {
  if (!e.target.closest(".reception__form-wrapper")) {
    hideReceptionModal();
  }
});

const quizModalBtns = document.querySelectorAll("[data-calc-modal-btn]");
quizModalBtns.forEach((btn) => {
  btn.addEventListener("click", showQuizModal);
});
const callModalBtns = document.querySelectorAll("[data-call-modal-btn]");
callModalBtns.forEach((btn) => {
  btn.addEventListener("click", showCallModal);
});
const receptionModalBtns = document.querySelectorAll(
  "[data-reception-modal-btn]"
);
receptionModalBtns.forEach((btn) => {
  btn.addEventListener("click", showReceptionModal);
});


// cookie

const cookieEl = document.querySelector('[data-cookie]')
const cookieBtn = document.querySelector('[data-cookie-btn]')

let allowCookie = null

if(localStorage.getItem('cookie')){
  allowCookie = true
  cookieEl.style.display = 'none'
} else {
  cookieEl.style.display = 'flex'
  allowCookie = false
}

cookieBtn.addEventListener('click', ()=>{
  localStorage.setItem('cookie', true)
  allowCookie = true
  cookieEl.style.display = 'none'

})


// timer

function initCountdown() {
    const container = document.querySelector('.hero__calc-sale');
    if (!container) return;

    const deadlineStr = container.dataset.timerDeadline;
    const [dateStr, timeStr] = deadlineStr.split(',');
    const [day, month, year] = dateStr.trim().split('.').map(Number);
    const [hours, minutes] = timeStr.trim().split(':').map(Number);

    const deadline = new Date(year, month - 1, day, hours, minutes, 0);

    const daysEl = container.querySelector('[data-timer-days]');
    const hoursEl = container.querySelector('[data-timer-hours]');
    const minutesEl = container.querySelector('[data-timer-minutes]');
    const secondsEl = container.querySelector('[data-timer-seconds]');

    function updateTimer() {
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        clearInterval(timerInterval);
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }

  document.addEventListener('DOMContentLoaded', initCountdown);