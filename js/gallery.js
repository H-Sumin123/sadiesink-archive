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

        // gallery_sub.html에 들어오면 무조건 4열 모드(sub_mode)를 먼저 적용합니다.
        $container.addClass("sub_mode");

        if (currYear && !currMonth) {
            // [월 선택 페이지] -> 이제 여기서도 무조건 4열로 나옵니다.
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
            // [폴더 리스트 또는 상세 이미지 페이지] -> 4열 유지
            if (!currFolder) {
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
});