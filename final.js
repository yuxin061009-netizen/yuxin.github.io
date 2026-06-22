console.log("Javascript已連結，準備進行互動");

// 姓名彈窗
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
    titleelement.innerHTML = `我的未來，由<span class="highlight">${visitorname}</span> 主宰`;
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
    newTodo.setAttribute("data-time", formattedTime); // 用於背景比對 (YYYY-MM-DD HH:mm)
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
        const datetimeVal = manualDatetime.value; // 格式通常為 YYYY-MM-DDTHH:mm

        if (text === "" || datetimeVal === "") {
            alert("請輸入完整的提醒事項與日期時間！");
            return;
        }

        // 把 HTML5 預設的 'T' 替換成空格，以符合老師畫面的 YYYY-MM-DD HH:mm 格式
        const formattedTime = datetimeVal.replace("T", " ");

        // 呼叫建立功能
        createTodoItem(text, formattedTime);

        // 清空手動輸入欄位
        manualText.value = "";
        manualDatetime.value = "";
        aiResponse.innerText = `AI助理: 偵測到您手動新增了「${text}」，已幫您記錄！`;
    });
}

// ==========================================
// 2. 虛擬 AI 指令輸入框連動
// ==========================================
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

                // 呼叫建立功能
                createTodoItem(todoText, timeStr);
                aiResponse.innerText = `AI助理: 已透過指令排定「${todoText}」，將於 ${timeStr} 彈出通知！`;
            } 
            // 主題變換功能
            else if (userMessage.includes("淺色") || userMessage.includes("白天")) {
                document.body.className = "theme-light";
                aiResponse.innerText = "AI助理: 已切換至淺色主題！";
            } 
            else if (userMessage.includes("綠色") || userMessage.includes("駭客")) {
                document.body.className = "theme-matrix";
                aiResponse.innerText = "AI助理: 已切換至駭客主題！";
            } 
            else if (userMessage.includes("深色") || userMessage.includes("晚上")) {
                document.body.className = "";
                aiResponse.innerText = "AI助理: 已切換至預設主題！";
            } 
            else {
                aiResponse.innerText = "AI助理: 聽不懂這個指令。可以試試「新增 吃晚餐 18:30」或手動在下方填寫喔！";
            }
        }, 300);

        userInput.value = "";
    });
}

// ==========================================
// 3. 背景自動檢查計時器 (每秒比對時間)
// ==========================================
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
    const highlight = document.querySelector(".highlight");
    if (highlight) {
        highlight.classList.toggle("aurora-text");
    }
}
