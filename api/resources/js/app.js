require('./bootstrap');


document.addEventListener('DOMContentLoaded', function () {
    const deletebtns = document.getElementsByClassName('deletebtn');
    const modalBtn = document.getElementById('confirm-delete-btn');
    const titleCopy = document.getElementById('question-title-copy');
    const messages = {
        'delete': 'Voulez-vous réellement supprimer cet élément : ',
        'reset': 'Voulez-vous vraiment réinitialiser : ',
        'next-step': 'Voulez-vous vraiment passer à l\'étape suivante',
        'next-question': 'Voulez-vous vraiment passer à la question suivante',
        'display-answer': 'Voulez-vous vraiment afficher la réponse',
        'valid-winners': 'Voulez-vous vraiment valider les vainqueurs',
    }
    for (let btn of deletebtns) {
        btn.addEventListener('click', function (e) {
            let url = e.target.dataset.href;
            let title = e.target.dataset.title;

            modalBtn.href = url;
            titleCopy.innerHTML = messages[e.target.dataset.action] + '<span class="font-weight-bold">' + title + '</span> ?';
        });
    }

    let answersContainer = document.querySelector('.live-questions');
    if(answersContainer !== null) {

        // Live display of the answers
        const url = new URL(answersContainer.dataset.mercure +'.well-known/mercure');
        url.searchParams.append('topic', answersContainer.dataset.subscribe);


        const eventSource = new EventSource(url , { withCredentials: true });

        // The callback will be called every time an update is published
        eventSource.onmessage = function ({data}) {
            const noAnswer = document.querySelector('.no-answer');
            if(noAnswer !== null) {
                noAnswer.remove();
            }

            data = JSON.parse(data);
            const template = document.importNode(document.querySelector('.answer-template').content, true);
            const newAnswer = template.querySelector('div');
            newAnswer.textContent = data.player;
            if(data.answer === true) {
                newAnswer.classList.add('alert-success');
            }
            answersContainer.append(newAnswer);

            const laterPlayer = document.querySelector(`div[data-later="${data.player}"`);
            laterPlayer.remove();
            const latersContainer = document.querySelector('.laters');
            if(latersContainer.childElementCount === 0) {
                latersContainer.textContent = "Tout le monde a répondu !";
            }

            const total = answersContainer.querySelectorAll('div');
            document.querySelector('.answers .current').textContent = total.length;
        };
    }

});

