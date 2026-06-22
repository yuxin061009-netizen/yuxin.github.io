console.log("外部 Javascript 已成功連結，功能全開中");

let visitorname = prompt("請輸入你的名字:");
if (visitorname === '' || visitorname === null ){
    visitorname = "訪客";
}
window.alert("Hello, " + visitorname + ", 歡迎來到我的網站!");

const logoelement = document.getElementById("main-logo");
if (logoelement) {
    logoelement.innerText = visitorname + "的網站";
}

const titleelement = document.getElementById("hero-title");
if (titleelement) {
    titleelement.innerHTML = `我的未來，由<span class="highlight" id="name-highlight">${visitorname}</span> 創造`;
}

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const aiResponse = document.getElementById("ai-response");
const todoList = document.getElementById("todo-list");

const manualText = document.getElementById("manual-text");
const manualDatetime = document.getElementById("manual-datetime");
const manualAddBtn = document.getElementById("manual-add-btn");

function createTodoItem(text, formattedTime) {
    const newTodo = document.createElement("li");
    newTodo.className = "todo-item";
    newTodo.setAttribute("data-time", formattedTime); 
    newTodo.setAttribute("data-notified", "false");
    
    newTodo.innerHTML = `
        <div class="todo-info">
            <span class="todo-text">${text}</span>
            <span class="todo-time-tag">⏰ 提醒日期與時間: ${formattedTime}:00</span>
        </div>
        <button class="delete-btn" onclick="this.parentElement.remove()">❌</button>
    `;
    todoList.insertBefore(newTodo, todoList.firstChild);
}

if (manualAddBtn && manualText && manualDatetime) {
    manualAddBtn.addEventListener("click", function() {
        const text = manualText.value.trim();
        const datetimeVal = manualDatetime.value; 

        if (text === "" || datetimeVal === "") {
            alert("請輸入完整的提醒事項與日期時間！");
            return;
        }

        const formattedTime = datetimeVal.replace("T", " ");
        createTodoItem(text, formattedTime);

        manualText.value = "";
        manualDatetime.value = "";
        aiResponse.innerText = `AI助理: 偵測到您手動新增了「${text}」，已完美記錄！`;
    });
}

if (sendBtn && userInput && aiResponse && todoList) {
    sendBtn.addEventListener("click", function() {
        const userMessage = userInput.value.trim(); 
        
        if (userMessage === "") {
            alert("請先輸入指令!");
            return;
        }

        setTimeout(function() {
            if (userMessage.startsWith("新增 ")) {
                let content = userMessage.replace("新增 ", "").trim();
                let parts = content.split(" ");
                let timeStr = "";
                let todoText = "";

                if (parts.length >= 2) {
                    let lastPart = parts[parts.length - 1];       
                    let secondLastPart = parts[parts.length - 2]; 

                    if (lastPart.includes(":")) {
                        if (secondLastPart.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            timeStr = `${secondLastPart} ${lastPart}`;
                            parts.splice(-2, 2);
                        } else {
                            let today = new Date();
                            let yyyy = today.getFullYear();
                            let mm = String(today.getMonth() + 1).padStart(2, '0');
                            let dd = String(today.getDate()).padStart(2, '0');
                            timeStr = `${yyyy}-${mm}-${dd} ${lastPart}`;
                            parts.splice(-1, 1);
                        }
                        todoText = parts.join(" ");
                    }
                }

                if (!timeStr) {
                    todoText = content;
                    let targetTime = new Date(Date.now() + 60000); 
                    let yyyy = targetTime.getFullYear();
                    let mm = String(targetTime.getMonth() + 1).padStart(2, '0');
                    let dd = String(targetTime.getDate()).padStart(2, '0');
                    let hh = String(targetTime.getHours()).padStart(2, '0');
                    let min = String(targetTime.getMinutes()).padStart(2, '0');
                    timeStr = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
                }

                createTodoItem(todoText, timeStr);
                aiResponse.innerText = `AI助理: 已透過指令排定「${todoText}」，將於 ${timeStr} 準時通知！`;
            } 
            else if (userMessage.includes("淺色") || userMessage.includes("白天")) {
                document.body.className = "theme-light";
                aiResponse.innerText = "AI助理: 已將全網頁切換至預設溫暖主題！";
            } 
            else if (userMessage.includes("綠色") || userMessage.includes("駭客")) {
                document.body.className = "theme-matrix";
                aiResponse.innerText = "AI助理: 已將全網頁切換至駭客主題！";
            } 
            else if (userMessage.includes("深色") || userMessage.includes("晚上") || userMessage.includes("預設")) {
                document.body.className = "theme-dark";
                aiResponse.innerText = "AI助理: 已將全網頁切換至深色科技主題！";
            } 
            else {
                aiResponse.innerText = "AI助理: 聽不懂這個指令。試試打「深色」變換全網頁主題，或打「新增 準備期末考 15:00」！";
            }
        }, 300);

        userInput.value = "";
    });
}

setInterval(function() {
    let now = new Date();
    let currentYYYY = now.getFullYear();
    let currentMM = String(now.getMonth() + 1).padStart(2, '0');
    let currentDD = String(now.getDate()).padStart(2, '0');
    let currentHH = String(now.getHours()).padStart(2, '0');
    let currentMin = String(now.getMinutes()).padStart(2, '0');
    
    let currentTimeStr = `${currentYYYY}-${currentMM}-${currentDD} ${currentHH}:${currentMin}`;

    const items = document.querySelectorAll(".todo-item");
    items.forEach(function(item) {
        let targetTime = item.getAttribute("data-time");
        let notified = item.getAttribute("data-notified");

        if (currentTimeStr === targetTime && notified === "false") {
            item.setAttribute("data-notified", "true"); 
            let taskName = item.querySelector(".todo-text").innerText;
            window.alert(`🔔 時間到囉！\n提醒您該做這件事了：【${taskName}】`);
        }
    });
}, 1000);

function changeColor(){
    const nameSpan = document.getElementById("name-highlight");
    if (!nameSpan) return;

    const currentClass = nameSpan.className;
    
    if (currentClass === "highlight") {
        nameSpan.className = "highlight color-blue";
        if(aiResponse) aiResponse.innerText = "AI助理: 已將您的名字切換為科技藍漸層！";
    } else if (currentClass === "highlight color-blue") {
        nameSpan.className = "highlight color-green";
        if(aiResponse) aiResponse.innerText = "AI助理: 已將您的名字切換為翡翠綠漸層！";
    } else if (currentClass === "highlight color-green") {
        nameSpan.className = "highlight color-purple";
        if(aiResponse) aiResponse.innerText = "AI助理: 已將您的名字切換為神祕紫漸層！";
    } else {
        nameSpan.className = "highlight";
        if(aiResponse) aiResponse.innerText = "AI助理: 已將您的名字切換回原本的暖咖漸層！";
    }
}