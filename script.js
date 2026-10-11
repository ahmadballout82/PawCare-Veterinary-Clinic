document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS
  ========================== */

  const header = document.getElementById("header")
  const navbar = document.getElementById("navbar")
  const menuToggle = document.getElementById("menuToggle")
  const navLinks = document.querySelectorAll(".nav-link")
  const backToTop = document.getElementById("backToTop")

  const appointmentForm = document.getElementById("appointmentForm")
  const formMessage = document.getElementById("formMessage")
  const appointmentDate = document.getElementById("appointmentDate")

  const currentYear = document.getElementById("currentYear")


  /* =========================
     CURRENT YEAR
  ========================== */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear()
  }


  /* =========================
     APPOINTMENT DATE
  ========================== */

  if (appointmentDate) {

    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    appointmentDate.min = `${year}-${month}-${day}`

  }


  /* =========================
     MOBILE MENU
  ========================== */

  if (menuToggle && navbar) {

    menuToggle.addEventListener("click", () => {

      navbar.classList.toggle("open")
      document.body.classList.toggle("menu-open")

      const icon = menuToggle.querySelector("i")

      if (navbar.classList.contains("open")) {

        icon.classList.remove("fa-bars")
        icon.classList.add("fa-xmark")

      } else {

        icon.classList.remove("fa-xmark")
        icon.classList.add("fa-bars")

      }

    })

  }


  function closeMenu() {

    if (!navbar || !menuToggle) return

    navbar.classList.remove("open")
    document.body.classList.remove("menu-open")

    const icon = menuToggle.querySelector("i")

    if (icon) {
      icon.classList.remove("fa-xmark")
      icon.classList.add("fa-bars")
    }

  }


  navLinks.forEach(link => {

    link.addEventListener("click", () => {
      closeMenu()
    })

  })


  const appointmentButton =
    document.querySelector(".appointment-btn")

  if (appointmentButton) {

    appointmentButton.addEventListener("click", () => {
      closeMenu()
    })

  }


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeMenu()
    }

  })


  document.addEventListener("click", event => {

    if (
      !navbar ||
      !menuToggle ||
      !navbar.classList.contains("open")
    ) {
      return
    }

    if (
      !navbar.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu()
    }

  })


  window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {
      closeMenu()
    }

  })


  /* =========================
     STICKY HEADER
  ========================== */

  function handleHeader() {

    if (!header) return

    if (window.scrollY > 120) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

  }

  handleHeader()

  window.addEventListener("scroll", handleHeader)


  /* =========================
     SMOOTH SCROLL
  ========================== */

  const internalLinks =
    document.querySelectorAll('a[href^="#"]')

  internalLinks.forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href")

      if (!targetId || targetId === "#") {
        return
      }

      const target =
        document.querySelector(targetId)

      if (!target) {
        return
      }

      event.preventDefault()

      const headerHeight =
        header ? header.offsetHeight : 80

      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      })

    })

  })


  /* =========================
     ACTIVE NAVIGATION
  ========================== */

  const sections =
    document.querySelectorAll("section[id]")

  function updateActiveNavigation() {

    let currentSection = ""

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 180

      const sectionBottom =
        sectionTop + section.offsetHeight

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionBottom
      ) {
        currentSection =
          section.getAttribute("id")
      }

    })


    navLinks.forEach(link => {

      link.classList.remove("active")

      if (
        link.getAttribute("href") ===
        `#${currentSection}`
      ) {
        link.classList.add("active")
      }

    })

  }

  updateActiveNavigation()

  window.addEventListener(
    "scroll",
    updateActiveNavigation
  )


  /* =========================
     BACK TO TOP
  ========================== */

  function handleBackToTop() {

    if (!backToTop) return

    if (window.scrollY > 600) {
      backToTop.classList.add("show")
    } else {
      backToTop.classList.remove("show")
    }

  }

  handleBackToTop()

  window.addEventListener(
    "scroll",
    handleBackToTop
  )


  if (backToTop) {

    backToTop.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })

    })

  }


  /* =========================
     APPOINTMENT FORM
  ========================== */

  if (appointmentForm) {

    appointmentForm.addEventListener(
      "submit",
      event => {

        event.preventDefault()

        const ownerName =
          document.getElementById("ownerName")

        const phone =
          document.getElementById("phone")

        const petName =
          document.getElementById("petName")

        const petType =
          document.getElementById("petType")

        const service =
          document.getElementById("service")

        const date =
          document.getElementById("appointmentDate")


        if (
          !ownerName.value.trim() ||
          !phone.value.trim() ||
          !petName.value.trim() ||
          !petType.value ||
          !service.value ||
          !date.value
        ) {

          showMessage(
            "Please complete all required fields.",
            "error"
          )

          return
        }


        if (!validatePhone(phone.value)) {

          showMessage(
            "Please enter a valid phone number.",
            "error"
          )

          phone.focus()

          return
        }


        const selectedDate =
          new Date(`${date.value}T00:00:00`)

        const today = new Date()

        today.setHours(0, 0, 0, 0)


        if (selectedDate < today) {

          showMessage(
            "Please choose a current or future appointment date.",
            "error"
          )

          date.focus()

          return
        }


        const submitButton =
          appointmentForm.querySelector(
            ".form-submit"
          )

        const originalButton =
          submitButton.innerHTML


        submitButton.disabled = true

        submitButton.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Sending Request...'


        setTimeout(() => {

          showMessage(
            `Thank you, ${ownerName.value.trim()}! Your appointment request for ${petName.value.trim()} has been received.`,
            "success"
          )

          appointmentForm.reset()

          submitButton.disabled = false
          submitButton.innerHTML =
            originalButton

        }, 1000)

      }
    )

  }


  function validatePhone(phone) {

    const cleaned =
      phone.replace(/[^\d]/g, "")

    return cleaned.length >= 7

  }


  function showMessage(message, type) {

    if (!formMessage) return

    formMessage.textContent = message

    if (type === "success") {

      formMessage.style.color = "#42aa88"

    } else {

      formMessage.style.color = "#d9534f"

    }

  }


  /* =========================
     SCROLL REVEAL
  ========================== */

  const revealElements =
    document.querySelectorAll(`
      .section-heading,
      .about-images,
      .about-content,
      .service-card,
      .care-content,
      .why-card,
      .team-card,
      .process-card,
      .review-card,
      .appointment-content,
      .appointment-form,
      .contact-card
    `)


  revealElements.forEach(element => {

    element.style.opacity = "0"

    element.style.transform =
      "translateY(35px)"

    element.style.transition =
      "opacity 0.7s ease, transform 0.7s ease"

  })


  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.style.opacity = "1"

            entry.target.style.transform =
              "translateY(0)"

            revealObserver.unobserve(
              entry.target
            )

          }

        })

      },
      {
        threshold: 0.12
      }
    )


  revealElements.forEach(element => {
    revealObserver.observe(element)
  })


  /* =========================
     STATS COUNTER
  ========================== */

  const stats =
    document.querySelectorAll(
      ".stat-item strong[data-target]"
    )

  const statsSection =
    document.querySelector(".stats-section")

  let statsStarted = false


  function startStats() {

    if (
      statsStarted ||
      !statsSection
    ) {
      return
    }

    const rect =
      statsSection.getBoundingClientRect()

    if (
      rect.top <
      window.innerHeight * 0.85
    ) {

      statsStarted = true


      stats.forEach(stat => {

        const target =
          Number(stat.dataset.target)

        const suffix =
          stat.dataset.suffix || ""

        animateCounter(
          stat,
          target,
          suffix
        )

      })

    }

  }


  function animateCounter(
    element,
    target,
    suffix
  ) {

    const duration = 1400

    let startTime = null


    function update(timestamp) {

      if (!startTime) {
        startTime = timestamp
      }

      const progress =
        Math.min(
          (timestamp - startTime) /
          duration,
          1
        )

      const value =
        Math.floor(target * progress)


      element.textContent =
        `${value.toLocaleString()}${suffix}`


      if (progress < 1) {
        requestAnimationFrame(update)
      }

    }


    requestAnimationFrame(update)

  }


  startStats()

  window.addEventListener(
    "scroll",
    startStats
  )


  /* =========================
     SERVICE CARD EFFECT
  ========================== */

  const serviceCards =
    document.querySelectorAll(
      ".service-card:not(.emergency-card)"
    )


  serviceCards.forEach(card => {

    card.addEventListener(
      "mousemove",
      event => {

        const rect =
          card.getBoundingClientRect()

        const x =
          event.clientX - rect.left

        const y =
          event.clientY - rect.top


        card.style.background =
          `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(99, 199, 166, 0.13),
            #ffffff 48%
          )`

      }
    )


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.background =
          "#ffffff"

      }
    )

  })


  /* =========================
     TEAM CARD EFFECT
  ========================== */

  const teamCards =
    document.querySelectorAll(".team-card")


  teamCards.forEach(card => {

    const image =
      card.querySelector(".team-image img")

    if (!image) return


    card.addEventListener(
      "mouseenter",
      () => {

        image.style.transform =
          "scale(1.06)"

      }
    )


    card.addEventListener(
      "mouseleave",
      () => {

        image.style.transform =
          "scale(1)"

      }
    )

  })


  /* =========================
     QUICK SERVICE ICONS
  ========================== */

  const quickServices =
    document.querySelectorAll(".quick-service")


  quickServices.forEach(item => {

    item.addEventListener(
      "mouseenter",
      () => {

        const icon =
          item.querySelector(".quick-icon")

        if (!icon) return

        icon.style.transform =
          "translateY(-4px) rotate(-4deg)"

        icon.style.transition =
          "transform 0.3s ease"

      }
    )


    item.addEventListener(
      "mouseleave",
      () => {

        const icon =
          item.querySelector(".quick-icon")

        if (!icon) return

        icon.style.transform =
          "translateY(0) rotate(0)"

      }
    )

  })


  /* =========================
     FLOATING HERO CARDS
  ========================== */

  const floatingCards =
    document.querySelectorAll(
      ".floating-card"
    )


  floatingCards.forEach(
    (card, index) => {

      card.animate(
        [
          {
            transform:
              "translateY(0)"
          },
          {
            transform:
              "translateY(-9px)"
          },
          {
            transform:
              "translateY(0)"
          }
        ],
        {
          duration:
            3000 + index * 500,

          iterations: Infinity,

          easing: "ease-in-out"
        }
      )

    }
  )


  /* =========================
     REVIEW CARD EFFECT
  ========================== */

  const reviewCards =
    document.querySelectorAll(".review-card")


  reviewCards.forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.style.transform =
          "translateY(-7px)"

        card.style.boxShadow =
          "0 18px 50px rgba(23, 52, 60, 0.12)"

        card.style.transition =
          "0.3s ease"

      }
    )


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transform =
          "translateY(0)"

        card.style.boxShadow =
          ""

      }
    )

  })


  /* =========================
     CONTACT CARD ICON EFFECT
  ========================== */

  const contactCards =
    document.querySelectorAll(".contact-card")


  contactCards.forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        const icon =
          card.querySelector(".contact-icon")

        if (!icon) return

        icon.style.background =
          "#137c8b"

        icon.style.color =
          "#ffffff"

        icon.style.transform =
          "rotate(-6deg) scale(1.05)"

        icon.style.transition =
          "0.3s ease"

      }
    )


    card.addEventListener(
      "mouseleave",
      () => {

        const icon =
          card.querySelector(".contact-icon")

        if (!icon) return

        icon.style.background = ""
        icon.style.color = ""
        icon.style.transform = ""

      }
    )

  })


  /* =========================
     HERO IMAGE PARALLAX
  ========================== */

  const heroImage =
    document.querySelector(".hero-image")


  function heroParallax() {

    if (
      !heroImage ||
      window.innerWidth < 901
    ) {
      return
    }

    const scroll =
      window.scrollY

    if (scroll < 800) {

      heroImage.style.transform =
        `translateY(${scroll * 0.04}px)`

    }

  }


  window.addEventListener(
    "scroll",
    heroParallax
  )

})