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

        $container.addClass("sub_mode");

        if (currYear && !currMonth) {
            // [월 선택 페이지] 기존과 동일
            titleHtml += ` / <span>${currYear}</span>`;
            for (let i = 1; i <= 12; i++) {
                let m = i.toString().padStart(2, '0');
                html += `<div class="archive_item"><a href="gallery_sub.html?year=${currYear}&month=${m}"><div class="thumb_box"></div><p class="year_text">${i}월</p></a></div>`;
            }
        }
        else if (currYear && currMonth) {
            if (!currFolder) {
                // [폴더 선택 페이지] 기존과 동일
                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;
                cfg.folder_names.forEach((name, index) => {
                    html += `<div class="archive_item"><a href="gallery_sub.html?year=${currYear}&month=${currMonth}&id=folder_${index + 1}"><div class="thumb_box"></div><p class="year_text">${name}</p></a></div>`;
                });
            } else {
                // [상세 페이지 - 이미지 & 비디오 분리]
                const folderIdx = parseInt(currFolder.split('_')[1]) - 1;
                const folderName = cfg.folder_names[folderIdx] || "Detail";
                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <a href="gallery_sub.html?year=${currYear}&month=${currMonth}" style="display:inline;">${parseInt(currMonth)}월</a> / <span>${folderName}</span>`;

                // 1. Image 섹션
                html += `<div style="grid-column: 1 / -1; width: 100%;"><h3 style="margin-bottom:20px; text-align:left;">Image</h3></div>`;
                cfg.image_list.forEach(img => {
                    html += `
                        <div class="archive_item">
                            <div class="thumb_box" style="background-image: url('./images/${img}'); cursor:pointer;" onclick="window.open('./images/${img}')"></div>
                            <p class="year_text">${img}</p>
                        </div>`;
                });

                // 2. Video 섹션 (구분선 추가)
                html += `<div style="grid-column: 1 / -1; width: 100%; height: 1px; background: #eee; margin: 50px 0;"></div>`;
                html += `<div style="grid-column: 1 / -1; width: 100%;"><h3 style="margin-bottom:20px; text-align:left;">Video</h3></div>`;

                cfg.video_list.forEach(vid => {
                    html += `
                        <div class="archive_item">
                            <div class="thumb_box" style="background:#000; display:flex; align-items:center; justify-content:center;">
                                <video width="100%" height="100%" controls style="object-fit: contain;">
                                    <source src="./images/${vid}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <p class="year_text">${vid}</p>
                            <a href="./images/${vid}" download style="font-size:12px; color:#666; text-decoration:underline;">Download Video</a>
                        </div>`;
                });
            }
        }
        $("#dynamic_title").html(titleHtml);
        $container.html(html);
    });
});