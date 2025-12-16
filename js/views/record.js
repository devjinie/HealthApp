// js/views/record.js (수정된 전체 코드)

// 📌 [수정] 전체 코드를 즉시 실행 함수(IIFE)로 감싸서 전역 변수 충돌을 방지합니다.
(() => {

    // 📌 상수 정의 (storage.js에서 정의된 것을 사용)
    const EXERCISE_STORAGE_KEY = typeof window.EXERCISE_STORAGE_KEY !== 'undefined' ? window.EXERCISE_STORAGE_KEY : 'myhealth_exercises';
    const RECORD_STORAGE_KEY = typeof window.RECORD_STORAGE_KEY !== 'undefined' ? window.RECORD_STORAGE_KEY : 'myhealth_records';
    
    // 현재 세션에 추가된 운동 기록을 임시로 저장하는 배열
    let currentSessionRecords = []; 
    
    // ----------------------------------------------------
    // 📝 기록 관리 유틸리티 함수
    // ----------------------------------------------------

    const getExercises = () => {
        const stored = localStorage.getItem(EXERCISE_STORAGE_KEY);
        if (stored) {
            try {
                const exercises = JSON.parse(stored);
                return Array.isArray(exercises) ? exercises : [];
            } catch (e) {
                console.error("Error parsing stored exercises:", e);
                return [];
            }
        }
        return [];
    };

    const setInitialDate = () => {
        const dateInput = document.getElementById('record-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().substring(0, 10);
        }
    };
    
    // ----------------------------------------------------
    // 🧱 렌더링 및 모달 함수
    // ----------------------------------------------------
    
    /**
     * 운동 종목 추가 모달에 리스트를 채웁니다.
     */
    const populateModalList = () => {
        const listElement = document.getElementById('modal-exercise-list');
        if (!listElement) return;

        const allExercises = getExercises(); 
        
        if (allExercises.length === 0) {
            listElement.innerHTML = '<li style="text-align: center;">등록된 종목이 없습니다. 설정 화면에서 추가하세요.</li>';
            return;
        }

        // 종목이 있다면 리스트 항목 생성
        listElement.innerHTML = allExercises.map(exercise => `
            <li class="modal-list-item" data-exercise="${exercise}">${exercise}</li>
        `).join('');
    };
    
    /**
     * 세트 입력 필드에 변경이 있을 때 currentSessionRecords에 반영합니다.
     */
    const setupInputListeners = () => {
        const container = document.getElementById('exercise-records-container');
        if (!container) return;
        
        container.querySelectorAll('.set-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const recordIndex = parseInt(e.target.dataset.recordIndex);
                const setIndex = parseInt(e.target.dataset.setIndex);
                // 입력 값이 비어있을 경우 0으로 처리하거나, parseFloat으로 처리하여 소수점도 허용
                // 사용자가 0보다 큰 값만 저장할 수 있도록 엄격하게 처리 (saveAllRecords 참조)
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value); 

                if (currentSessionRecords[recordIndex] && currentSessionRecords[recordIndex].sets[setIndex]) {
                    if (e.target.classList.contains('set-weight')) {
                        currentSessionRecords[recordIndex].sets[setIndex].weight = value;
                    } else if (e.target.classList.contains('set-reps')) {
                        currentSessionRecords[recordIndex].sets[setIndex].reps = value;
                    }
                }
            });
        });
    };
    
    /**
     * 현재 세션의 모든 운동 기록 카드(테이블)를 렌더링합니다.
     */
    const renderAllSessionRecords = () => {
        const container = document.getElementById('exercise-records-container');
        const saveAllRecordsBtn = document.getElementById('save-all-records-btn'); 
        if (!container || !saveAllRecordsBtn) return;

        if (currentSessionRecords.length === 0) {
            // 수정된 간결한 플레이스홀더 텍스트
            container.innerHTML = '<p class="placeholder-text" style="color: #777; text-align: center; padding: 20px; border: 1px dashed #ccc; border-radius: 4px;">현재 기록 중인 운동 종목이 없습니다.</p>'; 
            
            saveAllRecordsBtn.style.display = 'none';
        } else {
            container.innerHTML = currentSessionRecords.map((record, index) => {
                const tableRows = record.sets.length === 0 
                    ? '<tr><td colspan="4" style="text-align: center; color: #999;">세트를 추가해주세요.</td></tr>'
                    : record.sets.map((set, setIndex) => `
                        <tr>
                            <td>${setIndex + 1}</td>
                            <td><input type="number" class="set-input set-weight" data-record-index="${index}" data-set-index="${setIndex}" value="${set.weight}" min="0" placeholder="kg"></td>
                            <td><input type="number" class="set-input set-reps" data-record-index="${index}" data-set-index="${setIndex}" value="${set.reps}" min="0" placeholder="회"></td>
                            <td><button class="btn-delete-set" data-record-index="${index}" data-set-index="${setIndex}">❌</button></td>
                        </tr>
                    `).join('');

                return `
                    <div class="card exercise-record-card" data-record-index="${index}">
                        <div class="card-header">
                            <h4>${record.exercise}</h4>
                            <button class="btn-delete-exercise" data-record-index="${index}">🗑️ 종목 삭제</button>
                        </div>
                        <table class="set-record-table">
                            <thead>
                                <tr><th>SET</th><th>무게 (kg)</th><th>반복 (회)</th><th>삭제</th></tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                        <button class="btn-add-set" data-record-index="${index}">세트 추가</button>
                    </div>
                `;
            }).join('');
            
            saveAllRecordsBtn.style.display = 'block';
        }

        // 동적으로 생성된 요소에 입력 리스너 설정
        setupInputListeners();
    };

    /**
     * 현재 세션에 새로운 운동 종목을 추가합니다. (모달에서 선택 시 호출)
     */
    const addExerciseToSession = (exerciseName) => {
        const exists = currentSessionRecords.some(r => r.exercise === exerciseName);
        if (exists) {
            alert(`${exerciseName}은(는) 이미 추가되었습니다.`);
            return;
        }
        
        currentSessionRecords.unshift({
            exercise: exerciseName,
            sets: [{ weight: 0, reps: 0 }] // 종목 추가 시 기본 세트 1개 추가
        });
        renderAllSessionRecords();
    };


    // ----------------------------------------------------
    // 💾 기록 저장 함수 (0 값 엄격 검증 포함)
    // ----------------------------------------------------
    
    const saveAllRecords = () => {
        const date = document.getElementById('record-date').value;
        if (!date) {
            alert('날짜를 선택해 주세요.');
            return;
        }
        
        // 1. **[강화된 검증]** 현재 세션 기록 중 무게 또는 반복 횟수가 0 이하인 세트가 있는지 확인합니다.
        const hasInvalidSet = currentSessionRecords.some(record => 
            record.sets.some(set => set.weight <= 0 || set.reps <= 0)
        );

        if (hasInvalidSet) {
            alert('🚨 저장 오류: 모든 운동 기록은 무게와 반복 횟수가 0보다 커야 합니다. 0kg 또는 0회인 세트가 있는지 확인해 주세요.');
            return; // 0이 포함된 세트가 있으면 즉시 저장 중단
        }

        // 2. 유효한 기록만 필터링 (세트가 하나도 없는 종목 필터링)
        const recordsToSave = currentSessionRecords.filter(record => record.sets.length > 0);

        if (recordsToSave.length === 0) {
            alert('저장할 운동 종목이 없습니다.');
            return;
        }

        // 3. 저장할 데이터 구조 생성
        const newRecords = recordsToSave.map(record => ({
            id: Date.now() + Math.random(),
            date: date,
            exercise: record.exercise,
            sets: record.sets
        }));

        // 4. 로컬 스토리지에 저장
        let allRecords = JSON.parse(localStorage.getItem(RECORD_STORAGE_KEY) || '[]');
        allRecords.push(...newRecords);
        localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(allRecords));

        alert(`✅ 총 ${newRecords.length}개 종목의 기록이 저장되었습니다!`);
        
        // 저장 후 세션 초기화
        currentSessionRecords = [];
        // 5. 렌더링 및 날짜 초기화
        renderAllSessionRecords();
        setInitialDate();
    };


    // ----------------------------------------------------
    // 👂 이벤트 리스너 설정
    // ----------------------------------------------------

    /**
     * 세트 추가/삭제, 종목 삭제 등 동적 요소에 대한 이벤트 위임 설정
     */
    const setupDelegatedClickListeners = () => {
        const container = document.getElementById('exercise-records-container');
        if (!container) return;
        
        container.addEventListener('click', (e) => {
            const target = e.target;
            const recordIndex = target.dataset.recordIndex ? parseInt(target.dataset.recordIndex) : -1;
            const setIndex = target.dataset.setIndex ? parseInt(target.dataset.setIndex) : -1;

            if (recordIndex === -1) return;

            if (target.classList.contains('btn-add-set')) {
                // 세트 추가 시 초기값 (0kg, 0회)
                currentSessionRecords[recordIndex].sets.push({ weight: 0, reps: 0 });
                renderAllSessionRecords();
            } else if (target.classList.contains('btn-delete-set')) {
                if (setIndex !== -1 && confirm('해당 세트를 삭제하시겠습니까?')) {
                     currentSessionRecords[recordIndex].sets.splice(setIndex, 1);
                     renderAllSessionRecords();
                }
            } else if (target.classList.contains('btn-delete-exercise')) {
                if (confirm(`정말로 ${currentSessionRecords[recordIndex].exercise} 기록을 삭제하시겠습니까?`)) {
                    currentSessionRecords.splice(recordIndex, 1);
                    renderAllSessionRecords();
                }
            }
        });
    };

    /**
     * 모달 열기/닫기, 전체 기록 저장 등 정적 요소에 대한 이벤트 리스너 설정
     */
    const setupStaticEventListeners = () => {
        const openModalBtn = document.getElementById('open-exercise-modal-btn'); 
        const modal = document.getElementById('exercise-select-modal');
        const modalList = document.getElementById('modal-exercise-list');
        const saveAllBtn = document.getElementById('save-all-records-btn');
        const closeBtn = modal ? modal.querySelector('.close-btn') : null;

        // 1. 모달 열기 버튼
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                populateModalList();
                if (modal) modal.style.display = 'block';
                console.log("➕ 운동 종목 추가 모달 열림");
            });
        }
        
        // 2. 모달 닫기 버튼 (X 버튼)
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }
        
        // 3. 모달 외부 클릭 시 닫기
        if (modal) {
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // 4. 모달 리스트 항목 클릭 (종목 선택)
        if (modalList) {
            modalList.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-list-item')) {
                    const exerciseName = e.target.dataset.exercise;
                    addExerciseToSession(exerciseName);
                    if (modal) modal.style.display = 'none';
                }
            });
        }
        
        // 5. 전체 기록 저장 버튼
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', saveAllRecords);
        }
    };


    // ----------------------------------------------------
    // 🚀 뷰 초기화 함수 (IIFE 실행 시 자동 호출)
    // ----------------------------------------------------

    const initRecord = () => {
        setInitialDate();
        renderAllSessionRecords();
        setupStaticEventListeners();
        setupDelegatedClickListeners();
        
        console.log("✅ Record View 기능 초기화 완료.");
    };

    // 📌 IIFE가 실행될 때 초기화 함수를 바로 실행합니다.
    initRecord();

})(); // IIFE 종료