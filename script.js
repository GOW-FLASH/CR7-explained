// بيانات التطبيق
let appState = {
    currentPage: 'home',
    progress: 0,
    completedSections: [],
    questionStats: {
        obligatory: { answered: 0, correct: 0 },
        bank: { answered: 0, correct: 0 }
    }
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadPageContent('home');
    updateProgress();
});

// تهيئة التطبيق
function initApp() {
    // إضافة مستمعي الأحداث للتنقل
    setupNavigation();
    
    // إضافة مستمعي الأحداث للبطاقات
    setupCardClicks();
    
    // تحميل حالة التقدم من التخزين المحلي
    loadProgressFromStorage();
}

// إعداد التنقل
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            changePage(sectionId);
        });
    });
}

// إضافة مستمعي الأحداث للبطاقات
function setupCardClicks() {
    const sectionCards = document.querySelectorAll('.section-card');
    
    sectionCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            changePage(sectionId);
        });
    });
}

// تغيير الصفحة
function changePage(sectionId) {
    // تحديث الحالة
    appState.currentPage = sectionId;
    
    // تحديث التنقل
    updateNavigation(sectionId);
    
    // تحديث عنوان الصفحة
    updateHeaderTitle(sectionId);
    
    // تحميل محتوى الصفحة
    loadPageContent(sectionId);
    
    // حفظ الحالة
    saveProgressToStorage();
}

// تحديث التنقل
function updateNavigation(sectionId) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
}

// تحديث عنوان الصفحة
function updateHeaderTitle(sectionId) {
    const headerTitle = document.querySelector('.header h2');
    const titles = {
        'home': 'مرحباً بك في CR7 ACADEMY',
        'mind-map': 'الخريطة الذهنية',
        'part1': 'الجزء الأول: المفاهيم والخصائص',
        'part2': 'الجزء الثاني: استراتيجيات التسعير',
        'part3': 'الجزء الثالث: أزمة الإدارة والقيادة',
        'obligatory': 'الأسئلة الملزمة (55 سؤال)',
        'question-bank': 'بنك الأسئلة (200 سؤال)',
        'charts': 'الرسومات البيانية التفاعلية'
    };
    
    if (titles[sectionId]) {
        headerTitle.textContent = titles[sectionId];
    }
}

// تحميل محتوى الصفحة
async function loadPageContent(sectionId) {
    // إخفاء جميع الصفحات
    hideAllPages();
    
    // إظهار مؤشر التحميل
    showLoading();
    
    try {
        let content = '';
        
        switch(sectionId) {
            case 'home':
                // الصفحة الرئيسية محملة بالفعل
                document.getElementById('home').classList.add('active');
                hideLoading();
                return;
                
            case 'part1':
                content = await loadHTMLContent('content-part1.html');
                break;
                
            case 'part2':
                content = await loadHTMLContent('content-part2.html');
                break;
                
            case 'part3':
                content = await loadHTMLContent('content-part3.html');
                break;
                
            case 'obligatory':
                content = await loadHTMLContent('obligatory-questions.html');
                break;
                
            case 'question-bank':
                content = await loadHTMLContent('question-bank.html');
                break;
                
            case 'mind-map':
                content = await loadHTMLContent('mind-map.html');
                break;
                
            case 'charts':
                content = await loadHTMLContent('charts.html');
                break;
        }
        
        // إدراج المحتوى في الصفحة
        const pageElement = document.getElementById(sectionId);
        if (pageElement) {
            pageElement.innerHTML = content;
            pageElement.classList.add('active');
            
            // تهيئة محتوى الصفحة
            initializePageContent(sectionId);
        }
        
    } catch (error) {
        console.error('خطأ في تحميل المحتوى:', error);
        showError('حدث خطأ في تحميل المحتوى. يرجى المحاولة مرة أخرى.');
    } finally {
        hideLoading();
    }
}

// تحميل محتوى HTML من ملف
async function loadHTMLContent(fileName) {
    const response = await fetch(fileName);
    if (!response.ok) {
        throw new Error(`فشل تحميل ${fileName}`);
    }
    return await response.text();
}

// إخفاء جميع الصفحات
function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
}

// إظهار مؤشر التحميل
function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

// إخفاء مؤشر التحميل
function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// إظهار خطأ
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="background-color: #ffebee; border: 1px solid var(--error-color); color: var(--error-color);
                    padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <i class="fas fa-exclamation-circle"></i> ${message}
        </div>
    `;
    
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        contentArea.appendChild(errorDiv);
        
        // إزالة رسالة الخطأ بعد 5 ثوان
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// تهيئة محتوى الصفحة
function initializePageContent(sectionId) {
    switch(sectionId) {
        case 'part1':
        case 'part2':
        case 'part3':
            initializeContentPage();
            break;
            
        case 'obligatory':
            initializeObligatoryQuestions();
            break;
            
        case 'question-bank':
            initializeQuestionBank();
            break;
            
        case 'mind-map':
            initializeMindMap();
            break;
            
        case 'charts':
            initializeCharts();
            break;
    }
}

// تهيئة صفحات المحتوى التعليمي
function initializeContentPage() {
    // إضافة مستمعي الأحداث للروابط الداخلية
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // تحديث حالة القسم كمكتمل عند الوصول لنهاية الصفحة
    setupCompletionTracking();
}

// تتبع إكمال قسم
function setupCompletionTracking() {
    const currentSection = appState.currentPage;
    
    // التحقق إذا كان القسم مكتملاً بالفعل
    if (appState.completedSections.includes(currentSection)) {
        return;
    }
    
    // إضافة مستمع لحدث التمرير
    let hasReachedBottom = false;
    
    window.addEventListener('scroll', function() {
        const page = document.getElementById(currentSection);
        if (!page) return;
        
        const pageBottom = page.offsetTop + page.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition >= pageBottom - 100 && !hasReachedBottom) {
            hasReachedBottom = true;
            markSectionAsCompleted(currentSection);
        }
    });
}

// تحديد قسم كمكتمل
function markSectionAsCompleted(sectionId) {
    if (!appState.completedSections.includes(sectionId)) {
        appState.completedSections.push(sectionId);
        updateProgress();
        saveProgressToStorage();
        
        // إظهار رسالة نجاح
        showSuccessMessage(`مبروك! لقد أكملت ${getSectionName(sectionId)}`);
    }
}

// الحصول على اسم القسم
function getSectionName(sectionId) {
    const names = {
        'part1': 'الجزء الأول: المفاهيم والخصائص',
        'part2': 'الجزء الثاني: استراتيجيات التسعير',
        'part3': 'الجزء الثالث: أزمة الإدارة والقيادة'
    };
    
    return names[sectionId] || 'هذا القسم';
}

// إظهار رسالة نجاح
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="background-color: #e8f5e9; border: 1px solid var(--success-color); color: var(--success-color);
                    padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; position: fixed;
                    top: 100px; right: 50%; transform: translateX(50%); z-index: 1000; min-width: 300px;">
            <i class="fas fa-check-circle"></i> ${message}
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // إزالة رسالة النجاح بعد 3 ثوان
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// تحديث التقدم
function updateProgress() {
    // حساب النسبة المئوية للتقدم
    const totalSections = 3; // الأجزاء التعليمية الثلاثة
    const completed = appState.completedSections.length;
    const questionProgress = (appState.questionStats.obligatory.answered / 55) * 0.3 +
                           (appState.questionStats.bank.answered / 200) * 0.2;
    
    appState.progress = Math.min(100, ((completed / totalSections) * 0.5 + questionProgress) * 100);
    
    // تحديث عرض دائرة التقدم
    const progressCircle = document.getElementById('progressCircle');
    if (progressCircle) {
        progressCircle.style.background = `conic-gradient(var(--accent-color) 0% ${appState.progress}%, #eee ${appState.progress}% 100%)`;
        
        const progressText = progressCircle.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${Math.round(appState.progress)}%`;
        }
    }
    
    // تحديث النصوص
    const progressSubtitle = document.querySelector('.progress-subtitle');
    if (progressSubtitle) {
        progressSubtitle.textContent = `${Math.round(appState.progress)}% من المادة مكتمل`;
    }
}

// حفظ التقدم في التخزين المحلي
function saveProgressToStorage() {
    try {
        localStorage.setItem('cr7_academy_progress', JSON.stringify(appState));
    } catch (error) {
        console.error('خطأ في حفظ التقدم:', error);
    }
}

// تحميل التقدم من التخزين المحلي
function loadProgressFromStorage() {
    try {
        const savedProgress = localStorage.getItem('cr7_academy_progress');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            appState = { ...appState, ...parsed };
            updateProgress();
        }
    } catch (error) {
        console.error('خطأ في تحميل التقدم:', error);
    }
}

// الوظائف الأخرى سيتم تعريفها في الملفات الخاصة بها
function initializeObligatoryQuestions() {
    console.log('تهيئة الأسئلة الملزمة...');
    // سيتم تعريفها في obligatory-questions.html
}

function initializeQuestionBank() {
    console.log('تهيئة بنك الأسئلة...');
    // سيتم تعريفها في question-bank.html
}

function initializeMindMap() {
    console.log('تهيئة الخريطة الذهنية...');
    // سيتم تعريفها في mind-map.html
}

function initializeCharts() {
    console.log('تهيئة الرسومات البيانية...');
    // سيتم تعريفها في charts.html
}

// تصدير الدوال للاستخدام في الملفات الأخرى
if (typeof window !== 'undefined') {
    window.appState = appState;
    window.changePage = changePage;
    window.updateProgress = updateProgress;
    window.markSectionAsCompleted = markSectionAsCompleted;
    window.getSectionName = getSectionName;
}