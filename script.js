(function(){
  /* ================= Details ================= */
  const WEDDING = {
    couple:["Mayur","Krina"],
    start:"2026-12-11T18:00:00+05:30",
    end:"2026-12-11T23:00:00+05:30",
    place:"Surat, Gujarat",
    mapQuery:"Surat, Gujarat",
    whatsapp:"919725956266"
  };
  const EVENTS = [
    {name:"Mehendi",img:"img/mehendi.webp",wash:"img/wash-blush.webp",day:"Monday",date:"14th December",short:"14 Dec",time:"5:00 PM",venue:"Indigo Banquet, Ravaya",dress:"Shades of green",sw:["#93AE98","#C9D8B6"],alt:"Watercolour of the bride and her friends applying mehendi among marigolds and roses"},
    {name:"Haldi",img:"img/haldi.webp",wash:"img/wash-peach.webp",day:"Tuesday",date:"15th December",short:"15 Dec",time:"9:00 AM",venue:"Poolside, Ravaya",dress:"Yellows and florals",sw:["#E9C46A","#F4CDB0"],alt:"Watercolour of the couple at a brass urli with haldi, parasols and marigolds"},
    {name:"Wedding",img:"img/wedding.webp",wash:"img/wash-blush2.webp",day:"Tuesday",date:"15th December",short:"15 Dec",time:"6:00 PM",venue:"The Lawn, Ravaya",dress:"Traditional, pastels welcome",sw:["#EDB8C0","#FBF8F4"],alt:"Watercolour of the couple before a red floral mandap with brass lamps"},
    {name:"Reception",img:"img/reception.webp",wash:"img/wash-lavender.webp",day:"Thursday",date:"17th December",short:"17 Dec",time:"7:00 PM",venue:"Turquoise Banquet, Ravaya",dress:"Black tie, Indian formal",sw:["#3D3957","#B08A45"],alt:"Watercolour of the couple dancing under chandeliers framed by wisteria and pearls"}
  ];
  const STORY = [
    {img:"img/story1.webp",cap:"We found our home",when:"San Jose · 2019",pos:"50% 62%"},
    {img:"img/story2.webp",cap:"Walking towards forever",when:"Los Angeles · 2021",pos:"50% 45%"},
    {img:"img/story3.webp",cap:"She said yes",when:"Dubai · 2025",pos:"50% 60%"},
    {img:"img/story4.webp",cap:"From adventures to forever",when:"Goa · 2026",pos:"50% 50%"}
  ];

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  /* ================= Dynamic Guest Invitation ================= */
  let guestInfo = null;
  try {
    const params = new URLSearchParams(window.location.search);
    const rawTo = (params.get("to") || params.get("name") || params.get("guest") || "").trim();
    const rawGuests = (params.get("guests") || params.get("members") || params.get("count") || params.get("seats") || "").trim();
    const famParam = (params.get("family") || params.get("type") || "").trim().toLowerCase();

    // Any number given in 'guests', 'members', 'count', 'seats', OR 'family' (e.g. ?family=1 or ?guests=1)
    // is considered as member count (1 = 1 member, 2 = 2 members), NOT full family!
    let numGuests = null;
    if (rawGuests && !isNaN(parseInt(rawGuests, 10))) {
      numGuests = Math.max(1, parseInt(rawGuests, 10));
    } else if (famParam && !isNaN(parseInt(famParam, 10))) {
      numGuests = Math.max(1, parseInt(famParam, 10));
    }

    // Full family is ONLY when words like 'all', 'full', 'family', 'yes', 'true' are used without a number
    const isFamily = numGuests === null && (
      famParam === "all" || 
      famParam === "full" || 
      famParam === "family" || 
      famParam === "yes" || 
      famParam === "true" || 
      rawGuests.toLowerCase() === "all" || 
      rawGuests.toLowerCase() === "full" || 
      rawGuests.toLowerCase() === "family"
    );

    if (rawTo || isFamily || numGuests !== null) {
      guestInfo = {
        to: rawTo,
        isFamily: isFamily,
        count: numGuests
      };

      // 1. Envelope Cover Tag
      const envTag = $("#env-guest-tag");
      if (envTag) {
        envTag.hidden = false;
        if (guestInfo.isFamily) {
          const hasFam = /family/i.test(guestInfo.to);
          const toFormatted = guestInfo.to ? (hasFam ? esc(guestInfo.to) + " · " : esc(guestInfo.to) + " &amp; ") : "";
          envTag.innerHTML = `<span>Special Invitation:</span> <b>${toFormatted}Full Family</b>`;
        } else if (guestInfo.count) {
          const label = guestInfo.count === 1 ? "1 Member" : `${guestInfo.count} Members`;
          envTag.innerHTML = `<span>Special Invitation:</span> <b>${guestInfo.to ? esc(guestInfo.to) + " · " : ""}${label}</b>`;
        } else {
          envTag.innerHTML = `<span>Special Invitation:</span> <b>${esc(guestInfo.to)}</b>`;
        }
      }

      // 2. Letter inside Envelope
      const letterGuest = $("#letter-guest");
      if (letterGuest) {
        letterGuest.hidden = false;
        if (guestInfo.isFamily) {
          letterGuest.textContent = "✦ Full Family Invited (સપરિવાર) ✦";
        } else if (guestInfo.count) {
          letterGuest.textContent = `✦ ${guestInfo.count} ${guestInfo.count === 1 ? 'Member' : 'Members'} Invited ✦`;
        } else {
          letterGuest.textContent = `✦ Cordially Invited: ${guestInfo.to} ✦`;
        }
      }

      // 3. Hero Section Guest Card
      const guestCard = $("#guest-card");
      if (guestCard) {
        guestCard.hidden = false;
        const gcBadge = $("#gc-badge");
        const gcName = $("#gc-name");
        const gcMsg = $("#gc-msg");
        const gcNote = $("#gc-note");

        if (guestInfo.isFamily) {
          if (gcBadge) gcBadge.textContent = "✦ Cordially Invited With Family ✦";
          const hasFam = /family/i.test(guestInfo.to);
          const salutation = guestInfo.to 
            ? `Dear ${guestInfo.to}${hasFam ? "" : " & Family"},` 
            : "Dear Family & Loved Ones,";
          if (gcName) gcName.textContent = salutation;
          if (gcMsg) gcMsg.innerHTML = "Our celebration is complete with your blessings. We warmly invite your <b>entire family</b> to join us and celebrate Mayur &amp; Krina's wedding.";
          if (gcNote) gcNote.textContent = "સપરિવાર પધારવા હાર્દિક નિમંત્રણ · Full Family Invited";
        } else if (guestInfo.count) {
          const countText = guestInfo.count === 1 ? "1 member" : `${guestInfo.count} members`;
          if (gcBadge) gcBadge.textContent = `✦ Special Invitation · ${guestInfo.count === 1 ? '1 Member' : guestInfo.count + ' Members'} ✦`;
          if (gcName) gcName.textContent = guestInfo.to ? `Dear ${guestInfo.to},` : "Dear Guests,";
          if (gcMsg) gcMsg.innerHTML = `We request the pleasure of your company and warmly invite <b>${countText} from your family</b> to celebrate our special day with us.`;
          if (gcNote) gcNote.textContent = "Mayur & Krina look forward to celebrating together";
        } else {
          if (gcBadge) gcBadge.textContent = "✦ Special Invitation ✦";
          if (gcName) gcName.textContent = `Dear ${guestInfo.to},`;
          if (gcMsg) gcMsg.innerHTML = "We request the pleasure of your company to celebrate the wedding of Mayur &amp; Krina.";
          if (gcNote) gcNote.textContent = "Mayur & Krina look forward to celebrating together";
        }
      }
    }
  } catch(e) {
    console.error("Guest info parse error:", e);
  }

  /* ================= Wax seal ================= */
  const sealSVG = id => `<svg viewBox="0 0 120 120" aria-hidden="true">
    <defs>
      <radialGradient id="wx${id}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#F6E3A8"/><stop offset=".35" stop-color="#D4AC5C"/><stop offset=".75" stop-color="#A67C2E"/><stop offset="1" stop-color="#7A5A1E"/></radialGradient>
      <radialGradient id="wi${id}" cx="60%" cy="65%" r="70%"><stop offset="0" stop-color="#C39A48"/><stop offset="1" stop-color="#E8CC86"/></radialGradient>
      <filter id="wf${id}" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
    </defs>
    <path d="M60 6 C74 5 80 12 92 14 C104 17 110 28 112 40 C115 52 118 60 114 72 C111 84 108 96 96 104 C86 112 74 116 60 114 C46 117 34 112 24 104 C12 96 6 84 6 70 C4 58 3 46 10 34 C16 22 26 12 40 9 C47 7 52 6 60 6Z" fill="url(#wx${id})" filter="url(#wf${id})"/>
    <circle cx="60" cy="60" r="39" fill="url(#wi${id})"/>
    <circle cx="60" cy="60" r="39" fill="none" stroke="#8E6A28" stroke-width="1.2" opacity=".7"/>
    <circle cx="60" cy="60" r="34" fill="none" stroke="#FFF1C9" stroke-width=".8" stroke-dasharray="1 3" opacity=".8"/>
    <ellipse cx="42" cy="32" rx="15" ry="6" fill="#FFF8E1" opacity=".35" transform="rotate(-30 42 32)"/>
  </svg><span class="seal-mono hi"></span><span class="seal-mono dk"></span>`;
  const sealL = document.querySelector(".seal-half.l");
  const sealR = document.querySelector(".seal-half.r");
  if(sealL) sealL.innerHTML=sealSVG("a");
  if(sealR) sealR.innerHTML=sealSVG("b");

  /* ================= Cover: gold dust ================= */
  const screen=$("#envelope-screen"), env=$("#env");
  document.body.classList.add("locked");
  let dustOn=!reduce;
  (function(){
    if(reduce) return;
    const c=$("#dust"); if(!c) return;
    const x=c.getContext("2d"); let W,H,dpr,P=[];
    function size(){dpr=Math.min(devicePixelRatio||1,2);W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr;}
    size(); addEventListener("resize",size);
    const mk=any=>({x:Math.random()*W,y:any?Math.random()*H:H+10,r:(Math.random()*1.5+.5)*dpr,vy:-(Math.random()*.3+.1)*dpr,vx:(Math.random()-.5)*.15*dpr,t:Math.random()*6,ts:Math.random()*.04+.01});
    for(let i=0;i<(innerWidth<520?45:80);i++) P.push(mk(true));
    (function f(){
      x.clearRect(0,0,W,H);
      if(!dustOn) return;
      P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.t+=p.ts;if(p.y<-10)P[i]=mk(false);
        const a=.3+.6*Math.abs(Math.sin(p.t));
        const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.5);g.addColorStop(0,`rgba(196,152,70,${a})`);g.addColorStop(1,"rgba(196,152,70,0)");
        x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r*3.5,0,7);x.fill();});
      requestAnimationFrame(f);
    })();
  })();
  if(!reduce && matchMedia("(hover:hover)").matches){
    screen.addEventListener("pointermove",e=>{
      if(env.classList.contains("open")) return;
      const rx=(e.clientY/innerHeight-.5)*-6, ry=(e.clientX/innerWidth-.5)*8;
      $(".env-stage").style.transform=`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }
  let opened=false;
  function openEnvelope(){
    if(opened) return; opened=true;
    $(".env-stage").style.transform="";
    env.classList.add("open");
    startMusic();
    setTimeout(()=>{
      screen.classList.add("gone");
      document.body.classList.remove("locked");
      document.querySelectorAll(".hero-inner > *").forEach((el,i)=>{el.style.animationDelay=(i*0.08)+"s";el.classList.add("reveal-in");});
      sizeScratch();
      setTimeout(()=>{dustOn=false;},1200);
    }, reduce ? 50 : 2900);
  }
  env.addEventListener("click", openEnvelope);
  screen.addEventListener("click", openEnvelope);
  const hintEl = $(".tap-hint");
  if(hintEl) hintEl.addEventListener("click", openEnvelope);

  /* ================= Scratch card ================= */
  const sc=$("#scratch"), ctx=sc.getContext("2d");
  let scratched=false, drawing=false, moves=0, last=null;
  function paintCover(){
    const w=sc.width,h=sc.height, dpr=w/sc.clientWidth;
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,"#E9B9C2"); g.addColorStop(.55,"#DDB7C9"); g.addColorStop(1,"#D6B67C");
    ctx.globalCompositeOperation="source-over"; ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    for(let i=0;i<90;i++){ctx.fillStyle=`rgba(255,248,230,${(Math.random()*0.7+0.2).toFixed(2)})`;ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,(Math.random()*1.3+0.3)*dpr,0,7);ctx.fill();}
    ctx.strokeStyle="rgba(255,248,230,.8)"; ctx.lineWidth=1*dpr; ctx.strokeRect(8*dpr,8*dpr,w-16*dpr,h-16*dpr);
    ctx.fillStyle="#FFFFFF"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.font=`600 ${17*dpr}px "Cormorant SC", Georgia, serif`;
    ctx.fillText("✦  SCRATCH TO REVEAL  ✦",w/2,h/2-11*dpr);
    ctx.font=`italic 500 ${19*dpr}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle="#FFF6E6"; ctx.fillText("our special day",w/2,h/2+15*dpr);
  }
  function sizeScratch(){
    if(scratched) return;
    const r=sc.getBoundingClientRect(); if(!r.width) return;
    const dpr=Math.min(devicePixelRatio||1,2);
    sc.width=Math.round(r.width*dpr); sc.height=Math.round(r.height*dpr);
    paintCover();
  }
  function pos(e){const r=sc.getBoundingClientRect();const d=sc.width/r.width;return {x:(e.clientX-r.left)*d,y:(e.clientY-r.top)*d};}
  function scratchAt(p){
    ctx.globalCompositeOperation="destination-out"; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.lineWidth=sc.width*0.11;
    ctx.beginPath(); ctx.moveTo((last||p).x,(last||p).y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p;
    if(++moves%8===0) check();
  }
  function check(){
    const {data}=ctx.getImageData(0,0,sc.width,sc.height); let clear=0,total=0;
    for(let i=3;i<data.length;i+=64){total++; if(data[i]===0) clear++;}
    if(clear/total>0.45) finishScratch();
  }
  function finishScratch(){ if(scratched) return; scratched=true; sc.classList.add("done"); sc.setAttribute("aria-label","Wedding date revealed"); confetti(sc); }
  sc.addEventListener("pointerdown",e=>{drawing=true;last=null;sc.setPointerCapture(e.pointerId);scratchAt(pos(e));});
  sc.addEventListener("pointermove",e=>{if(drawing) scratchAt(pos(e));});
  ["pointerup","pointercancel"].forEach(t=>sc.addEventListener(t,()=>{drawing=false;last=null;}));
  sc.tabIndex=0;
  sc.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();finishScratch();}});
  addEventListener("resize",()=>{ if(!scratched) sizeScratch(); });
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ if(!scratched) sizeScratch(); });
  sizeScratch();

  /* ================= Confetti ================= */
  function confetti(from){
    if(reduce) return;
    const c=$("#confetti"), x=c.getContext("2d"), dpr=Math.min(devicePixelRatio||1,2);
    c.width=innerWidth*dpr; c.height=innerHeight*dpr;
    const cols=["#B08A45","#D8BF8A","#EDB8C0","#CFC4E4","#F4CDB0","#B5CDB7"];
    const r=from.getBoundingClientRect(); const ox=(r.left+r.width/2)*dpr, oy=(r.top+r.height/2)*dpr;
    const P=Array.from({length:160},()=>{const a=Math.random()*Math.PI*2, s=(Math.random()*9+4)*dpr;
      return {x:ox,y:oy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6*dpr,w:(Math.random()*6+4)*dpr,h:(Math.random()*4+3)*dpr,rot:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[Math.floor(Math.random()*cols.length)],petal:Math.random()<.5};});
    const t0=performance.now();
    (function frame(t){
      const el=t-t0; x.clearRect(0,0,c.width,c.height);
      P.forEach(p=>{p.vy+=0.22*dpr; p.vx*=0.985; p.vy*=0.985; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        x.save(); x.translate(p.x,p.y); x.rotate(p.rot); x.globalAlpha=Math.max(0,1-el/4200); x.fillStyle=p.c;
        if(p.petal){x.beginPath();x.ellipse(0,0,p.w*.6,p.h*.5,0,0,7);x.fill();} else x.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        x.restore();});
      if(el<4200) requestAnimationFrame(frame); else x.clearRect(0,0,c.width,c.height);
    })(t0);
  }

  /* ================= Countdown & links ================= */
  const target=new Date(WEDDING.start).getTime();
  const pad=(n,l=2)=>String(n).padStart(l,"0");
  function tick(){
    let d=Math.max(0,target-Date.now());
    const days=Math.floor(d/864e5); d-=days*864e5; const h=Math.floor(d/36e5); d-=h*36e5; const m=Math.floor(d/6e4); d-=m*6e4; const s=Math.floor(d/1e3);
    const cdD=$("#cd-d"), cdH=$("#cd-h"), cdM=$("#cd-m"), cdS=$("#cd-s");
    if(cdD) cdD.textContent=pad(days);
    if(cdH) cdH.textContent=pad(h);
    if(cdM) cdM.textContent=pad(m);
    if(cdS) cdS.textContent=pad(s);
  }
  tick(); setInterval(tick,1000);
  const gfmt=iso=>new Date(iso).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const cal="https://calendar.google.com/calendar/render?action=TEMPLATE"+
    "&text="+encodeURIComponent(`${WEDDING.couple[0]} & ${WEDDING.couple[1]}'s Wedding`)+
    "&dates="+gfmt(WEDDING.start)+"/"+gfmt(WEDDING.end)+
    "&location="+encodeURIComponent(WEDDING.place)+
    "&details="+encodeURIComponent("We can't wait to celebrate with you. #MayurWedsKrina");
  const calLink=$("#cal-link"); if(calLink) calLink.href=cal;
  const calLink2=$("#cal-link-2"); if(calLink2) calLink2.href=cal;
  const dirLink=$("#dir-link"); if(dirLink) dirLink.href="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(WEDDING.mapQuery);

  /* ================= Story ================= */
  const track=$("#track"), dots=$("#dots");
  if(track && dots){
    const slides=[...track.querySelectorAll(".slide")];
    dots.innerHTML="";
    slides.forEach((s,i)=>{
      const b=document.createElement("button");
      b.setAttribute("aria-label","Photo "+(i+1));
      b.addEventListener("click",()=>go(i));
      dots.appendChild(b);
    });
    let cur=0;
    let animating=false;
    let animTimer=null;
    function syncDots(){
      if(animating) return;
      const w=track.clientWidth||1;
      cur=Math.min(slides.length-1, Math.max(0, Math.round(track.scrollLeft/w)));
      [...dots.children].forEach((d,i)=>d.setAttribute("aria-current",i===cur));
    }
    function go(i){
      if(!slides.length) return;
      cur=(i+slides.length)%slides.length;
      const targetLeft=slides[cur].offsetLeft;
      const start=track.scrollLeft;
      const diff=targetLeft-start;
      
      track.style.scrollSnapType='none';
      if(reduce || Math.abs(diff)<2){
        track.scrollLeft=targetLeft;
        track.style.scrollSnapType='';
        [...dots.children].forEach((d,idx)=>d.setAttribute("aria-current",idx===cur));
        return;
      }
      
      animating=true;
      clearInterval(animTimer);
      const startTime=Date.now();
      const duration=280;
      
      animTimer=setInterval(()=>{
        const elapsed=Date.now()-startTime;
        const p=Math.min(elapsed/duration,1);
        const ease=p<0.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
        track.scrollLeft=Math.round(start+diff*ease);
        if(p>=1){
          clearInterval(animTimer);
          track.scrollLeft=targetLeft;
          track.style.scrollSnapType='';
          animating=false;
          [...dots.children].forEach((d,idx)=>d.setAttribute("aria-current",idx===cur));
        }
      }, 16);
    }
    track.addEventListener("scroll",()=>{clearTimeout(track._t);track._t=setTimeout(syncDots,60);},{passive:true});
    const prevBtn=$("#prev"), nextBtn=$("#next");
    if(prevBtn) prevBtn.addEventListener("click",()=>go(cur-1));
    if(nextBtn) nextBtn.addEventListener("click",()=>go(cur+1));
    syncDots();
  }

  /* ================= Events ================= */
  const chk=$("#r-events");
  if(chk){
    EVENTS.forEach((ev,i)=>{
      const l=document.createElement("label");
      l.innerHTML=`<input type="checkbox" id="ev-${i}" value="${ev.name}" checked> ${ev.name} <span>${ev.short}</span>`;
      chk.appendChild(l);
    });
  }

  /* ================= RSVP ================= */
  const rsvpForm=$("#rsvp-form");
  if(rsvpForm){
    let guests = (guestInfo && guestInfo.count) ? guestInfo.count : (guestInfo && guestInfo.isFamily ? 4 : 2);
    const gOut=$("#g-count");
    if(gOut) gOut.textContent=guests;
    if(guestInfo && guestInfo.to){
      const rName=$("#r-name");
      if(rName && !rName.value) rName.value=guestInfo.to;
    }
    const gMinus=$("#g-minus"), gPlus=$("#g-plus");
    if(gMinus) gMinus.addEventListener("click",()=>{guests=Math.max(1,guests-1);if(gOut) gOut.textContent=guests;});
    if(gPlus) gPlus.addEventListener("click",()=>{guests=Math.min(10,guests+1);if(gOut) gOut.textContent=guests;});
    document.querySelectorAll('input[name=attend]').forEach(r=>r.addEventListener("change",()=>{ 
      const extra=$("#attend-extra"), rNo=$("#r-no");
      if(extra && rNo) extra.hidden=rNo.checked; 
    }));
    rsvpForm.addEventListener("submit",e=>{
      e.preventDefault();
      const rName=$("#r-name");
      const name=rName ? rName.value.trim() : "";
      const rErr=$("#r-err");
      if(!name){if(rErr) rErr.textContent="Please add your name so the family knows who is replying.";if(rName) rName.focus();return;}
      if(rErr) rErr.textContent="";
      const rYes=$("#r-yes");
      const yes=rYes ? rYes.checked : true;
      const evs=chk ? [...chk.querySelectorAll("input:checked")].map(i=>i.value) : [];
      const inviteNote = guestInfo ? (guestInfo.isFamily ? " (Full Family)" : (guestInfo.count ? ` (${guestInfo.count} members invited)` : "")) : "";
      const msg = yes
        ? `RSVP for ${WEDDING.couple[0]} & ${WEDDING.couple[1]}'s wedding\n\nName: ${name}\nAttending: Joyfully accept${inviteNote}\nGuests: ${guests}\nEvents: ${evs.length?evs.join(", "):"None selected"}`
        : `RSVP for ${WEDDING.couple[0]} & ${WEDDING.couple[1]}'s wedding\n\nName: ${name}\nAttending: Regretfully decline\nSending our love and blessings.`;
      const url=`https://wa.me/${WEDDING.whatsapp}?text=${encodeURIComponent(msg)}`;
      const card=$("#rsvp-card");
      if(card){
        card.innerHTML=`<div class="rsvp-done"><span class="mono" style="width:54px" aria-hidden="true"></span>
          <p class="script">${yes?"See you there!":"You'll be missed"}</p>
          <p class="sub">${yes?"Thank you, "+esc(name)+". Tap below to send your RSVP to the family.":"Thank you for letting us know. Tap below to send your note."}</p>
          <a href="${url}" target="_blank" rel="noopener">Open WhatsApp to send</a>
          <p class="rsvp-note">Sending to +91 97259 56266</p></div>`;
        if(yes) confetti(card);
      }
    });
  }

  /* ================= Music ================= */
  const btn=$("#music"), icon=$("#music-icon");
  const ICON_ON='<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>';
  const ICON_OFF='<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>';
  if(icon) icon.innerHTML=ICON_OFF;
  /* Harp and strings: flowing harp arpeggios over a soft string pad */
  let ac=null, playing=false, timer=null, out=null, wet=null, step=0;
  const M=m=>440*Math.pow(2,(m-69)/12);
  function ensureAudio(){
    if(ac) return;
    ac=new (window.AudioContext||window.webkitAudioContext)();
    out=ac.createGain(); out.gain.value=0; out.connect(ac.destination);
    const len=Math.floor(ac.sampleRate*3), buf=ac.createBuffer(2,len,ac.sampleRate);
    for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
    const conv=ac.createConvolver(); conv.buffer=buf; wet=ac.createGain(); wet.gain.value=.35; wet.connect(conv); conv.connect(out);
  }
  function voice(parts,t,env,lp){
    const g=ac.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(env.v,t+env.a);
    if(env.hold){g.gain.setValueAtTime(env.v,t+env.a+env.hold); g.gain.linearRampToValueAtTime(0.0001,t+env.a+env.hold+env.r);}
    else g.gain.exponentialRampToValueAtTime(0.0001,t+env.a+env.d);
    const f=ac.createBiquadFilter(); f.type="lowpass"; f.frequency.value=lp; g.connect(f); f.connect(out); f.connect(wet);
    const end=t+env.a+(env.hold?env.hold+env.r:env.d)+.1;
    parts.forEach(([type,freq,gain,det])=>{const o=ac.createOscillator(), og=ac.createGain(); o.type=type; o.frequency.value=freq; if(det) o.detune.value=det; og.gain.value=gain; o.connect(og); og.connect(g); o.start(t); o.stop(end);});
  }
  const harp=(m,t,v=.1,d=2.4)=>voice([["triangle",M(m),1],["sine",M(m)*2,.25]],t,{a:.003,d,v},3200);
  const strings=(m,t,len,v=.03)=>voice([["sawtooth",M(m),.6,-7],["sawtooth",M(m),.6,7],["sine",M(m),.5]],t,{a:.9,hold:Math.max(.1,len-.9),r:1.4,v},1100);
  const BEAT=.3, CH=[[43,55,59,62],[38,50,54,57],[40,52,55,59],[36,48,52,55]], PAT=[0,1,2,3,4,5,6,5,4,3,2,3,4,5,4,3];
  function schedule(){
    const t=ac.currentTime+.06, bar=Math.floor(step/16)%4, i=step%16, c=CH[bar];
    if(i===0){ harp(c[0],t,.12,3.4); [c[1],c[2],c[3]].forEach(n=>strings(n+12,t,16*BEAT)); }
    const tones=[c[1],c[2],c[3],c[1]+12,c[2]+12,c[3]+12,c[1]+24];
    harp(tones[PAT[i]],t,.075,2.2);
    if(i===0||i===8){ const top=[[74,71],[69,66],[71,67],[67,64]][bar][i?1:0]; harp(top+12,t,.06,3); }
    step++; timer=setTimeout(schedule,BEAT*1000);
  }
  function startMusic(){
    try{
      ensureAudio(); ac.resume();
      if(!playing){ playing=true; out.gain.cancelScheduledValues(ac.currentTime); out.gain.setValueAtTime(out.gain.value,ac.currentTime); out.gain.linearRampToValueAtTime(.9,ac.currentTime+2.5); schedule(); }
      if(btn) { btn.setAttribute("aria-pressed","true"); btn.setAttribute("aria-label","Pause music"); }
      if(icon) icon.innerHTML=ICON_ON;
    }catch(e){}
  }
  function stopMusic(){
    playing=false; clearTimeout(timer);
    if(ac){ out.gain.cancelScheduledValues(ac.currentTime); out.gain.setTargetAtTime(0,ac.currentTime,.3); }
    if(btn) { btn.setAttribute("aria-pressed","false"); btn.setAttribute("aria-label","Play music"); }
    if(icon) icon.innerHTML=ICON_OFF;
  }
  if(btn) btn.addEventListener("click",()=> playing?stopMusic():startMusic());

  /* ================= Scroll: fade-ins and parallax ================= */
  if(!reduce && "IntersectionObserver" in window){
    const targets=document.querySelectorAll("section:not(.hero) .wrap > *, .event, .fam, .travel > div, footer .wrap > *");
    const io=new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add("seen");io.unobserve(en.target);} }),{rootMargin:"0px 0px -8% 0px",threshold:.08});
    targets.forEach(t=>{ if(t.getBoundingClientRect().top > innerHeight){ t.classList.add("fade"); io.observe(t); } });
  }
  if(!reduce){
    const florals=[...document.querySelectorAll("main .floral")], hero=$("#hero-img");
    let ticking=false;
    function par(){
      ticking=false; const vh=innerHeight;
      florals.forEach((f,i)=>{ const r=f.getBoundingClientRect(); if(r.bottom<-200||r.top>vh+200) return;
        const k=(r.top+r.height/2-vh/2)/vh; f.style.setProperty("--py",(k*(i%2?-38:38)).toFixed(1)+"px"); });
      if(hero) hero.style.setProperty("--hy",(scrollY*0.18).toFixed(1)+"px");
    }
    addEventListener("scroll",()=>{ if(!ticking){ticking=true;requestAnimationFrame(par);} },{passive:true});
    par();
  }

  /* ================= Falling petals ================= */
  (function(){
    if(reduce) return;
    const c=$("#petals"); if(!c) return;
    const x=c.getContext("2d");
    const cols=["#EDB8C0","#F2C9CF","#F6EFE8","#D8BF8A","#CFC4E4","#F4CDB0"];
    let W,H,dpr,P=[];
    function size(){dpr=Math.min(devicePixelRatio||1,2);W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr;}
    function mk(top){return {x:Math.random()*W,y:top?-20*dpr:Math.random()*H,s:(Math.random()*5+5)*dpr,vy:(Math.random()*.5+.35)*dpr,sway:Math.random()*Math.PI*2,sw:Math.random()*.02+.008,rot:Math.random()*6,vr:(Math.random()-.5)*.03,c:cols[Math.floor(Math.random()*cols.length)],a:Math.random()*.35+.45};}
    size(); addEventListener("resize",size);
    for(let i=0;i<(innerWidth<520?12:20);i++) P.push(mk(false));
    function frame(){
      if(!document.hidden){
        x.clearRect(0,0,W,H);
        P.forEach((p,i)=>{
          p.sway+=p.sw; p.y+=p.vy; p.x+=Math.sin(p.sway)*.6*dpr; p.rot+=p.vr; if(p.y>H+20*dpr) P[i]=mk(true);
          x.save(); x.translate(p.x,p.y); x.rotate(p.rot); x.globalAlpha=p.a; x.fillStyle=p.c;
          x.beginPath(); x.moveTo(0,-p.s); x.bezierCurveTo(p.s*.9,-p.s*.5,p.s*.6,p.s*.7,0,p.s); x.bezierCurveTo(-p.s*.6,p.s*.7,-p.s*.9,-p.s*.5,0,-p.s); x.fill();
          x.restore();
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();