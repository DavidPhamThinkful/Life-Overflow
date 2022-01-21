window.addEventListener('DOMContentLoaded', (event)=>{
    const addAnswerCreateEvent = () => {
        const answerSubmit = document.getElementById('answer-submit');
        if (answerSubmit) {
            answerSubmit.addEventListener('click', async () => {
                const answer = document.getElementById('answer-body');
                const questionId = answer.dataset.questionId;
                const body = answer.value;

                const res = await fetch(`/api/questions/${questionId}/answers`, {
                    method: 'POST',
                    body: JSON.stringify({ body }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const container = document.getElementById('answers-container');
                    const answerDiv = document.createElement('div');
                    const { body, id } = await res.json();
                    answerDiv.innerHTML += `
                        <div class="answer-container" data-answer-id=${id}>
                            <div class="votes-container">
                                <button id="upvote">up</button>
                                <button id="downvote">down</button>
                                <span id="upvote-number"></span>
                                <span id="downvote-number"></span>
                            </div>
                            <div class="answer-body-container" data-answer-id=${id}>
                                <p class="answer-body">${body}</p>
                                <button class="edit-button answer-edit-btn" data-answer-id=${id}>Edit answer</button>
                                <button class="delete-button answer-delete-btn" data-answer-id=${id}>Delete answer</button>
                            </div>
                        </div>
                    `;
                    container.appendChild(answerDiv);

                    answerSubmit.remove();
                    answer.remove();

                    addAnswerEditEvent();
                    addAnswerDeleteEvent();
                }
            });
        }
    };

    const addAnswerDeleteEvent = () => {
        const deleteAnswerBtns = document.querySelectorAll('.answer-delete-btn');
        deleteAnswerBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = window.location.pathname.split('/').filter(Boolean);
                const questionId = path[1];
                const answerId = btn.dataset.answerId;
                const res = await fetch(`/api/answers/${answerId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    const answer = document.querySelector(`.answer-container[data-answer-id='${answerId}']`);
                    answer.remove();

                    const questionDiv = document.querySelector('.question-div');
                    questionDiv.innerHTML += `
                        <textarea id="answer-body" rows="5" cols="20" data-question-id="${questionId}"></textarea>
                        <button type="submit" id="answer-submit">Post Your Answer</button>
                    `;

                    addAnswerCreateEvent();
                }
            });
        });
    };

    const addAnswerEditEvent = () => {
        const editAnswerBtns = document.querySelectorAll('.answer-edit-btn');
        editAnswerBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = window.location.pathname.split('/').filter(Boolean);
                const questionId = path[1];
                const answerId = btn.dataset.answerId;
                const answerContainer = document.querySelector(`.answer-body-container[data-answer-id='${answerId}']`);
                const currentContainerHTML = answerContainer.innerHTML;
                const currentBody = Array.from(answerContainer.children).find(c => c.className.includes('answer-body')).innerText;

                const editTextField = document.createElement('textarea');
                editTextField.id = 'answer-body-edit';
                editTextField.setAttribute('rows', '5');
                editTextField.setAttribute('cols', '50');
                editTextField.dataset.questionId = questionId;
                editTextField.innerText = currentBody;
                const editSubmitBtn = document.createElement('button');
                editSubmitBtn.innerText = 'Confirm Edit';
                const cancelSubmitBtn = document.createElement('button');
                cancelSubmitBtn.innerText = 'Cancel';

                btn.remove();
                answerContainer.replaceChildren(editTextField, editSubmitBtn, cancelSubmitBtn);

                editSubmitBtn.addEventListener('click', async () => {
                    const body = editTextField.value;

                    const res = await fetch(`/api/answers/${answerId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ body }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (res.ok) {
                        const { body, id } = await res.json();

                        answerContainer.innerHTML = `
                            <p class="answer-body">${body}</p>
                                <button class="edit-button answer-edit-btn" data-answer-id=${id}>Edit answer</button>
                                <button class="delete-button answer-delete-btn" data-answer-id=${id}>Delete answer</button>
                        `;

                        addAnswerEditEvent();
                        addAnswerDeleteEvent();
                    }
                });

                cancelSubmitBtn.addEventListener('click', () => {
                    answerContainer.innerHTML = currentContainerHTML;
                    addAnswerEditEvent();
                    addAnswerDeleteEvent();
                });
            });
        });
    };

    addAnswerCreateEvent();
    addAnswerEditEvent();
    addAnswerDeleteEvent();


    upVote.addEventListener('click', async (e) => {
        e.preventDefault();
        const res = await fetch('/answers/:answerId(\\d+)/up', {
            method: 'POST',

        });
    });
});
