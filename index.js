document.addEventListener('DOMContentLoaded', () => {
    // === 네비게이션 및 스크롤 UI 동적 생성 ===
    const navUI = `
    <div class="scroll-progress-bar" id="scroll-progress"></div>
    <nav class="section-dots" id="section-dots">
        <a href="#about" class="dot active" data-label="HERO"></a>
        <a href="#work" class="dot" data-label="WORK"></a>
        <a href="#profile" class="dot" data-label="PROFILE"></a>
    </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navUI);

    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar');
    const dots = document.querySelectorAll('.section-dots .dot');

    window.addEventListener('scroll', () => {
        // 1. 스크롤 프로그레스 바
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (scrolled / total) * 100 : 0;
        if(scrollProgress) scrollProgress.style.width = `${progress}%`;

        // 2. 네비게이션 블러 배경 효과
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(26, 26, 26, 0.85)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.backdropFilter = 'none';
            }
        }

        // 3. 현재 위치 섹션 도트 하이라이트
        let currentSectionId = 'about';
        const sections = ['about', 'work', 'profile'];
        for (const id of sections) {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) {
                    currentSectionId = id;
                }
            }
        }
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${currentSectionId}`) {
                dot.classList.add('active');
            }
        });
    });

    // === 메인 페이지 애니메이션 로직 ============================================
    // 0. CYBER PRELOADER BOOT SEQUENCE
    // =========================================
    const preloader = document.getElementById('cyber-preloader');
    const termText = document.getElementById('terminal-text');
    const progBar = document.getElementById('progress-bar');
    const progText = document.getElementById('progress-text');
    
    if (preloader && termText && progBar && progText) {
        const bootLogs = [
            "SYSTEM BOOT INITIATED...",
            "LOADING NEURAL KERNEL... [OK]",
            "INITIALIZING MATRIX GRID...",
            "ESTABLISHING CONNECTION TO BOH.EE...",
            "FETCHING PORTFOLIO ASSETS...",
            "DECRYPTING ARCHIVES...",
            "ACCESS GRANTED."
        ];
        
        let logIndex = 0;
        let progress = 0;
        
        // 터미널 텍스트 타이핑 효과
        const logInterval = setInterval(() => {
            if (logIndex < bootLogs.length) {
                termText.textContent += bootLogs[logIndex] + "\n";
                logIndex++;
            }
        }, 200);

        // 프로그레스 바 & 숫자 업데이트
        const progInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress > 100) progress = 100;
            
            progBar.style.width = `${progress}%`;
            progText.textContent = `${progress < 10 ? '0' : ''}${progress}%`;
            
            if (progress === 100) {
                clearInterval(logInterval);
                clearInterval(progInterval);
                
                // 100% 도달 후 0.5초 뒤 프리로더 숨김 & 히어로 애니메이션 시작
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    
                    // 히어로 섹션 애니메이션 시작
                    if (typeof gsap !== 'undefined') {
                        gsap.from('.line', {
                            y: 100, opacity: 0, duration: 1,
                            stagger: 0.15, ease: 'power3.out'
                        });
                        gsap.from('.scattered-text', {
                            opacity: 0, y: 20, duration: 1,
                            stagger: 0.1, ease: 'power2.out', delay: 0.6
                        });
                    }
                }, 500);
            }
        }, 150);
    } else {
        // 프리로더 없을 경우 일반 히어로 애니메이션
        if (typeof gsap !== 'undefined') {
            gsap.from('.line', { y: 100, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' });
            gsap.from('.scattered-text', { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: 'power2.out', delay: 0.6 });
        }
    }
    
    // =========================================
    // 0.5 3D PLANETARY SYSTEM (Mini Text Spheres)
    // =========================================
    const orbits = document.querySelectorAll('.orbit-container');
    const centerAnchor = document.querySelector('.center-anchor');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    if (orbits.length > 0) {
        let isModalActive = false; // 궤도 정지 여부
        const planets = []; // 물리 엔진을 위한 행성 배열
        
        // --- 1. 각 궤도별 공전(Orbit) 설정 ---
        orbits.forEach((orbit, index) => {
            const isMobile = window.innerWidth < 768;
            
            // 공전 중심점을 4개의 고유 영역으로 완전 분리 (절대 겹치지 않는 안전 지대)
            const isLeftSide = index < 2;
            let centerX, centerY;
            
            if (isMobile) {
                // 모바일: 중앙 이미지가 가려지지 않도록 사방으로 충분히 띄움
                const mobilePositions = [
                    { x: -100, y: -160 },  // 좌상
                    { x:  100, y: -160 },  // 우상
                    { x: -100, y:  160 },  // 좌하
                    { x:  100, y:  160 },  // 우하
                ];
                centerX = mobilePositions[index].x;
                centerY = mobilePositions[index].y;
            } else {
                // 데스크탑: 기존 그대로
                centerX = isLeftSide ? -window.innerWidth * 0.28 : window.innerWidth * 0.28;
                // 위아래로 300px 이상 이격시켜 충돌을 원천 차단
                centerY = (index % 2 === 0 ? -180 : 180); 
            }
            
            // 제자리 근처에서 떠다니도록 작은 궤도 반경 설정
            const distance = isMobile ? 30 : 50; 
            const startAngle = (index * 180) * (Math.PI / 180);
            
            // 공전 속도를 우주처럼 매우 느리게 설정 (거의 떠다니는 느낌)
            const dir = index % 2 === 0 ? 1 : -1;
            const speed = (Math.random() * 0.0006 + 0.0003) * dir; 
            
            // 상하 부유(Bobbing) 효과를 위한 고유 난수와 위상
            const bobbingSpeed = Math.random() * 0.01 + 0.005;
            const bobbingAmount = Math.random() * 20 + 10;
            const bobbingPhase = Math.random() * Math.PI * 2;
            
            const planet = {
                el: orbit,
                orbitRadius: distance,
                centerX: centerX,
                centerY: centerY,
                angle: startAngle,
                angularVelocity: speed,
                bobbingSpeed: bobbingSpeed,
                bobbingAmount: bobbingAmount,
                bobbingPhase: bobbingPhase,
                isHovered: false
            };
            planets.push(planet);

            // --- 2. 미니 스피어(Mini Text Sphere) 자전 설정 ---
            const miniSphere = orbit.querySelector('.mini-text-sphere');
            if (!miniSphere) return;
            
            // 모달 내용 텍스트 추출 (행성을 실제 내용의 텍스트로 구성)
            const word = miniSphere.getAttribute('data-word');
            const targetId = miniSphere.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            let contentWords = [word];
            let words = [word];
            if (targetModal) {
                const contentDiv = targetModal.querySelector('.modal-content');
                if (contentDiv) {
                    const rawText = contentDiv.innerText || contentDiv.textContent;
                    // 알파벳, 숫자 이외의 특수문자 제거 후 2글자 이상 단어만 추출
                    const filteredWords = rawText.replace(/[\n\r]/g, ' ').replace(/[^a-zA-Z0-9가-힣\s]/g, '').split(' ').filter(w => w.trim().length > 2);
                    if (filteredWords.length > 0) {
                        words = filteredWords;
                    }
                }
            }

            const wordCount = window.innerWidth < 768 ? 90 : 180; // 모바일에서는 구체가 작아지므로 텍스트 개수를 적절히 줄임
            const sphereRadius = window.innerWidth < 768 ? 65 : 165; // 미니 구체의 진짜 3D 반경 (모바일 60% 이상 축소)
            const phi = Math.PI * (3 - Math.sqrt(5)); // 피보나치 각도
            
            // 1. 내부 구체(작은 텍스트)를 돌리기 위한 회전 컨테이너 생성
            const innerRotator = document.createElement('div');
            innerRotator.style.position = 'absolute';
            innerRotator.style.width = '100%';
            innerRotator.style.height = '100%';
            innerRotator.style.transformStyle = 'preserve-3d';
            miniSphere.appendChild(innerRotator);
            
            // 2. 외부 띠(큰 텍스트)를 돌리기 위한 회전 컨테이너 생성
            const ringRotator = document.createElement('div');
            ringRotator.style.position = 'absolute';
            ringRotator.style.width = '100%';
            ringRotator.style.height = '100%';
            ringRotator.style.transformStyle = 'preserve-3d';
            miniSphere.appendChild(ringRotator);
            
            const innerElements = []; // 3D 깊이 효과를 위한 배열
            
            // 피보나치 구면 알고리즘으로 내부 작은 텍스트들을 둥근 표면에 부착
            for (let i = 0; i < wordCount; i++) {
                const y = 1 - (i / (wordCount - 1)) * 2;
                const calcRadius = Math.sqrt(1 - y * y);
                const theta = phi * i;
                
                const x = Math.cos(theta) * calcRadius;
                const z = Math.sin(theta) * calcRadius;
                
                const el = document.createElement('div');
                el.className = 'mini-word scramble-text';
                el.setAttribute('data-word', words[i % words.length]);
                el.textContent = el.getAttribute('data-word');
                
                const lat = Math.asin(y); 
                const lon = Math.atan2(z, x); 
                
                const rotY = lon * (180 / Math.PI);
                const rotX = -lat * (180 / Math.PI);
                
                el.style.transform = `translate(-50%, -50%) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${sphereRadius}px)`;
                el.style.backfaceVisibility = 'hidden'; // 뒷면을 가려서 GPU 최적화 및 완벽한 입체감 구현
                el.style.webkitBackfaceVisibility = 'hidden';
                innerRotator.appendChild(el);
                
                // 수학적 위치 정보 저장
                innerElements.push({ el, lat, lon });
            }
            
            // 외부 띠(Ring)에 메인 텍스트 둘러치기 (적도 부근)
            const ringItemCount = 5; // 띠를 구성할 텍스트 갯수
            const ringRadius = window.innerWidth < 768 ? 90 : 200; // 모바일에서는 구체 반경(65)보다 큰 90으로 설정
            const ringElements = [];
            for (let i = 0; i < ringItemCount; i++) {
                const el = document.createElement('div');
                el.className = 'ring-word';
                el.innerText = word;
                
                const angle = (i / ringItemCount) * 360;
                const rad = angle * (Math.PI / 180);
                el.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${ringRadius}px)`;
                el.style.backfaceVisibility = 'hidden';
                el.style.webkitBackfaceVisibility = 'hidden';
                ringRotator.appendChild(el);
                
                ringElements.push({ el, lon: rad });
            }
            
            // 각각 반대 방향으로 회전하는 애니메이션
            let currentInnerRotY = Math.random() * 360; 
            let currentRingRotY = Math.random() * 360; 
            let currentRotX = 15; // 살짝 위에서 내려다보는 입체 각도
            
            const innerSpinSpeed = 0.05; // 내부 구체 자전 속도 대폭 하향 (-)
            const ringSpinSpeed = 0.08; // 외부 띠 자전 속도 대폭 하향 (+)
            let isHovered = false;
            
            function spinMiniSphere() {
                if (!isModalActive) {
                    // 옵션 3: 호버 시 자전 속도를 8배 가속시켜 다이나믹한 상호작용
                    const currentInnerSpeed = isHovered ? innerSpinSpeed * 8 : innerSpinSpeed;
                    const currentRingSpeed = isHovered ? ringSpinSpeed * 8 : ringSpinSpeed;
                    
                    currentInnerRotY -= currentInnerSpeed; 
                    currentRingRotY += currentRingSpeed; 
                    
                    innerRotator.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentInnerRotY}deg)`;
                    ringRotator.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRingRotY}deg)`;
                }
                requestAnimationFrame(spinMiniSphere);
            }
            spinMiniSphere();
            
            // --- 3. 인터랙션 ---
            miniSphere.addEventListener('mouseenter', () => { 
                isHovered = true;
                planet.isHovered = true;
            });
            miniSphere.addEventListener('mouseleave', () => { 
                isHovered = false;
                planet.isHovered = false;
            });
            
            // 모달 열기 (클릭 폭발)
            miniSphere.addEventListener('click', () => {
                const targetId = miniSphere.getAttribute('data-target');
                const targetModal = document.getElementById(targetId);
                if (targetModal) {
                    centerAnchor.classList.add('blurred');
                    targetModal.classList.add('active');
                    isModalActive = true;
                }
            });
        });
        
        // 둥둥 떠다니는 상하 운동(Bobbing)을 위한 타이머
        let globalTime = 0;

        // 궤도(공전) 애니메이션
        function animateOrbits() {
            globalTime++;
            if (!isModalActive) {
                // 위치 업데이트 (충돌 로직 제거, 각자의 안전 궤도에서 유영)
                planets.forEach((p, index) => {
                    if (!p.isHovered) {
                        p.angle += p.angularVelocity;
                    }
                    
                    // 상하로 천천히 부유하는 움직임 (둥둥 떠다니는 느낌)
                    const bobbingY = Math.sin(globalTime * p.bobbingSpeed + p.bobbingPhase) * p.bobbingAmount;
                    
                    // 각자 할당된 안전한 고유 중심축을 기준으로 궤도 이동 + 상하 부유 적용
                    p.x = p.centerX + Math.cos(p.angle) * p.orbitRadius;
                    p.y = p.centerY + Math.sin(p.angle) * p.orbitRadius + bobbingY;
                    
                    p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
                });
            }
            requestAnimationFrame(animateOrbits);
        }
        animateOrbits();
        
        // 닫기 버튼 공통 처리
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.sphere-modal');
                if (modal) {
                    modal.classList.remove('active');
                    centerAnchor.classList.remove('blurred');
                    isModalActive = false;
                }
            });
        });
        
        // 배경 클릭 닫기
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sphere-modal')) {
                e.target.classList.remove('active');
                centerAnchor.classList.remove('blurred');
                isModalActive = false;
            }
        });
    }
    
    // =========================================
    // SCROLLTRIGGER TEXT SCRAMBLE
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const chars = "!<>-_\\\\/[]{}—=+*^?#_";
        const scrambleElements = document.querySelectorAll('.scramble-text');
        
        scrambleElements.forEach(el => {
            const originalHTML = el.innerHTML;
            const originalText = el.textContent;
            
            ScrollTrigger.create({
                trigger: el,
                start: "top 85%", // 화면 아래 85% 지점에 들어오면 시작
                onEnter: () => {
                    let iterations = 0;
                    const interval = setInterval(() => {
                        el.textContent = originalText.split("")
                            .map((letter, index) => {
                                if(index < iterations) return originalText[index];
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join("");
                        
                        if(iterations >= originalText.length) {
                            clearInterval(interval);
                            el.innerHTML = originalHTML; // 원래 HTML(br 태그 포함) 복구
                        }
                        
                        iterations += 1;
                    }, 30);
                },
                once: true // 한 번만 실행
            });
        });
    }

    const soundBtns = document.querySelectorAll('.sound-toggle-btn');
    
    soundBtns.forEach(soundBtn => {
        soundBtn.textContent = '🔇 SOUND OFF';
        
        soundBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find parent container that holds videos
            const container = soundBtn.closest('.project-slider') || soundBtn.closest('.video-wrapper');
            if (!container) return;
            
            // project-slider (01, 02, 03): left-side video only sound toggle
            const slider = soundBtn.closest('.project-slider');
            if (slider) {
                const leftVideo = slider.querySelector('.left-side video');
                const rightVideo = slider.querySelector('.right-side video');
                
                // Right video always muted
                if (rightVideo) {
                    rightVideo.muted = true;
                }
                
                // Toggle left video only
                if (leftVideo) {
                    leftVideo.muted = !leftVideo.muted;
                    if (!leftVideo.muted) {
                        leftVideo.volume = 1.0;
                    }
                    soundBtn.textContent = leftVideo.muted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
                }
                return;
            }
            
            // video-wrapper (04, 05, 06): single video toggle
            const videos = container.querySelectorAll('video');
            let isMuted = true;
            videos.forEach(video => {
                video.muted = !video.muted;
                if (!video.muted) {
                    video.volume = 1.0;
                }
                isMuted = video.muted;
            });
            // Update text to show current state
            soundBtn.textContent = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
        });
        soundBtn.addEventListener('mousedown', e => e.stopPropagation());
        soundBtn.addEventListener('touchstart', e => e.stopPropagation(), {passive: true});
    });

    const sliders = document.querySelectorAll('.project-slider');
    
    sliders.forEach(slider => {
        let isDown = false;
        
        const moveSlider = (e) => {
            if (!isDown) return;
            const rect = slider.getBoundingClientRect();
            let x = 0;
            
            if (e.type.includes('mouse')) {
                x = e.clientX - rect.left;
            } else if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
            }
            
            let percentage = (x / rect.width) * 100;
            percentage = Math.max(0, Math.min(percentage, 100)); // 0~100 limit
            
            const leftSide = slider.querySelector('.left-side');
            const handle = slider.querySelector('.slider-handle');
            
            if (leftSide) {
                leftSide.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
                leftSide.style.webkitClipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            }
            if (handle) handle.style.left = `${percentage}%`;
        };

        // Desktop mouse events
        slider.addEventListener('mousedown', (e) => { 
            isDown = true; 
            moveSlider(e);
        });
        window.addEventListener('mouseup', () => { isDown = false; });
        window.addEventListener('mousemove', moveSlider);

        // Mobile touch events
        slider.addEventListener('touchstart', (e) => { 
            isDown = true; 
            moveSlider(e);
        }, { passive: true });
        window.addEventListener('touchend', () => { isDown = false; });
        window.addEventListener('touchmove', moveSlider, { passive: true });
    });

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                themeToggle.textContent = 'DARK MODE';
            } else {
                themeToggle.textContent = 'LIGHT MODE';
            }
        });
    }


    // Blueprint Canvas Animation (Matrix Coding Numbers)
    const blueprintCanvas = document.getElementById('blueprint-canvas');
    if (blueprintCanvas) {
        const bpCtx = blueprintCanvas.getContext('2d');
        
        const spacing = 24; // 그리드 간격
        let bpNumbers = [];
        
        function initBlueprintNumbers() {
            bpNumbers = [];
            // 그리드의 각 칸 중앙에 숫자 배치
            for (let y = 0; y < blueprintCanvas.height; y += spacing) {
                for (let x = 0; x < blueprintCanvas.width; x += spacing) {
                    // 화면을 꽉 채우면 너무 답답할 수 있으니 40% 확률로만 숫자 생성
                    if (Math.random() > 0.6) {
                        bpNumbers.push({
                            x: x + spacing / 2,
                            y: y + spacing / 2,
                            char: Math.random() > 0.5 ? '0' : '1',
                            opacity: Math.random() * 0.3, // 초기 투명도
                            speed: (Math.random() * 0.01) + 0.005, // 깜빡이는 속도
                            direction: Math.random() > 0.5 ? 1 : -1
                        });
                    }
                }
            }
        }

        function resizeBlueprint() {
            blueprintCanvas.width = window.innerWidth;
            blueprintCanvas.height = window.innerHeight;
            initBlueprintNumbers();
        }
        
        window.addEventListener('resize', resizeBlueprint);
        
        // 초기화
        blueprintCanvas.width = window.innerWidth;
        blueprintCanvas.height = window.innerHeight;
        initBlueprintNumbers();
        
        function animateBlueprint() {
            bpCtx.clearRect(0, 0, blueprintCanvas.width, blueprintCanvas.height);
            
            const isLight = document.body.classList.contains('light-mode');
            const color = isLight ? '0, 0, 0' : '255, 255, 255';
            
            bpCtx.font = "11px 'Inter', monospace";
            bpCtx.textAlign = "center";
            bpCtx.textBaseline = "middle";
            
            for (let i = 0; i < bpNumbers.length; i++) {
                let num = bpNumbers[i];
                
                // 밝기 업데이트
                num.opacity += num.speed * num.direction;
                
                // 최대/최소 투명도 도달 시 반전
                if (num.opacity >= 0.30) {
                    num.opacity = 0.30;
                    num.direction = -1;
                } else if (num.opacity <= 0) {
                    num.opacity = 0;
                    num.direction = 1;
                    // 안 보일 때 숫자 랜덤하게 변경 (데이터가 흐르는 느낌)
                    num.char = Math.random() > 0.5 ? '0' : '1';
                }
                
                if (num.opacity > 0) {
                    bpCtx.fillStyle = `rgba(${color}, ${num.opacity})`;
                    bpCtx.fillText(num.char, num.x, num.y);
                }
            }
            
            requestAnimationFrame(animateBlueprint);
        }
        
        animateBlueprint();
    }

    // =========================================
    // CUSTOM CURSOR LOGIC (Cyberpunk HUD)
    // =========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorCyan = document.querySelector('.cursor-cyan');
    const cursorMagenta = document.querySelector('.cursor-magenta');
    const cursorCoords = document.querySelector('.cursor-coords');
    
    if (cursorDot && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let prevMouseX = mouseX;
        let prevMouseY = mouseY;
        
        // 글리치 잔상을 위한 개별 좌표
        let cyanX = mouseX;
        let cyanY = mouseY;
        let magentaX = mouseX;
        let magentaY = mouseY;
        
        let idleTimer = null;
        let isIdle = false;

        // 마우스 이동 감지
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // 2. 유휴 상태(Idle) 타이머 리셋
            if (isIdle) {
                isIdle = false;
                cursorRing.classList.remove('idle');
            }
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (!cursorRing.classList.contains('hovered')) {
                    isIdle = true;
                    cursorRing.classList.add('idle');
                }
            }, 1500); // 1.5초간 가만히 있으면 레이더 모드 발동
            
            // 3. 실시간 좌표 데이터 업데이트
            if (cursorCoords) {
                cursorCoords.style.left = `${mouseX}px`;
                cursorCoords.style.top = `${mouseY}px`;
                // 패딩을 맞춰서 글자가 덜덜거리지 않게 0 채우기
                const strX = String(mouseX).padStart(4, '0');
                const strY = String(mouseY).padStart(4, '0');
                cursorCoords.textContent = `[X: ${strX}, Y: ${strY}]`;
            }
        });

        // 링(Ring) 추적 및 속도 비례 변형 (Velocity Stretch)
        function animateCursor() {
            // 속도(Velocity) 및 이동 각도(Angle) 계산
            const dx = mouseX - prevMouseX;
            const dy = mouseY - prevMouseY;
            const velocity = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            // 3. 속도가 빠를수록 X축으로 늘어나고 Y축으로 얇아짐 (Motion Blur)
            // atan2 각도가 -180~180을 오갈 때 CSS transition이 걸려 있으면 빙글 도는 버그가 생기므로 CSS에서 transition을 뺌
            const scaleX = 1 + Math.min(velocity * 0.04, 2.5);
            const scaleY = 1 - Math.min(velocity * 0.01, 0.6);
            
            const transformString = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
            
            // 4. 메인 커서는 마우스를 즉시 따라감
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            cursorDot.style.transform = transformString;
            
            // 5. 시안/마젠타 글리치 잔상은 약간의 딜레이를 두고 따라옴 (JS Lerp)
            cyanX += (mouseX - cyanX) * 0.35;
            cyanY += (mouseY - cyanY) * 0.35;
            magentaX += (mouseX - magentaX) * 0.2;
            magentaY += (mouseY - magentaY) * 0.2;
            
            if (cursorCyan) {
                cursorCyan.style.left = `${cyanX}px`;
                cursorCyan.style.top = `${cyanY}px`;
                cursorCyan.style.transform = transformString;
            }
            if (cursorMagenta) {
                cursorMagenta.style.left = `${magentaX}px`;
                cursorMagenta.style.top = `${magentaY}px`;
                cursorMagenta.style.transform = transformString;
            }
            
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            
            // 링은 Lerp로 부드럽게 쫓아옴
            ringX += (mouseX - ringX) * 0.15; 
            ringY += (mouseY - ringY) * 0.15;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // 호버(Hover) 효과 (조준점 모핑)
        const hoverElements = document.querySelectorAll('.mini-text-sphere, a, button, .slider-handle, .btn-outline, .theme-toggle, [role="button"], .project-slider, .video-wrapper, .tool-tags span');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovered');
                cursorRing.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
            });
        });

        // 6. Profile Cards 벤토 박스 마우스 스포트라이트(Spotlight) 효과
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // 카드 내부의 로컬 X 좌표
                const y = e.clientY - rect.top;  // 카드 내부의 로컬 Y 좌표
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.setProperty('--spotlight-opacity', '0.08');
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--spotlight-opacity', '0');
            });
        });
    }

    // =========================================
    // GLOBAL UI SOUND SYSTEM (Hover Clicks & Scroll)
    // =========================================
    let globalAudioCtx = null;
    let soundSystemReady = false;
    
    // 부팅 시에는 조용히 하고 3.5초(프리로더 이후)부터 스크롤 사운드 활성화
    setTimeout(() => { soundSystemReady = true; }, 3500);
    
    function initGlobalAudio() {
        if (!globalAudioCtx) {
            try { globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch (e) { return; }
        }
        if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume().catch(() => {});
        }
    }
    
    function playHoverSound() {
        if (!globalAudioCtx) initGlobalAudio();
        if (!globalAudioCtx || globalAudioCtx.state === 'suspended') return;
        
        try {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            
            // 사이버펑크 틱(Tick) 사운드 설정 (아주 짧은 기계음)
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, globalAudioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, globalAudioCtx.currentTime + 0.02);
            
            gain.gain.setValueAtTime(0, globalAudioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, globalAudioCtx.currentTime + 0.03);
            
            osc.connect(gain);
            gain.connect(globalAudioCtx.destination);
            
            osc.start();
            osc.stop(globalAudioCtx.currentTime + 0.03);
        } catch (e) {}
    }

    function playSectionScrollSound() {
        if (!soundSystemReady) return;
        if (!globalAudioCtx) initGlobalAudio();
        if (!globalAudioCtx || globalAudioCtx.state === 'suspended') return;
        
        try {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            
            // 사이버 스크롤 알림음 (우웅- 하는 기계 스캔 소리)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, globalAudioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, globalAudioCtx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0, globalAudioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.015, globalAudioCtx.currentTime + 0.02);
            gain.gain.linearRampToValueAtTime(0, globalAudioCtx.currentTime + 0.15);
            
            osc.connect(gain);
            gain.connect(globalAudioCtx.destination);
            
            osc.start();
            osc.stop(globalAudioCtx.currentTime + 0.15);
        } catch (e) {}
    }

    // 1. 호버 사운드 이벤트 등록
    const soundHoverElements = document.querySelectorAll('a, button, .slider-handle, .btn-outline, .theme-toggle, [role="button"], .project-slider, .video-wrapper');
    soundHoverElements.forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
    });

    // 2. 스크롤 섹션 진입 사운드 등록 (IntersectionObserver)
    const scrollSections = document.querySelectorAll('section, header, footer');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playSectionScrollSound();
            }
        });
    }, { threshold: 0.15 });
    
    scrollSections.forEach(sec => scrollObserver.observe(sec));

    // 화면 클릭 시 AudioContext 최초 1회 강제 활성화 (브라우저 보안 정책 우회)
    window.addEventListener('click', initGlobalAudio, { once: true });

    // =========================================
    // 3D MAIN TEXT RING (Marquee Replacement)
    // =========================================
    const marqueeContainer = document.querySelector('.marquee-container');
    if (marqueeContainer) {
        // 원래 텍스트 가져오기 (기존 텍스트 구조 유지하되 숨김)
        const textContent = 'DIGITAL COUTURE /// 3D VIRTUAL CLOTHING /// TEXTILE ALGORITHMS /// VIRTUAL FASHION ARCHIVE /// DESIGNED BY LEE BOHEE ///';
        
        // 3D 씬 컨테이너
        const scene = document.createElement('div');
        scene.className = 'marquee-scene';
        
        // 회전할 링
        const ring = document.createElement('div');
        ring.className = 'marquee-ring3d';
        
        // 텍스트를 적당한 길이로 반복해서 원을 채움 (좌우로 넓게 퍼지도록 3번 반복으로 증가)
        const fullString = (textContent + ' ').repeat(3);
        const chars = fullString.split('');
        const totalChars = chars.length;
        
        // 반지름 계산 (글자 수와 자간(letter-spacing) 고려)
        // font-size 1.5rem (대략 24px) 기준 글자 하나당 차지하는 너비를 대략 16px로 잡음
        const radius = (totalChars * 16) / (2 * Math.PI); 
        
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'marquee-char';
            
            // 각도 계산 (360도를 글자 수로 나눔)
            const angle = (i / totalChars) * 360;
            
            // 3D 공간 배치: Y축으로 회전 후 Z축(반지름)으로 밀어냄
            span.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
            
            // 뎁스(Blur) 애니메이션 동기화 (수학적 렌더링 버그 픽스)
            // 링이 360도에서 0도로 역회전하므로, 딜레이 수식을 역으로 맞춰야 앞뒤가 정확히 맞음
            // 회전 주기가 60초이므로 상수 60 적용
            const delay = ((angle / 360) - 1) * 60;
            span.style.animationDelay = `${delay}s`;
            
            ring.appendChild(span);
        });
        
        scene.appendChild(ring);
        marqueeContainer.appendChild(scene);
    }
});

// =========================================
// 🚀 PERFORMANCE OPTIMIZATION: VIDEO LAZY LOADING
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // 화면에 보이면 -> 비디오 로드 및 재생
                if (!video.src && video.dataset.src) {
                    video.src = video.dataset.src;
                    video.play().catch(e => console.log('Autoplay blocked', e));
                } else if (video.src) {
                    video.play().catch(e => console.log('Autoplay blocked', e));
                }
            } else {
                // 화면 밖으로 나가면 -> 재생 일시정지
                if (video.src && !video.paused) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('video[data-src]').forEach(v => videoObserver.observe(v));
})
// =========================================
// AI CHATBOT TERMINAL LOGIC
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatTerminal = document.getElementById('chatTerminal');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatToggleBtn || !chatTerminal) return;

    chatToggleBtn.addEventListener('click', () => {
        chatTerminal.classList.toggle('hidden');
        if (!chatTerminal.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    chatCloseBtn.addEventListener('click', () => {
        chatTerminal.classList.add('hidden');
    });

    const qaData = {
        keywords: {
            '안녕|반가워|누구야': '안녕하세요! 이보희(LEE BOHEE) 디자이너의 포트폴리오 AI 어시스턴트입니다. 3D 작업물, 경력, 사용 툴 등에 대해 자유롭게 물어보세요!',
            '경력|경험|기간|패션': '11년간 동대문 실무 패션 디렉터 프리랜서로서 여러 매장을 맡아서 일을 하고 여러 쇼핑몰 브랜드 등에서 연간 300개 이상의 프로젝트를 기획부터 샘플, 메인, 생산, 납품까지 총괄한 경험이 있습니다. 현재는 이러한 실무 경험을 바탕으로 3D 모션과 결합한 디지털 아트로 변환되는 시점을 준비하고 선보이고 있습니다.',
            '프로그램|소프트웨어|툴|tool|할 줄 아는': '주력 3D 툴은 Cinema 4D와 Octane Render이며, After Effects를 활용한 모션 그래픽 작업이 가능합니다. 또한 ComfyUI를 이용한 AI 이미지 생성 및 Photoshop, Illustrator를 통한 디자인과 후보정 능력을 갖추고 있습니다.<br><br>바이브 코딩은 Antigravity와 claude 를 사용해서 2d 모션과 comyui를 같이 사용중입니다.<br>또 지금 CLO 의류 모델링도 공부중이니 그것과 comfyui가 섞이는 여정도 기대해줘.',
            '3d|모션|작업 방식': '패션 디자이너로서의 디테일한 감각을 살려, Cinema 4D와 Octane Render를 활용해 질감과 빛을 사실적으로 표현하는 3D 모션 그래픽 작업을 사용하여, 많은 아트웍을 해서 브랜드의 정체성을 잡아가는걸 좋아해.<br><br>또 인물의 일관성 카메라의 모션등은 ai로 다루기엔 많은 오차범위가 많은데 그것을 3d 안에서 카메라를 조정하면 그부분도 일관성을 잡을수 있기 때문에 3d, comfyui, 힉스필드, 클로드코드, 에펙을 주로 한꺼번에 같이 사용합니다.',
            'ai|comfyui|인공지능|스테이블|stable': 'ComfyUI(Stable Diffusion) 노드 시스템을 자유롭게 다루며, 내가 모르는 노드들은 gpu만 받쳐준다면 하하 따로 커스텀 노드를 만들어서 굳이 api를 쓰지않고 커스텀 노드로 사용합니다.<br><br>단순한 이미지 생성을 넘어 3D 워크플로우와 결합하거나 정교한 후보정을 거쳐 상업적 수준의 결과물을 만들어냅니다.',
            '학력|학교|전공|교육': '서울예술대학 패션디자인과를 졸업하였으며, 최근 SBS아카데미 모션그래픽학과를 수료하여 3D 및 영상 제작 역량을 전문적으로 키웠습니다.',
            '연락|이메일|전화|채용|contact': '작업 문의 및 채용 관련 연락은<br>인스타그램은 muelmu3kism<br>메일은 bohee0480@gmail.com<br>으로 연락 주시면 빠르게 답변해 드리겠습니다. 감사합니다!',
            'mbti|엠비티아이|성격': '나는 INTJ, ENTJ가 나오는데 일하면 I가 80퍼구 일을 쉬면 E가 55퍼 정도 나오는것같아 하하',
            '그만두고|영상|공부|이유': '내가 공부를 다짐한건 24년도 10월이였어. 그전부터 공부를 해야겠다 생각은 했지만 다짐의 기간이 2년이 걸린것같아.<br><br>많은 힘듦이 있었지만, 의류도 보는사람이 있어야 옷을 만들고 생산 과정에서도 많은 어려움이 없는데 그건 날이 갈수록 더 어려워졌던것 같아. 그래서 \'의류를 어떻게 볼수 있게 만들수 있을까\'에서 시작한것같아.<br><br>실무를 했던 디자이너가 마케팅까지 하게 되고 정체성을 만들수 있는 방법을 알게 되는건 매력이 있다고 생각해서 그떄는 지금 당장의 편안함을 버리고 미래의 나에게 투자를 한것같아.'
        },
        default: '앗, 그 질문에 대한 답변은 아직 준비되지 않았습니다. 더 자세한 내용은 <br><br>bohee0480@gmail.com 또는 인스타 디엠(muelmu3kism)으로 직접 문의해 주시면 감사하겠습니다!'
    };

    function findAnswer(question) {
        for (const [pattern, answer] of Object.entries(qaData.keywords)) {
            if (new RegExp(pattern, 'i').test(question)) {
                return answer;
            }
        }
        return qaData.default;
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ' + sender;
        msgDiv.innerHTML = text; // innerHTML to parse <br>
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const q = chatInput.value.trim();
            addMessage(q, 'user');
            chatInput.value = '';
            
            // 약간의 딜레이 후 답변 (터미널 느낌)
            setTimeout(() => {
                const answer = findAnswer(q);
                addMessage(answer, 'bot');
            }, 400);
        }
    });
});
