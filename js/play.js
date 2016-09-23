/**
 * Created by Administrator on 2016/9/2.
 */
window.onload=function(){
    var canvas=document.querySelector("canvas");
    canvas.width=document.documentElement.clientWidth;
    canvas.height=document.documentElement.clientHeight;
    var cobj=canvas.getContext("2d");
    var runsImg=document.querySelectorAll(".run");
    var jumpImg=document.querySelectorAll(".jump");
    var hider=document.querySelectorAll(".hider");
    var xia=document.querySelector(".xia");
    var feng=document.querySelector(".feng");
    var xue=document.querySelector(".xue");
    var audios=document.querySelector("audio");
    var anniu=document.querySelector("#anniu");
    var kaishi=document.querySelector(".kaishi");
    var gameover=document.querySelector(".game");
    var plays=new game(canvas,cobj,runsImg,jumpImg,hider,xia,feng,audios,kaishi,gameover,xue,anniu);
    plays.play();
};