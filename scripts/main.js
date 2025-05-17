import projects from '../data/projects.js';

document.addEventListener("DOMContentLoaded", function () {

  // project list
  const projectList = document.querySelector('.project-list');
  // 데이터 내림차순으로 정렬.. id 기준
  const sortProjects = projects.sort((a, b) => {
    return b.id - a.id;
  });
  // 카드 리스트에 넣을 item 생성
  const projectItems = sortProjects.map((project) => {
    return `
      <div class="project-card fade-item" data-id="${project.id}" data-title="${project.title}">
        <div class="project-header">
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
          <div class="project-summary">
            ${project.summery}
          </div>
        </div> 
      </div>
    `;
  }).join('');
  // 카드리스트에 item 넣긴
  projectList.innerHTML = projectItems;

  // header scroll
  headerScroll();
  window.addEventListener('scroll', headerScroll);
  function headerScroll(){
    const wrap = document.querySelector('.wrap');
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;

    // 스크롤시 scroll 클래스 추가
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
    // 현재 스크롤 위치에 따라 활성화된 섹션의 id를 찾기(헤더높이 제외)
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 52;

      if (scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });
  
    // 현재 활성화된 섹션에 해당하는 링크에 active 클래스 추가
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

  // 프로젝트 모달 컨텐츠 생성하기
  function createProjectModalContent(projectId) {
    const project = projects.find(item => item.id == projectId);
    const wrap = document.createElement('div');
    wrap.classList.add('modal-content');
    wrap.innerHTML = `
      <div class="project-header">
        <div class="project-meta">
          <span class="project-type">${project.type}</span>
          <span class="project-platform">${project.platform}</span>
        </div>
        <div class="skill-badge-list">
          ${project.tools.map(tool => `<span class="badge-item">${tool}</span>`).join('')}
        </div>
        <div class="project-subinfo">
          <span class="project-period">${project.period}</span>
          <span class="project-role">${project.role}</span>
        </div>
      </div>
      <div class="project-detail">
        <h4 class="detail-title">작업 내용</h4>
        <ul class="detail-list">
          ${project.description.map(item => `<li class="list-item">${item}</li>`).join('')}
        </ul>
        <h4 class="detail-title">프로젝트 회고</h4>
        <ul class="detail-list">
          ${project.memory.map(item => `<li class="list-item">${item}</li>`).join('')}
        </ul>
      </div> 
      <div class="btn-area">
        <button class="btn btn-primary size-full" data-link="${project.link}">사이트 바로가기</button>
      </div>
    `;
    return wrap;
  } 

  // 카드 클릭시 모달 열기
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const projectId = card.dataset.id;
    const projectTitle = card.dataset.title;
    card.addEventListener('click', () => {      
      openModal(projectTitle, createProjectModalContent(projectId));

      // 사이트 바로가기 링크 없을때 토스트 팝업 띄우기
      const modalBtn = document.querySelector('.modal .btn');
      modalBtn.addEventListener('click', (e) => {
        const targetLink = e.currentTarget.dataset.link;
        if (targetLink === '') {
          showToast('링크 제공이 불가능한 사이트입니다.');
        } else {
          window.open(targetLink, '_blank');
        }
      });
    });
  });

  // 모달열기
  function openModal(title,contentEl){
    const dimm = document.querySelector('.dimm');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.modal .btn-close');

    // 컨텐츠 셋팅
    const modalTitle = document.querySelector('.modal-title');
    const inner = document.querySelector('.modal-inner');
    const content = document.querySelector('.modal-content');   
    if (content) {
      content.remove(); // 기존내용지우기
    }; 

    modalTitle.innerHTML = title; // 모달 타이틀 추가
    inner.appendChild(contentEl); // 모달 컨텐츠 추가

    dimm.classList.add('active');
    modal.classList.add('active');
    lockScroll(); // 바디스크롤 잠금

    closeBtn.addEventListener('click', closeModal); // 모달 닫기
  }

  // 모달 닫기
  function closeModal(){
    const dimm = document.querySelector('.dimm');
    const modal = document.querySelector('.modal');

    dimm.classList.remove('active');
    modal.classList.remove('active');
    unlockScroll();// 바디스크롤 복구
  }

  // 바디 스크롤 잠금
  function lockScroll() {
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }
  // 바디 스크롤 복구
  function unlockScroll() {
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
    document.body.removeAttribute('data-scroll-y');
  }

  // toast
  const toast = document.querySelector('.toast');
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }


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