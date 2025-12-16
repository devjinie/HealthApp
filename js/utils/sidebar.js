// js/utils/sidebar.js

(() => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    const body = document.body;

    /**
     * 사이드바를 열거나 닫습니다.
     */
    const toggleSidebar = () => {
        if (sidebar && menuBtn && body) {
            // 사이드바의 현재 상태를 확인하여 토글
            const isSidebarOpen = sidebar.classList.contains('open');

            if (isSidebarOpen) {
                // 닫기
                sidebar.classList.remove('open');
                body.classList.remove('sidebar-open');
                console.log("Sidebar closed.");
            } else {
                // 열기
                sidebar.classList.add('open');
                body.classList.add('sidebar-open');
                console.log("Sidebar opened.");
            }
        }
    };

    /**
     * 초기 이벤트 리스너를 설정합니다.
     */
    const setupSidebarListeners = () => {
        if (menuBtn) {
            menuBtn.addEventListener('click', toggleSidebar);
        }
        
        // 사이드바 내부의 링크 클릭 시 닫기
        if (sidebar) {
            sidebar.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (sidebar.classList.contains('open')) {
                         // 링크 클릭 후 사이드바 닫기
                        toggleSidebar(); 
                    }
                });
            });
        }

        // 화면 크기 조정 시 (데스크탑 전환 시) 사이드바 닫기
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('open')) {
                // 데스크탑 크기에서 사이드바가 열려있다면 닫습니다.
                toggleSidebar(); 
            }
        });

        // 뷰 로드 후, 초기 상태 확인 (선택 사항: 페이지 로드 시 상태 유지 로직 추가 가능)
        if (sidebar && !window.location.hash) {
            // 기본적으로 닫힌 상태 유지
            sidebar.classList.remove('open');
            body.classList.remove('sidebar-open');
        }
    };
    
    // DOM 로드 완료 후 리스너 설정
    document.addEventListener('DOMContentLoaded', setupSidebarListeners);
})();