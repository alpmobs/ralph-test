const revealScrollTriggeredElements = () => {
  const scrollTriggers = document.querySelectorAll('.custom-scroll-trigger:not([data-custom-observed])');

  if (!scrollTriggers.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scrollTriggers.forEach((element) => {
      element.classList.add('is-visible');
      element.dataset.customObserved = 'true';
    });
    return;
  }

  const observer =
    revealScrollTriggeredElements.observer ||
    new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
      }
    );

  revealScrollTriggeredElements.observer = observer;

  scrollTriggers.forEach((element) => {
    element.dataset.customObserved = 'true';
    observer.observe(element);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealScrollTriggeredElements);
} else {
  revealScrollTriggeredElements();
}

document.addEventListener('shopify:section:load', revealScrollTriggeredElements);
document.addEventListener('shopify:section:reorder', revealScrollTriggeredElements);
