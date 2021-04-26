/*!
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 *
 * Copyright 2018-2021 Develable.
 */

// 로그아웃
function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        alert(`로그아웃에 실패했습니다.\n${error}`);
        throw error;
    });

    window.location.href = './login';
    throw 'session invaild';
}

// 비밀번호 변경 요청
function resetpw() {
    firebase.auth().onAuthStateChanged(function(user) {
        firebase.auth().languageCode = 'ko';

        firebase.auth().sendPasswordResetEmail(user.email).then(function() {
            alert(`비밀번호 재설정 메일을 ${user.email}으로 전송하였습니다.\n해당 계정은 자동으로 로그아웃 처리 됩니다.`);
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }).catch(function(error) {
                throw error;
            });
            window.location.href = './login';
        }).catch(function(error) {
            console.log(error);
            alert(`알 수 없는 문제가 발생했습니다.\n${error}`);
        });
    });
}

// 셀렉 바뀐경우
function select_changed() {
    let selected = $('#type option:selected').val();
    let color;
    let icon;
    switch (selected) {
        case '0':
            // 대규모
            color = "danger";
            icon = '<i class="fa fa-times"></i>';
            break;
        case '1':
            // 소규모
            color = "warning";
            icon = '<i class="fa fa-exclamation"></i>';
            break;
        case '2':
            // planned
            color = "primary";
            icon = '<i class="fa fa-info"></i>';
            break;
        case '3':
            // online
            color = "success";
            icon = '<i class="fa fa-check"></i>';
            break;
    }

    document.getElementById("form_icon").innerHTML = icon;
    document.getElementById("form_color").className = `panel new panel-${color}`;
}

// Loaded 직후 설정으로 돌림
function reset_forms() {
    document.getElementById("title").value = '';
    document.getElementById("description").value = '';
    document.getElementById('type').value = '3';
    select_changed();
    let nwd = new Date();

    $('#st_time').flatpickr({
        enableTime: true,
        minDate: 'today',
        dateFormat: "Y-m-d H:i:00",
        defaultDate: `${nwd.toISOString()}`,
        "locale" : {
            "firstDayOfWeek" : 0
        }
    });

    $('#ed_time').flatpickr({
        enableTime: true,
        minDate: 'today',
        dateFormat: "Y-m-d H:i:00",
        defaultDate: `${nwd.toISOString()}`,
        "locale" : {
            "firstDayOfWeek" : 0
        }
    });

    $('#description').summernote('destroy');
    $('#description').summernote({
        lang: 'ko-KR',
        height: 120,
        minHeight: null,
        maxHeight: null,
        placeholder: '최대한 간결하게 설명을 작성 해 주세요.',
        toolbar: [
            ['history', ['undo', 'redo']],
            ['style', []],
            ['font', ['bold', 'italic', 'strikethrough', 'underline', 'clear']],
            ['color', []],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', []],
            ['view', []]
        ]
    });
}