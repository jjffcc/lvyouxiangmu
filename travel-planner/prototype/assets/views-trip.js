(function () {
  "use strict";
  var App = window.App;
  var D = window.DEMO;

  function tripCard(trip) {
    var badge = trip.status === '规划中' ? 'demo' : 'ok';
    return '<a class="card" href="#/trip/' + trip.id + '/plan" style="display:block;color:inherit">' +
      '<div class="card-head"><div><h3>' + App.esc(trip.title) + '</h3>' +
      '<div class="meta">' + App.esc(trip.cities.join(' → ')) + ' · ' + App.esc(trip.start) + ' 至 ' + App.esc(trip.end) + ' · ' + trip.people + ' 人</div></div>' +
      App.badge(badge, trip.status) + '</div>' +
      '<div class="small muted">节奏：' + App.esc(trip.pace) + ' ｜ 预算 ' + App.money(trip.budget.total) + ' ｜ 已记录 ' + App.money(trip.budget.spent) + '</div>' +
      '</a>';
  }

  App.ROUTES.push({
    path: ['trips'],
    view: function () {
      var html = App.pageHead({
        eyebrow: '我的旅行',
        title: '旅行列表',
        sub: '每次旅行独立组织行程、成员、订单与费用。演示数据包含一条亲子游和一条朋友多城市行。',
        actions: '<a class="btn primary" href="#/trip/new">新建旅行</a>'
      }) +
        '<div class="grid two">' + D.trips.map(tripCard).join('') + '</div>' +
        App.releaseSummary() +
        '<div class="card flat"><div class="card-head"><h3>复用行程</h3></div>' +
        '<p class="small muted">复用会生成新的旅行草稿：保留候选地点与安排参考，需要重新选择日期、预算和成员；旧订单、实际支出、结清记录与敏感附件不会带入。</p>' +
        '<button class="btn small" data-act="reuse">演示：复用杭州亲子三日游</button></div>';

      return {
        title: '我的旅行',
        html: html,
        mount: function (root) {
          root.querySelector('[data-act="reuse"]').addEventListener('click', function () {
            App.modal({
              title: '复用为新旅行草稿（演示）',
              body: '<p>保留：候选地点、每日安排参考、偏好与忌口。</p>' +
                '<p>不带入：订单、实际支出、结清记录、敏感附件。</p>' +
                '<p class="small muted">动态信息如营业时间与价格会标记为待核实。</p>',
              actions: [{ label: '创建草稿（演示）', kind: 'primary', onClick: function () { App.toast('已生成旅行草稿（演示，不会真实保存）'); } }]
            });
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', 'new'],
    view: function () {
      var html = App.pageHead({ eyebrow: '新建旅行', title: '填写出行条件', sub: '表单与 AI 对话是两种并行入口；此处演示表单入口。' }) +
        '<div class="card">' +
        '<div class="row2">' +
        '<div class="field"><label>目的地 <span class="hint">支持多城市</span></label><input value="杭州"></div>' +
        '<div class="field"><label>出行人数</label><input value="4" inputmode="numeric"></div>' +
        '</div>' +
        '<div class="row2">' +
        '<div class="field"><label>出发日期</label><input type="date" value="2026-10-17"></div>' +
        '<div class="field"><label>返回日期</label><input type="date" value="2026-10-19"></div>' +
        '</div>' +
        '<div class="field"><label>日期类型</label><select><option>固定日期</option><option>弹性日期（例如某个月内安排 3 天）</option></select></div>' +
        '<div class="row2">' +
        '<div class="field"><label>全团预算（元）</label><input value="6000" inputmode="numeric"></div>' +
        '<div class="field"><label>节奏</label><select><option>舒适</option><option>经济</option><option>丰富</option></select></div>' +
        '</div>' +
        '<div class="field"><label>硬性条件 <span class="hint">必须满足，无法满足时展示冲突</span></label><textarea>每天 13:00-14:30 午休；10-18 16:00 浙江省博物馆预约（已确认）</textarea></div>' +
        '<div class="field"><label>偏好 <span class="hint">可以协商调整</span></label><textarea>舒适节奏；每天步行不超过 8000 步；尽量少换酒店</textarea></div>' +
        '<button class="btn primary" data-act="save">生成行程（演示）</button>' +
        '<div class="note info mt12">演示说明：这里不会真实保存数据，也不会调用 AI 或地图服务。</div>' +
        '</div>';

      return {
        title: '新建旅行',
        html: html,
        mount: function (root) {
          root.querySelector('[data-act="save"]').addEventListener('click', function () {
            App.modal({
              title: '生成行程（演示）',
              body: '<p>已按硬性条件优先、舒适节奏次之的顺序生成 3 天草案。</p>' +
                '<p class="small muted">真实版本会调用规划服务并展示修改前后、原因与费用影响，等待你确认后再应用。</p>',
              actions: [{ label: '知道了', kind: 'primary', onClick: function () { App.go('#/trip/hz-family/plan'); } }]
            });
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'discover'],
    view: function (params) {
      var trip = App.trip(params.id);
      var city = trip.cities[0];
      var data = D.discover[city] || D.discover['杭州'];
      var all = data.spots.concat(data.stays, data.eats);

      function itemHtml(item) {
        return '<div class="item" data-type="' + App.esc(item.type) + '" data-name="' + App.esc(item.name) + '">' +
          '<div class="body"><div class="title">' + App.esc(item.name) + ' ' + App.badge(item.status, item.statusText) + '</div>' +
          '<div class="sub">' + App.esc(item.type) + ' · ' + App.esc(item.area) + ' · ' + App.esc(item.note) + '</div></div>' +
          '<div class="side"><button class="btn small" data-act="collect">收藏</button><button class="btn small primary" data-act="candidate">加入候选</button></div></div>';
      }

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '目的地发现',
        sub: '按城市查看候选地点，可收藏或加入行程候选。信息带来源与时间。'
      }) +
        '<div class="field"><label>搜索候选地点</label><input placeholder="输入地点名称，例如：西湖" data-field="search"></div>' +
        '<div class="chip-row" data-role="filters">' +
        ['全部', '景点', '住宿', '餐饮'].map(function (k) {
          return '<button class="chip" data-filter="' + k + '" aria-pressed="' + (k === '全部') + '">' + k + '</button>';
        }).join('') + '</div>' +
        '<div class="list mt12" data-role="list">' + all.map(itemHtml).join('') + '</div>' +
        '<div class="note warn mt12">数据不足时会保留空状态：例如搜索“沙漠营地”不会得到结果，也不会用虚构地点补齐。</div>';

      return {
        title: '目的地发现',
        html: html,
        mount: function (root) {
          var list = root.querySelector('[data-role="list"]');
          var search = root.querySelector('[data-field="search"]');
          var activeFilter = '全部';

          function apply() {
            var term = (search.value || '').trim();
            var shown = 0;
            Array.prototype.forEach.call(list.querySelectorAll('.item'), function (el) {
              var okType = activeFilter === '全部' || el.getAttribute('data-type') === activeFilter;
              var okTerm = !term || el.getAttribute('data-name').indexOf(term) >= 0 || el.textContent.indexOf(term) >= 0;
              var visible = okType && okTerm;
              el.style.display = visible ? '' : 'none';
              if (visible) shown++;
            });
            var emptyEl = list.querySelector('.empty');
            if (!shown) {
              if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'empty';
                list.appendChild(emptyEl);
              }
              emptyEl.textContent = '没有符合条件的地点。数据不足时保留空状态，不补充虚构信息。';
            } else if (emptyEl) {
              emptyEl.parentNode.removeChild(emptyEl);
            }
          }

          search.addEventListener('input', apply);
          root.querySelectorAll('[data-filter]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              activeFilter = btn.getAttribute('data-filter');
              root.querySelectorAll('[data-filter]').forEach(function (b) {
                b.setAttribute('aria-pressed', String(b === btn));
              });
              apply();
            });
          });
          list.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            var name = ev.target.closest('.item').getAttribute('data-name');
            App.toast(act === 'collect' ? '已收藏：' + name + '（演示）' : '已加入行程候选：' + name + '（演示）');
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'features'],
    view: function (params) {
      var trip = App.trip(params.id);
      var cities = trip.cities;
      var activeCity = App.state.featureCity && cities.indexOf(App.state.featureCity) >= 0 ? App.state.featureCity : cities[0];
      var data = (D.features[activeCity] || {})[App.state.featureTab] || [];

      function featureHtml(f) {
        var link = f.link
          ? '<a class="btn small primary" href="' + f.link + '">' + App.esc(f.linkText || '查看详情') + '</a>'
          : '<button class="btn small" data-act="candidate">加入候选</button>';
        return '<div class="item"><div class="body">' +
          '<div class="title">' + App.esc(f.title) + ' ' + App.badge(f.status, f.statusText) + '</div>' +
          '<div class="sub">' + App.esc(f.summary) + '</div>' +
          '<div class="sub">地点：' + App.esc(f.where) + ' ｜ 季节：' + App.esc(f.season) + ' ｜ 用时：' + App.esc(f.duration) + ' ｜ 费用：' + App.esc(f.cost) + '</div>' +
          (f.tips ? '<div class="sub">注意：' + App.esc(f.tips) + '</div>' : '') +
          App.sourceLine(f) +
          '</div><div class="side">' + link + '</div></div>';
      }

      var cityTabs = cities.length > 1
        ? '<div class="tabs" data-role="city">' + cities.map(function (c) {
            return '<button data-city="' + App.esc(c) + '" aria-selected="' + (c === activeCity) + '">' + App.esc(c) + '</button>';
          }).join('') + '</div>'
        : '';

      var listHtml = data.length
        ? data.map(featureHtml).join('')
        : '<div class="empty">该城市暂未收录此分类的资料。可以补充来源后加入，或先查看其他分类。</div>';

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '目的地特色',
        sub: '城市概览加具体地方详情；每项特色都标出来源与适用时间。'
      }) + cityTabs +
        '<div class="tabs" data-role="tabs">' + D.tabs.features.map(function (t) {
          return '<button data-tab="' + t.id + '" aria-selected="' + (t.id === App.state.featureTab) + '">' + App.esc(t.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="small muted">当前城市：' + App.esc(activeCity) + '</div>' +
        '<div class="list mt12" data-role="list">' + listHtml + '</div>' +
        '<div class="note info mt12">没有资料的分类保留空状态；不会用无依据内容填满每个地方。</div>';

      return {
        title: '目的地特色',
        html: html,
        mount: function (root) {
          root.querySelector('[data-role="tabs"]').addEventListener('click', function (ev) {
            var tab = ev.target.getAttribute && ev.target.getAttribute('data-tab');
            if (!tab) return;
            App.state.featureTab = tab;
            App.render();
          });
          var cityRow = root.querySelector('[data-role="city"]');
          if (cityRow) {
            cityRow.addEventListener('click', function (ev) {
              var c = ev.target.getAttribute && ev.target.getAttribute('data-city');
              if (!c) return;
              App.state.featureCity = c;
              App.render();
            });
          }
          root.addEventListener('click', function (ev) {
            if (!ev.target.getAttribute || ev.target.getAttribute('data-act') !== 'candidate') return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            App.toast('已加入行程候选（演示）');
          });
        }
      };
    }
  });

  var MEAL_FILTERS = [
    { id: 'mild', label: '不辣 / 微辣', keys: ['不辣', '少辣', '微辣'] },
    { id: 'light', label: '少盐少油', keys: ['少盐', '少油'] },
    { id: 'kid', label: '儿童可吃', keys: ['儿童'] },
    { id: 'takeaway', label: '可打包', keys: ['打包'] }
  ];

  App.ROUTES.push({
    path: ['trip', ':id', 'food'],
    view: function (params) {
      var trip = App.trip(params.id);
      var cities = trip.cities;
      var city = App.state.foodCity && cities.indexOf(App.state.foodCity) >= 0 ? App.state.foodCity : cities[0];
      var food = D.cityFood[city] || D.cityFood['杭州'];
      var mealTab = App.state.mealTab || 'all';
      var fits = App.state.mealFit || [];

      function shopHtml(s) {
        return '<div class="item"><div class="body">' +
          '<div class="title">' + App.esc(s.name) + ' ' + App.badge(s.status, s.statusText) + '</div>' +
          '<div class="sub">' + App.esc(s.area) + ' · 推荐：' + App.esc(s.dish) + ' · 参考 ' + App.esc(s.cost) + ' · 营业 ' + App.esc(s.hours) + '</div>' +
          '<div class="sub">适合：' + (s.fit || []).map(function (t) { return '<span class="badge ok">' + App.esc(t) + '</span>'; }).join(' ') + '</div>' +
          (s.note ? '<div class="sub">' + App.esc(s.note) + '</div>' : '') +
          App.sourceLine(s) +
          '</div><div class="side"><button class="btn small primary" data-act="addplan" data-shop="' + App.esc(s.name) + '">加入行程</button>' +
          '<a class="btn small" href="#" data-act="external">外部参考</a></div></div>';
      }

      var cityTabs = cities.length > 1
        ? '<div class="tabs" data-role="city">' + cities.map(function (c) {
            return '<button data-city="' + App.esc(c) + '" aria-selected="' + (c === city) + '">' + App.esc(c) + '</button>';
          }).join('') + '</div>'
        : '';

      var shops = food.shops.filter(function (s) {
        if (mealTab !== 'all' && s.meal !== mealTab) return false;
        if (!fits.length) return true;
        return fits.every(function (id) {
          var def = MEAL_FILTERS.filter(function (f) { return f.id === id; })[0];
          if (!def) return true;
          return (s.fit || []).some(function (tag) {
            return def.keys.some(function (k) { return tag.indexOf(k) >= 0; });
          });
        });
      });

      var dishes = food.dishes.filter(function (d) { return mealTab === 'all' || d.meal === mealTab; });

      var dishHtml = dishes.length
        ? '<div class="list">' + dishes.map(function (d) {
            var label = (D.tabs.meals.filter(function (m) { return m.id === d.meal; })[0] || {}).label || '';
            return '<div class="item"><div class="body"><div class="title">' + App.esc(d.name) + ' <span class="badge">' + App.esc(label) + '</span></div>' +
              '<div class="sub">' + App.esc(d.summary) + (d.note && d.note !== '-' ? ' ｜ ' + App.esc(d.note) : '') + '</div></div></div>';
          }).join('') + '</div>'
        : App.empty('该餐段暂无收录菜品。');

      var shopListHtml = shops.length
        ? '<div class="list">' + shops.map(shopHtml).join('') + '</div>'
        : App.empty('当前餐段与筛选条件下没有匹配的店铺。可放宽筛选或查看其他餐段。');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '城市美食',
        sub: '每个城市的独立美食页面：先看菜系与风味，再按餐段挑店，并结合同行者忌口筛选。'
      }) + cityTabs +
        '<div class="card"><div class="card-head"><h3>' + App.esc(city) + ' · ' + App.esc(food.style.name) + '</h3>' + App.badge(food.style.status, food.style.statusText) + '</div>' +
        '<p class="small">' + App.esc(food.style.summary) + '</p>' +
        '<div class="chip-row">' + food.style.flavors.map(function (f) { return '<span class="badge">' + App.esc(f) + '</span>'; }).join('') + '</div>' +
        App.sourceLine(food.style) + '</div>' +
        '<div class="card"><div class="card-head"><h3>同行者忌口</h3><span class="meta">来自同行者档案（演示）</span></div>' +
        '<ul class="small">' + food.allergies.map(function (a) { return '<li>' + App.esc(a) + '</li>'; }).join('') + '</ul>' +
        '<div class="note info">真实版本会按辣度、素食、过敏原与儿童可吃自动筛选；原型中下方筛选可用，但仅依据演示标签。</div></div>' +
        '<div class="tabs" data-role="meal">' + D.tabs.meals.map(function (m) {
          return '<button data-meal="' + m.id + '" aria-selected="' + (m.id === mealTab) + '">' + App.esc(m.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="chip-row" data-role="fits">' + MEAL_FILTERS.map(function (f) {
          return '<button class="chip" data-fit="' + f.id + '" aria-pressed="' + (fits.indexOf(f.id) >= 0) + '">' + App.esc(f.label) + '</button>';
        }).join('') + '</div>' +
        '<div class="card mt12"><div class="card-head"><h3>代表菜与小吃</h3><span class="meta">按餐段筛选</span></div>' + dishHtml + '</div>' +
        '<div class="card"><div class="card-head"><h3>店铺与体验地点</h3><span class="meta">区域或商圈 + 代表店铺</span></div>' + shopListHtml + '</div>' +
        '<div class="note warn">营业时间、价格与预约条件会变化：本页按来源与适用时间展示，查不到时标记待核实，不给出可直接前往的结论。预约仅提供外部参考链接，本产品不提供支付。</div>';

      return {
        title: '城市美食 · ' + city,
        html: html,
        mount: function (root) {
          var cityRow = root.querySelector('[data-role="city"]');
          if (cityRow) {
            cityRow.addEventListener('click', function (ev) {
              var c = ev.target.getAttribute && ev.target.getAttribute('data-city');
              if (!c) return;
              App.state.foodCity = c;
              App.render();
            });
          }
          root.querySelector('[data-role="meal"]').addEventListener('click', function (ev) {
            var m = ev.target.getAttribute && ev.target.getAttribute('data-meal');
            if (!m) return;
            App.state.mealTab = m;
            App.render();
          });
          root.querySelector('[data-role="fits"]').addEventListener('click', function (ev) {
            var f = ev.target.getAttribute && ev.target.getAttribute('data-fit');
            if (!f) return;
            var list = App.state.mealFit || [];
            var idx = list.indexOf(f);
            if (idx >= 0) list.splice(idx, 1); else list.push(f);
            App.state.mealFit = list;
            App.render();
          });
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (act === 'external') {
              ev.preventDefault();
              App.modal({
                title: '外部参考链接（演示）',
                body: '<p>真实版本会跳转到外部平台查看详情或咨询，本产品不代收费用、不代办预订。</p>' +
                  '<p class="small muted">演示原型没有外部链接，也不会打开任何网站。</p>'
              });
              return;
            }
            if (act === 'addplan') {
              if (!App.canEdit()) { App.denyEdit(); return; }
              App.toast('已加入行程候选：' + ev.target.getAttribute('data-shop') + '（演示）');
            }
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'library'],
    view: function (params) {
      var trip = App.trip(params.id);
      var items = D.library[trip.id] || [];

      function itemHtml(it) {
        var detail = it.items && it.items.length ? '<div class="sub">已提取：' + it.items.map(App.esc).join('、') + '</div>' : '';
        var action = it.status === 'warn'
          ? '<button class="btn small primary" data-act="extract" data-id="' + it.id + '">提取并确认</button>'
          : '<button class="btn small" data-act="add" data-id="' + it.id + '">加入候选</button>';
        return '<div class="item"><div class="body"><div class="title">' + App.esc(it.title) + ' ' + App.badge(it.status, it.statusText) + '</div>' +
          '<div class="sub">' + App.esc(it.kind) + ' · ' + App.esc(it.detail) + '</div>' + detail + '</div>' +
          '<div class="side">' + action + '</div></div>';
      }

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '资料库',
        sub: '收藏文字、截图与链接；提取结果需要你确认后才加入候选。'
      }) +
        '<div class="card"><div class="card-head"><h3>添加资料（演示）</h3></div>' +
        '<div class="chip-row"><button class="btn small" data-act="add-text">粘贴文字</button><button class="btn small" data-act="add-shot">上传截图</button><button class="btn small" data-act="add-link">添加链接</button></div>' +
        '<div class="note info">截图与 PDF 的真实识别属于 OCR 能力，原型不接入模型，也不会真实上传文件。</div></div>' +
        '<div class="list">' + items.map(itemHtml).join('') + '</div>';

      return {
        title: '资料库',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            if (act === 'add-text' || act === 'add-shot' || act === 'add-link') {
              App.toast('演示：这里会打开添加资料的界面');
              return;
            }
            if (act === 'extract') {
              App.modal({
                title: '提取结果确认（演示）',
                body: '<p>从这条资料中提取到 2 项候选：</p><ul><li>路亚装备清单</li><li>季节说法（来源不明确）</li></ul>' +
                  '<p class="small">第二项缺少可靠来源，确认时会标记为待核实，不会写成事实。</p>',
                actions: [{ label: '确认加入候选', kind: 'primary', onClick: function () { App.toast('已加入候选，其中 1 项标记待核实（演示）'); } }]
              });
              return;
            }
            if (act === 'add') App.toast('已加入行程候选（演示）');
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'more'],
    view: function (params) {
      var t = App.trip(params.id);
      var groups = [
        { title: '预订与费用', items: [['订单中心', 'orders'], ['订单导入确认', 'orders/import'], ['费用与分账', 'expenses']] },
        { title: '同行与准备', items: [['同行者', 'members'], ['出行准备', 'prepare'], ['旅行回顾', 'review']] },
        { title: '行程工具', items: [['方案对比', 'compare'], ['地图路线', 'map'], ['资料库', 'library'], ['城市美食', 'food'], ['目的地发现', 'discover']] }
      ];
      var html = App.pageHead({ eyebrow: t.title, title: '更多功能', sub: '移动端把次要入口收在这里；桌面端左侧导航可直接进入。' }) +
        groups.map(function (g) {
          return '<div class="card"><div class="card-head"><h3>' + App.esc(g.title) + '</h3></div>' +
            '<div class="list">' + g.items.map(function (it) {
              return '<a class="item" href="#/trip/' + t.id + '/' + it[1] + '" style="color:inherit"><div class="body"><div class="title">' + App.esc(it[0]) + '</div></div><div class="side">→</div></a>';
            }).join('') + '</div></div>';
        }).join('') +
        '<div class="card"><div class="card-head"><h3>其他</h3></div><div class="list">' +
        '<a class="item" href="#/trip/new" style="color:inherit"><div class="body"><div class="title">新建旅行</div></div><div class="side">→</div></a>' +
        '<a class="item" href="#/settings" style="color:inherit"><div class="body"><div class="title">设置与数据</div></div><div class="side">→</div></a>' +
        '</div></div>';
      return { title: '更多功能', html: html };
    }
  });
})();
