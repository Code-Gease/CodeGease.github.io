
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 得到当前时间
 */
 function getNow(){
  var dateTime=document.getElementsByName('gra-time');
  var curChecked='';
  for(var i=0;i<dateTime.length;i++){
    if(dateTime[i].checked){
      curChecked=dateTime[i].value;
    }
  }
  return curChecked;
 }
/**
 * 得到当前城市
 */
function getCity(){
  var citySelect=document.getElementById('city-select');
  var index=citySelect.selectedIndex;
  var city=citySelect.options[index].value;
  return city;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var time=getNow();
  var city=getCity();
  pageState['nowGraTime']=time;
  pageState['nowSelectCity']=city;
  switch(time){
    case "day":
      chartData={};
      chartData=aqiSourceData[city];break;
    case "week":
      chartData={};
      var count=0,total=0,weeks=1;
      for(var i in aqiSourceData[city]){
        var date=new Date(i);
        var week=date.getDay();
        if (week==6) {
          count++;
          total+=aqiSourceData[city][i];
          chartData["第"+weeks+"周"]=Math.round(total/count);
          count=0;
          total=0;
          weeks++;
        }
        else{
          count++;
          total+=aqiSourceData[city][i];
        }
      }
      chartData["第"+weeks+"周"]=Math.round(total/count);
      break;
      case "month":
        chartData={};
        var month=0,count=0,total=0;
        for(var i in aqiSourceData[city]){
          var date=new Date(i);
          if((date.getMonth()+1)!=month){
            month=date.getMonth();
            chartData[month+"月"]=Math.round(total/count);
            count=0;
            total=0;
          }
          count++;
          total+=aqiSourceData[city][i];
        }
        chartData[month+"月"]=Math.round(total/count);
        break;

  }
  // 处理好的数据存到 chartData 中
  renderChart();
}

/**
 * 渲染图表
 */
function renderChart() {
  var str="";
  for(var i in chartData){
    str+="<div class='box "+pageState['nowGraTime']+"'>";
    str+="<div class='chart "+pageState['nowGraTime']+"' style='height:"+chartData[i]+"px;background-color:rgb("+Math.floor(Math.random()*250)+","+Math.floor(Math.random()*250)+","+Math.floor(Math.random()*250)+");' title='"+i+""+pageState['nowSelectCity']+":"+chartData[i]+"'>"+"</div>";
    str+="</div>";  
  }
  document.getElementById('aqi-chart-wrap').innerHTML=str;

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var curChecked=getNow();
  if(curChecked===pageState['nowGraTime']){
    return ;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var city=getCity();
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var rdlist=document.getElementsByName("gra-time");
  for(var i=0;i<rdlist.length;i++){
    rdlist[i].addEventListener('click',graTimeChange,false);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var ctsl=document.getElementById('city-select');
  for(city in aqiSourceData){
    var op=document.createElement('option');
    var ctstr=document.createTextNode(city);
    op.appendChild(ctstr);
    op.value=city;
    ctsl.appendChild(op);
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  ctsl.addEventListener('change',citySelectChange,false);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

window.onload=function(){
  init();
}
