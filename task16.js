/**
 * 规定一些正则表达式，便于读取数据的匹配
*/
var regCity=/^[\u4e00-\u9fa5a\a-zA-Z]+$/;
var regAqi=/[0-9]+/;
//去除两边空格
var trim=function(str){
	return str.replace(/\s+/g,'');
}

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var newCity=document.getElementById("aqi-city-input").value;
	var newAqi=document.getElementById("aqi-value-input").value;
	if(!regCity.test(trim(newCity))){
		alert("城市名称必须为中英文字符");
	}
	else if(!regAqi.test(trim(newAqi))){
		alert("空气质量必须为数字");
	}
	else{
		aqiData[newCity]=newAqi;
	}
}
/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var table=document.getElementById('aqi-table');
	var HTML="<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	table.innerHTML=HTML;
		for(e in aqiData){
			table.innerHTML+="<tr><td>"+e+"</td><td>"+aqiData[e]+"</td><td><button>删除</button></td></tr>";
		}		
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  // do sth.
  e=window.event||e;
  var delCity=e.target.parentNode.parentNode.firstChild.innerHTML;
  delete aqiData[delCity];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
   var btn = document.getElementById("add-btn");
	 btn.addEventListener("click", addBtnHandle); 	
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var table=document.getElementById('aqi-table');
  	 table.addEventListener("click",delBtnHandle);
}
window.onload=function(){
	init();
}