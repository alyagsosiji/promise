// --- 1. 보안 설정 (우클릭, 단축키, 드래그 완벽 차단) ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) ||
        (event.ctrlKey && (event.key === 'U' || event.key === 'C' || event.key === 'A' || event.key === 'S'))
    ) {
        event.preventDefault();
    }
});

// --- 2. 고성능 은하수 애니메이션 (Canvas 적용) ---
const canvas = document.getElementById('milkyway-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const maxStars = 150;

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
            size: Math.random() * 1.8 + 0.2,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 신비로운 안개 구름 효과
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    );
    gradient.addColorStop(0, 'rgba(115, 3, 192, 0.15)');
    gradient.addColorStop(0.5, 'rgba(236, 56, 188, 0.05)');
    gradient.addColorStop(1, 'rgba(3, 0, 30, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 별 렌더링
    for (let i = 0; i < maxStars; i++) {
        let s = stars[i];
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.2, Math.min(s.alpha, 1))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    }
    requestAnimationFrame(animateStars);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(animateStars);

// --- 3. ❤️ 약속 데이터 (긴 문장 및 줄바꿈 지원) ---
// 텍스트 안에 \n 을 적으면 화면에서 줄바꿈(엔터)으로 표시됩니다!
const promises = [
    {
        date: "2026. 06. 28",
        text: "서로 화가 나도 하루를 넘기지 않고 대화로 풀기 💬\n서로의 감정을 존중하며 비난하는 말투 대신 예쁘게 말하기로 해요."
    },
    {
        date: "2026. 07. 10",
        text: "한 달에 한 번은 서로가 좋아하는 요리 정성껏 해주기! 🍳\n메뉴 선정부터 장보기, 요리까지 오직 상대방을 위한 시간을 선물합니다."
    },
    {
        date: "2026. 08. 01",
        text: "기념일에는 짧게라도 꼭 진심을 가득 담은 손 편지 교환하기 💌\n평소 쑥스러워 전하지 못했던 고마움과 사랑을 꾹꾹 눌러 담아요."
    },
    {
        date: "2026. 09. 15",
        text: "새로운 곳으로 함께 훌쩍 여행 떠나기 ✈️\n일 년에 최소 두 번은 낯선 도시에서 함께 눈을 뜨고 새로운 추억을 채워가요."
    },
    {
        date: "2026. 10. 31",
        text: "지치고 힘들 때 아무 말 없이 꼬옥 안아주기 🫂\n세상 모두가 내 편이 아닌 것 같을 때도 완벽한 안식처가 되어주기."
    },
    {
        date: "2026. 11. 11",
        text: "6번째 약속입니다.\n화살표를 누르면 페이지가 자연스럽게 6으로 넘어가며 이 글이 보일 거예요."
    },
    {
        date: "2026. 12. 25",
        text: "행복한 크리스마스 맞이하기 🎄\n이렇게 길고 서술형으로 텍스트를 작성해도, 카드가 화면에 맞게 예쁘게 쭉 늘어나며 모든 글을 보여줍니다. 폰이나 PC 어디서든 예쁘게 보여요."
    }
];

// --- 4. 페이지네이션 (5개 단위로 이동) ---
const itemsPerPage = 3; // 한 페이지에 보여줄 약속 개수 (수정 가능)
let currentPage = 1;
const maxPageButtons = 5;

const board = document.getElementById('promise-board');
const pageNumbersContainer = document.getElementById('page-numbers');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function displayPromises(page) {
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
    pageNumbersContainer.innerHTML = "";
    const totalPages = Math.ceil(promises.length / itemsPerPage);
    if(totalPages === 0) return;

    // 현재 1~5페이지 구간인지, 6~10페이지 구간인지 계산
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

    // 화살표 로직
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

    // 1페이지에선 뒤로가기 끄고, 마지막 페이지에선 앞으로가기 끄기
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === totalPages);
}

function updatePage() {
    displayPromises(currentPage);
    setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 넘기면 부드럽게 위로
}
updatePage();

// --- 5. 음악 플레이어 재생/일시정지 ---
const musicDisc = document.getElementById('music-disc');
const bgm = document.getElementById('bgm');

musicDisc.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play().then(() => {
            musicDisc.classList.add('playing');
        }).catch(err => {
            alert("음악 파일(music.mp3)이 폴더에 없거나 브라우저 정책에 의해 재생이 차단되었습니다.");
        });
    } else {
        bgm.pause();
        musicDisc.classList.remove('playing');
    }
});
