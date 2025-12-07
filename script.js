document.addEventListener('DOMContentLoaded', () => {
    // --- SLIDE NAVIGATION ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentSlideNum = document.getElementById('current-slide-num');
    const toggleNotesBtn = document.getElementById('toggle-notes-btn');
    const notesDisplay = document.getElementById('notes-display');
    const currentNoteText = document.getElementById('current-note');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                const noteContent = slide.querySelector('.speaker-notes p').innerHTML;
                currentNoteText.innerHTML = noteContent;
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Progress
        const progress = ((index + 1) / totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
        currentSlideNum.textContent = index + 1;

        // Button States
        prevBtn.style.opacity = index === 0 ? '0.3' : '1';
        nextBtn.style.opacity = index === totalSlides - 1 ? '0.3' : '1';
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide(currentSlide);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide(currentSlide);
        }
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    toggleNotesBtn.addEventListener('click', () => {
        notesDisplay.classList.toggle('hidden');
        toggleNotesBtn.style.color = notesDisplay.classList.contains('hidden') ? '#94a3b8' : '#38bdf8';
    });

    updateSlide(0);

    // --- TIMER ---
    const timerDisplay = document.getElementById('presentation-timer');
    let seconds = 0;

    setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);

    // --- PARTICLE NETWORK BACKGROUND ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Draw connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 - distance / 1000})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();
});
