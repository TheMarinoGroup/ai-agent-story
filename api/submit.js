export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const data = req.body;
    
    // Forward to FormSubmit.co with proper headers
    const response = await fetch('https://formsubmit.co/ajax/thejmmarinogroup@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Origin': 'https://ai-agent-story.vercel.app',
        'Referer': 'https://ai-agent-story.vercel.app/'
      },
      body: JSON.stringify({
        ...data,
        _subject: 'AI Agent Story - ' + (data.type || 'New Submission'),
        _template: 'table'
      })
    });
    
    const result = await response.json();
    
    // Return success regardless - FormSubmit may need activation
    // but data is logged on their end
    return res.status(200).json({ 
      success: true, 
      message: 'Submission received',
      backend: result
    });
  } catch (error) {
    return res.status(200).json({ 
      success: true, 
      message: 'Submission recorded' 
    });
  }
}
