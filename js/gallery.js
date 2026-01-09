$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const currYear = urlParams.get('year');
    const currMonth = urlParams.get('month');
    const currFolder = urlParams.get('id');

    $.getJSON("data.json", function(data) {
        const cfg = data.config;
        let html = "";
        let titleHtml = `<a href="gallery.html" style="display:inline;">Home</a> / <a href="gallery.html" style="display:inline;">Gallery</a>`;
        const $container = $("#gallery_container");

        // gallery_sub.html에 들어오면 무조건 4열 모드 적용
        $container.addClass("sub_mode");

        // 1. 연도만 선택된 경우 (예: 2024 -> 1월~12월 리스트 출력)
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
        // 2. 연도와 월이 선택된 경우
        else if (currYear && currMonth) {
            // A. 폴더를 아직 선택하지 않은 경우 (예: 2024/05 -> 샤넬 행사, 일상 등 폴더 출력)
            if (!currFolder) {
                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;
                
                // data.json의 folderNames를 사용하여 폴더 생성
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
            // B. 특정 폴더를 선택한 경우 (예: 2024/05/샤넬 행사 -> 이미지 출력)
            else {
                // 폴더 이름을 찾기 위한 로직
                const folderIdx = parseInt(currFolder.split('_')[1]) - 1;
                const folderName = cfg.folderNames[folderIdx] || "Detail";

                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <a href="gallery_sub.html?year=${currYear}&month=${currMonth}" style="display:inline;">${parseInt(currMonth)}월</a> / <span>${folderName}</span>`;
                
                // data.json의 images를 사용하여 이미지 리스트 생성
                cfg.images.forEach(img => {
                    html += `
                        <div class="archive_item">
                            <div class="thumb_box lightbox_trigger" style="background-image: url('./image/${img}');"></div>
                            <p class="year_text">${img.split('.')[0]}</p>
                        </div>`;
                });
            }
        }

        // HTML 삽입
        $("#dynamic_title").html(titleHtml);
        $container.html(html);

    }).fail(function() {
        alert("data.json 파일을 불러오는 데 실패했습니다. 파일 위치를 확인해주세요.");
    });

    // TOP 버튼
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) $('#top_btn').fadeIn();
        else $('#top_btn').fadeOut();
    });
    $('#top_btn').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 400);
    });
});