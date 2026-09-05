// ===== Menú responsive =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

const siteHeader = document.querySelector('.site-header');

function updateHeaderOnScroll() {
  if (!siteHeader) return;
  // Umbrales distintos para activar/desactivar (histéresis): evita que un
  // pequeño rebote de scroll cerca de un único punto haga titilar el header.
  if (window.scrollY > 40) {
    siteHeader.classList.add('is-scrolled');
  } else if (window.scrollY < 16) {
    siteHeader.classList.remove('is-scrolled');
  }
}

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

// ===== Armar grilla del portafolio =====
const portfolioGrid = document.getElementById('portfolioGrid');
const portfolioPreloader = document.getElementById('portfolioPreloader');
const portfolioSessionKey = 'calycoPortfolioLoaded';
let portfolioPreloaderFinished = false;

function hasPortfolioSession() {
  try {
    return sessionStorage.getItem(portfolioSessionKey) === 'true';
  } catch (error) {
    return false;
  }
}

function markPortfolioSession() {
  try {
    sessionStorage.setItem(portfolioSessionKey, 'true');
  } catch (error) {
  }
}

function finishPortfolioPreloader(saveSession = true) {
  if (portfolioPreloaderFinished) {
    return;
  }

  portfolioPreloaderFinished = true;
  if (saveSession) {
    markPortfolioSession();
  }
  document.body.classList.remove('portfolio-preloader-open');
  document.documentElement.classList.add('portfolio-session-loaded');
  if (portfolioPreloader) {
    portfolioPreloader.classList.add('is-hidden');
  }
}

function updatePortfolioProgress(completed, total) {
  const progress = total ? Math.round((completed / total) * 100) : 100;
  const progressBar = document.getElementById('portfolioProgressBar');
  const progressValue = document.getElementById('portfolioProgressValue');

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  if (progressValue) {
    progressValue.textContent = `${progress}%`;
  }
}

function prepareRender(image, item, onProcessed, onReady) {
  return new Promise((resolve) => {
    let settled = false;

    const settle = async (loaded, image) => {
      if (settled) {
        return;
      }

      settled = true;
      if (!loaded) {
        console.error(`No se pudo cargar la imagen principal: ${item.img}`);
        if (onProcessed) {
          onProcessed();
        }
        resolve(null);
        return;
      }

      try {
        if (image && typeof image.decode === 'function') {
          await image.decode();
        }
        image.classList.add('is-render-ready');
        if (onReady) {
          onReady();
        }
        if (onProcessed) {
          onProcessed();
        }
        resolve(item);
      } catch (error) {
        console.error(`No se pudo decodificar la imagen principal: ${item.img}`, error);
        if (onProcessed) {
          onProcessed();
        }
        resolve(null);
      }
    };

    image.addEventListener('load', () => settle(true, image), { once: true });
    image.addEventListener('error', () => settle(false, image), { once: true });
    image.src = item.img;

    if (image.complete) {
      settle(image.naturalWidth > 0, image);
    }
  });
}

if (portfolioPreloader && !hasPortfolioSession()) {
  document.body.classList.add('portfolio-preloader-open');
}

if (portfolioGrid && typeof portfolioItems !== 'undefined') {
  const initialRenderPromises = [];

  function createPortfolioCard(item, itemIndex, fragment, renderPromises, onProcessed) {
    const wireSrc = item.hoverImg || item.img;
    const card = document.createElement('div');
    card.className = 'portfolio-item';
    card.style.aspectRatio = `${item.width} / ${item.height}`;

    const mainImg = document.createElement('img');
    mainImg.alt = '';
    mainImg.width = item.width;
    mainImg.height = item.height;
    mainImg.loading = itemIndex < 4 ? 'eager' : 'lazy';
    if (itemIndex < 4) {
      mainImg.fetchPriority = 'high';
    }
    mainImg.decoding = 'async';
    mainImg.className = 'img-main';
    const wireImg = document.createElement('img');
    wireImg.alt = '';
    wireImg.decoding = 'async';
    wireImg.className = 'img-hover';

    let wireReady = false;

    function preloadWireframe() {
      if (wireReady) {
        return;
      }

      const wirePreload = new Image();
      wirePreload.onload = () => {
        wireReady = true;
        wireImg.src = wireSrc;
        card.classList.add('wire-ready');
      };
      wirePreload.onerror = () => {
        console.error(`No se pudo cargar la imagen wireframe: ${wireSrc}`);
      };
      wirePreload.src = wireSrc;
    }

    const onRenderReady = () => preloadWireframe();

    card.appendChild(mainImg);
    card.appendChild(wireImg);

    card.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(max-width: 768px)').matches && wireReady) {
        card.classList.add('is-wire');
      }
    });
    card.addEventListener('mouseleave', () => {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        card.classList.remove('is-wire');
      }
    });
    card.addEventListener('focusin', () => {
      if (!window.matchMedia('(max-width: 768px)').matches && wireReady) {
        card.classList.add('is-wire');
      }
    });
    card.addEventListener('focusout', () => {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        card.classList.remove('is-wire');
      }
    });
    card.addEventListener('pointerup', (event) => {
      const currentIndex = portfolioItems.findIndex((portfolioItem) => portfolioItem.img === item.img && (portfolioItem.hoverImg || portfolioItem.img) === wireSrc);
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

      if (isTouchDevice) {
        event.preventDefault();
        event.stopPropagation();
        if (wireReady) {
          card.classList.toggle('is-wire');
        }
        return;
      }

      openLightbox(currentIndex);
    });

    fragment.appendChild(card);
    const renderPromise = prepareRender(mainImg, item, onProcessed, onRenderReady);
    if (itemIndex < 4) {
      initialRenderPromises.push(renderPromise);
    }
  }

  let completed = 0;
  const fragment = document.createDocumentFragment();
  const processRender = () => {
    completed += 1;
    if (portfolioPreloader && !hasPortfolioSession()) {
      updatePortfolioProgress(completed, 4);
    }
  };

  portfolioItems.forEach((item, itemIndex) => createPortfolioCard(
    item,
    itemIndex,
    fragment,
    initialRenderPromises,
    itemIndex < 4 ? processRender : null,
  ));
  portfolioGrid.appendChild(fragment);

  if (portfolioPreloader && !hasPortfolioSession()) {
    updatePortfolioProgress(0, 4);
    const hideTimer = window.setTimeout(finishPortfolioPreloader, 1500);
    Promise.all(initialRenderPromises).then(() => {
      window.clearTimeout(hideTimer);
      updatePortfolioProgress(4, 4);
      finishPortfolioPreloader();
    });
  }
}

if (portfolioPreloader) {
  if (hasPortfolioSession()) {
    finishPortfolioPreloader();
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      finishPortfolioPreloader(false);
    } else if (hasPortfolioSession()) {
      finishPortfolioPreloader(false);
    }
  });
}

// ===== Animaciones de entrada =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = [
  ...document.querySelectorAll('.page-hero, .about-section, .contact-panel, .contact-overlay'),
];

revealElements.forEach((element, elementIndex) => {
  element.classList.add('reveal-on-scroll');
  element.style.setProperty('--reveal-delay', `${Math.min(elementIndex * 30, 180)}ms`);
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
const lightboxClose = document.getElementById('lightboxClose');
let lightboxStage = lightboxContent ? lightboxContent.querySelector('.lightbox-stage') : null;
let lightboxRender = lightboxStage ? lightboxStage.querySelector('.lightbox-render') : null;
let lightboxWire = lightboxStage ? lightboxStage.querySelector('.lightbox-wire') : null;
let lightboxPrev = lightboxContent ? lightboxContent.querySelector('.lightbox-prev') : null;
let lightboxNext = lightboxContent ? lightboxContent.querySelector('.lightbox-next') : null;

const lightboxState = {
  index: 0,
  isWire: false,
};

function setLightboxState(isWire) {
  if (!lightboxStage) {
    return;
  }

  lightboxState.isWire = Boolean(isWire);
  lightboxStage.classList.toggle('is-wire', lightboxState.isWire);
}

function syncLightboxProject() {
  if (!lightboxRender || !lightboxWire || !portfolioItems.length) {
    return;
  }

  const item = portfolioItems[lightboxState.index];
  if (!item) {
    return;
  }

  lightboxRender.src = item.img;
  lightboxRender.alt = '';
  lightboxWire.src = item.hoverImg || item.img;
  lightboxWire.alt = '';
  setLightboxState(false);
}

function openLightbox(index, isWire = false) {
  if (!lightbox || !portfolioItems.length) {
    return;
  }

  const safeIndex = (index + portfolioItems.length) % portfolioItems.length;
  lightboxState.index = safeIndex;
  syncLightboxProject();
  setLightboxState(isWire);
  lightbox.classList.add('active');
  document.body.classList.add('lightbox-open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove('active');
  document.body.classList.remove('lightbox-open');
  lightbox.setAttribute('aria-hidden', 'true');
}

if (!lightboxStage && lightboxContent) {
  const stage = document.createElement('div');
  stage.className = 'lightbox-stage';

  const renderImg = document.createElement('img');
  renderImg.className = 'lightbox-img lightbox-render';
  renderImg.src = '';
  renderImg.alt = '';

  const wireImg = document.createElement('img');
  wireImg.className = 'lightbox-img lightbox-wire';
  wireImg.src = '';
  wireImg.alt = '';

  stage.appendChild(renderImg);
  stage.appendChild(wireImg);

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'lightbox-nav lightbox-prev';
  prevButton.setAttribute('aria-label', 'Proyecto anterior');
  prevButton.textContent = '❮';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'lightbox-nav lightbox-next';
  nextButton.setAttribute('aria-label', 'Proyecto siguiente');
  nextButton.textContent = '❯';

  lightboxContent.appendChild(stage);
  lightboxContent.appendChild(prevButton);
  lightboxContent.appendChild(nextButton);

  lightboxStage = lightboxContent.querySelector('.lightbox-stage');
  lightboxRender = lightboxStage ? lightboxStage.querySelector('.lightbox-render') : null;
  lightboxWire = lightboxStage ? lightboxStage.querySelector('.lightbox-wire') : null;
  lightboxPrev = lightboxContent.querySelector('.lightbox-prev');
  lightboxNext = lightboxContent.querySelector('.lightbox-next');
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', (event) => {
    event.stopPropagation();
    closeLightbox();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', (event) => {
    event.stopPropagation();
    lightboxState.index = (lightboxState.index - 1 + portfolioItems.length) % portfolioItems.length;
    syncLightboxProject();
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', (event) => {
    event.stopPropagation();
    lightboxState.index = (lightboxState.index + 1) % portfolioItems.length;
    syncLightboxProject();
  });
}

if (lightboxStage) {
  lightboxStage.addEventListener('click', (event) => {
    event.stopPropagation();
    setLightboxState(!lightboxState.isWire);
  });

  lightboxStage.addEventListener('touchstart', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setLightboxState(!lightboxState.isWire);
  }, { passive: false });
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('active')) {
    return;
  }

  if (event.key === 'Escape') {
    closeLightbox();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    lightboxState.index = (lightboxState.index - 1 + portfolioItems.length) % portfolioItems.length;
    syncLightboxProject();
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    lightboxState.index = (lightboxState.index + 1) % portfolioItems.length;
    syncLightboxProject();
  }
});

// ===== Ajuste dinámico de la última línea de contacto =====
function normalizeContactNameSpacing() {
  const mailLine = document.querySelector('.contact-overlay p:first-child');
  const nameLine = document.querySelector('.contact-overlay p:last-child');

  if (!mailLine || !nameLine) {
    return;
  }

  const mailWidth = mailLine.getBoundingClientRect().width;
  const originalLetterSpacing = getComputedStyle(nameLine).letterSpacing;
  const originalText = nameLine.textContent.trim();

  nameLine.style.letterSpacing = '0px';
  const naturalNameWidth = nameLine.getBoundingClientRect().width;
  const charGapCount = originalText.length - 1;

  if (charGapCount <= 0 || !Number.isFinite(mailWidth) || !Number.isFinite(naturalNameWidth)) {
    nameLine.style.letterSpacing = originalLetterSpacing;
    return;
  }

  const adjustedSpacing = (mailWidth - naturalNameWidth) / charGapCount;
  nameLine.style.letterSpacing = `${adjustedSpacing}px`;
}

window.addEventListener('load', normalizeContactNameSpacing);
window.addEventListener('resize', normalizeContactNameSpacing);

// ===== Slider de sobre nosotros =====
const aboutHeroSlider = document.querySelector('.about-hero-slider');
const aboutSlides = Array.from(document.querySelectorAll('.about-slide'));
const aboutDots = Array.from(document.querySelectorAll('.about-slider-dot'));
const aboutPrevButton = document.querySelector('.about-slider-prev');
const aboutNextButton = document.querySelector('.about-slider-next');

if (aboutHeroSlider && aboutSlides.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let aboutActiveIndex = 0;
  let aboutAutoplayId = null;

  function updateAboutSlider(index) {
    aboutActiveIndex = (index + aboutSlides.length) % aboutSlides.length;

    aboutSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === aboutActiveIndex);
    });

    aboutDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === aboutActiveIndex);
      dot.setAttribute('aria-current', dotIndex === aboutActiveIndex ? 'true' : 'false');
    });
  }

  function pauseAboutAutoplay() {
    if (aboutAutoplayId) {
      clearInterval(aboutAutoplayId);
      aboutAutoplayId = null;
    }
  }

  function startAboutAutoplay() {
    if (prefersReducedMotion || aboutAutoplayId) {
      return;
    }

    aboutAutoplayId = setInterval(() => {
      updateAboutSlider(aboutActiveIndex + 1);
    }, 6000);
  }

  function resetAboutAutoplay() {
    pauseAboutAutoplay();
    startAboutAutoplay();
  }

  aboutSlides.forEach((slide) => {
    const position = slide.dataset.position || 'center center';
    const img = slide.querySelector('img');
    if (img) {
      img.style.objectPosition = position;
    }
  });

  updateAboutSlider(0);

  if (aboutPrevButton) {
    aboutPrevButton.addEventListener('click', () => {
      updateAboutSlider(aboutActiveIndex - 1);
      resetAboutAutoplay();
    });
  }

  if (aboutNextButton) {
    aboutNextButton.addEventListener('click', () => {
      updateAboutSlider(aboutActiveIndex + 1);
      resetAboutAutoplay();
    });
  }

  aboutDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateAboutSlider(index);
      resetAboutAutoplay();
    });
  });

  aboutHeroSlider.addEventListener('mouseenter', pauseAboutAutoplay);
  aboutHeroSlider.addEventListener('mouseleave', startAboutAutoplay);
  aboutHeroSlider.addEventListener('focusin', pauseAboutAutoplay);
  aboutHeroSlider.addEventListener('focusout', startAboutAutoplay);

  if (!prefersReducedMotion) {
    startAboutAutoplay();
  }
}

// ===== Slider de contacto =====
const contactSlider = document.querySelector('.contact-slider');
const contactSlides = Array.from(document.querySelectorAll('.contact-slide'));
const contactDots = Array.from(document.querySelectorAll('.contact-slider-dot'));
const prevButton = document.querySelector('.contact-slider-prev');
const nextButton = document.querySelector('.contact-slider-next');

if (contactSlider && contactSlides.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let autoplayId = null;

  function updateSlider(index) {
    activeIndex = (index + contactSlides.length) % contactSlides.length;

    contactSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });

    contactDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
      dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
    });
  }

  function pauseAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion || autoplayId) {
      return;
    }

    autoplayId = setInterval(() => {
      updateSlider(activeIndex + 1);
    }, 5000);
  }

  function resetAutoplay() {
    pauseAutoplay();
    startAutoplay();
  }

  const setSlidePosition = () => {
    contactSlides.forEach((slide) => {
      const position = slide.dataset.position || 'center center';
      slide.querySelector('img').style.objectPosition = position;
    });
  };

  setSlidePosition();
  updateSlider(0);

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      updateSlider(activeIndex - 1);
      resetAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      updateSlider(activeIndex + 1);
      resetAutoplay();
    });
  }

  contactDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
      resetAutoplay();
    });
  });

  contactSlider.addEventListener('mouseenter', pauseAutoplay);
  contactSlider.addEventListener('mouseleave', startAutoplay);
  contactSlider.addEventListener('focusin', pauseAutoplay);
  contactSlider.addEventListener('focusout', startAutoplay);

  if (!prefersReducedMotion) {
    startAutoplay();
  }
}

// ===== Formulario de contacto =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'ENVIANDO...';
    }

    try {
      const response = await fetch('https://formspree.io/f/xvkogvnn', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        if (formSuccess) {
          formSuccess.classList.remove('error');
          formSuccess.textContent = '¡Gracias! Te vamos a responder a la brevedad.';
          formSuccess.style.display = 'block';
        }

        contactForm.reset();
      } else {
        if (formSuccess) {
          formSuccess.textContent = '';
          formSuccess.style.display = 'none';
        }
      }
    } catch (error) {
      if (formSuccess) {
        formSuccess.textContent = '';
        formSuccess.style.display = 'none';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'enviar';
      }
    }
  });
}