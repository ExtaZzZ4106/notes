let selectedNoteId = null;  // Переменная для хранения ID выбранной заметки
let activeNoteElement = null;  // Переменная для хранения активного элемента
window.onresize = function () {
    window.resizeTo(935, 705);
    }
    // Функция для добавления заметки
    function addNote() {
        const noteText = document.getElementById('note').value;
        if (noteText.trim() === '') return;

        eel.add_note(noteText)(function() {
            updateNotesList();  // Обновляем список после добавления
            document.getElementById('note').value = '';
        });
    }

   

    // Функция для сохранения изменений в тексте заметки
    function saveNoteChanges() {
        return new Promise((resolve) => {
            if (selectedNoteId === null) {
                resolve();  // Если нет выбранной заметки, продолжаем выполнение
                return;
            }

            const newText = document.querySelector('.text-of-note textarea').value;

            eel.update_note_text(selectedNoteId, newText)(function() {
                // Не обновляем список сразу
                resolve();  // Завершаем промис
            });
        });
    }



    


    // Функция для отображения текста выбранной заметки
    function selectNote(noteId, noteElement) {
        saveNoteChanges().then(() => {  // Ждем завершения сохранения перед продолжением
            selectedNoteId = noteId;

            // Убираем класс 'active' с предыдущей активной заметки
            if (activeNoteElement) {
                activeNoteElement.classList.remove('active');
            }

            // Присваиваем текущей заметке класс 'active'
            noteElement.classList.add('active');
            activeNoteElement = noteElement;

            eel.get_note_text(noteId)(function(noteText) {
                const textarea = document.querySelector('.text-of-note textarea');
                textarea.value = noteText || '';
            });
        });
    }

    // Функция для обновления списка заметок
    function updateNotesList() {
        eel.get_notes()(function(notes) {
            const notesList = document.getElementById('notes_list');
            notesList.innerHTML = '';  // Очищаем текущий список

            notes.forEach(function(note) {
                const li = document.createElement('li');
                li.className = 'note-item';

                // Проверяем, активная ли это заметка
                if (note.id === selectedNoteId) {
                    li.classList.add('active');  // Восстанавливаем выделение
                    activeNoteElement = li;  // Сохраняем элемент как активный
                }

                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'overlay-div'; 

                const span = document.createElement('span');
                span.textContent = note.note;
                span.className = 'note-text';

                // Создание кнопки для удаления
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.className = 'delete-btn';
                deleteButton.onclick = function() {
                    deleteNote(note.id);  // Удаление заметки по ID
                };

                // Добавляем обработчик для выбора заметки
                li.onclick = function() {
                    selectNote(note.id, li);  // Передаем ID и элемент заметки
                };

                li.appendChild(span);  // Вставляем span с текстом
                li.appendChild(deleteButton);
                notesList.appendChild(li);
                li.appendChild(overlayDiv);
            });
        });
    }


    // Функция для удаления заметки по ID
    function deleteNote(noteId) {
        eel.delete_note(noteId)(function() {
            updateNotesList();  // Обновляем список после удаления
            const textarea = document.querySelector('.text-of-note textarea');
            textarea.value = '';  // Очищаем текстовую область
            selectedNoteId = null;  // Сбрасываем выбранную заметку
        });
    }

    // Обновляем список заметок при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        updateNotesList();  // Загружаем список заметок при загрузке страницы
    });

    // Обработчик для кнопки сохранения изменений
    document.querySelector('.header-2 button').onclick = saveNoteChanges;