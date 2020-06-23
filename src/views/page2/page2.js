$(document).ready(function () {
    let test = 'page2.js'
    console.log(test)
    const mySwiper = new Swiper ('.swiper-container', {
        // direction: 'vertical',
        loop: true,

        pagination: {
          el: '.swiper-pagination',
        },

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        scrollbar: {
          el: '.swiper-scrollbar',
        },
      })
})