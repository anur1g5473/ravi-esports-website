/* ============================================
   RAVI ESPORTS AI CHATBOT
   Powered by Google Gemini
   ============================================ */

// ============================================
// GEMINI API CONFIGURATION
// ============================================
const GEMINI_API_KEY = 'YAIzaSyAU0irppZNz9ZzAVeStchbmu-lSv07Vf7o'; // Replace with your key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ============================================
// SYSTEM CONTEXT FOR AI
// ============================================
const SYSTEM_CONTEXT = `
You are the official AI assistant for RAVI ESPORTS, a professional Free Fire esports guild.

ABOUT RAVI ESPORTS:
- Guild Name: RAVI ESPORTS
- Tagline: "Born To Rush. Built To Win."
- Game: Free Fire (Garena Free Fire)
- Teams: RAVI ESPORTS (Main Squad), RE PRO (Secondary Squad)
- Founded: 2022
- Total Members: 21+
- Focus: Competitive tournaments, scrims, and ranked matches
- Requirements to join: Minimum Platinum rank, 2.0+ K/D ratio, active on Discord

HOW TO JOIN:
1. Visit the website's "Join Us" section
2. Fill the application form with Free Fire UID
3. Wait for admin review
4. Get accepted and join Discord server

YOUR PERSONALITY:
- You are friendly, enthusiastic, and passionate about gaming
- You use gaming slang like "Booyah!", "GG", "clutch", "squad wipe"
- You add relevant emojis to make responses engaging
- You're knowledgeable about Free Fire meta, characters, weapons, and strategies
- You always promote RAVI ESPORTS positively
- Keep responses concise but helpful (max 150 words unless detailed info is needed)

FREE FIRE KNOWLEDGE:
- Best Characters (2024): Alok, K, Skyler, Homer, Dimitri, Chrono, Moco
- Best Weapons: M4A1, AK, Groza, MP40, M1887, AWM, Kar98k
- Game Modes: Battle Royale, Clash Squad, Ranked
- Maps: Bermuda, Kalahari, Purgatory, Alpine
- Popular landing spots: Clock Tower, Bimasakti, Factory, Pochinok

RULES:
- Always stay in character as RAVI ESPORTS bot
- If asked about other games, you can briefly answer but redirect to Free Fire
- Never share harmful, inappropriate, or offensive content
- If you don't know something, say so honestly
- Encourage users to join RAVI ESPORTS guild
`;

// ============================================
// CHATBOT DOM ELEMENTS
// ============================================
const chatElements = {
    container: document.getElementById('chatbot-container'),
    toggle: document.getElementById('chatbot-toggle'),
    window: document.getElementById('chatbot-window'),
    close: document.getElementById('chatbot-close'),
    messages: document.getElementById('chatbot-messages'),
    input: document.getElementById('chatbot-input'),
    send: document.getElementById('chatbot-send'),
    quickReplies: document.querySelectorAll('.quick-reply'),
    notification: document.getElementById('chat-notification')
};

// ============================================
// CHAT HISTORY FOR CONTEXT
// ============================================
let conversationHistory = [];
let chatState = {
    isOpen: false,
    hasGreeted: false,
    isProcessing: false
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatMessage(text) {
    // Convert **text** to bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert *text* to italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    return text;
}

function addMessage(text, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = formatMessage(text);
    chatElements.messages.appendChild(messageDiv);
    chatElements.messages.scrollTop = chatElements.messages.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    chatElements.messages.appendChild(typingDiv);
    chatElements.messages.scrollTop = chatElements.messages.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// ============================================
// GEMINI API CALL
// ============================================
async function callGeminiAPI(userMessage) {
    // Add user message to history
    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });
    
    // Build the request body
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: SYSTEM_CONTEXT + "\n\nNow respond to this message from a user:\n" + userMessage }]
            }
        ],
        generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };
    
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract response text
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            
            // Add bot response to history
            conversationHistory.push({
                role: "model",
                parts: [{ text: botResponse }]
            });
            
            return botResponse;
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        return getFallbackResponse(userMessage);
    }
}

// ============================================
// FALLBACK RESPONSES (If API fails)
// ============================================
function getFallbackResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.match(/^(hi|hello|hey)/)) {
        return "Hey there! 🔥 Welcome to RAVI ESPORTS! I'm having some connection issues, but I'm still here to help. Ask me about our guild, Free Fire tips, or how to join!";
    }
    
    if (msg.match(/(join|apply|member)/)) {
        return "🎮 To join RAVI ESPORTS:\n\n1. Go to 'Join Us' section\n2. Fill the application form\n3. Enter your Free Fire UID\n4. Wait for admin review\n\nRequirements: Platinum+ rank, 2.0+ K/D";
    }
    
    if (msg.match(/(about|ravi|guild|esports)/)) {
        return "🔥 **RAVI ESPORTS**\n\n'Born To Rush. Built To Win.'\n\nWe're a competitive Free Fire guild with 21+ members across 2 teams. We dominate ranked matches and tournaments!";
    }
    
    if (msg.match(/(character|hero|alok|chrono)/)) {
        return "🎭 Best Free Fire Characters:\n\n• Alok - Healing + Speed\n• K - EP Master\n• Skyler - Gloo wall destroyer\n• Homer - Drone damage\n• Moco - Enemy tracking";
    }
    
    if (msg.match(/(weapon|gun|best)/)) {
        return "🔫 Top Weapons:\n\n• AR: M4A1, AK, Groza\n• SMG: MP40, Vector\n• Sniper: AWM, Kar98k\n• Shotgun: M1887, M1014";
    }
    
    if (msg.match(/(tip|trick|help|improve)/)) {
        return "💡 Quick Tips:\n\n• Always aim for headshots\n• Use gloo walls in fights\n• Land smart, not just hot\n• Communicate with your squad\n• Practice in training mode!";
    }
    
    return "I'm having trouble connecting right now 😅 But you can ask me about RAVI ESPORTS, how to join, Free Fire characters, weapons, or tips! Or just say 'Booyah!' 🔥";
}

// ============================================
// SEND MESSAGE
// ============================================
async function sendMessage(message = null) {
    if (chatState.isProcessing) return;
    
    const userMessage = message || chatElements.input.value.trim();
    
    if (!userMessage) return;
    
    // Add user message to chat
    addMessage(userMessage, 'user');
    chatElements.input.value = '';
    chatState.isProcessing = true;
    
    // Show typing indicator
    showTyping();
    
    try {
        // Call Gemini API
        const response = await callGeminiAPI(userMessage);
        
        // Hide typing and show response
        hideTyping();
        addMessage(response, 'bot');
        
    } catch (error) {
        console.error('Error:', error);
        hideTyping();
        addMessage(getFallbackResponse(userMessage), 'bot');
    }
    
    chatState.isProcessing = false;
}

// ============================================
// GREETING MESSAGE
// ============================================
async function sendGreeting() {
    showTyping();
    
    try {
        const greeting = await callGeminiAPI("A new user just opened the chat. Give them a warm, brief welcome to RAVI ESPORTS and ask how you can help them today.");
        hideTyping();
        addMessage(greeting, 'bot');
    } catch (error) {
        hideTyping();
        addMessage("Hey there! 🔥 Welcome to RAVI ESPORTS - Born To Rush, Built To Win!\n\nI'm your AI assistant. Ask me anything about our guild, Free Fire tips, or how to join! 🎮", 'bot');
    }
}

// ============================================
// TOGGLE CHATBOT
// ============================================
function openChatbot() {
    chatState.isOpen = true;
    chatElements.window.classList.add('active');
    chatElements.notification.classList.add('hidden');
    
    // Send greeting if first time
    if (!chatState.hasGreeted) {
        chatState.hasGreeted = true;
        setTimeout(() => {
            sendGreeting();
        }, 500);
    }
    
    // Focus input
    setTimeout(() => chatElements.input.focus(), 300);
}

function closeChatbot() {
    chatState.isOpen = false;
    chatElements.window.classList.remove('active');
}

function toggleChatbot() {
    if (chatState.isOpen) {
        closeChatbot();
    } else {
        openChatbot();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function initChatbot() {
    // Check if elements exist
    if (!chatElements.toggle) {
        console.log('Chatbot elements not found');
        return;
    }
    
    // Toggle button
    chatElements.toggle.addEventListener('click', toggleChatbot);
    
    // Close button
    chatElements.close.addEventListener('click', closeChatbot);
    
    // Send button
    chatElements.send.addEventListener('click', () => sendMessage());
    
    // Enter key
    chatElements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick replies
    chatElements.quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            sendMessage(message);
        });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatState.isOpen) {
            closeChatbot();
        }
    });
    
    console.log('🤖 RAVI ESPORTS AI Chatbot (Gemini) initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}