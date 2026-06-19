// 1. 控制台連結測試
console.log("Javascript已連結，準備進行互動");

// 2. 利用 defer 特性，直接安全地跳出對話框
let visitorname = prompt("請輸入你的名字:");

if (visitorname === '' || visitorname === null ){
    visitorname = "訪客";
}

window.alert("Hello, " + visitorname + ", 歡迎來到我的網站!");

// 3. 更新網頁上的文字與 Logo
const logoelement = document.getElementById("main-logo");
if (logoelement) {
    logoelement.innerText = visitorname + "的網站";
}

const titleelement = document.getElementById("hero-title");
if (titleelement) {
    titleelement.innerHTML = `我的未來，由<span class="highlight">${visitorname}</span> 主宰`;
}

// 4. AI 指令與待辦事項連動控制系統 (高分實作)
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const aiResponse = document.getElementById("ai-response");
const todoList = document.getElementById("todo-list");

if (sendBtn && userInput && aiResponse && todoList) {
    sendBtn.addEventListener("click", function() {
        const userMessage = userInput.value.trim(); // 去除前後空格
        
        if (userMessage === "") {
            alert("請先輸入指令!");
            return;
        }

        setTimeout(function() {
            // 🎯 【加分關鍵】判斷是否為新增待辦事項指令
            if (userMessage.startsWith("新增 ")) {
                // 擷取「新增 」後面的所有文字作為待辦項目內容
                const todoText = userMessage.replace("新增 ", "").trim();
                
                if (todoText === "") {
                    aiResponse.innerText = "AI助理: 請在「新增」後面填寫具體項目名稱喔！";
                    return;
                }

                // 1. 動態建立一筆新的待辦事項網頁元素 (DOM)
                const newTodo = document.createElement("li");
                newTodo.innerHTML = `
                    <span>${todoText}</span>
                    <button class="delete-btn" onclick="this.parentElement.remove()">❌</button>
                `;

                // 2. 把新項目塞到列表的最前面
                todoList.insertBefore(newTodo, todoList.firstChild);

                // 3. AI 反饋回報
                aiResponse.innerText = `AI助理: 已成功幫你新增待辦事項：「${todoText}」！`;
            } 
            // 原本的主題切換功能完美保留
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
                aiResponse.innerText = "AI助理: 聽不懂這個指令耶。可以試試看打「新增 買宵夜」或「綠色」喔！";
            }
        }, 300);

        userInput.value = "";
    });
}

// 5. 變換顏色按鈕全域功能
function changeColor(){
    const highlight = document.querySelector(".highlight");
    if (highlight) {
        highlight.classList.toggle("aurora-text");
    }
}