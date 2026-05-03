// modal
const modal = {
  el: document.querySelector('.modal-overlay'),
  activeModal: null,

  init() {
    this.setupTriggers()
    this.setupOutsideClick()
  },

  setupTriggers() {
    const triggers = document.querySelectorAll('[data-modal]')
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const modalName = trigger.dataset.modal
        if (modalName === 'close') {
          this.close()
        } else {
          this.open(modalName)
        }
      })
    })
  },

  setupOutsideClick() {
    this.el.addEventListener('click', (event) => {
      if (event.target === this.el) {
        this.close()
      }
    })
  },

  open(name) {
    const targetModal = this.el.querySelector(`[data-template="${name}"]`)

    if (targetModal) {
      this.close(true) // Close any currently active modal
      this.activeModal = targetModal

      this.el.style.display = 'flex' // Show the overlay
      requestAnimationFrame(() => {
        this.el.classList.add('show') // Animate overlay
        this.activeModal.style.display = 'flex' // Show modal content

        // Add animation class to modal content
        requestAnimationFrame(() => {
          this.activeModal.classList.add('show')
        })
      })
    } else {
      console.error(`Modal with name "${name}" not found.`)
    }
  },

  close(onlyModal = false) {
    if (onlyModal) {
      if (this.activeModal) {
        this.activeModal.style.display = 'none' // Fully hide modal content
        this.activeModal.classList.remove('show') // Hide modal content
      }
    } else {
      if (this.activeModal) {
        this.activeModal.classList.remove('show') // Hide modal content
        const modalToHide = this.activeModal // Preserve reference for timeout
        this.activeModal = null

        setTimeout(() => {
          modalToHide.style.display = 'none' // Fully hide after animation
        }, 250) // Match the CSS animation duration
      }

      this.el.classList.remove('show') // Animate overlay
      this.el.addEventListener(
        'transitionend',
        () => {
          if (!this.el.classList.contains('show')) {
            this.el.style.display = 'none' // Fully hide overlay
          }
        },
        { once: true },
      )
    }
  },
}
modal.init()

// Header & Sidebar
const header = document.querySelector('.header')
const sidebar = document.querySelector('.sidebar')
const burgerOpen = document.querySelector('.header__burger-open')
const burgerClose = document.querySelector('.header__burger-close')
const sidebarMenu = document.querySelector('.sidebar__menu')

if (header && sidebar && burgerOpen && burgerClose && sidebarMenu) {
  const menu = header.querySelector('.menu')
  if (menu) {
    sidebarMenu.innerHTML = menu.outerHTML

    // Setup mobile sub-menu toggles
    const mobileHasChildren = sidebarMenu.querySelectorAll(
      '.menu-item-has-children',
    )
    mobileHasChildren.forEach((item) => {
      const link = item.querySelector('a')
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault()
            item.classList.toggle('is-active')
          }
        })
      }
    })
  }

  const toggleMenu = (open) => {
    header.classList.toggle('is-menu-open', open)
    sidebar.classList.toggle('active', open)
    document.body.style.overflow = open ? 'hidden' : ''
  }

  burgerOpen.addEventListener('click', () => toggleMenu(true))
  burgerClose.addEventListener('click', () => toggleMenu(false))

  // Close sidebar on link click
  const sidebarLinks = sidebar.querySelectorAll('a')
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!link.parentElement.classList.contains('menu-item-has-children')) {
        toggleMenu(false)
      }
    })
  })
}

// services
const servicesEl = document.querySelector('.services')
if (servicesEl) {
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count') || '0')
    const suffix = el.getAttribute('data-suffix') || ''
    const duration = 2000
    const start = 0
    const startTime = performance.now()

    const update = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function: easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const current = Math.floor(ease * (target - start) + start)
      el.textContent = current.toLocaleString() + suffix

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  servicesEl.querySelectorAll('.services__stat-value').forEach((el) => {
    observer.observe(el)
  })
}

// Footer
const currentYear = document.getElementById('current-year')
if (currentYear) {
  currentYear.textContent = new Date().getFullYear()
}

// Swiper
let servicesAdvantagesSwiper = new Swiper('.services__advantages .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  breakpoints: {
    1280: {
      slidesPerView: 4,
      spaceBetween: 12,
    },
  },
})

let stepsSwiper = new Swiper('.steps .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  breakpoints: {
    1025: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
  },
})

let reviewsSwiper = new Swiper('.reviews .reviews__swiper .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  navigation: {
    nextEl: '.reviews .swiper-button-next',
    prevEl: '.reviews .swiper-button-prev',
  },
  breakpoints: {
    475: {
      spaceBetween: 15,
    },
    1025: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1340: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
})

// Initialize the fancybox
const fancyboxTriggers = Array.from(
  document.querySelectorAll('[data-fancybox]'),
).filter((trigger) => trigger.dataset.fancybox)
if (fancyboxTriggers) {
  const fancyboxInstances = []
  fancyboxTriggers.forEach((trigger) => {
    const name = trigger.dataset.fancybox
    if (fancyboxInstances.includes(name)) {
      return // Skip if already bound
    }
    // Add the name to the `fancyboxInstances` list
    fancyboxInstances.push(name)
  })
  fancyboxInstances.forEach((name) => {
    Fancybox.bind(`[data-fancybox="${name}"]`, {
      Images: { Panzoom: { maxScale: 3 } },
    })
  })
}

// init phone mask
const phoneMasks = document.querySelectorAll("input[name='phone']")
phoneMasks.forEach((input) => {
  let keyCode
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode)
    let pos = this.selectionStart
    if (pos < 3) event.preventDefault()
    let matrix = '+7 (___) ___-__-__',
      i = 0,
      def = matrix.replace(/\D/g, ''),
      val = this.value.replace(/\D/g, ''),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a
      })
    i = newValue.indexOf('_')
    if (i != -1) {
      i < 5 && (i = 3)
      newValue = newValue.slice(0, i)
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return '\\d{1,' + a.length + '}'
      })
      .replace(/[+()]/g, '\\$&')
    reg = new RegExp('^' + reg + '$')
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue
    if (event.type == 'blur' && this.value.length < 5) this.value = ''

    if (this.value.length == 18 || this.value.length == 0) {
      input.dataset.numbervalid = 'true'
    } else {
      input.dataset.numbervalid = 'false'
    }
  }

  input.addEventListener('input', mask, false)
  input.addEventListener('focus', mask, false)
  input.addEventListener('blur', mask, false)
  input.addEventListener('keydown', mask, false)
})

// form
function successSend() {
  modal.open('success')

  setTimeout(() => {
    modal.close()
  }, 3000)
}

const forms = document.querySelectorAll('.the-form')
forms.forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    successSend()
  })
})
