window.addEventListener('load', (event)=>{
    console.log('hello from javascript!');
});


const upVote = document.querySelector('#upvote');
const downVote = document.querySelector('#downvote');

upVote.addEventListener('click', async (e) => {
    e.preventDefault();
    const res = await fetch('/answers/:answerId(\\d+)/up', {
        method: 'POST',

    });


});


downVote.addEventListener('click', async (e) => {

    console.log('DOWNVOTE <- <-', downVote.dataset.id);


});
