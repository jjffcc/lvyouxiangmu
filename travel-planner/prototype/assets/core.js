(function () {
  "use strict";

  var App = (window.App = {});
  App.ROUTES = [];
  App.state = {
    role: "owner",
    tripId: "hz-family",
    featureTab: "human",
    mealTab: "all",
    mealFilter: null,
    planDay: 0,
    orderType: "全部",
    compareChoice: "a"
  };

  /* ---------- 基础工具 ---------- */

  App.esc = function (value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  App.money = function (n) {
    var sign = n < 0 ? "-" : "";
    var v = Math.abs(Number(n) || 0);
    return sign + "¥" + v.toLocaleString("zh-CN");
  };

  /* 同一操作使用同一图标；不同导航和操作使用对应的 Tabler 图案。 */
  App.icon = function (name) { return window.travelIcon(name); };
  App.iconForLabel = function (label) {
    var rules = [
      [/新建旅行|创建草稿|生成新旅行/, 'plus'],
      [/复用/, 'copy'], [/城市美食|餐饮|^美食$/, 'tools-kitchen-2'],
      [/目的地特色|^特色$|返回特色/, 'compass'],
      [/目的地发现|搜索/, 'search'], [/行程工作台|^行程$/, 'route'],
      [/方案对比|对比方案|比较/, 'git-compare'],
      [/地图路线|^地图$/, 'map'], [/导航/, 'navigation'],
      [/定位/, 'crosshair'], [/选择起点/, 'map-pin'],
      [/订单导入|导入订单/, 'upload'], [/订单中心|门票/, 'ticket'],
      [/费用与分账|^费用$/, 'coins'], [/退款/, 'receipt-refund'],
      [/记录支出/, 'receipt'], [/结清/, 'circle-check'],
      [/邀请|发送/, 'user-plus'], [/撤销.*成员|撤销访问/, 'user-minus'],
      [/同行者/, 'users'], [/附件权限|调整权限/, 'shield-lock'],
      [/出行准备|任务/, 'checklist'], [/套用模板/, 'template'],
      [/途中助手|^途中$/, 'sun'], [/旅行回顾/, 'photo'],
      [/我的旅行|^旅行$/, 'luggage'], [/^更多$|^其他$|^全部$/, 'layout-grid'],
      [/设置|^调整$|调整提醒/, 'settings'],
      [/下载.*文档|导出费用/, 'file-description'], [/导出行程/, 'calendar'],
      [/导出|下载/, 'download'], [/分享/, 'share'],
      [/删除/, 'trash'], [/更新状态|检查更新|^更新$/, 'refresh'],
      [/上传 PDF/, 'file-type-pdf'], [/上传截图|添加截图/, 'photo'],
      [/粘贴文字/, 'clipboard'], [/手动录入/, 'edit'],
      [/资料库/, 'book'], [/收藏/, 'star'],
      [/加入候选|加入行程|添加/, 'map-pin'],
      [/提取/, 'clipboard-text'], [/外部参考|参考链接/, 'arrow-right'],
      [/解锁/, 'lock-open'], [/锁定/, 'lock'],
      [/上移/, 'arrow-up'], [/下移/, 'arrow-down'], [/恢复/, 'history'],
      [/修改前后|查看.*影响/, 'arrows-exchange'], [/改线|生成行程/, 'sparkles'],
      [/查看可选调整/, 'adjustments-horizontal'], [/临时关闭/, 'ban'],
      [/放弃|取消|关闭/, 'x'], [/保存/, 'device-floppy'],
      [/确认|选择此方案|同意|知道了/, 'check'],
      [/人文/, 'building-bank'], [/自然景观|景点/, 'mountain'],
      [/钓鱼/, 'fish'], [/地理特色/, 'world'], [/住宿/, 'building'],
      [/交通|火车/, 'train'], [/租车/, 'car'],
      [/早餐/, 'coffee'], [/午餐/, 'soup'], [/晚餐/, 'sunset'],
      [/夜宵/, 'moon'], [/小吃/, 'cookie'],
      [/不辣|微辣/, 'pepper'], [/少盐少油|素食/, 'leaf'],
      [/儿童/, 'mood-kid'], [/打包/, 'package'],
      [/杭州/, 'sailboat'], [/成都/, 'plant'], [/重庆/, 'stairs'],
      [/第 ?1 ?天|D1/, 'sunrise'], [/第 ?2 ?天|D2/, 'sun'],
      [/第 ?3 ?天|D3/, 'sunset'], [/第 ?\d+ ?天|D\d+/, 'calendar-event'],
      [/返回/, 'arrow-left'], [/版本|功能说明/, 'info-circle']
    ];
    for (var i = 0; i < rules.length; i++) if (rules[i][0].test(label)) return rules[i][1];
    return 'arrow-right';
  };

  App.decorateControls = function (root) {
    var controls = root.querySelectorAll('button, a.btn, a.icon-btn, a.item');
    Array.prototype.forEach.call(controls, function (control) {
      if (control.querySelector('.ui-icon')) return;
      var action = control.getAttribute('data-act');
      var actions = {
        'add-text': 'edit', 'add-shot': 'photo', 'add-link': 'book',
        'offline-update': 'refresh', 'offline-remove': 'trash',
        'upload-scope': 'adjustments-horizontal', 'remind': 'bell',
        'dup': 'copy', 'docs': 'shield-lock', 'candidate': 'map-pin',
        'addplan': 'route', 'temp': 'ban', 'ai-review': 'arrows-exchange',
        'save-note': 'device-floppy', 'requirements': 'file-description',
        'revoke': 'user-minus', 'export': 'download'
      };
      var label = control.textContent.trim();
      var dayIndex = control.getAttribute('data-day');
      var dayIcon = dayIndex !== null ? ['sunrise', 'sun', 'sunset', 'moon', 'calendar-event'][Number(dayIndex) % 5] : null;
      var name = control.getAttribute('data-icon-name') ||
        dayIcon || (action !== 'export' && actions[action]) || App.iconForLabel(label);
      control.insertAdjacentHTML('afterbegin', App.icon(name));
      control.classList.add('with-icon');
    });
  };

  App.releaseSummary = function () {
    return '<section class="card release-summary" aria-label="版本与功能状态">' +
      '<div class="card-head"><h3>版本与功能说明</h3>' + App.badge('demo', '需求 v1.1') + '</div>' +
      '<div class="release-status">' +
      '<span>' + App.icon('circle-check') + '方案已确认</span>' +
      '<span>' + App.icon('template') + '演示原型已完成</span>' +
      '<span>' + App.icon('clock') + '真实服务待接入</span></div>' +
      '<p class="small muted">目的地特色与城市美食均已纳入。当前为本地演示，尚未正式上线；完整业务验收待逐项完成。</p>' +
      '<div class="chip-row"><a class="btn small" href="requirements.html" data-icon-name="file-description">查看完整需求文档</a>' +
      '<a class="btn small" href="#/settings" data-icon-name="info-circle">查看功能状态</a></div></section>';
  };

  App.badge = function (kind, text) {
    return '<span class="badge ' + App.esc(kind || "") + '">' + App.esc(text) + "</span>";
  };

  App.sourceLine = function (obj) {
    var parts = [];
    if (obj.source) parts.push("来源：" + App.esc(obj.source));
    if (obj.sourceDate) parts.push(App.esc(obj.sourceDate));
    if (obj.checkedAt) parts.push(App.esc(obj.checkedAt));
    if (!parts.length) return "";
    return '<div class="source">' + parts.map(function (p) { return "<span>" + p + "</span>"; }).join("") + "</div>";
  };

  App.toast = function (message) {
    var wrap = document.getElementById("toast");
    if (!wrap) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2600);
  };

  App.modal = function (opts) {
    var root = document.getElementById("modal");
    var actions = (opts.actions || []).map(function (a, i) {
      return '<button class="btn ' + (a.kind || "") + '" data-modal-action="' + i + '">' + App.esc(a.label) + "</button>";
    }).join("");
    root.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
      "<h3>" + App.esc(opts.title || "") + "</h3>" +
      '<div class="modal-body">' + (opts.body || "") + "</div>" +
      '<div class="modal-actions">' + (actions || '<button class="btn" data-modal-close="1">关闭</button>') + "</div>" +
      "</div>";
    root.onclick = function (ev) {
      var t = ev.target;
      if (t.getAttribute("data-modal-close")) { App.closeModal(); return; }
      var idx = t.getAttribute("data-modal-action");
      if (idx !== null && opts.actions && opts.actions[Number(idx)]) {
        var action = opts.actions[Number(idx)];
        App.closeModal();
        if (typeof action.onClick === "function") action.onClick();
      }
    };
    App.decorateControls(root);
    App.wrapTables(root);
  };

  App.closeModal = function () {
    document.getElementById("modal").innerHTML = "";
  };

  /* ---------- 角色与权限 ---------- */

  App.role = function () { return App.state.role; };
  App.roleLabel = function () { return (window.DEMO.roleLabels[App.state.role] || "演示角色"); };
  App.canEdit = function () { return App.state.role !== "readonly"; };

  App.denyEdit = function () {
    App.toast("当前为只读成员，演示中不提供编辑操作");
  };

  /* ---------- 路由 ---------- */

  App.trip = function (id) {
    var list = window.DEMO.trips;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  };

  App.route = function () {
    var raw = (location.hash || "#/trips").replace(/^#\/?/, "");
    var parts = raw.split("/").filter(function (p) { return p.length > 0; });
    if (!parts.length) parts = ["trips"];
    var params = {};
    var route = null;
    for (var i = 0; i < App.ROUTES.length; i++) {
      var candidate = App.ROUTES[i];
      if (candidate.path.length !== parts.length) continue;
      var ok = true;
      var local = {};
      for (var j = 0; j < parts.length; j++) {
        var seg = candidate.path[j];
        if (seg.charAt(0) === ":") local[seg.slice(1)] = decodeURIComponent(parts[j]);
        else if (seg !== parts[j]) { ok = false; break; }
      }
      if (ok) { route = candidate; params = local; break; }
    }
    return { parts: parts, route: route, params: params, hash: location.hash || "#/trips" };
  };

  App.go = function (hash) {
    if (location.hash === hash) App.render();
    else location.hash = hash;
  };

  /* ---------- 导航 ---------- */

  App.navItems = function () {
    var t = App.trip(App.state.tripId);
    return {
      tabbar: [
        { label: "旅行", hash: "#/trips" },
        { label: "行程", hash: "#/trip/" + t.id + "/plan" },
        { label: "特色", hash: "#/trip/" + t.id + "/features" },
        { label: "途中", hash: "#/trip/" + t.id + "/today" },
        { label: "更多", hash: "#/trip/" + t.id + "/more" }
      ],
      sidebar: [
        { group: "当前旅行", items: [
          { label: "我的旅行", hash: "#/trips" },
          { label: "行程工作台", hash: "#/trip/" + t.id + "/plan" },
          { label: "方案对比", hash: "#/trip/" + t.id + "/compare" },
          { label: "地图路线", hash: "#/trip/" + t.id + "/map" }
        ] },
        { group: "了解当地", items: [
          { label: "目的地发现", hash: "#/trip/" + t.id + "/discover" },
          { label: "目的地特色", hash: "#/trip/" + t.id + "/features" },
          { label: "城市美食", hash: "#/trip/" + t.id + "/food" },
          { label: "资料库", hash: "#/trip/" + t.id + "/library" }
        ] },
        { group: "预订与费用", items: [
          { label: "订单中心", hash: "#/trip/" + t.id + "/orders" },
          { label: "费用与分账", hash: "#/trip/" + t.id + "/expenses" }
        ] },
        { group: "同行与准备", items: [
          { label: "同行者", hash: "#/trip/" + t.id + "/members" },
          { label: "出行准备", hash: "#/trip/" + t.id + "/prepare" },
          { label: "途中助手", hash: "#/trip/" + t.id + "/today" },
          { label: "旅行回顾", hash: "#/trip/" + t.id + "/review" }
        ] },
        { group: "其他", items: [
          { label: "新建旅行", hash: "#/trip/new" },
          { label: "设置与数据", hash: "#/settings" }
        ] }
      ]
    };
  };

  App.renderNav = function (hash) {
    var nav = App.navItems();
    var tabbar = document.getElementById("tabbar");
    var sidebar = document.getElementById("sidebar");
    var active = hash || location.hash;

    tabbar.innerHTML = nav.tabbar.map(function (item) {
      var isMore = item.label === "更多";
      var isActive = isMore
        ? /\/(more|orders|expenses|members|prepare|review|library|compare|map|discover|food|settings)/.test(active)
        : active.indexOf(item.hash) === 0;
      return '<a href="' + item.hash + '"' + (isActive ? ' class="active"' : "") + '>' +
        App.icon(App.iconForLabel(item.label)) + '<span>' + App.esc(item.label) + "</span></a>";
    }).join("");

    sidebar.innerHTML = "<nav>" + nav.sidebar.map(function (group) {
      return '<div class="group-title">' + App.esc(group.group) + "</div>" +
        group.items.map(function (item) {
          var isActive = active.indexOf(item.hash) === 0;
          return '<a href="' + item.hash + '"' + (isActive ? ' class="active"' : "") + '>' +
            App.icon(App.iconForLabel(item.label)) + '<span>' + App.esc(item.label) + "</span></a>";
        }).join("");
    }).join("") +
      '<div class="sidebar-card"><strong>演示说明</strong>全部内容为虚构示例，未接入真实地图、天气、账户、AI 或 OCR 服务。</div>' +
      "</nav>";
  };

  /* ---------- 渲染 ---------- */

  App.render = function () {
    var r = App.route();
    // Delegated listeners are attached by each page's mount. Replacing the
    // container clears previous listeners, so a click runs only the current page.
    var previousView = document.getElementById("view");
    var view = previousView.cloneNode(false);
    previousView.parentNode.replaceChild(view, previousView);
    if (!r.route) {
      view.innerHTML = '<div class="empty">未找到该页面。请从左侧导航或底部导航进入。</div>';
      App.renderNav(r.hash);
      return;
    }
    if (r.params.id) App.state.tripId = r.params.id;
    var result = r.route.view(r.params) || {};
    view.innerHTML = result.html || "";
    App.wrapTables(view);
    App.decorateControls(view);
    if (typeof result.mount === "function") result.mount(view);
    App.renderNav(r.hash);
    document.title = (result.title ? result.title + " · " : "") + "行迹 · 国内旅游规划（演示原型 v1.1）";
    window.scrollTo(0, 0);
  };

  App.start = function () {
    App.decorateControls(document.querySelector('.topbar'));
    var select = document.getElementById("role-select");
    select.value = App.state.role;
    select.addEventListener("change", function () {
      App.state.role = select.value;
      App.toast("已切换到演示角色：" + App.roleLabel());
      App.render();
    });
    window.addEventListener("hashchange", function () { App.render(); });
    if (!location.hash) location.hash = "#/trips";
    App.render();
  };

  /* ---------- 通用片段 ---------- */

  App.pageHead = function (opts) {
    return '<div class="page-head">' +
      (opts.eyebrow ? '<div class="eyebrow">' + App.esc(opts.eyebrow) + "</div>" : "") +
      "<h1>" + App.esc(opts.title) + "</h1>" +
      (opts.sub ? '<div class="sub">' + opts.sub + "</div>" : "") +
      (opts.actions ? '<div class="actions">' + opts.actions + "</div>" : "") +
      "</div>";
  };

  App.readonlyNote = function () {
    return App.canEdit() ? "" : '<div class="note warn">当前演示角色为只读成员，页面中的编辑、确认与保存操作不可用。</div>';
  };

  App.empty = function (text) {
    return '<div class="empty">' + App.esc(text) + "</div>";
  };

  // 窄屏下让宽表格横向滚动，避免整页被撑破
  App.wrapTables = function (root) {
    var tables = root.querySelectorAll("table.table");
    Array.prototype.forEach.call(tables, function (table) {
      var parent = table.parentNode;
      if (!parent || (parent.classList && parent.classList.contains("table-wrap"))) return;
      var wrap = document.createElement("div");
      wrap.className = "table-wrap";
      parent.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  };
})();
