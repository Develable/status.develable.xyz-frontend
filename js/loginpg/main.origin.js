/*!
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 *
 * Copyright 2018-2021 Develable.
 */

// 접속 가능 여부 확인
function check() {
  if (($("input:checkbox[name=init_finished]").is(":checked"))) {
    if (($("input:checkbox[name=access_allow]").is(":checked"))) {
      pageType = $('#page_type').val();
      // 로그인 상태에는 이메일 인증 상태 검증하고 바로 대시보드로
      firebase.auth().onAuthStateChanged(function(user) {
        // 일단 그 전에 캡차 사용 여부 확인
        firebase.database().ref('/Session').once('value').then(function(snapshot) {
          // snapshot.val() -> Object
          if (! snapshot.val()['UseCaptcha']) {
            loginalert_recaptcha_disabled.style.display = 'block';
          }
          if (user == null) {
            // Form Init
            $("input:checkbox[id='session_login_init_finished']").prop("checked", true);
            loginalert_loading.style.display = 'none';
            loginalert_default.style.display = 'block';
            forrrrrm.style.display = 'block';
            throw null;
          }
          if ($("input:checkbox[name=session_login_init_finished]").is(":checked")) { // 20201217 중복 방지
            throw null;
          }
          if (!user.emailVerified) {
            user.sendEmailVerification().then(function(){
              Swal.fire({
                icon: 'warning',
                title: '이메일 인증이 필요합니다.',
                text: '메일함을 확인하세요.'
              });
              document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-warning">이메일이 인증 되지 않은 계정입니다.<br />메일함을 확인하세요.</p>';
              loginalert_loading.style.display = 'none';
              loginalert_danger.style.display = 'block';
              firebase.auth().signOut().then(function() {
                // Sign-out successful.
                forrrrrm.style.display = 'block';
              }).catch(function(error) {
                alert(error);
              });
            }).catch(function(error) {
              if (error.code == "auth/too-many-requests") {
                Swal.fire({
                  icon: 'error',
                  title: '메일 발송에 실패하였습니다.',
                  text: '유효한 이메일인지 다시 한번 확인 해 주세요.',
                  footer: `${error.code} :: ${error.message}`
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '정의되지 않은 오류입니다.',
                  text: '관리팀에 문의 해 주세요.',
                  footer: `${error.code} :: ${error.message}`
                });
              }
              firebase.auth().signOut().then(function() {
                // Sign-out successful.
                // Form Init
                loginalert_loading.style.display = 'none';
                forrrrrm.style.display = 'block';
              }).catch(function(error) {
                alert(error);
              });
            });
          } else {
            document.getElementById("loginalert_success").innerHTML='<p class="alert alert-success">이미 로그인 되어 있습니다. 잠시 후 이동됩니다.</p>';
            loginalert_loading.style.display = 'none';
            loginalert_success.style.display = 'block';
            location.href = escape('./../');
          }
        });
      });
    } else {
      document.getElementById('controller').innerHTML = '<!-- Disabled -->';
      throw 'expected';
    }
  } else {
    setTimeout(check, 1000); // check again in a second
  }
}
check()

// when form is submit
//$('#login_form').submit(function () { // 이벤트 감지 -> 함수 호출로 변경
function onsubmitt() {
  document.getElementById("loginalert_loading").innerHTML='<p class="alert alert-info">reCAPTCHA 값을 검증하고 있습니다.<br />검증이 완료된 후 로그인을 시도합니다.</p>';
  loginalert_danger.style.display = 'none';
  loginalert_default.style.display = 'none';
  forrrrrm.style.display = 'none';
  loginalert_loading.style.display = 'block';

  // we stoped it
  event.preventDefault();

  // 우선적으로 로컬에서 캡차 인증
  let KEY = grecaptcha.getResponse();
  if (KEY === "") KEY = "NULL";
  if (KEY === "NULL" && loginalert_recaptcha_disabled.style.display === "none"){
    Swal.fire({
      icon: 'error',
      title: '인증이 필요합니다.',
      text: '\'로봇이 아닙니다\'를 클릭하세요.'
    });
    document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-danger">\'로봇이 아닙니다\'를 클릭하세요.</p>';
    loginalert_loading.style.display = 'none';
    loginalert_danger.style.display = 'block';
    forrrrrm.style.display = 'block';
    return;
  }

  // 2차적으로 API에 요청 및 DB에서 검증
  $.ajax({
    type: "POST",
    url: `https://develable-status-backend.herokuapp.com/${pageType}/api/v1/Auth/reCAPTCHA/validCheck`,
    data: {key: KEY},
    success: function(data) {
      //console.log(data);
      if (! data['reCAPTCHA']['success'] && loginalert_recaptcha_disabled.style.display === "none") { // 캡차 오류
        Swal.fire({
          icon: 'error',
          title: '인증에 실패했습니다.',
          text: 'reCAPTCHA 인증에 실패했습니다.'
        });
        grecaptcha.reset();
        document.getElementById("loginalert_danger").innerHTML=`<p class="alert alert-danger">reCAPTCHA 인증에 실패했습니다.<br />${data['reCAPTCHA']['code']}</p>`;
        loginalert_loading.style.display = 'none';
        loginalert_danger.style.display = 'block';
        forrrrrm.style.display = 'block';
        return;
      }
      if (! data['Firebase'] && loginalert_recaptcha_disabled.style.display === "none") { // DB 등록 오류
        Swal.fire({
          icon: 'error',
          title: '처리에 실패했습니다.',
          text: 'DB에 세션 데이터를 등록하지 못했습니다.'
        });
        grecaptcha.reset();
        document.getElementById("loginalert_danger").innerHTML=`<p class="alert alert-danger">DB 처리 과정에서 문제가 발생했습니다.<br />${data['Firebase']['code']}</p>`;
        loginalert_loading.style.display = 'none';
        loginalert_danger.style.display = 'block';
        forrrrrm.style.display = 'block';
        return;
      }
      firebase.database().ref('/Session').once('value').then(function(snapshot) {
        // snapshot.val() -> Object
        let html_captcha_use = false;
        if (loginalert_recaptcha_disabled.style.display === "none") {
          html_captcha_use = true
        }
        if (!(snapshot.val()['UseCaptcha'] === html_captcha_use)) { // DB하고 HTML하고 안맞으면
          Swal.fire({
            icon: 'error',
            title: '오류가 발생했습니다.',
            text: '새로고침을 진행 해 주세요.'
          });
          grecaptcha.reset();
          document.getElementById("loginalert_danger").innerHTML=`<p class="alert alert-danger">데이터 값이 일치하지 않습니다.<br />새로고침을 진행 해 주세요.</p>`;
          loginalert_loading.style.display = 'none';
          loginalert_danger.style.display = 'block';
          return;
        }
        if (snapshot.val()[KEY] || loginalert_recaptcha_disabled.style.display === "block") {
          document.getElementById("loginalert_loading").innerHTML='<p class="alert alert-info">서버와 통신 중 입니다. 잠시만 기다리세요.</p>';
          let status = 1;
          let session_type;

          let email = $('#email').val();
          let password = $("#password").val();
          let remember = $("#remember").is(":checked");

          /* 세션 유지방법 두개임
            * firebase.auth.Auth.Persistence.SESSION :: 세션 닫으면 로그인 증발
            * firebase.auth.Auth.Persistence.LOCAL :: 로그인 기억
            */

          if (remember) {
            session_type = firebase.auth.Auth.Persistence.LOCAL;
          } else {
            session_type = firebase.auth.Auth.Persistence.SESSION;
          }

          firebase.auth().setPersistence(session_type).then(function () { // 로그인 기억 활성 경우 얘 주석 해제
                                                                          // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () { // 로그인 기억 비활경우 얘 주석 해제
            return firebase.auth().signInWithEmailAndPassword(email, password);
          }).catch(function (error) {
            status = 0;
            loginalert_loading.style.display = 'none';

            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;

            if (errorCode == "auth/user-not-found" || errorCode == "auth/wrong-password") {
              Swal.fire({
                icon: 'error',
                title: '계정 인증에 실패하였습니다.',
                text: 'ID와 비밀번호가 정확한지 다시 한번 확인 해 주세요.'
              });
              grecaptcha.reset();
              document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-danger">ID 또는 비밀번호가 잘못되었습니다.</p>';
            } else if (errorCode == "auth/user-disabled") {
              Swal.fire({
                icon: 'error',
                title: '비활성 처리된 계정입니다.',
                text: '관리팀에 문의 해 주세요.'
              });
              grecaptcha.reset();
              document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-danger">비활성화 된 계정입니다.</p>';
            } else if (errorCode == "auth/network-request-failed" || errorCode == "auth/too-many-requests") {
              Swal.fire({
                icon: 'question',
                title: '통신에 실패하였습니다.',
                text: '인터넷 연결을 확인하세요.'
              });
              grecaptcha.reset();
              document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-danger">통신에 실패했습니다.</p>';
            } else {
              Swal.fire({
                icon: 'error',
                title: '정의되지 않은 오류입니다.',
                text: '관리팀에 문의 해 주세요.',
                footer: `${errorCode} :: ${errorMessage}`
              });
              grecaptcha.reset();
              console.log(errorCode);
              console.log(errorMessage);
              document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-danger">정의되지 않은 오류입니다.</p>';
            }

            document.getElementById("password").value = '';
            loginalert_danger.style.display = 'block';
            forrrrrm.style.display = 'block';
          }).then(function () {
            if (!status) {return;}
            let user = firebase.auth().currentUser;
            if (!user.emailVerified) {
              user.sendEmailVerification().then(function(){
                Swal.fire({
                  icon: 'warning',
                  title: '이메일 인증이 필요합니다.',
                  text: '메일함을 확인하세요.'
                });
                grecaptcha.reset();
                document.getElementById("loginalert_danger").innerHTML='<p class="alert alert-warning">이메일이 인증 되지 않은 계정입니다.<br />메일함을 확인하세요.</p>';
                loginalert_loading.style.display = 'none';
                loginalert_danger.style.display = 'block';
                firebase.auth().signOut().then(function() {
                  // Sign-out successful.
                  document.getElementById("password").value = '';
                  forrrrrm.style.display = 'block';
                }).catch(function(error) {
                  alert(error);
                });
              }).catch(function(error) {
                if (error.code == "auth/too-many-requests") {
                  Swal.fire({
                    icon: 'error',
                    title: '인증 메일 발송에 실패하였습니다.',
                    text: '유효한 이메일인지 다시 한번 확인 해 주세요.',
                    footer: `${error.code} :: ${error.message}`
                  });
                  grecaptcha.reset();
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: '정의되지 않은 오류입니다.',
                    text: '관리팀에 문의 해 주세요.',
                    footer: `${error.code} :: ${error.message}`
                  });
                  grecaptcha.reset();
                }
                firebase.auth().signOut().then(function() {
                  // Sign-out successful.
                  document.getElementById("password").value = '';
                  forrrrrm.style.display = 'block';
                }).catch(function(error) {
                  alert(error);
                });
              });
            } else {
              firebase.database().ref('/Session/' + KEY).remove();
              Swal.fire({
                icon: 'success',
                title: '성공적으로 로그인 하였습니다!',
                text: '잠시만 기다려 주세요. 관리자 페이지로 이동합니다.',
                showConfirmButton: false,
              });
              loginalert_loading.style.display = 'none';
              loginalert_success.style.display = 'block';
              setTimeout(function(){
                location.href = escape('./../');
              }, 1300);
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '처리에 실패했습니다.',
            text: '잘못된 접근입니다.'
          });
          grecaptcha.reset();
          document.getElementById("loginalert_danger").innerHTML = `<p class="alert alert-danger">잘못된 접근입니다.<br />${snapshot.val()[KEY]}</p>`;
          loginalert_loading.style.display = 'none';
          loginalert_danger.style.display = 'block';
          forrrrrm.style.display = 'block';
          return;
        }
      });
    },
    error: function(XMLHttpRequest, status, error) {
      Swal.fire({
          icon: 'error',
          title: 'API 연결에 실패했습니다.',
          html: '이 문제가 지속되면 <a href="https://invite.gg/Develable">공식 서버</a>에 알려주세요.',
          footer: `${status} : ${error}`
      });
      grecaptcha.reset();
      document.getElementById("loginalert_danger").innerHTML = `<p class="alert alert-danger">API 연결에 실패했습니다.</p>`;
      loginalert_loading.style.display = 'none';
      loginalert_danger.style.display = 'block';
      forrrrrm.style.display = 'block';
      return;
    }
  });
}