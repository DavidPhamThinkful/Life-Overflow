window.addEventListener('DOMContentLoaded', (event)=>{
    const answerSubmit = document.getElementById('answer-submit');
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
            const { body } = await res.json();
            answerDiv.innerHTML +=
            `
                <div class="answer-container">
                    <div class="votes-container">
                        <button id="upvote">up</button>
                        <button id="downvote">down</button>
                        <span id="upvote-number"></span>
                        <span id="downvote-number"></span>
                    </div>
                    <div class="answer-description-container">
                        <p class="answer-description">${body}</p>
                        <button class="edit-button answer-edit-btn">Edit answer</button>
                        <button class="delete-button answer-delete-btn" data-id="17">Delete answer</button>
                    </div>
                </div>
            `;
            container.appendChild(answerDiv);

            answerSubmit.remove();
            answer.remove();
        }
    });
});
