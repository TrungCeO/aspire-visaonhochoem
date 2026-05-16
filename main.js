document.addEventListener('DOMContentLoaded', () => {
    // === SOUND MANAGER ===
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const SoundManager = {
        playClick: () => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        },
        playForming: () => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const startTime = audioCtx.currentTime;
            
            // Cmaj9 pentatonic notes for a soothing, magical feel
            const notes = [261.63, 329.63, 392.00, 493.88, 587.33, 659.25, 783.99]; // C4, E4, G4, B4, D5, E5, G5
            
            // 1. Nền âm êm dịu (Pad)
            const padOsc = audioCtx.createOscillator();
            const padGain = audioCtx.createGain();
            padOsc.type = 'sine';
            padOsc.frequency.value = 261.63; // C4
            padGain.gain.setValueAtTime(0, startTime);
            padGain.gain.linearRampToValueAtTime(0.08, startTime + 2.5);
            padGain.gain.linearRampToValueAtTime(0, startTime + 5.2);
            padOsc.connect(padGain);
            padGain.connect(audioCtx.destination);
            padOsc.start(startTime);
            padOsc.stop(startTime + 5.2);

            // 2. Giai điệu rải nốt đi lên (Music box arpeggio)
            notes.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                const noteTime = startTime + index * 0.4; // Đánh chậm rãi từng nốt
                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 2.5);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 2.5);
            });
            
            // 3. Giai điệu rải nốt đi xuống lấp lánh (phần gom tụ lại 3s-5s)
            [783.99, 659.25, 587.33, 493.88, 392.00].forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq * 2; // Cao hơn 1 quãng 8 (chói sáng hơn)
                
                const noteTime = startTime + 3.0 + index * 0.3;
                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.06, noteTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.5);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 1.5);
            });
        },
        playExplosion: () => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.5);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            noise.start();
            noise.stop(audioCtx.currentTime + 2);
        },
        playHeart: () => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000 + Math.random()*600, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        }
    };

    // Add click sound to all buttons and planets
    document.querySelectorAll('button, .planet').forEach(el => {
        el.addEventListener('click', () => SoundManager.playClick());
    });

    // 0. Scroll Indicator visibility
    const scrollIndicator = document.getElementById('scroll-indicator');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY + window.innerHeight;
        const total = document.documentElement.scrollHeight;
        // Ẩn khi cuộn đến gần cuối trang (cách đáy 200px)
        if (scrolled >= total - 200) {
            scrollIndicator.classList.add('hidden-scroll');
        } else {
            scrollIndicator.classList.remove('hidden-scroll');
        }
    });

    // 1. Scroll Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
            else entry.target.classList.remove('show');
        });
    }, observerOptions);

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // 2. Navbar & Smooth Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 15, 0.85)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(5, 5, 15, 0.5)';
            navbar.style.boxShadow = 'none';
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 3. Black Hole Star Canvas
    const canvas = document.getElementById('starCanvas');
    if (canvas) {
        const ctx = window.starCtx = canvas.getContext('2d');
        let width, height;
        let particles = window.particles = [];
        
        const mouse = { x: null, y: null, radius: 250 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(x, y) {
                this.x = x !== undefined ? x : Math.random() * width;
                this.y = y !== undefined ? y : Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 3 + 1.5;
                this.baseSize = this.size;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.baseOpacity = Math.random() * 0.5 + 0.1;
                this.opacity = this.baseOpacity;
                const hue = Math.random() > 0.5 ? 260 : 190;
                this.color = `hsl(${hue}, 100%, 80%)`;
            }

            update() {
                // Natural movement
                this.baseX += this.speedX;
                this.baseY += this.speedY;

                if (this.baseX > width) this.baseX = 0;
                else if (this.baseX < 0) this.baseX = width;
                if (this.baseY > height) this.baseY = 0;
                else if (this.baseY < 0) this.baseY = height;

                this.x = this.baseX;
                this.y = this.baseY;

                // Black hole logic (gravity towards mouse)
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        
                        // Càng gần càng hút mạnh (không cho hút thẳng vào điểm giữa để tránh gom cục)
                        const force = (mouse.radius - distance) / mouse.radius;
                        const pullStrength = force * 50; 

                        this.x += forceDirectionX * pullStrength;
                        this.y += forceDirectionY * pullStrength;

                        // Tỏa sáng khi bị hút
                        this.size = this.baseSize + force * 2;
                        this.opacity = this.baseOpacity + force * 0.8;
                    } else {
                        this.size = this.baseSize;
                        this.opacity = this.baseOpacity;
                    }
                } else {
                    this.size = this.baseSize;
                    this.opacity = this.baseOpacity;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                let hslaColor = this.color.replace(')', `, ${this.opacity})`).replace('hsl', 'hsla');
                ctx.fillStyle = hslaColor;
                
                if (this.opacity > this.baseOpacity + 0.2) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = this.color;
                } else {
                    ctx.shadowBlur = Math.random() > 0.95 ? 5 : 0;
                    ctx.shadowColor = this.color;
                }
                
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function init() {
            particles = window.particles = [];
            window.Particle = Particle;
            let numberOfParticles = (width * height) / 4000;
            for (let i = 0; i < numberOfParticles; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.fillStyle = 'rgba(5, 5, 15, 0.3)';
            ctx.fillRect(0, 0, width, height);
            try {
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                }
            } catch(e) { /* bảo vệ loop khỏi crash */ }
            requestAnimationFrame(animate);
        }
        init();
        animate();
    }

    // 4. Planets Interaction (Zoom & Modals)
    const planets = document.querySelectorAll('.planet');
    const universe = document.getElementById('universe');
    const body = document.body;
    const closeBtns = document.querySelectorAll('.close-btn');

    planets.forEach(planet => {
        planet.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent document click
            
            // Get planet position relative to window
            const rect = this.getBoundingClientRect();
            const planetCenterX = rect.left + rect.width / 2;
            const planetCenterY = rect.top + rect.height / 2;
            
            // Show corresponding modal first to check its layout class
            const targetId = this.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            
            // Tính toán đích đến dựa trên layout của modal
            const isModalRight = modal.classList.contains('modal-right');
            // Nếu modal bên phải, hành tinh phải nằm bên trái (25%). Nếu modal bên trái, hành tinh nằm bên phải (75%)
            const destX = isModalRight ? window.innerWidth * 0.25 : window.innerWidth * 0.75;
            const destY = window.innerHeight / 2;
            
            const transX = destX - planetCenterX;
            const transY = destY - planetCenterY;

            // Đặt tâm scale tại chính giữa hành tinh
            universe.style.transformOrigin = `${planetCenterX}px ${planetCenterY}px`;
            // Apply zoom (scale 3.5 để to bằng nửa màn hình)
            universe.style.transform = `translate(${transX}px, ${transY}px) scale(3.5)`;
            body.classList.add('zoomed');
            
            // Delay modal appearance to let zoom animation finish
            setTimeout(() => {
                modal.classList.remove('hidden-modal');
            }, 800);
        });
    });

    // Close Modals
    function closeModal() {
        document.querySelectorAll('.planet-modal').forEach(m => m.classList.add('hidden-modal'));
        universe.style.transform = `translate(0px, 0px) scale(1)`;
        setTimeout(() => { body.classList.remove('zoomed'); }, 1000);
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // 5. Donation modal – 2-step flow
    const btnDonate    = document.getElementById('btn-donate');
    const modalDonation= document.getElementById('modal-donation');
    const closeDonation= document.getElementById('close-donation');
    const btnNextQr    = document.getElementById('btn-next-qr');
    const btnBackName  = document.getElementById('btn-back-name');
    const btnThankyou  = document.getElementById('btn-thankyou');
    const toast        = document.getElementById('toast');
    const copyPhone    = document.getElementById('copy-phone');
    const donorInput   = document.getElementById('donor-name');
    const stepName     = document.getElementById('donate-step-name');
    const stepQr       = document.getElementById('donate-step-qr');
    const qrDynamic    = document.getElementById('qr-dynamic');
    const noteText     = document.getElementById('transfer-note-text');
    const greeting     = document.getElementById('donation-greeting');

    function showStep(step) {
        stepName.style.display = step === 1 ? 'block' : 'none';
        stepQr.style.display   = step === 2 ? 'block' : 'none';
    }

    function buildQR(name) {
        const content = encodeURIComponent(`${name} da gui mot vi sao nho cho em`);
        return `https://img.vietqr.io/image/MB-0946464102-compact.png?addInfo=${content}&accountName=CAO%20CHI%20TRUNG`;
    }

    btnDonate && btnDonate.addEventListener('click', () => {
        donorInput.value = '';
        showStep(1);
        modalDonation.classList.remove('hidden-modal');
        setTimeout(() => donorInput.focus(), 300);
    });

    closeDonation && closeDonation.addEventListener('click', () => {
        modalDonation.classList.add('hidden-modal');
    });

    modalDonation && modalDonation.addEventListener('click', (e) => {
        if (e.target === modalDonation) modalDonation.classList.add('hidden-modal');
    });

    // Enter key submits name
    donorInput && donorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnNextQr.click();
    });

    btnNextQr && btnNextQr.addEventListener('click', () => {
        const name = donorInput.value.trim() || 'Bạn';
        // Update QR with name (no fixed amount)
        qrDynamic.src = buildQR(name);
        // Update note text
        if (noteText) noteText.textContent = `${name} đã gửi một vì sao nhỏ cho em`;
        if (greeting) greeting.textContent = `Cảm ơn ${name} đã muốn gửi một vì sao nhỏ! 🌟`;
        showStep(2);
    });

    btnBackName && btnBackName.addEventListener('click', () => showStep(1));

    // Copy số tài khoản
    copyPhone && copyPhone.addEventListener('click', () => {
        navigator.clipboard.writeText('0946464102').then(() => {
            copyPhone.textContent = '✅ Đã sao chép!';
            setTimeout(() => { copyPhone.textContent = '0946 464 102'; }, 2000);
        });
    });

    // Nút xác nhận đã chuyển khoản
    btnThankyou && btnThankyou.addEventListener('click', () => {
        modalDonation.classList.add('hidden-modal');

        // Ẩn section Thông Điệp để Thank You particle hiện rõ
        const visionSection = document.getElementById('vision');
        if (visionSection) {
            visionSection.style.transition = 'opacity 0.5s ease';
            visionSection.style.opacity = '0';
            visionSection.style.pointerEvents = 'none';
        }
        toast.classList.remove('hidden-toast');

        // === Spawn floating hearts & stars ===
        const symbols = ['❤️','💛','💙','💜','🌟','💖','✨','💝','⭐','🤍'];
        for (let i = 0; i < 22; i++) {
            setTimeout(() => {
                SoundManager.playHeart();
                const h = document.createElement('span');
                h.className = 'floating-heart';
                h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                h.style.left = (5 + Math.random() * 90) + 'vw';
                h.style.bottom = '0';
                h.style.fontSize = (1.2 + Math.random() * 2.5) + 'rem';
                h.style.animationDuration = (2.5 + Math.random() * 2) + 's';
                document.body.appendChild(h);
                setTimeout(() => h.remove(), 5000);
            }, i * 150);
        }

        // === Particles form "Thank You" text ===
        const starCanvas = document.getElementById('starCanvas');
        const particles = window.particles;
        if (particles && particles.length && starCanvas) {
            SoundManager.playForming();
            const w = starCanvas.width;
            const h = starCanvas.height;

            document.fonts.load('10px "Montserrat"').then(() => {
            const tmp = document.createElement('canvas');
            tmp.width = w; tmp.height = h;
            const tctx = tmp.getContext('2d');
            const fs = Math.min(w / 4.5, 130);
            const donorName = (donorInput && donorInput.value.trim()) || 'Bạn';
            tctx.fillStyle = '#fff';
            // Dòng 1: Thank You - to nhất
            tctx.font = `900 ${fs}px Montserrat, sans-serif`;
            tctx.textAlign = 'center';
            tctx.textBaseline = 'middle';
            tctx.fillText('Thank You', w / 2, h / 2 - fs * 0.9);
            // Dòng 2: Tên người chuyển khoản
            tctx.font = `700 ${fs * 0.52}px Montserrat, sans-serif`;
            tctx.fillText(`✦  ${donorName}  ✦`, w / 2, h / 2 - fs * 0.1);
            // Dòng 3: Cảm ơn có dấu đầy đủ
            tctx.font = `400 ${fs * 0.38}px Montserrat, sans-serif`;
            tctx.fillText('❤  Cảm ơn bạn rất nhiều  ❤', w / 2, h / 2 + fs * 0.68);

            const imgData = tctx.getImageData(0, 0, w, h).data;
            const targets = [];
            // Tăng mật độ: sample mỗi 4px thay vì 6px
            for (let y = 0; y < h; y += 4) {
                for (let x = 0; x < w; x += 4) {
                    if (imgData[(y * w + x) * 4 + 3] > 128) targets.push({ x, y });
                }
            }

            // Shuffle targets
            for (let i = targets.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [targets[i], targets[j]] = [targets[j], targets[i]];
            }

            // Tạo thêm hạt tạm thời nếu không đủ
            const needed = targets.length;
            const originalCount = particles.length;
            const extraNeeded = Math.max(0, needed - originalCount);
            for (let i = 0; i < extraNeeded; i++) {
                const ep = new window.Particle(
                    Math.random() * w,
                    Math.random() * h
                );
                ep._extra = true;
                ep._form = false;
                particles.push(ep);
                window.particles = particles;
            }

            // Giữ lại 30% hạt nổi tự do, chỉ dùng 70% cho chữ
            const reservedCount = Math.floor(originalCount * 0.3);
            const availableForText = originalCount - reservedCount;

            // Save original positions & assign targets (chỉ assign cho phần hạt không reserved)
            const saved = particles.slice(0, originalCount).map(p => ({ bx: p.baseX, by: p.baseY, color: p.color }));

            // Tính số extra cần thêm dựa trên targets vs available
            const totalAvailable = availableForText + extraNeeded;
            const assignCount = Math.min(totalAvailable, targets.length);

            // Gán targets cho: hạt gốc (bỏ qua reserved) + extra hạt
            let assigned = 0;
            for (let i = 0; i < originalCount && assigned < assignCount; i++) {
                if (i < reservedCount) continue; // bỏ qua reserved particles
                particles[i]._tx = targets[assigned].x;
                particles[i]._ty = targets[assigned].y;
                particles[i]._form = true;
                particles[i].color = `hsl(${190 + Math.random() * 80}, 100%, 80%)`;
                assigned++;
            }
            // Extra particles
            for (let i = originalCount; i < particles.length && assigned < targets.length; i++) {
                particles[i]._tx = targets[assigned].x;
                particles[i]._ty = targets[assigned].y;
                particles[i]._form = true;
                assigned++;
            }

            // Lưu hàm update GỐC trước khi patch (để restore sau explosion)
            particles.slice(0, originalCount).forEach(p => {
                if (!p._pristineUpdate) p._pristineUpdate = p.update;
            });

            // Patch update chỉ cho forming particles
            particles.forEach(p => {
                if (!p._form) return;
                p.update = function() {
                    this.x += (this._tx - this.x) * 0.04;
                    this.y += (this._ty - this.y) * 0.04;
                    this.size = 2.5;
                    this.opacity = 0.95;
                };
            });

            // === PHASE 2: Tụ về giữa (sau 5.2s) ===
            setTimeout(() => {
                toast.classList.add('hidden-toast');
                const cx = w / 2, cy = h / 2;

                particles.forEach(p => {
                    if (!p._form) return;
                    p._phase = 'converge';
                    p.update = function() {
                        // Bay nhanh về tâm màn hình
                        this.x += (cx - this.x) * 0.08;
                        this.y += (cy - this.y) * 0.08;
                        this.size = Math.max(1.5, this.size * 0.99);
                        this.opacity = Math.min(1, this.opacity + 0.01);
                    };
                });

                // === PHASE 3: Bùng nổ (sau 1.2s tụ) ===
                setTimeout(() => {
                    SoundManager.playExplosion();
                    particles.forEach((p, i) => {
                        if (p._phase !== 'converge') return;
                        p._phase = 'explode';
                        const isExtra = p._extra;
                        const origSave = saved[i];
                        const pristine = p._pristineUpdate;

                        // Vector nổ ngẫu nhiên mạnh
                        const angle = Math.random() * Math.PI * 2;
                        const force = 12 + Math.random() * 28;
                        p._vx = Math.cos(angle) * force;
                        p._vy = Math.sin(angle) * force;
                        p.opacity = 1;

                        p.update = function() {
                            if (this._phase === 'explode') {
                                this.x += this._vx;
                                this.y += this._vy;
                                this._vx *= 0.88;
                                this._vy *= 0.88;
                                // Khi vận tốc đủ nhỏ → chuyển sang pha bay về nhà
                                const speed = Math.abs(this._vx) + Math.abs(this._vy);
                                if (speed < 0.4) {
                                    if (isExtra) {
                                        // Extra particle: biến mất
                                        this._phase = 'done';
                                        this.opacity = 0;
                                        this.size = 0;
                                    } else {
                                        // Bay về vị trí gốc
                                        this._phase = 'return';
                                        if (origSave) {
                                            this.baseX = origSave.bx;
                                            this.baseY = origSave.by;
                                            this.color = origSave.color;
                                        }
                                    }
                                }
                            } else if (this._phase === 'return') {
                                // Lerp về vị trí gốc mượt mà
                                this.x += (this.baseX - this.x) * 0.035;
                                this.y += (this.baseY - this.y) * 0.035;
                                this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                                this.size += (this.baseSize - this.size) * 0.05;
                                const dx = this.baseX - this.x, dy = this.baseY - this.y;
                                if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                                    // Đã về nhà → khôi phục hoàn toàn
                                    this._phase = 'done';
                                    this._form = false;
                                    if (pristine) this.update = pristine;
                                    else delete this.update;
                                    this.opacity = this.baseOpacity;
                                    this.size = this.baseSize;
                                }
                            }
                        };
                    });

                    // Dọn extra particles + hiện lại Thông Điệp sớm hơn
                    setTimeout(() => {
                        if (extraNeeded > 0) {
                            const extraStart = particles.length - extraNeeded;
                            if (extraStart >= 0) particles.splice(extraStart, extraNeeded);
                            window.particles = particles;
                        }
                        if (visionSection) {
                            visionSection.style.transition = 'opacity 1.5s ease-in-out';
                            visionSection.style.opacity = '1';
                            visionSection.style.pointerEvents = '';
                        }
                    }, 2500);

                }, 1200);
            }, 5200);
            }); // end document.fonts.load finally
        } else {
            setTimeout(() => {
                toast.classList.add('hidden-toast');
                if (visionSection) {
                    visionSection.style.opacity = '1';
                    visionSection.style.pointerEvents = '';
                }
            }, 5000);
        }
    });
});
