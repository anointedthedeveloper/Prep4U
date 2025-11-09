// Main Application JavaScript
class Prep4UApp {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.init();
    }

    init() {
        this.initializeHamburgerMenu();
        this.initializeAuthForms();
        this.initializeContactForm();
        this.checkAuthentication();
        this.initializeRoleBasedUI();
        this.initializeScrollAnimations();
    }

    // Enhanced Hamburger Menu functionality
    initializeHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Add animation to menu items
                const navLinks = navMenu.querySelectorAll('.nav-link');
                navLinks.forEach((link, index) => {
                    link.style.animation = link.style.animation ? '' : `fadeInUp 0.3s ease ${index * 0.1}s both`;
                });
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    // Reset animations
                    const navLinks = navMenu.querySelectorAll('.nav-link');
                    navLinks.forEach(link => link.style.animation = '');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    // Scroll animations
    initializeScrollAnimations() {
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        
        if (scrollElements.length === 0) return;

        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        const displayScrollElement = (element) => {
            element.classList.add('revealed');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                }
            });
        };

        // Initial check
        handleScrollAnimation();
        
        // Throttle scroll events
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (!scrollTimer) {
                scrollTimer = setTimeout(() => {
                    scrollTimer = null;
                    handleScrollAnimation();
                }, 100);
            }
        });
    }

    // Authentication forms handling
    initializeAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');

        // Toggle between login and register forms with animation
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAuthForm('register');
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAuthForm('login');
            });
        }

        // Login form submission with enhanced UX
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmission(loginForm, this.handleLogin.bind(this));
            });
        }

        // Register form submission with enhanced UX
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmission(registerForm, this.handleRegistration.bind(this));
            });
        }
    }

    // Enhanced form submission with animations
    async handleFormSubmission(form, handler) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Add loading state
        submitBtn.innerHTML = '<div class="btn-loading"></div> Processing...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            await handler(data);
            
            // Success animation
            submitBtn.classList.add('success-check');
            setTimeout(() => {
                submitBtn.classList.remove('success-check');
            }, 600);
            
        } catch (error) {
            // Error animation
            form.classList.add('error-shake');
            setTimeout(() => {
                form.classList.remove('error-shake');
            }, 500);
            
            this.showNotification(error.message, 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Animated form switching
    switchAuthForm(targetForm) {
        const loginCard = document.querySelector('#loginForm')?.closest('.auth-card');
        const registerCard = document.getElementById('registerCard');
        
        if (!loginCard || !registerCard) return;

        if (targetForm === 'register') {
            loginCard.style.animation = 'slideOutLeft 0.4s ease forwards';
            setTimeout(() => {
                loginCard.classList.add('hidden');
                registerCard.classList.remove('hidden');
                registerCard.style.animation = 'slideInRight 0.4s ease forwards';
            }, 200);
        } else {
            registerCard.style.animation = 'slideOutRight 0.4s ease forwards';
            setTimeout(() => {
                registerCard.classList.add('hidden');
                loginCard.classList.remove('hidden');
                loginCard.style.animation = 'slideInLeft 0.4s ease forwards';
            }, 200);
        }
    }

    // Contact form handling
    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmission(contactForm, this.handleContactSubmission.bind(this));
            });
        }
    }

    // Check if user is authenticated
    async checkAuthentication() {
        // For demo purposes - in real app, this would check Firebase auth state
        const user = localStorage.getItem('prep4u_user');
        if (user) {
            try {
                this.currentUser = JSON.parse(user);
                this.userRole = this.currentUser.role;
                this.updateUIForAuthState();
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('prep4u_user');
            }
        }
    }

    // Update UI based on authentication state
    updateUIForAuthState() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Update user name display with animation
        const userNameElements = document.querySelectorAll('#userName, #adminName');
        userNameElements.forEach(element => {
            if (element && this.currentUser) {
                element.textContent = this.currentUser.name;
                element.style.animation = 'bounce 0.6s ease';
            }
        });
    }

    // Initialize role-based UI elements
    initializeRoleBasedUI() {
        if (this.userRole === 'admin') {
            this.loadAdminDashboard();
        } else if (this.userRole === 'student') {
            this.loadStudentDashboard();
        }
    }

    // Load admin dashboard data
    async loadAdminDashboard() {
        console.log('Loading admin dashboard data...');
        
        // Simulate loading with animation
        this.showLoadingAnimation('.stats-grid');
        
        setTimeout(() => {
            const stats = {
                totalUsers: 150,
                totalExams: 25,
                platformAvgScore: '78%'
            };

            this.updateAdminStats(stats);
            this.loadRecentSubmissions();
            this.hideLoadingAnimation('.stats-grid');
        }, 1000);
    }

    // Load student dashboard data
    async loadStudentDashboard() {
        console.log('Loading student dashboard data...');
        
        // Simulate loading with animation
        this.showLoadingAnimation('.stats-grid');
        
        setTimeout(() => {
            const stats = {
                activeExams: 3,
                completedExams: 12,
                averageScore: '85%'
            };

            this.updateStudentStats(stats);
            this.loadAvailableExams();
            this.loadRecentResults();
            this.hideLoadingAnimation('.stats-grid');
        }, 1000);
    }

    // Update admin statistics with animation
    updateAdminStats(stats) {
        this.animateCounter('totalUsers', stats.totalUsers);
        this.animateCounter('totalExams', stats.totalExams);
        const avgScoreElement = document.getElementById('platformAvgScore');
        if (avgScoreElement) {
            avgScoreElement.textContent = stats.platformAvgScore;
        }
    }

    // Update student statistics with animation
    updateStudentStats(stats) {
        this.animateCounter('activeExams', stats.activeExams);
        this.animateCounter('completedExams', stats.completedExams);
        const avgScoreElement = document.getElementById('averageScore');
        if (avgScoreElement) {
            avgScoreElement.textContent = stats.averageScore;
        }
    }

    // Animated counter
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = targetValue / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 30);
    }

    // Load available exams for students
    async loadAvailableExams() {
        const examList = document.getElementById('examList');
        if (!examList) return;

        this.showLoadingAnimation('#examList');

        setTimeout(() => {
            const exams = [
                { id: 1, title: 'Mathematics Final Exam', duration: '60 min', questions: 25 },
                { id: 2, title: 'Science Quiz', duration: '30 min', questions: 15 },
                { id: 3, title: 'History Test', duration: '45 min', questions: 20 }
            ];

            examList.innerHTML = exams.map((exam, index) => `
                <div class="exam-item scroll-reveal" style="animation-delay: ${index * 0.1}s">
                    <h4>${exam.title}</h4>
                    <p>Duration: ${exam.duration} • Questions: ${exam.questions}</p>
                    <a href="take-exam.html?exam=${exam.id}" class="btn btn-primary">Start Exam</a>
                </div>
            `).join('');

            this.hideLoadingAnimation('#examList');
        }, 800);
    }

    // Load recent results for students
    async loadRecentResults() {
        const recentResults = document.getElementById('recentResults');
        if (!recentResults) return;

        this.showLoadingAnimation('#recentResults');

        setTimeout(() => {
            const results = [
                { exam: 'Mathematics Midterm', score: '92%', date: '2024-01-15' },
                { exam: 'Science Quiz', score: '85%', date: '2024-01-10' },
                { exam: 'History Test', score: '78%', date: '2024-01-05' }
            ];

            recentResults.innerHTML = results.map((result, index) => `
                <div class="result-item scroll-reveal" style="animation-delay: ${index * 0.1}s">
                    <h4>${result.exam}</h4>
                    <p>Score: ${result.score} • Date: ${result.date}</p>
                </div>
            `).join('');

            this.hideLoadingAnimation('#recentResults');
        }, 800);
    }

    // Load recent submissions for admin
    async loadRecentSubmissions() {
        const recentSubmissions = document.getElementById('recentSubmissions');
        if (!recentSubmissions) return;

        this.showLoadingAnimation('#recentSubmissions');

        setTimeout(() => {
            const submissions = [
                { student: 'John Doe', exam: 'Mathematics Final', score: '88%', time: '45 min' },
                { student: 'Jane Smith', exam: 'Science Quiz', score: '92%', time: '28 min' },
                { student: 'Mike Johnson', exam: 'History Test', score: '76%', time: '40 min' }
            ];

            recentSubmissions.innerHTML = submissions.map((submission, index) => `
                <div class="submission-item scroll-reveal" style="animation-delay: ${index * 0.1}s">
                    <h4>${submission.student} - ${submission.exam}</h4>
                    <p>Score: ${submission.score} • Time: ${submission.time}</p>
                </div>
            `).join('');

            this.hideLoadingAnimation('#recentSubmissions');
        }, 800);
    }

    // Handle login
    async handleLogin(credentials) {
        console.log('Login attempt:', credentials);
        
        // Validation
        if (!credentials.email || !credentials.password) {
            throw new Error('Please fill in all fields');
        }

        if (!this.isValidEmail(credentials.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo - in real app, this would come from Firebase
        this.currentUser = {
            name: 'Demo User',
            email: credentials.email,
            role: 'student' // Only student role for self-prep
        };
        
        localStorage.setItem('prep4u_user', JSON.stringify(this.currentUser));
        
        // Show success notification
        this.showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect with delay for animation
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    // Handle registration - Only student accounts for self-prep
    async handleRegistration(userData) {
        console.log('Registration attempt:', userData);
        
        // Validation
        if (!userData.name || !userData.email || !userData.password) {
            throw new Error('Please fill in all fields');
        }

        if (!this.isValidEmail(userData.email)) {
            throw new Error('Please enter a valid email address');
        }

        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Only create student accounts for self-prep
        this.currentUser = {
            name: userData.name,
            email: userData.email,
            role: 'student' // Force student role
        };
        
        localStorage.setItem('prep4u_user', JSON.stringify(this.currentUser));
        
        // Show success notification
        this.showNotification('Account created successfully! Welcome to Prep4U.', 'success');
        
        // Redirect with delay for animation
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle contact form submission
    async handleContactSubmission(contactData) {
        console.log('Contact form submitted:', contactData);
        
        // Validation
        if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            throw new Error('Please fill in all required fields');
        }

        if (!this.isValidEmail(contactData.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        document.getElementById('contactForm').reset();
    }

    // Handle logout with animation
    handleLogout() {
        // Show confirmation with animation
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('prep4u_user');
            this.currentUser = null;
            this.userRole = null;
            
            this.showNotification('Logged out successfully', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // Enhanced notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => {
            this.removeNotification(notification);
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Loading animation helpers
    showLoadingAnimation(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('loading');
        }
    }

    hideLoadingAnimation(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove('loading');
        }
    }
}

// Enhanced Upload System
class QuestionUploadSystem {
    constructor() {
        this.currentTab = 'single';
        this.optionCount = 2;
        this.init();
    }

    init() {
        this.initializeTabs();
        this.initializeQuestionTypeHandler();
        this.initializeOptionManagement();
        this.initializeBulkUpload();
        this.initializePasteHandler();
        this.initializePreview();
        this.initializeSearchAndFilter();
    }

    // Tab management with animations
    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                if (this.currentTab === tabId) return;
                
                // Animate out current tab
                const currentTab = document.querySelector('.tab-content.active');
                if (currentTab) {
                    currentTab.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        currentTab.classList.remove('active');
                    }, 200);
                }
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Animate in new tab
                setTimeout(() => {
                    const newTab = document.getElementById(`${tabId}Tab`);
                    if (newTab) {
                        newTab.classList.add('active');
                        newTab.style.animation = 'fadeInUp 0.4s ease forwards';
                    }
                }, 250);
                
                this.currentTab = tabId;
            });
        });
    }

    // Question type handler
    initializeQuestionTypeHandler() {
        const questionType = document.getElementById('questionType');
        if (questionType) {
            questionType.addEventListener('change', (e) => {
                this.handleQuestionTypeChange(e.target.value);
            });
            
            // Initialize on load
            this.handleQuestionTypeChange(questionType.value);
        }
    }

    handleQuestionTypeChange(type) {
        const mcFields = document.getElementById('multipleChoiceFields');
        const tfFields = document.getElementById('trueFalseFields');
        
        // Animate out current fields
        if (mcFields && !mcFields.classList.contains('hidden')) {
            mcFields.style.animation = 'fadeOut 0.3s ease forwards';
        }
        if (tfFields && !tfFields.classList.contains('hidden')) {
            tfFields.style.animation = 'fadeOut 0.3s ease forwards';
        }
        
        setTimeout(() => {
            // Hide all fields
            if (mcFields) mcFields.classList.add('hidden');
            if (tfFields) tfFields.classList.add('hidden');
            
            // Show relevant fields with animation
            switch(type) {
                case 'multiple-choice':
                    if (mcFields) {
                        mcFields.classList.remove('hidden');
                        mcFields.style.animation = 'fadeInUp 0.4s ease forwards';
                    }
                    break;
                case 'true-false':
                    if (tfFields) {
                        tfFields.classList.remove('hidden');
                        tfFields.style.animation = 'fadeInUp 0.4s ease forwards';
                    }
                    break;
                case 'short-answer':
                case 'essay':
                    // No additional fields needed
                    break;
            }
        }, 200);
    }

    // Enhanced option management
    initializeOptionManagement() {
        const addOptionBtn = document.getElementById('addOption');
        if (addOptionBtn) {
            addOptionBtn.addEventListener('click', () => {
                this.addOption();
            });
        }

        // Initialize remove buttons for existing options
        this.updateRemoveButtons();
    }

    addOption() {
        if (this.optionCount >= 6) {
            this.showNotification('Maximum 6 options allowed', 'warning');
            return;
        }

        const optionsContainer = document.getElementById('optionsContainer');
        if (!optionsContainer) return;

        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <input type="text" name="options[]" placeholder="Option ${this.optionCount + 1}" required>
            <label class="radio-label">
                <input type="radio" name="correctAnswer" value="${this.optionCount}">
                <span class="radio-custom"></span>
                Correct
            </label>
            <button type="button" class="btn-remove-option">×</button>
        `;

        optionsContainer.appendChild(optionItem);
        this.optionCount++;

        // Add remove event listener
        const removeBtn = optionItem.querySelector('.btn-remove-option');
        removeBtn.addEventListener('click', () => {
            this.removeOption(optionItem);
        });

        // Enable remove buttons if we have more than 2 options
        this.updateRemoveButtons();
        
        // Animate new option
        optionItem.style.opacity = '0';
        optionItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            optionItem.style.opacity = '1';
            optionItem.style.transform = 'translateY(0)';
            optionItem.style.transition = 'all 0.3s ease';
        }, 10);
    }

    removeOption(optionItem) {
        if (this.optionCount <= 2) {
            this.showNotification('Minimum 2 options required', 'warning');
            return;
        }

        optionItem.style.transform = 'translateX(100px)';
        optionItem.style.opacity = '0';
        
        setTimeout(() => {
            optionItem.remove();
            this.optionCount--;
            this.updateRemoveButtons();
            this.renumberOptions();
        }, 300);
    }

    updateRemoveButtons() {
        const removeBtns = document.querySelectorAll('.btn-remove-option');
        removeBtns.forEach((btn, index) => {
            btn.disabled = this.optionCount <= 2;
        });
    }

    renumberOptions() {
        const options = document.querySelectorAll('.option-item input[type="text"]');
        options.forEach((input, index) => {
            input.placeholder = `Option ${index + 1}`;
            const radio = input.parentElement.querySelector('input[type="radio"]');
            if (radio) {
                radio.value = index;
            }
        });
    }

    // Bulk upload functionality
    initializeBulkUpload() {
        const uploadZone = document.getElementById('bulkUploadZone');
        const fileInput = document.getElementById('bulkFileInput');
        const processBtn = document.getElementById('processBulkUpload');

        if (uploadZone && fileInput) {
            // Drag and drop functionality
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                }
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });

            // Process button
            if (processBtn) {
                processBtn.addEventListener('click', () => {
                    this.processBulkUpload();
                });
            }
        }

        // Download template
        const downloadBtn = document.getElementById('downloadTemplate');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadTemplate();
            });
        }
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file type and size
        const validTypes = ['text/csv', 'text/plain'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|txt)$/)) {
            this.showNotification('Please upload a CSV or text file', 'error');
            return;
        }

        if (file.size > maxSize) {
            this.showNotification('File size must be less than 10MB', 'error');
            return;
        }

        // Update UI
        const uploadZone = document.getElementById('bulkUploadZone');
        const placeholder = uploadZone?.querySelector('.upload-placeholder');
        const progress = uploadZone?.querySelector('.upload-progress');

        if (placeholder && progress) {
            placeholder.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                placeholder.classList.add('hidden');
                progress.classList.remove('hidden');
                progress.style.animation = 'fadeInUp 0.4s ease forwards';
            }, 200);
        }

        // Simulate upload progress
        this.simulateUploadProgress(file);
    }

    simulateUploadProgress(file) {
        const progressFill = document.getElementById('bulkProgress');
        const progressText = document.getElementById('progressText');
        const processBtn = document.getElementById('processBulkUpload');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                if (processBtn) {
                    processBtn.disabled = false;
                    processBtn.classList.add('pulse');
                }
                this.showNotification('File uploaded successfully! Click "Process Upload" to continue.', 'success');
            }

            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.round(progress)}%`;
        }, 200);
    }

    processBulkUpload() {
        const processBtn = document.getElementById('processBulkUpload');
        if (!processBtn) return;

        processBtn.classList.remove('pulse');
        processBtn.disabled = true;
        processBtn.innerHTML = '<div class="btn-loading"></div> Processing...';
        
        // Simulate processing
        this.showNotification('Processing bulk upload...', 'info');
        
        setTimeout(() => {
            // Simulate successful processing
            const stats = {
                total: 243, // Can handle hundreds of questions
                successful: 238,
                failed: 5
            };
            
            this.showUploadStats(stats);
            this.showNotification(`Processed ${stats.total} questions successfully!`, 'success');
            
            // Reset button
            processBtn.innerHTML = 'Process Upload';
            processBtn.disabled = false;
        }, 3000);
    }

    showUploadStats(stats) {
        const statsElement = document.getElementById('uploadStats');
        const totalQuestions = document.getElementById('totalQuestions');
        const successfulUploads = document.getElementById('successfulUploads');
        const failedUploads = document.getElementById('failedUploads');

        if (totalQuestions) this.animateCounter(totalQuestions, stats.total);
        if (successfulUploads) this.animateCounter(successfulUploads, stats.successful);
        if (failedUploads) this.animateCounter(failedUploads, stats.failed);

        if (statsElement) {
            statsElement.classList.remove('hidden');
            statsElement.style.animation = 'fadeInUp 0.5s ease';
        }
    }

    downloadTemplate() {
        const templateContent = `Question Text?|option1|option2|option3|option4|correct_option_index|points|difficulty|category
What is 2+2?|3|4|5|6|1|1|easy|Mathematics
Capital of France?|London|Berlin|Paris|Madrid|2|1|easy|Geography
The sky is blue.|true|false|true|1|easy|Science`;

        const blob = new Blob([templateContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prep4u_question_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Template downloaded successfully!', 'success');
    }

    // Paste questions functionality
    initializePasteHandler() {
        const pasteTextarea = document.getElementById('pastedQuestions');
        const processBtn = document.getElementById('processPaste');
        const clearBtn = document.getElementById('clearPaste');

        if (pasteTextarea) {
            pasteTextarea.addEventListener('input', (e) => {
                this.handlePasteInput(e.target.value);
            });
        }

        if (processBtn) {
            processBtn.addEventListener('click', () => {
                this.processPastedQuestions(pasteTextarea?.value || '');
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (pasteTextarea) pasteTextarea.value = '';
                this.handlePasteInput('');
                this.showNotification('Text area cleared', 'info');
            });
        }
    }

    handlePasteInput(text) {
        const questionCount = this.countQuestions(text);
        const countElement = document.getElementById('questionCount');
        const previewSection = document.getElementById('pastePreview');
        const previewQuestions = document.getElementById('previewQuestions');

        if (countElement) countElement.textContent = questionCount;

        if (questionCount > 0 && previewSection && previewQuestions) {
            previewSection.classList.remove('hidden');
            previewSection.style.animation = 'fadeInUp 0.4s ease';
            this.generatePreview(text, previewQuestions);
        } else if (previewSection) {
            previewSection.classList.add('hidden');
        }
    }

    countQuestions(text) {
        if (!text.trim()) return 0;
        
        const lines = text.split('\n').filter(line => 
            line.trim() && !line.trim().startsWith('//')
        );
        return lines.length;
    }

    generatePreview(text, container) {
        const lines = text.split('\n').filter(line => 
            line.trim() && !line.trim().startsWith('//')
        ).slice(0, 5); // Show first 5 questions

        container.innerHTML = lines.map((line, index) => `
            <div class="preview-question" style="animation-delay: ${index * 0.1}s">
                <div class="preview-header">
                    <strong>Question ${index + 1}</strong>
                    <span class="preview-type">${this.detectQuestionType(line)}</span>
                </div>
                <div class="preview-content">${this.escapeHtml(line.split('|')[0])}</div>
            </div>
        `).join('');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    detectQuestionType(line) {
        const parts = line.split('|');
        if (parts.length >= 6) return 'Multiple Choice';
        if (parts.length === 4 && (parts[1] === 'true' || parts[2] === 'false')) return 'True/False';
        return 'Short Answer';
    }

    processPastedQuestions(text) {
        const questionCount = this.countQuestions(text);
        
        if (questionCount === 0) {
            this.showNotification('No questions found to process', 'warning');
            return;
        }

        const processBtn = document.getElementById('processPaste');
        if (!processBtn) return;

        const originalText = processBtn.innerHTML;
        
        processBtn.innerHTML = '<div class="btn-loading"></div> Processing...';
        processBtn.disabled = true;

        if (questionCount > 1000) {
            this.showNotification(`Processing ${questionCount} questions... This may take a while.`, 'info');
        } else {
            this.showNotification(`Processing ${questionCount} questions...`, 'info');
        }

        // Simulate processing
        setTimeout(() => {
            this.showNotification(`Successfully processed ${questionCount} questions!`, 'success');
            processBtn.innerHTML = originalText;
            processBtn.disabled = false;
        }, 3000);
    }

    // Preview functionality
    initializePreview() {
        const previewBtn = document.getElementById('previewQuestion');
        const closePreview = document.getElementById('closePreview');
        const modal = document.getElementById('previewModal');

        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showPreview();
            });
        }

        if (closePreview && modal) {
            closePreview.addEventListener('click', () => {
                this.hideModal(modal);
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        }
    }

    showPreview() {
        const form = document.getElementById('singleQuestionForm');
        const modalBody = document.getElementById('previewModalBody');
        const modal = document.getElementById('previewModal');

        if (!form || !modalBody || !modal) return;

        const formData = new FormData(form);
        const previewHTML = this.generateQuestionPreview(formData);
        modalBody.innerHTML = previewHTML;
        this.showModal(modal);
    }

    generateQuestionPreview(formData) {
        const questionType = formData.get('questionType');
        let optionsHTML = '';

        if (questionType === 'multiple-choice') {
            const options = formData.getAll('options[]');
            const correctAnswer = formData.get('correctAnswer');
            
            optionsHTML = options.map((option, index) => `
                <div class="preview-option ${index == correctAnswer ? 'correct' : ''}">
                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                    <span class="option-text">${this.escapeHtml(option)}</span>
                    ${index == correctAnswer ? '<span class="correct-badge">Correct</span>' : ''}
                </div>
            `).join('');
        }

        return `
            <div class="question-preview">
                <h4>${this.escapeHtml(formData.get('examTitle') || 'Untitled Exam')}</h4>
                <div class="preview-meta">
                    <span>Type: ${questionType}</span>
                    <span>Points: ${formData.get('points') || '1'}</span>
                    <span>Difficulty: ${formData.get('difficulty') || 'medium'}</span>
                </div>
                <div class="preview-question-text">
                    ${this.escapeHtml(formData.get('questionText') || 'No question text provided')}
                </div>
                ${optionsHTML ? `<div class="preview-options">${optionsHTML}</div>` : ''}
                ${formData.get('explanation') ? `
                    <div class="preview-explanation">
                        <strong>Explanation:</strong> ${this.escapeHtml(formData.get('explanation'))}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Search and filter functionality
    initializeSearchAndFilter() {
        const searchInput = document.getElementById('searchUploads');
        const filterSelect = document.getElementById('filterCategory');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterQuestions(e.target.value);
            });
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterQuestionsByCategory(e.target.value);
            });
        }
    }

    filterQuestions(searchTerm) {
        // Implementation for searching questions
        console.log('Searching for:', searchTerm);
    }

    filterQuestionsByCategory(category) {
        // Implementation for filtering by category
        console.log('Filtering by category:', category);
    }

    // Modal helpers
    showModal(modal) {
        modal.classList.remove('hidden');
        modal.style.animation = 'fadeInUp 0.3s ease';
    }

    hideModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // Utility functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    animateCounter(element, targetValue) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (!element) return;

        let current = 0;
        const increment = targetValue / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 50);
    }
}

// Exam Timer Class
class ExamTimer {
    constructor(duration, displayElement) {
        this.duration = duration * 60; // Convert to seconds
        this.displayElement = displayElement;
        this.timer = null;
        this.startTime = null;
        this.remaining = this.duration;
    }

    start() {
        this.startTime = Date.now();
        this.timer = setInterval(() => this.update(), 1000);
        
        // Add warning animation when time is running low
        if (this.duration <= 300) { // 5 minutes
            this.displayElement.classList.add('pulse');
        }
    }

    update() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.remaining = this.duration - elapsed;

        if (this.remaining <= 0) {
            this.stop();
            this.onTimeUp();
            return;
        }

        // Add warning class when 5 minutes remaining
        if (this.remaining <= 300 && !this.displayElement.classList.contains('pulse')) {
            this.displayElement.classList.add('pulse');
        }

        this.displayTime(this.remaining);
    }

    displayTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        this.displayElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
        // Add color change for urgency
        if (seconds <= 60) {
            this.displayElement.style.color = 'var(--error-color)';
        } else if (seconds <= 300) {
            this.displayElement.style.color = 'var(--warning-color)';
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.displayElement.classList.remove('pulse');
    }

    onTimeUp() {
        // Auto-submit the exam when time is up
        const submitButton = document.getElementById('submitExam');
        if (submitButton) {
            this.showNotification('Time is up! Submitting your exam...', 'warning');
            setTimeout(() => {
                submitButton.click();
            }, 2000);
        }
    }

    showNotification(message, type) {
        // Simple notification for timer
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    window.prep4uApp = new Prep4UApp();
    
    // Initialize upload system if on upload page
    if (document.getElementById('singleQuestionForm')) {
        window.uploadSystem = new QuestionUploadSystem();
    }
    
    // Initialize exam timer if on exam page
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        const examTimer = new ExamTimer(60, timeDisplay);
        examTimer.start();
        
        // Clean up timer when leaving page
        window.addEventListener('beforeunload', () => {
            examTimer.stop();
        });
    }
});

