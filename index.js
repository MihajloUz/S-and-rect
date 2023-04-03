let canvas = document.getElementById("canvas");
canvas.addEventListener("contextmenu", event=>event.preventDefault());

canvas.width = innerWidth - 10;
canvas.height = innerHeight - 10;


document.getElementById("clear").style.left = innerWidth - 70 + "px";
document.getElementById("clear").style.top = innerHeight - 50 + "px";

document.getElementById("breekTsunami").style.left = innerWidth - 70 + "px";
document.getElementById("breekTsunami").style.top = innerHeight - 100 + "px";

document.getElementById("rain").style.left = innerWidth - 70 + "px";
document.getElementById("rain").style.top = innerHeight - 150 + "px";

document.getElementById("wind").style.left = innerWidth - 70 + "px";
document.getElementById("wind").style.top = innerHeight - 200 + "px";

let startRain = false;
let startBreekFall = false;
let startWind = false;

document.getElementById("breekTsunami").onclick = function(){
    if (startBreekFall == true){
        startBreekFall = false;
        document.getElementById("breekTsunami").style.background =  "gray";
    }else{
        startBreekFall = true;
        document.getElementById("breekTsunami").style.background =  "rgb(20, 230, 20)";
    }
}
document.getElementById("rain").onclick = function(){
    if (startRain == true){
        startRain = false;
        document.getElementById("rain").style.background = "gray";
    }else{
        startRain = true;
        document.getElementById("rain").style.background = "rgb(20, 230, 20)";
    }
}
document.getElementById("wind").onclick = function(){
    if (startWind == true){
        startWind = false;
        document.getElementById("wind").style.background = "gray";
    }else{
        startWind = true;
        document.getElementById("wind").style.background = "rgb(20, 230, 20)";
    }
}

function Rain(){
    water.push(
        new Water(Math.floor(Math.random() * (innerWidth - 20)), -40, 20, 20)
    );
}
function BreekFall(){
    breeks.push(
        new Breek(Math.floor(Math.random() * (innerWidth - 20)), -40, 7, r, g, b)
    );
}
function Wind(){
    for (let i = 0;i < breeks.length;i++){
        breeks[i].x += 0.5;
    }
    for (let i = 0;i < fires.length;i++){
        fires[i].x += 1.5;
    }
    for (let i = 0;i < water.length;i++){
        water[i].x += 1;
    }
}
function clearEvent(){
    water = [];
    breeks = [];
    fires = [];
    explosives = [];
    startBreekFall = false;
    startRain = false;
    startWind = false;


    document.getElementById("wind").style.background = "gray";
    document.getElementById("rain").style.background = "gray";
    document.getElementById("breekTsunami").style.background = "gray";
}

document.getElementById("clear").onclick = clearEvent;


let ctx = canvas.getContext("2d");
let breeks = [];
let water = [];
let r = 180;
let g = 140;
let b = 60;
let MouseX;
let MouseY;
let bFire = false;
let bExplosive = false;
let fires = [];
let ExplosiveParticles = [];
let lights = [];

let MOUSEX;
let MOUSEY;
let mX;
let mY;





function GranadeAndBreekCollision(){
    for (let i = 0; i < breeks.length;i++){
        for (let I = 0; I < explosives.length;I++){
           
            if (explosives[I].lifeToBoom < 0){
                if (explosives[I].x + 100 > breeks[i].x && explosives[I].x - 100 < breeks[i].x && 
                    explosives[I].y + 160 > breeks[i].y && explosives[I].y - 100 < breeks[i].y){
                        breeks[i].x += (breeks[i].x - explosives[I].x) * 2;
                        breeks[i].velocity += (breeks[i].y - explosives[I].y) * 2;
                        
                }
            }
            if (explosives[I].x + 50 > breeks[i].x && explosives[I].x < breeks[i].x + 20 &&
                explosives[I].y + 50 > breeks[i].y && explosives[I].y < breeks[i].y + 20 ||
                explosives[I].y > innerHeight - 60){
                    explosives[I].lifeToBoom = -1;
                    explosives[I].velocity = 0;
            }else{
                explosives[I].velocity = 5;
            }
            
        }   
    }
}


function BreeksCollision(index){
    let breek1 = breeks[index];
    for (let i = index + 1 ; i < breeks.length;i++){
        let breek2 = breeks[i];
        if (breek1.y + 20 > breek2.y && breek1.y < breek2.y + 20 &&
            breek1.x + 50 > breek2.x && breek1.x < breek2.x + 50){
            breek2.velocity = 0;
            breek2.startY = breek2.y;
        }
        
    }
}

function WaterCollision(){
    for (let i = 0; i < breeks.length;i++){
        let b = breeks[i];
        for (let I = 0; I < water.length;I++){
            let w = water[I];
        if (w.x + 50 > b.x && w.x < b.x + 30 &&
            w.y + 22 > b.y && w.y < b.y + 22){
                w.y += 0.66;
                w.y -= 2;
                
                w.w += 1;
                w.x -= 0.5;
                w.h -= 0.66;
                if (b.g < 180){
                    b.r += 1;
                    b.g += 1;
                }
            }
        }
    }
}
function fireCollision(){
    for (let i = 0; i < breeks.length;i++){
        let b = breeks[i];
        for (let I = 0; I < fires.length;I++){
            let f = fires[I];
        if (f.x + 50 > b.x && f.x < b.x + 30 &&
            f.y + 22 > b.y && f.y < b.y + 22){
                if (b.g >= 100){
                    b.g -= 0.01;
                }
            }
        }
    }
}
function MouseCollision(index, x , y){
    let breekk1 = breeks[index];
    if (MouseY != null && MouseX != null){
       
        if (x > breekk1.x - 35 && x < breekk1.x + 60 &&
            y > breekk1.y - 10 && y < breekk1.y + 15){
                breekk1.x = x;
                breekk1.y = y - 5;
            }
    }
}





class Granade{
    constructor(x, y, velocity){
        this.x=x;
        this.y=y;
        this.velocity=velocity;
        this.lifeToBoom = 100;

    }
    end(){
        if (this.lifeToBoom < -5){
            this.x = -100;
        }
    }
    draw(){
        ctx.fillStyle = "rgb(155, 155, 155)";
        ctx.fillRect(this.x, this.y, 20, 20);
        ctx.fillStyle = "rgb(200, 160, 20)";
        ctx.fillRect(this.x+2, this.y+2, 16, 16);
        ctx.fillStyle = "rgb(210, 190, 100)";
        ctx.fillRect(this.x + 5, this.y + 20, 10, 25);
    }
    move(){
        this.y += this.velocity;
        if (this.y > innerHeight - 60){
            this.velocity = 0;
        }
    }
}

let explosives = [new Granade(-100, -100, 0)];

class ExplosiveParticle{
    constructor(x, y, lifeTime){
        this.x=x;
        this.y=y;
        this.lifeTime=lifeTime;
        this.rr = 100;
        this.gg = 0;
        this.bb = 0;
    }
    draw(){
        ctx.fillStyle = "rgba(" + this.rr + "," + this.gg + "," + this.bb + "," + 255 + ")";
        ctx.fillRect(this.x, this.y, 5, 5);
    }
    move(){
        let random = Math.floor(Math.random() * 2);
        let randomm = Math.floor(Math.random() * 2);
        if (random == 0){
            this.x += Math.floor(Math.random() * 10);
            if (randomm == 0){
                this.y += Math.floor(Math.random() * 10);
            }else{
                this.y -= Math.floor(Math.random() * 10);
            }
        }
        if (random == 1){
            this.x -= Math.floor(Math.random() * 10);
            if (randomm == 0){
                this.y += Math.floor(Math.random() * 10);
            }else{
                this.y -= Math.floor(Math.random() * 10);
            }
        }
        this.lifeTime--;
        if (this.lifeTime < 0){
            this.x = -100;
        }
    }
}



class fireParticles{
    constructor(x, y, lifeTime, type, startX, startY){
        this.x = x;
        this.y = y;
        this.lifeTime = lifeTime;
        this.type = type;   
        this.frames = frames;
        this.startX = startX;
        this.startY = startY;
    } 
    draw(){
        if (this.type == "fire"){
            ctx.fillStyle = "rgb(" + 255 + "," + (Math.floor(Math.random() * 120) - (this.lifeTime - 75)) + "," + 0 + ")";
           ctx.fillRect(this.x, this.y, 10, 10);
           ctx.stroke();
        }
    }
    move(){
        
        if (this.type == "fire"){
            if (this.x < Math.floor(Math.random() * 400) + this.startX){
                if (Math.floor(Math.random() * 2) == 0){
                    this.x += Math.random() * 5;
                }else{
                    this.x -= Math.random() * 5;
                }
            }
            this.y -= 1.5;
            this.lifeTime++;
            if (this.lifeTime >= 75){
                this.x = -1000;
                this.y = -1000;
            }
        }
    }
}
class Water{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.life = 0;
    }

    draw(){
        
        ctx.fillStyle = "rgb(30, 30, 240)";

        ctx.fillRect(this.x, this.y, this.w, this.h);
     
        ctx.stroke();
    }
    move(){
        if (this.y < innerHeight - 30){
            this.y += 2;
        }else if(this.y >= innerHeight - 30){
            this.y+= 0.66;
            this.w += 2.5;
            this.x -= 1.25;
            this.h -= 0.33;
            this.life++;
        }
        if (this.h <= 0){
            this.h = 0;
            this.y = -100;
        }
        
    }
}



class Breek{
    constructor(x, y, velocity, r , g, b){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.r = r;
        this.g = g;
        this.b = b;
        this.startX = x;
        this.startY = y;
        
    }

    draw(){
        ctx.fillStyle = "gray";

        ctx.fillRect(this.x - 25, this.y - 5, 50, 20);
        ctx.fillStyle = "rgb("+ this.r + "," + this.g + "," + this.b +")";
        ctx.fillRect(this.x - 22, this.y - 3, 44, 14);
        ctx.stroke();
        
    }
    move(){
        this.y += this.velocity;
        if (this.y >= innerHeight - 30){
            this.velocity = 0;
        }else{
            this.velocity = 5;
        }


    }
}


window.addEventListener("mousedown", function(event){
    if (event.which == 1){
        breeks.push(
            new Breek(event.clientX, event.clientY, 5, r, g, b)
        );
    }
    if (event.which == 3){
        water.push(
            new Water(event.clientX, event.clientY, 20, 20)
        );
    }
});
window.addEventListener("keypress", function(event){
    if (event.key == "f" || event.key == "а"){
        fires.push(
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25),
            new fireParticles(MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25, 0, "fire", MOUSEX + Math.floor(Math.random() * 50) - 25, MOUSEY+ Math.floor(Math.random() * 50) - 25)
    
        );
    }
    if (event.key == "g" || event.key == "п"){
        explosives.push(
            new Granade(mX, mY, 6)
        );
    }
    if (event.key == 'r' || event.key == "к"){
      
    } 
});





canvas.addEventListener("mousemove", function(event){
    mX = event.clientX;
    mY = event.clientY;

    MOUSEX = event.clientX;
    MOUSEY = event.clientY;
    if (event.which == 2){
        MouseX = event.clientX;
        MouseY = event.clientY;
    }
    else{
        MouseX = null;
        MouseY = null;
    }
});

function main(){
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    breeks.forEach((breek, index) =>{
        breek.draw();
        breek.move();

        MouseCollision(index, MouseX, MouseY);
        BreeksCollision(index);
    });
    water.forEach(wate=>{
        wate.draw();
        wate.move();
    });
    fires.forEach(fire =>{
        fire.draw();
        fire.move();
    });
    explosives.forEach(exp =>{
        exp.draw();
        exp.move();
        exp.end();
    })
    ExplosiveParticles.forEach(part=>{
        part.draw();
        part.move();
    })
    lights.forEach(light =>{
        light.draw();
        light.move();
    });
    WaterCollision();
    fireCollision();
    GranadeAndBreekCollision();


    if (startBreekFall == true){
        BreekFall();
    }
    if (startRain == true){
        Rain();
    }
    if (startWind == true){
        Wind();
    }
    for (let i = 1;i < explosives.length;i++){
        if (explosives[i].lifeToBoom < 0){
            for (let u = 0; u < 200;u++){
                ExplosiveParticles.push(
                    new ExplosiveParticle(explosives[i].x, explosives[i].y, Math.floor(Math.random() * 20))
                );
                
            }
            explosives.splice(i, 1);
        }
    }
    for (let i = 0;i < ExplosiveParticles.length;i++){
        if (ExplosiveParticles[i].lifeTime < 0){
            ExplosiveParticles.splice(i, 1);
        }
    }
    for (let i = 1;i < fires.length;i++){
        if (fires[i].lifeTime >= 75){
            fires.splice(i, 1);
        }
    }
    for (let i = 1;i < water.length;i++){
        if (water[i].h <= 0){
            water.splice(i, 1);
        }
    }
    
    setTimeout(main, 1);
}
main();
