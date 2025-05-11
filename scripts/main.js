import projects from '../data/projects.js';

document.addEventListener("DOMContentLoaded", function () {

  // project list
  const projectList = document.querySelector('.project-list');
  const sortProjects = projects.sort((a, b) => {
    return b.id - a.id;
  });
  const projectItems = sortProjects.map((project) => {
    return `
      <div class="project-card fade-item">
        <div class="card-header">
          <h3 class="project-title">${project.title}</h3>
          <div class="project-meta">
            <span class="project-type">${project.type}</span>
            <span class="project-platform">${project.platform}</span>
          </div>
          <div class="project-subinfo">
            <span class="project-period">${project.period}</span>
            <span class="project-role">${project.role}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-summary">
            <ul class="desc-list">
              ${project.description.map(item => `<li class="desc-item">${item}</li>`).join('')}
            </ul>
          </div>
        </div>            
        <div class="btn-area">
          <button class="btn btn-primary size-full" data-link="${project.link}">사이트 바로가기</button>
        </div>
      </div>
    `;
  }).join('');

  projectList.innerHTML = projectItems;


  // header scroll
  headerScroll();
  window.addEventListener('scroll', headerScroll);
  function headerScroll(){
    const wrap = document.querySelector('.wrap');
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;

    if(scrollY > 0) {
      wrap.classList.add('scrolled');
      header.classList.add('scrolled');
    }else{
      wrap.classList.remove('scrolled');
      header.classList.remove('scrolled');  
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.gnb a');

    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 52;

      if (scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });
  
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
    
        const targetId = link.getAttribute('href').replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
    
        const offsetTop = targetEl.offsetTop - 52;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });
  }


  // fade-in
  gsap.utils.toArray('.section').forEach((section) => {
    const items = section.querySelectorAll('.fade-item');
  
    if (!items.length) return; // fade-item 없으면 스킵
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none none',
        // markers: true,
      }
    });
  
    tl.from(items, {
      opacity: 0,
      y: 20,
      stagger: 0.3,
      duration: 0.7,
      ease: 'power2.out'
    });
  });

  // toast
  const toast = document.querySelector('.toast');
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }
  
  const projectcards = document.querySelectorAll('.project-card');
  projectcards.forEach((card) => {
    const link = card.querySelector('.btn');
    link.addEventListener('click', (e) => {
      const targetLink = e.currentTarget.dataset.link;
      if (targetLink === '') {
        showToast('링크 제공이 불가능한 사이트입니다.');
      } else {
        window.open(targetLink, '_blank');
      }
    });
  });

  // email 
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm(
      'service_9crqtky',  
      'template_iwo5ktp', 
      this,
      '0VPYSPQRj7-2uok2B'
    ).then(() => {
      showToast('메일이 성공적으로 전송되었어요!');
      contactForm.reset();
    }).catch((error) => {
      console.error(error);
      showToast('메일 전송에 실패했어요 😢');
    });
  });
})