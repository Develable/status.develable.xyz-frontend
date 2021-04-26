/*!
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 *
 * Copyright 2018-2021 Develable.
 */

let tod = new Date(); // Datetimepicker 잡는데 쓰이니까 제발 지우지 마세요 제발!!

// datetimepicker setup
$('#st_time').flatpickr({
    enableTime: true,
    minDate: 'today',
    dateFormat: "Y-m-d H:i:00",
    defaultDate: `${tod.toISOString()}`,
    "locale" : {
        "firstDayOfWeek" : 0
    }
});

$('#ed_time').flatpickr({
    enableTime: true,
    minDate: 'today',
    dateFormat: "Y-m-d H:i:00",
    "locale" : {
        "firstDayOfWeek" : 0
    }
});

// summernote setup
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

// Turndown JS Setup
let turndownService = new TurndownService()
turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
        return '~~' + content + '~~'
    }
})

// SweetAlert2 Tinyalert
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})