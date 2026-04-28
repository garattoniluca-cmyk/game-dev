class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;

    this.px = LEVEL.playerStart.x;
    this.py = LEVEL.playerStart.y;
    this.pa = LEVEL.playerStart.angle;
    this.fov = Math.PI / 3;
    this.speed = 0.06;
    this.rotSpeed = 0.04;

    this.ctrl = {f:false,b:false,l:false,r:false,sl:false,sr:false};
    this.setupControls();
    requestAnimationFrame(() => this.loop());
  }

  setupControls() {
    window.addEventListener('keydown', e => {
      if(e.key==='ArrowUp'||e.key==='w') this.ctrl.f=true;
      if(e.key==='ArrowDown'||e.key==='s') this.ctrl.b=true;
      if(e.key==='ArrowLeft'||e.key==='a') this.ctrl.l=true;
      if(e.key==='ArrowRight'||e.key==='d') this.ctrl.r=true;
    });
    window.addEventListener('keyup', e => {
      if(e.key==='ArrowUp'||e.key==='w') this.ctrl.f=false;
      if(e.key==='ArrowDown'||e.key==='s') this.ctrl.b=false;
      if(e.key==='ArrowLeft'||e.key==='a') this.ctrl.l=false;
      if(e.key==='ArrowRight'||e.key==='d') this.ctrl.r=false;
    });

    const btn = (id, k) => {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('touchstart', e => { e.preventDefault(); this.ctrl[k]=true; }, {passive:false});
      el.addEventListener('touchend', e => { e.preventDefault(); this.ctrl[k]=false; }, {passive:false});
      el.addEventListener('mousedown', () => this.ctrl[k]=true);
      el.addEventListener('mouseup', () => this.ctrl[k]=false);
    };
    btn('btnUp','f');
    btn('btnDown','b');
    btn('btnLeft','l');
    btn('btnRight','r');
    btn('btnStrafeL','sl');
    btn('btnStrafeR','sr');
  }

  tile(x, y) {
    const tx=Math.floor(x), ty=Math.floor(y);
    if(tx<0||ty<0||tx>=LEVEL.width||ty>=LEVEL.height) return 1;
    return LEVEL.map[ty*LEVEL.width+tx];
  }

  cast(angle) {
    let d=0;
    while(d<20) {
      d+=0.02;
      const t=this.tile(this.px+Math.cos(angle)*d, this.py+Math.sin(angle)*d);
      if(t>0) return {d, t};
    }
    return {d:20, t:0};
  }

  update() {
    if(this.ctrl.l) this.pa -= this.rotSpeed;
    if(this.ctrl.r) this.pa += this.rotSpeed;
    let dx=0, dy=0;
    if(this.ctrl.f) { dx+=Math.cos(this.pa)*this.speed; dy+=Math.sin(this.pa)*this.speed; }
    if(this.ctrl.b) { dx-=Math.cos(this.pa)*this.speed; dy-=Math.sin(this.pa)*this.speed; }
    if(this.ctrl.sl) { dx+=Math.cos(this.pa-Math.PI/2)*this.speed; dy+=Math.sin(this.pa-Math.PI/2)*this.speed; }
    if(this.ctrl.sr) { dx+=Math.cos(this.pa+Math.PI/2)*this.speed; dy+=Math.sin(this.pa+Math.PI/2)*this.speed; }
    if(this.tile(this.px+dx, this.py)===0) this.px+=dx;
    if(this.tile(this.px, this.py+dy)===0) this.py+=dy;
  }

  render() {
    const ctx=this.ctx, W=this.W, H=this.H;
    ctx.fillStyle='#111133'; ctx.fillRect(0,0,W,H/2);
    ctx.fillStyle='#332211'; ctx.fillRect(0,H/2,W,H/2);

    const nR=W, hFov=this.fov/2;
    for(let i=0;i<nR;i++) {
      const angle=this.pa-hFov+(i/nR)*this.fov;
      const {d,t}=this.cast(angle);
      const cd=d*Math.cos(angle-this.pa);
      const wh=Math.min(H,(H/cd)*0.9);
      const wt=(H-wh)/2;
      const br=Math.max(0.15,1-d/20);
      const col=LEVEL.wallColors[t]||[200,200,200];
      ctx.fillStyle=`rgb(${Math.floor(col[0]*br)},${Math.floor(col[1]*br)},${Math.floor(col[2]*br)})`;
      ctx.fillRect(i,wt,1,wh);
    }

    ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(W/2-12,H/2); ctx.lineTo(W/2+12,H/2);
    ctx.moveTo(W/2,H/2-12); ctx.lineTo(W/2,H/2+12);
    ctx.stroke();

    const ms=120, ts=ms/LEVEL.width, mx=10, my=10;
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(mx,my,ms,ms);
    for(let y=0;y<LEVEL.height;y++) {
      for(let x=0;x<LEVEL.width;x++) {
        const t=LEVEL.map[y*LEVEL.width+x];
        if(t>0) {
          const col=LEVEL.wallColors[t]||[200,200,200];
          ctx.fillStyle=`rgb(${col[0]},${col[1]},${col[2]})`;
          ctx.fillRect(mx+x*ts,my+y*ts,ts,ts);
        }
      }
    }
    ctx.fillStyle='#fff';
    ctx.beginPath();
    ctx.arc(mx+this.px*ts,my+this.py*ts,3,0,Math.PI*2);
    ctx.fill();
  }

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}

window.addEventListener('DOMContentLoaded', () => new Game());
