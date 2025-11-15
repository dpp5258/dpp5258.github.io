// 元素获取
const pauseBtn = document.getElementById('pauseBtn');
const soundControl = document.getElementById('soundControl');
const bgMusic = document.getElementById('bgMusic');
const slides = document.querySelectorAll('.slide');
const playerStatus = document.getElementById('playerStatus');
const slideCaptions = ['😊', '😍', '😂', '😘'];

// 状态变量
let isPlaying = false;
let isMuted = false;
let currentSlide = 0;
let slideTimer; // 用于控制幻灯片轮播的定时器
let isDragging = false;

// 创建爱心浮动元素
function createHearts() {
    const heartCount = 30;
    const heartSymbols = ['❤', '💖', '💘', '💝', '💓'];
    const hearts = []; // 存储所有爱心元素，便于统一管理

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // 随机爱心符号
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // 随机大小和位置
        const size = Math.random() * 20 + 40;
        heart.style.fontSize = `${size}px`;
        heart.style.top = `${Math.random() * 70 + 5}%`;
        heart.style.left = `-${Math.random() * 50 + 20}%`;
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        // 随机动画时间
        const duration = Math.random() * 60 + 20;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${Math.random() * 20}s`;
        
        document.body.appendChild(heart);
        hearts.push(heart);
    }
    
    // 全局定时器统一更新爱心样式（优化性能）
    setInterval(() => {
        hearts.forEach(heart => {
            const newSize = Math.random() * 20 + 16;
            heart.style.fontSize = `${newSize}px`;
            heart.style.opacity = Math.random() * 0.5 + 0.3;
        });
    }, 8000 + Math.random() * 5000);
}

// 切换到下一张幻灯片
function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    playerStatus.textContent = `😍 · ${slideCaptions[currentSlide]}`;
    
    // 如果处于播放状态，继续轮播
    if (isPlaying) {
        slideTimer = setTimeout(nextSlide, 5000);
    }
}

// 切换播放/暂停状态
function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        // 播放状态：更新按钮样式、启动轮播、尝试播放音乐
        pauseBtn.classList.remove('paused');
        playerStatus.textContent = `播放中 · ${slideCaptions[currentSlide]}`;
        slideTimer = setTimeout(nextSlide, 5000);
        if (!isMuted) {
            bgMusic.play().catch(e => console.log('需要用户交互才能播放音乐（浏览器限制）'));
        }
    } else {
        // 暂停状态：更新按钮样式、停止轮播
        pauseBtn.classList.add('paused');
        clearTimeout(slideTimer);
        playerStatus.textContent = `已暂停 · ${slideCaptions[currentSlide]}`;
    }
}

// 切换静音状态
function toggleMute() {
    isMuted = !isMuted;
    
    if (isMuted) {
        // 静音状态：更新按钮样式、静音音频
        soundControl.classList.add('muted');
        bgMusic.muted = true;
    } else {
        // 非静音状态：更新按钮样式、取消静音、尝试播放音乐
        soundControl.classList.remove('muted');
        bgMusic.muted = false;
        if (isPlaying) {
            bgMusic.play().catch(e => console.log('需要用户交互才能播放音乐（浏览器限制）'));
        }
    }
}

// 创建点击/拖动时的文字元素
function createMabiaoText(x, y) {
    const text = document.createElement('div');
    text.classList.add('mabiao-text');
    text.textContent = '李翌';
    
    // 设置位置
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;
    
    document.body.appendChild(text);
    
    // 动画结束后移除元素（避免DOM堆积）
    setTimeout(() => {
        text.remove();
    }, 1500);
}

// 事件监听：播放/暂停按钮点击
pauseBtn.addEventListener('click', togglePlay);

// 事件监听：声音控制按钮点击
soundControl.addEventListener('click', toggleMute);

// 事件监听：页面点击（创建文字，排除控制按钮区域）
document.addEventListener('click', (e) => {
    if (!e.target.closest('.pause-btn') && !e.target.closest('.sound-control')) {
        createMabiaoText(e.clientX, e.clientY);
    }
    
    // 首次点击时尝试播放音乐（解决浏览器自动播放限制）
    if (!isPlaying) {
        bgMusic.play().catch(e => {});
    }
});

// 事件监听：鼠标按下（开始拖动检测）
document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.pause-btn') && !e.target.closest('.sound-control')) {
        isDragging = true;
        createMabiaoText(e.clientX, e.clientY);
    }
});

// 事件监听：鼠标移动（拖动时创建文字，控制密度）
document.addEventListener('mousemove', (e) => {
    if (isDragging && Math.random() > 0.7) { // 控制文字生成频率
        createMabiaoText(e.clientX, e.clientY);
    }
});

// 事件监听：鼠标释放（结束拖动）
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 事件监听：鼠标离开窗口（结束拖动）
document.addEventListener('mouseleave', () => {
    isDragging = false;
});

// 页面加载完成后初始化
window.addEventListener('load', () => {
    createHearts();
    // 延迟1秒启动播放（避免初始加载过于突兀）
    setTimeout(togglePlay, 1000);
});