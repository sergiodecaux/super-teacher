export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid API key format' });
        }

        const apiKey = authHeader.replace('Bearer ', '');
        if (!apiKey.startsWith('gsk_')) {
            return res.status(401).json({ error: 'Invalid Groq API key' });
        }

        console.log('📤 Sending request to Groq...');
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('❌ Groq error:', data);
            return res.status(response.status).json(data);
        }

        console.log('✅ Groq response received');
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ Proxy error:', error);
        return res.status(500).json({ 
            error: { 
                message: error.message || 'Internal server error' 
            } 
        });
    }
}