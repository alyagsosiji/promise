// --- 1. 보안 설정 (우클릭, 단축키, 드래그 완벽 차단) ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) ||
        (event.ctrlKey && (event.key === 'U' || event.key === 'C' || event.key === 'A' || event.key === 'S'))
    ) {
        // 기능은 막지만, 에러 확인을 위해 잠시 주석 처리하거나 지우셔도 됩니다.
        event.preventDefault();
    }
});

// --- 2. 우주 은하수 애니메이션 (안전장치 추가) ---
const canvas = document.getElementById('milkyway-canvas');
let ctx;
let stars = [];
let shootingStars = [];
const maxStars = 200;
const colors = ['#ffffff', '#ffe9c4', '#d4fbff', '#fcd4ff'];

// 캔버스가 HTML에 존재할 때만 배경 애니메이션 실행 (에러 방지)
if (canvas) {
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < maxStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.2,
                alpha: Math.random(),
                speedAlpha: Math.random() * 0.02 + 0.005,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 0.2, 
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }

    function createShootingStar() {
        if (Math.random() > 0.02) return;
        shootingStars.push({
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 20,
            speed: Math.random() * 10 + 5,
            opacity: 1
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < maxStars; i++) {
            let s = stars[i];
            s.alpha += s.speedAlpha;
            if (s.alpha > 1 || s.alpha < 0) s.speedAlpha = -s.speedAlpha;
            s.x += s.vx;
            s.y += s.vy;
            if (s.x < 0) s.x = canvas.width;
            if (s.x > canvas.width) s.x = 0;
            if (s.y < 0) s.y = canvas.height;
            if (s.y > canvas.height) s.y = 0;
            
            ctx.fillStyle = s.color;
            ctx.globalAlpha = Math.max(0, Math.min(s.alpha, 1));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        createShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            let ss = shootingStars[i];
            ss.x -= ss.speed;
            ss.y += ss.speed;
            ss.opacity -= 0.02;
            
            ctx.globalAlpha = Math.max(0, ss.opacity);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x + ss.length, ss.y - ss.length);
            ctx.stroke();
            
            if (ss.opacity <= 0) {
                shootingStars.splice(i, 1);
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    requestAnimationFrame(animateStars);
}

// --- 3. ❤️ 약속 데이터 ---
const promises = [
    {
        date: "2026. 04. 16",
        text: "서로 존중할 하는 것.\n서로 절대 떨어지지 않는 것."
    },
    {
        date: "2026. 06. 28",
        text: "우리가 책임 못질 아이를 가지지 않는 것.\n자책을 하더라도, 그 이유로 떠나지 않는 것.."
    },
    {
        date: "2026. 07. 04",
        text: "행복.\n웃음."
    }
];

// --- 4. 페이지네이션 (안전장치 추가) ---
const itemsPerPage = 3; 
let currentPage = 1;
const maxPageButtons = 5;

const board = document.getElementById('promise-board');
const pageNumbersContainer = document.getElementById('page-numbers');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function displayPromises(page) {
    if (!board) return; // board가 없으면 실행 중지 (에러 방지)
    
    board.innerHTML = "";
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedItems = promises.slice(start, end);

    paginatedItems.forEach(promise => {
        const card = document.createElement('div');
        card.classList.add('promise-card');
        card.innerHTML = `
            <div class="promise-date">${promise.date}</div>
            <div class="promise-text">${promise.text}</div>
        `;
        board.appendChild(card);
    });
}

function setupPagination() {
    if (!pageNumbersContainer || !prevBtn || !nextBtn) return; // 요소 없으면 중지
    
    pageNumbersContainer.innerHTML = "";
    const totalPages = Math.ceil(promises.length / itemsPerPage);
    if(totalPages === 0) return;

    let currentGroup = Math.floor((currentPage - 1) / maxPageButtons);
    let startPage = currentGroup * maxPageButtons + 1;
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-num');
        btn.innerText = i;
        if (i === currentPage) btn.classList.add('active');
        
        btn.addEventListener('click', () => {
            currentPage = i;
            updatePage();
        });
        pageNumbersContainer.appendChild(btn);
    }

    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    };
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    };

    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === totalPages);
}

function updatePage() {
    displayPromises(currentPage);
    setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 최초 실행
updatePage();

// --- 5. 음악 플레이어 ---
const musicDisc = document.getElementById('music-disc');
const bgm = document.getElementById('bgm');

if (musicDisc && bgm) {
    musicDisc.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play().then(() => {
                musicDisc.classList.add('playing');
            }).catch(err => {
                alert("음악 파일(music.mp3)을 찾을 수 없습니다. 경로를 확인해 주세요!");
            });
        } else {
            bgm.pause();
            musicDisc.classList.remove('playing');
        }
    });
}
