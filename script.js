// 1. Отправка комментария
document.getElementById("comment-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Отменяем перезагрузку страницы
    
    // Получаем данные формы (соответствуют CommentCreate в FastAPI)
    const formData = {
        name: e.target.elements.name.value,
        comment: e.target.elements.comment.value
    };

    // Отправляем POST-запрос
    try {
        const response = await fetch("http://127.0.0.1:8000/comments", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Ошибка сервера");
        }

        const result = await response.json();
        alert("Комментарий отправлен!");
        e.target.reset(); // Очищаем форму
        loadComments();   // Обновляем список
        
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при отправке: " + error.message);
    }
});

// 2. Загрузка комментариев
async function loadComments() {
    try {
        const response = await fetch("http://127.0.0.1:8000/comments");
        
        if (!response.ok) {
            throw new Error("Не удалось загрузить комментарии");
        }
        
        const comments = await response.json();
        const commentsList = document.getElementById("comments-list");
        
        if (comments.length === 0) {
            commentsList.innerHTML = "<p>Пока нет комментариев</p>";
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment" style="margin: 10px; padding: 10px; border: 1px solid #ddd;">
                <strong>${comment.name}</strong>
                <p>${comment.comment}</p>
                <small>ID: ${comment.id}</small>
            </div>
        `).join("");
        
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        document.getElementById("comments-list").innerHTML = 
            "<p style='color: red'>Ошибка загрузки комментариев</p>";
    }
}

// Загружаем комментарии при открытии страницы
document.addEventListener("DOMContentLoaded", loadComments);