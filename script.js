// --- 1. 보안 설정 (우클릭, 단축키 방지) ---
// 우클릭 방지
document.addEventListener('contextmenu', event => event.preventDefault());

// 키보드 단축키 방지 (F12, Ctrl+Shift+I, Ctrl+C 등)
document.addEventListener('keydown', event => {
    if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) ||
        (event.ctrlKey && (event.key === 'U' || event.key === 'C'))
    ) {
        event.preventDefault();
    }
});

// --- 2. 가벼운 은하수(별) 생성 ---
const starsContainer = document.getElementById('stars-container');
const starCount = 100; // 기기에 무리가 가지 않는 적절한 개수

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // 화면 곳곳에 랜덤 배치
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 0.5;
    const duration = Math.random() * 3 + 2; // 반짝이는 속도 랜덤
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${duration}s`;
    
    starsContainer.appendChild(star);
}

// --- 3. ❤️ 여기서 약속을 추가하고 수정하세요! ❤️ ---
const promises = [
    {
        date: "2026. 06. 28",
        text: "서로 화가 나도 하루를 넘기지 않고 대화로 풀기 💬"
    },
    {
        date: "2026. 07. 10",
        text: "한 달에 한 번은 서로가 좋아하는 요리 해주기 🍳"
    },
    {
        date: "2026. 08. 01",
        text: "기념일에는 짧게라도 꼭 손 편지 교환하기 💌"
    }
];

// --- 4. 약속 데이터를 화면에 그리기 ---
const board = document.getElementById('promise-board');

promises.forEach(promise => {
    const card = document.createElement('div');
    card.classList.add('promise-card');
    
    card.innerHTML = `
        <div class="promise-date">${promise.date}</div>
        <div class="promise-text">${promise.text}</div>
    `;
    
    board.appendChild(card);
});
