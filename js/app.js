document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect
  const navbar = document.querySelector('.navbar-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Curriculum Accordion Handler
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });

  // 3. Modal Registration Overlay Logic
  const modalOverlay = document.getElementById('regModal');
  const ctaTriggers = document.querySelectorAll('.cta-trigger');
  const modalCloseBtn = document.querySelector('.modal-close');
  const registrationForm = document.getElementById('registrationForm');
  const successOverlay = document.getElementById('successOverlay');
  const errorAlert = document.getElementById('errorAlert');

  // Open Modal
  ctaTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    });
  });

  // Close Modal Helper
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll
    // Reset modal view states
    setTimeout(() => {
      registrationForm.style.display = 'block';
      successOverlay.style.display = 'none';
      errorAlert.style.display = 'none';
      registrationForm.reset();
    }, 300);
  };

  modalCloseBtn.addEventListener('click', closeModal);

  // Close on outside click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. Registration Form Submission via localStorage (Github Demo mock)
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';

    // Retrieve input values
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('emailAddress').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const college = document.getElementById('collegeName').value.trim();
    const academic_year = document.getElementById('academicYear').value;
    const major = document.getElementById('majorField').value;

    // Client-side validations
    if (!name || name.length > 100) {
      showError('Please enter a valid full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      showError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!college || college.length > 150) {
      showError('Please enter your college or university name.');
      return;
    }

    if (!academic_year) {
      showError('Please select your academic year.');
      return;
    }

    if (!major) {
      showError('Please select your field of study.');
      return;
    }

    // Mock Database Persistence using localStorage
    try {
      let leads = JSON.parse(localStorage.getItem('demo_leads')) || [];
      const newLead = {
        id: leads.length + 1,
        name,
        email,
        phone,
        college,
        academic_year,
        major,
        created_at: new Date().toISOString()
      };
      
      leads.push(newLead);
      localStorage.setItem('demo_leads', JSON.stringify(leads));

      // Success transition
      registrationForm.style.display = 'none';
      successOverlay.style.display = 'flex';

    } catch (err) {
      console.error('Registration localStorage mock error:', err);
      showError('Failed to capture lead. Please try again.');
    }
  });

  const showError = (msg) => {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  };

  // 5. IntersectionObserver to animate Salary Premium chart bars
  const bars = document.querySelectorAll('.chart-bar-fill');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
        chartObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => chartObserver.observe(bar));
});
