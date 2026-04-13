// ========== HEADER UNTUK NGROK (opsional) ==========
fetch(window.location.href, {
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
}).catch(() => console.log('ngrok header skip (not critical)'));

// ========== CONFETTI EFFECT ==========
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let animationId = null;
let particles = [];
let activeConfetti = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function createParticle(x, y) {
    return {
        x: x,
        y: y,
        size: randomRange(4, 10),
        speedX: randomRange(-3, 3),
        speedY: randomRange(2, 6),
        color: `hsl(${randomRange(0, 360)}, 80%, 65%)`,
        rotation: randomRange(0, 360),
        spin: randomRange(-0.2, 0.2),
        life: 1,
        decay: 0.015 + Math.random() * 0.02
    };
}

function startConfettiExplosion(originX, originY) {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    particles = [];
    activeConfetti = true;

    for (let i = 0; i < 100; i++) {
        particles.push(createParticle(originX, originY));
    }

    function drawConfetti() {
        if (!activeConfetti && particles.length === 0) {
            if (animationId) cancelAnimationFrame(animationId);
            animationId = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            p.rotation += p.spin;

            if (p.life <= 0.05 || p.y > canvas.height + 100 || p.x < -100 || p.x > canvas.width + 100) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }

        if (particles.length === 0) {
            activeConfetti = false;
            if (animationId) cancelAnimationFrame(animationId);
            animationId = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        animationId = requestAnimationFrame(drawConfetti);
    }

    drawConfetti();

    setTimeout(() => {
        activeConfetti = false;
    }, 2000);
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

resizeCanvas();

// ========== FUNGSI UNTUK EFEK HEART ==========
function animateLoveHeart() {
    var loveHeart = document.querySelector('.love-heart');
    if (loveHeart) {
        loveHeart.style.animation = 'none';
        setTimeout(function () {
            loveHeart.style.animation = 'heartbeat 1.4s infinite';
        }, 10);
    }
}

// ========== TOMBOL KLIK UNTUK MEMORY 1-4 ==========
const memories = [
    { btn: '.click-btn[data-memory="1"]', msgId: 'hiddenMsg1' },
    { btn: '.click-btn[data-memory="2"]', msgId: 'hiddenMsg2' },
    { btn: '.click-btn[data-memory="3"]', msgId: 'hiddenMsg3' },
    { btn: '.click-btn[data-memory="4"]', msgId: 'hiddenMsg4' }
];

memories.forEach(memory => {
    const btn = document.querySelector(memory.btn);
    if (btn) {
        btn.addEventListener('click', function (event) {
            event.stopPropagation();
            const hiddenMsgDiv = document.getElementById(memory.msgId);
            if (hiddenMsgDiv) {
                hiddenMsgDiv.classList.toggle('show');
                const rect = this.getBoundingClientRect();
                startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
                animateLoveHeart();
            }
        });
    }
});

// ========== TOMBOL SURPRISE ==========
const openSurprise = document.getElementById('openSurpriseBtn');
const surpriseRevealDiv = document.getElementById('surpriseReveal');

if (openSurprise) {
    openSurprise.addEventListener('click', function () {
        surpriseRevealDiv.classList.toggle('show-surprise');

        const rect = this.getBoundingClientRect();
        startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

        const cakeIcon = document.querySelector('.cake-icon');
        if (cakeIcon) {
            cakeIcon.style.transform = 'scale(1.2)';
            setTimeout(function () {
                cakeIcon.style.transform = '';
            }, 300);
        }

        const greetBox = document.getElementById('greetingBox');
        if (greetBox) {
            greetBox.style.transform = 'scale(1.02)';
            setTimeout(function () {
                greetBox.style.transform = '';
            }, 400);
        }

        animateLoveHeart();
    });
}

// ========== MUSIK BACKGROUND ==========
const music = document.getElementById('birthdayMusic');
const musicBtn = document.getElementById('musicToggle');
let isMusicPlaying = false;
let musicErrorCount = 0;

function playMusic() {
    if (!music) return;

    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(function () {
            isMusicPlaying = true;
            if (musicBtn) {
                musicBtn.innerHTML = '🎵 Music On';
                musicBtn.classList.add('playing');
            }
        }).catch(function (error) {
            console.log('Gagal memutar musik:', error);
            isMusicPlaying = false;
            if (musicBtn) {
                musicBtn.innerHTML = '🔇 Music Off';
                musicBtn.classList.remove('playing');
            }
        });
    }
}

function pauseMusic() {
    if (!music) return;
    music.pause();
    isMusicPlaying = false;
    if (musicBtn) {
        musicBtn.innerHTML = '🔇 Music Off';
        musicBtn.classList.remove('playing');
    }
}

if (music) {
    music.addEventListener('ended', function () {
        music.currentTime = 0;
        if (isMusicPlaying) {
            music.play().catch(e => console.log('Gagal memutar ulang:', e));
        }
    });

    music.addEventListener('error', function (e) {
        musicErrorCount++;
        if (musicErrorCount < 3) {
            music.load();
            setTimeout(function () {
                if (isMusicPlaying) playMusic();
            }, 500);
        }
    });
}

if (musicBtn) {
    musicBtn.addEventListener('click', function () {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
}

// ========== AUTOPLAY & INITIAL ==========
window.addEventListener('load', function () {
    console.log('Halaman dimuat - Website Ulang Tahun siap! 🎂');

    setTimeout(function () {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        startConfettiExplosion(centerX, centerY);
    }, 300);

    if (music) {
        music.play().then(function () {
            isMusicPlaying = true;
            if (musicBtn) {
                musicBtn.innerHTML = '🎵 Music On';
                musicBtn.classList.add('playing');
            }
        }).catch(function () {
            console.log('Autoplay diblokir browser - klik tombol musik');
            if (musicBtn) {
                musicBtn.innerHTML = '🔇 Music Off';
            }
        });
    }
});

// Klik di mana saja untuk memulai musik (sekali saja)
document.body.addEventListener('click', function () {
    if (!isMusicPlaying && music && music.paused) {
        playMusic();
    }
}, { once: true });