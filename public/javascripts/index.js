window.addEventListener('DOMContentLoaded', (event)=>{
    // ! =================================================================
    // !  UP VOTES
    // ! =================================================================
    const upVote = document.querySelector('#upvote');
    upVote.addEventListener('click', async (e) => {
        e.preventDefault();

        const answerId = upVote.dataset.answerId;
        const voteValue = upVote.value;

        const res = await fetch(`/api/answers/${answerId}/up`, {
            method: 'POST',
            body: JSON.stringify({ voteValue }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    // ! =================================================================
    // !  DOWN VOTES
    // ! =================================================================
    const downVote = document.querySelector('#downvote');
    downVote.addEventListener('click', async (e) => {
        e.preventDefault();

        const answerId = downVote.dataset.answerId;
        const voteValue = downVote.value;

        const res = await fetch(`/api/answers/${answerId}/down`, {
            method: 'POST',
            body: JSON.stringify({ voteValue }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
    // ! =================================================================
    // !  END VOTES
    // ! =================================================================

});
