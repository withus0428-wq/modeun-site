/* 공통: 기본 정보 채우기, 모바일 메뉴, 신청서 전송 */
(function () {
  var S = window.SITE || {};

  // 구글시트 [설정] 값을 data-site 자리에 채우기 — 값이 없으면 그 줄(data-site-row)을 숨김
  function fill() {
    document.querySelectorAll('[data-site-row]').forEach(function (r) { r.hidden = false; });
    document.querySelectorAll('[data-site], [data-site-href]').forEach(function (el) {
      var k = el.getAttribute('data-site') || el.getAttribute('data-site-href');
      var v = S[k] == null ? '' : String(S[k]).trim();
      var row = el.closest('[data-site-row]');
      if (!v) { if (row) row.hidden = true; else if (el.hasAttribute('data-site')) el.textContent = ''; return; }
      if (el.hasAttribute('data-site')) el.textContent = v;
      if (el.tagName === 'A') {
        if (k === 'phone') el.href = 'tel:' + v.replace(/[^0-9+]/g, '');
        else if (k === 'email') el.href = 'mailto:' + v;
        else el.href = v;
      }
    });
  }
  fill();
  if (S.appsScriptUrl) {
    fetch(S.appsScriptUrl + '?action=settings').then(function (r) { return r.json(); })
      .then(function (res) { if (res && res.settings) { Object.assign(S, res.settings); fill(); document.dispatchEvent(new Event('site:settings')); } })
      .catch(function () {});
  }

  // 모바일 메뉴
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // 신청서 전송 (구글시트로)
  window.sendForm = function (form, type, onDone) {
    var msg = form.querySelector('.msg');
    function show(text, ok) {
      if (!msg) { alert(text); return; }
      msg.textContent = text; msg.className = 'msg show ' + (ok ? 'ok' : 'err');
      msg.scrollIntoView({ block: 'nearest' });
    }
    if (!form.reportValidity()) return;
    if (!S.appsScriptUrl) {
      show('온라인 접수 준비 중이에요.' + (S.phone ? ' 전화(' + S.phone + ')로 신청해 주세요.' : ' 잠시 뒤 다시 시도해 주세요.'), false);
      return;
    }
    var data = { type: type, page: location.pathname };
    new FormData(form).forEach(function (v, k) {
      data[k] = data[k] ? data[k] + ', ' + v : v;
    });
    var submit = form.querySelector('[type=submit]');
    if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = '보내는 중…'; }
    fetch(S.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) { form.reset(); if (onDone) onDone(res); else show('접수되었어요. 담당자가 곧 연락드릴게요.', true); }
        else show((res && res.error) || '접수 중 문제가 생겼어요. 전화로 문의해 주세요.', false);
      })
      .catch(function () { show('접수 중 문제가 생겼어요. 잠시 뒤 다시 시도하거나 전화로 문의해 주세요.', false); })
      .then(function () { if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label; } });
  };

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
