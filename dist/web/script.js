let selectedNoteId = null;  // Переменная для хранения ID выбранной заметки

    // Функция для добавления заметки
    function addNote() {
        const noteText = document.getElementById('note').value;
        if (noteText.trim() === '') return;

        eel.add_note(noteText)(function() {
            updateNotesList();  // Обновляем список после добавления
            document.getElementById('note').value = '';
        });
    }

    // Функция для отображения текста выбранной заметки
    function selectNote(noteId) {
        selectedNoteId = noteId;

        eel.get_note_text(noteId)(function(noteText) {
            const textarea = document.querySelector('.text-of-note textarea');
            textarea.value = noteText || '';
        });
    }

    // Функция для сохранения изменений в тексте заметки
    function saveNoteChanges() {
        if (selectedNoteId === null) return;

        const newText = document.querySelector('.text-of-note textarea').value;

        eel.update_note_text(selectedNoteId, newText)(function() {
            updateNotesList();  // Обновляем список заметок после изменений
        });
    }

    // Функция для обновления списка заметок
    function updateNotesList() {
        eel.get_notes()(function(notes) {
            const notesList = document.getElementById('notes_list');
            notesList.innerHTML = '';  // Очищаем текущий список

            notes.forEach(function(note) {
                const li = document.createElement('li');
                li.textContent = note.note;

                // Создание кнопки для удаления
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.className = 'delete-btn';
                deleteButton.onclick = function() {
                    deleteNote(note.id);  // Удаление заметки по ID
                };

                // Добавляем обработчик для выбора заметки
                li.onclick = function() {
                    selectNote(note.id);  // Выбор заметки по ID
                };

                li.appendChild(deleteButton);
                notesList.appendChild(li);
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