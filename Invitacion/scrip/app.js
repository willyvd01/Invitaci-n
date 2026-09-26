/* =========================================================
   A DIFFERENT KIND OF WEEKEND
   Interacciones + animaciones
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------
  // 1. Animaciones GSAP
  // ---------------------------------------------------------
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".topbar", {
      y: -35,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".hero-copy > *", {
      y: 35,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.15,
      ease: "power3.out"
    });

    gsap.from(".orbit-center", {
      scale: 0.6,
      opacity: 0,
      rotation: -10,
      duration: 1.4,
      delay: 0.25,
      ease: "elastic.out(1, 0.65)"
    });

    gsap.to(".ring-1", {
      rotation: 360,
      duration: 28,
      repeat: -1,
      ease: "none"
    });

    gsap.to(".ring-2", {
      rotation: -360,
      duration: 42,
      repeat: -1,
      ease: "none"
    });

    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.fromTo(element,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true
          }
        }
      );
    });
  }

  // ---------------------------------------------------------
  // 2. Efecto 3D suave en tarjetas
  // ---------------------------------------------------------
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -7;
      const rotateY = ((x / rect.width) - 0.5) * 7;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ---------------------------------------------------------
  // 3. Botones magnéticos
  // ---------------------------------------------------------
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });

  // ---------------------------------------------------------
  // 4. Parallax del mouse (o deriva suave en móvil) para ambiente tropical
  // ---------------------------------------------------------
  const auroras = document.querySelectorAll(".aurora");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasFinePointer) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;

      auroras.forEach((item, index) => {
        item.style.transform = `translate(${x * (index + 1)}px, ${y * (index + 1)}px)`;
      });
    });
  } else if (!prefersReducedMotion) {
    // En dispositivos táctiles no hay mousemove: las auroras derivan solas
    // muy despacio para que el fondo se sienta vivo también en móvil.
    let driftStart = null;
    const driftAuroras = (timestamp) => {
      if (!driftStart) driftStart = timestamp;
      const t = (timestamp - driftStart) / 1000;
      auroras.forEach((item, index) => {
        const x = Math.sin(t * 0.15 + index) * 22;
        const y = Math.cos(t * 0.12 + index) * 16;
        item.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(driftAuroras);
    };
    requestAnimationFrame(driftAuroras);
  }

  // ---------------------------------------------------------
  // 5. Cuenta regresiva
  // Cambia la fecha si el evento corresponde a otro año.
  // ---------------------------------------------------------
  const eventDate = new Date("2026-11-27T18:00:00-05:00").getTime();

  const updateCountdown = () => {
    const now = Date.now();
    const distance = eventDate - now;

    const values = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    if (distance <= 0) {
      Object.values(values).forEach((el) => {
        if (el) el.textContent = "00";
      });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    values.days.textContent = String(days).padStart(2, "0");
    values.hours.textContent = String(hours).padStart(2, "0");
    values.minutes.textContent = String(minutes).padStart(2, "0");
    values.seconds.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------------------------------------------------------
  // 6. Año del footer
  // ---------------------------------------------------------
  document.querySelector("footer")?.setAttribute("data-ready", "true");
});
