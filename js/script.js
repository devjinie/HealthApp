// js/script.js

// ----------------------------------------------------
// 1. 라우팅 설정
// ----------------------------------------------------
const views = {
    'home': 'views/home.html',
    'settings': 'views/settings.html',
    'record': 'views/record.html',
    'stats': 'views/stats.html'
};

const scriptPaths = {
    // 모든 뷰 스크립트가 IIFE로 변경되었다고 가정
    'settings': 'js/views/settings.js',
    'record': 'js/views/record.js',
    'stats': 'js/views/stats.js' // stats.js도 IIFE로 동작해야 합니다.
};

/**
 * 뷰에 해당하는 스크립트를 로드하고, 이전 스크립트를 안전하게 제거합니다.
 */
const loadScript = (viewName) => {
    const scriptPath = scriptPaths[viewName];

    // 1. 이전 스크립트 제거 (ID를 사용하여 안정적으로 제거)
    const oldScript = document.getElementById('current-view-script');
    if (oldScript) {
        console.log(`[Router] 이전 스크립트 제거: ${oldScript.src}`);
        // 스크립트 제거 전에 전역에서 선언되었던 함수 포인터를 정리할 필요가 없습니다.
        // (모든 뷰 스크립트가 IIFE 구조로 변경되었기 때문)
        oldScript.remove();
    }
    
    if (scriptPath) {
        // 2. 새 스크립트 생성 및 추가
        const script = document.createElement('script');
        script.src = scriptPath;
        script.id = 'current-view-script'; 
        
        script.onload = () => {
            console.log(`[Router] 새 스크립트 로드 완료: ${scriptPath}`);
            
            // 📌 [제거됨] 모든 뷰 스크립트가 IIFE 내부에서 스스로 초기화하므로,
            // 여기서 명시적인 window.initXXX() 호출은 필요 없습니다.
        };
        script.onerror = () => {
             console.error(`[Router] 스크립트 로드 오류: ${scriptPath}`);
        };

        // DOM에 삽입하여 실행
        document.body.appendChild(script);
    } else {
        console.log('[Router] 뷰에 해당하는 스크립트 없음 (예: home.html).');
    }
};

/**
 * 특정 뷰로 이동하고 해당 HTML 및 JS 파일을 로드합니다.
 */
const navigateTo = async (viewName) => {
    const content = document.getElementById('main-content'); 
    const viewPath = views[viewName] || views['home'];

    try {
        const response = await fetch(viewPath);
        if (!response.ok) throw new Error(`Failed to load view: ${viewPath}`);
        
        const html = await response.text();
        
        // 1. HTML 콘텐츠 업데이트
        if(content) content.innerHTML = html;
        
        // 2. DOM 조작 후에 해당 뷰 스크립트 로드
        loadScript(viewName);

        // 3. 사이드바 닫기 (오버레이 방식)
        document.body.classList.remove('sidebar-open');

        // 4. URL 해시 업데이트
        // history.pushState(state, title, url)
        history.pushState(null, null, `#/${viewName}`);

    } catch (error) {
        console.error("Navigation error:", error);
        if(content) content.innerHTML = '<div class="card"><h2>오류 발생</h2><p>화면을 불러오는 데 실패했습니다.</p></div>';
    }
};

/**
 * 초기 로드 시 URL 해시에 따라 적절한 뷰를 로드합니다.
 */
const handleInitialLoad = () => {
    const hash = window.location.hash;
    // #/viewName 형식에서 viewName만 추출
    const initialView = hash.startsWith('#/') ? hash.substring(2) : 'home'; 
    navigateTo(initialView);
};


// ----------------------------------------------------
// 2. 사이드바 제어 로직 (오버레이 모드)
// ----------------------------------------------------

/**
 * 사이드바 토글 함수 (body 클래스만 제어)
 */
window.toggleSidebar = () => {
    const body = document.body;
    body.classList.toggle('sidebar-open');
    console.log(`Sidebar State: ${body.classList.contains('sidebar-open') ? 'Open' : 'Closed'}`);
};


// ----------------------------------------------------
// 3. 이벤트 리스너 설정
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn'); 
    const sidebar = document.getElementById('sidebar');
    const navLinks = sidebar ? sidebar.querySelectorAll('a') : [];
    
    // 1. 메뉴 토글 (사이드바 열기)
    if (menuBtn) {
        menuBtn.addEventListener('click', window.toggleSidebar);
    }
    
    // 2. 네비게이션 링크 클릭 (라우팅)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            if (hash.startsWith('#/')) {
                e.preventDefault();
                const view = hash.substring(2);
                navigateTo(view);
            }
        });
    });
    
    // 3. 오버레이 클릭 시 닫기
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', window.toggleSidebar);
    }

    // 4. 뒤로가기/앞으로가기 버튼 처리
    window.addEventListener('popstate', handleInitialLoad);

    // 5. 초기 화면 로드
    handleInitialLoad();
});

console.log("⚙️ 메인 스크립트 로드 완료.");