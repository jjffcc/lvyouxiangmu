(function () {
  "use strict";
  var App = window.App;
  var D = window.DEMO;

  App.ROUTES.push({
    path: ['trip', ':id', 'plan'],
    view: function (params) {
      var trip = App.trip(params.id);
      var days = D.planDays[trip.id] || [];
      if (!days.length) {
        return { title: '行程工作台', html: App.pageHead({ title: '行程工作台' }) + App.empty('该行程还没有每日安排。') };
      }
      var dayIdx = Math.min(App.state.planDay || 0, days.length - 1);
      var day = days[dayIdx];

      function itemHtml(item, idx) {
        return '<div class="item"><div class="idx">' + App.esc(item.time) + '</div>' +
          '<div class="body"><div class="title">' + App.esc(item.title) + ' ' + App.badge(item.statusKind, item.status) + '</div>' +
          '<div class="sub">' + App.esc(item.type) + (item.locked ? ' ｜ <span class="badge lock">已锁定</span>' : '') + '</div></div>' +
          '<div class="side">' +
          '<button class="btn small" data-act="lock" data-idx="' + idx + '">' + (item.locked ? '解锁' : '锁定') + '</button>' +
          '<button class="btn small" data-act="up" data-idx="' + idx + '">上移</button>' +
          '<button class="btn small" data-act="down" data-idx="' + idx + '">下移</button>' +
          '</div></div>';
      }

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '行程工作台',
        sub: '硬性条件优先，其次按“' + App.esc(trip.pace) + '”节奏优化。可以锁定、调整顺序，并查看版本。',
        actions: '<button class="btn" data-act="compare">对比方案</button><a class="btn" href="#/trip/' + trip.id + '/map">地图路线</a>'
      }) +
        App.readonlyNote() +
        '<div class="tabs" data-role="days">' + days.map(function (d, i) {
          return '<button data-day="' + i + '" aria-selected="' + (i === dayIdx) + '">' + App.esc(d.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="grid two">' +
        '<div>' +
        (day.conflict ? '<div class="note risk">硬性条件冲突：' + App.esc(day.conflict) + '<div class="mt8"><button class="btn small" data-act="resolve">查看可选调整</button></div></div>' : '') +
        '<div class="card"><div class="card-head"><h3>' + App.esc(day.label) + ' · ' + App.esc(day.city) + '</h3><span class="meta">' + day.items.length + ' 项安排</span></div>' +
        '<div class="list">' + day.items.map(itemHtml).join('') + '</div>' +
        '<div class="note info">演示说明：锁定与排序都在本页操作，但不会真实保存。</div></div>' +
        '</div>' +
        '<div>' +
        '<div class="card"><div class="card-head"><h3>AI 规划对话（演示）</h3></div>' +
        '<div class="chat">' +
        '<div class="bubble me">10-18 想加灵隐寺，但 16:00 有博物馆预约。</div>' +
        '<div class="bubble ai">灵隐寺排队约 40 分钟，加上通勤，与 16:00 预约时间紧张。我准备了两个调整：一是取消灵隐寺；二是上午去灵隐寺、午餐后直接前往博物馆。</div>' +
        '<div class="bubble me">先看看第二个。</div>' +
        '<div class="bubble ai">已生成调整草案。应用前请确认：午休是硬性条件，改动需要你明确同意。</div>' +
        '</div>' +
        '<div class="mt12"><button class="btn primary" data-act="ai-review">查看修改前后与费用影响</button></div>' +
        '<div class="note info mt12">原型使用预设对话；真实版本会调用模型服务，并说明上传范围。</div></div>' +
        '<div class="card"><div class="card-head"><h3>版本</h3><span class="meta">可撤销与恢复</span></div>' +
        '<div class="list">' +
        '<div class="item"><div class="body"><div class="title">v12 正式行程</div><div class="sub">2026-10-04 09:20 · 由我发布</div></div><div class="side"><span class="badge ok">当前</span></div></div>' +
        '<div class="item"><div class="body"><div class="title">v11 草稿（爱人）</div><div class="sub">2026-10-03 21:05 · 调整灵隐寺顺序</div></div><div class="side"><button class="btn small" data-act="restore">恢复</button></div></div>' +
        '<div class="item"><div class="body"><div class="title">v10 草稿（我）</div><div class="sub">2026-10-02 18:40 · 增加千岛湖体验</div></div><div class="side"><button class="btn small" data-act="restore">恢复</button></div></div>' +
        '</div>' +
        '<div class="note warn">成员修改形成草稿，由旅行负责人发布为正式行程。演示中不区分真实账号。</div></div>' +
        '</div></div>';

      return {
        title: '行程工作台',
        html: html,
        mount: function (root) {
          root.querySelector('[data-role="days"]').addEventListener('click', function (ev) {
            var d = ev.target.getAttribute && ev.target.getAttribute('data-day');
            if (d === null) return;
            App.state.planDay = Number(d);
            App.render();
          });

          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (act === 'compare') { App.go('#/trip/' + trip.id + '/compare'); return; }
            if (act === 'ai-review') {
              App.modal({
                title: '修改前后对比与影响（演示）',
                body: '<table class="table"><tr><th>时段</th><th>修改前</th><th>修改后</th></tr>' +
                  '<tr><td>10-18 上午</td><td>灵隐寺</td><td>灵隐寺（不变）</td></tr>' +
                  '<tr><td>10-18 13:00</td><td>午休（硬性条件）</td><td>取消午休点位</td></tr>' +
                  '<tr><td>10-18 16:00</td><td>博物馆预约</td><td>博物馆预约（保留）</td></tr></table>' +
                  '<p class="small">原因：灵隐寺排队约 40 分钟，与 16:00 预约时间紧张。</p>' +
                  '<p class="small">费用影响：打车增加约 35 元（估算）。</p>' +
                  '<div class="note warn">取消午休会违反当前硬性条件，必须由你明确同意。</div>',
                actions: [
                  { label: '放弃调整', onClick: function () { App.toast('已取消，未应用修改'); } },
                  { label: '同意并应用（演示）', kind: 'primary', onClick: function () { App.toast('已应用修改（演示）'); } }
                ]
              });
              return;
            }
            if (act === 'resolve') {
              App.modal({
                title: '硬性条件冲突的可选调整',
                body: '<ul><li>取消灵隐寺，按原计划午休与博物馆预约。</li>' +
                  '<li>保留灵隐寺，取消午休点位（需要你明确同意）。</li>' +
                  '<li>分头行动：一部分人上午去灵隐寺，另一部分人午休后直接去博物馆。</li></ul>' +
                  '<p class="small">无论选择哪种，都不能未经你同意放宽硬性条件。</p>'
              });
              return;
            }
            if (act === 'restore') {
              if (!App.canEdit()) { App.denyEdit(); return; }
              App.toast('已恢复该版本（演示，不会真实保存）');
              return;
            }
            if (!App.canEdit()) { App.denyEdit(); return; }
            var idx = Number(ev.target.getAttribute('data-idx'));
            var item = day.items[idx];
            if (!item) return;
            if (act === 'lock') { item.locked = !item.locked; App.toast(item.locked ? '已锁定，重新规划时不会改动' : '已解锁'); }
            if (act === 'up' && idx > 0) day.items.splice(idx - 1, 0, day.items.splice(idx, 1)[0]);
            if (act === 'down' && idx < day.items.length - 1) day.items.splice(idx + 1, 0, day.items.splice(idx, 1)[0]);
            App.render();
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'compare'],
    view: function (params) {
      var trip = App.trip(params.id);
      var plans = D.plans[trip.id] || [];
      var a = plans[0];
      var b = plans[1];
      if (!a || !b) {
        return { title: '方案对比', html: App.pageHead({ title: '方案对比' }) + App.empty('该旅行还没有可对比的方案。') };
      }

      var rows = [
        ['节奏', a.pace, b.pace],
        ['每日活动量', a.perDay, b.perDay],
        ['步行强度', a.walk, b.walk],
        ['预算', App.money(a.budget), App.money(b.budget)],
        ['待核实与风险', (a.risk || []).join('；') || '—', (b.risk || []).join('；') || '—']
      ];

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '方案对比',
        sub: '对比时间、交通、预算、步行强度与待核实事项；可计算指标注明口径，不生成无依据的质量分数。'
      }) +
        '<div class="card"><div class="card-head"><h3>' + App.esc(a.name) + ' 与 ' + App.esc(b.name) + '</h3></div>' +
        '<table class="table"><tr><th>对比项</th><th>' + App.esc(a.name) + '</th><th>' + App.esc(b.name) + '</th></tr>' +
        rows.map(function (r) {
          return '<tr><td>' + App.esc(r[0]) + '</td><td>' + App.esc(r[1]) + '</td><td>' + App.esc(r[2]) + '</td></tr>';
        }).join('') + '</table></div>' +
        '<div class="grid two">' + [a, b].map(function (p) {
          var over = p.budget > trip.budget.total;
          return '<div class="card"><div class="card-head"><h3>' + App.esc(p.name) + '</h3>' +
            App.badge(over ? 'warn' : 'demo', over ? '超出预算 ' + App.money(p.budget - trip.budget.total) : '在预算内') + '</div>' +
            '<p class="small">' + App.esc(p.note) + '</p>' +
            '<button class="btn ' + (p.id === 'a' ? 'primary' : '') + '" data-act="choose" data-plan="' + p.id + '">选择此方案</button></div>';
        }).join('') + '</div>' +
        '<div class="note info">步行强度与费用为估算口径，来源为演示数据；真实版本会标明计算依据与待核实事项。</div>';

      return {
        title: '方案对比',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            if (ev.target.getAttribute('data-act') !== 'choose') return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            var id = ev.target.getAttribute('data-plan');
            App.toast('已选择' + (id === 'a' ? a.name : b.name) + '（演示，需负责人发布为正式行程）');
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'map'],
    view: function (params) {
      var trip = App.trip(params.id);
      var route = D.mapRoute[trip.id] || {
        day: '第 1 天',
        stops: [
          { name: '酒店', x: 24, y: 72 },
          { name: '宽窄巷子', x: 44, y: 48 },
          { name: '火锅晚餐', x: 66, y: 62 },
          { name: '酒店', x: 30, y: 80 }
        ],
        legs: [
          { from: '酒店', to: '宽窄巷子', mode: '地铁 2 号线', time: '22 分钟', cost: '约 4 元（估算）' },
          { from: '宽窄巷子', to: '火锅晚餐', mode: '步行', time: '18 分钟', cost: '—' },
          { from: '火锅晚餐', to: '酒店', mode: '打车', time: '15 分钟', cost: '约 22 元（估算）' }
        ]
      };

      var pins = route.stops.map(function (s, i) {
        return '<span class="pin' + (i === route.stops.length - 1 ? ' alt' : '') + '" style="left:' + s.x + '%;top:' + s.y + '%">' + (i + 1) + '</span>';
      }).join('');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '地图路线',
        sub: '网页展示路线与交通概览，逐向导航跳转外部地图；定位不可用时可以手动选择起点。'
      }) +
        '<div class="card"><div class="card-head"><h3>' + App.esc(route.day) + ' 路线</h3><span class="meta">示意地图 · 非真实地图</span></div>' +
        '<div class="map-canvas">' +
        '<div class="road" style="left:0;right:0;top:46%;height:10px"></div>' +
        '<div class="road" style="top:0;bottom:0;left:38%;width:10px"></div>' +
        '<div class="road" style="left:12%;right:18%;top:70%;height:8px"></div>' +
        pins + '<span class="map-tag">示意路线，不代表真实道路</span></div>' +
        '<div class="mt12"><div class="chip-row"><button class="btn small" data-act="locate">使用当前定位</button>' +
        '<button class="btn small" data-act="manual">手动选择起点</button>' +
        '<a class="btn small" href="#" data-act="navigate">在外部地图中导航</a></div></div></div>' +
        '<div class="card"><div class="card-head"><h3>交通衔接</h3></div>' +
        '<table class="table"><tr><th>路段</th><th>方式</th><th>用时</th><th>参考费用</th></tr>' +
        route.legs.map(function (l) {
          return '<tr><td>' + App.esc(l.from) + ' → ' + App.esc(l.to) + '</td><td>' + App.esc(l.mode) + '</td><td>' + App.esc(l.time) + '</td><td>' + App.esc(l.cost) + '</td></tr>';
        }).join('') + '</table>' +
        '<div class="note warn">用时与费用为演示估算；真实版本会标注数据来源、查询时间与是否为估算。</div></div>' +
        '<div class="card"><div class="card-head"><h3>离线地图</h3></div><p class="small muted">地图瓦片的离线保存权限尚未确认，当前不作为已承诺能力。离线只保证已保存的行程文本与摘要。</p></div>';

      return {
        title: '地图路线',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (act === 'locate') { App.toast('演示：定位未接入。可用“手动选择起点”继续'); return; }
            if (act === 'manual') {
              App.modal({
                title: '手动选择起点',
                body: '<div class="field"><label>起点</label><select><option>酒店（示例）</option><option>杭州东站</option><option>自定义地点</option></select></div>' +
                  '<p class="small muted">真实版本会据此重新计算路线与用时。</p>',
                actions: [{ label: '使用该起点', kind: 'primary', onClick: function () { App.toast('已按手动起点重新计算（演示）'); } }]
              });
              return;
            }
            if (act === 'navigate') {
              ev.preventDefault();
              App.modal({
                title: '跳转外部地图（演示）',
                body: '<p>真实版本会打开你选择的地图应用进行逐向导航，本产品不接管导航，也不收集持续定位。</p>'
              });
            }
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'place'],
    view: function (params) {
      var trip = App.trip(params.id);
      var f = (D.features[trip.cities[0]] || {}).nature[0];
      var html = App.pageHead({
        eyebrow: '地点详情',
        title: App.esc(f.title),
        sub: '参考信息带来源、适用日期与查询时间；缺失或冲突时标记待核实。'
      }) +
        '<div class="card">' + App.badge(f.status, f.statusText) +
        '<p class="mt8">' + App.esc(f.summary) + '</p>' +
        '<dl class="kv"><dt>地点</dt><dd>' + App.esc(f.where) + '</dd>' +
        '<dt>季节</dt><dd>' + App.esc(f.season) + '</dd>' +
        '<dt>用时</dt><dd>' + App.esc(f.duration) + '</dd>' +
        '<dt>费用</dt><dd>' + App.esc(f.cost) + '</dd>' +
        '<dt>注意</dt><dd>' + App.esc(f.tips) + '</dd></dl>' +
        App.sourceLine(f) + '</div>' +
        '<div class="card"><div class="card-head"><h3>预约与外部入口</h3></div>' +
        '<p class="small muted">未接入真实预约系统。预订跳转与订单导入在订单中心处理，本产品不提供支付。</p>' +
        '<div class="chip-row"><a class="btn small" href="#/trip/' + trip.id + '/orders">去订单中心</a>' +
        '<a class="btn small primary" href="#/trip/' + trip.id + '/features">返回特色</a></div></div>' +
        '<div class="card"><div class="card-head"><h3>其他待核实信息</h3></div>' +
        '<p class="small">开放时间与临时管制未收录，标记为待核实，并附查询入口。演示原型不打开外部页面。</p></div>';
      return { title: '地点详情', html: html };
    }
  });
})();