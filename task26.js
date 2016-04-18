/*--创建一个飞船类--*/
var craft=function(name,num){
	this.name=name
	this.num=num;
	this.posi=0;
	this.eng=100;
}

/*--为飞船类添加4个系统：信号、自毁、能源、动力--*/
//添加飞船信号系统，用command表示接收到的指令代号
craft.prototype.command=0;
craft.prototype.receive=function(msg){
	switch(msg){
		case "销毁飞船":this.destroy();break;
		case "飞行":this.fly("飞行");this.energy("飞行");break;
		case "停止":this.fly("停止");this.energy("停止");break;
		default:break;
	}
	
}

//销毁飞船功能，并将飞船从数组中移除
craft.prototype.destroy=function(){
	crafts[this.num]=null;
	var ship=document.getElementsByClassName('ship'+this.num+'')[0];
	ship.style.display="none";
	//清除所有计时器
	clearInterval(t[this.num]);
	clearInterval(ft[this.num]);
	clearInterval(st[this.num]);
	clearInterval(nt[this.num]);
	t[this.num]=null;
	ft[this.num]=null;
	st[this.num]=null;
	nt[this.num]=null;
	//在中介中注销该飞船
	mediator.del(this)
	console.log(mediator.all)
	//重置飞船位置
	this.posi=0;
}

//添加飞船动力系统，speed表示飞行速度
craft.prototype.speed=3;
craft.prototype.fly=function(status){
		var speed=craft.prototype.speed;
		var num=this.num;
		var posi=this.posi;
		var me=this;
	if(status=="飞行"){
		renderShip(status,speed,num,posi,me);
	}
	else if(status=="停止"){
		renderShip(status,speed,num,posi,me);
	}
}

//飞机能源系统
var ft=[];
var st=[];
var nt=[];
craft.prototype.energy=function(sta){
	var me=this;
	var num=this.num;
	var eng=this.eng;

	//飞行时候每500毫秒，能量减少3%
	if(sta=="飞行"){
		if(ft[num]==null){
			clearInterval(st[num]);
			st[num]=null;
			clearInterval(nt[num]);
			nt[num]=null;
			ft[num]=setInterval(function(){
				me.eng-=3;
				var cureng=me.eng;
				if(cureng<=0){
					cureng=0;
					me.eng=0;
					me.fly("停止");
					clearInterval(st[num]);
					st[num]=null;
					me.energy("原地停止");
				}
				showEngergy(num,cureng);
			},500)
		}
		else{
			return;
		}
	}
	//停止时候每500毫秒，能量增加1%
	else if(sta=="停止"){
		if(st[num]==null){
			clearInterval(ft[num]);
			ft[num]=null;
			clearInterval(nt[num]);
			nt[num]=null;
			st[num]=setInterval(function(){
				
				var cureng2=me.eng;
				if(cureng2>=100){
					clearInterval(st[num]);
				}
				me.eng+=1;
				showEngergy(num,cureng2);
			},500)
		}
		else{
			return;
		}
	}
	else if(sta=="原地停止"){
		if(nt[num]==null){
			clearInterval(ft[num]);
			ft[num]=null;
			nt[num]=setInterval(function(){
				me.eng+=1;
				var cureng3=me.eng;
				if(cureng3>=100){
					clearInterval(nt[num]);
				}
				showEngergy(num,cureng3);
			},500);
		}
		else{
			return;
		}
	}
}

//飞船列表
var crafts=[];

/*--创建一个mediator对象--*/
var mediator={
	all:{},
	zhuce:function(f){
		this.all[f.name]=f;
	},
	send:function(msg,to){
		//有30%的几率发送信息失败
		var ran=Math.random();
		var console_body=document.getElementsByClassName("console-body")[0];
		//有飞船的情况系
		if(to){
			//发送成功
			if(ran>0.3){
				//控制台指令
				var p=document.createElement("span");
				p.innerHTML="向轨道"+to.num+"发送"+msg+"指令成功<br>";
				p.className="success";
				console_body.appendChild(p);
				//飞船接收
				this.all[to.name].receive(msg);
			}
			//发送失败
			else{
				//控制台指令
				var p=document.createElement("sapn");
				p.innerHTML="向轨道"+to.num+"发送"+msg+"指令失败<br>";
				p.className="defeat";
				console_body.appendChild(p);
				return;
			}
		}
		//没有成功创建飞船的情况下
		else{
			return;
		}
		
		
	},
	create:function(name,num){
		//有30%的几率发送信息失败
		var ran=Math.random();
		var console_body=document.getElementsByClassName("console-body")[0];
		//发送成功
		if(ran>0.3){
			//控制台指令
			var p=document.createElement("span");
			p.innerHTML="向轨道"+num+"发送创建飞船指令成功<br>";
			p.className="success";
			console_body.appendChild(p);
			//创建新的飞船
			if(crafts[num]==null){
				var newcraft=new craft(name,num);
				crafts[num]=newcraft;
				var ship=document.getElementsByClassName('ship'+num+'')[0];
				ship.style.display="block";
				ship.innerHTML="100%";
				ship.style.transform="rotate(0deg)";
				ship.style.webkitTransform="rotate(0deg)";
				ship.style.mozTransform="rotate(0deg)";
				ship.style.msTransform="rotate(0deg)";
				ship.style.oTransform="rotate(0deg)";
				this.zhuce(newcraft);
			}
			else{
				return;
			}
		}
		//发送失败
		else{
			//控制台指令
			var p=document.createElement("sapn");
			p.innerHTML="向轨道"+num+"发送创建飞船指令失败<br>";
			p.className="defeat";
			console_body.appendChild(p);
			return;
		}
		
	},
	del:function(f){
		this.all[f.name]=null;
	}
}

/*--创建一个指挥员类--*/
var commander=function(name){
	this.name=name;
}
//指挥官方法
commander.prototype.send=function(msg,to){
	mediator.send(msg,to);
}
commander.prototype.create=function(name,num){
	mediator.create(name,num);
}

//渲染飞行器
var t=[]
function renderShip(sta,spe,num,posi,craft){
	var ship=document.getElementsByClassName('ship'+num+'')[0];
	//飞行过程
	if(sta=="飞行"){
		//改变飞行位置
		if(t[num]==null){
			t[num]=setInterval(function(){
				posi+=spe;
				ship.style.transform="rotate("+posi+"deg)";
				ship.style.webkitTransform="rotate("+posi+"deg)";
				ship.style.mozTransform="rotate("+posi+"deg)";
				ship.style.msTransform="rotate("+posi+"deg)";
				ship.style.oTransform="rotate("+posi+"deg)";
				craft.posi=posi;
			},200)
		}
	}
	if(sta=="停止"){
		clearInterval(t[num]);
		t[num]=null;
	}
}

//显示能量
function showEngergy(num,eng){
	var div=document.getElementsByClassName("ship"+num+"")[0];
	div.innerHTML=""+eng+"%";
}

var director=new commander('director');
mediator.zhuce(director);

//初始化
function init(){
	for(var i=0;i<4;i++){
		!function(i){
			var j=i+1;
			//为4个按钮绑定事件，分别为创建飞船、销毁飞船、飞行、停止
			var create_btn=document.getElementsByClassName("create-craft")[i];
			create_btn.onclick=function(){director.create("craft"+j+"",j);create_btn.disabled="disabled";destroy_btn.disabled="";fly_btn.disabled="";stop_btn.disabled="disabled";}

			var destroy_btn=document.getElementsByClassName("destroy-craft")[i];
			destroy_btn.onclick=function(){director.send('销毁飞船',mediator.all["craft"+j+""]);create_btn.disabled="";destroy_btn.disabled="disabled";fly_btn.disabled="disabled";stop_btn.disabled="disabled";}

			var fly_btn=document.getElementsByClassName("fly-status")[i];
			fly_btn.onclick=function(){fly_btn.disabled="disabled";stop_btn.disabled="";director.send("飞行",mediator.all["craft"+j+""]);}

			var stop_btn=document.getElementsByClassName("stop-status")[i];
			stop_btn.onclick=function(){mediator.send("停止",mediator.all["craft"+j+""]);fly_btn.disabled="";stop_btn.disabled="disabled";}

			//初始化时，只可以创建飞船
			destroy_btn.disabled="disabled";
			fly_btn.disabled="disabled";
			stop_btn.disabled="disabled";
		}(i);
		
	}
}

init()
