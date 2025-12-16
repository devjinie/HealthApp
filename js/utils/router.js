// js/utils/router.js (최종 안정화 버전)

const routes = {
    // 📌 뷰 HTML 경로와 초기화 함수 이름을 쌍으로 정의
    '/record': { view: 'views/record.html', init: 'initRecord' }, 
    '/stats': { view: 'views/stats.html', init: 'initStats' },
    '/settings': { view: 'views/settings.html', init: 'initSettings' }, 
};

/**
 * URL 해시를 기반으로 해당 뷰 파일을 로드하여 메인 콘텐츠 영역에 삽입합니다.
 */
const loadView = async (path) => {
    const mainContent = document.getElementById('main-content');
    const route = routes[path];

    if (!route) {
        mainContent.innerHTML = '<h2>404 Not Found</h2><p>요청하신 페이지를 찾을 수 없습니다.</p>';
        return;
    }

    try {
        // 1. HTML 뷰 로드
        const response = await fetch(route.view);
        if (!response.ok) {
            throw new Error(`Failed to load view: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        mainContent.innerHTML = html;
        
        // 2. 해당 뷰의 초기화 함수 호출 (DOM 로드 후 실행)
        // 📌 여기서 window.initSettings()를 호출합니다.
        if (route.init && typeof window[route.init] === 'function') {
            window[route.init](); 
            console.log(`✅ ${route.init} 함수 실행 완료.`);
        } else if (route.init) {
            console.error(`Initialization function ${route.init} not found or not a function.`);
        }

    } catch (error) {
        console.error('뷰 로드 중 치명적인 오류 발생:', error);
        mainContent.innerHTML = `<h2>오류</h2><p>뷰를 로드하지 못했습니다: ${error.message}</p>`;
    }
};

const handleRoute = () => {
    let path = window.location.hash.substring(1) || '/record'; 
    if (path === '/') path = '/record';

    loadView(path);
};

// 해시 변경 이벤트 리스너 등록
window.addEventListener('hashchange', handleRoute);

// 초기 진입 시 handleRoute를 전역으로 노출
window.handleRoute = handleRoute;