window.addEventListener('DOMContentLoaded', (event)=>{
    const addAnswerSubmitEvent = () => {
        const answerSubmit = document.getElementById('answer-submit');
        if (answerSubmit) {
            answerSubmit.addEventListener('click', async e => {
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
                    answerDiv.innerHTML +=
                `
                    <div class="answer-container" data-answer-id=${id}>
                        <div class="votes-container">
                            <button id="upvote">up</button>
                            <button id="downvote">down</button>
                            <span id="upvote-number"></span>
                            <span id="downvote-number"></span>
                        </div>
                        <div class="answer-description-container">
                            <p class="answer-description">${body}</p>
                            <button class="edit-button answer-edit-btn">Edit answer</button>
                            <button class="delete-button answer-delete-btn" data-answer-id=${id}>Delete answer</button>
                        </div>
                    </div>
                `;
                    container.appendChild(answerDiv);

                    answerSubmit.remove();
                    answer.remove();
                    addDeleteButtonEvent();
                }
            });
        }
    };

    const addDeleteButtonEvent = () => {
        const deleteAnswerBtns = document.querySelectorAll('.answer-delete-btn');
        deleteAnswerBtns.forEach(btn => {
            btn.addEventListener('click', async e => {
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

                    addAnswerSubmitEvent();
                }
            });
        });
    };

    addAnswerSubmitEvent();
    addDeleteButtonEvent();
});
