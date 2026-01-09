$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currYear = urlParams.get('year');
    const currMonth = urlParams.get('month');
    const currFolder = urlParams.get('id');

    $.getJSON("data.json", function (configData) {
        const cfg = configData.config;
        let html = "";
        let titleHtml = `<a href="gallery.html">Home</a> / <a href="gallery.html">Gallery</a> / `;
        const $container = $("#gallery_container");

        // 초기화: 모든 특수 열 클래스 제거
        $container.removeClass("sub_mode");

        // [STEP 1] 연도만 있을 때: 1월 ~ 12월 리스트 출력 (5열 그리드)
        if (currYear && !currMonth) {
            titleHtml += `<span>${currYear}</span>`;

            cfg.months.forEach(m => {
                // 임시 썸네일 경로 (실제 파일이 없을 경우 대비하여 첫 번째 폴더의 첫 번째 이미지 지정)
                let thumbImg = `images/${currYear}/${m}/folder_1/01.jpg`;
                html += `
                    <div class="archive_item">
                        <a href="gallery_sub.html?year=${currYear}&month=${m}">
                            <div class="thumb_box" style="background-image:url('${thumbImg}')"></div>
                            <p class="year_text">${parseInt(m)}월</p>
                        </a>
                    </div>`;
            });
        }

        // [STEP 2] 월까지 있을 때: 임시 폴더 9개 출력 (4열 그리드)
        else if (currYear && currMonth && !currFolder) {
            $container.addClass("sub_mode"); // 4열 모드 활성화
            titleHtml += `<a href="gallery_sub.html?year=${currYear}">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;

            cfg.folder_names.forEach((name, index) => {
                let folderId = `folder_${index + 1}`;
                let thumbImg = `images/${currYear}/${currMonth}/${folderId}/01.jpg`;
                html += `
                    <div class="archive_item">
                        <a href="gallery_sub.html?year=${currYear}&month=${currMonth}&id=${folderId}">
                            <div class="thumb_box" style="background-image:url('${thumbImg}')"></div>
                            <p class="year_text">${name}</p>
                        </a>
                    </div>`;
            });
        }

        // [STEP 3] 폴더(ID)까지 있을 때: 이미지 01.jpg ~ 09.jpg 출력 (4열 그리드)
        else if (currFolder) {
            $container.addClass("sub_mode");
            let folderIdx = parseInt(currFolder.split('_')[1]) - 1;
            let folderName = cfg.folder_names[folderIdx];

            titleHtml += `
                <a href="gallery_sub.html?year=${currYear}">${currYear}</a> / 
                <a href="gallery_sub.html?year=${currYear}&month=${currMonth}">${parseInt(currMonth)}월</a> / 
                <span>${folderName}</span>`;

            cfg.image_list.forEach(imgName => {
                let path = `images/${currYear}/${currMonth}/${currFolder}/${imgName}`;
                html += `
                    <div class="archive_item">
                        <div class="thumb_box lightbox_trigger" data-src="${path}" style="background-image:url('${path}')"></div>
                        <p class="year_text">${imgName.split('.')[0]}</p>
                    </div>`;
            });
        }

        $("#dynamic_title").html(titleHtml);
        $container.html(html);
    });

    // 라이트박스 및 기타 기능
    $(document).on('click', '.lightbox_trigger', function () {
        $('#lightbox img').attr('src', $(this).data('src'));
        $('#lightbox').css('display', 'flex');
    });
    $('#lightbox, .close_btn').click(function () { $('#lightbox').hide(); });
});