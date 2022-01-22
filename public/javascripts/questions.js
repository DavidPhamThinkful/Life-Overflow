window.addEventListener('DOMContentLoaded', async ()=>{
    const path = window.location.pathname.split('/').filter(Boolean);
    const questionId = path[1];
    const { dataset } = document.getElementById('data');
    const ownerId = parseInt(dataset.ownerId);
    const isUser = dataset.isUser === 'true';
    const userId = parseInt(dataset.userId) || undefined;

    const hasAnswered = async (userId) => {
        const res = await fetch(`/api/questions/${questionId}/answers`);
        const { answers } = await res.json();
        return answers.some(answer => answer.userId === userId);
    };

    const isOwner = () => {
        return userId === ownerId;
    };

    const createAnswerForm = () => {
        const questionContainer = document.querySelector('.question-div');
        const formContainer = document.createElement('div');
        formContainer.id = 'answer-form-container';
        const textarea = document.createElement('textarea');
        textarea.id = 'answer-body';
        textarea.setAttribute('rows', '5');
        textarea.setAttribute('cols', '50');
        const button = document.createElement('button');
        button.id = 'answer-submit';
        button.innerText = 'Post Your Answer';

        button.addEventListener('click', async () => {
            const body = textarea.value;

            const res = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                body: JSON.stringify({ body }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const { answer } = await res.json();
                createAnswerElements(answer);
                await updateAnswerCounter();
                removeAnswerForm();
            }
        });

        formContainer.append(textarea, button);
        questionContainer.appendChild(formContainer);

    };

    const removeAnswerForm = () => {
        const formContainer = document.getElementById('answer-form-container');
        formContainer.remove();
    };

    const updateAnswerCounter = async () => {
        const answerCounter = document.querySelector('.answer-amount');

        const res = await fetch(`/api/questions/${questionId}/answers`);

        if (res.ok) {
            const { answers } = await res.json();
            const count = answers.length;

            answerCounter.innerText = `${count} Answers`;
        }
    };

    if (isUser && !await hasAnswered(userId) && !isOwner()) {
        createAnswerForm();
    }

    const createAnswerElements = (answer) => {
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-container');
        answerContainer.dataset.answerId = answer.id;

        const votesContainer = document.createElement('div');
        votesContainer.id = 'votes-container';
        votesContainer.dataset.answerId = answer.id;

        if (isUser) {
            const upvoteBtn = document.createElement('button');
            upvoteBtn.classList.add('btn');
            upvoteBtn.dataset.value = 'up';
            upvoteBtn.innerText = 'Up';
            const downvoteBtn = document.createElement('button');
            downvoteBtn.classList.add('btn');
            downvoteBtn.dataset.value = 'down';
            downvoteBtn.innerText = 'Down';

            votesContainer.append(upvoteBtn, downvoteBtn);
        }

        const upvoteCounter = document.createElement('span');
        upvoteCounter.classList.add('upvote-counter');
        upvoteCounter.innerText = answer.upvoteCounter;
        const downvoteCounter = document.createElement('span');
        downvoteCounter.classList.add('downvote-counter');
        downvoteCounter.innerText = answer.downvoteCounter;
        votesContainer.append(upvoteCounter, downvoteCounter);

        const bodyContainer = document.createElement('div');
        bodyContainer.classList.add('answer-body-container');
        const bodyText = document.createElement('p');
        bodyText.classList.add('answer-body');
        bodyText.innerText = answer.body;
        bodyContainer.appendChild(bodyText);

        if (isUser && answer.userId === userId) {
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn');
            editBtn.innerText = 'Edit answer';
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn');
            deleteBtn.innerText = 'Delete answer';
            bodyContainer.append(editBtn, deleteBtn);

            editBtn.addEventListener('click', async () => {
                const editTextField = document.createElement('textarea');
                editTextField.id = 'answer-body-edit';
                editTextField.setAttribute('rows', '5');
                editTextField.setAttribute('cols', '50');
                editTextField.dataset.questionId = questionId;
                editTextField.innerText = bodyText.innerText;
                const editSubmitBtn = document.createElement('button');
                editSubmitBtn.innerText = 'Confirm Edit';
                const cancelSubmitBtn = document.createElement('button');
                cancelSubmitBtn.innerText = 'Cancel';

                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
                bodyText.style.display = 'none';
                bodyContainer.append(editTextField, editSubmitBtn, cancelSubmitBtn);

                editSubmitBtn.addEventListener('click', async () => {
                    const body = editTextField.value;

                    const res = await fetch(`/api/answers/${answer.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({ body }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (res.ok) {
                        editTextField.remove();
                        editSubmitBtn.remove();
                        cancelSubmitBtn.remove();
                        editBtn.style.display = 'inline-block';
                        deleteBtn.style.display = 'inline-block';
                        bodyText.style.display = 'block';

                        bodyText.innerText = await res.json();
                    }
                });

                cancelSubmitBtn.addEventListener('click', () => {
                    editTextField.remove();
                    editSubmitBtn.remove();
                    cancelSubmitBtn.remove();
                    editBtn.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                    bodyText.style.display = 'block';
                });
            });

            deleteBtn.addEventListener('click', async () => {
                const res = await fetch(`/api/answers/${answer.id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    answerContainer.remove();
                    await updateAnswerCounter();
                    createAnswerForm();
                }
            });
        }

        answerContainer.append(votesContainer, bodyContainer);
        answersContainer.append(answerContainer);
    };


    const res = await fetch(`/api/questions/${questionId}/answers`);
    const { answers } = await res.json();
    const answersContainer = document.getElementById('answers-container');

    answers.forEach(answer => {
        createAnswerElements(answer);
    });

    // ! =================================================================
    // !  UP VOTES
    // ! =================================================================
    const voteContainer = document.querySelector('#votes-container');
    voteContainer.addEventListener('click', async (e) => {
        if (e.target.tagName !== 'BUTTON') return;

        const answerId = voteContainer.dataset.answerId;
        const value = e.target.dataset.value === 'up';

        const res = await fetch(`/api/answers/${answerId}/votes`, {
            method: 'PUT',
            body: JSON.stringify({ value }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            const res = await fetch(`/api/answers/${answerId}`);
            const { upvoteCounter, downvoteCounter } = (await res.json()).answer;

            Array.from(voteContainer.children).find(child => child.classList.contains('upvote-counter')).innerText = upvoteCounter;
            Array.from(voteContainer.children).find(child => child.classList.contains('downvote-counter')).innerText = downvoteCounter;
        }
    });

    // ! =================================================================
    // !  DOWN VOTES
    // ! =================================================================
    // const downVote = document.querySelector('#downvote');
    // downVote.addEventListener('click', async (e) => {
    //     e.preventDefault();

    //     const answerId = downVote.dataset.answerId;
    //     const voteValue = downVote.value;

    //     const res = await fetch(`/api/answers/${answerId}/down`, {
    //         method: 'POST',
    //         body: JSON.stringify({ voteValue }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    // });
    // ! =================================================================
    // !  END VOTES
    // ! =================================================================
});