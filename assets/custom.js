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

const getCustomScrollContainer = () => {
  if (window.matchMedia('(min-width: 990px)').matches) {
    return document.querySelector('.page-wrapper') ?? document.scrollingElement ?? document.documentElement;
  }

  return document.scrollingElement ?? document.documentElement;
};

const initializeScrollTopButton = () => {
  const button = document.querySelector('[data-scroll-top-button]');
  if (!(button instanceof HTMLButtonElement)) return;

  const updateVisibility = () => {
    const container = getCustomScrollContainer();
    const scrollTop = container.scrollTop;
    button.classList.toggle('is-visible', scrollTop > 400);
  };

  const bindScrollListener = () => {
    const container = getCustomScrollContainer();

    if (initializeScrollTopButton.currentContainer && initializeScrollTopButton.currentContainer !== container) {
      initializeScrollTopButton.currentContainer.removeEventListener('scroll', updateVisibility);
    }

    if (initializeScrollTopButton.currentContainer !== container) {
      container.addEventListener('scroll', updateVisibility, { passive: true });
      initializeScrollTopButton.currentContainer = container;
    }

    updateVisibility();
  };

  button.addEventListener('click', () => {
    getCustomScrollContainer().scrollTo({ top: 0, behavior: 'smooth' });
  });

  bindScrollListener();
  window.addEventListener('resize', bindScrollListener);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScrollTopButton);
} else {
  initializeScrollTopButton();
}
