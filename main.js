var sides = document.querySelectorAll('div[class^="side"]');
var sideSize = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue("--size"));
var topBlock;
var startX = 0, startY = 0, newX = 0, newY = 0;
sides.forEach(function (side) {
    side.addEventListener("mousedown", mouseDown);
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
            side.prepend(topBlock);
        }
    });
}
function mouseUpWrapper(ev) {
    mouseUp(ev, topBlock);
}
