var tree=[];
var result=[];
// var treeNode=document.getElementById("tree");
var searchNode=document.getElementById("tree-content");

// 前序插入目录至树
function preOrder(r){
	if(r){
		tree.push(r);
		var children=r.children;
		for(var i=0;i<children.length;i++){
			preOrder(children[i].lastElementChild);
		}
	}	
}

//展开搜索
function showSearch(point){
	 var parent=point.parentNode;
	 if(parent.style.display=="none"){
	 	showSearch(parent)
	 	parent.style.display="block";
	 	parent.parentNode.firstElementChild.firstElementChild.innerHTML="&#xe648;";
	 }
}

//搜索节点
function search(){
	var data=document.getElementById("search-data").value;
	preOrder(searchNode);
	var count=0;
	for(var i=0;i<tree.length;i++){
		var children=tree[i].children;
		for(var j=0;j<children.length;j++){
			result.push(children[j]);	
		}
	}
	if(data==""){
		alert("请输入搜索节点名称")
		tree=[];
		result=[];
	}
	else{
		for(var m=0;m<result.length;m++){
			result[m].firstElementChild.firstElementChild.nextElementSibling.style.color="#000";
			if(result[m].firstElementChild.firstElementChild.nextElementSibling.innerHTML==data){
				count++;
				showSearch(result[m]);
				result[m].firstElementChild.firstElementChild.nextElementSibling.style.color="red"
			}
		}
		alert("共发现"+count+"个节点");
		tree=[];
		result=[];
		document.getElementById("search-data").value="";
	}
}

// 增加节点至树
function addNode(root,initName,id){
	var name;
	if(initName){
		name=initName;
	}
	else{
		name=prompt("请输入节点名称","");
		if(name==""){
			name="未命名";
		}
		else if(name==null){
			return
		}
	}
	root.parentNode.parentNode.firstElementChild.innerHTML="&#xe648;"
	root.parentElement.parentElement.firstElementChild.setAttribute('onclick','collapse(this)');
	var node=root.parentNode.parentNode.nextElementSibling;
	node.style.display="block";
	//创建元素
	var ul=document.createElement("ul");
	var li=document.createElement("li");
	var div=document.createElement("div");
	var div1=document.createElement("span");
	var div2=document.createElement("div");
	var add=document.createElement("i");
	var del=document.createElement("i");
	var ren=document.createElement("i");
	var show=document.createElement("i");
	//元素样式
	div.setAttribute('class','title')
	div1.setAttribute('class','inner');
	div2.setAttribute('class','btnGroup');
	show.setAttribute('class','iconfont');
	add.innerHTML="&#xe678; 添加";
	if(id){
		add.setAttribute('id',id);
	}
	add.setAttribute('class','iconfont');
	add.setAttribute('onclick','addNode(this)');
	del.innerHTML="&#xe74b; 删除";
	del.setAttribute('class','iconfont');
	del.setAttribute('onclick','delNode(this)')
	ren.innerHTML="&#xe653; 重命名";
	ren.setAttribute('class','iconfont');
	ren.setAttribute('onclick','renameNode(this)')
	//添加分支
	div2.appendChild(add);
	div2.appendChild(del);
	div2.appendChild(ren);
	div1.innerHTML=name;
	div1.setAttribute('onclick','collapse(this)');
	div.appendChild(show);
	div.appendChild(div1);
	div.appendChild(div2);
	li.appendChild(div);
	li.appendChild(ul);
	node.appendChild(li);
}

//删除树中节点
function delNode(point){
	var node=point.parentNode.parentNode.parentNode;
	var nodeParent=node.parentNode;
	nodeParent.removeChild(node);
}

//重命名节点
function renameNode(point){
	var rename=prompt("请输入节点新名称","");
	if(rename==""){
		rename="未命名";
	}
	else if(rename==null){
		return
	}
	var node=point.parentNode.parentNode.children[1];
	node.innerHTML=rename;		
}

//展开节点
function collapse(point){
    var node=point.parentNode.nextElementSibling;

        if(node.style.display=='none'){
            node.style.display='block';
            if(node.childElementCount){
                point.parentElement.firstElementChild.innerHTML='&#xe648';
            }
        }else{
            node.style.display='none';
            if(node.childElementCount){
                point.parentElement.firstElementChild.innerHTML='&#xe66a';
            }
        }   
}

//初始化函数
function init(){
	var root=document.getElementById("tree-index").lastElementChild.firstElementChild;
	addNode(root,'技术类','tech');
	var qianduan=document.getElementById('tech');
    addNode(qianduan,'web前端','qianduan');
    var html=document.getElementById('qianduan');
    addNode(html,'HTML','html');
    var css=document.getElementById('qianduan');
    addNode(css,'CSS','css');
    var js=document.getElementById('qianduan');
    addNode(js,'JavaScript','js');

    var houtai=document.getElementById('tech');
    addNode(houtai,'后台语言','houtai');
    var Java=document.getElementById('houtai');
    addNode(Java,'Java','Java');
    var PHP=document.getElementById('houtai');
    addNode(PHP,'PHP','PHP');
    var Linux=document.getElementById('houtai');
    addNode(Linux,'Linux','Linux');

    var suanfa=document.getElementById('tech');
    addNode(suanfa,'算法','suanfa');
    var sort=document.getElementById('suanfa');
    addNode(sort,'排序','sort');
    var insertSort=document.getElementById('sort');
    addNode(insertSort,'插入排序','insertSort');
    var bubbleSort=document.getElementById('sort');
    addNode(bubbleSort,'冒泡排序','bubbleSort');
	var quickSort=document.getElementById('sort');
    addNode(quickSort,'快速排序','quickSort');
}
init();