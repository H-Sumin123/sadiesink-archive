$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currYear = urlParams.get('year');
    const currMonth = urlParams.get('month');
    const currFolder = urlParams.get('id');

    $.getJSON("data.json", function (data) {
        const cfg = data.config;
        let html = "";
        let titleHtml = `<a href="gallery.html" style="display:inline;">Home</a> / <a href="gallery.html" style="display:inline;">Gallery</a>`;
        const $container = $("#gallery_container");

        // gallery_sub.html 페이지는 무조건 4열 모드(sub_mode) 적용
        $container.addClass("sub_mode");

        // [Case 1] 연도만 있는 경우 (예: 2024 클릭 -> 1~12월 리스트 출력)
        if (currYear && !currMonth) {
            titleHtml += ` / <span>${currYear}</span>`;
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
        // [Case 2] 연도와 월이 모두 있는 경우 (폴더 또는 이미지 출력)
        else if (currYear && currMonth) {
            // [A] 특정 폴더를 아직 안 눌렀을 때 -> 폴더 리스트(샤넬 행사, 일상 등) 출력
            if (!currFolder) {
                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;

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
            }
            // [B] 폴더를 눌렀을 때 -> 이미지 리스트 출력
            else {
                // 선택한 폴더 이름 가져오기
                const folderIdx = parseInt(currFolder.split('_')[1]) - 1;
                const folderName = cfg.folderNames[folderIdx] || "Detail";

                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <a href="gallery_sub.html?year=${currYear}&month=${currMonth}" style="display:inline;">${parseInt(currMonth)}월</a> / <span>${folderName}</span>`;

                cfg.images.forEach(img => {
                    html += `
                        <div class="archive_item">
                            /* 경로를 ./images/로 수정했습니다 */
                            <div class="thumb_box lightbox_trigger" style="background-image: url('./images/${img}');"></div>
                            <p class="year_text">${img.split('.')[0]}</p>
                        </div>`;
                });
            }
        }

        // 결과 삽입
        $("#dynamic_title").html(titleHtml);
        $container.html(html);

    }).fail(function () {
        console.error("data.json 로드 실패. 경로를 확인하세요.");
    });

    // TOP 버튼 기능
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) $('#top_btn').fadeIn();
        else $('#top_btn').fadeOut();
    });
    $('#top_btn').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 400);
    });
});