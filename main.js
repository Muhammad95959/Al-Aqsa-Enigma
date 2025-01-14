var rules = document.querySelector(".rules");
var rulesCloseBtn = document.querySelector(".rules .closeBtn");
var movesSpan = document.querySelector(".moves .number");
var timeSpan = document.querySelector(".time .number");
var sides = document.querySelectorAll('div[class^="side"]');
var playAgainBtn = document.querySelector(".play-again");
var sideSize = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--size"));
var timeInterval;
var topBlock;
var moves = 0;
var time = 0;
var startX = 0, startY = 0, newX = 0, newY = 0;
if (window.localStorage.getItem("dontShowRules") === "true")
    rules.remove();
rulesCloseBtn.addEventListener("click", function () {
    var dontShowState = document.querySelector(".rules input")
        .checked;
    if (dontShowState) {
        window.localStorage.setItem("dontShowRules", "true");
    }
    rules.remove();
});
sides.forEach(function (side) {
    side.addEventListener("mousedown", mouseDown);
    side.addEventListener("touchstart", touchStart);
});
function mouseDown(ev) {
    var target = ev.target;
    var parent = target.parentElement;
    var isHoveringTheBase = false;
    if (parent)
        isHoveringTheBase = ev.clientY > parent.offsetTop + sideSize - sideSize / 7;
    if (parent && parent.children.length > 1 && !isHoveringTheBase) {
        topBlock = parent === null || parent === void 0 ? void 0 : parent.firstElementChild;
        startX = ev.clientX;
        startY = ev.clientY;
        var width = parseFloat(window.getComputedStyle(topBlock).width);
        topBlock.style.left = startX - width / 2 + "px";
        var height = parseFloat(window.getComputedStyle(topBlock).height);
        topBlock.style.top = startY - height / 2 + "px";
        document.addEventListener("mousemove", mouseMoveWrapper);
        document.addEventListener("mouseup", mouseUpWrapper);
    }
}
function touchStart(ev) {
    var target = ev.target;
    var parent = target.parentElement;
    var isHoveringTheBase = false;
    if (parent)
        isHoveringTheBase = ev.targetTouches[0].clientY > parent.offsetTop + sideSize - sideSize / 7;
    if (parent && parent.children.length > 1 && !isHoveringTheBase) {
        topBlock = parent === null || parent === void 0 ? void 0 : parent.firstElementChild;
        startX = ev.targetTouches[0].clientX;
        startY = ev.targetTouches[0].clientY;
        var width = parseFloat(window.getComputedStyle(topBlock).width);
        topBlock.style.left = startX - width / 2 + "px";
        var height = parseFloat(window.getComputedStyle(topBlock).height);
        topBlock.style.top = startY - height / 2 + "px";
        document.addEventListener("touchmove", touchMoveWrapper);
        document.addEventListener("touchend", touchEndWrapper);
    }
}
function mouseMove(ev, topBlock) {
    newX = startX - ev.clientX;
    newY = startY - ev.clientY;
    startX = ev.clientX;
    startY = ev.clientY;
    topBlock.style.position = "fixed";
    topBlock.style.zIndex = "1";
    topBlock.style.left = topBlock.offsetLeft - newX + "px";
    topBlock.style.top = topBlock.offsetTop - newY + "px";
}
function mouseMoveWrapper(ev) {
    mouseMove(ev, topBlock);
}
function touchMove(ev, topBlock) {
    newX = startX - ev.targetTouches[0].clientX;
    newY = startY - ev.targetTouches[0].clientY;
    startX = ev.targetTouches[0].clientX;
    startY = ev.targetTouches[0].clientY;
    topBlock.style.position = "fixed";
    topBlock.style.zIndex = "1";
    topBlock.style.left = topBlock.offsetLeft - newX + "px";
    topBlock.style.top = topBlock.offsetTop - newY + "px";
}
function touchMoveWrapper(ev) {
    touchMove(ev, topBlock);
}
function mouseUp(ev, topBlock) {
    document.removeEventListener("mousemove", mouseMoveWrapper);
    document.removeEventListener("mouseup", mouseUpWrapper);
    topBlock.style.zIndex = "0";
    topBlock.style.position = "static";
    sides.forEach(function (side) {
        var _a, _b;
        if (side === topBlock.parentElement)
            return;
        var top = side.offsetTop, bottom = side.offsetTop + sideSize, left = side.offsetLeft, right = side.offsetLeft + sideSize;
        var currentSideTopOrder = parseInt((_a = topBlock.dataset.order) !== null && _a !== void 0 ? _a : "0");
        var newSideFirstChild = side.firstElementChild;
        var newSideTopOrder = parseInt((_b = newSideFirstChild.dataset.order) !== null && _b !== void 0 ? _b : "0");
        if (ev.clientY > top &&
            ev.clientY < bottom &&
            ev.clientX > left &&
            ev.clientX < right &&
            currentSideTopOrder < newSideTopOrder) {
            if (moves === 0)
                timeInterval = setInterval(function () {
                    time += 0.1;
                    timeSpan.textContent = time.toFixed(1);
                }, 100);
            moves++;
            movesSpan.textContent = moves.toString();
            side.prepend(topBlock);
            checkResult();
        }
    });
}
function mouseUpWrapper(ev) {
    mouseUp(ev, topBlock);
}
function touchEnd(ev, topBlock) {
    document.removeEventListener("touchmove", touchMoveWrapper);
    document.removeEventListener("touchend", touchEndWrapper);
    topBlock.style.zIndex = "0";
    topBlock.style.position = "static";
    sides.forEach(function (side) {
        var _a, _b;
        if (side === topBlock.parentElement)
            return;
        var top = side.offsetTop, bottom = side.offsetTop + sideSize, left = side.offsetLeft, right = side.offsetLeft + sideSize;
        var currentSideTopOrder = parseInt((_a = topBlock.dataset.order) !== null && _a !== void 0 ? _a : "0");
        var newSideFirstChild = side.firstElementChild;
        var newSideTopOrder = parseInt((_b = newSideFirstChild.dataset.order) !== null && _b !== void 0 ? _b : "0");
        if (ev.changedTouches[0].clientY > top &&
            ev.changedTouches[0].clientY < bottom &&
            ev.changedTouches[0].clientX > left &&
            ev.changedTouches[0].clientX < right &&
            currentSideTopOrder < newSideTopOrder) {
            if (moves === 0)
                timeInterval = setInterval(function () {
                    time += 0.1;
                    timeSpan.textContent = time.toFixed(1);
                }, 100);
            moves++;
            movesSpan.textContent = moves.toString();
            side.prepend(topBlock);
            checkResult();
        }
    });
}
function touchEndWrapper(ev) {
    touchEnd(ev, topBlock);
}
playAgainBtn.addEventListener("click", function () { return window.location.reload(); });
function checkResult() {
    if (sides[sides.length - 1].children.length === 7) {
        clearInterval(timeInterval);
        sides.forEach(function (side) {
            side.removeEventListener("mousedown", mouseDown);
            side.removeEventListener("touchstart", touchStart);
            side.style.cursor = "default";
        });
        var congratsDiv_1 = document.querySelector(".congratulations");
        congratsDiv_1.style.visibility = "visible";
        congratsDiv_1.style.opacity = "1";
        congratsDiv_1.onclick = function () {
            congratsDiv_1.style.opacity = "0";
            setTimeout(function () { return (congratsDiv_1.style.visibility = "hidden"); }, 500);
        };
    }
}
