
const noJs = document.querySelector(".no-js"),
    headerOpen = document.querySelector(".main-header--open"),    
    hamburger = headerOpen.querySelector(".main-header__hamburger");

noJs.classList.remove("no-js");
headerOpen.classList.remove("main-header--open");
headerOpen.classList.remove("main-header--nojs");
hamburger.style.opacity = 1;
