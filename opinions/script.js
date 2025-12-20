// ===== 深淺色模式切換 + 記錄 =====
const toggle = document.querySelector('.theme-toggle');
const htmlEl = document.documentElement;

// 預設讀取 localStorage
const savedTheme = localStorage.getItem('theme');
if(savedTheme){
  htmlEl.setAttribute('data-theme', savedTheme);
}

toggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next); // 記錄
});

const images = document.querySelectorAll('.zoomable');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const tip = document.getElementById('lightbox-tip');
const counter = document.getElementById('lightbox-counter');

let currentGroup = [];
let currentIndex = 0;

images.forEach(img => {
  img.addEventListener('click', () => {
    const group = img.dataset.group;
    currentGroup = Array.from(document.querySelectorAll(`.zoomable[data-group="${group}"]`));
    currentIndex = currentGroup.indexOf(img);
    showImage();
  });
});

function showImage() {
  lightboxImg.src = currentGroup[currentIndex].src;
  lightbox.classList.add('active');

  // 合併計數與提示
  let message = `${currentIndex + 1} / ${currentGroup.length}`;

  if (currentGroup.length === 1) {
    // 只有一張圖片的情況
    message += ' · 只有一張圖片';
  } else if (currentIndex === 0) {
    message += ' · 已經是第一張';
  } else if (currentIndex === currentGroup.length - 1) {
    message += ' · 已經是最後一張';
  }

  tip.textContent = message;
}

// 點擊圖片時的行為
lightboxImg.addEventListener('click', e => {
  e.stopPropagation();

  if (currentGroup.length === 1) {
    // 只有一張 → 直接關閉
    lightbox.classList.remove('active');
    return;
  }

  const mid = e.target.getBoundingClientRect().width / 2;
  if (e.offsetX < mid && currentIndex > 0) currentIndex--;
  else if (e.offsetX >= mid && currentIndex < currentGroup.length - 1) currentIndex++;
  showImage();
});

lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
document.addEventListener('keydown', e => e.key === 'Escape' && lightbox.classList.remove('active'));

// ===== 回到列表淡出 =====
document.querySelectorAll('.fade-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // 先不要立刻跳轉
    const target = link.href;
    const main = document.querySelector('main');

    main.classList.add('fade-out');

    // 動畫結束後再跳轉
    setTimeout(() => {
      window.location.href = target;
    }, 400); // 要和 CSS 動畫時間一致
  });
});
