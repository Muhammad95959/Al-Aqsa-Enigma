const sides = document.querySelectorAll('div[class^="side"]') as NodeListOf<HTMLDivElement>;
const sideSize: number = parseFloat(
  window.getComputedStyle(document.documentElement).getPropertyValue("--size"),
);
let topBlock: HTMLElement;
let startX = 0,
  startY = 0,
  newX = 0,
  newY = 0;

sides.forEach(function (side) {
  side.addEventListener("mousedown", mouseDown);
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
