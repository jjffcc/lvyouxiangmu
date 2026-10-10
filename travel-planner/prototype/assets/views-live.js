(function () {
  "use strict";
  var App = window.App;
  var D = window.DEMO;

  App.ROUTES.push({
    path: ['trip', ':id', 'today'],
    view: function (params) {
      var trip = App.trip(params.id);
      var days = D.planDays[trip.id] || [];
      var day = days[0] || { label: '第 1 天', items: [] };
      var next = day.items[2] || day.items[day.items.length - 1] || { time: '--:--', title: '暂无安排', type: '-', status: '演示内容', statusKind: 'demo' };
      var weather = D.weather[trip.id] || [
        { date: trip.start, label: '第 1 天', temp: '—', text: '尚不可预报', status: 'warn', statusText: '超出预报范围', hint: '距离出发较远，接近后再更新。' },
        { date: trip.end, label: '最后一天', temp: '—', text: '尚不可预报', status: 'warn', statusText: '超出预报范围', hint: '先准备室内外备选。' }
      ];

      var weatherRows = weather.map(function (w) {
        return '<tr><td>' + App.esc(w.label) + '<div class="small muted">' + App.esc(w.date) + '</div></td>' +
          '<td>' + App.esc(w.text) + '<div class="small muted">' + App.esc(w.hint) + '</div></td>' +
          '<td>' + App.esc(w.temp) + '</td><td>' + App.badge(w.status, w.statusText) + '</td></tr>';
      }).join('');

      var remindHtml = D.reminders.map(function (r) {
        return '<div class="item"><div class="body"><div class="title">' + App.esc(r.label) + ' ' + App.badge(r.status, r.statusText) + '</div>' +
          '<div class="sub">' + App.esc(r.time) + ' ｜ ' + App.esc(r.channel) + '</div></div>' +
          '<div class="side"><button class="btn small" data-act="remind">调整</button></div></div>';
      }).join('');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '途中助手',
        sub: '当天安排、天气、提醒、改线与应急信息；数据时效与来源都会标明。'
      }) +
        '<div class="card"><div class="card-head"><h3>下一个安排</h3><span class="meta">' + App.esc(day.label) + '</span></div>' +
        '<div class="item"><div class="idx">' + App.esc(next.time) + '</div>' +
        '<div class="body"><div class="title">' + App.esc(next.title) + ' ' + App.badge(next.statusKind, next.status) + '</div>' +
        '<div class="sub">' + App.esc(next.type) + ' ｜ 来自行程工作台</div></div>' +
        '<div class="side"><a class="btn small" href="#/trip/' + trip.id + '/map">路线</a></div></div></div>' +
        '<div class="card"><div class="card-head"><h3>天气</h3><span class="meta">演示数据</span></div>' +
        '<table class="table"><tr><th>日期</th><th>天气</th><th>温度</th><th>状态</th></tr>' + weatherRows + '</table>' +
        '<div class="note info">降水概率、降水量与湿度是不同指标，这里分开表达。超出预报范围的日期不显示成确定天气。</div></div>' +
        '<div class="card"><div class="card-head"><h3>提醒</h3></div>' + remindHtml +
        '<div class="note warn">网页推送需要设备支持与你的许可，不承诺必达。也可以导出到日历作为补充。</div></div>' +
        '<div class="card"><div class="card-head"><h3>遇到变化</h3></div>' +
        '<p class="small">下雨、排队变长或临时关闭时，可以查看改线建议；应用前会展示前后差异与影响。</p>' +
        '<div class="chip-row"><button class="btn small primary" data-act="reroute">下雨，查看改线建议</button>' +
        '<button class="btn small" data-act="temp">临时关闭某地点</button></div></div>' +
        '<div class="card"><div class="card-head"><h3>离线副本</h3>' + App.badge('warn', '版本较旧') + '</div>' +
        '<dl class="kv"><dt>行程版本</dt><dd>v12</dd><dt>保存时间</dt><dd>2026-10-04 09:20</dd>' +
        '<dt>内容</dt><dd>行程、地址、订单摘要、应急联系人</dd></dl>' +
        '<div class="note warn mt12">这是本机已保存的副本，联网后建议更新。浏览器缓存可能被清理，不承诺永久保存。</div>' +
        '<button class="btn small" data-act="refresh">检查更新</button></div>' +
        '<div class="card"><div class="card-head"><h3>应急入口</h3></div>' +
        '<p class="small muted">联系人、住宿地址与附近服务在出行准备页维护，这里可以直接打开。</p>' +
        '<a class="btn small" href="#/trip/' + trip.id + '/prepare">查看应急信息</a></div>';

      return {
        title: '途中助手',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (act === 'reroute') {
              App.modal({
                title: '改线建议（演示）',
                body: '<p>10-18 下午预计有小雨，博物馆为室内安排，建议保留；上午灵隐寺改为西溪湿地室内展厅优先。</p>' +
                  '<table class="table"><tr><th>时段</th><th>修改前</th><th>修改后</th></tr>' +
                  '<tr><td>上午</td><td>灵隐寺</td><td>西溪湿地（室内展厅优先）</td></tr>' +
                  '<tr><td>交通</td><td>打车 35 分钟</td><td>打车 25 分钟</td></tr>' +
                  '<tr><td>费用</td><td>—</td><td>减少约 20 元（估算）</td></tr></table>' +
                  '<p class="small">硬性条件（16:00 预约与午休）保持不变。</p>',
                actions: [
                  { label: '先不修改' },
                  { label: '确认应用（演示）', kind: 'primary', onClick: function () { App.toast('已应用改线建议（演示）'); } }
                ]
              });
              return;
            }
            if (act === 'temp') {
              App.modal({
                title: '地点临时关闭（演示）',
                body: '<div class="field"><label>受影响地点</label><select><option>灵隐寺</option><option>九溪烟树</option></select></div>' +
                  '<div class="note warn">系统会重新计算当天剩余安排，并提示受影响的预约与交通。</div>',
                actions: [{ label: '重新规划（演示）', kind: 'primary', onClick: function () { App.toast('已生成替代安排（演示）'); } }]
              });
              return;
            }
            if (act === 'remind') {
              App.modal({
                title: '调整提醒',
                body: '<div class="field"><label>提前时间</label><select><option>提前 15 分钟</option><option>提前 1 小时</option><option>提前 2 小时</option><option>提前 1 天</option></select></div>' +
                  '<div class="field"><label>提醒方式</label><select><option>网页提醒</option><option>网页提醒 + 日历</option></select></div>',
                actions: [{ label: '保存（演示）', kind: 'primary', onClick: function () { App.toast('已更新提醒设置（演示）'); } }]
              });
              return;
            }
            if (act === 'refresh') App.toast('演示：当前没有网络，无法检查更新');
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'review'],
    view: function (params) {
      var trip = App.trip(params.id);
      var r = D.review[trip.id] || { photos: [], note: '', rating: 0, ratingNote: '', total: 0, visibility: '私密（仅受邀成员可见）' };
      var photoHtml = r.photos.map(function (p) { return '<div class="photo">' + App.esc(p) + '</div>'; }).join('');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '旅行回顾',
        sub: '照片、游记、评价与费用总结；默认为私密，可导出或受邀分享。',
        actions: '<button class="btn" data-act="export">导出</button><button class="btn primary" data-act="share">分享</button>'
      }) +
        '<div class="card"><div class="card-head"><h3>可见范围</h3>' + App.badge('demo', '私密') + '</div>' +
        '<p class="small">' + App.esc(r.visibility) + '。修改共享范围后可随时撤销。</p></div>' +
        '<div class="card"><div class="card-head"><h3>照片</h3><span class="meta">演示占位</span></div>' +
        '<div class="photos">' + photoHtml + '</div>' +
        '<div class="note info mt12">原型不包含真实图片；正式版本会按你的选择保存与分享。</div></div>' +
        '<div class="card"><div class="card-head"><h3>游记</h3></div>' +
        '<div class="field"><textarea> ' + App.esc(r.note) + ' </textarea></div>' +
        '<button class="btn primary" data-act="save-note">保存游记（演示）</button></div>' +
        '<div class="card"><div class="card-head"><h3>评价</h3><span class="meta">' + r.rating + ' / 5</span></div>' +
        '<p class="small">' + App.esc(r.ratingNote) + '</p>' +
        '<div class="note info">评价用于个人回顾与行程复用参考，不会自动公开。</div></div>' +
        '<div class="card"><div class="card-head"><h3>费用总结</h3></div>' +
        '<dl class="kv"><dt>实际合计</dt><dd>' + App.money(r.total) + '</dd>' +
        '<dt>预算</dt><dd>' + App.money(trip.budget.total) + '</dd>' +
        '<dt>差额</dt><dd>' + App.money(trip.budget.total - r.total) + '</dd></dl>' +
        '<div class="mt12"><a class="btn small" href="#/trip/' + trip.id + '/expenses">查看明细</a></div></div>' +
        '<div class="card"><div class="card-head"><h3>复用这次行程</h3></div>' +
        '<p class="small muted">复用会生成新草稿：保留候选与安排参考，不带入旧订单、实际支出、结清记录与敏感附件。</p>' +
        '<button class="btn" data-act="reuse">复用为新旅行</button></div>';

      return {
        title: '旅行回顾',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            if (act === 'export') { App.toast('已生成导出文件（演示，不会真实下载）'); return; }
            if (act === 'share') {
              App.modal({
                title: '分享旅行回顾',
                body: '<div class="field"><label>分享范围</label><select><option>仅受邀成员</option><option>获得链接的人</option></select></div>' +
                  '<div class="field"><label>包含内容</label><select><option>游记与照片</option><option>游记、照片与费用总结</option><option>仅游记</option></select></div>' +
                  '<div class="note warn">含联系方式或订单附件的分享需要单独授权。</div>',
                actions: [{ label: '生成分享链接（演示）', kind: 'primary', onClick: function () { App.toast('已生成分享链接（演示）'); } }]
              });
              return;
            }
            if (act === 'save-note') { App.toast('已保存游记（演示）'); return; }
            if (act === 'reuse') App.toast('已生成新旅行草稿（演示）');
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['settings'],
    view: function () {
      var s = D.settings;

      var offlineHtml = s.offline.map(function (o) {
        var stale = o.note.indexOf('较旧') >= 0;
        return '<div class="item"><div class="body"><div class="title">' + App.esc(o.trip) + ' ' + App.badge(stale ? 'warn' : 'ok', o.version) + '</div>' +
          '<div class="sub">保存于 ' + App.esc(o.savedAt) + ' ｜ ' + App.esc(o.size) + ' ｜ ' + App.esc(o.note) + '</div></div>' +
          '<div class="side"><button class="btn small" data-act="offline-update">更新</button>' +
          '<button class="btn small" data-act="offline-remove">删除</button></div></div>';
      }).join('');

      var uploadHtml = s.uploads.map(function (u) {
        return '<div class="item"><div class="body"><div class="title">' + App.esc(u.label) + ' ' + App.badge(u.status, u.statusText) + '</div>' +
          '<div class="sub">上传范围：' + App.esc(u.scope) + ' ｜ ' + (u.masked ? '默认遮盖敏感字段' : '—') + '</div></div>' +
          '<div class="side"><button class="btn small" data-act="upload-scope">设置</button></div></div>';
      }).join('');

      var html = App.pageHead({
        eyebrow: '设置与数据',
        title: '账号、离线与数据',
        sub: '这一页集中账户同步、离线副本、上传范围与数据删除。真实服务在正式接入阶段验证。'
      }) +
        App.releaseSummary() +
        '<div class="card"><div class="card-head"><h3>账户与同步</h3>' + App.badge('demo', '演示') + '</div>' +
        '<dl class="kv"><dt>账号</dt><dd>' + App.esc(s.account.email) + '</dd>' +
        '<dt>同步</dt><dd>' + App.esc(s.account.sync) + '</dd>' +
        '<dt>设备</dt><dd>' + s.account.devices.map(App.esc).join('、') + '</dd></dl>' +
        '<div class="note info mt12">真实版本需要服务器、账户与权限系统；原型不处理真实账号。</div></div>' +
        '<div class="card"><div class="card-head"><h3>离线副本</h3><span class="meta">首版以查看为主</span></div>' +
        '<div class="list">' + offlineHtml + '</div>' +
        '<div class="note warn mt12">浏览器可能因存储压力清理缓存，离线内容不承诺永久保存；重要资料建议同时导出。</div></div>' +
        '<div class="card"><div class="card-head"><h3>AI 与 OCR 上传范围</h3></div>' +
        '<div class="list">' + uploadHtml + '</div>' +
        '<div class="note info mt12">真实接入时会逐项说明上传内容，并由你选择；默认遮盖身份证号、手机号等敏感字段。</div></div>' +
        '<div class="card"><div class="card-head"><h3>导出与删除</h3></div>' +
        '<p class="small">可导出行程、费用与资料。删除单次旅行前会说明影响，并提供先导出的选项。</p>' +
        '<div class="chip-row"><button class="btn small" data-act="export">导出行程</button>' +
        '<button class="btn small" data-act="export">导出费用</button>' +
        '<button class="btn small" data-act="delete">删除单次旅行</button></div></div>' +
        '<div class="card"><div class="card-head"><h3>尚未接入的能力</h3></div><ul class="small">' +
        '<li>地图与路线服务、实时班次与打车价格</li>' +
        '<li>天气预报服务与推送送达</li>' +
        '<li>账户、权限与跨设备同步</li>' +
        '<li>AI 规划与订单 OCR 识别</li>' +
        '<li>外部预订账户连接与自动订单同步</li>' +
        '<li>离线行程缓存与断网读取</li>' +
        '<li>离线地图瓦片保存许可</li></ul>' +
        '<p class="small muted">以上在正式接入阶段逐项核查和验证，原型不把它们报告为已完成。</p></div>';

      return {
        title: '设置与数据',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (act === 'offline-update') { App.toast('演示：当前没有网络，离线副本未更新'); return; }
            if (act === 'offline-remove') { App.toast('已删除该设备的离线副本（演示）'); return; }
            if (act === 'upload-scope') {
              App.modal({
                title: '上传范围设置',
                body: '<div class="field"><label>允许上传</label><select><option>仅我选择的内容</option><option>允许上传行程与偏好</option><option>不允许上传</option></select></div>' +
                  '<div class="field"><label>敏感字段</label><select><option>默认遮盖</option><option>每次询问</option></select></div>',
                actions: [{ label: '保存（演示）', kind: 'primary', onClick: function () { App.toast('已保存上传范围（演示）'); } }]
              });
              return;
            }
            if (act === 'export') { App.toast('已生成导出文件（演示，不会真实下载）'); return; }
            if (act === 'delete') {
              App.modal({
                title: '删除单次旅行',
                body: '<p>删除会影响：行程、候选地点、订单记录、费用与分账记录、同行者权限。</p>' +
                  '<p>不会自动删除：你已导出的文件、其他设备的离线副本。</p>' +
                  '<div class="note warn">建议先导出再删除。删除后云端内容不可恢复，离线副本需要到各设备分别清理。</div>',
                actions: [
                  { label: '取消' },
                  { label: '先导出', onClick: function () { App.toast('已生成导出文件（演示）'); } },
                  { label: '确认删除（演示）', kind: 'primary', onClick: function () { App.toast('演示：未执行真实删除'); } }
                ]
              });
            }
          });
        }
      };
    }
  });
})();
