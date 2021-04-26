/*!
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 *
 * Copyright 2018-2021 Develable.
 */

// 체크박스 작업
function checkbox_do(init, allow) {
    $("input:checkbox[id='init_finished']").prop("checked", init);
    $("input:checkbox[id='access_allow']").prop("checked", allow);
}

// API에 접근 가능한지 확인
let pageType = 'Main'
if (document.location.href.indexOf('$dev_pv') != -1) { // 개발자 전용 페이지
    pageType = 'Dev'
}
document.getElementById("page_type").value = pageType;
let PageIndi = document.getElementById("page_indi").value;
$.ajax({
    type: "GET",
    url: `https://develable-status-backend.herokuapp.com/${pageType}/api/v1/Access/Permission/${PageIndi}`,
    success: function(data) {
        // {"request":"success","Allow":false}
        let footer = JSON.stringify(data);
        if (data['request'] === "fail") {
            checkbox_do(true, false);
            Swal.fire({
                icon: 'error',
                title: 'API 연결에 실패했습니다.',
                html: '이 문제가 지속되면 <a href="https://invite.gg/Develable">공식 서버</a>에 알려주세요.',
                footer
            });
            return;
        } else
        if (! data['Allow']) {
            checkbox_do(true, false);
            Swal.fire({
                icon: 'error',
                title: '접근이 제한되었습니다.',
                html: '사이트 접근이 원격으로 제한되었습니다.<br />자세한 내용은 <a href="https://invite.gg/Develable">공식 서버</a>를 참고하세요.',
                footer
            });
            return;
        } else {
            // Your web app's Firebase configuration
            let firebaseConfig = {
                //TODO
            };

            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();

            checkbox_do(true, true);
            return;
        }

    },
    error: function(XMLHttpRequest, status, error) {
        checkbox_do(true, false);
        Swal.fire({
            icon: 'error',
            title: 'API 연결에 실패했습니다.',
            html: '이 문제가 지속되면 <a href="https://invite.gg/Develable">공식 서버</a>에 알려주세요.',
            footer: `${status} : ${error}`
        });
        return;
    }
});