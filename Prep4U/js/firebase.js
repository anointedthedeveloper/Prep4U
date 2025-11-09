// Firebase Integration JavaScript
class FirebaseIntegration {
    constructor() {
        this.auth = null;
        this.db = null;
        this.storage = null;
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Firebase configuration will be loaded from firebase-config.js
            if (typeof firebaseConfig !== 'undefined') {
                firebase.initializeApp(firebaseConfig);
                this.auth = firebase.auth();
                this.db = firebase.firestore();
                this.storage = firebase.storage();
                this.initialized = true;
                
                this.setupAuthListener();
                console.log('Firebase initialized successfully');
            } else {
                console.warn('Firebase configuration not found. Running in demo mode.');
            }
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }

    // Authentication listener
    setupAuthListener() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.handleUserAuth(user);
            } else {
                this.handleUserSignOut();
            }
        });
    }

    // Handle user authentication
    async handleUserAuth(user) {
        try {
            // Get user data from Firestore
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                window.prep4uApp.currentUser = {
                    uid: user.uid,
                    ...userData
                };
                window.prep4uApp.userRole = userData.role;
                window.prep4uApp.updateUIForAuthState();
            } else {
                // Create user document if it doesn't exist
                await this.createUserDocument(user);
            }
        } catch (error) {
            console.error('Error handling user auth:', error);
        }
    }

    // Create user document in Firestore
    async createUserDocument(user, additionalData = {}) {
        try {
            const userRef = this.db.collection('users').doc(user.uid);
            
            await userRef.set({
                uid: user.uid,
                email: user.email,
                createdAt: new Date(),
                ...additionalData
            });

            console.log('User document created successfully');
        } catch (error) {
            console.error('Error creating user document:', error);
        }
    }

    // Handle user sign out
    handleUserSignOut() {
        window.prep4uApp.currentUser = null;
        window.prep4uApp.userRole = null;
    }

    // Sign in with email and password
    async signIn(email, password) {
        if (!this.initialized) {
            throw new Error('Firebase not initialized');
        }

        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            return result;
        } catch (error) {
            throw new Error(this.getAuthErrorMessage(error.code));
        }
    }

    // Register new user
    async register(userData) {
        if (!this.initialized) {
            throw new Error('Firebase not initialized');
        }

        try {
            // Create user in Firebase Auth
            const result = await this.auth.createUserWithEmailAndPassword(
                userData.email, 
                userData.password
            );

            // Create user document in Firestore
            await this.createUserDocument(result.user, {
                name: userData.name,
                role: userData.role
            });

            return result;
        } catch (error) {
            throw new Error(this.getAuthErrorMessage(error.code));
        }
    }

    // Sign out
    async signOut() {
        if (!this.initialized) {
            throw new Error('Firebase not initialized');
        }

        try {
            await this.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Get authentication error messages
    getAuthErrorMessage(errorCode) {
        const errorMessages = {
            'auth/invalid-email': 'Invalid email address',
            'auth/user-disabled': 'This account has been disabled',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/weak-password': 'Password should be at least 6 characters',
            'auth/network-request-failed': 'Network error. Please check your connection.'
        };

        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    // Firestore data operations

    // Get exams for student
    async getStudentExams() {
        if (!this.initialized) return [];

        try {
            const examsSnapshot = await this.db.collection('exams')
                .where('isActive', '==', true)
                .get();

            return examsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting exams:', error);
            return [];
        }
    }

    // Get exam questions
    async getExamQuestions(examId) {
        if (!this.initialized) return [];

        try {
            const questionsSnapshot = await this.db.collection('exams')
                .doc(examId)
                .collection('questions')
                .get();

            return questionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting questions:', error);
            return [];
        }
    }

    // Submit exam results
    async submitExamResults(examId, answers, timeTaken) {
        if (!this.initialized) return null;

        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const result = {
                studentId: user.uid,
                examId: examId,
                answers: answers,
                timeTaken: timeTaken,
                submittedAt: new Date(),
                score: 0, // Will be calculated
                totalQuestions: answers.length
            };

            // Calculate score
            const examQuestions = await this.getExamQuestions(examId);
            result.score = this.calculateScore(answers, examQuestions);

            // Save to Firestore
            const resultRef = await this.db.collection('examResults').add(result);
            return resultRef.id;
        } catch (error) {
            console.error('Error submitting exam results:', error);
            throw error;
        }
    }

    // Calculate exam score
    calculateScore(answers, questions) {
        let correct = 0;
        
        answers.forEach(answer => {
            const question = questions.find(q => q.id === answer.questionId);
            if (question && this.isAnswerCorrect(answer, question)) {
                correct++;
            }
        });

        return Math.round((correct / questions.length) * 100);
    }

    // Check if answer is correct
    isAnswerCorrect(answer, question) {
        if (question.type === 'multiple-choice') {
            return answer.selectedOption === question.correctAnswer;
        } else if (question.type === 'short-answer') {
            // For short answers, you might want more complex checking
            return answer.answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
        }
        return false;
    }

    // Upload exam questions (admin)
    async uploadExamQuestion(questionData) {
        if (!this.initialized) return null;

        try {
            const questionRef = await this.db.collection('questions').add({
                ...questionData,
                createdAt: new Date(),
                createdBy: this.auth.currentUser.uid
            });

            return questionRef.id;
        } catch (error) {
            console.error('Error uploading question:', error);
            throw error;
        }
    }

    // Get user results
    async getUserResults() {
        if (!this.initialized) return [];

        try {
            const user = this.auth.currentUser;
            if (!user) return [];

            const resultsSnapshot = await this.db.collection('examResults')
                .where('studentId', '==', user.uid)
                .orderBy('submittedAt', 'desc')
                .limit(10)
                .get();

            return resultsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user results:', error);
            return [];
        }
    }

    // Get admin statistics
    async getAdminStats() {
        if (!this.initialized) return {};

        try {
            // Get total users
            const usersSnapshot = await this.db.collection('users').get();
            const totalUsers = usersSnapshot.size;

            // Get total exams
            const examsSnapshot = await this.db.collection('exams').get();
            const totalExams = examsSnapshot.size;

            // Get average score (simplified)
            const resultsSnapshot = await this.db.collection('examResults').get();
            let totalScore = 0;
            let resultCount = 0;

            resultsSnapshot.forEach(doc => {
                const result = doc.data();
                totalScore += result.score;
                resultCount++;
            });

            const platformAvgScore = resultCount > 0 ? Math.round(totalScore / resultCount) : 0;

            return {
                totalUsers,
                totalExams,
                platformAvgScore: platformAvgScore + '%'
            };
        } catch (error) {
            console.error('Error getting admin stats:', error);
            return {};
        }
    }
}

// Initialize Firebase integration
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseIntegration = new FirebaseIntegration();
});