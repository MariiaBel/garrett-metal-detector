const header = document.querySelector(".main-header"),
    hamburger = header.querySelector(".main-header__hamburger"),
    links = header.querySelectorAll("a");

links.forEach(link => link.addEventListener('click', function() {
    closeMenu();
    for(let link of links) {
        if (link.classList.contains('active')) link.classList.remove('active');
    }
    this.classList.add('active');
}))

hamburger.addEventListener('click', function() {
    header.classList.toggle('main-header--open');
    hamburger.classList.toggle('active')
});

function closeMenu(e) {
    header.classList.remove('main-header--open');
    hamburger.classList.remove('active')
}
