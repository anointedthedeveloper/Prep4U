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
        this.checkAuthentication();
        this.initializeRoleBasedUI();
    }

    // Hamburger Menu functionality
    initializeHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // Authentication forms handling
    initializeAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');

        // Toggle between login and register forms
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('loginForm').closest('.auth-card').classList.add('hidden');
                document.getElementById('registerCard').classList.remove('hidden');
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('registerCard').classList.add('hidden');
                document.getElementById('loginForm').closest('.auth-card').classList.remove('hidden');
            });
        }

        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const credentials = {
                    email: formData.get('email'),
                    password: formData.get('password')
                };

                try {
                    // Firebase authentication will be implemented here
                    await this.handleLogin(credentials);
                } catch (error) {
                    this.showError('Login failed: ' + error.message);
                }
            });
        }

        // Register form submission
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    role: formData.get('role')
                };

                try {
                    // Firebase registration will be implemented here
                    await this.handleRegistration(userData);
                } catch (error) {
                    this.showError('Registration failed: ' + error.message);
                }
            });
        }
    }

    // Check if user is authenticated
    async checkAuthentication() {
        // Firebase authentication state listener will be implemented here
        // This is a placeholder for Firebase integration
        const user = localStorage.getItem('prep4u_user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.userRole = this.currentUser.role;
            this.updateUIForAuthState();
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

        // Update user name display
        const userNameElements = document.querySelectorAll('#userName, #adminName');
        userNameElements.forEach(element => {
            if (element && this.currentUser) {
                element.textContent = this.currentUser.name;
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
        // Firebase data loading will be implemented here
        console.log('Loading admin dashboard data...');
        
        // Placeholder data - will be replaced with Firebase calls
        const stats = {
            totalUsers: 150,
            totalExams: 25,
            platformAvgScore: '78%'
        };

        this.updateAdminStats(stats);
        this.loadRecentSubmissions();
    }

    // Load student dashboard data
    async loadStudentDashboard() {
        // Firebase data loading will be implemented here
        console.log('Loading student dashboard data...');
        
        // Placeholder data - will be replaced with Firebase calls
        const stats = {
            activeExams: 3,
            completedExams: 12,
            averageScore: '85%'
        };

        this.updateStudentStats(stats);
        this.loadAvailableExams();
        this.loadRecentResults();
    }

    // Update admin statistics
    updateAdminStats(stats) {
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalExams').textContent = stats.totalExams;
        document.getElementById('platformAvgScore').textContent = stats.platformAvgScore;
    }

    // Update student statistics
    updateStudentStats(stats) {
        document.getElementById('activeExams').textContent = stats.activeExams;
        document.getElementById('completedExams').textContent = stats.completedExams;
        document.getElementById('averageScore').textContent = stats.averageScore;
    }

    // Load available exams for students
    async loadAvailableExams() {
        const examList = document.getElementById('examList');
        if (!examList) return;

        // Placeholder - will be replaced with Firebase data
        const exams = [
            { id: 1, title: 'Mathematics Final Exam', duration: '60 min', questions: 25 },
            { id: 2, title: 'Science Quiz', duration: '30 min', questions: 15 },
            { id: 3, title: 'History Test', duration: '45 min', questions: 20 }
        ];

        examList.innerHTML = exams.map(exam => `
            <div class="exam-item">
                <h4>${exam.title}</h4>
                <p>Duration: ${exam.duration} • Questions: ${exam.questions}</p>
                <a href="take-exam.html?exam=${exam.id}" class="btn btn-primary">Start Exam</a>
            </div>
        `).join('');
    }

    // Load recent results for students
    async loadRecentResults() {
        const recentResults = document.getElementById('recentResults');
        if (!recentResults) return;

        // Placeholder - will be replaced with Firebase data
        const results = [
            { exam: 'Mathematics Midterm', score: '92%', date: '2024-01-15' },
            { exam: 'Science Quiz', score: '85%', date: '2024-01-10' },
            { exam: 'History Test', score: '78%', date: '2024-01-05' }
        ];

        recentResults.innerHTML = results.map(result => `
            <div class="result-item">
                <h4>${result.exam}</h4>
                <p>Score: ${result.score} • Date: ${result.date}</p>
            </div>
        `).join('');
    }

    // Load recent submissions for admin
    async loadRecentSubmissions() {
        const recentSubmissions = document.getElementById('recentSubmissions');
        if (!recentSubmissions) return;

        // Placeholder - will be replaced with Firebase data
        const submissions = [
            { student: 'John Doe', exam: 'Mathematics Final', score: '88%', time: '45 min' },
            { student: 'Jane Smith', exam: 'Science Quiz', score: '92%', time: '28 min' },
            { student: 'Mike Johnson', exam: 'History Test', score: '76%', time: '40 min' }
        ];

        recentSubmissions.innerHTML = submissions.map(submission => `
            <div class="submission-item">
                <h4>${submission.student} - ${submission.exam}</h4>
                <p>Score: ${submission.score} • Time: ${submission.time}</p>
            </div>
        `).join('');
    }

    // Handle login (Firebase integration placeholder)
    async handleLogin(credentials) {
        // This will be implemented in firebase.js
        console.log('Login attempt:', credentials);
        
        // Simulate successful login
        this.currentUser = {
            name: 'Demo User',
            email: credentials.email,
            role: 'student'
        };
        
        localStorage.setItem('prep4u_user', JSON.stringify(this.currentUser));
        window.location.href = 'dashboard.html';
    }

    // Handle registration (Firebase integration placeholder)
    async handleRegistration(userData) {
        // This will be implemented in firebase.js
        console.log('Registration attempt:', userData);
        
        // Simulate successful registration
        this.currentUser = {
            name: userData.name,
            email: userData.email,
            role: userData.role
        };
        
        localStorage.setItem('prep4u_user', JSON.stringify(this.currentUser));
        
        if (userData.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }

    // Handle logout
    handleLogout() {
        localStorage.removeItem('prep4u_user');
        this.currentUser = null;
        this.userRole = null;
        window.location.href = 'index.html';
    }

    // Utility function to show errors
    showError(message) {
        alert(message); // In production, use a better error display method
    }
}

// Exam Timer Class
class ExamTimer {
    constructor(duration, displayElement) {
        this.duration = duration * 60; // Convert to seconds
        this.displayElement = displayElement;
        this.timer = null;
        this.startTime = null;
    }

    start() {
        this.startTime = Date.now();
        this.timer = setInterval(() => this.update(), 1000);
    }

    update() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const remaining = this.duration - elapsed;

        if (remaining <= 0) {
            this.stop();
            this.onTimeUp();
            return;
        }

        this.displayTime(remaining);
    }

    displayTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        this.displayElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    stop() {
        clearInterval(this.timer);
    }

    onTimeUp() {
        // Auto-submit the exam when time is up
        const submitButton = document.getElementById('submitExam');
        if (submitButton) {
            submitButton.click();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.prep4uApp = new Prep4UApp();
    
    // Initialize exam timer if on exam page
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        const examTimer = new ExamTimer(60, timeDisplay); // 60 minutes default
        examTimer.start();
    }
});