const sendBtn = document.querySelector('.send');
const container = document.querySelector('.container');
const userMessage = document.querySelector('#userMessage');
const sampleQueries = document.querySelectorAll('.container > div')

const openAiApiKey = "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";
const googleSearchApiKey = "AIzaSyDMpl_TDQNh3v4NI7bHe3ArCm5rxE_vk3w" || "AIzaSyCxcTqoUOX4mpQhV7hcHJoot_mDd1Sbi5s";
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
    if (user == 'Euphoria') {
        // newMessage.style.backgroundColor = "rgba(0, 0, 0, 0.306)";
        newMessage.classList.add('highlight');
        setTimeout(() => {
            // newMessage.style.backgroundColor = "transparent";
            newMessage.classList.remove('highlight');
        }, 1000);
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

async function fetchDarkJoke() {
    const darkJokes = [
        'I told my wife she should embrace her mistakes. She gave me a hug.',
        `Why don't scientists trust atoms ? Because they make up everything, even the dark stuff.`,
        `I asked the librarian if the library had books on paranoia. She whispered, "They're right behind you."`,
        'I used to play piano by ear, but now I use my hands and fingers.',
        'My wife told me I should embrace my mistakes. So I gave her a hug.',
        `I only know 25 letters of the alphabet. I don’t know y and z.`,
        `I asked the doctor for something to cure my kleptomania. He gave me pills and said, "If those don’t work, get me a TV."`,
        `I'm reading a book on anti - gravity.It's impossible to put down.`,
        `I told my computer I needed a break, and now it won’t stop sending me vacation ads.`,
        `Why don’t skeletons fight each other? They don’t have the guts.`,
    ];

    const randomDarkJoke = darkJokes[Math.floor(Math.random() * darkJokes.length)];

    return randomDarkJoke;
}

function calculate(query) {
    try {
        const result = math.evaluate(query);
        return result;
    } catch (error) {
        return "Error in calculation";
    }
}

function containsMathExpression(query) {

    const mathExpressionRegex = /[+\-*/\d()]/;
    return mathExpressionRegex.test(query);
}

async function sendMessage() {
    if (userMessage.value != "") {

        if (!container.classList.contains('chat-mode')) {
            container.innerHTML = "";
        }

        let query;
        let formattedQuery;
        let response;

        container.classList.add('chat-mode')
        query = userMessage.value;
        formattedQuery = query.toLowerCase().trim();
        userMessage.value = "";

        displayMessage("You", query);

        if (formattedQuery == ("hello") || formattedQuery == ("hey") || formattedQuery == ("hi")) {
            response = "Hello, how may I help you today ?";
            displayMessage("Euphoria", response);
            return;
        }

        if (containsMathExpression(query) && (query.toLowerCase().includes("what is") || query.toLowerCase().includes("calculate") || query.toLowerCase().includes("Evaluate"))) {
            const mathQuery = query.toLowerCase().replace("what is", "").replace("calculate", "").replace("evaluate", "");
            const mathResult = calculate(mathQuery);
            displayMessage("Euphoria", `${mathQuery} = ${mathResult}`)
            console.log(mathResult);
            return;
        }

        if (query.toLowerCase().includes('tell me a joke') || (query.toLowerCase().includes('jokes') && query.toLowerCase().includes('say')) || ((query.toLowerCase().includes('jokes') || query.toLowerCase().includes('joke')) && query.toLowerCase().includes('tell'))) {
            const joke = await fetchDarkJoke();
            displayMessage('Euphoria', joke);
            return;
        }


        if (query.toLowerCase().includes('play') || (query.toLowerCase().includes('play') && query.toLowerCase().includes('youtube')) || (query.toLowerCase().includes('search') && query.toLowerCase().includes('youtube'))) {
            const youtubeSearchApiUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}&part=snippet&key=AIzaSyAFrBrByQtCD-dbImaAkcJIvOwEyaG3eXA`;

            fetch(youtubeSearchApiUrl)
                .then(response => response.json())
                .then(data => {
                    const videoId = data.items[0].id.videoId;
                    const youtubeVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    setTimeout(() => {
                        window.location.href = youtubeVideoUrl;
                    }, 500);
                    displayMessage("Euphoria", "Playing...");
                })
                .catch(error => {
                    console.error('Error fetching YouTube API:', error);
                    displayMessage("Euphoria", 'Sorry, there was an error fetching the video.');

                });
            return;
        }
        if (formattedQuery.includes('search') || formattedQuery.includes('google')) {
            query = query.replace("search", "").replace("for", "").replace("on", "").replace("google", "");
            displayMessage("Euphoria", `Searching "${query}"...`);
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            setTimeout(() => {
                window.location.href = googleSearchUrl;
            }, 700);
            return;
        }

        if (formattedQuery.includes('how are you')) {
            displayMessage('Euphoria', `I'm doing well. What can I help you with?`);
            return;
        }
        if (formattedQuery.includes('who are you') || formattedQuery.includes('introduce yourself') || formattedQuery.includes('your introduction')) {
            displayMessage('Euphoria', `I'm Euphoria, a chatBot powered by OpenAI and various other APIs. Is there anything I can help you with ?`);
            return;
        }

        if (formattedQuery.includes('your name') && formattedQuery.includes('what')) {
            displayMessage("Euphoria", `I'm Euphoria. Is there anything I can help you with?`);
            return;
        }

        if (formattedQuery.includes('who is your creator') && formattedQuery.includes('who made you') || formattedQuery.includes('who are you made by') || formattedQuery.includes('who is ush') || formattedQuery.includes('who is ushnish') || formattedQuery.includes('ushnish') || formattedQuery == 'ush') {
            displayMessage("Euphoria", `<a style="color:blueviolet;" href="https://github.com/plushexe351">Ushnish Tapaswi</a> is my creator. Is there anything I can help you with?`);
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
                    for (let i = 0; i < Math.min(2, data.items.length); i++) {
                        const result = data.items[i];
                        const title = result.title;
                        const snippet = result.snippet;
                        const link = result.link;

                        console.log(snippet);

                        if (formattedQuery.includes('open') && !formattedQuery.includes('openai')) {
                            displayMessage("Euphoria", "Opening...")
                            setTimeout(() => {
                                window.location.href = link;
                            }, 500);
                            return;
                        }

                        displayMessage("Euphoria", `${snippet}` + `<br/>(${title})` + `<br/><a target="_blank" href="${link}" style="color:blueviolet">Click here to view full result on Google</a>`);
                    }
                }
            } catch (error) {
                console.error('Error fetching search results from Google:', error.message);
            }
        }
        if (formattedQuery == "clear") { container.innerHTML = ""; return; }
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


