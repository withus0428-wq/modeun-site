/* 2026 교육과정 (카탈로그 기준) — 과정 추가·수정은 여기서 */
var CATALOG = [
  { id: 'part1', no: 'PART 01', title: '법정·지침 교육', tone: 'blue', courses: [
    ['A-01', '장기요양기관 급여제공지침 교육', '8시간'],
    ['A-02', '법정의무교육 통합 이수', '과정별']] },
  { id: 'part2', no: 'PART 02', title: '인권 기반 돌봄', tone: 'orange', courses: [
    ['B-01', '휴머니튜드 케어', '3시간'],
    ['B-02', '‘아보하’ 만들기', '2시간'],
    ['B-03', '나의 목소리, 나 사용 설명법', '4시간'],
    ['B-04', '노인인권 서포터즈', '4시간'],
    ['B-05', '도전적 행동, 또 다른 이름', '2시간'],
    ['B-06', '쉬운 설명은 배려가 아니라 권리', '2시간'],
    ['B-07', '알지 못해 상처주지 않도록', '2시간'],
    ['B-08', '좋은 돌봄', '2시간']] },
  { id: 'part3', no: 'PART 03', title: '소통·공감·고객서비스', tone: 'green', courses: [
    ['C-01', 'MOT 접점(현장의 순간)', '3시간'],
    ['C-02', 'MBTI 활용 당사자 공감소통', '4시간'],
    ['C-03', '대화로 푸는 갈등, 미소로 만드는 관계', '3시간'],
    ['C-04', '말이 통하는 돌봄', '3시간'],
    ['C-05', '소통의 달인 되기 프로젝트', '4시간'],
    ['C-06', '노인의 심리 이해', '3시간'],
    ['C-07', '보완대체의사소통(AAC) 사용의 실제', '8시간'],
    ['C-08', '비폭력대화를 통한 공감소통', '8시간'],
    ['C-09', '고객이 원하는 소통은 무엇인가?', '8시간'],
    ['C-10', '마음을 사로잡는 서비스 마인드', '3시간'],
    ['C-11', '소통과 협업이 만드는 돌봄서비스의 품격', '3시간'],
    ['C-12', '문제해결 서비스 지각변동', '8시간']] },
  { id: 'part4', no: 'PART 04', title: '돌봄 전문성·안전', tone: 'red', courses: [
    ['D-01', '잘 알면 더 잘 돌볼 수 있다', '3시간'],
    ['D-02', '노인성 질환의 이해와 케어방법', '8시간'],
    ['D-03', '함께 걷는 힘!', '6시간'],
    ['D-04', '[심화] 입소노인 기능회복·재활훈련 지도방법', '16시간'],
    ['D-05', '재활운동 프로그램 과정', '8시간'],
    ['D-06', '사고는 갑자기가 아니라 놓치는 순간 시작된다', '2시간'],
    ['D-07', '장애인을 위한 재난안전교육', '2시간'],
    ['D-08', '사례관리를 통한 서비스 디자인', '8시간'],
    ['D-09', '호스피스 & 웰다잉 프로그램', '8시간'],
    ['D-10', '노인맞춤돌봄 레시피 52주', '2시간']] },
  { id: 'part5', no: 'PART 05', title: '조직 활성화·브랜드·디지털', tone: 'blue', courses: [
    ['E-01', '긍정의 힘! 성장하는 조직 만들기', '4시간'],
    ['E-02', '더 나은 돌봄을 위한 조직활성화', '3시간'],
    ['E-03', '通하는 우리 조직문화 만들기', '8시간'],
    ['E-04', '조직문화가 경쟁력이다', '8시간'],
    ['E-05', '브랜딩 스토리텔링', '3시간'],
    ['E-06', 'Brand Power!!', '4시간'],
    ['E-07', '차별화된 돌봄서비스 전략', '3시간'],
    ['E-08', '전문성을 높이는 이미지 메이킹', '3시간'],
    ['E-09', '홍보역량강화과정', '16시간'],
    ['E-10', '생성형 AI(ChatGPT) 업무 활용', '8시간']] },
  { id: 'part6', no: 'PART 06', title: '프로그램 활성화', tone: 'orange', courses: [
    ['F-01', '미술심리치료 지도자 과정', '8시간'],
    ['F-02', '웃음치료 지도자 과정', '8시간'],
    ['F-03', '레크리에이션 지도자 과정', '8시간']] },
  { id: 'part7', no: 'PART 07', title: '종사자 회복·자기돌봄', tone: 'green', courses: [
    ['G-01', '함께했던 시간, 남겨진 마음', '4시간'],
    ['G-02', '종사자 힐링캠프', '1일(7시간)']] }
];

(function () {
  var chips = document.getElementById('partChips');
  var box = document.getElementById('catalog');
  if (!box) return;
  var flat = [];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  CATALOG.forEach(function (p) {
    chips.insertAdjacentHTML('beforeend', '<a class="chip t-' + p.tone + '" href="#' + p.id + '">' + esc(p.title) + ' ' + p.courses.length + '</a>');
    var cards = p.courses.map(function (c) {
      flat.push({ code: c[0], title: c[1], hours: c[2], part: p.title });
      return '<button type="button" class="course" data-code="' + c[0] + '">' +
        '<span class="top"><span class="code">' + c[0] + '</span><span class="hrs">' + esc(c[2]) + '</span></span>' +
        '<strong>' + esc(c[1]) + '</strong><span class="more">내용 보기 →</span></button>';
    }).join('');
    box.insertAdjacentHTML('beforeend',
      '<div class="part t-' + p.tone + '" id="' + p.id + '"><div class="part-head"><span class="no">' + p.no + '</span><h3>' + esc(p.title) +
      '</h3><span class="cnt">' + p.courses.length + '개 과정</span></div><div class="grid g-auto-260">' + cards + '</div></div>');
  });

  var dlg = document.getElementById('courseDlg');
  var idx = 0;
  function render() {
    var c = flat[idx];
    dlg.querySelector('.meta').textContent = c.code + ' · ' + c.part + ' · ' + c.hours;
    dlg.querySelector('strong').textContent = c.title;
    var img = dlg.querySelector('img');
    img.src = 'img/courses/' + c.code + '.jpg';
    img.alt = c.code + ' ' + c.title + ' 과정 소개 (추천 대상, 교육 목표, 모듈 구성)';
    dlg.querySelector('.dlg-body').scrollTop = 0;
    var sel = document.getElementById('f-course');
    if (sel) sel.dataset.pending = c.code + ' ' + c.title;
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('.course'); if (!b) return;
    for (var i = 0; i < flat.length; i++) if (flat[i].code === b.dataset.code) idx = i;
    render(); dlg.showModal();
  });
  dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('[data-prev]').addEventListener('click', function () { idx = (idx - 1 + flat.length) % flat.length; render(); });
  dlg.querySelector('[data-next]').addEventListener('click', function () { idx = (idx + 1) % flat.length; render(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.querySelector('[data-ask]').addEventListener('click', function () {
    var c = flat[idx];
    var ta = document.getElementById('f-memo');
    if (ta && ta.value.indexOf(c.code) < 0) ta.value = (ta.value ? ta.value + '\n' : '') + '관심 과정: ' + c.code + ' ' + c.title;
    dlg.close();
  });

  // 상담 폼의 과정 선택 목록
  var sel = document.getElementById('f-course');
  if (sel) CATALOG.forEach(function (p) {
    var g = document.createElement('optgroup'); g.label = p.title;
    p.courses.forEach(function (c) { var o = document.createElement('option'); o.textContent = c[0] + ' ' + c[1]; g.appendChild(o); });
    sel.appendChild(g);
  });
})();
