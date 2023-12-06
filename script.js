const sendBtn = document.querySelector('.send');
const container = document.querySelector('.container');
const userMessage = document.querySelector('#userMessage');
const sampleQueries = document.querySelectorAll('.container > div')

const openAiApiKey = "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";
const googleSearchApiKey = "AIzaSyDMpl_TDQNh3v4NI7bHe3ArCm5rxE_vk3w";
const cx = "672ad82a944ee4d61";

const showHistoryBtn = document.querySelector('.fa-history');
const historyModal = document.querySelector('.history-modal');
const historyContainerDOM = document.querySelectorAll('.history-container');

showHistoryBtn.addEventListener('click', () => {
    historyModal.classList.toggle('active');
})

historyModal.addEventListener('click', () => {
    historyModal.classList.remove('active');

})
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
    messageContent.innerHTML = message;
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
            sendMessage();
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

        if (query.toLowerCase() == ("hello") || query.toLowerCase() == ("hey") || query.toLowerCase() == ("hi")) {
            response = "Hello, how may I help you today ?";
            // setTimeout(() => {
            displayMessage("Euphoria", response);
            // }, 1000);
            return;
        }


        if (query.toLowerCase().includes('play') || (query.toLowerCase().includes('play') && query.toLowerCase().includes('youtube')) || (query.toLowerCase().includes('search') && query.toLowerCase().includes('youtube'))) {
            const youtubeSearchApiUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}&part=snippet&key=AIzaSyAFrBrByQtCD-dbImaAkcJIvOwEyaG3eXA`;

            fetch(youtubeSearchApiUrl)
                .then(response => response.json())
                .then(data => {
                    const videoId = data.items[0].id.videoId;
                    const youtubeVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    window.open(youtubeVideoUrl, '_blank');
                    displayMessage("Euphoria", "Playing...")
                })
                .catch(error => {
                    console.error('Error fetching YouTube API:', error);
                    displayMessage("Euphoria", 'Sorry, there was an error fetching the video.');

                });
            return;
        }
        if (query.toLowerCase().includes('search') || query.toLowerCase().includes('google')) {
            query = query.replace("search", "").replace("for", "").replace("on", "").replace("google", "");
            displayMessage("Euphoria", `Searching "${query}"...`);
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            setTimeout(() => {
                window.open(googleSearchUrl, '_blank');
            }, 700);
            return;
        }

        if (query.toLowerCase().includes('how are you')) {
            displayMessage('Euphoria', `I'm doing well. What can I help you with?`);
            return;
        }
        if (query.toLowerCase().includes('who are you')) {
            displayMessage('Euphoria', `I'm Euphoria, a chatBot powered by OpenAI and various other APIs. Is there anything I can help you with ?`);
            return;
        }

        if (query.toLowerCase().includes('your name') && query.toLowerCase().includes('what')) {
            displayMessage("Euphoria", `I'm Euphoria. Is there anything I can help you with?`);
            return;
        }

        try {
            const modelResponse = await fetchOpenAIResponse(query);

            // Display model response in the chat log

            displayMessage("Euphoria", modelResponse);

        } catch (error) {

            console.error("Error fetching response from OpenAI:", error);

            const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleSearchApiKey}&cx=${cx}`;

            try {
                const response = await fetch(googleSearchApiUrl);
                const data = await response.json();

                if (data.items && data.items.length > 0) {

                    const mostRelevantResult = data.items[0];
                    const title = mostRelevantResult.title;
                    const snippet = mostRelevantResult.snippet;
                    const link = mostRelevantResult.link;

                    console.log(snippet);


                    if (query.toLowerCase().includes('open')) {
                        displayMessage("Euphoria", "Opening...")
                        window.open(link);
                        return;
                    }
                    displayMessage("Euphoria", `${snippet}` + `<br/>(${title})` + `<br/><a target="_blank" href="${link}"style="color:blueviolet">Click here to view full result on Google</a>`);
                }
                // Now "data" contains the search results from Google
                console.log(data);
            } catch (error) {
                console.error('Error fetching search results from Google:', error.message);
            }
        }
        if (query == "clear") { container.innerHTML = ""; return; }
    }
}

// fetch openAI response

async function fetchOpenAIResponse(prompt) {
    const apiUrl = "https://api.openai.com/v1/engines/davinci/completions";
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiApiKey}`,
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
        e.preventDefault();
        sendMessage();
    }
})


