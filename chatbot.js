/* ============================================
   RAVI ESPORTS CHATBOT
   Born To Rush. Built To Win.
   ============================================ */

// ============================================
// CHATBOT KNOWLEDGE BASE
// ============================================
const chatbotKnowledge = {
    // Guild Information
    guild: {
        name: "RAVI ESPORTS",
        tagline: "Born To Rush. Built To Win.",
        founded: "2022",
        game: "Free Fire",
        teams: ["RAVI ESPORTS", "RE PRO"],
        description: "We are RAVI ESPORTS, a passionate Free Fire guild dedicated to dominating every match. Our squad combines skill, strategy, and teamwork to achieve victory."
    },
    
    // Free Fire Characters
    characters: {
        best_rushers: ["Alok", "K", "Skyler", "Dimitri", "Homer"],
        best_supports: ["Moco", "Clu", "Rafael", "Kapella"],
        best_snipers: ["Laura", "Rafael", "Maro"],
        meta: "Alok, Chrono, K, and Homer are currently in the meta. Alok's healing ability is great for team fights, while K provides EP conversion for survival."
    },
    
    // Free Fire Weapons
    weapons: {
        best_ar: ["M4A1", "AK", "SCAR", "Groza", "Parafal"],
        best_smg: ["MP40", "Vector", "UMP", "P90"],
        best_sniper: ["AWM", "Kar98k", "M82B", "SVD"],
        best_shotgun: ["M1014", "M1887", "SPAS12"],
        tips: "For close range, use MP40 or M1887. For medium range, M4A1 or AK is best. For long range, AWM one-shots with headshot."
    },
    
    // Game Tips
    tips: {
        landing: "Land at edges of hot drops to loot safely, then push. Popular spots: Clock Tower, Bimasakti, Factory.",
        combat: "Always use headphones, pre-fire corners, and use gloo walls during fights. High ground advantage is crucial.",
        ranked: "Play with a consistent squad, communicate callouts, and always have a balanced team composition.",
        sensitivity: "For beginners: General 80-100, Red Dot 70-90, Scope 50-70. Adjust based on your device.",
        movement: "Use prone, crouch spam, and zig-zag movement to avoid headshots. Jump shots help in close combat."
    },
    
    // Responses Database
    responses: {
        // Greetings
        greetings: [
            "Hey! Welcome to RAVI ESPORTS! 🔥 How can I help you?",
            "Hello warrior! 🎮 What would you like to know?",
            "Hi there! Ready to dominate the battleground? 💪",
            "Welcome! I'm the RAVI ESPORTS bot. Ask me anything!"
        ],
        
        // Guild Info
        about_guild: [
            `🔥 **RAVI ESPORTS**\n\n"Born To Rush. Built To Win."\n\nWe are a passionate Free Fire guild with multiple competitive teams. We focus on teamwork, skill development, and winning tournaments!\n\n👥 Teams: RAVI ESPORTS, RE PRO\n🎮 Game: Free Fire\n🏆 Active in tournaments`,
        ],
        
        // How to Join
        join_guild: [
            `🎮 **How to Join RAVI ESPORTS:**\n\n1️⃣ Go to the "Join Us" section on our website\n2️⃣ Fill the application form\n3️⃣ Submit your Free Fire UID\n4️⃣ Wait for our team to review\n5️⃣ Get accepted and join our Discord!\n\n📋 Requirements:\n• Minimum Rank: Platinum\n• K/D Ratio: 2.0+\n• Active on Discord\n• Team player attitude`,
        ],
        
        // Best Characters
        best_characters: [
            `🎭 **Best Free Fire Characters (2024):**\n\n🔥 **Rushers:**\n• Alok - Healing + Speed boost\n• K - EP conversion master\n• Skyler - Destroys gloo walls\n• Homer - Drone damage\n\n🛡️ **Support:**\n• Moco - Enemy tracking\n• Kapella - Healing boost\n\n🎯 **Snipers:**\n• Laura - Accuracy boost\n• Rafael - Silent sniping`,
        ],
        
        // Best Weapons
        best_weapons: [
            `🔫 **Best Weapons in Free Fire:**\n\n**Assault Rifles:**\n• M4A1 - All-rounder\n• AK - High damage\n• Groza - Best AR (airdrop)\n\n**SMGs:**\n• MP40 - Fastest fire rate\n• Vector - Close combat king\n\n**Snipers:**\n• AWM - One-shot headshot\n• Kar98k - Fast bolt action\n\n**Shotguns:**\n• M1887 - Deadly at close range`,
        ],
        
        // Game Tips
        game_tips: [
            `💡 **Pro Tips for Free Fire:**\n\n🎯 **Combat:**\n• Always aim for headshots\n• Use gloo walls in fights\n• Pre-fire corners\n\n🏃 **Movement:**\n• Crouch spam during fights\n• Zig-zag while running\n• Use prone strategically\n\n🎮 **General:**\n• Land smart, not hot\n• Loot fast, move faster\n• Communication is key!`,
        ],
        
        // Sensitivity Settings
        sensitivity: [
            `⚙️ **Recommended Sensitivity Settings:**\n\n**Beginners:**\n• General: 80-100\n• Red Dot: 70-90\n• 2x Scope: 60-80\n• 4x Scope: 50-70\n• AWM: 40-60\n\n**Pro Players:**\n• General: 90-100\n• Red Dot: 80-100\n• Higher for faster flicks\n\n📱 Adjust based on your device and playstyle!`,
        ],
        
        // Landing Spots
        landing_spots: [
            `📍 **Best Landing Spots (Bermuda):**\n\n🔥 **Hot Drops (High Risk/Reward):**\n• Clock Tower\n• Bimasakti Strip\n• Factory\n\n⚡ **Medium Risk:**\n• Mars Electric\n• Pochinok\n• Mill\n\n🛡️ **Safe Drops:**\n• Rim Nam Village\n• Sentosa\n• Cape Town\n\n💡 Land at edges of hot drops for best results!`,
        ],
        
        // Rank Push
        rank_tips: [
            `🏆 **Rank Push Tips:**\n\n1️⃣ Play with a consistent squad\n2️⃣ Communicate using callouts\n3️⃣ Have balanced team roles:\n   • 1 IGL (Leader)\n   • 2 Rushers\n   • 1 Support\n\n4️⃣ Don't hot drop in ranked\n5️⃣ Survival > Kills for points\n6️⃣ Play during low-traffic hours\n7️⃣ Use meta characters`,
        ],
        
        // Default/Unknown
        default: [
            "I'm not sure about that. Try asking about:\n• RAVI ESPORTS guild\n• How to join\n• Best characters\n• Weapon tips\n• Game strategies",
            "Hmm, I don't have info on that. Ask me about Free Fire tips, our guild, or how to join!",
            "I'm still learning! Try asking about characters, weapons, or our guild. 🎮"
        ],
        
        // Fun responses
        booyah: [
            "🎉 BOOYAH! That's the spirit! RAVI ESPORTS always wins! 🔥",
            "BOOYAH! 🏆 Born To Rush. Built To Win!",
            "🔥 BOOYAH! Another victory for the squad!"
        ],
        
        thanks: [
            "You're welcome! Good luck on the battleground! 🎮",
            "Anytime! May your headshots be accurate! 🎯",
            "Happy to help! See you at the top! 🏆"
        ]
    }
};

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
// CHATBOT STATE
// ============================================
let chatState = {
    isOpen: false,
    hasGreeted: false
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function formatMessage(text) {
    // Convert **text** to bold
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
// MESSAGE PROCESSING
// ============================================
function processMessage(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    // Greetings
    if (msg.match(/^(hi|hello|hey|hii|hiii|hola|yo|sup)/)) {
        return getRandomResponse(chatbotKnowledge.responses.greetings);
    }
    
    // Thanks
    if (msg.match(/(thank|thanks|thx|thnx|ty|tysm)/)) {
        return getRandomResponse(chatbotKnowledge.responses.thanks);
    }
    
    // Booyah
    if (msg.match(/booyah/)) {
        return getRandomResponse(chatbotKnowledge.responses.booyah);
    }
    
    // About Guild
    if (msg.match(/(about|what is|tell me about|who is|info).*(ravi|guild|esports|clan|team)/)) {
        return getRandomResponse(chatbotKnowledge.responses.about_guild);
    }
    
    // How to Join
    if (msg.match(/(how|want|can i|where).*(join|apply|register|signup|sign up|member)/)) {
        return getRandomResponse(chatbotKnowledge.responses.join_guild);
    }
    
    // Best Characters
    if (msg.match(/(best|top|good|meta|op).*(character|hero|ability|skill)/)) {
        return getRandomResponse(chatbotKnowledge.responses.best_characters);
    }
    
    // Best Weapons
    if (msg.match(/(best|top|good|meta|op).*(weapon|gun|rifle|smg|sniper|ar|shotgun)/)) {
        return getRandomResponse(chatbotKnowledge.responses.best_weapons);
    }
    
    // Sensitivity
    if (msg.match(/(sensitivity|sens|setting|control|dpi)/)) {
        return getRandomResponse(chatbotKnowledge.responses.sensitivity);
    }
    
    // Landing Spots
    if (msg.match(/(land|drop|where to land|spot|location|map)/)) {
        return getRandomResponse(chatbotKnowledge.responses.landing_spots);
    }
    
    // Rank Tips
    if (msg.match(/(rank|push|grandmaster|heroic|tier|ranked)/)) {
        return getRandomResponse(chatbotKnowledge.responses.rank_tips);
    }
    
    // Game Tips
    if (msg.match(/(tip|trick|help|how to|guide|strategy|improve|pro)/)) {
        return getRandomResponse(chatbotKnowledge.responses.game_tips);
    }
    
    // Specific character questions
    if (msg.match(/(alok|chrono|k character|skyler|moco|dimitri|homer)/)) {
        return getRandomResponse(chatbotKnowledge.responses.best_characters);
    }
    
    // Default response
    return getRandomResponse(chatbotKnowledge.responses.default);
}

// ============================================
// SEND MESSAGE
// ============================================
function sendMessage(message = null) {
    const userMessage = message || chatElements.input.value.trim();
    
    if (!userMessage) return;
    
    // Add user message
    addMessage(userMessage, 'user');
    chatElements.input.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Process and respond after delay
    setTimeout(() => {
        hideTyping();
        const response = processMessage(userMessage);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 500);
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
            addMessage(getRandomResponse(chatbotKnowledge.responses.greetings), 'bot');
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
    // Toggle button
    chatElements.toggle.addEventListener('click', toggleChatbot);
    
    // Close button
    chatElements.close.addEventListener('click', closeChatbot);
    
    // Send button
    chatElements.send.addEventListener('click', () => sendMessage());
    
    // Enter key
    chatElements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Quick replies
    chatElements.quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            sendMessage(message);
        });
    });
    
    console.log('🤖 RAVI ESPORTS Chatbot initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}