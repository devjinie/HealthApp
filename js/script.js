// js/script.js (최종 안정화 버전)

const views = {
    'home': 'views/home.html',
    'settings': 'views/settings.html',
    'record': 'views/record.html',
    'stats': 'views/stats.html'
};

const scriptPaths = {
    'settings': 'js/views/settings.js',
    'record': 'js/views/record.js',
    'stats': 'js/views/stats.js'
};

/**
 * 뷰에 해당하는 스크립트를 로드하고, 이전 스크립트를 안전하게 제거합니다.
 */
const loadScript = (scriptPath) => {
    // 1. 이전 스크립트 제거 (ID를 사용하여 안정적으로 제거)
    const oldScript = document.getElementById('current-view-script');
    if (oldScript) {
        console.log(`[Router] 이전 스크립트 제거: ${oldScript.src}`);
        oldScript.remove();
    }
    
    if (scriptPath) {
        // 2. 새 스크립트 생성 및 추가
        const script = document.createElement('script');
        script.src = scriptPath;
        script.id = 'current-view-script'; 
        
        // 스크립트 로드 상태 확인을 위한 리스너 (디버깅 목적)
        script.onload = () => {
            console.log(`[Router] 새 스크립트 로드 완료: ${scriptPath}`);
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
    const content = document.getElementById('app-content');
    const viewPath = views[viewName] || views['home'];
    const scriptPath = scriptPaths[viewName];

    try {
        const response = await fetch(viewPath);
        if (!response.ok) throw new Error(`Failed to load view: ${viewPath}`);
        
        const html = await response.text();
        
        // 1. HTML 콘텐츠 업데이트
        content.innerHTML = html;
        
        // 2. DOM 조작 후에 해당 뷰 스크립트 로드 (IIFE 충돌 방지)
        loadScript(scriptPath);

        // 사이드바 닫기
        document.getElementById('sidebar').classList.remove('open');

        // URL 해시 업데이트
        history.pushState(null, null, `#${viewName}`);

    } catch (error) {
        console.error("Navigation error:", error);
        content.innerHTML = '<div class="card"><h2>오류 발생</h2><p>화면을 불러오는 데 실패했습니다.</p></div>';
    }
};

/**
 * 초기 로드 시 URL 해시에 따라 적절한 뷰를 로드합니다.
 */
const handleInitialLoad = () => {
    const initialView = window.location.hash.substring(1) || 'home';
    navigateTo(initialView);
};

// ----------------------------------------------------
// 이벤트 리스너 설정
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const navLinks = sidebar.querySelectorAll('a');

    // 메뉴 토글
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // 네비게이션 링크 클릭
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.target.getAttribute('data-view');
            navigateTo(view);
        });
    });

    // 뒤로가기/앞으로가기 버튼 처리
    window.addEventListener('popstate', handleInitialLoad);

    // 초기 화면 로드
    handleInitialLoad();
});

console.log("⚙️ 메인 스크립트 로드 완료.");