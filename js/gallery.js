$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currYear = urlParams.get('year');
    const currMonth = urlParams.get('month');
    const currFolder = urlParams.get('id');

    $.getJSON("data.json", function (data) {
        const cfg = data.config;
        let html = "";
        let titleHtml = `<a href="gallery.html">Home</a> / <a href="gallery.html">Gallery</a> / `;
        const $container = $("#gallery_container");

        // [초기화] 서브페이지(4열) 클래스 제거
        $container.removeClass("sub_mode");

        // 1단계: 특정 연도 클릭 시 -> 1월~12월 리스트 (기본 5열)
        if (currYear && !currMonth) {
            titleHtml += `<span>${currYear}</span>`;
            for (let i = 1; i <= 12; i++) {
                let m = i.toString().padStart(2, '0');
                // 모든 월을 활성화 상태로 만듦
                let thumbImg = `images/${currYear}/${m}/folder_1/01.jpg`;
                html += `
                    <div class="archive_item">
                        <a href="gallery_sub.html?year=${currYear}&month=${m}">
                            <div class="thumb_box" style="background-image:url('${thumbImg}')"></div>
                            <p class="year_text">${i}월</p>
                        </a>
                    </div>`;
            }
        }

        // 2단계: 특정 월 클릭 시 -> 임시 폴더 9개 (4열 모드)
        else if (currYear && currMonth && !currFolder) {
            $container.addClass("sub_mode");
            titleHtml += `<a href="gallery_sub.html?year=${currYear}">${currYear}</a> / <span>${parseInt(currMonth)}월</span>`;

            cfg.folderNames.forEach((name, index) => {
                let fId = `folder_${index + 1}`;
                let thumbImg = `images/${currYear}/${currMonth}/${fId}/01.jpg`;
                html += `
                    <div class="archive_item">
                        <a href="gallery_sub.html?year=${currYear}&month=${currMonth}&id=${fId}">
                            <div class="thumb_box" style="background-image:url('${thumbImg}')"></div>
                            <p class="year_text">${name}</p>
                        </a>
                    </div>`;
            });
        }

        // 3단계: 특정 폴더 클릭 시 -> 01.jpg~09.jpg (4열 모드)
        else if (currFolder) {
            $container.addClass("sub_mode");
            let fIdx = parseInt(currFolder.split('_')[1]) - 1;
            let fName = cfg.folderNames[fIdx];

            titleHtml += `
                <a href="gallery_sub.html?year=${currYear}">${currYear}</a> / 
                <a href="gallery_sub.html?year=${currYear}&month=${currMonth}">${parseInt(currMonth)}월</a> / 
                <span>${fName}</span>`;

            cfg.images.forEach(imgName => {
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

    // 라이트박스 & 상단이동
    $(document).on('click', '.lightbox_trigger', function () {
        $('#lightbox img').attr('src', $(this).data('src'));
        $('#lightbox').css('display', 'flex');
    });
    $('#lightbox, .close_btn').click(function () { $('#lightbox').hide(); });
});