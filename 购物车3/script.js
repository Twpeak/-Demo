// getElementsByClassName在IE中不支持
if(!document.getElementsByClassName){
    document.getElementsByClassName = function(cls){
        var classArr = [];
        var els = document.getElementsByTagName("*");
        for(var i=0; i<els.length; i++){
            // className不一定一个，可能包含多个
            if(els[i].className === cls 
                || els[i].className.indexOf(" "+cls) > -1
                || els[i].className.indexOf(" "+cls+" ") > -1
                || els[i].className.indexOf(cls+" ") > -1
            ){
                classArr.push(els[i]);
            }
        }
        return classArr;
    }
}

var cartTable = document.getElementById("cartTable");
var tr = cartTable.children[1].rows;    // rows是表单各元素特有的属性，存放节点所有tr元素
var checkInputs = document.getElementsByClassName("check");
var checkAllInputs = document.getElementsByClassName("check-all");
var selectedTotal = document.getElementById("selectedTotal");
var priceTotal = document.getElementById("priceTotal");
var selected = document.getElementById("selected");
var foot = document.getElementById("foot");
var selectedViewList = document.getElementById("selectedViewList");
var deleteAll = document.getElementById("deleteAll");

// 计算总和
function getTotal(){
    var selected =0;
    var price = 0;
    var htmlStr = "";
    for(var i=0; i<tr.length; i++){
        if(tr[i].getElementsByTagName("input")[0].checked){
            tr[i].className = "on";
            selected += parseInt(tr[i].getElementsByTagName("input")[1].value);
            price += parseFloat(tr[i].cells[4].innerHTML);
            // htmlStr += "<div><img src=" + tr[i].getElementsByTagName("img")[0].src + "><span class='del' index="+ i +">取消选择</span></div>"
            htmlStr += `<div><img src="${tr[i].getElementsByTagName("img")[0].src}"><span class='del' index=${i}>取消选择</span></div>`;
        }else{
            tr[i].className = "";
        }
    }
    selectedTotal.innerHTML = selected;
    priceTotal.innerHTML = price.toFixed(2);
    selectedViewList.innerHTML = htmlStr;

}

for(var i=0; i<checkInputs.length; i++){
    var count = 0;
    checkInputs[i].onclick = function(){
        // 全选
        if(this.className === "check-all check"){
            for(var j=0; j<checkInputs.length; j++){
                checkInputs[j].checked = this.checked;
            }
        }
        if(this.checked == false){
            count--;
            for(var n=0; n<checkAllInputs.length; n++){
                checkAllInputs[n].checked = false;
            }
        }else{
            count++;
            if(count == checkInputs.length-2){
                for(var k=0; k<checkAllInputs.length; k++){
                    checkAllInputs[k].checked = true;
                }
            }
        }
        getTotal();
    }    
}

selected.onclick = function(){
    if(foot.className == "foot"){
        if(selectedTotal.innerHTML != "0"){
            foot.className = "foot show";
        }
    }else{
        foot.className = "foot";
    }
}

// 取消选择（事件代理）
selectedViewList.onclick = function(e){
    e = e || window.event;
    var el = e.srcElement;      //span
    if(el.className == "del"){
        var index = el.getAttribute("index");
        var input = tr[index].getElementsByTagName("input")[0];     //取消选择
        input.checked = false;
        input.onclick();
    }
}

// 增加商品数量
for(var i=0; i<tr.length; i++){
    tr[i].onclick = function(e){
        e = e || window.event;
        var el = e.srcElement;
        var cls = el.className;
        var input = this.getElementsByTagName("input")[1];
        var val = parseInt(input.value);
        var reduce = this.getElementsByTagName("span")[1];

        var price = this.cells[2].innerHTML;
        var subtotal = this.cells[4];

        switch(cls){
            case 'add':
                input.value = val + 1;
                if(input.value > 1){
                    reduce.innerHTML = "-";
                }
            break;
            case "reduce":
                if(val > 1){
                    input.value = val - 1;
                }
                if(input.value == 1){
                    reduce.innerHTML = "";
                }
            break;
            case "delete":
                var conf = confirm("确定要删除吗？")
                if(conf){
                    this.parentNode.removeChild(this);
                }
            break;
            default:
            break;
        }

        // 计算商品价格
        subtotal.innerHTML = (parseInt(input.value) * parseFloat(price)).toFixed(2);
    }
}

deleteAll.onclick = function(){
    alert("test")
}
