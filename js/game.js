/**
 * Created by Administrator on 2016/9/2.
 */
/*粒子*/
function feisha(cobj){
    this.cobj=cobj;
    this.x=100;
    this.y=100;
    this.x1=30*Math.random()-10;
    this.x2=40*Math.random()-10;
    this.y1=30*Math.random()-10;
    this.y2=40*Math.random()-10;
    this.r=3;
    this.color="rgb(233,233,233)";
    this.speedy=-4*Math.random()-4;
    this.speedx=16*Math.random()-8;
    this.life=4;
}
feisha.prototype={
    drow:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.beginPath();
        this.cobj.fillStyle=this.color;
        this.cobj.scale(this.r, this.r);
        this.cobj.globalCompositeOperation="lighter";
        this.cobj.moveTo(0,0);
        this.cobj.bezierCurveTo(this.x1,this.y1,this.x2,this.y2,0,0);
        this.cobj.fill();
        this.cobj.restore()
    },
    update:function(){
        this.y+=this.speedy;
        this.x+=this.speedx;
        this.r-=0.09;
        this.life-=0.1;
    }
};
function  stone(cobj,x,y,color){
    var color=color||"rgb(233,233,233)";
    var str=[];
    for(var i=0;i<20;i++){
        var obj=new feisha(cobj);
        obj.x=x;
        obj.y=y;
        obj.color=color;
        str.push(obj)
    }
    var t=setInterval(function(){
        for(var i=0;i<str.length;i++){
            str[i].drow();
            str[i].update();
            if(str[i].r<0||str[i].life<0){
                str.splice(i, 1);
            }
        }
        if (str.length == 0) {
            clearInterval(t);
        }
    })
}
/*人物*/
function person(canvas,cobj,runsImg,jumpImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=canvas.width/3;
    this.y=0;
    this.width=293;
    this.height=220;
    this.runsImg=runsImg;
    this.jumpImg=jumpImg;
    this.state="runsImg";
    this.speedY=8;
    this.status=0;
    this.xia=9.8;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.state][this.status],0,0,293,220,0,0,this.width,this.height);
        this.cobj.restore();
    },
    update:function(){
        if(this.y>400){
            stone(this.cobj,this.x,this.y+this.height);
            this.y=400;
        }else if(this.y<400){
            this.speedY+=this.xia;
            this.y+=this.speedY;
        }
    }
}
/*障碍物*/
function zhang(canvas,cobj,hider){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hider=hider;
    this.x=canvas.width;
    this.y=500;
    this.width=100;
    this.height=100;
    this.status=0;
}
zhang.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hider[this.status],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
/*游戏主程序*/
function game(canvas,cobj,runsImg,jumpImg,hider,xia,feng,audios,kaishi,game,xue,anniu){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hider=hider;
    this.xia=xia;
    this.feng=feng;
    this.xue=xue;
    this.audios=audios;
    this.kaishi=kaishi;
    this.game=game;
    this.anniu=anniu;
    this.canvasW=canvas.width;
    this.canvasH=canvas.height;
    this.person=new person(canvas,cobj,runsImg,jumpImg);
    this.hiderImg=new zhang(canvas,cobj,hider);
    this.hiderarr=[];
    this.speed=20;
    this.time=5000+parseInt(5*Math.random())*1000;
    this.score=0;
    this.life=100;
    this.arr=["mp3/172.mp3","mp3/ten.mp3","mp3/172.mp3"]
    this.t;
}
game.prototype={
    play:function(){
        var that=this;
        that.key();
        that.kaishi.onclick=function(){
            that.move();
            that.audios.play();
            that.kaishi.style.cssText="transform:scale(0,0)"
        };
        that.game.onclick=function(){
            location.reload()
        };


    },
    move:function(){
        var that=this;
        var num=0;
        var num2=0;
        var back=0;
        function move(){
            back-=that.speed;
            num++;
            that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
            if(that.person.state=="runsImg"){
                that.person.status=num%8;
            }else if(that.person.state=="jumpImg"){
                that.person.status=0;
            }
            that.canvas.style.backgroundPositionX=back+"px";
            that.person.draw();
            that.person.update();
            if(num2%that.time==0){
                num2=0;
                that.time=5000+parseInt(5*Math.random())*1000;
                that.hiderImg=new zhang(that.canvas,that.cobj,that.hider);
                that.hiderImg.status=Math.floor(Math.random()*that.hider.length);
                that.hiderarr.push(that.hiderImg)
            }
            num2+=50;
            for(var i=0;i<that.hiderarr.length;i++){
                that.hiderarr[i].x-=that.speed;
                that.hiderarr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hiderarr[i])){
                    if(!that.hiderarr[i].flag1) {
                        that.audios.src=that.arr[1];
                        that.audios.play();
                        setTimeout(function(){
                            that.audios.src=that.arr[0];
                            that.audios.play();
                        },450)
                        that.life-=20;
                        that.xue.style.cssText="width:"+that.life+"%";
                        stone(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height/2,"red")
                    }


                    that.hiderarr[i].flag1=true;
                    if(that.life<=0){
                        that.audios.pause();
                        clearInterval(that.t)
                        that.game.style.cssText="transform:scale(1,1)"
                    }
                }else if(that.hiderarr[i].x+that.hiderarr[i].width<that.person.x){
                    if(!that.hiderarr[i].flag&&!that.hiderarr[i].flag1){
                        that.feng.innerHTML=++that.score;
                        if(that.score%2==0){
                            clearInterval(that.t);
                            that.audios.pause();
                            that.xia.style.cssText="transform:scale(1,1)";
                            that.speed+=1;
                            that.hiderImg.width+=50;
                            that.hiderImg.height+=50;
                        }
                    }
                    that.hiderarr[i].flag=true;
                }
            }
        }
        that.t=setInterval(move,50)
        var flg=true;
        that.anniu.onclick=function(){
            if(flg==true){
                that.anniu.className="start";
                that.audios.pause();
                clearInterval(that.t)
                flg=false;
            }else{
                that.anniu.className="zanting";
                that.t=setInterval(move,50);
                that.audios.play();
                flg=true;
            }
        }
        that.xia.onclick=function(){
            that.t=setInterval(move,50);
            that.xia.style.cssText="transform:scale(0,0)"
            that.audios.play();
        };
    },
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
            if (!flag) {
                return;
            }
            flag = false;
            var code= e.keyCode;
            if(code==32){
                that.person.speedY=0;
                that.person.xia=0;
                that.person.state="jumpImg";
                var intA=0;
                var speeda=10;
                var r=100;
                var inty=that.person.y;
                var t=setInterval(function(){
                    intA+=speeda;
                    if(intA>180){
                        stone(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height);
                        clearInterval(t);
                        that.person.y=inty;
                        that.person.state="runsImg";
                        flag=true;
                    }else{
                        var lang=Math.sin(intA*Math.PI/180)*r;
                        that.person.y=inty-lang
                    }
                },50)
            }
        };

    }
   /* up:function(){
        var that=this;
        document.onkeydown=function(e){
            var code= e.keyCode;
            if(code==38){
                that.person.y+=5

            }
        }
    },
    down:function(){
        var that=this;
        document.onkeydown=function(e){
            var code= e.keyCode;
            if(code==40){
                that.person.y-=5
            }
        }
    }*/
};
