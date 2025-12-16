// js/views/stats.js

(() => { 
    /**
     * 로컬 저장소에서 모든 운동 기록을 불러옵니다.
     */
    const getRecords = () => { /* ... */ };

    /**
     * 전체 운동 요약 정보 (총 횟수, 날짜 수)를 계산하고 렌더링합니다.
     */
    const renderSummary = (records) => { /* ... */ };

    /**
     * 종목별 최고 기록 (최대 볼륨 기반)을 계산하고 렌더링합니다.
     */
    const renderMaxRecords = (records) => { /* ... */ };

    /**
     * 최근 5개의 기록을 렌더링합니다.
     */
    const renderRecentRecords = (records) => { /* ... */ };

    /**
     * 전체 기록 내역을 렌더링하고 삭제 기능을 추가합니다.
     */
    const renderAllRecordsForDeletion = (records) => { /* ... */ };

    /**
     * 특정 운동 기록을 삭제합니다.
     */
    const deleteRecord = (recordId) => {
        if (!confirm('이 기록을 영구적으로 삭제하시겠습니까?')) return;

        let records = getRecords();
        const idToDelete = Number(recordId);

        const initialLength = records.length;
        records = records.filter(record => record.id !== idToDelete);

        if (records.length === initialLength) {
            alert("삭제하려는 기록을 찾을 수 없습니다.");
            return;
        }

        localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(records));
        alert("기록이 성공적으로 삭제되었습니다.");
        
        // 삭제 후 모든 화면 요소 갱신
        const allRecords = getRecords();
        renderSummary(allRecords);
        renderMaxRecords(allRecords);
        renderRecentRecords(allRecords); 
        renderAllRecordsForDeletion(allRecords);
    };


    /**
     * 이벤트 리스너를 설정합니다. (IIFE 내부에 격리)
     */
    const setupEventListeners = () => {
        const listElement = document.getElementById('all-records-list');
        if (listElement) {
            listElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-record')) {
                    const recordId = e.target.dataset.id;
                    deleteRecord(recordId);
                }
            });
        }
    };


    /**
     * 통계 화면 초기화 및 데이터 로드
     */
    const initStatsView = () => {
        console.log("📊 통계 화면 스크립트 로드됨!");
        const allRecords = getRecords();
        
        renderSummary(allRecords);
        renderMaxRecords(allRecords);
        renderRecentRecords(allRecords);
        renderAllRecordsForDeletion(allRecords); 
        setupEventListeners();
    };

    // ----------------------------------------------------
    // 통계 화면 로딩 시 실행될 메인 로직
    // ----------------------------------------------------
    initStatsView();
})();