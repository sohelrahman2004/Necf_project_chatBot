try {
    const modelResponse = await fetchOpenAIResponse(query);

    // Display model response in the chat log

    displayMessage("Euphoria", modelResponse);

} catch (error) {

    console.error("Error fetching response from OpenAI:", error);
}

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