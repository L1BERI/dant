function validateForm(phone, checkbox) {


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

const callForm = document.querySelector("[data-call-form]");
const callNameInput = document.querySelector("[data-call-name-input]");
const callPhoneInput = document.querySelector("[data-call-phone-input]");
const callCheckbox = document.querySelector("[data-call-checkbox]");

callForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = callNameInput.value;
  const phone = callPhoneInput.value;
  const valid = validateForm(phone, callCheckbox);
  const errorEl = document.querySelector("[data-call-error]");

  if (!valid.isValid) {
    errorEl.style.display = "block";
    errorEl.innerHTML = valid.message;
    return;
  }
  errorEl.style.display = "none";
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

const callModal = document.querySelector("[data-call-modal]");
const showCallModal = () => {
  callModal.classList.add("call-modal-active");
  document.body.style.position = "fixed";
};
const hideCallModal = () => {
  callModal.classList.remove("call-modal-active");
  document.body.style.position = "relative";
};
const callModalBtns = document.querySelectorAll("[data-call-modal-btn]");
callModalBtns.forEach((btn) => {
  btn.addEventListener("click", showCallModal);
});
callModal.addEventListener("click", (e) => {
  if (!e.target.closest(".call__form-wrapper")) {
    hideCallModal();
  }
});
