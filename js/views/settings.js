// js/views/settings.js (최종 수정: window.initSettings() 노출)

// 📌 이 함수가 router.js의 loadView()에 의해 DOM 로드 후 호출됩니다.
const initSettings = () => { 
    // EXERCISE_STORAGE_KEY는 storage.js에서 정의되었다고 가정합니다.
    const EXERCISE_STORAGE_KEY = typeof window.EXERCISE_STORAGE_KEY !== 'undefined' ? window.EXERCISE_STORAGE_KEY : 'myhealth_exercises';

    // ----------------------------------------------------
    // 내부 유틸리티 함수 (getExercises, saveExercises 등)
    // ----------------------------------------------------

    const getExercises = () => {
        const stored = localStorage.getItem(EXERCISE_STORAGE_KEY);
        if (stored) {
            try {
                const exercises = JSON.parse(stored);
                return Array.isArray(exercises) ? exercises : []; 
            } catch (e) {
                console.error("Error parsing stored exercises in settings:", e);
                return [];
            }
        }
        return [];
    };

    const saveExercises = (exercises) => {
        try {
            localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(exercises));
        } catch (e) {
            console.error("Error saving exercises to local storage:", e);
            alert("운동 종목 저장에 실패했습니다. (Local Storage 문제)");
        }
    };

    const renderExerciseList = () => {
        const listContainer = document.getElementById('exercise-list');
        if (!listContainer) return; 
        
        const exercises = getExercises();
        
        if (exercises.length === 0) {
            listContainer.innerHTML = '<p style="color: #777;">아직 등록된 운동 종목이 없습니다.</p>';
            return;
        }

        listContainer.innerHTML = exercises.map((exercise, index) => `
            <li class="exercise-item" data-exercise="${exercise}">
                <span>${exercise}</span>
                <button class="btn-delete" data-index="${index}">삭제</button>
            </li>
        `).join('');
    };

    const addExercise = () => {
        const input = document.getElementById('new-exercise-input');
        
        if (!input) {
            console.error("Input element 'new-exercise-input' not found.");
            return;
        }

        const newExercise = input.value.trim();

        if (newExercise === "") {
            alert("운동 종목 이름을 입력해주세요.");
            return;
        }
        let exercises = getExercises();
        if (exercises.map(e => e.toLowerCase()).includes(newExercise.toLowerCase())) {
            alert("이미 등록된 운동 종목입니다.");
            return;
        }
        exercises.push(newExercise);
        saveExercises(exercises);
        input.value = '';
        renderExerciseList();
    };

    const deleteExercise = (index) => {
        let exercises = getExercises();
        if (index >= 0 && index < exercises.length) {
            if (confirm(`정말로 "${exercises[index]}" 종목을 삭제하시겠습니까?`)) {
                exercises.splice(index, 1);
                saveExercises(exercises);
                renderExerciseList();
            }
        }
    };

    // ----------------------------------------------------
    // 이벤트 리스너 설정
    // ----------------------------------------------------

    const setupEventListeners = () => {
        const addBtn = document.getElementById('add-exercise-btn'); 
        const listContainer = document.getElementById('exercise-list');

        if (addBtn) {
            addBtn.addEventListener('click', addExercise); 
            console.log("✅ 'add-exercise-btn' 이벤트 리스너 등록 성공!");
        } else {
             console.error("Fatal: 'add-exercise-btn' 버튼 요소를 찾을 수 없어 이벤트 등록에 실패했습니다.");
        }

        if (listContainer) {
            listContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete')) {
                    const index = parseInt(e.target.dataset.index);
                    deleteExercise(index);
                }
            });
        }
    };


    // ----------------------------------------------------
    // 메인 실행 로직 (initSettings 호출 시 실행)
    // ----------------------------------------------------
    renderExerciseList();
    setupEventListeners();
};

// 📌 전역 노출: router.js에서 이 함수를 호출할 수 있도록 window 객체에 등록합니다.
window.initSettings = initSettings;