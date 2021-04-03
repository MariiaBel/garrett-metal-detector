const modalOpenBtn = document.querySelectorAll('[data-modal-open]'),
    formModal = document.querySelector('#modal-form')
let modalCloseBtn,
    modal;


setTimeout(openPopup, 8000, formModal);

modalOpenBtn.forEach(btnItem => btnItem.addEventListener(`click`, openPopupModal));

function openPopupModal(evt) {
    evt.preventDefault();
    let dataPopup = this.dataset.modalOpen;    
    modal = document.querySelector(`#modal-${dataPopup}`);

    openPopup(modal);
}

function closePopup(modal) {
    modalCloseBtn = modal.querySelector("[data-modal-close]");

    modalCloseBtn.addEventListener("click", function (evt) {
        evt.preventDefault();
        modal.classList.remove("modal--active");
    });

}

function openPopup(modal) {
    modal.classList.add("modal--active");
    closePopup(modal);
}

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
        if (modal.classList.contains("modal--active")) {
            evt.preventDefault();
            modal.classList.remove("modal--active");
        }
    }
});
