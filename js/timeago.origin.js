/*! 
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 * 
 * Copyright 2018-2021 Develable.
 */

function get_timeago(datetime) {
    let now = new Date();
    //console.log(now);

    let receiveTime = new Date(datetime);
    //console.log(datetime);

    let return_str;
    let diff;
    //현재 년도랑 글쓴시간의 년도 비교
    if (now.getFullYear() > receiveTime.getFullYear()){
        diff = now.getFullYear()-receiveTime.getFullYear();
        return_str = `${diff}년 전`;
    } else if (now.getMonth() > receiveTime.getMonth()){
        diff= now.getMonth()-receiveTime.getMonth();
        return_str = `${diff}달 전`;
    } else if (now.getDate() > receiveTime.getDate()){
        diff= now.getDate()-receiveTime.getDate();
        return_str = `${diff}일 전`;
    } else if (now.getDate() === receiveTime.getDate()) { // 당일
        let nowTimeInt = now.getTime();
        let receiveTimeInt = receiveTime.getTime();
        if (nowTimeInt > receiveTimeInt){
            //시간을 비교
            sec =parseInt(nowTimeInt - receiveTimeInt) / 1000;
            day  = parseInt(sec/60/60/24);
            sec = (sec - (day * 60 * 60 * 24));
            hour = parseInt(sec/60/60);
            sec = (sec - (hour*60*60));
            min = parseInt(sec/60);
            sec = parseInt(sec-(min*60));
            if (hour>0){
                //몇시간전인지
                document.getElementsByClassName("sub")[0].innerHTML = hour+"시간 전";
                console.log(hour+"시간 전");
            } else if (min>0){
                //몇분전인지
                document.getElementsByClassName("sub")[0].innerHTML = min+"분 전";
                console.log(min+"분 전");
            } else if (sec>0){
                //몇초전인지 계산
                document.getElementsByClassName("sub")[0].innerHTML = sec+"초 전";
                console.log(sec+"초 전");
            }
        }
    }

    console.log(return_str)

    let diffyear = (now.getFullYear() > receiveTime.getFullYear() ? (`${now.getFullYear() - receiveTime.getFullYear()}년 전`) : (now.getFullYear() == receiveTime.getFullYear() ? ('null') : (`${receiveTime.getFullYear() - now.getFullYear()}년 후`)));
    let diffmonth = (now.getMonth() > receiveTime.getMonth() ? (`${now.getMonth() - receiveTime.getMonth()}개월 전`) : (now.getMonth() == receiveTime.getMonth() ? ('null') : (`${receiveTime.getMonth() - now.getMonth()}개월 후`)));
    let diffdate = (now.getDate() > receiveTime.getDate() ? (`${now.getDate() - receiveTime.getDate()}일 전`) : (now.getDate() == receiveTime.getDate() ? ('null') : (`${receiveTime.getDate() - now.getDate()}일 후`)));
    let diffhour = (now.getHours() > receiveTime.getHours() ? (`${now.getHours() - receiveTime.getHours()}시간 전`) : (now.getHours() == receiveTime.getHours() ? ('null') : (`${receiveTime.getHours() - now.getHours()}시간 후`)));
    let diffmin = (now.getMinutes() > receiveTime.getMinutes() ? (`${now.getMinutes() - receiveTime.getMinutes()}분 전`) : (now.getMinutes() == receiveTime.getMinutes() ? ('null') : (`${receiveTime.getMinutes() - now.getMinutes()}분 후`)));

    if (diffyear != 'null') return diffyear;
    else if (diffmonth != 'null') return diffmonth;
    else if (diffdate != 'null') return diffdate;
    else if (diffhour != 'null') return diffhour;
    else if (diffmin != 'null') return diffmin;
    else return (now.getMinutes() > receiveTime.getMinutes() ? (`방금 막`) : (now.getMinutes() == receiveTime.getMinutes() ? ('지금') : (`잠시 후`)));
}

function returntimeformat(datetime) {
    let fdt = new Date(datetime)
    let ftd = new Date();
    tz = ftd.toString().split(' (')[0].split(" ")
    tz = tz[tz.length-1].replace("GMT", '')
    tz = `${tz.slice(0, 3)}:${tz.slice(3)}`
    return `${fdt.getFullYear()}-${("0" + (parseInt(fdt.getMonth())+1)).slice(-2)}-${("0" + (fdt.getDate())).slice(-2)} ${("0" + (fdt.getHours())).slice(-2)}:${("0" + (fdt.getMinutes())).slice(-2)}:00 (${tz})`;
}
