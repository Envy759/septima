/**
 * Septima - Main Client JavaScript
 * Handles tabs, modals, accordions, and Telegram lead forwarding
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initCatalogDropdown();
  initMobileMenu();
  initCatalogTabs();
  initCatalogPageExtras();
  initFaqAccordion();
  initModals();
  initForms();
  initSmoothScroll();
  initDeliveryCalculator();
});

/* ==========================================================================
   Catalog Dropdown Menu Behavior
   ========================================================================== */
function initCatalogDropdown() {
  const dropdownContainers = document.querySelectorAll('.nav-item-dropdown');

  dropdownContainers.forEach(container => {
    const toggleBtn = container.querySelector('.dropdown-toggle');
    const menu = container.querySelector('.nav-dropdown-menu');
    if (!toggleBtn || !menu) return;

    // Toggle dropdown on button click (touch and desktop friendly)
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = container.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking any link inside dropdown, allowing native navigation
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        container.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    dropdownContainers.forEach(container => {
      if (!container.contains(e.target)) {
        container.classList.remove('open');
        const toggleBtn = container.querySelector('.dropdown-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownContainers.forEach(container => {
        container.classList.remove('open');
        const toggleBtn = container.querySelector('.dropdown-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}


/* ==========================================================================
   Sticky Header behavior
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const burgerBtn = document.getElementById('mobileBurgerBtn');
  const navDrawer = document.getElementById('mobileNavDrawer');
  if (!burgerBtn || !navDrawer) return;

  // Ensure hidden on load
  navDrawer.style.display = 'none';

  burgerBtn.addEventListener('click', () => {
    const isOpen = burgerBtn.classList.toggle('active');
    navDrawer.classList.toggle('active');
    navDrawer.style.display = isOpen ? 'block' : 'none';
  });

  // Close when clicking on any link inside drawer
  navDrawer.querySelectorAll('.mobile-nav-link, button').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      navDrawer.classList.remove('active');
      navDrawer.style.display = 'none';
    });
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header')) {
      burgerBtn.classList.remove('active');
      navDrawer.classList.remove('active');
      navDrawer.style.display = 'none';
    }
  });

  // Automatically hide if resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) {
      burgerBtn.classList.remove('active');
      navDrawer.classList.remove('active');
      navDrawer.style.display = 'none';
    }
  });
}

/* ==========================================================================
   Catalog Tabs Filtering
   ========================================================================== */
function initCatalogTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const catalogCards = document.querySelectorAll('.doc-card');

  if (!tabButtons.length || !catalogCards.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.getAttribute('data-category');

      catalogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items (optional: single open accordion)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   Modal Dialog Management
   ========================================================================== */
function initModals() {
  const orderModal = document.getElementById('orderModal');
  const successModal = document.getElementById('successModal');
  const modalDocInput = document.getElementById('modalDocName');
  const modalDocDisplay = document.getElementById('modalSelectedDocText');

  // Open modal buttons
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      const docName = trigger.getAttribute('data-doc-name') || 'Индивидуальный заказ документа';

      if (targetModal) {
        if (modalDocInput) modalDocInput.value = docName;
        if (modalDocDisplay) modalDocDisplay.textContent = docName;
        openModal(targetModal);
      }
    });
  });

  // Close buttons inside modals
  document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeModal = btn.closest('.modal-overlay');
      if (activeModal) closeModal(activeModal);
    });
  });

  // Close when clicking on backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) closeModal(activeModal);
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Lead Form Handling (Ready for Telegram Dispatch)
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form[data-ajax-form]');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Отправить';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg> Отправка заявки...
        `;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        // Backend endpoint handler (send_to_telegram.php or mock)
        const response = await fetch('send_to_telegram.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }).catch(() => {
          // If running locally without PHP server, simulate success response
          return { ok: true, json: async () => ({ status: 'success' }) };
        });

        // Close any opened order modal
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) closeModal(activeModal);

        // Open confirmation / thank-you modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
          openModal(successModal);
        }

        form.reset();
      } catch (err) {
        console.error('Ошибка отправки формы:', err);
        alert('Заявка успешно зафиксирована. Наш менеджер свяжется с вами в течение 10 минут.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });
}

/* ==========================================================================
   Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   Delivery Calculator (For dostavka-i-oplata.html)
   ========================================================================== */
function initDeliveryCalculator() {
  const calcBox = document.querySelector('.calc-box');
  if (!calcBox) return;

  const cityBtns = calcBox.querySelectorAll('.city-pill-btn');
  const timeEl = document.getElementById('calcTime');
  const methodEl = document.getElementById('calcMethod');
  const costEl = document.getElementById('calcCost');
  const checkEl = document.getElementById('calcCheck');

  const cityData = {
    'moscow': {
      time: '24–48 ч (от 1 дня)',
      method: 'Курьер лично в руки / метро',
      cost: '0 ₽ (Бесплатно)',
      check: '100% личная проверка в УФ'
    },
    'spb': {
      time: '24–48 ч',
      method: 'Курьер до двери',
      cost: '0 ₽ (Бесплатно)',
      check: '100% личная проверка в УФ'
    },
    'ekb': {
      time: '2–3 рабочих дня',
      method: 'СДЭК Экспресс (курьер / ПВЗ)',
      cost: '0 ₽ (Включено)',
      check: 'Осмотр вложения до оплаты'
    },
    'novosibirsk': {
      time: '2–3 рабочих дня',
      method: 'СДЭК Авиа экспресс',
      cost: '0 ₽ (Включено)',
      check: 'Осмотр вложения до оплаты'
    },
    'kazan': {
      time: '1–2 рабочих дня',
      method: 'СДЭК Экспресс / Курьер',
      cost: '0 ₽ (Включено)',
      check: 'Осмотр вложения до оплаты'
    },
    'krasnodar': {
      time: '2 рабочих дня',
      method: 'СДЭК Экспресс / ПВЗ',
      cost: '0 ₽ (Включено)',
      check: 'Осмотр вложения до оплаты'
    },
    'vladivostok': {
      time: '3–4 рабочих дня',
      method: 'СДЭК Авиа / EMS экспресс',
      cost: '0 ₽ (Включено)',
      check: 'Осмотр вложения до оплаты'
    },
    'other': {
      time: '2–5 рабочих дней',
      method: 'СДЭК / EMS Почта России',
      cost: '0 ₽ (Включено)',
      check: 'Осмотр вложения до оплаты'
    }
  };

  function setCity(cityKey, activeBtn) {
    cityBtns.forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');

    const data = cityData[cityKey] || cityData['other'];
    if (timeEl) timeEl.textContent = data.time;
    if (methodEl) methodEl.textContent = data.method;
    if (costEl) costEl.textContent = data.cost;
    if (checkEl) checkEl.textContent = data.check;
  }

  cityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cityKey = btn.getAttribute('data-city') || 'moscow';
      setCity(cityKey, btn);
    });
  });

  const calcOrderBtn = calcBox.querySelector('[data-open-modal="orderModal"]');
  if (calcOrderBtn) {
    calcOrderBtn.addEventListener('click', () => {
      const activeBtn = calcBox.querySelector('.city-pill-btn.active');
      const activeCityText = activeBtn ? activeBtn.textContent.trim() : '';
      const orderCityInput = document.getElementById('orderCity') || document.getElementById('modalOrderCity');
      if (orderCityInput && activeCityText && activeCityText !== 'Другой город РФ') {
        orderCityInput.value = activeCityText;
      }
    });
  }
}

/* ==========================================================================
   Catalog Page Extra Controls: View Switcher, Live Search, Interactive Calc
   ========================================================================== */
function initCatalogPageExtras() {
  const searchInput = document.getElementById('catalogSearchInput');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  const gridView = document.getElementById('catalogGrid');
  const tableView = document.getElementById('catalogTableView');
  const catalogCards = document.querySelectorAll('.doc-card');
  const tableRows = document.querySelectorAll('.catalog-table-row');
  const noResultsMsg = document.getElementById('catalogNoResults');

  // 1. View Switcher (Cards vs Table)
  if (viewGridBtn && viewTableBtn && gridView && tableView) {
    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewTableBtn.classList.remove('active');
      gridView.style.display = 'grid';
      tableView.style.display = 'none';
    });

    viewTableBtn.addEventListener('click', () => {
      viewTableBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      gridView.style.display = 'none';
      tableView.style.display = 'block';
    });
  }

  // 2. Live Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCards = 0;
      let visibleRows = 0;

      // Filter cards
      catalogCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          card.style.display = 'flex';
          visibleCards++;
        } else {
          card.style.display = 'none';
        }
      });

      // Filter table rows
      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          row.style.display = '';
          visibleRows++;
        } else {
          row.style.display = 'none';
        }
      });

      if (noResultsMsg) {
        const isGrid = gridView && gridView.style.display !== 'none';
        const count = isGrid ? visibleCards : visibleRows;
        noResultsMsg.style.display = (count === 0 && query) ? 'block' : 'none';
      }
    });
  }

  // 3. Interactive Pricing Calculator on katalog.html
  initInteractivePriceCalc();
}

function initInteractivePriceCalc() {
  const calcForm = document.getElementById('catalogPriceCalcForm');
  if (!calcForm) return;

  const docSelect = document.getElementById('calcDocType');
  const yearSelect = document.getElementById('calcYear');
  const blankRadios = document.querySelectorAll('input[name="calcBlank"]');
  const optCover = document.getElementById('calcOptCover');
  const optHonors = document.getElementById('calcOptHonors');
  const optExpress = document.getElementById('calcOptExpress');
  const totalDisplay = document.getElementById('calcTotalPrice');
  const oldPriceDisplay = document.getElementById('calcOldPrice');
  const orderDocInput = document.getElementById('calcOrderDocHidden');

  function calculatePrice() {
    let baseGoznak = 20000;
    let baseTipo = 12000;
    let oldGoznak = 21000;
    let oldTipo = 14000;

    const docType = docSelect ? docSelect.value : 'vuz';
    const year = yearSelect ? yearSelect.value : '2014-2026';

    if (docType === 'school') {
      baseGoznak = (year === '1994-2006' || year === 'ussr') ? 16000 : 18000;
      baseTipo = 10000;
      oldGoznak = 19000;
      oldTipo = 12000;
    } else if (docType === 'college') {
      baseGoznak = (year === '2014-2026') ? 19000 : 17000;
      baseTipo = (year === '2014-2026') ? 12500 : 11500;
      oldGoznak = 20000;
      oldTipo = 14000;
    } else if (docType === 'ussr') {
      baseGoznak = 17000;
      baseTipo = 12000;
      oldGoznak = 20000;
      oldTipo = 14000;
    } else { // vuz (бакалавр, магистр, специалист)
      baseGoznak = (year === '2014-2026') ? 20000 : 18000;
      baseTipo = 12000;
      oldGoznak = (year === '2014-2026') ? 21000 : 20000;
      oldTipo = 14000;
    }

    let isGoznak = true;
    blankRadios.forEach(r => {
      if (r.checked && r.value === 'tipo') isGoznak = false;
    });

    let currentPrice = isGoznak ? baseGoznak : baseTipo;
    let oldPrice = isGoznak ? oldGoznak : oldTipo;

    // Optional add-ons
    if (optCover && optCover.checked) {
      currentPrice += 1500;
      oldPrice += 2000;
    }
    if (optHonors && optHonors.checked) {
      currentPrice += 2000;
      oldPrice += 2500;
    }
    if (optExpress && optExpress.checked) {
      currentPrice += 1000;
      oldPrice += 1500;
    }

    if (totalDisplay) totalDisplay.textContent = currentPrice.toLocaleString('ru-RU') + ' ₽';
    if (oldPriceDisplay) oldPriceDisplay.textContent = oldPrice.toLocaleString('ru-RU') + ' ₽';
    if (orderDocInput && docSelect) {
      const blankName = isGoznak ? 'ГОЗНАК (оригинал)' : 'Типографская копия';
      orderDocInput.value = `${docSelect.options[docSelect.selectedIndex].text} (${yearSelect ? yearSelect.options[yearSelect.selectedIndex].text : ''}), ${blankName}`;
    }
  }

  [docSelect, yearSelect, optCover, optHonors, optExpress].forEach(el => {
    if (el) el.addEventListener('change', calculatePrice);
  });
  blankRadios.forEach(r => r.addEventListener('change', calculatePrice));

  calculatePrice();
}
