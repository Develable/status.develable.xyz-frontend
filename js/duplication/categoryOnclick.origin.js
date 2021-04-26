/*!
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 *
 * Copyright 2018-2021 Develable.
 */

function isCategoryOpened(num) {
    let svFAB = $(`#sv${num}-FAB`);
    if (svFAB === undefined) return false;

    if (svFAB.hasClass("fas fa-chevron-right")) { // Dropdown 닫혔을 때
        return false;
    } else {
        return true;
    }

}

// 카테고리 열기 / 닫기
function ChangeThisCategory(num) {
    let svFAB = $(`#sv${num}-FAB`);
    if (svFAB === undefined) return false;

    let Loop = true;
    let LoopCount = 0;
    let LoopTag;
    let svMajorStatus = document.getElementById(`sv${num}-Majorstatus`);
    let svMajor = document.getElementById(`sv${num}`);

    if (isCategoryOpened(num)) { // Dropdown 열렸을 때 (Dropdown 닫아줘야함!)
        while (Loop) {
            if ($(`#sv${num}-minorSV${LoopCount}`).hasClass("item clearfix")) {
                LoopTag = document.getElementById(`sv${num}-minorSV${LoopCount}`);
                LoopTag.style.display = "none";
                LoopCount += 1;
            } else {
                Loop = false;
            }
        }
        svFAB.attr('class','fas fa-chevron-right');
        svMajorStatus.style.display = "block";
        svMajor.style.marginLeft = "0px";
    } else {
        while (Loop) {
            if ($(`#sv${num}-minorSV${LoopCount}`).hasClass("item clearfix")) {
                LoopTag = document.getElementById(`sv${num}-minorSV${LoopCount}`);
                LoopTag.style.display = "block";
                LoopCount += 1;
            } else {
                Loop = false;
            }
        }
        svFAB.attr('class','fas fa-chevron-down');
        svMajorStatus.style.display = "none";
        svMajor.style.marginLeft = "-5px";
    }
}