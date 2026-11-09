/* 집합교육: 일정 불러오기, 신청, 조회 */
(function () {
  var S = window.SITE || {};
  var TONES = { A: 'blue', B: 'orange', C: 'green', D: 'red', E: 'blue', F: 'orange', G: 'green' };
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  var all = [], month = null, chosen = null;
  var $ = function (id) { return document.getElementById(id); };
  var call = function () { return S.phone ? ' 전화(' + esc(S.phone) + ')로 문의해 주세요.' : ''; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function view(name) {
    ['List', 'Form', 'Done', 'Lookup'].forEach(function (v) { $('view' + v).hidden = v !== name; });
    window.scrollTo({ top: $('view' + name).getBoundingClientRect().top + window.scrollY - 100 });
    var h = { Done: 'doneTitle', Lookup: 'lookupTitle' }[name]; if (h) $(h).focus();
  }
  document.querySelectorAll('[data-back]').forEach(function (b) { b.addEventListener('click', function () { view('List'); }); });
  $('toLookup').addEventListener('click', function () { view('Lookup'); });

  function parse(s) { var d = new Date(s.date + 'T00:00:00'); return { d: d, ym: d.getFullYear() * 100 + d.getMonth() + 1 }; }

  function renderMonths() {
    var yms = [];
    all.forEach(function (s) { var p = parse(s); if (yms.indexOf(p.ym) < 0) yms.push(p.ym); });
    yms.sort();
    if (month === null || yms.indexOf(month) < 0) month = yms[0];
    $('months').innerHTML = yms.map(function (ym) {
      var on = ym === month;
      return '<button type="button" class="btn ' + (on ? '' : 'btn-ghost') + '" style="' + (on ? 'background:var(--ink)' : '') + '" aria-pressed="' + on + '" data-ym="' + ym + '">' + (ym % 100) + '월</button>';
    }).join('');
  }
  $('months').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ym]'); if (!b) return;
    month = +b.dataset.ym; renderMonths(); renderList();
  });

  function renderList() {
    var list = all.filter(function (s) { return parse(s).ym === month; });
    if (!list.length) { $('sessions').innerHTML = '<div class="empty">예정된 집합교육이 없어요.' + call() + '</div>'; return; }
    $('sessions').innerHTML = list.map(function (s) {
      var p = parse(s), cap = +s.cap || 0, ap = +s.applied || 0, left = cap - ap;
      var closed = s.status === '마감' || (cap && left <= 0);
      var state = closed ? '마감' : (cap && left <= 5 ? '마감 임박 · ' + left + '자리' : '모집 중');
      var color = closed ? '#6B6F7A' : (cap && left <= 5 ? 'var(--red)' : 'var(--green)');
      var pct = cap ? Math.min(100, Math.round(ap / cap * 100)) : 0;
      var tone = TONES[(s.code || 'A').charAt(0)] || 'blue';
      return '<article class="session t-' + tone + '">' +
        '<div class="date"><span class="mon">' + (p.d.getMonth() + 1) + '월</span><b>' + p.d.getDate() + '</b><span>' + DOW[p.d.getDay()] + '요일</span></div>' +
        '<div class="info"><span class="code">' + esc(s.code) + (s.hours ? ' · ' + esc(s.hours) : '') + '</span><strong>' + esc(s.title) + '</strong>' +
        '<span class="muted" style="font-size:14px">' + esc(s.time) + (s.place ? ' · ' + esc(s.place) : '') + (s.fee ? ' · 교육비 ' + esc(s.fee) : '') + '</span></div>' +
        '<div class="seat"><div style="display:flex;justify-content:space-between"><span class="muted">신청 ' + ap + (cap ? ' / 정원 ' + cap : '') + '</span><strong style="color:' + color + '">' + state + '</strong></div>' +
        '<div class="bar"><i style="width:' + pct + '%;' + (closed ? 'background:#9AA0AA' : '') + '"></i></div></div>' +
        '<div>' + (closed ? '<button class="btn" disabled>마감</button>' : '<button class="btn" type="button" data-sid="' + esc(s.id) + '">신청하기</button>') + '</div></article>';
    }).join('');
  }
  $('sessions').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sid]'); if (!b) return;
    chosen = all.filter(function (s) { return String(s.id) === b.dataset.sid; })[0]; if (!chosen) return;
    var p = parse(chosen);
    $('selTitle').textContent = chosen.title;
    $('selInfo').innerHTML = (p.d.getMonth() + 1) + '월 ' + p.d.getDate() + '일 (' + DOW[p.d.getDay()] + ') ' + esc(chosen.time) + '<br>' +
      esc(chosen.hours || '') + (chosen.fee ? ' · 교육비 ' + esc(chosen.fee) : '') + (chosen.place ? '<br>' + esc(chosen.place) : '');
    $('f-sid').value = chosen.id; $('f-stitle').value = chosen.date + ' ' + chosen.title;
    view('Form');
  });

  $('applyForm').addEventListener('submit', function (e) {
    e.preventDefault();
    sendForm(this, '집합교육신청', function () {
      $('doneInfo').innerHTML = esc(chosen.title) + '<br>' + esc($('selInfo').innerText.split('\n')[0]);
      chosen.applied = (+chosen.applied || 0) + 1; renderList();
      view('Done');
    });
  });

  // 조회
  $('lookupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!this.reportValidity()) return;
    var box = $('lookupResult');
    if (!S.appsScriptUrl) { box.innerHTML = '<div class="empty">온라인 조회 준비 중이에요.' + call() + '</div>'; return; }
    box.innerHTML = '<div class="empty">조회 중…</div>';
    var q = '?action=lookup&name=' + encodeURIComponent(this.name.value.trim()) + '&phone=' + encodeURIComponent(this.phone.value.trim());
    var who = { name: this.name.value.trim(), phone: this.phone.value.trim() };
    fetch(S.appsScriptUrl + q).then(function (r) { return r.json(); }).then(function (res) {
      var rows = (res && res.items) || [];
      if (!rows.length) { box.innerHTML = '<div class="empty">신청 내역이 없어요. 이름과 번호를 다시 확인해 주세요.</div>'; return; }
      box.innerHTML = rows.map(function (r, i) {
        var tint = r.state === '접수 확정' ? 'var(--blue-tint);color:var(--blue)' : r.state === '취소 요청' ? 'var(--red-tint);color:var(--red)' : 'var(--orange-tint);color:var(--orange)';
        return '<article class="card"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px"><strong style="font-size:18px">' + esc(r.title) + '</strong>' +
          '<span style="font-size:14px;font-weight:700;padding:4px 12px;border-radius:999px;background:' + tint + '">' + esc(r.state) + '</span></div>' +
          '<span class="muted">' + esc(r.when || '') + '</span>' +
          (r.state === '취소 요청' ? '' : '<div class="row-btns"><button type="button" class="btn btn-ghost" data-req="일정변경요청" data-i="' + i + '">일정 변경 요청</button><button type="button" class="btn btn-ghost" style="color:var(--red);border-color:#E3A9A5" data-req="취소요청" data-i="' + i + '">취소·환불 요청</button></div>') +
          '</article>';
      }).join('');
      box.onclick = function (ev) {
        var b = ev.target.closest('[data-req]'); if (!b) return;
        var r = rows[+b.dataset.i];
        var memo = b.dataset.req === '취소요청' ? '환불받을 계좌(은행/계좌번호/예금주)를 적어주세요' : '희망하는 다른 일정을 적어주세요';
        var note = prompt(memo); if (note === null) return;
        fetch(S.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ type: b.dataset.req, 이름: who.name, 휴대폰: who.phone, 교육명: r.title, 회차ID: r.sid, 내용: note }) })
          .then(function (x) { return x.json(); })
          .then(function () { b.closest('.row-btns').outerHTML = '<div class="msg show ok">요청이 접수되었어요. 담당자가 확인 후 연락드릴게요.</div>'; })
          .catch(function () { alert('요청 중 문제가 생겼어요. 전화로 문의해 주세요.'); });
      };
    }).catch(function () { box.innerHTML = '<div class="empty">조회 중 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.</div>'; });
  });

  // 일정 불러오기
  if (!S.appsScriptUrl) {
    $('sessions').innerHTML = '<div class="empty">집합교육 일정은 곧 공개됩니다.' + call() + '</div>';
    return;
  }
  fetch(S.appsScriptUrl + '?action=schedule').then(function (r) { return r.json(); }).then(function (res) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    all = ((res && res.items) || []).filter(function (s) { return s.date && parse(s).d >= today; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (!all.length) { $('sessions').innerHTML = '<div class="empty">예정된 집합교육이 없어요. 새 일정이 열리면 이곳에 안내해 드릴게요.</div>'; return; }
    renderMonths(); renderList();
  }).catch(function () {
    $('sessions').innerHTML = '<div class="empty">일정을 불러오지 못했어요. 잠시 뒤 새로고침해 주세요.' + call() + '</div>';
  });
})();
