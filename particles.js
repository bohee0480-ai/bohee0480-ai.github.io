window.addEventListener('DOMContentLoaded', () => {
    // 3. ZERO-GRAVITY LIME GREEN PARTICLES
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const hero = document.getElementById('about'); 
        let particlesArray = [];
        
        const sizes = [0.8, 1.2, 1.6, 2.0, 2.5, 3.0, 3.5]; 
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        const numParticles = isMobile ? 150 : isTablet ? 400 : 840;
        
        function initCanvas() {
            if (!hero) return;
            canvas.width = hero.clientWidth;
            canvas.height = hero.clientHeight;
        }
        
        window.addEventListener('resize', initCanvas);
        
        // 마우스 상호작용 설정
        let mouse = {
            x: undefined,
            y: undefined,
            radius: 120 // 파티클이 밀려나는 반경
        };
        
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = sizes[Math.floor(Math.random() * sizes.length)] * 1.5; // 약간 키움
                this.speedX = (Math.random() - 0.5) * 0.4; 
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.shape = Math.random() > 0.5 ? 'cross' : 'square';
            }
            update() {
                // 원래 속도대로 이동
                this.x += this.speedX;
                this.y += this.speedY;
                
                // 마우스 회피(Dodge) 로직
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // 거리가 가까울수록 더 강하게 밀어내기
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        
                        // 마우스 반대 방향으로 가속
                        const directionX = forceDirectionX * force * 5;
                        const directionY = forceDirectionY * force * 5;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
                
                // 화면 밖으로 나가면 반대편에서 나타남 (자연스러운 순환 루프)
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;
            }
            draw() {
                // 현재 바디에 light-mode 클래스가 있는지 확인
                const isLight = document.body.classList.contains('light-mode');
                // 라이트 모드: 비비드 핫 핑크 컬러 / 다크 모드: 기존 라임그린
                ctx.strokeStyle = isLight ? 'rgba(255, 20, 147, 0.85)' : 'rgba(212, 255, 0, 0.7)';
                ctx.lineWidth = 1;
                
                ctx.beginPath();
                if (this.shape === 'cross') {
                    ctx.moveTo(this.x - this.size, this.y);
                    ctx.lineTo(this.x + this.size, this.y);
                    ctx.moveTo(this.x, this.y - this.size);
                    ctx.lineTo(this.x, this.y + this.size);
                } else {
                    ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
                }
                ctx.stroke();
            }
        }
        
        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        let isHeroVisible = true;
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeroVisible = entry.isIntersecting;
            });
        }, { threshold: 0 });
        heroObserver.observe(hero);

        function animateParticles() {
            if (isHeroVisible) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                    particlesArray[i].draw();
                }
            }
            requestAnimationFrame(animateParticles);
        }
        
        initCanvas();
        initParticles();
        animateParticles();
    }
});
