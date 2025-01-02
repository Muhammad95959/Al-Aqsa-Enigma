const rules = document.querySelector(".rules") as HTMLDivElement;
const rulesCloseBtn = document.querySelector(".rules .closeBtn") as HTMLButtonElement;
const sides = document.querySelectorAll('div[class^="side"]') as NodeListOf<HTMLDivElement>;
const sideSize: number = parseFloat(
  window.getComputedStyle(document.documentElement).getPropertyValue("--size"),
);
let topBlock: HTMLElement;
let startX = 0,
  startY = 0,
  newX = 0,
  newY = 0;

if (window.localStorage.getItem("dontShowRules") === "true") rules.remove();

rulesCloseBtn.addEventListener("click", function () {
  const dontShowState: boolean = (document.querySelector(".rules input") as HTMLInputElement)
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

function mouseDown(ev: MouseEvent) {
  const target = ev.target as HTMLDivElement;
  const parent = target.parentElement;
  let isHoveringTheBase = false;
  if (parent) isHoveringTheBase = ev.clientY > parent.offsetTop + sideSize - sideSize / 7;
  if (parent && parent.children.length > 1 && !isHoveringTheBase) {
    topBlock = parent?.firstElementChild as HTMLDivElement;
    startX = ev.clientX;
    startY = ev.clientY;
    const width = parseFloat(window.getComputedStyle(topBlock).width);
    topBlock.style.left = startX - width / 2 + "px";
    const height = parseFloat(window.getComputedStyle(topBlock).height);
    topBlock.style.top = startY - height / 2 + "px";
    document.addEventListener("mousemove", mouseMoveWrapper);
    document.addEventListener("mouseup", mouseUpWrapper);
  }
}

function touchStart(ev: TouchEvent) {
  const target = ev.target as HTMLDivElement;
  const parent = target.parentElement;
  let isHoveringTheBase = false;
  if (parent)
    isHoveringTheBase = ev.targetTouches[0].clientY > parent.offsetTop + sideSize - sideSize / 7;
  if (parent && parent.children.length > 1 && !isHoveringTheBase) {
    topBlock = parent?.firstElementChild as HTMLDivElement;
    startX = ev.targetTouches[0].clientX;
    startY = ev.targetTouches[0].clientY;
    const width = parseFloat(window.getComputedStyle(topBlock).width);
    topBlock.style.left = startX - width / 2 + "px";
    const height = parseFloat(window.getComputedStyle(topBlock).height);
    topBlock.style.top = startY - height / 2 + "px";
    document.addEventListener("touchmove", touchMoveWrapper);
    document.addEventListener("touchend", touchEndWrapper);
  }
}

function mouseMove(ev: MouseEvent, topBlock: HTMLElement) {
  newX = startX - ev.clientX;
  newY = startY - ev.clientY;
  startX = ev.clientX;
  startY = ev.clientY;
  topBlock.style.position = "fixed";
  topBlock.style.zIndex = "1";
  topBlock.style.left = topBlock.offsetLeft - newX + "px";
  topBlock.style.top = topBlock.offsetTop - newY + "px";
}

function mouseMoveWrapper(ev: MouseEvent) {
  mouseMove(ev, topBlock);
}

function touchMove(ev: TouchEvent, topBlock: HTMLElement) {
  newX = startX - ev.targetTouches[0].clientX;
  newY = startY - ev.targetTouches[0].clientY;
  startX = ev.targetTouches[0].clientX;
  startY = ev.targetTouches[0].clientY;
  topBlock.style.position = "fixed";
  topBlock.style.zIndex = "1";
  topBlock.style.left = topBlock.offsetLeft - newX + "px";
  topBlock.style.top = topBlock.offsetTop - newY + "px";
}

function touchMoveWrapper(ev: TouchEvent) {
  touchMove(ev, topBlock);
}

function mouseUp(ev: MouseEvent, topBlock: HTMLElement) {
  document.removeEventListener("mousemove", mouseMoveWrapper);
  document.removeEventListener("mouseup", mouseUpWrapper);
  topBlock.style.zIndex = "0";
  topBlock.style.position = "static";
  sides.forEach(function (side) {
    if (side === topBlock.parentElement) return;
    const top = side.offsetTop,
      bottom = side.offsetTop + sideSize,
      left = side.offsetLeft,
      right = side.offsetLeft + sideSize;
    const currentSideTopOrder: number = parseInt(topBlock.dataset.order ?? "0");
    const newSideFirstChild: HTMLElement = side.firstElementChild as HTMLElement;
    const newSideTopOrder: number = parseInt(newSideFirstChild.dataset.order ?? "0");
    if (
      ev.clientY > top &&
      ev.clientY < bottom &&
      ev.clientX > left &&
      ev.clientX < right &&
      currentSideTopOrder < newSideTopOrder
    ) {
      side.prepend(topBlock);
    }
  });
}

function mouseUpWrapper(ev: MouseEvent) {
  mouseUp(ev, topBlock);
}

function touchEnd(ev: TouchEvent, topBlock: HTMLElement) {
  document.removeEventListener("touchmove", touchMoveWrapper);
  document.removeEventListener("touchend", touchEndWrapper);
  topBlock.style.zIndex = "0";
  topBlock.style.position = "static";
  sides.forEach(function (side) {
    if (side === topBlock.parentElement) return;
    const top = side.offsetTop,
      bottom = side.offsetTop + sideSize,
      left = side.offsetLeft,
      right = side.offsetLeft + sideSize;
    const currentSideTopOrder: number = parseInt(topBlock.dataset.order ?? "0");
    const newSideFirstChild: HTMLElement = side.firstElementChild as HTMLElement;
    const newSideTopOrder: number = parseInt(newSideFirstChild.dataset.order ?? "0");
    if (
      ev.changedTouches[0].clientY > top &&
      ev.changedTouches[0].clientY < bottom &&
      ev.changedTouches[0].clientX > left &&
      ev.changedTouches[0].clientX < right &&
      currentSideTopOrder < newSideTopOrder
    ) {
      side.prepend(topBlock);
    }
  });
}

function touchEndWrapper(ev: TouchEvent) {
  touchEnd(ev, topBlock);
}
