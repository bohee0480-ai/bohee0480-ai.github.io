window.addEventListener('DOMContentLoaded', () => {
    // 1. 캔버스 초기화
    const canvas = document.createElement('canvas');
    canvas.id = 'character-canvas';
    const hero = document.getElementById('about');
    if (!hero) return;
    
    // 파티클 캔버스 위에 추가
    hero.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Audio Context for UI Sounds
    let audioCtx = null;
    function playScanSound() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {}); // ignore promise rejection
            }
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine'; // 부드러운 스캔 소리
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } catch(e) {
            console.log("Audio play error (user interaction required):", e);
        }
    }
    
    // 2. 글씨/이미지(플랫폼) 장애물 데이터 수집
    let platforms = [];
    
    // 매 프레임 갱신을 위해 DOM 요소를 캐싱해둡니다.
    let centerImgCache = null;
    let spheresCache = null;

    const updatePlatforms = () => {
        platforms = [];
        const heroRect = hero.getBoundingClientRect();
        
        // 캐싱 안 되어있으면 찾기
        if (!centerImgCache) centerImgCache = document.querySelector('.center-anchor img');
        if (!spheresCache) spheresCache = document.querySelectorAll('.mini-text-sphere');
        
        // 1. 중앙 프로필 사진 (정적 발판)
        if (centerImgCache) {
            const rect = centerImgCache.getBoundingClientRect();
            platforms.push({
                x: rect.left - heroRect.left,
                y: rect.top - heroRect.top,
                w: rect.width,
                h: rect.height
            });
        }
        
        // 2. 4개의 스피어 (동적 발판)
        if (spheresCache) {
            spheresCache.forEach(sphere => {
                const rect = sphere.getBoundingClientRect();
                // 3D 구체이므로 가장자리보다 약간 안쪽을 밟을 수 있도록 히트박스(충돌 영역)를 조절
                platforms.push({
                    x: (rect.left - heroRect.left) + 80,
                    y: (rect.top - heroRect.top) + 80, 
                    w: rect.width - 160,
                    h: rect.height - 160
                });
            });
        }
    };
    
    const resizeCanvas = () => {
        canvas.width = hero.clientWidth;
        canvas.height = hero.clientHeight;
        updatePlatforms();
        if (typeof player !== 'undefined') {
            player.resetPosition();
        }
    };
    
    window.addEventListener('resize', resizeCanvas);
    
    // 초기 지연을 주어 폰트 렌더링 후 플랫폼 위치를 잡음
    setTimeout(resizeCanvas, 500);

    // 3. 키보드 입력 상태
    const keys = {
        KeyA: false, // Left
        KeyD: false, // Right
        KeyW: false, // Jump/Up
        KeyS: false, // Down
        Space: false,
        Shift: false,
        KeyF: false
    };

    window.addEventListener('keydown', (e) => {
        // 게임 키 입력 시 스크롤 방지
        if (['Space', 'KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
            e.preventDefault(); 
        }
        if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
        if (e.code === 'Space') keys.Space = true;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.Shift = true;
    });

    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
        if (e.code === 'Space') keys.Space = false;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.Shift = false;
        
        // F키를 눌렀다 뗄 때 Break 판정
        if (e.code === 'KeyF') {
            keys.KeyF = false;
            player.breakBlock();
        }
    });

    // 4. 캐릭터(Player) 클래스
    class Player {
        constructor() {
            this.w = 42; // 와이어프레임 로봇 크기 (1.5배 확대)
            this.h = 42;
            
            this.x = 100;
            this.y = 100;
            
            this.vx = 0;
            this.vy = 0;
            
            this.speed = 5;
            this.jumpPower = -12;
            this.gravity = 0.6;
            this.friction = 0.8;
            
            this.isGrounded = false;
            this.isClimbing = false;
            this.facingRight = true;
            
            // 글리치 잔상을 위한 궤적 배열
            this.trail = [];
            
            // 콤보 점프 관련 변수
            this.lastJumpTime = 0;
            this.jumpCombo = 0;
        }

        resetPosition() {
            // 시작 위치를 중앙 프로필 사진 위로 설정
            const centerImg = document.querySelector('.center-anchor img');
            if (centerImg && hero) {
                const imgRect = centerImg.getBoundingClientRect();
                const hRect = hero.getBoundingClientRect();
                this.x = (imgRect.left - hRect.left) + imgRect.width / 2 - this.w / 2;
                this.y = (imgRect.top - hRect.top) - this.h - 5;
            } else {
                this.x = 100;
                this.y = 100;
            }
            this.vx = 0;
            this.vy = 0;
            this.trail = [];
        }

        update() {
            // 좌우 이동 (A, D 키)
            if (keys.KeyA) {
                this.vx = -this.speed;
                this.facingRight = false;
            } else if (keys.KeyD) {
                this.vx = this.speed;
                this.facingRight = true;
            } else {
                this.vx *= this.friction; // 마찰력으로 감속
            }

            // 벽타기(Climbing)
            if (keys.Shift && this.isTouchingWall()) {
                this.isClimbing = true;
                this.vy = -3; // 위로 기어오름
            } else {
                this.isClimbing = false;
            }

            // 중력 적용
            if (!this.isClimbing) {
                this.vy += this.gravity;
            }

            // 점프 (Space 또는 W 키) - 콤보 점프 적용
            if ((keys.Space || keys.KeyW)) {
                const now = Date.now();
                // 400ms 이내에 누르면 콤보 증가, 아니면 리셋
                if (now - this.lastJumpTime < 400) {
                    this.jumpCombo++;
                } else {
                    this.jumpCombo = 1;
                }
                
                // 콤보 횟수에 따라 점프력(높이) 증폭
                if (this.jumpCombo === 2) {
                    this.vy = this.jumpPower * 1.5; // 2단 점프 (더 높게)
                } else if (this.jumpCombo >= 3) {
                    this.vy = this.jumpPower * 2.0; // 3단 점프 (가장 높게)
                    this.jumpCombo = 0; // 3단 후 콤보 초기화
                } else {
                    this.vy = this.jumpPower; // 1단 기본 점프
                }
                
                this.lastJumpTime = now;
                keys.Space = false; 
                keys.KeyW = false; 
            }

            // 다음 프레임 위치 예측
            let nextX = this.x + this.vx;
            let nextY = this.y + this.vy;

            let wasGrounded = this.isGrounded;
            this.isGrounded = false;
            let touchingWall = false;

            // 매 프레임마다 움직이는 스피어의 위치를 반영하기 위해 플랫폼 업데이트
            updatePlatforms();

            // 플랫폼 충돌 검사
            for (let p of platforms) {
                // AABB 충돌 확인
                if (nextX < p.x + p.w &&
                    nextX + this.w > p.x &&
                    nextY < p.y + p.h &&
                    nextY + this.h > p.y) {
                    
                    // 위에서 아래로 떨어질 때 (착지)
                    if (this.vy > 0 && this.y + this.h <= p.y + 15) {
                        nextY = p.y - this.h;
                        this.vy = 0;
                        this.isGrounded = true;
                        if (!wasGrounded) playScanSound(); // 착지 효과음
                    } 
                    // 좌우 벽에 부딪힐 때 (떨어질 때나 옆으로 갈 때만 벽으로 인식)
                    else if (this.vy >= 0) {
                        touchingWall = true;
                        if (this.vx > 0 && this.x + this.w <= p.x + 10) {
                            nextX = p.x - this.w;
                            this.vx = 0;
                        } else if (this.vx < 0 && this.x >= p.x + p.w - 10) {
                            nextX = p.x + p.w;
                            this.vx = 0;
                        }
                    }
                }
            }
            this._touchingWall = touchingWall;

            // 캔버스 바닥 경계 처리
            if (nextY + this.h > canvas.height) {
                nextY = canvas.height - this.h;
                this.vy = 0;
                this.isGrounded = true;
                if (!wasGrounded) playScanSound(); // 착지 효과음
            }
            
            // 캔버스 좌우 경계 처리
            if (nextX < 0) nextX = 0;
            if (nextX + this.w > canvas.width) nextX = canvas.width - this.w;

            this.x = nextX;
            this.y = nextY;
            
            // 잔상(Trail) 기록
            if (!this.isGrounded || Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1) {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 6) this.trail.shift();
            } else {
                if (this.trail.length > 0) this.trail.shift();
            }
        }

        isTouchingWall() {
            return this._touchingWall;
        }

        breakBlock() {
            // F키 액션 (현재 포트폴리오에서는 파괴할 객체가 없으므로 비워둡니다)
        }

        draw(ctx) {
            // 1. 글리치 잔상(Trail) 렌더링
            for (let i = 0; i < this.trail.length; i++) {
                const t = this.trail[i];
                const alpha = (i / this.trail.length) * 0.5;
                const offsetX = (Math.random() - 0.5) * 4;
                
                ctx.lineWidth = 1;
                // Red Ghost
                ctx.strokeStyle = `rgba(255, 0, 80, ${alpha})`;
                ctx.strokeRect(t.x - 2 + offsetX, t.y, this.w, this.h);
                // Cyan Ghost
                ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
                ctx.strokeRect(t.x + 2 - offsetX, t.y, this.w, this.h);
            }

            // 2. 본체 디자인 (CRT 모니터 헤드 미니 로봇)
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(1.5, 1.5); // 1.5배 스케일업
            
            // 전체 외형은 순백색(White)으로 설정하여 배경과 확실히 분리
            const bodyColor = '#ffffff'; 
            const eyeColor = '#00f0ff'; // 형광 시안 블루
            
            ctx.strokeStyle = bodyColor;
            ctx.lineWidth = 2; // 스케일의 영향을 받아 선도 1.5배 두꺼워짐 (3px 두께 느낌)
            
            const headW = 28;
            const headH = 20;
            const drawX = 0; // 이미 translate 했으므로 원점은 0,0
            const drawY = 0;
            
            // 모니터 (머리)
            ctx.strokeRect(drawX, drawY, headW, headH);
            
            // 안테나
            ctx.beginPath();
            ctx.moveTo(drawX + headW/2, drawY);
            ctx.lineTo(drawX + headW/2, drawY - 5);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(drawX + headW/2, drawY - 6, 2, 0, Math.PI * 2);
            ctx.fillStyle = eyeColor;
            ctx.fill();

            // 작은 몸통과 다리
            ctx.strokeRect(drawX + 8, drawY + headH, 12, 8);
            
            // 모니터 화면 (검은색)
            ctx.fillStyle = '#050505';
            ctx.fillRect(drawX + 2, drawY + 2, headW - 4, headH - 4);
            
            // 표정(이모티콘) 로직
            let face = "";
            if (!this.isGrounded) {
                face = ">_<"; // 점프 중일 때
            } else if (Math.abs(this.vx) > 0.5) {
                face = "O_O"; // 좌우로 이동할 때
            } else {
                face = "-_-"; // 가만히 서 있을 때
            }
            
            // 모니터 안의 스캐너 눈동자 (이모티콘)
            ctx.font = 'bold 10px "Inter", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = eyeColor;
            
            // 바라보는 방향에 따라 이모티콘 위치 살짝 조정
            const eyeOffsetX = this.facingRight ? 2 : -2;
            const eyeX = drawX + headW/2 + eyeOffsetX;
            const eyeY = drawY + 14;
            ctx.fillText(face, eyeX, eyeY);
            
            // 💡 이동하거나 점프할 때 시안색 레이저 빔 발사 (Cyber-Scanner)
            if (!this.isGrounded || Math.abs(this.vx) > 0.5) {
                const laserLength = 120 + Math.random() * 60; // 120~180 사이로 지지직거리는 길이
                const laserThickness = 1 + Math.random() * 2;
                
                ctx.beginPath();
                // 눈 높이에서 발사
                const startX = eyeX + (this.facingRight ? 8 : -8);
                const endX = eyeX + (this.facingRight ? laserLength : -laserLength);
                
                ctx.moveTo(startX, eyeY - 3);
                ctx.lineTo(endX, eyeY - 3);
                
                // 레이저 광선 글로우(Glow) 효과
                ctx.shadowBlur = 15;
                ctx.shadowColor = eyeColor;
                ctx.lineWidth = laserThickness;
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.7 + Math.random()*0.3})`;
                ctx.stroke();
                
                // 그림자 속성 리셋 (다른 것 그릴 때 영향 안 주도록)
                ctx.shadowBlur = 0;
            }

            // 3. 조작키 텍스트 (사이버 감성)
            ctx.font = 'bold 11px "Inter", monospace';
            ctx.fillStyle = bodyColor;
            ctx.fillText("[A W D]", drawX + headW/2, drawY - 14);
            
            ctx.restore(); // 스케일/트랜스폼 원복
        }
    }

    const player = new Player();

    // 5.5 모바일 터치 조작부 연결 (동적 생성)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 768);
    
    if (isTouchDevice) {
        // 모바일 버튼 HTML을 화면에 삽입
        const controlsHtml = `
        <div class="mobile-controls" id="mobile-controls">
            <button data-key="KeyA">⬅️</button>
            <button data-key="KeyW">⬆️</button>
            <button data-key="KeyD">➡️</button>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', controlsHtml);
        
        const mobileControls = document.getElementById('mobile-controls');
        const controlBtns = mobileControls.querySelectorAll('button');
        controlBtns.forEach(btn => {
            const keyCode = btn.getAttribute('data-key');
            
            // 터치 시작 & 마우스 클릭 (누르는 것과 같음)
            const startPress = (e) => {
                e.preventDefault();
                if (keys.hasOwnProperty(keyCode)) keys[keyCode] = true;
            };
            btn.addEventListener('touchstart', startPress, { passive: false });
            btn.addEventListener('mousedown', startPress);
            
            // 터치 끝 & 마우스 뗌 (떼는 것과 같음)
            const endPress = (e) => {
                e.preventDefault();
                if (keys.hasOwnProperty(keyCode)) keys[keyCode] = false;
            };
            btn.addEventListener('touchend', endPress);
            btn.addEventListener('mouseup', endPress);
            
            // 영역 밖으로 나가면 해제
            btn.addEventListener('mouseleave', endPress);
            btn.addEventListener('touchcancel', endPress);
        });
    }

    // 5. 메인 루프
    const heroSection = document.getElementById('about');
    let isCharacterVisible = true;
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isCharacterVisible = entry.isIntersecting;
            });
        }, { threshold: 0 });
        observer.observe(heroSection);
    }

    const loop = () => {
        if (isCharacterVisible) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            player.update();
            player.draw(ctx);
        }
        requestAnimationFrame(loop);
    };

    loop();
});
