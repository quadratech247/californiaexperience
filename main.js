/**
 * California Experience Portal
 * Core Interactive Logic & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CUSTOM LEAPING/MAGNETIC CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  
  let mouse = { x: -100, y: -100 };
  let ringPos = { x: -100, y: -100 };
  
  // Track mouse movements
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Position inner dot instantly
    cursor.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
  });
  
  // Smoothly interpolate (lerp) outer ring position to create trailing effect
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
  
  function animateCursor() {
    ringPos.x = lerp(ringPos.x, mouse.x, 0.15);
    ringPos.y = lerp(ringPos.y, mouse.y, 0.15);
    
    cursorRing.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for interactive elements
  const updateInteractives = () => {
    const interactives = document.querySelectorAll('a, button, .portfolio-item, .filter-btn, .faq-header, .social-btn, .form-input');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });
  };
  updateInteractives();

  // ==========================================
  // PARALLAX BACKGROUND EFFECT ON MOUSEMOVE
  // ==========================================
  const heroImage = document.querySelector('.hero-bg-image');
  if (heroImage) {
    window.addEventListener('mousemove', (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
      heroImage.style.transform = `translate3d(${xAxis}px, ${yAxis}px, 0) scale(1.04)`;
    });
  }


  // ==========================================
  // HERO CANVAS SUN RAY PARTICLE SYSTEM
  // ==========================================
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Keep track of window resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const particles = [];
  const particleCount = Math.min(50, Math.floor(width / 30)); // Scale particles based on screen width
  const connectionDistance = 140;
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 3 + 1;
      
      // Warm California Colors (Sunset Gold, Coral, Sunny Yellow)
      const colors = [
        'rgba(245, 166, 35, 0.45)',  // Sunset Gold
        'rgba(240, 113, 103, 0.45)', // Coral
        'rgba(255, 209, 102, 0.45)'  // Yellow
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off screen boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Draw a soft glowing halo
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('0.45', '0.08');
      ctx.fill();
    }
  }
  
  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();
      
      // Draw soft lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      // Draw light ray line to mouse cursor
      const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
      if (distToMouse < 180) {
        const alpha = (1 - distToMouse / 180) * 0.22;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(240, 113, 103, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
  }
  
  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw subtle grid background helper
    ctx.strokeStyle = 'rgba(245, 166, 35, 0.008)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    drawConnections();
    requestAnimationFrame(renderCanvas);
  }
  renderCanvas();


  // ==========================================
  // SCROLL PROGRESS & STICKY NAVBAR
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercent = (scrollY / docHeight) * 100;
    
    // Update top progress bar
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolledPercent}%`;
    }
    
    // Sticky header shrinkage
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ==========================================
  // MOBILE HAMBURGER MENU TOGGLE
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  
  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ==========================================
  // DESTINATIONS FILTERING LOGIC
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons, apply to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Hide or show matching items with smooth transition
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ==========================================
  // DESTINATIONS DETAIL MODAL POPUP
  // ==========================================
  const detailModal = document.getElementById('detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');
  const modalHighlightsList = document.getElementById('modal-hightlights-list');
  const modalTipText = document.getElementById('modal-tip-text');

  const destinationData = {
    bigsur: {
      title: "Big Sur Coastal Drive",
      img: "assets/california_hero_coastline.png",
      desc: "Big Sur is a rugged stretch of California’s Central Coast between Carmel and San Simeon. Bordered to the east by the Santa Lucia Mountains and to the west by the Pacific Ocean, it’s traversed by two-lane State Route 1, known for winding turns, seaside cliffs, and views of the wild coastline.",
      highlights: [
        "Drive across the iconic 280-foot Bixby Canyon Bridge.",
        "Watch McWay Falls drop 80-feet directly into a pristine turquoise cove.",
        "Hike under giant redwood canopies in Pfeiffer Big Sur State Park.",
        "Look for California Condors and migrating Gray Whales from Point Lobos."
      ],
      tip: "Arrive early in the morning to beat the coastal crowds, and check road conditions beforehand as coastal tides and winter storms can occasionally cause Highway 1 closures."
    },
    yosemite: {
      title: "Yosemite National Park",
      img: "assets/california_yosemite.png",
      desc: "Yosemite National Park is in California’s Sierra Nevada mountains. It’s famed for its giant, ancient sequoia trees, and for Tunnel View, the iconic outlook of towering Bridalveil Fall and the granite cliffs of El Capitan and Half Dome.",
      highlights: [
        "Hike to the misty base of Yosemite Falls, the tallest in North America.",
        "Take panoramic landscape photographs at Tunnel View and Glacier Point.",
        "Climb El Capitan or hike the historic Half Dome cables trail.",
        "Explore Mariposa Grove, home to over 500 mature Giant Sequoias."
      ],
      tip: "Reserve your day-use vehicle permit months in advance if planning a visit on weekends or holidays during spring and summer."
    },
    napavalley: {
      title: "Napa & Sonoma Wine Country",
      img: "assets/project1.png",
      desc: "Napa County is one of the premier wine-producing regions in the world. It’s known for hundreds of hillside vineyards, award-winning Cabernet Sauvignons, and high-end gastronomy (including Michelin-star spots like The French Laundry).",
      highlights: [
        "Tour historic wine caves and taste award-winning Cabernet Sauvignon.",
        "Ride the nostalgic Napa Valley Wine Train through historic vineyards.",
        "Unwind with mineral mud baths and hot springs in Calistoga.",
        "Take a scenic hot-air balloon ride over the misty morning valleys."
      ],
      tip: "Book your estate tastings at least 3-4 weeks in advance. Opt for mid-week tours to get a quieter, more personalized experience with local winemakers."
    },
    hollywood: {
      title: "Hollywood & Los Angeles",
      img: "assets/project2.png",
      desc: "Los Angeles is a sprawling Southern California city and the center of the nation’s film and television industry. From the iconic Hollywood Walk of Fame to the high-end shops of Rodeo Drive, L.A. offers endless cultural energy.",
      highlights: [
        "Stroll along the historic Hollywood Walk of Fame and visit TCL Chinese Theatre.",
        "Gaze through telescopes and see city views at Griffith Observatory.",
        "Shop or dine along trendy Melrose Avenue and Rodeo Drive.",
        "Explore world-class modern art collections at the Getty Center."
      ],
      tip: "For the best view of the Hollywood Sign without hiking, head to the top deck of the Ovation Hollywood shopping center or drive up to Lake Hollywood Park."
    },
    palmsprings: {
      title: "Palm Springs Desert Oasis",
      img: "assets/project4.png",
      desc: "Palm Springs is a desert resort city in Riverside County, California, within the Colorado Desert’s Coachella Valley. The city is famous for its mid-century modern architecture, hot springs, stylish boutique hotels, golf courses, and spas.",
      highlights: [
        "Explore mid-century modern design mansions and architectural tours.",
        "Ride the Palm Springs Aerial Tramway up to the pine forests of Mt. San Jacinto.",
        "Hike through lush palms and rock formations in Indian Canyons.",
        "Relax in natural hot mineral pools and premium desert spas."
      ],
      tip: "Visit between November and April when desert daytime temperatures sit in the comfortable 70s and 80s."
    },
    laketahoe: {
      title: "Lake Tahoe Alpine Waters",
      img: "assets/project3.png",
      desc: "Lake Tahoe is a large freshwater lake in the Sierra Nevada Mountains, straddling the border of California and Nevada. It’s known for its crystal-clear waters, beautiful sandy beaches, and surrounding ski resorts.",
      highlights: [
        "Kayak or paddleboard in the emerald waters of Sand Harbor and Emerald Bay.",
        "Ski or snowboard at world-class mountain resorts during winter.",
        "Hike the Rubicon Trail for sweeping views of alpine cliffs and pine shores.",
        "Take a sunset cruise aboard a historic paddlewheeler."
      ],
      tip: "Summer parking at popular spots like Emerald Bay fills up by 8:00 AM, so plan an early start to secure your spot."
    }
  };

  // Open Modal Logic
  document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const destId = link.getAttribute('data-dest');
      const data = destinationData[destId];
      if (data) {
        // Set content
        modalTitle.innerText = data.title;
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalDesc.innerText = data.desc;
        modalTipText.innerText = data.tip;

        // Render Highlights
        modalHighlightsList.innerHTML = '';
        data.highlights.forEach(h => {
          const li = document.createElement('li');
          li.innerText = h;
          modalHighlightsList.appendChild(li);
        });

        // Open modal
        detailModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop background scroll
      }
    });
  });

  // Close Modal Logic
  const closeModal = () => {
    detailModal.classList.remove('open');
    document.body.style.overflow = ''; // Restore background scroll
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailModal.classList.contains('open')) {
      closeModal();
    }
  });


  // ==========================================
  // FAQ ACCORDION WITH TRANSITIONS
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = '0';
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });


  // ==========================================
  // DYNAMIC STATISTICS COUNTER ANIMATION
  // ==========================================
  const statElements = document.querySelectorAll('.count');
  
  const animateStats = () => {
    statElements.forEach(el => {
      const targetVal = parseFloat(el.getAttribute('data-target'));
      const duration = 2200; // Counter runs for 2.2 seconds
      const startTime = performance.now();
      
      const updateCount = (now) => {
        const elapsedTime = now - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing: cubic easeOut
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeProgress * targetVal;
        
        // Handle rendering
        el.innerText = Math.floor(currentVal);
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = targetVal;
        }
      };
      
      requestAnimationFrame(updateCount);
    });
  };


  // ==========================================
  // SCROLL-REVEAL TRIGGER INTERSECTION OBSERVER
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Run stats counter if hero gets visible
        if (entry.target.classList.contains('hero-content')) {
          animateStats();
        }
        
        // Stop observing once animation triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Register elements for observer
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
  
  // Observe hero content to trigger stats immediately
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    revealObserver.observe(heroContent);
  }


  // ==========================================
  // NAVIGATION LINK ACTIVE SCROLL SYNC
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navAnchorLinks = document.querySelectorAll('.nav-links a:not(.btn)');
  
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180; // offset for nav height
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navAnchorLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================
  // CONTACT FORM INQUIRY SUBMISSION HANDLER
  // ==========================================
  const contactForm = document.getElementById('project-contact-form');
  const formAlert = document.getElementById('form-alert');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Capture form values
      const name = document.getElementById('user-name').value;
      const email = document.getElementById('user-email').value;
      const vibe = document.getElementById('user-vibe').value;
      const message = document.getElementById('user-message').value;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Inquiry... <span class="spinner" style="display:inline-block; animation:float-slow 1.2s infinite linear;">⌛</span>';
      
      fetch("https://formsubmit.co/ajax/hiteshrawat247@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          vibe: vibe,
          message: message
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Form submission failed.');
      })
      .then(data => {
        // Clear form
        contactForm.reset();
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Display visual positive alert
        formAlert.style.display = 'block';
        formAlert.className = 'submit-alert success';
        formAlert.innerText = 'Thank you! Your California experience inquiry has been successfully sent. An escape curator will contact you shortly.';
        
        // Hide alert after 6 seconds
        setTimeout(() => {
          formAlert.style.display = 'none';
          formAlert.className = 'submit-alert';
        }, 6000);
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Display visual error alert
        formAlert.style.display = 'block';
        formAlert.className = 'submit-alert error';
        formAlert.innerText = 'Oops! There was an issue submitting your inquiry. Please try again or email us directly.';
        
        setTimeout(() => {
          formAlert.style.display = 'none';
          formAlert.className = 'submit-alert';
        }, 6000);
      });
    });
  }
  
  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const val = input.value;
      input.value = '';
      alert(`Subscribed! Scenic updates will now be sent to ${val}.`);
    });
  }
  
});
