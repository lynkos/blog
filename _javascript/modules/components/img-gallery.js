/**
 * Dynamically rounds corners of gallery images on load and window resize.
 */

function roundCorners(img) {
  if (!img.complete) return;

  const parent = img.closest('.slideshow');
  //console.log(`Image loaded: ${img.src}, natural size: ${img.clientWidth}x${img.clientHeight}, slideshow size: ${parent.clientWidth}x${parent.clientHeight}`);

  if (img.clientWidth === parent.clientWidth && img.clientHeight === parent.clientHeight) {
    img.classList.add('fills-slideshow');
  } else img.classList.remove('fills-slideshow');
}

export function applyRoundedCorners() {
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        roundCorners(entry.target);
      }
    });
  });

  document.querySelectorAll('.slides a.popup img').forEach(img => {
    img.onload = () => roundCorners(img);
    visibilityObserver.observe(img);
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.slides a.popup img').forEach(img => roundCorners(img));
  });
}
