class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;

    this.px = 8;
    this.py = 8;
    this.pa = 0;
    this.fov = Math.PI / 3;
    this.speed = 0.06;
    this.rotSpeed = 0.04;

    this.controls = { forward:false, backward:false, left:false, right:false };
    this.setupControls();
    requestAnimationFrame(() => this.loop());
  }

  setupControls() {
    const map = {
      'ArrowUp':'forward','w':'forward',
      'ArrowDown':'backward','s':'backward',
      'ArrowLeft':'left','a':'left',
      'ArrowRight':'right','d':'right'
    };
    window.addEventListener('keydown', e => { if(map[e.key]) this.controls[map[e.key]]=true; });
    window.addEventListener('keyup', e => { if(map[e.key]) this.controls[map[e.key]]=false; });

    const btn = (id, ctrl) => {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('touchstart', e => { e.preventDefault(); this.controls[ctrl]=true; }, {passive:false});
      el.addEventListener('touchend', e => { e.preventDefault(); this.controls[ctrl]=false; }, {passive:false});
      el.addEventListener('mousedown', () => this.controls[ctrl]=true);
      el.addEventListener('mouseup', () => this.controls[ctrl]=false);
    };
    btn('btnUp','forward');
    btn('btnDown','backward');
    btn('btnLeft','left');
    btn('btnRight','right');
    btn('btnStrafeL','strafeLeft');
    btn('btnStrafeR','strafeRight');
  }

  tile(x, y) {
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if(tx<0||ty<0||tx>=LEVEL.width||ty>=LEVEL.height) return 1;
    return LEVEL.map[ty * LEVEL.width + tx];
  }

  update() {
    if(this.controls.left) this.pa -= this.rotSpeed;
    if(this.controls.right) this.pa += this.rotSpeed;

    let dx=0, dy=0;
    if(this.controls.forward) { dx+=Math.cos(this.pa)*this.speed; dy+=Math.sin(this.pa)*this.speed; }
    if(this.controls.backward) { dx-=Math.cos(this.pa)*this.speed; dy-=Math.sin(this.pa)*this.speed; }

    if(this.tile(this.px+dx, this.py)===0) this.px+=dx;
    if(this.tile(this.px, this.py+dy)===0) this.py+=dy;
  }

  cast(angle) {
    let d=0;
    const step=0.02;
    while(d<20) {
      d+=step;
      const tx=this.px+Math.cos(angle)*d;
      const ty=this.py+Math.sin(angle)*d;
      const t=this.tile(tx,ty);
      if(t>0) return {d, t};
    }
    return {d:20, t:0};
  }

  render() {
    const ctx=this.ctx;
    const W=this.W, H=this.H;

    // Sky
    ctx.fillStyle='#222244';
    ctx.fillRect(0,0,W,H/2);

    // Floor
    ctx.fillStyle='#442211';
    ctx.fillRect(0,H/2,W,H/2);

    // Crosshair
    ctx.strokeStyle='rgba(255,255,255,0.8)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(W/2-12,H/2); ctx.lineTo(W/2+12,H/2);
    ctx.moveTo(W/2,H/2-12); ctx.lineTo(W/2,H/2+12);
    ctx.stroke();

    // Rays
    const nRays=W;
    const halfFov=this.fov/2;
    for(let i=0;i<nRays;i++) {
      const angle=this.pa - halfFov + (i/nRays)*this.fov;
      const {d,t}=this.cast(angle);
      const corr=d*Math.cos(angle-this.pa);
      const wh=Math.min(H,(H/corr)*0.9);
      const wt=(H-wh)/2;
      const bright=Math.max(0.2, 1-d/20);
      const c=LEVEL.wallColors[t]||[200,200,200];
      ctx.fillStyle=`rgb(${Math.floor(c[0]*bright)},${Math.floor(c[1]*bright)},${Math.floor(c[2]*bright)})`;
      ctx.fillRect(i,wt,1,wh);
    }

    // Minimap
    const ms=120;
    const ts=ms/LEVEL.width;
    const mx=10, my=10;
    ctx.fillStyle='rgba(0,0,0,0.7)';
    ctx.fillRect(mx,my,ms,ms);
    for(let y=0;y<LEVEL.height;y++) {
      for(let x=0;x<LEVEL.width;x++) {
        const t=LEVEL.map[y*LEVEL.width+x];
        if(t>0) {
          const c=LEVEL.wallColors[t]||[200,200,200];
          ctx.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;
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
    requestAnimationFrame(()=>this.loop());
  }
}

window.addEventListener('DOMContentLoaded',()=>new Game());
