$(function () {
  $('[data-tab]').on('click', function (e) {
    if (!$(e.target).hasClass('active')) {
      $('[data-tab], [tab]').removeClass('active')
      $(`[data-tab=${e.target.dataset.tab}],
      [tab=${e.target.dataset.tab}]`).addClass('active')
    }
  })
  $('.menu-btn').on('click', function (e) {
    $('.menu-btn, header ul').toggleClass('active')
  })
})
