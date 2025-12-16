// js/views/settings.js (수정된 전체 코드)

// 📌 [수정] 전체 코드를 즉시 실행 함수(IIFE)로 감싸서 전역 변수 충돌을 방지합니다.
(() => {

    const EXERCISE_STORAGE_KEY = typeof window.EXERCISE_STORAGE_KEY !== 'undefined' ? window.EXERCISE_STORAGE_KEY : 'myhealth_exercises';
    
    // ----------------------------------------------------
    // 📝 데이터 관리 함수
    // ----------------------------------------------------
    
    const getExercises = () => {
        const stored = localStorage.getItem(EXERCISE_STORAGE_KEY);
        if (stored) {
            try {
                // 저장된 데이터가 배열이 아닐 경우 빈 배열 반환
                const exercises = JSON.parse(stored);
                return Array.isArray(exercises) ? exercises : [];
            } catch (e) {
                console.error("Error parsing stored exercises:", e);
                return [];
            }
        }
        return [];
    };

    const saveExercises = (exercises) => {
        localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(exercises));
        renderExerciseList();
    };

    const addExercise = (name) => {
        const trimmedName = name.trim();
        if (trimmedName === "") {
             alert('종목 이름을 입력해주세요.');
            return;
        }
        
        const currentExercises = getExercises();
        if (currentExercises.includes(trimmedName)) {
            alert('이미 존재하는 종목입니다.');
            return;
        }
        
        currentExercises.push(trimmedName);
        saveExercises(currentExercises);
    };

    const removeExercise = (name) => {
        let currentExercises = getExercises();
        currentExercises = currentExercises.filter(ex => ex !== name);
        saveExercises(currentExercises);
    };

    // ----------------------------------------------------
    // 🧱 렌더링 함수
    // ----------------------------------------------------

    const renderExerciseList = () => {
        const listContainer = document.getElementById('exercise-list');
        if (!listContainer) return;

        const exercises = getExercises();
        
        if (exercises.length === 0) {
            listContainer.innerHTML = '<p class="placeholder-text">등록된 운동 종목이 없습니다.</p>';
            return;
        }

        listContainer.innerHTML = exercises.map(ex => `
            <li class="exercise-item" data-name="${ex}">
                <span>${ex}</span>
                <button class="btn-delete" data-name="${ex}">삭제</button>
            </li>
        `).join('');
    };

    // ----------------------------------------------------
    // 👂 이벤트 리스너 설정
    // ----------------------------------------------------

    const setupEventListeners = () => {
        const addBtn = document.getElementById('add-exercise-btn');
        const input = document.getElementById('new-exercise-input');
        const listContainer = document.getElementById('exercise-list');

        // 운동 추가 버튼 클릭
        if (addBtn && input) {
            addBtn.addEventListener('click', () => {
                const name = input.value;
                addExercise(name);
                input.value = ''; // 입력 필드 초기화
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    addBtn.click();
                }
            });
        }
        
        // 종목 삭제 버튼 클릭 (이벤트 위임)
        if (listContainer) {
            listContainer.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('btn-delete')) {
                    const name = target.dataset.name;
                    if (confirm(`정말로 "${name}" 종목을 삭제하시겠습니까?`)) {
                        removeExercise(name);
                    }
                }
            });
        }
    };
    
    // ----------------------------------------------------
    // 🚀 뷰 초기화
    // ----------------------------------------------------
    
    // 📌 [수정] initSettings 함수 정의 대신, IIFE 실행 시 바로 초기화 로직 실행
    const initSettings = () => { // 함수 이름은 유지하되, IIFE 내 지역 함수로만 사용
        renderExerciseList();
        setupEventListeners();
        console.log("✅ Settings View 기능 초기화 완료.");
    };

    // 뷰 로드가 완료되면 초기화 함수를 바로 실행합니다.
    initSettings();

})(); // IIFE 종료