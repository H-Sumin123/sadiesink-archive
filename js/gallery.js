$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currYear = urlParams.get('year');
    const currMonth = urlParams.get('month');
    const currFolderIdx = urlParams.get('id'); // 폴더의 순번(Index)을 가져옵니다.

    $.getJSON("data.json", function (data) {
        const archive = data.config.archive_data;
        let html = "";
        let titleHtml = `<a href="gallery.html" style="display:inline;">Home</a> / <a href="gallery.html" style="display:inline;">Gallery</a>`;
        const $container = $("#gallery_container");
        $container.addClass("sub_mode");

        // 1. 월 선택 화면 (예: 2026 클릭 시)
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
        // 2. 폴더 또는 이미지/비디오 화면 (예: 2026년 1월 클릭 시)
        else if (currYear && currMonth) {
            // 해당 연도와 월에 데이터가 있는지 확인
            const monthData = (archive[currYear] && archive[currYear][currMonth]) ? archive[currYear][currMonth] : [];

            if (currFolderIdx === null) {
                // [폴더 리스트 출력]
                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;

                if (monthData.length === 0) {
                    html = "<p style='grid-column:1/-1; text-align:center; padding:50px;'>등록된 폴더가 없습니다.</p>";
                } else {
                    monthData.forEach((item, index) => {
                        html += `
                            <div class="archive_item">
                                <a href="gallery_sub.html?year=${currYear}&month=${currMonth}&id=${index}">
                                    <div class="thumb_box"></div>
                                    <p class="year_text">${item.folder_name}</p>
                                </a>
                            </div>`;
                    });
                }
            } else {
                // [이미지 및 비디오 상세 출력]
                const folderData = monthData[currFolderIdx];
                titleHtml += ` / <a href="gallery_sub.html?year=${currYear}" style="display:inline;">${currYear}</a> / <a href="gallery_sub.html?year=${currYear}&month=${currMonth}" style="display:inline;">${parseInt(currMonth)}월</a> / <span>${folderData.folder_name}</span>`;

                // 이미지 섹션
                if (folderData.image_list && folderData.image_list.length > 0) {
                    html += `<div style="grid-column: 1 / -1; width: 100%;"><h3 style="text-align:left; margin: 20px 0;">Image</h3></div>`;
                    folderData.image_list.forEach(img => {
                        html += `
                            <div class="archive_item">
                                <div class="thumb_box" style="background-image: url('./images/${img}'); cursor:pointer;" onclick="window.open('./images/${img}')"></div>
                                <p class="year_text">${img}</p>
                            </div>`;
                    });
                }

                // 비디오 섹션
                if (folderData.video_list && folderData.video_list.length > 0) {
                    html += `<div style="grid-column: 1 / -1; width: 100%; height: 1px; background: #eee; margin: 50px 0;"></div>`;
                    html += `<div style="grid-column: 1 / -1; width: 100%;"><h3 style="text-align:left; margin-bottom: 20px;">Video</h3></div>`;
                    folderData.video_list.forEach(vid => {
                        html += `
                            <div class="archive_item">
                                <div class="thumb_box" style="background:#000; display:flex; align-items:center; justify-content:center;">
                                    <video width="100%" height="100%" controls style="object-fit: contain;">
                                        <source src="./images/${vid}" type="video/mp4">
                                    </video>
                                </div>
                                <p class="year_text">${vid}</p>
                                <a href="./images/${vid}" download style="font-size:12px; color:#666;">Download</a>
                            </div>`;
                    });
                }
            }
        }

        $("#dynamic_title").html(titleHtml);
        $container.html(html);

    }).fail(function () {
        console.error("data.json 로드 실패");
    });
});