/*! 
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 * 
 * Copyright 2018-2021 Develable.
 */

function wa_sans(cycle) {
  sanstell(cycle);
  /*
    * 나 왜 스테이터스 넘버링 저따구로 한건지 모르겠는데 이제와서 바꾸기 뭐하니까 메모남김
    *
    * -1 미선택 (받을 일 없음)
    * 0 대규모 문제
    * 1 소규모 문제
    * 2 예정 점검
    * 3 온라인
    */

  // 서비스용
  let nowdata;
  let nowdata_major_ot = 0;
  let nowdata_minor_ot = 0;
  let nowdata_maintaining_mt = 0;
  let nowdata_planned_mt = 0;
  let nowdata_online = 0;

  // 카테고리 및 하위 서비스 열림 여부
  let categoryStyle_Display = 'none';
  let categoryStyle_iTag = 'fas fa-chevron-right';

  // 카테고리 하위 서비스용
  let nowdata_list;
  let nowdata_list_count = 1; // HTML 넘버링 용도
  let nowdata_list_count_minorSV = 0; // 카테고리 하위 서비스에 부여되는 넘버 :: 카테고리가 바뀌면 0으로 돌아가야함
  let nowdata_list_major_ot = 0;
  let nowdata_list_minor_ot = 0;
  let nowdata_list_maintaining_mt = 0;
  let nowdata_list_planned_mt = 0;
  let nowdata_list_online = 0;
  let nowdata_list_max; // 위에 4개중 제일 큰 값 저장하는 임시변수
  let iiii = 0; // 하위 카테고리 서비스 numbering 전용

  // 상단 STATUS BAR 작업용
  let status_board = ''; // 서비스 Status 개수 html
  let nowdata_major_ot_board = '';
  let nowdata_minor_ot_board = '';
  let nowdata_maintaining_mt_board = '';
  let nowdata_planned_mt_board = '';

  // PLANNED MAINTENANCE / MAINTENANCING 구분용 변수
  let saidtime;
  let nowtime;

  // ETC
  let ObKeys;
  let status;
  let current_services = ''; // 출력용 데이터
  let services_lists_inf; // list 있는 카테고리 데이터 임시 담기는곳
  let temp_str; // TEMP
  let selecton_off = ' checked="checked"'; // 기본 select 잡아주는 용도

  // 진행중인거, planned maintenance 불러오기 및 변수 저장 시작부
  firebase.database().ref('/services/').once('value').then(function(snapshot) {
    for (i = 0; i < snapshot.val().length; i++) {
      nowdata = snapshot.val()[i];
      if (nowdata['list'] === undefined) { // 카테고리 아님
        switch (snapshot.val()[i]['status']) {
          case 0:
            status = '<div class="status danger">대규모 문제발생</div>';
            nowdata_major_ot_board = nowdata_major_ot_board + `<article class="panel panel-danger"><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata['detail_board']['start_datetime'])}">${get_timeago(nowdata['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata['sname']}</span></small></div></article>\n`;
            nowdata_major_ot += 1;
            break;
          case 1:
            status = '<div class="status warning">소규모 문제발생</div>';
            nowdata_minor_ot_board = nowdata_minor_ot_board + `<article class="panel panel-warning"><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata['detail_board']['start_datetime'])}">${get_timeago(nowdata['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata['sname']}</span></small></div></article>\n`;
            nowdata_minor_ot += 1;
            break;
          case 2:
            // Planned Maintenance는 진행 중일 때하고 예정하고 노출 위치가 다름!
            if (nowtime < saidtime) { // PLANNED
              status = '<div class="status primary">점검 예정됨</div>';
              nowdata_planned_mt_board = nowdata_planned_mt_board + `<article class="panel panel-primary"><div class="panel-heading icon"><i class="fa fa-info"></i></div><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata['detail_board']['start_datetime'])}">${get_timeago(nowdata['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata['sname']}</span><span class="pull-right">종료 예정&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata['detail_board']['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata['detail_board']['end_datetime'])}">${get_timeago(nowdata['detail_board']['end_datetime'])}</time></span></small></div></article>`;
              nowdata_planned_mt += 1;
            } else {
              status = '<div class="status primary">예정된 점검 진행중</div>';
              nowdata_maintaining_mt_board = nowdata_maintaining_mt_board + `<article class="panel panel-primary"><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata['detail_board']['start_datetime'])}">${get_timeago(nowdata['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata['sname']}</span><span class="pull-right">종료 예정&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata['detail_board']['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata['detail_board']['end_datetime'])}">${get_timeago(nowdata['detail_board']['end_datetime'])}</time></span></small></div></article>\n`;
              nowdata_maintaining_mt += 1;
            }
            break;
          case 3:
            status = '<div class="status success">온라인</div>';
            nowdata_online += 1;
            break;
        }
        current_services = current_services + `<div class="item clearfix"><div class="service">&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="services" value="${snapshot.val()[i]['status']}" id="non-category-sv-${i}" style="margin-right: 5px; margin-left: -18px;"${selecton_off}><label for="non-category-sv-${i}">${nowdata['sname']}</label></div>${status}</div>\n`;
        if (selecton_off === ' checked="checked"') {
          selecton_off = ''
        }
      } else {
        nowdata_list_count_minorSV = 0;
        services_lists_inf = '';
        nowdata_list_major_ot = 0;
        nowdata_list_minor_ot = 0;
        nowdata_list_planned_mt = 0;
        nowdata_list_maintaining_mt = 0;
        nowdata_list_online = 0;
        ObKeys = Object.keys(nowdata['list']);
        iiii = 0;
        ObKeys.forEach(function (item) {
          // 2회차부터는 카테고리 오픈 여부를 따져야함
          // 제발 누구 접속해있을때 카테고리 바꾸지 말아주세요,,
          if (cycle > 0) {
            if (isCategoryOpened(nowdata_list_count)) {
              categoryStyle_Display = 'block';
              categoryStyle_iTag = 'fas fa-chevron-down';
            } else {
              categoryStyle_Display = 'none';
              categoryStyle_iTag = 'fas fa-chevron-right';
            }
          }

          nowdata_list = nowdata['list'][item];
          switch (nowdata_list['status']) {
            case 0:
              status = '<div class="status danger">대규모 문제발생</div>';
              nowdata_major_ot_board = nowdata_major_ot_board + `<article class="panel panel-danger"><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata_list['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata_list['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata_list['detail_board']['start_datetime'])}">${get_timeago(nowdata_list['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata_list['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata_list['sname']}</span></small></div></article>\n`;
              nowdata_major_ot += 1;
              nowdata_list_major_ot += 1;
              break;
            case 1:
              status = '<div class="status warning">소규모 문제발생</div>';
              nowdata_minor_ot_board = nowdata_minor_ot_board + `<article class="panel panel-warning"><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata_list['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata_list['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata_list['detail_board']['start_datetime'])}">${get_timeago(nowdata_list['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata_list['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata_list['sname']}</span></small></div></article>\n`;
              nowdata_minor_ot += 1;
              nowdata_list_minor_ot += 1;
              break;
            case 2:
              // Planned Maintenance는 진행 중일 때하고 예정하고 노출 위치가 다름!
              let saidtime = new Date(nowdata_list['detail_board']['start_datetime']).getTime();
              let nowtime = new Date().getTime();
              if (nowtime < saidtime) { // PLANNED
                status = '<div class="status primary">점검 예정됨</div>';
                nowdata_planned_mt_board = nowdata_planned_mt_board + `<article class="panel panel-primary"><div class="panel-heading icon"><i class="fa fa-info"></i></div><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata_list['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata_list['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata_list['detail_board']['start_datetime'])}">${get_timeago(nowdata_list['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata_list['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata_list['sname']}</span><span class="pull-right">종료 예정&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata_list['detail_board']['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata_list['detail_board']['end_datetime'])}">${get_timeago(nowdata_list['detail_board']['end_datetime'])}</time></span></small></div></article>`;
                nowdata_planned_mt += 1;
                nowdata_list_planned_mt += 1;
              } else {
                status = '<div class="status primary">예정된 점검 진행중</div>';
                nowdata_maintaining_mt_board = nowdata_maintaining_mt_board + `<article class="panel panel-primary"><div class="panel-heading clearfix"><h2 class="panel-title NanumGothic">${nowdata_list['detail_board']['title']}</h2><time class="pull-right timeago" datetime="${nowdata_list['detail_board']['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata_list['detail_board']['start_datetime'])}">${get_timeago(nowdata_list['detail_board']['start_datetime'])}</time></div><div class="panel-body">${nowdata_list['detail_board']['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata_list['sname']}</span><span class="pull-right">종료 예정&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata_list['detail_board']['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata_list['detail_board']['end_datetime'])}">${get_timeago(nowdata_list['detail_board']['end_datetime'])}</time></span></small></div></article>\n`;
                nowdata_maintaining_mt += 1;
                nowdata_list_maintaining_mt += 1;
              }
              break;
            case 3:
              status = '<div class="status success">온라인</div>';
              nowdata_online += 1;
              nowdata_list_online += 1;
              break;
          }
          services_lists_inf = services_lists_inf + `<div class="item clearfix" id="sv${nowdata_list_count}-minorSV${nowdata_list_count_minorSV}" style="display: ${categoryStyle_Display};"><div class="service">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="services" value="${nowdata_list['status']}" id="category-sv-${i}-${iiii}" style="margin-right: 5px; margin-left: -18px;"${selecton_off}><label for="category-sv-${i}-${iiii}">-&nbsp;${nowdata_list['sname']}</label></div>${status}</div>\n`;
          nowdata_list_count_minorSV += 1;
          iiii += 1;
          if (selecton_off === ' checked="checked"') {
            selecton_off = ''
          }
        });

        // 카테고리에서는 변수값이 제일 큰 놈만 보여줌
        // 20201216 온라인 서비스는 계산에서 제외
        if (nowdata_list_major_ot + nowdata_list_minor_ot + nowdata_list_maintaining_mt + nowdata_list_planned_mt === 0) {
          temp_str = `<div class="status success" id="sv${nowdata_list_count}-Majorstatus">${nowdata_list_online}개 온라인</div>`;
        } else {
          nowdata_list_max = Math.max(nowdata_list_major_ot, nowdata_list_minor_ot, nowdata_list_maintaining_mt, nowdata_list_planned_mt);
          switch (nowdata_list_max) {
            case nowdata_list_major_ot:
              temp_str = `<div class="status danger" id="sv${nowdata_list_count}-Majorstatus">${nowdata_list_major_ot}개의 대규모 문제발생</div>`;
              break;
            case nowdata_list_minor_ot:
              temp_str = `<div class="status warning" id="sv${nowdata_list_count}-Majorstatus">${nowdata_list_minor_ot}개의 소규모 문제발생</div>`;
              break;
            case nowdata_list_maintaining_mt:
              temp_str = `<div class="status primary" id="sv${nowdata_list_count}-Majorstatus">${nowdata_list_maintaining_mt}개의 점검 진행중</div>`;
              break;
            case nowdata_list_planned_mt:
              temp_str = `<div class="status primary" id="sv${nowdata_list_count}-Majorstatus">${nowdata_list_planned_mt}개의 점검 예정됨</div>`;
              break;
          }
        }
        current_services = current_services + `<div class="item clearfix" Onclick="ChangeThisCategory(${nowdata_list_count});" href="#"><div class="service" id="sv${nowdata_list_count}"><i id="sv${nowdata_list_count}-FAB" class="${categoryStyle_iTag}" data-toggle="tooltip" title="카테고리 열기/닫기" data-original-title="카테고리 열기/닫기"></i>&nbsp;${nowdata['sname']}</div>${temp_str}</div></div>\n` + services_lists_inf;
        nowdata_list_count += 1;
      }
    };

    // 상단 STATUS BAR 노출용 작업
    if ((nowdata_major_ot + nowdata_list_major_ot) !== 0) {
      status_board = status_board + `<div id="status-big" class="status danger">${nowdata_major_ot}개의 서비스에서 대규모 문제가 발생했습니다.</div>\n${nowdata_major_ot_board}\n`;
    }
    if ((nowdata_minor_ot + nowdata_list_minor_ot) !== 0) {
      status_board = status_board + `<div id="status-big" class="status warning">${nowdata_minor_ot}개의 서비스에서 소규모 문제가 발생했습니다.</div>\n${nowdata_minor_ot_board}\n`;
    }
    if ((nowdata_maintaining_mt + nowdata_list_maintaining_mt) !== 0) {
      status_board = status_board + `<div id="status-big" class="status primary">${nowdata_maintaining_mt}개의 서비스에서 예정된 점검이 진행중입니다.</div>\n${nowdata_maintaining_mt_board}\n`;
    }
    if ((nowdata_online + nowdata_list_online) !== 0) {
      status_board = status_board + `<div id="status-big" class="status success">${nowdata_online}개의 서비스가 현재 원활합니다.</div>\n<br />`;
    }

    // COVER
    document.getElementById("services_status").innerHTML=status_board;
    document.getElementById("services_all").innerHTML=current_services;

    // PLANNED MAINTENANCE
    if ((nowdata_planned_mt + nowdata_list_planned_mt) === 0) {
      document.getElementById("planned_maintenance").innerHTML='<div class="centered"><br />예정된 점검이 없습니다.</div>';
    } else {
      document.getElementById("planned_maintenance").innerHTML=nowdata_planned_mt_board;
    }
  });
  // 진행중인거, planned maintenance 불러오기 및 변수 저장 종료부

  // 타임라인 불러오기 및 변수 저장 시작부
  firebase.database().ref('/ended_board/').once('value').then(function(snapshot) {
    // 파베는 번호순으로 내림차순임!!!
    // 여기서 보드 변수 append는 '기존데이터 + 신규데이터' 가 아니라 '신규데이터 + 기존데이터' 여야 함!!!
    let nowdata;
    let tmp;
    let past_boards = '';
    let ObKeys = Object.keys(snapshot.val()); // 미친 얘는 왜 옵젝으로 주는데
    ObKeys.forEach(function (item) {
      nowdata = snapshot.val()[item];
      for (i = 1; i < nowdata.length; i++) {
        /*
          * -1 미선택 (받을 일 없음)
          * 0 대규모 문제
          * 1 소규모 문제
          * 2 예정 점검
          * 3 온라인
          */
        switch (nowdata[i]['status']) {
          case 0:
            tmp = `<article class="panel panel-danger"><div class="panel-heading icon"><i class="fa fa-times"></i></div><div class="panel-heading clearfix"><h2 class="panel-title">${nowdata[i]['title']}</h2><time class="pull-right timeago" datetime="${nowdata[i]['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['start_datetime'])}">${get_timeago(nowdata[i]['start_datetime'])}</time></div><div class="panel-body">${nowdata[i]['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata[i]['sname']}</span>&nbsp;<span class="pull-right">종료 시각&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata[i]['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['end_datetime'])}">${get_timeago(nowdata[i]['end_datetime'])}</time></span></small></div></article>`;
            break;
          case 1:
            tmp = `<article class="panel panel-warning"><div class="panel-heading icon"><i class="fa fa-exclamation"></i></div><div class="panel-heading clearfix"><h2 class="panel-title">${nowdata[i]['title']}</h2><time class="pull-right timeago" datetime="${nowdata[i]['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['start_datetime'])}">${get_timeago(nowdata[i]['start_datetime'])}</time></div><div class="panel-body">${nowdata[i]['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata[i]['sname']}</span>&nbsp;<span class="pull-right">종료 시각&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata[i]['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['end_datetime'])}">${get_timeago(nowdata[i]['end_datetime'])}</time></span></small></div></article>`;
            break;
          case 2:
            tmp = `<article class="panel panel-primary"><div class="panel-heading icon"><i class="fa fa-info"></i></div><div class="panel-heading clearfix"><h2 class="panel-title">${nowdata[i]['title']}</h2><time class="pull-right timeago" datetime="${nowdata[i]['start_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['start_datetime'])}">${get_timeago(nowdata[i]['start_datetime'])}</time></div><div class="panel-body">${nowdata[i]['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata[i]['sname']}</span>&nbsp;<span class="pull-right">종료 시각&nbsp;:&nbsp;<time class="pull-right timeago" datetime="${nowdata[i]['end_datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['end_datetime'])}">${get_timeago(nowdata[i]['end_datetime'])}</time></span></small></div></article>`;
            break;
          case 3:
            if (nowdata[i]['title'] == "표시 할 내용이 없습니다") {
              tmp = '';
              break;
            }
            tmp = `<article class="panel panel-success"><div class="panel-heading icon"><i class="fa fa-check"></i></div><div class="panel-heading clearfix"><h2 class="panel-title">${nowdata[i]['title']}</h2><time class="pull-right timeago" datetime="${nowdata[i]['datetime']}" data-toggle="tooltip" title="${returntimeformat(nowdata[i]['datetime'])}">${get_timeago(nowdata[i]['datetime'])}</time></div><div class="panel-body">${nowdata[i]['descript']}</div><div class="panel-footer clearfix"><small>대상 서비스 : <span class="label label-default">${nowdata[i]['sname']}</span>&nbsp;</small></div></article>`;
            break;
        }
        past_boards = tmp + '\n' + past_boards;
      }
    });
    past_boards = past_boards + `<div class="centered"><br />더 이상 출력할 내용이 없습니다.<br />서버 사정에 따라 제일 오래된 기록부터 지워질 수도 있습니다.</div>`;

    document.getElementById("past_boards").innerHTML=past_boards;

    // Tooltip 스크립트 작용
    $('[data-toggle="tooltip"]').tooltip();
  });
  // 타임라인 불러오기 및 변수 저장 종료부
}

// 상태 업데이트
function onsubmitt() {
  // we stoped it
  event.preventDefault();

  let radios = document.getElementsByName('services');
  let serv_path;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      serv_path = radios[i].id;
      break;
    }
  }
  if (serv_path.startsWith("category-sv-")) {
    serv_path = serv_path.replace("category-sv-", '');
    serv_path = serv_path.replace("-", '/list/');
    serv_path = serv_path.split("/list/");
    serv_path = `${serv_path[0]}/list/${parseInt(serv_path[1]) + 1}`
  } else {
    serv_path = serv_path.replace("non-category-sv-", '')
  }
  let svtitle = $('#title').val();
  let sel = $('#type option:selected').val();
  let tz;
  let ststst = new Date($('#st_time').val());
  let ededed = new Date($('#ed_time').val());
  let tdtdtd = new Date();

  let description_html = $('#description').summernote('code');
  let description_markdown = turndownService.turndown(description_html);

  tz = tdtdtd.toString().split(' (')[0].split(" ");
  tz = tz[tz.length-1].replace("GMT", '');

  ststst = `${ststst.getFullYear()}-${("0" + (parseInt(ststst.getMonth())+1)).slice(-2)}-${("0" + (ststst.getDate())).slice(-2)}T${("0" + (ststst.getHours())).slice(-2)}:${("0" + (ststst.getMinutes())).slice(-2)}:00${tz}`;
  ededed = `${ededed.getFullYear()}-${("0" + (parseInt(ededed.getMonth())+1)).slice(-2)}-${("0" + (ededed.getDate())).slice(-2)}T${("0" + (ededed.getHours())).slice(-2)}:${("0" + (ededed.getMinutes())).slice(-2)}:00${tz}`;

  firebase.database().ref(`/services/${serv_path}`).once('value').then(function(snapshot) {
    let old_data = snapshot.val();
    // 2020-06-24 alert에서 SweetAlert2로 바꿈
    if (sel < 3 && old_data['status'] < 3) { // 무조건 down/maintenance -> online 가야함!
      //alert('선택하신 서비스는 온라인 상태가 아닙니다.\n서비스를 온라인으로 변경하고 다시 시도 해 주세요.');
      Swal.fire({
        icon: 'warning',
        title: '올바르지 않은 형식입니다.',
        html: '선택하신 서비스는 온라인 상태가 아닙니다.<br/>서비스를 온라인으로 변경하고 다시 시도 해 주세요.'
      });
      return;
    }

    if (sel == old_data['status']) { // 현재 status하고 바꿀 status하고 같을 경우
      //alert('현재 상태와 선택하신 상태가 동일합니다.');
      Swal.fire({
        icon: 'warning',
        title: '올바르지 않은 형식입니다.',
        html: '현재 상태와 선택하신 상태가 동일합니다.'
      });
      return;
    }

    if (sel == 2 && ededed == "Invalid Date") {
      //alert('예정 종료시간을 입력하세요.');
      Swal.fire({
        icon: 'warning',
        title: '올바르지 않은 형식입니다.',
        html: '예정 종료시간을 입력하세요.'
      });
      return;
    }

    if (sel == 2 && ststst == ededed) {
      //alert('시작 시간과 종료 시간은 같을 수 없습니다.');
      Swal.fire({
        icon: 'warning',
        title: '올바르지 않은 형식입니다.',
        html: '시작 시간과 종료 시간은 같을 수 없습니다.'
      });
      return;
    }

    /*firebase.database().ref('services/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });*/

    switch (sel) {
      case '0':
        // 대규모
        firebase.database().ref(`/services/${serv_path}`).set({
          "sname": `${snapshot.val()['sname']}`,
          "status": 0,
          "detail_board": {
            "descript":description_html,
            "start_datetime":ststst,
            "status":0,
            "title":svtitle
          }
        }, function (error) {
          if (error != null) {
            if (error.indexOf("Uncaught TypeError: Cannot read property") != -1) { // 이거 왜뜨는거
              console.log(error);
            } else {
              //alert("작업 도중 문제가 발생했습니다.");
              Swal.fire({
                icon: 'error',
                title: '정의되지 않은 오류입니다.',
                text: '관리팀에 문의 해 주세요.',
                footer: `${error}`
              });
              wa_sans(0);
              //throw error;
              console.log(error);
              return;
            }
          } else {
            //alert("성공적으로 상태를 변경했습니다.\n디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.");
            Swal.fire({
              icon: 'success',
              title: '성공적으로 상태를 변경했습니다.',
              text: '디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.'
            });
            reset_forms();
            wa_sans(0);
            //return;
          }
        });
        break;
      case '1':
        // 소규모
        firebase.database().ref(`/services/${serv_path}`).set({
          "sname": `${snapshot.val()['sname']}`,
          "status": 1,
          "detail_board": {
            "descript":description_html,
            "start_datetime":ststst,
            "status":1,
            "title":svtitle
          }
        }, function (error) {
          if (error != null) {
            if (error.indexOf("Uncaught TypeError: Cannot read property") != -1) { // 이거 왜뜨는거
              console.log(error);
            } else {
              //alert("작업 도중 문제가 발생했습니다.");
              Swal.fire({
                icon: 'error',
                title: '정의되지 않은 오류입니다.',
                text: '관리팀에 문의 해 주세요.',
                footer: `${error}`
              });
              wa_sans(0);
              //throw error;
              console.log(error);
              return;
            }
          } else {
            //alert("성공적으로 상태를 변경했습니다.\n디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.");
            Swal.fire({
              icon: 'success',
              title: '성공적으로 상태를 변경했습니다.',
              text: '디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.'
            });
            reset_forms();
            wa_sans(0);
            //return;
          }
        });
        break;
      case '2':
        // planned
        firebase.database().ref(`/services/${serv_path}`).set({
          "sname": `${snapshot.val()['sname']}`,
          "status": 2,
          "detail_board": {
            "descript":description_html,
            "start_datetime":ststst,
            "end_datetime":ededed,
            "status":2,
            "title":svtitle
          }
        }, function (error) {
          if (error != null) {
            if (error.indexOf("Uncaught TypeError: Cannot read property") != -1) { // 이거 왜뜨는거
              console.log(error);
            } else {
              //alert("작업 도중 문제가 발생했습니다.");
              Swal.fire({
                icon: 'error',
                title: '정의되지 않은 오류입니다.',
                text: '관리팀에 문의 해 주세요.',
                footer: `${error}`
              });
              wa_sans(0);
              //throw error;
              console.log(error);
              return;
            }
          } else {
            //alert("성공적으로 상태를 변경했습니다.\n디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.");
            Swal.fire({
              icon: 'success',
              title: '성공적으로 상태를 변경했습니다.',
              text: '디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.'
            });
            reset_forms();
            wa_sans(0);
            //return;
          }
        });
        break;
      case '3':
        // online
        // 얘는 기존 보드를 past로 넘겨줘야함
        firebase.database().ref(`/services/${serv_path}`).set({
          "sname": `${snapshot.val()['sname']}`,
          "status": 3
        }, function (error) {
          if (error != null) {
            if (error.indexOf("Uncaught TypeError: Cannot read property") != -1) { // 이거 왜뜨는거
              console.log(error);
            } else {
              //alert("작업 도중 문제가 발생했습니다.");
              Swal.fire({
                icon: 'error',
                title: '정의되지 않은 오류입니다.',
                text: '관리팀에 문의 해 주세요.',
                footer: `${error}`
              });
              wa_sans(0);
              //throw error;
              console.log(error);
              return;
            }
          }
        });
        firebase.database().ref(`/ended_board/${tdtdtd.getFullYear()}${("0" + (parseInt(tdtdtd.getMonth())+1)).slice(-2)}${("0" + (tdtdtd.getDate())).slice(-2)}`).once('value').then(function (past_snapshot) {
          if (past_snapshot.val() == null) {
            firebase.database().ref(`/ended_board/${tdtdtd.getFullYear()}${("0" + (parseInt(tdtdtd.getMonth())+1)).slice(-2)}${("0" + (tdtdtd.getDate())).slice(-2)}`).set([
              null, {
                "start_datetime": old_data['detail_board']['start_datetime'],
                "end_datetime": ststst,
                "descript":old_data['detail_board']['descript'],
                "sname":old_data['sname'],
                "status":old_data['status'],
                "title":old_data['detail_board']['title']
              }, {
                "datetime": ststst,
                "descript":description_html,
                "sname":old_data['sname'],
                "status":3,
                "title":svtitle
              }
            ], function (error) {
              if (!error) {
                //alert("성공적으로 상태를 변경했습니다.\n디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.");
                Swal.fire({
                  icon: 'success',
                  title: '성공적으로 상태를 변경했습니다.',
                  text: '디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.'
                });
                reset_forms();
                wa_sans(0);
                //return;
              } else {
                //alert("작업 도중 문제가 발생했습니다.");
                Swal.fire({
                  icon: 'error',
                  title: '정의되지 않은 오류입니다.',
                  text: '관리팀에 문의 해 주세요.',
                  footer: `${error}`
                });
                wa_sans(0);
                //throw error;
                console.log(error);
                return;
              }
            });
          } else {
            let afterDB = snapshot.val();
            afterDB[afterDB.length] = {
              "start_datetime": old_data['detail_board']['start_datetime'],
              "end_datetime": ststst,
              "descript":old_data['detail_board']['descript'],
              "sname":old_data['sname'],
              "status":old_data['status'],
              "title":old_data['detail_board']['title']
            };

            afterDB[afterDB.length] = {
              "datetime": ststst,
              "descript":description_html,
              "sname":old_data['sname'],
              "status":3,
              "title":svtitle
            };

            firebase.database().ref(`/ended_board/${tdtdtd.getFullYear()}${("0" + (parseInt(tdtdtd.getMonth())+1)).slice(-2)}${("0" + (tdtdtd.getDate())).slice(-2)}`).set(JSON.parse(JSON.stringify(afterDB)), function (error) {
              if (!error) {
                //alert("성공적으로 상태를 변경했습니다.\n디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.");
                Swal.fire({
                  icon: 'success',
                  title: '성공적으로 상태를 변경했습니다.',
                  text: '디스코드에 메시지가 전송 될 때까지 잠시만 기다려 주세요.'
                });
                reset_forms();
                wa_sans(0);
                //return;
              } else {
                //alert("작업 도중 문제가 발생했습니다.");
                Swal.fire({
                  icon: 'error',
                  title: '정의되지 않은 오류입니다.',
                  text: '관리팀에 문의 해 주세요.',
                  footer: `${error}`
                });
                wa_sans(0);
                //throw error;
                console.log(error);
                return;
              }
            });

          }
        });
        //break;
    }

    // API에 데이터 전송 (발신 요청)
    let ServiceTitle = `${snapshot.val()['sname']}`,
        FieldTitle = `${svtitle}`,
        FieldInfo = `${description_markdown}`,
        starttime = `${get_timeago(ststst)} (\`${returntimeformat(ststst)}\`)`,
        endtime = `${get_timeago(ededed)} (\`${returntimeformat(ededed)}\`)`,
        timestamp = `${tdtdtd}`;

    $.post(`https://develable-status-backend.herokuapp.com/${pageType}/api/v1/Board/SendDiscord`, {type: sel, ServiceTitle, FieldInfo, FieldTitle, starttime, endtime, timestamp})
      .done(function (data) {
        //alert("성공적으로 디스코드에 메시지를 전송했습니다.");
        let returned = JSON.stringify(data);
        if (returned['request'] === 'fail' || returned['send'] === 'fail') {
          Toast.fire({
            icon: 'error',
            title: '디스코드에 메시지를 전송하지 못하였습니다.'
          })
          throw `${data}`;
        } else {
          Toast.fire({
            icon: 'success',
            title: '성공적으로 디스코드에 메시지를 전송했습니다.'
          })
          return true;
        }
      })
      .fail(function (XMLHttpRequest, status, error) {
        //alert("디스코드에 메시지 전송 도중 문제가 발생했습니다.");
        Toast.fire({
          icon: 'error',
          title: '디스코드에 메시지를 전송하지 못하였습니다.'
        })
        throw `${status} :: ${error}`;
      });
  });
}

// FBinit 끝났는지 확인 후 접근 가능 여부 체크하고 Init
function check() {
  if (($("input:checkbox[name=init_finished]").is(":checked"))) {
    if (($("input:checkbox[name=access_allow]").is(":checked"))) {
      pageType = $('#page_type').val();
      // 세션변경
      firebase.auth().onAuthStateChanged(function(user) {
        if (user == null) {
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            console.log(error);
          });
          location.href = escape('./login');
          throw 'session invaild';
        }
        if (!user.emailVerified) {
          location.href = escape('./login');
          throw 'not verified';
        }

        firebase.database().ref(`/usrinfo/${user.uid}/`).once('value').then(function(snapshot) {
          let filter = "win16|win32|win64|mac";
          if (navigator.platform) {
            if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
              // 모바일
              document.getElementById("acinf").innerHTML=`<h1 class="NanumSquareB">관리자 페이지 > 대시보드</h1><h4><b>${snapshot.val()}</b> 님으로 로그인 하셨습니다.</h4><h5><a href="javascript:void(0);" OnClick="resetpw();">비밀번호 재설정</a></h5><h5><a href="javascript:void(0);" OnClick="logout();">로그아웃</a></h5>`;
            } else {
              // PC
              document.getElementById("acinf").innerHTML=`<h1 class="NanumSquareB">관리자 페이지 > 대시보드</h1><h4><b>${snapshot.val()}</b> 님으로 로그인 하셨습니다.</h4><h5><a href="javascript:void(0);" OnClick="resetpw();">비밀번호 재설정</a></h5>`;
              nav_logout.style.display = 'block';
            }
          }
          bef.style.display = 'none';
          aft.style.display = 'block';
        });
      });
      let cyc = 0;
      wa_sans(cyc);
      let tnow = new Date();
      document.getElementById("titttttle").innerHTML=`<h2 class="NanumSquareB">서비스 현황</h2><h4><code>${tnow.getFullYear()}/${("0" + (parseInt(tnow.getMonth())+1)).slice(-2)}/${("0" + (tnow.getDate())).slice(-2)} ${("0" + (tnow.getHours())).slice(-2)}:${("0" + (tnow.getMinutes())).slice(-2)}:${("0" + (tnow.getSeconds())).slice(-2)}</code>에 데이터를 불러왔습니다.</h4><h5>1분 주기로 새 데이터를 불러옵니다.</h5><br />`;
      let timeloop = setInterval(function() {
        cyc += 1;
        wa_sans(cyc);
        tnow = new Date();
        document.getElementById("titttttle").innerHTML=`<h2 class="NanumSquareB">서비스 현황</h2><h4><code>${tnow.getFullYear()}/${("0" + (parseInt(tnow.getMonth())+1)).slice(-2)}/${("0" + (tnow.getDate())).slice(-2)} ${("0" + (tnow.getHours())).slice(-2)}:${("0" + (tnow.getMinutes())).slice(-2)}:${("0" + (tnow.getSeconds())).slice(-2)}</code>에 데이터를 불러왔습니다.</h4><h5>1분 주기로 새 데이터를 불러옵니다.</h5><br />`;
      }, 60000);
    } else {
      document.getElementById('controller').innerHTML = '<!-- Disabled -->';
      throw 'expected';
    }
  } else {
    setTimeout(check, 1000); // check again in a second
  }
}
check()