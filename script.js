const sendBtn = document.querySelector('.send');
const container = document.querySelector('.container');
const userMessage = document.querySelector('#userMessage');
const sampleQueries = document.querySelectorAll('.container > div')
const apiKey = "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";
const showHistoryBtn = document.querySelector('.fa-history');
const historyModal = document.querySelector('.history-modal');
const historyContainerDOM = document.querySelectorAll('.history-container');

showHistoryBtn.addEventListener('click', () => {
    historyModal.classList.toggle('active');
})

// historyContainerDOM.forEach(container => {
//     container.addEventListener('click', () => {
//         console.log("ok");
//         historyModal.classList.remove('active');
//     })
// })

// historyModal.addEventListener('click', () => {
//     historyModal.classList.remove('active');
// })


// Display user or chatbot message 
function displayMessage(user, message) {

    const newMessage = document.createElement('div');
    const username = document.createElement('h3');
    const timestamp = document.createElement('p');
    const messageContent = document.createElement('p');
    const time = new Date().toLocaleTimeString();
    const day = new Date().toLocaleDateString();

    timestamp.classList.add('time');
    messageContent.classList.add('message');
    username.textContent = user;
    messageContent.textContent = message;
    timestamp.textContent = time;

    newMessage.appendChild(username);
    newMessage.appendChild(timestamp);
    newMessage.appendChild(messageContent);
    container.appendChild(newMessage);

    container.scrollTop = container.scrollHeight;

    // Log History 

    if (user == "You") {

        const historyContainer = document.createElement('div');
        const historyMsg = document.createElement('p');
        const timeAdded = document.createElement('span');
        const dateAdded = document.createElement('span');

        historyContainer.classList.add('history-container');
        dateAdded.classList.add('time-added');
        timeAdded.classList.add('time-added');

        timeAdded.textContent = time;
        dateAdded.textContent = day.toString();
        historyMsg.textContent = message;
        historyContainer.appendChild(dateAdded);
        historyContainer.appendChild(timeAdded);
        historyContainer.appendChild(historyMsg);
        historyModal.appendChild(historyContainer);
        historyContainer.addEventListener('click', () => {
            userMessage.value = historyMsg.textContent;
            historyModal.classList.remove('active');
            sendBtn.click();
        })

    }
}

// Send sample queries

sampleQueries.forEach(query => {

    query.addEventListener('click', () => {
        setTimeout(() => {
            userMessage.value = query.textContent;
            sendBtn.click();
        }, 300);
    })

})

// handle submit button and queries 

async function sendMessage() {
    if (userMessage.value != "") {

        if (!container.classList.contains('chat-mode')) {
            container.innerHTML = "";
        }

        let query;
        let response;

        container.classList.add('chat-mode')
        query = userMessage.value;
        userMessage.value = "";

        displayMessage("You", query);

        if (query == ("hello") || query == ("hey") || query == ("hi")) {
            response = "Hello Sir, how may I help you today ?";
            // setTimeout(() => {
            displayMessage("Euphoria", response);
            // }, 1000);
            return;
        }

        const websites = ["youtube", "google", "wikipedia", "instagram", "facebook", "pinterest"];

        if (query.includes('open')) {
            websites.forEach(website => {
                if (query.includes(website))
                    displayMessage("Euphoria", `Opening ${website}`);
            })
            return;
        }


        try {
            const modelResponse = await fetchOpenAIResponse(query);

            // Display model response in the chat log

            displayMessage("Euphoria", modelResponse);
        } catch (error) {
            console.error("Error fetching response:", error);
            displayMessage(
                "Euphoria", "Sorry, there was an error fetching the response."
            );
        }

        if (query == "clear") container.innerHTML = "";

    }
}

// fetch openAI response

async function fetchOpenAIResponse(prompt) {
    const apiUrl = "https://api.openai.com/v1/engines/davinci/completions";
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 100,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}


// keyboard support 

document.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        sendBtn.click();
    }
})


