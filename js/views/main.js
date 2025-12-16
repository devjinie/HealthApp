// js/views/main.js
// 메인 화면 로직

console.log("✅ 메인 화면 스크립트 로드됨!");

// DOM 요소들을 안전하게 가져옵니다.
const todayGoal = document.getElementById('today-goal');
const setGoalBtn = document.getElementById('set-goal-btn');

// 요소가 존재하는지 확인한 후 로직을 실행하여 Uncaught TypeError를 방지합니다.
if (todayGoal) {
    console.log("메인 목표 필드 확인 완료.");
    // 기본 데이터 표시
    todayGoal.textContent = "벤치프레스 50kg 5x5 달성하기!"; 
} else {
    console.error("오류: ID 'today-goal' 요소를 찾을 수 없습니다.");
}

if (setGoalBtn) {
    console.log("목표 설정 버튼 확인 완료.");
    setGoalBtn.addEventListener('click', () => {
        alert("목표 설정 기능은 다음 단계에서 구현됩니다!");
    });
} else {
    console.error("오류: ID 'set-goal-btn' 요소를 찾을 수 없습니다.");
}