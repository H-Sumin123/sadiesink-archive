$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currYear = urlParams.get('year');
    const currMonth = urlParams.get('month');
    const currFolder = urlParams.get('id');

    $.getJSON("data.json", function (data) {
        const cfg = data.config;
        let html = "";
        let titleHtml = `<a href="gallery.html" style="display:inline;">Home</a> / <a href="gallery.html" style="display:inline;">Gallery</a> / `;
        const $container = $("#gallery_container");

        // [핵심] 페이지 로드 시 그리드 모드 초기화
        $container.removeClass("sub_mode");

        if (currYear && !currMonth) {
            // 1. 연도 선택 페이지 -> 5열 유지
            titleHtml += `<span>${currYear}</span>`;
            for (let i = 1; i <= 12; i++) {
                let m = i.toString().padStart(2, '0');
                html += `
                    <div class="archive_item">
                        <a href="gallery_sub.html?year=${currYear}&month=${m}">
                            <div class="thumb_box"></div>
                            <p class="year_text">${i}월</p>
                        </a>
                    </div>`;
            }
        }
        else if (currYear && currMonth) {
            // 2. 월 선택 또는 상세 페이지 -> 4열 모드(sub_mode) 활성화
            $container.addClass("sub_mode");

            if (!currFolder) {
                // 월 클릭 시 (폴더 리스트)
                titleHtml += `<a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;
                cfg.folderNames.forEach((name, index) => {
                    let fId = `folder_${index + 1}`;
                    html += `
                        <div class="archive_item">
                            <a href="gallery_sub.html?year=${currYear}&month=${currMonth}&id=${fId}">
                                <div class="thumb_box"></div>
                                <p class="year_text">${name}</p>
                            </a>
                        </div>`;
                });
            } else {
                // 폴더 클릭 시 (상세 이미지)
                titleHtml += `<a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <a href="gallery_sub.html?year=${currYear}&month=${currMonth}" style="display:inline;">${parseInt(currMonth)}월</a> / <span>Detail</span>`;
                cfg.images.forEach(img => {
                    html += `
                        <div class="archive_item">
                            <div class="thumb_box lightbox_trigger"></div>
                            <p class="year_text">${img}</p>
                        </div>`;
                });
            }
        }
        $("#dynamic_title").html(titleHtml);
        $container.html(html);
    });

    // TOP 버튼 동작
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) $('#top_btn').fadeIn();
        else $('#top_btn').fadeOut();
    });
    $('#top_btn').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 400);
    });
});