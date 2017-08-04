window.onload=function(){
    initDateBase();
    initLeftSection();
    initMidSection();
    initRightSection();
    var add=true;
    
    /*给“所有任务添”加点击函数*/
addHandler($('.all'),'click',function(event){
    if(hasClass($('.left_section .choose'),"all"))
        return;
    else{
        if($('.left_section .choose')){
            removeClass($('.left_section .choose'),'choose')
        }
        addClass($('.all'),'choose');
    
        if($('.mid_section .choose')){
            removeClass($('.mid_section .choose'),'choose')
        }
        addClass($('#all'),'choose');
        initMidSection();
        initRightSection(); 
    }
    
      
});
    
    /*给“主分类和子分类以及删除按钮”加点击函数*/
addHandler($('#taskL'),'click',mainChildClick);
    
    /*给“增加分类”加点击函数*/
addHandler($('.addClass'),'click',function(event){
    $('.cover').style.display='block';
    
    var h='<option value=\'-1\'>新增主分类</option><option value=\'0\'>默认主分类</option>';
    var mains=returnMainCate();
    for (var i=1; i<mains.length;i++){
        h=h+'<option value='+mains[i].id+'>'+ mains[i].name +'</option>';
    }
    $('.cover .select select').innerHTML=h;
})

   /*给“增加分类的确认按钮”加点击函数*/
addHandler($('.cover .sure'),'click',function(event){
    //console.log(!$('.newClassName input').value);
    var newClassName=$('.newClassName input').value;
    if(!newClassName) {alert('请输入分类名称');return;}
    
    var mainId=parseInt($('.cover .select select').value);
    
    var childs=returnChildCateL();
    var mains=returnMainCate();
    var childNames=getArryNames(childs);
    var mainNames=getArryNames(mains);
    if(childNames.indexOf(newClassName)!=-1){
        alert('已有相同子分类名称');
        return;
    }else if(mainNames.indexOf(newClassName)!=-1){
        alert('已有相同主分类名称');
        return;
    }
    if(mainId==-1){
        
        var obj={
            id:mains.length,
            name:newClassName,
            child:[],
        }
        mains.push(obj);
        localStorage.mainCate=JSON.stringify(mains);
        
    }else if(mainId==0){
        alert('不能给默认主分类添加子分类');
    }else{
        
        /*修改子分类*/
        
        var obj={
            id:childs.length,
            name:newClassName,
            child:[],
            pid:mainId
        }
        childs.push(obj);
        localStorage.childCateL=JSON.stringify(childs);
        
        
        /*修改主分类*/
        var targetMain=getMainById(mainId);
        var index=getIndex(targetMain,mains)
        mains[index].child.push(obj.id);
        localStorage.mainCate=JSON.stringify(mains);
    }
    $('.cover').style.display='none';
    $('.newClassName input').value='';
    initLeftSection();
});
    
    /*给“增加分类的取消按钮”加点击函数*/
addHandler($('.cover .concel'),'click',function(event){
    $('.newClassName input').value='';
    $('.cover').style.display='none';
})


/*中间部分的点击监听*/

/*mid_header点击监听*/
addHandler($('.mid_header'),'click',function(event){
    var target=getTarget(event);
    //console.log(target.id);
    var id=target.id;
    if(id=='all'||id=='unfinished'||id=='finished'){
        if(hasClass(target,'choose')){return;}
        var choosed=$('.mid_header .choose');
        removeClass(choosed,'choose');
        addClass(target,'choose');
        initMidSection();
        initRightSection(); 
    } 
});

    /*listTitle点击监听*/
addHandler($('.taskList'),'click',function(event){
    var target=getTarget(event);
    
    /*点击删除*/
    if(hasClass(target,'fa-trash-o')&&hasClass(target.parentElement,'listTitle')){
        var taskId=parseInt(target.parentElement.getAttribute('taskId'));
        console.log(typeof(taskId));
        deleteTaskById(taskId);
        initLeftSection();
        initMidSection();
        initRightSection(); 
    }
    /*点击任务*/
    else if(hasClass(target,'listTitle')||hasClass(target.parentElement,'listTitle')){
       //var target=document.getElementsByClassName('listTitle')[1];
        if(hasClass(target,'choose')||hasClass(target.parentElement,'choose')) {return}
        console.log(target);
        console.log(hasClass(target,'listTitle'));
        var choosed=$('.taskList .choose');
        removeClass(choosed,'choose');
        if(hasClass(target,'listTitle')) {addClass(target,'choose');}
        else {addClass(target.parentElement,'choose');}
        initRightSection(); 
    }
});

/*增加任务按钮监听*/
addHandler($('.addTask'),'click',function(event){
	add=true;
    if(!hasClass($('.left_section .choose'),'childClass')){
        alert('请先确认子分类');
        return;
    }else{
        $('.right_section1').style.display='none';
        $('.right_section2').style.display='block';
        $('.inputTask').value='';
        $('.right_section2 #date_task .inputTask').value='';
        $('.right_section2 textarea').value='';
    }
    
});
    
    /*增加任务保存按钮监听*/
addHandler($('.right_section2 .save'),'click',function(event){
    var title=$('.right_section2 #title_task .inputTask').value;
    var date=$('.right_section2 #date_task .inputTask').value;
    var text=$('.right_section2 #content_task textarea').value;
    var tasks=returnTaskL();
    var taskNames=getArryNames(tasks);
    
        
        if (!title){
            alert('任务标题不能为空');
            return;
        }
        if(!date){
            alert('任务日期不能为空');
            return;
        }
        if(!text){
            alert('任务内容不能为空');
            return;
        }
    if (add==true){
        
        if(taskNames.indexOf(title)!=-1){
            alert('任务标题不可重复');
            return;
        }
        var choosedChildId=parseInt($('.left_section .choose').parentElement.getAttribute('childCateId'));
        var obj={
            id:tasks.length,
            pid:choosedChildId,
            name:title,
            finish:false,
            date:date,
            content:text
        }
        tasks.push(obj);
        localStorage.taskL=JSON.stringify(tasks);
    
        var childs=returnChildCateL();
        var choosedChild=getChildById(choosedChildId);
        var index=getIndex(choosedChild,childs);
        childs[index].child.push(obj.id);
        localStorage.childCateL=JSON.stringify(childs);
    
        /*修改左部分*/
        initLeftSection();
        removeClass($('.all'),'choose');
        var childDiv=document.getElementsByClassName('childClass');
        for(var i=0; i<childDiv.length; i++){
            if(parseInt(childDiv[i].parentElement.getAttribute('childCateId'))==choosedChildId)
                addClass(childDiv[i],'choose');
        }
    
    
        /*修改中间部分*/
        removeClass($('.mid_header .choose'),'choose');
        addClass($('.mid_header #all'),'choose');
        initMidSection();
        var lists=document.getElementsByClassName('listTitle');
        removeClass(lists[0],'choose');
        for(var j=0; j<lists.length; j++){
            if(parseInt(lists[j].getAttribute('taskId'))==obj.id){
                addClass(lists[j],'choose');
            }
        }
    
        /*修改右部分*/
        initRightSection();  
    
        /*清空section2*/
        $('.inputTask').value='';
        $('.right_section2 #date_task .inputTask').value='';
        $('.right_section2 textarea').value='';
    }else{
        var taskId=parseInt($('.taskList .choose').getAttribute('taskId'));
        var task=getTaskById(taskId);
        var index=getIndex(task,tasks);
        if(taskNames.indexOf(title)!=-1&&title!=tasks[index].name){
            alert('任务标题不可重复');
            return;
        }
        tasks[index].name=title;
        tasks[index].date=date;
        tasks[index].content=text;
        localStorage.taskL=JSON.stringify(tasks);
        initMidSection();
        var lists=document.getElementsByClassName('listTitle');
        removeClass(lists[0],'choose');
        for(var j=0; j<lists.length; j++){
            if(parseInt(lists[j].getAttribute('taskId'))==taskId){
                addClass(lists[j],'choose');
            }
        }
        initRightSection(); 
           }
});


/*增加任务取消按钮监听*/
addHandler($('.right_section2 .concel'),'click',function(event){
    $('.right_section1').style.display='block';
    $('.right_section2').style.display='none';
    $('.inputTask').value='';
    $('.right_section2 #date_task .inputTask').value='';
    $('.right_section2 textarea').value='';
});
    
  
/*任务编辑按钮监听*/
addHandler($('.right_section1 .fa-pencil'),'click',function(event){
    var choose=$('.taskList .choose');
    var chooseId=parseInt(choose.getAttribute('taskId'));
    var chooseTask=getTaskById(chooseId);
    $('.right_section1').style.display='none';
    $('.right_section2').style.display='block';
    $('.inputTask').value=chooseTask.name;
    $('.right_section2 #date_task .inputTask').value=chooseTask.date;
    $('.right_section2 textarea').value=chooseTask.content;
    add=false;
});
    
    
    /*任务标记完成按钮监听*/
addHandler($('.right_section1 .fa-check-square-o'),'click',function(event){
     if(confirm("确定已完成任务?")){
        var tasks=returnTaskL();
        var taskId=parseInt($('.taskList .choose').getAttribute('taskId'));
        var task=getTaskById(taskId);
        var index=getIndex(task,tasks);
        tasks[index].finish=true;
        localStorage.taskL=JSON.stringify(tasks);
        $('.left_section .choose')
         
         
         /*修改左部分*/
        var divs=$('.left_section').getElementsByTagName('div');
        var leftChoose=$('.left_section .choose');
        var indexDiv=getIndexOfDiv(leftChoose,divs);
        initLeftSection();
        removeClass($('.all'),'choose');
        divs=$('.left_section').getElementsByTagName('div');
        addClass(divs[indexDiv],'choose');
        
    
    
        /*修改中间部分*/
        removeClass($('.mid_header .choose'),'choose');
        addClass($('.mid_header #all'),'choose');
        initMidSection();
        var lists=document.getElementsByClassName('listTitle');
        removeClass(lists[0],'choose');
        for(var j=0; j<lists.length; j++){
            if(parseInt(lists[j].getAttribute('taskId'))==taskId){
                addClass(lists[j],'choose');
            }
        }

     }
});
    
    
}
           
function mainChildClick(event){
    //var target=$('.fa-trash-o');
    var target=getTarget(event);
    
    
    /*主分类删除按钮*/
    if(hasClass(target,'fa-trash-o')&&hasClass(target.parentElement,'mainClass')){
        var mainLi=target.parentElement.parentElement;
        var mainCateId=parseInt(mainLi.getAttribute('mainCateId'));
        
        
        
        /*删除子分类和任务*/
        var targetMain=getMainById(mainCateId);
        var childArry=targetMain.child;
        
             /*删除任务*/    
        for (var i=0; i<childArry.length; i++){
            var targetChild=getChildById(childArry[i]);
            deleteTaskById(targetChild.child);
        }
        
                /*删除子分类*/
        deleteChildById(targetMain.child);
        
        /*删除主分类*/
        deleteMainById(mainCateId);
        initLeftSection();
        initMidSection();
        initRightSection();
        
    }
    
       /*子分类删除按钮*/
    else if(hasClass(target,'fa-trash-o')&&hasClass(target.parentElement,'childClass')){
        var target=document.getElementsByClassName('childClass')[1];
        var childLi=target.parentElement;
        var childCateId=parseInt(childLi.getAttribute('childCateId'));
        
        /*删除任务*/
        var targetChild=getChildById(childCateId);
        deleteTaskById(targetChild.child);
        
        /*删除子分类*/
        deleteChildById(childCateId); 
        initLeftSection();
        initMidSection();
        initRightSection();
        
    }
    /*主分类点击*/
    else if(hasClass(target,'mainClass')||hasClass(target.parentElement,'mainClass')){
        //console.log(target);
        var choosed=$('.left_section .choose');
        if(!(choosed==target||choosed==target.parentElement)){
            removeClass(choosed,'choose');
            if(hasClass(target,'mainClass')) addClass(target,'choose');
            else addClass(target.parentElement,'choose');
            initMidSection();
            initRightSection();   
        }
    }
    /*子分类点击*/
    else if(hasClass(target,'childClass')||hasClass(target.parentElement,'childClass')){
        //var target=document.getElementsByTagName('span')[6]
        var choosed=$('.left_section .choose');
        if(!(choosed==target||choosed==target.parentElement)){
            removeClass(choosed,'choose');
            if(hasClass(target,'childClass')) addClass(target,'choose');
            else addClass(target.parentElement,'choose');
            initMidSection();
            initRightSection();   
        }
    }
}
           
           
function initDateBase(){
    var mainCateText=[
        {
        id:0,
        name:'默认主分类',
        child:[0],
        },
        
        /*{
        id:1,
        name:'生活',
        child:[1,2],
        } */              
    ];
    var childCateText=[
        {
        id:0,
        name:'默认子分类',
        child:[0],
        pid:0,
        },
        /*{
        id:1,
        name:'学习',
        child:[1],
        pid:1,
        },
        {
        id:2,
        name:'工作',
        child:[2],
        pid:1,
        }*/
    ];
    var taskText=[
        {
        id:0,
        pid:0,
        name:'使用说明',
        finish:true,
        date:'2017-02-12',
        content:'左侧为分类列表 右侧为当前分类下的任务列表 右侧为任务详情 可以添加删除分类，添加任务，修改任务，以及给任务标记是否完成等功能 byLiu'
        },
       
    ];
    /*var mains=returnMainCate();
    var childs=returnChildCateL();
    var tasks=returnTaskL();*/
    if(!localStorage.initValue){
        localStorage.mainCate=JSON.stringify(mainCateText);
        localStorage.childCateL=JSON.stringify(childCateText);
        localStorage.taskL=JSON.stringify(taskText);
        localStorage.initValue=true;
    }
        
    
    
    
    
}
/*初始化左部分*/
function initLeftSection(){
    var mainCate=returnMainCate();
    var chileCate=returnChildCateL();
    /*设置所有任务一栏*/
    document.getElementsByClassName('all')[0].innerHTML=' <i class="fa fa-th"></i> 所有任务&nbsp;(<span>' + getAllUnfinishNum() + '</span>)';
    
    /*设置主分类和子分类*/
    var h='';
    for (var i=0; i<mainCate.length; i++){
        if (i==0) 
            h=h+'<li mainCateId=0><div  class="mainClass " > <i class="fa fa-folder-open"></i> <span>默认主分类 (0)</span></div> <ul><li childCateId=0><div class="childClass " ><i class="fa fa-file-text"></i> <span>默认子分类 (0)</span></div></li> </ul></li>';
        else{
            h=h+'<li mainCateId=' +mainCate[i].id +'><div  class="mainClass" ><i class="fa fa-folder-open"></i> <span> '+ mainCate[i].name + ' ' + '(' + getMainUnfinishNum(mainCate[i]) + ')</span><i class="fa fa-trash-o"></i></div><ul>';
            /*子分类*/
            for (var j=0; j<mainCate[i].child.length; j++){
                var cur_child=getChildById(mainCate[i].child[j]);
                var unfinishNum=getChildUnfinishNum(cur_child);
                h=h+'<li childCateId=' + cur_child.id +'><div class="childClass"><i class="fa fa-file-text"></i><span> ' + cur_child.name + ' ' +'(' + getChildUnfinishNum(cur_child) +')</span><i class="fa fa-trash-o"></i></div></li>';
            }
            h=h+'</ul></li>'
        }
    }
    document.getElementById('taskL').innerHTML=h;   
    if (!$('.left_section .choose')){
        addClass($('.left_section .all'),'choose');
    }
}

/*初始化中间*/
function initMidSection(){
    if (!$('.mid_section .choose')){
        addClass($('.mid_section #all'),'choose');
//        var alltasks=returnChoosedStasTaskL();
        var tasks=returnChoosedAllTaskL();
    }else if($('.mid_section .choose').getAttribute('id')=='unfinished'){
        var tasks=returnChoosedStasTaskL(false);
    }else if($('.mid_section .choose').getAttribute('id')=='finished'){
        var tasks=returnChoosedStasTaskL(true);
    }else if($('.mid_section .choose').getAttribute('id')=='all'){
        var tasks=returnChoosedAllTaskL();
    }
        
        
    tasks.sort(compareDate);
    var h='<ul>';
    var finishArry=[];
    for (var i=0; i<tasks.length; i++){
        if(i>0&&tasks[i].date==tasks[i-1].date){
            h=h+'<li><div class="listTitle" taskId=' + tasks[i].id +'><i class="fa fa-minus"></i><i class="fa fa-check"></i> '+ tasks[i].name +'<i class="fa fa-trash-o"></i></div></li>';
        }else {
			
            h=h+'<li><div class="listDate" >'+ tasks[i].date +'</div><div class="listTitle" taskId=' + tasks[i].id +'><i class="fa fa-minus"></i><i class="fa fa-check"></i> '+ tasks[i].name +'<i class="fa fa-trash-o"></i></div></li>';
        } 
        if(tasks[i].finish==true){
            finishArry.push(true);
        }else{
            finishArry.push(false);
        }
    }
    h=h+'</ul>'
    
    document.getElementsByClassName('taskList')[0].innerHTML=h;
    var tasksList=$('.taskList').getElementsByClassName('listTitle');
    for(var j=0; j<tasksList.length; j++){
        if (finishArry[j]==true){
            tasksList[j].getElementsByClassName('fa-check')[0].style.display='inline-block';
            tasksList[j].getElementsByClassName('fa-minus')[0].style.display='none';
        }else{
            tasksList[j].getElementsByClassName('fa-check')[0].style.display='none';
            tasksList[j].getElementsByClassName('fa-minus')[0].style.display='inline-block';
        }
    }
    
    
}

/*初始化右部分*/
function initRightSection(){
    $('.right_section1 #title_task span').innerHTML='任务标题：';
    $('.right_section1 #date_task').innerHTML='任务日期：';
    $('.right_section1 #content_task').innerHTML='';
    if(!$('.taskList .choose')){
        if(!$('.mid_section .listTitle'))
            return;
        else{
                addClass(document.getElementsByClassName('listTitle')[0],'choose');
            }
    }
    var choose=$('.taskList .choose');
    var chooseId=parseInt(choose.getAttribute('taskId'));
    var chooseTask=getTaskById(chooseId);
    if(chooseTask.finish==true){
        $('.fa-check-square-o').style.display='none';
        $('.fa-pencil').style.display='none';
    }else{
        $('.fa-check-square-o').style.display='inline-block';
        $('.fa-pencil').style.display='inline-block';
    }
    $('.right_section1 #title_task span').innerHTML='任务标题：'+chooseTask.name;
    $('.right_section1 #date_task').innerHTML='任务日期：' + chooseTask.date;
    $('.right_section1 #content_task').innerHTML=chooseTask.content;
    $('.right_section1').style.display='block';
    $('.right_section2').style.display='none';
}





function addHandler(element,type,handler){
    if(element.addEventListener)//其他浏览器
		{
			//element.addEventListener(type,handler,false);
			element.addEventListener(type, handler, false);
		}
		else if(element.attachEvent)//IE浏览器
		{
			element.attachEvent("on"+type,handler);
		}
		else{
			element["on"+type]=handler;
		}
}

function getTarget(event){
    return event.target || event.srcElement;
}

function returnChoosedStasTaskL(stas){
    var tasks=returnChoosedAllTaskL();
    var targetTask=[];
    if (stas==true||stas==false){
          for (var i=0; i<tasks.length; i++){
            if (tasks[i].finish==stas){
            targetTask.push(tasks[i]);
            }
          }
        return targetTask;
    }else{
        return tasks;
    }
    
}

function returnChoosedAllTaskL(){
    var choosed=$('.left_section .choose');
    if (hasClass(choosed,'all')){
        var allTasks=returnTaskL();
        return allTasks;
    }else if(hasClass(choosed,'mainClass')){
        var mainId=choosed.parentElement.getAttribute('mainCateId');
        var mainTask=getMainById(mainId);
        var childs=getChildById(mainTask.child);
        var targetTasks=[];
        for (var i=0; i<childs.length; i++){
            targetTasks=targetTasks.concat(getTaskById(childs[i].child));
        }
        return targetTasks;
    }else if(hasClass(choosed,'childClass')){
        var childId=choosed.parentElement.getAttribute('childCateId');
        var childTask=getChildById(parseInt(childId));
        var childs=childTask.child;
        return getTaskById(childs);
    }
}

function compareDate(obj1,obj2){
    if(obj1.date<obj2.date){
        return -1;
    }else if (obj1.date>obj2.date){
        return 1;
    }else{
        return 0;
    }
}

function returnMainCate(){
    return JSON.parse(localStorage.mainCate);
}
function returnChildCateL(){
    return JSON.parse(localStorage.childCateL);
}
function returnTaskL(){
    return JSON.parse(localStorage.taskL);
}
    
function getMainById(mainId){
    var mains=returnMainCate();
    for (var i=0; i<mains.length; i++){
        if (mains[i].id==mainId){
            return mains[i];
            break;
        }
            
    }
}
    
function getTaskById(taskId){
    var tasks=returnTaskL();
    if (typeof(taskId)=='number'){
        for (var i=0; i<tasks.length; i++){
            if (tasks[i].id==taskId){
                return tasks[i];
                break;
            }  
        }
    }else if(isArray(taskId)){
        var targetTask=[];
        for (var i=0; i<tasks.length; i++){
            for( var j=0;j<taskId.length; j++){
                if (tasks[i].id==taskId[j]){
                    targetTask.push(tasks[i]);
                }
            }
        
        }
        return targetTask;
    }
    else
        return;
}
function getChildById(childId){
    var childs=returnChildCateL();
    if (typeof(childId)=='number'){
        for (var i=0; i<childs.length; i++){
            if (parseInt(childs[i].id)==childId){
                return childs[i];
                 break;
            }  
        }
    }else if(isArray(childId)){
        var targetChild=[];
        for (var i=0; i<childs.length; i++){
            for( var j=0;j<childId.length; j++){
                if (childs[i].id==childId[j]){
                    targetChild.push(childs[i]);
                }
            }
        
        }
        return targetChild;
    }
    else
        return;
}

function getAllUnfinishNum(){
    var num=0;
    var task=returnTaskL();
    for (var i=0; i<task.length; i++){
        if(task[i].finish==false) num++;
        
    }
    return num;
}
function getChildUnfinishNum(child_cate){
    var num=0;
    for (var i=0; i<child_cate.child.length;i++){
        if (getTaskById(child_cate.child[i]).finish==false)
            num++;
    }
    return num;
}
function getMainUnfinishNum(main_cate){
    var num=0;
    for (var i=0;i<main_cate.child.length; i++){
        var current_child=getChildById(main_cate.child[i]);
        num=num + getChildUnfinishNum(current_child);
    }
    return num;
}

function getIndex(target,arry){
    for(var i=0; i<arry.length; i++){
        if (parseInt(target.id)==parseInt(arry[i].id))
            return i;
    }
}

/*根据ID删除任务和修改子分类*/
function deleteTaskById(id){
    var tasks=returnTaskL();
    if (typeof(id)=='number'){
        
        var targetTask=getTaskById(id);
        /*删除任务内容*/
        var taskIndex=getIndex(targetTask,tasks);
        tasks.splice(taskIndex,1);
        localStorage.taskL=JSON.stringify(tasks);
        
        /*修改子分类的child属性*/
        var childCates=returnChildCateL();
        var targetChild=getChildById(parseInt(targetTask.pid));
        var childIndex=getIndex(targetChild,childCates);
        
        var targetIndexInChild=childCates[childIndex].child.indexOf(id);
        childCates[childIndex].child.splice(targetIndexInChild,1);
        localStorage.childCateL=JSON.stringify(childCates);
        
    }else if(isArray(id)){
        
        for( var i=0; i<id.length; i++){
            var targetTask=getTaskById(id[i]);
            var taskIndex=getIndex(targetTask,tasks);
            /*删除任务内容*/
            tasks.splice(taskIndex,1);
        }
        localStorage.taskL=JSON.stringify(tasks);
    }
}

/*根据ID删除子分类和修改主分类*/
function deleteChildById(id){
    var childs=returnChildCateL();
    if (typeof(id)=='number'){
        console.log(id);
        var targetChild=getChildById(id);
        /*删除子分类*/
        var childIndex=getIndex(targetChild,childs);
        childs.splice(childIndex,1);
        localStorage.childCateL=JSON.stringify(childs);
        
        /*修改主分类的child属性*/
        var mainCates=returnMainCate();
        var targetMain=getMainById(parseInt(targetChild.pid));
        var mainIndex=getIndex(targetMain,mainCates);
        
        var targetIndexInChild=mainCates[mainIndex].child.indexOf(id);
        mainCates[mainIndex].child.splice(targetIndexInChild,1);
        localStorage.mainCate=JSON.stringify(mainCates);
        
    }else if(isArray(id)){
        
        for( var i=0; i<id.length; i++){
            var targetChild=getChildById(id[i]);
            var childIndex=getIndex(targetChild,childs);
            /*删除子分类*/
            childs.splice(childIndex,1);
        }
        localStorage.childCateL=JSON.stringify(childs);
    }
}

/*根据ID删除主分类*/
function deleteMainById(id){
    var mains=returnMainCate();
    var targetMain=getMainById(id);
    var mainIndex=getIndex(targetMain,mains);
        /*删除任务内容*/
    mains.splice(mainIndex,1);
    localStorage.mainCate=JSON.stringify(mains);
}

function getArryNames(arry){
    var names=[];
    for(var i=0; i<arry.length; i++){
        names.push(arry[i].name);
    }
    return names;
}
function getIndexOfDiv(target,arry){
    for(var i=0; i<arry.length; i++){
        if(hasClass(arry[i],'choose')){
            return i;
        }
    }
}







