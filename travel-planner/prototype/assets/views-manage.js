(function () {
  "use strict";
  var App = window.App;
  var D = window.DEMO;

  App.ROUTES.push({
    path: ['trip', ':id', 'orders'],
    view: function (params) {
      var trip = App.trip(params.id);
      var orders = D.orders[trip.id] || [];
      var types = ['全部', '交通', '住宿', '门票', '餐饮'];
      var active = App.state.orderType || '全部';
      var shown = orders.filter(function (o) { return active === '全部' || o.type === active; });

      function orderHtml(o) {
        return '<div class="item"><div class="body">' +
          '<div class="title">' + App.esc(o.title) + ' ' + App.badge(o.status, o.statusText) + '</div>' +
          '<div class="sub">' + App.esc(o.type) + ' · ' + App.esc(o.when) + ' · ' + App.esc(o.detail) + '</div>' +
          '<div class="sub">来源：' + App.esc(o.source) + ' ｜ ' + App.esc(o.sensitive) + ' ｜ 更新 ' + App.esc(o.updated) + '</div>' +
          '</div><div class="side">' +
          '<button class="btn small" data-act="update">更新状态</button>' +
          '<button class="btn small" data-act="docs">附件权限</button>' +
          '</div></div>';
      }

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '订单中心',
        sub: '统一管理从外部渠道取得的订单：手动录入、文字、截图与 PDF 导入，确认后保存。',
        actions: '<a class="btn primary" href="#/trip/' + trip.id + '/orders/import">导入订单</a>'
      }) +
        App.readonlyNote() +
        '<div class="note warn">产品不提供支付与代付。订单记录只表示你登记的预订信息，不代表本产品核验了外部订单状态。</div>' +
        '<div class="chip-row">' + types.map(function (t) {
          return '<button class="chip" data-type="' + t + '" aria-pressed="' + (t === active) + '">' + t + '</button>';
        }).join('') + '</div>' +
        '<div class="list mt12">' + (shown.length ? shown.map(orderHtml).join('') : App.empty('该类型暂无订单。')) + '</div>' +
        '<div class="card flat"><div class="card-head"><h3>重复导入提示</h3></div>' +
        '<p class="small muted">再导入一次 10-17 至 10-20 的住宿订单时，会先提示可能重复，由你决定是否合并、覆盖或保留两条。</p>' +
        '<button class="btn small" data-act="dup">演示：重复导入同一住宿订单</button></div>';

      return {
        title: '订单中心',
        html: html,
        mount: function (root) {
          root.querySelectorAll('[data-type]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              App.state.orderType = btn.getAttribute('data-type');
              App.render();
            });
          });
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (act === 'dup') {
              App.modal({
                title: '可能重复的订单',
                body: '<p>已存在：西湖东侧酒店（示例）10-17 至 10-20，3 晚，价格待核实。</p>' +
                  '<p>本次导入：同为该酒店，入住与离店日期一致，预订号不同。</p>' +
                  '<p class="small muted">请选择处理方式，系统不会自动增加重复记录。</p>',
                actions: [
                  { label: '保留两条', onClick: function () { App.toast('已保留两条并标记疑似重复（演示）'); } },
                  { label: '合并到已有订单', kind: 'primary', onClick: function () { App.toast('已合并到已有订单（演示）'); } }
                ]
              });
              return;
            }
            if (act === 'docs') {
              App.modal({
                title: '附件与敏感信息权限',
                body: '<p>原始附件默认不共享给只读成员；联系方式单独控制。</p>' +
                  '<ul class="small"><li>我：可查看</li><li>爱人：可查看</li><li>童童 / 外婆：不可查看</li></ul>'
              });
              return;
            }
            if (act === 'update') {
              if (!App.canEdit()) { App.denyEdit(); return; }
              App.modal({
                title: '更新订单状态',
                body: '<div class="field"><label>新状态</label><select><option>改期</option><option>取消</option><option>已确认</option></select></div>' +
                  '<div class="note warn">此变更会影响关联行程与费用：10-18 的博物馆预约与返程时间都在同一天。</div>' +
                  '<p class="small">确认后会更新关联安排；退款单独记录，原支出与更正历史会保留。</p>',
                actions: [
                  { label: '取消' },
                  { label: '确认更新（演示）', kind: 'primary', onClick: function () { App.toast('已更新状态并同步关联行程与费用（演示）'); } }
                ]
              });
            }
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'orders', 'import'],
    view: function (params) {
      var trip = App.trip(params.id);
      var sample = D.importSample;

      var rows = sample.fields.map(function (f) {
        return '<tr><td>' + App.esc(f.key) + '</td><td>' + App.esc(f.value) + '</td><td>' +
          (f.sensitive ? App.badge('warn', '敏感字段已遮盖') : App.badge('demo', '可编辑')) + '</td></tr>';
      }).join('');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '订单导入确认',
        sub: '支持手动录入、粘贴文字、截图与 PDF；识别结果需要你确认后才保存。'
      }) +
        App.readonlyNote() +
        '<div class="card"><div class="card-head"><h3>选择导入方式</h3></div>' +
        '<div class="chip-row"><button class="btn small" data-act="mode" data-mode="手动录入">手动录入</button>' +
        '<button class="btn small" data-act="mode" data-mode="粘贴文字">粘贴文字</button>' +
        '<button class="btn small" data-act="mode" data-mode="上传截图">上传截图</button>' +
        '<button class="btn small" data-act="mode" data-mode="上传 PDF">上传 PDF</button></div>' +
        '<div class="note info">演示：不读取真实文件，也不上传任何内容。真实接入时会说明上传范围，并由你选择。</div></div>' +
        '<div class="card"><div class="card-head"><h3>识别结果</h3>' + App.badge('warn', '待你确认') + '</div>' +
        '<table class="table"><tr><th>字段</th><th>识别值</th><th>处理</th></tr>' + rows + '</table>' +
        '<div class="field mt12"><label>关联旅行</label><select><option>' + App.esc(trip.title) + '</option></select></div></div>' +
        '<div class="note warn">可能重复：' + App.esc(sample.duplicateNote) + ' 保存前需要你选择合并、覆盖或保留两条。</div>' +
        '<div class="card"><div class="card-head"><h3>保存选项</h3></div>' +
        '<div class="field"><label>原始附件</label><select><option>不保留（仅存摘要）</option><option>保留在云端（仅我可见）</option><option>保存在本机</option></select></div>' +
        '<div class="field"><label>敏感字段</label><select><option>遮盖并只保存必要信息</option><option>按原样保存（不推荐）</option></select></div>' +
        '<div class="chip-row"><button class="btn" data-act="cancel">放弃</button>' +
        '<button class="btn primary" data-act="confirm">确认保存（演示）</button></div></div>';

      return {
        title: '订单导入确认',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            if (act === 'mode') { App.toast('已选择：' + ev.target.getAttribute('data-mode') + '（演示）'); return; }
            if (act === 'cancel') { App.go('#/trip/' + trip.id + '/orders'); return; }
            if (act === 'confirm') {
              App.modal({
                title: '确认前请处理重复项',
                body: '<p>检测到可能重复的住宿订单。</p>' +
                  '<p class="small muted">确认保存后，订单会关联到 10-17 至 10-20 的住宿安排，并提示价格仍待核实。</p>',
                actions: [
                  { label: '返回修改' },
                  { label: '合并并保存（演示）', kind: 'primary', onClick: function () { App.toast('已合并保存，价格标记待核实（演示）'); App.go('#/trip/' + trip.id + '/orders'); } }
                ]
              });
            }
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'expenses'],
    view: function (params) {
      var trip = App.trip(params.id);
      var e = D.expenses[trip.id];
      var pct = Math.min(100, Math.round((e.budget.spent / e.budget.total) * 100));

      var itemRows = e.items.map(function (it) {
        var kindBadge = it.kind === 'estimate' ? App.badge('demo', '估算') : it.kind === 'refund' ? App.badge('warn', '退款') : App.badge('ok', '实际');
        return '<tr><td>' + App.esc(it.title) + '<div class="small muted">' + App.esc(it.source) + '</div></td>' +
          '<td>' + kindBadge + '</td><td>' + App.esc(it.share) + '</td><td>' + App.esc(it.payer) + '</td>' +
          '<td class="num">' + App.money(it.amount) + '</td></tr>';
      }).join('');

      var shareRows = e.shares.map(function (s) {
        return '<tr><td>' + App.esc(s.name) + '</td><td class="num">' + App.money(s.paid) + '</td>' +
          '<td class="num">' + App.money(s.should) + '</td><td class="num">' + App.money(s.diff) + '</td></tr>';
      }).join('');

      var settleHtml = e.settle.length
        ? '<table class="table"><tr><th>付款人</th><th>收款人</th><th class="num">金额</th><th>时间</th></tr>' +
          e.settle.map(function (s) {
            return '<tr><td>' + App.esc(s.from) + '</td><td>' + App.esc(s.to) + '</td><td class="num">' + App.money(s.amount) + '</td>' +
              '<td>' + App.esc(s.at) + '<div class="small muted">' + App.esc(s.note) + '</div></td></tr>';
          }).join('') + '</table>'
        : App.empty('还没有结清记录。');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '费用与分账',
        sub: '预算、实际支出、退款与结清记录分开管理；这里只做记录与计算。',
        actions: '<button class="btn" data-act="add">记录支出</button><button class="btn" data-act="refund">记录退款</button>'
      }) +
        App.readonlyNote() +
        '<div class="grid stat">' +
        '<div class="stat"><div class="k">全团预算</div><div class="v">' + App.money(e.budget.total) + '</div><div class="n">人均约 ' + App.money(Math.round(e.budget.total / trip.people)) + '</div></div>' +
        '<div class="stat"><div class="k">已记录实际支出</div><div class="v">' + App.money(e.budget.spent) + '</div><div class="n">含退款更正</div></div>' +
        '<div class="stat"><div class="k">预算使用</div><div class="v">' + pct + '%</div><div class="n">估算不计入实际</div></div>' +
        '<div class="stat"><div class="k">分摊规则</div><div class="v" style="font-size:16px">均摊 / 指定</div><div class="n">可改比例或金额</div></div>' +
        '</div>' +
        '<div class="card"><div class="card-head"><h3>预算使用情况</h3><span class="meta">实际支出不含估算项</span></div>' +
        '<div class="progress"><i style="width:' + pct + '%"></i></div>' +
        '<div class="small muted mt8">含估算餐饮与门票 ' + App.money(2400) + ' 后，预计合计 ' + App.money(e.budget.spent + 2400) + '；超出部分会单独提示。</div></div>' +
        '<div class="card"><div class="card-head"><h3>支出与记录</h3></div>' +
        '<table class="table"><tr><th>项目</th><th>类型</th><th>分摊</th><th>垫付</th><th class="num">金额</th></tr>' + itemRows + '</table></div>' +
        '<div class="card"><div class="card-head"><h3>成员承担金额</h3><span class="meta">更新后差额会重新计算</span></div>' +
        '<table class="table"><tr><th>成员</th><th class="num">已支付</th><th class="num">应承担</th><th class="num">差额</th></tr>' + shareRows + '</table>' +
        '<div class="note info">差额为计算结果，不代表已经转账或结清。实际支付由你们在外部完成。</div></div>' +
        '<div class="card"><div class="card-head"><h3>结清记录</h3>' + App.badge('demo', '手动登记') + '</div>' + settleHtml +
        '<div class="mt12"><button class="btn small" data-act="settle">登记已结清</button></div>' +
        '<div class="note warn mt12">已结清后如果发生退款或分摊更正，会保留原记录并展示成员差额变化。</div></div>';

      return {
        title: '费用与分账',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            if (act === 'add') {
              App.modal({
                title: '记录支出（演示）',
                body: '<div class="field"><label>项目</label><input placeholder="例如：门票 4 张"></div>' +
                  '<div class="field"><label>金额</label><input inputmode="numeric" placeholder="0"></div>' +
                  '<div class="field"><label>分摊方式</label><select><option>全员均摊</option><option>指定成员</option><option>按比例</option><option>自定义金额</option></select></div>',
                actions: [{ label: '保存（演示）', kind: 'primary', onClick: function () { App.toast('已记录支出（演示）'); } }]
              });
              return;
            }
            if (act === 'refund') {
              App.modal({
                title: '记录退款（演示）',
                body: '<div class="field"><label>退款金额</label><input inputmode="numeric" placeholder="例如：120"></div>' +
                  '<div class="field"><label>关联支出</label><select><option>门票退款</option><option>酒店取消退款</option></select></div>' +
                  '<div class="note warn">退款单独记录，原支出保留，分摊差额会重新计算。</div>',
                actions: [{ label: '保存（演示）', kind: 'primary', onClick: function () { App.toast('已记录退款并更新差额（演示）'); } }]
              });
              return;
            }
            if (act === 'settle') {
              App.modal({
                title: '登记已结清',
                body: '<p>仅记录你们之间已经处理好的金额，本产品不执行转账。</p>' +
                  '<div class="field"><label>说明</label><input value="我 → 爱人 300 元"></div>',
                actions: [{ label: '保存（演示）', kind: 'primary', onClick: function () { App.toast('已登记结清记录（演示）'); } }]
              });
            }
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'members'],
    view: function (params) {
      var trip = App.trip(params.id);
      var members = D.members[trip.id] || [];
      var labels = D.roleLabels;

      var memberHtml = members.map(function (m) {
        var roleBadge = App.badge(m.role === 'owner' ? 'ok' : 'demo', labels[m.role]);
        var side = m.role === 'owner'
          ? '<span class="badge">负责人</span>'
          : '<button class="btn small" data-act="perm" data-name="' + App.esc(m.name) + '">调整权限</button>';
        return '<div class="item"><div class="body"><div class="title">' + App.esc(m.name) + ' ' + roleBadge + '</div>' +
          '<div class="sub">' + App.esc(m.note) + '</div>' +
          '<div class="sub">订单附件：' + (m.shareDocs ? '可查看' : '不可查看') + ' ｜ 联系方式：' + (m.shareContact ? '可查看' : '不可查看') + '</div>' +
          '</div><div class="side">' + side + '</div></div>';
      }).join('');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '同行者与权限',
        sub: '负责人决定最终方案；附件与联系方式单独控制权限，访问可以撤销。',
        actions: '<button class="btn primary" data-act="invite">邀请同行者</button>'
      }) +
        App.readonlyNote() +
        '<div class="list">' + memberHtml + '</div>' +
        '<div class="card"><div class="card-head"><h3>协作规则</h3></div><ul class="small">' +
        '<li>成员修改形成草稿，由负责人发布为正式行程。</li>' +
        '<li>同时修改冲突时保留双方内容，由负责人选择。</li>' +
        '<li>默认仅受邀成员可访问；分享可随时撤销。</li>' +
        '<li>已导出的文件无法保证收回，删除时会单独说明。</li></ul></div>' +
        '<div class="card"><div class="card-head"><h3>共享与撤销</h3></div>' +
        '<p class="small muted">撤销访问后，对方将无法继续查看云端内容；此前的离线副本与已导出文件需要单独处理。</p>' +
        '<button class="btn small" data-act="revoke">演示：撤销某位只读成员</button></div>';

      return {
        title: '同行者与权限',
        html: html,
        mount: function (root) {
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            if (act === 'invite') {
              App.modal({
                title: '邀请同行者（演示）',
                body: '<div class="field"><label>邀请方式</label><select><option>发送邀请链接</option><option>按账号邀请</option></select></div>' +
                  '<div class="field"><label>角色</label><select><option>可编辑成员</option><option>只读成员</option></select></div>' +
                  '<p class="small muted">演示原型不会真实发送邀请。</p>',
                actions: [{ label: '发送（演示）', kind: 'primary', onClick: function () { App.toast('已生成邀请（演示，不会真实发送）'); } }]
              });
              return;
            }
            if (act === 'perm') {
              App.modal({
                title: '调整权限：' + ev.target.getAttribute('data-name'),
                body: '<div class="field"><label>行程权限</label><select><option>只读成员</option><option>可编辑成员</option></select></div>' +
                  '<div class="field"><label>订单附件</label><select><option>不可查看</option><option>可查看</option></select></div>' +
                  '<div class="field"><label>联系方式</label><select><option>不可查看</option><option>可查看</option></select></div>',
                actions: [{ label: '保存（演示）', kind: 'primary', onClick: function () { App.toast('已更新权限（演示）'); } }]
              });
              return;
            }
            if (act === 'revoke') App.toast('已撤销该成员的访问（演示）');
          });
        }
      };
    }
  });

  App.ROUTES.push({
    path: ['trip', ':id', 'prepare'],
    view: function (params) {
      var trip = App.trip(params.id);
      var items = D.checklist[trip.id] || [];
      var groups = [];
      items.forEach(function (it) {
        if (groups.indexOf(it.group) < 0) groups.push(it.group);
      });

      var groupHtml = groups.map(function (g) {
        var inGroup = items.filter(function (i) { return i.group === g; });
        return '<div class="card"><div class="card-head"><h3>' + App.esc(g) + '</h3><span class="meta">' + inGroup.length + ' 项</span></div>' +
          inGroup.map(function (i) {
            return '<label class="check"><input type="checkbox" data-id="' + i.id + '"' + (i.done ? ' checked' : '') + '>' +
              '<span><strong>' + App.esc(i.title) + '</strong><div class="small muted">负责人：' + App.esc(i.owner) + '</div></span></label>';
          }).join('') + '</div>';
      }).join('');

      var em = D.emergency[trip.id];
      var contactHtml = em.contacts.map(function (c) {
        return '<dt>' + App.esc(c.label) + '</dt><dd>' + App.esc(c.value) + ' <span class="small muted">（' + App.esc(c.note) + '）</span></dd>';
      }).join('');
      var nearbyHtml = em.nearby.map(function (n) {
        return '<div class="item"><div class="body"><div class="title">' + App.esc(n.label) + ' ' + App.badge(n.status, n.statusText) + '</div>' +
          '<div class="sub">' + App.esc(n.distance) + '</div></div></div>';
      }).join('');

      var html = App.pageHead({
        eyebrow: trip.title,
        title: '出行准备',
        sub: '模板、自定义、成员分配与勾选；紧急联系人和住宿地址在途中也能查看。',
        actions: '<button class="btn" data-act="template">套用模板</button><button class="btn" data-act="add">添加任务</button>'
      }) +
        App.readonlyNote() + groupHtml +
        '<div class="card"><div class="card-head"><h3>应急信息</h3><span class="meta">带来源，开放情况需核实</span></div>' +
        '<dl class="kv"><dt>住宿</dt><dd>' + App.esc(em.address) + '</dd>' + contactHtml + '</dl>' +
        '<div class="list mt12">' + nearbyHtml + '</div></div>' +
        '<div class="note info">紧急信息为演示数据，不代表真实地址或医院信息。</div>';

      return {
        title: '出行准备',
        html: html,
        mount: function (root) {
          root.addEventListener('change', function (ev) {
            if (ev.target.type !== 'checkbox') return;
            if (!App.canEdit()) { ev.target.checked = !ev.target.checked; App.denyEdit(); return; }
            var id = ev.target.getAttribute('data-id');
            items.forEach(function (i) { if (i.id === id) i.done = ev.target.checked; });
            App.toast(ev.target.checked ? '已完成（演示）' : '已取消勾选（演示）');
          });
          root.addEventListener('click', function (ev) {
            var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
            if (!act) return;
            if (!App.canEdit()) { App.denyEdit(); return; }
            App.toast(act === 'template' ? '已套用模板：证件 / 健康 / 行李（演示）' : '演示：这里会添加自定义任务');
          });
        }
      };
    }
  });
})();