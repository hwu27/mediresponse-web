module.exports = (req, res) => {
    const apiKey = process.env.AWS_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'API key not found' });
      return;
    }
    res.status(200).json({ apiKey });
  };