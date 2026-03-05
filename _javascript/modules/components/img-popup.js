/**
 * Set up image popup
 *
 * Dependencies: https://github.com/biati-digital/glightbox
 */

const lightImages = '.popup:not(.dark)';
const darkImages = '.popup:not(.light)';
let selector = lightImages;

function updateImages(current, reverse) {
  if (selector === lightImages) {
    selector = darkImages;
  } else {
    selector = lightImages;
  }

  if (reverse === null) {
    reverse = GLightbox({ selector: `${selector}` });
  }

  [current, reverse] = [reverse, current];
}

export function imgPopup() {
  if (document.querySelector('.popup') === null) {
    return;
  }

  const hasDualImages = !(
    document.querySelector('.popup.light') === null &&
    document.querySelector('.popup.dark') === null
  );

  if (Theme.visualState === Theme.DARK) {
    selector = darkImages;
  }

  let current = GLightbox({ selector: `${selector}` });

  if (hasDualImages && Theme.switchable) {
    let reverse = null;

    window.addEventListener('message', (event) => {
      if (event.source === window && event.data && event.data.id === Theme.ID) {
        updateImages(current, reverse);
      }
    });
  }
}

// ONLY applies rounded corners if slideshow image completely fills gallery/slideshow container
document.querySelectorAll('.slides a.popup img').forEach(img => {
  img.onload = () => {
    const parent = img.closest('.slideshow');
    //console.log(`Image loaded: ${img.src}, natural size: ${img.clientWidth}x${img.clientHeight}, slideshow size: ${parent.clientWidth}x${parent.clientHeight}`);
    if (
      img.clientWidth === parent.clientWidth && img.clientHeight === parent.clientHeight
    ) {
      img.classList.add('fills-slideshow');
    } else img.classList.remove('fills-slideshow');
  };
});
