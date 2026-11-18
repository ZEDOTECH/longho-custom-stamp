/* 印章共用程式：前台設計器（index.html）與示範後台（admin.html）共用。
   印面座標系 380 × 140（10 單位 = 1 mm，代表 38 × 14 mm）。 */
(function(global){
  'use strict';
  var W = 380, H = 140;
  var PAPER = '#ffffff';
  var MONO_INK = '#000000';

  var SHELLS = {
    pink:   {name:'粉紅',   base:'#f4a9be', dark:'#d97b98', light:'#fde4eb'},
    blue:   {name:'天空藍', base:'#8cc6ee', dark:'#5a9fd2', light:'#e1f1fc'},
    yellow: {name:'檸檬黃', base:'#f7d465', dark:'#ddb033', light:'#fdf3cc'}
  };
  var INKS = {
    black: {name:'黑色', color:'#1c1c1e'},
    red:   {name:'紅色', color:'#c8102e'},
    blue:  {name:'藍色', color:'#1d4ea3'}
  };
  var FONTS = {
    sans:  {name:'黑體', family:"'Noto Sans TC','Microsoft JhengHei','PingFang TC',sans-serif", css:'700 40px "Noto Sans TC"'},
    serif: {name:'明體', family:"'Noto Serif TC','PMingLiU','Songti TC',serif", css:'700 40px "Noto Serif TC"'},
    kai:   {name:'楷體', family:"'LXGW WenKai TC','DFKai-SB','BiauKai','Kaiti TC',serif", css:'700 40px "LXGW WenKai TC"'}
  };

  function starPts(cx, cy, R, r){
    var p = [];
    for (var i = 0; i < 10; i++){
      var a = -Math.PI/2 + i*Math.PI/5, rr = i % 2 ? r : R;
      p.push((cx + rr*Math.cos(a)).toFixed(1) + ',' + (cy + rr*Math.sin(a)).toFixed(1));
    }
    return p.join(' ');
  }

  /* ---------- 邊框（原創線條圖） ---------- */
  var BORDERS = [
    {id:'train', name:'小火車', safe:{x:142,y:14,w:224,h:92}, svg:function(){
      var s = '<line x1="10" y1="118" x2="370" y2="118"/>';
      for (var x = 20; x <= 362; x += 24) s += '<line x1="'+x+'" y1="118" x2="'+x+'" y2="128" stroke-width="4"/>';
      s += '<path d="M10 40h42" stroke-width="6"/>'+
           '<rect x="16" y="40" width="30" height="58" rx="5"/>'+
           '<rect x="22" y="48" width="18" height="15" rx="3" stroke-width="4"/>'+
           '<rect x="46" y="62" width="40" height="36" rx="8"/>'+
           '<path d="M64 62V48h12v14"/>'+
           '<circle cx="86" cy="34" r="5" stroke-width="4"/><circle cx="100" cy="22" r="7" stroke-width="4"/>'+
           '<circle cx="30" cy="104" r="9" fill="'+PAPER+'"/><circle cx="54" cy="104" r="9" fill="'+PAPER+'"/><circle cx="76" cy="104" r="9" fill="'+PAPER+'"/>'+
           '<line x1="86" y1="90" x2="96" y2="90"/>'+
           '<rect x="96" y="68" width="34" height="30" rx="5"/>'+
           '<circle cx="105" cy="105" r="7" fill="'+PAPER+'"/><circle cx="122" cy="105" r="7" fill="'+PAPER+'"/>';
      return s;
    }},
    {id:'rounded', name:'圓角框', safe:{x:30,y:22,w:320,h:96}, svg:function(){
      return '<rect x="9" y="9" width="362" height="122" rx="24" stroke-width="6"/>';
    }},
    {id:'double', name:'雙線框', safe:{x:36,y:30,w:308,h:80}, svg:function(){
      return '<rect x="7" y="7" width="366" height="126" rx="12" stroke-width="5"/>'+
             '<rect x="19" y="19" width="342" height="102" rx="5" stroke-width="3"/>';
    }},
    {id:'stars', name:'星星虛線', safe:{x:36,y:26,w:308,h:88}, svg:function(){
      var s = '<rect x="16" y="16" width="348" height="108" rx="18" stroke-dasharray="15 11"/>';
      [[16,16],[364,16],[16,124],[364,124]].forEach(function(c){
        s += '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="15" fill="'+PAPER+'" stroke="none"/>'+
             '<polygon points="'+starPts(c[0],c[1],14,6)+'" fill="currentColor" stroke="none"/>';
      });
      return s;
    }},
    {id:'wave', name:'波浪底線', safe:{x:24,y:12,w:332,h:92}, svg:function(){
      var d = 'M22 118q12 -14 24 0';
      for (var i = 0; i < 13; i++) d += 't24 0';
      return '<path d="'+d+'" stroke-width="6"/>'+
             '<circle cx="22" cy="118" r="5" fill="currentColor" stroke="none"/><circle cx="358" cy="118" r="5" fill="currentColor" stroke="none"/>';
    }},
    {id:'robot', name:'機器人', safe:{x:108,y:26,w:246,h:88}, svg:function(){
      return '<rect x="94" y="12" width="274" height="116" rx="14"/>'+
             '<line x1="46" y1="34" x2="46" y2="22"/><circle cx="46" cy="16" r="6" fill="currentColor" stroke="none"/>'+
             '<rect x="16" y="34" width="60" height="56" rx="12"/>'+
             '<circle cx="34" cy="57" r="6" fill="currentColor" stroke="none"/><circle cx="58" cy="57" r="6" fill="currentColor" stroke="none"/>'+
             '<rect x="32" y="71" width="28" height="10" rx="3" stroke-width="4"/>'+
             '<path d="M41 71v10M51 71v10" stroke-width="3"/>'+
             '<path d="M16 53h-6v18h6M76 53h6v18h-6" stroke-width="4"/>'+
             '<path d="M38 90v8M54 90v8" stroke-width="4"/>'+
             '<rect x="26" y="98" width="40" height="26" rx="6"/>'+
             '<circle cx="40" cy="111" r="3.5" fill="currentColor" stroke="none"/><circle cx="52" cy="111" r="3.5" fill="currentColor" stroke="none"/>'+
             '<path d="M66 108h28"/>';
    }},
    {id:'cat', name:'小貓', safe:{x:104,y:14,w:258,h:88}, svg:function(){
      return '<path d="M20 62L22 28L42 46Q51 42 60 46L80 28L82 62Q85 96 51 98Q17 96 20 62Z"/>'+
             '<ellipse cx="40" cy="66" rx="4.5" ry="6.5" fill="currentColor" stroke="none"/>'+
             '<ellipse cx="62" cy="66" rx="4.5" ry="6.5" fill="currentColor" stroke="none"/>'+
             '<path d="M47 76h8l-4 5z" fill="currentColor" stroke-width="2"/>'+
             '<path d="M51 81q-4 6 -9 3M51 81q4 6 9 3" stroke-width="3"/>'+
             '<path d="M8 72l16 2M8 84l16 -3M94 72l-16 2M94 84l-16 -3" stroke-width="3"/>'+
             '<path d="M40 98Q48 116 70 116H352" stroke-width="6"/>'+
             '<path d="M352 116q14 0 14 -14q0 -10 8 -12" stroke-width="5"/>';
    }},
    {id:'rocket', name:'火箭', safe:{x:22,y:12,w:262,h:80}, svg:function(){
      return '<path d="M14 116C90 134 170 122 228 98S280 78 288 72" stroke-dasharray="1 13" stroke-width="7"/>'+
             '<path d="M298 58h36q26 0 36 12q-10 12 -36 12h-36z"/>'+
             '<circle cx="338" cy="70" r="6" stroke-width="4"/>'+
             '<path d="M306 58l-12 -16h16l12 16M306 82l-12 16h16l12 -16" stroke-width="4"/>'+
             '<path d="M298 62l-14 8l14 8" stroke-width="4"/>'+
             '<polygon points="'+starPts(314,22,10,4)+'" fill="currentColor" stroke="none"/>'+
             '<polygon points="'+starPts(254,128,7,3)+'" fill="currentColor" stroke="none"/>';
    }},
    {id:'cloud', name:'雲朵', safe:{x:72,y:46,w:236,h:72}, svg:function(){
      var shapes = '<rect x="34" y="62" width="312" height="62" rx="31"/>'+
                   '<circle cx="92" cy="68" r="30"/><circle cx="158" cy="52" r="36"/>'+
                   '<circle cx="228" cy="54" r="34"/><circle cx="294" cy="70" r="30"/>';
      return '<g fill="currentColor" stroke="currentColor" stroke-width="12">'+shapes+'</g>'+
             '<g fill="'+PAPER+'" stroke="none">'+shapes+'</g>';
    }},
    {id:'none', name:'無邊框', safe:{x:20,y:14,w:340,h:112}, svg:function(){ return ''; }}
  ];

  /* ---------- 小圖案（以 0,0 為中心，約 40×40） ---------- */
  var ICONS = [
    {id:'star',   name:'星星', svg:'<polygon points="'+starPts(0,1,20,8.5)+'"/>'},
    {id:'heart',  name:'愛心', svg:'<path d="M0 17C-24 2 -21 -17 -9.5 -17C-4.5 -17 -1 -13.5 0 -9C1 -13.5 4.5 -17 9.5 -17C21 -17 24 2 0 17Z"/>'},
    {id:'sun',    name:'太陽', svg:'<circle r="8.5"/><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">'+
        (function(){ var s=''; for (var i=0;i<8;i++){ var a=i*Math.PI/4, c=Math.cos(a), n=Math.sin(a);
          s += '<line x1="'+(c*13).toFixed(1)+'" y1="'+(n*13).toFixed(1)+'" x2="'+(c*19).toFixed(1)+'" y2="'+(n*19).toFixed(1)+'"/>'; } return s; })()+'</g>'},
    {id:'flower', name:'小花', svg:(function(){ var s=''; for (var i=0;i<5;i++){ var a=-Math.PI/2+i*2*Math.PI/5;
          s += '<circle cx="'+(Math.cos(a)*10.5).toFixed(1)+'" cy="'+(Math.sin(a)*10.5).toFixed(1)+'" r="8"/>'; }
          return s + '<circle r="5" fill="'+PAPER+'"/><circle r="2.2"/>'; })()},
    {id:'note',   name:'音符', svg:'<ellipse cx="-9" cy="12" rx="6.5" ry="5" transform="rotate(-20 -9 12)"/><ellipse cx="11" cy="8" rx="6.5" ry="5" transform="rotate(-20 11 8)"/>'+
        '<path d="M-3 11V-12L17 -17V7" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><path d="M-3 -12L17 -17V-10L-3 -5Z"/>'},
    {id:'crown',  name:'皇冠', svg:'<path d="M-19 10L-21 -12L-9 -1L0 -17L9 -1L21 -12L19 10Z"/><rect x="-19" y="13" width="38" height="5.5" rx="2"/>'},
    {id:'bolt',   name:'閃電', svg:'<path d="M5 -20L-13 4H-1L-6 20L13 -5H1Z"/>'},
    {id:'smile',  name:'笑臉', svg:'<circle r="17" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="-6.5" cy="-5" r="3"/><circle cx="6.5" cy="-5" r="3"/>'+
        '<path d="M-9 4Q0 13 9 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'},
    {id:'paw',    name:'腳印', svg:'<ellipse cx="0" cy="8" rx="11" ry="9.5"/><ellipse cx="-13" cy="-6" rx="4.5" ry="6"/><ellipse cx="-5" cy="-15" rx="4.5" ry="6"/>'+
        '<ellipse cx="5" cy="-15" rx="4.5" ry="6"/><ellipse cx="13" cy="-6" rx="4.5" ry="6"/>'},
    {id:'moon',   name:'月亮', svg:'<path d="M6 -18A18 18 0 1 0 18 8A14 14 0 1 1 6 -18Z"/>'},
    {id:'fish',   name:'小魚', svg:'<path d="M-10 0C-2 -12 12 -12 18 0C12 12 -2 12 -10 0Z"/><path d="M-10 0L-20 -9V9Z"/><circle cx="9" cy="-2" r="2.4" fill="'+PAPER+'"/>'},
    {id:'leaf',   name:'葉子', svg:'<path d="M-16 16C-18 -6 0 -18 18 -18C18 2 6 18 -16 16Z"/><path d="M-12 12L8 -8" fill="none" stroke="'+PAPER+'" stroke-width="2.6" stroke-linecap="round"/>'}
  ];

  function byId(list, id){ for (var i=0;i<list.length;i++) if (list[i].id === id) return list[i]; return list[0]; }
  function hasId(list, id){ for (var i=0;i<list.length;i++) if (list[i].id === id) return true; return false; }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function f1(n){ return Math.round(n*10)/10; }

  /* ---------- 印面標記 ---------- */
  function itemMarkup(it, ink, interactive){
    var attrs = interactive ? ' class="item" data-role="item" data-id="'+it.id+'"' : '';
    if (it.type === 'text'){
      return '<text'+attrs+' x="'+f1(it.x)+'" y="'+f1(it.y)+'" font-size="'+f1(it.size)+'" text-anchor="middle" dominant-baseline="central" fill="'+ink+
             '" font-weight="700" style="font-family:'+FONTS[it.font].family+'">'+esc(it.text)+'</text>';
    }
    var icon = byId(ICONS, it.icon), k = it.size/40;
    return '<g'+attrs+' transform="translate('+f1(it.x)+' '+f1(it.y)+') scale('+k.toFixed(3)+')" color="'+ink+'" fill="currentColor" stroke="none">'+
           (interactive ? '<circle class="hit" r="22"/>' : '') + icon.svg + '</g>';
  }
  function borderMarkup(borderId, ink){
    return '<g color="'+ink+'" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none">'+byId(BORDERS, borderId).svg()+'</g>';
  }
  /* design: {ink, border, items}；interactive 為 true 時加上可拖曳用的屬性 */
  function stampMarkup(design, interactive){
    var ink = INKS[design.ink].color;
    var s = '<rect x="0" y="0" width="'+W+'" height="'+H+'" rx="6" fill="'+PAPER+'" stroke="#cdd5d3" stroke-width="1.5"/>';
    s += borderMarkup(design.border, ink);
    design.items.forEach(function(it){ s += itemMarkup(it, ink, interactive); });
    return s;
  }
  /* 製作用黑白向量檔（完整 SVG 文件） */
  function monoSvgDocument(design){
    var s = '<?xml version="1.0" encoding="UTF-8"?>\n'+
      '<svg xmlns="http://www.w3.org/2000/svg" width="38mm" height="14mm" viewBox="0 0 '+W+' '+H+'">\n'+
      '<rect x="0" y="0" width="'+W+'" height="'+H+'" fill="'+PAPER+'"/>\n'+
      borderMarkup(design.border, MONO_INK)+'\n';
    design.items.forEach(function(it){
      if (it.type === 'text'){
        s += '<text x="'+f1(it.x)+'" y="'+f1(it.y)+'" font-size="'+f1(it.size)+'" text-anchor="middle" dominant-baseline="central" fill="'+MONO_INK+
             '" font-weight="700" font-family="'+esc(FONTS[it.font].family)+'">'+esc(it.text)+'</text>\n';
      } else {
        s += itemMarkup(it, MONO_INK, false)+'\n';
      }
    });
    return s + '</svg>\n';
  }
  /* 只含單一層（邊框或單一圖案）的黑白 SVG，供 canvas 繪製用（不含文字） */
  function monoLayerSvg(layerMarkup, pxW, pxH){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+pxW+'" height="'+pxH+'" viewBox="0 0 '+W+' '+H+'">'+layerMarkup+'</svg>';
  }

  /* ---------- 訂單儲存 ---------- */
  var ORDERS_KEY = 'customstamp.orders.v1';
  var SAMPLE_STATUS_KEY = 'customstamp.sample-status.v1';
  var STATUSES = ['待製作', '製作中', '已出貨'];
  var mem = {}, writeFailed = {};

  function readJSON(key){
    if (!writeFailed[key]){
      try {
        var raw = global.localStorage.getItem(key);
        if (raw !== null) return JSON.parse(raw);
        return mem.hasOwnProperty(key) ? mem[key] : null;
      } catch(e){}
    }
    return mem.hasOwnProperty(key) ? mem[key] : null;
  }
  function writeJSON(key, value){
    mem[key] = JSON.parse(JSON.stringify(value));
    try { global.localStorage.setItem(key, JSON.stringify(value)); writeFailed[key] = false; }
    catch(e){ writeFailed[key] = true; }
  }
  function removeKey(key){
    delete mem[key]; writeFailed[key] = false;
    try { global.localStorage.removeItem(key); } catch(e){}
  }

  function num(v){ return typeof v === 'number' && isFinite(v); }
  function cleanItems(items){
    if (!Array.isArray(items)) return null;
    var out = [];
    items.forEach(function(it, i){
      if (!it || typeof it !== 'object' || !num(it.x) || !num(it.y) || !num(it.size)) return;
      var id = num(it.id) ? it.id : i + 1;
      if (it.type === 'text' && typeof it.text === 'string' && FONTS.hasOwnProperty(it.font)){
        out.push({id:id, type:'text', text:it.text, font:it.font, x:it.x, y:it.y, size:it.size});
      } else if (it.type === 'icon' && hasId(ICONS, it.icon)){
        out.push({id:id, type:'icon', icon:it.icon, x:it.x, y:it.y, size:it.size});
      }
    });
    return out;
  }
  function normalizeOrder(o){
    if (!o || typeof o !== 'object') return null;
    if (typeof o.id !== 'string' || !/^CS-\d{8}-\d{3,}$/.test(o.id)) return null;
    if (typeof o.createdAt !== 'string' || isNaN(new Date(o.createdAt).getTime())) return null;
    if (!SHELLS.hasOwnProperty(o.shell) || !INKS.hasOwnProperty(o.ink) || !hasId(BORDERS, o.border)) return null;
    var items = cleanItems(o.items);
    if (!items) return null;
    return {id:o.id, createdAt:o.createdAt, shell:o.shell, ink:o.ink, border:o.border, items:items,
            status: STATUSES.indexOf(o.status) >= 0 ? o.status : STATUSES[0], sample:false};
  }
  function loadOrders(){
    var raw = readJSON(ORDERS_KEY), out = [];
    if (!Array.isArray(raw)) return out;
    raw.forEach(function(o){ var n = normalizeOrder(o); if (n) out.push(n); });
    return out;
  }
  function saveOrders(list){ writeJSON(ORDERS_KEY, list); }
  function loadSampleStatus(){
    var raw = readJSON(SAMPLE_STATUS_KEY), out = {};
    if (raw && typeof raw === 'object' && !Array.isArray(raw)){
      Object.keys(raw).forEach(function(k){ if (STATUSES.indexOf(raw[k]) >= 0) out[k] = raw[k]; });
    }
    return out;
  }

  function pad(n, w){ n = String(n); while (n.length < (w || 2)) n = '0' + n; return n; }
  function dateKey(d){ return d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()); }
  function formatTime(iso){
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear()+'/'+pad(d.getMonth()+1)+'/'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes());
  }
  function usedSerials(orders, dk){
    var used = {}, prefix = 'CS-' + dk + '-';
    orders.forEach(function(o){ if (o.id.indexOf(prefix) === 0) used[parseInt(o.id.slice(prefix.length), 10)] = true; });
    return used;
  }

  /* ---------- 內建範例訂單（時間相對於「現在」） ---------- */
  var SAMPLE_DEFS = [
    {key:'s1', ago:3*3600e3, shell:'pink', ink:'red', border:'stars', status:'待製作', items:[
      {id:1, type:'text', text:'林小安', font:'kai', x:180, y:72, size:62},
      {id:2, type:'icon', icon:'heart', x:316, y:48, size:30}]},
    {key:'s2', ago:26*3600e3, shell:'blue', ink:'blue', border:'robot', status:'製作中', items:[
      {id:1, type:'text', text:'陳宥翔', font:'sans', x:231, y:70, size:62}]},
    {key:'s3', ago:(3*24+5)*3600e3, shell:'yellow', ink:'black', border:'double', status:'已出貨', items:[
      {id:1, type:'text', text:'張語彤', font:'serif', x:190, y:60, size:48},
      {id:2, type:'text', text:'二年三班', font:'sans', x:190, y:97, size:20}]},
    {key:'s4', ago:(5*24+2)*3600e3, shell:'blue', ink:'red', border:'cloud', status:'已出貨', items:[
      {id:1, type:'text', text:'黃予樂', font:'kai', x:190, y:90, size:46},
      {id:2, type:'icon', icon:'star', x:120, y:60, size:24},
      {id:3, type:'icon', icon:'moon', x:262, y:60, size:24}]}
  ];
  function sampleOrders(now, stored){
    var status = loadSampleStatus(), taken = {};
    return SAMPLE_DEFS.map(function(def){
      var d = new Date(now.getTime() - def.ago), dk = dateKey(d);
      if (!taken[dk]) taken[dk] = usedSerials(stored, dk);
      var n = 1; while (taken[dk][n]) n++;
      taken[dk][n] = true;
      return {id:'CS-'+dk+'-'+pad(n,3), createdAt:d.toISOString(), shell:def.shell, ink:def.ink, border:def.border,
              items:JSON.parse(JSON.stringify(def.items)), status: status[def.key] || def.status, sample:true, sampleKey:def.key};
    });
  }

  /* 全部訂單（使用者送出的 + 範例），新的在前 */
  function allOrders(now){
    now = now || new Date();
    var stored = loadOrders();
    return stored.concat(sampleOrders(now, stored)).sort(function(a, b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
  function nextOrderId(now, orders){
    var dk = dateKey(now), used = usedSerials(orders, dk), n = 0;
    Object.keys(used).forEach(function(k){ if (+k > n) n = +k; });
    return 'CS-' + dk + '-' + pad(n + 1, 3);
  }
  /* 前台送出時呼叫：存成一筆新訂單並回傳 */
  function createOrder(design, now){
    now = now || new Date();
    var stored = loadOrders();
    var order = {
      id: nextOrderId(now, stored.concat(sampleOrders(now, stored))),
      createdAt: now.toISOString(),
      shell: design.shell, ink: design.ink, border: design.border,
      items: cleanItems(JSON.parse(JSON.stringify(design.items))) || [],
      status: STATUSES[0], sample: false
    };
    stored.push(order);
    saveOrders(stored);
    return order;
  }
  function setOrderStatus(order, status){
    if (STATUSES.indexOf(status) < 0) return;
    if (order.sample){
      var st = loadSampleStatus(); st[order.sampleKey] = status; writeJSON(SAMPLE_STATUS_KEY, st);
    } else {
      var stored = loadOrders();
      stored.forEach(function(o){ if (o.id === order.id) o.status = status; });
      saveOrders(stored);
    }
    order.status = status;
  }
  function clearDemoData(){ removeKey(ORDERS_KEY); removeKey(SAMPLE_STATUS_KEY); }

  global.StampCore = {
    W:W, H:H, PAPER:PAPER, MONO_INK:MONO_INK,
    SHELLS:SHELLS, INKS:INKS, FONTS:FONTS, BORDERS:BORDERS, ICONS:ICONS, STATUSES:STATUSES,
    ORDERS_KEY:ORDERS_KEY, SAMPLE_STATUS_KEY:SAMPLE_STATUS_KEY,
    starPts:starPts, byId:byId, esc:esc, f1:f1,
    itemMarkup:itemMarkup, borderMarkup:borderMarkup, stampMarkup:stampMarkup,
    monoSvgDocument:monoSvgDocument, monoLayerSvg:monoLayerSvg,
    loadOrders:loadOrders, allOrders:allOrders, createOrder:createOrder, nextOrderId:nextOrderId,
    setOrderStatus:setOrderStatus, clearDemoData:clearDemoData, formatTime:formatTime
  };
})(window);
