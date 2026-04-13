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

// ========== TOMBOL KLIK UNTUK MEMORY 1 ==========
var btn1 = document.querySelector('.click-btn[data-memory="1"]');
if (btn1) {
    btn1.addEventListener('click', function (event) {
        event.stopPropagation();
        var hiddenMsgDiv = document.getElementById('hiddenMsg1');
        if (hiddenMsgDiv) {
            hiddenMsgDiv.classList.toggle('show');
            var rect = this.getBoundingClientRect();
            startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
            animateLoveHeart();
        }
    });
}

// ========== TOMBOL KLIK UNTUK MEMORY 2 ==========
var btn2 = document.querySelector('.click-btn[data-memory="2"]');
if (btn2) {
    btn2.addEventListener('click', function (event) {
        event.stopPropagation();
        var hiddenMsgDiv = document.getElementById('hiddenMsg2');
        if (hiddenMsgDiv) {
            hiddenMsgDiv.classList.toggle('show');
            var rect = this.getBoundingClientRect();
            startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
            animateLoveHeart();
        }
    });
}

// ========== TOMBOL KLIK UNTUK MEMORY 3 ==========
var btn3 = document.querySelector('.click-btn[data-memory="3"]');
if (btn3) {
    btn3.addEventListener('click', function (event) {
        event.stopPropagation();
        var hiddenMsgDiv = document.getElementById('hiddenMsg3');
        if (hiddenMsgDiv) {
            hiddenMsgDiv.classList.toggle('show');
            var rect = this.getBoundingClientRect();
            startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
            animateLoveHeart();
        }
    });
}

// ========== TOMBOL KLIK UNTUK MEMORY 4 ==========
var btn4 = document.querySelector('.click-btn[data-memory="4"]');
if (btn4) {
    btn4.addEventListener('click', function (event) {
        event.stopPropagation();
        var hiddenMsgDiv = document.getElementById('hiddenMsg4');
        if (hiddenMsgDiv) {
            hiddenMsgDiv.classList.toggle('show');
            var rect = this.getBoundingClientRect();
            startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
            animateLoveHeart();
        }
    });
}

// ========== TOMBOL SURPRISE ==========
var openSurprise = document.getElementById('openSurpriseBtn');
var surpriseRevealDiv = document.getElementById('surpriseReveal');

if (openSurprise) {
    openSurprise.addEventListener('click', function () {
        surpriseRevealDiv.classList.toggle('show-surprise');

        var rect = this.getBoundingClientRect();
        startConfettiExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

        var cakeIcon = document.querySelector('.cake-icon');
        if (cakeIcon) {
            cakeIcon.style.transform = 'scale(1.2)';
            setTimeout(function () {
                cakeIcon.style.transform = '';
            }, 300);
        }

        var greetBox = document.getElementById('greetingBox');
        if (greetBox) {
            greetBox.style.transform = 'scale(1.02)';
            setTimeout(function () {
                greetBox.style.transform = '';
            }, 400);
        }

        animateLoveHeart();
    });
}

// ========== MUSIK BACKGROUND (VERSI STABIL) ==========
var music = document.getElementById('birthdayMusic');
var musicBtn = document.getElementById('musicToggle');
var isMusicPlaying = false;
var musicErrorCount = 0;

// Fungsi untuk memutar musik dengan error handling
function playMusic() {
    if (!music) {
        console.log('ERROR: Elemen audio tidak ditemukan');
        return;
    }

    var playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(function () {
            isMusicPlaying = true;
            if (musicBtn) {
                musicBtn.innerHTML = '🎵 Music On';
                musicBtn.classList.add('playing');
            }
            console.log('Musik berhasil diputar');
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

// Fungsi untuk pause musik
function pauseMusic() {
    if (!music) return;
    music.pause();
    isMusicPlaying = false;
    if (musicBtn) {
        musicBtn.innerHTML = '🔇 Music Off';
        musicBtn.classList.remove('playing');
    }
}

// Event listener untuk musik
if (music) {
    // Jika lagu selesai, putar ulang
    music.addEventListener('ended', function () {
        console.log('Lagu selesai, memutar ulang...');
        music.currentTime = 0;
        if (isMusicPlaying) {
            music.play().catch(function (e) {
                console.log('Gagal memutar ulang:', e);
            });
        }
    });

    // Jika error, reload
    music.addEventListener('error', function (e) {
        console.log('ERROR pada musik:', e);
        musicErrorCount++;
        if (musicErrorCount < 3) {
            console.log('Mencoba reload musik...');
            music.load();
            setTimeout(function () {
                if (isMusicPlaying) playMusic();
            }, 500);
        }
    });

    // Jika lagu berhenti karena buffer
    music.addEventListener('stalled', function () {
        console.log('Musik stalled (buffering), mencoba melanjutkan...');
        if (isMusicPlaying && music.paused) {
            setTimeout(function () {
                music.play().catch(function (e) { });
            }, 300);
        }
    });

    // Jika lagu berhenti tiba-tiba
    music.addEventListener('pause', function () {
        if (isMusicPlaying && music.currentTime < music.duration - 0.5) {
            console.log('Musik berhenti di tengah! currentTime:', music.currentTime);
            setTimeout(function () {
                if (isMusicPlaying && music.paused) {
                    music.play().catch(function (e) { });
                }
            }, 500);
        }
    });
}

// Tombol toggle musik
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

    // Konfeti awal
    setTimeout(function () {
        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;
        startConfettiExplosion(centerX, centerY);
    }, 300);

    // Coba autoplay musik
    if (music) {
        music.play().then(function () {
            isMusicPlaying = true;
            if (musicBtn) {
                musicBtn.innerHTML = '🎵 Music On';
                musicBtn.classList.add('playing');
            }
            console.log('Autoplay musik berhasil');
        }).catch(function () {
            console.log('Autoplay diblokir browser - klik tombol musik untuk memutar');
            if (musicBtn) {
                musicBtn.innerHTML = '🔇 Music Off';
            }
        });
    }
});

// Optional: User klik di mana saja untuk memulai musik (sekali saja)
document.body.addEventListener('click', function () {
    if (!isMusicPlaying && music && music.paused) {
        playMusic();
    }
}, { once: true });