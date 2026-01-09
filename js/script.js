//TOP 버튼
$(document).ready(function () {
            // Top 버튼 클릭 시 부드럽게 위로 이동
            $('#top_btn').click(function (e) {
                e.preventDefault();

                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            });

            // 스크롤 위치에 따라 버튼 표시/숨김
            $(window).scroll(function () {
                if ($(this).scrollTop() > 500) {
                    $('#top_btn').fadeIn();
                } else {
                    $('#top_btn').fadeOut();
                }
            });
        });